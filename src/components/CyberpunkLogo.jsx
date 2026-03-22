import { useEffect } from "react";

export default function CyberpunkLogo() {
  useEffect(() => {
    if (document.getElementById("gsap-cp")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&display=swap";
    document.head.appendChild(link);

    const s = document.createElement("script");
    s.id = "gsap-cp";
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js";
    s.onload = () => {
      if (document.getElementById("gsap-cp-anim2")) return;
      const s2 = document.createElement("script");
      s2.id = "gsap-cp-anim2";
      s2.innerHTML = `
        var masterTimeline2 = new TimelineMax();
        function symbipunk(){
          var tl = new TimelineMax();
          tl
            .set("#SY_top",{rotate:15,transformOrigin:"bottom center"})
            .set("#SY_bottom",{y:15,rotate:10,transformOrigin:"bottom center"})
            .set("#MB_top",{y:-15,rotate:5,transformOrigin:"bottom center"})
            .set("#MB_bottom",{y:10,rotate:-7,transformOrigin:"bottom center"})
            .set("#IH_top",{y:-17,rotate:-7,transformOrigin:"bottom center"})
            .set("#IH_bottom",{y:10,rotate:4,transformOrigin:"bottom center"})
            .set("#AC_top",{x:8,y:10,transformOrigin:"bottom center"})
            .set("#AC_bottom",{y:10,transformOrigin:"bottom center"})
            .set("#KA_top",{x:5,y:-20,transformOrigin:"bottom center"})
            .set("#KA_bottom",{y:10,rotate:7})
            .set("#TH_top",{y:-20,rotate:-7,transformOrigin:"bottom center"})
            .set("#TH_bottom",{x:6,y:10,rotate:7,transformOrigin:"bottom center"})
            .set("#ON_bottom",{x:6,y:10,rotate:7,transformOrigin:"bottom center"})
            .set("#symbi_blue",{opacity:0})

            .to("#SY_top",2.1,{rotate:10,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#SY_bottom",2.1,{y:6,rotate:4,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#MB_top",2.1,{y:-7,rotate:3,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#MB_bottom",2.1,{y:6,rotate:-3,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#IH_top",2.1,{y:-10,rotate:-4,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#IH_bottom",2.1,{y:6,rotate:2,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#AC_top",2.1,{x:3,y:8,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#AC_bottom",2.1,{y:8,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#KA_top",2.1,{x:2,y:-8,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#KA_bottom",2.1,{y:3,rotate:3,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#TH_top",2.1,{y:-8,rotate:-3,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#TH_bottom",2.1,{x:3,y:5,rotate:3,transformOrigin:"bottom center",ease:Linear.easeNone},0)
            .to("#ON_bottom",2.1,{x:3,y:5,rotate:3,transformOrigin:"bottom center",ease:Linear.easeNone},0)

            .to("#symbi-wrap",0.02,{skewX:70,transformOrigin:"center center",ease:Power3.easeOut})
            .to("#symbi-wrap",0.02,{skewX:0,transformOrigin:"center center",ease:Power3.easeOut})

            .to("#SY_top,#SY_bottom,#MB_top,#MB_bottom,#IH_top,#IH_bottom,#AC_top,#AC_bottom,#KA_top,#KA_bottom,#TH_top,#TH_bottom,#ON_bottom",0,{opacity:0,ease:Linear.easeNone})
            .to("#symbi_blue",0.08,{opacity:1,ease:Linear.easeNone})
            .to("#symbi_blue",0.08,{opacity:0,ease:Linear.easeNone})
            .to("#SY_top,#SY_bottom,#MB_top,#MB_bottom,#IH_top,#IH_bottom,#AC_top,#AC_bottom,#KA_top,#KA_bottom,#TH_top,#TH_bottom,#ON_bottom",0.02,{opacity:1,ease:Linear.easeNone})

            .to("#symbi-wrap",0.02,{skewX:70,transformOrigin:"center center",ease:Power3.easeOut})
            .to("#symbi-wrap",0.02,{skewX:0,transformOrigin:"center center",ease:Power3.easeOut})

            .to("#SY_top,#SY_bottom,#MB_top,#MB_bottom,#IH_top,#IH_bottom,#AC_top,#AC_bottom,#KA_top,#KA_bottom,#TH_top,#TH_bottom,#ON_bottom",1.61,{x:0,y:0,rotate:0,transformOrigin:"bottom center",ease:Power0.easeOut})

            .to("#symbi_blue",0,{opacity:1,ease:Linear.easeNone})
            .to("#symbi_blue",0.02,{opacity:0,ease:Linear.easeNone})
            .to("#symbi_blue",0,{opacity:1,ease:Linear.easeNone})

            .to("#symbi-wrap",0.02,{skewX:70,transformOrigin:"center center",ease:Power3.easeOut})
            .to("#symbi-wrap",0.02,{skewX:0,transformOrigin:"center center",ease:Power3.easeOut})
            .to("#symbi-wrap",0.1,{scale:1.12,transformOrigin:"center center",ease:Power3.easeOut})
            .to("#symbi-wrap",0.02,{skewX:70,transformOrigin:"center center",ease:Power3.easeOut},"+=0.2")
            .to("#symbi-wrap",0.02,{skewX:0,transformOrigin:"center center",ease:Power3.easeOut})

            .to("#SY_top,#SY_bottom,#MB_top,#MB_bottom,#IH_top,#IH_bottom,#AC_top,#AC_bottom,#KA_top,#KA_bottom,#TH_top,#TH_bottom,#ON_bottom",0,{opacity:0,ease:Linear.easeNone},"+=0.1")
            .to("#SY_top,#SY_bottom,#MB_top,#MB_bottom,#IH_top,#IH_bottom,#AC_top,#AC_bottom,#KA_top,#KA_bottom,#TH_top,#TH_bottom,#ON_bottom",0.02,{opacity:1,ease:Linear.easeNone})
            .to("#SY_top,#SY_bottom,#MB_top,#MB_bottom,#IH_top,#IH_bottom,#AC_top,#AC_bottom,#KA_top,#KA_bottom,#TH_top,#TH_bottom,#ON_bottom",0,{opacity:0,ease:Linear.easeNone},"+=0.08")
            .to("#SY_top,#SY_bottom,#MB_top,#MB_bottom,#IH_top,#IH_bottom,#AC_top,#AC_bottom,#KA_top,#KA_bottom,#TH_top,#TH_bottom,#ON_bottom",0.02,{opacity:1,ease:Linear.easeNone});

          return tl;
        }
        masterTimeline2.add(symbipunk());
      `;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);

    return () => {
      document.getElementById("gsap-cp-anim2")?.remove();
      document.getElementById("gsap-cp")?.remove();
    };
  }, []);

  const yellow = "#FFE900";
  const red = "#FF003C";
  const cyan = "#52bedc";
  const fs = "clamp(48px,9vw,110px)";
  const font = "'Rajdhani', sans-serif";
  const fw = "700";
  const ls = "0.05em";

  const textStyle = (color, shadow) => ({
    fontFamily: font,
    fontWeight: fw,
    fontSize: fs,
    letterSpacing: ls,
    fill: color,
    filter: shadow ? `drop-shadow(5px 5px 0px ${red})` : "none",
  });

  return (
    <div style={{width:"100%", maxWidth:1000, margin:"0 auto"}}>
      <svg id="symbi-wrap" xmlns="http://www.w3.org/2000/svg"
        width="100%" viewBox="0 0 1000 200"
        style={{overflow:"visible", display:"block"}}>

        <defs>
          <clipPath id="topHalf">
            <rect x="0" y="0" width="1000" height="100"/>
          </clipPath>
          <clipPath id="bottomHalf">
            <rect x="0" y="100" width="1000" height="100"/>
          </clipPath>
        </defs>

        {/* YELLOW TOP HALVES */}
        <g id="SY_top" clipPath="url(#topHalf)">
          <text x="20" y="170" style={textStyle(yellow, true)}>SYMBI</text>
        </g>
        <g id="MB_top" clipPath="url(#topHalf)">
          <text x="430" y="170" style={textStyle(yellow, true)}>HACK</text>
        </g>
        <g id="IH_top" clipPath="url(#topHalf)">
          <text x="730" y="170" style={textStyle(yellow, true)}>ATHON</text>
        </g>

        {/* YELLOW BOTTOM HALVES */}
        <g id="SY_bottom" clipPath="url(#bottomHalf)">
          <text x="20" y="170" style={textStyle(yellow, true)}>SYMBI</text>
        </g>
        <g id="MB_bottom" clipPath="url(#bottomHalf)">
          <text x="430" y="170" style={textStyle(yellow, true)}>HACK</text>
        </g>
        <g id="IH_bottom" clipPath="url(#bottomHalf)">
          <text x="730" y="170" style={textStyle(yellow, true)}>ATHON</text>
        </g>

        {/* EXTRA SPLIT GROUPS for more parts */}
        <g id="AC_top" clipPath="url(#topHalf)">
          <text x="20" y="170" style={{...textStyle(yellow, true), opacity:0}}>SYMBI</text>
        </g>
        <g id="AC_bottom" clipPath="url(#bottomHalf)">
          <text x="20" y="170" style={{...textStyle(yellow, true), opacity:0}}>SYMBI</text>
        </g>
        <g id="KA_top" clipPath="url(#topHalf)">
          <text x="20" y="170" style={{...textStyle(yellow, true), opacity:0}}>SYMBI</text>
        </g>
        <g id="KA_bottom" clipPath="url(#bottomHalf)">
          <text x="20" y="170" style={{...textStyle(yellow, true), opacity:0}}>SYMBI</text>
        </g>
        <g id="TH_top" clipPath="url(#topHalf)">
          <text x="20" y="170" style={{...textStyle(yellow, true), opacity:0}}>SYMBI</text>
        </g>
        <g id="TH_bottom" clipPath="url(#bottomHalf)">
          <text x="20" y="170" style={{...textStyle(yellow, true), opacity:0}}>SYMBI</text>
        </g>
        <g id="ON_bottom" clipPath="url(#bottomHalf)">
          <text x="20" y="170" style={{...textStyle(yellow, true), opacity:0}}>SYMBI</text>
        </g>

        {/* CYAN FLASH LAYER */}
        <g id="symbi_blue" opacity="0">
          <text x="20" y="170" style={textStyle(cyan, false)}>SYMBI</text>
          <text x="430" y="170" style={textStyle(cyan, false)}>HACK</text>
          <text x="730" y="170" style={textStyle(cyan, false)}>ATHON</text>
        </g>

      </svg>
    </div>
  );
}