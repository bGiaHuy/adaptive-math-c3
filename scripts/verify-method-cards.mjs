import fs from 'node:fs';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import axe from 'axe-core';
const output='docs/evidence/teacher-composer';fs.mkdirSync(output,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox']});
try{
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width:1440,height:1000});
await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle2'});
await page.evaluate(async()=>{const r=await fetch('/api/v1/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier:'thaynam@adaptivemath.vn',password:'P@ssword123!'})});if(!r.ok)throw Error('login failed')});
await page.reload({waitUntil:'networkidle2'});await page.waitForSelector('.tw-class-card');
await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Tạo đề mới').click());await page.waitForSelector('.tec-method-card');
assert.equal((await page.$$('.tec-method-primary .tec-method-card')).length,3);assert.equal((await page.$$('.tec-method-secondary .tec-method-card')).length,2);
await page.screenshot({path:output+'/method-cards-desktop.png',fullPage:true});
await page.click('[role=radio][aria-label="Soạn thủ công"]');await page.click('.tec-method-continue');await page.waitForSelector('.tec-author');
await page.type('.tec-author > label textarea','Nội dung đang soạn được giữ lại');
await page.click('[role=radio][aria-label="Ngân hàng câu hỏi"]');await page.click('.tec-method-continue');await page.waitForSelector('.tec-bank');
const checkbox=await page.$('.tec-bank-choice input');let preserved=false;if(checkbox){await checkbox.click();preserved=true;}
await page.click('[role=radio][aria-label="Nhập từ JSON"]');await page.click('.tec-method-continue');
if(preserved)assert.ok(await page.$('.tec-selected'));
await page.click('[role=radio][aria-label="Soạn thủ công"]');await page.click('.tec-method-continue');
assert.equal(await page.$eval('.tec-author > label textarea',el=>el.value),'Nội dung đang soạn được giữ lại');
await page.setViewport({width:390,height:844});await page.screenshot({path:output+'/method-cards-mobile.png',fullPage:true});
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile overflow');
const positions=await page.$$eval('.tec-method-card',els=>els.map(el=>Math.round(el.getBoundingClientRect().left)));assert.equal(new Set(positions).size,1,'mobile single column');
await page.focus('[role=radio][aria-label="Soạn thủ công"]');await page.keyboard.press('ArrowRight');assert.equal(await page.$eval('[role=radio][aria-checked=true]',el=>el.getAttribute('aria-label')),'Tải đề từ tệp');
await page.addScriptTag({content:axe.source});const violations=await page.evaluate(async()=>{const r=await axe.run(document.querySelector('.tec-method-picker'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))});
assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);
console.log(JSON.stringify({cards:5,primary:3,secondary:2,mobileSingleColumn:true,draftTextPreserved:true,selectedQuestionsPreserved:preserved,keyboard:true,violations,errors}));
}finally{await browser.close()}
