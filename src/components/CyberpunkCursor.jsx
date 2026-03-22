import { useEffect } from "react";

const COLORS = ["#FFE900","#FF003C","#C0C0C0","#B8A800"];

export default function CyberpunkCursor() {
  useEffect(() => {
    if (document.getElementById("cp-cursor-canvas")) return;
    const TUBES = [];
    const MAX = ("ontouchstart" in window) ? 60 : 200;
    const canvas = document.createElement("canvas");
    canvas.id = "cp-cursor-canvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;";
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

    let rafId;
    const animate = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="rgba(6,6,4,0.08)";
      ctx.fillRect(0,0,canvas.width,canvas.height);
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
      cancelAnimationFrame(rafId);
      const c = document.getElementById("cp-cursor-canvas");
      if(c) c.remove();
    };
  }, []);
  return null;
}