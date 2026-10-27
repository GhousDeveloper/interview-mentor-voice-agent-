import {motion} from 'framer-motion';import {ArrowRight,Mic,MessageSquare,Award} from 'lucide-react';
import {AIVisual} from '../components/ui';
const hud=[['AI INTERVIEWER','Ready','top-4 -left-2 sm:-left-10'],['VOICE ANALYSIS','98%','top-1/3 -right-2 sm:-right-10'],['RESPONSE QUALITY','Excellent','bottom-24 -left-2 sm:-left-12'],['CONFIDENCE','87%','bottom-4 -right-2 sm:-right-8']];
const steps=[[Mic,'01','Choose Your Role'],[MessageSquare,'02','Talk With AI'],[Award,'03','Get Your Score']] as const;
export default function Welcome({onStart}:{onStart:()=>void}){
 const how=()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'});
 return <div className="max-w-6xl mx-auto px-5">
  <nav className="flex items-center justify-between py-5"><b className="tracking-[.25em] text-cyan-300 text-sm">INTERVIEW MENTOR</b>
   <div className="hidden md:flex gap-8 text-sm text-slate-400"><button onClick={how}>How It Works</button><button onClick={how}>Features</button><button onClick={onStart}>Practice</button><button className="text-cyan-300" onClick={onStart}>Sign In</button></div></nav>
  <section className="grid md:grid-cols-2 gap-12 items-center py-10 md:py-16">
   <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
    <div className="tag mb-4">AI VOICE INTERVIEW AGENT</div>
    <h1 className="text-4xl md:text-6xl font-bold leading-tight">Your Next Interview. <span className="text-cyan-300">Powered by AI.</span></h1>
    <p className="text-slate-400 mt-5 text-lg">Practice realistic interviews with an AI interviewer that listens, responds and evaluates your performance in real time.</p>
    <div className="flex flex-wrap gap-3 mt-8"><button className="btn btn-p" onClick={onStart}>START INTERVIEW</button><button className="btn btn-g" onClick={how}>SEE HOW IT WORKS</button></div>
    <p className="text-slate-500 text-xs mt-4">Practice Interviews. Speak With Confidence.</p>
   </motion.div>
   <div className="relative max-w-md mx-auto w-full"><AIVisual phase="idle"/>
    {hud.map(([a,b,pos],i)=><motion.div key={a} className={`glass absolute ${pos} px-3 py-2`} animate={{y:[0,-6,0]}} transition={{duration:4,repeat:Infinity,delay:i*.6}}><div className="text-[9px] tracking-widest text-slate-400">{a}</div><div className="text-cyan-300 font-bold text-sm">{b}</div></motion.div>)}</div>
  </section>
  <section id="how" className="py-16"><div className="tag text-center mb-8">HOW IT WORKS</div>
   <div className="grid md:grid-cols-3 gap-5">{steps.map(([I,n,t])=>
    <div key={n} className="glass p-6"><I className="text-cyan-300 mb-4"/><div className="text-slate-500 text-sm">{n}</div><div className="text-xl font-semibold">{t}</div></div>)}</div>
   <div className="text-center mt-10"><button className="btn btn-p inline-flex items-center gap-2" onClick={onStart}>START YOUR INTERVIEW <ArrowRight size={16}/></button></div></section>
 </div>;}
