import fs from 'node:fs';
import {PrismaClient} from '@prisma/client';

// Import reference skills only; never create demo accounts or publish seed questions.
const env=Object.fromEntries(fs.readFileSync('.env.math-production.local','utf8').trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
const destination=new URL(env.DATABASE_URL);
if(env.MATH_SUPABASE_PROJECT_REF!=='turjtcqkmjfkhqijjpdz'||destination.searchParams.get('schema')!=='math'||!destination.username.startsWith('math_app.'))throw new Error('Unexpected destination.');
const source=fs.readFileSync('apps/api/prisma/seed.ts','utf8');
const block=source.match(/const skillsData = \[([\s\S]*?)\];/);
if(!block)throw new Error('Canonical curriculum not found.');
const skills=[...block[1].matchAll(/\{ code: '([^']+)', title: '([^']+)', chapter: '([^']+)', orderIndex: (\d+) \}/g)].map(([,code,title,chapter,order])=>({code,title,chapter,orderIndex:Number(order),grade:9}));
if(skills.length!==8)throw new Error('Unexpected canonical skill inventory; inspect before importing.');
const db=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
try{for(const skill of skills)await db.skillNode.upsert({where:{code:skill.code},create:skill,update:{}});
console.log(JSON.stringify({referenceSkills:await db.skillNode.count({where:{grade:9}}),users:await db.user.count(),publishedQuestions:await db.question.count({where:{status:'PUBLISHED'}})}));
}finally{await db.$disconnect();}
