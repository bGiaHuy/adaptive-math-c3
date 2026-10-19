import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-sessions';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[],reportRequests=0;
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/sessions')){if(state==='session-error'){status=503;body={message:'Không thể tải phiên kiểm thử'};}else body={sessions:state==='empty'?[]:[{id:'current',isCurrent:true,userAgent:'Chrome/ Windows NT 10.0',createdAt:'2026-10-18T01:00:00Z'},{id:'other',userAgent:'Android Chrome/',ipAddress:'192.0.2.10',createdAt:'2026-10-18T01:00:00Z'}]};}
else if(path.endsWith('/revoke')){status=503;body={message:'Chưa thu hồi được phiên kiểm thử'};}
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
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]]){
state='populated';await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-overview',{waitUntil:'networkidle2'});await p.waitForSelector('.account-menu');state='session-error';await p.$eval('.account-menu',e=>e.open=true);await p.evaluate(()=>[...document.querySelectorAll('.account-menu button')].find(b=>b.textContent==='Phiên đăng nhập').click());await p.waitForSelector('.session-dialog [role=alert]');
state='populated';await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent.includes('Làm mới')).click());await p.waitForSelector('.session-device');assert.equal(await p.$$eval('.session-device',els=>els.length),2);assert.ok(await p.$eval('.session-dialog',e=>e.textContent.includes('IP: Không xác định')));
await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent==='Thu hồi').click());await p.waitForFunction(()=>document.querySelector('.session-dialog [role=alert]')?.textContent.includes('Chưa thu hồi'));assert.equal(await p.$$eval('.session-device',els=>els.length),2);
await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent.includes('Đăng xuất tất cả thiết bị')).click());await p.waitForFunction(()=>[...document.querySelectorAll('.session-dialog button')].some(b=>b.textContent.trim()==='Hủy'));await p.screenshot({path:`${out}/confirmation-${size}.png`});assert.equal(await p.$eval('.session-dialog',e=>e.scrollWidth>e.clientWidth),false);await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent.trim()==='Hủy').click());
state='empty';await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent.includes('Làm mới')).click());await p.waitForFunction(()=>document.querySelector('.session-dialog [role=status]')?.textContent.includes('Chưa có phiên'));await p.screenshot({path:`${out}/empty-${size}.png`});await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('.session-dialog'));checks.push(`${size}: load failure/retry; truthful missing IP; revoke failure retains sessions; logout confirmation/cancel; empty state; Escape; no modal overflow`);
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
