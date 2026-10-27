import {useState} from 'react';import {motion} from 'framer-motion';
import type {Answer} from '../types';import {Bar,ScoreRing,fmt,grade} from '../components/ui';
const avg=(n:number[])=>n.length?Math.round(n.reduce((a,b)=>a+b,0)/n.length):0;
export default function Results({answers,secs,onRetry,onNew}:{answers:Answer[];secs:number;onRetry:()=>void;onNew:()=>void}){
 const [show,setShow]=useState(false);
 const q=avg(answers.map(a=>a.ev.quality)),r=avg(answers.map(a=>a.ev.relevance)),c=avg(answers.map(a=>a.ev.communication)),f=avg(answers.map(a=>a.ev.confidence));
 const total=avg(answers.map(a=>a.ev.score));
 const m:[string,number,string,string][]=[['Technical Knowledge',r,'Strong technical fundamentals','Explain technical trade-offs'],['Communication',c,'Clear explanation of ideas','Structure answers more clearly'],['Problem Solving',Math.round((q+r)/2),'Good problem-solving approach','Walk through your reasoning step by step'],['Confidence',f,'Confident, direct delivery','Reduce hedging words like “maybe”'],['Answer Quality',q,'Detailed, well-developed answers','Give more specific examples']];
 const sorted=[...m].sort((a,b)=>b[1]-a[1]);
 return <div className="max-w-5xl mx-auto px-5 py-10">
  <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="text-center"><div className="tag">INTERVIEW COMPLETE</div><h1 className="text-3xl md:text-4xl font-bold mt-2">Here’s how you performed.</h1>
   <div className="flex justify-center mt-8"><ScoreRing value={total} label={`${grade(total).toUpperCase()} · ${fmt(secs)}`}/></div></motion.div>
  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-10">{m.map(([k,v])=><div key={k} className="glass p-4"><div className="text-xs text-slate-400">{k}</div><div className="text-2xl font-bold text-cyan-300">{v}%</div><Bar value={v}/></div>)}</div>
  <div className="grid md:grid-cols-2 gap-5 mt-6">
   <div className="glass p-6"><div className="tag mb-3">YOUR STRENGTHS</div>{sorted.slice(0,3).map(s=><p key={s[0]} className="mb-2 text-sm">✓ {s[2]}</p>)}</div>
   <div className="glass p-6"><div className="tag mb-3">AREAS TO IMPROVE</div>{sorted.slice(-3).reverse().map(s=><p key={s[0]} className="mb-2 text-sm">→ {s[3]}</p>)}</div></div>
  <div className="glass p-6 mt-6"><div className="tag mb-4">QUESTION PERFORMANCE</div>
   {answers.map((a,k)=><div key={k} className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="truncate pr-4">Question {String(k+1).padStart(2,'0')} — <span className="text-slate-400">{a.q}</span></span><span className="whitespace-nowrap">{a.ev.score} · {grade(a.ev.score)}</span></div><Bar value={a.ev.score}/>
    {show&&<p className="text-xs text-slate-400 mt-2 italic">Your answer: {a.a}</p>}</div>)}</div>
  <div className="glass p-6 mt-6 !border-cyan-300/60"><div className="tag mb-2">AI RECOMMENDATION</div><p className="text-lg text-slate-200">{total>=80?'You demonstrate strong fundamentals and clear communication. Keep sharpening how you explain trade-offs and architectural decisions to stand out further.':total>=65?'You have a solid base. Focus on structured answers with concrete examples and explicit reasoning to raise your performance.':'Practice answering with a clear structure: context, action, result. Add specific examples and explain your reasoning to improve significantly.'}</p></div>
  <div className="flex flex-wrap justify-center gap-3 mt-8"><button className="btn btn-p" onClick={onRetry}>RETRY INTERVIEW</button><button className="btn btn-g" onClick={onNew}>NEW INTERVIEW</button><button className="btn btn-g" onClick={()=>setShow(s=>!s)}>{show?'HIDE ANSWERS':'VIEW ANSWERS'}</button></div></div>;}
