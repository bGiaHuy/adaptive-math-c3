import fs from 'node:fs';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {PrismaClient} from '@prisma/client';
const env=Object.fromEntries(fs.readFileSync('.env.math-production.local','utf8').trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
if(env.MATH_SUPABASE_PROJECT_REF!=='turjtcqkmjfkhqijjpdz')throw new Error('Unexpected database');
const db=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
const username=`qa_restore_${Date.now()}`,password=randomBytes(24).toString('hex');let userId,cookie='';
async function call(route,body){const response=await fetch(`https://adaptivemath-blush.vercel.app/api/v1/${route}`,{method:'POST',headers:{'content-type':'application/json',origin:'https://adaptivemath-blush.vercel.app',cookie},body:JSON.stringify(body||{})});const cookies=response.headers.getSetCookie();if(cookies.length)cookie=cookies.map(c=>c.split(';')[0]).join('; ');const data=await response.json();assert(response.ok,`${route}: ${response.status} ${JSON.stringify(data)}`);return data;}
try{
 userId=(await call('auth/register/student',{username,password,fullName:'Kiểm chứng khôi phục Math — tạm'})).id;
 await call('auth/login',{identifier:username,password});
 const skill=await db.skillNode.findFirst({where:{grade:9,questions:{some:{id:{startsWith:'legacy-math:'},status:'PUBLISHED'}}}});
 const session=await call(`student/practice/start/${skill.id}`);
 assert(session.currentQuestion?.id.startsWith('legacy-math:'));assert.equal(session.currentQuestion.options.length,4);
 assert(!JSON.stringify(session.currentQuestion).includes('isCorrect'));
 await call(`student/practice/${session.sessionId}/abandon`);
 const report={date:new Date().toISOString(),origin:'https://adaptivemath-blush.vercel.app',registeredAndLoggedIn:true,legacyQuestionServedThroughProduction:true,options:4,answerNotExposed:true,practiceAbandoned:true};
 fs.writeFileSync('docs/evidence/math-data-recovery/LIVE-VERIFICATION.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{const temporary=await db.user.findMany({where:{username:{startsWith:'qa_restore_'},fullName:'Kiểm chứng khôi phục Math — tạm'},select:{id:true}});for(const user of temporary){await db.auditLog.deleteMany({where:{actorUserId:user.id}});await db.user.delete({where:{id:user.id}});}await db.$disconnect();}
