import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HackathonNav from "./HackathonNav";
import CyberpunkCursor from "../../components/CyberpunkCursor";
import cpStyles from "./hackathon-cp.module.css";

const C = {
  bg:"#060604", card:"#0D0B07", yellow:"#FFE900",
  red:"#FF003C", chrome:"#C0C0C0", dim:"#3A3224", dimLt:"#5A5030", text:"#D4C99A",
};

/* ── RULES DATA ── */
const RULES = [
  {
    id:"R-01", title:"TEAM SIZE",
    short:"1 to 4 members per team.",
    full:"Your team can have anywhere from 1 to 4 members. The roster you register with is the roster you submit with — no swapping members mid-event. Solo hackers are welcome.",
    severity:"STANDARD", color:C.yellow,
    icon:"◈",
    note:"Verify headcount at check-in. Mismatches will be flagged.",
  },
  {
    id:"R-02", title:"FRESH CODE ONLY",
    short:"All code must be written during the hackathon.",
    full:"Every line of code must be written within the official hackathon window. Pre-existing projects, prior codebases, or previously shipped products are strictly disqualified. Framework boilerplate and public libraries are allowed — pre-built features are not.",
    severity:"CRITICAL", color:C.red,
    icon:"◆",
    note:"Judges will review commit history. Pre-dated commits = instant DQ.",
  },
  {
    id:"R-03", title:"SUBMISSION RULES",
    short:"Submit via Devfolio before the deadline. No exceptions.",
    full:"All projects must be submitted through Devfolio before the official deadline. Late submissions will not be accepted under any circumstances. Your submission must include a working demo link, a public GitHub repo, and a filled README. Push early — don't wait for the last minute.",
    severity:"CRITICAL", color:C.red,
    icon:"◆",
    note:"Deadline is hard. Network issues are not an excuse — submit 30 mins early.",
  },
  {
    id:"R-04", title:"CODE OF CONDUCT",
    short:"Respect all participants. Zero tolerance for harassment.",
    full:"All participants, mentors, judges and organizers must follow the Code of Conduct. The event should feel competitive, not hostile. Any form of harassment, discrimination, or unsportsmanlike behavior will result in immediate disqualification and removal from the venue.",
    severity:"MANDATORY", color:C.chrome,
    icon:"◉",
    note:"Report incidents to any organizer immediately. We act fast.",
  },
  {
    id:"R-05", title:"INTELLECTUAL PROPERTY",
    short:"You own everything you build.",
    full:"Your team retains full ownership of all code, designs, and ideas created during the event. Organizers will not claim any IP rights over submissions. Open-sourcing your project is encouraged but not required.",
    severity:"STANDARD", color:C.yellow,
    icon:"◈",
    note:"Keep your repo public during judging. Private repos = unverifiable.",
  },
  {
    id:"R-06", title:"TOOLS & AI USAGE",
    short:"AI tools are allowed. Disclose what you used.",
    full:"You may use AI coding assistants, generative tools, and publicly available APIs. However, you must disclose all AI tools used in your submission README. The core idea, architecture, and implementation decisions must be your own. Submissions that are entirely AI-generated without meaningful human contribution will be disqualified.",
    severity:"STANDARD", color:C.yellow,
    icon:"◈",
    note:"Transparency wins. Judges respect honesty about tooling.",
  },
  {
    id:"R-07", title:"JUDGING CRITERIA",
    short:"Innovation, execution, impact, and presentation.",
    full:"Projects will be judged on: (1) Innovation — is the idea original? (2) Technical Execution — does it work? Is the code quality reasonable? (3) Impact — does it solve a real problem? (4) Presentation — can the team communicate the idea clearly? Each criterion carries equal weight.",
    severity:"INFO", color:"#00E5FF",
    icon:"◇",
    note:"A working demo beats a perfect pitch with no product.",
  },
];

const SEVERITY_MAP = {
  CRITICAL:  { label:"CRITICAL",  color:C.red,     bg:"rgba(255,0,60,0.12)"   },
  MANDATORY: { label:"MANDATORY", color:C.chrome,  bg:"rgba(192,192,192,0.1)" },
  STANDARD:  { label:"STANDARD",  color:C.yellow,  bg:"rgba(255,233,0,0.08)"  },
  INFO:      { label:"INFO",      color:"#00E5FF",  bg:"rgba(0,229,255,0.08)"  },
};

const JUDGE_SIGNALS = [
  { label:"Clear problem framing",             col:C.yellow },
  { label:"Working demo",                      col:C.yellow },
  { label:"Readable repo + README",            col:C.red    },
  { label:"Strong pitch",                      col:C.red    },
  { label:"Commit history integrity",          col:C.yellow },
  { label:"Original idea",                     col:C.red    },
];

/* ── AUDIO ENGINE ── */
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
    const gN = ctx.createGain(); gN.gain.setValueAtTime(1.2,now); gN.gain.exponentialRampToValueAtTime(0.001,now+dur);
    noise.connect(bp); bp.connect(hs); hs.connect(gN); gN.connect(ctx.destination);
    noise.start(now); noise.stop(now+dur);
    [0,0.04].forEach(off=>{
      const osc=ctx.createOscillator(); osc.type="sawtooth";
      osc.frequency.setValueAtTime(160+Math.random()*100,now+off);
      osc.frequency.exponentialRampToValueAtTime(30,now+off+0.06);
      const gO=ctx.createGain(); gO.gain.setValueAtTime(0.4,now+off); gO.gain.exponentialRampToValueAtTime(0.001,now+off+0.06);
      const ws=ctx.createWaveShaper(); const cv=new Float32Array(256);
      for(let i=0;i<256;i++){const x=(i*2)/256-1; cv[i]=(Math.PI+400)*x/(Math.PI+400*Math.abs(x));}
      ws.curve=cv; osc.connect(ws); ws.connect(gO); gO.connect(ctx.destination);
      osc.start(now+off); osc.stop(now+off+0.07);
    });
  } catch(e){}
}
function playTick() {
  if (globalMuted) return;
  try {
    const ctx=getAudioCtx(); const now=ctx.currentTime;
    const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.035),ctx.sampleRate);
    const data=buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.007));
    const src=ctx.createBufferSource(); src.buffer=buf;
    const bp=ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=3000+Math.random()*3000; bp.Q.value=1.2;
    const g=ctx.createGain(); g.gain.setValueAtTime(0.6+Math.random()*0.3,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.035);
    src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(now); src.stop(now+0.035);
  } catch(e){}
}

/* ── INJECT STYLES ── */
function injectStyles() {
  if (document.getElementById("rl-styles")) return;
  const s = document.createElement("style");
  s.id = "rl-styles";
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap');

    @keyframes rlBlob   { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-30px) scale(1.06)} 70%{transform:translate(-20px,40px) scale(.96)} }
    @keyframes rlPulse  { 0%,100%{opacity:1} 50%{opacity:.45} }
    @keyframes rlScan   { 0%{top:-40%;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:130%;opacity:0} }
    @keyframes rlJitter {
      0%  {transform:translate(0,0)      skewX(0deg);}
      25% {transform:translate(-2px,1px)  skewX(-1deg);}
      50% {transform:translate(2px,-1px)  skewX(0.8deg);}
      75% {transform:translate(-1px,2px)  skewX(0deg);}
      100%{transform:translate(0,0)      skewX(0deg);}
    }
    @keyframes rlArcFlash {
      0%  {opacity:0}
      6%  {opacity:.5;background:rgba(255,233,0,0.14)}
      18% {opacity:.2}
      100%{opacity:0}
    }
    @keyframes rlBorderZap {
      0%,100%{box-shadow:0 0 0 transparent}
      20%    {box-shadow:0 0 16px rgba(255,233,0,0.35)}
      55%    {box-shadow:0 0 8px rgba(255,0,60,0.25)}
    }
    @keyframes dataCorrupt {
      0%   { transform:translate(0,0)      skewX(0deg)    scaleX(1);     text-shadow:4px 0 #FF003C,-4px 0 #00E5FF,0 0 20px rgba(255,233,0,.5); }
      8%   { transform:translate(-4px,0)   skewX(-1.5deg) scaleX(1.006); text-shadow:-6px 0 #FF003C,6px 0 #00E5FF,0 0 30px rgba(255,233,0,.6); }
      16%  { transform:translate(4px,1px)  skewX(1.2deg)  scaleX(0.994); text-shadow:6px 0 #FF003C,-6px 0 #00E5FF,0 0 10px rgba(255,233,0,.3); }
      24%  { transform:translate(-2px,0)   skewX(0deg)    scaleX(1.008); text-shadow:-4px 0 #FF003C,4px 0 #00E5FF,0 0 25px rgba(255,233,0,.5); }
      32%  { transform:translate(3px,-1px) skewX(-0.8deg) scaleX(0.997); text-shadow:8px 0 #FF003C,-8px 0 #00E5FF,0 0 35px rgba(255,233,0,.7); }
      40%  { transform:translate(-3px,2px) skewX(1.8deg)  scaleX(1.004); text-shadow:-3px 0 #FF003C,3px 0 #00E5FF,0 0 15px rgba(255,233,0,.4); }
      48%  { transform:translate(2px,0)    skewX(-1.2deg) scaleX(0.996); text-shadow:5px 0 #FF003C,-5px 0 #00E5FF,0 0 28px rgba(255,233,0,.5); }
      56%  { transform:translate(-5px,1px) skewX(2deg)    scaleX(1.01);  text-shadow:-7px 0 #FF003C,7px 0 #00E5FF,0 0 40px rgba(255,233,0,.8); }
      64%  { transform:translate(4px,-2px) skewX(-1.5deg) scaleX(0.992); text-shadow:4px 0 #FF003C,-4px 0 #00E5FF,0 0 20px rgba(255,233,0,.5); }
      72%  { transform:translate(-2px,0)   skewX(0.6deg)  scaleX(1.003); text-shadow:-5px 0 #FF003C,5px 0 #00E5FF,0 0 22px rgba(255,233,0,.5); }
      80%  { transform:translate(3px,1px)  skewX(-1deg)   scaleX(0.998); text-shadow:6px 0 #FF003C,-6px 0 #00E5FF,0 0 30px rgba(255,233,0,.6); }
      88%  { transform:translate(-4px,0)   skewX(1.5deg)  scaleX(1.006); text-shadow:-4px 0 #FF003C,4px 0 #00E5FF,0 0 18px rgba(255,233,0,.4); }
      96%  { transform:translate(2px,-1px) skewX(-0.5deg) scaleX(1.001); text-shadow:7px 0 #FF003C,-7px 0 #00E5FF,0 0 35px rgba(255,233,0,.7); }
      100% { transform:translate(0,0)      skewX(0deg)    scaleX(1);     text-shadow:4px 0 #FF003C,-4px 0 #00E5FF,0 0 20px rgba(255,233,0,.5); }
    }
    @keyframes rlGlitch {
      0%,87%,100%{text-shadow:5px 0 0 #FF003C,-3px 0 0 rgba(0,220,255,.4);transform:skewX(0)}
      88%{text-shadow:-8px 0 0 #FF003C,8px 0 0 rgba(0,220,255,.6);transform:skewX(-2.5deg);filter:brightness(1.4)}
      89%{text-shadow:5px 0 0 #FF003C,-3px 0 0 rgba(0,220,255,.4);transform:skewX(0);filter:brightness(1)}
    }
    @keyframes rlScanScroll { from{background-position:0 0} to{background-position:0 -6px} }
    @keyframes rlBracket    { from{width:0;height:0;opacity:0} to{width:18px;height:18px;opacity:1} }
    @keyframes rlReveal     { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
    @keyframes rlCritBlink  { 0%,100%{opacity:1} 45%{opacity:.3} }
  `;
  document.head.appendChild(s);
}

/* ── RULE CARD ── */
function RuleCard({ rule, index }) {
  const [open,   setOpen]   = useState(false);
  const [hov,    setHov]    = useState(false);
  const [jitter, setJitter] = useState(false);
  const [arc,    setArc]    = useState(false);
  const tmr = useRef(null);
  const sev = SEVERITY_MAP[rule.severity];

  useEffect(() => {
    if (!hov) { setJitter(false); clearTimeout(tmr.current); return; }
    const burst = () => {
      setJitter(true); playTick();
      setTimeout(()=>setJitter(false), 65+Math.random()*65);
      tmr.current = setTimeout(burst, 700+Math.random()*1400);
    };
    tmr.current = setTimeout(burst, 300);
    return () => clearTimeout(tmr.current);
  }, [hov]);

  const handleEnter = () => {
    setHov(true); setArc(true); playShock();
    setTimeout(()=>setArc(false), 350);
  };

  return (
      <motion.div
          initial={{ opacity:0, x:-24 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true, amount:0.15 }}
          transition={{ duration:.5, delay: index*.07 }}
          onMouseEnter={handleEnter}
          onMouseLeave={()=>setHov(false)}
          style={{
            position:"relative",
            background: C.card,
            border:`1px solid ${hov ? rule.color+"70" : rule.color+"18"}`,
            borderLeft:`4px solid ${rule.color}`,
            overflow:"hidden",
            cursor:"pointer",
            transition:"border-color .25s",
            animation: jitter
                ? "rlJitter .07s steps(1) infinite"
                : hov ? "rlBorderZap .5s steps(1)" : "none",
          }}
          onClick={() => { setOpen(o=>!o); playTick(); }}
      >
        {/* ARC FLASH */}
        {arc && <div style={{position:"absolute",inset:0,zIndex:20,pointerEvents:"none",animation:"rlArcFlash .35s ease-out forwards"}}/>}

        {/* SCAN SWEEP */}
        {hov && <div style={{position:"absolute",left:0,right:0,top:"-40%",height:"40%",pointerEvents:"none",zIndex:3,background:`linear-gradient(180deg,transparent,${rule.color}25 50%,transparent)`,animation:"rlScan 1.2s linear infinite"}}/>}

        {/* SCANLINES */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.22) 2px,rgba(0,0,0,.22) 3px)",animation:hov?"rlScanScroll .12s linear infinite":"none",opacity:.5,zIndex:1}}/>

        {/* MAIN ROW */}
        <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",gap:0,padding:"0"}}>

          {/* LEFT — rule number block */}
          <div style={{
            flexShrink:0,
            width:"clamp(60px,8vw,90px)",
            alignSelf:"stretch",
            display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center",
            background:`${rule.color}10`,
            borderRight:`1px solid ${rule.color}25`,
            padding:"20px 0",
            gap:6,
          }}>
            <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(22px,3vw,32px)",color:rule.color,lineHeight:1,textShadow:`0 0 14px ${rule.color}60`}}>{rule.id}</div>
            <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(18px,2.5vw,26px)",color:rule.color,opacity:.3}}>{rule.icon}</div>
          </div>

          {/* CENTER — content */}
          <div style={{flex:1,padding:"18px 20px",minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
              <h3 style={{
                fontFamily:'"Bebas Neue",cursive',
                fontSize:"clamp(18px,3vw,26px)",
                color: jitter ? rule.color : C.text,
                letterSpacing:".08em", margin:0, lineHeight:1,
                textShadow: jitter ? `0 0 10px ${rule.color},2px 0 0 #FF003C` : "none",
                transition:"color .04s,text-shadow .04s",
              }}>{rule.title}</h3>

              {/* SEVERITY BADGE */}
              <div style={{
                fontFamily:'"Share Tech Mono",monospace',
                fontSize:"7px",letterSpacing:".2em",
                color:sev.color, background:sev.bg,
                border:`1px solid ${sev.color}40`,
                padding:"3px 10px",
                clipPath:"polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
                animation: rule.severity==="CRITICAL" ? "rlCritBlink 1.8s ease-in-out infinite" : "none",
              }}>{sev.label}</div>
            </div>

            <p style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:"clamp(13px,1.8vw,16px)",color:C.dimLt,lineHeight:1.6,margin:0}}>
              {rule.short}
            </p>
          </div>

          {/* RIGHT — expand toggle */}
          <div style={{
            flexShrink:0,
            padding:"20px 20px",
            display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center",
            gap:6,
          }}>
            <div style={{
              fontFamily:'"Bebas Neue",cursive',
              fontSize:20,
              color: open ? rule.color : C.dimLt,
              transition:"color .2s, transform .2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              lineHeight:1,
            }}>▼</div>
            <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:"6px",color:C.dim,letterSpacing:".18em"}}>{open?"CLOSE":"MORE"}</div>
          </div>
        </div>

        {/* EXPANDED DETAIL */}
        <AnimatePresence>
          {open && (
              <motion.div
                  initial={{height:0,opacity:0}}
                  animate={{height:"auto",opacity:1}}
                  exit={{height:0,opacity:0}}
                  transition={{duration:.28}}
                  style={{overflow:"hidden",position:"relative",zIndex:2}}
              >
                <div style={{
                  borderTop:`1px solid ${rule.color}20`,
                  display:"grid",
                  gridTemplateColumns:"1fr auto",
                  gap:0,
                }}>
                  {/* FULL DETAIL */}
                  <div style={{padding:"16px 20px 18px",paddingLeft:"clamp(80px,8vw,110px)"}}>
                    <p style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:"clamp(13px,1.8vw,15px)",color:C.text,lineHeight:1.75,margin:0}}>
                      {rule.full}
                    </p>
                  </div>

                  {/* OPERATOR NOTE */}
                  <div style={{
                    width:"clamp(160px,22vw,240px)",
                    flexShrink:0,
                    background:`${rule.color}08`,
                    borderLeft:`1px solid ${rule.color}20`,
                    padding:"16px 16px",
                    display:"flex",flexDirection:"column",gap:8,
                  }}>
                    <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",letterSpacing:".22em",color:rule.color}}>// OPERATOR NOTE</div>
                    <p style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:13,color:C.dimLt,lineHeight:1.6,margin:0}}>
                      {rule.note}
                    </p>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* CORNER BRACKETS on hover */}
        {hov && <>
          <div style={{position:"absolute",top:4,left:4,borderTop:`2px solid ${rule.color}`,borderLeft:`2px solid ${rule.color}`,animation:"rlBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
          <div style={{position:"absolute",bottom:4,right:4,borderBottom:`2px solid #FF003C`,borderRight:`2px solid #FF003C`,animation:"rlBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
        </>}
      </motion.div>
  );
}

/* ── MUTE BUTTON ── */
function MuteButton() {
  const [muted, setMuted] = useState(false);
  return (
      <button onClick={()=>{globalMuted=!muted;setMuted(!muted);}} style={{
        position:"fixed",bottom:90,left:24,zIndex:9980,
        fontFamily:'"Share Tech Mono",monospace',fontSize:"9px",letterSpacing:".2em",
        padding:"7px 14px",
        background: muted?"rgba(255,0,60,0.15)":"rgba(255,233,0,0.1)",
        color: muted?"#FF003C":"#FFE900",
        border:`1px solid ${muted?"#FF003C50":"#FFE90050"}`,
        cursor:"crosshair",
        clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
        transition:"all .2s",
      }}>{muted?"◼ SFX OFF":"◉ SFX ON"}</button>
  );
}

/* ── MAIN ── */
export default function Rules() {
  const [titleJitter, setTitleJitter] = React.useState(false);
  const titleTmr = React.useRef(null);
  useEffect(() => {
    injectStyles();
    return () => clearTimeout(titleTmr.current);
    return () => clearTimeout(titleTmr.current);
    return () => clearTimeout(titleTmr.current);
    return () => clearTimeout(titleTmr.current);
    const unlock = () => {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
    };
    document.addEventListener("click", unlock, { once:true });
    return () => document.removeEventListener("click", unlock);
  }, []);

  const criticalCount = RULES.filter(r=>r.severity==="CRITICAL").length;

  return (
      <div className={cpStyles.cpPage} style={{
        background:C.bg, minHeight:"100vh",
        fontFamily:'"Share Tech Mono",monospace',
        position:"relative", overflow:"hidden", paddingBottom:100,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap" rel="stylesheet"/>

        {/* TOP STRIPE */}
        <div style={{position:"fixed",top:0,left:0,right:0,height:4,background:"repeating-linear-gradient(90deg,#FFE900 0,#FFE900 20px,#060604 20px,#060604 40px)",zIndex:9990,pointerEvents:"none"}}/>
        {/* SCANLINES */}
        <div style={{position:"fixed",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,233,0,.01) 3px,rgba(255,233,0,.01) 4px)",pointerEvents:"none",zIndex:1}}/>
        {/* BLOBS */}
        <div style={{position:"fixed",top:-200,left:-200,width:700,height:700,background:C.yellow,borderRadius:"50%",filter:"blur(200px)",opacity:.02,pointerEvents:"none",animation:"rlBlob 14s ease-in-out infinite"}}/>
        <div style={{position:"fixed",bottom:-150,right:-150,width:600,height:600,background:C.red,borderRadius:"50%",filter:"blur(180px)",opacity:.025,pointerEvents:"none",animation:"rlBlob 18s ease-in-out infinite reverse"}}/>

        <CyberpunkCursor/><MuteButton/>

        <div style={{position:"relative",zIndex:2,padding:"clamp(56px,9vw,96px) clamp(14px,5vw,56px) 40px"}}>

          {/* ══════ HERO ══════ */}
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.9}} style={{marginBottom:48}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
              <div style={{width:36,height:1,background:C.red}}/>
              <span style={{fontSize:9,letterSpacing:".38em",color:C.red}}>SYMBIHACK 2026 — FIELD MANUAL</span>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.red}60,transparent)`}}/>
            </div>

            <h1 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(60px,13vw,150px)",lineHeight:.82,margin:"0 0 4px",letterSpacing:".02em",color:C.yellow}}>FIELD</h1>
            <h1 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(60px,13vw,150px)",lineHeight:.82,margin:"0 0 28px",letterSpacing:".02em",color:"rgba(0,0,0,0)",WebkitTextStroke:`2px ${C.red}`,WebkitTextFillColor:"rgba(0,0,0,0)",textShadow:"none",marginLeft:"clamp(16px,4vw,72px)",MozTextFillColor:"transparent"}} className={cpStyles.outlineText}>MANUAL</h1>

            {/* ALERT BAR */}
            <div style={{
              display:"flex",alignItems:"center",gap:14,
              padding:"12px 20px",
              background:"rgba(255,0,60,0.08)",
              border:`1px solid rgba(255,0,60,0.3)`,
              borderLeft:`4px solid ${C.red}`,
              marginBottom:32,
              clipPath:"polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)",
            }}>
              <div style={{width:8,height:8,background:C.red,animation:"rlCritBlink 1.5s ease-in-out infinite",boxShadow:`0 0 10px ${C.red}`,flexShrink:0}}/>
              <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:10,color:C.red,letterSpacing:".18em"}}>
              {criticalCount} CRITICAL RULES — READ BEFORE REGISTERING. VIOLATIONS RESULT IN DISQUALIFICATION.
            </span>
            </div>

            {/* STATS ROW */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:2,marginBottom:0}}>
              {[
                {val:RULES.length,         label:"TOTAL RULES",    col:C.yellow},
                {val:criticalCount,         label:"CRITICAL",       col:C.red   },
                {val:"4",                   label:"MAX TEAM SIZE",  col:C.yellow},
                {val:"DEVFOLIO",            label:"SUBMIT VIA",     col:C.red   },
              ].map(({val,label,col},i)=>(
                  <motion.div key={label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:.1+i*.07}}
                              style={{background:C.card,padding:"16px 16px",borderTop:`3px solid ${col}`,position:"relative",overflow:"hidden"}}
                  >
                    <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(28px,4vw,42px)",color:col,lineHeight:1,textShadow:`0 0 20px ${col}50`,animation:"rlPulse 3s ease-in-out infinite"}}>{val}</div>
                    <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".2em",color:C.dimLt,marginTop:4}}>{label}</div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${col},transparent)`,opacity:.3}}/>
                  </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ══════ RULES LIST ══════ */}
          <div style={{marginBottom:48}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:20}}>
              <div style={{padding:"7px 20px",background:C.yellow,color:C.bg,fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"}}>REGULATIONS</div>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.yellow}80,transparent)`,marginLeft:2}}/>
              <span style={{fontSize:8,letterSpacing:".2em",color:C.dim}}>CLICK ANY RULE TO EXPAND</span>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              {RULES.map((rule,i) => <RuleCard key={rule.id} rule={rule} index={i}/>)}
            </div>
          </div>

          {/* ══════ JUDGE SIGNALS ══════ */}
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.6}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:20}}>
              <div style={{padding:"7px 20px",background:C.red,color:"#fff",fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"}}>WHAT JUDGES LOOK FOR</div>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.red}80,transparent)`,marginLeft:2}}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:3}}>
              {JUDGE_SIGNALS.map(({label,col},i)=>(
                  <motion.div key={label}
                              initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.35,delay:i*.06}}
                              style={{
                                background:C.card,
                                borderLeft:`3px solid ${col}`,
                                border:`1px solid rgba(255,233,0,0.07)`,
                                borderLeft:`3px solid ${col}`,
                                padding:"16px 18px",
                                display:"flex",alignItems:"center",gap:12,
                                clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)",
                              }}
                  >
                    <div style={{width:6,height:6,background:col,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",boxShadow:`0 0 6px ${col}`,flexShrink:0}}/>
                    <span style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:15,color:C.text,letterSpacing:".04em"}}>{label}</span>
                  </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ══════ BOTTOM WARNING ══════ */}
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:.6,delay:.2}}
                      style={{
                        marginTop:24,padding:"16px 22px",
                        background:"rgba(255,233,0,0.04)",
                        border:`1px solid rgba(255,233,0,0.15)`,
                        borderLeft:`4px solid ${C.yellow}`,
                        display:"flex",alignItems:"center",gap:14,
                        clipPath:"polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)",
                      }}
          >
            <div style={{width:8,height:8,background:C.yellow,animation:"rlPulse 2s ease-in-out infinite",boxShadow:`0 0 10px ${C.yellow}`,flexShrink:0}}/>
            <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:9,color:C.dimLt,letterSpacing:".18em",lineHeight:1.6}}>
            BY REGISTERING YOU AGREE TO ALL RULES ABOVE. ORGANIZERS RESERVE THE RIGHT TO DISQUALIFY ANY TEAM FOUND IN VIOLATION. DECISIONS ARE FINAL.
          </span>
          </motion.div>

          {/* LEGEND */}
          <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:16,alignItems:"center",padding:"12px 0"}}>
            <span style={{fontSize:8,letterSpacing:".24em",color:C.dim}}>// SEVERITY KEY</span>
            {Object.entries(SEVERITY_MAP).map(([key,val])=>(
                <div key={key} style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:7,height:7,background:val.color,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",boxShadow:`0 0 5px ${val.color}`}}/>
                  <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:7,color:C.dimLt,letterSpacing:".1em"}}>{key}</span>
                </div>
            ))}
            <div style={{marginLeft:"auto",fontFamily:'"Bebas Neue",cursive',fontSize:13,color:C.dim,letterSpacing:".18em"}}>SYMBIHACKATHON 2026</div>
          </div>

        </div>
        <HackathonNav/>
      </div>
  );
}