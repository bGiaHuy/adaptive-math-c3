import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const out='docs/evidence/pastel-thpt';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const results=[];
try{
 await page.goto('http://127.0.0.1:3017/',{waitUntil:'networkidle0'});
 await page.waitForSelector('.pastel-landing');
 await page.evaluate(()=>document.fonts.ready);
 for(const width of [1440,1074,768,390]){
 await page.setViewport({width,height:884});
 await page.screenshot({path:`${out}/landing-refined-${width}.png`,fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Landing overflow ${width}`);
 }
 await page.setViewport({width:1074,height:884});
 await page.click('.landing-nav-actions .btn-nav-link:nth-child(2)');
 await page.waitForSelector('.pastel-auth');
 for(const width of [1440,1074,768,390]){
 await page.setViewport({width,height:884});
 await page.screenshot({path:`${out}/login-refined-${width}.png`,fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Login overflow ${width}`);
 }
 await page.click('.auth-password-toggle');
 assert.equal(await page.$eval('#auth-field-12',n=>n.type),'text');
 await page.click('.auth-password-toggle');
 assert.equal(await page.$eval('#auth-field-12',n=>n.type),'password');
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
 results.push({page:'login',violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))});
 await page.click('.auth-link-btn');
 await page.setViewport({width:1074,height:884});
 await page.screenshot({path:`${out}/signup-refined-1074.png`,fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 results.push({page:'signup',violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))});
 await page.click('.auth-back-link');
 await page.waitForSelector('.pastel-landing');
 results.push({page:'landing',violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))});
 assert.equal(errors.length,0);
 console.log(JSON.stringify({errors,results},null,2));
 fs.writeFileSync(`${out}/entry-refinement-report.json`,JSON.stringify({errors,results,viewports:[1440,1074,768,390],passwordToggle:'passed',mode:'Live local API; no account created'},null,2));
}finally{await browser.close();}
