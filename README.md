# Airmech Repairs — website

Airless spray equipment repairs & servicing. Ocean Grove, Victoria — servicing
Geelong, the Bellarine Peninsula and surrounding areas.

**Enquiries go to:** Airmechrepairs@outlook.com.au

## Pages

| URL              | What it's for                                                        |
|------------------|----------------------------------------------------------------------|
| `/`              | Hero, three-point trust strip, about preview, services overview, service area preview, CTA |
| `/services/`     | The six services in detail, brands serviced, the 4-step process      |
| `/about/`        | Who it's for, how the work is set up, why professionals choose it    |
| `/service-area/` | Map, suburb list, where Airmech travels                              |
| `/contact/`      | Contact details — email, location, service area                      |

There is no enquiry form and no 404 page.

**One value block per page.** "Quality workmanship" was originally being made
three times on the home page alone (hero beats, trust strip, then the why
section), so each block now appears exactly once site-wide: the hero beats in
the hero, the trust strip on home, and the four expanded reasons on About.

## What's here

```
build.py            assembles the pages from src/ — run after editing src/
make-zip.sh         builds the deploy package (runs build.py first)
src/partials/       head, header, footer — the chrome shared by every page
src/sections/       the content blocks each page is composed from
index.html          ┐
services/           │
about/              ├ generated — do not hand-edit, they get overwritten
service-area/       │
contact/            ┘
sitemap.xml         generated
assets/css/site.css shared stylesheet
assets/js/site.js   shared behaviour
assets/fonts/       Archivo + Inter, variable, latin subset, self-hosted
assets/img/         favicon and the Open Graph card (og.svg is the source, og.jpg ships)
netlify.toml        publish config, cache and security headers
_headers            the same headers, for drag-and-drop deploys
```

## Stack

Hand-built static HTML, CSS and vanilla JS. No framework, no runtime
dependencies, nothing to install to view it.

That was a deliberate call over Next.js/Tailwind/Framer Motion: the CSS and JS
are ~12 KB gzipped combined and cached once for the whole site, where a React
build would ship 100 KB+ of JavaScript to render copy that never changes.
Everything the brief wanted from an animation library is CSS transitions driven
by `IntersectionObserver`.

### Editing it

**Edit `src/`, then run `python3 build.py`.** The generated pages carry a
"do not edit" banner because a rebuild overwrites them.

`build.py` also holds each page's title, meta description, structured data and
which sections it's built from — that's the file to open to add a page or
change a page title. It regenerates `sitemap.xml` too.

Design tokens all live in `:root` at the top of `assets/css/site.css`. Change
`--blue` and the whole site follows.

### Deploying

No build command on Netlify — the HTML is committed. Two ways:

- **Drag and drop** — drop `airmech-repairs-site.zip` straight onto
  https://app.netlify.com/drop, or unzip it and drop the folder. `index.html`
  is at the zip root, which is what Netlify expects.
- **Connect the repo** — point Netlify at this branch, leave the build command
  empty and the publish directory as `.`.

Rebuild the zip with `./make-zip.sh` (it runs `build.py` first, so the package
can never contain stale HTML).

## Design notes

- **Type.** Archivo (variable, width axis pushed to ~112) for display, Inter for
  body. Archivo at weight 900, skewed, reproduces the logo's industrial italic.
- **Colour.** Near-black `#0A0D14`, white, and one accent — `#1B3FA8`, sampled
  off the logo. Blue is reserved for CTAs, interactive states and accents; it is
  never a section background except in the closing CTA.
- **Imagery.** No photography. Bespoke technical line drawings — an airless
  spray gun in side elevation, a fluid-section schematic, a stylised service-area
  map — drawn as inline SVG. Chosen over stock or AI-generated photos, which the
  brief rightly warned would look cheap, and it suits the engineering aesthetic
  better besides. Every drawing animates its stroke on reveal.
- **Motion.** All reveals are `IntersectionObserver` + CSS transitions, and all
  of it collapses under `prefers-reduced-motion: reduce`. Content is visible by
  default and only hidden once JS confirms it can observe it, so no-JS visitors
  and crawlers always see the full page.

## Services

The six services the business actually offers, as supplied by the client:

1. Airless spray gun repairs
2. Routine servicing
3. Warranty repairs
4. Fault diagnosis
5. Genuine replacement parts
6. Performance testing

They live in one place — `SERVICES` at the top of `build.py` drives the JSON-LD
`OfferCatalog`; the visible copy is in `src/sections/services.html` (home
overview) and `src/sections/services-detail.html` (services page). Change a
service and all three need updating.

## Before launch

1. **Drop in the real logo.** The wordmark in the header and footer is
   reconstructed in HTML/SVG from the supplied artwork — deliberately close, but
   it is not the client's file. Replace `.brand` in `src/partials/header.html`
   and `src/partials/footer.html` when the vector is available.
2. **Set the real domain.** `SITE` at the top of `build.py` drives every
   canonical, Open Graph URL and the sitemap. It currently assumes
   `https://airmechrepairs.com.au`.
3. **Add a phone number** if the client wants calls — the contact page is built
   from stacked cards, so a Phone card slots straight in above Email; the
   JSON-LD `telephone` field in `build.py` takes it too.
4. **Confirm the suburb list** matches where they'll actually travel.

Nothing on the site claims a turnaround time, price, warranty or manufacturer
authorisation, per the brief. If any become confirmed, the trust strip and
services page are where they'd go.

## Verified

Checked in headless Chromium, both from the working tree and from the extracted
zip:

- every page and every internal link returns 200; no console or page errors
- one `<h1>` per page, headings run h1 → h2 → h3 with no level jumps, every link
  and `svg[role=img]` has an accessible name
- correct `aria-current` on exactly one nav item per page, in both the desktop
  nav and the mobile drawer
- no horizontal overflow at 1920, 1440, 1280, 820 or 390px
- header scroll state on every page; drawer opens, marks the current page and
  navigates
- `prefers-reduced-motion` leaves all content visible immediately
- per-page canonical, Open Graph and JSON-LD (LocalBusiness, OfferCatalog,
  ContactPage, BreadcrumbList)
