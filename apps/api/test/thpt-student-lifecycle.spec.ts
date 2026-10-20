import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from '../src/modules/auth/auth.service';
import { DiagnosticService } from '../src/modules/diagnostic/diagnostic.service';
import { academicYear, promotedGrade, graduationState } from '../src/common/domain/academic-year';
import { selectThptDiagnostic, THPT_DIAGNOSTIC_MATRICES } from '../src/modules/question/diagnostic-blueprint';

describe('THPT school-year lifecycle', () => {
  it('persists promotion exactly once and preserves the original anchor and other profile fields', async () => {
    let profile: any = { grade: 10, targetGoal: 'Củng cố', dailyMinutes: 60, examDate: '2020-06-01' };
    const year = academicYear() - 1;
    const tx: any = { $queryRaw: vi.fn(), auditLog: {
      findFirst: vi.fn().mockResolvedValue({ metadata: { grade: 10, academicYear: year } }), create: vi.fn()
    }, studentProfile: {
      findUnique: vi.fn(async () => profile), update: vi.fn(async ({ data }) => (profile = { ...profile, ...data }))
    } };
    const service = new AuthService({ $transaction: (fn: any) => fn(tx) } as any);
    const user = { id: 'student', role: 'STUDENT', studentProfile: profile };
    await (service as any).syncSchoolYear(user);
    await (service as any).syncSchoolYear(user);
    expect(profile).toEqual({ grade: 11, examDate: null, targetGoal: 'Củng cố', dailyMinutes: 60 });
    expect(tx.studentProfile.update).toHaveBeenCalledTimes(1);
    expect(tx.auditLog.create).toHaveBeenCalledTimes(1);
    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
  });
  it('promotes at midnight September 5 in Vietnam, once per year, catching up absences', () => {
    expect(academicYear(new Date('2027-09-04T16:59:59Z'))).toBe(2026);
    expect(academicYear(new Date('2027-09-04T17:00:00Z'))).toBe(2027);
    expect(promotedGrade(10, 2026, new Date('2027-09-04T16:59:59Z'))).toBe(10);
    expect(promotedGrade(10, 2026, new Date('2027-09-04T17:00:00Z'))).toBe(11);
    expect(promotedGrade(10, 2026, new Date('2030-10-01'))).toBe(12);
    expect(promotedGrade(12, 2026, new Date('2030-10-01'))).toBe(12);
  });
  it('waits for a verified annual schedule and never invents next year dates', () => {
    expect(graduationState(12, 2026, {}, new Date('2027-08-01')).status).toBe('AWAITING_OFFICIAL_SCHEDULE');
    expect(graduationState(12, 2026, { '2027': '2027-06-12' }, new Date('2027-06-11T16:59:59Z')).status).toBe('STUDYING');
    expect(graduationState(12, 2026, { '2027': '2027-06-13' }, new Date('2027-06-12T17:00:00Z')).status).toBe('EXAM_COMPLETED');
    expect(graduationState(12, 2026, { '2027': '2027-02-30' }).celebrationDate).toBeNull();
    expect(graduationState(11, 2026, { '2027': '2027-06-13' }, new Date('2027-07-01')).status).toBe('STUDYING');
  });
});

describe('THPT diagnostic selection', () => {
  const bank = (grade: number) => THPT_DIAGNOSTIC_MATRICES[grade].flatMap(cell => Array.from({ length: cell.count + 3 }, (_, index) => ({
    id: `${grade}-${cell.questionType}-${cell.cognitiveLevel}-${cell.difficulty}-${index}`,
    content: `${grade} ${cell.questionType} ${cell.cognitiveLevel} ${cell.difficulty} content ${index}`,
    questionType: cell.questionType, cognitiveLevel: cell.cognitiveLevel, difficulty: cell.difficulty,
    skillId: `skill-${index % 4}`, skill: { grade }
  })));
  for (const grade of [10, 11, 12]) it(`selects a stable, unique, grade-${grade} paper from mixed-grade data`, () => {
    const pool = [10, 11, 12].flatMap(bank);
    const ids = selectThptDiagnostic(pool, 'student-attempt', grade);
    expect(ids).toEqual(selectThptDiagnostic([...pool].reverse(), 'student-attempt', grade));
    expect(ids).toHaveLength(18);
    expect(new Set(ids).size).toBe(18);
    expect(ids.every(id => id.startsWith(`${grade}-`))).toBe(true);
    expect(ids.filter(id => id.includes('SINGLE_CHOICE'))).toHaveLength(12);
    expect(ids.filter(id => id.includes('TRUE_FALSE'))).toHaveLength(2);
    expect(ids.filter(id => id.includes('SHORT_ANSWER'))).toHaveLength(4);
    for (const cell of THPT_DIAGNOSTIC_MATRICES[grade]) {
      expect(ids.map(id => pool.find(q => q.id === id)!).filter(q => q.questionType === cell.questionType
        && q.cognitiveLevel === cell.cognitiveLevel && q.difficulty === cell.difficulty)).toHaveLength(cell.count);
    }
  });
  it('draws different papers per attempt while preserving each matrix cell', () => {
    const pool = bank(10);
    const papers = new Set(Array.from({ length: 40 }, (_, index) => selectThptDiagnostic(pool, `random-attempt-${index}`, 10).join(',')));
    expect(papers.size).toBe(40);
  });
  it('never substitutes a different difficulty or cognitive level, even with enough questions overall', () => {
    for (const field of ['difficulty', 'cognitiveLevel']) {
      const pool = bank(10).map(q => q.difficulty === 'HARD' ? { ...q, [field]: field === 'difficulty' ? 'MEDIUM' : 'UNDERSTANDING' } : q);
      try { selectThptDiagnostic(pool, 'attempt', 10); throw new Error('Expected matrix shortage'); }
      catch (error: any) {
        expect(error.getResponse()).toMatchObject({ code: 'DIAGNOSTIC_BANK_INSUFFICIENT', grade: 10,
          questionType: 'SHORT_ANSWER', cognitiveLevel: 'APPLYING', difficulty: 'HARD', required: 1, available: 0 });
      }
    }
  });
  it('does not fill shortages from other grades or suspect questions', () => {
    expect(() => selectThptDiagnostic(bank(11), 'seed', 10)).toThrow('lớp 10');
    expect(() => selectThptDiagnostic(bank(10).map(q => ({ ...q, source: { classification: { status: 'NEEDS_REVIEW' } } })), 'seed', 10)).toThrow();
    expect(() => selectThptDiagnostic(bank(10).map(q => ({ ...q, content: 'same question' })), 'seed', 10)).toThrow();
  });
  it('freezes the THPT paper, resumes it and never exposes keys or solutions', async () => {
    const pool = bank(10).map(q => ({ ...q, skill: { ...q.skill, title: 'Topic', chapter: 'Chapter' },
      options: [{ optionKey: 'A', content: 'Answer', isCorrect: true }], explanation: 'Secret', shortAnswer: { acceptedAnswers: ['7'] } }));
    let attempt: any = null;
    const tx: any = { $queryRaw: vi.fn(), mathPracticeSession: { findFirst: vi.fn(async () => null) },
      studentProfile: { findUnique: vi.fn(async () => ({ grade: 10 })) },
      skillNode: { findMany: vi.fn(async () => pool.map(q => ({ id: q.skillId }))) },
      question: { findMany: vi.fn(async () => pool) }, diagnosticAttempt: {
        findFirst: vi.fn(async () => attempt),
        create: vi.fn(async ({ data }) => (attempt = { ...data, id: 'attempt', status: 'IN_PROGRESS', startedAt: new Date(), answers: [] })),
        update: vi.fn(async ({ data }) => Object.assign(attempt, data))
      } };
    const service = new DiagnosticService({ $transaction: (fn: any) => fn(tx) } as any);
    const started = await service.startAttempt('student');
    expect(started.questions).toHaveLength(18);
    expect(JSON.stringify(started.questions)).not.toContain('isCorrect');
    expect(JSON.stringify(started.questions)).not.toContain('Secret');
    pool.reverse();
    const resumed = await service.startAttempt('student');
    expect(resumed.questions.map(q => q.id)).toEqual(started.questions.map(q => q.id));
    expect(tx.diagnosticAttempt.create).toHaveBeenCalledTimes(1);
  });
});
