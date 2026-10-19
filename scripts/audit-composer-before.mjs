import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox']});
const page=await browser.newPage();await page.setViewport({width:1440,height:900});
await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle2'});
console.log(await page.evaluate(async()=>{const r=await fetch('/api/v1/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier:'thaynam@adaptivemath.vn',password:'P@ssword123!'})});return r.status}));
await page.reload({waitUntil:'networkidle2'});console.log((await page.$$('button')).length);
await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Tạo đề mới')?.click());await page.waitForSelector('.tec-support');await page.click('[role=radio][aria-label="Ngân hàng câu hỏi"]');await page.evaluate(()=>scrollTo(0,0));fs.mkdirSync('docs/evidence/composer-redesign',{recursive:true});await page.screenshot({path:'docs/evidence/composer-redesign/before-desktop.png',fullPage:true});await page.setViewport({width:390,height:844});await page.screenshot({path:'docs/evidence/composer-redesign/before-mobile.png',fullPage:true});console.log(await page.$eval('.tec-topic-picker',e=>({height:e.clientHeight,topics:e.querySelectorAll('label').length})));await browser.close();
