# A11ySTEM: Spatial Audio & 2D Semantic STEM Diagram Navigator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-success?style=for-the-badge&logo=vercel)](https://stem2connect-ai-hackathon.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)
[![WCAG 2.1 AAA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AAA-10b981?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Build Status](https://img.shields.io/badge/Tests-16%20QA%20%7C%2015%20Benchmarks%20Passed-blue?style=for-the-badge)](evidence/)

> **A11ySTEM** is a browser-native, zero-install interactive spatial audio and 2D semantic diagram navigator that empowers blind and low-vision students to hear, explore, and master complex STEM schematics (analog electronics, differential calculus, cellular biochemistry, and computer science data structures).
>
> Built for the **STEM2Connect AI Hackathon 2026** (Track: *Community Impact & Accessibility*).

---

## 🎯 The Problem

Over **90% of university and high school STEM curricula** rely fundamentally on visual graphics: circuit schematics, metabolic reaction pathways, differential curves, and algorithmic tree structures. For sighted students, a schematic conveys relationships at a single glance.

However, for millions of blind and low-vision students worldwide, these visual diagrams represent an impenetrable barrier:
1. **Flat Alt-Text Failure:** Standard screen readers (NVDA, JAWS, VoiceOver) treat SVGs as flat strings of XML tags, collapsing complex diagrams into useless alt-text like *"Figure 3: Circuit schematic"*.
2. **Narrow Existing Tools:** Tools like Desmos Audio Trace are restricted to 1D continuous curves ($y=f(x)$); they cannot parse discrete multi-branch networks, integrated circuits, or molecular pathways.
3. **The Embosser Barrier:** Physical tactile graphics embossers cost **$3,000 to $10,000+**, require specialized micro-capsule paper, and take weeks for disability offices to transcribe—making fast-paced homework, online lectures, and remote learning impossible.

---

## 💡 The Solution: Spatial Audio & 2D Compass Navigation

A11ySTEM translates two-dimensional visual geometry directly into human auditory perception:

```
                  High Pitch (~1046 Hz C6)
                            ▲
                            │
   Left Ear (-1.0 Pan) ◄────┼────► Right Ear (+1.0 Pan)
                            │
                            ▼
                   Low Bass (~130 Hz C3)
```

1. **Binaural Spatial Panning ($X$-Axis):** The horizontal coordinate maps to stereo panning: $X = 0\%$ plays in the full left ear, $X = 50\%$ centers between both ears, and $X = 100\%$ plays in the right ear.
2. **Logarithmic Pitch ($Y$-Axis):** The vertical coordinate maps to a musical scale from $C_3$ ($130.81\text{ Hz}$) to $C_6$ ($1046.50\text{ Hz}$), engineered with smooth 15ms exponential gain envelopes to eliminate speaker clicks.
3. **Component-Specific Timbre:** Audio wave shapes reflect underlying physics—pure sine for resistors and metabolites, warm triangle waves for sources and data points, capacitive ramps, and deep 65 Hz sub-bass for ground references.
4. **2D Cardinal Directional Compass:** Arrow keys ($\leftarrow, \rightarrow, \uparrow, \downarrow$) navigate to nearest geometric neighbors using an angular distance cost function:
   $$\text{Score} = \Delta x + 1.8 \cdot \Delta y$$
5. **Continuous Audio Sweep Scanner:** Pressing `Spacebar` launches a smooth 3-second left-to-right scanline sweep across the canvas, enabling the user to immediately absorb the global layout of a circuit or curve before examining individual nodes.
6. **Instant SVG Ingestion & ARIA Export:** Ingests any valid SVG, clusters nodes, assigns 2D topology, and exports enhanced SVGs with embedded WAI-ARIA `role="treeitem"`, `aria-label`, and `<desc>` tags.

---

## 🔬 Multi-Disciplinary STEM Diagram Suite

A11ySTEM includes 4 pre-loaded university-level STEM diagrams:
- **Analog Electronics:** Inverting Operational Amplifier ($A_v = -R_f / R_{in} = -10$) with virtual ground and feedback loop.
- **Differential Calculus:** Damped harmonic oscillation curve ($f(t) = e^{-0.15t} \cos(2t)$) with tangent slope sonification and zero-crossing detection.
- **Cellular Biochemistry:** Citric Acid (Krebs) Cycle 8-step metabolic loop with enzyme-substrate energetics.
- **Computer Science:** Balanced Binary Search Tree (AVL) where in-order traversal produces an ascending pentatonic musical scale.

---

## 🛠️ Tech Stack & Architecture

- **UI Framework:** React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Acoustic Engine:** Native **Web Audio API** (`AudioContext`, `StereoPannerNode`, `GainNode`, `OscillatorNode`) — 100% offline, zero latency, no pre-recorded audio files.
- **Speech Synthesis:** Native **Web Speech API** with automatic queue debouncing.
- **Visual Design:** High-contrast WCAG 2.1 AAA Obsidian (`#080C14`) & Luminous Amber (`#F59E0B`) palette (>7:1 contrast ratio).
- **Automated QA:** Vitest (unit tests) + Playwright (end-to-end browser automation).
- **Deployment:** Vercel Global Edge Network.

---

## 🧪 Empirical Validation & Benchmarks (Stage 3.5)

A11ySTEM was evaluated against **15 external multi-disciplinary benchmarks** from official standards organizations, academic archives, and datasheets:

| Benchmark ID | Subject | Source | Ground Truth Baseline | Result |
|---|---|---|---|---|
| **BENCH-01** | IEEE Inverting Op-Amp | Wikipedia / Sedra & Smith | Textbook Circuit Topology | **PASS (3.6ms)** |
| **BENCH-02** | Damped Harmonic Curve | Wolfram MathWorld | Analytical ODE Solution | **PASS (0.7ms)** |
| **BENCH-03** | Balanced BST (AVL) | Princeton Algorithms | Binary Search Tree Invariant | **PASS (0.4ms)** |
| **BENCH-04** | Texas Instruments NE555 Timer | TI Official Datasheet | Exact IC Pinout Specifications | **PASS (0.6ms)** |
| **BENCH-05** | W3C SVG 1.1 Schematic | W3C Recommendation | W3C Standard Vector Elements | **PASS (0.3ms)** |
| **BENCH-06** | Citric Acid Cycle Loop | Wikimedia Commons BioRender | Closed-Loop Metabolic Engine | **PASS (0.3ms)** |
| **BENCH-07** | Aspirin Molecule ($C_9H_8O_4$) | NIH PubChem CID 2244 | PubChem Structure Graph | **PASS (0.3ms)** |
| **BENCH-08** | 4-Bit ALU Architecture | Computer Architecture Standard | 15-Node Digital Logic Bus | **PASS (2.3ms)** |
| **BENCH-09** | Finite State Machine (FSM) | Automata Theory Standard | 5-State Transition Graph | **PASS (0.3ms)** |
| **BENCH-10** | Frequency Response Bode Plot | Swarthmore Controls Reference | Asymptotic Linear Rolloff | **PASS (0.2ms)** |
| **BENCH-11** | Malformed XML Fuzzing | Synthetic Stress Test | Exception Catch & Graceful Fallback | **PASS (1.3ms)** |
| **BENCH-12** | Empty SVG Container | Boundary Edge Case | Default Accessible Template | **PASS (0.1ms)** |
| **BENCH-13** | Extreme Coordinates (>100k) | Stress Testing | Coordinate Clamping [5%, 95%] | **PASS (0.1ms)** |
| **BENCH-14** | Collinear Overlapping Nodes | Geometric Singularity | Zero-Distance Disambiguation | **PASS (0.1ms)** |
| **BENCH-15** | Deeply Nested `<g>` Groups | Adobe Illustrator Export Format | Recursive DOM Shape Extraction | **PASS (0.3ms)** |

**Overall Result: 15 / 15 Passed (100% Accuracy, 0.8ms average execution latency).**

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js >= 18.0 (Recommended: v20 or v22)
- npm >= 9.0

### Local Installation & Development
```bash
# 1. Clone repository
git clone https://github.com/Georgefifth/stem2connect-a11ystem.git
cd stem2connect-a11ystem

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# -> Opens http://localhost:5173

# 4. Run unit test suite (Vitest)
npm test

# 5. Build for production
npm run build

# 6. Preview production build
npm run preview
```

### End-to-End QA Automation (Playwright)
```bash
# Run real-browser QA suite against production or local build
BASE_URL=https://stem2connect-ai-hackathon.vercel.app BROWSER=chromium node qa/run.mjs
```

---

## 🎹 Keyboard Controls Reference

| Key | Action |
|---|---|
| `↑` `↓` `←` `→` | Navigate to 2D nearest geometric neighbor with spatial audio chime |
| `Spacebar` | Play continuous left-to-right audio scan sweep across all components |
| `1`, `2`, `3` | Switch semantic zoom level (1: Macro Overview, 2: Modules, 3: Full Details) |
| `Tab` / `Shift+Tab` | Sequentially cycle through diagram components |
| `Home` | Re-center focal cursor on diagram root / input node |
| `M` | Toggle master audio mute |
| `V` | Toggle spoken speech narration |
| `?` or `H` | Open keyboard shortcuts & spatial audio mental model guide |
| `Esc` | Dismiss modals / reset focus |

---

## 🤖 AI Tools Disclosure & Attribution

In compliance with the **STEM2Connect AI Hackathon Rules**:

1. **AI Assistance Utilized:**
   - **OpenCode & Google Gemini 3.8 Flash:** Used as an intelligent architecture advisor, research synthesizer, and code collaborator across the 6-stage product engineering lifecycle.
   - **edge-tts:** Utilized for generating natural synthesized voiceover narration for the 1080p demonstration video.
2. **What the Team Built & Designed:**
   - Authored the core **Web Audio API polyphonic sound synthesis engine** and envelope smoothing algorithms.
   - Designed the **2D topological cardinal direction resolver** ($Score = \Delta x + 1.8 \cdot \Delta y$).
   - Designed the **WCAG 2.1 AAA high-contrast visual design system** and interactive canvas in `design/UX.md`.
   - Engineered the SVG parser, group unnester, and WAI-ARIA metadata exporter.
   - Implemented the full **Playwright automated browser test runner** (`qa/run.mjs`) and executed 15 independent benchmark validations.
3. **Credits for External Data & Standards:**
   - Texas Instruments NE555 Datasheet (SLFS022I)
   - W3C SVG 1.1 Technical Recommendation Suite
   - NIH PubChem Compound Database (Compound CID 2244)
   - Sedra & Smith *Microelectronic Circuits* & Princeton University Algorithms (Sedgewick & Wayne)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Built with passion for inclusive science and universal STEM education.
