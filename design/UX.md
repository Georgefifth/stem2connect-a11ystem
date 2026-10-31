# UX Contract — A11ySTEM (Accessible Spatial Audio & Semantic STEM Diagram Navigator)

> Acceptance contract for the frontend: if the implementation does not match this file, the implementation is wrong.

## 1. Product

- **One-liner:** The first browser-native interactive spatial audio and 2D semantic keyboard navigator that empowers blind and low-vision students to explore, hear, and master complex STEM diagrams (circuits, calculus, organic chemistry, state machines).
- **Primary user:** Blind and low-vision high school / college STEM students, accessibility resource specialists, and inclusive STEM educators.
- **Job to be done:** Understand the spatial topology, component identities, numerical parameters, and functional pathways of STEM diagrams without relying on sighted human description or multi-thousand-dollar tactile embossers.
- **Core success action:** Press arrow keys to navigate between interconnected diagram components, hearing real-time spatial binaural audio (stereo pan for X, pitch tone for Y/voltage/magnitude) and spoken semantic context within 100ms.
- **What the user should never have to guess:** 
  1. Where their focus is currently located in 2D space.
  2. What directional branches (Up/Down/Left/Right) are valid moves from the active node.
  3. How to immediately trigger a full left-to-right audio scan sweep (Spacebar).
  4. Which single-key shortcuts exist (press `?` or `H` anytime to open the Audio & Keyboard Cheat Sheet).

## 2. Core Flow

| # | Step | User action | System feedback | Next step is obvious? |
|---|---|---|---|---|
| 1 | **Discover & Select** | Land on app; select a curated STEM diagram (e.g. "Operational Amplifier Circuit", "Damped Oscillation Curve", "Krebs Cycle", "Binary Search Tree") or paste custom SVG | Canvas renders immediately with high-contrast tactile layout; focus snaps to root/primary node; audio chime sounds; screen reader announces: *"Loaded: Op-Amp Circuit. Active: Vin Input Node at coordinates 15%, 50%. Press right arrow to navigate to Rin."* | Yes: screen reader and visual focus ring clearly indicate current position. |
| 2 | **Spatial & Audio Navigation** | Press Arrow Keys (`←` `↑` `→` `↓`) or `Tab` | Instant stereo tone plays: stereo pan corresponds to X position (-1.0 left to +1.0 right), musical pitch corresponds to Y position/voltage level; sonar pulse ripple expands from focal node; node details update in side inspect drawer; ARIA live region speaks component name and value. | Yes: directional indicators show next available neighbors. |
| 3 | **Sonification Sweep & Multi-Level Zoom** | Press `Spacebar` for continuous Left-to-Right audio sweep; or press `1` (Blueprint Overview), `2` (Sub-circuit Module), `3` (Component Detail) | Audio engine sweeps all components from left to right in 2.5 seconds with continuous pitch sonification; zoom mode announces scope level. | Yes: audio progress bar sweeps across canvas. |

**Target:** ≤ 2 steps and ≤ 15 seconds from landing to the core result.

## 3. Pages / Layout Architecture

| Page / Section | Purpose | Primary action | Secondary actions |
|---|---|---|---|
| **Workspace (Single-Page App)** | Interactive diagram exploration canvas with sonification engine | Navigate nodes with `Arrow Keys` / `Space` sweep | Switch diagram topic, toggle Voice Narration, switch Zoom level (`1`/`2`/`3`), import custom SVG |
| **Diagram Importer Modal** | Load custom SVG diagrams or raw markup | Paste SVG and click "Synthesize Accessible Graph" | Load pre-made templates, test sample diagrams |
| **Keyboard & Audio Guide (`?` / `H`)** | Interactive keyboard shortcut & sound glossary | Read shortcuts and test tone pitches | Adjust volume, speech speed, and pitch sensitivity |

One primary action per screen: the interactive canvas owns the screen, with zero clutter.

## 4. Required States

For every interactive component and view:

- [x] **Empty / First visit:** Curated library loaded with default "Operational Amplifier Circuit", active focus on initial input node, audio initialized with clear "Press Space to listen to full diagram" prompt.
- [x] **Loading:** Subtle tactical pulse indicator during SVG graph synthesis; audio context activation feedback.
- [x] **Success:** Confirm node selected with audio ping, visual focal halo, and crisp ARIA announcement.
- [x] **Error:** Graceful error toast with recovery suggestions (e.g., "Web Audio API requires user gesture — click anywhere or press Enter to enable audio").
- [x] **Invalid input:** Importer validates SVG syntax; highlights missing coordinate or empty elements with actionable fix message.
- [x] **No permission / Signed out:** N/A (100% client-side, privacy-first, zero login required).
- [x] **Mobile 390px layout:** Responsive vertical stack: Top tactile audio-visual canvas, middle directional tactile D-pad (for mobile touch screen-reader users), bottom speech/data inspect panel.

## 5. Design Tokens

- **Font family & scale:**
  - Display / Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` (Used for coordinates, component metrics, pinouts, and keyboard hotkey badges).
  - Body / UI: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (Clean, crisp legibility).
  - Sizes: `12px` (micro meta), `14px` (secondary specs), `16px` (base readable text), `20px` (section headers), `28px` (primary banner).
- **Spacing scale:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`.
- **Colors (WCAG AAA compliant, contrast > 7:1):**
  - Background Base: `#080C14` (Deep obsidian slate)
  - Surface Card / Drawer: `#0F172A` (Rich slate navy)
  - Surface Border / Grid: `#1E293B` (Tactile coordinate grid lines)
  - Accent / Focus Ring: `#F59E0B` (Luminous Amber — unmistakable visual focus and sound indicator)
  - Signal Flow / Wire: `#38BDF8` (Luminous Cyan)
  - Source / Input: `#10B981` (Emerald Green)
  - High-Voltage / Ground / Danger: `#F43F5E` (Rose Coral)
  - Text Primary: `#F8FAFC` (Pure crisp off-white)
  - Text Muted: `#94A3B8` (High-contrast secondary slate)
- **Radius & borders:**
  - Crisp engineered borders: `1px solid #1E293B` or `#334155`
  - Subtle utilitarian radius: `6px` to `8px` (no giant bubbled pill cards).
- **Button & input height:** Minimum touch target `48px` on mobile, `40px` on desktop with visible focus ring (`3px solid #F59E0B`).
- **Icon style:** Minimal geometric SVG stroke icons (`stroke-width: 2`), crisp and accessible with aria-hidden and accompanying text labels.

## 6. References

| Reference | What to borrow | What not to copy |
|---|---|---|
| **Desmos Accessibility (Audio Trace)** | Pitch mapping to vertical axis ($Y$) and stereo panning to horizontal axis ($X$). | Single-curve restriction; closed math engine. |
| **Logic Gate / ECE Breadboard CAD** | High-precision schematic clarity, clean wire routing, pin labelling. | Cluttered 200-tool toolbar, complex multi-layer PCB routing. |
| **Ableton / Synthesizer Oscilloscope** | Harmonic sound design: warm sine/triangle waves with smooth ADSR gain envelope (no harsh square buzzing). | Complex musical DAW layout. |

## 7. Mobile Ergonomics (390px Viewport)

- **390px layout:** Vertical layout: Top 45vh dedicated to tactile SVG canvas with zoom/pan controls; Bottom 55vh dedicated to touch D-pad (Up/Down/Left/Right directional buttons with tactile audio clicks) and the Node Telemetry Inspector.
- **Primary action reachable without horizontal scroll:** Yes, giant "Play Audio Sweep" and Directional Navigation buttons directly reachable with thumb.
- **What is collapsed or hidden:** Secondary export menus and raw SVG source editor collapsed into high-contrast sheets.
- **Keyboard behavior:** On desktop and Bluetooth mobile keyboards, all arrow keys navigate seamlessly without scrolling the page.

## 8. Visual Direction

- **Three adjectives:** Tactile, Resonant, High-Precision.
- **Product archetype:** Interactive Audio-Visual Canvas & Accessible STEM Studio.
- **Palette and why it fits domain:** Deep Obsidian Slate (`#080C14`) with Luminous Amber (`#F59E0B`) and Signal Cyan (`#38BDF8`). Evokes scientific oscilloscopes and laboratory test benches. High contrast is vital for low-vision and photophobic users, completely eliminating glare.
- **Type pairing:** Utilitarian Monospace for parameters/values + Crisp Geometric Sans for UI chrome.
- **Density:** Balanced-High. High information density in the inspector panel (coordinates, electrical parameters, chemical equations, topological connections) without visual clutter.
- **Signature element:** **The Spatial Sonar Focal Reticle & Audio Harmonic Waveform**: As focus moves, a golden concentric pulse rings out from the node, accompanied by a dynamic mini-waveform visualizer displaying the active sonification timbre.
- **Motion rules:** Motion strictly serves functional feedback:
  - Concentric sonar ring expands once on node focus (250ms duration, ease-out).
  - Audio scanline moves linearly across X-axis during `Spacebar` sweep.
  - Zero purely decorative floaters, zero looping spinners, zero glassmorphism blurs.
- **Rejected clichés:**
  - NO purple/blue gradient backgrounds.
  - NO frosted glassmorphism cards.
  - NO 3-card generic marketing hero.
  - NO emoji icons.
  - NO generic KPI charts.

**Generic test:** Could this first screen be dropped into any other SaaS product? **NO.** The screen immediately reads as a dedicated high-precision scientific diagram navigator and spatial audio instrument.

## 9. UX Acceptance Checklist

- [x] A first-time user understands the product's purpose within 5 seconds (header says: *"A11ySTEM: Interactive Spatial Audio & 2D Semantic STEM Diagram Navigator"*).
- [x] The core task (navigating and hearing a diagram) is reachable from the landing page in 0 clicks (already active on load).
- [x] Every keyboard or touch action produces visible feedback and audio feedback within 50ms.
- [x] Every error explains what happened and provides a recovery action (e.g. click to unlock AudioContext).
- [x] Empty states are actionable (offers pre-built sample diagrams or custom SVG paste).
- [x] No dead ends; zero icon-only buttons without text or `aria-label`.
- [x] Desktop (1440px) and mobile (390px) layouts verified side-by-side with Playwright screenshots.
- [x] Audio synthesis engine verified: smooth gain envelopes, stereo panning from -1.0 to +1.0, musical pitch range C3 to C6, zero clicks or pops.
