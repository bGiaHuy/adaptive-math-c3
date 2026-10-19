import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {PrismaClient} from '@prisma/client';

const origin='https://adaptivemath-blush.vercel.app';
const env=Object.fromEntries(fs.readFileSync('.env.math-production.local','utf8').trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
if(env.MATH_SUPABASE_PROJECT_REF!=='turjtcqkmjfkhqijjpdz'||new URL(env.DATABASE_URL).searchParams.get('schema')!=='math')throw new Error('Unexpected live test destination.');
const db=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
const output=path.join(process.cwd(),'docs/evidence/math-tutor/live');fs.mkdirSync(output,{recursive:true});
const username=`qa_math_${Date.now()}`,password=randomBytes(24).toString('hex');
let userId,browser;const errors=[];
try{
  browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],defaultViewport:{width:1440,height:1000}});
  const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));await page.goto(origin,{waitUntil:'networkidle0'});
  userId=await page.evaluate(async credentials=>{
    const call=async(route,body)=>{const response=await fetch(`/api/v1/${route}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw new Error(`${route}: ${response.status}`);return data;};
    const registered=await call('auth/register/student',{username:credentials.username,fullName:'Kiểm chứng Math — tài khoản tạm',password:credentials.password});
    await call('auth/login',{identifier:credentials.username,password:credentials.password});return registered.id;
  },{username,password});
  assert(userId);const cookies=await page.cookies();const session=cookies.find(cookie=>cookie.name==='__Host-am_math_session');assert(session?.httpOnly&&session.secure&&session.path==='/');
  await page.reload({waitUntil:'networkidle0'});await page.waitForSelector('[data-tab="profile"]');await page.click('[data-tab="profile"]');await page.waitForSelector('.empty-state-card');
  assert(await page.$eval('.empty-state-card',element=>element.textContent.includes('Chưa có kết quả')));
  const skills=await db.skillNode.findMany({where:{grade:9},orderBy:{orderIndex:'asc'},take:2});
  await db.skillMastery.createMany({data:[{studentId:userId,skillId:skills[0].id,masteryScore:92,evidenceCount:8},{studentId:userId,skillId:skills[1].id,masteryScore:48,evidenceCount:2}]});
  let masteryMode='delay';await page.setRequestInterception(true);
  page.on('request',async request=>{
    if(request.url().endsWith('/api/v1/student/mastery')){
      if(masteryMode==='error'){await request.respond({status:503,contentType:'application/json',body:JSON.stringify({message:'QA lỗi tải hồ sơ'})});return;}
      if(masteryMode==='delay')await new Promise(resolve=>setTimeout(resolve,900));
    }
    await request.continue();
  });
  await page.click('[data-tab="dashboard"]');await page.click('[data-tab="profile"]');await page.waitForFunction(()=>document.body.textContent.includes('Đang tải hồ sơ năng lực'));await page.waitForSelector('.competency-chart');
  masteryMode='error';await page.click('[data-tab="dashboard"]');await page.click('[data-tab="profile"]');await page.waitForFunction(()=>document.body.textContent.includes('Không thể tải dữ liệu năng lực'));
  masteryMode='live';await page.evaluate(()=>[...document.querySelectorAll('button')].find(button=>button.textContent.trim()==='Thử lại').click());await page.waitForSelector('.competency-chart');
  assert(await page.$eval('.competency-chart',element=>element.textContent.includes('92%')&&element.textContent.includes('Chưa đánh giá')&&element.textContent.includes('Chưa đủ bằng chứng')));
  await page.screenshot({path:path.join(output,'competency-desktop.png'),fullPage:true});await page.setViewport({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,'competency-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'VERIFICATION.md'),`# Math production verification\n\nDate: ${new Date().toISOString()}\n\n- Frontend: ${origin}\n- Backend: https://adaptivemath-api.onrender.com\n- Database: project turjtcqkmjfkhqijjpdz, private math schema.\n- Real registration/login through Vercel proxy; secure HttpOnly Math-specific cookie.\n- Grade-scoped competency API and rendered chart: sufficient, provisional and unassessed skills.\n- Desktop and 390px mobile, no horizontal overflow or unhandled JavaScript errors.\n- Uses one explicitly temporary QA learner and synthetic mastery values; cleanup runs in finally.\n- Empty, loading, failed request and retry states verified; errors injected only in the QA browser, not the live service.\n- AI provider verification is recorded separately in MWAPI-VERIFICATION.md; this chart test does not certify published question inventory.\n`);
  console.log('Live Math login, cookie and competency chart verification passed.');
}finally{
  await browser?.close();
  if(!userId){const user=await db.user.findUnique({where:{username}});userId=user?.id;}
  if(userId){await db.auditLog.deleteMany({where:{actorUserId:userId}});await db.user.delete({where:{id:userId}});console.log('Temporary live QA learner and dependent records removed.');}
  await db.$disconnect();
}
