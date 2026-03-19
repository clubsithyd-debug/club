import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

const StatItem = ({ label, target, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(target);
      if (start === end) return;

      let totalDuration = 2000;
      let incrementTime = (totalDuration / end);

      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="flex flex-col items-center p-6 border border-ghborder rounded-xl bg-ghpanel/50 backdrop-blur-sm">
      <motion.span 
        className="text-5xl font-extrabold text-ghgreen mb-2 font-mono"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
      >
        {count}{suffix}
      </motion.span>
      <span className="text-ghtext font-medium uppercase tracking-widest text-sm">{label}</span>
    </div>
  );
};

export default function StatsCounter() {
  return (
    <section className="w-full py-20 px-6 md:px-16 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatItem label="Members" target="150" />
        <StatItem label="Projects" target="25" />
        <StatItem label="Annual Events" target="10" />
      </div>
    </section>
  );
}
