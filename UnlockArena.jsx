import { useState, useEffect, useRef } from "react";

const NC="#7222D4",NL="#D96800",NCL="#AA60FF",NLL="#FF9520";
const fC=f=>f==="nlock"?NC:NL;
const fL=f=>f==="nlock"?NCL:NLL;

const NLOCK=[
  {id:"nlk-001",name:"VERROU MENTAL",cost:1,type:"DEF",sh:2,desc:"Bouclier +2"},
  {id:"nlk-002",name:"FRAPPE PRÉCISE",cost:2,type:"ATK",dmg:3,desc:"Dégâts +3"},
  {id:"nlk-003",name:"MÉDITATION",cost:1,type:"DEF",heal:2,desc:"Soin +2"},
  {id:"nlk-004",name:"ARCHITECTE",cost:2,type:"UTL",dr:1,desc:"Pioche +1"},
  {id:"nlk-005",name:"GLITCH DIMENSIONNEL",cost:3,type:"GLITCH",steal:true,desc:"Vole 1 carte adverse"},
  {id:"nlk-006",name:"OMBRE PARALLÈLE",cost:2,type:"GLITCH",sh:2,dr:1,desc:"Bouclier +2 · Pioche +1"},
  {id:"nlk-008",name:"VERROUILLAGE",cost:2,type:"DEF",sh:4,desc:"Bouclier +4"},
  {id:"nlk-009",name:"FORTERESSE",cost:3,type:"DEF",sh:5,desc:"Bouclier +5"},
  {id:"nlk-011",name:"GÉANT STRATÈGE",cost:5,type:"ATK",dmg:8,sh:2,desc:"Dégâts +8 · Bouclier +2"},
  {id:"nlk-012",name:"LOCK FINAL",cost:6,type:"ATK",dmg:12,desc:"Dégâts +12"},
  {id:"nlk-013",name:"SYNCHRONISATION",cost:3,type:"UTL",dr:2,desc:"Pioche +2"},
  {id:"nlk-015",name:"INFERNO",cost:3,type:"ATK",dmg:3,discard:1,desc:"Détruit 1 carte + 3 dégâts"},
];

const NLUCK=[
  {id:"nlu-001",name:"AUDACE",cost:1,type:"UTL",rn:[1,6],dr:1,desc:"Glitch 1-6 · Pioche +1"},
  {id:"nlu-002",name:"COUP DE CHANCE",cost:1,type:"GLITCH",rn:[1,6],desc:"Glitch 1-6"},
  {id:"nlu-003",name:"FLAMME VIVE",cost:2,type:"ATK",dmg:3,desc:"Dégâts +3"},
  {id:"nlu-004",name:"GLITCH FURTIF",cost:2,type:"GLITCH",dmg:2,discard:1,desc:"2 dégâts · Défausse 1"},
  {id:"nlu-005",name:"CHANCE BRUTE",cost:3,type:"GLITCH",rn:[1,6],desc:"Glitch 1-6"},
  {id:"nlu-006",name:"ROULETTE COSMIQUE",cost:4,type:"GLITCH",rn:[1,8],desc:"Glitch 1-8"},
  {id:"nlu-007",name:"PHOENIX",cost:3,type:"DEF",heal:2,sh:2,desc:"Soin +2 · Bouclier +2"},
  {id:"nlu-008",name:"INFERNO SAUVAGE",cost:3,type:"ATK",dmg:5,desc:"Dégâts +5"},
  {id:"nlu-009",name:"DOUBLE FRAPPE",cost:3,type:"ATK",dmg:6,desc:"Dégâts +6"},
  {id:"nlu-010",name:"BOUCLIER FEU",cost:2,type:"DEF",sh:3,desc:"Bouclier +3"},
  {id:"nlu-011",name:"TEMPÊTE",cost:4,type:"ATK",dmg:6,sdb:2,desc:"Dégâts +6 · -2 bouclier adverse"},
  {id:"nlu-014",name:"COSMIC BURN",cost:3,type:"ATK",dmg:9,pierce:true,desc:"Dégâts +9 · Ignore boucliers"},
];

const TC={ATK:"#EF4444",DEF:"#3B82F6",UTL:"#22C55E",GLITCH:"#A855F7"};
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const roll=c=>c.rn?c.rn[0]+Math.floor(Math.random()*(c.rn[1]-c.rn[0]+1)):(c.dmg||0);
const applyHit=(hp,sh,dmg,pierce)=>{if(pierce)return{hp:Math.max(0,hp-dmg),sh};const b=Math.min(sh,dmg);return{hp:Math.max(0,hp-(dmg-b)),sh:sh-b};};

function newGame(f){
  const pd=shuffle(f==="nlock"?NLOCK:NLUCK);
  const id=shuffle(f==="nlock"?NLUCK:NLOCK);
  return{p:{hp:20,sh:0,en:1,men:1,hand:pd.slice(0,3),deck:pd.slice(3),f},
    i:{hp:20,sh:0,en:1,men:1,hand:id.slice(0,3),deck:id.slice(3),f:f==="nlock"?"nluck":"nlock"},
    turn:"p",tN:1,log:["⚔️ BATAILLE ENGAGÉE — À toi de jouer !"],over:null};
}

function CardArt({id,f}){
  const c=fC(f),l=fL(f),g="a"+id.replace(/[-]/g,"");
  const arts={
    "nlk-001":<svg viewBox="0 0 100 70"><defs><radialGradient id={g}><stop offset="0%" stopColor={l} stopOpacity=".4"/><stop offset="100%" stopColor="#000" stopOpacity=".9"/></radialGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/><rect x="35" y="22" width="30" height="24" rx="4" fill={c} opacity=".8"/><path d="M42,22 Q42,12 50,12 Q58,12 58,22" fill="none" stroke={l} strokeWidth="2.5"/><circle cx="50" cy="33" r="4" fill="#000"/><rect x="48" y="35" width="4" height="6" rx="1.5" fill="#000"/></svg>,
    "nlk-002":<svg viewBox="0 0 100 70"><defs><radialGradient id={g} cx="30%"><stop offset="0%" stopColor={l} stopOpacity=".35"/><stop offset="100%" stopColor="#000" stopOpacity=".9"/></radialGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/><line x1="10" y1="58" x2="90" y2="12" stroke={l} strokeWidth="5" strokeLinecap="round"/><line x1="8" y1="58" x2="88" y2="12" stroke="white" strokeWidth="1.5" opacity=".7"/><circle cx="50" cy="35" r="9" fill="none" stroke={l} strokeWidth="1.2" opacity=".5"/></svg>,
    "nlk-003":<svg viewBox="0 0 100 70"><defs><radialGradient id={g}><stop offset="0%" stopColor={l} stopOpacity=".35"/><stop offset="100%" stopColor="#000" stopOpacity=".9"/></radialGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/><circle cx="50" cy="22" r="9" fill={c} opacity=".8"/><line x1="50" y1="31" x2="50" y2="50" stroke={l} strokeWidth="2.5" strokeLinecap="round"/><line x1="50" y1="40" x2="40" y2="48" stroke={l} strokeWidth="2" strokeLinecap="round"/><line x1="50" y1="40" x2="60" y2="48" stroke={l} strokeWidth="2" strokeLinecap="round"/>{[1,2].map(i=><ellipse key={i} cx="50" cy="35" rx={8+i*7} ry={4+i*4} fill="none" stroke={l} strokeWidth=".8" opacity={.5-i*.1}/>)}</svg>,
    "nlk-004":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#02001A" opacity=".7"/>{[0,1,2,3,4].map(i=><line key={i} x1={15+i*18} y1="8" x2={15+i*18} y2="62" stroke={c} strokeWidth=".5" opacity=".25"/>)}<circle cx="32" cy="28" r="7" fill={c} opacity=".8"/><circle cx="68" cy="28" r="7" fill={c} opacity=".8"/><circle cx="50" cy="50" r="7" fill={l} opacity=".9"/><line x1="32" y1="28" x2="68" y2="28" stroke={l} strokeWidth="1.5"/><line x1="32" y1="28" x2="50" y2="50" stroke={l} strokeWidth="1.5"/><line x1="68" y1="28" x2="50" y2="50" stroke={l} strokeWidth="1.5"/></svg>,
    "nlk-005":<svg viewBox="0 0 100 70"><defs><radialGradient id={g}><stop offset="0%" stopColor={l} stopOpacity=".4"/><stop offset="100%" stopColor="#000" stopOpacity=".95"/></radialGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/><ellipse cx="50" cy="35" rx="24" ry="24" fill="none" stroke={l} strokeWidth="1.8" strokeDasharray="5 3"/>{[0,45,90,135,180,225,270,315].map(d=>{const r=d*Math.PI/180;return<line key={d} x1="50" y1="35" x2={50+Math.cos(r)*32} y2={35+Math.sin(r)*32} stroke={c} strokeWidth="1" opacity=".5"/>})}<circle cx="50" cy="35" r="7" fill={l} opacity=".9"/><circle cx="50" cy="35" r="3" fill="white"/></svg>,
    "nlk-006":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#000" opacity=".6"/>{[8,18,28,38,48,58,68,78,88].map((x,i)=><rect key={i} x={x} y={6+i*4} width={14-i} height="1.5" fill={l} opacity=".4"/>)}<circle cx="50" cy="35" r="14" fill={c} opacity=".6"/><ellipse cx="45" cy="33" rx="2.5" ry="3.5" fill={l} opacity=".9"/><ellipse cx="55" cy="33" rx="2.5" ry="3.5" fill={l} opacity=".9"/><path d="M43,44 Q50,50 57,44" fill="none" stroke={l} strokeWidth="1.5"/></svg>,
    "nlk-008":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#000" opacity=".5"/>{[14,28,42,56,70,84].map((x,i)=><ellipse key={x} cx={x} cy={35} rx="6" ry="3" fill="none" stroke={i%2===0?l:c} strokeWidth="1.2"/>)}<line x1="5" y1="35" x2="95" y2="35" stroke={c} strokeWidth=".8" opacity=".4"/><rect x="36" y="28" width="28" height="22" rx="5" fill={l} opacity=".9"/><rect x="38" y="30" width="24" height="18" rx="4" fill={c} opacity=".9"/><path d="M43,28 Q43,17 50,17 Q57,17 57,28" fill="none" stroke={l} strokeWidth="2.5"/><circle cx="50" cy="40" r="4" fill="#000"/></svg>,
    "nlk-009":<svg viewBox="0 0 100 70"><defs><linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity=".5"/><stop offset="100%" stopColor="#000" stopOpacity=".9"/></linearGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/><rect x="8" y="25" width="84" height="38" fill={c} opacity=".7"/><rect x="8" y="20" width="84" height="8" fill={l} opacity=".4"/>{[8,22,36,50,64,78].map(x=><rect key={x} x={x} y="13" width="10" height="10" fill={c} opacity=".8"/>)}<rect x="2" y="12" width="18" height="50" rx="3" fill={c} opacity=".9"/><rect x="80" y="12" width="18" height="50" rx="3" fill={c} opacity=".9"/><path d="M42,63 L42,44 Q50,37 58,44 L58,63 Z" fill="#000" opacity=".9"/><line x1="2" y1="12" x2="98" y2="12" stroke={l} strokeWidth="2" opacity=".7"/></svg>,
    "nlk-011":<svg viewBox="0 0 100 70"><defs><radialGradient id={g} cy="65%"><stop offset="0%" stopColor={l} stopOpacity=".5"/><stop offset="100%" stopColor="#000" stopOpacity=".9"/></radialGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/><rect x="28" y="20" width="44" height="30" rx="9" fill={c} opacity=".85"/><rect x="32" y="11" width="36" height="13" rx="6" fill={c} opacity=".75"/>{[34,43,52,61].map(x=><rect key={x} x={x} y="5" width="8" height="11" rx="4" fill={c} opacity=".8"/>)}{[15,22,30].map(r=><ellipse key={r} cx="50" cy="62" rx={r} ry={r*.3} fill="none" stroke={l} strokeWidth="1"/>)}</svg>,
    "nlk-012":<svg viewBox="0 0 100 70"><defs><radialGradient id={g}><stop offset="0%" stopColor="white" stopOpacity=".9"/><stop offset="25%" stopColor={l} stopOpacity=".8"/><stop offset="100%" stopColor="#000" stopOpacity=".95"/></radialGradient></defs><rect width="100" height="70" fill="#000" opacity=".85"/>{[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340].map(d=>{const r=d*Math.PI/180;return<line key={d} x1={50+Math.cos(r)*48} y1={35+Math.sin(r)*35} x2="50" y2="35" stroke={d<180?l:c} strokeWidth="1" opacity=".5"/>})}<circle cx="50" cy="35" r="15" fill={`url(#${g})`}/><circle cx="50" cy="35" r="5" fill="white" opacity=".95"/></svg>,
    "nlk-013":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#000" opacity=".5"/><rect x="16" y="14" width="26" height="38" rx="4" fill="none" stroke={l} strokeWidth="2" opacity=".9"/><rect x="58" y="14" width="26" height="38" rx="4" fill="none" stroke={l} strokeWidth="2" opacity=".9"/>{[0,1,2,3].map(i=><line key={i} x1="42" y1={24+i*7} x2="58" y2={24+i*7} stroke={c} strokeWidth="1.5" strokeDasharray="3 2" opacity=".7"/>)}<circle cx="50" cy="35" r="5" fill={l}/></svg>,
    "nlk-015":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#000" opacity=".5"/><line x1="24" y1="60" x2="58" y2="8" stroke="#FF4400" strokeWidth="6" strokeLinecap="round"/><line x1="22" y1="60" x2="56" y2="8" stroke="#FF8800" strokeWidth="2" opacity=".8"/><line x1="76" y1="60" x2="42" y2="8" stroke="#FF4400" strokeWidth="6" strokeLinecap="round"/><line x1="78" y1="60" x2="44" y2="8" stroke="#FF8800" strokeWidth="2" opacity=".8"/><circle cx="50" cy="62" r="6" fill={l} opacity=".5"/></svg>,
    "nlu-001":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#0c0100" opacity=".8"/><polygon points="50,7 58,30 52,30 60,62 40,28 50,28 42,7" fill={l} opacity=".95"/><polygon points="30,15 37,32 33,32 40,52 25,28 32,28 27,15" fill={c} opacity=".6"/><polygon points="70,15 77,32 73,32 80,52 65,28 72,28 67,15" fill={c} opacity=".6"/></svg>,
    "nlu-002":<svg viewBox="0 0 100 70"><defs><radialGradient id={g}><stop offset="0%" stopColor={l} stopOpacity=".4"/><stop offset="100%" stopColor="#000" stopOpacity=".95"/></radialGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/><rect x="28" y="16" width="44" height="38" rx="8" fill="white" opacity=".1" stroke={l} strokeWidth="1.5"/>{[[36,25],[44,25],[52,25],[60,25],[36,35],[44,35],[52,35],[60,35],[36,45],[44,45],[52,45],[60,45]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill={i===5||i===8||i===11?l:"white"} opacity={i===5||i===8||i===11?.9:.2}/>)}</svg>,
    "nlu-003":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#100200" opacity=".8"/>{[0,30,60,90,120,150,180,210,240,270,300,330].map(d=>{const r=d*Math.PI/180;return<line key={d} x1="50" y1="35" x2={50+Math.cos(r)*28} y2={35+Math.sin(r)*28} stroke={d<180?l:c} strokeWidth="2" opacity=".6"/>})}<circle cx="50" cy="35" r="10" fill={c} opacity=".8"/><circle cx="50" cy="35" r="5" fill={l} opacity=".9"/><circle cx="50" cy="35" r="2.5" fill="white"/></svg>,
    "nlu-004":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#060010" opacity=".8"/>{[7,16,25,34,43,52,62].map((y,i)=><line key={y} x1={100-(35+i*5)} y1={y} x2="95" y2={y} stroke={i===3?l:c} strokeWidth={i===3?2.5:1.2} opacity={.3+i*.07} strokeLinecap="round"/>)}<polygon points="84,25 96,35 84,45" fill={l} opacity=".9"/></svg>,
    "nlu-005":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#0a0000" opacity=".8"/>{[7,14,22,30,40].map((r,i)=><circle key={r} cx="50" cy="35" r={r} fill={i===0?"white":i===1?l:i===2?c:"none"} stroke={i>2?c:"none"} strokeWidth={i===3?2:1} opacity={[1,.9,.7,.4,.2][i]}/>)}{[0,45,90,135,180,225,270,315].map(d=>{const rad=d*Math.PI/180;const dd=32+Math.sin(d/30)*7;return<line key={d} x1={50+Math.cos(rad)*15} y1={35+Math.sin(rad)*15} x2={50+Math.cos(rad)*dd} y2={35+Math.sin(rad)*dd} stroke={d%90===0?l:c} strokeWidth={d%90===0?2:1} strokeLinecap="round" opacity=".75"/>})}</svg>,
    "nlu-006":<svg viewBox="0 0 100 70"><defs><radialGradient id={g}><stop offset="0%" stopColor={l} stopOpacity=".5"/><stop offset="60%" stopColor={c} stopOpacity=".3"/><stop offset="100%" stopColor="#000" stopOpacity=".95"/></radialGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/>{[0,40,80,120,160,200,240,280,320].map((s,i)=>{const r=7+i*3;const rad=s*Math.PI/180;const rad2=(s+150)*Math.PI/180;return<path key={i} d={`M ${50+Math.cos(rad)*r} ${35+Math.sin(rad)*r*.7} Q 50 35 ${50+Math.cos(rad2)*r*.4} ${35+Math.sin(rad2)*r*.4}`} fill="none" stroke={i%2===0?l:c} strokeWidth="1.5" opacity={.9-.08*i}/>})}<circle cx="50" cy="35" r="5" fill={l} opacity=".9"/></svg>,
    "nlu-007":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#030008" opacity=".8"/>{[3,2,1].map(i=><ellipse key={i} cx="50" cy={58-i*7} rx={7+i*5} ry={2+i*2} fill={l} opacity=".3"/>)}<path d="M50,12 L42,20 L42,42 Q42,52 50,55 Q58,52 58,42 L58,20 Z" fill={c} opacity=".3" stroke={l} strokeWidth="1.5"/>{[37,43,50,57,63].map((x,i)=>{const h=8+Math.sin(i*1.5)*4;return<path key={x} d={`M${x},${20+i*2.5} Q${x-2.5},${17+i*2.5-h} ${x},${13+i*2.5-h} Q${x+2.5},${17+i*2.5-h} ${x},${20+i*2.5}`} fill={l} opacity={.7-.1*i}/>})}</svg>,
    "nlu-008":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#0c0000" opacity=".8"/>{[0,25,50,75,100,125,150,175,200,225,250,275,300,325].map(d=>{const rad=d*Math.PI/180;const r1=10,r2=22+Math.sin(d/20)*13;return<line key={d} x1={50+Math.cos(rad)*r1} y1={33+Math.sin(rad)*r1*.8} x2={50+Math.cos(rad)*r2} y2={33+Math.sin(rad)*r2*.8} stroke={d%50===0?l:c} strokeWidth={d%50===0?2.5:1} opacity={d%50===0?.9:.5} strokeLinecap="round"/>})}<ellipse cx="44" cy="32" rx="3.5" ry="2.5" fill={l} opacity=".9"/><ellipse cx="56" cy="32" rx="3.5" ry="2.5" fill={l} opacity=".9"/><path d="M42,42 Q50,50 58,42" fill={c} opacity=".6" stroke={l} strokeWidth="1.5"/></svg>,
    "nlu-009":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#000" opacity=".5"/><circle cx="28" cy="33" r="14" fill={c} opacity=".15"/><circle cx="28" cy="33" r="10" fill="none" stroke={l} strokeWidth="1.5"/><line x1="17" y1="22" x2="39" y2="44" stroke={l} strokeWidth="3" strokeLinecap="round"/><line x1="39" y1="22" x2="17" y2="44" stroke={l} strokeWidth="3" strokeLinecap="round"/><line x1="50" y1="8" x2="50" y2="62" stroke={c} strokeWidth=".8" opacity=".4"/><circle cx="72" cy="35" r="14" fill={c} opacity=".12"/><circle cx="72" cy="35" r="10" fill="none" stroke={l} strokeWidth="1.5"/><line x1="61" y1="24" x2="83" y2="46" stroke={l} strokeWidth="3" strokeLinecap="round"/><line x1="83" y1="24" x2="61" y2="46" stroke={l} strokeWidth="3" strokeLinecap="round"/></svg>,
    "nlu-010":<svg viewBox="0 0 100 70"><rect width="100" height="70" fill="#050000" opacity=".9"/><ellipse cx="50" cy="35" rx="40" ry="20" fill="none" stroke={l} strokeWidth="2"/><ellipse cx="50" cy="35" rx="39" ry="19" fill={c} opacity=".1"/><circle cx="50" cy="35" r="13" fill={c} opacity=".5"/><ellipse cx="50" cy="35" rx="3.5" ry="11" fill="#000" opacity=".95"/><ellipse cx="45" cy="31" rx="2.5" ry="1.8" fill="white" opacity=".7" transform="rotate(-15 45 31)"/></svg>,
    "nlu-011":<svg viewBox="0 0 100 70"><defs><radialGradient id={g} cy="45%"><stop offset="0%" stopColor={c} stopOpacity=".4"/><stop offset="100%" stopColor="#000" stopOpacity=".9"/></radialGradient></defs><rect width="100" height="70" fill={`url(#${g})`}/>{[1,2,3,4].map(i=><ellipse key={i} cx="50" cy="38" rx={9*i} ry={4.5*i} fill="none" stroke={i%2===0?l:c} strokeWidth="1.2" opacity={.8-.15*i} strokeDasharray={`${i*8} ${i*4}`}/>)}<polygon points="55,7 45,26 53,26 42,48 62,24 51,24 60,7" fill={l} opacity=".95"/><polygon points="72,15 67,30 71,30 62,46 76,27 69,27 73,15" fill={c} opacity=".6"/><polygon points="33,17 28,32 32,32 22,48 38,28 31,28 35,17" fill={c} opacity=".6"/></svg>,
    "nlu-014":<svg viewBox="0 0 100 70"><defs><radialGradient id={g}><stop offset="0%" stopColor="white" stopOpacity="1"/><stop offset="20%" stopColor={l} stopOpacity=".9"/><stop offset="50%" stopColor={c} stopOpacity=".7"/><stop offset="100%" stopColor="#000" stopOpacity=".95"/></radialGradient></defs><rect width="100" height="70" fill="#000" opacity=".9"/>{[0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345].map(d=>{const rad=d*Math.PI/180;const r=7+Math.abs(Math.sin(d*Math.PI/60))*28;return<line key={d} x1={50+Math.cos(rad)*5} y1={35+Math.sin(rad)*5} x2={50+Math.cos(rad)*r} y2={35+Math.sin(rad)*r} stroke={d%45===0?l:d%15===0?c:"white"} strokeWidth={d%45===0?3:d%15===0?1.5:.5} opacity={d%45===0?.95:d%15===0?.7:.4}/>})}<circle cx="50" cy="35" r="9" fill={`url(#${g})`}/><circle cx="50" cy="35" r="4" fill="white" opacity=".95"/></svg>,
  };
  return arts[id]||<svg viewBox="0 0 100 70"><rect width="100" height="70" fill={fC(f)} opacity=".2"/><text x="50" y="38" textAnchor="middle" fill="white" fontSize="9" opacity=".5">{id}</text></svg>;
}

function HPBar({hp,sh,col}){
  const pct=Math.max(0,hp/20*100);
  const bc=hp>12?"#22C55E":hp>6?"#EAB308":"#EF4444";
  return <div style={{width:"100%"}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3,fontWeight:600}}>
      <span>❤️ <b style={{fontSize:16,color:"white"}}>{hp}</b><span style={{opacity:.4}}>/20</span></span>
      {sh>0&&<span style={{color:"#60A5FA",fontWeight:700}}>🛡 {sh}</span>}
    </div>
    <div style={{height:5,background:"rgba(255,255,255,.1)",borderRadius:3,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:bc,borderRadius:3,transition:"width .4s"}}/>
    </div>
  </div>;
}

function EnDots({en,men,col}){
  return <div style={{display:"flex",gap:3,marginTop:4,flexWrap:"wrap"}}>
    {[...Array(Math.min(men,10))].map((_,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:i<en?col:"rgba(255,255,255,.1)",boxShadow:i<en?`0 0 7px ${col}`:"none",transition:"all .2s"}}/>)}
  </div>;
}

function CardEl({card,can,onP,f,sm=false}){
  const c=fC(f),tc=TC[card.type]||"#888";
  const w=sm?85:112,h=sm?122:162;
  return <div onClick={can?onP:undefined} style={{width:w,minWidth:w,height:h,borderRadius:9,background:"linear-gradient(160deg,#110820,#040108)",border:`2px solid ${can?c:"rgba(255,255,255,.06)"}`,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",flexShrink:0,cursor:can?"pointer":"not-allowed",opacity:can?1:.3,transform:"none",transition:"transform .18s",}
  } onMouseEnter={e=>{if(can)e.currentTarget.style.transform="translateY(-12px) scale(1.06)";}} onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
    <div style={{position:"absolute",top:0,left:0,padding:"2px 7px",background:c,fontSize:sm?10:12,fontWeight:"bold",borderBottomRightRadius:7,fontFamily:"monospace"}}>{card.cost}</div>
    <div style={{position:"absolute",top:3,right:3,padding:"1px 3px",background:`${tc}20`,border:`1px solid ${tc}`,borderRadius:3,fontSize:6,fontWeight:"bold",color:tc}}>{card.type}</div>
    <div style={{height:sm?50:65,background:"#000",borderBottom:`1px solid ${c}18`,overflow:"hidden"}}><CardArt id={card.id} f={f}/></div>
    <div style={{fontSize:sm?7:9,fontWeight:"bold",textAlign:"center",padding:"2px 2px 0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:.3}}>{card.name}</div>
    <div style={{flex:1,display:"flex",alignItems:"center",padding:"2px 3px"}}>
      <p style={{fontSize:sm?5:6.5,opacity:.45,width:"100%",textAlign:"center",lineHeight:1.2,margin:0}}>{card.desc}</p>
    </div>
  </div>;
}

function SelectScreen({onSelect}){
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,background:"radial-gradient(ellipse at 50% 30%,#1c0545 0%,#04000E 65%)"}}>
    <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{letterSpacing:5,opacity:.3,fontSize:9,marginBottom:5}}>UNLOCK ARENA · V1 · BETA</div>
      <h1 style={{fontSize:44,lineHeight:1,letterSpacing:2,fontWeight:900}}>CHOISIS TA FACTION</h1>
      <p style={{opacity:.3,fontSize:11,marginTop:5}}>20 PV · 12 cartes · 1v1 vs IA</p>
    </div>
    <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
      {[{f:"nlock",c:NC,l:NCL,name:"N'LOCK",sub:"Discipline · Contrôle",deck:NLOCK},{f:"nluck",c:NL,l:NLL,name:"N'LUCK",sub:"Chaos · Instinct",deck:NLUCK}].map(({f,c,l,name,sub,deck})=>
        <div key={f} onClick={()=>onSelect(f)} style={{width:248,padding:14,background:"rgba(255,255,255,.02)",border:`2px solid ${c}`,borderRadius:14,textAlign:"center",boxShadow:`0 0 24px ${c}30`,cursor:"pointer",transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-6px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
          <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:10}}>{deck.slice(0,3).map(card=><CardEl key={card.id} card={card} can={false} f={f} sm/>)}</div>
          <h2 style={{fontSize:24,color:c,letterSpacing:3,fontWeight:900}}>{name}</h2>
          <p style={{fontSize:11,opacity:.5,margin:"4px 0 10px"}}>{sub}</p>
          <div style={{padding:"9px 0",background:`linear-gradient(90deg,${c},${l})`,borderRadius:7,fontWeight:"bold",letterSpacing:2,fontSize:13}}>JOUER</div>
        </div>
      )}
    </div>
  </div>;
}

function BattleScreen({gs,onPlay,onEnd}){
  const isP=gs.turn==="p";
  const pc=fC(gs.p.f),ic=fC(gs.i.f);
  const logRef=useRef(null);
  useEffect(()=>{if(logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[gs.log]);
  return <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#04000E",overflow:"hidden"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,.06)",background:"rgba(0,0,0,.6)"}}>
      <span style={{fontSize:13,letterSpacing:2,color:pc,fontWeight:900}}>UNLOCK ARENA</span>
      <div style={{background:"rgba(255,255,255,.08)",padding:"2px 10px",borderRadius:10,fontSize:11,fontWeight:600}}>TOUR {gs.tN}</div>
      <span style={{fontSize:10,color:isP?"#22C55E":"#F59E0B",fontWeight:700}}>{isP?"▶ À TOI":"⚡ IA..."}</span>
    </div>
    <div style={{margin:"6px 8px 0",padding:"8px 10px",background:"rgba(255,255,255,.02)",borderRadius:10,border:`1px solid ${ic}28`}}>
      <div style={{fontSize:9,opacity:.35,marginBottom:2,fontWeight:600,letterSpacing:1}}>IA · {gs.i.f.toUpperCase()} · {gs.i.hand.length} cartes</div>
      <HPBar hp={gs.i.hp} sh={gs.i.sh}/><EnDots en={gs.i.en} men={gs.i.men} col={ic}/>
    </div>
    <div ref={logRef} style={{flex:1,margin:"5px 8px",padding:"6px 8px",background:"rgba(0,0,0,.6)",borderRadius:9,overflowY:"auto",fontSize:11,lineHeight:1.9}}>
      {gs.log.map((l,i)=><div key={i} style={{opacity:Math.max(.25,1-(gs.log.length-1-i)*.13)}}>{l}</div>)}
    </div>
    <div style={{margin:"0 8px",padding:"8px 10px",background:"rgba(255,255,255,.02)",borderRadius:10,border:`2px solid ${isP?pc:"rgba(255,255,255,.05)"}`,transition:"border-color .3s"}}>
      <div style={{fontSize:9,opacity:.35,marginBottom:2,fontWeight:600,letterSpacing:1}}>TOI · {gs.p.f.toUpperCase()}</div>
      <HPBar hp={gs.p.hp} sh={gs.p.sh}/><EnDots en={gs.p.en} men={gs.p.men} col={pc}/>
    </div>
    <div style={{padding:"6px 8px 8px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontSize:9,opacity:.35,fontWeight:600,letterSpacing:1}}>MAIN · {gs.p.hand.length}</span>
        <button onClick={isP?onEnd:undefined} disabled={!isP} style={{padding:"6px 16px",background:isP?`linear-gradient(90deg,${pc},${fL(gs.p.f)})`:"#111",border:"none",borderRadius:14,color:"#FFF",fontWeight:"bold",cursor:isP?"pointer":"not-allowed",letterSpacing:1.5,fontSize:12,opacity:isP?1:.35}}>FIN DE TOUR →</button>
      </div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
        {gs.p.hand.map((card,i)=><CardEl key={card.id+i} card={card} can={isP&&card.cost<=gs.p.en} onP={()=>onPlay(i)} f={gs.p.f}/>)}
      </div>
    </div>
  </div>;
}

function GameOver({gs,onR}){
  const won=gs.over==="p";
  const c=fC(gs.p.f),l=fL(gs.p.f);
  return <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#04000E",textAlign:"center",padding:20}}>
    <div style={{fontSize:70,lineHeight:1,fontWeight:900,color:won?"#EAB308":"#EF4444",textShadow:`0 0 50px ${won?"#EAB308":"#EF4444"}`}}>{won?"VICTOIRE":"DÉFAITE"}</div>
    <p style={{opacity:.4,margin:"10px 0 24px",fontSize:13}}>{won?"La discipline a triomphé.":"Le Nexus s'est effondré."}</p>
    <button onClick={onR} style={{padding:"13px 36px",background:`linear-gradient(90deg,${c},${l})`,border:"none",borderRadius:22,color:"white",fontSize:16,fontWeight:"bold",cursor:"pointer",letterSpacing:2}}>REJOUER</button>
  </div>;
}

export default function UnlockArena(){
  const [screen,setScreen]=useState("select");
  const [gs,setGs]=useState(null);
  const timer=useRef(null);

  function sel(f){setGs(newGame(f));setScreen("game");}
  function replay(){clearTimeout(timer.current);setScreen("select");setGs(null);}

  function play(idx){
    setGs(prev=>{
      if(!prev||prev.turn!=="p"||prev.over)return prev;
      const card=prev.p.hand[idx];
      if(!card||card.cost>prev.p.en)return prev;
      const dmg=roll(card);
      const{hp:iHp,sh:iSh}=dmg>0?applyHit(prev.i.hp,prev.i.sh,dmg,card.pierce):{hp:prev.i.hp,sh:prev.i.sh};
      const pSh=prev.p.sh+(card.sh||0);
      const pHp=Math.min(20,prev.p.hp+(card.heal||0));
      const deck=[...prev.p.deck];
      const drawn=deck.splice(0,card.dr||0);
      const hand=[...prev.p.hand.filter((_,i)=>i!==idx),...drawn];
      let iHand=[...prev.i.hand];
      if(card.steal&&iHand.length>0)iHand.splice(Math.floor(Math.random()*iHand.length),1);
      if(card.discard&&iHand.length>0)iHand.splice(Math.floor(Math.random()*iHand.length),1);
      let log=`▶ ${card.name}`;
      if(dmg>0)log+=` · ${dmg} dégâts${card.pierce?" (perce)":""}`;
      if(card.sh)log+=` · +${card.sh} 🛡`;
      if(card.heal)log+=` · +${card.heal} ❤️`;
      if(card.dr)log+=` · pioche +${card.dr}`;
      const over=iHp<=0?"p":null;
      return{...prev,p:{...prev.p,hp:pHp,sh:pSh,en:prev.p.en-card.cost,hand,deck},i:{...prev.i,hp:iHp,sh:iSh,hand:iHand},log:[...prev.log,log],over};
    });
  }

  function endTurn(){
    setGs(prev=>{if(!prev||prev.turn!=="p"||prev.over)return prev;return{...prev,turn:"i",log:[...prev.log,"⏸ Fin de tour"]};});
  }

  useEffect(()=>{
    if(!gs||gs.turn!=="i"||gs.over)return;
    timer.current=setTimeout(()=>{
      setGs(prev=>{
        if(!prev||prev.over)return prev;
        const playable=prev.i.hand.filter(c=>c.cost<=prev.i.en).sort((a,b)=>b.cost-a.cost);
        if(playable.length>0){
          const card=playable[0];
          const dmg=roll(card);
          const{hp:pHp,sh:pSh}=dmg>0?applyHit(prev.p.hp,prev.p.sh,dmg,card.pierce):{hp:prev.p.hp,sh:prev.p.sh};
          const ihand=prev.i.hand.filter(c=>c.id!==card.id);
          let log=`⚡ IA · ${card.name}`;
          if(dmg>0)log+=` · ${dmg} dégâts`;
          if(card.sh)log+=` · +${card.sh} 🛡`;
          const over=pHp<=0?"i":null;
          return{...prev,p:{...prev.p,hp:pHp,sh:pSh},i:{...prev.i,sh:prev.i.sh+(card.sh||0),hp:Math.min(20,prev.i.hp+(card.heal||0)),en:prev.i.en-card.cost,hand:ihand},log:[...prev.log,log],over};
        }
        const nT=prev.tN+1,nE=Math.min(nT,10);
        const pD=[...prev.p.deck],pDr=pD.splice(0,1);
        const iD=[...prev.i.deck],iDr=iD.splice(0,1);
        return{...prev,turn:"p",tN:nT,p:{...prev.p,en:nE,men:nE,hand:[...prev.p.hand,...pDr].slice(0,6),deck:pD},i:{...prev.i,en:nE,men:nE,hand:[...prev.i.hand,...iDr].slice(0,6),deck:iD},log:[...prev.log,`🔄 Tour ${nT} — À toi !`]};
      });
    },1200);
    return()=>clearTimeout(timer.current);
  },[gs?.turn,gs?.tN]);

  return <>
    <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#04000E;color:white;font-family:system-ui,sans-serif;overflow:hidden;height:100vh}`}</style>
    {screen==="select"&&<SelectScreen onSelect={sel}/>}
    {screen==="game"&&gs&&!gs.over&&<BattleScreen gs={gs} onPlay={play} onEnd={endTurn}/>}
    {screen==="game"&&gs?.over&&<GameOver gs={gs} onR={replay}/>}
  </>;
}
