import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { curriculumApi } from '../lib/apiClient';
import QuestionDisplay from './QuestionDisplay';
import { TeacherPagination } from './TeacherListControls';

const labels={SINGLE_CHOICE:'Nhiều lựa chọn',TRUE_FALSE:'Đúng / Sai',SHORT_ANSWER:'Trả lời ngắn',ESSAY:'Tự luận'};

function SourceImage({question,segment}){
 const [failed,setFailed]=useState(false),[retry,setRetry]=useState(0);
 return failed?<div className="lm-error" role="alert">Chưa tải được ảnh câu hỏi.<button onClick={()=>{setFailed(false);setRetry(n=>n+1);}}>Thử lại</button></div>:<img key={retry} className="lm-question-image" src={curriculumApi.materialQuestionImageUrl(question.id,segment,question.imageHashes?.[segment-1])} loading="lazy" onError={()=>setFailed(true)} alt={`Bản gốc câu ${question.originalItemNumber}, phần ${question.part}, mã đề ${question.examCode}, trang ${question.sourcePages[segment-1]}. Hình ${segment} / ${question.images.length}.`}/>;
}

export default function SourceQuestions({grade,papers=[]}){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[reload,setReload]=useState(0),[type,setType]=useState(''),[page,setPage]=useState(1);
 const [paperId,setPaperId]=useState('');
 useEffect(()=>{let active=true;setLoading(true);setError('');curriculumApi.getMaterialQuestions().then(data=>{if(active)setItems(data.items);}).catch(e=>{if(active)setError(e.message||'Chưa tải được câu hỏi.');}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[reload]);
 useEffect(()=>{setPage(1);setPaperId('');},[grade]);
 useEffect(()=>setPage(1),[type,paperId]);
 const filtered=items.filter(q=>q.grade===grade&&(!type||q.originalType===type)&&(!paperId||q.paperId===paperId)),currentPage=Math.min(page,Math.max(1,Math.ceil(filtered.length/5)));
 return <section className="lm-source-questions" aria-labelledby="lm-questions-title"><header><h3 id="lm-questions-title">Câu hỏi trích từ đề gốc · Lớp {grade}</h3><p>Giữ nguyên nội dung, hình và bảng trong tài liệu của trường. Phần tự luận vẫn là tự luận. Các câu này dùng để đọc, chưa dùng chấm tự động.</p></header>
 <div className="lm-filters"><label>Dạng câu<select value={type} onChange={e=>setType(e.target.value)}><option value="">Tất cả dạng câu</option>{Object.entries(labels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><p role="status">{loading?'Đang tải câu hỏi…':`${filtered.length} câu trích nguyên bản`}</p></div>
 <label>Đề gốc<select aria-label="Lọc câu theo đề gốc" value={paperId} onChange={e=>setPaperId(e.target.value)}><option value="">Tất cả đề đã trích câu</option>{[...new Set(items.filter(q=>q.grade===grade).map(q=>q.paperId))].map(id=><option key={id} value={id}>{papers.find(p=>p.id===id)?.title||id}</option>)}</select></label>
 {error&&<div className="lm-error" role="alert"><p>{error}</p><button onClick={()=>setReload(n=>n+1)}>Thử tải lại</button></div>}
 {filtered.slice((currentPage-1)*5,currentPage*5).map(q=><QuestionDisplay key={q.id} variant="source" question={{questionType:q.originalType}} showSolutions={false} className="lm-source-question"
  header={<header className="qd-heading"><div><h3>Câu {q.originalItemNumber} · Phần {q.part}</h3><p>{labels[q.originalType]} · Mã đề {q.examCode} · Trang {q.sourcePages.join(', ')}</p></div><span className="lm-source-tag">Bản gốc</span></header>}
  promptContent={<div className="lm-source-prompt">{q.images.map((_,index)=><SourceImage key={index} question={q} segment={index+1}/>)}</div>}
  answerContent={<div className="lm-source-answer"><p>Xem đáp án, lời giải và barem trong tài liệu của trường. Chưa xác nhận độc lập để chấm tự động.</p><a href={`${curriculumApi.materialFileUrl(q.paperId)}#page=${q.answerPages[0]}`} target="_blank" rel="noopener noreferrer">Mở trang đáp án và lời giải<ArrowUpRight size={16}/></a></div>}
  footer={<a className="lm-source-original" href={`${curriculumApi.materialFileUrl(q.paperId)}#page=${q.sourcePages[0]}`} target="_blank" rel="noopener noreferrer">Đối chiếu trang PDF gốc<ArrowUpRight size={15}/></a>}
 />)}
 {!loading&&!error&&<TeacherPagination page={currentPage} pageSize={5} total={filtered.length} onChange={n=>{setPage(n);document.getElementById('lm-questions-title')?.scrollIntoView({block:'start'});}} label="câu trích"/>}
 </section>;
}
