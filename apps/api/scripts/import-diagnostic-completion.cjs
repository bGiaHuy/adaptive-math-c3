// Reviewed additive content import. Default is read-only; apply requires the batch hash.
require('ts-node/register');
require('reflect-metadata');
const fs=require('fs'),path=require('path'),{createHash}=require('crypto');
const {PrismaClient}=require('@prisma/client');
const {validateQuestion,buildQuestionData}=require('../src/modules/question/math-question');
const katex=require('katex');
const base=path.resolve(__dirname,'../../..'),folder=path.join(base,'docs/math-import/diagnostic-completion-2026-10-19');
const raw=fs.readFileSync(path.join(folder,'batch.json'),'utf8'),batch=JSON.parse(raw),hash=createHash('sha256').update(raw).digest('hex');
const cloud=process.argv.includes('--production'),apply=process.argv.includes('--apply');
if(cloud){const env=Object.fromEntries(fs.readFileSync(path.join(base,'.env.math-production.local'),'utf8').split(/\r?\n/).filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1).replace(/^"|"$/g,'')]}));process.env.DATABASE_URL=env.DATABASE_URL;}
const url=new URL(process.env.DATABASE_URL||'');
if(cloud&&(!url.hostname.endsWith('.supabase.com')||url.searchParams.get('schema')!=='math'||!url.username.includes('turjtcqkmjfkhqijjpdz')))throw Error('Unexpected Math destination');
if(!cloud&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname))throw Error('Expected localhost');
if(apply&&!process.argv.includes('--confirm-'+hash))throw Error('Apply requires reviewed batch SHA256');
const proposed=[{code:'MATH9-QUADRATIC-FUNCTIONS',title:'Hàm số y = ax² và đồ thị',chapter:'HÀM SỐ VÀ PHƯƠNG TRÌNH BẬC HAI',grade:9,orderIndex:14}];
const norm=s=>s.normalize('NFC').replace(/[\s$.,;:!?−–-]/g,'').toLowerCase();
async function main(){
 for(const q of batch.questions){validateQuestion(q);if(!q.cognitiveLevel||!q.difficulty||!q.skillCode)throw Error('Missing label');for(const t of[q.content,q.explanation,...(q.options||[]).map(o=>o.content),...(q.statements||[]).map(s=>s.content)])for(const m of String(t).matchAll(/\$([^$]+)\$/g))katex.renderToString(m[1],{throwOnError:true});}
 const db=new PrismaClient();try{
 const skills=await db.skillNode.findMany({where:{grade:9}}),existing=await db.question.findMany({where:{skill:{grade:9}},include:{options:true}}),admin=await db.user.findFirst({where:{username:'admin',role:'ADMIN'},select:{id:true}});if(!admin)throw Error('No existing admin');
 const additions=[],skipped=[],seen=new Set();
 for(const q of batch.questions){const duplicate=existing.find(e=>norm(e.content)===norm(q.content));const evidence=null;if(duplicate||evidence){skipped.push({externalId:q.externalId,id:(duplicate||evidence).id,reason:duplicate?'EXISTING_CONTENT':'EXISTING_SOURCE_SEPARATE_REVIEW_REQUIRED'});continue;}if(seen.has(norm(q.content)))throw Error('Duplicate batch');seen.add(norm(q.content));if(!skills.some(s=>s.code===q.skillCode)&&!proposed.some(s=>s.code===q.skillCode))throw Error('Unknown skill '+q.skillCode);additions.push(q);}
 const needed=proposed.filter(s=>additions.some(q=>q.skillCode===s.code)&&!skills.some(e=>e.code===s.code));
 const report={date:new Date().toISOString(),destination:cloud?'MATH_PRODUCTION':'LOCAL',batchSha256:hash,reviewed:batch.questions.length,additions:additions.map(q=>({externalId:q.externalId,skillCode:q.skillCode,questionType:q.questionType})),skipped,newSkills:needed,mode:apply?'APPLY':'DRY_RUN'};
 if(apply){const dir=path.join(base,'.math-adaptive-qa/diagnostic-completion-2026-10-19');fs.mkdirSync(dir,{recursive:true});const before=path.join(dir,(cloud?'production':'local')+'-before.json');try{fs.writeFileSync(before,JSON.stringify({skills,questions:existing},null,2),{flag:'wx'})}catch(e){if(e.code!=='EEXIST')throw e;}
 report.result=await db.$transaction(async tx=>{const map=new Map(skills.map(s=>[s.code,s.id]));for(const s of needed){const row=await tx.skillNode.create({data:s});map.set(s.code,row.id);}const ids=[];for(const q of additions){const h=createHash('sha256').update(batch.batchId+':'+q.externalId).digest('hex'),id=`${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;await tx.question.create({data:{id,skillId:map.get(q.skillCode),authorId:admin.id,content:q.content,explanation:q.explanation,status:'PUBLISHED',difficulty:q.difficulty,cognitiveLevel:q.cognitiveLevel,...buildQuestionData({...q,source:{...q.source,importBatchId:batch.batchId,batchSha256:hash}})}});ids.push(id);}return{imported:ids.length,ids};},{timeout:60000});report.verified=await db.question.findMany({where:{source:{path:['importBatchId'],equals:batch.batchId}},select:{id:true,status:true,questionType:true,cognitiveLevel:true,difficulty:true,skill:{select:{code:true,title:true}}}});}
 fs.writeFileSync(path.join(folder,(cloud?'production':'local')+(apply?'-result':'-dry-run')+'.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await db.$disconnect();}}
main().catch(e=>{console.error(e.message);process.exitCode=1});
