import React from 'react';
import { motion } from 'framer-motion';
import HackathonNav from './HackathonNav';

export default function Sponsors() {
  return (
    <div className="min-h-screen bg-ghbg text-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-20 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our <span className="text-ghgreen">Sponsors</span></h2>
            <p className="text-ghmuted mb-16">Powering the next generation of innovators.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center opacity-60">
               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-24 bg-[#161b22] border border-ghborder rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all hover:border-ghgreen/50 cursor-pointer group">
                     <span className="text-ghmuted font-mono group-hover:text-white">Sponsor {i}</span>
                  </div>
               ))}
            </div>
            
            <div className="mt-12 p-8 border border-dashed border-ghborder rounded-2xl bg-ghpanel/50">
               <h3 className="text-xl font-bold text-white mb-2">Interested in Sponsoring?</h3>
               <p className="text-ghmuted mb-6">Connect with top talent and showcase your brand.</p>
               <a href="/contact" className="text-ghgreen hover:underline">Contact Us for Sponsorship Deck &rarr;</a>
            </div>
        </motion.div>
      </div>
      <HackathonNav />
    </div>
  );
}