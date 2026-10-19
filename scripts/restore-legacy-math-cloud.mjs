import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomBytes} from 'node:crypto';
import {PrismaClient} from '@prisma/client';
import {hash} from '@node-rs/argon2';
const source=process.argv[2];if(!source)throw new Error('Supply the legacy Math source directory.');
const env=Object.fromEntries(fs.readFileSync('.env.math-production.local','utf8').trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
if(env.MATH_SUPABASE_PROJECT_REF!=='turjtcqkmjfkhqijjpdz'||new URL(env.DATABASE_URL).searchParams.get('schema')!=='math')throw new Error('Unexpected destination.');
const raw=fs.readFileSync(path.join(source,'data/questions.js'),'utf8');
const bank=JSON.parse(raw.replace(/^\s*window\.AM_QUESTION_BANK\s*=\s*/,'').replace(/;\s*$/,''));
const topicsText=fs.readFileSync(path.join(source,'js/core/topics.js'),'utf8');
const match=topicsText.match(/const RAW\s*=\s*(\[[\s\S]*?\]);\s*const TOPICS/);if(!match)throw new Error('Topic data not found.');
const topics=JSON.parse(match[1].replace(/,\s*\]/g,']'));
if(bank.questions.length!==1472||topics.length!==92)throw new Error('Unexpected source inventory.');
const topicIds=new Set(topics.map(topic=>topic[0]));
for(const q of bank.questions)if(!topicIds.has(q.topicId)||q.status!=='ok'||q.options.length!==4||q.options.filter(option=>option.isCorrect).length!==1||!q.solution?.trim())throw new Error(`Invalid source question ${q.id}`);
const levels={N:'REMEMBERING',H:'UNDERSTANDING',V:'APPLYING',T:'ADVANCED_APPLYING'};
fs.mkdirSync('content/math',{recursive:true});fs.writeFileSync('content/math/legacy-bank.json',JSON.stringify(bank));fs.writeFileSync('content/math/legacy-topics.json',JSON.stringify(topics));
const db=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
try{
 const author=await db.user.upsert({where:{username:'math_legacy_source'},update:{},create:{username:'math_legacy_source',fullName:'Nguồn kho Math cũ — không đăng nhập',role:'CONTENT_AUTHOR',status:'SUSPENDED',passwordHash:await hash(randomBytes(48).toString('hex'))}});
 const skills=new Map();for(const [code,grade,chapter,lesson,title,chapterTitle] of topics){const skill=await db.skillNode.upsert({where:{code},update:{},create:{code,grade,title,chapter:chapterTitle,orderIndex:chapter*100+lesson}});skills.set(code,skill.id);}
 const existing=await db.question.findMany({where:{id:{startsWith:'legacy-math:'}},select:{id:true,content:true}});const existingMap=new Map(existing.map(q=>[q.id,q.content]));
 const fresh=bank.questions.filter(q=>{const id=`legacy-math:${q.id}`;if(existingMap.has(id)&&existingMap.get(id)!==q.prompt)throw new Error(`Existing restored source differs: ${q.id}`);return !existingMap.has(id);});
 for(let i=0;i<fresh.length;i+=100){const group=fresh.slice(i,i+100);await db.$transaction([
  db.question.createMany({data:group.map(q=>({id:`legacy-math:${q.id}`,skillId:skills.get(q.topicId),authorId:author.id,reviewerId:null,status:'IN_REVIEW',cognitiveLevel:levels[q.level],content:q.prompt,explanation:`${q.solution}\n\nNguồn: kho AdaptiveMath cũ; mã ${q.id}. Khôi phục trạng thái hoạt động của nguồn, không phải một lượt thẩm định mới.`,irtA:q.irt?.a??null,irtB:q.irt?.b??null,irtC:q.irt?.c??null}))}),
  db.questionOption.createMany({data:group.flatMap(q=>q.options.map(option=>({questionId:`legacy-math:${q.id}`,optionKey:option.label||option.optionKey,content:option.content,isCorrect:option.isCorrect})))}),
 ],{timeout:30000});}
 const count=await db.question.count({where:{id:{startsWith:'legacy-math:'}}});if(count!==1472)throw new Error('Restored question count mismatch.');
 const report={date:new Date().toISOString(),sourceSha256:createHash('sha256').update(raw).digest('hex'),sourceQuestions:1472,sourceTopics:92,restoredQuestions:count,newlyInserted:fresh.length,options:await db.questionOption.count({where:{question:{id:{startsWith:'legacy-math:'}}}}),status:'IN_REVIEW awaiting explicit legacy restoration activation',newAcademicReviewClaimed:false,studentHistoryRestored:false,englishServicesModified:false};
 fs.mkdirSync('docs/evidence/math-data-recovery',{recursive:true});fs.writeFileSync('docs/evidence/math-data-recovery/RESTORE-RESULT.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await db.$disconnect();}
