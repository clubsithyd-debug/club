import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import HackathonNav from "./HackathonNav";
import CyberpunkCursor from "../../components/CyberpunkCursor";
import cpStyles from "./hackathon-cp.module.css";

const C = {
  bg:"#060604", card:"#0D0B07", yellow:"#FFE900",
  red:"#FF003C", chrome:"#C0C0C0", dim:"#3A3224", dimLt:"#5A5030", text:"#D4C99A",
};

/* ── ONLY 2 ROWS ── */
const ROW1 = [
  { name:"Title Partner",    tier:"PLATINUM", src:null },
  { name:"Cloud Partner",    tier:"GOLD",     src:null },
  { name:"AI Partner",       tier:"PLATINUM", src:null },
  { name:"DevTools Partner", tier:"GOLD",     src:null },
  { name:"Design Partner",   tier:"PLATINUM", src:null },
  { name:"Infra Partner",    tier:"GOLD",     src:null },
];
const ROW2 = [
  { name:"Media Partner",    tier:"SILVER",    src:null },
  { name:"Community Partner",tier:"COMMUNITY", src:null },
  { name:"Swag Partner",     tier:"SILVER",    src:null },
  { name:"Food Partner",     tier:"COMMUNITY", src:null },
  { name:"Campus Partner",   tier:"SILVER",    src:null },
  { name:"Travel Partner",   tier:"COMMUNITY", src:null },
];

const TIER_COLORS = {
  PLATINUM:"#E8E8FF", GOLD:"#FFE900", SILVER:"#C0C0C0", COMMUNITY:"#FF003C",
};

const STATS = [
  { val:"500+",  label:"Registered Teams", col:C.yellow },
  { val:"48H",   label:"Hack Window",       col:C.red    },
  { val:"₹10K+", label:"Prize Pool",        col:C.yellow },
  { val:"100%",  label:"Student-Led",       col:C.red    },
];
const WHY = [
  { icon:"◈", title:"TALENT PIPELINE",    body:"500+ engineers, designers and product builders — meet your next hires before anyone else does." },
  { icon:"◉", title:"48H BRAND EXPOSURE", body:"Non-stop competition means sustained visibility across screens, banners, swag and social feeds." },
  { icon:"◆", title:"STAGE PRESENCE",     body:"Your brand woven into opening ceremony, judging panel and prize announcements — not a dead logo wall." },
  { icon:"◇", title:"GEN-Z REACH",        body:"100% student-led. These are your next users and advocates. Meet them on their own turf." },
];

/* ════════════════════════════════════════
   AUDIO ENGINE (same as Committee)
════════════════════════════════════════ */
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
    const bufLen = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.04));
    const noise = ctx.createBufferSource(); noise.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=4000; bp.Q.value=0.8;
    const hs = ctx.createBiquadFilter(); hs.type="highshelf"; hs.frequency.value=3000; hs.gain.value=14;
    const gN = ctx.createGain(); gN.gain.setValueAtTime(1.4,now); gN.gain.exponentialRampToValueAtTime(0.001,now+dur);
    noise.connect(bp); bp.connect(hs); hs.connect(gN); gN.connect(ctx.destination);
    noise.start(now); noise.stop(now+dur);
    [0,0.03,0.07].forEach(off => {
      const osc = ctx.createOscillator(); osc.type="sawtooth";
      osc.frequency.setValueAtTime(180+Math.random()*120,now+off);
      osc.frequency.exponentialRampToValueAtTime(40,now+off+0.06);
      const gO = ctx.createGain(); gO.gain.setValueAtTime(0.5,now+off); gO.gain.exponentialRampToValueAtTime(0.001,now+off+0.06);
      const ws = ctx.createWaveShaper(); const cv = new Float32Array(256);
      for (let i=0;i<256;i++){const x=(i*2)/256-1; cv[i]=(Math.PI+400)*x/(Math.PI+400*Math.abs(x));}
      ws.curve=cv; osc.connect(ws); ws.connect(gO); gO.connect(ctx.destination);
      osc.start(now+off); osc.stop(now+off+0.07);
    });
    const thud = ctx.createOscillator(); thud.type="sine";
    thud.frequency.setValueAtTime(80,now); thud.frequency.exponentialRampToValueAtTime(20,now+0.1);
    const gT = ctx.createGain(); gT.gain.setValueAtTime(0.7,now); gT.gain.exponentialRampToValueAtTime(0.001,now+0.12);
    thud.connect(gT); gT.connect(ctx.destination); thud.start(now); thud.stop(now+0.12);
  } catch(e){}
}

function playTick() {
  if (globalMuted) return;
  try {
    const ctx = getAudioCtx(); const now = ctx.currentTime;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate*0.04), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.008));
    const src = ctx.createBufferSource(); src.buffer=buf;
    const bp = ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=3500+Math.random()*3000; bp.Q.value=1.2;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.7+Math.random()*0.3,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.04);
    src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(now); src.stop(now+0.04);
  } catch(e){}
}

/* ════════════════════════════════════════
   INJECT KEYFRAMES
════════════════════════════════════════ */
function injectStyles() {
  if (document.getElementById("sp3-styles")) return;
  const s = document.createElement("style");
  s.id = "sp3-styles";
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap');

    @keyframes scrollL  { from{transform:translateX(0)}    to{transform:translateX(-50%)} }
    @keyframes scrollR  { from{transform:translateX(-50%)} to{transform:translateX(0)}    }

    @keyframes spBlob   { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-30px) scale(1.06)} 70%{transform:translate(-20px,40px) scale(.96)} }
    @keyframes spPulse  { 0%,100%{opacity:1} 50%{opacity:.45} }

    /* frame scan sweep */
    @keyframes spScan   { 0%{top:-40%;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:130%;opacity:0} }

    /* scrolling scanlines */
    @keyframes spScanline { from{background-position:0 0} to{background-position:0 -6px} }

    /* FRAME JITTER */
    @keyframes spJitter {
      0%   { transform:translate(0,0)      skewX(0deg);    }
      25%  { transform:translate(-2px,1px)  skewX(-1deg);   }
      50%  { transform:translate(2px,-1px)  skewX(0.8deg);  }
      75%  { transform:translate(-1px,2px)  skewX(0deg);    }
      100% { transform:translate(0,0)      skewX(0deg);    }
    }

    /* ARC FLASH on frame enter */
    @keyframes spArcFlash {
      0%   { opacity:0; }
      6%   { opacity:.6; background:rgba(255,233,0,0.18); }
      16%  { opacity:.3; background:rgba(255,0,60,0.12);  }
      30%  { opacity:.1; }
      100% { opacity:0; }
    }

    /* BORDER ZAP */
    @keyframes spBorderZap {
      0%,100% { box-shadow:0 0 0 transparent; }
      20%     { box-shadow:0 0 18px rgba(255,233,0,0.4); }
      55%     { box-shadow:0 0 10px rgba(255,0,60,0.3);  }
    }

    /* HERO TITLE GLITCH */
    @keyframes spTitleJitter {
      0%   { transform:translate(0,0)      skewX(0deg);   }
      25%  { transform:translate(-3px,1px)  skewX(-1.2deg);}
      50%  { transform:translate(3px,-1px)  skewX(0.8deg); }
      75%  { transform:translate(-2px,2px)  skewX(0deg);   }
      100% { transform:translate(0,0)      skewX(0deg);   }
    }

    @keyframes dataCorrupt {
      0%   { transform:translate(0,0)      skewX(0deg)    scaleX(1);     }
      8%   { transform:translate(-4px,0)   skewX(-1.5deg) scaleX(1.006); }
      16%  { transform:translate(4px,1px)  skewX(1.2deg)  scaleX(0.994); }
      32%  { transform:translate(3px,-1px) skewX(-0.8deg) scaleX(0.997); }
      48%  { transform:translate(2px,0)    skewX(-1.2deg) scaleX(0.996); }
      56%  { transform:translate(-5px,1px) skewX(2deg)    scaleX(1.01);  }
      72%  { transform:translate(-2px,0)   skewX(0.6deg)  scaleX(1.003); }
      88%  { transform:translate(-4px,0)   skewX(1.5deg)  scaleX(1.006); }
      100% { transform:translate(0,0)      skewX(0deg)    scaleX(1);     }
    }
      8%   { transform:translate(-4px,0)   skewX(-1.5deg) scaleX(1.006); }
      16%  { transform:translate(4px,1px)  skewX(1.2deg)  scaleX(0.994); }
      32%  { transform:translate(3px,-1px) skewX(-0.8deg) scaleX(0.997); }
      48%  { transform:translate(2px,0)    skewX(-1.2deg) scaleX(0.996); }
      56%  { transform:translate(-5px,1px) skewX(2deg)    scaleX(1.01);  }
      72%  { transform:translate(-2px,0)   skewX(0.6deg)  scaleX(1.003); }
      88%  { transform:translate(-4px,0)   skewX(1.5deg)  scaleX(1.006); }
      100% { transform:translate(0,0)      skewX(0deg)    scaleX(1);     }
    }
    @keyframes spTitleGlitch {
      0%,88%,100%{ text-shadow:5px 0 0 #FF003C,-3px 0 0 rgba(0,220,255,.4); transform:skewX(0); }
      89%{ text-shadow:-8px 0 0 #FF003C,8px 0 0 rgba(0,220,255,.6); transform:skewX(-2.5deg); filter:brightness(1.5); }
      90%{ text-shadow:5px 0 0 #FF003C,-3px 0 0 rgba(0,220,255,.4); transform:skewX(0); filter:brightness(1); }
    }

    /* SECTION LABEL JITTER */
    @keyframes spLabelJitter {
      0%   { transform:translate(0,0)     skewX(0); }
      20%  { transform:translate(-2px,0)  skewX(-1deg); }
      40%  { transform:translate(2px,0)   skewX(0.8deg); }
      60%  { transform:translate(-1px,0)  skewX(0); }
      80%  { transform:translate(1px,0)   skewX(0.5deg); }
      100% { transform:translate(0,0)     skewX(0); }
    }

    /* CRT FLICKER on frame */
    @keyframes spCrtFlick {
      0%,100%{opacity:1} 91%{opacity:.93} 92%{opacity:.5} 93%{opacity:1} 97%{opacity:.8} 98%{opacity:1}
    }

    /* BRACKET DRAW */
    @keyframes spBracket {
      from{width:0;height:0;opacity:0}
      to  {width:20px;height:20px;opacity:1}
    }
  `;
  document.head.appendChild(s);
}

/* ════════════════════════════════════════
   GLITCHY SECTION LABEL (jitter + sound)
════════════════════════════════════════ */
function SectionLabel({ text, color, right }) {
  const [hov, setHov] = useState(false);
  const [jitter, setJitter] = useState(false);
  const tmr = useRef(null);

  useEffect(() => {
    if (!hov) { setJitter(false); clearTimeout(tmr.current); return; }
    const burst = () => {
      setJitter(true);
      playTick();
      setTimeout(() => setJitter(false), 60 + Math.random()*70);
      tmr.current = setTimeout(burst, 500 + Math.random()*1000);
    };
    tmr.current = setTimeout(burst, 80);
    return () => clearTimeout(tmr.current);
  }, [hov]);

  return (
      <div
          onMouseEnter={() => { setHov(true); playShock(); }}
          onMouseLeave={() => setHov(false)}
          style={{
            display:"inline-block",
            padding:"7px 20px",
            background: right ? "rgba(255,0,60,0.9)" : color === C.yellow ? C.yellow : "rgba(255,0,60,0.9)",
            color: right ? "#fff" : C.bg,
            fontFamily:'"Bebas Neue",cursive',
            fontSize:15, letterSpacing:".22em",
            clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)",
            cursor:"crosshair",
            animation: jitter ? "spLabelJitter .07s steps(1) infinite" : "none",
            textShadow: jitter ? `2px 0 0 #FF003C,-1px 0 0 rgba(0,200,255,.5)` : "none",
            transition:"text-shadow .05s",
            userSelect:"none",
          }}
      >
        {text}
      </div>
  );
}

/* ════════════════════════════════════════
   SPONSOR FRAME — bigger, with jitter + audio
════════════════════════════════════════ */
function SponsorFrame({ sponsor }) {
  const [hov,    setHov]    = useState(false);
  const [jitter, setJitter] = useState(false);
  const [arcOn,  setArcOn]  = useState(false);
  const tmr = useRef(null);
  const tc  = TIER_COLORS[sponsor.tier] || C.yellow;

  /* jitter bursts while hovering */
  useEffect(() => {
    if (!hov) { setJitter(false); clearTimeout(tmr.current); return; }
    const burst = () => {
      setJitter(true);
      playTick();
      setTimeout(() => setJitter(false), 60 + Math.random()*70);
      tmr.current = setTimeout(burst, 600 + Math.random()*1200);
    };
    tmr.current = setTimeout(burst, 300);
    return () => clearTimeout(tmr.current);
  }, [hov]);

  const handleEnter = () => {
    setHov(true);
    setArcOn(true);
    playShock();
    setTimeout(() => setArcOn(false), 380);
  };

  return (
      <div
          onMouseEnter={handleEnter}
          onMouseLeave={() => setHov(false)}
          style={{
            position:"relative",
            flexShrink:0,
            /* BIGGER SIZE */
            width:"clamp(160px,42vw,290px)",
            height:"clamp(120px,30vw,210px)",
            background:C.card,
            clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
            border:`1px solid ${hov ? tc+"90" : tc+"22"}`,
            overflow:"hidden",
            transition:"border-color .25s",
            cursor:"crosshair",
            animation: jitter
                ? "spJitter .07s steps(1) infinite"
                : hov ? "spCrtFlick 4s steps(1) infinite, spBorderZap .5s steps(1)" : "none",
          }}
      >
        {/* ARC FLASH */}
        {arcOn && (
            <div style={{ position:"absolute",inset:0,zIndex:20,pointerEvents:"none", animation:"spArcFlash .38s ease-out forwards" }}/>
        )}

        {/* SCAN SWEEP */}
        {hov && (
            <div style={{
              position:"absolute",left:0,right:0,top:"-40%",height:"40%",pointerEvents:"none",zIndex:3,
              background:`linear-gradient(180deg,transparent,${tc}40 50%,transparent)`,
              animation:"spScan .9s linear infinite",
            }}/>
        )}

        {/* SCANLINES */}
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",zIndex:2,
          background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.28) 2px,rgba(0,0,0,.28) 3px)",
          animation: hov ? "spScanline .1s linear infinite" : "none",
          opacity:.65,
        }}/>

        {/* LOGO / PLACEHOLDER */}
        {sponsor.src ? (
            <img src={sponsor.src} alt={sponsor.name}
                 style={{
                   position:"absolute",inset:0,width:"100%",height:"100%",
                   objectFit:"contain",padding:"24px",
                   filter: hov ? "none" : "grayscale(100%) brightness(.55)",
                   transition:"filter .5s",
                 }}
            />
        ) : (
            <div style={{
              position:"absolute",inset:0,
              display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",gap:10,
              background:`linear-gradient(145deg,${C.bg},${tc}08)`,
            }}>
              {/* placeholder logo box */}
              <div style={{
                width:"58%",height:"42%",
                border:`1px dashed ${hov ? tc+"70" : tc+"28"}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"border-color .3s",
              }}>
            <span style={{
              fontFamily:'"Bebas Neue",cursive',
              fontSize:"clamp(16px,2.5vw,22px)",
              color: hov ? tc : `${tc}35`,
              letterSpacing:".08em",
              textShadow: hov ? `0 0 14px ${tc}` : "none",
              transition:"color .3s,text-shadow .3s",
              textAlign:"center",lineHeight:1.1,
              /* name text glitches on jitter */
              ...(jitter ? { color:tc, textShadow:`0 0 10px ${tc},2px 0 0 #FF003C` } : {}),
            }}>
              {sponsor.name.split(" ")[0]}<br/>
              <span style={{fontSize:"58%",letterSpacing:".14em",opacity:.8}}>
                {sponsor.name.split(" ").slice(1).join(" ")}
              </span>
            </span>
              </div>
              <span style={{
                fontFamily:'"Share Tech Mono",monospace',
                fontSize:"7px",letterSpacing:".22em",
                color: hov ? `${tc}70` : `${tc}28`,
                transition:"color .3s",
              }}>LOGO PENDING</span>
            </div>
        )}

        {/* BOTTOM STRIP */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,padding:"7px 12px",
          background:`linear-gradient(to top,${C.bg}F5,transparent)`,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          zIndex:4,
        }}>
        <span style={{
          fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",
          letterSpacing:".14em",
          color: hov ? tc : `${tc}55`,
          transition:"color .3s",
          textShadow: jitter ? `0 0 6px ${tc}` : "none",
        }}>{sponsor.name.toUpperCase()}</span>
          <span style={{
            fontFamily:'"Share Tech Mono",monospace',fontSize:"6px",
            letterSpacing:".16em",color:`${tc}65`,
            border:`1px solid ${tc}25`,padding:"1px 6px",
          }}>{sponsor.tier}</span>
        </div>

        {/* INDEX TAG */}
        <div style={{
          position:"absolute",top:8,left:10,zIndex:5,
          fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",
          color: hov ? tc : `${tc}40`,
          letterSpacing:".16em",transition:"color .3s",
          textShadow: hov ? `0 0 6px ${tc}` : "none",
        }}>◈</div>

        {/* 4 CORNER BRACKETS */}
        {hov && <>
          <div style={{position:"absolute",top:4,left:4,borderTop:`2px solid ${tc}`,borderLeft:`2px solid ${tc}`,animation:"spBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
          <div style={{position:"absolute",bottom:4,right:4,borderBottom:`2px solid #FF003C`,borderRight:`2px solid #FF003C`,animation:"spBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
          <div style={{position:"absolute",top:4,right:4,width:12,height:12,borderTop:`1px solid ${tc}50`,borderRight:`1px solid ${tc}50`,animation:"spBracket .18s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
          <div style={{position:"absolute",bottom:4,left:4,width:12,height:12,borderBottom:`1px solid #FF003C50`,borderLeft:`1px solid #FF003C50`,animation:"spBracket .18s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
        </>}

        {hov && <div style={{position:"absolute",inset:0,pointerEvents:"none",boxShadow:`inset 0 0 28px ${tc}18`,zIndex:9}}/>}
      </div>
  );
}

/* ════════════════════════════════════════
   MARQUEE ROW
════════════════════════════════════════ */
function SponsorRow({ sponsors, direction, speed }) {
  const doubled = [...sponsors, ...sponsors, ...sponsors, ...sponsors];
  return (
      <div style={{overflow:"hidden",width:"100%",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,bottom:0,width:100,background:`linear-gradient(90deg,${C.bg},transparent)`,zIndex:10,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:100,background:`linear-gradient(270deg,${C.bg},transparent)`,zIndex:10,pointerEvents:"none"}}/>
        <div style={{
          display:"flex",gap:6,width:"max-content",padding:"8px 0",
          animation:`${direction==="left"?"scrollL":"scrollR"} ${speed}s linear infinite`,
        }}>
          {doubled.map((sp,i) => <SponsorFrame key={`${sp.name}-${i}`} sponsor={sp}/>)}
        </div>
      </div>
  );
}

/* ════════════════════════════════════════
   MUTE BUTTON
════════════════════════════════════════ */
function MuteButton() {
  const [muted, setMuted] = useState(false);
  const toggle = () => { globalMuted = !muted; setMuted(!muted); };
  return (
      <button onClick={toggle} style={{
        position:"fixed",bottom:90,left:24,zIndex:9980,
        fontFamily:'"Share Tech Mono",monospace',fontSize:"9px",letterSpacing:".2em",
        padding:"7px 14px",
        background: muted ? "rgba(255,0,60,0.15)" : "rgba(255,233,0,0.1)",
        color: muted ? "#FF003C" : "#FFE900",
        border:`1px solid ${muted ? "#FF003C50" : "#FFE90050"}`,
        cursor:"crosshair",
        clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
        transition:"all .2s",
      }}>{muted ? "◼ SFX OFF" : "◉ SFX ON"}</button>
  );
}

/* ════════════════════════════════════════
   MAIN
════════════════════════════════════════ */
export default function Sponsors() {
  const [titleJitter, setTitleJitter] = React.useState(false);
  const titleTmr = React.useRef(null);
  React.useEffect(() => {
    const burst = () => {
      setTitleJitter(true);
      playTick();
      setTimeout(() => setTitleJitter(false), 80 + Math.random()*60);
      titleTmr.current = setTimeout(burst, 2000 + Math.random()*3000);
    };
    titleTmr.current = setTimeout(burst, 1200);
    return () => clearTimeout(titleTmr.current);
  }, []);
  useEffect(() => { injectStyles(); }, []);
  useEffect(() => {
    const unlock = () => {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);
  const [form, setForm] = useState({ name:"", org:"", email:"", tier:"GOLD" });
  const [sent, setSent] = useState(false);

  return (
      <div className={cpStyles.cpPage} style={{
        background:C.bg,minHeight:"100vh",
        fontFamily:'"Share Tech Mono",monospace',
        position:"relative",overflow:"hidden",paddingBottom:100,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap" rel="stylesheet"/>

        {/* TOP STRIPE */}
        <div style={{position:"fixed",top:0,left:0,right:0,height:4,background:"repeating-linear-gradient(90deg,#FFE900 0,#FFE900 20px,#060604 20px,#060604 40px)",zIndex:9990,pointerEvents:"none"}}/>
        {/* SCANLINES */}
        <div style={{position:"fixed",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,233,0,.01) 3px,rgba(255,233,0,.01) 4px)",pointerEvents:"none",zIndex:1}}/>
        {/* BLOBS */}
        <div style={{position:"fixed",top:-200,left:-200,width:700,height:700,background:C.yellow,borderRadius:"50%",filter:"blur(200px)",opacity:.022,pointerEvents:"none",animation:"spBlob 14s ease-in-out infinite"}}/>
        <div style={{position:"fixed",bottom:-150,right:-150,width:600,height:600,background:C.red,borderRadius:"50%",filter:"blur(180px)",opacity:.028,pointerEvents:"none",animation:"spBlob 18s ease-in-out infinite reverse"}}/>

        <CyberpunkCursor/><MuteButton/>

        <div style={{position:"relative",zIndex:2}}>

          {/* ══════ HERO ══════ */}
          <div style={{padding:"clamp(60px,9vw,100px) clamp(16px,5vw,60px) 48px"}}>
            <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.9}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
                <div style={{width:36,height:1,background:C.red}}/>
                <span style={{fontSize:9,letterSpacing:".38em",color:C.red}}>SYMBIHACK 2026 — PARTNERSHIP DECK</span>
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.red}60,transparent)`}}/>
              </div>

              <h1 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(58px,13vw,148px)",lineHeight:.82,margin:"0 0 4px",letterSpacing:".02em",color:C.yellow,textShadow:`4px 4px 0px ${C.red}`,WebkitTextStroke:"0px transparent",animation:"none"}}>POWER</h1>
              <h1 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(58px,13vw,148px)",lineHeight:.82,margin:"0 0 24px",letterSpacing:".02em",color:"transparent",WebkitTextStroke:`3px ${C.red}`,animation:"none",marginLeft:"clamp(16px,4vw,72px)"}} className={cpStyles.outlineText}>THE BUILD</h1>

              <p style={{
                fontFamily:'"Barlow Condensed",sans-serif',
                fontSize:"clamp(14px,1.8vw,18px)",
                color:C.dimLt,lineHeight:1.8,maxWidth:520,
                borderLeft:`3px solid rgba(255,233,0,0.2)`,paddingLeft:16,marginBottom:36,
              }}>
                SymbiHackathon 2026 — 500+ builders, 48 hours, ₹10,000+ in prizes.
                Your brand lives inside that story. Not on the sidelines.
              </p>

              {/* STATS */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:2}}>
                {STATS.map(({val,label,col},i) => (
                    <motion.div key={label}
                                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:.1+i*.07}}
                                style={{background:C.card,padding:"18px 18px",borderTop:`3px solid ${col}`,position:"relative",overflow:"hidden"}}
                    >
                      <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(32px,5vw,48px)",color:col,lineHeight:1,textShadow:`0 0 22px ${col}55`,animation:"spPulse 3s ease-in-out infinite"}}>{val}</div>
                      <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".2em",color:C.dimLt,marginTop:4}}>{label}</div>
                      <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${col},transparent)`,opacity:.3}}/>
                    </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ══════ SPONSOR ROWS ══════ */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6,delay:.3}}>
            <div style={{display:"flex",alignItems:"center",gap:0,padding:"0 clamp(16px,5vw,60px)",marginBottom:18}}>
              <SectionLabel text="OUR SPONSORS" color={C.yellow}/>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.yellow}70,transparent)`,marginLeft:2}}/>
              <span style={{fontSize:8,letterSpacing:".22em",color:C.dim,marginRight:4}}>HOVER TO REVEAL</span>
            </div>

            {/* ROW 1 — LEFT */}
            <div style={{marginBottom:6}}>
              <SponsorRow sponsors={ROW1} direction="left" speed={32}/>
            </div>

            {/* ROW 2 — RIGHT */}
            <div style={{marginBottom:40}}>
              <SponsorRow sponsors={ROW2} direction="right" speed={26}/>
            </div>

            {/* TIER LEGEND */}
            <div style={{
              display:"flex",flexWrap:"wrap",alignItems:"center",gap:20,
              padding:"12px clamp(16px,5vw,60px)",
              borderTop:`1px solid rgba(255,233,0,0.07)`,
              borderBottom:`1px solid rgba(255,233,0,0.07)`,
              marginBottom:48,
            }}>
              <span style={{fontSize:8,letterSpacing:".25em",color:C.dim}}>// TIER KEY</span>
              {Object.entries(TIER_COLORS).map(([tier,col]) => (
                  <div key={tier} style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:7,height:7,background:col,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",boxShadow:`0 0 5px ${col}`}}/>
                    <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:C.dimLt,letterSpacing:".12em"}}>{tier}</span>
                  </div>
              ))}
              <div style={{marginLeft:"auto",fontFamily:'"Bebas Neue",cursive',fontSize:13,color:C.dim,letterSpacing:".18em"}}>SYMBIHACKATHON 2026</div>
            </div>
          </motion.div>

          {/* ══════ WHY SPONSOR ══════ */}
          <div style={{padding:"0 clamp(16px,5vw,60px) 56px"}}>
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.4}}>
              <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:24}}>
                <SectionLabel text="WHY SPONSOR" color={C.red} right/>
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.red}70,transparent)`,marginLeft:2}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:3}}>
                {WHY.map((item,i) => (
                    <motion.div key={item.title}
                                initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:.4+i*.07}}
                                style={{
                                  background:C.card,
                                  border:`1px solid rgba(255,233,0,0.07)`,
                                  borderLeft:`3px solid ${i%2===0?C.yellow:C.red}`,
                                  padding:"22px 20px",
                                  clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)",
                                }}
                    >
                      <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:26,color:i%2===0?C.yellow:C.red,marginBottom:8}}>{item.icon}</div>
                      <h3 style={{fontFamily:'"Bebas Neue",cursive',fontSize:20,color:C.text,letterSpacing:".1em",marginBottom:8}}>{item.title}</h3>
                      <p style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:14,color:C.dimLt,lineHeight:1.7}}>{item.body}</p>
                    </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ══════ CONTACT FORM ══════ */}
          <div style={{padding:"0 clamp(16px,5vw,60px) 60px"}}>
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.5}}>
              <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:24}}>
                <SectionLabel text="BECOME A PARTNER" color={C.yellow}/>
                <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.yellow}50,transparent)`,marginLeft:2}}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(280px,100%),1fr))",gap:3,alignItems:"start"}}>
                {/* FORM */}
                <div style={{background:C.card,border:`1px solid rgba(255,233,0,0.1)`,padding:"28px 24px",clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)"}}>
                  {sent ? (
                      <div style={{textAlign:"center",padding:"36px 0"}}>
                        <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:44,color:C.yellow,textShadow:`0 0 24px ${C.yellow}60`,marginBottom:10}}>TRANSMISSION SENT</div>
                        <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:9,color:C.dimLt,letterSpacing:".2em"}}>WE'LL REACH OUT WITHIN 48 HOURS</div>
                      </div>
                  ) : (
                      <form onSubmit={e=>{e.preventDefault();setSent(true);}} style={{display:"flex",flexDirection:"column",gap:12}}>
                        <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:6}}>// INITIATE PARTNERSHIP</div>
                        {[
                          {key:"name", ph:"CONTACT NAME",         type:"text"},
                          {key:"org",  ph:"ORGANISATION / BRAND",  type:"text"},
                          {key:"email",ph:"EMAIL ADDRESS",         type:"email"},
                        ].map(({key,ph,type}) => (
                            <input key={key} type={type} placeholder={ph} required
                                   value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                                   style={{background:"rgba(255,233,0,0.04)",border:`1px solid rgba(255,233,0,0.15)`,color:C.text,padding:"11px 13px",fontFamily:'"Share Tech Mono",monospace',fontSize:10,letterSpacing:".1em",outline:"none",width:"100%",clipPath:"polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)"}}
                            />
                        ))}
                        <select value={form.tier} onChange={e=>setForm(p=>({...p,tier:e.target.value}))}
                                style={{background:"#0D0B07",border:`1px solid rgba(255,233,0,0.15)`,color:C.text,padding:"11px 13px",fontFamily:'"Share Tech Mono",monospace',fontSize:10,letterSpacing:".1em",outline:"none",width:"100%",clipPath:"polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)"}}
                        >
                          {Object.keys(TIER_COLORS).map(t=><option key={t} value={t} style={{background:C.card}}>{t} TIER</option>)}
                        </select>
                        <button type="submit" className="glitch-btn" data-text="SEND PARTNERSHIP REQUEST" style={{background:C.yellow,color:C.bg,fontFamily:'"Bebas Neue",cursive',fontSize:17,letterSpacing:".2em",padding:"13px 24px",border:"none",cursor:"pointer",marginTop:4,clipPath:"polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)"}}>
                          SEND PARTNERSHIP REQUEST
                        </button>
                      </form>
                  )}
                </div>

                {/* RIGHT INFO */}
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <div style={{background:C.card,borderLeft:`3px solid ${C.yellow}`,border:`1px solid rgba(255,233,0,0.08)`,padding:"20px 20px"}}>
                    <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:12}}>// DIRECT CONTACT</div>
                    {[
                      {label:"EMAIL",val:"sponsors@symbihackathon.in"},
                      {label:"PHONE",val:"+91 XXXXX XXXXX"},
                      {label:"REPLY",val:"Within 48 hours"},
                    ].map(({label,val})=>(
                        <div key={label} style={{display:"flex",gap:12,marginBottom:8,alignItems:"flex-start"}}>
                          <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:C.dimLt,letterSpacing:".2em",minWidth:60,paddingTop:2}}>{label}</span>
                          <span style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:14,color:C.text}}>{val}</span>
                        </div>
                    ))}
                  </div>
                  <div style={{background:C.card,borderLeft:`3px solid ${C.red}`,border:`1px solid rgba(255,0,60,0.1)`,padding:"20px 20px"}}>
                    <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:12}}>// EVENT FACTS</div>
                    {["500+ registrations expected","48-hour non-stop hackathon","Live judging panel","Multi-domain tracks","Campus-wide coverage"].map((f,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                          <div style={{width:4,height:4,background:C.red,flexShrink:0}}/>
                          <span style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:13,color:C.dimLt}}>{f}</span>
                        </div>
                    ))}
                  </div>
                  <div style={{background:`linear-gradient(135deg,rgba(255,233,0,0.06),rgba(255,0,60,0.04))`,border:`1px solid rgba(255,233,0,0.2)`,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)"}}>
                    <div style={{width:9,height:9,background:C.yellow,animation:"spPulse 1.5s ease-in-out infinite",boxShadow:`0 0 12px ${C.yellow}`,flexShrink:0}}/>
                    <div>
                      <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:17,color:C.yellow,letterSpacing:".1em"}}>SLOTS FILLING FAST</div>
                      <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:C.dimLt,letterSpacing:".16em",marginTop:2}}>PLATINUM — 2 SLOTS ONLY</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
        <HackathonNav/>
      </div>
  );
}