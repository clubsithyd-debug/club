import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HackathonNav from "./HackathonNav";
import CyberpunkCursor from "../../components/CyberpunkCursor";
import cpStyles from "./hackathon-cp.module.css";

const C = {
  bg:"#060604", card:"#0D0B07", yellow:"#FFE900",
  red:"#FF003C", chrome:"#C0C0C0", dim:"#3A3224", dimLt:"#5A5030", text:"#D4C99A",
  cyan:"#00E5FF",
};

/* ── AUDIO ENGINE ── */
let globalMuted = false;
function playShock() {
  if (globalMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime; const dur = 0.18;
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
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const buf = ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.04),ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.008));
    const src = ctx.createBufferSource(); src.buffer=buf;
    const bp = ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=3500+Math.random()*3000; bp.Q.value=1.2;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.7+Math.random()*0.3,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.04);
    src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(now); src.stop(now+0.04);
  } catch(e){}
}

/* ── INJECT KEYFRAMES ── */
function injectStyles() {
  if (document.getElementById("pay-styles")) return;
  const s = document.createElement("style");
  s.id = "pay-styles";
  s.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
    @keyframes payBlob { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-30px) scale(1.06)} 70%{transform:translate(-20px,40px) scale(.96)} }
    @keyframes payPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes payBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
    @keyframes payScan { 0%{top:-40%;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:130%;opacity:0} }
    @keyframes payJitter { 0%{transform:translate(0,0) skewX(0)} 25%{transform:translate(-2px,1px) skewX(-1deg)} 50%{transform:translate(2px,-1px) skewX(.8deg)} 75%{transform:translate(-1px,2px) skewX(0)} 100%{transform:translate(0,0) skewX(0)} }
    @keyframes payArcFlash { 0%{opacity:0} 6%{opacity:.6;background:rgba(255,233,0,0.18)} 16%{opacity:.3;background:rgba(255,0,60,0.12)} 30%{opacity:.1} 100%{opacity:0} }
    @keyframes payBracket { from{width:0;height:0;opacity:0} to{width:18px;height:18px;opacity:1} }
    @keyframes payCrt { 0%,100%{opacity:1} 91%{opacity:.93} 92%{opacity:.5} 93%{opacity:1} 97%{opacity:.8} 98%{opacity:1} }
    @keyframes payScanline { from{background-position:0 0} to{background-position:0 -6px} }
    @keyframes payQrPulse { 0%,100%{border-color:rgba(255,233,0,0.3)} 50%{border-color:rgba(255,233,0,0.8)} }
  `;
  document.head.appendChild(s);
}

/* ── MUTE BUTTON ── */
function MuteButton() {
  const [muted, setMuted] = useState(false);
  return (
    <button onClick={()=>{globalMuted=!muted;setMuted(!muted);}} style={{
      position:"fixed",bottom:90,left:24,zIndex:9980,
      fontFamily:'"Share Tech Mono",monospace',fontSize:"9px",letterSpacing:".2em",
      padding:"7px 14px",
      background:muted?"rgba(255,0,60,0.15)":"rgba(255,233,0,0.1)",
      color:muted?"#FF003C":"#FFE900",
      border:`1px solid ${muted?"#FF003C50":"#FFE90050"}`,
      cursor:"crosshair",
      clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
    }}>{muted?"◼ SFX OFF":"◉ SFX ON"}</button>
  );
}

/* ── STEP CARD ── */
function StepCard({ num, title, desc, accent, icon }) {
  const [hov, setHov] = useState(false);
  const [jitter, setJitter] = useState(false);
  const [arcOn, setArcOn] = useState(false);
  const tmr = useRef(null);
  useEffect(() => {
    if (!hov) { setJitter(false); clearTimeout(tmr.current); return; }
    const burst = () => {
      setJitter(true); playTick();
      setTimeout(()=>setJitter(false), 60+Math.random()*70);
      tmr.current = setTimeout(burst, 700+Math.random()*1200);
    };
    tmr.current = setTimeout(burst, 400);
    return () => clearTimeout(tmr.current);
  }, [hov]);
  return (
    <div
      onMouseEnter={()=>{setHov(true);setArcOn(true);playShock();setTimeout(()=>setArcOn(false),380);}}
      onMouseLeave={()=>setHov(false)}
      style={{
        position:"relative",background:C.card,overflow:"hidden",cursor:"crosshair",
        border:`1px solid ${hov?accent+"80":accent+"18"}`,
        borderLeft:`3px solid ${accent}`,padding:"28px 24px",
        clipPath:"polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)",
        transition:"border-color .25s",
        animation:jitter?"payJitter .06s steps(1) infinite":hov?"payCrt 4s steps(1) infinite":"none",
      }}
    >
      {arcOn && <div style={{position:"absolute",inset:0,zIndex:10,pointerEvents:"none",animation:"payArcFlash .38s ease-out forwards"}}/>}
      {hov && <div style={{position:"absolute",left:0,right:0,top:"-40%",height:"40%",pointerEvents:"none",zIndex:3,background:`linear-gradient(180deg,transparent,${accent}30 50%,transparent)`,animation:"payScan .9s linear infinite"}}/>}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.28) 2px,rgba(0,0,0,.28) 3px)",animation:hov?"payScanline .1s linear infinite":"none",opacity:.6}}/>
      {hov && <>
        <div style={{position:"absolute",top:4,left:4,borderTop:`2px solid ${accent}`,borderLeft:`2px solid ${accent}`,animation:"payBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
        <div style={{position:"absolute",bottom:4,right:4,borderBottom:`2px solid #FF003C`,borderRight:`2px solid #FF003C`,animation:"payBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}/>
      </>}
      <div style={{position:"relative",zIndex:4}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:48,color:accent,lineHeight:1,textShadow:`0 0 20px ${accent}60`,animation:"payPulse 3s ease-in-out infinite"}}>{num}</div>
          <div style={{fontSize:28,opacity:hov?1:.35,transition:"opacity .3s"}}>{icon}</div>
        </div>
        <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:22,color:C.text,letterSpacing:".08em",marginBottom:10,textShadow:jitter?`2px 0 0 #FF003C,-1px 0 0 rgba(0,200,255,.5)`:"none"}}>{title}</div>
        <div style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:14,color:C.dimLt,lineHeight:1.7}}>{desc}</div>
      </div>
    </div>
  );
}

/* ── CHECKLIST ITEM ── */
function CheckItem({ text, done, onToggle }) {
  return (
    <div onClick={()=>{onToggle();playTick();}} style={{
      display:"flex",alignItems:"flex-start",gap:14,padding:"12px 16px",
      background:done?"rgba(255,233,0,0.04)":"transparent",
      border:`1px solid ${done?"rgba(255,233,0,0.2)":"rgba(255,233,0,0.06)"}`,
      cursor:"crosshair",transition:"all .2s",marginBottom:4,
      clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)",
    }}>
      <div style={{
        width:16,height:16,border:`1px solid ${done?C.yellow:"rgba(255,233,0,0.3)"}`,
        background:done?C.yellow:"transparent",flexShrink:0,marginTop:2,
        display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",
      }}>
        {done && <div style={{width:8,height:8,background:C.bg}}/>}
      </div>
      <span style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:15,color:done?C.text:C.dimLt,transition:"color .2s"}}>{text}</span>
    </div>
  );
}

/* ── UPI ROW ── */
function UpiRow({ label, value, copyable }) {
  const [copied, setCopied] = useState(false);
  const [hov, setHov] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).catch(()=>{});
    setCopied(true); playShock();
    setTimeout(()=>setCopied(false), 2000);
  };
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"12px 16px",marginBottom:3,
      background:hov?"rgba(255,233,0,0.04)":C.bg,
      border:`1px solid ${hov?"rgba(255,233,0,0.15)":"rgba(255,233,0,0.06)"}`,
      transition:"all .2s",
    }}>
      <div>
        <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".22em",color:C.dim,marginBottom:4}}>{label}</div>
        <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:13,color:C.yellow,letterSpacing:".06em"}}>{value}</div>
      </div>
      {copyable && (
        <button onClick={copy} style={{
          fontFamily:'"Share Tech Mono",monospace',fontSize:9,letterSpacing:".18em",
          padding:"6px 14px",background:copied?"rgba(255,233,0,0.15)":"transparent",
          color:copied?C.yellow:C.dimLt,border:`1px solid ${copied?"rgba(255,233,0,0.4)":"rgba(255,233,0,0.15)"}`,
          cursor:"crosshair",transition:"all .2s",
          clipPath:"polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
        }}>{copied?"✓ COPIED":"COPY"}</button>
      )}
    </div>
  );
}

/* ── FAQ ITEM ── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:C.card,border:`1px solid rgba(255,233,0,0.08)`,overflow:"hidden",marginBottom:3}}>
      <div onClick={()=>{setOpen(!open);playTick();}} style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"14px 18px",cursor:"crosshair",
        borderLeft:`3px solid ${open?C.red:"rgba(255,0,60,0.2)"}`,transition:"border-color .2s",
      }}>
        <span style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:15,fontWeight:600,color:C.text,paddingRight:12}}>{q}</span>
        <span style={{fontFamily:'"Bebas Neue",cursive',fontSize:16,color:C.red,flexShrink:0,transition:"transform .2s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.25}} style={{overflow:"hidden"}}>
            <div style={{padding:"14px 18px 16px",fontFamily:'"Barlow Condensed",sans-serif',fontSize:14,color:C.dimLt,lineHeight:1.7,borderLeft:`3px solid ${C.red}`,borderTop:`1px solid rgba(255,0,60,0.1)`}}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── MAIN ── */
export default function Payment() {
  useEffect(() => { injectStyles(); }, []);
  const [checks, setChecks] = useState([false,false,false,false]);
  const allDone = checks.every(Boolean);
  const toggleCheck = i => setChecks(prev => { const n=[...prev]; n[i]=!n[i]; return n; });

  const STEPS = [
    { num:"01", title:"COMPLETE REGISTRATION", desc:"Submit your team on the official registration form first. Organizers match your payment to your roster using the exact team name.", accent:C.cyan,   icon:"◈" },
    { num:"02", title:"INITIATE PAYMENT",       desc:"Transfer ₹500 via UPI or bank transfer. Use your exact team name as the payment remark — this is critical for verification.", accent:C.yellow, icon:"◆" },
    { num:"03", title:"UPLOAD PROOF",           desc:"Screenshot your payment confirmation and upload it via the form link. Include the transaction ID. Slots confirm only after this step.", accent:C.red,    icon:"◉" },
  ];

  const CHECKS = [
    "Team registered on the official form",
    "₹500 transferred with team name as remark",
    "Payment screenshot saved and ready",
    "Transaction ID noted down",
  ];

  return (
    <div className={cpStyles.cpPage} style={{
      background:C.bg,minHeight:"100vh",
      fontFamily:'"Share Tech Mono",monospace',
      position:"relative",overflow:"hidden",paddingBottom:100,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700&display=swap" rel="stylesheet"/>

      {/* FIXED BG ELEMENTS */}
      <div style={{position:"fixed",top:0,left:0,right:0,height:4,background:"repeating-linear-gradient(90deg,#FFE900 0,#FFE900 20px,#060604 20px,#060604 40px)",zIndex:9990,pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,233,0,.01) 3px,rgba(255,233,0,.01) 4px)",pointerEvents:"none",zIndex:1}}/>
      <div style={{position:"fixed",top:-200,left:-200,width:700,height:700,background:C.yellow,borderRadius:"50%",filter:"blur(200px)",opacity:.022,pointerEvents:"none",animation:"payBlob 14s ease-in-out infinite"}}/>
      <div style={{position:"fixed",bottom:-150,right:-150,width:600,height:600,background:C.red,borderRadius:"50%",filter:"blur(180px)",opacity:.028,pointerEvents:"none",animation:"payBlob 18s ease-in-out infinite reverse"}}/>
      <div style={{position:"fixed",top:"40%",right:-100,width:400,height:400,background:C.cyan,borderRadius:"50%",filter:"blur(200px)",opacity:.012,pointerEvents:"none"}}/>

      <CyberpunkCursor/><MuteButton/>

      <div style={{position:"relative",zIndex:2}}>

        {/* ══ HERO ══ */}
        <div style={{padding:"clamp(60px,9vw,100px) clamp(16px,5vw,60px) 48px"}}>
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.9}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
              <div style={{width:36,height:1,background:C.yellow}}/>
              <span style={{fontSize:9,letterSpacing:".38em",color:C.yellow}}>SYMBIHACK 2026 — PAYMENT TERMINAL</span>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.yellow}60,transparent)`}}/>
            </div>

            <h1 style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(58px,13vw,148px)",lineHeight:.82,margin:"0 0 4px",letterSpacing:".02em",color:C.yellow,textShadow:`4px 4px 0px ${C.red}`}}>TRANS</h1>
            <h1 className={cpStyles.outlineText} style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(58px,13vw,148px)",lineHeight:.82,margin:"0 0 28px",letterSpacing:".02em",marginLeft:"clamp(16px,4vw,72px)"}}>ACTION</h1>

            <p style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:"clamp(14px,1.8vw,18px)",color:C.dimLt,lineHeight:1.8,maxWidth:520,borderLeft:`3px solid rgba(255,233,0,0.2)`,paddingLeft:16,marginBottom:28}}>
              Secure your slot in 3 steps. Register → Pay → Upload proof. Teams that skip the proof upload will not be confirmed regardless of payment status.
            </p>

            {/* CRITICAL ALERT */}
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",background:"rgba(255,0,60,0.08)",border:`1px solid rgba(255,0,60,0.3)`,borderLeft:`4px solid ${C.red}`,marginBottom:40,clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)"}}>
              <div style={{width:8,height:8,background:C.red,flexShrink:0,animation:"payBlink 1s steps(1) infinite"}}/>
              <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:10,letterSpacing:".18em",color:C.red}}>PAYMENT WITHOUT PROOF UPLOAD WILL NOT CONFIRM YOUR SLOT</span>
            </div>

            {/* STATS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:2}}>
              {[
                {val:"₹500", label:"Per Team",     col:C.yellow},
                {val:"48H",  label:"Hack Duration", col:C.red},
                {val:"UPI",  label:"Payment Mode",  col:C.cyan},
                {val:"<24H", label:"Confirmation",  col:C.yellow},
              ].map(({val,label,col},i)=>(
                <motion.div key={label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.07}}
                  style={{background:C.card,padding:"18px 18px",borderTop:`3px solid ${col}`,position:"relative",overflow:"hidden"}}>
                  <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(28px,4vw,44px)",color:col,lineHeight:1,textShadow:`0 0 22px ${col}55`,animation:"payPulse 3s ease-in-out infinite"}}>{val}</div>
                  <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".2em",color:C.dimLt,marginTop:4}}>{label}</div>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${col},transparent)`,opacity:.3}}/>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══ 3 STEPS ══ */}
        <div style={{padding:"0 clamp(16px,5vw,60px) 56px"}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:24}}>
              <div style={{padding:"7px 20px",background:C.yellow,color:C.bg,fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"}}>MISSION SEQUENCE</div>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.yellow}80,transparent)`,marginLeft:2}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:3}}>
              {STEPS.map((s,i)=>(
                <motion.div key={s.num} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.1}}>
                  <StepCard {...s}/>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══ PAYMENT DETAILS ══ */}
        <div style={{padding:"0 clamp(16px,5vw,60px) 56px"}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:24}}>
              <div style={{padding:"7px 20px",background:C.red,color:"#fff",fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"}}>PAYMENT DETAILS</div>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.red}80,transparent)`,marginLeft:2}}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:3,alignItems:"start"}}>

              {/* LEFT — UPI + BANK */}
              <div style={{background:C.card,border:`1px solid rgba(255,233,0,0.1)`,borderTop:`3px solid ${C.yellow}`,padding:"28px 24px",clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)"}}>
                <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:18}}>// UPI TRANSFER</div>
                <UpiRow label="UPI ID" value="symbihack2026@upi" copyable/>
                <UpiRow label="REGISTERED NAME" value="Symbiosis Hackathon Club" copyable/>
                <UpiRow label="AMOUNT" value="₹500 per team" copyable={false}/>
                <UpiRow label="REMARK / NOTE" value="[YOUR EXACT TEAM NAME]" copyable={false}/>

                <div style={{margin:"20px 0",height:1,background:`linear-gradient(90deg,${C.yellow}40,transparent)`}}/>

                <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:16}}>// BANK TRANSFER</div>
                <UpiRow label="ACCOUNT NAME" value="Symbiosis Hackathon Club" copyable/>
                <UpiRow label="ACCOUNT NO." value="XXXX XXXX XXXX" copyable/>
                <UpiRow label="IFSC CODE" value="SBIN0XXXXXX" copyable/>
                <UpiRow label="BANK" value="State Bank of India" copyable={false}/>

                <div style={{marginTop:20,padding:"14px 16px",background:"rgba(255,233,0,0.04)",border:`1px solid rgba(255,233,0,0.12)`,borderLeft:`3px solid ${C.yellow}`}}>
                  <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".2em",color:C.dimLt,marginBottom:6}}>// IMPORTANT</div>
                  <div style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:13,color:C.dimLt,lineHeight:1.7}}>Always use your exact registered team name as the payment remark. This is how we match your payment to your registration entry.</div>
                </div>
              </div>

              {/* RIGHT — QR + UPLOAD */}
              <div style={{display:"flex",flexDirection:"column",gap:3}}>

                {/* QR */}
                <div style={{background:C.card,border:`1px solid rgba(0,229,255,0.15)`,borderTop:`3px solid ${C.cyan}`,padding:"28px 24px",clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)",textAlign:"center"}}>
                  <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:20,textAlign:"left"}}>// SCAN TO PAY — UPI QR</div>
                  <div style={{width:180,height:180,margin:"0 auto 16px",border:`2px solid rgba(255,233,0,0.4)`,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",animation:"payQrPulse 2s ease-in-out infinite"}}>
                    <div style={{position:"absolute",top:6,left:6,width:22,height:22,borderTop:`3px solid ${C.yellow}`,borderLeft:`3px solid ${C.yellow}`}}/>
                    <div style={{position:"absolute",top:6,right:6,width:22,height:22,borderTop:`3px solid ${C.yellow}`,borderRight:`3px solid ${C.yellow}`}}/>
                    <div style={{position:"absolute",bottom:6,left:6,width:22,height:22,borderBottom:`3px solid ${C.yellow}`,borderLeft:`3px solid ${C.yellow}`}}/>
                    <div style={{position:"absolute",bottom:6,right:6,width:22,height:22,borderBottom:`3px solid ${C.yellow}`,borderRight:`3px solid ${C.yellow}`}}/>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:2,padding:20}}>
                      {Array.from({length:64},(_,i)=>(
                        <div key={i} style={{width:11,height:11,background:[0,1,2,8,9,10,16,17,18,5,6,7,13,14,15,21,22,23,42,43,50,51].includes(i)?`${C.yellow}`:Math.random()>.45?`${C.yellow}70`:"transparent"}}/>
                      ))}
                    </div>
                    <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:7,letterSpacing:".2em",color:C.dimLt,position:"absolute",bottom:8}}>UPI QR</div>
                  </div>
                  <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:10,letterSpacing:".12em",color:C.yellow}}>symbihack2026@upi</div>
                  <div style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:12,color:C.dim,marginTop:6}}>GPay · PhonePe · Paytm · BHIM · Any UPI app</div>
                </div>

                {/* UPLOAD */}
                <div style={{background:C.card,border:`1px solid rgba(255,0,60,0.15)`,borderTop:`3px solid ${C.red}`,padding:"24px",clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)"}}>
                  <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:12}}>// STEP 3 — UPLOAD PROOF</div>
                  <div style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:14,color:C.dimLt,lineHeight:1.7,marginBottom:20}}>After payment, upload your screenshot via the form below. Include the transaction ID in the notes field. Confirmation arrives within 24 hours.</div>
                  <a href="https://forms.google.com" target="_blank" rel="noopener noreferrer" onClick={playShock}
                    style={{display:"block",textAlign:"center",background:C.red,color:"#fff",fontFamily:'"Bebas Neue",cursive',fontSize:18,letterSpacing:".2em",padding:"14px 24px",border:"none",cursor:"pointer",textDecoration:"none",clipPath:"polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)",boxShadow:`0 0 24px rgba(255,0,60,0.3),3px 3px 0 rgba(255,233,0,0.2)`}}>
                    ↑ UPLOAD PAYMENT PROOF
                  </a>
                </div>

                {/* SLOTS WARNING */}
                <div style={{background:`linear-gradient(135deg,rgba(255,233,0,0.06),rgba(255,0,60,0.04))`,border:`1px solid rgba(255,233,0,0.2)`,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)"}}>
                  <div style={{width:9,height:9,background:C.yellow,animation:"payPulse 1.5s ease-in-out infinite",boxShadow:`0 0 12px ${C.yellow}`,flexShrink:0}}/>
                  <div>
                    <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:17,color:C.yellow,letterSpacing:".1em"}}>LIMITED SLOTS</div>
                    <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:C.dimLt,letterSpacing:".14em",marginTop:2}}>PROOF UPLOAD CONFIRMS SLOT — NOT PAYMENT ALONE</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══ CHECKLIST + FAQ ══ */}
        <div style={{padding:"0 clamp(16px,5vw,60px) 56px"}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.4}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:24}}>
              <div style={{padding:"7px 20px",background:C.yellow,color:C.bg,fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"}}>PRE-FLIGHT CHECKLIST</div>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.yellow}80,transparent)`,marginLeft:2}}/>
              <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:C.dim,letterSpacing:".2em"}}>{checks.filter(Boolean).length}/{checks.length} COMPLETE</span>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:3}}>
              {/* CHECKLIST */}
              <div style={{background:C.card,border:`1px solid rgba(255,233,0,0.08)`,padding:"24px",clipPath:"polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)"}}>
                <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:16}}>// CLICK TO CHECK OFF</div>
                {CHECKS.map((text,i)=>(
                  <CheckItem key={i} text={text} done={checks[i]} onToggle={()=>toggleCheck(i)}/>
                ))}
                <AnimatePresence>
                  {allDone && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{marginTop:16,padding:"14px 20px",background:"rgba(255,233,0,0.08)",border:`1px solid ${C.yellow}`,display:"flex",alignItems:"center",gap:12,clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)"}}>
                      <div style={{width:8,height:8,background:C.yellow,boxShadow:`0 0 12px ${C.yellow}`,animation:"payPulse 1s ease-in-out infinite"}}/>
                      <div>
                        <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:16,color:C.yellow,letterSpacing:".12em"}}>ALL SYSTEMS GO</div>
                        <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:C.dimLt,letterSpacing:".14em",marginTop:2}}>SLOT WILL BE CONFIRMED WITHIN 24H</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FAQ + CONTACT */}
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                <div style={{background:C.card,borderLeft:`3px solid ${C.yellow}`,border:`1px solid rgba(255,233,0,0.08)`,padding:"20px"}}>
                  <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:12}}>// NEED HELP?</div>
                  {[
                    {label:"EMAIL",    val:"payments@symbihackathon.in"},
                    {label:"WHATSAPP", val:"+91 XXXXX XXXXX"},
                    {label:"REPLY",    val:"Within 6 hours"},
                  ].map(({label,val})=>(
                    <div key={label} style={{display:"flex",gap:12,marginBottom:8,alignItems:"flex-start"}}>
                      <span style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:C.dimLt,letterSpacing:".2em",minWidth:80,paddingTop:2}}>{label}</span>
                      <span style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:14,color:C.text}}>{val}</span>
                    </div>
                  ))}
                </div>
                <FaqItem q="What if I pay but forget to upload proof?" a="Your slot will not be confirmed. Upload proof as soon as you pay — don't wait. The proof upload step is mandatory."/>
                <FaqItem q="Can multiple teammates pay separately?" a="No. One team member pays the full ₹500 and uploads the single proof screenshot. Split payments are not accepted."/>
                <FaqItem q="How long does confirmation take?" a="Within 24 hours of proof upload. You will receive a confirmation email on the registered ID."/>
                <FaqItem q="What if my payment fails mid-transfer?" a="Do not attempt a second payment immediately. Screenshot the failure and contact us via WhatsApp with your team name and transaction attempt ID."/>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══ BOTTOM CTA ══ */}
        <div style={{padding:"0 clamp(16px,5vw,60px) 60px"}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5}}
            style={{background:`linear-gradient(135deg,rgba(255,233,0,0.04),rgba(255,0,60,0.02))`,border:`1px solid rgba(255,233,0,0.12)`,borderTop:`3px solid ${C.yellow}`,padding:"36px 40px",clipPath:"polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:24}}>
            <div>
              <div style={{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:C.dim,marginBottom:8}}>// READY TO LOCK IN?</div>
              <div style={{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(24px,4vw,42px)",color:C.yellow,letterSpacing:".06em",lineHeight:1}}>REGISTER. PAY. BUILD.</div>
              <div style={{fontFamily:'"Barlow Condensed",sans-serif',fontSize:15,color:C.dimLt,marginTop:8}}>48 hours. Real problems. Your shot to win.</div>
            </div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              <a href="https://devfolio.co" target="_blank" rel="noopener noreferrer" onClick={playShock}
                style={{display:"inline-block",background:C.yellow,color:C.bg,fontFamily:'"Bebas Neue",cursive',fontSize:17,letterSpacing:".2em",padding:"14px 32px",textDecoration:"none",cursor:"pointer",clipPath:"polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)",boxShadow:`0 0 24px rgba(255,233,0,0.25),3px 3px 0 ${C.red}`}}>
                REGISTER NOW →
              </a>
              <a href="https://forms.google.com" target="_blank" rel="noopener noreferrer" onClick={playShock}
                style={{display:"inline-block",background:"transparent",color:C.red,fontFamily:'"Bebas Neue",cursive',fontSize:17,letterSpacing:".2em",padding:"14px 32px",textDecoration:"none",cursor:"pointer",border:`2px solid ${C.red}`,clipPath:"polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)"}}>
                UPLOAD PROOF ↑
              </a>
            </div>
          </motion.div>
        </div>

      </div>
      <HackathonNav/>
    </div>
  );
}