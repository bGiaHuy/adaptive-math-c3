const choose=(n,k)=>{if(!Number.isInteger(n)||!Number.isInteger(k)||k<0||k>n||n>2000)return null;let result=1;for(let i=1;i<=Math.min(k,n-k);i++)result=result*(n-i+1)/i;return result;};
const numeric=text=>{const s=String(text||'').trim().replace(/\.$/,'').trim();return /^[-+]?\d+(?:[.,]\d+)?$/.test(s)?Number(s.replace(',','.')):null;};
// Narrow, documented templates only. Results apply to the transcribed text, not
// to an unseen source diagram, and never publish or approve a question.
export function independentCalculation(q){
 const text=String(q.content||'').normalize('NFC').replace(/\s+/g,' ');let value=null,method='',m;
 if(/(?:mốt|Khoảng biến thiên)/iu.test(text)&&(m=text.match(/(?:sau\s*:|kết quả sau\s*:)\s*((?:\d+(?:[.,]\d+)?\s+){3,}\d+(?:[.,]\d+)?)(?:\s|$)/iu))){
  const numbers=m[1].trim().split(/\s+/).map(n=>Number(n.replace(',','.')));
  if(/mốt/iu.test(text)){const counts=new Map();for(const n of numbers)counts.set(n,(counts.get(n)||0)+1);const max=Math.max(...counts.values()),modes=[...counts].filter(([,n])=>n===max).map(([n])=>n);if(modes.length===1){value=modes[0];method=`Mốt: giá trị ${value} xuất hiện ${max} lần, nhiều nhất trong dãy đã trích.`;}}
  else{value=Math.max(...numbers)-Math.min(...numbers);method=`Khoảng biến thiên: ${Math.max(...numbers)} − ${Math.min(...numbers)} = ${value}.`;}
 }
 if((m=text.match(/phương sai[^.]*?bằng\s+(\d+(?:[.,]\d+)?)\s*[.]?\s*Tìm độ lệch chuẩn/iu))){value=Math.sqrt(Number(m[1].replace(',','.')));method=`Độ lệch chuẩn bằng căn bậc hai của phương sai: ${value}.`;}
 if((m=text.match(/chọn (?:ngẫu nhiên )?(\d+) quyển sách từ (\d+) quyển sách khác nhau/iu))){value=choose(Number(m[2]),Number(m[1]));method=`Chọn ${m[1]} trong ${m[2]} quyển sách, không xét thứ tự: C(${m[2]},${m[1]}) = ${value}.`;}
 if(/chọn\s+(?:một|1)\s+cây bút/iu.test(text)){
  const counts=[...text.matchAll(/(\d+)\s*cây bút\s+(?:xanh|đỏ|đen|vàng)/giu)].map(m=>Number(m[1]));
  if(counts.length===2){value=counts.reduce((a,b)=>a+b,0);method=`Quy tắc cộng cho hai nhóm bút khác màu: ${counts.join(' + ')} = ${value}.`;}
 }
 if(/chọn (?:một|1) đề tài/iu.test(text)){
  const counts=[...text.matchAll(/(\d+)\s*đề tài (?:lịch sử|thiên nhiên|văn hóa)/giu)].map(m=>Number(m[1]));
  if(counts.length===3){value=counts.reduce((a,b)=>a+b,0);method=`Chọn một đề tài trong ba nhóm: ${counts.join(' + ')} = ${value}.`;}
 }
 if(!Number.isFinite(value)||value===null)return null;
 const matches=(q.options||[]).filter(o=>numeric(o.content)!==null&&Math.abs(numeric(o.content)-value)<1e-8);
 const calculatedOption=matches.length===1?matches[0].key:null;
 return {value,method,calculatedOption,extractedKey:q.correctOption||null,keyMatches:calculatedOption&&q.correctOption?calculatedOption===q.correctOption:null,scope:'TRANSCRIBED_TEXT_ONLY',sourceVisualReviewRequired:true};
}
