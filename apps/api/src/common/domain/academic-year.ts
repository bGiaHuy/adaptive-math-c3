// School-year boundaries are civil dates in Vietnam, independent of server timezone.
export function academicYear(now = new Date()): number {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = (type: string) => Number(day.find(p => p.type === type)?.value);
  return value('year') - (value('month') < 9 || (value('month') === 9 && value('day') < 5) ? 1 : 0);
}

export function promotedGrade(grade: number, anchoredYear: number, now = new Date()): number {
  return Math.min(12, grade + Math.max(0, academicYear(now) - anchoredYear));
}

export function graduationState(grade: number, finalSchoolYear: number, dates: Record<string, string>, now = new Date()) {
  const graduationYear = finalSchoolYear + 1;
  const date = dates[String(graduationYear)];
  const valid = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number(date.slice(0, 4)) === graduationYear
    && Number.isFinite(Date.parse(`${date}T00:00:00+07:00`)) && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
  const celebrated = grade === 12 && valid && now.getTime() >= Date.parse(`${date}T00:00:00+07:00`);
  return { graduationYear, celebrationDate: valid ? date : null, status: celebrated ? 'EXAM_COMPLETED' : grade === 12 && !valid ? 'AWAITING_OFFICIAL_SCHEDULE' : 'STUDYING' };
}
