import { useState, useEffect, useRef } from "react";

export default function CyberpunkFlipClock({ targetDate }) {
  const [t, setT] = useState({days:0,hours:0,minutes:0,seconds:0});
  useEffect(()=>{
    const end = new Date(targetDate).getTime();
    const tick = () => {
      const d = Math.max(0, end - Date.now());
      setT({ days:Math.floor(d/86400000), hours:Math.floor((d/3600000)%24), minutes:Math.floor((d/60000)%60), seconds:Math.floor((d/1000)%60) });
    };
    tick(); const iv = setInterval(tick,1000); return()=>clearInterval(iv);
  },[targetDate]);

  useEffect(()=>{
    if (document.getElementById("fpc-kf")) return;
    const s = document.createElement("style");
    s.id = "fpc-kf";
    s.innerHTML = `@keyframes fpcFlip { 0%{transform:rotateX(0) scaleY(1)} 45%{transform:rotateX(-90deg) scaleY(0.1);filter:brightness(2)} 55%{transform:rotateX(90deg) scaleY(0.1);filter:brightness(2)} 100%{transform:rotateX(0) scaleY(1)} }`;
    document.head.appendChild(s);
  },[]);

  const pad = n => String(n).padStart(2,"0");

  function Tile({ val, label, red }) {
    const [display, setDisplay] = useState(val);
    const [flipping, setFlipping] = useState(false);
    const prev = useRef(val);
    useEffect(()=>{
      if (val !== prev.current) {
        setFlipping(true);
        setTimeout(()=>{ setDisplay(val); prev.current = val; },150);
        setTimeout(()=>setFlipping(false), 300);
      }
    },[val]);
    const col = red ? "#FF003C" : "#FFE900";
    const opp = red ? "#FFE900" : "#FF003C";
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{background:"#0D0B07",border:`1px solid rgba(255,233,0,0.2)`,borderTop:`3px solid ${col}`,padding:"16px 24px",minWidth:100,textAlign:"center",position:"relative",boxShadow:`0 0 24px rgba(${red?"255,0,60":"255,233,0"},0.08)`}}>
          <div style={{position:"absolute",top:4,left:4,width:10,height:10,borderTop:`1px solid ${col}`,borderLeft:`1px solid ${col}`}}/>
          <div style={{position:"absolute",bottom:4,right:4,width:10,height:10,borderBottom:`1px solid ${col}`,borderRight:`1px solid ${col}`}}/>
          <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",left:0,right:0,top:"50%",height:1,background:"rgba(255,233,0,0.1)",transform:"translateY(-50%)"}}/>
          <span style={{
            fontFamily:'"Bebas Neue",cursive',
            fontSize:"clamp(52px,8vw,90px)",
            lineHeight:1,color:col,
            textShadow:`0 0 30px rgba(${red?"255,0,60":"255,233,0"},0.5),3px 3px 0 ${opp}`,
            position:"relative",zIndex:2,display:"inline-block",
            animation: flipping ? "fpcFlip 0.3s ease-in-out" : "none",
          }}>{pad(display)}</span>
        </div>
        <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:10,letterSpacing:".28em",color:red?"#FF003C":"#5A5030"}}>{label}</span>
      </div>
    );
  }

  function Colon() {
    const [vis, setVis] = useState(true);
    useEffect(()=>{ const iv=setInterval(()=>setVis(v=>!v),500); return()=>clearInterval(iv); },[]);
    return (
      <div style={{display:"flex",flexDirection:"column",gap:14,paddingBottom:32,alignSelf:"center"}}>
        <div style={{width:7,height:7,background:vis?"#FFE900":"transparent",boxShadow:vis?"0 0 10px #FFE900":"none",transition:"all .2s"}}/>
        <div style={{width:7,height:7,background:vis?"#FF003C":"transparent",boxShadow:vis?"0 0 10px #FF003C":"none",transition:"all .2s"}}/>
      </div>
    );
  }

  return (
    <div style={{display:"flex",justifyContent:"center",width:"100%",marginBottom:28}}>
      <div style={{display:"inline-flex",alignItems:"flex-start",gap:"clamp(6px,1.5vw,16px)",padding:"clamp(16px,2vw,28px)",background:"#060604",border:"1px solid rgba(255,233,0,0.12)",position:"relative"}}>
        <div style={{position:"absolute",top:5,left:5,width:14,height:14,borderTop:"2px solid #FFE900",borderLeft:"2px solid #FFE900"}}/>
        <div style={{position:"absolute",bottom:5,right:5,width:14,height:14,borderBottom:"2px solid #FF003C",borderRight:"2px solid #FF003C"}}/>
        <div style={{position:"absolute",top:-1,right:16,fontFamily:'"Share Tech Mono",monospace',fontSize:7,letterSpacing:".3em",color:"#3A3224",background:"#060604",padding:"0 8px"}}>// COUNTDOWN</div>
        <Tile val={t.days}    label="DAYS"/>
        <Colon/>
        <Tile val={t.hours}   label="HOURS"/>
        <Colon/>
        <Tile val={t.minutes} label="MINS"/>
        <Colon/>
        <Tile val={t.seconds} label="SECS" red/>
      </div>
    </div>
  );
}