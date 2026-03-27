"""
SymbiHackathon 2026 - Mobile Responsive Fix Script
Run from project root: py fix_mobile.py
"""

import os, re

ROOT = "src/pages/hackathon"

def read(path):
    # Try UTF-8 first, fall back to latin-1 which reads any byte
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        with open(path, "r", encoding="latin-1") as f:
            return f.read()

def write(path, content):
    # Detect original encoding to write back correctly
    try:
        with open(path, "r", encoding="utf-8") as f:
            f.read()
        enc = "utf-8"
    except UnicodeDecodeError:
        enc = "latin-1"
    with open(path, "w", encoding=enc) as f:
        f.write(content)

def patch_regex(path, pattern, replacement, label, flags=0):
    c = read(path)
    new_c, n = re.subn(pattern, replacement, c, count=1, flags=flags)
    if n == 0:
        print(f"  WARNING [{label}] pattern not found - skipping")
    else:
        write(path, new_c)
        print(f"  OK [{label}]")

# ─────────────────────────────────────────────
# 1. PAYMENT.JSX
# ─────────────────────────────────────────────
print("\n-- Payment.jsx --")
path = os.path.join(ROOT, "Payment.jsx")

# Steps grid
patch_regex(path,
    r'(gridTemplateColumns:)"repeat\(auto-fit,minmax\(260px,1fr\)\)"',
    r'\1"repeat(auto-fit,minmax(min(260px,100%),1fr))"',
    "steps grid"
)

# Payment details grid (the one with 300px min)
# There are two 300px grids - target by nearby context
patch_regex(path,
    r'(gridTemplateColumns:"repeat\(auto-fit,minmax\(300px,1fr\)\)",gap:3,alignItems:"start"\})',
    r'gridTemplateColumns:"repeat(auto-fit,minmax(min(300px,100%),1fr))",gap:3,alignItems:"start"}',
    "payment details grid"
)

# Checklist grid (second 300px grid)
patch_regex(path,
    r'(gridTemplateColumns:"repeat\(auto-fit,minmax\(300px,1fr\)\)",gap:3\})',
    r'gridTemplateColumns:"repeat(auto-fit,minmax(min(300px,100%),1fr))",gap:3}',
    "checklist grid"
)

# CTA bottom padding
patch_regex(path,
    r'padding:"36px 40px"',
    r'padding:"36px clamp(16px,5vw,40px)"',
    "CTA padding"
)

# ─────────────────────────────────────────────
# 2. SPONSORS.JSX
# ─────────────────────────────────────────────
print("\n-- Sponsors.jsx --")
path = os.path.join(ROOT, "Sponsors.jsx")

# Sponsor frame size - use DOTALL to handle newlines between width and height
patch_regex(path,
    r'width:"clamp\(220px,22vw,290px\)",\s*\n\s*height:"clamp\(160px,16vw,210px\)"',
    'width:"clamp(160px,42vw,290px)",\n            height:"clamp(120px,30vw,210px)"',
    "sponsor frame size",
    flags=re.DOTALL
)

# WHY grid
patch_regex(path,
    r'gridTemplateColumns:"repeat\(auto-fit,minmax\(240px,1fr\)\)"',
    'gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))"',
    "why grid"
)

# Contact form grid
patch_regex(path,
    r'gridTemplateColumns:"repeat\(auto-fit,minmax\(280px,1fr\)\)"',
    'gridTemplateColumns:"repeat(auto-fit,minmax(min(280px,100%),1fr))"',
    "contact form grid"
)

# ─────────────────────────────────────────────
# 3. SCHEDULE.JSX
# ─────────────────────────────────────────────
print("\n-- Schedule.jsx --")
path = os.path.join(ROOT, "Schedule.jsx")

# Tab strip - add scroll props
patch_regex(path,
    r'(display:"flex",\s*gap:"1px",\s*background:"rgba\(255,233,0,0\.06\)",\s*marginBottom:"32px",\s*overflowX:"auto")',
    r'\1, WebkitOverflowScrolling:"touch", scrollbarWidth:"none", msOverflowStyle:"none"',
    "tab strip scroll"
)

# ALL PHASES tab - add flexShrink
patch_regex(path,
    r'(cursor:"crosshair",\s*whiteSpace:"nowrap",\s*borderTop:\s*activeDay===null)',
    r'cursor:"crosshair", whiteSpace:"nowrap", flexShrink:0, borderTop: activeDay===null',
    "ALL PHASES tab flexShrink"
)

# Phase day tabs - add flexShrink
patch_regex(path,
    r'(cursor:"crosshair",\s*whiteSpace:"nowrap",\s*borderTop:\s*activeDay===i)',
    r'cursor:"crosshair", whiteSpace:"nowrap", flexShrink:0, borderTop: activeDay===i',
    "phase tabs flexShrink"
)

# Main grid min fix
patch_regex(path,
    r'(gridTemplateColumns:\s*activeDay!==null \? "1fr" : )"repeat\(auto-fit,minmax\(300px,1fr\)\)"',
    r'\1"repeat(auto-fit,minmax(min(300px,100%),1fr))"',
    "main schedule grid"
)

# Hero stat boxes wrap
patch_regex(path,
    r'(display:"flex",\s*gap:"1px",\s*background:"rgba\(255,233,0,0\.06\)",\s*marginLeft:"auto")',
    r'\1, flexWrap:"wrap"',
    "hero stat boxes"
)

# ─────────────────────────────────────────────
# 4. COMMITTEE.JSX
# ─────────────────────────────────────────────
print("\n-- Committee.jsx --")
path = os.path.join(ROOT, "Committee.jsx")

# Field units flex row - add flexWrap
patch_regex(path,
    r'(display:"flex",gap:3,alignItems:"flex-start"\})',
    r'display:"flex",gap:3,alignItems:"flex-start",flexWrap:"wrap"}',
    "field units layout"
)

# UnitTabs width - add minWidth
patch_regex(path,
    r'(width:"clamp\(120px,18vw,180px\)",\s*flexShrink:0)',
    r'width:"clamp(120px,18vw,180px)", minWidth:"100px", flexShrink:0',
    "unit tabs width"
)

# Unit header row - add flexWrap
patch_regex(path,
    r'(display:"flex",alignItems:"center",gap:16,marginBottom:3\})',
    r'display:"flex",alignItems:"center",gap:16,marginBottom:3,flexWrap:"wrap"}',
    "unit header row"
)

# ─────────────────────────────────────────────
# 5. index.css additions
# ─────────────────────────────────────────────
print("\n-- index.css --")
css_path = "src/index.css"
existing = read(css_path)

additions = """

/* SymbiHackathon Mobile Patch */
@media (max-width: 768px) {
  /* Hide scrollbar on Schedule tab strip while keeping scroll */
  div::-webkit-scrollbar { height: 0; }
}

@media (max-width: 480px) {
  /* Committee UnitTabs go horizontal on tiny phones */
  div[style*="clamp(120px,18vw,180px)"] {
    width: 100% !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    overflow-x: auto;
  }
}
"""

if "SymbiHackathon Mobile Patch" not in existing:
    write(css_path, existing + additions)
    print("  OK appended to index.css")
else:
    print("  INFO already present - skipped")

print("\nDone. Run: npm run dev")
print("Test: Chrome F12 -> Device toolbar -> iPhone SE")