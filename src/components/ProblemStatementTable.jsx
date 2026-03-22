import React, { useEffect, useMemo, useState } from "react";
import { sampleProblems } from "../data/hackathonData";

let globalMuted = false;
function playShock() {
  if (globalMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime; const dur = 0.18;
    const buf = ctx.createBuffer(1, ctx.sampleRate*dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.04));
    const noise = ctx.createBufferSource(); noise.buffer=buf;
    const bp = ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=4000; bp.Q.value=0.8;
    const hs = ctx.createBiquadFilter(); hs.type="highshelf"; hs.frequency.value=3000; hs.gain.value=14;
    const gN = ctx.createGain(); gN.gain.setValueAtTime(1.4,now); gN.gain.exponentialRampToValueAtTime(0.001,now+dur);
    noise.connect(bp); bp.connect(hs); hs.connect(gN); gN.connect(ctx.destination);
    noise.start(now); noise.stop(now+dur);
    [0,0.03,0.07].forEach(off=>{
      const osc=ctx.createOscillator(); osc.type="sawtooth";
      osc.frequency.setValueAtTime(180+Math.random()*120,now+off);
      osc.frequency.exponentialRampToValueAtTime(40,now+off+0.06);
      const gO=ctx.createGain(); gO.gain.setValueAtTime(0.5,now+off); gO.gain.exponentialRampToValueAtTime(0.001,now+off+0.06);
      const ws=ctx.createWaveShaper(); const cv=new Float32Array(256);
      for(let i=0;i<256;i++){const x=(i*2)/256-1; cv[i]=(Math.PI+400)*x/(Math.PI+400*Math.abs(x));}
      ws.curve=cv; osc.connect(ws); ws.connect(gO); gO.connect(ctx.destination);
      osc.start(now+off); osc.stop(now+off+0.07);
    });
    const thud=ctx.createOscillator(); thud.type="sine";
    thud.frequency.setValueAtTime(80,now); thud.frequency.exponentialRampToValueAtTime(20,now+0.1);
    const gT=ctx.createGain(); gT.gain.setValueAtTime(0.7,now); gT.gain.exponentialRampToValueAtTime(0.001,now+0.12);
    thud.connect(gT); gT.connect(ctx.destination); thud.start(now); thud.stop(now+0.12);
  } catch(e){}
}

const CSV_PATH = "/assets/data/problems.csv";

const CP = {
  bg:       "#080808",
  bgCard:   "#0C0A06",
  bgPanel:  "#0f0d08",
  yellow:   "#FFE900",
  yellowDim:"rgba(255,233,0,0.15)",
  red:      "#FF003C",
  chrome:   "#C0C0C0",
  dim:      "#4A4232",
  border:   "rgba(255,233,0,0.18)",
  borderRed:"rgba(255,0,60,0.3)",
};

const S = {
  page: { padding:"clamp(40px,6vw,80px) clamp(20px,5vw,60px)", position:"relative", zIndex:2 },
  heroGrid: { display:"grid", gridTemplateColumns:"1fr auto", gap:"40px", alignItems:"end", marginBottom:"48px" },
  kicker: { fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", letterSpacing:"0.3em", color:CP.red, textTransform:"uppercase", marginBottom:"12px" },
  h1: { fontFamily:'"Bebas Neue",cursive', fontSize:"clamp(36px,6vw,80px)", color:CP.yellow, textShadow:`0 0 2px ${CP.yellow}, 0 0 20px rgba(255,233,0,0.4), 4px 4px 0 ${CP.red}`, letterSpacing:"0.04em", lineHeight:1, margin:"0 0 12px" },
  desc: { fontFamily:'"Barlow Condensed",sans-serif', fontSize:"15px", color:CP.dim, lineHeight:1.7, maxWidth:"560px", borderLeft:`2px solid rgba(255,233,0,0.15)`, paddingLeft:"14px" },
  statsRow: { display:"flex", gap:"1px", background:"rgba(255,233,0,0.06)" },
  statBox: { padding:"20px 28px", background:CP.bgCard, borderTop:`3px solid ${CP.yellow}`, minWidth:"120px", textAlign:"center" },
  statLabel: { fontFamily:'"Share Tech Mono",monospace', fontSize:"9px", letterSpacing:"0.2em", color:CP.dim, marginBottom:"8px", textTransform:"uppercase" },
  statVal: { fontFamily:'"Bebas Neue",cursive', fontSize:"clamp(28px,4vw,44px)", color:CP.yellow, textShadow:`0 0 10px rgba(255,233,0,0.4), 2px 2px 0 ${CP.red}` },
  panel: { background:CP.bgCard, border:`1px solid ${CP.border}`, borderTop:`3px solid ${CP.yellow}`, borderLeft:`3px solid ${CP.red}`, padding:"24px", marginBottom:"0", position:"relative", overflow:"hidden" },
  filterGrid: { display:"grid", gridTemplateColumns:"1fr repeat(3, auto) auto", gap:"8px", marginBottom:"16px", alignItems:"stretch" },
  filterBox: { background:CP.bg, border:`1px solid rgba(255,233,0,0.12)`, padding:"10px 14px", display:"flex", alignItems:"center", gap:"8px", fontFamily:'"Share Tech Mono",monospace', fontSize:"11px", color:CP.yellow },
  filterLabel: { color:CP.dim, fontSize:"9px", letterSpacing:"0.15em", marginRight:"4px", whiteSpace:"nowrap" },
  select: { background:"transparent", border:"none", color:CP.yellow, fontFamily:'"Share Tech Mono",monospace', fontSize:"11px", outline:"none", cursor:"crosshair", width:"100%" },
  input: { background:"transparent", border:"none", color:CP.yellow, fontFamily:'"Share Tech Mono",monospace', fontSize:"11px", outline:"none", width:"100%", placeholder:CP.dim },
  csvBtn: { background:CP.yellow, color:CP.bg, fontFamily:'"Bebas Neue",cursive', fontSize:"15px", letterSpacing:"0.15em", border:"none", padding:"10px 20px", cursor:"crosshair", clipPath:"polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)", boxShadow:`0 0 14px rgba(255,233,0,0.3), 2px 2px 0 ${CP.red}`, display:"flex", alignItems:"center", gap:"6px", whiteSpace:"nowrap" },
  clearBtn: { background:"transparent", color:CP.dim, fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", letterSpacing:"0.15em", border:`1px solid rgba(255,233,0,0.15)`, padding:"10px 16px", cursor:"crosshair" },
  statusRow: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", flexWrap:"wrap", gap:"8px" },
  chip: { display:"inline-flex", alignItems:"center", gap:"6px", fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", letterSpacing:"0.1em", color:CP.yellow, border:`1px solid rgba(255,233,0,0.2)`, padding:"4px 12px", background:"rgba(255,233,0,0.04)" },
  pageChip: { fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", letterSpacing:"0.15em", color:CP.dim, border:`1px solid rgba(255,233,0,0.1)`, padding:"6px 14px", background:CP.bgCard },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { fontFamily:'"Share Tech Mono",monospace', fontSize:"9px", letterSpacing:"0.2em", color:CP.dim, textTransform:"uppercase", padding:"10px 14px", textAlign:"left", borderBottom:`1px solid rgba(255,233,0,0.1)`, background:CP.bg },
  td: { padding:"12px 14px", borderBottom:`1px solid rgba(255,233,0,0.06)`, verticalAlign:"top" },
  idCell: { fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", letterSpacing:"0.15em", color:CP.yellow },
  titleCell: { fontFamily:'"Barlow Condensed",sans-serif', fontSize:"15px", fontWeight:600, color:"#D4C99A" },
  badge: { display:"inline-block", fontFamily:'"Share Tech Mono",monospace', fontSize:"9px", letterSpacing:"0.15em", textTransform:"uppercase", color:CP.red, border:`1px solid rgba(255,0,60,0.3)`, padding:"3px 8px", background:"rgba(255,0,60,0.06)", whiteSpace:"nowrap" },
  descCell: { fontFamily:'"Barlow Condensed",sans-serif', fontSize:"13px", color:CP.dim, lineHeight:1.6, maxWidth:"360px" },
  actionBtn: { background:CP.bgCard, border:`1px solid rgba(255,233,0,0.15)`, color:CP.yellow, padding:"6px 10px", cursor:"crosshair", fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", letterSpacing:"0.1em", display:"inline-flex", alignItems:"center", gap:"4px", transition:"all 0.15s" },
  mobileCard: { background:CP.bgCard, border:`1px solid rgba(255,233,0,0.1)`, borderLeft:`3px solid ${CP.red}`, padding:"16px", marginBottom:"8px" },
  paginationBtn: { background:CP.bgCard, border:`1px solid rgba(255,233,0,0.15)`, color:CP.yellow, padding:"8px 14px", cursor:"crosshair", fontFamily:'"Share Tech Mono",monospace', fontSize:"12px" },
  modal: { position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.88)", padding:"16px" },
  modalBox: { background:CP.bgCard, border:`1px solid rgba(255,233,0,0.2)`, borderTop:`3px solid ${CP.yellow}`, borderLeft:`3px solid ${CP.red}`, maxWidth:"760px", width:"100%", maxHeight:"88vh", overflowY:"auto", padding:"clamp(20px,4vw,40px)", position:"relative" },
};

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && inQuotes && line[i+1] === '"') { current += '"'; i++; continue; }
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { values.push(current.trim()); current = ""; continue; }
    current += ch;
  }
  values.push(current.trim());
  return values;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must include a header and at least one row.");
  const headerRow = parseCSVLine(lines[0]).map(h=>h.toLowerCase());
  const indexOf = (c) => headerRow.findIndex(h=>c.includes(h));
  const snoIndex = indexOf(["sno","s.no","serial","serial number","#"]);
  const idIndex = indexOf(["id","statement id","problem id","problem statement id"]);
  const titleIndex = indexOf(["title","problem title","problem name"]);
  const domainIndex = indexOf(["domain","track","category","domain/track"]);
  const descriptionIndex = indexOf(["description","desc","problem statement","details"]);
  if (titleIndex === -1) throw new Error("Could not find a title column in the CSV.");
  return lines.slice(1).map((line,i) => {
    const v = parseCSVLine(line);
    return { sno: Number(v[snoIndex])||i+1, id: v[idIndex]||`SH26-${String(i+1).padStart(3,"0")}`, title: v[titleIndex]||"Untitled problem", domain: v[domainIndex]||"General", description: v[descriptionIndex]||"Description coming soon." };
  });
}

function downloadProblemText(problem) {
  const content = ["SymbiHackathon 2026 Problem Statement","".padEnd(40,"="),`S.No: ${problem.sno}`,`Statement ID: ${problem.id}`,`Title: ${problem.title}`,`Domain: ${problem.domain}`,"",problem.description].join("\n");
  const blob = new Blob([content],{type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download=`${problem.id}.txt`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function downloadCsv(rows) {
  if(!rows.length) return;
  const header = ["S.No","Statement ID","Title","Domain","Description"];
  const csvRows = rows.map(r=>[r.sno,r.id,`"${r.title.replace(/"/g,'""')}"`,`"${r.domain.replace(/"/g,'""')}"`,`"${r.description.replace(/"/g,'""')}"`].join(","));
  const blob = new Blob([[header.join(","),...csvRows].join("\n")],{type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download="symbihackathon_problems.csv";
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

export default function ProblemStatementTable({ onClose, isPage=false }) {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [sortKey, setSortKey] = useState("sno");
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  useEffect(() => {
    const unlock = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
    };
    document.addEventListener("mousedown", unlock);
    document.addEventListener("mousemove", unlock);
    document.addEventListener("keydown", unlock);
    return () => {
      document.removeEventListener("mousedown", unlock);
      document.removeEventListener("mousemove", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(CSV_PATH);
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const parsed = parseCSV(await res.text());
        if(!parsed.length) throw new Error("Empty CSV");
        setAllData(parsed);
      } catch {
        setAllData(sampleProblems);
        setWarning("// FALLBACK DATA LOADED");
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const domains = useMemo(()=>[...new Set(allData.map(r=>r.domain))].sort(),[allData]);

  const filteredData = useMemo(()=>{
    const q = searchTerm.trim().toLowerCase();
    const filtered = allData.filter(r=>{
      const matchD = domainFilter ? r.domain===domainFilter : true;
      const matchQ = q ? [r.id,r.title,r.domain,r.description,r.sno].some(v=>String(v).toLowerCase().includes(q)) : true;
      return matchD && matchQ;
    });
    filtered.sort((a,b)=>{
      if(sortKey==="sno") return sortDirection==="asc" ? Number(a.sno)-Number(b.sno) : Number(b.sno)-Number(a.sno);
      return sortDirection==="asc" ? String(a[sortKey]).localeCompare(String(b[sortKey])) : String(b[sortKey]).localeCompare(String(a[sortKey]));
    });
    return filtered;
  },[allData,domainFilter,searchTerm,sortDirection,sortKey]);

  const totalPages = Math.max(1,Math.ceil(filteredData.length/rowsPerPage));
  useEffect(()=>setCurrentPage(1),[searchTerm,domainFilter,sortKey,sortDirection,rowsPerPage]);
  useEffect(()=>{ if(currentPage>totalPages) setCurrentPage(totalPages); },[currentPage,totalPages]);

  const displayedData = useMemo(()=>{
    const start=(currentPage-1)*rowsPerPage;
    return filteredData.slice(start,start+rowsPerPage);
  },[currentPage,filteredData,rowsPerPage]);

  const rangeStart = filteredData.length===0 ? 0 : (currentPage-1)*rowsPerPage+1;
  const rangeEnd = Math.min(currentPage*rowsPerPage,filteredData.length);

  const content = (
    <div style={S.page}>
      {isPage && (
        <div style={{ marginBottom:"48px" }}>
          <div style={S.heroGrid}>
            <div>
              <p style={S.kicker}>// MISSION ARCHIVE &nbsp; ?</p>
              <h1 style={S.h1}>Problem Statements</h1>
              <p style={S.desc}>Browse the challenge bank. Filter by track, search by keyword, download individual statements or the full archive as CSV.</p>
            </div>
            <div style={S.statsRow}>
              <div style={S.statBox}>
                <div style={S.statLabel}>// PROBLEMS</div>
                <div style={S.statVal}>{allData.length}</div>
              </div>
              <div style={{...S.statBox, borderTopColor:CP.red}}>
                <div style={S.statLabel}>// TRACKS</div>
                <div style={{...S.statVal, color:CP.red, textShadow:`0 0 10px rgba(255,0,60,0.4), 2px 2px 0 ${CP.yellow}`}}>{domains.length}</div>
              </div>
              <div style={{...S.statBox, borderTopColor:CP.chrome}}>
                <div style={S.statLabel}>// VISIBLE</div>
                <div style={{...S.statVal, color:CP.chrome, textShadow:"none"}}>{displayedData.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={S.panel}>
        <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(255,233,0,0.012) 18px,rgba(255,233,0,0.012) 19px)", pointerEvents:"none" }}/>

        <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto auto", gap:"6px", marginBottom:"14px", position:"relative", zIndex:2, flexWrap:"wrap" }}>
          <div style={S.filterBox}>
            <span style={{ color:CP.red, fontSize:"10px" }}>&#9656;</span>
            <span style={S.filterLabel}>SEARCH:</span>
            <input style={S.input} type="text" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="title, ID, domain, keyword..." />
          </div>
          <div style={S.filterBox}>
            <span style={S.filterLabel}>TRACK:</span>
            <select style={S.select} value={domainFilter} onChange={e=>{setDomainFilter(e.target.value);playShock();}}>
              <option value="">ALL</option>
              {domains.map(d=><option key={d} value={d} style={{ background:CP.bg }}>{d}</option>)}
            </select>
          </div>
          <div style={S.filterBox}>
            <span style={S.filterLabel}>SORT:</span>
            <select style={S.select} value={`${sortKey}:${sortDirection}`} onChange={e=>{ const [k,d]=e.target.value.split(":"); setSortKey(k); setSortDirection(d); }}>
              <option value="sno:asc" style={{ background:CP.bg }}>S.No ASC</option>
              <option value="sno:desc" style={{ background:CP.bg }}>S.No DESC</option>
              <option value="id:asc" style={{ background:CP.bg }}>ID ASC</option>
              <option value="title:asc" style={{ background:CP.bg }}>TITLE A-Z</option>
              <option value="title:desc" style={{ background:CP.bg }}>TITLE Z-A</option>
              <option value="domain:asc" style={{ background:CP.bg }}>TRACK A-Z</option>
            </select>
          </div>
          <div style={S.filterBox}>
            <span style={S.filterLabel}>PER PAGE:</span>
            <select style={S.select} value={rowsPerPage} onChange={e=>{setRowsPerPage(Number(e.target.value));playShock();}}>
              <option value={8} style={{ background:CP.bg }}>8</option>
              <option value={12} style={{ background:CP.bg }}>12</option>
              <option value={16} style={{ background:CP.bg }}>16</option>
            </select>
          </div>
          <div style={{ display:"flex", gap:"6px" }}>
            <button style={S.csvBtn} onClick={()=>{downloadCsv(filteredData);playShock();}}>&#8595; CSV</button>
            {(searchTerm||domainFilter) && <button style={S.clearBtn} onClick={()=>{ setSearchTerm(""); setDomainFilter(""); }}>CLR</button>}
          </div>
        </div>

        <div style={{ ...S.statusRow, position:"relative", zIndex:2 }}>
          <div style={S.chip}>? SHOWING {rangeStart}–{rangeEnd} OF {filteredData.length}</div>
          {warning && <div style={{ ...S.chip, color:CP.red, borderColor:CP.borderRed }}>{warning}</div>}
          <div style={S.pageChip}>PAGE {currentPage} / {totalPages}</div>
        </div>

        <div style={{ position:"relative", zIndex:2 }}>
          {loading ? (
            <div style={{ minHeight:"300px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px" }}>
              <div style={{ width:"32px", height:"32px", border:`2px solid ${CP.yellow}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
              <p style={{ fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", letterSpacing:"0.2em", color:CP.dim }}>// PARSING ARCHIVE...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div style={{ minHeight:"300px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"12px" }}>
              <p style={{ fontFamily:'"Bebas Neue",cursive', fontSize:"32px", color:CP.yellow }}>NO RESULTS</p>
              <p style={{ fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", color:CP.dim, letterSpacing:"0.15em" }}>// TRY A DIFFERENT QUERY OR RESET FILTERS</p>
            </div>
          ) : (
            <>
              <div style={{ display:"none" }} className="cp-mobile-cards">
                {displayedData.map(p=>(
                  <div key={p.id} style={S.mobileCard}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                      <span style={S.idCell}>{p.id}</span>
                      <span style={S.badge}>{p.domain}</span>
                    </div>
                    <p style={{ ...S.titleCell, marginBottom:"8px" }}>{p.title}</p>
                    <p style={{ ...S.descCell, marginBottom:"12px" }}>{p.description.slice(0,160)}{p.description.length>160?"...":""}</p>
                    <div style={{ display:"flex", gap:"8px" }}>
                      <button style={S.actionBtn} onClick={()=>setSelectedProblem(p)}>&#9654; VIEW</button>
                      <button style={{ ...S.actionBtn, color:CP.dim }} onClick={()=>downloadProblemText(p)}>&#8595; SAVE</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ overflowX:"auto" }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {["S.NO","STATEMENT ID","TITLE","TRACK","DESCRIPTION","ACTIONS"].map(h=>(
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.map((p,i)=>(
                      <tr key={p.id}
                        onMouseEnter={()=>{setHoverRow(p.id);setTimeout(playShock,50);}}
                        onMouseLeave={()=>setHoverRow(null)}
                        style={{ background: hoverRow===p.id ? "rgba(255,233,0,0.03)" : i%2===0 ? CP.bg : "rgba(255,233,0,0.01)", transition:"background 0.15s" }}
                      >
                        <td style={{ ...S.td, fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", color:CP.dim }}>{p.sno}</td>
                        <td style={{ ...S.td, ...S.idCell }}>{p.id}</td>
                        <td style={{ ...S.td, ...S.titleCell }}>{p.title}</td>
                        <td style={S.td}><span style={S.badge}>{p.domain}</span></td>
                        <td style={{ ...S.td, ...S.descCell }}>{p.description.slice(0,140)}{p.description.length>140?"...":""}</td>
                        <td style={S.td}>
                          <div style={{ display:"flex", gap:"6px" }}>
                            <button style={S.actionBtn} onClick={()=>setSelectedProblem(p)} title="View">&#9654;</button>
                            <button style={{ ...S.actionBtn, color:CP.dim }} onClick={()=>downloadProblemText(p)} title="Download">&#8595;</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {!loading && filteredData.length>0 && (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"20px", paddingTop:"16px", borderTop:`1px solid rgba(255,233,0,0.08)`, position:"relative", zIndex:2, flexWrap:"wrap", gap:"12px" }}>
            <p style={{ fontFamily:'"Share Tech Mono",monospace', fontSize:"10px", color:CP.dim, letterSpacing:"0.1em" }}>// USE SEARCH + FILTERS BEFORE DOWNLOADING</p>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              <button style={{ ...S.paginationBtn, opacity: currentPage===1 ? 0.3 : 1 }} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1}>&#8592;</button>
              <div style={S.pageChip}>{currentPage} / {totalPages}</div>
              <button style={{ ...S.paginationBtn, opacity: currentPage===totalPages ? 0.3 : 1 }} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages}>&#8594;</button>
            </div>
          </div>
        )}
      </div>

      {selectedProblem && (
        <div style={S.modal} onClick={()=>setSelectedProblem(null)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelectedProblem(null)} style={{ position:"absolute", top:"16px", right:"16px", background:"transparent", border:`1px solid rgba(255,233,0,0.2)`, color:CP.yellow, padding:"6px 10px", cursor:"crosshair", fontFamily:'"Share Tech Mono",monospace', fontSize:"12px" }}>&#10005;</button>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"20px" }}>
              <span style={{ ...S.idCell, border:`1px solid rgba(255,233,0,0.3)`, padding:"4px 12px", background:"rgba(255,233,0,0.06)" }}>{selectedProblem.id}</span>
              <span style={S.badge}>{selectedProblem.domain}</span>
            </div>
            <h2 style={{ ...S.h1, fontSize:"clamp(24px,4vw,48px)", marginBottom:"16px" }}>{selectedProblem.title}</h2>
            <p style={{ fontFamily:'"Barlow Condensed",sans-serif', fontSize:"16px", color:"#A09070", lineHeight:1.8, marginBottom:"28px" }}>{selectedProblem.description}</p>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <button style={S.csvBtn} onClick={()=>downloadProblemText(selectedProblem)}>&#8595; DOWNLOAD STATEMENT</button>
              <button style={S.clearBtn} onClick={()=>setSelectedProblem(null)}>CLOSE PANEL</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .cp-mobile-cards { display: block !important; }
          table { display: none; }
        }
      `}</style>
    </div>
  );

  if(isPage) return content;

  return (
    <div style={S.modal} onClick={onClose}>
      <div style={{ ...S.modalBox, maxWidth:"1200px", maxHeight:"90vh" }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute", top:"16px", right:"16px", background:"transparent", border:`1px solid rgba(255,233,0,0.2)`, color:CP.yellow, padding:"6px 10px", cursor:"crosshair", fontFamily:'"Share Tech Mono",monospace', fontSize:"12px" }}>&#10005;</button>
        {content}
      </div>
    </div>
  );
}
