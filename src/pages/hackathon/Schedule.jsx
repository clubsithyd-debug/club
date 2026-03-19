import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { scheduleData } from '../../data/hackathonData';
import HackathonNav from './HackathonNav';

export default function Schedule() {
  return (
    <div className="min-h-screen bg-ghbg text-white relative">
       <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-20">
         <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.4 }}
         >
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">Event <span className="text-ghgreen">Schedule</span></h2>
           
           <div className="grid md:grid-cols-3 gap-8">
              {scheduleData.map((day, idx) => (
                 <div key={idx} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-ghgreen/5 to-transparent rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="text-center mb-8">
                       <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-ghgreen transition-colors">{day.day}</h3>
                       <p className="text-sm font-mono text-ghmuted">{day.date}</p>
                    </div>
                    
                    <div className="space-y-6 relative ml-4 pl-8 border-l border-ghborder">
                       {day.events.map((event, eventIdx) => (
                          <div key={eventIdx} className="relative">
                             <div className={`absolute -left-[37px] top-1 w-4 h-4 rounded-full border-2 ${event.highlight ? 'bg-ghgreen border-ghgreen animate-pulse' : 'bg-[#0d1117] border-ghborder group-hover:border-ghgreen/50'} transition-colors`}></div>
                             <div className="time font-mono text-xs text-ghgreen mb-1">{event.time}</div>
                             <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                             <p className="text-xs text-ghmuted flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {event.location}
                             </p>
                          </div>
                       ))}
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