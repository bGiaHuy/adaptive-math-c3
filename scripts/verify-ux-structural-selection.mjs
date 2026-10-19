import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import {makeTeacherPortalFixture} from '../tests/fixtures/teacher-portal-fixture.mjs';
const phase=process.argv[2]||'before',out='docs/evidence/ux-structural';fs.mkdirSync(out,{recursive:true});const fixture=makeTeacherPortalFixture();
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
const rows=[];for(const [name,width,height]of[['desktop',1440,900],['laptop',1280,800],['tablet',768,1024],['mobile',390,844]]){await p.setViewport({width,height});await p.goto('http://127.0.0.1:3000/#/teacher-library',{waitUntil:'networkidle2'});await p.click('.tw-assignment-row');await new Promise(ok=>setTimeout(ok,400));rows.push(await p.evaluate(size=>({size,selected:document.querySelector('.tw-assignment-row[aria-pressed=true]')?.textContent,preview:(()=>{const r=document.querySelector('.tw-preview')?.getBoundingClientRect();return r?{top:r.top,left:r.left,right:r.right,bottom:r.bottom,width:r.width}:null})(),overflow:document.documentElement.scrollWidth>innerWidth}),name));await p.screenshot({path:out+'/after-library-selected-'+name+'.png'});}fs.writeFileSync(out+'/selected.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows));}finally{await b.close();}
