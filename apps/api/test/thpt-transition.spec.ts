import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { validate } from 'class-validator';
import { CurriculumService } from '../src/modules/curriculum/curriculum.service';
import { THPT_CURRICULUM } from '../src/modules/curriculum/thpt-catalog';
import { AssignmentService } from '../src/modules/assignment/assignment.service';
import { AdminService } from '../src/modules/admin/admin.service';
import { DiagnosticService } from '../src/modules/diagnostic/diagnostic.service';
import { MathPracticeService } from '../src/modules/student/math-practice.service';
import { UpdateOnboardingDto } from '../src/modules/student/dto/update-onboarding.dto';
import { CreateClassroomDto } from '../src/modules/classroom/dto/create-classroom.dto';
import { EXAM_QUESTION_COUNTS } from '../src/modules/diagnostic/diagnostic-blueprint';

describe('THPT transition without changing bank records or assignment snapshots', () => {
  it('exposes only grades 10–12 and a unique catalogue, never synthetic database IDs', async () => {
    const db = { skillNode: { findMany: vi.fn() } };
    const service = new CurriculumService(db as any);
    expect(service.getGrades().map(g => g.id)).toEqual([10, 11, 12]);
    expect(THPT_CURRICULUM.map(g => g.chapters.length)).toEqual([9, 9, 6]);
    const ids = THPT_CURRICULUM.flatMap(g => g.chapters.flatMap(c => [c.id, ...c.topics.map(t => t.id)]));
    expect(new Set(ids).size).toBe(ids.length);
    for (const grade of [10, 11, 12]) {
      const result = await service.getSkillsByGrade(grade);
      expect(result.bankStatus).toBe('PREPARING');
      expect(result.chapters.length).toBeGreaterThan(0);
      expect(result.chapters.flatMap(c => c.skills).every(s => !s.persisted && s.questionsCount === 0)).toBe(true);
    }
    expect((await service.getSkillsByGrade(9)).chapters).toEqual([]);
    expect(db.skillNode.findMany).not.toHaveBeenCalled();
  });
  it('blocks legacy bank distribution before any database operation', async () => {
    const db = new Proxy({}, { get() { throw new Error('Unexpected database access'); } });
    expect(await new AdminService(db as any).getQuestions()).toEqual([]);
    await expect(new AssignmentService(db as any).randomPreview('teacher', { skillIds: ['old'] })).rejects.toThrow('THPT');
    await expect(new DiagnosticService(db as any).startAttempt('student')).rejects.toThrow('THPT');
    await expect(new MathPracticeService(db as any).start('student', 'old')).rejects.toThrow('THPT');
  });
  it('accepts THPT profile/class grades and rejects THCS grades', async () => {
    for (const grade of [10, 11, 12]) {
      expect(await validate(Object.assign(new UpdateOnboardingDto(), { grade }))).toEqual([]);
      expect(await validate(Object.assign(new CreateClassroomDto(), { name: 'Toán', grade }))).toEqual([]);
    }
    for (const grade of [6, 9, 13]) {
      expect((await validate(Object.assign(new UpdateOnboardingDto(), { grade }))).length).toBeGreaterThan(0);
      expect((await validate(Object.assign(new CreateClassroomDto(), { name: 'Toán', grade }))).length).toBeGreaterThan(0);
    }
  });
  it('keeps the existing exam type counts', () => {
    expect(EXAM_QUESTION_COUNTS).toEqual({ SINGLE_CHOICE: 12, TRUE_FALSE: 4, SHORT_ANSWER: 6 });
  });
});
