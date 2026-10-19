import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase=process.argv[2]||'before',out='docs/evidence/ux-structural-followup';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--no-sandbox']});const report=[];let state='populated',errors=[];
try{const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await p.setRequestInterception(true);
p.on('request',async r=>{if(!r.url().includes('/api/'))return r.continue();const path=new URL(r.url()).pathname;let body={},status=200;
if(path.endsWith('/auth/me'))body={user:{id:'teacher-portal-fixture',role:'TEACHER',fullName:'Giáo viên kiểm thử'}};
else if(state==='error'&&path.endsWith('/classrooms')){status=503;body={message:'Không thể tải dữ liệu lớp học. Thử lại.'};}
else if(path.endsWith('/classrooms')){if(state==='loading')await new Promise(ok=>setTimeout(ok,1500));body={classrooms:state==='empty'?[]:fixture.classes};}
else if(path.endsWith('/submissions'))body=fixture.assignmentReport(path.split('/').at(-2));
else if(path.endsWith('/assignments'))body={assignments:state==='empty'?[]:fixture.assignments.filter(a=>a.classId===path.split('/').at(-2))};
else if(path.includes('/curriculum/skills'))body={chapters:[{chapter:'Toán 9',skills:[1,2,3].map(i=>({id:`skill${i}`,title:['Căn bậc hai','Phương trình bậc hai','Đường tròn'][i-1]}))}]};
else if(path.endsWith('/admin/questions'))body=state==='sparse'?fixture.bank.slice(0,1):state==='empty'?[]:state==='long'?fixture.bank.map(q=>({...q,content:q.content+' '+('Giải thích điều kiện xác định của biểu thức và chứng minh kết quả bằng phép biến đổi tương đương. ').repeat(12)})):fixture.bank;
else if(/\/classrooms\/c\d$/.test(path))body={classroom:fixture.details(path.split('/').at(-1))};
else if(r.method()!=='GET'){status=400;body={message:'Audit chỉ đọc, chưa thực hiện thao tác này.'};}
await r.respond({status,contentType:'application/json',body:JSON.stringify(body)});});
const measurements=[];for(const [size,width,height]of[['desktop',1440,900],['laptop',1280,800],['tablet',768,1024],['mobile',390,844]]){await p.setViewport({width,height});for(const [name,selector]of[['student','.ar-student-row button'],['question','.ar-question-preview'],['publish',null]]){await p.goto('http://127.0.0.1:3000/#/teacher-library?report=%22a3%22&reportTab=%22results%22',{waitUntil:'networkidle2'});await p.reload({waitUntil:'networkidle2'});if(selector)await p.click(selector);else {const trigger=await p.evaluateHandle(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Kiểm tra & công bố')));await trigger.asElement().click();}console.log('opening',name,size);await p.waitForSelector('[role=dialog]');await p.screenshot({path:out+'/'+phase+'-'+name+'-'+size+'.png'});measurements.push(await p.evaluate(({name,size})=>{const d=document.querySelector('[role=dialog]'),r=d.getBoundingClientRect();return{name,size,rect:{top:r.top,bottom:r.bottom,width:r.width},scroll:d.scrollHeight,client:d.clientHeight,focus:d.contains(document.activeElement),overflow:document.documentElement.scrollWidth>innerWidth};},{name,size}));await p.evaluate(()=>{const d=document.querySelector('[role=dialog]');d.scrollTop=d.scrollHeight;for(const e of d.querySelectorAll('*'))if(e.scrollHeight>e.clientHeight+20&&getComputedStyle(e).overflowY==='auto')e.scrollTop=e.scrollHeight;});measurements.at(-1).scrollReached=await p.evaluate(()=>[...document.querySelectorAll('[role=dialog], [role=dialog] *')].filter(e=>e.scrollHeight>e.clientHeight+20&&getComputedStyle(e).overflowY==='auto').map(e=>({label:e.getAttribute('aria-label'),tabIndex:e.tabIndex,reached:e.scrollTop+e.clientHeight>=e.scrollHeight-2})));const containment=[];for(let k=0;k<40;k++){await p.keyboard.press('Tab');containment.push(await p.evaluate(()=>document.querySelector('[role=dialog]').contains(document.activeElement)));}measurements.at(-1).all40TabsContained=containment.every(Boolean);measurements.at(-1).tabContained=await p.evaluate(()=>document.querySelector('[role=dialog]').contains(document.activeElement));await p.keyboard.press('Escape');await new Promise(ok=>setTimeout(ok,80));measurements.at(-1).returnedFocus=await p.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent?.slice(0,90)}));measurements.at(-1).escapeClosed=await p.evaluate(()=>!document.querySelector('[role=dialog]'));}}fs.writeFileSync(out+'/'+phase+'-dialogs.json',JSON.stringify(measurements,null,2));console.log(JSON.stringify(measurements));}finally{await b.close();}







