import fs from 'node:fs';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox']});
const out='docs/evidence/teacher-composer';fs.mkdirSync(out,{recursive:true});
try {
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width:1440,height:1000});
 await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle2'});
 await page.evaluate(async()=>{const r=await fetch('/api/v1/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier:'thaynam@adaptivemath.vn',password:'P@ssword123!'})});if(!r.ok)throw Error('login failed')});
 await page.reload({waitUntil:'networkidle2'});await page.waitForSelector('.tw-class-card');await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Tạo đề mới').click());await page.waitForSelector('.tec-support');
 await page.click('[role=radio][aria-label="Tạo đề bằng AI"]');await page.waitForSelector('.tec-author');await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:out+'/workspace-desktop.png',fullPage:true});
 const layout=await page.evaluate(()=>({source:document.querySelector('.tec-method-picker').getBoundingClientRect().top,footer:document.querySelector('.tw-editor-footer').getBoundingClientRect().bottom,side:getComputedStyle(document.querySelector('.tec-support')).position}));assert.ok(layout.source<500);assert.ok(layout.footer<=1000);assert.equal(layout.side,'sticky');
 await page.evaluate(()=>[...document.querySelectorAll('.tec-support button')].find(b=>b.textContent.includes('Chi tiết')).click());await page.waitForSelector('dialog[open]');assert.equal(await page.$$eval('dialog tbody tr',els=>els.length),22);await page.keyboard.press('Escape');
 await page.evaluate(()=>[...document.querySelectorAll('.tec-support button')].find(b=>b.textContent.includes('Tiêu chí')).click());await page.waitForSelector('dialog[open]');assert.equal(await page.$$('dialog .tec-rubric-summary').then(x=>x.length),8);await page.click('dialog details summary');assert.ok(await page.$('dialog .tec-example'));await page.keyboard.press('Escape');
 const file=await page.$('.tec-author input[type=file]');await page.evaluate(()=>{const input=document.querySelector('.tec-author input[type=file]');const transfer=new DataTransfer();transfer.items.add(new File(['UI loading test'],'ui-test.docx'));input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));});
 let delay=900,mode='error';await page.setRequestInterception(true);page.on('request',async req=>{if(req.url().includes('ai-preview')){await new Promise(r=>setTimeout(r,delay));await req.respond({status:mode==='error'?502:200,contentType:'application/json',body:JSON.stringify(mode==='error'?{message:'Lỗi AI kiểm thử'}:{questions:[{questionType:'SINGLE_CHOICE',content:'Tính 2 + 2?',options:['1','2','3','4'].map((content,i)=>({key:'ABCD'[i],content})),correctOption:'D',difficulty:'EASY',cognitiveLevel:'REMEMBERING'}]})});}else await req.continue()});
 const generate=()=>page.evaluate(()=>[...document.querySelectorAll('.tec-author button')].find(b=>b.textContent.includes('Tạo đề từ tài liệu')).click());
 await generate();await page.waitForSelector('.tec-skeleton-surface.is-visible');await page.screenshot({path:out+'/workspace-loading.png',fullPage:true});await page.waitForSelector('.tec-error');await page.waitForFunction(()=>!document.querySelector('.tec-generation-result'));
 delay=40;mode='success';await generate();await page.waitForSelector('.tec-selected');assert.equal(await page.$('.tec-generation-result'),null);
 await page.setViewport({width:390,height:844});await page.screenshot({path:out+'/workspace-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile overflow');assert.deepEqual(errors,[]);console.log(JSON.stringify({layout,matrixRows:22,helpDefinitions:8,errorStopsSkeleton:true,successStopsSkeleton:true,mobileOverflow:false,errors}));
}finally{await browser.close()}

