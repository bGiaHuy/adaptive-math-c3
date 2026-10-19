import React, { useEffect, useRef, useState } from 'react';
import { studentApi } from '../lib/apiClient';
import MathRenderer from './MathRenderer';
import '../math-learning.css';

const phaseNames = { WARMUP: 'Khởi động', PRACTICE: 'Luyện tập', CHECK: 'Kiểm tra nhanh' };
export default function MathPracticeView({ skillId, userId, onExit, onComplete }) {
  const [session, setSession] = useState(null);
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [lastQuestion, setLastQuestion] = useState(null);
  const [introduced, setIntroduced] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const started = useRef(Date.now()), lock = useRef(false), recorded = useRef(false);
  const pendingKey = `math_pending_answer_${userId}`;
  const readPending = () => { try { return JSON.parse(localStorage.getItem(pendingKey) || 'null'); } catch { return null; } };
  const clearPending = () => { try { localStorage.removeItem(pendingKey); } catch {} };
  const load = async () => {
    setBusy(true); setError('');
    try {
      const pending = readPending();
      let data;
      if (pending?.sessionId && pending?.payload?.questionId) {
        // If the previous response was lost, replay safely against the saved server answer.
        data = await studentApi.practiceAnswer(pending.sessionId, pending.payload);
        clearPending(); setLastQuestion(pending.question); setFeedback(data.feedback);
        setSelected(pending.payload.answer);
      } else data = skillId ? await studentApi.practiceStart(skillId) : await studentApi.practiceActive();
      setSession(data);
      setIntroduced(Boolean(data?.answeredCount));
      started.current = Date.now();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  useEffect(() => { load(); }, [skillId, userId]);
  const submit = async () => {
    if (lock.current || !selected || !session?.currentQuestion) return;
    lock.current = true; setBusy(true); setError('');
    const question = session.currentQuestion;
    try {
      const pending = readPending();
      const payload = pending?.sessionId === session.sessionId && pending.payload.questionId === question.id ? pending.payload
        : { questionId: question.id, answer: selected, timeSpentSeconds: Math.min(3600, Math.max(0, Math.round((Date.now() - started.current) / 1000))) };
      try { localStorage.setItem(pendingKey, JSON.stringify({ sessionId: session.sessionId, payload, question })); } catch {}
      const data = await studentApi.practiceAnswer(session.sessionId, payload);
      clearPending();
      setLastQuestion(question); setFeedback(data.feedback); setSession(data);
      if (data.status === 'COMPLETED' && !recorded.current) { recorded.current = true; onComplete?.(data.result); }
    } catch (e) { setError(`${e.message} Lựa chọn của bạn vẫn được giữ; có thể thử gửi lại.`); }
    finally { lock.current = false; setBusy(false); }
  };
  const finish = async () => {
    if (!session || lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try {
      const pending = readPending();
      if (pending?.sessionId === session.sessionId) await studentApi.practiceAnswer(pending.sessionId, pending.payload);
      await studentApi.practiceAbandon(session.sessionId); clearPending(); onExit();
    }
    catch (e) { setError(e.message); } finally { lock.current = false; setBusy(false); }
  };
  const next = () => { setFeedback(null); setLastQuestion(null); setSelected(''); started.current = Date.now(); };
  const q = lastQuestion || session?.currentQuestion;
  return <section className="math-learning" aria-labelledby="practice-title">
    <button className="math-text-button" onClick={onExit}>← Về lộ trình {session?.status === 'IN_PROGRESS' ? '(giữ buổi học dở)' : ''}</button>
    <h1 id="practice-title">{session?.title || 'Luyện tập theo chủ đề'}</h1>
    {error && <div className="math-notice math-error" role="alert">{error} {!session && <button onClick={load}>Thử lại</button>}</div>}
    {busy && !session && <p role="status">Đang chuẩn bị buổi học…</p>}
    {!busy && !session && !error && <p>Chưa có buổi luyện dở. Hãy chọn một chủ đề trong lộ trình.</p>}
    {session && <>
      {session.reusedQuestionCount > 0 && <p className="math-notice">Kho chủ đề có câu bạn đã gặp. Làm lại giúp củng cố; chỉ câu mới ngoài pha khởi động được tính thêm bằng chứng năng lực.</p>}
      {!introduced && session.status === 'IN_PROGRESS' ? <div className="math-lesson">
        <h2>Ôn kiến thức trước khi làm bài</h2>
        {session.lesson ? <><MathRenderer content={session.lesson.theory} /><h3>Ví dụ mẫu</h3><MathRenderer content={session.lesson.example} /></>
          : <p>Chủ đề này chưa có mục lý thuyết riêng. Khi luyện, đọc lời giải từng câu trước khi chuyển tiếp.</p>}
        <p>Buổi học gồm khởi động, luyện tập và kiểm tra nhanh. Tiến độ được lưu sau mỗi câu.</p>
        <button className="math-primary" disabled={busy} onClick={() => { setIntroduced(true); started.current = Date.now(); }}>Bắt đầu luyện tập</button>
      </div> : <>
        {(q || feedback) && <div className="math-exercise">
          <p>{feedback ? 'Xem lại câu vừa làm' : phaseNames[session.phase]} · {session.answeredCount}/{session.totalQuestions} câu đã lưu</p>
          <progress max={session.totalQuestions} value={session.answeredCount} aria-label="Tiến độ buổi học" />
          {q && <><MathRenderer content={q.content} /><fieldset disabled={busy || Boolean(feedback)}><legend>Chọn một đáp án</legend>
            {q.options.map(o => <label key={o.key} className={`math-option ${selected === o.key ? 'selected' : ''}`}>
              <input type="radio" name="practice-answer" value={o.key} checked={selected === o.key} onChange={() => setSelected(o.key)} />
              <strong>{o.key}.</strong><MathRenderer content={o.content} />
            </label>)}</fieldset></>}
          {feedback ? <div aria-live="polite"><h3>{feedback.isCorrect ? 'Đúng rồi' : `Đáp án đúng: ${feedback.correctOptionKey}`}</h3>
            <MathRenderer content={feedback.explanation || 'Câu hỏi chưa có lời giải chi tiết.'} /><p>{feedback.encouragement}</p>
            <button className="math-primary" onClick={next}>{session.status === 'COMPLETED' ? 'Xem kết quả buổi học' : 'Câu tiếp theo'}</button></div>
            : q && <button className="math-primary" disabled={busy || !selected} onClick={submit}>{busy ? 'Đang lưu…' : 'Kiểm tra đáp án'}</button>}
        </div>}
        {session.status === 'COMPLETED' && !feedback && <div className="math-lesson" role="status">
          <h2>Đã lưu buổi học</h2><p>Đúng {session.result.correctCount}/{session.result.total} câu; kiểm tra nhanh: {session.result.checkCorrect}/{session.result.checkTotal}.</p>
          <p>Thêm {session.result.newEvidenceCount} câu mới vào hồ sơ năng lực. Câu sai đã được đưa vào sổ lỗi và lịch ôn.</p>
          <p>Kết quả một buổi chưa đủ để khẳng định đã thành thạo cả chủ đề. Lộ trình sẽ dựa trên toàn bộ bằng chứng hiện có.</p>
          <button className="math-primary" onClick={onExit}>Xem lộ trình cập nhật</button>
        </div>}
      </>}
      {session.status === 'IN_PROGRESS' && <button className="math-text-button" disabled={busy} onClick={finish}>Kết thúc buổi này và giữ các câu đã lưu</button>}
    </>}
  </section>;
}
