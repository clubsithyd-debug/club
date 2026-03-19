import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, Award, Users, BookOpen, Mic2, Trophy } from 'lucide-react';
import EventModal from '../components/EventModal';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const pastEvents = [
    {
      id: "past-ethical-hacking",
      type: "Workshop + Hackathon",
      icon: <Award className="w-5 h-5" />,
      title: "Ethical Hacking Workshop + One-Day Hackathon",
      description: "A comprehensive deep dive into the world of cybersecurity. Attendees explored ethical hacking fundamentals, participated in hands-on labs, and competed in a final 24-hour Capture The Flag (CTF) style hackathon.",
      instructor: "Mr. Srujan Atluri",
      date: "January 22-24, 2026",
      mode: "Offline",
      venue: "Computer Lab 05, SIT Hyderabad",
      coordinators: ["Dr. Salakapuri Rakesh", "Dr. Kiran Siripuri"],
      outcomes: [
        "Hands-on understanding of network and web security testing workflows",
        "Experience with real-world style challenges in a controlled environment",
        "Team collaboration and time-bound problem solving",
        "Core cybersecurity concepts and responsible ethical hacking practices"
      ],
      gallery: [
        "/assets/image/events/image7.jpeg",
        "/assets/image/events/image10.jpeg",
        "/assets/image/events/image9.jpeg",
        "/assets/image/events/image13.jpeg",
        "/assets/image/events/image12.jpeg",
        "/assets/image/events/image6.jpeg"
      ],
      pdf: "/assets/docs/ethical-hacking-workshop-schedule.pdf"
    },
    {
      id: "past-open-source",
      type: "Talk",
      icon: <Mic2 className="w-5 h-5" />,
      title: "Introduction to Open Source",
      description: "A beginner-friendly session on how to start contributing to open source projects, understanding Git/GitHub, and the impact of community-driven software.",
      instructor: "Club Leads",
      date: "August 15, 2025",
      mode: "Online",
      venue: "Google Meet",
      coordinators: ["Student Core Team"],
      outcomes: [
        "Setting up Git for the first time",
        "Making a first Pull Request",
        "Understanding licensing and community norms"
      ],
      gallery: [],
      pdf: "/assets/pdf/open-source-talk.pdf"
    }
  ];

  return (
    <motion.div 
      className="flex flex-col text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <section className="w-full py-16 px-6 md:px-16 lg:px-24 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ghgreen/5 blur-[120px] rounded-full -z-10" />

        <motion.div variants={itemVariants} className="mb-4">
          <span className="text-ghgreen font-mono text-xl">~/events</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-12">Events</motion.h1>

        {/* UPCOMING EVENTS */}
        <div className="mb-24">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-bold text-white border-l-4 border-ghgreen pl-4 mb-8"
          >
            Upcoming Events
          </motion.h2>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group relative bg-ghpanel/40 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center lg:items-start gap-8 cursor-pointer overflow-hidden shadow-2xl backdrop-blur-sm"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-ghgreen/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex-1 relative z-10 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-ghgreen text-[10px] font-mono uppercase tracking-widest bg-ghgreen/10 px-3 py-1 rounded-full border border-ghgreen/30">
                  Flagship Hackathon
                </span>
                <span className="text-white/60 text-[10px] font-mono uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  Registration Open
                </span>
              </div>

              <h3 className="text-3xl font-bold text-white group-hover:text-ghgreen transition-colors">SymbiHackathon 2026</h3>
              
              <p className="text-ghmuted text-base leading-relaxed max-w-xl">
                Our biggest event of the year. Build, innovate, and compete with the best minds on campus over 48 hours of uninterrupted coding.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 font-mono text-xs text-ghmuted">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-ghgreen" />
                  <span>SIT, Hyderabad</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-ghgreen" />
                  <span>April 24-26, 2026</span>
                </div>
              </div>

              <div className="pt-2">
                <button className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm">
                  Register Now <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/4 aspect-square bg-ghgreen/5 rounded-2xl flex items-center justify-center border border-ghgreen/20 group-hover:border-ghgreen/40 transition-colors relative overflow-hidden">
               <Trophy className="w-24 h-24 text-ghgreen/20 group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <img src="/assets/image/logo.png" alt="SymbiHack" className="w-32 h-32 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
               </div>
            </div>
          </motion.div>
        </div>

        {/* PAST EVENTS */}
        <div className="mb-24">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-white border-l-4 border-white/20 pl-4">Past Events</h2>
            <span className="text-sm font-mono text-ghmuted bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              {pastEvents.length} Total
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedEvent(event)}
                className="group cursor-pointer bg-ghpanel/40 border border-white/5 hover:border-ghgreen/30 p-8 rounded-2xl transition-all shadow-xl backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <ExternalLink className="w-5 h-5 text-ghgreen" />
                </div>

                <div className="w-12 h-12 rounded-xl bg-ghgreen/10 flex items-center justify-center text-ghgreen mb-6 group-hover:scale-110 transition-transform">
                  {event.icon}
                </div>

                <span className="text-ghgreen text-xs font-mono uppercase tracking-wider">{event.type}</span>
                <h3 className="font-bold text-xl mt-4 mb-4 text-white group-hover:text-ghgreen transition-colors leading-tight">
                  {event.title}
                </h3>
                <p className="text-ghmuted text-sm leading-relaxed line-clamp-3 mb-8">
                  {event.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-ghmuted font-mono">
                    <Calendar className="w-3 x-3" />
                    {event.date}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-ghgreen opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN US / LOCATION SECTION */}
      <section className="w-full py-24 px-6 md:px-16 lg:px-24 border-t border-white/5 bg-gradient-to-b from-transparent to-ghgreen/5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-4xl font-bold">Find Our Campus</h2>
            <p className="text-ghmuted text-lg leading-relaxed">
              We host most of our events at the SIT Hyderabad campus. Our state-of-the-art labs and innovation centers provide the perfect environment for hacking and collaboration.
              <br /><br />
              Check out the map to find your way to our next big workshop or hackathon!
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <div className="flex items-center gap-4 p-4 rounded-2xl bg-ghpanel/50 border border-white/10">
                  <Users className="w-8 h-8 text-ghgreen" />
                  <div>
                    <h4 className="font-bold">Active Community</h4>
                    <p className="text-xs text-ghmuted">500+ Members and counting</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-2xl bg-ghpanel/50 border border-white/10">
                  <BookOpen className="w-8 h-8 text-ghgreen" />
                  <div>
                    <h4 className="font-bold">Learning Focus</h4>
                    <p className="text-xs text-ghmuted">Hands-on technical sessions</p>
                  </div>
               </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-ghpanel/60 border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 text-ghgreen">
              <MapPin className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Event Venue</h3>
            </div>
            <p className="text-ghmuted leading-relaxed text-sm">
              Survey Number 292, Off Bangalore Highway, Modallaguda (V), Nandigama (M),<br />
              Rangareddy Dist, Hyderabad, Telangana, India, Pin Code: 509217
            </p>
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.735626279414!2d78.27117497516704!3d17.037563083789547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc9077977759bcf%3A0x6b776ec0e729a071!2sSymbiosis%20Institute%20of%20Technology%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="SIT Hyderabad Map"
                className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              ></iframe>
            </div>
            <a 
              href="https://www.google.com/maps/search/Survey+Number+292,+Off+Bangalore+Highway,+Modallaguda,+Nandigama,+Rangareddy+Dist,+Hyderabad,+Telangana+509217/@17.150794,78.21215,16z?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ghgreen hover:underline font-mono text-sm group"
            >
              Open in Google Maps <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* MODAL */}
      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </motion.div>
  );
}
