import { useEffect, useRef, useState } from "react";

export default function HologramTitle() {
  const [scanY, setScanY] = useState(0);
  const [flicker, setFlicker] = useState(1);
  const [shift, setShift] = useState(3);
  const [skew, setSkew] = useState(0);

  useEffect(()=>{
    let raf;
    const animate = () => {
      setScanY(prev => (prev + 1.2) % 100);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const glitchIv = setInterval(()=>{
      setFlicker(0.4); setShift(10); setSkew((Math.random()-0.5)*8);
      setTimeout(()=>{ setFlicker(1); setShift(3); setSkew(0); }, 120);
    }, 2500 + Math.random()*2000);

    return()=>{ cancelAnimationFrame(raf); clearInterval(glitchIv); };
  },[]);

  const base = {
    fontFamily:'"Bebas Neue",cursive',
    fontSize:"clamp(48px,10vw,130px)",
    lineHeight:0.88,
    letterSpacing:"0.04em",
    position:"absolute",
    top:0,left:0,right:0,
    textAlign:"center",
    whiteSpace:"nowrap",
  };

  return (
    <div style={{position:"relative",height:"clamp(58px,12vw,155px)",margin:"0 0 20px",userSelect:"none",width:"100%"}}>
      <div style={{...base, color:"#FF003C", opacity:0.6, transform:`translateX(${-shift}px) skewX(${skew}deg)`}}>SYMBIHACKATHON</div>
      <div style={{...base, color:"#00E5FF", opacity:0.6, transform:`translateX(${shift}px) skewX(${skew}deg)`}}>SYMBIHACKATHON</div>
      <div style={{...base, color:"#FFE900", opacity:flicker, transform:`skewX(${skew}deg)`, textShadow:"0 0 30px rgba(255,233,0,0.8), 0 0 60px rgba(255,233,0,0.4)"}}>SYMBIHACKATHON</div>
      <div style={{position:"absolute",left:0,right:0,top:`${scanY}%`,height:"4%",background:"linear-gradient(180deg,transparent,rgba(255,233,0,0.12),transparent)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 3px)",pointerEvents:"none"}}/>
    </div>
  );
}