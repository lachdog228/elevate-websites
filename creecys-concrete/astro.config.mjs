import { defineConfig } from 'astro/config';

// Update `site` to the production domain before deploying —
// it is used for canonical URLs, Open Graph tags and the sitemap.
export default defineConfig({
  site: 'https://creecysconcrete.com.au',
  build: { inlineStylesheets: 'auto' },
  image: {
    responsiveStyles: true,
  },
  compressHTML: true,
});
