import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './Layout';

const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const About = lazy(() => import('./pages/About'));
const SymbiHackathon = lazy(() => import('./pages/SymbiHackathon'));
const ProblemStatements = lazy(() => import('./pages/ProblemStatements'));
const Contact = lazy(() => import('./pages/Contact'));
const Sponsors = lazy(() => import('./pages/hackathon/Sponsors'));
const Schedule = lazy(() => import('./pages/hackathon/Schedule'));
const Rules = lazy(() => import('./pages/hackathon/Rules'));
const Committee = lazy(() => import('./pages/hackathon/Committee'));
const Payment = lazy(() => import('./pages/hackathon/Payment'));

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#010409] text-white">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#30363d] border-t-[#39d353]"></div>
  </div>
);

function GlobalMusic() {
  const location = useLocation();
  const isHackathon = location.pathname.startsWith("/symbihackathon");
  const [playing, setPlaying] = useState(false);
  const hasStarted = useRef(false);

  useEffect(()=>{
    const audio = audioRef.current;
    if(!audio) return;
    if(isHackathon){
      if(hasStarted.current){ audio.play().then(()=>setPlaying(true)).catch(()=>{}); }
    } else {
      audio.pause();
      setPlaying(false);
    }
  },[isHackathon]);
  const audioRef = useRef(null);

  useEffect(()=>{
    const audio = new Audio("/assets/nikitakondrashev-cyberpunk-437545.mp3");
    audio.loop = true;
    audio.volume = 0.18;
    audioRef.current = audio;
    const start = () => {
      audio.play().catch(()=>{});
      setPlaying(true);
      document.removeEventListener("click", start);
      document.removeEventListener("scroll", start);
      document.removeEventListener("keydown", start);
      document.removeEventListener("touchstart", start);
    };
    document.addEventListener("click", start);
    document.addEventListener("scroll", start);
    document.addEventListener("keydown", start);
    document.addEventListener("touchstart", start);
    return () => { audio.pause(); audio.src = ""; };
  },[]);

  const toggle = () => {
    const audio = audioRef.current;
    if(!audio) return;
    if(playing){ audio.pause(); setPlaying(false); }
    else { audio.play().catch(()=>{}); setPlaying(true); }
  };

  if (!isHackathon) return null;
  return (
    <button onClick={toggle} style={{
      position:"fixed", bottom:50, left:24, zIndex:99999,
      fontFamily:"Share Tech Mono,monospace", fontSize:"9px", letterSpacing:".2em",
      padding:"7px 14px",
      background: playing?"rgba(255,233,0,0.1)":"rgba(255,0,60,0.15)",
      color: playing?"#FFE900":"#FF003C",
      border:"1px solid rgba(255,233,0,0.3)",
      cursor:"crosshair",
      clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
    }}>{playing?"? MUSIC ON":"? MUSIC OFF"}</button>
  );
}

function App() {
  return (
    <Layout>
      <GlobalMusic/>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/symbihackathon" element={<SymbiHackathon />} />
          <Route path="/symbihackathon/problems" element={<ProblemStatements />} />
          <Route path="/symbihackathon/sponsors" element={<Sponsors />} />
          <Route path="/symbihackathon/schedule" element={<Schedule />} />
          <Route path="/symbihackathon/rules" element={<Rules />} />
          <Route path="/symbihackathon/committee" element={<Committee />} />
          <Route path="/symbihackathon/payment" element={<Payment />} />
          <Route path="/problem-statements" element={<ProblemStatements />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;