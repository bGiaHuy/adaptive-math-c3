import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import JSZip from 'jszip';
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox','--disable-gpu'],defaultViewport:{width:1440,height:1000}});
try {
const page = await browser.newPage(); await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle2'});
await page.evaluate(async()=>{const r=await fetch('/api/v1/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier:'thaynam@adaptivemath.vn',password:'P@ssword123!'})});if(!r.ok)throw Error('Login '+r.status)});
await page.reload({waitUntil:'networkidle2'});
const click = async text => { await page.waitForFunction(text=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()===text),{},text);await page.evaluate(text=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===text).click(),text); };
await click('Tạo đề mới');
await page.waitForSelector('.tec-method-continue');
await page.click('[role="radio"][aria-label="Tạo đề bằng AI"]');
await page.evaluate(()=>document.querySelector('.tec-method-continue')?.click());
await page.waitForSelector('.tec-author input[type="file"]');
if (process.argv.includes('--cached')) {
  await click('Tiếp tục');
  if (!await page.evaluate(()=>document.activeElement?.id === 'teacher-exam-title' && document.body.innerText.includes('Chưa có tên đề'))) throw Error('Missing title feedback');
  await page.setRequestInterception(true);
  page.on('request',request => {
    if(request.url().endsWith('/assignments/ai-preview') && request.method()==='POST') request.respond({status:200,contentType:'application/json',body:fs.readFileSync('docs/evidence/teacher-composer/generated-database-22.json','utf8')});
    else request.continue();
  });
}
const sourceScript=fs.readFileSync('scripts/verify-teacher-ai-live.mjs','utf8');
const source=sourceScript.match(/database \? `([^`]+)`/)[1];
const zip=new JSZip();zip.file('ppt/slides/slide1.xml',`<p:sld><a:t>${source}</a:t></p:sld>`);
const file='docs/evidence/teacher-composer/database-browser.pptx';fs.writeFileSync(file,await zip.generateAsync({type:'nodebuffer'}));
await (await page.$('.tec-author input[type="file"]')).uploadFile(file);
if (process.argv.includes('--cached')) { const autoTitle=await page.$eval('#teacher-exam-title',input=>input.value); if(autoTitle!=='database browser')throw Error('Auto title: '+autoTitle); }
await page.type('.tec-author textarea','Create a Database Systems exam in English. Keep the subject of the uploaded document.');
const responsePromise=page.waitForResponse(r=>r.url().endsWith('/assignments/ai-preview')&&r.request().method()==='POST',{timeout:320000});
await click('Tạo đề từ tài liệu');
const response=await responsePromise;const result=await response.json();
if(response.status()!==200)throw Error(JSON.stringify(result));
await page.waitForFunction(()=>document.querySelectorAll('.tec-selected>details').length===22,{timeout:15000});
const evidence=await page.evaluate(()=>({selected:document.querySelectorAll('.tec-selected>details').length,support:document.querySelector('.tec-support')?.innerText,errors:[...document.querySelectorAll('[role="alert"]')].map(e=>e.innerText)}));
await page.screenshot({path:'docs/evidence/teacher-composer/browser-database-22.png',fullPage:true});
fs.writeFileSync('docs/evidence/teacher-composer/browser-database-22.json',JSON.stringify({httpStatus:response.status(),...evidence},null,2));
await click('Tiếp tục');
await page.waitForSelector('.tw-form-grid');
console.log(JSON.stringify({...evidence,nextStep:true},null,2));

} finally {await browser.close()}

