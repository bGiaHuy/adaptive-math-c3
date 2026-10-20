// Giao diện ổn định; dữ liệu được chia sẻ qua contracts.
export { THPT_CURRICULUM, THPT_BOOK, LEGACY_BANK_PAUSED } from '@adaptivemath/contracts/curriculum.js';

// Explicitly shared extraction drafts. This does not publish them or grant edit rights.
export const THPT_SHARED_REVIEWED_BATCHES = ['thpt-phuloc-source-54-v1', 'thpt-nvc-source-18-v1','thpt-batch001-reviewed-18-v1','thpt-text-intake-8-v1','thpt-ttt101-reviewed-18-v1','thpt-manual-round2-36-v1'];
export const sharedThptDraftWhere = () => ({
  status: 'DRAFT' as const,
  skill: { grade: { in: [10, 11, 12] } },
  AND: [
    { OR: THPT_SHARED_REVIEWED_BATCHES.map(batchId => ({ source: { path: ['importBatchId'], equals: batchId } })) },
    { source: { path: ['reviewStatus'], equals: 'SOURCE_KEY_AND_SOLUTION_CHECKED' } }
  ]
});

// Shared admission rule for practice and review. Private AI drafts remain scoped
// to their student even when a source-bank record is otherwise inaccessible.
export const learningQuestionWhere = (studentId?: string) => ({
  skill: { grade: { in: [10, 11, 12] } },
  OR: [
    { status: 'PUBLISHED' as const },
    { status: 'DRAFT' as const, source: { path: ['reviewStatus'], equals: 'VERIFIED' } },
    sharedThptDraftWhere(),
    ...(studentId ? [{ status: 'DRAFT' as const, authorId: studentId, AND: [
      { source: { path: ['reviewStatus'], equals: 'AI_DIAGNOSTIC_CHECKED' } },
      { source: { path: ['studentId'], equals: studentId } }
    ] }] : [])
  ]
});

export function isLearningQuestion(q: any, studentId?: string) {
  if (!q || ![10, 11, 12].includes(q.skill?.grade) || q.source?.classification?.status === 'NEEDS_REVIEW') return false;
  if (q.status === 'PUBLISHED') return true;
  if (q.status !== 'DRAFT') return false;
  const source = q.source || {};
  return source.reviewStatus === 'VERIFIED'
    || (source.reviewStatus === 'SOURCE_KEY_AND_SOLUTION_CHECKED' && THPT_SHARED_REVIEWED_BATCHES.includes(source.importBatchId))
    || (Boolean(studentId) && q.authorId === studentId && source.studentId === studentId && source.reviewStatus === 'AI_DIAGNOSTIC_CHECKED');
}
