import { describe, expect, it, vi } from 'vitest';
import { EnglishService } from '../src/modules/english/english.service';
import { UserRole } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sample = {
  id: 'lesson-1', published: true, topic: { id: 'topic-1', title: 'Daily life' },
  title: 'At school', summary: 'A short conversation', level: 'A1', kind: 'LISTENING',
  body: null, audioUrl: 'https://example.org/audio.mp3', transcript: [], sourceAttribution: 'Original',
  exercises: [{ id: 'q1', kind: 'SINGLE_CHOICE', prompt: 'Where?', options: ['School', 'Home'],
    correctAnswer: 'School', acceptedAnswers: [], explanation: 'They say school.', segmentId: null, orderIndex: 0 }]
};

describe('English lessons', () => {
  it('keeps the answer on the server until submission', async () => {
    const prisma: any = { englishLesson: { findFirst: vi.fn().mockResolvedValue(sample) } };
    const service = new EnglishService(prisma);
    const data = await service.lesson('lesson-1');
    expect(data.exercises[0]).toEqual({ id: 'q1', kind: 'SINGLE_CHOICE', prompt: 'Where?', options: ['School', 'Home'], segmentId: null });
    expect(JSON.stringify(data)).not.toContain('correctAnswer');
  });

  it('grades answers and persists progress for the authenticated learner', async () => {
    const upsert = vi.fn().mockResolvedValue({});
    const prisma: any = { englishLesson: { findFirst: vi.fn().mockResolvedValue(sample) }, englishLessonProgress: { upsert } };
    const service = new EnglishService(prisma);
    const result = await service.submit('lesson-1', 'student-1', { answers: { q1: 'School' } });
    expect(result.correctCount).toBe(1);
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { lessonId_studentId: { lessonId: 'lesson-1', studentId: 'student-1' } }
    }));
  });

  it('rejects broken imports before writing anything', async () => {
    const transaction = vi.fn();
    const service = new EnglishService({ $transaction: transaction } as any);
    await expect(service.importBatch({ topics: [{ id: 'topic-1', title: 'Daily life' }], lessons: [{
      id: 'lesson-1', topicId: 'topic-1', title: 'At school', level: 'A1', kind: 'LISTENING', exercises: []
    }] })).rejects.toThrow('audioUrl');
    expect(transaction).not.toHaveBeenCalled();
  });

  it('keeps author imports in draft even when the file requests publication', async () => {
    const lessonUpsert = vi.fn().mockResolvedValue({});
    const prisma: any = {
      $transaction: (callback: any) => callback({
        englishTopic: { upsert: vi.fn() },
        englishLesson: { upsert: lessonUpsert },
        englishExercise: { deleteMany: vi.fn(), createMany: vi.fn() }
      })
    };
    const service = new EnglishService(prisma);
    await service.importBatch({
      topics: [{ id: 'topic-1', title: 'Daily life' }],
      lessons: [{ id: 'lesson-1', topicId: 'topic-1', title: 'At school', level: 'A1',
        kind: 'READING', published: true, exercises: [] }]
    }, UserRole.CONTENT_AUTHOR);
    expect(lessonUpsert).toHaveBeenCalledWith(expect.objectContaining({ create: expect.objectContaining({ published: false }) }));
  });

  it('hides placement answers and stores a starting level after grading', async () => {
    const questions = Array.from({ length: 6 }, (_, index) => ({
      id: `p${index}`, prompt: `Question ${index}`, options: ['Yes', 'No'], correctAnswer: 'Yes',
      lesson: { level: index < 2 ? 'A1' : index < 4 ? 'A2' : 'B1', kind: 'GRAMMAR' }
    }));
    const upsert = vi.fn().mockImplementation(({ create }) => create);
    const service = new EnglishService({
      englishExercise: { findMany: vi.fn().mockResolvedValue(questions) },
      englishPlacementResult: { upsert }
    } as any);
    const publicQuestions = await service.placementQuestions();
    expect(JSON.stringify(publicQuestions)).not.toContain('correctAnswer');
    const result = await service.submitPlacement('student-1', { answers: Object.fromEntries(questions.map(item => [item.id, 'Yes'])) });
    expect(result).toEqual({ correctCount: 6, totalCount: 6, suggestedLevel: 'B1', assessedLevels: ['A1', 'A2', 'B1'] });
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { studentId: 'student-1' } }));
  });

  it('assesses only available levels when A2 content has not arrived', async () => {
    const questions = Array.from({ length: 8 }, (_, index) => ({
      id: `s${index}`, prompt: `Question ${index}`, options: ['Yes', 'No'], correctAnswer: 'Yes',
      lesson: { level: index < 4 ? 'A1' : 'B1', kind: 'READING' }
    }));
    const service = new EnglishService({
      englishExercise: { findMany: vi.fn().mockResolvedValue(questions) },
      englishPlacementResult: { upsert: vi.fn().mockImplementation(({ create }) => create) }
    } as any);
    const answers = Object.fromEntries(questions.map(item => [item.id, item.lesson.level === 'A1' ? 'Yes' : 'No']));
    const result = await service.submitPlacement('student-1', { answers });
    expect(result.assessedLevels).toEqual(['A1', 'B1']);
    expect(result.suggestedLevel).toBe('A1');
  });

  it('accepts the checked batch_001 bundle with real lesson and audio paths', async () => {
    const batch = JSON.parse(readFileSync(resolve('../../content/english/batch_001.json'), 'utf8'));
    const lessonUpsert = vi.fn();
    const exerciseCreateMany = vi.fn();
    const service = new EnglishService({
      $transaction: (callback: any) => callback({
        englishTopic: { upsert: vi.fn() },
        englishLesson: { upsert: lessonUpsert },
        englishExercise: { deleteMany: vi.fn(), createMany: exerciseCreateMany }
      })
    } as any);
    expect(await service.importBatch(batch, UserRole.ADMIN)).toEqual({ topics: 3, lessons: 5, exercises: 19 });
    expect(lessonUpsert).toHaveBeenCalledTimes(5);
    expect(exerciseCreateMany).toHaveBeenCalledTimes(5);
    expect(batch.lessons.filter((item: any) => item.kind === 'LISTENING')).toHaveLength(2);
    expect(batch.lessons.every((item: any) => item.published)).toBe(true);
  });

  it('rejects review when author attempts to self-review with MAKER_CHECKER_VIOLATION', async () => {
    const prisma: any = {
      englishLesson: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'lesson-mc-1',
          title: 'Author lesson',
          authorId: 'author-user-123',
          published: false
        })
      }
    };
    const service = new EnglishService(prisma);
    await expect(
      service.reviewLesson('lesson-mc-1', 'author-user-123', { published: true })
    ).rejects.toThrow('Quy tắc Maker-Checker');
  });

  it('allows independent reviewer/admin to review and publish lesson, writing ENGLISH_LESSON_REVIEWED audit log', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'lesson-mc-2', published: true, reviewerId: 'reviewer-user-456' });
    const auditCreate = vi.fn().mockResolvedValue({});
    const prisma: any = {
      englishLesson: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'lesson-mc-2',
          title: 'Draft lesson',
          authorId: 'author-user-123',
          published: false
        }),
        update
      },
      auditLog: {
        create: auditCreate
      }
    };
    const service = new EnglishService(prisma);
    const result = await service.reviewLesson('lesson-mc-2', 'reviewer-user-456', { published: true });
    expect(result.message).toContain('xuất bản bài học thành công');
    expect(update).toHaveBeenCalledWith({
      where: { id: 'lesson-mc-2' },
      data: { published: true, reviewerId: 'reviewer-user-456' }
    });
    expect(auditCreate).toHaveBeenCalledWith({
      data: {
        actorUserId: 'reviewer-user-456',
        action: 'ENGLISH_LESSON_REVIEWED',
        targetEntity: 'EnglishLesson',
        targetEntityId: 'lesson-mc-2',
        metadata: {
          previousPublished: false,
          newPublished: true,
          note: null
        }
      }
    });
  });

  it('allows independent reviewer/admin to reject lesson, writing ENGLISH_LESSON_REVIEWED audit log', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'lesson-mc-3', published: false, reviewerId: 'admin-user-789' });
    const auditCreate = vi.fn().mockResolvedValue({});
    const prisma: any = {
      englishLesson: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'lesson-mc-3',
          title: 'Published lesson',
          authorId: 'author-user-123',
          published: true
        }),
        update
      },
      auditLog: {
        create: auditCreate
      }
    };
    const service = new EnglishService(prisma);
    const result = await service.reviewLesson('lesson-mc-3', 'admin-user-789', { published: false, note: 'Need revision' });
    expect(result.message).toContain('bản nháp');
    expect(update).toHaveBeenCalledWith({
      where: { id: 'lesson-mc-3' },
      data: { published: false, reviewerId: 'admin-user-789' }
    });
    expect(auditCreate).toHaveBeenCalledWith({
      data: {
        actorUserId: 'admin-user-789',
        action: 'ENGLISH_LESSON_REVIEWED',
        targetEntity: 'EnglishLesson',
        targetEntityId: 'lesson-mc-3',
        metadata: {
          previousPublished: true,
          newPublished: false,
          note: 'Need revision'
        }
      }
    });
  });
});
