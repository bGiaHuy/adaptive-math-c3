import React from 'react';
import MathRenderer from './MathRenderer';
const plain=value=>/\$|\\(?:frac|sqrt|begin|\[|\()/.test(value)?<MathRenderer content={value} defaultInline/>:value;
const inline=line=>line.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((part,index)=>part.startsWith('**')&&part.endsWith('**')?<strong key={index}>{plain(part.slice(2,-2))}</strong>:part.startsWith('`')&&part.endsWith('`')?<code key={index}>{part.slice(1,-1)}</code>:part.startsWith('*')&&part.endsWith('*')?<em key={index}>{plain(part.slice(1,-1))}</em>:<React.Fragment key={index}>{plain(part)}</React.Fragment>);
export default function MathAiReply({text}){
 const blocks=[],lines=text.split('\n');
 for(let index=0;index<lines.length;index++){
  if(!lines[index].trim())continue;
  if(/^(?:\d+\.\s|[-*]\s)/.test(lines[index])){const ordered=/^\d+\./.test(lines[index]),pattern=ordered?/^\d+\.\s/:/^[-*]\s/,items=[];while(index<lines.length&&pattern.test(lines[index])){items.push(<li key={index}>{inline(lines[index].replace(pattern,''))}</li>);index++;}index--;blocks.push(ordered?<ol key={index}>{items}</ol>:<ul key={index}>{items}</ul>);}
  else blocks.push(<p key={index}>{inline(lines[index])}</p>);
 }
 return <div className="math-ai-reply">{blocks}</div>;
}
