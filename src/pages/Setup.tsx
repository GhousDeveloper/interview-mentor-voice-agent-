import {motion} from 'framer-motion';import {ArrowRight} from 'lucide-react';
import {ROLES,LEVELS,TYPES,COUNTS} from '../data/questions';import type {Config} from '../types';
function Group<T extends string|number>({title,items,value,set,fmtFn}:{title:string;items:T[];value:T;set:(v:T)=>void;fmtFn?:(v:T)=>string}){
 return <div className="mb-8"><div className="tag mb-3">{title}</div><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{items.map(i=>
  <button key={String(i)} onClick={()=>set(i)} className={`glass p-4 text-left text-sm font-medium transition ${i===value?'!border-cyan-300 bg-cyan-400/10 shadow-[0_0_24px_rgba(0,217,255,.25)]':'hover:border-cyan-400/50'}`}>{fmtFn?fmtFn(i):String(i)}</button>)}</div></div>;}
export default function Setup({cfg,setCfg,onStart,onBack}:{cfg:Config;setCfg:(c:Config)=>void;onStart:()=>void;onBack:()=>void}){
 const rows:[string,string|number][]=[['Role',cfg.role],['Level',cfg.level],['Type',cfg.type],['Questions',cfg.count]];
 return <div className="max-w-5xl mx-auto px-5 py-8"><button onClick={onBack} className="text-slate-400 text-sm mb-6">← Back</button>
  <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="grid lg:grid-cols-[1fr_280px] gap-8">
   <div><h1 className="text-3xl md:text-4xl font-bold">Configure Your Interview</h1><p className="text-slate-400 mt-2 mb-8">Tell your AI interviewer what you want to practice.</p>
    <Group title="JOB ROLE" items={ROLES} value={cfg.role} set={role=>setCfg({...cfg,role})}/>
    <Group title="EXPERIENCE" items={LEVELS} value={cfg.level} set={level=>setCfg({...cfg,level})}/>
    <Group title="INTERVIEW TYPE" items={TYPES} value={cfg.type} set={type=>setCfg({...cfg,type})}/>
    <Group title="INTERVIEW LENGTH" items={COUNTS} value={cfg.count} set={count=>setCfg({...cfg,count})} fmtFn={n=>`${n} Questions`}/></div>
   <aside className="lg:sticky lg:top-6 h-fit glass p-6"><div className="tag mb-4">INTERVIEW READY</div>
    {rows.map(([k,v])=><div key={k} className="mb-3"><div className="text-xs text-slate-500">{k}</div><div className="font-semibold">{v}</div></div>)}
    <button className="btn btn-p w-full mt-4 inline-flex justify-center items-center gap-2" onClick={onStart}>START AI INTERVIEW <ArrowRight size={16}/></button></aside>
  </motion.div></div>;}
