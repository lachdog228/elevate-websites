# Airmech Repairs — website

Airless spray equipment repairs & servicing. Ocean Grove, Victoria — servicing
Geelong, the Bellarine Peninsula and surrounding areas.

**Live enquiry email:** Airmechrepairs@outlook.com.au

## What's here

```
index.html          the whole site — markup, CSS and JS in one file
assets/fonts/       Archivo + Inter, variable, latin subset, self-hosted
assets/img/         favicon, Open Graph card (og.svg is the source, og.jpg is what ships)
netlify.toml        publish config + cache and security headers
robots.txt          
sitemap.xml         
```

## Stack

Hand-built static HTML, CSS and vanilla JS. No framework, no build step, no
dependencies — open `index.html` and it runs.

That was a deliberate call over Next.js/Tailwind/Framer Motion for a one-page
brochure site: the entire page is ~20 KB gzipped with zero render-blocking
third-party requests, where a React build would ship 100 KB+ of JavaScript to
render text that never changes. Everything the brief asked for from an
animation library is done with CSS transitions driven by `IntersectionObserver`.

To deploy: point Netlify at this repo. There is no build command.

### Editing it

`index.html` is the source of truth and is organised in labelled sections:

- `<head>` — title, meta, Open Graph, LocalBusiness JSON-LD
- `<style>` — 1 Fonts · 2 Tokens · 3 Reset · 4 Layout · 5 Type · 6 Buttons ·
  7 Header · 8 Hero · 9 Sections · 10 Forms · 11 Footer · 12 Motion · 13 Responsive
- `<body>` — each numbered section matches the page order
- `<script>` — header state, drawer, scroll reveal, timeline, scroll-spy, form

Design tokens all live in `:root`. Change `--blue` and the whole site follows.

## Design notes

- **Type.** Archivo (variable, width axis pushed to ~112) for display, Inter for
  body. Archivo at weight 900, skewed, reproduces the logo's industrial italic.
- **Colour.** Near-black `#0A0D14`, white, and one accent — `#1B3FA8`, sampled
  off the logo. Blue is reserved for CTAs, interactive states and accents; it is
  never a section background except in the closing CTA.
- **Imagery.** No photography. Bespoke technical line drawings — an airless
  spray gun in side elevation, a fluid-section schematic, a stylised service-area
  map — drawn as inline SVG. This was chosen over stock or AI-generated photos,
  which the brief rightly warned would look cheap, and it suits the engineering
  aesthetic better besides. Every drawing animates its stroke on reveal.
- **Motion.** All reveals are `IntersectionObserver` + CSS transitions, and all
  of it collapses under `prefers-reduced-motion: reduce`. Content is visible by
  default and only hidden once JS confirms it can observe it, so no-JS visitors
  and crawlers always see the full page.

## The enquiry form

Wired for **Netlify Forms** (`data-netlify="true"`, honeypot on
`company-website`). It works with no backend once deployed to Netlify — form
submissions appear under the site's Forms tab. Set up a notification there to
forward them to `Airmechrepairs@outlook.com.au`.

Validation runs client-side with inline error states; on submit it posts in the
background so it can show an inline confirmation, and falls back to a normal
form POST if that fails, so an enquiry is never silently lost.

## Before launch

1. **Drop in the real logo.** The wordmark in the header and footer is
   reconstructed in HTML/SVG from the supplied artwork — deliberately close, but
   it is not the client's file. Replace `.brand` with the original vector when
   it's available.
2. **Set the real domain.** `index.html` (canonical + Open Graph URLs) and
   `sitemap.xml` currently assume `https://airmechrepairs.com.au/`.
3. **Add a phone number** if the client wants calls — there's a natural slot in
   the contact block and the JSON-LD `telephone` field.
4. **Confirm the suburb list** in the Service Area section matches where they'll
   actually travel.

Nothing on the site claims a turnaround time, price, warranty or manufacturer
authorisation, per the brief. If any of those become confirmed, the trust strip
and services section are the places to add them.

## Verified

Checked in headless Chromium at 1920, 1440, 1280, 820 and 390px:

- no horizontal overflow at any width
- no console or page errors
- header scroll state, mobile drawer (open, Escape, link tap, focus trap,
  scroll lock), service row hover, scroll-spy
- form: empty submit flags all five required fields and moves focus to the
  first, invalid email caught on blur, errors clear on correction
- `prefers-reduced-motion` leaves all content visible immediately
- headings run h1 → h2 → h3 with no level jumps; every control is labelled
