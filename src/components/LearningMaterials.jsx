import React, { useEffect, useState } from 'react';
import {adminApi,curriculumApi} from '../lib/apiClient';
import CurriculumExplorer from './CurriculumExplorer';
import BulkQuestionReview from './BulkQuestionReview';
import './learning-materials.css';

// The PDF collection is an internal extraction source, never a web document library.
export default function LearningMaterials({ initialGrade = 10, reviewedBank }) {
  const [grade,setGrade]=useState([10,11,12].includes(Number(initialGrade))?Number(initialGrade):10);
  const [tab,setTab]=useState(reviewedBank?'anti':'curriculum');
  const [counts,setCounts]=useState(null);
  useEffect(()=>{if(!reviewedBank)return;let active=true;Promise.all([adminApi.getQuestions(),curriculumApi.getBulkQuestionReview()]).then(([bank,bulk])=>{if(active){const rows=Array.isArray(bank)?bank:bank.questions||[];setCounts({ready:rows.length,pending:bulk.summary.total,delivered:bulk.summary.delivered||0,grades:Object.fromEntries([10,11,12].map(g=>[g,rows.filter(q=>q.skill?.grade===g).length])),pendingGrades:bulk.summary.byGrade});}}).catch(()=>{});return()=>{active=false;};},[!!reviewedBank]);
  return <section className="learning-materials" aria-labelledby="lm-title">
    <header className="lm-heading"><div><span className="lm-eyebrow">TOÁN THPT</span><h2 id="lm-title">Ngân hàng câu hỏi</h2><p>Tìm câu hỏi theo lớp, xem lời giải và chọn câu phù hợp để giao bài.</p></div></header>
    {counts&&<p className="lm-question-counts" role="status"><strong>{counts.ready.toLocaleString('vi-VN')} câu sẵn sàng giao bài</strong> · {counts.delivered.toLocaleString('vi-VN')} câu tham khảo. Lớp {grade}: {counts.grades[grade]} câu sẵn sàng giao bài.</p>}
    <div className="lm-grade-stats" role="group" aria-label="Chọn lớp">{[10,11,12].map((g,i)=><button key={g} className={`lm-grade lm-tone-${i}`} aria-pressed={grade===g} onClick={()=>setGrade(g)}>Lớp {g}</button>)}</div>
    <div className="lm-tabs" role="group" aria-label="Loại học liệu">{reviewedBank&&<><button aria-pressed={tab==='anti'} onClick={()=>setTab('anti')}>Câu hỏi tham khảo{counts?` (${counts.delivered.toLocaleString('vi-VN')})`:''}</button><button aria-pressed={tab==='questions'} onClick={()=>setTab('questions')}>Dùng để giao bài</button><button aria-pressed={tab==='bulk'} onClick={()=>setTab('bulk')}>Đang kiểm tra</button></>}<button aria-pressed={tab==='curriculum'} onClick={()=>setTab('curriculum')}>Chương trình học</button></div>
    {tab==='anti'&&reviewedBank?<BulkQuestionReview key={`anti-${grade}`} grade={grade} deliveredOnly/>:tab==='bulk'&&reviewedBank?<BulkQuestionReview grade={grade}/>:tab==='questions'&&reviewedBank?<><p>Chọn câu hỏi để tạo bài giao. Khi chỉnh sửa trong bài giao, thay đổi chỉ áp dụng cho bài đó.</p>{reviewedBank(grade,[])}</>:<CurriculumExplorer key={grade} initialGrade={grade} showNotice={false} catalogOnly/>}
  </section>;
}
