export type Phase='idle'|'speaking'|'listening'|'analyzing';
export interface Config{role:string;level:string;type:string;count:number}
export interface Evaluation{quality:number;relevance:number;communication:number;confidence:number;score:number}
export interface Answer{q:string;a:string;ev:Evaluation}
export interface Line{who:'AI'|'YOU';text:string}
