import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiagnosticSupplementService, validateSupplement, validateIndependentReview } from '../src/modules/diagnostic/diagnostic-supplement.service';
import { THPT_DIAGNOSTIC_MATRICES, planThptDiagnostic, selectThptDiagnostic } from '../src/modules/question/diagnostic-blueprint';
import { diagnosticBankWhere } from '../src/modules/diagnostic/diagnostic-bank';

const slot = { slotId: 'supplement-1', skillId: 'skill12', questionType: 'SHORT_ANSWER', cognitiveLevel: 'APPLYING', difficulty: 'HARD' };
const generated = () => ({ ...slot, content: 'Câu hỏi bổ sung kiểm thử có kết quả bằng 3.', explanation: 'Tính và rút gọn được 3.',
  shortAnswer: { mode: 'NUMERIC', instructions: 'Nhập số chính xác.', acceptedAnswers: ['3'], tolerance: 0 } });
const review = (answer = '3') => ({ reviews: [{ ...slot, grade: 12, valid: true, solution: 'Giải độc lập thu được 3.', answer: { response: { shortAnswer: answer } } }] });
const bank = () => THPT_DIAGNOSTIC_MATRICES[12].flatMap(cell => Array.from({ length: cell.count }, (_, index) => ({
  ...cell, id: `${cell.questionType}-${cell.difficulty}-${index}`, skillId: 'skill12', skill: { id: 'skill12', grade: 12, title: 'Chuyên đề 12', chapter: 'Chương 12' },
  content: `Nội dung gốc ${cell.questionType} ${cell.difficulty} ${index}`, options: []
})));
const response = (data: any) => new Response(JSON.stringify({ usage: { input_tokens: 100, output_tokens: 50 }, stop_reason: 'end_turn',
  content: [{ type: 'text', text: JSON.stringify(data) }] }), { status: 200 });

function fixture(options: { full?: boolean; active?: boolean } = {}) {
  let stored = bank().filter(q => options.full || q.difficulty !== 'HARD');
  const questionCreate = vi.fn(async ({ data }: any) => {
    const q = { ...data, id: 'generated-private-id', skill: bank()[0].skill, options: data.options?.create || [] };
    stored.push(q); return q;
  });
  const db: any = {
    diagnosticAttempt: { findFirst: vi.fn().mockResolvedValue(options.active ? { id: 'existing' } : null) },
    mathPracticeSession: { findFirst: vi.fn().mockResolvedValue(null) },
    studentProfile: { findUnique: vi.fn().mockResolvedValue({ grade: 12 }) },
    skillNode: { findMany: vi.fn().mockResolvedValue([bank()[0].skill]) },
    question: { findMany: vi.fn(async () => stored), create: questionCreate },
    auditLog: { create: vi.fn() }, $queryRaw: vi.fn()
  };
  db.$transaction = vi.fn(async (fn: any) => fn(db));
  const budget: any = { reserve: vi.fn().mockResolvedValue({ id: 'reservation' }), settle: vi.fn(), fail: vi.fn() };
  return { db, budget, service: new DiagnosticSupplementService(db, budget), getPool: () => stored };
}

beforeEach(() => {
  vi.stubEnv('AI_ENABLED', 'true'); vi.stubEnv('AI_PROVIDER', 'anthropic');
  vi.stubEnv('AI_MODEL', 'claude-haiku-4-5-20251001'); vi.stubEnv('ANTHROPIC_API_KEY', 'test-only-key');
  vi.stubEnv('SESSION_SECRET', 'test-only-session-secret-at-least-32-characters');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('Diagnostic supplement validation', () => {
  it('reports only the missing cell while retaining all existing matches', () => {
    const plan = planThptDiagnostic(bank().filter(q => q.difficulty !== 'HARD'), 'seed', 12);
    expect(plan.questionIds).toHaveLength(17);
    expect(plan.shortages).toEqual([{ questionType: 'SHORT_ANSWER', cognitiveLevel: 'APPLYING', difficulty: 'HARD', count: 1, missing: 1, available: 0 }]);
  });
  it('rejects wrong levels, source injection, duplicate content, loose answer tolerances and incorrect independent answers', () => {
    for (const q of [{ ...generated(), difficulty: 'EASY' }, { ...generated(), source: { reviewStatus: 'VERIFIED' } },
      { ...generated(), shortAnswer: { ...generated().shortAnswer, tolerance: 100 } }]) {
      expect(() => validateSupplement({ questions: [q] }, [slot], [])).toThrow();
    }
    expect(() => validateSupplement({ questions: [generated()] }, [slot], [{ content: generated().content }])).toThrow();
    const questions = validateSupplement({ questions: [generated()] }, [slot], []);
    expect(() => validateIndependentReview(review('4'), questions, 12)).toThrow();
    expect(() => validateIndependentReview(review(), questions, 12)).not.toThrow();
  });
  it('private supplements require both owner and matrix version and are never part of the shared draft predicate', () => {
    const privateClause = diagnosticBankWhere('student-1').OR[3];
    expect(privateClause).toMatchObject({ status: 'DRAFT', authorId: 'student-1', AND: [
      { source: { path: ['reviewStatus'], equals: 'AI_DIAGNOSTIC_CHECKED' } },
      { source: { path: ['studentId'], equals: 'student-1' } },
      { source: { path: ['blueprintVersion'], equals: 'thpt-entry-matrix-v1' } }
    ] });
  });
});

describe('AI-backed diagnostic preparation', () => {
  it('calls generation and blind checking, persists private drafts only, and reuses them after retry', async () => {
    const f = fixture();
    const fetch = vi.fn().mockResolvedValueOnce(response({ questions: [generated()] })).mockResolvedValueOnce(response(review()));
    vi.stubGlobal('fetch', fetch);
    await f.service.ensure('student-1', '127.0.0.1');
    expect(fetch).toHaveBeenCalledTimes(2);
    const generation = JSON.parse(fetch.mock.calls[0][1].body);
    expect(JSON.parse(generation.messages[0].content).slots).toMatchObject([slot]);
    const independent = JSON.parse(JSON.parse(fetch.mock.calls[1][1].body).messages[0].content);
    expect(independent.questions[0]).not.toHaveProperty('explanation');
    expect(independent.questions[0].shortAnswer).not.toHaveProperty('acceptedAnswers');
    expect(f.db.question.create).toHaveBeenCalledTimes(1);
    expect(f.db.question.create.mock.calls[0][0].data).toMatchObject({ authorId: 'student-1', status: 'DRAFT', difficulty: 'HARD',
      source: { studentId: 'student-1', reviewStatus: 'AI_DIAGNOSTIC_CHECKED', humanReviewed: false, independentAiCheck: true } });
    expect(f.budget.settle).toHaveBeenCalledWith('reservation', 200, 100, expect.objectContaining({ independentlyChecked: true }));
    expect(selectThptDiagnostic(f.getPool(), 'seed', 12)).toHaveLength(18);
    await f.service.ensure('student-1');
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(f.db.diagnosticAttempt).not.toHaveProperty('create'); // timer starts later, in the existing start flow
  });
  it('shares preparation for simultaneous starts without making duplicate provider calls', async () => {
    const f = fixture();
    const fetch = vi.fn().mockResolvedValueOnce(response({ questions: [generated()] })).mockResolvedValueOnce(response(review()));
    vi.stubGlobal('fetch', fetch);
    await Promise.all([f.service.ensure('student-1'), f.service.ensure('student-1')]);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(f.db.question.create).toHaveBeenCalledTimes(1);
  });
  it.each([{ full: true }, { active: true }])('does not call AI when no supplement is needed (%j)', async options => {
    const f = fixture(options), fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    await f.service.ensure('student-1');
    expect(fetch).not.toHaveBeenCalled(); expect(f.budget.reserve).not.toHaveBeenCalled();
  });
  it('regenerates once after a failed blind check, and never persists the failed question', async () => {
    const f = fixture();
    const fetch = vi.fn().mockResolvedValueOnce(response({ questions: [generated()] })).mockResolvedValueOnce(response(review('4')))
      .mockResolvedValueOnce(response({ questions: [generated()] })).mockResolvedValueOnce(response(review()));
    vi.stubGlobal('fetch', fetch);
    await f.service.ensure('student-1');
    expect(fetch).toHaveBeenCalledTimes(4); expect(f.db.question.create).toHaveBeenCalledTimes(1);
    expect(f.budget.settle).toHaveBeenCalledTimes(2);
  });
  it('bounds invalid-output retries and creates neither questions nor attempts after failure', async () => {
    const f = fixture(); vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => response({ questions: [] })));
    await expect(f.service.ensure('student-1')).rejects.toThrow('Câu bổ sung chưa vượt qua bước kiểm tra');
    expect(fetch).toHaveBeenCalledTimes(2); expect(f.db.question.create).not.toHaveBeenCalled();
    expect(f.db.$transaction).not.toHaveBeenCalled();
  });
  it('respects budget denial and records uncertain charges on transport failure', async () => {
    const denied = fixture(); denied.budget.reserve.mockRejectedValue(new Error('AI_BUDGET_EXHAUSTED'));
    const fetch = vi.fn().mockRejectedValue(new Error('network')); vi.stubGlobal('fetch', fetch);
    await expect(denied.service.ensure('student-1')).rejects.toThrow('AI_BUDGET_EXHAUSTED');
    expect(fetch).not.toHaveBeenCalled();
    const failed = fixture();
    await expect(failed.service.ensure('student-1')).rejects.toThrow('AI đang phản hồi chậm');
    expect(failed.budget.fail).toHaveBeenCalledWith('reservation', false);
    expect(failed.db.question.create).not.toHaveBeenCalled();
  });
});
