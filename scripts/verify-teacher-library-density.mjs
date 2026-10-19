import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-library-density';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
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




const checks=[],measurements=[];
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]]){
 await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-library',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.tl-record');assert.equal(await p.$$eval('.tl-record',x=>x.length),width<=650?5:10);measurements.push({size,height:await p.evaluate(()=>document.documentElement.scrollHeight)});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`${out}/library-${size}.png`,fullPage:true});await p.click('[aria-label="Trang bài giao sau"]');assert.ok((await p.$eval('.tw-pagination',e=>e.textContent)).includes('Trang 2/'));await p.select('.tw-page-size select','20');assert.equal(await p.$$eval('.tl-record',x=>x.length),20);assert.ok((await p.$eval('.tw-pagination',e=>e.textContent)).includes('Trang 1/'));await p.type('.tl-search input','can thuc');assert.equal(await p.$$eval('.tl-record',x=>x.length),9);await p.evaluate(()=>[...document.querySelectorAll('.tl-view-toggle button')].find(x=>x.textContent==='Danh sách').click());assert.ok(await p.$('.tl-view-list'));await p.$eval('.tl-open-paper',e=>e.click());await p.waitForFunction(()=>document.querySelector('.ar-report')?.textContent.includes('Nội dung đề và đáp án'));await p.$eval('.ar-report>.tw-back',e=>e.click());await p.waitForSelector('.tl-record');assert.equal(await p.$eval('.tl-search input',e=>e.value),'can thuc');assert.ok(await p.$('.tl-view-list'));assert.equal(await p.$eval('.tw-page-size select',e=>e.value),'20');checks.push(`${size}: responsive default, paging, size reset, unaccented search and paper/back retain filter and list view`);
}
await p.$eval('.tl-search input',e=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'');e.dispatchEvent(new Event('input',{bubbles:true}));});await p.select('.tw-page-size select','5');for(let i=0;i<7;i++)await p.click('[aria-label="Trang bài giao sau"]');assert.ok((await p.$eval('.tw-pagination',e=>e.textContent)).includes('Trang 8/8'));assert.equal(await p.$$eval('.tl-record',x=>x.length),1);await p.$eval('.tl-open-results',e=>e.click());await p.waitForSelector('.ar-results');await p.$eval('.ar-report>.tw-back',e=>e.click());await p.waitForSelector('.tl-record');assert.ok((await p.$eval('.tw-pagination',e=>e.textContent)).includes('Trang 8/8'));checks.push('All36 assignments reachable at5/page, page8 retained after report/back');
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,measurements,errors},null,2));console.log(JSON.stringify({checks,measurements,errors}));
}finally{await b.close();}
