import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isHackathon = location.pathname.startsWith('/symbihackathon');

  return (
    <div className="min-h-screen flex flex-col bg-ghbg text-ghtext font-sans">
      {/* NAVBAR */}
      {!isHackathon && (
        <header className="fixed top-0 w-full z-50 glass border-b border-ghborder">
          <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 select-none no-underline">
              <img src="/assets/image/GitHub_Club.jpg" className="h-16 w-auto object-contain" alt="GitHub Club Logo" />
              <span className="hidden sm:block font-semibold text-xl text-white">GitHub Club · SIT-H</span>
            </Link>

            <nav className="flex gap-8 font-mono font-semibold">
              <Link to="/" className="nav-link interactive">~/home</Link>
              <Link to="/events" className="nav-link interactive">~/events</Link>
              <Link to="/about" className="nav-link interactive">~/about</Link>
              <Link to="/symbihackathon" className="nav-link interactive">~/symbihackathon</Link>
              <Link to="/contact" className="nav-link interactive">~/contact</Link>
            </nav>
          </div>
        </header>
      )}

      {/* MAIN CONTENT */}
      <main className={`flex-grow ${!isHackathon ? 'pt-20' : ''}`}>
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-ghborder py-12 text-center text-sm text-ghmuted">
        <div className="flex justify-center items-center gap-6 mb-4 font-mono">
           <a href="#" className="interactive hover:text-white transition-colors">
              <i className="fa-brands fa-instagram text-xl"></i>
          </a>
          <a href="#" className="interactive hover:text-white transition-colors">
              <i className="fa-brands fa-linkedin text-xl"></i>
          </a>
          <a href="https://sithyd.edu.in/" target="_blank" rel="noreferrer" className="interactive hover:text-white transition-colors border-l border-ghborder pl-6 flex items-center">
              <i className="fa-solid fa-globe text-xl mr-2"></i>
              SIT Hyderabad
          </a>
        </div>
        <p>© 2026 GitHub Club · SIT Hyderabad</p>
      </footer>
    </div>
  );
}
