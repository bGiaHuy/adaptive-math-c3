import React, { useEffect, useState } from 'react';
import { studentApi } from '../lib/apiClient';
import '../math-learning.css';
export default function TodayActivities({ onStartPractice, onReview, onNavigatePath }) {
  const [data, setData] = useState(null), [active, setActive] = useState(null), [error, setError] = useState('');
  const load = async () => {
    setError('');
    try { const [p, a] = await Promise.all([studentApi.getLearningPath(), studentApi.practiceActive()]); setData(p); setActive(a); }
    catch (e) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);
  return <div className="math-learning" style={{ padding: 0, margin: '20px 0' }}>
    <h2>Hôm nay cần làm</h2>
    {error && <p role="alert">{error} <button onClick={load}>Thử lại</button></p>}
    {!data && !error && <p role="status">Đang tải kế hoạch…</p>}
    {active && <div className="math-activity"><div><strong>Tiếp tục: {active.title}</strong><p>Đã lưu {active.answeredCount}/{active.totalQuestions} câu.</p></div>
      <button className="math-primary" onClick={() => onStartPractice(active.skillId)}>Học tiếp</button></div>}
    {(data?.plan.days[0]?.activities || []).slice(0, 5).map((a, i) => <div className="math-activity" key={i}>
      <div><strong>{a.title}</strong><p>{a.reason} Khoảng {a.minutes} phút.</p></div>
      <button className="math-secondary" disabled={Boolean(active) && a.kind !== 'REVIEW' && active.skillId !== a.skillId}
        onClick={() => a.kind === 'REVIEW' ? onReview() : onStartPractice(a.skillId)}>{a.kind === 'REVIEW' ? 'Ôn đến hạn' : 'Bắt đầu học'}</button>
    </div>)}
    {data && !data.plan.days[0]?.activities.length && <p>Không còn việc trong kế hoạch hôm nay. Bạn có thể chọn chủ đề để củng cố.</p>}
    <button className="math-text-button" onClick={onNavigatePath}>Xem toàn bộ lộ trình</button>
  </div>;
}
