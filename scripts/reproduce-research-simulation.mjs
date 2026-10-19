import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(path.resolve('package.json'));
const ts=require('typescript');
const root='outputs/evidence-review/updated';
const source=fs.readFileSync('apps/api/src/modules/student/math-adaptive.ts','utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText; const exports=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const {probability,information,estimateAbility,selectStaircase,updateKnowledge,LEVELS}=exports;
let seed=20261016;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed+.5)/4294967296;};
const normal=()=>Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());
const pool=Array.from({length:8},(_,skill)=>LEVELS.flatMap((cognitiveLevel,l)=>Array.from({length:8},(_,j)=>({id:`s${skill}-l${l}-${j}`,skillId:`s${skill}`,cognitiveLevel,irtA:1.2,irtB:[-1.5,-.5,.5,1.5][l],irtC:.25})))).flat();
function mle(answers){let theta=0;for(let i=0;i<60;i++){let score=0,info=0;for(const answer of answers){const p=probability(theta,answer.question),a=1.2,c=.25;score+=a*(Number(answer.isCorrect)-p)*(p-c)/(p*(1-c));info+=information(theta,answer.question);}const step=Math.max(-.75,Math.min(.75,score/Math.max(info,1e-12)));theta=Math.max(-4,Math.min(4,theta+step));if(Math.abs(step)<1e-5)break;}return theta;}
const strategies=['staircase_map','staircase_mle','fisher_map'];
const metrics=Object.fromEntries(strategies.map(s=>[s,Array.from({length:24},(_,i)=>({questions:i+1,n:0,squaredError:0,boundary:0}))]));
const rows=['learner,strategy,questions,trueTheta,estimatedTheta,boundary'];
for(let person=0;person<1500;person++){
 if(person%250===0) console.log(person+" / 1500"); const truth=normal(); const outcomes=new Map(pool.map(q=>[q.id,random()<probability(truth,q)]));
 for(const strategy of strategies){const answers=[];let theta=0;
  for(let step=0;step<24;step++){
   let q;
   if(strategy==='fisher_map'){const used=new Set(answers.map(a=>a.questionId));q=pool.filter(q=>!used.has(q.id)).sort((a,b)=>information(theta,b)-information(theta,a)||a.id.localeCompare(b.id))[0];}
   else q=selectStaircase(pool,answers,`learner-${person}`);
   if(q){answers.push({questionId:q.id,question:q,isCorrect:outcomes.get(q.id)});theta=strategy==='staircase_mle'?mle(answers):estimateAbility(answers).theta;}
   const m=metrics[strategy][step];m.n++;m.squaredError+=(theta-truth)**2;m.boundary+=Math.abs(theta)>=3.999999?1:0;
   rows.push([person,strategy,step+1,truth,theta,Math.abs(theta)>=3.999999?1:0].join(','));
  }
 }
}
for(const list of Object.values(metrics))for(const m of list){m.rmse=Math.sqrt(m.squaredError/m.n);m.boundaryPercent=100*m.boundary/m.n;}
const bkt=[['D D D D D D D D'.split(' '),.1],['D S D S D D S D'.split(' '),.1],['S D D D D D D D'.split(' '),.45]].map(([sequence,start])=>{const values=[start];for(const symbol of sequence)values.push(updateKnowledge(values.at(-1),symbol==='D'));return {sequence,start,values};});
const out={date:'2026-10-16',source:'apps/api/src/modules/student/math-adaptive.ts',seed:20261016,learners:1500,maxQuestions:24,bank:{skills:8,items:pool.length,a:1.2,b:[-1.5,-.5,.5,1.5],c:.25},truthDistribution:'N(0,1), Box-Muller, no truncation',design:'Shared Bernoulli outcomes per learner/item across strategies; eight synthetic skills; if staircase exhausts eligible skills, retain its last estimate through the remaining checkpoints.',baseline:'MLE implemented for this benchmark only, same 3PL gradient/Fisher update, no prior, theta bound ±4; not a production algorithm.',metrics,bkt};
fs.writeFileSync(`${root}/simulation.json`,JSON.stringify(out,null,2));fs.writeFileSync(`${root}/simulation-raw.csv`,rows.join('\n'));
console.log(JSON.stringify(Object.fromEntries(strategies.map(s=>[s,metrics[s].filter(m=>[4,10,20].includes(m.questions)).map(m=>({q:m.questions,rmse:m.rmse,boundary:m.boundaryPercent}))])),null,2));


