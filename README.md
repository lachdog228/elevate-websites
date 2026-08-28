# M. McCrohan — Painting & Decorating

A short, conversion-focused site for **M. McCrohan – Painting And Decorating**,
Leopold VIC. Five pages, no filler.

> **Draft.** The site carries `noindex` and `robots.txt` disallows crawling,
> because the photography is placeholder stock rather than the business's own
> work. See [Photography](#photography) and [Going live](#going-live).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · Lucide icons. No UI library, no CSS-in-JS, no analytics, no
third-party requests at runtime — fonts are self-hosted by `next/font`.

```
src/
  app/
    layout.tsx        header, footer, fonts, structured data, skip link
    page.tsx          home
    about/            services/            work/            contact/
    not-found.tsx     404, in the same design
    globals.css       the whole design system (~1 screen)
    robots.ts         sitemap.ts
  components/
    site-header.tsx   sticky nav, route-aware, mobile panel
    site-footer.tsx   page-header.tsx   quote-form.tsx   structured-data.tsx
    sections/
      hero.tsx            home only, full-bleed photograph
      intro.tsx           home teaser -> /about
      services-list.tsx   home rows -> /services
      services-detail.tsx /services, alternating spreads
      about-detail.tsx    /about
      work-gallery.tsx    shared; takes the frames to show
      reviews.tsx         shared; `compact` drops the pillars
      contact-details.tsx /contact
      cta-band.tsx        closes every page except /contact
    ui/               reveal.tsx  button.tsx  section-heading.tsx
  lib/
    business.ts       every fact about the business, in one file
    metadata.ts       per-page title / description / canonical / OG
    site.ts           the draft switch + production origin
public/
  __forms.html        static form declaration for Netlify's deploy-time scan
  images/             photography (placeholder — see below)
```

## Pages

| Route | Carries |
|---|---|
| `/` | Hero, a short intro, the three services, three work frames, the Google rating, closing CTA |
| `/about` | The business, how the work is done, the rating, closing CTA |
| `/services` | Each of the five services as a full spread with its photograph, closing CTA |
| `/work` | The full six-frame gallery with a lightbox, closing CTA |
| `/contact` | Phone, hours, address, and the quote form |

Home is a landing page, not a table of contents: each section says enough to
stand on its own and links through to the page that covers it properly. Every
page except `/contact` ends with the same call to action, so the next step is
never more than one screen away.


## Design system

Everything lives in `src/app/globals.css`. Two scales, no ad-hoc values.

**Colour** — a warm neutral ground with exactly one accent.

| Token | Value | Role | Contrast |
|---|---|---|---|
| `bone` | `#f6f3ee` | page ground | — |
| `bone-deep` | `#ece7df` | alternating band | — |
| `ink` | `#17150f` | headings, primary buttons, dark sections | 16.5:1 on bone |
| `graphite` | `#3d3a33` | body copy | 10.3:1 on bone |
| `stone` | `#665f55` | secondary copy | 5.7:1 on bone, 5.1:1 on bone-deep |
| `clay` | `#90512c` | the only accent — rules, numerals, focus ring | 5.6:1 on bone, 5.0:1 on bone-deep |
| `clay-light` | `#dda87e` | the accent on dark surfaces | 8.7:1 on ink |

Deliberately absent: gradients as decoration, glassmorphism, drop shadows,
rounded "card" softness, emoji icons. Corners are square. Every icon is Lucide.

**Type** — Instrument Serif for display, DM Sans for everything else. Three
display sizes (`.display-xl/lg/md`), all fluid via `clamp()`. Headings never
take a size outside that scale.

**Rhythm** — `--sec` is the section padding, `--gut` the page gutter, `--measure`
the reading width. Sections alternate `bone` / `bone-deep`, with `ink` for the
reviews band and each page's masthead, so pages have a beat without needing
dividers. On home the header sits transparent over the hero photograph and
turns solid on scroll; everywhere else it is solid from the start.

## Motion

`Reveal` (on scroll) and `RevealOnLoad` (above the fold) in
`src/components/ui/reveal.tsx` are the only entrance animations. Both travel
~18–26px over 0.7–0.9s on one easing curve, fire once, and collapse to their
final state under `prefers-reduced-motion` — which `globals.css` also enforces
globally. Hover states are 200–900ms colour and transform changes. Nothing
loops, parallaxes, or moves unprompted.

## Conversion structure

One primary action — get a quote — repeated at every depth:

1. Sticky header, on every page: phone (desktop), a call icon (mobile),
   Request a Quote.
2. Hero: Request a Quote / View Our Work, with the Google rating underneath.
3. Every service row and every service spread links to the quote form.
4. Every page except `/contact` closes with the CTA band — the phone number
   set large, Call Now, and Request a Quote.
5. `/contact`: the number again at display size, plus a four-field form.

## Forms

Netlify Forms — no endpoint to configure. `@netlify/plugin-nextjs` v5 no longer
scans prerendered Next.js HTML for forms, so the form is declared twice:

- `public/__forms.html` — a hidden static form Netlify finds at deploy time.
  It is the source of truth for which fields get recorded.
- `src/components/quote-form.tsx` — the real form, which POSTs
  `application/x-www-form-urlencoded` to `/__forms.html` via `fetch` and
  handles its own sending / sent / error states without navigating.

**Keep the field names in the two files in sync.** Netlify only records fields
that appear in `__forms.html`; anything the React form sends that isn't
declared there is silently dropped.

A `company` honeypot is declared via `netlify-honeypot` on the static form.
Client-side validation only blocks obviously bad input (missing name, a phone
under 8 digits, a malformed email, an empty message); delivery and real
validation are Netlify's. On failure the form keeps what was typed and offers
the phone number instead.

Submissions land under **Forms** in the Netlify dashboard — set up email
notifications there.

## Branding

`public/logo-mark.svg` and `public/logo-lockup.svg` are the business's own logo,
vectorised from the artwork on its Facebook page (`potrace`, then `currentColor`
so it takes the colour around it). The artwork is pure black, so the header and
footer invert it to sit on dark ground. `public/favicon.svg` is the mark on the
ink tile.

The header and footer pair the **mark** with the typeset wordmark rather than
using the full lockup: the lockup stacks "M.MCCROHAN / Painting & Maintenance"
underneath the artwork, and at any height a header or footer allows, that type
is too small to read. The full lockup is kept in `public/` for print and social.

**One thing to settle:** the logo reads *Painting & Maintenance*, while the
Google Business Profile and Facebook page are both named *Painting &
Decorating*. The site uses "Painting & Decorating" — it matches the Google
listing that local search runs on — but that is the business's call, and
`business.tagline` in `src/lib/business.ts` is the single place to change it.

## Content provenance

Every fact on the page is in `src/lib/business.ts` and traces to M. McCrohan's
own public listings: the Google Business Profile (5.0 from 3 reviews, hours,
address, phone, "Painting" and "Property maintenance"), the Facebook page
(`facebook.com/paintergeelong` — interior and exterior, new work and repaints),
and the Yellow Pages / Localsearch / TradiesNearYou entries.

Two services — **Maintenance & Carpentry** and **Project Management** — come
straight from the owner, who described specialising in maintenance and
carpentry and project-managing trades for clients who don't have time to
oversee the work. That is a primary source, and it matches the logo's own
"Painting & Maintenance" tagline.

**Deliberately left out**, because no primary source confirms them: years in
business, trade qualifications, Master Painters membership, insurance, and any
service area beyond "Geelong and the Bellarine". Several directory aggregators
assert some of these; none could be traced back to the business itself.

The three Google reviews are **not** reproduced — their text isn't publicly
retrievable, so the section shows the verified aggregate and links to Google.
No testimonial on this site is invented.

## Photography

**The images in `public/images/` are placeholders.** (The logo is not — see Branding above.) M. McCrohan's own photos
are not publicly retrievable — the Facebook page is behind a login wall, the
Google Business Profile site (`mmpaintinggeelong.business.site`) is gone, and
the directory listings carry no gallery.

They are Unsplash photographs (Unsplash License: free for commercial use, no
attribution required), colour-graded to one warm-neutral look so they read as a
single body of work. Captions describe the *kind* of finish shown — never a
specific McCrohan project, address or client.

| File | Used for | Photographer |
|---|---|---|
| `hero.jpg` | hero | todd kent |
| `about.jpg` | about | Ernys |
| `work-1.jpg` | gallery, interior service | Suhyeon Choi |
| `work-2.jpg` | gallery, repaints service | Annett_99 |
| `work-3.jpg` | gallery, exterior service | Pixasquare |
| `work-4.jpg` | gallery | mk. s |
| `work-5.jpg` | gallery | Alex Tyson |
| `work-6.jpg` | gallery | Wesley Tingey |
| `work-7.jpg` | maintenance & carpentry service | Minh Đức |
| `work-8.jpg` | project management service | immo RENOVATION |

Replace all ten with the business's own photographs before launch. Keep the
filenames and the aspect ratios roughly as they are and nothing else needs to
change — `gallery[].frame` in `src/lib/business.ts` controls each footprint.

## Going live

1. Replace `public/images/*` with M. McCrohan's own photographs, and update the
   `alt` text and captions in `src/lib/business.ts` to describe the real jobs.
2. Set `siteUrl` in `src/lib/site.ts` to the real domain.
3. Set `isDraft = false` in `src/lib/site.ts`. That one flag restores the
   canonical URL, the Open Graph card, `index, follow`, and an allowing
   `robots.txt` with a sitemap reference.
4. Deploy to Netlify (`netlify.toml` is configured with
   `@netlify/plugin-nextjs`) and confirm the form appears under Forms.

## SEO

Each route has its own title, meta description and canonical URL, built in
`src/lib/metadata.ts`; the sitemap is generated from `navLinks`, so adding a
page to the nav adds it to the sitemap. One `h1` per page, `h2` per section,
`en-AU`, and `HousePainter` structured data built from `business.ts` —
address, phone, opening hours, areas served, and the 5.0/3 aggregate rating.
Every image has descriptive alt text. Geelong, Leopold and the Bellarine
appear where they read naturally; nothing is stuffed.

There is no embedded map — the address links to Google Maps instead, which
keeps the page free of third-party requests. Add an iframe if the trade-off
should go the other way.

## Verified

Every route (`/`, `/about`, `/services`, `/work`, `/contact`, and a 404)
checked in Chromium at 390 / 768 / 1440px, plus 320px and
`prefers-reduced-motion: reduce`:

- No console errors, no failed requests, no horizontal overflow
- Contrast: every text/background pair meets WCAG AA. Text over photography
  (hero, header, gallery captions) was checked by sampling the actual rendered
  pixels behind each line, worst-pixel-wins — not by assuming the scrim works
- Heading order h1→h2→h3 with no skipped levels, exactly one `h1`
- Every image has alt text; every input has a real `<label>`
- No tap target under 40px
- Mobile menu: opens, locks scroll, closes on Escape, returns focus, and
  closes itself on navigation without leaving the page locked
- The nav marks the current page with `aria-current="page"`, on exactly one
  link per route
- Lightbox: opens, arrow keys move between images, Escape closes and unlocks
- Form: an empty submit is blocked with three inline errors and no request;
  a valid submit POSTs the expected urlencoded body to `/__forms.html` and
  shows the sent state without navigating; a 500 surfaces a recovery message
  and keeps what was typed
