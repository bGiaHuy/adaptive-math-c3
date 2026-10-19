/**
 * Real-time Calendar Engine
 * Accurate date, month matrix, and day-of-week calculations
 * Vietnamese standard: Week starts on Monday (T2) -> Sunday (CN)
 */

export const DAYS_OF_WEEK = [
  { key: 'mon', label: 'T2', full: 'Thứ Hai' },
  { key: 'tue', label: 'T3', full: 'Thứ Ba' },
  { key: 'wed', label: 'T4', full: 'Thứ Tư' },
  { key: 'thu', label: 'T5', full: 'Thứ Năm' },
  { key: 'fri', label: 'T6', full: 'Thứ Sáu' },
  { key: 'sat', label: 'T7', full: 'Thứ Bảy' },
  { key: 'sun', label: 'CN', full: 'Chủ Nhật' },
];

/**
 * Returns the month matrix for any given year and month (0-indexed).
 * Accurately aligns the 1st of the month with Vietnamese Monday-first calendar.
 */
export function getMonthMatrix(year, month) {
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  
  // Vietnam week starts on Monday: Monday=0, Tuesday=1 ... Sunday=6
  const emptyLeadingCells = (firstDayOfWeek + 6) % 7;

  const days = [];
  for (let i = 1; i <= totalDays; i++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(i).padStart(2, '0');
    days.push({
      day: i,
      month: month + 1,
      year,
      dateString: `${year}-${monthStr}-${dayStr}`,
    });
  }

  return {
    year,
    month,
    totalDays,
    emptyLeadingCells,
    days,
  };
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateToYMD(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats date into readable Vietnamese format: e.g. "Thứ Hai, 05/10/2026"
 */
export function formatVietnameseDate(date = new Date()) {
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayNames[date.getDay()];
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${dayName}, ${d}/${m}/${y}`;
}

/**
 * Formats live clock into HH:mm:ss
 */
export function formatLiveClock(date = new Date()) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * Calculates remaining days between now and a target date string (DD/MM/YYYY or YYYY-MM-DD)
 */
export function calculateDaysRemaining(targetDateInput) {
  if (!targetDateInput) return null;
  let targetDate;
  if (typeof targetDateInput === 'string' && targetDateInput.includes('/')) {
    const parts = targetDateInput.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      targetDate = new Date(year, month, day, 23, 59, 59);
    }
  } else {
    targetDate = new Date(targetDateInput);
  }

  if (!targetDate || isNaN(targetDate.getTime())) return null;
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
