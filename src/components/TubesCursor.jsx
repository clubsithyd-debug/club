import { useEffect } from "react";

export default function TubesCursor() {
  useEffect(() => {
    if (document.getElementById("tubes-script")) return;
    const script = document.createElement("script");
    script.id = "tubes-script";
    script.type = "module";
    script.innerHTML = `
      import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";
      if (!window.__tubesApp) {
        const canvas = document.createElement("canvas");
        canvas.id = "tubes-canvas";
        canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;";
        document.body.appendChild(canvas);
        window.__tubesApp = TubesCursor(canvas, {
          tubes: {
            colors: ["#FFE900", "#FF003C", "#00E5FF"],
            lights: {
              intensity: 200,
              colors: ["#FFE900", "#FF003C", "#00E5FF", "#C0C0C0"]
            }
          }
        });
      }
    `;
    document.head.appendChild(script);
    return () => {
      const canvas = document.getElementById("tubes-canvas");
      if (canvas) canvas.remove();
      window.__tubesApp = null;
      const s = document.getElementById("tubes-script");
      if (s) s.remove();
    };
  }, []);
  return null;
}