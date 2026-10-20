// Shared release policy; callers own authentication and assignment access.
export function assignmentResultsVisible(assignment: any, now = Date.now()): boolean {
  const s = assignment.settings || {};
  return (s.resultsPolicy || 'IMMEDIATE') === 'IMMEDIATE' || s.published === true ||
    Boolean(s.resultsPolicy === 'AFTER_DUE' && assignment.dueDate && new Date(assignment.dueDate).getTime() <= now);
}
