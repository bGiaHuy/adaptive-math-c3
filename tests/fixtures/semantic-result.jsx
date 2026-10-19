import React from 'react';
import {createRoot} from 'react-dom/client';
import ExamResultDialog from '/src/components/ExamResultDialog.jsx';
import '/src/index.css';import '/src/site-polish.css';import '/src/semantic-ui.css';import 'katex/dist/katex.min.css';
const cases=[{}, {studentSelectedKey:'B',isCorrect:false}, {studentSelectedKey:'A',isCorrect:true}, {response:{shortAnswer:'0'},questionType:'SHORT_ANSWER'}, {response:{trueFalseAnswers:{a:false}},questionType:'TRUE_FALSE',isCorrect:false}, {studentSelectedKey:'B',isCorrect:false,pointsAwarded:.25}, {gradingMode:'EXCLUDE'}, {gradingMode:'FULL_CREDIT'}];
const questions=cases.map((q,i)=>({id:'q'+i,content:'Giải phương trình $x^2=9$.',skillTitle:'Phương trình bậc hai',explanation:'Cần xét cả hai nghiệm $x=3$ và $x=-3$.',options:[{key:'A',content:'$x=\\pm3$',isCorrect:true},{key:'B',content:'$x=3$'}],statements:['a','b','c','d'].map(key=>({key,content:'$3^2=9$',isCorrect:true})),shortAnswer:{acceptedAnswers:['3'],mode:'NUMERIC'},...q}));
createRoot(document.getElementById('root')).render(<ExamResultDialog data={{assignmentTitle:'Kiểm chứng trạng thái câu trả lời',score:5,totalQuestions:8,correctCount:1,timeSpentSeconds:300,questions}} onClose={()=>{}}/>);
