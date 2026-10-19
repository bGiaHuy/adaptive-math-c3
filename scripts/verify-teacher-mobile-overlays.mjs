import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-mobile-overlays';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
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





const checks=[],geometry=[];
for(const [size,width,height]of[['phone',390,844],['small-phone',360,640],['tablet',820,1000]]){
await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-library?report=%22a3%22&reportTab=%22paper%22',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.tw-paper-tools');await p.select('.tw-paper-jump select','21');await p.$eval('#tw-paper-question-21',e=>{e.open=true;e.scrollIntoView({block:'end',behavior:'instant'});});await p.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));const visible=await p.$eval('#tw-paper-question-21',e=>{const r=e.getBoundingClientRect();const nav=document.querySelector('.sidebar-nav').getBoundingClientRect();return {bottom:r.bottom,navTop:nav.top,viewport:innerHeight,covered:innerWidth<768&&r.bottom>nav.top};});assert.equal(visible.covered,false);geometry.push({size,...visible});
await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.evaluate(()=>[...document.querySelectorAll('.ar-report button')].find(b=>b.textContent==='Kiểm tra & công bố').click());await p.waitForSelector('.ar-publish-dialog');const clickable=await p.$eval('.ar-publish-dialog .tw-actions button',e=>{e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});assert.equal(clickable,true);assert.equal(await p.evaluate(()=>document.body.style.overflow),'hidden');await p.screenshot({path:`${out}/publish-${size}.png`});await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('.ar-publish-dialog'));assert.notEqual(await p.evaluate(()=>document.body.style.overflow),'hidden');checks.push(`${size}: final question clears bottom navigation; publish action receives hit test above nav; Escape restores scroll`);
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,geometry,errors},null,2));console.log(JSON.stringify({checks,geometry,errors}));
}finally{await b.close();}
