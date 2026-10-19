import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {randomBytes,randomUUID} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {PrismaClient} from '@prisma/client';
import {createEmptyCard} from 'ts-fsrs';

const origin='https://adaptivemath-blush.vercel.app';
const env=Object.fromEntries(fs.readFileSync('.env.math-production.local','utf8').trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
if(env.MATH_SUPABASE_PROJECT_REF!=='turjtcqkmjfkhqijjpdz'||new URL(env.DATABASE_URL).searchParams.get('schema')!=='math')throw new Error('Unexpected destination.');
const db=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
const output=path.join(process.cwd(),'docs/evidence/math-tutor/live');fs.mkdirSync(output,{recursive:true});
const username=`qa_ai_${Date.now()}`,password=randomBytes(24).toString('hex');
let userId,skillId,questionId,browser;let callCount=0;
try{
  browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],defaultViewport:{width:1440,height:1000}});
  const page=await browser.newPage();page.setDefaultTimeout(60000);await page.goto(origin,{waitUntil:'networkidle0'});
  userId=await page.evaluate(async credentials=>{const call=async(route,body)=>{const r=await fetch(`/api/v1/${route}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw new Error(`${route}: ${r.status}`);return data;};const registered=await call('auth/register/student',{username:credentials.username,fullName:'QA gia sư Math — kiểm thử riêng',password:credentials.password});await call('auth/login',{identifier:credentials.username,password:credentials.password});return registered.id;},{username,password});
  // Grade 99 is outside real learner grades. No published fixture enters the live grade 6–9 curriculum.
  await db.studentProfile.update({where:{userId},data:{grade:99}});
  const skill=await db.skillNode.create({data:{code:`QA-${randomUUID()}`,title:'QA phương trình — dữ liệu kiểm thử',chapter:'QA riêng',grade:99,orderIndex:1}});skillId=skill.id;
  const question=await db.question.create({data:{authorId:userId,skillId,status:'PUBLISHED',content:'[QA kiểm thử riêng] Giải phương trình $2x=6$.',explanation:'Chia cả hai vế cho 2 để được x=3. Kiểm tra: 2×3=6.',options:{create:[{optionKey:'A',content:'3',isCorrect:true},{optionKey:'B',content:'6',isCorrect:false}]}}});questionId=question.id;
  await db.mistakeRecord.create({data:{studentId:userId,questionId}});
  await db.mathReviewCard.create({data:{studentId:userId,questionId,scheduler:JSON.parse(JSON.stringify(createEmptyCard()))}});
  await page.reload({waitUntil:'networkidle0'});await page.waitForSelector('[data-tab="review"]');await page.click('[data-tab="review"]');await page.waitForSelector('.study-review>button');await page.click('.study-review>button');await page.waitForSelector('input[name="math-review"]');await page.click('input[name="math-review"]');
  await page.evaluate(()=>[...document.querySelectorAll('button')].find(button=>button.textContent==='Kiểm tra đáp án').click());await page.waitForSelector('.study-revealed .math-tutor-chat textarea');
  const replies=[];
  for(const text of ['Vì sao phải chia cả hai vế cho 2?','Nếu chỉ chia vế trái thì có còn tương đương không? Hãy giải thích tiếp dựa trên câu trước.']){
    await page.waitForFunction(()=>!document.querySelector('.study-revealed .math-tutor-chat textarea')?.disabled);
    const responsePromise=page.waitForResponse(response=>response.url().endsWith('/student/review/chat')&&response.request().method()==='POST',{timeout:60000});
    await page.type('.study-revealed .math-tutor-chat textarea',text);callCount++;await page.click('.study-revealed .math-tutor-chat form button');
    const response=await responsePromise;const data=await response.json();if(response.status()>=400)throw new Error(`Live chat returned ${response.status()}: ${JSON.stringify(data)}`);assert(data.text?.trim());replies.push(data.text);
    await page.waitForFunction(expected=>document.querySelectorAll('.study-revealed .math-tutor-transcript article').length===expected,{},replies.length);
  }
  const rows=await db.aiRequest.findMany({where:{userId,task:'MATH_CHAT'},orderBy:{createdAt:'asc'}});assert.equal(rows.length,2);
  for(const row of rows){assert.equal(row.status,'COMPLETED');assert.equal(row.reservedUsd,0);assert.equal(row.costUsd,(row.inputTokens*5+row.outputTokens*25)/1e6);assert(row.inputTokens>0&&row.outputTokens>0);}
  await page.screenshot({path:path.join(output,'mwapi-conversation-desktop.png'),fullPage:true});await page.setViewport({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,'mwapi-conversation-mobile.png'),fullPage:true});
  const total=rows.reduce((sum,row)=>sum+row.costUsd,0);
  fs.writeFileSync(path.join(output,'MWAPI-VERIFICATION.md'),`# MWAPI real provider verification\n\nDate: ${new Date().toISOString()}\n\n- Two authenticated browser chat turns through Math Vercel → isolated Render → MWAPI. No provider mock used.\n- Model: ${rows[0].model}. Pricing accepted by user: input $5 / output $25 per million tokens.\n- Both persisted requests COMPLETED; reservation released; token-based cost verified.\n- Total recorded cost: $${total.toFixed(6)}.\n- Desktop + 390px mobile; no horizontal overflow.\n- Controlled QA question in grade 99, outside the real curriculum. Fixture and chat content removed after the test; usage accounting retained against a suspended test account.\n- Does not certify any real question bank as reviewed or published.\n\nFirst response:\n\n${replies[0]}\n\nFollow-up response:\n\n${replies[1]}\n`);
  console.log(JSON.stringify({realProvider:true,turns:2,totalRecordedCostUsd:total,status:'passed'}));
}finally{
  await browser?.close();if(!userId)userId=(await db.user.findUnique({where:{username}}))?.id;
  if(userId){await db.aiRequest.updateMany({where:{userId},data:{message:null,result:{qaContentRemoved:true},conversationId:null,lessonId:null}});await db.session.deleteMany({where:{userId}});await db.mathReviewCard.deleteMany({where:{studentId:userId}});await db.mistakeRecord.deleteMany({where:{studentId:userId}});await db.user.update({where:{id:userId},data:{status:'SUSPENDED'}});}
  if(questionId)await db.question.delete({where:{id:questionId}});if(skillId)await db.skillNode.delete({where:{id:skillId}});
  console.log(`QA fixtures cleaned; ${callCount} provider request attempts, accounting retained.`);await db.$disconnect();
}
