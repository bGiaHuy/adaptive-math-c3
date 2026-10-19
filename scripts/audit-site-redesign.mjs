import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const out='docs/evidence/site-redesign';fs.mkdirSync(out,{recursive:true});
const phase=process.argv[2]||'before';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
const report=[];
try{
for(const [role,identifier,tabs] of [['guest',null,['landing','login','signup','not-found']],['student','duc_nguyen',['dashboard','profile','learning-path','diagnostic','mistakes','review','classroom','onboarding','missions','practice']],['teacher','thaynam@adaptivemath.vn',['teacher-overview','teacher-classes','teacher-library','teacher-bank']],['applicant','teacher_pending',['teacher-pending']],['admin','admin',['admin-overview','admin-users','admin-questions','admin-audit']]]){
const context=await browser.createBrowserContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle2'});
if(identifier){const r=await fetch('http://127.0.0.1:3000/api/v1/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier,password:'P@ssword123!'})});if(r.status!==200)throw new Error(`Login ${role}: ${r.status}`);const loginData=await r.json();for(const cookie of r.headers.getSetCookie()){const pair=cookie.split(';')[0];const i=pair.indexOf('=');await context.setCookie({name:pair.slice(0,i),value:pair.slice(i+1),domain:'127.0.0.1',path:'/',httpOnly:true,secure:false,sameSite:'Lax'});}if(role==='applicant'){await page.setRequestInterception(true);page.on('request',r=>r.url().endsWith('/auth/me')?r.respond({status:200,contentType:'application/json',body:JSON.stringify({user:{...loginData.user,role:'TEACHER_APPLICANT',teacherProfile:{...loginData.user.teacherProfile,verificationStatus:'PENDING_REVIEW'}}})}):r.continue());}await page.reload({waitUntil:'networkidle2'});console.log(role,await page.evaluate(async()=>{const r=await fetch('/api/v1/auth/me');return {me:r.status,body:document.body.innerText.slice(0,110)};}));}

for(const tab of tabs){for(const [size,width,height] of [['desktop',1440,900],['mobile',390,844]]){
await page.setViewport({width,height});await page.goto('http://127.0.0.1:3000/'+(tab==='not-found'?'missing-page':identifier?'#/'+tab:''),{waitUntil:'networkidle2'});
if(identifier){try{await page.waitForSelector('.app-sidebar',{timeout:5000});}catch{console.log('FAILED',role,tab,JSON.stringify(errors));report.push({role,tab,size,failed:true,errors:[...errors]});await page.screenshot({path:`${out}/${phase}-${role}-${tab}-${size}.png`});await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle2'});continue;}}

if(tab==='signup')await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Đăng ký')?.click());
if(tab==='login')await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Đăng nhập')?.click());
await new Promise(r=>setTimeout(r,250));
const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,heading:document.querySelector('h1,h2')?.textContent,mainWidth:document.querySelector('main')?.getBoundingClientRect().width,offenders:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+2&&getComputedStyle(e).position!=='fixed';}).slice(0,8).map(e=>({tag:e.tagName,cls:e.className,width:Math.round(e.getBoundingClientRect().width)}))}));
report.push({role,tab,size,source:role==='applicant'?'controlled role fixture':'local server',...metrics,errors:[...errors]});await page.screenshot({path:`${out}/${phase}-${role}-${tab}-${size}.png`});
}}
await context.close();}
if(report.some(r=>r.failed||r.overflow||r.errors?.length))process.exitCode=1;
fs.writeFileSync(`${out}/${phase}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(({offenders,...r})=>r)));
}finally{await browser.close();}
