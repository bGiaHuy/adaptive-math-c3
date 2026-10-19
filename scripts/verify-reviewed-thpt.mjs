import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
const require=createRequire(import.meta.url),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(path.join(root,'apps/api'));
const {NestFactory}=require('@nestjs/core');
const {AppModule}=require('../apps/api/dist/app.module.js');
const {PrismaService}=require('../apps/api/dist/modules/prisma/prisma.service.js');
const {AuthService}=require('../apps/api/dist/modules/auth/auth.service.js');
const {getSessionCookieName}=require('../apps/api/dist/modules/auth/session-cookie.js');
const {AssignmentService}=require('../apps/api/dist/modules/assignment/assignment.service.js');
const {TeacherWorkspaceService}=require('../apps/api/dist/modules/assignment/teacher-workspace.service.js');
const imported=JSON.parse(fs.readFileSync(path.join(root,'content/thpt-reviewed/local-import.json')));
const output=path.join(root,'docs/evidence/reviewed-thpt');fs.mkdirSync(output,{recursive:true});
const report={checks:[],errors:[]},app=await NestFactory.createApplicationContext(AppModule,{logger:false});
const db=app.get(PrismaService),auth=app.get(AuthService),tokens=[],temporaryClasses=[],temporaryAssignments=[];
const base='http://127.0.0.1:3027';let browser;
async function cookieFor(id){const token=(await auth.createSessionForUser(id,'Reviewed THPT verification','127.0.0.1')).sessionToken;tokens.push(token);return `${getSessionCookieName()}=${token}`;}
try{
 assert.ok(['127.0.0.1','localhost','[::1]'].includes(new URL(process.env.DATABASE_URL).hostname));
 const teacherId=imported.ownerId,cookie=await cookieFor(teacherId);
 let r=await fetch(base+'/api/v1/admin/questions',{headers:{cookie}});assert.equal(r.status,200);
 const rows=await r.json();assert.equal(rows.length,54);assert.ok(rows.every(q=>q.status==='DRAFT'&&q.authorId===teacherId&&q.reviewerId===null&&q.skill.grade>=10));
 for(const grade of [10,11,12])assert.equal(rows.filter(q=>q.skill.grade===grade).length,18);
 const otherTeacher=await db.user.findFirst({where:{role:'TEACHER',status:'ACTIVE',id:{not:teacherId},teacherProfile:{verificationStatus:'VERIFIED'}}});
 if(otherTeacher){r=await fetch(base+'/api/v1/admin/questions',{headers:{cookie:await cookieFor(otherTeacher.id)}});assert.equal(r.status,200);assert.ok((await r.json()).every(q=>!imported.ids.includes(q.id)));}
 const student=await db.user.findFirst({where:{role:'STUDENT',status:'ACTIVE'}});assert.ok(student);
 r=await fetch(base+'/api/v1/admin/questions',{headers:{cookie:await cookieFor(student.id)}});assert.equal(r.status,403);
 report.checks.push('54 private teacher drafts, 18 per grade; legacy bank excluded; student cannot read answer bank; no fake publication or reviewer');
 const classroom=await db.classroom.create({data:{teacherId,name:'TEMP THPT content verification',grade:12,memberships:{create:{studentId:student.id}}}});temporaryClasses.push(classroom.id);
 const service=app.get(AssignmentService),workspace=app.get(TeacherWorkspaceService);
 const selected=rows.filter(q=>q.skill.grade===12&&['I','II','III'].includes(q.source.part)).filter(q=>q.source.questionNumber==='1');assert.equal(selected.length,3);
 const counts={SINGLE_CHOICE:1,TRUE_FALSE:1,SHORT_ANSWER:1};
 const create=async()=>{const result=await service.createAssignment(teacherId,classroom.id,{title:'TEMP reviewed THPT assignment',durationMinutes:45,questionIds:selected.map(q=>q.id),questionCounts:counts,settings:{resultsPolicy:'IMMEDIATE'}});temporaryAssignments.push(result.assignment.id);return result.assignment.id;};
 const a=await create(),b=await create();
 const bankBefore=JSON.stringify(await db.question.findMany({where:{id:{in:imported.ids}},include:{options:true},orderBy:{id:'asc'}}));
 const bBefore=JSON.stringify(await db.assignmentQuestion.findMany({where:{assignmentId:b},orderBy:{id:'asc'}}));
 const delivered=await service.getAssignmentForTaking(student.id,a);
 const answerFor=q=>q.questionType==='SINGLE_CHOICE'?{questionId:q.id,selectedOptionKey:q.options.find(o=>o.isCorrect).optionKey}:q.questionType==='TRUE_FALSE'?{questionId:q.id,response:{trueFalseAnswers:Object.fromEntries(q.statements.map(s=>[s.key,s.isCorrect]))}}:{questionId:q.id,response:{shortAnswer:q.shortAnswer.acceptedAnswers[0].replace('.',',')}};
 await service.submitAssignment(student.id,a,{timeSpentSeconds:2,answers:selected.map(answerFor)});
 const submission=await db.assignmentSubmission.findUnique({where:{assignmentId_studentId:{assignmentId:a,studentId:student.id}},include:{answers:true}});assert.equal(submission.score,10);assert.equal(submission.correctCount,3);
 const changes=selected.map(q=>({id:q.id,questionType:q.questionType,content:q.content,options:q.options.map(o=>({key:o.optionKey,content:o.content})),correctOption:q.options.find(o=>o.isCorrect)?.optionKey,statements:q.statements||[],shortAnswer:q.shortAnswer||undefined,explanation:q.explanation,difficulty:q.difficulty}));
 changes[0].explanation+=' Kiểm tra cách ly bản sao.';
 const preview=await workspace.regrade(teacherId,classroom.id,a,{revision:1,reason:'TEMP isolation verification',questions:changes,apply:false});assert.equal(preview.applied,false);
 const applied=await workspace.regrade(teacherId,classroom.id,a,{revision:1,reason:'TEMP isolation verification',questions:changes,apply:true});assert.equal(applied.revision,2);
 assert.equal(JSON.stringify(await db.question.findMany({where:{id:{in:imported.ids}},include:{options:true},orderBy:{id:'asc'}})),bankBefore);
 assert.equal(JSON.stringify(await db.assignmentQuestion.findMany({where:{assignmentId:b},orderBy:{id:'asc'}})),bBefore);
 report.checks.push('Real assignment snapshots from SC/TF/SA drafts; student submission scored 10/10; regrade preview/apply preserved source bank and second assignment');
 browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox','--disable-gpu']});
 await browser.setCookie({name:getSessionCookieName(),value:tokens[0],url:base,httpOnly:true});
 const page=await browser.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(base+'/#/teacher-bank?materialTab=%22reviewed%22',{waitUntil:'networkidle0'});
 await page.waitForSelector('.qb-question');
 await page.waitForFunction(()=>[...document.querySelectorAll('.qb-question img')].every(i=>i.complete&&i.naturalWidth>0));
 assert.ok((await page.$eval('.qb-results-toolbar',n=>n.textContent)).includes('18 / 18'));
 for(const width of [1440,390]){await page.setViewport({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,`bank-${width}.png`)});}
 const select=await page.$('.question-bank-filters select');assert.ok(select);
 await page.goto(base+'/#/teacher-library?draft=%22thpt-verification%22&composerTab=%22bank%22&method=%22bank%22&methodOpened=true',{waitUntil:'networkidle0'});
 await page.waitForSelector('.tec-bank-workspace input[type=checkbox]');
 await page.click('.tec-bank-workspace input[type=checkbox]');
 await page.waitForSelector('.tec-selected-question');
 assert.equal(await page.$$eval('.tec-selected-question',n=>n.length),1);
 await page.screenshot({path:path.join(output,'composer.png')});
 report.checks.push('Teacher library shows 18 questions per selected grade, original images load on desktop/mobile; composer selection creates a visible question preview');
 assert.deepEqual(report.errors,[]);
 fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{
 await browser?.close();
 for(const id of temporaryClasses)await db.classroom.delete({where:{id}});
 if(temporaryAssignments.length)await db.auditLog.deleteMany({where:{targetEntity:'ClassroomAssignment',targetEntityId:{in:temporaryAssignments}}});
 for(const token of tokens)await auth.logout(token);
 await app.close();
}

