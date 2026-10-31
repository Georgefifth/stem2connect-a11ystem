import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('submission/assets');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log('Starting preview server on port 5188...');
  const server = spawn('npx', ['vite', 'preview', '--port', '5188', '--strictPort'], {
    stdio: 'pipe',
    shell: true,
  });

  await new Promise((resolve) => setTimeout(resolve, 1500));
  const browser = await chromium.launch();

  try {
    // 3:2 Ratio Viewport: 1200 x 800
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5188', { waitUntil: 'networkidle' });

    // 1. Thumbnail (3:2)
    console.log('Capturing Thumbnail (1200x800)...');
    await page.screenshot({ path: path.join(outDir, 'thumbnail.png') });

    // 2. Gallery 1: Op-Amp Circuit
    console.log('Capturing Gallery 1 (Op-Amp)...');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, 'gallery-01-opamp-circuit.png') });

    // 3. Gallery 2: Audio Sweep
    console.log('Capturing Gallery 2 (Audio Sweep)...');
    await page.getByRole('button', { name: /Play Audio Sweep/i }).click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'gallery-02-audio-sweep.png') });
    await page.getByRole('button', { name: /Stop/i }).first().click();
    await page.waitForTimeout(300);

    // 4. Gallery 3: Calculus Damped Oscillation
    console.log('Capturing Gallery 3 (Calculus)...');
    await page.locator('#diagram-select').selectOption('calculus-damped-oscillation');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'gallery-03-calculus-damped.png') });

    // 5. Gallery 4: BST Tree
    console.log('Capturing Gallery 4 (BST)...');
    await page.locator('#diagram-select').selectOption('cs-binary-search-tree');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'gallery-04-bst-tree.png') });

    // 6. Gallery 5: SVG Importer Modal
    console.log('Capturing Gallery 5 (SVG Importer)...');
    await page.locator('#diagram-select').selectOption('op-amp-inverting');
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Import custom SVG/i }).click();
    await page.waitForTimeout(400);
    await page.getByText(/Load Sample SVG/i).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, 'gallery-05-svg-importer.png') });
    await page.getByRole('button', { name: /Close Import Modal/i }).click();
    await page.waitForTimeout(300);

    // 7. Gallery 6: Keyboard Guide
    console.log('Capturing Gallery 6 (Keyboard Guide)...');
    await page.getByRole('button', { name: /Keyboard shortcuts & Audio guide/i }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, 'gallery-06-keyboard-guide.png') });
    await page.getByRole('button', { name: /Close Guide/i }).click();
    await page.waitForTimeout(300);

    // 8. Gallery 7: Real-World Validation Frame (from Stage 4 QA)
    console.log('Linking Gallery 7 (Validation Frame)...');
    if (fs.existsSync('evidence/stage-4-demo/qa/frame-95.png')) {
      fs.copyFileSync('evidence/stage-4-demo/qa/frame-95.png', path.join(outDir, 'gallery-07-real-world-validation.png'));
    }

    // 9. Gallery 8: Mobile Touch Experience
    console.log('Capturing Gallery 8 (Mobile Layout)...');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await mobilePage.goto('http://localhost:5188', { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: path.join(outDir, 'gallery-08-mobile-experience.png') });
    await mobilePage.close();

    // 10. Copy Demo Video
    console.log('Copying Demo Video...');
    if (fs.existsSync('evidence/stage-4-demo/demo.mp4')) {
      fs.copyFileSync('evidence/stage-4-demo/demo.mp4', path.join(outDir, 'demo.mp4'));
    }

    console.log('All submission assets generated successfully in:', outDir);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error('Failed to generate submission assets:', err);
  process.exit(1);
});
