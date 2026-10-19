import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-question-roster';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
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
await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-library?report=%22a3%22&reportTab=%22analytics%22',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.ar-analysis-question');await p.$eval('.ar-analysis-question',e=>e.click());await p.waitForSelector('.tw-drawer .tw-student-list');assert.equal(await p.$$eval('.tw-drawer tbody tr',x=>x.length),10);await p.$eval('.tw-drawer [aria-label="Trang học sinh sau"]',e=>e.click());assert.equal(await p.$$eval('.tw-drawer tbody tr',x=>x.length),10);await p.type('.tw-drawer .tw-list-search input','nguyen minh duc');assert.equal(await p.$$eval('.tw-drawer tbody tr',x=>x.length),1);await p.$eval('.tw-drawer tbody button',e=>e.click());await p.waitForSelector('.exam-result');assert.equal(await p.evaluate(()=>document.body.style.overflow),'hidden');assert.equal(await p.$$eval('[role=dialog]',els=>els.filter(e=>e.getClientRects().length).length),1);assert.ok((await p.$eval('#exam-result-title',e=>e.textContent)).includes('Nguyễn Minh Đức'));await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('.exam-result'));await p.waitForSelector('.tw-drawer',{visible:true});assert.equal(await p.$eval('.tw-drawer .tw-list-search input',e=>e.value),'nguyen minh duc');await p.evaluate(()=>[...document.querySelectorAll('.tw-drawer .tw-tabs button')].find(b=>b.textContent==='Bỏ trống').click());assert.equal(await p.$eval('.tw-drawer .tw-list-search input',e=>e.value),'');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`${out}/group-${size}.png`});await p.keyboard.press('Escape');checks.push(`${size}: roster10/page, next/search, correct student drilldown returns to same question/search and group resets search`);
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
