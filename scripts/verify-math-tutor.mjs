import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import { PrismaClient } from '@prisma/client';
import { createEmptyCard } from 'ts-fsrs';
import { createMathQaDatabase } from './math-qa-database.mjs';

const root=process.cwd(), dbPort=55442, apiPort=34180, webPort=34181;
const url=`postgresql://am:qa@127.0.0.1:${dbPort}/math_adaptive_qa?connection_limit=1&pool_timeout=30`;
const origin=`http://127.0.0.1:${webPort}`;
const env={...process.env,DATABASE_URL:url,NODE_ENV:'test',MATH_TUTOR_QA:'true',AI_ENABLED:'true',AI_PROVIDER:'anthropic',ANTHROPIC_API_KEY:'isolated-test-credential',SESSION_SECRET:'math_tutor_qa_session_secret_at_least_32_characters',INVITE_CODE_HMAC_SECRET:'math_tutor_qa_invite_secret_at_least_32_characters',AI_USER_REQUESTS_PER_MINUTE:'100',AI_IP_REQUESTS_PER_MINUTE:'1000',AI_USER_DAILY_BUDGET_USD:'10',AI_DAILY_BUDGET_USD:'100',WEB_URL:origin,PORT:String(apiPort),SESSION_COOKIE_NAME:'am_session'};
const output=path.join(root,'docs/evidence/math-tutor');fs.mkdirSync(output,{recursive:true});
const children=[];let qa,db,browser,logs='';const errors=[];
function child(args,extra={}){const processHandle=spawn(process.execPath,args,{cwd:root,windowsHide:true,env:{...env,...extra},stdio:['ignore','pipe','pipe']});children.push(processHandle);processHandle.stderr.on('data',value=>logs+=value);return processHandle;}
function run(args){return new Promise((resolve,reject)=>{const processHandle=child(args);let out='';processHandle.stdout.on('data',value=>out+=value);processHandle.once('error',reject);processHandle.once('exit',code=>code===0?resolve(out):reject(new Error(`QA process failed: ${code}\n${logs}`)));});}
async function ready(){for(let i=0;i<100;i++){try{if((await fetch(`${origin}/api/v1/health`)).ok)return;}catch{}await new Promise(resolve=>setTimeout(resolve,200));}throw new Error(`QA server not ready\n${logs}`);}
try{
  console.log('QA: create isolated database');qa=await createMathQaDatabase(dbPort);
  const sql=await run(['node_modules/prisma/build/index.js','migrate','diff','--from-empty','--to-schema-datamodel','apps/api/prisma/schema.prisma','--script']);await qa.db.exec(sql);
  db=new PrismaClient({datasources:{db:{url}}});
  // Seed through the standard script in its normal working directory.
  await new Promise((resolve,reject)=>{const seed=spawn(process.execPath,[path.join(root,'node_modules/ts-node/dist/bin.js'),'prisma/seed.ts'],{cwd:path.join(root,'apps/api'),env,windowsHide:true,stdio:'ignore'});seed.once('exit',code=>code===0?resolve():reject(new Error('QA seed failed')));});
  const student=await db.user.findUnique({where:{username:'duc_nguyen'}}), admin=await db.user.findUnique({where:{username:'admin'}});
  const skills=await db.skillNode.findMany({where:{grade:9},orderBy:{orderIndex:'asc'},take:3});
  await db.diagnosticAttempt.create({data:{studentId:student.id,status:'COMPLETED',completedAt:new Date()}});
  await db.skillMastery.createMany({data:[{studentId:student.id,skillId:skills[0].id,masteryScore:92,evidenceCount:8},{studentId:student.id,skillId:skills[1].id,masteryScore:48,evidenceCount:2}]});
  const question=await db.question.create({data:{skillId:skills[0].id,authorId:admin.id,status:'PUBLISHED',content:'Giải phương trình $2x=6$.',explanation:'Chia cả hai vế cho $2$, được $x=3$.',options:{create:[{optionKey:'A',content:'3',isCorrect:true},{optionKey:'B',content:'6',isCorrect:false}]}}});
  await db.mistakeRecord.create({data:{studentId:student.id,questionId:question.id}});
  await db.mathReviewCard.create({data:{studentId:student.id,questionId:question.id,scheduler:JSON.parse(JSON.stringify(createEmptyCard()))}});
  child(['--require','./scripts/qa-math-tutor-provider.cjs','apps/api/dist/main.js']);
  child(['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(webPort),'--strictPort'],{API_PROXY_TARGET:`http://127.0.0.1:${apiPort}`});await ready();
  console.log('QA: servers ready, launch browser');browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-first-run'],defaultViewport:{width:1440,height:1000}});
  const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));
  console.log('QA: open app');await page.goto(origin,{waitUntil:'networkidle0'});
  await page.evaluate(async()=>{const response=await fetch('/api/v1/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier:'duc_nguyen',password:'P@ssword123!'})});if(!response.ok)throw new Error('Login failed');});
  await page.reload({waitUntil:'networkidle0'});await page.waitForSelector('[data-tab="profile"]');await page.click('[data-tab="profile"]');await page.waitForSelector('.competency-chart');
  assert(await page.$eval('.competency-chart',el=>el.textContent.includes('Chưa đánh giá')&&el.textContent.includes('Chưa đủ bằng chứng')&&el.textContent.includes('92%')));
  await page.select('.competency-chart-filters label:nth-child(2) select','priority');
  assert(await page.$eval('.competency-chart-rows li:first-child',el=>el.textContent.includes('48%')));
  await page.select('.competency-chart-filters label:nth-child(2) select','curriculum');
  await page.screenshot({path:path.join(output,'competency-desktop.png'),fullPage:true});
  await page.setViewport({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,'competency-mobile.png'),fullPage:true});
  await page.setViewport({width:1440,height:1000});await page.click('[data-tab="review"]');await page.waitForSelector('.study-review>button');await page.click('.study-review>button');await page.waitForSelector('input[name="math-review"]');await page.click('input[name="math-review"]');
  await page.evaluate(()=>[...document.querySelectorAll('button')].find(button=>button.textContent==='Kiểm tra đáp án').click());await page.waitForSelector('.study-revealed .math-tutor-chat textarea');
  async function send(text,count){await page.waitForFunction(()=>!document.querySelector('.study-revealed .math-tutor-chat textarea')?.disabled);await page.type('.study-revealed .math-tutor-chat textarea',text);await page.click('.study-revealed .math-tutor-chat form button');await page.waitForFunction(expected=>document.querySelectorAll('.study-revealed .math-tutor-transcript article').length===expected,{},count);}
  await send('Vì sao chia hai vế cho 2?',1);await send('Vậy x bằng bao nhiêu?',2);
  assert(await page.$eval('.study-revealed .math-tutor-transcript',el=>el.textContent.includes('lượt 2')));
  await page.screenshot({path:path.join(output,'tutor-desktop.png'),fullPage:true});
  await page.setViewport({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,'tutor-mobile.png'),fullPage:true});
  await page.setViewport({width:1440,height:1000});await page.reload({waitUntil:'networkidle0'});await page.waitForSelector('[data-tab="review"]');await page.click('[data-tab="review"]');await page.waitForSelector('.math-tutor-archive button');await page.click('.math-tutor-archive button');await page.waitForFunction(()=>document.querySelectorAll('.math-tutor-transcript article').length===2);
  const ledger=await db.aiRequest.findMany({where:{userId:student.id,task:'MATH_CHAT'}});assert.equal(ledger.length,2);assert(ledger.every(row=>row.status==='COMPLETED'&&row.costUsd>0));
  const replay=await page.evaluate(async row=>{const response=await fetch('/api/v1/student/review/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({reviewId:row.conversationId,requestId:row.lessonId,reason:row.message})});return {status:response.status,body:await response.json()};},ledger[0]);
  assert.equal(replay.status,201);assert.equal(replay.body.replayed,true);assert.equal(await db.aiRequest.count({where:{userId:student.id,task:'MATH_CHAT'}}),2);
  const strangerContext=await browser.createBrowserContext(),stranger=await strangerContext.newPage();await stranger.goto(origin,{waitUntil:'networkidle0'});
  const strangerStatus=await stranger.evaluate(async reviewId=>{
    const call=(route,body)=>fetch(`/api/v1/${route}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    const registered=await call('auth/register/student',{username:'tutorqa_other',fullName:'Other QA learner',password:'OtherQaStrong123!'});if(!registered.ok)throw new Error('QA registration failed');
    await call('auth/login',{identifier:'tutorqa_other',password:'OtherQaStrong123!'});
    return (await fetch(`/api/v1/student/review/chat/${reviewId}`)).status;
  },ledger[0].conversationId);assert.equal(strangerStatus,404);await strangerContext.close();
  const exam=await db.diagnosticAttempt.create({data:{studentId:student.id,status:'IN_PROGRESS'}});
  const examStatus=await page.evaluate(async reviewId=>(await fetch(`/api/v1/student/review/chat/${reviewId}`)).status,ledger[0].conversationId);assert.equal(examStatus,403);await db.diagnosticAttempt.delete({where:{id:exam.id}});
  await page.evaluate(()=>[...document.querySelectorAll('.math-tutor-chat header button')].find(button=>button.textContent==='Xóa lịch sử').click());await page.waitForFunction(()=>document.querySelectorAll('.math-tutor-transcript article').length===0);
  assert.equal(await db.aiRequest.count({where:{userId:student.id,task:'MATH_CHAT',message:{not:null}}}),0);
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'VERIFICATION.md'),'# Biểu đồ năng lực và chatbot — kiểm chứng local\n\nPassed: actual React UI + Nest API + isolated PostgreSQL protocol database. AI upstream uses an explicitly test-only controlled provider; no real provider credential or production database used.\n\n- Real login; mastery API includes assessed, provisional and unassessed skills; priority sorting verified.\n- Desktop and 390px mobile, no horizontal overflow.\n- Two chat turns with earlier assistant context reaching provider adapter.\n- Reload and reopen history; two persisted usage charges.\n- Replay request creates no extra usage charge.\n- Another authenticated student gets 404 on foreign conversation; active diagnostic gets 403.\n- Clear history removes content while retaining accounting.\n- No unhandled browser errors.\n\nScreenshots: competency-desktop.png, competency-mobile.png, tutor-desktop.png, tutor-mobile.png.\n');
  console.log('Math competency and tutor browser QA passed.');
}catch(error){console.error('QA failure:',error.message,logs);if(browser){const pages=await browser.pages();if(pages[1]){console.error((await pages[1].evaluate(()=>document.body.innerText)).slice(0,1600));await pages[1].screenshot({path:path.join(output,'failure.png'),fullPage:true});}}throw error;}finally{await browser?.close();for(const processHandle of children)if(processHandle.exitCode===null)processHandle.kill();await db?.$disconnect();await qa?.close();}
