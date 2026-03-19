import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';

export default function TerminalEasterEgg({ isOpen, onClose }) {
  const [history, setHistory] = useState(['Welcome to SIT GitHub Club Secret Terminal...', 'Type "help" to see available commands.']);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toLowerCase().trim();
      let response = '';

      if (cmd === 'help') {
        response = 'Available commands: help, mission, about, clear, exit';
      } else if (cmd === 'mission') {
        response = 'Mission: To build, learn, and grow together in the open-source spirit.';
      } else if (cmd === 'about') {
        response = 'SIT GitHub Club - The coolest student tech community in SIT Hyderabad.';
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd === 'exit') {
        onClose();
        return;
      } else if (cmd !== '') {
        response = `Command not found: ${cmd}`;
      }

      if (cmd !== '') {
        setHistory([...history, `> ${input}`, response]);
      }
      setInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl bg-ghpanel border border-ghborder rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-ghborder/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon size={16} className="text-ghgreen" />
                <span className="text-xs font-mono text-ghtext">SIT-GC Terminal v1.0.4</span>
              </div>
              <button onClick={onClose} className="hover:text-ghgreen transition-colors">
                <X size={18} />
              </button>
            </div>
            <div 
              ref={scrollRef}
              className="p-4 h-64 overflow-y-auto font-mono text-sm space-y-2 bg-ghbg text-ghgreen scrollbar-thin scrollbar-thumb-ghborder"
            >
              {history.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              <div className="flex items-center gap-2">
                <span>{'>'}</span>
                <input
                  autoFocus
                  className="bg-transparent border-none outline-none flex-1 text-ghgreen"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleCommand}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
