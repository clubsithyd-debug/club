import { useEffect, useRef, useState } from "react";

const TARGET = "SYMBIHACKATHON";
const CHARS = "??????????0123456789@#$%!ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randChar() { return CHARS[Math.floor(Math.random()*CHARS.length)]; }

export default function GlitchTitle() {
  const [letters, setLetters] = useState(()=>TARGET.split("").map(c=>({char:c,glitching:false,offset:0})));
  const tmr = useRef(null);

  useEffect(()=>{
    const glitchRandom = () => {
      const count = 1 + Math.floor(Math.random()*3);
      const indices = [];
      while(indices.length < count) {
        const i = Math.floor(Math.random()*TARGET.length);
        if(!indices.includes(i)) indices.push(i);
      }
      setLetters(prev=>prev.map((l,i)=>indices.includes(i)?{char:randChar(),glitching:true,offset:(Math.random()-0.5)*8}:l));
      setTimeout(()=>{
        setLetters(prev=>prev.map((l,i)=>indices.includes(i)?{char:TARGET[i],glitching:false,offset:0}:l));
      }, 60+Math.random()*80);
      tmr.current = setTimeout(glitchRandom, 150+Math.random()*600);
    };
    tmr.current = setTimeout(glitchRandom, 800);
    return()=>clearTimeout(tmr.current);
  },[]);

  return (
    <h1 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(48px,10vw,130px)",lineHeight:0.88,margin:"0 0 20px",letterSpacing:"0.03em",display:"flex",justifyContent:"center",flexWrap:"wrap",userSelect:"none"}}>
      {letters.map((l,i)=>(
        <span key={i} style={{
          display:"inline-block",
          color:l.glitching?"#00E5FF":"#FFE900",
          textShadow:l.glitching
            ?`0 0 20px #00E5FF, 2px 0 0 #FF003C, -2px 0 0 #FFE900`
            :`0 0 2px #FFE900, 0 0 30px rgba(255,233,0,0.35), 5px 5px 0 #FF003C`,
          transform:`translateY(${l.offset}px) skewX(${l.glitching?(Math.random()-0.5)*10:0}deg)`,
          transition:l.glitching?"none":"color 0.08s, text-shadow 0.08s, transform 0.08s",
        }}>{l.char}</span>
      ))}
    </h1>
  );
}