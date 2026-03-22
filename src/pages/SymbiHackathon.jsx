import React, { useState, useEffect, useRef } from "react";
import HackathonNav from "./hackathon/HackathonNav";
import styles from "./SymbiHackathon.module.css";
import HologramTitle from "../components/HologramTitle";
import CyberpunkTitle from "../components/CyberpunkTitle";
import CyberpunkFlipClock from "../components/CyberpunkFlipClock";

export default function SymbiHackathon() {
  const [timeLeft, setTimeLeft] = useState({ days:"00", hours:"00", minutes:"00", seconds:"00" });
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const scanYRef = useRef(-10);
  const scanningRef = useRef(false);

  useEffect(() => {
    const target = new Date("2026-04-24T00:00:00+05:30").getTime();
    const pad = n => String(n).padStart(2,"0");
    const iv = setInterval(() => {
      const d = target - Date.now();
      if(d <= 0){ setTimeLeft({ days:"00", hours:"00", minutes:"00", seconds:"00" }); clearInterval(iv); return; }
      setTimeLeft({ days:pad(Math.floor(d/86400000)), hours:pad(Math.floor((d/3600000)%24)), minutes:pad(Math.floor((d/60000)%60)), seconds:pad(Math.floor((d/1000)%60)) });
    }, 1000);
    return () => clearInterval(iv);
  }, []);



  useEffect(() => {
    const COLORS = ["#FFE900","#FF003C","#C0C0C0","#B8A800"];
    const TUBES = [];
    const isMobile = "ontouchstart" in window;
    const MAX = isMobile ? 60 : 200;

    const NODES = [];
    const COLS = Math.ceil(window.innerWidth / 80);
    const ROWS = Math.ceil(window.innerHeight / 80);
    for(let c=0;c<COLS;c++){
      for(let r=0;r<ROWS;r++){
        NODES.push({
          x: c*80+40, y: r*80+40,
          pulse: Math.random()*Math.PI*2,
          speed: Math.random()*0.02+0.008,
          baseOpacity: Math.random()*0.12+0.03
        });
      }
    }

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    function Tube(x,y,col){
      this.x=x; this.y=y; this.px=x; this.py=y;
      this.col=col; this.w=Math.random()*3+1;
      this.life=1; this.decay=Math.random()*0.014+0.007;
      this.vx=(Math.random()-0.5)*2.5;
      this.vy=(Math.random()-0.5)*2.5;
    }
    Tube.prototype.update = function(){
      this.px=this.x; this.py=this.y;
      this.vx+=(Math.random()-0.5)*0.6;
      this.vy+=(Math.random()-0.5)*0.6;
      this.vx*=0.95; this.vy*=0.95;
      this.x+=this.vx; this.y+=this.vy;
      this.life-=this.decay;
    };
    Tube.prototype.draw = function(){
      ctx.beginPath();
      ctx.moveTo(this.px,this.py);
      ctx.lineTo(this.x,this.y);
      ctx.strokeStyle=this.col;
      ctx.lineWidth=this.w*this.life;
      ctx.lineCap="square";
      ctx.globalAlpha=this.life*0.9;
      ctx.shadowColor=this.col;
      ctx.shadowBlur=10;
      ctx.stroke();
      ctx.globalAlpha=1;
      ctx.shadowBlur=0;
    };

    const spawn = (x,y) => {
      if(TUBES.length < MAX){
        for(let i=0;i<4;i++){
          TUBES.push(new Tube(
            x+(Math.random()-0.5)*8,
            y+(Math.random()-0.5)*8,
            COLORS[Math.floor(Math.random()*COLORS.length)]
          ));
        }
      }
    };

    const onMouseMove = e => spawn(e.clientX, e.clientY);
    const onTouchMove = e => { const t=e.touches[0]; spawn(t.clientX,t.clientY); };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove, { passive:true });

    const section = document.querySelector("."+styles.wrap);
    const onEnter = () => { scanningRef.current = true; };
    const onLeave = () => { scanningRef.current = false; scanYRef.current = -10; };
    if(section){
      section.addEventListener("mouseenter", onEnter);
      section.addEventListener("mouseleave", onLeave);
    }

    const counters = document.querySelectorAll("."+styles.statValue);
    const targets = [500, 100000, 48];
    const suffixes = ["+", "Rs", "H"];
    counters.forEach((el,i) => {
      let cur = 0;
      const inc = targets[i] / 60;
      const tick = setInterval(() => {
        cur = Math.min(cur+inc, targets[i]);
        el.textContent = Math.floor(cur).toLocaleString("en-IN") + suffixes[i];
        if(cur >= targets[i]) clearInterval(tick);
      }, 30);
    });

    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(8,8,8,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      NODES.forEach(n => {
        n.pulse += n.speed;
        const op = n.baseOpacity + Math.sin(n.pulse)*0.06;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,233,0,"+op+")";
        ctx.fill();
      });

      NODES.forEach((a,i) => {
        NODES.slice(i+1).forEach(b => {
          const dist = Math.hypot(a.x-b.x, a.y-b.y);
          if(dist < 100){
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.strokeStyle = "rgba(255,233,0,"+(1-dist/100)*0.04+")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      if(scanningRef.current){
        scanYRef.current += 3;
        if(scanYRef.current > canvas.height) scanYRef.current = -10;
        ctx.beginPath();
        ctx.moveTo(0, scanYRef.current);
        ctx.lineTo(canvas.width, scanYRef.current);
        ctx.strokeStyle = "rgba(255,233,0,0.06)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      for(let i=TUBES.length-1;i>=0;i--){
        TUBES[i].update();
        TUBES[i].draw();
        if(TUBES[i].life<=0) TUBES.splice(i,1);
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      if(section){
        section.removeEventListener("mouseenter", onEnter);
        section.removeEventListener("mouseleave", onLeave);
      }
      cancelAnimationFrame(rafId);
      if(canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet"/>
      <div className={styles.wrap}>
        <div className={styles.hero}>
          <div className={styles.badge}>// REGISTRATION OPEN &nbsp; ?</div>
          <HologramTitle/>
          <p className={styles.year}>2026</p>
          <p className={styles.desc}>48 hours of relentless building, problem-solving, and innovation at Symbiosis Institute of Technology, Hyderabad.</p>
          <div className={styles.pills}>
            <div className={styles.pill}>&#9632; 24TH - 26TH APRIL, 2026</div>
            <div className={styles.pill}>&#9632; SIT HYDERABAD</div>
          </div>
          <div className={styles.stats}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>// REGISTERED TEAMS</div>
              <div className={styles.statValue}>0+</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>// PRIZE POOL</div>
              <div className={styles.statValue}>0Rs</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>// HOURS</div>
              <div className={styles.statValue}>0H</div>
            </div>
          </div>
          <div className={styles.timerWrap}>
            <CyberpunkFlipClock targetDate="2026-04-24T00:00:00+05:30"/>

          </div>
          <button className={styles.registerBtn} onClick={()=>window.open("https://devfolio.co","_blank")}>
            &gt;_ REGISTER ON DEVFOLIO
          </button>
        </div>
        <HackathonNav/>
        <button
          className={styles.muteBtn}
          onClick={()=>{ if(audioRef.current){ audioRef.current.muted=!audioRef.current.muted; setMuted(m=>!m); } }}
        >
          {muted ? "// SFX: OFF" : "// SFX: ON"}
        </button>
      </div>
    </>
  );
}
