import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import HackathonNav from './hackathon/HackathonNav';

export default function SymbiHackathon() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00', hours: '00', minutes: '00', seconds: '00'
  });

  useEffect(() => {
    // Correct date: April 24, 2026
    const target = new Date('2026-04-24T00:00:00+05:30').getTime();
    const pad = n => String(n).padStart(2, '0');

    const interval = setInterval(() => {
      const d = target - Date.now();
      if (d <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: pad(Math.floor(d / 86400000)),
        hours: pad(Math.floor((d / 3600000) % 24)),
        minutes: pad(Math.floor((d / 60000) % 60)),
        seconds: pad(Math.floor((d / 1000) % 60))
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col items-center min-h-screen bg-ghbg text-white relative justify-center'>
      
      {/* --- HERO SECTION --- */}
      <section className='w-full py-20 px-6 md:px-16 lg:px-24 text-center relative overflow-hidden flex flex-col items-center justify-center flex-grow'>
        {/* Background Elements */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none'>
          <div className='absolute top-20 left-10 w-72 h-72 bg-ghgreen/10 rounded-full blur-3xl opacity-30 animate-pulse' />
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30 animate-pulse delay-700' />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='relative z-10'
        >
          <span className='inline-block py-1 px-3 rounded-full bg-ghborder/30 border border-ghborder text-ghgreen font-mono text-xs tracking-widest uppercase mb-6 backdrop-blur-sm'>
            Registration Open
          </span>
          
          <h1 className='text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight'>
            Symbi<span className='bg-gradient-to-r from-ghgreen to-green-400 bg-clip-text text-transparent'>Hackathon</span>
            <span className='block text-4xl sm:text-6xl mt-2 text-ghmuted font-mono'>2026</span>
          </h1>
          
          <p className='text-xl md:text-2xl text-ghmuted max-w-3xl mx-auto mb-12 leading-relaxed'>
            48 hours of relentless building, problem-solving, and innovation at Symbiosis Institute of Technology, Hyderabad.
          </p>

          <div className='flex flex-wrap justify-center gap-6 mb-16 text-ghmuted font-mono text-sm'>
             <div className='flex items-center gap-2 px-4 py-2 border border-ghborder rounded-full bg-ghpanel/50 backdrop-blur-sm'>
                <Calendar className='w-4 h-4 text-ghgreen' /> 24th - 26th April, 2026
             </div>
             <div className='flex items-center gap-2 px-4 py-2 border border-ghborder rounded-full bg-ghpanel/50 backdrop-blur-sm'>
                <MapPin className='w-4 h-4 text-ghgreen' /> SIT Hyderabad
             </div>
          </div>
        </motion.div>

        {/* TIMER */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className='w-full flex justify-center mb-16 relative z-10'
        >
          <div className='flex justify-center gap-4 sm:gap-8 md:gap-12 font-mono text-center flex-wrap p-8 border border-ghborder rounded-3xl bg-ghpanel/50 backdrop-blur-xl shadow-2xl'>
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds, color: 'text-ghgreen' }
            ].map((item, idx, arr) => (
              <React.Fragment key={item.label}>
                <div className='flex flex-col items-center min-w-[70px]'>
                    <span className={`text-4xl sm:text-6xl font-bold leading-none ${item.color || 'text-white'}`}>{item.value}</span>
                    <span className='mt-2 text-xs sm:text-sm tracking-widest text-ghmuted uppercase opacity-70'>{item.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div className='text-3xl sm:text-5xl text-ghborder mt-2 hidden sm:block opacity-50'>:</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className='flex flex-col sm:flex-row gap-4 justify-center'
        >
          <button className='btn-primary px-10 py-4 text-lg font-bold shadow-lg shadow-green-900/20 hover:shadow-green-900/40 transform hover:-translate-y-1 transition-all'>
            Register on Devfolio
          </button>
        </motion.div>
      </section>

      <HackathonNav />
    </div>
  );
}
