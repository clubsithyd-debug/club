import { useEffect, useRef } from "react";

export default function CyberpunkTitle() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.gsap) { init(); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.onload = init;
    document.head.appendChild(script);

    function init() {
      const gsap = window.gsap;
      if (!ref.current) return;
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      tl
        .set("#symbi-yellow", { y: -6, skewX: 2 })
        .set("#hack-red",     { y: 6,  skewX: -2 })
        .to("#symbi-yellow",  { duration: 1.2, y: 0, skewX: 0, ease: "power2.out" }, 0)
        .to("#hack-red",      { duration: 1.2, y: 0, skewX: 0, ease: "power2.out" }, 0)
        .to("#cp-title-wrap", { duration: 0.02, skewX: 15, ease: "power3.out" })
        .to("#cp-title-wrap", { duration: 0.02, skewX: 0,  ease: "power3.out" })
        .to("#symbi-yellow",  { duration: 0.008, y: -12, x: -4, skewX: 3 })
        .to("#hack-red",      { duration: 0.008, y: 10,  x: 5,  skewX: -3 }, "<")
        .to("#cp-title-wrap", { duration: 0.02, skewX: -12, ease: "power3.out" })
        .to("#cp-title-wrap", { duration: 0.02, skewX: 0,   ease: "power3.out" })
        .to("#symbi-yellow",  { duration: 0, color: "#00E5FF" })
        .to("#hack-red",      { duration: 0.08, opacity: 0 }, "<")
        .to("#symbi-yellow",  { duration: 0.08, opacity: 0 })
        .to("#symbi-yellow",  { duration: 0, color: "#FFE900", opacity: 1 })
        .to("#hack-red",      { duration: 0, opacity: 1 }, "<")
        .to("#cp-title-wrap", { duration: 0.02, skewX: 10, ease: "power3.out" })
        .to("#cp-title-wrap", { duration: 0.02, skewX: 0,  ease: "power3.out" })
        .to("#symbi-yellow",  { duration: 0.008, y: 5,  x: 2,  skewX: -1 })
        .to("#hack-red",      { duration: 0.008, y: -5, x: -2, skewX: 1  }, "<")
        .to("#symbi-yellow",  { duration: 0.8, y: 0, x: 0, skewX: 0, ease: "elastic.out(1,0.5)" })
        .to("#hack-red",      { duration: 0.8, y: 0, x: 0, skewX: 0, ease: "elastic.out(1,0.5)" }, "<")
        .to("#cp-title-wrap", { duration: 0.02, skewX: 5,  ease: "power3.out" })
        .to("#cp-title-wrap", { duration: 0.02, skewX: 0,  ease: "power3.out" })
        .to("#symbi-yellow, #hack-red", { duration: 0, opacity: 0 }, "+=0.1")
        .to("#symbi-yellow, #hack-red", { duration: 0.02, opacity: 1 })
        .to("#symbi-yellow, #hack-red", { duration: 0, opacity: 0 }, "+=0.05")
        .to("#symbi-yellow, #hack-red", { duration: 0.02, opacity: 1 });
    }
    return () => {
      if (window.gsap) window.gsap.killTweensOf("#cp-title-wrap,#symbi-yellow,#hack-red");
    };
  }, []);

  return (
    <div id="cp-title-wrap" ref={ref} style={{
      position:"relative", display:"inline-block", lineHeight:1,
      fontFamily:'"Bebas Neue",cursive',
      fontSize:"clamp(48px,10vw,130px)",
      letterSpacing:"0.03em", userSelect:"none",
    }}>
      <span id="symbi-yellow" style={{
        color:"#FFE900", display:"inline",
        textShadow:"0 0 2px #FFE900,0 0 30px rgba(255,233,0,0.35),5px 5px 0 #FF003C",
      }}>SYMBI</span>
      <span id="hack-red" style={{
        color:"#FF003C", display:"inline",
        textShadow:"0 0 2px #FF003C,0 0 30px rgba(255,0,60,0.35),5px 5px 0 #FFE900",
      }}>HACKATHON</span>
    </div>
  );
}