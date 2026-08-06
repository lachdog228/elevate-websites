# Sulex Electrics — sulex.com.au

Three-page static site for Sulex Electrics: solar, batteries, EV charging and
general electrical work across Geelong, the Surf Coast and out to Colac.

No framework, no npm install, no toolchain. `src/` holds shared templates and
content; `build.mjs` assembles them into plain HTML/CSS/JS in `dist/`. Upload the
contents of `dist/` to cPanel and it runs.

---

## Build

```bash
node build.mjs        # writes dist/
```

`dist/` is committed, so you can deploy without running anything. Re-run the
build after any change in `src/`.

Preview locally:

```bash
node build.mjs && python3 -m http.server 8000 --directory dist
```

## Deploy (cPanel)

1. `node build.mjs`
2. Upload **the contents of `dist/`** (not the folder) into `public_html`.
3. Leave AutoSSL to issue the certificate for `sulex.com.au`.
4. Once HTTPS works, uncomment the force-HTTPS block at the top of
   `public_html/.htaccess`.

## Layout

```
src/
  data/site.mjs           every business fact — phone, hours, service area,
                          reviews, services. Change content here, not in markup.
  templates/layout.mjs    <head>, header, footer, JSON-LD, page shell
  templates/components.mjs  buttons, photos, review cards, CTA band, EV artwork
  pages/*.mjs             the three pages
  css/styles.css          whole stylesheet
  js/main.js              nav toggle + enquiry form
  static/                 copied to dist/ verbatim (favicons, images, .htaccess)
build.mjs                 the build
tools/make-assets.py      regenerates favicons and the photo placeholders
dist/                     built output — this is what gets uploaded
```

---

## Outstanding — needs Alex

### 1. REC number

`[LICENCE_PLACEHOLDER]` appears in the footer of all three pages. Victorian
licensed electricians are generally required to display their Registered
Electrical Contractor number on advertising material. Set it in one place:

```js
// src/data/site.mjs
licence: '[LICENCE_PLACEHOLDER]',   // ← real REC number goes here
```

Then rebuild. **Do not invent a number.**

### 2. Real photos

The job photos were not in the handoff package this build was made from, so every
photo slot currently holds a clearly-labelled brand-coloured placeholder. Drop the
real JPEGs into `src/static/assets/img/` using the **same filenames** and rebuild —
no code change needed.

| File | What it should be | Crop |
| --- | --- | --- |
| `hero.jpg` | Completed rooftop solar install (Colac / Birregurra) | 16:9 |
| `job-solar.jpg` | Rooftop solar on a rural property near Geelong | 4:3 |
| `job-battery.jpg` | Outdoor home battery unit (Torquay) | 4:3 |
| `job-recent-surfcoast.jpg` | Alex on a roof mid-install, near the Surf Coast | 4:3 |
| `job-recent-armstrong.jpg` | Indoor battery + switchboard (Armstrong Creek) | 4:3 |
| `alex.jpg` | Alex beside the company van | 4:5 |

All must be genuine job photos — not stock, not AI-generated.

**EV charging has no photo.** It's represented by a hand-drawn SVG in the brand
colours (`evIllustration` in `src/templates/components.mjs`). If a real EV job
photo turns up, add `job-ev.jpg` and set `photo: 'job-ev.jpg'` on the `ev` entry
in `src/data/site.mjs` — the services page picks the photo over the illustration
automatically.

### 3. Logo

The original handoff described the real vector logo as inline SVG path data
extracted from Alex's `.ai` file. That file wasn't present, so the mark in
`logo()` (`src/templates/layout.mjs`) is a clean redraw of the same idea — lime
circular power symbol beside the `sulex` / `ELECTRICS` wordmark. If the original
path data turns up, swap the two `<path>` elements there and re-run
`tools/make-assets.py` to regenerate the favicons from the same shape.

### 4. Contact form backend

The form still uses the `mailto:` fallback — submitting opens the visitor's own
email client. It works everywhere but relies on them having mail set up, and
nothing is recorded if they abandon it.

To have enquiries arrive properly, create a form at
[Formspree](https://formspree.io) (or similar) and paste the endpoint into the
form tag in `src/pages/contact.mjs`:

```html
<form class="form" id="enquiryForm" data-endpoint="https://formspree.io/f/XXXX" ...>
```

The JS POSTs the fields as JSON when an endpoint is present. Nothing else changes.

### 5. Apollo Bay review

The third review ("Helen and Peter, Apollo Bay") is genuine, but Apollo Bay sits
outside the confirmed service area. It was kept as-is rather than edited. Worth
asking Alex whether he'd rather swap it for a Geelong-area one.

---

## Content rules

These are firm — they were set with the client and apply to anything added later:

- **Services:** solar panels, solar batteries, EV charging, general electrical.
  Nothing else. General electrical stays visually quieter and lower on the page.
- **Service area:** Geelong, Surf Coast, Torquay, Winchelsea, Birregurra, Colac.
  Don't add suburbs. Don't add Melbourne.
- **Reviews:** exactly the three real ones. Don't invent more.
- **No invented** specs, kW ratings, warranty terms, pricing or turnaround times.
- **Google rating:** "5.0" only — never publish a review count, it changes.
- **No black anywhere.** Navy `#182B55` does that job. Gold `#EFA23A` is for sun
  motifs only.
- **No street address** in the markup or the JSON-LD — this is a mobile trade
  business, not a shopfront.

## Brand

| | |
| --- | --- |
| Navy | `#182B55` — headings, nav, footer, page heads, CTA band |
| Lime | `#7EBF41` — primary action colour |
| Lime dark | `#69A233` — hover |
| Gold | `#EFA23A` — sun motifs only, used sparingly |
| Paper | `#F4F6F3` · White `#FFFFFF` · Line `#E1E5DF` · Slate `#5F6B72` |
| Bone | `#EAEFEB` (text on dark) · Mist `#9AA6A1` (secondary on dark) |

Fonts: **Bricolage Grotesque** (display), **Schibsted Grotesk** (body),
**IBM Plex Mono** (eyebrows and small labels), all via Google Fonts.

Tone: small family business, professional but not stiff. Short declarative
section headers that land like a stamp — "Make it. Store it. Drive on it.",
"One bloke, start to finish." Flat and real; no gradient heroes, no glows, no
identical-card rhythm.

## SEO

Per page: unique title and meta description, canonical, Open Graph, Twitter Card,
`lang="en-AU"`, and `LocalBusiness`/`Electrician` JSON-LD (built once in
`jsonLd()` from `src/data/site.mjs`). `robots.txt` and `sitemap.xml` are generated
by the build. If you restructure anything, check all of that survives.

The JSON-LD deliberately carries **no `aggregateRating`**. Google requires a
`reviewCount`/`ratingCount` alongside it, and publishing a count is off the table
— plus self-serving review markup breaches Google's review-snippet guidelines.
The 5.0 still shows on the homepage for people to read; it just isn't claimed as
structured data.
