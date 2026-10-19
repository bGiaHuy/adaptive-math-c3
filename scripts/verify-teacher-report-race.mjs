import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-report-race';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[],reportRequests=0,held=[],releaseCount=0;
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions')){reportRequests++;if(state==='hold'){await new Promise(resolve=>held.push(resolve));releaseCount++;}if(state==='report-error'){status=503;body={message:'Không thể tải bài nộp lúc này'};}else body=fixture.assignmentReport(path.split('/').at(-2));}
else if(path.endsWith('/assignments'))body={assignments:state==='empty'?[]:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions')){if(state==='bank-error'){status=503;body={message:'Lỗi tải câu hỏi kiểm thử'};}else body=fixture.bank;}
else if(/\/classrooms\/c\d$/.test(path))body={classroom:fixture.details(path.split('/').at(-1))};
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});




const checks=[];
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]]){
 state='populated';await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-library',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.tl-record');state='hold';await p.$eval('.tl-record .tl-open-results',e=>e.click());await p.waitForSelector('.tw-report-recovery [role=status]');assert.equal(held.length,1);await p.$eval('.tw-report-recovery .tw-back',e=>e.click());await p.waitForSelector('.tl-record');const response=p.waitForResponse(r=>r.url().includes('/submissions'));state='populated';held.shift()();await response;await p.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await p.$('.ar-report'),null);assert.ok(!(await p.evaluate(()=>location.hash)).includes('report='));checks.push(`${size}: back during pending request remains in library after old response`);
 state='hold';await p.$eval('.tl-record .tl-open-results',e=>e.click());await p.waitForSelector('.tw-report-recovery');await p.$eval('.tw-report-recovery .tw-back',e=>e.click());await p.waitForSelector('.tl-record');state='populated';await p.$$eval('.tl-record .tl-open-results',els=>els[1].click());await p.waitForSelector('.ar-results');const expected=await p.$eval('.ar-report h1',e=>e.textContent);const stale=p.waitForResponse(r=>r.url().includes('/submissions'));held.shift()();await stale;await p.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await p.$eval('.ar-report h1',e=>e.textContent),expected);assert.equal(await p.$('.exam-result'),null);await p.screenshot({path:`${out}/new-report-${size}.png`});checks.push(`${size}: old report response cannot replace newer assignment`);
}
assert.deepEqual(errors,[]);assert.equal(releaseCount,6);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors,releasedResponses:releaseCount},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await b.close();}
