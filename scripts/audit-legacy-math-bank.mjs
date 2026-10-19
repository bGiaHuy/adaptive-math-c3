import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
const source=process.argv[2];if(!source)throw new Error('Supply the legacy Math directory.');
const text=fs.readFileSync(path.join(source,'data/questions.js'),'utf8');
const bank=JSON.parse(text.replace(/^\s*window\.AM_QUESTION_BANK\s*=\s*/,'').replace(/;\s*$/,''));
const questions=bank.questions||[], grades={},unique=new Set(),ids=new Set(),topics=new Set();
let invalid=0,duplicateIds=0,formulaErrors=0;
for(const question of questions){
 const grade=grades[question.grade]||={count:0,topics:new Set(),levels:{},uniquePrompts:new Set()};grade.count++;grade.topics.add(question.topicId);grade.levels[question.level]=(grade.levels[question.level]||0)+1;grade.uniquePrompts.add(question.prompt.trim());
 topics.add(question.topicId);if(ids.has(question.id))duplicateIds++;ids.add(question.id);unique.add(question.prompt.trim());
 if(question.options?.length!==4||question.options.filter(option=>option.isCorrect).length!==1||!question.solution?.trim()||!['N','H','V','T'].includes(question.level))invalid++;
 for(const value of [question.prompt,question.solution,...question.options.map(option=>option.content)])for(const match of (value||'').matchAll(/\$([^$]+)\$/g))try{katex.renderToString(match[1],{throwOnError:true});}catch{formulaErrors++;}
}
const report={source:source,declared:bank.totalCount,actual:questions.length,topics:topics.size,grades:Object.fromEntries(Object.entries(grades).map(([grade,data])=>[grade,{count:data.count,topics:data.topics.size,levels:data.levels,uniquePrompts:data.uniquePrompts.size}])),uniquePrompts:unique.size,repeatedPromptInstances:questions.length-unique.size,duplicateIds,invalidRecords:invalid,formulaErrors};
fs.mkdirSync('docs/evidence/math-data-recovery',{recursive:true});fs.writeFileSync('docs/evidence/math-data-recovery/LEGACY-INVENTORY.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
