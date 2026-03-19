import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const TeamCard = ({ member }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="w-[280px] h-[380px] bg-[#0d1117] rounded-[2rem] overflow-hidden border border-[#30363d] relative group shadow-xl"
    >
      {/* Full Card Background Image */}
      {member.image ? (
        <div className="absolute inset-0 w-full h-full">
            <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
            />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#21262d] to-[#0d1117]">
            <div className="text-8xl font-bold text-[#30363d] select-none opacity-50">
              {member.initial || (member.name && member.name[0])}
            </div>
        </div>
      )}

      {/* Smooth Gradient Overlay with Masked Blur */}
      {/* Optimized: No backdrop-blur to prevent hover glitches */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent pointer-events-none"
        style={{ 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)'
        }}
      />

      {/* Content Layer */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-10 flex flex-col justify-end h-full pointer-events-none">
        <div className="mt-auto pointer-events-auto w-full">
            {/* Name & Role */}
            <div className="text-center mb-5 pt-1">
              <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md tracking-tight">
                {member.name}
              </h3>
              <p className="text-[#c9d1d9] text-sm font-medium drop-shadow-sm tracking-wide uppercase">{member.role}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center w-full">
                <a 
                    href={member.github || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-[#238636] text-white font-semibold text-sm hover:bg-[#2ea043] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#238636]/20 flex items-center justify-center gap-2"
                >
                    GitHub <Github className="w-4 h-4" />
                </a>
                <a 
                    href={member.linkedin || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#0d1117]/50 text-[#c9d1d9] border border-[#30363d] hover:border-[#8b949e] hover:text-white hover:bg-[#21262d] transition-all transform hover:-translate-y-0.5 backdrop-blur-sm"
                    title="LinkedIn Profile"
                >
                    <Linkedin className="w-5 h-5" />
                </a>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
