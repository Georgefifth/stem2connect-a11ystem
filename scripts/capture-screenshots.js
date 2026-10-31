import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('evidence/stage-2-build/frontend');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log('Starting preview server on port 5188...');
  const server = spawn('npx', ['vite', 'preview', '--port', '5188', '--strictPort'], {
    stdio: 'pipe',
    shell: true,
  });

  // Wait for server to come up
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const browser = await chromium.launch();

  try {
    // 1. Desktop 1440x900
    console.log('Capturing Desktop 1440x900...');
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktopPage.goto('http://localhost:5188', { waitUntil: 'networkidle' });
    await desktopPage.screenshot({ path: path.join(outDir, 'desktop-1440.png') });

    // 2. Interactive Navigation via Arrow Key
    console.log('Testing Arrow Right Navigation...');
    await desktopPage.keyboard.press('ArrowRight');
    await desktopPage.waitForTimeout(300);
    await desktopPage.screenshot({ path: path.join(outDir, 'desktop-arrow-nav.png') });

    // 3. Audio Sweep (Spacebar)
    console.log('Testing Audio Sweep...');
    await desktopPage.keyboard.press(' ');
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(outDir, 'desktop-audio-sweep.png') });
    await desktopPage.keyboard.press(' '); // stop sweep

    // 4. Keyboard Guide Modal
    console.log('Capturing Keyboard Guide Modal...');
    await desktopPage.click('button[aria-label="Keyboard shortcuts & Audio guide"]');
    await desktopPage.waitForTimeout(400);
    await desktopPage.screenshot({ path: path.join(outDir, 'desktop-guide-modal.png') });
    await desktopPage.click('button[aria-label="Close Guide"]');
    await desktopPage.waitForTimeout(300);

    // 5. Import Modal
    console.log('Capturing Import Modal...');
    await desktopPage.click('button[aria-label="Import custom SVG diagram"]');
    await desktopPage.waitForTimeout(400);
    await desktopPage.screenshot({ path: path.join(outDir, 'desktop-import-modal.png') });
    await desktopPage.click('button[aria-label="Close Import Modal"]');
    await desktopPage.waitForTimeout(300);

    // 6. Mobile 390x844
    console.log('Capturing Mobile 390x844...');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto('http://localhost:5188', { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: path.join(outDir, 'mobile-390.png') });

    console.log('All frontend screenshots captured successfully in:', outDir);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
