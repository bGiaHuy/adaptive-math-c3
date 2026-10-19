/** Run from apps/api: ts-node scripts/import-math-question-bank.ts <batch.json> [--apply --author-id UUID --confirm-local] */
import 'reflect-metadata';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { buildQuestionData, validateQuestion } from '../src/modules/question/math-question';
const katex = require('katex');
const stable = (value:any):string => JSON.stringify(canonical(value));
function canonical(value:any):any {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value==='object') return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));
  return value;
}

// Only doubled TeX command escapes, never matrix row separators \\\\ followed by a value.
const normalizeTexCommands = (s: string) => s.replace(/\\\\(?=[A-Za-z])/g, '\\');
function verifyTex(q: any) {
  for (const s of [q.content,...(q.options||[]).map((o:any)=>o.content),...(q.statements||[]).map((o:any)=>o.content)]) {
    for (const m of String(s).matchAll(/\$([^$]+)\$/g)) {
      if (/\\\\[A-Za-z]/.test(m[1]) && !/\\begin\{(?:cases|[pbvBV]?matrix|aligned|array)\}/.test(m[1])) throw new Error(`Doubled TeX command escape: ${q.externalId}`);
      katex.renderToString(m[1],{throwOnError:true,strict:'ignore'});
    }
  }
}

const APPROVED_SKILLS: Record<string,{title:string;chapter:string}> = {
  'MATH9-STATISTICS': {title:'Thống kê và tần số tương đối',chapter:'THỐNG KÊ VÀ XÁC SUẤT'},
  'MATH9-PROBABILITY': {title:'Xác suất của biến cố',chapter:'THỐNG KÊ VÀ XÁC SUẤT'},
  'MATH9-SOLIDS': {title:'Hình trụ, hình nón và hình cầu',chapter:'HÌNH KHỐI'},
  'MATH9-LINEAR-INEQUALITY': {title:'Bất đẳng thức và bất phương trình bậc nhất một ẩn',chapter:'PHƯƠNG TRÌNH VÀ BẤT PHƯƠNG TRÌNH'},
  'MATH9-LINEAR-EQUATIONS': {title:'Phương trình bậc nhất, phương trình tích và phương trình chứa ẩn ở mẫu',chapter:'PHƯƠNG TRÌNH VÀ BẤT PHƯƠNG TRÌNH'},
  'MATH9-CUBE-ROOTS': {title:'Căn bậc ba',chapter:'CĂN BẬC HAI VÀ CĂN BẬC BA'},
};

function idFor(key: string) {
  const hex = createHash('sha256').update(`adaptive-math-source-v1:${key}`).digest('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-5${hex.slice(13,16)}-a${hex.slice(17,20)}-${hex.slice(20,32)}`;
}
async function main() {
  const args = process.argv.slice(2);
  const file = args.find(a => !a.startsWith('--'));
  if (!file) throw new Error('Provide a batch JSON file. Default is dry-run.');
  const batch = JSON.parse(readFileSync(resolve(file), 'utf8'));
  if (!batch.batchId || !Array.isArray(batch.questions) || !batch.questions.length || batch.questions.length > 30) throw new Error('Batch needs batchId and 1–30 questions.');
  const ids = new Set<string>();
  const contents = new Set<string>();
  const prepared = batch.questions.map((q: any) => {
    if (!q.skillCode || !['EASY','MEDIUM','HARD','VERY_HARD'].includes(q.difficulty)) throw new Error(`Question needs explicit topic and difficulty labels: ${q.externalId}`);
    validateQuestion(q);
    verifyTex(q);
    if (q.status !== 'DRAFT' || q.source?.reviewStatus !== 'VERIFIED' || !q.source.file || !Number.isInteger(q.source.page) || q.source.page < 1 || !q.source.questionNumber || !q.skillCode || !q.externalId) throw new Error(`Missing verified provenance or draft status: ${q.externalId}`);
    const key = `${q.source.file.replace(/\\/g,'/')}#${q.source.page}#${q.source.questionNumber}`;
    const id = idFor(key);
    const normalized = q.content.normalize('NFC').trim().replace(/\s+/g,' ');
    if (ids.has(id) || contents.has(normalized)) throw new Error('Duplicate source question/content within batch.');
    ids.add(id); contents.add(normalized);
    const contentHash=createHash('sha256').update(JSON.stringify({content:q.content,options:q.options,statements:q.statements,shortAnswer:q.shortAnswer})).digest('hex');
    const typed=buildQuestionData({...q,source:{...q.source,externalId:q.externalId,answerEvidence:q.answerEvidence,contentHash,reviewNotes:q.reviewNotes}});
    return { q, id, typed, contentHash };
  });
  const counts = Object.fromEntries(['SINGLE_CHOICE','TRUE_FALSE','SHORT_ANSWER'].map(t => [t,prepared.filter((x:any)=>x.q.questionType===t).length]));
  if (!args.includes('--apply')) {
    console.log(JSON.stringify({batchId:batch.batchId,mode:'DRY_RUN',count:prepared.length,counts,approvedNewSkills:[...new Set(prepared.map((p:any)=>p.q.skillCode))].filter(code=>APPROVED_SKILLS[String(code)]).map(code=>({code,...APPROVED_SKILLS[String(code)],grade:9})),questions:prepared.map((p:any)=>({id:p.id,externalId:p.q.externalId,skillCode:p.q.skillCode,contentHash:p.contentHash,source:p.typed.source}))},null,2));
    return;
  }
  const url = new URL(process.env.DATABASE_URL || '');
  if (!['localhost','127.0.0.1','[::1]'].includes(url.hostname) || !args.includes('--confirm-local')) throw new Error('Apply is restricted to explicit confirmed localhost database.');
  const authorId = args[args.indexOf('--author-id')+1];
  if (!args.includes('--author-id') || !authorId) throw new Error('--author-id is required for apply.');
  const prisma = new PrismaClient();
  try {
    const author = await prisma.user.findUnique({where:{id:authorId},select:{id:true,role:true}});
    if (!author || !['ADMIN','CONTENT_AUTHOR','TEACHER'].includes(author.role)) throw new Error('Author must be existing admin, content author or teacher.');
    const result = await prisma.$transaction(async tx => {
      let imported=0, skipped=0, repaired=0;
      for (const p of prepared) {
        let skill=await tx.skillNode.findUnique({where:{code:p.q.skillCode}});
        if (!skill && APPROVED_SKILLS[p.q.skillCode]) skill=await tx.skillNode.create({data:{code:p.q.skillCode,...APPROVED_SKILLS[p.q.skillCode],grade:9,orderIndex:20+Object.keys(APPROVED_SKILLS).indexOf(p.q.skillCode)}});
        if (!skill || skill.grade!==9) throw new Error(`Grade9 skill missing: ${p.q.skillCode}`);
        const existing:any=await tx.question.findUnique({where:{id:p.id},include:{options:true}});
        if (existing) {
          const normOptions=(os:any[],repair=false)=>os.map(o=>({optionKey:o.optionKey,content:repair?normalizeTexCommands(o.content):o.content,isCorrect:o.isCorrect})).sort((a,b)=>a.optionKey.localeCompare(b.optionKey));
          const normStatements=(ss:any,repair=false)=>ss?.map((s:any)=>({...s,content:repair?normalizeTexCommands(s.content):s.content}))||null;
          const sameAnswers=existing.content===p.q.content && existing.questionType===p.q.questionType && stable(existing.shortAnswer||null)===stable(p.q.shortAnswer||null);
          const sameFormat=stable(existing.statements||null)===stable(p.q.statements||null) && stable(normOptions(existing.options))===stable(normOptions(p.q.options||[]));
          const source:any=existing.source;
          const allowRepair=args.includes('--repair-source-format') && existing.status==='DRAFT' && source?.file===p.q.source.file && source?.page===p.q.source.page && source?.questionNumber===p.q.source.questionNumber && sameAnswers && stable(normStatements(existing.statements,true))===stable(p.q.statements||null) && stable(normOptions(existing.options,true))===stable(normOptions(p.q.options||[]));
          if (!sameAnswers || (!sameFormat && !allowRepair)) throw new Error(`Source already imported with different content: ${p.q.externalId}; review required, no overwrite.`);
          if (!sameFormat && allowRepair) {
            if (p.q.statements) await tx.question.update({where:{id:p.id},data:{statements:p.q.statements} as any});
            for (const o of p.q.options||[]) await tx.questionOption.update({where:{questionId_optionKey:{questionId:p.id,optionKey:o.optionKey}},data:{content:o.content}});
            repaired++;
          }
          await tx.question.update({where:{id:p.id},data:{source:p.typed.source,skillId:skill.id} as any});
          skipped++;continue;
        }
        const duplicate=await tx.question.findFirst({where:{content:p.q.content,skillId:skill.id},select:{id:true}});
        if (duplicate) throw new Error(`Content already exists at ${duplicate.id}; review provenance rather than duplicating.`);
        await tx.question.create({data:{id:p.id,skillId:skill.id,authorId,content:p.q.content,status:'DRAFT',difficulty:p.q.difficulty,...(p.q.explanation?{explanation:p.q.explanation}:{}),...p.typed} as any});
        imported++;
      }
      return {imported,skipped,repaired};
    });
    console.log(JSON.stringify({batchId:batch.batchId,mode:'LOCAL_APPLY',counts,...result},null,2));
  } finally { await prisma.$disconnect(); }
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
