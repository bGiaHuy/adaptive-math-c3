import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-mixed-review';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[],reportRequests=0;
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions')){reportRequests++;if(state==='report-error'){status=503;body={message:'Không thể tải bài nộp lúc này'};}else {body=fixture.assignmentReport(path.split('/').at(-2));body.questions=body.questions.map((q,i)=>({...q,gradingMode:i===5?'EXCLUDE':i===6?'FULL_CREDIT':q.gradingMode,...(i===7?{questionType:'TRUE_FALSE',options:[],statements:['a','b','c','d'].map(key=>({key,content:'Một khẳng định',isCorrect:true}))}:{})}));body.roster[0].answers=body.roster[0].answers.map((a,i)=>({...a,isCorrect:i===4?null:![1,2,3,7].includes(i),pointsAwarded:i===3?0.25:0,selectedOptionKey:[2,7].includes(i)?null:i===1||i===3?'B':'A',response:i===7?{trueFalseAnswers:{a:false}}:null}));}}
else if(path.endsWith('/assignments'))body={assignments:state==='empty'?[]:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions')){if(state==='bank-error'){status=503;body={message:'Lỗi tải câu hỏi kiểm thử'};}else body=fixture.bank;}
else if(/\/classrooms\/c\d$/.test(path))body={classroom:fixture.details(path.split('/').at(-1))};
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});




const checks=[],accessibility=[];
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]]){
await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-library?report=%22a3%22&reportTab=%22analytics%22',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.ar-analysis-question');await p.$eval('.ar-analysis-question',e=>e.click());await p.waitForSelector('.tw-drawer .tw-student-list');await p.type('.tw-drawer .tw-list-search input','nguyen minh duc');await p.$eval('.tw-drawer tbody button',e=>e.click());await p.waitForSelector('.exam-result');
const states=await p.$$eval('.exam-result-question .exam-result-status',els=>els.slice(0,8).map(e=>e.className.split(' ').at(-1)));assert.deepEqual(states,['correct','incorrect','unanswered','partial','pending','excluded','credited','incomplete']);await p.evaluate(()=>[...document.querySelectorAll('.exam-result-toolbar button')].find(b=>b.textContent==='Cần ôn (4)').click());assert.equal(await p.$$('.exam-result-question').then(els=>els.length),4);
await p.$eval('.exam-result-grid button:nth-child(6)',e=>e.click());await p.waitForFunction(()=>document.querySelectorAll('.exam-result-question').length===22);assert.ok(await p.evaluate(()=>document.activeElement.classList.contains('exam-result-question')));assert.ok(await p.evaluate(()=>!!document.activeElement.querySelector('.excluded')));await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const violations=await p.evaluate(async()=>{const r=await axe.run(document.querySelector('.exam-result'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});accessibility.push({size,violations});await p.screenshot({path:`${out}/mixed-${size}.png`});await p.keyboard.press('Escape');await p.waitForSelector('.tw-drawer',{visible:true});await p.keyboard.press('Escape');checks.push(`${size}: eight answer-state labels, four review matches, jump resets filter and focuses selected question`);
}
fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,accessibility,errors},null,2));console.log(JSON.stringify({checks,accessibility,errors}));assert.deepEqual(errors,[]);assert.ok(accessibility.every(r=>!r.violations.length));
}finally{await b.close();}
