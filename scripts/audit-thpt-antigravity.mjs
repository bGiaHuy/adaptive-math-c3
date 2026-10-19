import fs from 'node:fs';
import crypto from 'node:crypto';
import katex from 'katex';
import {THPT_CURRICULUM} from '../apps/api/src/modules/curriculum/thpt-catalog.ts';
const root='outputs/thpt-content-research',out='outputs/thpt-independent-audit';fs.mkdirSync(out,{recursive:true});
const read=name=>JSON.parse(fs.readFileSync(`${root}/${name}`,'utf8'));
const questions=fs.readFileSync(`${root}/questions-candidates.jsonl`,'utf8').trim().split(/\r?\n/).map(JSON.parse);
const sources=read('sources.json'),papers=read('paper-selections.json');
const topics=new Set(THPT_CURRICULUM.flatMap(g=>g.chapters.flatMap(c=>c.topics.map(t=>t.id))));
const findings=[];const add=(id,code,details)=>findings.push({externalId:id,code,details});
function scan(value,id,path=''){
if(typeof value==='string'){
const matches=[...value.matchAll(/(\$\$|\$)([\s\S]*?)\1/g)];
for(const m of matches)try{katex.renderToString(m[2],{throwOnError:true,strict:'error',displayMode:m[1]==='$$'});}catch(e){add(id,'KATEX_ERROR',`${path}: ${e.message}`);}
const remainder=value.replace(/(\$\$|\$)([\s\S]*?)\1/g,'');if(/(?<!\\)\$/.test(remainder))add(id,'MATH_DELIMITER',path);
}else if(Array.isArray(value))value.forEach((v,i)=>scan(v,id,`${path}[${i}]`));else if(value&&typeof value==='object')for(const [k,v]of Object.entries(value))scan(v,id,`${path}.${k}`);
}
const emptyHash=crypto.createHash('sha256').update('').digest('hex');
const sourceAudit=sources.map(s=>({...s,auditStatus:'UNVERIFIED',issues:[...(!/^[a-f0-9]{64}$/i.test(s.sha256||'')?['INVALID_SHA256_LENGTH']:[]),...(s.sha256===emptyHash?['EMPTY_FILE_SHA256']:[]),'NO_LOCAL_SOURCE_ARTIFACT_OR_HASH_PROOF','NO_EXPLICIT_REUSE_PERMISSION_EVIDENCE'],evidenceNote:s.sourceId==='SRC-10-01'?'Located related real exam at https://toanmath.com/2025/01/de-cuoi-hoc-ky-1-toan-10-nam-2024-2025-truong-van-lang-quang-ninh.html and PDF https://toanmath.com/toanmath-pdf/de-cuoi-hoc-ky-1-toan-10-nam-2024-2025-truong-van-lang-quang-ninh.pdf (7 pages). Its first questions do not match SC01 and SC02 assigned to this source; original manifest claimed answer pages 5–10. Other sources not individually authenticated.':null}));
for(const q of questions){
scan({content:q.content,options:q.options,statements:q.statements,shortAnswer:q.shortAnswer,explanation:q.explanation},q.externalId);
if(!topics.has(q.topicCode))add(q.externalId,'UNKNOWN_TOPIC_CODE',q.topicCode);
if(!sources.some(s=>s.sourceId===q.source?.sourceId))add(q.externalId,'UNKNOWN_SOURCE',q.source?.sourceId);
if(!q.source?.page&&!q.source?.questionPage)add(q.externalId,'NO_QUESTION_PAGE','No per-question page or exam version for source comparison');
}
add('KNTT11-PILOT-TF02','WRONG_TRUTH_KEY','Statement c says 99 is a term. u_n=4n-1; n=(99+1)/4=25. Expected true, stored false. Original explanation itself confirms true. Also appears in grade 11 paper selection.');
add('KNTT10-PILOT-SA05','ANSWER_FORMAT_CONFLICT','Prompt requests reduced fraction a/b; instructions and TEXT acceptedAnswers also allow rounded 0.47. Need one explicit grading policy; no silent change.');
add('KNTT12-PILOT-SC01','INSUFFICIENT_EXTREMUM_ASSUMPTIONS','Derivative sign on either side alone does not guarantee a local maximum at x=1 without continuity/value assumptions. Variation table is mentioned but not attached. Review source table.');
add('KNTT12-PILOT-SC18','MISSING_CONDITIONAL_PROBABILITY_ASSUMPTION','P(A|B_i) needs P(B_i)>0. State this explicitly or verify the textbook definition of the partition used.');
const distribution=Object.fromEntries('ABCD'.split('').map(k=>[k,questions.filter(q=>q.questionType==='SINGLE_CHOICE'&&q.correctOption===k).length]));
const records=questions.map(q=>({externalId:q.externalId,grade:q.grade,originalStatus:q.verification?.status,status:'QUARANTINED',importEligible:false,mathematicalReview:'NOT_CERTIFIED',reasons:['SOURCE_NOT_AUTHENTICATED','REUSE_EVIDENCE_NOT_SUPPLIED',...findings.filter(f=>f.externalId===q.externalId).map(f=>f.code)]}));
const summary={candidateCount:questions.length,claimedVerifiedCount:questions.filter(q=>q.verification?.status==='VERIFIED').length,importEligibleCount:0,quarantinedCount:records.length,singleChoiceKeyDistribution:distribution,sourceCount:sources.length,invalidHashCount:sourceAudit.filter(s=>s.issues.includes('INVALID_SHA256_LENGTH')).length,emptyFileHashCount:sourceAudit.filter(s=>s.issues.includes('EMPTY_FILE_SHA256')).length,katexErrors:findings.filter(f=>f.code==='KATEX_ERROR').length,unknownTopicCodes:findings.filter(f=>f.code==='UNKNOWN_TOPIC_CODE').length,paperAudit:papers.map(p=>({id:p.selectionId,count:p.items.length,counts:Object.fromEntries(['SINGLE_CHOICE','TRUE_FALSE','SHORT_ANSWER'].map(t=>[t,p.items.filter(i=>i.questionType===t).length])),importEligible:false,wrongKeyIncluded:p.items.some(i=>i.externalId==='KNTT11-PILOT-TF02')})),limitations:['No claim of full independent mathematical certification','Only one related external source PDF inspected; others remain unverified','All original artifacts left unchanged; no database operations']};
for(const [name,data]of Object.entries({'summary.json':summary,'findings.json':findings,'source-audit.json':sourceAudit,'question-status.json':records}))fs.writeFileSync(`${out}/${name}`,JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(`${out}/import-approved.jsonl`,'');
console.log(JSON.stringify(summary,null,2));

