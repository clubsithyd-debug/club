import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Code, Clock, Users, ShieldCheck, Info, UserPlus, ArrowLeft, Terminal } from 'lucide-react';

export default function HackathonNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-2 bg-[#161b22]/90 backdrop-blur-xl border border-ghborder rounded-full shadow-2xl shadow-black/50">
         {[
           { id: '/', icon: ArrowLeft, label: 'Main Site', exact: true },
           { id: '/symbihackathon', icon: Terminal, label: 'Hackathon', exact: true },
           { id: '/symbihackathon/problems', icon: Code, label: 'Problems' },
           { id: '/symbihackathon/schedule', icon: Clock, label: 'Schedule' },
           { id: '/symbihackathon/committee', icon: Users, label: 'Committee' },
           { id: '/symbihackathon/sponsors', icon: UserPlus, label: 'Sponsors' },
           { id: '/symbihackathon/rules', icon: Info, label: 'Rules' },
         ].map((item) => {
            const isActive = item.exact ? path === item.id : path.startsWith(item.id);
            return (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`p-3 rounded-full transition-all group relative ${
                     isActive 
                     ? 'bg-ghgreen text-black scale-110 shadow-lg shadow-green-500/20' 
                     : 'text-ghmuted hover:text-white hover:bg-[#30363d]'
                  }`}
                  aria-label={item.label}
                >
                   <item.icon className="w-5 h-5" />
                   
                   {/* Tooltip */}
                   <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#30363d]">
                      {item.label}
                   </span>
                </Link>
            )
         })}
      </nav>
    </div>
  );
}