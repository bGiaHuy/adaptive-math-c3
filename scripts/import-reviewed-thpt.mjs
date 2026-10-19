// Additive LOCAL import. Never publishes, edits existing questions, or rewrites assignments.
import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const raw=fs.readFileSync(path.join(root,'content/thpt-reviewed/batch.json'),'utf8');
const batch=JSON.parse(raw),hash=createHash('sha256').update(raw).digest('hex');
const apply=process.argv.includes('--apply');
process.chdir(path.join(root,'apps/api'));
const {NestFactory}=require('@nestjs/core');
const {AppModule}=require('../apps/api/dist/app.module.js');
const {PrismaService}=require('../apps/api/dist/modules/prisma/prisma.service.js');
const {validateQuestion,buildQuestionData,gradeQuestion}=require('../apps/api/dist/modules/question/math-question.js');
const {THPT_CURRICULUM}=require('../apps/api/dist/modules/curriculum/thpt-catalog.js');
const katex=require('katex');
const idFor=q=>{const h=createHash('sha256').update(batch.batchId+':'+q.externalId).digest('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;};
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const skills=THPT_CURRICULUM.flatMap(level=>level.chapters.flatMap((chapter,ci)=>chapter.topics.map((topic,ti)=>({code:topic.id,title:topic.title,chapter:chapter.title,grade:level.grade,orderIndex:ci*100+ti}))));
const app=await NestFactory.createApplicationContext(AppModule,{logger:false});
try{
 assert.ok(['localhost','127.0.0.1','[::1]'].includes(new URL(process.env.DATABASE_URL).hostname),'Only local database is authorized');
 const db=app.get(PrismaService);
 assert.equal(batch.questions.length,54);
 for(const q of batch.questions){
  validateQuestion(q);assert.ok(skills.some(s=>s.code===q.skillCode));
  assert.ok(q.source.peerReviewed===false&&q.source.reviewStatus==='SOURCE_KEY_AND_SOLUTION_CHECKED');
  for(const s of [q.explanation,...(q.options||[]).map(o=>o.content),...(q.statements||[]).map(o=>o.content)])for(const m of s.matchAll(/\$([^$]+)\$/g))katex.renderToString(m[1],{throwOnError:true});
  for(const name of q.source.immutableImages){assert.match(name,/^thpt-question-[a-f0-9]{64}\.png$/);const data=fs.readFileSync(path.join(root,'public/math-import-assets',name));assert.equal(createHash('sha256').update(data).digest('hex'),name.slice(14,-4));}
  const shaped={...q,options:(q.options||[]).map(o=>({...o,optionKey:o.key,isCorrect:o.key===q.correctOption}))};
  const correct=q.questionType==='SINGLE_CHOICE'?{selectedOptionKey:q.correctOption}:q.questionType==='TRUE_FALSE'?{response:{trueFalseAnswers:Object.fromEntries(q.statements.map(s=>[s.key,s.isCorrect]))}}:{response:{shortAnswer:q.shortAnswer.acceptedAnswers[0]}};
  assert.equal(gradeQuestion(shaped,correct).pointsAwarded,1);
  assert.equal(gradeQuestion(shaped,{}).pointsAwarded,0);
 }
 const priorReport=path.join(root,'content/thpt-reviewed/local-import.json');
 const previous=fs.existsSync(priorReport)?JSON.parse(fs.readFileSync(priorReport)):null;
 const teacher=previous?.ownerId?await db.user.findUnique({where:{id:previous.ownerId}}):await db.user.findFirst({where:{role:'TEACHER',status:'ACTIVE',teacherProfile:{verificationStatus:'VERIFIED'}},orderBy:{createdAt:'asc'}});
 assert.ok(teacher&&teacher.role==='TEACHER'&&teacher.status==='ACTIVE','Existing active verified teacher required');
 const ids=batch.questions.map(idFor);
 const existing=await db.question.findMany({where:{id:{in:ids}},include:{options:true}});
 for(const row of existing){const q=batch.questions.find(q=>idFor(q)===row.id);assert.equal(row.source?.batchSha256,hash,'Existing batch differs; review a new version instead');assert.equal(row.authorId,teacher.id);assert.equal(row.content,q.content);}
 const before=await db.classroomAssignment.findMany({orderBy:{id:'asc'}});
 const other=await db.question.findMany({where:{id:{notIn:ids}},orderBy:{id:'asc'},include:{options:true}});
 const additions=batch.questions.filter(q=>!existing.some(r=>r.id===idFor(q)));
 const report={batchId:batch.batchId,batchSha256:hash,mode:apply?'APPLY':'DRY_RUN',ownerId:teacher.id,status:'DRAFT',peerReviewed:false,questions:54,existing:existing.length,toImport:additions.length,assignmentDigestBefore:digest(before),priorQuestionDigest:digest(other)};
 if(apply&&additions.length){
  await db.$transaction(async tx=>{
   const map=new Map();
   for(const code of [...new Set(additions.map(q=>q.skillCode))]){
    const proposed=skills.find(s=>s.code===code);
    let row=await tx.skillNode.findUnique({where:{code}});
    if(!row)row=await tx.skillNode.create({data:proposed});
    assert.equal(row.grade,proposed.grade);map.set(code,row.id);
   }
   for(const q of additions)await tx.question.create({data:{id:idFor(q),authorId:teacher.id,skillId:map.get(q.skillCode),content:q.content,explanation:q.explanation,status:'DRAFT',difficulty:q.difficulty,cognitiveLevel:q.cognitiveLevel,...buildQuestionData({...q,source:{...q.source,batchSha256:hash}})}});
   await tx.auditLog.create({data:{actorUserId:teacher.id,action:'THPT_SOURCE_BATCH_IMPORTED_AS_DRAFT',targetEntity:'QuestionBatch',targetEntityId:batch.batchId,metadata:{batchSha256:hash,questionIds:additions.map(idFor),sourceComparison:'CODEX',peerReviewed:false}}});
  },{timeout:60000});
 }
 assert.equal(digest(await db.classroomAssignment.findMany({orderBy:{id:'asc'}})),report.assignmentDigestBefore,'Assignment changed during import');
 assert.equal(digest(await db.question.findMany({where:{id:{notIn:ids}},orderBy:{id:'asc'},include:{options:true}})),report.priorQuestionDigest,'Pre-existing question changed');
 if(apply){report.imported=additions.length;report.ids=ids;fs.writeFileSync(priorReport,JSON.stringify(report,null,2)+'\n');}
 else fs.writeFileSync(path.join(root,'content/thpt-reviewed/dry-run.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({mode:report.mode,questions:54,existing:existing.length,imported:report.imported??0,toImport:additions.length,status:'DRAFT',assignmentsUnchanged:true,priorQuestionsUnchanged:true}));
}finally{await app.close();}

