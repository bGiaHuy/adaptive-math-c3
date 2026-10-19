import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PDFParse } from 'pdf-parse';
import { createCanvas, loadImage } from '@napi-rs/canvas';

// These are source excerpts, never a transformed multiple-choice/essay bank.
// Pin the PDF renderer adapter here rather than reading the old AI transcription.
const specs=[
  {id:'THPT-10-CUOI_HK1-026',grade:10,pages:3,answerPages:[7,8,9,10,11]},
  {id:'THPT-11-CUOI_HK1-126',grade:11,pages:3,answerPages:[7,8,9,10]},
  {id:'THPT-12-CUOI_HK1-227',grade:12,pages:4,answerPages:[9,10,11,12]},
];
const out=path.resolve('content/thpt-materials');
fs.mkdirSync(path.join(out,'question-images'),{recursive:true});
const questions=[];
for(const spec of specs){
  const parser=new PDFParse({data:fs.readFileSync(`outputs/thpt-300-papers/sources/${spec.id}.pdf`),verbosity:0});
  try{
    await parser.getInfo();
    const markers=[],pages=[];
    for(let n=1;n<=spec.pages;n++){
      const page=await parser.doc.getPage(n),viewport=page.getViewport({scale:1});
      const text=await page.getTextContent();
      const pageMarkers=text.items.filter(i=>/^Câu\s+\d+[.:]/u.test(i.str?.trim()||'')).map(i=>({page:n,number:Number(i.str.match(/\d+/)[0]),y:viewport.height-i.transform[5]-Math.abs(i.transform[3])-3})).sort((a,b)=>a.y-b.y);
      markers.push(...pageMarkers);
      const screenshot=await parser.getScreenshot({partial:[n],desiredWidth:1440,imageDataUrl:false});
      pages.push({width:viewport.width,height:viewport.height,image:await loadImage(Buffer.from(screenshot.pages[0].data))});
    }
    const sequence=[...Array.from({length:12},(_,i)=>i+1),1,2,1,2,3,4,1,2,3,4];
    if(markers.length!==22||markers.some((m,i)=>m.number!==sequence[i]))throw new Error(`${spec.id}: unexpected source question sequence; inspect before publishing`);
    for(let index=0;index<markers.length;index++){
      const marker=markers[index],next=markers[index+1]||{page:spec.pages+1,y:0};
      const question={id:`${spec.id}-Q${String(index+1).padStart(2,'0')}`,paperId:spec.id,grade:spec.grade,orderIndex:index+1,originalItemNumber:marker.number,part:index<12?'I':index<14?'II':index<18?'III':'IV',originalType:index<12?'SINGLE_CHOICE':index<14?'TRUE_FALSE':index<18?'SHORT_ANSWER':'ESSAY',examCode:'132',sourcePages:[],answerPages:spec.answerPages,images:[],imageHashes:[],reviewStatus:'SOURCE_EXCERPT',automaticGrading:false};
      const lastPage=next.page<=spec.pages?next.page:spec.pages;
      for(let n=marker.page;n<=lastPage;n++){
        const p=pages[n-1],top=n===marker.page?marker.y+4:20,bottom=n===next.page?next.y+3:p.height-25;
        if(bottom-top<15)continue;
        const scale=p.image.width/p.width;
        const canvas=createCanvas(Math.round((p.width-54)*scale),Math.ceil((bottom-top)*scale));
        const ctx=canvas.getContext('2d');
        ctx.drawImage(p.image,27*scale,top*scale,(p.width-54)*scale,(bottom-top)*scale,0,0,canvas.width,canvas.height);
        const file=`${question.id}-${question.images.length+1}.png`;
        const png=canvas.toBuffer('image/png');
        fs.writeFileSync(path.join(out,'question-images',file),png);
        question.imageHashes.push(crypto.createHash('sha256').update(png).digest('hex'));
        question.images.push(file);question.sourcePages.push(n);
      }
      if(!question.images.length)throw new Error(`No image for ${question.id}`);
      questions.push(question);
    }
  }finally{await parser.destroy();}
}
fs.writeFileSync(path.join(out,'questions.json'),JSON.stringify({items:questions},null,2));
console.log(JSON.stringify({questions:questions.length,byType:questions.reduce((a,q)=>(a[q.originalType]=(a[q.originalType]||0)+1,a),{}),images:questions.reduce((n,q)=>n+q.images.length,0)},null,2));



