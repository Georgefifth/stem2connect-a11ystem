module.exports = [
  {
    name: 'title',
    card: {
      title: 'A11ySTEM',
      kicker: 'STEM2Connect AI Hackathon',
      sub: 'Universal Spatial Audio & 2D Semantic Diagram Navigator',
      foot: 'github.com/Georgefifth/stem2connect-a11ystem · MIT',
      preset: 'dark-premium',
      accent: '#F59E0B',
    },
    duration: 8.0,
    vo: 'In science and engineering, diagrams are everything. But for millions of blind students, complex schematics remain an impenetrable barrier.',
    pause: 0.3,
  },
  {
    name: 'problem',
    card: {
      title: 'The Accessibility Crisis',
      kicker: 'The Problem',
      sub: 'Screen readers flatten schematics into useless alt text. Embossers cost thousands of dollars.',
      foot: 'Over 90% of university STEM courses rely on visual diagrams',
      preset: 'dark-premium',
      accent: '#F59E0B',
    },
    duration: 8.5,
    vo: 'Screen readers treat complex circuit diagrams and chemical cycles as meaningless alt text, locking visually impaired students out of STEM education.',
    pause: 0.3,
  },
  {
    name: 'how-it-works',
    card: {
      title: 'The Spatial Audio Engine',
      kicker: 'How It Works',
      sub: 'Horizontal X maps to stereo panning; Vertical Y maps to harmonic pitch; 2D compass navigates branches.',
      foot: 'Logarithmic pitch C3 to C6 · Real-time binaural synthesis',
      preset: 'dark-premium',
      accent: '#F59E0B',
    },
    duration: 9.5,
    vo: 'A11ySTEM translates spatial visual diagrams into binaural sound: stereo panning conveys horizontal position, musical pitch reflects vertical height, and arrow keys traverse topological connections.',
    pause: 0.3,
  },
  {
    name: 'live-circuit-navigation',
    url: 'https://stem2connect-ai-hackathon.vercel.app',
    session: 'app',
    actions: [
      { type: 'waitFor', sel: 'svg', timeout: 15000 },
      { type: 'click', sel: 'svg' },
      { type: 'wait', ms: 1000 },
      { type: 'click', sel: 'button[aria-label*="Navigate Right"]' },
      { type: 'wait', ms: 1500 },
      { type: 'click', sel: 'button[aria-label*="Navigate Right"]' },
      { type: 'wait', ms: 1500 },
      { type: 'click', sel: 'button[aria-label*="Navigate Up"]' },
      { type: 'wait', ms: 1800 },
    ],
    vo: 'Here is an inverting operational amplifier. Navigating with arrow keys moves focus from the AC input to the series resistor, summing node, and feedback loop, playing spatial acoustic chimes.',
    pause: 0.3,
  },
  {
    name: 'live-audio-sweep',
    session: 'app',
    actions: [
      { type: 'click', sel: 'button[aria-label*="Play Audio Sweep"]' },
      { type: 'waitFor', sel: 'text=SCAN', timeout: 8000 },
      { type: 'wait', ms: 3200 },
    ],
    vo: 'Pressing the spacebar launches a continuous left-to-right audio sweep, sonifying every component position and resonant frequency across the stereo soundstage.',
    pause: 0.3,
  },
  {
    name: 'live-multi-discipline',
    session: 'app',
    actions: [
      { type: 'click', sel: '#diagram-select' },
      { type: 'wait', ms: 500 },
      {
        type: 'exec',
        js: `() => {
          const sel = document.querySelector('#diagram-select');
          if (sel) {
            sel.value = 'calculus-damped-oscillation';
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }`,
      },
      { type: 'wait', ms: 2000 },
      {
        type: 'exec',
        js: `() => {
          const sel = document.querySelector('#diagram-select');
          if (sel) {
            sel.value = 'cs-binary-search-tree';
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }`,
      },
      { type: 'wait', ms: 2200 },
    ],
    vo: 'A11ySTEM seamlessly switches to calculus damped oscillations and balanced binary search trees, where in-order traversal produces an ascending musical scale.',
    pause: 0.3,
  },
  {
    name: 'live-svg-ingestion',
    session: 'app',
    actions: [
      { type: 'click', sel: 'button[aria-label="Import custom SVG diagram"]' },
      { type: 'waitFor', sel: '#import-title', timeout: 8000 },
      { type: 'wait', ms: 600 },
      { type: 'click', sel: 'text=Load Sample SVG' },
      { type: 'wait', ms: 1000 },
      { type: 'click', sel: 'text=Synthesize Accessible Graph' },
      { type: 'wait', ms: 2500 },
    ],
    vo: 'Educators can paste any SVG schematic. Our topological engine automatically parses elements, constructs directional navigation trees, and generates WAI-ARIA accessible graphics.',
    pause: 0.3,
  },
  {
    name: 'real-world-validation',
    card: {
      title: 'Real-World Validation',
      kicker: 'Stage 3.5 Results',
      sub: '15 / 15 multi-disciplinary benchmarks passed across Texas Instruments, W3C, and PubChem datasets with 0.8ms average latency.',
      foot: '100% Pass Rate · Mathematical Precision · Zero Audio Popping',
      preset: 'dark-premium',
      accent: '#F59E0B',
    },
    duration: 9.5,
    vo: 'In comprehensive benchmark evaluations against fifteen external standards from Texas Instruments and PubChem, A11ySTEM passed with one-hundred percent topological accuracy and sub-millisecond latency.',
    pause: 0.3,
  },
  {
    name: 'closing-cta',
    card: {
      title: 'Empowering Every Mind',
      kicker: 'Inclusive STEM Education',
      sub: '100% Free, Open-Source & Web Native. Built for the STEM2Connect AI Hackathon.',
      foot: 'Try live: stem2connect-ai-hackathon.vercel.app · github.com/Georgefifth/stem2connect-a11ystem',
      preset: 'dark-premium',
      accent: '#F59E0B',
    },
    duration: 10.0,
    vo: 'A11ySTEM is free, open-source, and runs on any device. By turning visual barriers into spatial sound, we ensure every student can build the future of science.',
    pause: 0.5,
  },
];
