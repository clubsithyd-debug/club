import React from "react";
import { motion } from "framer-motion";
import ProblemStatementTable from "../components/ProblemStatementTable";
import HackathonNav from "./hackathon/HackathonNav";
import CyberpunkCursor from "../components/CyberpunkCursor";

export default function ProblemStatements() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: "#080808", minHeight: "100vh", position: "relative", paddingBottom: "80px", fontFamily: '"Share Tech Mono", monospace' }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet"/>
      <div style={{ position:"fixed", top:0, left:0, right:0, height:"4px", background:"repeating-linear-gradient(90deg,#FFE900 0,#FFE900 20px,#080808 20px,#080808 40px)", zIndex:9990, pointerEvents:"none" }}/>
      <div style={{ position:"fixed", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,233,0,0.015) 3px,rgba(255,233,0,0.015) 4px)", pointerEvents:"none", zIndex:1 }}/>
      <ProblemStatementTable isPage={true} />
      <CyberpunkCursor/><HackathonNav />
    </motion.div>
  );
}
