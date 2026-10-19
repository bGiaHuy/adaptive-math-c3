import React, { useEffect, useState } from 'react';
import { studentApi } from '../lib/apiClient';
import MathTutorChat from './MathTutorChat';

export default function MathTutorArchive({ enabled }) {
  const [items, setItems] = useState([]), [selected, setSelected] = useState(''), [error, setError] = useState(''), [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true); setError('');
    try { setItems((await studentApi.reviewConversations()).conversations); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  return <section className="math-tutor-chat"><header><h3>Tiếp tục hỏi gia sư</h3><button type="button" disabled={loading} onClick={load}>{loading ? 'Đang tải…' : 'Tải lại lịch sử'}</button></header><p>Mở lại cuộc trò chuyện của bài ôn trước trong 30 ngày gần nhất.</p>{error && <p role="alert">{error}</p>}{!loading && !items.length && <p>Chưa có cuộc trò chuyện. Mở đáp án một câu ôn để bắt đầu hỏi.</p>}<div className="math-tutor-archive">{items.map(item => <button type="button" key={item.reviewId} aria-pressed={selected === item.reviewId} onClick={() => setSelected(current => current === item.reviewId ? '' : item.reviewId)}>{item.preview} · {new Date(item.updatedAt).toLocaleDateString('vi-VN', { timeZone:'Asia/Ho_Chi_Minh' })}</button>)}</div>{selected && <MathTutorChat key={selected} reviewId={selected} enabled={enabled}/>}</section>;
}
