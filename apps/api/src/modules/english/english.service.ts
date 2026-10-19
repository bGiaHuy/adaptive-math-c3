import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EnglishExerciseKind, EnglishLessonKind, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type RecordValue = Record<string, unknown>;
const object = (value: unknown): value is RecordValue => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const required = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) throw new BadRequestException(`Thiếu ${field}.`);
  return value.trim();
};
const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');

@Injectable()
export class EnglishService {
  constructor(private readonly prisma: PrismaService) {}

  async topics() {
    return this.prisma.englishTopic.findMany({
      where: { lessons: { some: { published: true } } },
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: {
          where: { published: true }, orderBy: { orderIndex: 'asc' },
          select: { id: true, title: true, summary: true, level: true, kind: true, audioUrl: true }
        }
      }
    });
  }

  async lesson(id: string) {
    const lesson = await this.prisma.englishLesson.findFirst({
      where: { id, published: true },
      include: { topic: true, exercises: { orderBy: { orderIndex: 'asc' } } }
    });
    if (!lesson) throw new NotFoundException('Không tìm thấy bài học.');
    return {
      id: lesson.id, topic: { id: lesson.topic.id, title: lesson.topic.title },
      title: lesson.title, summary: lesson.summary, level: lesson.level,
      kind: lesson.kind, body: lesson.body, audioUrl: lesson.audioUrl,
      transcript: lesson.transcript, sourceAttribution: lesson.sourceAttribution,
      exercises: lesson.exercises.map(({ id, kind, prompt, options, segmentId }) => ({
        id, kind, prompt, options, segmentId
      }))
    };
  }

  async submit(id: string, studentId: string, body: unknown) {
    if (!object(body) || !object(body.answers)) throw new BadRequestException('Câu trả lời không hợp lệ.');
    const lesson = await this.prisma.englishLesson.findFirst({
      where: { id, published: true }, include: { exercises: { orderBy: { orderIndex: 'asc' } } }
    });
    if (!lesson) throw new NotFoundException('Không tìm thấy bài học.');
    if (!lesson.exercises.length) throw new BadRequestException('Bài học chưa có bài tập.');
    const answerMap = body.answers as RecordValue;
    if (Object.keys(answerMap).some(key => !lesson.exercises.some(exercise => exercise.id === key))) {
      throw new BadRequestException('Có câu trả lời không thuộc bài học.');
    }
    const results = lesson.exercises.map(exercise => {
      const answer = typeof answerMap[exercise.id] === 'string' ? answerMap[exercise.id] as string : '';
      const accepted = Array.isArray(exercise.acceptedAnswers)
        ? exercise.acceptedAnswers.filter((entry): entry is string => typeof entry === 'string')
        : [];
      const correct = [exercise.correctAnswer, ...accepted].some(value => normalize(value) === normalize(answer));
      return { id: exercise.id, correct, correctAnswer: exercise.correctAnswer, explanation: exercise.explanation };
    });
    const correctCount = results.filter(result => result.correct).length;
    await this.prisma.englishLessonProgress.upsert({
      where: { lessonId_studentId: { lessonId: id, studentId } },
      create: { lessonId: id, studentId, answers: answerMap as Prisma.InputJsonValue, correctCount, totalCount: results.length },
      update: { answers: answerMap as Prisma.InputJsonValue, correctCount, totalCount: results.length, completedAt: new Date() }
    });
    return { correctCount, totalCount: results.length, results };
  }

  async progress(studentId: string) {
    return this.prisma.englishLessonProgress.findMany({
      where: { studentId }, orderBy: { completedAt: 'desc' },
      select: { lessonId: true, correctCount: true, totalCount: true, completedAt: true }
    });
  }

  private async placementPool() {
    const questions = await this.prisma.englishExercise.findMany({
      where: { kind: EnglishExerciseKind.SINGLE_CHOICE, lesson: { published: true } },
      include: { lesson: { select: { level: true, kind: true } } },
      orderBy: { id: 'asc' }
    });
    const byLevel = ['A1', 'A2', 'B1']
      .map(level => questions.filter(item => item.lesson.level === level))
      .filter(group => group.length >= 2);
    if (byLevel.length < 2 || byLevel.reduce((total, group) => total + group.length, 0) < 6) {
      throw new BadRequestException('Cần ít nhất 6 câu trắc nghiệm ở 2 mức bài học để bắt đầu.');
    }
    const selected = [];
    while (selected.length < 12 && byLevel.some(group => group.length)) {
      for (const group of byLevel) {
        const question = group.shift();
        if (question && selected.length < 12) selected.push(question);
      }
    }
    return selected;
  }

  async placementQuestions() {
    const questions = await this.placementPool();
    return questions.map(({ id, prompt, options, lesson }) => ({ id, prompt, options, level: lesson.level, skill: lesson.kind }));
  }

  async placementResult(studentId: string) {
    return this.prisma.englishPlacementResult.findUnique({ where: { studentId } });
  }

  async submitPlacement(studentId: string, body: unknown) {
    if (!object(body) || !object(body.answers)) throw new BadRequestException('Câu trả lời không hợp lệ.');
    const questions = await this.placementPool();
    const answers = body.answers as RecordValue;
    if (Object.keys(answers).some(id => !questions.some(question => question.id === id))) {
      throw new BadRequestException('Có câu trả lời không thuộc bài kiểm tra.');
    }
    const correctCount = questions.filter(question =>
      typeof answers[question.id] === 'string' && normalize(answers[question.id] as string) === normalize(question.correctAnswer)
    ).length;
    const assessedLevels = ['A1', 'A2', 'B1'].filter(level => questions.some(question => question.lesson.level === level));
    let suggestedLevel = assessedLevels[0];
    for (const level of assessedLevels) {
      const atLevel = questions.filter(question => question.lesson.level === level);
      const correctAtLevel = atLevel.filter(question =>
        typeof answers[question.id] === 'string' && normalize(answers[question.id] as string) === normalize(question.correctAnswer)
      ).length;
      if (correctAtLevel / atLevel.length < 0.6) break;
      suggestedLevel = level;
    }
    const result = await this.prisma.englishPlacementResult.upsert({
      where: { studentId },
      create: { studentId, correctCount, totalCount: questions.length, suggestedLevel },
      update: { correctCount, totalCount: questions.length, suggestedLevel, completedAt: new Date() }
    });
    return { correctCount: result.correctCount, totalCount: result.totalCount,
      suggestedLevel: result.suggestedLevel, assessedLevels };
  }

  async importBatch(body: unknown, role: UserRole = UserRole.ADMIN, authorId?: string) {
    if (!object(body) || !Array.isArray(body.topics) || !Array.isArray(body.lessons)) {
      throw new BadRequestException('Cần topics và lessons dạng mảng.');
    }
    const topics = body.topics;
    const lessons = body.lessons;
    if (topics.length > 100 || lessons.length > 500) throw new BadRequestException('Gói nhập quá lớn.');
    const topicIds = new Set<string>();
    const lessonIds = new Set<string>();
    const exerciseIds = new Set<string>();
    const parsedTopics = topics.map((item, index) => {
      if (!object(item)) throw new BadRequestException('Chủ đề không hợp lệ.');
      const id = required(item.id, 'topic.id');
      if (topicIds.has(id)) throw new BadRequestException(`Trùng chủ đề ${id}.`);
      topicIds.add(id);
      return { id, title: required(item.title, 'topic.title'), description: typeof item.description === 'string' ? item.description : null, orderIndex: index };
    });
    const parsedLessons = lessons.map((item, index) => {
      if (!object(item)) throw new BadRequestException('Bài học không hợp lệ.');
      const id = required(item.id, 'lesson.id');
      if (lessonIds.has(id)) throw new BadRequestException(`Trùng bài học ${id}.`);
      lessonIds.add(id);
      const topicId = required(item.topicId, 'lesson.topicId');
      if (!topicIds.has(topicId)) throw new BadRequestException(`Không có chủ đề ${topicId} trong gói.`);
      const level = required(item.level, 'lesson.level');
      if (!['A1', 'A2', 'B1'].includes(level)) throw new BadRequestException('Trình độ phải là A1, A2 hoặc B1.');
      const kind = required(item.kind, 'lesson.kind') as EnglishLessonKind;
      if (!Object.values(EnglishLessonKind).includes(kind)) throw new BadRequestException('Loại bài học không hợp lệ.');
      const audioUrl = typeof item.audioUrl === 'string' && item.audioUrl.trim() ? item.audioUrl.trim() : null;
      if (audioUrl && !/^https:\/\//.test(audioUrl) && !audioUrl.startsWith('/media/')) throw new BadRequestException('audioUrl phải dùng HTTPS hoặc /media/.');
      if (kind === 'LISTENING' && !audioUrl) throw new BadRequestException(`Bài nghe ${id} thiếu audioUrl.`);
      const transcript = Array.isArray(item.transcript) ? item.transcript : [];
      for (const segment of transcript) {
        if (!object(segment) || typeof segment.textEn !== 'string' ||
          !Number.isFinite(segment.startMs) || !Number.isFinite(segment.endMs) ||
          Number(segment.startMs) < 0 || Number(segment.endMs) <= Number(segment.startMs)) {
          throw new BadRequestException(`Transcript của ${id} không hợp lệ.`);
        }
      }
      if (!Array.isArray(item.exercises)) throw new BadRequestException(`Bài ${id} thiếu exercises.`);
      const exercises = item.exercises.map((raw, exerciseIndex) => {
        if (!object(raw)) throw new BadRequestException('Bài tập không hợp lệ.');
        const exerciseId = required(raw.id, 'exercise.id');
        if (exerciseIds.has(exerciseId)) throw new BadRequestException(`Trùng bài tập ${exerciseId}.`);
        exerciseIds.add(exerciseId);
        const exerciseKind = required(raw.kind, 'exercise.kind') as EnglishExerciseKind;
        if (!Object.values(EnglishExerciseKind).includes(exerciseKind)) throw new BadRequestException('Loại bài tập không hợp lệ.');
        const options = Array.isArray(raw.options) ? raw.options : [];
        const correctAnswer = required(raw.correctAnswer, 'exercise.correctAnswer');
        if (exerciseKind === 'SINGLE_CHOICE' && (!options.every(option => typeof option === 'string') || !options.includes(correctAnswer))) {
          throw new BadRequestException(`Đáp án của ${exerciseId} không nằm trong lựa chọn.`);
        }
        return { id: exerciseId, kind: exerciseKind, prompt: required(raw.prompt, 'exercise.prompt'),
          options: options as Prisma.InputJsonValue, correctAnswer,
          acceptedAnswers: (Array.isArray(raw.acceptedAnswers) ? raw.acceptedAnswers : []) as Prisma.InputJsonValue,
          explanation: typeof raw.explanation === 'string' ? raw.explanation : null,
          segmentId: typeof raw.segmentId === 'string' ? raw.segmentId : null, orderIndex: exerciseIndex };
      });
      return { id, topicId, title: required(item.title, 'lesson.title'),
        summary: typeof item.summary === 'string' ? item.summary : null, level, kind,
        body: typeof item.body === 'string' ? item.body : null, audioUrl,
        transcript: transcript as Prisma.InputJsonValue,
        sourceAttribution: typeof item.sourceAttribution === 'string' ? item.sourceAttribution : null,
        published: false, // Maker-Checker: Always draft upon import until reviewed by another admin/checker
        authorId: authorId || null,
        orderIndex: index,
        exercises
      };
    });
    await this.prisma.$transaction(async tx => {
      for (const topic of parsedTopics) await tx.englishTopic.upsert({ where: { id: topic.id }, create: topic, update: topic });
      for (const lesson of parsedLessons) {
        const { exercises, ...data } = lesson;
        await tx.englishLesson.upsert({ where: { id: lesson.id }, create: data, update: data });
        await tx.englishExercise.deleteMany({ where: { lessonId: lesson.id } });
        if (exercises.length) await tx.englishExercise.createMany({ data: exercises.map(exercise => ({ ...exercise, lessonId: lesson.id })) });
      }
    }, { timeout: 60000, maxWait: 15000 });
    return { topics: parsedTopics.length, lessons: parsedLessons.length, exercises: exerciseIds.size };
  }

  async reviewLesson(lessonId: string, reviewerId: string, body: { published: boolean; note?: string }) {
    const lesson = await this.prisma.englishLesson.findUnique({
      where: { id: lessonId }
    });
    if (!lesson) {
      throw new NotFoundException({
        code: 'LESSON_NOT_FOUND',
        message: 'Không tìm thấy bài học.'
      });
    }

    // STRICT MAKER-CHECKER ENFORCEMENT: Author cannot review or publish own lesson
    if (lesson.authorId && lesson.authorId === reviewerId) {
      throw new ForbiddenException({
        code: 'MAKER_CHECKER_VIOLATION',
        message: 'Quy tắc Maker-Checker: Tác giả bài học không được phép tự thẩm định hoặc xuất bản bài học của chính mình.'
      });
    }

    const isPublishing = body.published !== undefined ? Boolean(body.published) : Boolean((body as any).approve);

    const updated = await this.prisma.englishLesson.update({
      where: { id: lessonId },
      data: {
        published: isPublishing,
        reviewerId
      }
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: reviewerId,
        action: 'ENGLISH_LESSON_REVIEWED',
        targetEntity: 'EnglishLesson',
        targetEntityId: lesson.id,
        metadata: {
          previousPublished: lesson.published,
          newPublished: isPublishing,
          note: body.note || (body as any).rejectionReason || null
        }
      }
    });

    return {
      message: isPublishing ? 'Đã duyệt và xuất bản bài học thành công.' : 'Đã chuyển bài học về trạng thái bản nháp.',
      lesson: updated
    };
  }

  async adminLessons(status?: string) {
    const normalized = (status || '').toLowerCase();
    const where = normalized === 'published' ? { published: true } : (normalized === 'draft' || normalized === 'unpublished') ? { published: false } : {};
    const lessons = await this.prisma.englishLesson.findMany({
      where,
      orderBy: [{ topicId: 'asc' }, { orderIndex: 'asc' }],
      include: {
        topic: { select: { id: true, title: true } },
        author: { select: { id: true, fullName: true, username: true } },
        reviewer: { select: { id: true, fullName: true, username: true } },
        _count: { select: { exercises: true } }
      }
    });
    return { lessons };
  }

  private async ownedClassroom(teacherId: string, classId: string) {
    const classroom = await this.prisma.classroom.findFirst({ where: { id: classId, teacherId, isActive: true } });
    if (!classroom) throw new NotFoundException('Không tìm thấy lớp học của giáo viên.');
    return classroom;
  }

  async classAssignments(teacherId: string, classId: string) {
    const classroom = await this.ownedClassroom(teacherId, classId);
    const [memberships, assignments] = await Promise.all([
      this.prisma.classroomMembership.findMany({ where: { classId, status: 'ACTIVE' }, select: { studentId: true } }),
      this.prisma.englishClassAssignment.findMany({
        where: { classId }, orderBy: { createdAt: 'desc' },
        include: { lesson: { select: { id: true, title: true, level: true, kind: true, published: true } } }
      })
    ]);
    const studentIds = memberships.map(item => item.studentId);
    const progress = studentIds.length ? await this.prisma.englishLessonProgress.findMany({
      where: { studentId: { in: studentIds }, lessonId: { in: assignments.map(item => item.lessonId) } },
      select: { lessonId: true }
    }) : [];
    return { classId, className: classroom.name, studentCount: studentIds.length,
      assignments: assignments.map(item => ({ id: item.id, lesson: item.lesson, createdAt: item.createdAt,
        completedCount: progress.filter(entry => entry.lessonId === item.lessonId).length })) };
  }

  async assignLesson(teacherId: string, classId: string, body: unknown) {
    await this.ownedClassroom(teacherId, classId);
    if (!object(body)) throw new BadRequestException('Cần chọn bài học.');
    const lessonId = required(body.lessonId, 'lessonId');
    const lesson = await this.prisma.englishLesson.findFirst({ where: { id: lessonId, published: true } });
    if (!lesson) throw new NotFoundException('Bài học chưa được xuất bản.');
    return this.prisma.englishClassAssignment.upsert({
      where: { classId_lessonId: { classId, lessonId } },
      create: { classId, lessonId }, update: {}
    });
  }

  async removeAssignment(teacherId: string, classId: string, assignmentId: string) {
    await this.ownedClassroom(teacherId, classId);
    const result = await this.prisma.englishClassAssignment.deleteMany({ where: { id: assignmentId, classId } });
    if (!result.count) throw new NotFoundException('Không tìm thấy bài được giao.');
    return { removed: true };
  }

  async myAssignments(studentId: string) {
    const memberships = await this.prisma.classroomMembership.findMany({
      where: { studentId, status: 'ACTIVE', classroom: { isActive: true } },
      include: { classroom: { include: { englishAssignments: {
        orderBy: { createdAt: 'desc' },
        include: { lesson: { select: { id: true, title: true, summary: true, level: true, kind: true, published: true } } }
      } } } }
    });
    const progress = await this.prisma.englishLessonProgress.findMany({ where: { studentId }, select: { lessonId: true } });
    const completed = new Set(progress.map(item => item.lessonId));
    return memberships.flatMap(membership => membership.classroom.englishAssignments
      .filter(item => item.lesson.published)
      .map(item => ({ id: item.id, classId: membership.classId, className: membership.classroom.name,
        lesson: item.lesson, createdAt: item.createdAt, completed: completed.has(item.lessonId) })));
  }
}
