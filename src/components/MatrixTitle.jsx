import { useEffect, useRef, useState } from "react";

const TARGET = "SYMBIHACKATHON";
const CHARS = "??????????????????????????????0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%";
const CYAN = "#00E5FF";
const CYAN_DIM = "#004D5C";

function randChar() { return CHARS[Math.floor(Math.random()*CHARS.length)]; }

export default function MatrixTitle() {
  const [letters, setLetters] = useState(()=>TARGET.split("").map(()=>({char:randChar(),solved:false,glitching:false})));
  const [done, setDone] = useState(false);
  const frameRef = useRef(null);
  const solvedCount = useRef(0);
  const startRef = useRef(null);

  useEffect(()=>{
    let lastRain=0, lastSolve=0;
    const animate=(ts)=>{
      if(!startRef.current) startRef.current=ts;
      if(ts-lastRain>60){
        lastRain=ts;
        setLetters(prev=>prev.map(l=>l.solved?l:{...l,char:randChar(),glitching:Math.random()>0.6}));
      }
      if(ts-lastSolve>3200/TARGET.length && solvedCount.current<TARGET.length){
        lastSolve=ts;
        const idx=solvedCount.current++;
        setLetters(prev=>{const n=[...prev];n[idx]={char:TARGET[idx],solved:true,glitching:false};return n;});
        if(solvedCount.current>=TARGET.length){setDone(true);return;}
      }
      frameRef.current=requestAnimationFrame(animate);
    };
    frameRef.current=requestAnimationFrame(animate);
    return()=>cancelAnimationFrame(frameRef.current);
  },[]);

  useEffect(()=>{
    if(!done) return;
    const iv=setInterval(()=>{
      const idx=Math.floor(Math.random()*TARGET.length);
      setLetters(prev=>{const n=[...prev];n[idx]={...n[idx],char:randChar(),glitching:true};return n;});
      setTimeout(()=>setLetters(prev=>{const n=[...prev];n[idx]={char:TARGET[idx],solved:true,glitching:false};return n;}),80);
    },400+Math.random()*600);
    return()=>clearInterval(iv);
  },[done]);

  return (
    <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(42px,8vw,100px)",letterSpacing:"0.06em",lineHeight:1,display:"flex",justifyContent:"center",flexWrap:"wrap",userSelect:"none",margin:"0 0 8px"}}>
      {letters.map((l,i)=>(
        <span key={i} style={{
          display:"inline-block",
          color:l.solved?(l.glitching?"#ffffff":CYAN):(l.glitching?CYAN:CYAN_DIM),
          textShadow:l.solved?(l.glitching?`0 0 20px #fff,0 0 40px ${CYAN}`:`0 0 12px ${CYAN},0 0 30px ${CYAN}80,0 0 60px ${CYAN}40`):(l.glitching?`0 0 8px ${CYAN}`:"none"),
          opacity:l.solved?1:0.5+Math.random()*0.5,
          minWidth:"0.55em",textAlign:"center",
          transition:l.solved&&!l.glitching?"color 0.1s,text-shadow 0.3s":"none",
        }}>{l.char}</span>
      ))}
    </div>
  );
}