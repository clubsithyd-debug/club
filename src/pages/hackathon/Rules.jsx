import React from 'react';
import { motion } from 'framer-motion';
import HackathonNav from './HackathonNav';

export default function Rules() {
  const rules = [
      { title: "Team Size", desc: "Teams can consist of 1 to 4 members." },
      { title: "Fresh Code", desc: "All code must be written during the hackathon. Pre-existing projects are not allowed." },
      { title: "Submission", desc: "Projects must be submitted via Devfolio/GitHub before the deadline." },
      { title: "Conduct", desc: "Respect all participants. Follow the Code of Conduct." },
      { title: "Intellectual Property", desc: "You own your code. We just want to see what you built!" }
  ];

  return (
    <div className="min-h-screen bg-ghbg text-white relative">
       <div className="max-w-5xl mx-auto px-6 md:px-16 lg:px-24 py-20">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
         >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Hackathon <span className="text-ghgreen">Rules</span></h2>
            
            <div className="grid gap-6">
               {rules.map((rule, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-[#161b22] rounded-xl border border-ghborder hover:border-ghgreen/50 transition-colors">
                     <div className="flex-shrink-0 w-12 h-12 bg-ghgreen/10 rounded-full flex items-center justify-center text-ghgreen font-bold text-xl">
                        {i + 1}
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">{rule.title}</h3>
                        <p className="text-ghmuted">{rule.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </motion.div>
       </div>
       <HackathonNav />
    </div>
  );
}