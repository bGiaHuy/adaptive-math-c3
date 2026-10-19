import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const e=JSON.parse(await fs.readFile('docs/evidence/math-question-types/api.json','utf8'));
const base='http://127.0.0.1:3000/api/v1';
async function api(path,body,cookie,expected=200){const r=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{'content-type':'application/json',origin:'http://127.0.0.1:3000',...(cookie?{cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});const data=await r.json();assert.equal(r.status,expected,JSON.stringify(data));return {data,cookie:r.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ')};}
const teacherEmail='qa_paper_teacher_'+Date.now()+'@adaptivemath.local';
await api('/auth/register/teacher',{email:teacherEmail,fullName:'QA đề hai chế độ',password:e.credentials.password,schoolName:'QA Local'},undefined,201);
const teacher=(await api('/auth/login',{identifier:teacherEmail,password:e.credentials.password})).cookie;
const bank=(await api('/admin/questions',undefined,teacher)).data;
const username='qa_paper_'+Date.now();
await api('/auth/register/student',{username,email:username+'@adaptivemath.local',fullName:'QA hai chế độ',password:e.credentials.password},undefined,201);
const student=(await api('/auth/login',{identifier:username,password:e.credentials.password})).cookie;
const start=(await api('/diagnostic/start',{},student,201)).data;
assert.equal(start.questions.length,22);
assert.deepEqual(start.questions.map(q=>q.questionType),[...Array(12).fill('SINGLE_CHOICE'),...Array(4).fill('TRUE_FALSE'),...Array(6).fill('SHORT_ANSWER')]);
for(const q of start.questions){assert.ok(!q.shortAnswer);assert.ok(!q.explanation);for(const x of [...(q.options||[]),...(q.statements||[])])assert.ok(!('isCorrect'in x));}
const answers=start.questions.map(s=>{const q=bank.find(row=>row.id===s.id);return q.questionType==='SINGLE_CHOICE'?{questionId:q.id,selectedOptionKey:q.options.find(o=>o.isCorrect).optionKey}:{questionId:q.id,response:q.questionType==='TRUE_FALSE'?{trueFalseAnswers:Object.fromEntries(q.statements.map(x=>[x.key,x.isCorrect]))}:{shortAnswer:q.shortAnswer.acceptedAnswers[0]}};});
await api('/diagnostic/draft',{attemptId:start.attemptId,answers},student);
const resume=(await api('/diagnostic/start',{},student,201)).data;
assert.deepEqual(resume.questions.map(q=>q.id),start.questions.map(q=>q.id));assert.equal(resume.draftAnswers.length,22);assert.ok(resume.timeRemainingSeconds<=start.timeRemainingSeconds);
const result=(await api('/diagnostic/submit/'+start.attemptId,{},student)).data;
assert.equal(result.scorePercentage,100);assert.equal(result.totalAnswered,22);
const replay=(await api('/diagnostic/submit/'+start.attemptId,{},student)).data;assert.equal(replay.alreadySubmitted,true);assert.equal(replay.scorePercentage,100);
await fs.writeFile('docs/evidence/math-question-types/full-paper-api.json',JSON.stringify({at:new Date().toISOString(),username,attemptId:start.attemptId,types:start.questions.map(q=>q.questionType),draftCount:resume.draftAnswers.length,result,replay},null,2));
console.log('Grouped22, safe full paper, draft/resume, shared deadline, bulk grading100%, idempotent submit: PASS');
