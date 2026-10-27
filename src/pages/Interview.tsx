import {useEffect,useMemo,useRef,useState} from 'react';import {AnimatePresence,motion} from 'framer-motion';
import {Mic,Square,Send,Keyboard,SkipForward,PhoneOff,Timer} from 'lucide-react';
import type {Answer,Config,Evaluation,Line,Phase} from '../types';
import {BrowserVoiceProvider,MockInterviewProvider} from '../services/providers';
import {AIVisual,Bar,fmt,phaseLabel} from '../components/ui';
const mean=(a:Evaluation,b:Evaluation):Evaluation=>({quality:Math.round((a.quality+b.quality)/2),relevance:Math.round((a.relevance+b.relevance)/2),communication:Math.round((a.communication+b.communication)/2),confidence:Math.round((a.confidence+b.confidence)/2),score:Math.round((a.score+b.score)/2)});
export default function Interview({cfg,onDone,onExit}:{cfg:Config;onDone:(a:Answer[],secs:number)=>void;onExit:()=>void}){
 const provider=useMemo(()=>new MockInterviewProvider(),[]);
 const voice=useMemo(()=>new BrowserVoiceProvider(),[]);
 const qs=useMemo(()=>provider.getQuestions(cfg),[provider,cfg]);
 const [i,setI]=useState(0),[prompt,setPrompt]=useState(qs[0]),[turn,setTurn]=useState(0),[fu,setFu]=useState(false);
 const [phase,setPhase]=useState<Phase>('speaking'),[log,setLog]=useState<Line[]>([{who:'AI',text:qs[0]}]);
 const [draft,setDraft]=useState(''),[typed,setTyped]=useState(!voice.supported),[err,setErr]=useState(''),[fb,setFb]=useState<Evaluation|null>(null),[secs,setSecs]=useState(0);
 const results=useRef<Answer[]>([]),base=useRef(''),secsRef=useRef(0);
 useEffect(()=>{const t=setInterval(()=>{secsRef.current+=1;setSecs(s=>s+1);},1000);return()=>clearInterval(t);},[]);
 useEffect(()=>{setPhase('speaking');voice.speak(prompt,()=>setPhase(p=>p==='speaking'?'idle':p));return()=>voice.cancel();},[turn,prompt,voice]);
 useEffect(()=>()=>{voice.stop();voice.cancel();},[voice]);
 const startMic=()=>{voice.cancel();setErr('');base.current=draft?draft+' ':'';setPhase('listening');
  voice.listen(t=>setDraft(base.current+t),()=>setPhase(p=>p==='listening'?'idle':p),e=>{setPhase('idle');setTyped(true);setErr(e==='not-allowed'?'Microphone permission was denied. You can type your answer instead.':"Voice input isn't supported in this browser. You can type your answer instead.");});};
 const stopMic=()=>{voice.stop();setPhase('idle');};
 const next=()=>{if(i+1>=qs.length){onDone(results.current.filter(Boolean),secsRef.current);return;}
  const n=i+1;setI(n);setFu(false);setPrompt(qs[n]);setTurn(t=>t+1);setLog(l=>[...l,{who:'AI',text:qs[n]}]);};
 const submit=async()=>{const a=draft.trim();if(!a||phase==='analyzing')return;voice.stop();setPhase('analyzing');setDraft('');
  setLog(l=>[...l,{who:'YOU',text:a}]);
  try{const ev=await provider.evaluate(prompt,a);setFb(ev);const prev=results.current[i];
   results.current[i]=prev?{q:prev.q,a:prev.a+' '+a,ev:mean(prev.ev,ev)}:{q:qs[i],a,ev};
   const f=fu?null:provider.followUp(prompt,a);
   if(f){setFu(true);setPrompt(f);setTurn(t=>t+1);setLog(l=>[...l,{who:'AI',text:f}]);}else next();}
  catch{setErr('Something went wrong while analyzing. Please try again.');setPhase('idle');}};
 const skip=()=>{voice.stop();if(!results.current[i]){results.current[i]={q:qs[i],a:'(skipped)',ev:{quality:40,relevance:40,communication:40,confidence:40,score:40}};}next();};
 const mic=phase==='listening';
 return <div className="max-w-6xl mx-auto px-4 py-5 min-h-screen flex flex-col">
  <div className="flex items-center justify-between mb-4"><b className="tracking-[.25em] text-cyan-300 text-sm">INTERVIEW MENTOR</b><div className="flex items-center gap-4 text-sm text-slate-400"><span className="flex items-center gap-1"><Timer size={14}/>{fmt(secs)}</span><button className="flex items-center gap-1 text-red-300" onClick={()=>{if(results.current.filter(Boolean).length)onDone(results.current.filter(Boolean),secsRef.current);else onExit();}}><PhoneOff size={14}/>End Interview</button></div></div>
  <div className="grid lg:grid-cols-[300px_1fr_240px] gap-5 flex-1">
   <div><div className="flex items-center justify-between mb-3"><span className="tag">INTERVIEW MENTOR AI</span><span className="text-xs text-emerald-400">● ONLINE</span></div>
    <AIVisual phase={phase}/><motion.div key={phase} initial={{opacity:0}} animate={{opacity:1}} className="glass mt-4 py-3 text-center tag">{phaseLabel[phase]}</motion.div></div>
   <div className="flex flex-col gap-4">
    <div className="glass p-6"><div className="flex justify-between text-xs tag mb-2"><span>QUESTION {String(i+1).padStart(2,'0')} / {String(qs.length).padStart(2,'0')}</span><span>{fu?'FOLLOW-UP':'AI GENERATED'}</span></div>
     <Bar value={((i+1)/qs.length)*100}/>
     <AnimatePresence mode="wait"><motion.p key={turn} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="text-xl md:text-2xl font-medium mt-5 leading-snug">“{prompt}”</motion.p></AnimatePresence></div>
    <div className="glass p-5 flex-1 min-h-[180px] max-h-[300px] overflow-y-auto"><div className="tag mb-3">LIVE TRANSCRIPT</div>
     {log.slice(-6).map((l,k)=><motion.div key={k+l.text} initial={{opacity:0}} animate={{opacity:1}} className="mb-3 text-sm"><span className={l.who==='AI'?'text-cyan-300 font-bold':'text-slate-300 font-bold'}>{l.who}:</span> <span className="text-slate-300">{l.text}</span></motion.div>)}
     {draft&&<div className="text-sm text-slate-400 italic"><b className="not-italic text-slate-300">YOU:</b> {draft}</div>}</div>
    {fb&&<div className="grid grid-cols-3 gap-3 text-center">{([['Answer Quality',fb.quality],['Technical Relevance',fb.relevance],['Communication',fb.communication]] as const).map(([k,v])=><div key={k} className="glass p-3"><div className="text-[10px] text-slate-400">{k}</div><div className="text-cyan-300 font-bold">{v}%</div></div>)}</div>}
   </div>
   <div className="glass p-5 h-fit text-sm space-y-4"><div className="tag">SESSION</div>
    {([['Role',cfg.role],['Level',cfg.level],['Type',cfg.type],['Answered',`${results.current.filter(Boolean).length}`],['Progress',`${Math.round((i/qs.length)*100)}%`]] as const).map(([k,v])=><div key={k}><div className="text-xs text-slate-500">{k}</div><div>{v}</div></div>)}</div>
  </div>
  <div className="mt-6 flex flex-col items-center gap-4 pb-4">
   {err&&<div className="text-amber-300 text-sm text-center">{err}</div>}
   {typed&&<textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Type your answer…" rows={3} className="w-full max-w-2xl glass p-3 text-sm bg-transparent outline-none"/>}
   <div className="relative">{mic&&<motion.span className="absolute inset-0 rounded-full bg-cyan-400/40" animate={{scale:[1,1.7],opacity:[.6,0]}} transition={{duration:1.4,repeat:Infinity}}/>}
    <button disabled={phase==='analyzing'||!voice.supported} onClick={mic?stopMic:startMic} aria-label={mic?'Stop':'Start speaking'} className={`relative w-24 h-24 rounded-full grid place-items-center border-2 border-cyan-300 transition ${mic?'bg-cyan-400 text-slate-900':'bg-[#061426] text-cyan-300'} disabled:opacity-40 shadow-[0_0_40px_rgba(0,217,255,.45)]`}>{mic?<Square size={30}/>:<Mic size={34}/>}</button></div>
   <div className="tag">{phase==='analyzing'?'ANALYZING...':mic?'LISTENING...':'START SPEAKING'}</div>
   <div className="flex flex-wrap justify-center gap-2">
    <button className="btn btn-g flex items-center gap-2" onClick={()=>setTyped(t=>!t)}><Keyboard size={14}/>Type Answer</button>
    <button className="btn btn-p flex items-center gap-2 disabled:opacity-40" disabled={!draft.trim()||phase==='analyzing'} onClick={submit}><Send size={14}/>Submit Answer</button>
    <button className="btn btn-g flex items-center gap-2" onClick={skip}><SkipForward size={14}/>Skip</button></div>
  </div></div>;}
