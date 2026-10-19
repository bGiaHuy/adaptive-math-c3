import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  CheckCircle2,
  CalendarCheck,
  Target,
} from 'lucide-react';
import {
  DAYS_OF_WEEK,
  getMonthMatrix,
  formatDateToYMD,
  formatVietnameseDate,
  formatLiveClock,
} from '../lib/calendarEngine';
import {
  calculateRealTimeStreak,
} from '../lib/calendarSyncService';
import { studentApi } from '../lib/apiClient';

export default function PracticeCalendar({ userProfile }) {
  const isProfileConfigured = Boolean(
    userProfile && (userProfile.grade || userProfile.targetGoal)
  );
  const userId = userProfile?.userId || userProfile?.id || 'default_student';

  // Live real-time clock state
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Viewed month/year in calendar navigation
  const [viewDate, setViewDate] = useState(() => new Date());

  // Real-time study logs state
  const [studyLogs, setStudyLogs] = useState({});
  const [logsError, setLogsError] = useState('');
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsRetry, setLogsRetry] = useState(0);

  // Tooltip state for interactive hover
  const [hoveredDayInfo, setHoveredDayInfo] = useState(null);

  // 1. Ticker for live real-time clock & midnight transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Multi-source event listener for instant real-time sync
  useEffect(() => {
    let mounted = true;
    setLogsLoading(true);
    const handleActivityLogged = async () => {
      try { const data = await studentApi.getActivity(); if (mounted) { setStudyLogs(data.logs || {}); setLogsError(''); } }
      catch { if (mounted) setLogsError('Chưa tải được lịch sử học từ máy chủ.'); }
      finally { if (mounted) setLogsLoading(false); }
    };
    handleActivityLogged();

    window.addEventListener('study-activity-logged', handleActivityLogged);
    window.addEventListener('storage', handleActivityLogged);

    return () => {
      mounted = false;
      window.removeEventListener('study-activity-logged', handleActivityLogged);
      window.removeEventListener('storage', handleActivityLogged);
    };
  }, [userId, logsRetry]);

  // Completed activities come from the authenticated student's server records.

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0-indexed

  // Current real-time date components
  const todayYMD = formatDateToYMD(currentDateTime);
  const isViewingCurrentMonth =
    viewYear === currentDateTime.getFullYear() &&
    viewMonth === currentDateTime.getMonth();

  // Dynamic month matrix calculation
  const monthData = useMemo(() => {
    return getMonthMatrix(viewYear, viewMonth);
  }, [viewYear, viewMonth]);

  // Calculate real-time streak
  const streakInfo = useMemo(() => {
    return calculateRealTimeStreak(studyLogs);
  }, [studyLogs]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleResetToToday = () => {
    setViewDate(new Date());
  };

  // Target exam date parsing
  const examDateStr = userProfile?.examDate; // format could be DD/MM/YYYY or YYYY-MM-DD
  const formattedExamDateYMD = useMemo(() => {
    if (!examDateStr) return null;
    if (examDateStr.includes('/')) {
      const [d, m, y] = examDateStr.split('/');
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return examDateStr;
  }, [examDateStr]);

  const dailyMinutesTarget = userProfile?.dailyMinutes || 45;

  return (
    <div className="practice-calendar-card modern-calendar">
      {logsError && <p className="bento-calendar-error" role="status">{logsError} <button type="button" disabled={logsLoading} onClick={() => setLogsRetry(value => value + 1)}>Thử lại</button></p>}
      {/* Real-time Status Bar (Clock & Live Sync indicator) */}
      <div className="calendar-live-bar">
        <div className="calendar-live-clock">
          <Clock size={13} className="clock-pulse-icon" />
          <span className="live-clock-text">
            {formatLiveClock(currentDateTime)} · {formatVietnameseDate(currentDateTime)}
          </span>
        </div>
        <div className="calendar-sync-indicator" aria-live="polite">
          <span className="sync-pulse-dot"></span>
          <span className="sync-label">{logsLoading ? 'Đang tải lịch sử…' : logsError ? 'Chưa kết nối' : 'Lịch sử đã lưu'}</span>
        </div>
      </div>

      {/* Calendar Header with Navigation */}
      <div className="calendar-card-header">
        <div className="calendar-title-row">
          <CalendarIcon size={18} className="calendar-icon" />
          <h3 className="calendar-title">
            Tháng {viewMonth + 1}, {viewYear}
          </h3>
          {!isViewingCurrentMonth && (
            <button
              className="btn-calendar-today-pill"
              onClick={handleResetToToday}
              title="Quay lại tháng hiện tại"
            >
              Hôm nay
            </button>
          )}
        </div>

        <div className="calendar-nav-controls">
          <button
            className="calendar-nav-btn"
            onClick={handlePrevMonth}
            aria-label="Tháng trước"
            title="Tháng trước"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="calendar-nav-btn"
            onClick={handleNextMonth}
            aria-label="Tháng sau"
            title="Tháng sau"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Headers (T2 -> CN) */}
      <div className="calendar-grid-container">
        <div className="calendar-weekdays-row">
          {DAYS_OF_WEEK.map((w) => (
            <div key={w.key} className="weekday-col" title={w.full}>
              {w.label}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="calendar-days-grid">
          {/* Dynamic empty leading cells */}
          {Array.from({ length: monthData.emptyLeadingCells }).map((_, idx) => (
            <div key={`empty-${idx}`} className="calendar-day-empty" />
          ))}

          {/* Actual Month Days */}
          {monthData.days.map((item) => {
            const isToday = item.dateString === todayYMD;
            const log = studyLogs[item.dateString];
            const isCompleted = Boolean(log?.completed);
            const isExamDate = formattedExamDateYMD === item.dateString;

            let tooltipText = `${item.day}/${viewMonth + 1}/${viewYear}`;
            if (isToday) tooltipText += ' (Hôm nay)';
            if (isCompleted) {
              tooltipText += ` • Đã học ${log.minutes} phút`;
            }
            if (isExamDate) {
              tooltipText += ' • 🎯 Ngày thi mục tiêu';
            }

            return (
              <div
                key={item.dateString}
                className={`calendar-day-cell ${isToday ? 'today' : ''} ${
                  isCompleted ? 'active-streak' : ''
                } ${isExamDate ? 'exam-milestone' : ''}`}
                title={tooltipText}
                onMouseEnter={() =>
                  setHoveredDayInfo({
                    date: item.dateString,
                    day: item.day,
                    log,
                    isToday,
                    isExamDate,
                  })
                }
                onMouseLeave={() => setHoveredDayInfo(null)}
              >
                <span className="day-number">{item.day}</span>
                {isCompleted && <div className="streak-dot" />}
                {isExamDate && <div className="exam-star-dot" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Streak & Learning Activity Summary */}
      <div className="calendar-summary-bar">
        <div className="calendar-streak-badge">
          <Flame size={15} className="streak-icon" />
          <span>
            Chuỗi học tập:{' '}
            <strong>
              {streakInfo.currentStreak > 0
                ? `${streakInfo.currentStreak} ngày`
                : 'Chưa có chuỗi'}
            </strong>
          </span>
        </div>
        <div className="calendar-target-status">
          {streakInfo.activeToday ? (
            <span className="target-done-tag">
              <CheckCircle2 size={13} />
              Đã học {streakInfo.todayMinutes}p hôm nay
            </span>
          ) : (
            <span className="target-pending-tag">
              Mục tiêu: {dailyMinutesTarget} phút/ngày
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
