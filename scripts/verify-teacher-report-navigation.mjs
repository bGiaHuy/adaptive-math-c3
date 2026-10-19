import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-report-navigation';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[],reportRequests=0;
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions')){reportRequests++;if(state==='report-error'){status=503;body={message:'Không thể tải bài nộp lúc này'};}else body=fixture.assignmentReport(path.split('/').at(-2));}
else if(path.endsWith('/assignments'))body={assignments:state==='empty'?[]:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions')){if(state==='bank-error'){status=503;body={message:'Lỗi tải câu hỏi kiểm thử'};}else body=fixture.bank;}
else if(/\/classrooms\/c\d$/.test(path))body={classroom:fixture.details(path.split('/').at(-1))};
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});



const checks=[];await p.setViewport({width:1440,height:900});await p.goto('http://127.0.0.1:3000/#/teacher-classes?class=%22c1%22&classTab=%22gradebook%22',{waitUntil:'networkidle2'});await p.waitForSelector('.tw-student-list tbody tr');const before=reportRequests;await p.$eval('.tw-student-list tbody tr td:nth-child(2) button',e=>e.click());await p.waitForSelector('.exam-result');assert.ok((await p.$eval('#exam-result-title',e=>e.textContent)).includes('Nguyễn Minh Đức'));assert.equal(reportRequests-before,1);await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('.exam-result'));assert.ok(await p.$('.ar-results'));checks.push('Gradebook score opens the selected student in the chosen assignment using exactly one report request');await p.screenshot({path:out+'/report-desktop.png'});
await p.goto('http://127.0.0.1:3000/#/teacher-library',{waitUntil:'networkidle2'});await p.waitForSelector('.tl-record');const nextBefore=reportRequests;await p.evaluate(()=>document.querySelector('.tl-record .tl-open-results').click());await p.waitForSelector('.ar-results');assert.equal(reportRequests-nextBefore,1);checks.push('Library report opens with a single request');assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
