import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slateMembers, organizingCommittee } from '../../data/hackathonData';
import TeamCard from '../../components/TeamCard';
import HackathonNav from './HackathonNav';

export default function Committee() {
  const [activeTab, setActiveTab] = useState('Slate Members');

  // Unified data structure for rendering
  const allTeams = [
    { team: 'Slate Members', members: slateMembers },
    ...organizingCommittee
  ];

  return (
    <div className="min-h-screen bg-ghbg text-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-20 text-center">
         <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
         >
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Organizing <span className="text-ghgreen">Committee</span></h2>
             <p className="text-ghmuted mb-12">The backbone of SymbiHackathon 2026.</p>

              {/* Tabs */}
             <div className="flex flex-wrap justify-center gap-4 mb-12">
                {allTeams.map((group) => (
                   <button
                      key={group.team}
                      onClick={() => setActiveTab(group.team)}
                      className={`px-6 py-2 rounded-full font-mono text-sm border transition-all ${
                         activeTab === group.team 
                         ? 'bg-ghgreen/10 border-ghgreen text-ghgreen shadow-[0_0_15px_rgba(57,211,83,0.3)]' 
                         : 'bg-[#161b22] border-ghborder text-ghmuted hover:border-ghmuted hover:text-white'
                      }`}
                   >
                      {group.team}
                   </button>
                ))}
             </div>

             {/* Dynamic Content */}
             <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                   {allTeams.map((group) => (
                      group.team === activeTab && (
                         <motion.div
                            key={group.team}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center"
                         >
                            {group.members.map((member, idx) => (
                               <TeamCard key={idx} member={member} />
                            ))}
                         </motion.div>
                      )
                   ))}
                </AnimatePresence>
             </div>
         </motion.div>
      </div>
      <HackathonNav />
    </div>
  );
}