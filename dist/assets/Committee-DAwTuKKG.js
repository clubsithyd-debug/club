import{r as f,j as t}from"./index-Bvv6xj4p.js";import{o as C,b as w}from"./hackathonData-CYfL88b3.js";import{H as B}from"./HackathonNav-ItWhAwYw.js";import{C as I}from"./CyberpunkCursor-CWhaz3D7.js";import{m as b}from"./proxy-Bn8_WqUp.js";import{A}from"./index-G2OdC5tK.js";import"./createLucideIcon-COSBDt03.js";import"./terminal-BPSfRnYQ.js";import"./users-DVeELqIj.js";const n={bg:"#060604",card:"#0D0B07",yellow:"#FFE900",red:"#FF003C",chrome:"#C0C0C0",dim:"#3A3224",dimLt:"#5A5030",text:"#D4C99A"},X=["#FFE900","#FF003C","#00E5FF","#B8A800"],M={Lead:"#FFE900","Co-Lead":"#FF003C",SPOC:"#C0C0C0",Member:"#3A3224",Chairperson:"#FFE900","Vice Chairperson":"#FF003C",Treasurer:"#C0C0C0",Secretary:"#4A6080","Faculty In-Charge":"#806040","Content Developer":"#408060","Executive Member":"#604080"},$=e=>M[e]||"#5A5030",z=e=>e.trim().toUpperCase()==="TECHNICAL"?"WEB N' TECH":e,N=e=>{const r=["WEB N' TECH","LOGISTICS","PR & DESIGN","SPONSORSHIP"];return[...e].sort((i,l)=>{const a=r.indexOf(i.team),p=r.indexOf(l.team);return(a===-1?99:a)-(p===-1?99:p)})};let S=null,k=!1;function E(){return S||(S=new(window.AudioContext||window.webkitAudioContext)),S.state==="suspended"&&S.resume(),S}function O(){if(!k)try{const e=E(),r=e.currentTime,i=.18,l=e.sampleRate*i,a=e.createBuffer(1,l,e.sampleRate),p=a.getChannelData(0);for(let c=0;c<l;c++)p[c]=(Math.random()*2-1)*Math.exp(-c/(e.sampleRate*.04));const o=e.createBufferSource();o.buffer=a;const s=e.createBiquadFilter();s.type="bandpass",s.frequency.value=4e3,s.Q.value=.8;const d=e.createBiquadFilter();d.type="highshelf",d.frequency.value=3e3,d.gain.value=14;const m=e.createGain();m.gain.setValueAtTime(1.4,r),m.gain.exponentialRampToValueAtTime(.001,r+i),o.connect(s),s.connect(d),d.connect(m),m.connect(e.destination),o.start(r),o.stop(r+i),[0,.03,.07].forEach(c=>{const x=e.createOscillator();x.type="sawtooth",x.frequency.setValueAtTime(180+Math.random()*120,r+c),x.frequency.exponentialRampToValueAtTime(40,r+c+.06);const u=e.createGain();u.gain.setValueAtTime(.5,r+c),u.gain.exponentialRampToValueAtTime(.001,r+c+.06);const v=e.createWaveShaper(),F=new Float32Array(256);for(let g=0;g<256;g++){const j=g*2/256-1;F[g]=(Math.PI+400)*j/(Math.PI+400*Math.abs(j))}v.curve=F,x.connect(v),v.connect(u),u.connect(e.destination),x.start(r+c),x.stop(r+c+.07)});const h=e.createOscillator();h.type="sine",h.frequency.setValueAtTime(80,r),h.frequency.exponentialRampToValueAtTime(20,r+.1);const y=e.createGain();y.gain.setValueAtTime(.7,r),y.gain.exponentialRampToValueAtTime(.001,r+.12),h.connect(y),y.connect(e.destination),h.start(r),h.stop(r+.12)}catch{}}function R(){if(!k)try{const e=E(),r=e.currentTime,i=e.createBuffer(1,Math.floor(e.sampleRate*.04),e.sampleRate),l=i.getChannelData(0);for(let s=0;s<l.length;s++)l[s]=(Math.random()*2-1)*Math.exp(-s/(e.sampleRate*.008));const a=e.createBufferSource();a.buffer=i;const p=e.createBiquadFilter();p.type="bandpass",p.frequency.value=3500+Math.random()*3e3,p.Q.value=1.2;const o=e.createGain();o.gain.setValueAtTime(.7+Math.random()*.3,r),o.gain.exponentialRampToValueAtTime(.001,r+.04),a.connect(p),p.connect(o),o.connect(e.destination),a.start(r),a.stop(r+.04)}catch{}}function L(){if(document.getElementById("cp4-styles"))return;const e=document.createElement("style");e.id="cp4-styles",e.innerHTML=`
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
  `,document.head.appendChild(e)}function T({member:e,index:r,accent:i,isSlate:l=!1}){const[a,p]=f.useState(!1),[o,s]=f.useState(!1),[d,m]=f.useState(!1),[h,y]=f.useState(!1),c=f.useRef(null),x=$(e.role),u=e.image&&!h,v=e.name==="Coming Soon"?"???":e.name.split(" ").map(g=>g[0]).join("").slice(0,2).toUpperCase();f.useEffect(()=>{if(!a){s(!1),clearTimeout(c.current);return}const g=()=>{s(!0),R(),setTimeout(()=>s(!1),60+Math.random()*80),c.current=setTimeout(g,800+Math.random()*1400)};return c.current=setTimeout(g,400),()=>clearTimeout(c.current)},[a]);const F=()=>{p(!0),m(!0),O(),setTimeout(()=>m(!1),400)};return t.jsxs(b.div,{initial:{opacity:0,scale:.93},animate:{opacity:1,scale:1},transition:{duration:.4,delay:r*.04},onMouseEnter:F,onMouseLeave:()=>p(!1),style:{position:"relative",background:n.card,clipPath:"polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",overflow:"hidden",cursor:"crosshair",aspectRatio:"3/4",border:`1px solid ${a?i+"75":"rgba(255,233,0,0.07)"}`,transition:"border-color .2s",animation:o?"cpJitter .06s steps(1) infinite":a?"cpCrtFlick 4s steps(1) infinite, cpBorderZap .45s steps(1)":"none"},children:[d&&t.jsx("div",{style:{position:"absolute",inset:0,zIndex:30,pointerEvents:"none",animation:"cpArcFlash .4s ease-out forwards"}}),t.jsxs("div",{style:{position:"absolute",inset:0},children:[u?t.jsxs(t.Fragment,{children:[t.jsx("img",{src:e.image,alt:e.name,onError:()=>y(!0),style:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:a?"grayscale(0%) contrast(1) brightness(1)":"grayscale(100%) contrast(1.1) brightness(0.75)",transition:"filter .6s"}}),a&&t.jsx(t.Fragment,{children:"> > > > > > > >"})]}):t.jsxs("div",{style:{position:"absolute",inset:0,background:`linear-gradient(145deg,${n.bg} 0%,${i}0A 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6},children:[t.jsx("div",{style:{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(36px,6vw,56px)",color:i,opacity:a?.9:.22,letterSpacing:".1em",textShadow:a?`0 0 28px ${i},0 0 55px ${i}60`:"none",transition:"opacity .3s,text-shadow .3s",animation:a?"cpCrtFlick 3s steps(1) infinite":"none"},children:v}),t.jsx("div",{style:{fontFamily:'"Share Tech Mono",monospace',fontSize:"6px",letterSpacing:".25em",color:n.dim},children:"PHOTO PENDING"})]}),a&&t.jsxs(t.Fragment,{children:[t.jsx("div",{style:{position:"absolute",left:0,right:0,top:"-40%",height:"40%",background:`linear-gradient(180deg,transparent 0%,${i}50 46%,${i}75 50%,${i}50 54%,transparent 100%)`,animation:"cpScanFast .75s linear infinite",pointerEvents:"none"}}),t.jsx("div",{style:{position:"absolute",left:0,right:0,top:"-70%",height:"60%",background:`linear-gradient(180deg,transparent 0%,${i}18 42%,${i}28 50%,${i}18 58%,transparent 100%)`,animation:"",pointerEvents:"none"}})]}),t.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.32) 2px,rgba(0,0,0,.32) 3px)",animation:a?"cpScanlineScroll .08s linear infinite":"none",opacity:.75}}),t.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundSize:"140px 140px",mixBlendMode:"overlay",opacity:a?.55:.12,animation:a?"cpNoiseShift .14s steps(1) infinite":"none",transition:"opacity .3s"}}),t.jsx("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:"65%",pointerEvents:"none",background:`linear-gradient(to top,${n.bg}FA 0%,${n.bg}92 28%,transparent 100%)`}}),t.jsx("div",{style:{position:"absolute",top:12,right:-26,background:`${x}22`,border:`1px solid ${x}55`,fontFamily:'"Share Tech Mono",monospace',fontSize:"6px",letterSpacing:".2em",color:x,padding:"2px 30px",transform:"rotate(38deg)",zIndex:5,pointerEvents:"none",opacity:a?.95:.35,transition:"opacity .3s"},children:e.role.split(" ")[0].toUpperCase()}),t.jsxs("div",{style:{position:"absolute",top:8,left:10,zIndex:5,fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",letterSpacing:".18em",color:a?i:n.dim,transition:"color .3s",textShadow:a?`0 0 8px ${i}`:"none"},children:["OP-",String(r+1).padStart(3,"0")]})]}),t.jsxs("div",{style:{position:"absolute",bottom:0,left:0,right:0,padding:"10px 12px 12px",background:a?`linear-gradient(0deg,${i}18,transparent)`:"transparent",transition:"background .3s",zIndex:6},children:[t.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,height:"1px",background:`linear-gradient(90deg,${i},${i}00)`,opacity:a?.95:.3,transition:"opacity .3s"}}),t.jsx("div",{style:{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(13px,1.8vw,17px)",letterSpacing:".06em",lineHeight:1.05,marginBottom:5,color:o?i:e.name==="Coming Soon"?n.dim:n.text,textShadow:o?`0 0 14px ${i},4px 0 0 #FF003C,-3px 0 0 rgba(0,200,255,.5)`:"none",transition:"color .04s,text-shadow .04s"},children:e.name}),t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[t.jsx("div",{style:{width:5,height:5,background:x,flexShrink:0,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",boxShadow:a?`0 0 10px ${x}`:"none",transition:"box-shadow .3s"}}),t.jsx("span",{style:{fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",color:x,letterSpacing:".14em",textTransform:"uppercase"},children:e.role})]})]}),a&&t.jsxs(t.Fragment,{children:[t.jsx("div",{style:{position:"absolute",top:4,left:4,borderTop:`2px solid ${i}`,borderLeft:`2px solid ${i}`,animation:"cpBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}),t.jsx("div",{style:{position:"absolute",bottom:4,right:4,borderBottom:"2px solid #FF003C",borderRight:"2px solid #FF003C",animation:"cpBracket .12s ease-out forwards",pointerEvents:"none",zIndex:10}}),t.jsx("div",{style:{position:"absolute",top:4,right:4,width:12,height:12,borderTop:`1px solid ${i}60`,borderRight:`1px solid ${i}60`,animation:"cpBracket .18s ease-out forwards",pointerEvents:"none",zIndex:10}}),t.jsx("div",{style:{position:"absolute",bottom:4,left:4,width:12,height:12,borderBottom:"1px solid #FF003C60",borderLeft:"1px solid #FF003C60",animation:"cpBracket .18s ease-out forwards",pointerEvents:"none",zIndex:10}})]}),a&&t.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",boxShadow:`inset 0 0 35px ${i}20`,zIndex:9}})]})}function P({teams:e,active:r,onChange:i}){return t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:2,width:"clamp(120px,18vw,180px)",flexShrink:0},children:e.map(({label:l,color:a},p)=>{const o=r===p;return t.jsxs("button",{onClick:()=>i(p),style:{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(13px,1.8vw,17px)",letterSpacing:".14em",textAlign:"left",padding:"14px 18px",background:o?`${a}18`:"transparent",color:o?a:n.dimLt,border:"none",borderLeft:`3px solid ${o?a:"rgba(255,233,0,0.1)"}`,cursor:"crosshair",transition:"all .2s",position:"relative",clipPath:o?"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)":"none",boxShadow:o?`inset 0 0 20px ${a}12`:"none",whiteSpace:"nowrap"},children:[o&&t.jsx("span",{style:{display:"inline-block",width:5,height:5,background:a,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",marginRight:8,boxShadow:`0 0 8px ${a}`,verticalAlign:"middle"}}),l,t.jsx("span",{style:{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontFamily:'"Share Tech Mono",monospace',fontSize:"7px",color:o?a:n.dim,letterSpacing:".15em",opacity:.6},children:String(p+1).padStart(2,"0")})]},l)})})}function H(){const[e,r]=f.useState(!1),i=()=>{k=!e,r(!e)};return t.jsx("button",{onClick:i,style:{position:"fixed",bottom:90,left:24,zIndex:9980,fontFamily:'"Share Tech Mono",monospace',fontSize:"9px",letterSpacing:".2em",padding:"7px 14px",background:e?"rgba(255,0,60,0.15)":"rgba(255,233,0,0.1)",color:e?"#FF003C":"#FFE900",border:`1px solid ${e?"#FF003C50":"#FFE90050"}`,cursor:"crosshair",clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",transition:"all .2s"},children:e?"◼ SFX OFF":"◉ SFX ON"})}function Q(){const[e,r]=f.useState(0);f.useEffect(()=>{L()},[]);const i=N(C.map((o,s)=>({...o,team:z(o.team),color:X[s]||n.yellow}))),l=i[e],a=C.reduce((o,s)=>o+s.members.length,0),p=w.filter(o=>o.name!=="Coming Soon").length;return t.jsxs("div",{style:{background:n.bg,minHeight:"100vh",fontFamily:'"Share Tech Mono",monospace',position:"relative",overflow:"hidden",paddingBottom:100},children:[t.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,height:4,background:"repeating-linear-gradient(90deg,#FFE900 0,#FFE900 20px,#060604 20px,#060604 40px)",zIndex:9990,pointerEvents:"none"}}),t.jsx("div",{style:{position:"fixed",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,233,0,.011) 3px,rgba(255,233,0,.011) 4px)",pointerEvents:"none",zIndex:1}}),t.jsx("div",{style:{position:"fixed",top:-180,left:-180,width:700,height:700,background:n.yellow,borderRadius:"50%",filter:"blur(200px)",opacity:.025,pointerEvents:"none",animation:"blobFloat 14s ease-in-out infinite"}}),t.jsx("div",{style:{position:"fixed",bottom:-150,right:-150,width:600,height:600,background:n.red,borderRadius:"50%",filter:"blur(180px)",opacity:.032,pointerEvents:"none",animation:"blobFloat 18s ease-in-out infinite reverse"}}),t.jsx(I,{}),t.jsx(H,{}),t.jsxs("div",{style:{position:"relative",zIndex:2,padding:"clamp(56px,9vw,96px) clamp(14px,5vw,56px) 40px"},children:[t.jsxs(b.div,{initial:{opacity:0,y:40},animate:{opacity:1,y:0},transition:{duration:.9},style:{marginBottom:48},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:16},children:[t.jsx("div",{style:{width:36,height:1,background:n.red}}),t.jsx("span",{style:{fontSize:9,letterSpacing:".38em",color:n.red},children:"SYMBIHACK 2026 — AGENT MANIFEST"}),t.jsx("div",{style:{flex:1,height:1,background:`linear-gradient(90deg,${n.red}60,transparent)`}})]}),t.jsxs("div",{style:{position:"relative",marginBottom:32},children:[t.jsx("h1",{style:{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(70px,15vw,170px)",lineHeight:.82,margin:0,letterSpacing:".025em",color:n.yellow,animation:"cpTitleGlitch 5s steps(1) infinite"},children:"UNIT"}),t.jsx("h1",{style:{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(70px,15vw,170px)",lineHeight:.82,margin:0,letterSpacing:".025em",color:"transparent",WebkitTextStroke:`2px ${n.red}`,marginLeft:"clamp(20px,5vw,70px)"},children:"ROSTER"}),t.jsx("div",{style:{position:"absolute",right:0,top:"40%",transform:"rotate(90deg) translateX(-50%)",transformOrigin:"right center",fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".32em",color:n.dim,whiteSpace:"nowrap"},children:"SYMBIHACKATHON 2026 · CONFIDENTIAL"})]}),t.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:2},children:[{label:"COMMAND",val:String(p).padStart(2,"0"),col:n.yellow,tag:"CMD"},{label:"FIELD OPS",val:String(a).padStart(2,"0"),col:n.red,tag:"OPS"},{label:"UNITS",val:String(i.length).padStart(2,"0"),col:n.chrome,tag:"UNIT"}].map(({label:o,val:s,col:d,tag:m})=>t.jsxs("div",{style:{background:n.card,padding:"18px 20px",borderTop:`3px solid ${d}`,position:"relative",overflow:"hidden"},children:[t.jsx("div",{style:{position:"absolute",top:8,right:10,fontFamily:'"Bebas Neue",cursive',fontSize:10,letterSpacing:".2em",color:`${d}25`},children:m}),t.jsx("div",{style:{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(38px,6vw,58px)",color:d,lineHeight:1,textShadow:`0 0 28px ${d}55`,animation:"cpStatPulse 3s ease-in-out infinite"},children:s}),t.jsx("div",{style:{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".22em",color:n.dimLt,marginTop:3},children:o}),t.jsx("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${d},transparent)`,opacity:.3}})]},m))})]}),t.jsxs(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6,delay:.2},style:{marginBottom:56},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:0,marginBottom:18},children:[t.jsx("div",{style:{padding:"7px 20px",background:n.yellow,color:n.bg,fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"},children:"COMMAND UNIT"}),t.jsx("div",{style:{flex:1,height:1,background:`linear-gradient(90deg,${n.yellow}90,transparent)`,marginLeft:2}}),t.jsxs("span",{style:{fontSize:8,letterSpacing:".24em",color:n.dim},children:[w.length," AGENTS"]})]}),t.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:3},children:w.map((o,s)=>t.jsx(T,{member:o,index:s,accent:n.yellow,isSlate:!0},s))})]}),t.jsxs(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6,delay:.35},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:0,marginBottom:20},children:[t.jsx("div",{style:{padding:"7px 20px",background:n.red,color:"#fff",fontFamily:'"Bebas Neue",cursive',fontSize:15,letterSpacing:".22em",clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)"},children:"FIELD UNITS"}),t.jsx("div",{style:{flex:1,height:1,background:`linear-gradient(90deg,${n.red}90,transparent)`,marginLeft:2}})]}),t.jsxs("div",{style:{display:"flex",gap:3,alignItems:"flex-start"},children:[t.jsx(P,{teams:i.map(o=>({label:o.team,color:o.color})),active:e,onChange:r}),t.jsxs("div",{style:{flex:1,minWidth:0},children:[t.jsxs("div",{style:{padding:"16px 24px",background:`linear-gradient(90deg,${l.color}14,${n.card})`,borderLeft:`4px solid ${l.color}`,borderBottom:"1px solid rgba(255,233,0,.05)",display:"flex",alignItems:"center",gap:16,marginBottom:3},children:[t.jsx("div",{style:{width:12,height:12,background:l.color,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",boxShadow:`0 0 18px ${l.color}`,flexShrink:0,animation:"cpStatPulse 2s ease-in-out infinite"}}),t.jsxs("div",{children:[t.jsxs("div",{style:{fontFamily:'"Share Tech Mono",monospace',fontSize:8,letterSpacing:".28em",color:n.dim,marginBottom:3},children:["UNIT-",String(e+1).padStart(2,"0")," · ACTIVE"]}),t.jsx("h2",{style:{fontFamily:'"Bebas Neue",cursive',fontSize:"clamp(22px,4vw,38px)",color:l.color,letterSpacing:".1em",textShadow:`0 0 24px ${l.color}50`,margin:0,lineHeight:1},children:l.team})]}),t.jsxs("div",{style:{marginLeft:"auto",display:"flex",gap:12,alignItems:"center"},children:[t.jsxs("span",{style:{fontFamily:'"Share Tech Mono",monospace',fontSize:8,color:n.dimLt,letterSpacing:".2em"},children:[l.members.length," OPERATORS"]}),t.jsx("div",{style:{fontFamily:'"Bebas Neue",cursive',fontSize:12,color:l.color,border:`1px solid ${l.color}50`,padding:"4px 14px",letterSpacing:".15em",clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)"},children:"DEPLOYED"})]})]}),t.jsx(A,{mode:"wait",children:t.jsx(b.div,{initial:{opacity:0,x:24},animate:{opacity:1,x:0},exit:{opacity:0,x:-24},transition:{duration:.3},style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:3,background:`${l.color}06`,padding:3},children:l.members.map((o,s)=>t.jsx(T,{member:o,index:s,accent:l.color},s))},e)})]})]})]}),t.jsxs(b.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1},style:{marginTop:24,padding:"13px 20px",background:n.card,borderTop:"1px solid rgba(255,233,0,.08)",borderLeft:"4px solid rgba(255,233,0,.2)",display:"flex",flexWrap:"wrap",gap:18,alignItems:"center"},children:[t.jsx("span",{style:{fontSize:8,letterSpacing:".26em",color:n.dim},children:"// ROLE INDEX"}),[["Lead",n.yellow],["Co-Lead",n.red],["SPOC",n.chrome],["Member","#555"],["Faculty In-Charge","#806040"]].map(([o,s])=>t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:7},children:[t.jsx("div",{style:{width:7,height:7,background:s,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",boxShadow:`0 0 5px ${s}`}}),t.jsx("span",{style:{fontSize:7,color:n.dimLt,letterSpacing:".1em",textTransform:"uppercase"},children:o})]},o)),t.jsx("div",{style:{marginLeft:"auto",fontFamily:'"Bebas Neue",cursive',fontSize:13,color:n.dim,letterSpacing:".2em"},children:"SYMBIHACKATHON 2026"})]})]}),t.jsx(B,{})]})}export{Q as default};
