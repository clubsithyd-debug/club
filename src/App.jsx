import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import SymbiHackathon from './pages/SymbiHackathon';
import ProblemStatements from './pages/ProblemStatements';
import Contact from './pages/Contact';

// Hackathon Pages
import Sponsors from './pages/hackathon/Sponsors';
import Schedule from './pages/hackathon/Schedule';
import Rules from './pages/hackathon/Rules';
import Committee from './pages/hackathon/Committee';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        
        {/* Hackathon Parent Route */}
        <Route path="/symbihackathon" element={<SymbiHackathon />} />
        
        {/* Hackathon Sub-routes */}
        <Route path="/symbihackathon/problems" element={<ProblemStatements />} />
        <Route path="/symbihackathon/sponsors" element={<Sponsors />} />
        <Route path="/symbihackathon/schedule" element={<Schedule />} />
        <Route path="/symbihackathon/rules" element={<Rules />} />
        <Route path="/symbihackathon/committee" element={<Committee />} />
        
        <Route path="/problem-statements" element={<ProblemStatements />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
}

export default App;
