const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const FPS = 25, DUR = 6.0;
const N = Math.round(FPS * DUR);
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/elevate-websites/review/pour-renderer.html', { waitUntil: 'load' });
  await p.waitForTimeout(300);
  if (errs.length) { console.log('RENDERER ERRORS:', errs); process.exit(1); }
  const t0 = Date.now();
  for (let i = 0; i < N; i++) {
    const t = (i / FPS);
    const data = await p.evaluate(tt => { renderFrame(tt); return document.getElementById('c').toDataURL('image/jpeg', 0.96); }, t);
    fs.writeFileSync(`frames/f${String(i).padStart(4, '0')}.jpg`, Buffer.from(data.split(',')[1], 'base64'));
    if (i % 30 === 0) process.stdout.write(`  ${i}/${N}\n`);
  }
  console.log(`  ${N}/${N} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await b.close();
})();
