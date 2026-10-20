import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectQuestion,rectangularAnswerKeys} from '../scripts/lib/question-extraction-review.mjs';
import {independentCalculation} from '../scripts/lib/independent-question-calculation.mjs';
const sc={questionType:'SINGLE_CHOICE',content:'Tìm đáp án đúng.',options:'ABCD'.split('').map((key,i)=>({key,content:String(i)})),correctOption:'A'};
test('review catches lost symbols, repeated options and unrendered math without approving clean records',()=>{
 assert.deepEqual(inspectQuestion(sc),[]);
 const result=inspectQuestion({...sc,content:'Cho \\mathbb{R} và \uF0DE.',options:sc.options.map(o=>({...o,content:'a a a ∆= − .'}))});
 for(const f of ['SYMBOL_FONT','DUPLICATE_OPTIONS','UNDELIMITED_LATEX','FRAGMENTED_MATH'])assert.ok(result.includes(f));
});
test('review checks answers, figures, boundaries and real KaTeX compilation',()=>{
 const result=inspectQuestion({...sc,content:'Theo hình bên $\\notARealCommand{x}$. Câu 2: tiếp theo',correctOption:null});
 for(const f of ['MISSING_FIGURE','LATEX_SYNTAX','MISSING_KEY','QUESTION_BOUNDARY'])assert.ok(result.includes(f));
 assert.ok(inspectQuestion({questionType:'ESSAY',content:'Tính tích phân.',explanation:'Barem tự luận được lưu trong PDF'}).includes('MISSING_ESSAY_RUBRIC'));
});
test('table lookup selects the exact exam column and part, not the first letter in prose',()=>{
 const keys=rectangularAnswerKeys([{num:7,text:'PHẦN I. Trắc nghiệm\n101 102 103 104\n1 A D B B\n2 A C A D\nPHẦN II. Đúng sai\n101 102\n1 A B\nPHẦN III. Trả lời ngắn\n101 102 103 104\n1 1 56 -34 7'}],'103');
 assert.equal(keys.I.get(1).answer,'B');assert.equal(keys.I.get(2).answer,'A');assert.equal(keys.III.get(1).answer,'-34');
 assert.equal(rectangularAnswerKeys([{num:7,text:'1 A D B B'}],'101').I.size,0);
});
test('conflicting source tables remain unconfirmed',()=>{
 const keys=rectangularAnswerKeys([{num:1,text:'PHẦN I\n101 102\n1 A B'},{num:2,text:'PHẦN I\n101 102\n1 C B'}],'101');assert.equal(keys.I.size,0);
});
test('independent arithmetic flags known wrong extracted keys without approving source fidelity',()=>{
 const q={...sc,content:'Có bao nhiêu cách chọn ngẫu nhiên 3 quyển sách từ 15 quyển sách khác nhau?',options:[{key:'A',content:'2730.'},{key:'B',content:'455.'},{key:'C',content:'6.'},{key:'D',content:'5.'}],correctOption:'C'};
 const result=independentCalculation(q);assert.equal(result.value,455);assert.equal(result.calculatedOption,'B');assert.equal(result.keyMatches,false);assert.equal(result.sourceVisualReviewRequired,true);
 assert.equal(independentCalculation({...q,content:'Chọn sách như hình bên.'}),null);
 const range=independentCalculation({...sc,content:'Số sản phẩm được ghi lại như sau: 30 26 28 28 25 33 27 35 29 Khoảng biến thiên là',options:[{key:'A',content:'6.'},{key:'D',content:'10.'}]});assert.equal(range.value,10);assert.equal(range.calculatedOption,'D');
});
