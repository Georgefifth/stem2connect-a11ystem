import { chromium, firefox } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:5188';
const OUT = process.env.QA_OUT ?? 'evidence/stage-3-qa';
const BROWSER = process.env.BROWSER === 'chromium' ? 'chromium' : 'firefox';
const HEADED = process.env.HEADED === '1';

const SHOTS = path.join(OUT, 'screens');
fs.mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function expectVisible(page, selector, timeout = 10000) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible', timeout });
  return locator;
}

async function expectText(page, text, timeout = 10000) {
  const locator = page.getByText(text).first();
  await locator.waitFor({ state: 'visible', timeout });
  return locator;
}

function collectIssues(page) {
  const issues = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      issues.push({ kind: 'console', text: msg.text() });
    }
  });
  page.on('pageerror', (err) => {
    issues.push({ kind: 'pageerror', text: err.message });
  });
  page.on('requestfailed', (req) => {
    const reason = req.failure()?.errorText ?? 'request failed';
    if (!reason.includes('ERR_ABORTED')) {
      issues.push({ kind: 'requestfailed', text: `${reason} ${req.url()}` });
    }
  });
  page.on('response', (res) => {
    const status = res.status();
    if (status >= 500) issues.push({ kind: 'http', text: `${status} ${res.url()}` });
    else if (status >= 400) {
      issues.push({ kind: 'http', level: 'warn', text: `${status} ${res.url()}` });
    }
  });
  return issues;
}

const scenarios = [
  {
    id: 'landing-smoke',
    title: 'Landing page renders with tactical grid and initial focal node',
    async run(page, ctx) {
      await page.goto('/', { waitUntil: 'networkidle' });
      await ctx.expectVisible('header');
      await ctx.expectVisible('svg');
      
      const title = await page.title();
      ctx.assert(title.includes('A11ySTEM'), `Unexpected title: ${title}`);

      // Verify no horizontal overflow
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      ctx.assert(overflow <= 1, `Horizontal overflow detected: ${overflow}px`);

      // Verify default active component is Vin
      const activeHeader = await page.locator('h2').textContent();
      ctx.assert(activeHeader.includes('Vin (Input Source)'), `Expected Vin active, got: ${activeHeader}`);

      await ctx.shot('landing-initial');
    },
  },
  {
    id: 'directional-arrow-nav',
    title: 'Navigate 2D topological graph using arrow keys and verify telemetry',
    async run(page, ctx) {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Focus canvas and press ArrowRight
      await page.locator('svg').first().click();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(300);

      // Verify focal node changed to Rin (Input Resistor)
      let activeHeader = await page.locator('h2').textContent();
      ctx.assert(
        activeHeader.includes('Rin (Input Resistor)'),
        `Expected Rin (Input Resistor) active, got: ${activeHeader}`
      );

      // Verify value in inspector
      const val = await page.locator('aside').getByText('10.0 kΩ').first().textContent();
      ctx.assert(val !== null, 'Resistor value 10.0 kΩ not found in inspector');

      await ctx.shot('nav-step-1-rin');

      // Navigate Right again to Summing Node
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(300);
      activeHeader = await page.locator('h2').textContent();
      ctx.assert(
        activeHeader.includes('Summing Node'),
        `Expected Summing Node active, got: ${activeHeader}`
      );

      await ctx.shot('nav-step-2-summing');
    },
  },
  {
    id: 'audio-sweep-execution',
    title: 'Trigger continuous left-to-right audio scan sweep',
    async run(page, ctx) {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Click Play Audio Sweep
      const sweepBtn = page.getByRole('button', { name: /Play Audio Sweep/i });
      await sweepBtn.click();
      await page.waitForTimeout(500);

      // Verify scanline is visible and status announces sweep
      await ctx.expectVisible('text=SCAN');
      const statusText = await page.locator('[role="status"]').first().textContent();
      ctx.assert(statusText.includes('Audio') || statusText.includes('sweep') || statusText.includes('SCAN'), `Unexpected status: ${statusText}`);

      await ctx.shot('audio-sweep-active');

      // Stop sweep
      const stopBtn = page.getByRole('button', { name: /Stop/i }).first();
      await stopBtn.click();
      await page.waitForTimeout(200);
      await ctx.shot('audio-sweep-stopped');
    },
  },
  {
    id: 'diagram-switching',
    title: 'Switch between multi-disciplinary STEM diagrams',
    async run(page, ctx) {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Switch to Calculus Damped Oscillation
      const select = page.locator('select#diagram-select');
      await select.selectOption('calculus-damped-oscillation');
      await page.waitForTimeout(400);

      // Verify active node is Calculus initial peak
      let activeHeader = await page.locator('h2').textContent();
      ctx.assert(
        activeHeader.includes('Initial Max Peak'),
        `Expected Initial Max Peak, got: ${activeHeader}`
      );
      await ctx.expectText('f(0.0) = +1.00');
      await ctx.shot('diagram-calculus');

      // Switch to Computer Science BST
      await select.selectOption('cs-binary-search-tree');
      await page.waitForTimeout(400);
      activeHeader = await page.locator('h2').textContent();
      ctx.assert(
        activeHeader.includes('Root Node [50]'),
        `Expected Root Node [50], got: ${activeHeader}`
      );
      await ctx.shot('diagram-bst');
    },
  },
  {
    id: 'semantic-zoom-levels',
    title: 'Switch semantic zoom levels (Macro, Modules, Details)',
    async run(page, ctx) {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Click Zoom Level 1 (Macro)
      await page.getByRole('button', { name: /Zoom Level 1/i }).click();
      await page.waitForTimeout(200);
      let status = await page.locator('[role="status"]').first().textContent();
      ctx.assert(status.includes('Macro') || status.includes('Overview'), `Expected Macro zoom status, got: ${status}`);
      await ctx.shot('zoom-level-1');

      // Click Zoom Level 2 (Modules)
      await page.getByRole('button', { name: /Zoom Level 2/i }).click();
      await page.waitForTimeout(200);
      await ctx.shot('zoom-level-2');

      // Click Zoom Level 3 (Detail)
      await page.getByRole('button', { name: /Zoom Level 3/i }).click();
      await page.waitForTimeout(200);
      await ctx.shot('zoom-level-3');
    },
  },
  {
    id: 'svg-import-flow',
    title: 'Import custom SVG markup and synthesize accessible topological graph',
    async run(page, ctx) {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Open import modal
      await page.getByRole('button', { name: /Import/i }).first().click();
      await ctx.expectVisible('#import-title');

      // Load sample SVG template
      await page.getByText(/Load Sample SVG/i).click();
      await page.waitForTimeout(200);

      // Synthesize
      await page.getByRole('button', { name: /Synthesize Accessible Graph/i }).click();
      await page.waitForTimeout(500);

      // Verify imported diagram is active
      const activeHeader = await page.locator('h2').textContent();
      ctx.assert(
        activeHeader.includes('Sensor') || activeHeader.includes('Optical'),
        `Expected imported sensor node active, got: ${activeHeader}`
      );

      await ctx.shot('import-synthesized-success');
    },
  },
  {
    id: 'keyboard-guide-modal',
    title: 'Open and interact with Keyboard & Spatial Audio guide',
    async run(page, ctx) {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Open guide
      await page.getByRole('button', { name: /Guide/i }).click();
      await ctx.expectVisible('#help-title');

      // Test pitch button inside modal
      await page.getByText(/Test Pitch Scale/i).click();
      await page.waitForTimeout(400);

      await ctx.shot('guide-modal-open');

      // Dismiss modal
      await page.getByRole('button', { name: /Got it/i }).click();
      await page.waitForTimeout(300);

      // Verify modal is closed
      const isGuideVisible = await page.locator('#help-title').isVisible();
      ctx.assert(!isGuideVisible, 'Guide modal did not close on button click');
      await ctx.shot('guide-modal-closed');
    },
  },
  {
    id: 'directional-boundary-bounce',
    title: 'Graceful boundary bounce when navigating into dead-end',
    async run(page, ctx) {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Vin is far left: press ArrowLeft repeatedly
      await page.locator('svg').first().click();
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(200);

      const status = await page.locator('[role="status"]').first().textContent();
      ctx.assert(status.includes('Boundary') || status.includes('Vin'), `Expected boundary status, got: ${status}`);

      // Verify active node is still Vin
      const activeHeader = await page.locator('h2').textContent();
      ctx.assert(activeHeader.includes('Vin'), `Active node unexpectedly changed: ${activeHeader}`);

      await ctx.shot('boundary-bounce-handled');
    },
  },
];

async function main() {
  console.log(`Starting Playwright QA against: ${BASE} using ${BROWSER}`);
  const browserType = BROWSER === 'chromium' ? chromium : firefox;
  const browser = await browserType.launch({ headless: !HEADED });
  const startedAt = new Date().toISOString();
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      baseURL: BASE,
      viewport: vp.viewport,
      deviceScaleFactor: vp.deviceScaleFactor,
    });

    for (const scenario of scenarios) {
      const page = await context.newPage();
      const issues = collectIssues(page);
      const screenshots = [];
      const started = Date.now();
      let status = 'pass';
      let error = null;

      const ctx = {
        assert,
        expectVisible: (selector, timeout) => expectVisible(page, selector, timeout),
        expectText: (text, timeout) => expectText(page, text, timeout),
        shot: async (name, opts = {}) => {
          const file = path.join(SHOTS, `${scenario.id}-${name}-${vp.name}.png`);
          await page.screenshot({ path: file, fullPage: opts.fullPage ?? true });
          screenshots.push(file);
          return file;
        },
      };

      try {
        await scenario.run(page, ctx);
      } catch (err) {
        status = 'fail';
        error = err.message;
      } finally {
        await page.close().catch(() => {});
      }

      const errors = issues.filter((i) => (i.level ?? 'error') === 'error');
      const warnings = issues.filter((i) => i.level === 'warn');
      if (status === 'pass' && errors.length > 0) {
        status = 'fail';
        error = errors.map((i) => `${i.kind}: ${i.text}`).join(' | ');
      }

      results.push({
        viewport: vp.name,
        id: scenario.id,
        title: scenario.title,
        status,
        ms: Date.now() - started,
        error,
        errors,
        warnings,
        screenshots,
      });

      console.log(
        `${status === 'pass' ? '✓' : '✗'} [${vp.name}] ${scenario.id}` +
          (error ? ` — ${error}` : '')
      );
    }

    await context.close();
  }

  await browser.close();

  const summary = {
    total: results.length,
    pass: results.filter((r) => r.status === 'pass').length,
    fail: results.filter((r) => r.status === 'fail').length,
  };
  const finishedAt = new Date().toISOString();
  const report = {
    base: BASE,
    browser: BROWSER,
    headed: HEADED,
    startedAt,
    finishedAt,
    summary,
    results,
  };

  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(report, null, 2));

  const warnings = results.flatMap((r) =>
    r.warnings.map((w) => `- [${r.viewport}] ${r.id}: ${w.kind} — ${w.text}`)
  );
  const md = [
    `# QA Test Report — ${finishedAt}`,
    '',
    `- Target Base URL: ${BASE}`,
    `- Browser Engine: ${BROWSER} (${HEADED ? 'headed' : 'headless'})`,
    `- Total Executed Scenarios: ${summary.total}`,
    `- Pass: ${summary.pass} | Fail: ${summary.fail}`,
    '',
    '| Viewport | Scenario | Status | Duration (ms) | Detail |',
    '|---|---|---|---|---|',
    ...results.map(
      (r) =>
        `| ${r.viewport} | ${r.id} | ${r.status === 'pass' ? 'PASSED' : 'FAILED'} | ${r.ms} | ${(r.error ?? 'None').replace(/\|/g, '\\|')} |`
    ),
    '',
    ...(warnings.length ? ['## Warnings', '', ...warnings, ''] : []),
    '## Screenshots Captured',
    '',
    ...results.flatMap((r) => r.screenshots.map((s) => `- \`${s}\``)),
    '',
  ];
  fs.writeFileSync(path.join(OUT, 'report.md'), md.join('\n'));

  console.log(`\n${summary.pass}/${summary.total} passed — evidence written to ${OUT}/`);
  process.exit(summary.fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
