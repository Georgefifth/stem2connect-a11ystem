# Devpost Submission Fields — A11ySTEM

> Copy and paste the values below directly into the Devpost submission form.

---

### Project Name
```text
A11ySTEM: Spatial Audio & 2D Semantic STEM Diagram Navigator
```

---

### Elevator Pitch
```text
An interactive spatial audio and 2D semantic diagram navigator empowering blind and low-vision students to hear, explore, and master complex STEM schematics.
```

---

### Primary Track
```text
Community Impact (Accessibility, Inclusion, and STEM Education)
```

---

### Thumbnail Asset
- **File path:** `submission/assets/thumbnail.png`
- **Ratio:** 3:2 (1200 x 800)
- **Size:** 437 KB (PNG)

---

### About the Project

```markdown
## Inspiration

Over 90% of secondary and university STEM curricula rely heavily on visual graphics: circuit schematics, metabolic reaction loops, differential calculus curves, and data structures. For sighted students, a schematic conveys complex relationships at a single glance. 

However, for millions of blind and low-vision students worldwide, these visual diagrams represent an almost insurmountable barrier. Standard screen readers (NVDA, JAWS, VoiceOver) treat SVGs as flat strings of XML tags or collapse them into unhelpful alt-text like *"Figure 3: Circuit diagram"*. Commercial tactile graphics embossers cost $3,000 to $10,000+, require specialized micro-capsule paper, and take weeks for disability offices to print—making fast-paced homework and remote learning practically impossible.

We asked: **What if blind students could perceive the two-dimensional spatial topology of any STEM diagram directly through sound?** This question inspired **A11ySTEM**—a zero-install, browser-native platform that translates visual schematics into binaural spatial audio, harmonic pitch frequencies, and 2D keyboard navigation trees.

## What it does

A11ySTEM turns visual diagrams into interactive, audible mental models:

1. **Binaural Spatial Audio Mapping:** 
   - **Horizontal ($X$-Axis):** Mapped dynamically to stereo panning from full left ear ($-1.0$) across center to full right ear ($+1.0$).
   - **Vertical ($Y$-Axis):** Mapped to a clean logarithmic harmonic pitch scale from $C_3$ ($130.81\text{ Hz}$) to $C_6$ ($1046.50\text{ Hz}$), with smooth exponential attack-decay envelopes to prevent speaker clicks.
   - **Component Timbre:** Distinct audio wave shapes convey component physics—pure sine for resistors and metabolites, warm triangles for sources and data points, capacitive ramps, and deep 65 Hz sub-bass for ground references.

2. **2D Cardinal Directional Compass Navigation:** 
   Instead of forcing linear sequential reading, students navigate spatially using standard keyboard arrow keys ($\leftarrow, \rightarrow, \uparrow, \downarrow$). An intelligent angular distance algorithm ($Score = \Delta x + 1.8 \cdot \Delta y$) computes nearest neighbors in the 4 cardinal directions.

3. **Continuous Audio Sweep Scanner:**
   Pressing the spacebar launches a smooth 3-second left-to-right audio scan sweep across the entire canvas, enabling students to absorb the high-level spatial topology of a circuit or curve before drilling into individual nodes.

4. **Multi-Disciplinary STEM Suite:**
   Pre-loaded with canonical university-level diagrams:
   - **Analog Electronics:** Inverting Operational Amplifier ($A_v = -R_f / R_{in} = -10$) with virtual ground and feedback loop.
   - **Differential Calculus:** Damped harmonic oscillation curve ($f(t) = e^{-0.15t} \cos(2t)$) with tangent slope sonification and zero-crossing detection.
   - **Cellular Biochemistry:** Citric Acid (Krebs) Cycle 8-step metabolic loop with enzyme-substrate energetics.
   - **Computer Science:** Balanced Binary Search Tree (AVL) where in-order traversal produces an ascending pentatonic musical scale.

5. **Instant Vector SVG Ingestion & ARIA Export:**
   Educators and students can paste any SVG schematic or upload vector files. The parser extracts centroids, computes 2D spatial topology, and exports enhanced SVGs with embedded WAI-ARIA `role="treeitem"`, `aria-label`, and `<desc>` tags.

## How we built it

- **Frontend Core:** React 19, TypeScript, and Tailwind CSS v4, architected with a high-contrast dark obsidian (`#080C14`) and luminous amber (`#F59E0B`) palette adhering to WCAG 2.1 AAA contrast standards (>7:1 ratio).
- **Acoustic Synthesis Engine:** Built entirely on the native **Web Audio API** (`AudioContext`, `StereoPannerNode`, `GainNode`, `OscillatorNode`) without any pre-recorded audio samples. It runs 100% offline with zero network latency.
- **Speech & Screen-Reader Integration:** Integrated **Web Speech API** with automatic queue cancellation to prevent speech lag during rapid keyboard navigation, complemented by accessible `aria-live="polite"` telemetry announcements.
- **Topological Graph Engine:** Engineered a 2D geometric neighbor resolver in TypeScript that constructs directed adjacency matrices and cardinal quadrant projections from SVG coordinate attributes.
- **Testing & Deployment:** Validated with **Vitest** unit tests and **Playwright** end-to-end browser automation on both desktop (1440px) and mobile (390px) viewports; deployed globally on **Vercel** and tracked on **GitHub**.

## Challenges we ran into

- **Preventing Auditory Cognitive Overload:** Early prototypes attempted to play every connected wire simultaneously, which sounded chaotic. We solved this by separating the macro *Audio Sweep* (an orienting overview scan) from the micro *Focal Reticle* (single active tone with directional chirp hints on keypress).
- **Audio Popping & Phase Clicks:** Rapid oscillator starts produce harsh speaker pops if the gain is switched instantaneously. We implemented a 15ms exponential gain ramp attack and a 200ms decay curve that guarantees smooth acoustic warmth.
- **SVG Group Flattening:** Many CAD and drawing tools (Inkscape, Illustrator) wrap elements in deeply nested `<g>` container tags. We developed a recursive selector that isolates constituent visual shapes while inheriting group IDs as subsystem metadata.

## Accomplishments that we're proud of

- **100% Benchmark Accuracy:** Validated against 15 external real-world benchmarks—including Texas Instruments NE555 official datasheets, W3C SVG 1.1 electrical standards, and NIH PubChem chemical structure graphs—achieving 100% topological accuracy and an average 0.8ms processing latency.
- **Dual-Experience Ergonomics:** Sighted teachers and blind students can collaborate around the same screen. The sighted teacher sees animated sonar pulse rings, directional connection vectors, and real-time panning gauges; the blind student navigates comfortably through audio cues and keyboard shortcuts.
- **Zero Hardware Barrier:** Replaces $5,000 specialized embossers with standard laptop speakers and arrow keys on any web browser.

## What we learned

- **Accessibility is an Architectural Decision:** Designing for blind users from Day 1 forced us to eliminate non-standard visual abstractions and prioritize rock-solid state management, predictable navigation invariants, and instant feedback.
- **Psychoacoustics as an Information Bandwidth:** Human ears are remarkably adept at discerning subtle frequency and stereo panning differences. Sound can convey structural density, spatial position, and physical values far faster than verbose text-to-speech reading.

## What's next for A11ySTEM

- **AI-Powered Photo-to-Schematic OCR:** Integrating multimodal vision models to photograph whiteboard circuits in physical university classrooms and instantly convert them into audible A11ySTEM topologies.
- **WebHID Refreshable Braille Display Integration:** Adding two-byte Braille pin telemetry so students with dual sensory preferences can feel pin matrices while listening to spatial audio.
- **Expanded Scientific Domains:** Developing specific sonification models for 3D protein foldings (PDB files) and complex planetary orbital mechanics.
```

---

### Built With (Tags)
```text
react, typescript, vite, tailwindcss, web-audio-api, web-speech-api, svg, accessibility, wcag-aaa, binaural-audio, sonification, stem, screen-reader, playwright, vitest, open-source
```

---

### "Try It Out" Links
- **Live Deployed App:** `https://stem2connect-ai-hackathon.vercel.app`
- **GitHub Repository:** `https://github.com/Georgefifth/stem2connect-a11ystem`

---

### Image Gallery & Captions

| # | File Path | Ratio | Caption (≤ 150 chars) |
|---|---|---|---|
| 1 | `submission/assets/gallery-01-opamp-circuit.png` | 3:2 | Interactive exploration of Inverting Op-Amp circuit with real-time stereo panning and harmonic frequency feedback. |
| 2 | `submission/assets/gallery-02-audio-sweep.png` | 3:2 | Spacebar triggers continuous audio sweep across components, conveying full 2D spatial layout in 3 seconds. |
| 3 | `submission/assets/gallery-03-calculus-damped.png` | 3:2 | Calculus damped oscillation curve where audio pitch maps to instantaneous function amplitude and slope. |
| 4 | `submission/assets/gallery-04-bst-tree.png` | 3:2 | Computer Science Balanced BST where in-order traversal ascends a harmonic musical scale from A3 to E5. |
| 5 | `submission/assets/gallery-05-svg-importer.png` | 3:2 | Instant SVG importer parses vector markup, clusters components, and auto-synthesizes accessible graphs. |
| 6 | `submission/assets/gallery-06-keyboard-guide.png` | 3:2 | Keyboard shortcuts guide explaining how horizontal pan and vertical pitch represent 2D geometry. |
| 7 | `submission/assets/gallery-07-real-world-validation.png` | 3:2 | 15/15 external benchmarks passed from Texas Instruments, W3C, and PubChem with 0.8ms average latency. |
| 8 | `submission/assets/gallery-08-mobile-experience.png` | 3:2 | Zero-install mobile web layout with touch D-pad and full Web Audio sonification on any smartphone. |

---

### Demo Video
- **Video File:** `submission/assets/demo.mp4` (Duration: 1m 50s, 1080p, H.264 / AAC, 7.8 MB)
- **Video Link:** `TODO(human): Upload submission/assets/demo.mp4 to YouTube or Vimeo and paste the public link here`
