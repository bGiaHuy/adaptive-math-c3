import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try {
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.setRequestInterception(true);
const questions=Array.from({length:22},(_,i)=>({id:'q'+i,questionType:'SINGLE_CHOICE',content:i===0?'Tính giá trị của $\\sqrt{16}$':'Cho đường tròn (O; 4cm). Tính diện tích hình tròn.',skillTitle:'Căn bậc hai và căn thức cơ bản',options:['2','4','8','16'].map((content,j)=>({key:'ABCD'[j],content}))}));
page.on('request',r=>{if(!r.url().includes('/api/'))return r.continue();let data={};if(r.url().includes('/take'))data={assignment:{id:'exam',title:'Ôn tập chương I · Căn bậc hai',className:'9A1',mode:'PRACTICE',durationMinutes:45,questions}};else if(r.url().includes('/classrooms/'))data={assignments:[{id:'exam',title:'Ôn tập chương I',questionCount:22,durationMinutes:45}]};else if(r.url().includes('/profile'))data={joinedClassrooms:[{id:'class',name:'9A1',grade:9}]};r.respond({status:200,contentType:'application/json',body:JSON.stringify(data)});});
await page.setViewport({width:1440,height:900});await page.goto('http://127.0.0.1:3000/tmp/student-exam-preview.html');await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Bắt đầu làm bài')));await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Bắt đầu làm bài')).click());await page.waitForSelector('.student-exam-content section');
await page.click('.math-choice-options input');await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Toàn bộ đề').click());assert.equal(await page.$$eval('.student-exam-content section',e=>e.length),22);await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Từng câu').click());assert.ok(await page.$('.math-choice-options input:checked'));
fs.mkdirSync('docs/evidence/student-exam',{recursive:true});
for(const [label,width,height] of [['desktop',1440,900],['wide',1920,1080],['mobile',390,844]]){await page.setViewport({width,height});const metrics=await page.$eval('.student-exam',el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width,overflow:document.documentElement.scrollWidth>innerWidth,header:!!document.querySelector('#student-exam-title')};});assert.equal(metrics.top,0);assert.equal(metrics.bottom,height);assert.equal(metrics.width,width);assert.equal(metrics.overflow,false);await page.screenshot({path:`docs/evidence/student-exam/${label}.png`});console.log(label,metrics);}
await page.setViewport({width:1440,height:900});
await page.click('.student-exam-unanswered');
assert.equal(await page.$eval('.student-exam-content section',el=>el.getAttribute('aria-label')),'Câu 2');
await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Toàn bộ đề').click());
await page.$eval('.student-exam-content',el=>el.scrollTop=0);
await page.screenshot({path:'docs/evidence/student-exam/paper-desktop.png'});
assert.ok(await page.$eval('.math-choice-options',el=>{const labels=el.querySelectorAll('label');return Math.abs(labels[0].getBoundingClientRect().top-labels[1].getBoundingClientRect().top)<2 && labels[1].getBoundingClientRect().left>labels[0].getBoundingClientRect().left;}));
assert.deepEqual(errors,[]);
}finally{await browser.close();}

