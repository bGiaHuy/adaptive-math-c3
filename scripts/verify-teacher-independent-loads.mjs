import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-independent-loads';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[],reportRequests=0,held=[],detailsFail=true;
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions')){reportRequests++;if(state==='hold'){await new Promise(resolve=>held.push(resolve));}if(state==='report-error'){status=503;body={message:'Không thể tải bài nộp lúc này'};}else body=fixture.assignmentReport(path.split('/').at(-2));}
else if(path.endsWith('/assignments'))body={assignments:state==='empty'?[]:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions')){if(state==='bank-error'){status=503;body={message:'Lỗi tải câu hỏi kiểm thử'};}else body=fixture.bank;}
else if(/\/classrooms\/c\d$/.test(path)){status=detailsFail?503:200;body=detailsFail?{message:'Lỗi thành viên kiểm thử'}:{classroom:fixture.details(path.split('/').at(-1))};}
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});




const checks=[];state='hold';await p.setViewport({width:1440,height:900});await p.goto('http://127.0.0.1:3000/#/teacher-classes?class=%22c1%22&classTab=%22gradebook%22',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>document.body.textContent.includes('Đang tổng hợp kết quả'));await p.waitForFunction(()=>document.body.textContent.includes('Lỗi thành viên kiểm thử'));assert.ok(held.length>0);detailsFail=false;await p.evaluate(()=>[...document.querySelectorAll('.teacher-workspace button')].find(b=>b.textContent==='Thử tải thông tin lớp').click());await p.waitForFunction(()=>!document.querySelector('.tw-error')?.textContent.includes('Lỗi thành viên'));state='populated';const responses=held.length;held.splice(0).forEach(resolve=>resolve());await p.waitForSelector('.tw-student-list tbody tr');assert.equal(await p.$$eval('.tw-student-list tbody tr',x=>x.length),10);assert.ok(!(await p.evaluate(()=>document.body.textContent)).includes('Đang tổng hợp kết quả'));checks.push('Retrying class details during pending gradebook does not invalidate gradebook response or leave spinner stuck');assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,errors,releasedReports:responses},null,2));console.log(JSON.stringify({checks,errors,releasedReports:responses}));
}finally{await b.close();}
