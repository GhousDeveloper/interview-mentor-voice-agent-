import {useState} from 'react';
import type {Answer,Config} from './types';
import Welcome from './pages/Welcome';import Setup from './pages/Setup';import Interview from './pages/Interview';import Results from './pages/Results';
type Screen='welcome'|'setup'|'interview'|'results';
export default function App(){
 const [screen,setScreen]=useState<Screen>('welcome');
 const [cfg,setCfg]=useState<Config>({role:'Frontend Developer',level:'Junior',type:'Technical',count:10});
 const [answers,setAnswers]=useState<Answer[]>([]);const [secs,setSecs]=useState(0);const [run,setRun]=useState(0);
 const start=()=>{setRun(r=>r+1);setScreen('interview');};
 return <>
  {screen==='welcome'&&<Welcome onStart={()=>setScreen('setup')}/>}
  {screen==='setup'&&<Setup cfg={cfg} setCfg={setCfg} onStart={start} onBack={()=>setScreen('welcome')}/>}
  {screen==='interview'&&<Interview key={run} cfg={cfg} onDone={(a,s)=>{setAnswers(a);setSecs(s);setScreen('results');}} onExit={()=>setScreen('setup')}/>}
  {screen==='results'&&<Results answers={answers} secs={secs} onRetry={start} onNew={()=>setScreen('setup')}/>}
 </>;}
