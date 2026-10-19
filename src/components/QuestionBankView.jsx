import LearningMaterials from './LearningMaterials';
import { LEGACY_BANK_PAUSED } from '../data/thptCurriculum';
import React, { useEffect, useState } from 'react';
import { TeacherPagination, TeacherPageSize, useTeacherPageSize, teacherSearch } from './TeacherListControls';
import { adminApi } from '../lib/apiClient';
import QuestionDisplay from './QuestionDisplay';
import './question-bank.css';

const difficulties = { EASY: 'Dễ', MEDIUM: 'Trung bình', HARD: 'Khó', VERY_HARD: 'Rất khó' };
const types = { SINGLE_CHOICE: 'Nhiều lựa chọn', TRUE_FALSE: 'Đúng / Sai', SHORT_ANSWER: 'Trả lời ngắn' };
const statuses = { DRAFT: 'Bản nháp', PUBLISHED: 'Đã xuất bản', ARCHIVED: 'Đã lưu trữ' };

export default function QuestionBankView() {
 return LEGACY_BANK_PAUSED ? <LearningMaterials reviewedBank={grade => <LegacyQuestionBankView key={grade} grade={grade} />} /> : <LegacyQuestionBankView />;
}
function LegacyQuestionBankView({ grade }) {
 const [pageSize, setPageSize] = useTeacherPageSize();
 const [questions, setQuestions] = useState([]);
 const [page, setPage] = useState(1);
 const [search, setSearch] = useState(''), [topic, setTopic] = useState('');
 const [type, setType] = useState(''), [difficulty, setDifficulty] = useState(''), [status, setStatus] = useState('');
 const [loading, setLoading] = useState(true), [loadError, setLoadError] = useState('');
 async function loadQuestions() {
  setLoading(true); setLoadError('');
  try { const data = await adminApi.getQuestions(); const rows = Array.isArray(data) ? data : data.questions || []; setQuestions(grade ? rows.filter(q => q.skill?.grade === grade).sort((a,b) => (a.source?.part || '').localeCompare(b.source?.part || '') || Number(a.source?.questionNumber) - Number(b.source?.questionNumber)) : rows); }
  catch (e) { setLoadError(e.message || 'Chưa tải được ngân hàng câu hỏi.'); }
  finally { setLoading(false); }
 }
 useEffect(() => { loadQuestions(); }, [grade]);
 useEffect(() => setPage(1), [search, topic, type, difficulty, status, pageSize]);
 const visible = questions.filter(q => (!topic || q.skillId === topic) && (!type || (q.questionType || 'SINGLE_CHOICE') === type) && (!difficulty || q.difficulty === difficulty) && (!status || q.status === status) && teacherSearch(`${q.id} ${q.content} ${q.skill?.chapter || ''} ${q.skill?.title || ''}`).includes(teacherSearch(search)));
 const currentPage = Math.min(page, Math.max(1, Math.ceil(visible.length / pageSize)));
 const filtered = search || topic || type || difficulty || status;
 const reset = () => { setSearch(''); setTopic(''); setType(''); setDifficulty(''); setStatus(''); };
 return <section className="question-bank-workspace" aria-label="Ngân hàng câu hỏi">
  <div className="qb-bank-intro"><h2>Duyệt câu hỏi</h2><p>Đọc đề, đối chiếu đáp án chuẩn và xem lời giải trước khi tạo đề.</p></div>
  <div className="question-bank-filters">
   <label className="qb-search">Tìm câu hỏi<input value={search} placeholder="Nội dung, chuyên đề hoặc ID câu hỏi" onChange={e => setSearch(e.target.value)} /></label>
   <label>Chuyên đề<select value={topic} onChange={e => setTopic(e.target.value)}><option value="">Tất cả chuyên đề</option>{[...new Map(questions.map(q => [q.skillId, q.skill])).entries()].filter(([, s]) => s).map(([id, s]) => <option key={id} value={id}>{[s.chapter, s.title].filter(Boolean).join(' · ')}</option>)}</select></label>
   <label>Loại câu<select value={type} onChange={e => setType(e.target.value)}><option value="">Tất cả loại câu</option>{Object.entries(types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
   <label>Độ khó<select value={difficulty} onChange={e => setDifficulty(e.target.value)}><option value="">Tất cả độ khó</option>{Object.entries(difficulties).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
   <label>Trạng thái<select value={status} onChange={e => setStatus(e.target.value)}><option value="">Tất cả trạng thái</option>{Object.entries(statuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
  </div>
  {loadError && <div role="alert"><p>{loadError}</p><button type="button" disabled={loading} onClick={loadQuestions}>Thử tải lại câu hỏi</button></div>}
  <div className="qb-results-toolbar"><p role="status">{loading ? 'Đang tải ngân hàng câu hỏi…' : `${visible.length} / ${questions.length} câu hỏi`}</p><div>{filtered && <button type="button" onClick={reset}>Xóa bộ lọc</button>}<TeacherPageSize value={pageSize} onChange={setPageSize} /></div></div>
  {!loading && !loadError && !visible.length && <div className="question-bank-empty"><h3>Không tìm thấy câu hỏi</h3><p>Thử từ khóa khác hoặc bỏ bộ lọc để xem thêm câu hỏi.</p><button type="button" onClick={reset}>Xóa bộ lọc</button></div>}
  <div className="qb-question-list">{visible.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((q, index) => {
   const number = String((currentPage - 1) * pageSize + index + 1).padStart(2, '0');
   return <QuestionDisplay variant="bank" key={q.id} question={q} number={number} className="qb-question" aria-labelledby={`qb-title-${q.id}`} solutionMode="disclosure"
    header={<header className="qb-card-heading"><div><h3 id={`qb-title-${q.id}`}>Câu {number}</h3><p>{types[q.questionType] || types.SINGLE_CHOICE}<span aria-hidden="true"> · </span>{difficulties[q.difficulty] || 'Chưa phân loại độ khó'}</p></div><span className={`qb-publication ${q.status === 'PUBLISHED' ? 'published' : 'draft'}`}>{statuses[q.status] || 'Chưa có trạng thái'}</span></header>}
    topic={[q.skill?.chapter, q.skill?.title].filter(Boolean).join(' / ') || 'Chưa gắn chuyên đề'}
    footer={<footer className="qb-card-footer"><details className="qb-technical"><summary>Thông tin câu hỏi</summary><dl className="qb-disclosure-content"><dt>ID câu hỏi</dt><dd>{q.id}</dd><dt>Rà soát nội dung</dt><dd>{q.source?.classification?.status === 'NEEDS_REVIEW' ? 'Cần rà soát nội dung' : 'Nhãn biên soạn'}</dd>{q.shortAnswer?.mode === 'NUMERIC' && <><dt>Sai số cho phép</dt><dd>{q.shortAnswer.tolerance ?? 1e-9}</dd></>}</dl></details></footer>} />;
  })}</div>
  <TeacherPagination pageSize={pageSize} page={currentPage} total={visible.length} onChange={setPage} label="câu hỏi" />
 </section>;
}
