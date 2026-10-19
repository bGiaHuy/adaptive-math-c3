import { formatDateToYMD } from './calendarEngine.js';

const STORAGE_KEY_PREFIX = 'adaptive_study_calendar_logs_';

/**
 * Retrieve study logs from local cache
 */
export function getStudyLogs(userId = 'default_student') {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading study logs:', err);
  }
  return {};
}

/**
 * Save study logs and broadcast change event
 */
export function saveStudyLogs(userId = 'default_student', logs) {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(logs));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('study-activity-logged', {
          detail: { userId, logs, timestamp: Date.now() },
        })
      );
    }
  } catch (err) {
    console.error('Error saving study logs:', err);
  }
}

/**
 * Record a study activity session for today
 */
export function recordStudyActivity(
  userId = 'default_student',
  { minutes = 30, activity = 'Luyện tập thích ứng' } = {}
) {
  const logs = getStudyLogs(userId);
  const todayStr = formatDateToYMD(new Date());

  const current = logs[todayStr] || {
    minutes: 0,
    sessions: 0,
    completed: false,
    activities: [],
  };

  const updatedMinutes = current.minutes + minutes;
  logs[todayStr] = {
    minutes: updatedMinutes,
    sessions: current.sessions + 1,
    completed: true,
    lastUpdated: new Date().toISOString(),
    activities: [...(current.activities || []), activity],
  };

  saveStudyLogs(userId, logs);
  return logs;
}

/**
 * Calculate dynamic streak count
 */
export function calculateRealTimeStreak(logs = {}) {
  const today = new Date();
  const todayStr = formatDateToYMD(today);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateToYMD(yesterday);

  const isCompletedToday = Boolean(logs[todayStr]?.completed);
  const isCompletedYesterday = Boolean(logs[yesterdayStr]?.completed);

  if (!isCompletedToday && !isCompletedYesterday) {
    return {
      currentStreak: 0,
      activeToday: false,
      todayMinutes: logs[todayStr]?.minutes || 0,
    };
  }

  let streak = 0;
  let checkDate = new Date();
  if (!isCompletedToday) {
    checkDate = yesterday;
  }

  while (true) {
    const dStr = formatDateToYMD(checkDate);
    if (logs[dStr]?.completed) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak: streak,
    activeToday: isCompletedToday,
    todayMinutes: logs[todayStr]?.minutes || 0,
  };
}

