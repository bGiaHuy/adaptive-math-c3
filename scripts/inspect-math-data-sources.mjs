import fs from 'node:fs';
import {PrismaClient} from '@prisma/client';
const source=fs.readFileSync('apps/api/.env','utf8').split(/\r?\n/).find(line=>line.startsWith('DATABASE_URL='));
if(!source)throw new Error('Local database configuration missing.');
const url=new URL(source.slice(source.indexOf('=')+1).trim().replace(/^["']|["']$/g,''));
if(!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('This inspection only targets the configured local database.');
url.searchParams.set('connect_timeout','3');
const db=new PrismaClient({datasources:{db:{url:url.toString()}}});
try{
 const counts={users:await db.user.count(),questions:await db.question.count(),published:await db.question.count({where:{status:'PUBLISHED'}}),skills:await db.skillNode.count()};
 const skills=await db.skillNode.findMany({take:8,select:{code:true,title:true,grade:true}});
 console.log(JSON.stringify({source:'configured local Math database',counts,skills}));
}catch(error){console.log(JSON.stringify({source:'configured local Math database',available:false,errorType:error.name}));}finally{await db.$disconnect();}
