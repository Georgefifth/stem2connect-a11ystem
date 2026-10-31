# QA Scenarios — A11ySTEM

## Priority 0 (P0) — Blocks Core User Task & Accessibility Outcome
- `landing-smoke`: First visit loads without console errors or layout shift; title is correct; canvas renders with high-contrast tactical grid; default diagram is loaded; focus starts on initial component `Vin (Input Source)`.
- `directional-arrow-navigation`: Pressing `ArrowRight` moves focus to `Rin (Input Resistor)`; coordinates, stereo pan indicator (-1.0 to 1.0), and frequency update in real time; inspector values match component specs; ARIA status region announces change.
- `audio-sweep-execution`: Pressing `Spacebar` initiates continuous left-to-right audio scan sweep; visual scanline advances from 0% to 100%; hitting Spacebar again or completion resets cleanly without hanging.
- `diagram-switching`: Switching diagram via dropdown (e.g. to Calculus Damped Oscillation, Krebs Cycle, or Binary Search Tree) resets root node, re-renders nodes and directional edges, and updates educational track banner.
- `responsive-mobile-390`: At 390px viewport, layout stacks vertically without horizontal overflow (`scrollWidth <= innerWidth + 1`); D-pad and canvas remain fully interactive; touch targets meet >= 44px standard.

## Priority 1 (P1) — Major Usability & Multimodal Features
- `semantic-zoom-levels`: Pressing `1` (Macro Overview), `2` (Modules), and `3` (Detail) updates visible node density on canvas; status updates accordingly.
- `svg-import-modal`: Opening SVG import modal, entering custom SVG markup or clicking "Load Sample SVG", and clicking "Synthesize Accessible Graph" loads the custom diagram into the workspace with calculated 2D topology.
- `keyboard-guide-modal`: Clicking Guide button or pressing `?` / `H` displays full hotkey reference and spatial audio explanation; Escape or close button dismisses cleanly.
- `export-accessible-svg`: Clicking "Export A11y SVG" triggers client-side download of SVG with embedded WAI-ARIA `role="treeitem"`, `aria-label`, and `<desc>` accessibility tags.

## Priority 2 (P2) — Audio Polish & Edge Boundary Handling
- `directional-boundary-bounce`: Attempting to navigate beyond boundary (e.g. Up from `Vin` where no upper node exists) does not throw errors; displays informative status message ("Boundary reached: No node to the up") and plays boundary chirp.
- `audio-mute-toggle`: Pressing `M` or clicking Volume toggle switches between muted and audible states without throwing Web Audio API errors.
