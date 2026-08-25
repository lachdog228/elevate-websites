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

### Deploying

There is no build command. Two ways:

- **Drag and drop** — unzip `airmech-repairs-site.zip` and drop the folder's
  *contents* onto https://app.netlify.com/drop. `index.html` must sit at the top
  level of what you drop, not inside a wrapper folder.
- **Connect the repo** — point Netlify at this branch. Leave the build command
  empty and the publish directory as `.`; `netlify.toml` handles the rest.

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

No forms backend, no third-party service, nothing to wire up. The form
validates inline, then hands the enquiry to the visitor's own mail client as a
pre-filled draft addressed to `Airmechrepairs@outlook.com.au` — every field laid
out in the body, so nothing gets retyped:

```
Name: Dave Nguyen
Business: Nguyen & Co Painting
Email: dave@nguyenpainting.com.au
Phone: 0412 345 678
Equipment / brand: Graco 395 PC Pro
Needs help with: Repairs

Message:
Pressure drops off after about ten minutes and it starts spitting.
```

The visitor still presses send in their own mail app, so enquiries arrive as
ordinary email from their real address — replying is just replying.

The confirmation panel carries an **Open the email again** link holding the same
draft, in case the mail client didn't launch, and the address is shown in plain
text beside it. With JavaScript off, the form notes that and points at the email
address directly.

To change the recipient, edit `MAIL` at the top of the form block in the
`<script>` (and the `mailto:` links elsewhere in the markup).

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
  first, invalid email caught on blur, errors clear on correction, and a valid
  submit builds a correctly addressed draft with every field in the body
- `prefers-reduced-motion` leaves all content visible immediately
- headings run h1 → h2 → h3 with no level jumps; every control is labelled
