import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-ghpanel border border-ghborder rounded-2xl shadow-2xl p-6 sm:p-10 scrollbar-hide"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-ghmuted hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>

          {/* Metadata Grid (The "Event Scheduler") */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-ghborder rounded-xl p-4 min-w-0">
              <span className="block text-xs font-mono text-ghgreen uppercase mb-1">Date</span>
              <span className="text-white font-medium block text-sm sm:text-base">{event.date}</span>
            </div>
            <div className="bg-white/5 border border-ghborder rounded-xl p-4 min-w-0">
              <span className="block text-xs font-mono text-ghgreen uppercase mb-1">Mode</span>
              <span className="text-white font-medium block text-sm sm:text-base">{event.mode || 'Offline'}</span>
            </div>
            <div className="bg-white/5 border border-ghborder rounded-xl p-4 min-w-0">
              <span className="block text-xs font-mono text-ghgreen uppercase mb-1">Venue</span>
              <span className="text-white font-medium block text-sm sm:text-base break-words" title={event.venue}>{event.venue || 'SIT Hyderabad'}</span>
            </div>
            <div className="bg-white/5 border border-ghborder rounded-xl p-4 min-w-0">
              <span className="block text-xs font-mono text-ghgreen uppercase mb-1">Category</span>
              <span className="text-white font-medium block text-sm sm:text-base break-words">{event.type}</span>
            </div>
          </div>

          {/* Title Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-ghgreen text-xs font-mono uppercase tracking-widest bg-ghgreen/10 px-3 py-1 rounded-full border border-ghgreen/30">
                {event.type}
              </span>
              <span className="text-ghmuted text-xs font-mono uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {event.id.includes('past') ? 'Conducted' : 'Featured Event'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              {event.title}
            </h2>
            <p className="text-lg text-ghmuted leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Detailed Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            {/* Left: Taught */}
            <div>
              <h4 className="text-ghgreen font-bold text-xl mb-4 flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap"></i> What It Taught
              </h4>
              <ul className="space-y-3">
                {event.outcomes?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-ghmuted">
                    <i className="fa-solid fa-check text-ghgreen mt-1 text-sm"></i>
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                )) || (
                  <li className="text-ghmuted italic text-sm">Learning outcomes details coming soon.</li>
                )}
              </ul>
            </div>

            {/* Right: Team */}
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-chalkboard-user text-ghgreen"></i> Instructor
                </h4>
                <p className="text-ghmuted">{event.instructor}</p>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                   <i className="fa-solid fa-users text-ghgreen"></i> Coordinators
                </h4>
                <div className="flex flex-wrap gap-2">
                  {event.coordinators?.map((name, idx) => (
                    <span key={idx} className="text-sm bg-white/5 border border-ghborder px-3 py-1 rounded-lg text-ghmuted">
                      {name}
                    </span>
                  )) || <span className="text-ghmuted italic">Names not available</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Resources & Gallery */}
          <div className="space-y-10">
            {/* Photos */}
            {event.gallery?.length > 0 && (
              <div>
                <h4 className="text-ghgreen font-bold text-xl mb-6">Event Gallery</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {event.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-[16/10] rounded-xl overflow-hidden border border-ghborder group cursor-pointer hover:border-ghgreen transition-colors relative">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-ghgreen/5 border border-ghgreen/20 rounded-2xl gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-white">Event Resources</h4>
                <p className="text-sm text-ghmuted">Download certificates, slide decks, and schedules.</p>
              </div>
              <a 
                href={event.pdf} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 whitespace-nowrap no-underline"
              >
                <i className="fa-solid fa-file-pdf"></i>
                Open Schedule PDF
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventModal;
