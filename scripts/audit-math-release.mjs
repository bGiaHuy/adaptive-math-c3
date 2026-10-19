import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PrismaClient} from '@prisma/client';
const env=Object.fromEntries(fs.readFileSync('.env.math-production.local','utf8').trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
assert.equal(env.MATH_SUPABASE_PROJECT_REF,'turjtcqkmjfkhqijjpdz');assert.equal(new URL(env.DATABASE_URL).searchParams.get('schema'),'math');
const db=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
try{
  const qaWhere={task:'MATH_CHAT',user:{username:{startsWith:'qa_ai_'}}};
  const rows=await db.aiRequest.findMany({where:qaWhere});
  assert.equal(rows.length,4);assert(rows.every(row=>row.status==='COMPLETED'&&row.reservedUsd===0&&row.message===null&&row.conversationId===null));
  assert.equal(await db.user.count({where:{username:{startsWith:'qa_'},status:'ACTIVE'}}),0);
  assert.equal(await db.skillNode.count({where:{grade:99}}),0);
  const health=await fetch('https://adaptivemath-blush.vercel.app/api/v1/health',{signal:AbortSignal.timeout(20000)});assert.equal(health.status,200);assert.equal((await health.json()).database,'connected');
  const result={date:new Date().toISOString(),site:'https://adaptivemath-blush.vercel.app',backend:'https://adaptivemath-api.onrender.com',health:'ok',qaRealAiRequests:rows.length,qaCompleted:rows.length,qaReservationsUsd:0,qaRecordedCostUsd:Number(rows.reduce((sum,row)=>sum+row.costUsd,0).toFixed(6)),activeQaAccounts:0,qaGrade99Skills:0,publishedQuestions:await db.question.count({where:{status:'PUBLISHED'}}),referenceSkills:await db.skillNode.count({where:{grade:9}})};
  fs.writeFileSync('docs/evidence/math-tutor/live/FINAL-AUDIT.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await db.$disconnect();}
