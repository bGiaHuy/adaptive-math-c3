import { describe, it, expect } from 'vitest';
import { LEVELS, estimateAbility, selectStaircase, diagnosticMastery, updateKnowledge, buildStudyPlan, studyDate, examDay } from '../src/modules/student/math-adaptive';

const pool = ['a', 'b', 'c'].flatMap(skillId => LEVELS.flatMap(cognitiveLevel => [1, 2].map(n => ({
  id: `${skillId}-${cognitiveLevel}-${n}`, skillId, cognitiveLevel
}))));
describe('Math adaptive learning behavior', () => {
  it('gives finite MAP estimates for all-correct/all-wrong histories and reduces uncertainty with evidence', () => {
    const questions = Array.from({ length: 30 }, (_, i) => ({ cognitiveLevel: LEVELS[i % 4] }));
    for (const isCorrect of [true, false]) {
      const answers = questions.map(question => ({ question, isCorrect }));
      const result = estimateAbility(answers);
      expect(Number.isFinite(result.theta)).toBe(true);
      expect(Math.abs(result.theta)).toBeLessThan(4);
      expect(result.standardError).toBeLessThan(estimateAbility(answers.slice(0, 1)).standardError);
    }
    expect(estimateAbility([])).toEqual({ theta: 0, standardError: 2 });
  });
  it('covers every skill at the easiest level before advancing and preserves the seeded choice on resume', () => {
    const answers: any[] = [];
    for (let i = 0; i < 3; i++) {
      const q = selectStaircase(pool, answers, 'session');
      expect(q.cognitiveLevel).toBe('REMEMBERING');
      expect(answers.some(a => a.question.skillId === q.skillId)).toBe(false);
      expect(selectStaircase([...pool].reverse(), answers, 'session').id).toBe(q.id);
      answers.push({ questionId: q.id, question: q, isCorrect: true });
    }
    expect(selectStaircase(pool, answers, 'session').cognitiveLevel).toBe('UNDERSTANDING');
  });
  it('verifies one wrong answer at the same level and stops that skill after a second wrong answer', () => {
    const questions = pool.filter(q => q.skillId === 'a');
    const first = selectStaircase(questions, [], 'seed');
    const answers = [{ questionId: first.id, question: first, isCorrect: false }];
    const verify = selectStaircase(questions, answers, 'seed');
    expect(verify.id).not.toBe(first.id); expect(verify.cognitiveLevel).toBe(first.cognitiveLevel);
    expect(selectStaircase(questions, [...answers, { questionId: verify.id, question: verify, isCorrect: false }], 'seed')).toBeNull();
  });
  it('does not fabricate verification if the same-level bank has run out', () => {
    const q = pool[0];
    expect(selectStaircase([q, pool[2]], [{ questionId: q.id, question: q, isCorrect: false }], 'seed')).toBeNull();
    expect(diagnosticMastery([], 0)).toBeNull();
    expect(diagnosticMastery([{ question: q, isCorrect: true }], 0)).toBeLessThan(1);
  });
  it('updates knowledge with learning and reacts to mistakes', () => {
    let p = 0.1;
    for (let i = 0; i < 3; i++) p = updateKnowledge(p, true);
    expect(p).toBeGreaterThan(.85); expect(updateKnowledge(p, false)).toBeLessThan(p);
  });
  it('uses time budgets, distinguishes unknown skills, reserves review time and respects the exam horizon', () => {
    const modules = Array.from({ length: 12 }, (_, i) => ({ id: `${i}`, title: `${i}`, orderIndex: i,
      masteryScore: i === 0 ? null : 20, evidenceCount: 5, status: 'IN_PROGRESS', canPractice: true }));
    const now = new Date('2026-10-09T06:00:00Z');
    const short = buildStudyPlan(modules, 30, '11/10/2026', 'Ôn thi vào lớp 10', now);
    const long = buildStudyPlan(modules, 90, '11/10/2026', 'Ôn thi vào lớp 10', now);
    expect(short.days).toHaveLength(2); expect(short.unscheduledCount).toBeGreaterThan(long.unscheduledCount);
    expect(short.days[0].activities).toHaveLength(1); expect(long.days[0].activities).toHaveLength(2);
    const review = buildStudyPlan(modules, 30, '', '', now, 8);
    expect(review.days[0].activities[0].kind).toBe('REVIEW');
    expect(review.days.every(d => d.plannedMinutes <= 30)).toBe(true);
    expect(buildStudyPlan([modules[0]], 30, '', '', now).days[0].activities[0].kind).toBe('EXPLORE');
    expect(buildStudyPlan([{ ...modules[0], canPractice: false }], 30, '', '', now).days[0].activities).toHaveLength(0);
    expect(studyDate(new Date('2026-10-08T18:30:00Z'))).toBe('2026-10-09');
    expect(examDay('31/02/2027')).toBeNull();
  });
});
