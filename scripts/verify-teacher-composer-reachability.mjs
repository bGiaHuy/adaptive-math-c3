import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='recovery',out='docs/evidence/teacher-composer-reachability';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
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
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844],['small-phone',360,640]]){
await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-library',{waitUntil:'networkidle2'});await p.waitForSelector('.tl-record');await p.evaluate(()=>[...document.querySelectorAll('.teacher-workspace button')].find(b=>b.textContent.trim()==='Tạo đề mới').click());await p.waitForSelector('.tec-method-picker');await p.click('[role=radio][aria-label="Soạn thủ công"]');if(await p.$eval('.tec-method-continue',e=>e.getClientRects().length>0))await p.click('.tec-method-continue');await p.waitForSelector('.tec-author textarea');
for(const [name,selector]of[['explanation','.tec-author>label:last-of-type textarea'],['add-question','.tec-author>button:last-child']]){
const position=await p.$eval(selector,e=>{e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,top:r.top,bottom:r.bottom};});await new Promise(ok=>setTimeout(ok,100));const reachable=await p.$eval(selector,e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});geometry.push({size,name,reachable,...position});await p.screenshot({path:`${out}/${name}-${size}.png`});assert.equal(reachable,true,`${size} ${name} covered`);
}
checks.push(`${size}: explanation and add-question receive pointer hit after scrolling`);
}
fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,geometry,errors},null,2));console.log(JSON.stringify({checks,geometry,errors}));assert.deepEqual(errors,[]);
}finally{await b.close();}
