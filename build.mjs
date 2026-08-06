#!/usr/bin/env node
/**
 * Sulex Electrics — static site build.
 *
 * Zero dependencies, no npm install, no toolchain. Assembles the three pages
 * from the shared templates in src/ and writes plain HTML/CSS/JS into dist/.
 * Upload the contents of dist/ to cPanel (File Manager or FTP) and that's it.
 *
 *   node build.mjs
 */

import { mkdir, readdir, copyFile, writeFile, rm, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/data/site.mjs';
import { page } from './src/templates/layout.mjs';

import index from './src/pages/index.mjs';
import services from './src/pages/services.mjs';
import contact from './src/pages/contact.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const dist = join(root, 'dist');

const pages = [index, services, contact];

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const a = join(from, entry.name);
    const b = join(to, entry.name);
    if (entry.isDirectory()) await copyDir(a, b);
    else await copyFile(a, b);
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.map((p) => {
    const loc = p.slug === 'index' ? `${site.origin}/` : `${site.origin}/${p.slug}.html`;
    const priority = p.slug === 'index' ? '1.0' : '0.8';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

const robots = `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`;

async function build() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  // Static files that ship as-is (favicons, images, .htaccess).
  const staticDir = join(src, 'static');
  if (await exists(staticDir)) await copyDir(staticDir, dist);

  // Stylesheet and script.
  await mkdir(join(dist, 'assets/css'), { recursive: true });
  await mkdir(join(dist, 'assets/js'), { recursive: true });
  await copyFile(join(src, 'css/styles.css'), join(dist, 'assets/css/styles.css'));
  await copyFile(join(src, 'js/main.js'), join(dist, 'assets/js/main.js'));

  // Pages.
  const written = [];
  for (const p of pages) {
    const file = join(dist, `${p.slug}.html`);
    await writeFile(file, page(p), 'utf8');
    written.push(relative(root, file));
  }

  await writeFile(join(dist, 'robots.txt'), robots, 'utf8');
  await writeFile(join(dist, 'sitemap.xml'), sitemap(), 'utf8');

  console.log('Built:');
  for (const f of written) console.log('  ' + f);
  console.log('  dist/robots.txt');
  console.log('  dist/sitemap.xml');
  console.log('\nUpload the contents of dist/ to public_html.');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
