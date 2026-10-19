import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-active-tab';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
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




const capturePhase=process.argv[2]||'after',checks=[],measurements=[];
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844],['small-phone',360,640]])for(const [name,route]of[['skills','teacher-classes?class=%22c1%22&classTab=%22skills%22'],['settings','teacher-library?report=%22a3%22&reportTab=%22settings%22']]){
await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/'+route,{waitUntil:'networkidle2'});await p.waitForSelector('.tw-tabs .active');const metric=await p.$eval('.tw-tabs',e=>{const a=e.querySelector('.active').getBoundingClientRect(),r=e.getBoundingClientRect();return {visible:a.left>=r.left-1&&a.right<=r.right+1,scrollLeft:e.scrollLeft,scrollY:window.scrollY};});measurements.push({size,name,...metric});if(capturePhase==='after'){assert.equal(metric.visible,true);assert.equal(metric.scrollY,0);}await p.screenshot({path:`${out}/${capturePhase}-${name}-${size}.png`});checks.push(`${size} ${name}: selected tab visibility measured`);
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+`/${capturePhase}.json`,JSON.stringify({checks,measurements,errors},null,2));console.log(JSON.stringify({measurements,errors}));
}finally{await b.close();}
