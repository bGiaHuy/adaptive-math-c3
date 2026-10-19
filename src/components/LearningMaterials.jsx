import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, Check, FileText, RefreshCw, Search } from 'lucide-react';
import { curriculumApi } from '../lib/apiClient';
import { useRouteState } from '../lib/navigationState';
import { TeacherPagination, teacherSearch } from './TeacherListControls';
import CurriculumExplorer from './CurriculumExplorer';
import SourceQuestions from './SourceQuestions';
import './learning-materials.css';

const examTypes = { GIUA_HK1: 'Giữa học kỳ I', CUOI_HK1: 'Cuối học kỳ I', GIUA_HK2: 'Giữa học kỳ II', CUOI_HK2: 'Cuối học kỳ II', KHAO_SAT_THI_THU: 'Khảo sát / thi thử' };

function DocumentPage({ paper, number }) {
  const [state, setState] = useState('loading'), [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(false);
  const holder = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setVisible(true); observer.disconnect(); } }, { rootMargin: '500px' });
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);
  return <figure className="lm-document-page" id={`material-page-${number}`} ref={holder}>
    <figcaption>Trang {number} / {paper.pageCount}{paper.answerPages.includes(number) ? ' · Có tiêu đề đáp án / hướng dẫn chấm' : ''}</figcaption>
    {visible && <>
      {state === 'loading' && <p role="status">Đang tải trang {number}…</p>}
      {state === 'error' ? <div role="alert"><p>Chưa tải được trang {number}.</p><button onClick={() => { setState('loading'); setAttempt(n => n + 1); }}>Thử lại</button><a href={`${curriculumApi.materialFileUrl(paper.id)}#page=${number}`} target="_blank" rel="noopener noreferrer">Mở trang trong PDF</a></div> : <img key={attempt} src={curriculumApi.materialPageUrl(paper.id, number)} alt={`Trang ${number} của ${paper.title}. Bản gốc có đầy đủ câu hỏi, hình và bảng.`} onLoad={() => setState('ready')} onError={() => setState('error')} />}
    </>}
  </figure>;
}

function PaperReader({ paper, onBack }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); window.scrollTo({ top: 0 }); }, [paper.id]);
  return <section className="lm-reader" aria-labelledby="lm-reader-title">
    <button className="lm-back" onClick={onBack}><ArrowLeft size={17} />Về danh sách học liệu</button>
    <header className="lm-reader-heading"><div><span className="lm-eyebrow">LỚP {paper.grade} · {examTypes[paper.examType] || 'Đề tham khảo'}</span><h2 id="lm-reader-title" tabIndex={-1} ref={heading}>{paper.title}</h2><p>{paper.school} · {paper.pageCount} trang · {(paper.sizeBytes / 1024 / 1024).toFixed(1)} MB</p></div><a className="lm-primary" href={curriculumApi.materialFileUrl(paper.id)} target="_blank" rel="noopener noreferrer">Mở PDF gốc<ArrowUpRight size={17} /></a></header>
    <div className="lm-reader-note"><BookOpen size={20} /><p>Đây là đề gốc để đọc và đối chiếu. Cấu trúc và phần tự luận được giữ nguyên; tài liệu này chưa được dùng để chấm bài tự động.</p></div>
    <nav className="lm-reader-tools" aria-label="Đi tới trang tài liệu"><label>Đi tới trang<select defaultValue="1" onChange={e => document.getElementById(`material-page-${e.target.value}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{Array.from({length:paper.pageCount}, (_, i) => <option key={i} value={i+1}>Trang {i+1}{paper.answerPages.includes(i+1) ? ' · Đáp án / hướng dẫn' : ''}</option>)}</select></label><a href={paper.sourcePageUrl} target="_blank" rel="noopener noreferrer">Xem trang nguồn<ArrowUpRight size={16} /></a></nav>
    {Array.from({length:paper.pageCount}, (_, i) => <DocumentPage key={`${paper.id}-${i}`} paper={paper} number={i+1} />)}
    <footer className="lm-source-note">Nguồn thu thập: <a href={paper.sourcePageUrl} target="_blank" rel="noopener noreferrer">TOANMATH / đơn vị ra đề</a>. Giữ thông tin tác giả và đơn vị khi sử dụng; chưa xác lập quyền tái xuất bản công khai.</footer>
  </section>;
}

export default function LearningMaterials({ initialGrade = 10, reviewedBank }) {
  const [data, setData] = useState(null), [error, setError] = useState(''), [loading, setLoading] = useState(true), [reload, setReload] = useState(0);
  const [grade, setGrade] = useRouteState('materialGrade', [10,11,12].includes(Number(initialGrade)) ? Number(initialGrade) : 10);
  const [tab, setTab] = useRouteState('materialTab', 'papers');
  const [paperId, setPaperId] = useRouteState('material', null);
  const [query, setQuery] = useRouteState('materialSearch', ''), [exam, setExam] = useRouteState('materialExam', ''), [year, setYear] = useRouteState('materialYear', ''), [answersOnly, setAnswersOnly] = useState(false);
  const [page, setPage] = useState(1);
  const lastPaper = useRef(null);
  useEffect(() => { let active=true; setLoading(true); setError(''); curriculumApi.getMaterials().then(value => { if(active) setData(value); }).catch(e => { if(active) setError(e.message || 'Chưa tải được học liệu.'); }).finally(() => { if(active) setLoading(false); }); return () => {active=false;}; }, [reload]);
  useEffect(() => setPage(1), [grade, query, exam, year, answersOnly]);
  const items = data?.items || [];
  const selected = items.find(p => p.id === paperId);
  const filtered = items.filter(p => p.grade === grade && (!query || teacherSearch(`${p.title} ${p.school} ${p.id}`).includes(teacherSearch(query))) && (!exam || p.examType === exam) && (!year || p.academicYear === year) && (!answersOnly || p.answerPages.length));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / 12)));
  const clear = () => {setQuery('');setExam('');setYear('');setAnswersOnly(false);};
  const back = () => {setPaperId(null);requestAnimationFrame(() => document.getElementById(`open-${lastPaper.current}`)?.focus());};
  if (selected) return <div className="learning-materials"><PaperReader paper={selected} onBack={back} /></div>;
  return <section className="learning-materials" aria-labelledby="lm-title">
    <header className="lm-heading"><div><span className="lm-eyebrow">KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span><h2 id="lm-title">Học liệu Toán THPT</h2><p>Tìm đề tham khảo, đọc bản gốc và đối chiếu đáp án.</p></div><button className="lm-refresh" aria-label="Tải lại học liệu" disabled={loading} onClick={() => setReload(n=>n+1)}><RefreshCw size={18}/></button></header>
    <div className="lm-grade-stats" role="group" aria-label="Chọn lớp">{[10,11,12].map((value,i)=><button className={`lm-grade lm-tone-${i}`} key={value} aria-pressed={grade===value} onClick={()=>setGrade(value)}><span>Lớp {value}{grade===value&&<Check size={17}/>}</span><strong>{data ? items.filter(p=>p.grade===value).length : '—'}</strong><small>tài liệu gốc</small></button>)}</div>
    <div className="lm-tabs" role="group" aria-label="Loại học liệu"><button aria-pressed={tab==='papers'} onClick={()=>setTab('papers')}><FileText size={17}/>Đề tham khảo</button><button aria-pressed={tab==='questions'} onClick={()=>setTab('questions')}><FileText size={17}/>Câu trích nguyên bản</button>{reviewedBank&&<button type="button" aria-pressed={tab==='reviewed'} onClick={()=>setTab('reviewed')}><Check size={17}/>Câu để giao bài</button>}<button aria-pressed={tab==='curriculum'} onClick={()=>setTab('curriculum')}><BookOpen size={17}/>Chương trình KNTT</button></div>
    {error&&<div className="lm-error" role="alert"><p>{error}</p><button disabled={loading} onClick={()=>setReload(n=>n+1)}>Thử tải lại</button></div>}
    {loading&&<div className="lm-loading" role="status">Đang tải danh mục học liệu…</div>}
    {!loading&&!error&&paperId&&!selected&&<div className="lm-error" role="alert">Đề này không có trong danh mục hiện tại.<button onClick={()=>setPaperId(null)}>Về danh sách</button></div>}
    {tab==='reviewed'&&reviewedBank?<><p>Các câu được đối chiếu với đề gốc và giải kiểm tra. Bản nháp thuộc tài khoản nhập liệu; chưa có lượt duyệt độc lập của người thứ hai.</p>{reviewedBank(grade)}</>:tab==='questions'?<SourceQuestions grade={grade}/>:tab==='curriculum'?<CurriculumExplorer key={grade} initialGrade={grade} showNotice={false} catalogOnly/>:<>
      <div className="lm-filters"><label className="lm-search">Tìm đề hoặc trường<div><Search size={18}/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ví dụ: Phú Lộc, cuối kỳ…"/></div></label><label>Kỳ kiểm tra<select value={exam} onChange={e=>setExam(e.target.value)}><option value="">Tất cả kỳ</option>{Object.entries(examTypes).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label>Năm học<select value={year} onChange={e=>setYear(e.target.value)}><option value="">Tất cả năm</option>{[...new Set(items.filter(p=>p.grade===grade).map(p=>p.academicYear))].sort().reverse().map(y=><option key={y}>{y}</option>)}</select></label><label className="lm-answer-check"><input type="checkbox" checked={answersOnly} onChange={e=>setAnswersOnly(e.target.checked)}/>Có trang đáp án được nhận diện</label></div>
      <div className="lm-result-count"><p role="status">{filtered.length} tài liệu · Lớp {grade}</p>{(query||exam||year||answersOnly)&&<button onClick={clear}>Xóa bộ lọc</button>}<span>Đề gốc giữ nguyên hình, bảng và cấu trúc.</span></div>
      {!loading&&!error&&!filtered.length&&<div className="lm-empty"><BookOpen size={28}/><h3>Chưa tìm thấy đề phù hợp</h3><p>Thử tên trường ngắn hơn hoặc bỏ bớt bộ lọc.</p><button onClick={clear}>Xóa bộ lọc</button></div>}
      <div className="lm-paper-grid">{filtered.slice((currentPage-1)*12,currentPage*12).map(p=><article className="lm-paper-card" key={p.id}><div className="lm-paper-meta"><span>{examTypes[p.examType]||'Đề tham khảo'}</span><span>{p.academicYear}</span></div><h3>{p.title}</h3><p>{p.school}</p><div className="lm-paper-facts"><span>{p.documentKind === 'COLLECTION' ? 'Tuyển tập · ' : ''}{p.pageCount} trang</span><span>{p.answerPages.length?'Có trang đáp án được nhận diện':'Chưa xác định trang đáp án'}</span></div><button className="lm-open" id={`open-${p.id}`} onClick={()=>{lastPaper.current=p.id;setPaperId(p.id);}} aria-label={`Đọc ${p.title}`}>Đọc đề gốc<ArrowUpRight size={17}/></button></article>)}</div>
      {!loading&&!error&&<TeacherPagination page={currentPage} total={filtered.length} pageSize={12} onChange={n=>{setPage(n);document.getElementById('lm-title')?.scrollIntoView({block:'start'});}} label="tài liệu"/>}
    </>}
  </section>;
}

