import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
const require = createRequire(import.meta.url);
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(path.join(project, 'apps/api'));
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../apps/api/dist/app.module.js');
const { PrismaService } = require('../apps/api/dist/modules/prisma/prisma.service.js');
const { AuthService } = require('../apps/api/dist/modules/auth/auth.service.js');
const { getSessionCookieName } = require('../apps/api/dist/modules/auth/session-cookie.js');
const output = path.join(project, 'docs/evidence/learning-materials');
fs.mkdirSync(output, {recursive:true});
const base='http://127.0.0.1:3027';
const app=await NestFactory.createApplicationContext(AppModule,{logger:false});
let token, browser;
const report={checks:[],viewports:[],errors:[],accessibility:[]};
try {
  const db=app.get(PrismaService),auth=app.get(AuthService);
  const user=await db.user.findFirst({where:{role:'TEACHER',status:'ACTIVE',teacherProfile:{verificationStatus:'VERIFIED'}}});
  assert.ok(user,'An existing verified teacher is needed for the live test');
  token=(await auth.createSessionForUser(user.id,'Local materials verification','127.0.0.1')).sessionToken;
  const cookie=`${getSessionCookieName()}=${token}`;
  assert.equal((await fetch(`${base}/api/v1/curriculum/materials`)).status,401);
  const response=await fetch(`${base}/api/v1/curriculum/materials`,{headers:{cookie}});
  assert.equal(response.status,200);
  const catalog=await response.json();
  assert.equal(catalog.items.length,300);
  for(const grade of [10,11,12])assert.equal(catalog.items.filter(p=>p.grade===grade).length,100);
  report.checks.push('Authenticated catalog: 100 real PDFs per grade; unauthenticated request rejected');
  let fileCount=0;
  for(const paper of catalog.items){
    const r=await fetch(`${base}/api/v1/curriculum/materials/${paper.id}/file`,{method:'HEAD',headers:{cookie}});
    assert.equal(r.status,200,paper.id);assert.match(r.headers.get('content-type'),/application\/pdf/);
    assert.equal(Number(r.headers.get('content-length')),paper.sizeBytes);fileCount++;
  }
  report.checks.push(`${fileCount} document endpoints return expected PDF size and MIME`);
  const sample=catalog.items.find(p=>p.id==='THPT-12-CUOI_HK1-227');
  const range=await fetch(`${base}/api/v1/curriculum/materials/${sample.id}/file`,{headers:{cookie,Range:'bytes=0-4'}});
  assert.equal(range.status,206);assert.equal(await range.text(),'%PDF-');
  assert.equal((await fetch(`${base}/api/v1/curriculum/materials/${sample.id}/pages/99999`,{headers:{cookie}})).status,404);
  assert.equal((await fetch(`${base}/api/v1/curriculum/materials/unknown/file`,{headers:{cookie}})).status,404);
  const png=await fetch(`${base}/api/v1/curriculum/materials/${sample.id}/pages/1`,{headers:{cookie}});
  assert.equal(png.status,200);assert.match(png.headers.get('content-type'),/image\/png/);
  fs.writeFileSync(path.join(output,'original-grade12-page1.png'),Buffer.from(await png.arrayBuffer()));
  report.checks.push('PDF byte range and original page PNG work; invalid document/page return 404');
  const sourceQuestions=await (await fetch(`${base}/api/v1/curriculum/materials/questions`,{headers:{cookie}})).json();
  assert.equal(sourceQuestions.items.length,66);
  assert.equal(sourceQuestions.items.filter(q=>q.originalType==='ESSAY').length,12);
  assert.ok(sourceQuestions.items.every(q=>q.automaticGrading===false));
  for(const q of sourceQuestions.items)for(let i=0;i<q.images.length;i++){
    const r=await fetch(`${base}/api/v1/curriculum/materials/questions/${q.id}/images/${i+1}`,{headers:{cookie}});
    assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/image\/png/);
    assert.ok(Number(r.headers.get('content-length'))>500);
    const imageBytes=Buffer.from(await r.arrayBuffer());
    assert.equal(imageBytes.subarray(1,4).toString(),'PNG');
  }
  report.checks.push('66 source question excerpts and all image segments are accessible; 12 essays retain ESSAY type; none is used for automatic grading');
  browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox','--disable-gpu']});
  const page=await browser.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  await browser.setCookie({name:getSessionCookieName(),value:token,url:base,httpOnly:true});
  await page.goto(`${base}/#/teacher-bank`,{waitUntil:'networkidle0'});
  await page.waitForSelector('.lm-paper-card');
  for(const width of [1440,1024,768,390]){
    await page.setViewport({width,height:1000});
    const state=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,cards:document.querySelectorAll('.lm-paper-card').length}));
    assert.ok(state.scrollWidth<=width);assert.equal(state.cards,12);
    report.viewports.push(state);
    await page.screenshot({path:path.join(output,`catalog-${width}.png`),fullPage:true});
  }
  await page.setViewport({width:1440,height:1000});
  await page.click('.lm-grade:last-child');
  await page.waitForFunction(()=>document.querySelector('.lm-result-count p')?.textContent.includes('Lớp 12'));
  await page.type('.lm-search input','phu loc');
  assert.ok(await page.$$eval('.lm-paper-card',n=>n.length)>0);
  assert.ok(await page.$$eval('.lm-paper-card',n=>n.every(x=>x.textContent.includes('Phú Lộc'))));
  report.checks.push('Grade switching and accent-insensitive school search filter real documents');
  await page.addScriptTag({path:path.join(project,'node_modules/axe-core/axe.min.js')});
  report.accessibility=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
  await page.click(`#open-${sample.id}`);
  await page.waitForSelector('.lm-document-page img');
  await page.waitForFunction(()=>document.querySelector('.lm-document-page img')?.naturalWidth>0);
  assert.equal(await page.$$eval('.lm-document-page',n=>n.length),sample.pageCount);
  for(const width of [1440,390]){
    await page.setViewport({width,height:1000});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(output,`reader-${width}.png`)});
  }
  await page.click('.lm-back');await page.waitForSelector('.lm-paper-card');
  await page.click('.lm-tabs button:nth-child(2)');await page.waitForSelector('.lm-source-question');
  await page.select('.lm-source-questions select','ESSAY');
  assert.equal(await page.$$eval('.lm-source-question',nodes=>nodes.length),4);
  assert.ok(await page.$$eval('.lm-source-question .qd-heading',nodes=>nodes.every(n=>n.textContent.includes('Tự luận'))));
  for(const width of [1440,390]){
    await page.setViewport({width,height:1000});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(output,`source-questions-${width}.png`)});
  }
  await page.select('.lm-source-questions select','SINGLE_CHOICE');
  assert.equal(await page.$$eval('.lm-source-question',nodes=>nodes.length),5);
  assert.equal(await page.$$eval('.lm-source-question details',nodes=>nodes.length),0);
  await page.select('.lm-source-questions select','');
  await page.click('.lm-source-questions .tw-pagination button:last-child');
  await page.waitForFunction(()=>document.querySelector('.lm-source-question .qd-heading h3')?.textContent.includes('Câu 6'));
  assert.equal(await page.$$eval('.lm-source-question:first-of-type img',nodes=>nodes.length),2);
  report.checks.push('Source question type filtering, essays, full visible content, pagination and two-part graph question render correctly');
  await page.click('.lm-tabs button:last-child');await page.waitForSelector('.bento-curriculum');
  assert.equal(await page.$$eval('.bento-chapter-grid .bento-card',n=>n.length),6);
  report.checks.push('Reader loads original page images, all page containers are present, back navigation and KNTT curriculum tab work');
  assert.deepEqual(report.errors,[]);
  fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}finally{
  await browser?.close();
  if(token)await app.get(AuthService).logout(token);
  await app.close();
}
