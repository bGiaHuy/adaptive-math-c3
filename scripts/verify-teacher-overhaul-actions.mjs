import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase=process.argv[2]||'before',out='docs/evidence/teacher-ui-overhaul';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[];
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions'))body=fixture.assignmentReport(path.split('/').at(-2));
else if(path.endsWith('/assignments'))body={assignments:state==='empty'?[]:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions'))body=state==='sparse'?fixture.bank.slice(0,1):state==='empty'?[]:state==='long'?fixture.bank.map(q=>({...q,content:q.content+' '+('Giải thích điều kiện xác định của biểu thức và chứng minh kết quả bằng phép biến đổi tương đương. ').repeat(12)})):fixture.bank;
else if(/\/classrooms\/c\d$/.test(path))body={classroom:fixture.details(path.split('/').at(-1))};
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});

const checks=[];
async function clickVisible(selector){await p.$eval(selector,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await p.click(selector);}
async function library(){await p.goto('http://127.0.0.1:3000/#/teacher-library?report=null&draft=null&class=null',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.tl-record');}
for(const [size,width,height] of [['desktop',1440,900],['laptop',1280,800],['tablet',768,1024],['mobile',390,844]]){
 await p.setViewport({width,height});await library();
 const initial=await p.$$('.tl-record');assert.ok(initial.length>0);
 await p.click('.tl-view-toggle button:nth-child(2)');assert.ok(await p.$('.tl-view-list'));assert.equal((await p.$$('.tl-record')).length,initial.length);
 await p.screenshot({path:out+'/final-library-list-'+size+'.png'});
 await p.click('.tl-view-toggle button:first-child');assert.ok(await p.$('.tl-view-grid'));
 await p.screenshot({path:out+'/final-library-grid-'+size+'.png'});
 await p.type('.tl-search input','can thuc');assert.ok((await p.$$('.tl-record')).length>0);assert.ok((await p.$$('.tl-record')).length<initial.length || size==='mobile');
 await library();await p.reload({waitUntil:'networkidle2'});await p.waitForSelector('.tl-record');
 await p.click('.tl-state-strip button:nth-child(2)');assert.ok(await p.$$eval('.tl-status',els=>els.every(e=>e.textContent==='Bản nháp')));
 await p.click('.tl-state-strip button:first-child');await p.select('.tl-folder select','Đại số');assert.ok((await p.$$('.tl-record')).length>0);await p.select('.tl-folder select','');await p.waitForFunction(()=>document.querySelectorAll('.tl-record').length===Number(document.querySelector('.tw-page-size select').value));
 await clickVisible('.tl-open-results');await p.waitForSelector('.ar-results',{timeout:5000}).catch(async error=>{console.log(JSON.stringify(await p.evaluate(()=>({url:location.href,text:document.body.innerText.slice(-2200)}))));throw error;});
 await library();await clickVisible('.tl-open-paper');await p.waitForSelector('.ar-report');assert.ok(await p.$eval('.ar-report>.tw-tabs [aria-current=page]',e=>e.textContent.includes('Đề & đáp án')));
 await library();await clickVisible('.tl-more summary');await clickVisible('.tl-delete');await p.waitForSelector('#tw-delete-title');await p.keyboard.press('Escape');assert.equal(await p.$('#tw-delete-title'),null);
 await p.click('.account-menu summary');const bounds=await p.$eval('.account-panel',e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};});assert.ok(bounds.left>=0&&bounds.right<=width+1&&bounds.top>=0&&bounds.bottom<=height+1,JSON.stringify(bounds));await p.keyboard.press('Escape');
 await p.click('[data-tab="teacher-classes"]');await p.waitForSelector('.tp-class-directory');
 await p.click('[data-tab="teacher-overview"]');await p.waitForSelector('.to-overview');
 const layout=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,railWidth:document.querySelector('.app-sidebar').getBoundingClientRect().width,nav:document.querySelector('.sidebar-nav').getBoundingClientRect().toJSON()}));assert.equal(layout.overflow,false);if(width>=1101)assert.equal(layout.railWidth,232);else if(width>=768)assert.equal(layout.railWidth,84);else assert.ok(layout.nav.bottom<=height+1&&layout.nav.top>height-110);
 checks.push({size,initialRows:initial.length,gridList:true,search:true,status:true,folder:true,directResults:true,directPaper:true,cancelDelete:true,accountPanel:true,navigation:true,layout});
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/actions.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({viewports:checks.length,checks:checks.length*10,errors}));
}finally{await b.close();}
