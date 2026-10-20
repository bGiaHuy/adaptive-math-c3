export const thptGrade = (grade?: number) => [10, 11, 12].includes(grade) ? grade : 10;
export const universityGoal = (goal?: string) => /đại học|tốt nghiệp|university|graduation/i.test(goal || '');
export const legacyEntranceGoal = (goal?: string) => /vào\s+(?:lớp\s+)?10|tuyển sinh\s+(?:lớp\s+)?10/i.test(goal || '');
export function normalizeThptGoal(grade: number, goal?: string) {
  if (legacyEntranceGoal(goal) || universityGoal(goal)) return grade === 12 ? 'Ôn thi đại học' : 'Ôn thi cuối kỳ';
  return goal?.trim() || 'Ôn thi cuối kỳ';
}
