import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';
import MatrixRain from '../components/MatrixRain';
import VantaGlobe from '../components/VantaGlobe';
import StatsCounter from '../components/StatsCounter';
import FloatingIcons from '../components/FloatingIcons';
import TerminalEasterEgg from '../components/TerminalEasterEgg';

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setIsTerminalOpen(true);
      setClickCount(0);
    }
  };

  return (
    <div className="flex flex-col relative">
      <FloatingIcons />
      <TerminalEasterEgg isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* HERO SECTION */}
      <section id="home" className="w-full min-h-[95vh] flex flex-col justify-center items-start py-12 px-6 md:px-16 lg:px-24 relative border-b border-ghborder/30 overflow-hidden">
        <VantaGlobe />

        <div className="w-full max-w-5xl relative z-10 text-left">
          <div className="max-w-4xl text-left">
            <h1 className="font-mono font-extrabold text-5xl sm:text-6xl lg:text-7xl mb-8 text-left">
              <TypeAnimation
                sequence={[
                  'Code.',
                  2500,
                  'Collaborate.',
                  2500,
                  'Community.',
                  2500,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-white"
              />
            </h1>

            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white select-none cursor-help text-left" onClick={handleLogoClick}>
              GitHub Club · SIT Hyderabad
            </h2>

            <p className="text-ghmuted text-lg mb-6 leading-relaxed max-w-2xl text-left">
              The official GitHub Student Club of Symbiosis Institute of Technology, Hyderabad.
              Fostering open-source culture through collaboration and real-world developer skills.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-xl font-bold mb-3 text-ghgreen">Who We Are</h3>
                <p className="text-ghmuted leading-relaxed">
                  We are developers, designers, and tech enthusiasts united by a passion for
                  building, learning, and contributing to the open-source community.
                </p>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <h3 className="text-xl font-bold mb-3 text-ghgreen">What We Do</h3>
                <p className="text-ghmuted leading-relaxed">
                  Through hands-on workshops, competitive hackathons, and peer-driven sessions, we transform theoretical knowledge into practical skills.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-start gap-4">
              <Link to="/events" className="btn-primary">
                Explore Events
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <StatsCounter />

      {/* UPCOMING EVENT */}
      <section id="events" className="w-full py-24 px-6 md:px-16 lg:px-24 border-t border-ghborder/30">
        <div className="event-card rounded-2xl p-12 flex flex-col items-center text-center max-w-none hover:shadow-ghgreen/10 shadow-2xl">
          <p className="text-ghgreen text-xs font-mono uppercase tracking-widest mb-2">
            Upcoming Event
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white"><span className="text-ghgreen">SymbiHackathon</span> 2026</h2>

          <Link to="/symbihackathon" className="btn-primary mt-8">
            View Details
          </Link>
        </div>
      </section>

      {/* QUOTE */}
      <section id="about" className="w-full py-24 px-6 md:px-16 lg:px-24 bg-ghpanel/30">
        <blockquote className="border-l-4 border-ghgreen pl-8 text-ghmuted italic text-xl leading-relaxed">
          <span className="text-white">“Programs must be written for people to read, and only incidentally for machines to execute.”</span>
          <span className="block mt-4 not-italic text-base text-ghtext">— Harold Abelson, Structure and Interpretation of Computer Programs</span>
        </blockquote>
      </section>
    </div>
  );
}
