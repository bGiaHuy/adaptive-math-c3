import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:3000/api/v1';
const evidence={at:new Date().toISOString(),checks:[]};
async function api(path,{cookie,method='GET',body,status}={}) {
 const res=await fetch(base+path,{method,headers:{origin:'http://127.0.0.1:3000',...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
 const data=await res.json(); if(status) assert.equal(res.status,status,`${path}: ${JSON.stringify(data)}`); else assert.ok(res.ok,`${path}: ${res.status} ${JSON.stringify(data)}`);
 return {data,cookie:res.headers.get('set-cookie')?.split(';')[0],status:res.status};
}
const suffix=Date.now().toString(36); const password='P@ssword123!';
const teacherEmail=`qa_mixed_t_${suffix}@adaptivemath.local`,studentUsername=`qa_mixed_s_${suffix}`,studentEmail=`${studentUsername}@adaptivemath.local`;
await api('/auth/register/teacher',{method:'POST',body:{email:teacherEmail,fullName:'QA Giáo viên ba dạng',password,schoolName:'QA Local'}});
await api('/auth/register/student',{method:'POST',body:{username:studentUsername,email:studentEmail,fullName:'QA Học sinh ba dạng',password}});
const teacher=(await api('/auth/login',{method:'POST',body:{identifier:teacherEmail,password}})).cookie;
const student=(await api('/auth/login',{method:'POST',body:{identifier:studentUsername,password}})).cookie;
const other=(await api('/auth/login',{method:'POST',body:{identifier:'thaynam@adaptivemath.vn',password}})).cookie;
const bank=(await api('/admin/questions',{cookie:teacher})).data;
const questions=Array.isArray(bank)?bank:bank.questions;
const pilot=JSON.parse(await fs.readFile('docs/math-import/pilot.json','utf8'));
const selected=pilot.questions.map(p=>questions.find(q=>q.source?.questionNumber===p.source.questionNumber && q.source?.file===p.source.file));
assert.ok(selected.every(Boolean),'All imported pilot questions visible'); assert.ok(selected.every(q=>q.status==='DRAFT'));
const before=selected.map(q=>({id:q.id,status:q.status,source:q.source}));
const classroom=(await api('/classrooms',{cookie:teacher,method:'POST',body:{name:'QA Toán 9 — ba dạng',grade:9,academicYear:'2026-2027'}})).data.classroom;
await api('/classrooms/join',{cookie:student,method:'POST',body:{code:classroom.inviteCode}});
const assignment=(await api(`/classrooms/${classroom.id}/assignments`,{cookie:teacher,method:'POST',body:{title:'QA Đề Hưng Yên — ba dạng',durationMinutes:45,questionIds:selected.map(q=>q.id),questionCounts:{SINGLE_CHOICE:1,TRUE_FALSE:1,SHORT_ANSWER:1}}})).data.assignment;
const taking=(await api(`/assignments/${assignment.id}/take`,{cookie:student})).data.assignment;
for(const q of taking.questions){assert.ok(!('shortAnswer' in q));assert.ok(!('explanation' in q));for(const x of [...q.options,...q.statements])assert.ok(!('isCorrect' in x));}
evidence.checks.push('take strips answers and grading rules');
const answers=selected.map(q=>q.questionType==='SINGLE_CHOICE'?{questionId:q.id,selectedOptionKey:q.options.find(o=>o.isCorrect).optionKey}:q.questionType==='SHORT_ANSWER'?{questionId:q.id,response:{shortAnswer:'-6'}}:{questionId:q.id,response:{trueFalseAnswers:Object.fromEntries(q.statements.map((s,i)=>[s.key,i===3?!s.isCorrect:s.isCorrect]))}});
await api(`/assignments/${assignment.id}/draft`,{cookie:student,method:'POST',body:{timeSpentSeconds:100,answers}});
const resumed=(await api(`/assignments/${assignment.id}/take`,{cookie:student})).data.assignment;
assert.equal(resumed.draftAnswers.length,3);assert.equal(resumed.startedAt,taking.startedAt);assert.equal(resumed.isSubmitted,false);
await api(`/assignments/${assignment.id}/result`,{cookie:student,status:404});
const submission=(await api(`/assignments/${assignment.id}/submit`,{cookie:student,method:'POST',body:{timeSpentSeconds:180,answers}})).data;
assert.equal(submission.score,8.3); // SC1 + TF.5 + SA1 = 2.5/3
const result=(await api(`/assignments/${assignment.id}/result`,{cookie:student})).data;
const scoreboard=(await api(`/classrooms/${classroom.id}/assignments/${assignment.id}/submissions`,{cookie:teacher})).data;
await api(`/classrooms/${classroom.id}/assignments/${assignment.id}/submissions`,{cookie:other,status:403});
await api('/admin/questions',{cookie:student,status:403});
await api(`/assignments/${assignment.id}/draft`,{cookie:student,method:'POST',body:{timeSpentSeconds:200,answers:[]},status:400});
const afterBank=(await api('/admin/questions',{cookie:teacher})).data;const afterQs=Array.isArray(afterBank)?afterBank:afterBank.questions;
assert.deepEqual(before,selected.map(q=>{const after=afterQs.find(x=>x.id===q.id);return{id:after.id,status:after.status,source:after.source};}));
evidence.checks.push('draft resume preserves timer','result blocked before submit','TF partial credit','student bank forbidden','cross-class teacher forbidden','late draft forbidden','imported DRAFT sources unchanged');
Object.assign(evidence,{credentials:{teacherEmail,studentUsername,studentEmail,password},classroom,assignment,submission,result,scoreboard,questionIds:selected.map(q=>q.id)});
await fs.writeFile('docs/evidence/math-question-types/api.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify({credentials:evidence.credentials,classId:classroom.id,assignmentId:assignment.id,score:submission.score,checks:evidence.checks},null,2));


if(process.argv.includes('--default22')) await import('./verify-math-default22.mjs');
