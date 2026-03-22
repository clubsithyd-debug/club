import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slateMembers, organizingCommittee } from "../../data/hackathonData";
import HackathonNav from "./HackathonNav";
import CyberpunkCursor from "../../components/CyberpunkCursor";

const C = {
  bg:"#060604", card:"#0D0B07", yellow:"#FFE900",
  red:"#FF003C", chrome:"#C0C0C0", dim:"#3A3224",
  dimLt:"#5A5030", text:"#D4C99A",
};
const TEAM_COLORS = ["#FFE900","#FF003C","#00E5FF","#B8A800"];
const ROLE_COLORS = {
  "Lead":"#FFE900","Co-Lead":"#FF003C","SPOC":"#C0C0C0","Member":"#3A3224",
  "Chairperson":"#FFE900","Vice Chairperson":"#FF003C","Treasurer":"#C0C0C0",
  "Secretary":"#4A6080","Faculty In-Charge":"#806040",
  "Content Developer":"#408060","Executive Member":"#604080",
};
const getRoleColor = r => ROLE_COLORS[r] || "#5A5030";
const normalizeTeam = n => n.trim().toUpperCase() === "TECHNICAL" ? "WEB N' TECH" : n
const sortTeams = teams => {
  const order = ["WEB N' TECH","LOGISTICS","PR & DESIGN","SPONSORSHIP"]
  return [...teams].sort((a,b) => {
    const ai = order.indexOf(a.team); const bi = order.indexOf(b.team)
    return (ai===-1?99:ai) - (bi===-1?99:bi)
  })
};

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
    const buf = ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.04),ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.008));
    const src = ctx.createBufferSource(); src.buffer=buf;
    const bp = ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=3500+Math.random()*3000; bp.Q.value=1.2;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.7+Math.random()*0.3,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.04);
    src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(now); src.stop(now+0.04);
  } catch(e){}
}

/* ── INJECT KEYFRAMES ── */
function injectStyles() {
  if (document.getElementById("cp4-styles")) return;
  const s = document.createElement("style");
  s.id = "cp4-styles";
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap');

    @keyframes cpJitter {
      0%   { transform: translate(0,0)     skewX(0deg); }
      25%  { transform: translate(-2px,1px) skewX(-1deg); }
      50%  { transform: translate(2px,-1px) skewX(0.8deg); }
      75%  { transform: translate(-1px,2px) skewX(0deg); }
      100% { transform: translate(0,0)     skewX(0deg); }
    }
      11%  { transform: translate(-5px,2px)   skewX(-2.5deg)  scaleX(1.008); }
      22%  { transform: translate(5px,-3px)   skewX(2deg)     scaleX(0.993); }
      33%  { transform: translate(-3px,5px)   skewX(0deg)     scaleX(1.01);  }
      44%  { transform: translate(6px,-2px)   skewX(2.8deg)   scaleX(0.99);  }
      55%  { transform: translate(-5px,1px)   skewX(-2.2deg)  scaleX(1.007); }
      66%  { transform: translate(4px,4px)    skewX(1.5deg)   scaleX(0.996); }
      77%  { transform: translate(-3px,-5px)  skewX(-1deg)    scaleX(1.005); }
      88%  { transform: translate(5px,2px)    skewX(2deg)     scaleX(0.994); }
      100% { transform: translate(0,0)       skewX(0deg)     scaleX(1);     }
    }

    @keyframes cpRgbR {
      0%,100% { transform: translate(3px,0);  opacity:.12; }
      50%     { transform: translate(-3px,0); opacity:.08; }
    }
      14%  { transform: translate(-7px,2px)  scaleX(0.991); opacity:.24; }
      28%  { transform: translate(9px,-1px)  scaleX(1.015); opacity:.35; }
      42%  { transform: translate(-6px,3px)  scaleX(0.988); opacity:.22; }
      57%  { transform: translate(8px,0)     scaleX(1.01);  opacity:.30; }
      71%  { transform: translate(-5px,-2px) scaleX(0.994); opacity:.20; }
      85%  { transform: translate(6px,1px)   scaleX(1.008); opacity:.28; }
      100% { transform: translate(7px,0)     scaleX(1.012); opacity:.32; }
    }

    @keyframes cpRgbC {
      0%,100% { transform: translate(-3px,0); opacity:.10; }
      50%     { transform: translate(3px,0);  opacity:.07; }
    }
      20%  { transform: translate(7px,-2px)  scaleX(1.011); opacity:.20; }
      40%  { transform: translate(-8px,2px)  scaleX(0.987); opacity:.28; }
      60%  { transform: translate(6px,1px)   scaleX(1.008); opacity:.18; }
      80%  { transform: translate(-5px,-1px) scaleX(0.993); opacity:.24; }
      100% { transform: translate(-6px,0)    scaleX(0.990); opacity:.26; }
    }

    
      25%  { transform: translate(2px,6px); opacity:.20; }
      50%  { transform: translate(-2px,-4px); opacity:.12; }
      75%  { transform: translate(1px,5px); opacity:.18; }
      100% { transform: translate(0,-5px);  opacity:.14; }
    }

    @keyframes cpSlice1 {
      0%,100% { clip-path:inset(0 0 99% 0);  transform:translate(-4px,0); }
      33%     { clip-path:inset(30% 0 50% 0); transform:translate(4px,0); }
      66%     { clip-path:inset(65% 0 15% 0); transform:translate(-3px,0); }
    }
      12%     { clip-path:inset(14% 0 66% 0);  transform:translate(9px,0);   }
      25%     { clip-path:inset(52% 0 26% 0);  transform:translate(-7px,0);  }
      37%     { clip-path:inset(7%  0 78% 0);  transform:translate(11px,0);  }
      50%     { clip-path:inset(68% 0 8%  0);  transform:translate(-6px,0);  }
      62%     { clip-path:inset(32% 0 48% 0);  transform:translate(8px,0);   }
      75%     { clip-path:inset(85% 0 2%  0);  transform:translate(-5px,0);  }
      87%     { clip-path:inset(20% 0 60% 0);  transform:translate(10px,0);  }
    }

    
      18%     { clip-path:inset(38% 0 36% 0);  transform:translate(-8px,0);             }
      36%     { clip-path:inset(72% 0 6%  0);  transform:translate(7px,0);              }
      54%     { clip-path:inset(18% 0 62% 0);  transform:translate(-9px,0);             }
      72%     { clip-path:inset(56% 0 22% 0);  transform:translate(6px,0);              }
      90%     { clip-path:inset(88% 0 1%  0);  transform:translate(-5px,0);             }
    }

    
      10%     { clip-path:inset(44% 0 55%  0);  transform:translate(12px,0);              }
      20%     { clip-path:inset(91% 0 0.5% 0);  transform:translate(-10px,0);             }
      30%     { clip-path:inset(22% 0 77%  0);  transform:translate(10px,0);              }
      40%     { clip-path:inset(63% 0 36%  0);  transform:translate(-8px,0);              }
      50%     { clip-path:inset(5%  0 94%  0);  transform:translate(9px,0);               }
      60%     { clip-path:inset(77% 0 22%  0);  transform:translate(-11px,0);             }
      70%     { clip-path:inset(35% 0 64%  0);  transform:translate(11px,0);              }
      80%     { clip-path:inset(50% 0 49%  0);  transform:translate(-7px,0);              }
      90%     { clip-path:inset(95% 0 0%   0);  transform:translate(8px,0);               }
    }

    
      20%     { clip-path:inset(0 0 0 76%);   transform:translate(0,9px);               }
      40%     { clip-path:inset(0 58% 0 0);   transform:translate(0,-5px);              }
      60%     { clip-path:inset(0 0 0 42%);   transform:translate(0,7px);               }
      80%     { clip-path:inset(0 82% 0 0);   transform:translate(0,-4px);              }
    }

    @keyframes cpPixelBreak {
      0%,90%,100% { opacity:0; }
      91% { opacity:1; transform:translate(-5px,0) scaleY(0.5); }
      94% { opacity:1; transform:translate(5px,0)  scaleY(1.6); }
      97% { opacity:1; transform:translate(0,0)    scaleY(1);   }
    }
      83% { opacity:1; transform:translate(-12px,0) scaleY(0.2) scaleX(1.08); }
      85% { opacity:1; transform:translate(12px,0)  scaleY(3.5) scaleX(0.92); }
      87% { opacity:1; transform:translate(-8px,0)  scaleY(0.5) scaleX(1.04); }
      89% { opacity:1; transform:translate(6px,0)   scaleY(2.2) scaleX(0.96); }
      91% { opacity:1; transform:translate(-3px,0)  scaleY(0.8) scaleX(1.01); }
      93% { opacity:1; transform:translate(0,0)     scaleY(1)   scaleX(1);    }
    }

    @keyframes cpArcFlash {
      0%   { opacity:0; }
      8%   { opacity:.5; background:rgba(255,233,0,0.12); }
      25%  { opacity:.15; }
      100% { opacity:0; }
    }
      5%   { opacity:1;  background:rgba(255,233,0,0.28); }
      12%  { opacity:.8; background:rgba(255,0,60,0.18);  }
      20%  { opacity:1;  background:rgba(255,233,0,0.22); }
      30%  { opacity:.5; background:rgba(0,200,255,0.12); }
      45%  { opacity:.2; }
      100% { opacity:0; }
    }

    @keyframes cpBorderZap {
      0%,100% { box-shadow:0 0 0 transparent; }
      20%     { box-shadow:0 0 10px #FFE900; }
      60%     { box-shadow:0 0 6px #FF003C; }
    }
      8%  { box-shadow:0 0 28px #FFE900, inset 0 0 20px rgba(255,233,0,0.22); }
      22% { box-shadow:0 0 12px #FF003C; }
      45% { box-shadow:0 0 32px #FFE900, inset 0 0 14px rgba(255,233,0,0.15); }
      65% { box-shadow:0 0 10px #FF003C; }
      82% { box-shadow:0 0 20px #FFE900; }
    }

    @keyframes cpScanFast {
      0%   { top:-40%; opacity:0; }
      5%   { opacity:1; }
      95%  { opacity:1; }
      100% { top:130%; opacity:0; }
    }

    
      8%   { opacity:.5; }
      92%  { opacity:.5; }
      100% { top:150%; opacity:0; }
    }

    @keyframes cpScanlineScroll {
      from { background-position:0 0; }
      to   { background-position:0 -6px; }
    }

    @keyframes cpNoiseShift {
      0%   { background-position:0 0;      }
      11%  { background-position:-9% -15%; }
      22%  { background-position:13% 7%;   }
      33%  { background-position:-20% 22%; }
      44%  { background-position:9% -24%;  }
      55%  { background-position:-15% 14%; }
      66%  { background-position:22% -9%;  }
      77%  { background-position:-7% 19%;  }
      88%  { background-position:18% -17%; }
      100% { background-position:0 0;      }
    }

    @keyframes cpCrtFlick {
      0%,100% { opacity:1;   }
      91%     { opacity:.93; }
      92%     { opacity:.48; }
      93%     { opacity:1;   }
      96%     { opacity:.78; }
      97%     { opacity:1;   }
    }

    @keyframes cpBracket {
      from { width:0; height:0; opacity:0; }
      to   { width:22px; height:22px; opacity:1; }
    }

    @keyframes cpTitleGlitch {
      0%,87%,100% {
        text-shadow:7px 0 0 #FF003C,-4px 0 0 rgba(0,220,255,.45);
        transform:skewX(0deg);
      }
      88% { text-shadow:-12px 0 0 #FF003C,12px 0 0 rgba(0,220,255,.7); transform:skewX(-3.5deg); filter:brightness(1.6); }
      89% { text-shadow:9px 0 0 #FF003C,-9px 0 0 rgba(255,233,0,.65); transform:skewX(2.5deg); }
      90% { text-shadow:-5px 0 0 #FF003C,5px 0 0 rgba(0,220,255,.3); transform:skewX(0); filter:brightness(1); }
      93% { letter-spacing:.08em; }
      94% { letter-spacing:.025em; }
    }

    @keyframes blobFloat {
      0%,100% { transform:translate(0,0) scale(1); }
      40%     { transform:translate(50px,-40px) scale(1.08); }
      70%     { transform:translate(-30px,50px) scale(.94); }
    }

    @keyframes cpStatPulse { 0%,100%{opacity:1} 50%{opacity:.55} }
  `;
  document.head.appendChild(s);
}

/* ═══════════════════════
   MEMBER CARD
═══════════════════════ */
function MemberCard({ member, index, accent, isSlate = false }) {
  const [hov,    setHov]    = useState(false);
  const [jitter, setJitter] = useState(false);
  const [arcOn,  setArcOn]  = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const tmr = useRef(null);
  const rc  = getRoleColor(member.role);
  const hasPhoto = member.image && !imgErr;
  const ini = member.name === "Coming Soon"
      ? "???" : member.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  useEffect(() => {
    if (!hov) { setJitter(false); clearTimeout(tmr.current); return; }
    const burst = () => {
      setJitter(true);
      playTick();
      setTimeout(() => setJitter(false), 60 + Math.random()*80);
      tmr.current = setTimeout(burst, 800 + Math.random()*1400);
    };
    tmr.current = setTimeout(burst, 400);
    return () => clearTimeout(tmr.current);
  }, [hov]);

  const handleEnter = () => {
    setHov(true);
    setArcOn(true);
    playShock();
    setTimeout(() => setArcOn(false), 400);
  };

  return (
      <motion.div
          initial={{ opacity:0, scale:.93 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:.4, delay:index*.04 }}
          onMouseEnter={handleEnter}
          onMouseLeave={() => setHov(false)}
          style={{
            position:"relative",
            background:C.card,
            clipPath:"polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
            overflow:"hidden",
            cursor:"crosshair",
            aspectRatio:"3/4",
            border:`1px solid ${hov ? accent+"75" : "rgba(255,233,0,0.07)"}`,
            transition:"border-color .2s",
            animation: jitter
                ? "cpJitter .06s steps(1) infinite"
                : hov ? "cpCrtFlick 4s steps(1) infinite, cpBorderZap .45s steps(1)" : "none",
          }}
      >
        {/* ARC FLASH */}
        {arcOn && (
            <div style={{position:"absolute",inset:0,zIndex:30,pointerEvents:"none",
              animation:"cpArcFlash .4s ease-out forwards"}}/>
        )}

        <div style={{position:"absolute",inset:0}}>
          {hasPhoto ? (
              <>
                {/* BASE */}
                <img src={member.image} alt={member.name} onError={()=>setImgErr(true)}
                     style={{
                       position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",
                       filter: hov ? "grayscale(0%) contrast(1) brightness(1)" : "grayscale(100%) contrast(1.1) brightness(0.75)",
                       transition:"filter .6s",
                     }}
                />
                {/* ══ 8-LAYER GLITCH STACK ══ */}
                {hov && <>
                  >
                  >
                  >
                  >
                  >
                  >
                  >
                  >
                </>}
              </>
          ) : (
              <div style={{
                position:"absolute",inset:0,
                background:`linear-gradient(145deg,${C.bg} 0%,${accent}0A 100%)`,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,
              }}>
                <div style={{
                  fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(36px,6vw,56px)",
                  color:accent,opacity: hov ? .9 : .22,letterSpacing:".1em",
                  textShadow: hov ? `0 0 28px ${accent},0 0 55px ${accent}60` : "none",
                  transition:"opacity .3s,text-shadow .3s",
                  animation: hov ? "cpCrtFlick 3s steps(1) infinite" : "none",
                }}>{ini}</div>
                <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:"6px",letterSpacing:".25em",color:C.dim}}>PHOTO PENDING</div>
              </div>
          )}

          {/* DUAL SCAN SWEEPS */}
          {hov && <>
            <div style={{
              position:"absolute",left:0,right:0,top:"-40%",height:"40%",
              background:`linear-gradient(180deg,transparent 0%,${accent}50 46%,${accent}75 50%,${accent}50 54%,transparent 100%)`,
              animation:"cpScanFast .75s linear infinite",pointerEvents:"none",
            }}/>
            <div style={{
              position:"absolute",left:0,right:0,top:"-70%",height:"60%",
              background:`linear-gradient(180deg,transparent 0%,${accent}18 42%,${accent}28 50%,${accent}18 58%,transparent 100%)`,
              animation:"",pointerEvents:"none",
            }}/>
          </>}

          {/* SCANLINES */}
          <div style={{
            position:"absolute",inset:0,pointerEvents:"none",
            background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.32) 2px,rgba(0,0,0,.32) 3px)",
            animation: hov ? "cpScanlineScroll .08s linear infinite" : "none",
            opacity:.75,
          }}/>

          {/* NOISE */}
          <div style={{
            position:"absolute",inset:0,pointerEvents:"none",
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize:"140px 140px",mixBlendMode:"overlay",
            opacity: hov ? .55 : .12,
            animation: hov ? "cpNoiseShift .14s steps(1) infinite" : "none",
            transition:"opacity .3s",
          }}/>

          {/* VIGNETTE */}
          <div style={{
            position:"absolute",bottom:0,left:0,right:0,height:"65%",pointerEvents:"none",
            background:`linear-gradient(to top,${C.bg}FA 0%,${C.bg}92 28%,transparent 100%)`,
          }}/>

          {/* DIAGONAL STAMP */}
          <div style={{
            position:"absolute",top:12,right:-26,
            background:`${rc}22`,border:`1px solid ${rc}55`,
            fontFamily:'"Share Tech Mono",monospace',fontSize:"6px",letterSpacing:".2em",color:rc,
            padding:"2px 30px",transform:"rotate(38deg)",
            zIndex:5,pointerEvents:"none",
            opacity: hov ? .95 : .35,transition:"opacity .3s",
          }}>{member.role.split(" ")[0].toUpperCase()}</div>

          {/* INDEX TAG */}
          <div style={{
            position:"absolute",top:8,left:10,zIndex:5,
            fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",letterSpacing:".18em",
            color: hov ? accent : C.dim,transition:"color .3s",
            textShadow: hov ? `0 0 8px ${accent}` : "none",
          }}>OP-{String(index+1).padStart(3,"0")}</div>
        </div>

        {/* INFO STRIP */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,padding:"10px 12px 12px",
          background: hov ? `linear-gradient(0deg,${accent}18,transparent)` : "transparent",
          transition:"background .3s",zIndex:6,
        }}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",
            background:`linear-gradient(90deg,${accent},${accent}00)`,
            opacity: hov ? .95 : .3,transition:"opacity .3s"}}/>
          <div style={{
            fontFamily:'"Bebas Neue",cursive',
            fontSize:"clamp(13px,1.8vw,17px)",letterSpacing:".06em",lineHeight:1.05,marginBottom:5,
            color: jitter ? accent : (member.name==="Coming Soon" ? C.dim : C.text),
            textShadow: jitter ? `0 0 14px ${accent},4px 0 0 #FF003C,-3px 0 0 rgba(0,200,255,.5)` : "none",
            transition:"color .04s,text-shadow .04s",
          }}>{member.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{
              width:5,height:5,background:rc,flexShrink:0,
              clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
              boxShadow: hov ? `0 0 10px ${rc}` : "none",transition:"box-shadow .3s",
            }}/>
            <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",color:rc,letterSpacing:".14em",textTransform:"uppercase"}}>{member.role}</span>
          </div>
        </div>

        {/* 4 CORNER BRACKETS */}
        {hov && <>
          <div style={{position:"absolute",top:4,left:4,borderTop:`2px solid ${accent}`,borderLeft:`2px solid ${accent}`,animation:"cpBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
          <div style={{position:"absolute",bottom:4,right:4,borderBottom:`2px solid #FF003C`,borderRight:`2px solid #FF003C`,animation:"cpBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
          <div style={{position:"absolute",top:4,right:4,width:12,height:12,borderTop:`1px solid ${accent}60`,borderRight:`1px solid ${accent}60`,animation:"cpBracket .18s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
          <div style={{position:"absolute",bottom:4,left:4,width:12,height:12,borderBottom:`1px solid #FF003C60`,borderLeft:`1px solid #FF003C60`,animation:"cpBracket .18s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
        </>}
        {hov && <div style={{position:"absolute",inset:0,pointerEvents:"none",boxShadow:`inset 0 0 35px ${accent}20`,zIndex:9}}/>}
      </motion.div>
  );
}

/* ── SIDE TABS ── */
function UnitTabs({ teams, active, onChange }) {
  return (
      <div style={{display:"flex",flexDirection:"column",gap:2,width:"clamp(120px,18vw,180px)",flexShrink:0}}>
        {teams.map(({ label, color }, i) => {
          const isActive = active === i;
          return (
              <button key={label} onClick={()=>onChange(i)} style={{
                fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(13px,1.8vw,17px)",letterSpacing:".14em",
                textAlign:"left",padding:"14px 18px",
                background: isActive ? `${color}18` : "transparent",
                color: isActive ? color : C.dimLt,
                border:"none",borderLeft:`3px solid ${isActive ? color : "rgba(255,233,0,0.1)"}`,
                cursor:"crosshair",transition:"all .2s",position:"relative",
                clipPath: isActive ? "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)" : "none",
                boxShadow: isActive ? `inset 0 0 20px ${color}12` : "none",whiteSpace:"nowrap",
              }}>
                {isActive && <span style={{display:"inline-block",width:5,height:5,background:color,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",marginRight:8,boxShadow:`0 0 8px ${color}`,verticalAlign:"middle"}}/>}
                {label}
                <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",color: isActive ? color : C.dim,letterSpacing:".15em",opacity:.6}}>{String(i+1).padStart(2,"0")}</span>
              </button>
          );
        })}
      </div>
  );
}

/* ── MUTE BUTTON ── */
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

/* ── MAIN ── */
export default function Committee() {
  const [activeUnit, setActiveUnit] = useState(0);
  useEffect(() => { injectStyles(); }, []);

  const teams = sortTeams(organizingCommittee.map((t, i) => ({
    ...t, team: normalizeTeam(t.team), color: TEAM_COLORS[i] || C.yellow,
  })));
  const current  = teams[activeUnit];
  const totalOps = organizingCommittee.reduce((a,t)=>a+t.members.length,0);
  const cmdCount = slateMembers.filter(m=>m.name!=="Coming Soon").length;

  return (
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:'"Share Tech Mono",monospace',position:"relative",overflow:"hidden",paddingBottom:100}}>
        <div style={{position:"fixed",top:0,left:0,right:0,height:4,background:"repeating-linear-gradient(90deg,#FFE900 0,#FFE900 20px,#060604 20px,#060604 40px)",zIndex:9990,pointerEvents:"none"}}/>
        <div style={{position:"fixed",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,233,0,.011) 3px,rgba(255,233,0,.011) 4px)",pointerEvents:"none",zIndex:1}}/>
        <div style={{position:"fixed",top:-180,left:-180,width:700,height:700,background:C.yellow,borderRadius:"50%",filter:"blur(200px)",opacity:.025,pointerEvents:"none",animation:"blobFloat 14s ease-in-out infinite"}}/>
        <div style={{position:"fixed",bottom:-150,right:-150,width:600,height:600,background:C.red,borderRadius:"50%",filter:"blur(180px)",opacity:.032,pointerEvents:"none",animation:"blobFloat 18s ease-in-out infinite reverse"}}/>
        <CyberpunkCursor/><MuteButton/>

        <div style={{position:"relative",zIndex:2,padding:"clamp(56px,9vw,96px) clamp(14px,5vw,56px) 40px"}}>

          {/* HERO */}
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.9}} style={{marginBottom:48}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
              <div style={{width:36,height:1,background:C.red}}/>
              <span style={{fontSize:9,letterSpacing:".38em",color:C.red}}>SYMBIHACK 2026 — AGENT MANIFEST</span>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.red}60,transparent)`}}/>
            </div>
            <div style={{position:"relative",marginBottom:32}}>
              <h1 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(70px,15vw,170px)",lineHeight:.82,margin:0,letterSpacing:".025em",color:C.yellow,animation:"cpTitleGlitch 5s steps(1) infinite"}}>UNIT</h1>
              <h1 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(70px,15vw,170px)",lineHeight:.82,margin:0,letterSpacing:".025em",color:"transparent",WebkitTextStroke:`2px ${C.red}`,marginLeft:"clamp(20px,5vw,70px)"}}>ROSTER</h1>
              <div style={{position:"absolute",right:0,top:"40%",transform:"rotate(90deg) translateX(-50%)",transformOrigin:"right center",fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".32em",color:C.dim,whiteSpace:"nowrap"}}>SYMBIHACKATHON 2026 · CONFIDENTIAL</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:2}}>
              {[
                {label:"COMMAND",  val:String(cmdCount).padStart(2,"0"),    col:C.yellow, tag:"CMD"},
                {label:"FIELD OPS",val:String(totalOps).padStart(2,"0"),    col:C.red,    tag:"OPS"},
                {label:"UNITS",    val:String(teams.length).padStart(2,"0"),col:C.chrome, tag:"UNIT"},
              ].map(({label,val,col,tag})=>(
                  <div key={tag} style={{background:C.card,padding:"18px 20px",borderTop:`3px solid ${col}`,position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:8,right:10,fontFamily:'"Bebas Neue",cursive',fontSize:10,letterSpacing:".2em",color:`${col}25`}}>{tag}</div>
                    <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(38px,6vw,58px)",color:col,lineHeight:1,textShadow:`0 0 28px ${col}55`,animation:"cpStatPulse 3s ease-in-out infinite"}}>{val}</div>
                    <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".22em",color:C.dimLt,marginTop:3}}>{label}</div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${col},transparent)`,opacity:.3}}/>
                  </div>
              ))}
            </div>
          </motion.div>

          {/* COMMAND UNIT */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.2}} style={{marginBottom:56}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:18}}>
              <div style={{padding:"7px 20px",background:C.yellow,color:C.bg,fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"}}>COMMAND UNIT</div>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.yellow}90,transparent)`,marginLeft:2}}/>
              <span style={{fontSize:8,letterSpacing:".24em",color:C.dim}}>{slateMembers.length} AGENTS</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:3}}>
              {slateMembers.map((m,i)=><MemberCard key={i} member={m} index={i} accent={C.yellow} isSlate/>)}
            </div>
          </motion.div>

          {/* FIELD UNITS */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.35}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:20}}>
              <div style={{padding:"7px 20px",background:C.red,color:"#fff",fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"}}>FIELD UNITS</div>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.red}90,transparent)`,marginLeft:2}}/>
            </div>
            <div style={{display:"flex",gap:3,alignItems:"flex-start"}}>
              <UnitTabs teams={teams.map(t=>({label:t.team,color:t.color}))} active={activeUnit} onChange={setActiveUnit}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{padding:"16px 24px",background:`linear-gradient(90deg,${current.color}14,${C.card})`,borderLeft:`4px solid ${current.color}`,borderBottom:`1px solid rgba(255,233,0,.05)`,display:"flex",alignItems:"center",gap:16,marginBottom:3}}>
                  <div style={{width:12,height:12,background:current.color,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",boxShadow:`0 0 18px ${current.color}`,flexShrink:0,animation:"cpStatPulse 2s ease-in-out infinite"}}/>
                  <div>
                    <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:3}}>UNIT-{String(activeUnit+1).padStart(2,"0")} · ACTIVE</div>
                    <h2 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(22px,4vw,38px)",color:current.color,letterSpacing:".1em",textShadow:`0 0 24px ${current.color}50`,margin:0,lineHeight:1}}>{current.team}</h2>
                  </div>
                  <div style={{marginLeft:"auto",display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:C.dimLt,letterSpacing:".2em"}}>{current.members.length} OPERATORS</span>
                    <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:12,color:current.color,border:`1px solid ${current.color}50`,padding:"4px 14px",letterSpacing:".15em",clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)"}}>DEPLOYED</div>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={activeUnit}
                              initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:.3}}
                              style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:3,background:`${current.color}06`,padding:3}}
                  >
                    {current.members.map((m,mi)=><MemberCard key={mi} member={m} index={mi} accent={current.color}/>)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* LEGEND */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}
                      style={{marginTop:24,padding:"13px 20px",background:C.card,borderTop:`1px solid rgba(255,233,0,.08)`,borderLeft:`4px solid rgba(255,233,0,.2)`,display:"flex",flexWrap:"wrap",gap:18,alignItems:"center"}}
          >
            <span style={{fontSize:8,letterSpacing:".26em",color:C.dim}}>// ROLE INDEX</span>
            {[["Lead",C.yellow],["Co-Lead",C.red],["SPOC",C.chrome],["Member","#555"],["Faculty In-Charge","#806040"]].map(([r,c])=>(
                <div key={r} style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:7,height:7,background:c,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",boxShadow:`0 0 5px ${c}`}}/>
                  <span style={{fontSize:7,color:C.dimLt,letterSpacing:".1em",textTransform:"uppercase"}}>{r}</span>
                </div>
            ))}
            <div style={{marginLeft:"auto",fontFamily:'"Bebas Neue",cursive',fontSize:13,color:C.dim,letterSpacing:".2em"}}>SYMBIHACKATHON 2026</div>
          </motion.div>
        </div>
        <HackathonNav/>
      </div>
  );
}