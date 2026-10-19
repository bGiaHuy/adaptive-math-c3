import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-account';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
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




const checks=[];
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]]){
await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-overview',{waitUntil:'networkidle2'});await p.waitForSelector('.account-menu');await p.$eval('.account-menu',e=>e.open=true);await p.evaluate(()=>[...document.querySelectorAll('.account-menu button')].find(b=>b.textContent==='Đổi mật khẩu').click());await p.waitForSelector('[role=dialog][aria-label="Đổi mật khẩu"]');await p.type('[aria-label="Mật khẩu hiện tại"]','fixture-old');await p.type('[aria-label="Mật khẩu mới"]','fixture-new');await p.type('[aria-label="Nhập lại mật khẩu mới"]','fixture-new');await p.$eval('[aria-label="Hiện mật khẩu"]',e=>e.click());await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('[role=dialog][aria-label="Đổi mật khẩu"]'));await p.$eval('.account-menu',e=>e.open=true);await p.evaluate(()=>[...document.querySelectorAll('.account-menu button')].find(b=>b.textContent==='Đổi mật khẩu').click());await p.waitForSelector('[aria-label="Mật khẩu hiện tại"]');assert.deepEqual(await p.$$eval('.account-dialog input',els=>els.map(e=>e.value)),['','','']);assert.deepEqual(await p.$$eval('.account-dialog input',els=>els.map(e=>e.type)),['password','password','password']);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`${out}/password-${size}.png`});await p.keyboard.press('Escape');checks.push(`${size}: Escape clears password fields and visibility before reopen; no password submission`);}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
