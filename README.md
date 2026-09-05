# DeMarzi Brothers and Sons

A single-page marketing site for DeMarzi Brothers and Sons — concreting and civil works.

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.

**Everything that gets deployed lives in `site/`.** Nothing outside it is
served — those files are the source notes and helper scripts.

```
site/                        <- this folder is the website
  index.html                 The whole page
  assets/css/site.css        Design system + all styles
  assets/js/site.js          Sticky nav, scroll reveals, mobile menu, hover preview
  assets/fonts/              Self-hosted variable fonts (112 KB)
  assets/img/                Photography (WebP) + Open Graph image
  assets/favicon.svg         Browser tab icon
  robots.txt, sitemap.xml    Search engine basics

netlify.toml                 Publish directory + cache headers (Git deploys only)
tools/make-og-image.py       Rebuilds the link-preview image
README.md                    This file
```

To preview it locally:

```bash
cd site && python3 -m http.server 8000    # then open http://localhost:8000
```

Opening `site/index.html` directly with `file://` will not work — the page
uses absolute paths (`/assets/...`), which need a server root. Any static
server, or Netlify, resolves them correctly.

---

## Deploying to Netlify

**Drag and drop.** Go to <https://app.netlify.com/drop> and drag the **`site`
folder** onto the page. That is the whole deploy — `index.html` sits at the
folder's root, which is what Netlify expects. It is live in a few seconds on a
`*.netlify.app` address.

To update later, drag the folder again onto the same site's *Deploys* tab.

**Connecting the Git repository instead** (so pushes deploy automatically):
Netlify reads `netlify.toml`, which already sets the publish directory to
`site` and leaves the build command empty. Nothing else to configure.

Either way, add the real domain under *Domain management*, then update the
domain placeholders listed below — Netlify does not rewrite them.

---

## Before this site goes live

Nothing below is a verified fact about the business. Everything is either a
placeholder or an assumption that needs Frank's confirmation. Search
`site/index.html` for `TODO` to find each one in place.

### 1. Contact details — required

Each value appears in more than one place. Replace **all** occurrences.

| What | Placeholder | Appears in |
|---|---|---|
| Phone | `0400 000 000` (and `tel:+61400000000`) | mobile menu, contact section, footer, structured data |
| Email | `hello@demarzibrothers.com.au` | mobile menu, contact button, contact section, footer, structured data |
| Service area | `Your service area` | hero strip, contact section, footer, structured data |
| Trading hours | `Mon–Fri, 7am – 4pm` | contact section |
| ABN / licence | `ABN 00 000 000 000` | footer — replace, or delete the line |
| Domain | `https://www.demarzibrothers.com.au/` | `<link rel="canonical">`, all `og:` tags, structured data, `robots.txt`, `sitemap.xml` |
| Suburb / state | `"addressLocality": "Suburb"`, `"addressRegion": "STATE"` | structured data (`application/ld+json`) |

A quick way to do the repeatable ones:

```bash
# Phone (both the link and the visible text)
sed -i 's/+61400000000/+61YOURNUMBER/g; s/0400 000 000/04XX XXX XXX/g' site/index.html
# Email
sed -i 's/hello@demarzibrothers.com.au/YOUR@EMAIL.com.au/g' site/index.html
# Service area
sed -i 's/Your service area/Geelong and the Bellarine/g' site/index.html
# Domain (index.html, robots.txt and sitemap.xml)
sed -i 's|https://www.demarzibrothers.com.au|https://yourdomain.com.au|g' site/index.html site/robots.txt site/sitemap.xml
```

### 2. Photography — required

**Every image on the site is a licensed stock placeholder from Unsplash. None of
it is DeMarzi's work.** It is there so the layout is finished and so the real
photos can be dropped straight in.

To replace one, save the new photo over the existing file in `site/assets/img/`
**using the same filename**, at roughly the same dimensions. No code changes
are needed.

| File | Where it appears | Size | Should show |
|---|---|---|---|
| `hero-entry.webp` | Hero, right-hand panel | 1200 × 1500 (4:5 portrait) | Best finished job — the first thing anyone sees |
| `about-placing.webp` | About section, large | 1200 × 1500 (4:5 portrait) | The crew placing concrete |
| `about-detail.webp` | About section, small inset | 800 × 800 (square) | A tool or close finish detail |
| `service-driveways.webp` | Services — Driveways & Paths | 1100 × 760 (3:2) | A completed driveway |
| `service-slabs.webp` | Services — Slabs & Footings | 1100 × 760 (3:2) | A slab pour or screed |
| `service-decorative.webp` | Services — Decorative Finishes | 1100 × 760 (3:2) | Exposed aggregate or honed finish |
| `service-civil.webp` | Services — Civil & Earthworks | 1100 × 760 (3:2) | Excavation or site prep |
| `work-01.webp` | Gallery, large landscape | 1400 × 1000 (7:5) | Strong finished job |
| `work-02.webp` | Gallery, tall portrait | 900 × 1200 (3:4) | Wall or vertical element |
| `work-05.webp` | Gallery, full-width | 1800 × 900 (2:1) | The widest, most impressive shot |
| `work-06.webp` | Gallery, tall portrait | 900 × 1150 (3:4) | Structural or architectural |
| `work-04.webp` | Gallery, square | 800 × 800 (1:1) | A close finish detail |
| `og-image.jpg` | Link previews (Facebook, LinkedIn, iMessage) | 1200 × 630 | **Already branded** — the wordmark is set into the image. See below before replacing. |

To convert and resize a batch of photos:

```bash
python3 -m pip install pillow
python3 - <<'PY'
from PIL import Image, ImageOps
# (source file, output name, width, height)
JOBS = [("DSC_0101.jpg", "hero-entry", 1200, 1500)]
for src, name, w, h in JOBS:
    im = ImageOps.exif_transpose(Image.open(src).convert("RGB"))
    ImageOps.fit(im, (w, h), Image.LANCZOS).save(f"site/assets/img/{name}.webp", "WEBP", quality=78, method=6)
PY
```

Then update the `alt` text on the matching `<img>` in `index.html` so it
describes the new photo in `site/index.html`. Alt text matters for both screen
readers and search.

**The link preview image is a special case.** `og-image.jpg` is a composite:
a photo with a dark gradient and the "DeMarzi Brothers and Sons" wordmark set
into it, so shared links look branded rather than like a stray photo. Dropping
a plain photo over it loses that. To rebuild it with a new photo, run
`tools/make-og-image.py` after pointing it at the new source file.

The gallery captions ("Off-form walls", "Board-formed soffit", …) describe the
finish shown, not a named project. Once the real photos are in, they can stay
generic or become real job descriptions — but avoid inventing client names,
addresses or dates.

### 3. Copy to confirm

| Line | Text | Check |
|---|---|---|
| `site/index.html` | "Frank runs the jobs personally…" | True? If someone else runs jobs, reword. |
| Services section | Driveways & Paths / Slabs & Footings / Decorative Finishes / Civil & Earthworks | These are a sensible default for a concreting and civil contractor, **not** a supplied list. Confirm or change the four names and descriptions. |
| Hero strip | "Family owned and operated" | Confirm. |
| Contact section | "Straight answer, fair price, no pressure." | Confirm this is how Frank wants to sound. |

There are deliberately **no** invented statistics, years in business,
testimonials or project results anywhere on the site. If Frank wants "35 years"
or a review, add it once it is real.

---

## Design system

Everything visual is driven by custom properties at the top of
`site/assets/css/site.css`.
Change a token there and it updates across the whole site.

**Colour** — a warm mineral palette. No blue corporate styling, no gradients.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1C1A16` | Warm near-black — dark bands, buttons, footer |
| `--bone` | `#F5F2EC` | Page ground — warm off-white |
| `--bone-2` | `#EAE5DB` | Alternate section ground — sand |
| `--text` | `#3A362E` | Body copy (10.8:1 on bone) |
| `--text-muted` | `#635C50` | Secondary copy (5.9:1 on bone) |
| `--oxide` | `#8A452A` | The single accent — rules, numerals, hover (6.3:1) |
| `--oxide-light` | `#D08055` | The accent on dark backgrounds (5.7:1) |

Every text/background pair meets WCAG AA; most meet AAA.

**Type** — Fraunces (variable serif, optical-size axis, WONK and SOFT off) for
display; Archivo (variable grotesque) for everything read at speed. Both are
self-hosted, so there is no third-party connection and no visitor data sent to
Google. The Fraunces italic is a weight-pinned subset used only for the two
display accents.

**Layout** — a 12-column grid with fluid gutters and page padding. Sections are
separated by hairline rules rather than boxes; the page is built to read like a
drawing sheet, not a stack of cards.

**Motion** — entrance on the headline, curtain reveals on images, a condensing
header, and a cursor-tracked preview on the services list. All of it is
skipped when the visitor has "reduce motion" turned on, and the page is fully
readable with JavaScript disabled.

---

## Editing common things

**Change a service.** Find the `<li class="service">` block in `site/index.html`.
Update the `<h3>`, the `<p>`, the `data-preview` path and the thumbnail `<img>`
— the number is typed by hand in `service__num`. `data-preview` is the image
that appears on the right when the row is hovered on a wide screen; the
thumbnail `<img>` is what shows instead on narrower screens and on touch, so
point both at the same file.

**Add or remove a gallery image.** Each plate is a `<figure class="work-item
work-item--X">`. The letter (`a`–`e`) sets its size and grid position in
`site/assets/css/site.css` under section 11. Removing one means re-lettering the rest.

**Change a section heading.** All headings are plain `<h2>` / `<h3>` — edit the
text directly. Keep the order (one `h1`, then `h2` per section, `h3` for items)
so the page stays correct for screen readers and search engines.

**Adjust spacing.** `--section-y` controls the space between sections;
`--page-x` the page margins. Both scale with the viewport.

---

## Testing done

- Rendered and checked at 390 px, 834 px, 1280 px and 1512 px — no horizontal
  overflow at any width
- Heading order, landmarks, image alt text and anchor targets verified
- Keyboard tab order walked; focus rings visible on every control
- Touch targets meet the 24 px minimum (44 px on touch devices)
- Verified with `prefers-reduced-motion: reduce` and with JavaScript disabled
- No console errors or failed requests
- ~221 KB above the fold (gzipped HTML/CSS/JS + two fonts + hero image);
  everything below the fold is lazy-loaded

## Hosting somewhere other than Netlify

Any static host works — Cloudflare Pages, Vercel, GitHub Pages, or plain shared
hosting. Upload the **contents of `site/`** so that `index.html` sits at the web
root. There is nothing to build.

If the host allows custom headers, serve `.woff2` with
`Cache-Control: public, max-age=31536000, immutable`. `netlify.toml` documents
the full set of headers used.
