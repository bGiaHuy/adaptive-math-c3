import { assignmentResultsVisible } from '../../common/domain/assignment-results';
import { isLearningQuestion, learningQuestionWhere } from '../curriculum/thpt-catalog';

// Student services own these reads. Private teacher questions require this student's
// completed, released submission; review always uses that assignment's snapshot.
export async function reviewQuestions(db: any, studentId: string, ids: string[]): Promise<Map<string, any>> {
  if (!ids.length) return new Map();
  const [bank, delivered] = await Promise.all([
    db.question.findMany({ where: { ...learningQuestionWhere(studentId), id: { in: ids } }, include: { skill: true, options: true } }),
    db.assignmentQuestion.findMany({ where: { questionId: { in: ids }, assignment: { submissions: { some: { studentId } } } },
      include: { question: { include: { skill: true, options: true } }, assignment: { include: { classroom: true, submissions: { where: { studentId }, select: { status: true, submittedAt: true } } } } },
      orderBy: { assignment: { updatedAt: 'desc' } } })
  ]);
  const blocked = new Set(delivered.filter((aq: any) => aq.assignment.submissions.some((s: any) => s.status === 'IN_PROGRESS')).map((aq: any) => aq.questionId));
  const result = new Map<string, any>(bank.filter((q: any) => !blocked.has(q.id) && isLearningQuestion(q, studentId)).map((q: any) => [q.id, q]));
  const snapshots = new Set<string>();
  for (const aq of delivered) {
    if (blocked.has(aq.questionId) || snapshots.has(aq.questionId) || ![10,11,12].includes(aq.assignment.classroom.grade)
      || !aq.assignment.submissions.some((s: any) => ['SUBMITTED','GRADED'].includes(s.status)) || !assignmentResultsVisible(aq.assignment)) continue;
    const q = aq.snapshot || aq.question;
    if (['EXCLUDE','FULL_CREDIT'].includes(q.gradingMode)) { result.delete(aq.questionId); snapshots.add(aq.questionId); continue; }
    result.set(aq.questionId, { ...q, id: aq.questionId, options: q.options || [], skill: { ...(q.skill || aq.question.skill), grade: aq.assignment.classroom.grade } });
    snapshots.add(aq.questionId);
  }
  return result;
}
