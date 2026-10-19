import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const prev=JSON.parse(await fs.readFile('docs/evidence/math-question-types/api.json','utf8'));
const base='http://127.0.0.1:3000/api/v1';
async function api(path,{cookie,method='GET',body,status}={}){const r=await fetch(base+path,{method,headers:{origin:'http://127.0.0.1:3000',...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const data=await r.json();assert.equal(r.status,status||(method==='POST'&&!path.endsWith('/submit')&&!path.endsWith('/login')?201:200),JSON.stringify(data));return{data,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
const {teacherEmail,studentUsername,password}=prev.credentials;
const teacher=(await api('/auth/login',{method:'POST',body:{identifier:teacherEmail,password}})).cookie;
const student=(await api('/auth/login',{method:'POST',body:{identifier:studentUsername,password}})).cookie;
const bank=(await api('/admin/questions',{cookie:teacher})).data;const qs=Array.isArray(bank)?bank:bank.questions;
const batch=JSON.parse(await fs.readFile('docs/math-import/batch-004-hai-phong.json','utf8'));
const selected=batch.questions.map(p=>qs.find(q=>q.source?.file===p.source.file&&q.source?.questionNumber===p.source.questionNumber));assert.equal(selected.length,22);assert.ok(selected.every(q=>q?.status==='DRAFT'));
const expected={SINGLE_CHOICE:12,TRUE_FALSE:4,SHORT_ANSWER:6};const counts=Object.fromEntries(Object.keys(expected).map(k=>[k,selected.filter(q=>q.questionType===k).length]));assert.deepEqual(counts,expected);
const assignment=(await api(`/classrooms/${prev.classroom.id}/assignments`,{cookie:teacher,method:'POST',body:{title:'QA Hải Phòng 101 — mặc định12–4–6',durationMinutes:90,questionIds:[...selected].reverse().map(q=>q.id),questionCounts:expected}})).data.assignment;
const take=(await api(`/assignments/${assignment.id}/take`,{cookie:student})).data.assignment;
assert.deepEqual(take.questions.map(q=>q.questionType),[...Array(12).fill('SINGLE_CHOICE'),...Array(4).fill('TRUE_FALSE'),...Array(6).fill('SHORT_ANSWER')]);
const answers=selected.map(q=>q.questionType==='SINGLE_CHOICE'?{questionId:q.id,selectedOptionKey:q.options.find(o=>o.isCorrect).optionKey}:q.questionType==='TRUE_FALSE'?{questionId:q.id,response:{trueFalseAnswers:Object.fromEntries(q.statements.map(s=>[s.key,s.isCorrect]))}}:{questionId:q.id,response:{shortAnswer:q.shortAnswer.acceptedAnswers[0].replace('.',',')}});
await api(`/assignments/${assignment.id}/draft`,{cookie:student,method:'POST',body:{timeSpentSeconds:300,answers}});
const resume=(await api(`/assignments/${assignment.id}/take`,{cookie:student})).data.assignment;assert.equal(resume.draftAnswers.length,22);assert.equal(resume.startedAt,take.startedAt);assert.ok(resume.draftAnswers.some(a=>Object.values(a.response?.trueFalseAnswers||{}).includes(false)));
const submission=(await api(`/assignments/${assignment.id}/submit`,{cookie:student,method:'POST',body:{timeSpentSeconds:600,answers}})).data;assert.equal(submission.score,10);assert.equal(submission.correctCount,22);
const score=(await api(`/classrooms/${prev.classroom.id}/assignments/${assignment.id}/submissions`,{cookie:teacher})).data;assert.equal(score.assignment.submittedCount,1);assert.equal(score.roster.find(s=>s.username===studentUsername).score,10);
await api('/admin/questions',{cookie:student,status:403});const after=(await api('/admin/questions',{cookie:teacher})).data;const afterQs=Array.isArray(after)?after:after.questions;assert.ok(selected.every(q=>afterQs.find(a=>a.id===q.id).status==='DRAFT'));
const evidence={at:new Date().toISOString(),credentials:prev.credentials,classId:prev.classroom.id,assignmentId:assignment.id,questionCounts:counts,questionIds:selected.map(q=>q.id),submission,scoreboard:score,checks:['default22 grouping SC12 TF4 SA6','reverse selection sorted server side','resume22 with false and comma','score10 correct22','student bank403','source22 remainDRAFT']};await fs.writeFile('docs/evidence/math-question-types/api-default22.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify({assignmentId:assignment.id,score:submission.score,correctCount:submission.correctCount,checks:evidence.checks},null,2));

