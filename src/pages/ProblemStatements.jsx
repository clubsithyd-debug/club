import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProblemStatementTable from '../components/ProblemStatementTable';
import HackathonNav from './hackathon/HackathonNav';

export default function ProblemStatements() {
  const location = useLocation();
  const isHackathonPage = location.pathname.startsWith('/symbihackathon');

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#0d1117] relative pb-24"
    >
      <ProblemStatementTable isPage={true} />
      {/* Show Hackathon Nav only if accessed via /symbihackathon route */}
      {isHackathonPage && <HackathonNav />}
    </motion.div>
  );
}