import {motion} from 'framer-motion';
import type {Phase} from '../types';
export const phaseLabel:Record<Phase,string>={idle:'READY',speaking:'AI IS SPEAKING',listening:'LISTENING',analyzing:'ANALYZING RESPONSE'};
export function Waveform({active,n=30}:{active:boolean;n?:number}){
 return <div className="flex items-center justify-center gap-[3px] h-10">{Array.from({length:n}).map((_,i)=>
  <motion.span key={i} className="w-[3px] rounded-full bg-cyan-400" animate={active?{height:[6,10+((i*7)%28),6]}:{height:4}} transition={{duration:.7+(i%5)*.12,repeat:Infinity,delay:i*.03}}/>)}</div>;}
export function AIVisual({phase,className=''}:{phase:Phase;className?:string}){
 const on=phase!=='idle';
 return <div className={`relative ${className}`}>
  <motion.div className="absolute -inset-3 rounded-[28px] blur-2xl bg-cyan-400/20" animate={{opacity:on?[.4,.9,.4]:.35}} transition={{duration:2.2,repeat:Infinity}}/>
  <div className="relative overflow-hidden rounded-3xl border border-cyan-400/40 aspect-[4/5] sm:aspect-square">
   <img src="/ai.jpg" alt="AI interviewer" className="w-full h-full object-cover" style={{objectPosition:'50% 42%',transform:'scale(1.9)'}}/>
   <motion.div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent" animate={{top:['-15%','105%']}} transition={{duration:3.2,repeat:Infinity,ease:'linear'}}/>
   <motion.div className="absolute inset-[12%] rounded-full border border-dashed border-cyan-300/40" animate={{rotate:360}} transition={{duration:18,repeat:Infinity,ease:'linear'}}/>
   <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent"/>
   <div className="absolute bottom-3 left-0 right-0 px-4"><Waveform active={phase==='speaking'||phase==='listening'} n={26}/></div>
  </div></div>;}
export function ScoreRing({value,size=220,label}:{value:number;size?:number;label?:string}){
 const r=size/2-12,c=2*Math.PI*r;
 return <div className="relative" style={{width:size,height:size}}>
  <svg width={size} height={size} className="-rotate-90"><circle cx={size/2} cy={size/2} r={r} stroke="rgba(56,189,248,.15)" strokeWidth="10" fill="none"/>
  <motion.circle cx={size/2} cy={size/2} r={r} stroke="#22d3ee" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:c*(1-value/100)}} transition={{duration:1.6,ease:'easeOut'}} style={{filter:'drop-shadow(0 0 8px #00d9ff)'}}/></svg>
  <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-5xl font-bold">{value}<span className="text-xl text-slate-400"> / 100</span></div>{label&&<div className="tag mt-1">{label}</div>}</div></div></div>;}
export function Bar({value}:{value:number}){return <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-cyan-400 to-sky-400" initial={{width:0}} animate={{width:`${value}%`}} transition={{duration:1}}/></div>;}
export const grade=(s:number)=>s>=85?'Excellent':s>=75?'Good':s>=65?'Fair':'Needs Improvement';
export function fmt(s:number){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
