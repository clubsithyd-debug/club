import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Monitor, Trophy, GitBranch, Users, Instagram, Linkedin, Globe, MapPin } from 'lucide-react';
import TeamCard from '../components/TeamCard';

export default function About() {
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

  const teamMembers = [
    { name: "Md Zakiur Rahman", role: "Chairperson", initial: "Chair" },
    { name: "Coming Soon", role: "Vice Chairperson", initial: "Vice" },
    { name: "Coming Soon", role: "Treasurer", initial: "Cash" },
    { name: "Coming Soon", role: "Secretary", initial: "Notes" },
    { name: "Coming Soon", role: "Content Developer", initial: "Create" },
    { name: "Coming Soon", role: "Executive Member", initial: "Exec" },
    { name: "Coming Soon", role: "Faculty In-Charge", initial: "Faculty" },
  ];

  const whatWeDo = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Workshops",
      desc: "Regular hands-on sessions covering Git, GitHub, version control, and modern development workflows. Learn industry best practices through practical exercises."
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Hackathons",
      desc: "Competitive coding events where creativity meets technical skills. Build innovative solutions, collaborate with peers, and win exciting prizes."
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Open Source",
      desc: "Contributing to real-world open-source projects. Build your portfolio, gain experience, and give back to the developer community."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      desc: "Building a supportive network of developers and learners. Peer mentorship, project collaborations, and lifelong connections."
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
          <span className="text-ghgreen font-mono text-xl">~/about</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={itemVariants} className="space-y-12">
            <div>
              <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
              <p className="text-ghmuted text-lg leading-relaxed">
                The GitHub Club at SIT Hyderabad exists to foster a culture of open-source development, collaboration, and continuous learning among students. We're not just a club — we're a community of passionate developers, designers, and tech enthusiasts united by our love for building and learning. We bridge the gap between classroom theory and industry practice by contributing to real-world projects that make an impact.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">About the Institute</h2>
              <p className="text-ghmuted text-lg leading-relaxed">
                Symbiosis Institute of Technology, Hyderabad — the flagship institute of the prestigious <strong className="text-white font-semibold">Symbiosis International (Deemed University)</strong> — is committed to delivering quality technical education that keeps pace with industry demands and technological advancement, nurturing faculty and students alike in an environment built for innovation, growth, and excellence.
              </p>
            </div>
          </motion.div>

          {/* Logo and Social Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center space-y-8 lg:sticky lg:top-32"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-ghgreen/20 rounded-full blur group-hover:bg-ghgreen/30 transition duration-500 opacity-75"></div>
              <img
                src="/assets/image/logo.png"
                alt="GitHub Club SIT Logo"
                className="relative w-64 h-64 sm:w-80 sm:h-80 object-contain rounded-full bg-black/50 p-4 border border-white/10"
              />
            </div>

            <div className="flex gap-4">
              {[
                { icon: <Instagram className="w-5 h-5" />, link: "#" },
                { icon: <Linkedin className="w-5 h-5" />, link: "#" },
                { icon: <Globe className="w-5 h-5" />, link: "#" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  className="p-3 rounded-full bg-ghpanel/50 border border-white/10 hover:border-ghgreen hover:text-ghgreen transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE DO SECTION */}
      <section className="w-full py-20 px-6 md:px-16 lg:px-24 bg-ghpanel/20">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-12">What We Do</motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatWeDo.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-ghpanel/40 border border-white/5 hover:border-ghgreen/30 p-8 rounded-2xl transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-ghgreen/10 flex items-center justify-center text-ghgreen mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-ghmuted text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LEADERSHIP TEAM */}
      <section className="w-full py-20 px-6 md:px-16 lg:px-24 relative border-t border-white/5">
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Leadership Team</h2>
          <p className="text-ghmuted">Our dedicated team works tirelessly to bring you amazing events and opportunities.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, i) => (
            <TeamCard key={i} member={member} />
          ))}
        </div>
      </section>

      {/* JOIN US */}
      <section className="w-full py-24 px-6 md:px-16 lg:px-24 border-t border-white/5 bg-gradient-to-b from-transparent to-ghgreen/5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-4xl font-bold">Join Us</h2>
            <p className="text-ghmuted text-lg leading-relaxed">
              Whether you're a complete beginner taking your first steps in coding, or an experienced developer looking to contribute to open source, there's a place for you in our community.
              <br /><br />
              We welcome students from all departments and skill levels. Join us at our next event and become part of something bigger!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events" className="btn-primary">Upcoming Events</Link>
              <Link to="/contact" className="btn-secondary">Contact Us</Link>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-ghpanel/60 border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 text-ghgreen">
              <MapPin className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Institute Address</h3>
            </div>
            <p className="text-ghmuted leading-relaxed">
              Survey Number 292, Off Bangalore Highway, Modallaguda (V), Nandigama (M),<br />
              Rangareddy Dist, Hyderabad, Telangana, India, Pin Code: 509217
            </p>
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.735626279414!2d78.27117497516704!3d17.037563083789547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc9077977759bcf%3A0x6b776ec0e729a071!2sSymbiosis%20Institute%20of%20Technology%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="SIT Hyderabad Map"
              ></iframe>
            </div>
            <a
              href="https://maps.app.goo.gl/..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ghgreen hover:underline font-mono text-sm"
            >
              Open in Maps ↗
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

