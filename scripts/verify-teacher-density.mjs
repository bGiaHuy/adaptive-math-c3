import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase='density',out='docs/evidence/teacher-density';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[];
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions'))body=fixture.assignmentReport(path.split('/').at(-2));
else if(path.endsWith('/assignments'))body={assignments:state==='empty'?[]:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions')){if(state==='bank-error'){status=503;body={message:'Lỗi tải câu hỏi kiểm thử'};}else body=fixture.bank;}
else if(/\/classrooms\/c\d$/.test(path))body={classroom:fixture.details(path.split('/').at(-1))};
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});

const checks=[],measurements=[];
for(const [size,width,height]of[['desktop',1440,900],['tablet',820,1000],['mobile',390,844]]){
 await p.setViewport({width,height});
 for(const [name,route,selector]of[['bank','teacher-bank','.qb-question'],['analysis','teacher-library?report=%22a3%22&reportTab=%22analytics%22','.ar-analysis-question']]){
 await p.goto('http://127.0.0.1:3000/#/'+route,{waitUntil:'networkidle2'});await p.waitForSelector(selector);assert.equal(await p.$$eval(selector,x=>x.length),width<=650?5:10);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);measurements.push({name,size,height:await p.evaluate(()=>document.documentElement.scrollHeight),rows:await p.$$eval(selector,x=>x.length)});await p.screenshot({path:`${out}/${name}-${size}.png`,fullPage:true});
 await p.select('.tw-page-size select','20');assert.equal(await p.$$eval(selector,x=>x.length),20);
 if(name==='bank'){await p.click('[aria-label="Trang câu hỏi sau"]');assert.equal(await p.$$eval(selector,x=>x.length),20);await p.type('.question-bank-filters input','xyz-no-match');await p.waitForSelector('.question-bank-empty');await p.evaluate(()=>[...document.querySelectorAll('.question-bank-empty button')][0].click());assert.equal(await p.$$eval(selector,x=>x.length),20);assert.ok((await p.$eval('.tw-pagination',e=>e.textContent)).includes('Trang 1/4'));}
 else{await p.click('[aria-label="Trang câu hỏi sau"]');assert.equal(await p.$$eval(selector,x=>x.length),2);await p.type('.ar-analysis-tools input','xyz-no-match');await p.waitForSelector('.ar-empty');await p.evaluate(()=>document.querySelector('.ar-empty button').click());assert.equal(await p.$$eval(selector,x=>x.length),20);await p.$eval(selector,e=>e.click());await p.waitForSelector('.tw-drawer');await p.keyboard.press('Escape');assert.equal(await p.$$eval(selector,x=>x.length),20);}
 checks.push(`${name} ${size}: responsive default, 20/page, next page, empty/reset and retained context`);
 await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const violations=await p.evaluate(async()=>{const r=await axe.run(document.querySelector('.teacher-workspace'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(x=>({id:x.id,nodes:x.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});assert.deepEqual(violations,[]);
 }
}
state='bank-error';await p.goto('http://127.0.0.1:3000/#/teacher-bank',{waitUntil:'networkidle2'});await p.waitForFunction(()=>document.querySelector('.question-bank-workspace [role=alert]')?.textContent.includes('Lỗi tải câu hỏi'));assert.equal(await p.$('.question-bank-empty'),null);state='populated';await p.evaluate(()=>[...document.querySelectorAll('.question-bank-workspace button')].find(x=>x.textContent==='Thử tải lại câu hỏi').click());await p.waitForSelector('.qb-question');checks.push('Bank load failure is distinct from empty; in-place retry recovers questions');
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/verification.json',JSON.stringify({checks,measurements,errors},null,2));console.log(JSON.stringify({checks,measurements,errors}));
}finally{await b.close();}
