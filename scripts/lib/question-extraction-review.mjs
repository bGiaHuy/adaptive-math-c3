import katex from 'katex';

export const reviewLabels={
 EMPTY_PROMPT:'Thiếu nội dung câu hỏi',INVALID_OPTIONS:'Thiếu hoặc sai cấu trúc 4 phương án A–D',EMPTY_OPTION:'Có phương án trống',DUPLICATE_OPTIONS:'Có phương án trùng nhau sau khi trích',MISSING_KEY:'Chưa có đáp án lựa chọn hợp lệ',INCOMPLETE_TRUE_FALSE:'Thiếu nội dung hoặc đáp án đúng/sai',MISSING_SHORT_ANSWER:'Chưa có đáp án trả lời ngắn',MISSING_ESSAY_RUBRIC:'Chưa trích lời giải/thang điểm tự luận',SYMBOL_FONT:'Còn ký tự font toán bị lỗi',LATEX_SYNTAX:'Công thức LaTeX không biên dịch được',UNDELIMITED_LATEX:'Lệnh LaTeX nằm ngoài vùng công thức',FRAGMENTED_MATH:'Nghi công thức bị đảo hoặc mất thứ tự; cần chép lại từ nguồn',MISSING_FIGURE:'Câu nhắc hình/bảng nhưng chưa có ảnh đi kèm',QUESTION_BOUNDARY:'Nội dung có dấu hiệu lẫn câu kế tiếp hoặc tiêu đề trang',PDF_MISSING:'Không tìm thấy PDF nguồn',PDF_HASH_MISMATCH:'PDF nguồn không khớp mã kiểm tra',PAGE_REFERENCE_INVALID:'Trang nguồn không hợp lệ',QUESTION_MARKER_NOT_FOUND:'Chưa tìm thấy số câu tại trang nguồn đã khai báo',EXAM_CODE_MISMATCH:'Trang nguồn có mã đề khác bản trích',ASSET_MISSING:'Thiếu hoặc sai đường dẫn ảnh',ASSET_HASH_MISMATCH:'Ảnh không khớp mã kiểm tra',EVIDENCE_MISSING:'Thiếu tệp bằng chứng trích xuất',SOURCE_KEY_MISMATCH:'Đáp án trích khác ô đáp án nguồn cùng mã đề',ANSWER_PAGE_NOT_CONFIRMED:'Trang được khai báo chưa có dấu hiệu là trang đáp án',SHARED_FIGURE:'Một ảnh đang được gắn cho nhiều câu; cần đối chiếu riêng',DUPLICATE_ID:'Trùng ID câu hỏi'
};
reviewLabels.UNFORMATTED_MATH='Ký hiệu toán ngoài vùng công thức; cần đối chiếu thứ tự và định dạng';
reviewLabels.INVALID_SHORT_ANSWER='Đáp án ngắn trích được chưa phải giá trị số rõ ràng';
reviewLabels.COLLECTION_SOURCE='Tài liệu tuyển tập có nhiều đề; cần xác định chính xác đề và trang đáp án';
reviewLabels.CALCULATION_KEY_MISMATCH='Đáp án trích mâu thuẫn phép tính độc lập trên nội dung chữ';
export function inspectQuestion(q){
 const flags=[],texts=[q.content||'',...(q.options||[]).map(o=>o.content||''),...(q.statements||[]).map(s=>s.content||'')];
 const add=f=>flags.push(f),nonempty=t=>String(t||'').replace(/[\s.,;:!]/g,'');
 if(!nonempty(q.content))add('EMPTY_PROMPT');
 if(q.questionType==='SINGLE_CHOICE'){
  if(q.options?.length!==4||[...(q.options||[])].map(o=>o.key).sort().join('')!=='ABCD')add('INVALID_OPTIONS');
  if(q.options?.some(o=>!nonempty(o.content)))add('EMPTY_OPTION');
  const normalized=(q.options||[]).map(o=>nonempty(o.content));
  if(normalized.length>1&&new Set(normalized).size<normalized.length)add('DUPLICATE_OPTIONS');
  if(!/^[ABCD]$/.test(q.correctOption||''))add('MISSING_KEY');
 }
 if(q.questionType==='TRUE_FALSE'&&(q.statements?.length!==4||q.statements.map(s=>s.key).sort().join('')!=='abcd'||q.statements.some(s=>!nonempty(s.content)||typeof s.isCorrect!=='boolean')))add('INCOMPLETE_TRUE_FALSE');
 if(q.questionType==='SHORT_ANSWER'){
  const answers=typeof q.shortAnswer==='object'&&q.shortAnswer!==null?q.shortAnswer.acceptedAnswers:[q.shortAnswer];
  if(!answers?.length||answers.every(a=>a==null||String(a).trim()===''))add('MISSING_SHORT_ANSWER');
  else if(answers.some(a=>!/^[-+]?\d+(?:[.,]\d+)?(?:\s*\/\s*[-+]?\d+(?:[.,]\d+)?)?$/.test(String(a).trim())))add('INVALID_SHORT_ANSWER');
 }
 if(q.questionType==='ESSAY'&&(!q.explanation?.trim()||/Barem tự luận được lưu|chưa.*(?:trích|lời giải)/iu.test(q.explanation)))add('MISSING_ESSAY_RUBRIC');
 for(const text of texts){
  if(/[\uE000-\uF8FF\uFFFD]/u.test(text))add('SYMBOL_FONT');
  const outside=text.replace(/\$\$([\s\S]*?)\$\$|\$([^$\n]*?)\$/g,(_,display,inline)=>{try{katex.renderToString(display??inline,{throwOnError:true,trust:false});}catch{add('LATEX_SYNTAX');}return ' ';});
  if(/\\[a-zA-Z]{2,}/.test(outside))add('UNDELIMITED_LATEX');
  if(/[=<>≤≥∈∩∪αβπ∞]|\b[a-z]\d\b/u.test(outside))add('UNFORMATTED_MATH');
  if(/(?:\b[a-z]\s+[a-z]\s+[a-z]\b|(?:sin|cos|tan|cot)\s+\d|\d\s+\d\s+\d\s+[a-z]|[=<>≤≥]\s*[.,;]?\s*$)/u.test(outside.trim()))add('FRAGMENTED_MATH');
 }
 if(/hình\s+(?:vẽ|bên|dưới)|đồ\s+thị\s+(?:bên|sau|dưới)|bảng\s+(?:biến\s+thiên|số\s+liệu)\s+(?:sau|dưới)/iu.test(q.content||'')&&!q.assets?.length)add('MISSING_FIGURE');
 if(/(?:\bCâu\s+\d+\s*[.:]|\[PAGE_\d+\]|--\s*\d+\s+of\s+\d+\s*--|Trang\s+\d+\s*\/\s*\d+)/iu.test(texts.join(' ')))add('QUESTION_BOUNDARY');
 return [...new Set(flags)];
}

// Only accept rectangular answer rows with an explicit column for this exam code.
// Other table layouts stay unconfirmed; never infer a key from nearby prose.
export function rectangularAnswerKeys(pages,examCode){
 const maps={I:new Map(),III:new Map()},ambiguous={I:new Set(),III:new Set()};
 for(const {text,num} of pages){let part=null,columns=null;
  for(const line of text.split('\n')){
   const h=line.match(/PHẦN\s+(III|II|IV|I)\b/iu);if(h){part=h[1].toUpperCase();columns=null;}
   const cells=line.trim().split(/\s+/);
   if(cells.length>=2&&cells.every(c=>/^\d{3,4}$/.test(c))){columns=cells;continue;}
   if(!maps[part]||!columns?.includes(String(examCode)))continue;
   const valid=part==='I'?v=>/^[ABCD]$/.test(v):v=>/^-?\d+(?:[.,]\d+)?$/.test(v);
   if(cells.length!==columns.length+1||!/^\d{1,2}$/.test(cells[0])||!cells.slice(1).every(valid))continue;
   const n=Number(cells[0]),answer=cells[columns.indexOf(String(examCode))+1];
   if(maps[part].has(n)&&maps[part].get(n).answer!==answer)ambiguous[part].add(n);
   else maps[part].set(n,{answer,page:num});
  }
 }
 for(const part of ['I','III'])for(const n of ambiguous[part])maps[part].delete(n);
 return maps;
}
