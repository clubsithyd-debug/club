import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Download, Eye, X, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const CSV_PATH = '/assets/data/problems.csv';

export default function ProblemStatementTable({ onClose, isPage = false }) {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // ── CSV Parser ────────────────────────────────────────────────────
  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');

    // Parse header — normalise to lowercase, trim
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

    // Map flexible column names
    const col = name => {
        const aliases = {
            sno:         ['sno','s.no','s no','serial','serial no','serial number','#'],
            id:          ['id','statement id','problem id','ps id','psid','statement_id','problem statement id'],
            title:       ['title','problem title','name','problem name','statement title','problem statement title'],
            domain:      ['domain','track','category','domain/track','domain bucket'],
            description: ['description','desc','details','problem description','problem statement'],
        };
        for (const [key, list] of Object.entries(aliases)) {
            if (list.includes(name)) return key;
        }
        return null;
    };

    const colMap = {};
    headers.forEach((h, i) => { const k = col(h); if (k) colMap[k] = i; });

    const required = ['title'];
    for (const r of required) {
        if (colMap[r] === undefined) throw new Error(`Missing required column: "${r}". Found: ${headers.join(', ')}`);
    }

    // Parse rows — handle quoted fields
    const parseRow = line => {
        const fields = [];
        let cur = '', inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQuote = !inQuote; }
            else if (ch === ',' && !inQuote) { fields.push(cur.trim()); cur = ''; }
            else { cur += ch; }
        }
        fields.push(cur.trim());
        return fields;
    };

    return lines.slice(1).filter(l => l.trim()).map((line, idx) => {
        const f = parseRow(line);
        const get = key => colMap[key] !== undefined ? (f[colMap[key]] || '').replace(/^"|"$/g, '').trim() : '';
        return {
            sno:         colMap.sno !== undefined ? parseInt(get('sno')) || (idx + 1) : idx + 1,
            id:          get('id')          || `PS-${String(idx + 1).padStart(3,'0')}`,
            title:       get('title'),
            domain:      get('domain')      || 'General',
            description: get('description') || '—',
        };
    });
  };

  // ── Auto Load CSV ─────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(CSV_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const data = parseCSV(text);
        if (data.length === 0) throw new Error('CSV has no data rows.');
        setAllData(data);
        setError(null);
      } catch (e) {
        console.error("Failed to load CSV", e);
        setError(`Could not load ${CSV_PATH} — ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Derived Data ──────────────────────────────────────────────────
  const domains = useMemo(() => {
    return [...new Set(allData.map(r => r.domain))].sort();
  }, [allData]);

  const filteredData = useMemo(() => {
    let res = [...allData];

    // Filter
    if (domainFilter) {
      res = res.filter(r => r.domain === domainFilter);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      res = res.filter(r => 
        [r.title, r.id, r.domain, r.description, String(r.sno)]
        .some(v => String(v).toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortConfig.key) {
      res.sort((a, b) => {
        let av = a[sortConfig.key] ?? '', bv = b[sortConfig.key] ?? '';
        
        if (sortConfig.key === 'sno') {
           // Ensure numeric sort for sno
           return sortConfig.direction === 'asc' ? av - bv : bv - av;
        }

        if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
        if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return res;
  }, [allData, domainFilter, searchTerm, sortConfig]);

  // Pagination Logic
  const totalItems = filteredData.length;
  const isAllRows = rowsPerPage === 'all';
  const totalPages = isAllRows ? 1 : Math.ceil(totalItems / rowsPerPage);
  
  // reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, domainFilter, rowsPerPage]);

  const displayedData = useMemo(() => {
    if (isAllRows) return filteredData;
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage, isAllRows]);

  // Use this to display range
  const rangeStart = isAllRows ? 1 : (currentPage - 1) * rowsPerPage + 1;
  const rangeEnd = isAllRows ? totalItems : Math.min(currentPage * rowsPerPage, totalItems);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDownloadRow = (row) => {
    const content = [
        `SymbiHackathon 2026 — Problem Statement`,
        `${'='.repeat(50)}`,
        `S.No:        ${row.sno}`,
        `Statement ID: ${row.id}`,
        `Title:        ${row.title}`,
        `Domain/Track: ${row.domain}`,
        ``,
        `Description:`,
        row.description,
        ``,
        `${'='.repeat(50)}`,
        `GitHub Club · SIT Hyderabad`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${row.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (filteredData.length === 0) return;
    const header = 'S.No,Statement ID,Title,Domain/Track,Description';
    const rows = filteredData.map(r =>
        [r.sno, `"${r.id}"`, `"${r.title.replace(/"/g,'""')}"`,
         `"${r.domain.replace(/"/g,'""')}"`,
         `"${r.description.replace(/"/g,'""')}"`].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'symbihackathon2026_problems.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────
  if (isPage) {
    return (
      <div className="w-full min-h-screen bg-[#0d1117] text-white pt-24 pb-12 px-4 md:px-12 lg:px-24 flex flex-col">
          <div className="mb-8 font-mono">
              <div className="text-[#8b949e] opacity-70 mb-1 text-sm tracking-widest uppercase">SymbiHackathon 2026</div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#39d353] mb-4">~/problem-statements</h1>
              <div className={`flex items-center gap-2 text-xs md:text-sm font-bold ${loading ? 'text-yellow-500' : error ? 'text-red-500' : 'text-[#39d353]'}`}>
                   {loading && <><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"/> <span>Loading data...</span></>}
                   {error && <><AlertTriangle size={14} /> <span>{error}</span></>}
                   {!loading && !error && <><CheckCircle size={14} /> <span>Loaded {allData.length} problem statements.</span></>}
              </div>
          </div>

          <div className="flex-1 border border-[#30363d] rounded-xl bg-[#0d1117] shadow-2xl flex flex-col overflow-hidden relative">
             {/* Controls Bar */}
             <div className="p-4 bg-[#0d1117] border-b border-[#30363d] flex flex-col md:flex-row gap-4">
               {/* Search */}
               <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] group-focus-within:text-[#39d353] transition-colors" />
                  <input 
                     type="text" 
                     placeholder="Search by title, ID, domain..." 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     className="w-full bg-[#161b22] border border-[#30363d] rounded-lg py-2.5 pl-10 pr-4 text-white text-sm font-mono focus:border-[#39d353] focus:outline-none focus:ring-1 focus:ring-[#39d353]/20 transition-all placeholder-[#8b949e]"
                  />
               </div>

               {/* Filters */}
               <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
                  <div className="relative min-w-[140px]">
                     <select 
                        value={sortConfig.key ? `${sortConfig.key}-${sortConfig.direction}` : ''}
                        onChange={e => {
                            const [k, d] = e.target.value.split('-');
                            if (k) { setSortConfig({ key: k, direction: d }); }
                            else { setSortConfig({ key: null, direction: 'asc' }); }
                        }}
                        className="w-full appearance-none bg-[#161b22] border border-[#30363d] rounded-lg py-2.5 pl-4 pr-10 text-white text-sm font-mono focus:border-[#39d353] focus:outline-none cursor-pointer"
                     >
                        <option value="">Sort by ...</option>
                        <option value="sno-asc">S.No (Asc)</option>
                        <option value="sno-desc">S.No (Desc)</option>
                        <option value="id-asc">ID (Asc)</option>
                        <option value="id-desc">ID (Desc)</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                     </select>
                     <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b949e] pointer-events-none" />
                  </div>

                  <div className="relative min-w-[160px]">
                     <select 
                        value={domainFilter}
                        onChange={e => setDomainFilter(e.target.value)}
                        className="w-full appearance-none bg-[#161b22] border border-[#30363d] rounded-lg py-2.5 pl-4 pr-10 text-white text-sm font-mono focus:border-[#39d353] focus:outline-none cursor-pointer"
                     >
                        <option value="">All Domains</option>
                        {domains.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                     <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b949e] pointer-events-none" />
                  </div>

                  <div className="relative min-w-[110px]">
                     <select 
                        value={rowsPerPage}
                        onChange={e => setRowsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="w-full appearance-none bg-[#161b22] border border-[#30363d] rounded-lg py-2.5 pl-4 pr-10 text-white text-sm font-mono focus:border-[#39d353] focus:outline-none cursor-pointer"
                     >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                        <option value="all">Check All</option>
                     </select>
                     <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b949e] rotate-90 pointer-events-none" />
                  </div>

                  <button 
                    onClick={handleDownloadCSV}
                    className="px-4 py-2 bg-[#238636] border border-[#238636] hover:bg-[#2ea043] text-white rounded-lg flex items-center gap-2 text-sm font-bold transition-all whitespace-nowrap shadow-[0_0_10px_rgba(35,134,54,0.4)]"
                  >
                      <Download className="w-4 h-4" /> Download CSV
                  </button>
               </div>
             </div>

             {/* Stats Bar */}
            {!loading && (
               <div className="px-6 py-3 border-b border-[#30363d] text-xs font-mono text-[#8b949e] bg-[#161b22]">
                 Showing {totalItems > 0 ? rangeStart : 0}-{rangeEnd} of {totalItems} problem statements
                 <span className="float-right">Page {currentPage} of {totalPages}</span>
               </div>
            )}

            {/* Table Area */}
            <div className="flex-1 overflow-auto bg-[#0d1117] relative">
               {loading ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8b949e] gap-4">
                   <div className="w-8 h-8 border-2 border-[#39d353] border-t-transparent rounded-full animate-spin"></div>
                   <p className="font-mono text-sm">Parsing problem statements...</p>
                 </div>
               ) : filteredData.length === 0 ? (
                 <div className="p-12 text-center text-[#8b949e] flex flex-col items-center gap-4">
                    <Search className="w-12 h-12 opacity-20" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">No results found</h3>
                      <p>Try adjusting your search or filters.</p>
                    </div>
                    <button onClick={() => {setSearchTerm(''); setDomainFilter('');}} className="text-[#39d353] hover:underline text-sm">
                      Clear Filters
                    </button>
                 </div>
               ) : (
                 <table className="w-full text-left text-sm border-collapse">
                   <thead className="bg-[#161b22] text-[#8b949e] font-semibold sticky top-0 z-10 shadow-sm">
                     <tr>
                       {[
                         { k: 'sno', l: 'S.No', w: 'w-16' },
                         { k: 'id', l: 'Statement ID', w: 'w-32' },
                         { k: 'title', l: 'Title', w: 'w-auto' },
                         { k: 'domain', l: 'Domain / Track', w: 'w-40' },
                       ].map(({k, l, w}) => (
                         <th 
                           key={k} 
                           className={`p-4 border-b border-[#30363d] cursor-pointer hover:text-white transition-colors select-none ${w}`}
                           onClick={() => handleSort(k)}
                         >
                           <div className="flex items-center gap-2 uppercase tracking-wider text-[10px] font-mono">
                             {l}
                             {sortConfig.key === k ? (
                               sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#39d353]" /> : <ArrowDown className="w-3 h-3 text-[#39d353]" />
                             ) : (
                               <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                             )}
                           </div>
                         </th>
                       ))}
                       <th className="p-4 border-b border-[#30363d] uppercase tracking-wider text-[10px] font-mono w-1/3">Description</th>
                       <th className="p-4 border-b border-[#30363d] uppercase tracking-wider text-[10px] font-mono text-center w-24">Download</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#30363d]">
                      {displayedData.map((row) => (
                         <tr key={row.sno} className="hover:bg-[#161b22] transition-colors group">
                            <td className="p-4 font-mono text-[#8b949e] text-xs border-r border-[#30363d]/30">{row.sno}</td>
                            <td className="p-4 font-mono text-white font-bold text-xs border-r border-[#30363d]/30">{row.id}</td>
                            <td className="p-4 font-semibold text-[#c9d1d9] text-[13px] border-r border-[#30363d]/30">
                              {row.title}
                            </td>
                            <td className="p-4 border-r border-[#30363d]/30">
                               <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border border-[#39d353]/30 bg-[#39d353]/10 text-[#39d353] whitespace-nowrap">
                                  {row.domain}
                               </span>
                            </td>
                            <td className="p-4 text-[#8b949e] text-xs leading-relaxed border-r border-[#30363d]/30">
                               <div className="line-clamp-2 mb-1">{row.description}</div>
                               <button 
                                 onClick={() => setSelectedProblem(row)}
                                 className="text-[#39d353] text-[10px] font-mono hover:underline hover:text-[#39d353] flex items-center gap-1 mt-1"
                               >
                                 read more <ArrowUp className="w-2 h-2 rotate-90" />
                               </button>
                            </td>
                            <td className="p-4 text-center">
                               <button 
                                  onClick={() => handleDownloadRow(row)}
                                  className="w-8 h-8 inline-flex items-center justify-center rounded bg-[#238636]/10 border border-[#238636]/50 text-[#39d353] hover:bg-[#238636] hover:text-white transition-all shadow-sm group-hover:shadow-[0_0_10px_rgba(57,211,83,0.2)]"
                                  title={`Download ${row.id}`}
                               >
                                  <Download className="w-3.5 h-3.5" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                 </table>
               )}
            </div>
            
            {/* Pagination Footer */}
            {!loading && (
               <div className="p-4 bg-[#161b22] border-t border-[#30363d] flex justify-between items-center">
                    <div className="text-xs font-mono text-[#8b949e]">
                         Showing {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems}
                    </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentPage(1)} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#39d353] hover:text-[#39d353] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                         <ChevronsLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#39d353] hover:text-[#39d353] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                         <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                       <span className="flex items-center px-2 text-xs font-mono text-[#8b949e]">
                         Page {currentPage} / {totalPages}
                       </span>

                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#39d353] hover:text-[#39d353] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                         <ChevronRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setCurrentPage(totalPages)} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#39d353] hover:text-[#39d353] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                         <ChevronsRight className="w-4 h-4" />
                      </button>
                   </div>
               </div>
            )}

            {/* View Modal logic (same for both view modes) */}
            {selectedProblem && (
              <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                 <div className="bg-[#0d1117] w-full max-w-3xl max-h-[85vh] flex flex-col rounded-xl border border-[#30363d] shadow-2xl overflow-hidden relative">
                    <button onClick={() => setSelectedProblem(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#30363d] text-[#8b949e] hover:text-[#f85149] transition-colors z-10">
                          <X className="w-5 h-5" />
                    </button>
                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-3 mb-6">
                           <span className="font-mono text-[#39d353] font-bold text-lg border-b border-[#39d353]/30 pb-0.5">{selectedProblem.id}</span>
                           <span className="w-1 h-1 bg-[#8b949e] rounded-full"></span>
                           <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono border border-[#39d353]/30 bg-[#39d353]/10 text-[#39d353]">
                              {selectedProblem.domain}
                           </span>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">{selectedProblem.title}</h2>
                        
                        <div className="space-y-6 text-[#c9d1d9] leading-loose text-[15px]">
                            {/* Assuming description might have newlines */}
                           {selectedProblem.description.split('\n').map((line, i) => (
                              <p key={i}>{line}</p>
                           ))}
                        </div>
                    </div>
                    <div className="p-6 bg-[#161b22] border-t border-[#30363d] flex justify-end gap-3 shrink-0">
                       <button 
                          onClick={() => setSelectedProblem(null)}
                          className="px-6 py-2 rounded-lg border border-[#30363d] text-[#c9d1d9] font-semibold hover:bg-[#30363d] transition-colors text-sm"
                       >
                         Close
                       </button>
                       <button 
                          onClick={() => handleDownloadRow(selectedProblem)}
                          className="px-6 py-2 rounded-lg bg-[#238636] text-white font-bold hover:bg-[#2eaa49] transition-all text-sm flex items-center gap-2 shadow-lg shadow-green-900/20"
                       >
                         <Download className="w-4 h-4" /> Download Statement
                       </button>
                    </div>
                 </div>
              </div>
            )}
            
          </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#010409] bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-0 md:p-6 overflow-hidden">
      <div className="bg-[#0d1117] w-full h-full md:h-[90vh] md:max-w-7xl md:rounded-2xl border border-[#30363d] flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-[#39d353]">~/problem-statements</span>
            </h2>
            {/* CSV Status Bar */}
            <div className={`flex items-center gap-2 mt-2 text-xs font-mono ${loading ? 'text-yellow-500' : error ? 'text-red-500' : 'text-[#39d353]'}`}>
               {loading && <span>Loading data...</span>}
               {error && <><AlertTriangle size={14} /> <span>{error}</span></>}
               {!loading && !error && <><CheckCircle size={14} /> <span>Loaded {allData.length} problem statements.</span></>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-[#0d1117] border-b border-[#30363d] flex flex-col md:flex-row gap-4">
           {/* Search */}
           <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] group-focus-within:text-[#39d353] transition-colors" />
              <input 
                 type="text" 
                 placeholder="Search by title, ID, domain..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full bg-[#161b22] border border-[#30363d] rounded-lg py-2.5 pl-10 pr-4 text-white text-sm font-mono focus:border-[#39d353] focus:outline-none focus:ring-1 focus:ring-[#39d353]/20 transition-all placeholder-[#8b949e]"
              />
           </div>

           {/* Filters */}
           <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
              <div className="relative min-w-[160px]">
                 <select 
                    value={sortConfig.key ? `${sortConfig.key}-${sortConfig.direction}` : ''}
                    onChange={e => {
                        const [k, d] = e.target.value.split('-');
                        if (k) { setSortConfig({ key: k, direction: d }); }
                        else { setSortConfig({ key: null, direction: 'asc' }); }
                    }}
                    className="w-full appearance-none bg-[#161b22] border border-[#30363d] rounded-lg py-2.5 pl-4 pr-10 text-white text-sm font-mono focus:border-[#39d353] focus:outline-none cursor-pointer"
                 >
                    <option value="">Sort by ...</option>
                    <option value="sno-asc">S.No (Asc)</option>
                    <option value="sno-desc">S.No (Desc)</option>
                    <option value="id-asc">ID (Asc)</option>
                    <option value="id-desc">ID (Desc)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                 </select>
                 <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b949e] pointer-events-none" />
              </div>

              <div className="relative min-w-[200px]">
                 <select 
                    value={domainFilter}
                    onChange={e => setDomainFilter(e.target.value)}
                    className="w-full appearance-none bg-[#161b22] border border-[#30363d] rounded-lg py-2.5 pl-4 pr-10 text-white text-sm font-mono focus:border-[#39d353] focus:outline-none cursor-pointer"
                 >
                    <option value="">All Domains</option>
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
                 <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b949e] pointer-events-none" />
              </div>

              <div className="relative min-w-[120px]">
                 <select 
                    value={rowsPerPage}
                    onChange={e => setRowsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full appearance-none bg-[#161b22] border border-[#30363d] rounded-lg py-2.5 pl-4 pr-10 text-white text-sm font-mono focus:border-[#39d353] focus:outline-none cursor-pointer"
                 >
                    <option value={10}>Show 10</option>
                    <option value={20}>Show 20</option>
                    <option value={50}>Show 50</option>
                    <option value="all">Show All</option>
                 </select>
                 <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b949e] rotate-90 pointer-events-none" />
              </div>

              <button 
                onClick={handleDownloadCSV}
                className="px-4 py-2 bg-[#238636]/10 border border-[#238636]/30 hover:bg-[#238636]/20 text-[#39d353] rounded-lg flex items-center gap-2 text-sm font-semibold transition-all whitespace-nowrap"
              >
                  <Download className="w-4 h-4" /> CSV
              </button>
           </div>
        </div>

        {/* Stats Bar */}
        {!loading && (
           <div className="px-6 py-3 border-b border-[#30363d] text-xs font-mono text-[#8b949e] bg-[#0d1117]">
             Showing {totalItems > 0 ? rangeStart : 0}-{rangeEnd} of {totalItems} problem statements
           </div>
        )}

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-[#0d1117] relative">
           {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8b949e] gap-4">
               <div className="w-8 h-8 border-2 border-[#39d353] border-t-transparent rounded-full animate-spin"></div>
               <p className="font-mono text-sm">Parsing problem statements...</p>
             </div>
           ) : filteredData.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-[#8b949e] gap-4">
               <Search className="w-12 h-12 opacity-20" />
               <p className="font-mono">No problem statements match your search.</p>
               <button onClick={() => {setSearchTerm(''); setDomainFilter('');}} className="text-[#39d353] hover:underline text-sm font-mono">Clear Filters</button>
             </div>
           ) : (
             <table className="w-full text-left text-sm border-collapse">
               <thead className="sticky top-0 z-10 bg-[#161b22] shadow-[0_1px_0_#30363d]">
                 <tr>
                    {[
                      { id: 'sno', label: 'S.NO', width: 'w-16' },
                      { id: 'id', label: 'STATEMENT ID', width: 'w-32' },
                      { id: 'title', label: 'TITLE', width: '' },
                      { id: 'domain', label: 'DOMAIN / TRACK', width: 'w-48' },
                      { id: '', label: 'DESCRIPTION', width: 'w-96' },
                      { id: '', label: 'DOWNLOAD', width: 'w-24 text-center' }
                    ].map((col, idx) => (
                      <th 
                        key={idx}
                        className={`p-4 text-xs font-bold text-[#8b949e] font-mono tracking-wider border-b border-[#30363d] ${col.width} ${col.id && sortConfig.key === col.id ? 'text-[#39d353]' : ''} ${col.id ? 'cursor-pointer hover:text-[#c9d1d9] transition-colors' : ''}`}
                        onClick={() => col.id && handleSort(col.id)}
                      >
                         <div className={`flex items-center gap-1 ${col.label === 'DOWNLOAD' ? 'justify-center' : ''}`}>
                            {col.label}
                            {col.id && sortConfig.key === col.id && (
                               <span className="text-[10px]">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                            )}
                         </div>
                      </th>
                    ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#30363d]">
                  {displayedData.map((row) => (
                     <tr key={row.sno} className="hover:bg-[#39d353]/5 transition-colors group">
                        <td className="p-4 font-mono text-[#8b949e] text-xs">{row.sno}</td>
                        <td className="p-4 font-mono text-[#39d353] font-semibold text-xs">{row.id}</td>
                        <td className="p-4 font-semibold text-[#c9d1d9]">{row.title}</td>
                        <td className="p-4">
                           <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold font-mono border border-[#39d353]/30 bg-[#39d353]/10 text-[#39d353] whitespace-nowrap">
                              {row.domain}
                           </span>
                        </td>
                        <td className="p-4 text-[#8b949e] text-sm hidden md:table-cell">
                           <div className="line-clamp-2 mb-1">{row.description}</div>
                           <button 
                             onClick={() => setSelectedProblem(row)}
                             className="text-[#39d353] text-xs font-mono hover:underline hover:text-[#39d353]/80"
                           >
                             read more →
                           </button>
                        </td>
                        <td className="p-4 text-center">
                           <button 
                              onClick={() => handleDownloadRow(row)}
                              className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-[#39d353]/10 border border-[#39d353]/20 text-[#39d353] hover:bg-[#39d353]/20 hover:border-[#39d353] hover:shadow-[0_0_10px_rgba(57,211,83,0.3)] transition-all"
                              title={`Download ${row.id}`}
                           >
                              <Download className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
             </table>
           )}
        </div>

        {/* Footer / Pagination */}
        {!loading && (
           <div className="p-4 bg-[#161b22] border-t border-[#30363d] flex justify-center sticky bottom-0 z-20">
               <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#39d353] hover:text-[#39d353] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                     <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#39d353] hover:text-[#39d353] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 px-2">
                     <span className="text-xs font-mono text-[#8b949e]">Page {currentPage} of {totalPages}</span>
                  </div>

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#39d353] hover:text-[#39d353] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                     <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(totalPages)} 
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:border-[#39d353] hover:text-[#39d353] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                     <ChevronsRight className="w-4 h-4" />
                  </button>
               </div>
           </div>
        )}

        {/* --- View Modal --- */}
        {selectedProblem && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
             <div 
               className="bg-[#0d1117] w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl border border-[#30363d] shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden"
             >
                {/* Modal Header */}
                <div className="p-6 border-b border-[#30363d] flex justify-between items-start bg-[#161b22]">
                   <div>
                      <div className="text-[#39d353] font-mono text-sm font-bold mb-1">{selectedProblem.id}</div>
                      <h3 className="text-2xl font-bold text-white">{selectedProblem.title}</h3>
                      <div className="mt-3">
                         <span className="inline-block px-3 py-1 bg-[#39d353]/10 border border-[#39d353]/30 text-[#39d353] rounded-full text-xs font-mono font-bold">
                            {selectedProblem.domain}
                         </span>
                      </div>
                   </div>
                   <button onClick={() => setSelectedProblem(null)} className="p-2 -mr-2 rounded-lg hover:bg-[#30363d] text-[#8b949e] hover:text-[#f85149] transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto flex-1 text-[#c9d1d9] leading-loose text-base">
                   {selectedProblem.description}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-[#30363d] bg-[#161b22] flex justify-end gap-3">
                   <button 
                      onClick={() => setSelectedProblem(null)}
                      className="px-5 py-2 rounded-lg border border-[#30363d] text-[#c9d1d9] font-semibold hover:bg-[#30363d] transition-colors"
                   >
                     Close
                   </button>
                   <button 
                      onClick={() => handleDownloadRow(selectedProblem)}
                      className="px-5 py-2 rounded-lg bg-[#39d353] text-black font-bold hover:brightness-110 transition-transform hover:-translate-y-0.5 flex items-center gap-2"
                   >
                     <Download className="w-4 h-4" /> Download Statement
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
