import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='keyboard',out='docs/evidence/teacher-keyboard';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[];
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions'))body=fixture.assignmentReport(path.split('/').at(-2));
else if(path.endsWith('/assignments'))body={assignments:state==='empty'?[]:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions'))body=fixture.bank;
else if(/\/classrooms\/c\d$/.test(path))body={classroom:fixture.details(path.split('/').at(-1))};
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});

const checks=[];await p.setViewport({width:1440,height:900});await p.goto('http://127.0.0.1:3000/#/teacher-classes',{waitUntil:'networkidle2'});await p.waitForSelector('.tp-class-row');
await p.evaluate(()=>{const trigger=[...document.querySelectorAll('.teacher-workspace button')].find(b=>b.textContent.trim()==='Tạo lớp');trigger.focus();trigger.click();});await p.waitForSelector('.tw-dialog');assert.equal(await p.evaluate(()=>document.body.style.overflow),'hidden');
await p.$eval('.tw-dialog button[type=submit],.tw-dialog button.tw-primary',e=>e.focus());await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Đóng');await p.keyboard.down('Shift');await p.keyboard.press('Tab');await p.keyboard.up('Shift');assert.equal(await p.evaluate(()=>document.activeElement.textContent),'Tạo lớp và mã mời');await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('.tw-dialog'));assert.equal(await p.evaluate(()=>document.activeElement.textContent.trim()),'Tạo lớp');assert.notEqual(await p.evaluate(()=>document.body.style.overflow),'hidden');checks.push('Create dialog traps Tab/Shift+Tab, Escape restores trigger and body scroll');
await p.goto('http://127.0.0.1:3000/#/teacher-library',{waitUntil:'networkidle2'});await p.waitForSelector('.tl-record');await p.$eval('.tl-record .tl-more',e=>e.open=true);await p.evaluate(()=>{const trigger=document.querySelector('.tl-record .tl-delete');trigger.focus();trigger.click();});await p.waitForSelector('.tw-dialog');await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('.tw-dialog'));assert.equal(await p.evaluate(()=>document.activeElement.textContent),'Xóa bài');checks.push('Delete dialog Escape restores exact trigger without mutation');
await p.evaluate(()=>[...document.querySelectorAll('.teacher-workspace button')].find(b=>b.textContent.trim()==='Tạo đề mới').click());await p.waitForSelector('.tec-method-picker');await p.focus('.tec [role=radio][tabindex="0"]');await p.keyboard.press('End');assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Nhập từ JSON');assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('aria-checked')),'true');await p.keyboard.press('Home');assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Tạo đề bằng AI');await p.keyboard.press('ArrowRight');assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Ngân hàng câu hỏi');assert.equal(await p.$$eval('.tec [role=radio][tabindex="0"]',x=>x.length),1);checks.push('Source method radios support Home/End/arrows, selection follows focus with one tab stop');
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
