import React, { useState, useEffect, useRef } from "react";

let audioCtx = null;
let globalMuted = false;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function playShock() {
  if (globalMuted) return;
  try {
    const ctx = getAudioCtx(); const now = ctx.currentTime; const dur = 0.18;
    const buf = ctx.createBuffer(1, ctx.sampleRate*dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.04));
    const noise = ctx.createBufferSource(); noise.buffer=buf;
    const bp = ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=4000; bp.Q.value=0.8;
    const hs = ctx.createBiquadFilter(); hs.type="highshelf"; hs.frequency.value=3000; hs.gain.value=14;
    const gN = ctx.createGain(); gN.gain.setValueAtTime(1.4,now); gN.gain.exponentialRampToValueAtTime(0.001,now+dur);
    noise.connect(bp); bp.connect(hs); hs.connect(gN); gN.connect(ctx.destination);
    noise.start(now); noise.stop(now+dur);
    [0,0.03,0.07].forEach(off=>{
      const osc=ctx.createOscillator(); osc.type="sawtooth";
      osc.frequency.setValueAtTime(180+Math.random()*120,now+off);
      osc.frequency.exponentialRampToValueAtTime(40,now+off+0.06);
      const gO=ctx.createGain(); gO.gain.setValueAtTime(0.5,now+off); gO.gain.exponentialRampToValueAtTime(0.001,now+off+0.06);
      const ws=ctx.createWaveShaper(); const cv=new Float32Array(256);
      for(let i=0;i<256;i++){const x=(i*2)/256-1; cv[i]=(Math.PI+400)*x/(Math.PI+400*Math.abs(x));}
      ws.curve=cv; osc.connect(ws); ws.connect(gO); gO.connect(ctx.destination);
      osc.start(now+off); osc.stop(now+off+0.07);
    });
    const thud=ctx.createOscillator(); thud.type="sine";
    thud.frequency.setValueAtTime(80,now); thud.frequency.exponentialRampToValueAtTime(20,now+0.1);
    const gT=ctx.createGain(); gT.gain.setValueAtTime(0.7,now); gT.gain.exponentialRampToValueAtTime(0.001,now+0.12);
    thud.connect(gT); gT.connect(ctx.destination); thud.start(now); thud.stop(now+0.12);
  } catch(e){}
}
function playTick() {
  if (globalMuted) return;
  try {
    const ctx=getAudioCtx(); const now=ctx.currentTime;
    const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.04),ctx.sampleRate);
    const data=buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.008));
    const src=ctx.createBufferSource(); src.buffer=buf;
    const bp=ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=3500+Math.random()*3000; bp.Q.value=1.2;
    const g=ctx.createGain(); g.gain.setValueAtTime(0.7+Math.random()*0.3,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.04);
    src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(now); src.stop(now+0.04);
  } catch(e){}
}
function MuteBtn() {
  const [m, setM] = React.useState(false);
  return (
    <button onClick={()=>{globalMuted=!m;setM(!m);}} style={{
      position:"fixed",bottom:90,left:24,zIndex:9980,
      fontFamily:"Share Tech Mono,monospace",fontSize:"9px",letterSpacing:".2em",
      padding:"7px 14px",
      background:m?"rgba(255,0,60,0.15)":"rgba(255,233,0,0.1)",
      color:m?"#FF003C":"#FFE900",
      cursor:"crosshair",
      clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
    }}>{m?"SFX OFF":"SFX ON"}</button>
  );
}
import { motion } from "framer-motion";
import { scheduleData } from "../../data/hackathonData";
import HackathonNav from "./HackathonNav";
import CyberpunkCursor from "../../components/CyberpunkCursor";

const C = {
  bg:      "#080808",
  card:    "#0C0A06",
  yellow:  "#FFE900",
  red:     "#FF003C",
  chrome:  "#C0C0C0",
  dim:     "#4A4232",
  dimLt:   "#6A6040",
  border:  "rgba(255,233,0,0.15)",
  borderR: "rgba(255,0,60,0.25)",
};

const PHASE_COLORS = ["#FFE900","#FF003C","#C0C0C0"];
const PHASE_LABELS = ["PHASE-01","PHASE-02","PHASE-03"];
const PHASE_CODES  = ["DAY-ALPHA","DAY-BETA","DAY-GAMMA"];

export default function Schedule() {
  const [activeDay, setActiveDay] = useState(null);
  useEffect(() => {
    const unlock = () => {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
    };
    document.addEventListener("mousedown", unlock);
    document.addEventListener("mousemove", unlock);
    document.addEventListener("keydown", unlock);
    return () => {
      document.removeEventListener("mousedown", unlock);
      document.removeEventListener("mousemove", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);
  const [hoverEvent, setHoverEvent] = useState(null);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:'"Share Tech Mono",monospace', position:"relative", overflow:"hidden", paddingBottom:"80px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet"/>

      {/* TOP WARNING STRIPE */}
      <div style={{ position:"fixed", top:0, left:0, right:0, height:"4px", background:"repeating-linear-gradient(90deg,#FFE900 0,#FFE900 20px,#080808 20px,#080808 40px)", zIndex:9990, pointerEvents:"none" }}/>

      {/* SCANLINES */}
      <div style={{ position:"fixed", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,233,0,0.012) 3px,rgba(255,233,0,0.012) 4px)", pointerEvents:"none", zIndex:1 }}/>

      {/* AMBIENT GLOW */}
      <div style={{ position:"fixed", top:"-100px", left:"-100px", width:"500px", height:"500px", background:C.yellow, borderRadius:"50%", filter:"blur(140px)", opacity:0.04, pointerEvents:"none" }}/>
      <div style={{ position:"fixed", bottom:"-100px", right:"-100px", width:"400px", height:"400px", background:C.red, borderRadius:"50%", filter:"blur(140px)", opacity:0.05, pointerEvents:"none" }}/>

      <div style={{ position:"relative", zIndex:2, padding:"clamp(48px,7vw,90px) clamp(20px,5vw,60px) 40px" }}>

        {/* -- HERO -- */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} style={{ marginBottom:"56px" }}>
          <p style={{ fontSize:"10px", letterSpacing:"0.35em", color:C.red, textTransform:"uppercase", marginBottom:"12px" }}>// OPERATION SYMBIHACK &nbsp; ? &nbsp; EVENT TIMELINE</p>
          <h1 style={{ fontFamily:'"Bebas Neue",cursive', fontSize:"clamp(48px,10vw,130px)", color:C.yellow, textShadow:`0 0 2px ${C.yellow}, 0 0 30px rgba(255,233,0,0.35), 5px 5px 0 ${C.red}`, lineHeight:0.88, letterSpacing:"0.03em", margin:"0 0 20px" }}>
            MISSION<br/><span style={{ color:C.red, textShadow:`0 0 2px ${C.red}, 0 0 30px rgba(255,0,60,0.35), 5px 5px 0 ${C.yellow}` }}>SCHEDULE</span>
          </h1>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"24px", alignItems:"center" }}>
            <p style={{ fontFamily:'"Barlow Condensed",sans-serif', fontSize:"16px", color:C.dim, lineHeight:1.7, maxWidth:"500px", borderLeft:`2px solid rgba(255,233,0,0.15)`, paddingLeft:"14px" }}>
              48 hours. 3 phases. Every block mapped like a tactical ops board. Know where to be and when.
            </p>
            <div style={{ display:"flex", gap:"1px", background:"rgba(255,233,0,0.06)", marginLeft:"auto" }}>
              {[["// DAYS","3"],["// HOURS","48"],["// EVENTS", scheduleData.reduce((a,d)=>a+d.events.length,0)+""]].map(([label,val])=>(
                <div key={label} style={{ padding:"16px 24px", background:C.card, borderTop:`3px solid ${label.includes("DAYS")?C.yellow:label.includes("HOURS")?C.red:C.chrome}`, textAlign:"center", minWidth:"90px" }}>
                  <div style={{ fontSize:"9px", letterSpacing:"0.2em", color:C.dim, marginBottom:"6px" }}>{label}</div>
                  <div style={{ fontFamily:'"Bebas Neue",cursive', fontSize:"clamp(24px,3vw,36px)", color:label.includes("DAYS")?C.yellow:label.includes("HOURS")?C.red:C.chrome, textShadow:label.includes("DAYS")?`0 0 10px rgba(255,233,0,0.4),2px 2px 0 ${C.red}`:"none" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* -- DAY SELECTOR TABS -- */}
        <div style={{ display:"flex", gap:"1px", background:"rgba(255,233,0,0.06)", marginBottom:"32px", overflowX:"auto" }}>
          <div
            onClick={()=>{setActiveDay(null);setTimeout(playShock,50);}}
            style={{ padding:"12px 24px", background: activeDay===null ? C.yellow : C.card, color: activeDay===null ? C.bg : C.dim, fontFamily:'"Bebas Neue",cursive', fontSize:"15px", letterSpacing:"0.15em", cursor:"crosshair", whiteSpace:"nowrap", borderTop: activeDay===null ? `3px solid ${C.yellow}` : `3px solid transparent`, transition:"all 0.15s", boxShadow: activeDay===null ? `0 0 16px rgba(255,233,0,0.3)` : "none" }}
          >
            ALL PHASES
          </div>
          {scheduleData.map((day,i)=>(
            <div key={day.day}
              onClick={()=>{setActiveDay(activeDay===i?null:i);setTimeout(playShock,50);}}
              style={{ padding:"12px 24px", background: activeDay===i ? PHASE_COLORS[i] : C.card, color: activeDay===i ? C.bg : C.dimLt, fontFamily:'"Bebas Neue",cursive', fontSize:"15px", letterSpacing:"0.15em", cursor:"crosshair", whiteSpace:"nowrap", borderTop: activeDay===i ? `3px solid ${PHASE_COLORS[i]}` : "3px solid transparent", transition:"all 0.15s", boxShadow: activeDay===i ? `0 0 16px rgba(255,233,0,0.2)` : "none" }}
            >
              {PHASE_LABELS[i]} — {day.date}
            </div>
          ))}
        </div>

        {/* -- MAIN GRID -- */}
        <div style={{ display:"grid", gridTemplateColumns: activeDay!==null ? "1fr" : "repeat(auto-fit,minmax(300px,1fr))", gap:"1px", background:"rgba(255,233,0,0.06)" }}>
          {scheduleData.map((day,di)=>{
            if(activeDay!==null && activeDay!==di) return null;
            const col = PHASE_COLORS[di];
            return (
              <motion.div key={day.day}
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5, delay:di*0.1 }}
                style={{ background:C.card, position:"relative", overflow:"hidden" }}
              >
                {/* COLUMN HEADER */}
                <div style={{ background:C.bg, borderTop:`3px solid ${col}`, borderBottom:`1px solid rgba(255,233,0,0.08)`, padding:"20px 24px", position:"relative" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:`linear-gradient(90deg, rgba(${col==="#FFE900"?"255,233,0":col==="#FF003C"?"255,0,60":"192,192,192"},0.04) 0%, transparent 60%)`, pointerEvents:"none" }}/>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <p style={{ fontSize:"9px", letterSpacing:"0.25em", color:col, marginBottom:"6px", opacity:0.7 }}>{PHASE_CODES[di]}</p>
                      <p style={{ fontSize:"9px", letterSpacing:"0.2em", color:C.dim, marginBottom:"6px" }}>{PHASE_LABELS[di]}</p>
                      <h2 style={{ fontFamily:'"Bebas Neue",cursive', fontSize:"clamp(22px,3vw,36px)", color:col, textShadow:`0 0 10px ${col}40, 3px 3px 0 ${di===0?C.red:di===1?C.yellow:C.dim}`, letterSpacing:"0.06em", lineHeight:1 }}>{day.date}</h2>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:'"Share Tech Mono",monospace', fontSize:"9px", color:C.dim, letterSpacing:"0.15em", marginBottom:"4px" }}>BLOCKS</div>
                      <div style={{ fontFamily:'"Bebas Neue",cursive', fontSize:"28px", color:col }}>{day.events.length}</div>
                    </div>
                  </div>
                  {/* Corner bracket */}
                  <div style={{ position:"absolute", bottom:0, right:0, width:"16px", height:"16px", borderBottom:`2px solid ${col}`, borderRight:`2px solid ${col}`, opacity:0.5 }}/>
                </div>

                {/* EVENTS LIST */}
                <div style={{ padding:"0" }}>
                  {day.events.map((ev,ei)=>{
                    const isHover = hoverEvent===`${di}-${ei}`;
                    const isHighlight = ev.highlight;
                    return (
                      <motion.div key={ei}
                        onMouseEnter={()=>setHoverEvent(`${di}-${ei}`)}
                        onMouseLeave={()=>setHoverEvent(null)}
                        initial={{ opacity:0, x:-10 }}
                        animate={{ opacity:1, x:0 }}
                        transition={{ duration:0.3, delay:ei*0.04 }}
                        style={{
                          padding:"16px 24px",
                          borderBottom:`1px solid rgba(255,233,0,0.05)`,
                          borderLeft: isHighlight ? `3px solid ${C.yellow}` : isHover ? `3px solid ${col}` : `3px solid transparent`,
                          background: isHighlight ? "rgba(255,233,0,0.04)" : isHover ? "rgba(255,233,0,0.02)" : "transparent",
                          transition:"all 0.15s",
                          cursor:"default",
                          position:"relative",
                        }}
                      >
                        {isHighlight && (
                          <div style={{ position:"absolute", top:"12px", right:"16px", background:C.yellow, color:C.bg, fontFamily:'"Share Tech Mono",monospace', fontSize:"8px", letterSpacing:"0.15em", padding:"2px 8px" }}>? KEY</div>
                        )}
                        <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
                          <div style={{ flexShrink:0, marginTop:"2px" }}>
                            <div style={{ width:"6px", height:"6px", background: isHighlight ? C.yellow : col, boxShadow: isHighlight ? `0 0 8px ${C.yellow}` : "none", transform: isHighlight ? "rotate(45deg)" : "none", marginTop:"4px" }}/>
                            {ei < day.events.length-1 && <div style={{ width:"1px", height:"calc(100% + 16px)", background:`linear-gradient(${col}60,transparent)`, marginLeft:"2.5px", marginTop:"4px" }}/>}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:"9px", letterSpacing:"0.2em", color: isHighlight ? C.yellow : col, marginBottom:"4px", opacity: isHighlight ? 1 : 0.8 }}>
                              {ev.time}
                            </div>
                            <div style={{ fontFamily:'"Bebas Neue",cursive', fontSize:"clamp(15px,2vw,20px)", color: isHighlight ? C.yellow : "#D4C99A", letterSpacing:"0.08em", lineHeight:1.1, marginBottom:"6px", textShadow: isHighlight ? `0 0 8px rgba(255,233,0,0.3)` : "none" }}>
                              {ev.title}
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                              <span style={{ color:C.red, fontSize:"9px" }}>&#9642;</span>
                              <span style={{ fontFamily:'"Barlow Condensed",sans-serif', fontSize:"12px", color:C.dim, letterSpacing:"0.05em" }}>{ev.location}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* COLUMN FOOTER */}
                <div style={{ padding:"12px 24px", borderTop:`1px solid rgba(255,233,0,0.06)`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"9px", letterSpacing:"0.15em", color:C.dim }}>// {day.events.filter(e=>e.highlight).length} KEY EVENTS</span>
                  <span style={{ fontSize:"9px", letterSpacing:"0.15em", color:col, opacity:0.6 }}>{PHASE_LABELS[di]}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* -- BOTTOM LEGEND -- */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
          style={{ marginTop:"24px", display:"flex", flexWrap:"wrap", gap:"20px", alignItems:"center", padding:"16px 20px", background:C.card, borderTop:`1px solid rgba(255,233,0,0.08)`, borderLeft:`3px solid rgba(255,233,0,0.15)` }}
        >
          <span style={{ fontSize:"9px", letterSpacing:"0.2em", color:C.dim }}>// LEGEND:</span>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"12px", height:"12px", background:C.yellow, transform:"rotate(45deg)", boxShadow:`0 0 6px ${C.yellow}` }}/>
            <span style={{ fontSize:"10px", color:C.dimLt, letterSpacing:"0.1em" }}>KEY EVENT</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"6px", height:"6px", background:C.yellow }}/>
            <span style={{ fontSize:"10px", color:C.dimLt, letterSpacing:"0.1em" }}>STANDARD BLOCK</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ color:C.red, fontSize:"9px" }}>&#9642;</span>
            <span style={{ fontSize:"10px", color:C.dimLt, letterSpacing:"0.1em" }}>LOCATION</span>
          </div>
          <div style={{ marginLeft:"auto", fontFamily:'"Bebas Neue",cursive', fontSize:"13px", color:C.dim, letterSpacing:"0.15em" }}>
            SIT HYDERABAD // APRIL 2026
          </div>
        </motion.div>

      </div>

      <MuteBtn/><CyberpunkCursor/><HackathonNav/>
    </div>
  );
}
