import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-password-recovery';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[],reportRequests=0;
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/change-password')){await new Promise(ok=>setTimeout(ok,400));if(state==='password-error'){status=503;body={message:'Chưa đổi được mật khẩu kiểm thử. Thử lại.'};}else body={success:true};}
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
state='populated';await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-overview',{waitUntil:'networkidle2'});await p.waitForSelector('.account-menu');await p.$eval('.account-menu',e=>e.open=true);await p.evaluate(()=>[...document.querySelectorAll('.account-menu button')].find(b=>b.textContent==='Đổi mật khẩu').click());await p.waitForSelector('.account-dialog');await p.type('[aria-label="Mật khẩu hiện tại"]','fixture-old');await p.type('[aria-label="Mật khẩu mới"]','fixture-new');await p.type('[aria-label="Nhập lại mật khẩu mới"]','fixture-new');state='password-error';await p.click('.account-dialog button[type=submit]');await p.waitForFunction(()=>document.querySelector('.account-dialog button[type=submit]').disabled);await p.waitForFunction(()=>document.querySelector('.account-dialog')?.textContent.includes('Chưa đổi được mật khẩu kiểm thử'));assert.ok(await p.$('.account-dialog [role=alert]'));assert.equal(await p.$eval('[aria-label="Mật khẩu mới"]',e=>e.value),'fixture-new');await p.screenshot({path:`${out}/error-${size}.png`});state='password-success';await p.click('.account-dialog button[type=submit]');await p.waitForFunction(()=>document.querySelector('.account-dialog')?.textContent.includes('Đổi mật khẩu thành công'));assert.ok(await p.$('.account-dialog [role=status]'));await p.screenshot({path:`${out}/success-${size}.png`});await p.waitForFunction(()=>!document.querySelector('.account-dialog'));assert.equal(await p.evaluate(()=>document.body.style.overflow),'');checks.push(`${size}: submit disabled while pending; failed request retains inputs; retry success closes dialog and restores scrolling`);
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors,scope:'Intercepted auth API; no real password changed'},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
