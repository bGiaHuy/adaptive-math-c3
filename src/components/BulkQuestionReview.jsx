import React, {useEffect,useState} from 'react';
import {curriculumApi} from '../lib/apiClient';
import {TeacherPagination,teacherSearch,useQuestionPageNavigation} from './TeacherListControls';
import QuestionDisplay from './QuestionDisplay';
import MathRenderer from './MathRenderer';

export default function BulkQuestionReview({grade,deliveredOnly=false}){
 const [data,setData]=useState(null),[error,setError]=useState(''),[retry,setRetry]=useState(0),[query,setQuery]=useState(''),[paper,setPaper]=useState(''),[type,setType]=useState(''),[page,setPage]=useState(1);
 const [listRef,changePage]=useQuestionPageNavigation(page,setPage);
 useEffect(()=>{let active=true;setError('');curriculumApi.getBulkQuestionReview().then(d=>{if(active)setData(d);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[retry]);
 useEffect(()=>{setPaper('');setPage(1);},[grade]);useEffect(()=>setPage(1),[query,paper,type]);
 const gradeRows=(data?.items||[]).filter(q=>q.grade===grade&&(!deliveredOnly||q.delivery));
 const rows=gradeRows.filter(q=>(!paper||q.paperId===paper)&&(!type||q.questionType===type)&&(!query||teacherSearch([q.id,q.content,...q.options.map(o=>o.content)].join(' ')).includes(teacherSearch(query))));
 const current=Math.min(page,Math.max(1,Math.ceil(rows.length/10)));
 return <section className="question-bank-workspace bulk-question-review" aria-label={deliveredOnly?'Câu hỏi tham khảo':'Câu hỏi đang kiểm tra'}>
  <h2>{deliveredOnly?'Câu hỏi tham khảo':'Câu hỏi đang kiểm tra'}</h2>
  <p role="status">{data?`${(deliveredOnly?data.summary.delivered:data.summary.total).toLocaleString('vi-VN')} câu trong kho; ${gradeRows.length.toLocaleString('vi-VN')} câu lớp ${grade}.`:'Đang tải câu hỏi…'}</p>
  {error&&<div role="alert">{error}<button onClick={()=>setRetry(n=>n+1)}>Thử lại</button></div>}
  <div className="question-bank-filters"><label>Tìm nội dung hoặc mã câu hỏi<input value={query} onChange={e=>setQuery(e.target.value)}/></label><label>Tài liệu nguồn<select value={paper} onChange={e=>setPaper(e.target.value)}><option value="">Tất cả tài liệu</option>{[...new Set(gradeRows.map(q=>q.paperId))].map(id=><option key={id}>{id}</option>)}</select></label><label>Loại câu<select value={type} onChange={e=>setType(e.target.value)}><option value="">Tất cả loại câu</option><option value="SINGLE_CHOICE">Nhiều lựa chọn</option><option value="TRUE_FALSE">Đúng / Sai</option><option value="SHORT_ANSWER">Trả lời ngắn</option><option value="ESSAY">Tự luận</option></select></label></div>
  <p>{rows.length} câu phù hợp</p>
  <div ref={listRef} style={{scrollMarginTop:16,overflowAnchor:'none'}}>{rows.slice((current-1)*10,current*10).map(q=><QuestionDisplay key={q.id} variant="source" question={{questionType:q.questionType,explanation:q.delivery?.explanation}} showSolutions={!!q.delivery} className="qb-question"
   header={<header className="qd-heading"><div><h3>Câu {q.number} · Phần {String(q.part||'').replace(/^PART[-_]/,'')} · Mã {q.examCode}</h3><p style={{overflowWrap:'anywhere'}}>{q.id}</p></div><strong>{q.delivery?'Tham khảo':'Chưa hoàn thiện'}</strong></header>}
   promptContent={<div className="qd-prompt qd-reference-prompt"><MathRenderer content={q.content||'Chưa trích được nội dung chữ của câu này.'}/>{q.figures.map(f=><img key={f.id} loading="lazy" src={curriculumApi.bulkQuestionAssetUrl(f.id)} alt="Hình trích tự động, cần đối chiếu" style={{display:'block',maxWidth:'100%',maxHeight:360,objectFit:'contain'}}/>)}</div>}
   answerContent={<div>{q.options.map(o=><div key={o.key} style={{border:o.key===q.delivery?.correctOption?'2px solid black':'1px solid #8a9992',background:o.key===q.delivery?.correctOption?'#bbf7d0':undefined,padding:12,marginBottom:8}}><strong>{o.key}. </strong><MathRenderer content={o.content||'Chưa trích được phương án'}/></div>)}{q.statements.map(s=><div key={s.key} style={{border:'1px solid #8a9992',padding:12,marginBottom:8}}><strong>{s.key}) </strong>{q.delivery&&typeof s.isCorrect==='boolean'&&<strong style={{display:'inline-block',border:'2px solid black',borderRadius:'50%',background:'#bbf7d0',padding:6,marginRight:8}}>{s.isCorrect?'Đ':'S'}</strong>}<MathRenderer content={s.content||'Chưa trích được ý trả lời'}/></div>)}{q.delivery?.shortAnswer&&<div style={{display:'inline-block',border:'2px solid black',background:'#bbf7d0',padding:12}}><MathRenderer content={q.delivery.shortAnswer}/></div>}</div>}
   footer={<footer><p>{q.paperId} · Trang {q.sourcePages.join(', ')||'chưa xác định'}</p>{q.delivery?.warnings?.length>0&&<p role="note">Câu hỏi cần đối chiếu lại với tài liệu nguồn.</p>}</footer>}
  />)}</div>
  {data&&<TeacherPagination page={current} pageSize={10} total={rows.length} onChange={changePage} label="câu hỏi"/>}
 </section>;
}
