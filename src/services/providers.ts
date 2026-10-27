import type {Config,Evaluation} from '../types';
import {technical,behavioral,hr} from '../data/questions';
export interface InterviewEvaluator{evaluate(q:string,a:string):Promise<Evaluation>}
export interface AIInterviewProvider extends InterviewEvaluator{getQuestions(c:Config):string[];followUp(q:string,a:string):string|null}
export interface VoiceProvider{supported:boolean;speak(t:string,onEnd:()=>void):void;cancel():void;listen(onText:(t:string)=>void,onEnd:()=>void,onErr:(e:string)=>void):void;stop():void}
const clamp=(n:number)=>Math.max(40,Math.min(98,Math.round(n)));
const hash=(s:string)=>[...s].reduce((h,c)=>(h*31+c.charCodeAt(0))%9973,7);
export class MockInterviewProvider implements AIInterviewProvider{
 getQuestions(c:Config){const t=technical[c.role]??[];
  const mixed:string[]=[];for(let i=0;i<6;i++){[t[i],behavioral[i],hr[i]].forEach(x=>{if(x)mixed.push(x);});}
  const order=c.type==='Technical'?[...t,...behavioral,...hr]:c.type==='Behavioral'?[...behavioral,...t,...hr]:c.type==='HR'?[...hr,...behavioral,...t]:mixed;
  return order.slice(0,c.count);}
 followUp(q:string,a:string){const w=a.split(/\s+/).length;if(w>=30)return null;
  return ['Interesting. What was the most difficult challenge you faced, and how did you handle it?','Can you give me a specific example to back that up?','What trade-offs did you consider, and why did you choose that approach?'][hash(q+a)%3];}
 async evaluate(q:string,a:string):Promise<Evaluation>{
  await new Promise(r=>setTimeout(r,1100));
  const w=a.trim().split(/\s+/).length,j=hash(q+a)%7;
  const sent=a.split(/[.!?]+/).filter(Boolean).length;
  const kw=(a.match(/\b(because|therefore|for example|result|trade-?off|performance|users?|team|test|learned|improved|designed|built|data|api|scale)\b/gi)||[]).length;
  const hedge=(a.match(/\b(maybe|i think|kind of|sort of|um|uh|i guess)\b/gi)||[]).length;
  const quality=clamp(45+Math.min(w,60)*.6+kw*2+j),relevance=clamp(52+kw*5+Math.min(w,50)*.4+j);
  const communication=clamp(50+sent*5+Math.min(w,40)*.5-hedge*3+j),confidence=clamp(58+Math.min(w,50)*.5-hedge*5+j);
  return{quality,relevance,communication,confidence,score:Math.round((quality+relevance+communication+confidence)/4)};}
}
export class BrowserVoiceProvider implements VoiceProvider{
 private rec:any=null;
 private get R(){const w=window as any;return w.SpeechRecognition||w.webkitSpeechRecognition;}
 supported=!!((window as any).SpeechRecognition||(window as any).webkitSpeechRecognition);
 speak(t:string,onEnd:()=>void){if(!('speechSynthesis' in window)){onEnd();return;}
  window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.rate=.97;u.onend=onEnd;u.onerror=onEnd;window.speechSynthesis.speak(u);}
 cancel(){if('speechSynthesis' in window)window.speechSynthesis.cancel();}
 listen(onText:(t:string)=>void,onEnd:()=>void,onErr:(e:string)=>void){
  if(!this.R){onErr('unsupported');return;}
  try{const r=new this.R();r.continuous=true;r.interimResults=true;r.lang='en-US';
   r.onresult=(e:any)=>{let t='';for(let k=0;k<e.results.length;k++)t+=e.results[k][0].transcript;onText(t);};
   r.onend=onEnd;r.onerror=(e:any)=>onErr(e.error||'error');r.start();this.rec=r;}catch{onErr('error');}}
 stop(){try{this.rec?.stop();}catch{/* already stopped */}}
}
