# Creecy's Concrete

A single-page marketing site for Creecy's Concrete, built with [Astro](https://astro.build).

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the production build locally
npm run check    # Astro + TypeScript diagnostics
```

The build is fully static — no server or runtime required.

## Deploying to Netlify

**`html/` is the ready-to-upload build.** It is committed so it can be deployed
without running a build first.

- **Drag and drop** — go to <https://app.netlify.com/drop> and drop the `html`
  folder (or the zip of its *contents*) onto the page.
- **Connect the repo instead** — set the base directory to `creecys-concrete`,
  the build command to `npm run build`, and the publish directory to
  `creecys-concrete/dist`.

`html/_headers` ships with the upload and tells Netlify to cache the
fingerprinted assets in `/_astro/` for a year while always revalidating the
HTML.

> **Rebuild `html/` after any source change**, or the deployed site will be
> stale:
>
> ```bash
> npm run build && rm -rf html && cp -r dist html
> ```

### One thing to check before going live

`site` in `astro.config.mjs` is set to `https://creecysconcrete.com.au`. That
value is baked into the canonical URL and the Open Graph image URL at build
time. If the site will live at a different address — including permanently on a
`*.netlify.app` subdomain — change `site` and rebuild, otherwise link previews
will point at a domain that isn't serving the page.

---

## Before launch

Two things need real details substituted in.

### 1. Business details — `src/data/site.ts`

Every phone number, email, service area and URL on the page comes from this one
file. The placeholders are marked `TODO`:

| Field         | Placeholder                      | Appears in                          |
| ------------- | -------------------------------- | ----------------------------------- |
| `url`         | `https://creecysconcrete.com.au` | canonical URL, Open Graph, robots   |
| `phone`       | `0400 000 000`                   | header, contact section, footer     |
| `email`       | `hello@creecysconcrete.com.au`   | contact section, footer             |
| `serviceArea` | generic wording                  | contact section, footer, schema.org |
| `hours`       | `Mon – Fri, 7am – 5pm`           | contact section                     |

Also update the sitemap line in `public/robots.txt` if the domain changes.

### 2. Photography

**The current photos are licence-free stock placeholders, not Creecy's jobs.**
They were chosen to hold the right composition and tone until real photos are
available. Nothing on the page claims a specific client, location or date — so
swapping the images in is the only change needed.

To replace them:

1. Drop the new files into `src/assets/images/`.
2. Point the `import` lines in `src/data/projects.ts` and `src/data/services.ts`
   at the new files.
3. Rewrite each `alt` string to describe the actual photo (these matter for
   accessibility and SEO).

Supply images at roughly these sizes — Astro generates every smaller variant and
converts to WebP at build time, so bigger sources are fine:

| Slot                    | Aspect | Suggested source |
| ----------------------- | ------ | ---------------- |
| `hero.jpg`              | 16:9   | 2560 × 1440      |
| `about.jpg`             | 4:5    | 1400 × 1750      |
| `cta.jpg`               | 2:1    | 2400 × 1200      |
| `service-*.jpg`         | 4:5    | 1200 × 1500      |
| `project-01.jpg`        | 4:5    | 1600 × 2000      |
| `project-02…05.jpg`     | 4:3    | 1400 × 1050      |

The projects grid composes the first five entries into an editorial layout; the
first is the large featured slot. Extra entries fall back to a tidy half-width
tile, so the list can grow without touching the CSS.

---

## Structure

```
src/
  assets/images/     source photography (optimised at build time)
  components/        one component per page section
  data/
    site.ts          ← business details, nav, SEO copy
    services.ts      ← the six services
    projects.ts      ← the project gallery
  layouts/
    BaseLayout.astro <head>, metadata, JSON-LD, scroll-reveal script
  pages/index.astro  section order
  styles/global.css  design tokens, reset, typography, buttons
```

## Design system

Defined once as custom properties at the top of `src/styles/global.css`.

- **Colour** — warm concrete neutrals (`--ink` `#12100e` → `--paper` `#f3f1ed`)
  with a single burnt-ochre accent (`--accent` `#9c5420`, `--accent-on-ink`
  `#d98a46`) used sparingly on rules, numerals and hover states. Both accent
  values clear 4.5:1 against their intended background.
- **Type** — Archivo (display) and Inter (body), self-hosted via Fontsource so
  there are no third-party font requests. Sizes are fluid `clamp()` steps.
- **Dark sections** — add `class="on-ink"` and the whole text/line/accent
  palette flips through the token overrides; no per-component colour work.

## Notes on behaviour

- **No UI framework and no JS libraries.** The three small inline scripts handle
  the sticky header, the mobile menu and the hero parallax. Total shipped JS is
  a couple of kilobytes.
- **Scroll reveals** are progressive enhancement: the `js-reveal` class is only
  added by script, so with JS disabled everything renders in its final state.
- **`prefers-reduced-motion`** is honoured throughout — the parallax handler is
  never attached, entrance animations are dropped, and reveals render static.
- **Images** are lazy-loaded except the hero, which is `eager` +
  `fetchpriority="high"`; all carry intrinsic dimensions to avoid layout shift.
