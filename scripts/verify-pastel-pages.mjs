import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const out='docs/evidence/pastel-pages';fs.mkdirSync(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu'],pipe:true});
const results=[],errors=[],accessibility=[],interactions=[];
try{
const page=await browser.newPage();page.on('pageerror',e=>(errors.push(e.message),console.log('PAGE ERROR',e.stack)));
await page.setRequestInterception(true);
page.on('request',r=>{
if(!r.url().startsWith('http://127.0.0.1:3027')&&!r.url().startsWith('data:'))return r.abort(); const p=new URL(r.url()).pathname;if(!p.startsWith('/api/'))return r.continue();
let data={}; if(p.endsWith('/student/review/conversations'))data={conversations:[]};
if(p.endsWith('/student/learning-path'))data={grade:10,targetGoal:'Ôn tập học kỳ',plan:{dailyMinutes:45,targetMastery:80,daysLeft:null,days:[{date:'2026-10-19',plannedMinutes:30,activities:[{skillId:'qa',kind:'PRACTICE',title:'Hàm số bậc hai',reason:'Củng cố kiến thức đã học.',minutes:30}]}]},modules:[]};
if(p.endsWith('/student/review/summary'))data={stats:{saved:8,remembered:3,forgotten:2,due:3},recommendations:[{id:'qa',title:'Hàm số bậc hai',chapter:'Chương VI',wrong:2,attempts:4}],mistakes:[],aiEnabled:false};
if(p.endsWith('/student/practice/active'))data={session:null};
if(p.endsWith('/classrooms'))data={classrooms:[]};
if(p.endsWith('/auth/sessions'))data={sessions:[]};
r.respond({status:200,contentType:'application/json',body:JSON.stringify(data)});
});
for(const mode of ['competency','mistakes','exam-composer','library','classes','report-results','report-analytics','report-paper','report-settings','admin-overview','admin-users','admin-classrooms','admin-questions','admin-audit','missions','learning-path','review','student-classroom','pending','onboarding','sessions','password','legal','student-result','not-found','loading','curriculum']){
await page.goto('http://127.0.0.1:3027/scripts/pastel-audit.html?mode='+mode,{waitUntil:'networkidle0'});
for(const width of [1440,768,390]){
await page.setViewport({width,height:960});
const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,content:document.body.innerText.length,font:getComputedStyle(document.body).fontFamily}));
results.push({mode,width,...state});
if(width!==768)await page.screenshot({path:`${out}/${mode}-${width}.png`,fullPage:true});
}
}
for(const mode of ['library','report-paper','missions','review']){
await page.goto('http://127.0.0.1:3027/scripts/pastel-audit.html?mode='+mode,{waitUntil:'networkidle0'});
await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
accessibility.push({mode,violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})))});
if(mode==='library'){
await page.type('.tl-search-control input','xác suất');
assert.equal(await page.$$eval('.tl-record',n=>n.length),1);interactions.push('Library search filters records');
}
if(mode==='report-paper'){
assert.equal(await page.$$eval('.question-display',n=>n.length),3);
assert.equal(await page.$$eval('.qd-paper .math-key-choice',n=>n.length),4);
assert.equal(await page.$$eval('.qd-paper .math-truth-circle',n=>n.length),4);
assert.equal(await page.$eval('.qd-paper .math-key-value',n=>getComputedStyle(n).borderTopColor),'rgb(0, 0, 0)');
await page.click('.qd-edit');assert.ok(await page.$('.tw-regrade-fields'));
interactions.push('All three question types visible; boxed choices, truth circles, short answer and question editing retained');
}
await page.keyboard.press('Tab');
assert.equal(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'solid');
}
fs.writeFileSync(`${out}/results.json`,JSON.stringify({results,errors,accessibility,interactions},null,2));
console.log(JSON.stringify({checks:results.length,overflow:results.filter(r=>r.overflow),errors},null,2));
assert.equal(errors.length,0);assert.ok(results.every(r=>!r.overflow&&r.content>0));
}finally{await browser.close();}








