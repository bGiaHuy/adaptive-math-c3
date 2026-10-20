import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox','--disable-gpu']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));let pending=[],failSession=false;
await page.setRequestInterception(true);page.on('request',r=>{if(!r.url().includes('/api/v1/'))return r.continue();const path=new URL(r.url()).pathname;
if(path.endsWith('/auth/me')&&!failSession){pending.push(r);return;}
let status=200,body={};if(path.endsWith('/auth/me')){status=503;body={message:'Máy chủ đang khởi động'};}
else if(path.endsWith('/auth/login')){setTimeout(()=>r.respond({status:200,contentType:'application/json',body:JSON.stringify({user:{id:'fixture',role:'STUDENT',fullName:'Browser Fixture'}})}).catch(()=>{}),22000);return;}
else if(path.endsWith('/student/profile'))body={profile:{grade:10,dailyMinutes:45},stats:{completedAssessments:0}};
else if(path.endsWith('/student/activity'))body={logs:{}};
else if(path.endsWith('/diagnostic/latest'))body={status:'NOT_STARTED'};
else if(path.includes('/tutor/'))body={messages:[]};
r.respond({status,contentType:'application/json',body:JSON.stringify(body)}).catch(()=>{});});
const click=async text=>{await page.waitForFunction(t=>[...document.querySelectorAll('button')].some(b=>b.textContent.includes(t)&&!b.disabled),{},text);await page.evaluate(t=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes(t)&&!b.disabled).click(),text);};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
try{
await page.goto('http://127.0.0.1:3041/',{waitUntil:'domcontentloaded'});await page.waitForSelector('.pastel-landing',{timeout:3000});assert.equal(await page.$('.session-recovery'),null);await click('Đăng nhập');await page.waitForSelector('#auth-field-11');await page.type('#auth-field-11','fixture');await page.type('#auth-field-12','Fixture123!');
for(const r of pending.splice(0))await r.respond({status:401,contentType:'application/json',body:'{}'}).catch(()=>{});await pause(250);assert.equal(await page.$eval('#auth-field-11',e=>e.value),'fixture');
await page.click('.btn-auth-submit');await pause(16500);assert.ok((await page.evaluate(()=>document.body.innerText)).includes('Đang xác thực'));await page.waitForFunction(()=>document.body.innerText.includes('Đánh giá năng lực Toán lớp 10'),{timeout:15000});
await page.goto('http://127.0.0.1:3041/?case=private#/dashboard',{waitUntil:'domcontentloaded'});await page.waitForSelector('.session-recovery');assert.equal(await page.$('.dashboard-view'),null);await click('Xem trang giới thiệu');await page.waitForSelector('.pastel-landing');assert.equal(new URL(page.url()).hash,'');
failSession=true;await page.goto('http://127.0.0.1:3041/?case=failure',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('.session-notice')?.textContent.includes('Chưa thể khôi phục'));assert.ok(await page.$('.pastel-landing'));await click('Đăng nhập');await page.waitForSelector('#auth-field-11');
await page.setViewport({width:390,height:844});await page.goto('http://127.0.0.1:3041/',{waitUntil:'domcontentloaded'});await page.waitForSelector('.pastel-landing');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await page.screenshot({path:'tmp/c3-public-session-mobile.png',fullPage:true});
assert.deepEqual(errors,[]);console.log('Passed: public page renders before session API; manual login cancels stale bootstrap; 22-second login succeeds; private route stays gated with a public escape; API failure preserves homepage/login; mobile has no overflow.');
}catch(e){console.log(errors);console.log((await page.evaluate(()=>document.body.innerText)).slice(0,1200));throw e;}finally{await browser.close();}
