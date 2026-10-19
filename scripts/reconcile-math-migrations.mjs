import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createMathQaDatabase} from './math-qa-database.mjs';

// Generates a forward-only repair from the real migration chain, never a live DB.
const port=55444, root=process.cwd(), migrations=path.join(root,'apps/api/prisma/migrations');
const repair='20261014100000_schema_reconciliation';
const qa=await createMathQaDatabase(port);
const run=args=>new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['node_modules/prisma/build/index.js',...args],{cwd:root,windowsHide:true,env:{...process.env,DATABASE_URL:`postgresql://am:qa@127.0.0.1:${port}/math_adaptive_qa?connection_limit=1`},stdio:['ignore','pipe','pipe']});
  let out='',err='';child.stdout.on('data',data=>out+=data);child.stderr.on('data',data=>err+=data);child.once('exit',code=>code===0?resolve(out):reject(new Error(err)));child.once('error',reject);
});
try{
  const folders=fs.readdirSync(migrations).filter(name=>fs.existsSync(path.join(migrations,name,'migration.sql'))&&name!==repair).sort();
  for(const folder of folders){await qa.db.exec(fs.readFileSync(path.join(migrations,folder,'migration.sql'),'utf8'));console.log(`Applied ${folder} to isolated QA database`);}
  const url=`postgresql://am:qa@127.0.0.1:${port}/math_adaptive_qa?connection_limit=1`;
  const sql=await run(['migrate','diff','--from-url',url,'--to-schema-datamodel','apps/api/prisma/schema.prisma','--script']);
  if(/DROP (TABLE|COLUMN|TYPE)/i.test(sql))throw new Error('Refusing a destructive reconciliation.');
  const folder=path.join(migrations,repair);fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'migration.sql'),sql);
  await qa.db.exec(sql);
  const drift=await run(['migrate','diff','--from-url',url,'--to-schema-datamodel','apps/api/prisma/schema.prisma','--script']);
  if(!drift.includes('This is an empty migration'))throw new Error(`Remaining schema drift: ${drift}`);
  console.log('Full migration chain and forward reconciliation match the current schema.');
}finally{await qa.close();}
