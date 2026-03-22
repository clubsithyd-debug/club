import React, { useState, useEffect, useRef } from 'react';
import GLOBE from 'vanta/dist/vanta.globe.min';
import * as THREE from 'three';

export default function VantaGlobe() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      try {
        if (!THREE.Geometry && !THREE.BufferGeometry) {
             console.error("VantaGlobe: THREE.Geometry is missing. Skipping effect.");
             return;
        }

        setVantaEffect(
            GLOBE({
            el: myRef.current,
            THREE: THREE,
            mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xffffff, // Bright White
          backgroundColor: 0x010409, // GitHub dark bg
          size: 0.80
        })
      );
      } catch (error) {
        console.error("VantaGlobe error:", error);
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={myRef} 
      className="absolute inset-0 z-0 opacity-40 pointer-events-none"
      style={{
        maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
      }}
    />
  );
}
