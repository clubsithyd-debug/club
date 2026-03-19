import React from 'react';
import { motion } from 'framer-motion';
import { Code2, GitBranch, Terminal, Globe, Cpu, Database, Layers, ShieldCheck } from 'lucide-react';

const icons = [
  { Icon: Code2, color: '#39d353', top: '15%', left: '10%' },
  { Icon: GitBranch, color: '#8b949e', top: '25%', left: '85%' },
  { Icon: Terminal, color: '#39d353', top: '70%', left: '15%' },
  { Icon: Globe, color: '#8b949e', top: '65%', left: '80%' },
  { Icon: Cpu, color: '#39d353', top: '10%', left: '70%' },
  { Icon: Database, color: '#8b949e', top: '80%', left: '40%' },
  { Icon: Layers, color: '#39d353', top: '40%', left: '5%' },
  { Icon: ShieldCheck, color: '#8b949e', top: '50%', left: '90%' },
];

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map(({ Icon, color, top, left }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ top, left, color }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 10, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={40 + Math.random() * 20} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
