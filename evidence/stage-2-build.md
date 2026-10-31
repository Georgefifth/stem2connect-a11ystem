# Stage 2 — Build & Competitive Execution Report

**Date:** 2026-10-31  
**Project:** A11ySTEM (Accessible Spatial Audio & Semantic STEM Diagram Navigator)  
**Hackathon Track:** Community Impact & Accessibility / Education  
**Repository:** [https://github.com/Georgefifth/stem2connect-a11ystem](https://github.com/Georgefifth/stem2connect-a11ystem)  
**Production Deployment:** [https://stem2connect-ai-hackathon.vercel.app](https://stem2connect-ai-hackathon.vercel.app)  

---

## 1. Deep Competitor Benchmarking

We benchmarked 4 direct and indirect competitors in the diagram accessibility and STEM educational space:

| Dimension | 1. SAS Graphics Accelerator | 2. Desmos Audio Trace | 3. EquatIO / MathPlayer | 4. Traditional Tactile Embossers | **Our Product: A11ySTEM** |
|---|---|---|---|---|---|
| **Direct URL** | [support.sas.com](https://support.sas.com/software/products/graphics-accelerator/) | [desmos.com/accessibility](https://www.desmos.com/accessibility) | [texthelp.com/equatio](https://www.texthelp.com/products/equatio/) | [viewplus.com](https://viewplus.com/) | [stem2connect-ai-hackathon.vercel.app](https://stem2connect-ai-hackathon.vercel.app) |
| **Supported Media** | Tabular charts (bar, scatter, time-series) & simple points on maps | Single-variable math function plots ($y=f(x)$) | Mathematical equation text / MathML / LaTeX | Physical embossed micro-capsule paper | **Complex multi-branch topological STEM diagrams** (circuits, calculus curves, metabolic cycles, trees) + Custom SVG |
| **Spatial 2D Navigation** | Linear table row traversal; no 2D directional branching | Left/right curve tracing only | None (pure text / equation reader) | Physical finger touching on paper | **Full 2D Cardinal Directional Compass (Up/Down/Left/Right arrow keys)** |
| **Audio Sonification** | Mono/Stereo pitch sweeps for 1D datasets | Pitch = $Y$, Stereo Pan = $X$ on 1D curves | Speech synthesis only (no tonal sonification) | None (silent physical paper) | **Binaural Spatial Panning (-1.0 to +1.0) + Logarithmic Pitch (C3 to C6) + Component-specific waveforms (sine, triangle, square sub-bass)** |
| **Hardware / OS Requirement** | Desktop Chrome Extension only (fails on mobile/tablets) | Web browser | Desktop / Word plugin subscription | $3,000–$10,000+ specialized braille embosser | **100% Zero-Install Web Native (Chrome, Edge, Safari, Firefox, iOS, Android)** |
| **Cost** | Free extension, but requires SAS ecosystem for creation | Free for Desmos calculator | $150+/user/year commercial license | $3,000–$10,000+ machine + ongoing expensive paper | **100% Free & Open-Source (MIT)** |
| **What They Do Better** | Deep integration with SAS enterprise data analytics | Unmatched fluid performance on complex 10,000-point calculus functions | Direct integration with Google Docs / Microsoft Word equation editors | Physical tactile feedback for fingertips | **First universal spatial audio navigator for STEM diagrams; instant SVG parsing** |

---

## 2. Identified Deficiencies & Optimization Priorities

### 2.1 Critical Gaps in Status Quo
1. **The Diagram Exclusion Barrier (P0):** Blind students can read text and equations via screen readers, but 90%+ of university STEM exams and homework questions require reading circuit schematics, reaction networks, or coordinate curves. Existing screen readers treat SVGs as flat strings of XML tags without spatial awareness.
2. **Audio Overload & Latency (P0):** Naive text-to-speech engines queue up paragraphs of text, creating unbearable cognitive delay when a user presses arrow keys rapidly.
3. **Ergonomic Sighted-Collaborator Duality (P1):** Blind students work with sighted tutors and professors. A purely audio tool locks out the sighted tutor; a purely visual tool locks out the blind student.

### 2.2 Implemented Improvements
- **2D Cardinal Directional Topological Graph Engine:** Computes nearest geometric neighbors with angular weighting ($Score = \Delta x + 1.8 \cdot \Delta y$). Arrow keys navigate logically across the physical layout.
- **Harmonic Web Audio Synthesis Engine:** Eliminates audio clicks/pops with exponential gain envelope smoothing (15ms attack, 300ms release). Maps $X$ to stereo pan and $Y$ to musical frequency scale ($130.81$ Hz C3 to $1046.5$ Hz C6).
- **Dual Visual/Audio Tactile Canvas:** High-contrast WCAG AAA obsidian/amber palette with concentric sonar focal rings and real-time panning gauges, allowing blind and sighted peers to collaborate seamlessly.
- **Instant SVG Ingestion & WAI-ARIA Export:** Ingests any valid SVG, clusters nodes, and exports fully accessible SVG with embedded `role="treeitem"`, `aria-label`, and `<desc>` tags.

---

## 3. Architecture & Verification Summary

### 3.1 Tech Stack
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (Obsidian `#080C14` / Amber `#F59E0B` / Cyan `#38BDF8`)
- **Audio:** Browser Native Web Audio API (`AudioContext`, `StereoPannerNode`, `GainNode`, `OscillatorNode`)
- **Speech:** Native Web Speech API (`SpeechSynthesis`) with dynamic speech debouncing
- **Testing:** Vitest (100% unit test pass rate) + Playwright (Headless Chromium E2E verification)

### 3.2 Verification Results
- **Unit Tests:** 9 / 9 passed in `src/tests/` (audio mathematical formulas, pan bounds, frequency scales, SVG parsing, sample diagram topology integrity).
- **TypeScript Check:** `tsc --noEmit` passed with 0 errors.
- **Production Build:** `vite build` completed in 121ms (`dist/index.html` 1.01 kB, CSS 27 kB, JS 292 kB).
- **Visual Design Acceptance:** Desktop 1440px and Mobile 390px captured in `evidence/stage-2-build/frontend/`. Passed the "Generic SaaS test" — uniquely distinct scientific sonification workbench.
- **Live Deployment:** Tested at [https://stem2connect-ai-hackathon.vercel.app](https://stem2connect-ai-hackathon.vercel.app), returning HTTP 200 and executing all client-side audio nodes.

---

## 4. Known Limitations & Next Steps
- **Complex Hierarchical Nested Sub-Circuits:** Currently handles 3 semantic zoom levels (Overview, Modules, Details). Deep multi-sheet hierarchical schematics (e.g., 5-level nested microprocessors) will benefit from recursive tree folding.
- **Mobile Audio Gesture Lock:** Mobile Safari requires a physical touch tap before AudioContext can output sound (standard browser security policy). Handled with a clear user prompt and fallback chime.
