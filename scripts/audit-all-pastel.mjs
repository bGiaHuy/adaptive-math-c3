import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const out='docs/evidence/pastel-all-pages';fs.mkdirSync(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
const classes=[{id:'qa-class',name:'Toán 10A1',grade:10,academicYear:'2026–2027',studentCount:5,isActive:true},{id:'qa-class2',name:'Toán 12A2',grade:12,academicYear:'2026–2027',studentCount:7,isActive:true}];
const assignment={id:'qa-report',classId:'qa-class',title:'Hàm số bậc hai và đồ thị',className:'Toán 10A1',status:'CLOSED',durationMinutes:45,questionCount:3,totalSubmissions:3,totalStudents:5,revision:1,resultsVisible:false,settings:{resultsPolicy:'MANUAL',published:false,showSolutions:true,folder:'Ôn tập chương VI',mode:'TEST',trackTabSwitches:true}};
const pages=['library','report-results','report-analytics','report-paper','report-settings','classes','class-detail','class-students','class-gradebook','class-skills','create-class','composer','composer-bank','composer-manual','composer-document','composer-json','composer-settings','composer-review','report-edit','report-publish','report-student','student-classroom','student-exam','student-exam-confirm','student-dashboard','tutor','onboarding','onboarding-2','onboarding-3','onboarding-4','onboarding-5','onboarding-6','onboarding-7','onboarding-8','admin-overview','admin-classrooms','admin-users','admin-audit','pending','rejected','sessions','password','legal','student-result','not-found','loading','curriculum'];
const pattern=process.argv[2]?new RegExp(process.argv[2]):null;
const report=pattern&&fs.existsSync(`${out}/report.json`)?JSON.parse(fs.readFileSync(`${out}/report.json`,'utf8')).pages.filter(row=>!pattern.test(row.mode)):[];
try{
for(const mode of pages.filter(mode => !pattern || pattern.test(mode))){
 const page=await browser.newPage();page.setDefaultTimeout(7000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setRequestInterception(true);
 page.on('request',async request=>{
  const path=new URL(request.url()).pathname;
  if(!path.startsWith('/api/'))return request.continue();
  if(request.method()!=='GET')return request.respond({status:400,contentType:'application/json',body:JSON.stringify({message:'Visual audit does not execute mutations.'})});
  let data={messages:[],questions:[],chapters:[],roster:[],students:[],assignments:[],skills:[],logs:[],users:[],sessions:[],classrooms:classes};
  if(path.endsWith('/classrooms'))data={classrooms:classes};
  if(/classrooms\/qa-class(?:2)?$/.test(path))data={classroom:classes[0],students:[],assignments:[assignment],members:[],teacher:{fullName:'Giáo viên kiểm thử'}};
  if(path.endsWith('/assignments'))data={assignments:[mode.startsWith('student-exam')?{...assignment,status:'PUBLISHED'}:assignment]};
  if(path.endsWith('/take'))data={assignment:{...assignment,questions:await page.evaluate(()=>window.__qaQuestions),className:'Toán 10A1',trackTabSwitches:false,isSubmitted:false,draftAnswers:[],timeSpentSeconds:0}};
  if(path.endsWith('/submissions'))data={assignment,roster:[],questions:[],questionAnalytics:[],history:[]};
  if(path.endsWith('/students'))data={students:[]};
  if(path.endsWith('/student/profile'))data={profile:{grade:10,dailyMinutes:45},joinedClassrooms:classes};
  if(path.endsWith('/admin/overview'))data={studentsCount:12,verifiedTeachersCount:2,publishedQuestionsCount:0,draftQuestionsCount:0,diagnosticAttemptsCount:0};
  if(path.includes('/admin/users'))data={users:[{id:'qa1',fullName:'Nguyễn Minh An',username:'minhan',role:'STUDENT',status:'ACTIVE',createdAt:'2026-10-10T00:00:00Z'}],pagination:{total:1,page:1,limit:15,totalPages:1}};
  if(path.includes('/admin/audit'))data=[];
  if(path.endsWith('/curriculum/grades'))data=[10,11,12].map(id=>({id,label:'Lớp '+id,desc:'Kết nối tri thức'}));
  if(path.endsWith('/auth/sessions'))data={sessions:[{id:'qa-session',isCurrent:true,userAgent:'Mozilla/5.0 Windows Chrome/',ipAddress:'127.0.0.1',createdAt:'2026-10-19T01:00:00Z',lastSeenAt:'2026-10-19T02:00:00Z'}]};
  request.respond({status:200,contentType:'application/json',body:JSON.stringify(data)});
 });
 const row={mode,errors,layouts:[]};
 try{
 await page.setViewport({width:1074,height:884});
 await page.goto('http://127.0.0.1:3017/scripts/pastel-audit.html?mode='+mode,{waitUntil:'networkidle0'});
 if(mode.startsWith('composer')){
   await page.waitForSelector('.teacher-workspace');
   await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Tạo đề mới'))?.click());
   await page.waitForSelector('.tw-exam-editor');
   const title={ 'composer-bank':'Ngân hàng câu hỏi','composer-manual':'Soạn thủ công','composer-document':'Tải đề từ tệp','composer-json':'Nhập từ JSON'}[mode];
   if(title)await page.click(`.tec-method-card[aria-label="${title}"]`);
   if(['composer-settings','composer-review'].includes(mode)){
     await page.evaluate(()=>{const titleKey=Object.keys(localStorage).find(k=>k.startsWith('exam-draft:')&&k.endsWith(':title'));const root=titleKey.slice(0,-6);localStorage.setItem(titleKey,JSON.stringify('Ôn tập hàm số và đồ thị'));localStorage.setItem(root+':counts',JSON.stringify({SINGLE_CHOICE:1,TRUE_FALSE:1,SHORT_ANSWER:1}));localStorage.setItem(root+':custom',JSON.stringify(window.__qaQuestions.map(q=>({...q,id:'custom_'+q.id}))));});
     await page.reload({waitUntil:'networkidle0'});
     await page.waitForSelector('.tw-exam-editor');
     await page.click('.tw-exam-editor>.tw-tabs button:nth-child(2)');
     if(mode==='composer-review')await page.click('.tw-exam-editor>.tw-tabs button:nth-child(3)');
   }
 }
 if(mode.startsWith('class-')){
   await page.waitForSelector('.tp-class-row');await page.click('.tp-class-row');
   await page.waitForSelector('.tw-tabs');
   const label={'class-students':'Học sinh','class-gradebook':'Sổ điểm','class-skills':'Tiến độ kỹ năng'}[mode];
   if(label)await page.evaluate(label=>[...document.querySelectorAll('.tw-tabs button')].find(b=>b.textContent===label)?.click(),label);
 }
 if(mode.startsWith('student-exam')){
   await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Bắt đầu làm bài')));
   await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Bắt đầu làm bài'))?.click());
   await page.waitForSelector('.student-exam-question');
   if(mode==='student-exam-confirm')await page.evaluate(()=>[...document.querySelectorAll('.student-exam button')].find(b=>b.textContent.includes('Nộp bài'))?.click());
 }
 if(mode==='tutor'){await page.click('.math-tutor-launcher');await page.waitForSelector('.math-tutor-panel:not([hidden])');}
 if(mode==='create-class'){await page.waitForSelector('.teacher-workspace');await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Tạo lớp')?.click());await page.waitForSelector('.tw-dialog');}
 if(mode.startsWith('onboarding-')){
   const steps=Number(mode.split('-')[1]);
   for(let i=1;i<steps;i++){await page.click('.btn-wizard-next');await page.waitForFunction(expected=>document.querySelector('.wizard-step-tag')?.textContent.includes('Bước '+expected+' /'),{},i+1);}
 }
 if(mode==='report-edit')await page.click('.qd-edit');
 if(mode==='report-publish')await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Kiểm tra & công bố')?.click());
 if(mode==='report-student')await page.click('.ar-view-submission');
 if(mode.startsWith('composer')){row.footer=await page.$eval('.tw-editor-footer',node=>getComputedStyle(node).position);if(row.footer!=='static')throw new Error('Composer footer covers form');}
 await page.evaluate(()=>document.fonts.ready);
 for(const width of [1074,390]){
  await page.setViewport({width,height:884});
  await page.screenshot({path:`${out}/${mode}-${width}.png`,fullPage:true});
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:document.querySelector('h1,h2')?.textContent,panels:[...document.querySelectorAll('.tl-record,.tw-surface,.ar-kpis>div,.tw-dialog,.account-dialog,.pastel-admin-stat')].slice(0,8).map(n=>({class:n.className,radius:getComputedStyle(n).borderRadius,background:getComputedStyle(n).backgroundColor}))}));
  row.layouts.push(layout);
 }
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
 row.accessibility=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
 if(mode==='report-paper')row.paper=await page.evaluate(()=>({questions:document.querySelectorAll('.question-display').length,hiddenQuestions:document.querySelectorAll('details .qd-prompt').length,editButtons:document.querySelectorAll('.qd-edit').length}));
 }catch(e){row.failure=e.message;await page.screenshot({path:`${out}/${mode}-error.png`,fullPage:true}).catch(()=>{});}
 report.push(row);fs.writeFileSync(`${out}/report.json`,JSON.stringify({mode:'Isolated visual fixtures; API mutations disabled',pages:report},null,2));console.log(JSON.stringify({mode,errors,overflow:row.layouts.filter(v=>v.scrollWidth>v.width),violations:row.accessibility?.map(v=>v.id),failure:row.failure}));
 await page.close();
}
}finally{fs.writeFileSync(`${out}/report.json`,JSON.stringify({mode:'Isolated visual fixtures; API mutations disabled',pages:report},null,2));await Promise.race([browser.close(),new Promise(resolve=>setTimeout(()=>{browser.process()?.kill();resolve();},3000))]);}
