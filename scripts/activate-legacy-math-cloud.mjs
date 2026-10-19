import fs from 'node:fs';
import {PrismaClient} from '@prisma/client';
const env=Object.fromEntries(fs.readFileSync('.env.math-production.local','utf8').trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
if(env.MATH_SUPABASE_PROJECT_REF!=='turjtcqkmjfkhqijjpdz'||new URL(env.DATABASE_URL).searchParams.get('schema')!=='math')throw new Error('Unexpected destination');
const bank=JSON.parse(fs.readFileSync('content/math/legacy-bank.json','utf8'));
const ids=bank.questions.map(q=>`legacy-math:${q.id}`);
if(ids.length!==1472||new Set(ids).size!==1472)throw new Error('Unexpected source inventory');
const db=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
try {
 const rows=await db.question.findMany({where:{id:{in:ids}},include:{options:true,skill:true}});
 if(rows.length!==1472||rows.some(q=>q.options.length!==4||q.options.filter(o=>o.isCorrect).length!==1||q.skill.grade<6||q.skill.grade>9))throw new Error('Restoration validation failed');
 const activated=await db.question.updateMany({where:{id:{in:ids},status:'IN_REVIEW'},data:{status:'PUBLISHED'}});
 const published=await db.question.count({where:{id:{in:ids},status:'PUBLISHED'}});
 if(published!==1472)throw new Error('Activation count mismatch');
 const report={...JSON.parse(fs.readFileSync('docs/evidence/math-data-recovery/RESTORE-RESULT.json','utf8')),activatedAt:new Date().toISOString(),status:'PUBLISHED',publishedQuestions:published,activatedThisRun:activated.count,authorization:'User explicitly approved restoring and using the legacy Math bank.',skillsDeleted:0};
 fs.writeFileSync('docs/evidence/math-data-recovery/RESTORE-RESULT.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report));
}finally{await db.$disconnect();}
