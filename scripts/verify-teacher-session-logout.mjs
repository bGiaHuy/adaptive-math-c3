import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-session-logout';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[],reportRequests=0;
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/sessions')){if(state==='session-error'){status=503;body={message:'Không thể tải phiên kiểm thử'};}else body={sessions:state==='empty'?[]:[{id:'current',isCurrent:true,userAgent:'Chrome/ Windows NT 10.0',createdAt:'2026-10-18T01:00:00Z'},{id:'other',userAgent:'Android Chrome/',ipAddress:'192.0.2.10',createdAt:'2026-10-18T01:00:00Z'}].filter(sess=>state!=='revoked'||sess.id!=='other')};}
else if(path.endsWith('/revoke')||path.endsWith('/auth/logout-all')||path.endsWith('/auth/logout')){body={success:true};}
else if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
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
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]])for(const action of ['current','all']){
await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-overview',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.account-menu');await p.$eval('.account-menu',e=>e.open=true);await p.evaluate(()=>[...document.querySelectorAll('.account-menu button')].find(b=>b.textContent==='Phiên đăng nhập').click());await p.waitForSelector('.session-device');
if(action==='current')await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent==='Đăng xuất').click());else{await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent.includes('Đăng xuất tất cả thiết bị')).click());await p.waitForFunction(()=>[...document.querySelectorAll('.session-dialog button')].some(b=>b.textContent.trim()==='Xác nhận'));await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent.trim()==='Xác nhận').click());}
await p.waitForFunction(()=>!document.querySelector('.account-menu')&&!document.querySelector('.session-dialog')&&location.hash==='');assert.equal(await p.evaluate(()=>document.body.style.overflow),'');assert.ok(await p.evaluate(()=>document.body.innerText.includes('Đăng nhập')));await p.screenshot({path:`${out}/${action}-${size}.png`});checks.push(`${size}: ${action} fixture logout clears teacher UI, dialog, URL context and body lock`);
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
