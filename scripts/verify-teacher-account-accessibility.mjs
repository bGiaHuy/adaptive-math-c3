import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-account-accessibility';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[],reportRequests=0;
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/sessions')){if(state==='session-error'){status=503;body={message:'Không thể tải phiên kiểm thử'};}else body={sessions:state==='empty'?[]:[{id:'current',isCurrent:true,userAgent:'Chrome/ Windows NT 10.0',createdAt:'2026-10-18T01:00:00Z'},{id:'other',userAgent:'Android Chrome/',ipAddress:'192.0.2.10',createdAt:'2026-10-18T01:00:00Z'}].filter(sess=>state!=='revoked'||sess.id!=='other')};}
else if(path.endsWith('/revoke')){state='revoked';body={success:true};}
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




const checks=[],accessibility=[];
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]]){
state='populated';await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-overview',{waitUntil:'networkidle2'});await p.waitForSelector('.account-menu');
for(const label of ['Phiên đăng nhập','Đổi mật khẩu']){
await p.$eval('.account-menu',e=>e.open=true);await p.evaluate(label=>[...document.querySelectorAll('.account-menu button')].find(b=>b.textContent===label).click(),label);await p.waitForSelector('.account-dialog');if(label==='Phiên đăng nhập')await p.waitForSelector('.session-device');
await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const violations=await p.evaluate(async()=>{const result=await axe.run(document.querySelector('.account-dialog'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});accessibility.push({size,label,violations});
await p.$eval('.account-dialog [aria-label="Đóng"]',e=>e.focus());await p.keyboard.down('Shift');await p.keyboard.press('Tab');await p.keyboard.up('Shift');assert.equal(await p.evaluate(()=>!!document.activeElement.closest('.account-dialog')),true);await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Đóng');
if(label==='Phiên đăng nhập'){await p.evaluate(()=>[...document.querySelectorAll('.session-dialog button')].find(b=>b.textContent==='Thu hồi').click());await p.waitForFunction(()=>document.querySelectorAll('.session-device').length===1);assert.ok(await p.$eval('.session-device',e=>e.textContent.includes('Phiên hiện tại')));await p.screenshot({path:`${out}/revoked-${size}.png`});checks.push(`${size}: successful other-session revoke refreshes list and preserves current session`);}
await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('.account-dialog'));checks.push(`${size}: ${label} Tab/Shift+Tab trap and Escape`);
}
}
fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,accessibility,errors},null,2));console.log(JSON.stringify({checks,accessibility,errors}));assert.deepEqual(errors,[]);assert.ok(accessibility.every(r=>r.violations.length===0));
}finally{await b.close();}
