import { thptBank } from './fixtures/blueprint';
import { validateTeacherPaper } from '../src/modules/assignment/teacher-paper';
import { describe, it, expect, vi } from 'vitest';
import { AssignmentService } from '../src/modules/assignment/assignment.service';

const rows = thptBank();
const skillIds = [...new Set(rows.map(q => q.skillId))];
const setup = (pool = rows) => {
  const findMany = vi.fn().mockResolvedValue(pool);
  return { service: new AssignmentService({ question: { findMany } } as any), findMany };
};
describe('Random bank exam preview', () => {
  it('selects default 12/4/6 without replacement and never writes', async () => {
    const { service, findMany } = setup();
    const result = await service.randomPreview('teacher', { skillIds });
    expect(result.questionIds).toHaveLength(22);
    expect(new Set(result.questionIds).size).toBe(22);
    for (const [type, count] of Object.entries(result.questionCounts)) expect(result.questions.filter(q => q.questionType === type)).toHaveLength(count);
    expect(validateTeacherPaper(result.questions)).toHaveLength(22);
    expect(findMany).toHaveBeenCalledOnce();
    expect(findMany.mock.calls[0][0].where.OR).toContainEqual({ status: 'DRAFT', authorId: 'teacher' });
    expect(findMany.mock.calls[0][0].where.skill).toEqual({ grade: {in:[10,11,12]} });
  });
  it('requires selected topics and preserves counts', async () => {
    const { service, findMany } = setup();
    await expect(service.randomPreview('teacher', { skillIds: [] })).rejects.toThrow();
    const paper = await service.randomPreview('teacher', { skillIds, questionCounts: { SINGLE_CHOICE: 1, TRUE_FALSE: 1, SHORT_ANSWER: 1 } });
    expect(paper.questions).toHaveLength(3);
    expect(paper.questionCounts).toEqual({SINGLE_CHOICE:1,TRUE_FALSE:1,SHORT_ANSWER:1});
    expect(findMany).toHaveBeenCalledOnce();
  });
  it('rejects insufficient bank rather than quietly changing counts', async () => {
    const { service } = setup(rows.filter(q => q.questionType === 'SINGLE_CHOICE'));
    await expect(service.randomPreview('teacher', { skillIds })).rejects.toThrow();
  });
  it('uses only selected topics without requiring comprehensive topic coverage', async () => {
    const oneTopic = rows.map(q => ({ ...q, skillId: rows[0].skillId, skill: rows[0].skill }));
    const { service, findMany } = setup([...oneTopic, { ...rows[1], id:'outside', skillId:'outside' }] as any);
    const result = await service.randomPreview('teacher', { skillIds: [rows[0].skillId] });
    expect(result.questions).toHaveLength(22);
    expect(result.questions.every(q => q.skillId === rows[0].skillId)).toBe(true);
    expect(findMany.mock.calls[0][0].where.skillId).toEqual({in:[rows[0].skillId]});
  });
  it('deduplicates copies by normalized question content', async () => {
    const { service } = setup([{ ...rows[0], id: '1', content: ' A   B ' }, { ...rows[0], id: '2', content: 'a b' }] as any);
    await expect(service.randomPreview('teacher', { skillIds, questionCounts: { SINGLE_CHOICE: 2, TRUE_FALSE: 0, SHORT_ANSWER: 0 } })).rejects.toThrow();
  });
  it('rejects empty, fractional or over-limit count requests', async () => {
    const { service, findMany } = setup();
    for (const count of [0, -1, 0.5, 201]) await expect(service.randomPreview('teacher', { questionCounts: { SINGLE_CHOICE: count, TRUE_FALSE: 0, SHORT_ANSWER: 0 } })).rejects.toThrow();
    expect(findMany).not.toHaveBeenCalled();
  });
});
