import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-partial-load';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[];
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions')){if(state==='report-error'){status=503;body={message:'Không thể tải bài nộp lúc này'};}else body=fixture.assignmentReport(path.split('/').at(-2));}
else if(path.endsWith('/assignments')){if(state==='partial'&&path.includes('/c1/')){status=503;body={message:'Lỗi lớp1'};}else body={assignments:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};}
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions')){if(state==='bank-error'){status=503;body={message:'Lỗi tải câu hỏi kiểm thử'};}else body=fixture.bank;}
else if(/\/classrooms\/c\d$/.test(path))body={classroom:fixture.details(path.split('/').at(-1))};
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});



const checks=[];
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]]){
state='partial';await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-library',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.teacher-workspace>section[role=alert]');assert.ok(await p.$('.tl-record'));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`${out}/partial-${size}.png`});state='populated';await p.evaluate(()=>[...document.querySelectorAll('.teacher-workspace button')].find(b=>b.textContent==='Thử tải lại bài giao').click());await p.waitForFunction(()=>!document.querySelector('.teacher-workspace>section[role=alert]'));assert.ok((await p.$eval('.tw-pagination',e=>e.textContent)).includes('36'));checks.push(`${size}: c1 failure preserves c2 assignments; retry restores all36 and clears warning`);
}
state='partial';await p.goto('http://127.0.0.1:3000/#/teacher-classes?class=%22c1%22&classTab=%22gradebook%22',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForFunction(()=>document.body.textContent.includes('Cần tải đủ bài giao'));assert.equal(await p.$('.tw-student-list'),null);checks.push('Incomplete class assignment data does not produce an empty or misleading gradebook');assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
