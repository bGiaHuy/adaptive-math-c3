import fs from 'node:fs';
import {randomBytes} from 'node:crypto';
import {PrismaClient} from '@prisma/client';
const file='.env.math-production.local';
const entries=Object.fromEntries(fs.readFileSync(file,'utf8').trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
const url=new URL(fs.readFileSync('supabase/.temp/pooler-url','utf8').trim());
if(entries.MATH_SUPABASE_PROJECT_REF!=='turjtcqkmjfkhqijjpdz'||!url.username.endsWith('.turjtcqkmjfkhqijjpdz'))throw new Error('Unexpected cloud destination.');
url.username=`${entries.MATH_DATABASE_USER}.${entries.MATH_SUPABASE_PROJECT_REF}`;url.password=entries.MATH_DATABASE_PASSWORD;
url.search='?schema=math&sslmode=require&connection_limit=3&pool_timeout=30';
entries.DATABASE_URL=url.toString();entries.NODE_ENV='production';entries.WEB_URL='https://adaptivemath-blush.vercel.app';entries.SESSION_COOKIE_NAME='__Host-am_math_session';entries.SESSION_TTL_SECONDS='604800';entries.AI_ENABLED='false';
entries.SESSION_SECRET ||= randomBytes(48).toString('hex');entries.INVITE_CODE_HMAC_SECRET ||= randomBytes(48).toString('hex');
fs.writeFileSync(file,Object.entries(entries).map(([key,value])=>`${key}=${value}`).join('\n')+'\n',{mode:0o600});
const db=new PrismaClient({datasources:{db:{url:entries.DATABASE_URL}}});
try{await db.$connect();const result=await db.$queryRaw`SELECT current_user AS role, current_schema() AS schema`;
if(result[0]?.role!=='math_app'||result[0]?.schema!=='math')throw new Error('Unexpected runtime identity.');
console.log(JSON.stringify({connected:true,...result[0],users:await db.user.count(),questions:await db.question.count()}));
}finally{await db.$disconnect();}
