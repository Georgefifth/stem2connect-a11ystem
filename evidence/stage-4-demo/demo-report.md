# Stage 4 — Demo Video & Visual Presentation Report

**Date:** 2026-10-31  
**Project:** A11ySTEM (Accessible Spatial Audio & Semantic Diagram Navigator)  
**Hackathon:** STEM2Connect AI Hackathon  
**Target Video File:** `evidence/stage-4-demo/demo.mp4`  
**Video Specifications:**
- **Resolution:** 1920 x 1080 (1080p Full HD, 16:9)
- **Duration:** 110.70 seconds (1 minute 50.7 seconds, comfortably under the 6-minute hackathon limit)
- **Codec:** H.264 video @ 30 FPS + AAC audio @ 48 kHz
- **File Size:** 7.8 MB
- **Captions:** Burned-in subtitles (`captions.ass` via libass) with zero text collisions and >180px safe margin

---

## 1. Storyboard & Visual Narrative Architecture

The presentation follows the recommended high-impact narrative structure:  
`Cover → Problem → Acoustic Mechanics → LIVE Core Flow → LIVE Audio Sweep → Multi-Disciplinary Payoff → LIVE SVG Ingestion → Stage 3.5 Real-World Evidence → Future & CTA`

| Scene # | Scene ID | Type | Duration | Visual Asset & Action | Voiceover / Narrative Argument |
|---|---|---|---|---|---|
| **00** | `title` | Card | 8.0s | Dark-premium amber typography with project tagline & GitHub link | "In science and engineering, diagrams are everything. But for millions of blind students, complex schematics remain an impenetrable barrier." |
| **01** | `problem` | Card | 8.5s | Accessibility gap callout: 90%+ of STEM courses rely on visual graphics vs. flat alt-text failure | "Screen readers treat complex circuit diagrams and chemical cycles as meaningless alt text, locking visually impaired students out of STEM education." |
| **02** | `how-it-works` | Card | 9.5s | Acoustic principles: Horizontal X → Stereo Pan; Vertical Y → Harmonic Pitch; 2D Cardinal Directional Compass | "A11ySTEM translates spatial visual diagrams into binaural sound: stereo panning conveys horizontal position, musical pitch reflects vertical height, and arrow keys traverse topological connections." |
| **03** | `live-circuit-navigation` | Live Screen | 14.2s | Real browser interaction on Vercel deployment: arrow keys navigate from `Vin` to `Rin (10k)` to `Summing Node` to `Rf (100k)` with sonar reticle rings | "Here is an inverting operational amplifier. Navigating with arrow keys moves focus from the AC input to the series resistor, summing node, and feedback loop, playing spatial acoustic chimes." |
| **04** | `live-audio-sweep` | Live Screen | 10.7s | Real browser trigger of Spacebar sweep: vertical scanline traverses left-to-right across canvas, sonifying each node in sequence | "Pressing the spacebar launches a continuous left-to-right audio sweep, sonifying every component position and resonant frequency across the stereo soundstage." |
| **05** | `live-multi-discipline` | Live Screen | 10.9s | Real browser dropdown switch: loads Calculus Damped Harmonic Curve ($y = e^{-0.15t} \cos(2t)$), then loads Computer Science Balanced BST | "A11ySTEM seamlessly switches to calculus damped oscillations and balanced binary search trees, where in-order traversal produces an ascending musical scale." |
| **06** | `live-svg-ingestion` | Live Screen | 14.0s | Real browser modal opening: pastes SVG template, clicks "Synthesize Accessible Graph", and loads a 4-node optical sensor pipeline with calculated 2D topology | "Educators can paste any SVG schematic. Our topological engine automatically parses elements, constructs directional navigation trees, and generates WAI-ARIA accessible graphics." |
| **07** | `real-world-validation` | Card | 13.3s | Empirical results from Stage 3.5: 15 / 15 benchmarks passed across TI NE555, W3C, and PubChem with 0.8ms average latency | "In comprehensive benchmark evaluations against fifteen external standards from Texas Instruments and PubChem, A11ySTEM passed with one-hundred percent topological accuracy and sub-millisecond latency." |
| **08** | `closing-cta` | Card | 13.0s | Final impact call-to-action with live deployment URL and open-source GitHub repository | "A11ySTEM is free, open-source, and runs on any device. By turning visual barriers into spatial sound, we ensure every student can build the future of science." |

---

## 2. Visual QA & Verification Results

Extracted frames were sampled across the entire timeline ($t = 3, 15, 30, 45, 60, 75, 95$ seconds) into `evidence/stage-4-demo/qa/` and inspected:
- **Text & Caption Clearance:** All captions fit within the lower 180px safe zone with high-contrast font outlines (`DejaVuSans-Bold`). No text or visual controls are obscured.
- **Topological Visual Clarity:** Directional dashed signal paths, active amber focal reticles, and stereo pan visualizers are crisp and legible at 1080p.
- **Audio Fidelity:** Audio contains both clear spoken synthetic narration (ChristopherNeural) and harmonic Web Audio sonification feedback. Zero audio clipping or pop artifacts.
- **No Capture Errors:** `timestamps.json` confirms 0 capture errors (`bad.length === 0`).
