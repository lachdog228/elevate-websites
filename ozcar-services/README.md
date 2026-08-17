# OZCAR Services — website

A five-page site for OZCAR Services, trailer hire and towing at 621 Bellarine
Hwy, Leopold VIC 3224.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step and no
third-party requests at runtime except the Google Maps embed on the contact
page. Drop the folder on any static host and it works.

> **Before it goes live** there are four things to do: drop in the business's
> own photographs, set the real domain, point the enquiry form at a real inbox,
> and fill in the six `[to confirm]` placeholders on the trailer hire page.
> Each is covered below.

## Pages

Five short pages rather than a few long ones — each does one job and gets to a
call or an enquiry quickly.

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, trust strip, the three services, reviews, service area |
| `trailer-hire.html` | Trailer hire, the trailer cards, hire FAQ |
| `towing.html` | Towing, a customer review, towing FAQ |
| `vehicle-transport.html` | Vehicle and machinery transport, a customer review, FAQ |
| `contact.html` | Contact details, hours, map and the enquiry form |

The enquiry form lives on the contact page only. Every other page drives to it,
to the phone number, or to the persistent call bar on mobile.

```
index.html  trailer-hire.html  towing.html  vehicle-transport.html  contact.html
robots.txt  sitemap.xml
assets/
  css/styles.css              all styling, one file
  js/main.js                  nav, reveals, FAQ, form, mobile action bar
  fonts/archivo-var-latin.woff2
  img/*.webp  *.jpg           built renditions — do not edit by hand
  img/src/*.jpg               the full-size source photographs
tools/build-images.py         rebuilds assets/img from assets/img/src
tools/make-zip.sh             packs a deploy zip for Netlify Drop
```

Local preview:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

**Editing the shared chrome.** With no build step, the icon sprite, header,
mobile menu, footer and mobile action bar are repeated verbatim in all five
pages. Change one and change the other four — a quick
`grep -n 'class="footer"' *.html` will find them.

## Before you go live

### 1. Set the real domain

The canonical URLs, Open Graph tags, sitemap and structured data currently use
`https://www.ozcarservices.com.au` as a stand-in. **This domain has not been
confirmed** — replace it with whatever the site is actually published on:

```bash
cd ozcar-services
grep -rl 'www.ozcarservices.com.au' . | xargs sed -i 's|https://www\.ozcarservices\.com\.au|https://YOUR-REAL-DOMAIN|g'
```

That covers all five pages plus `robots.txt` and `sitemap.xml`.

### 2. Wire up the enquiry form

The form is marked up for **Netlify Forms**, which needs no configuration: if
the site is deployed to Netlify, submissions start arriving in the Netlify
dashboard as soon as it is live, and the honeypot (`company`) is already
declared via `data-netlify-honeypot`.

Hosting somewhere else? Add an `action` to the form in `contact.html`:

```html
<form data-enquiry-form action="https://formspree.io/f/YOUR_ID" method="POST" ...>
```

`main.js` posts to `action` if it is set, and to the current page if it is not.
It reports the **real** result either way — a success message only appears on a
2xx response. With no backend configured, submitting shows an error that points
the visitor at the phone number. Nothing ever pretends an enquiry was sent.

The form asks for name, phone, email, what they need, preferred date, return
date and any extra detail. Name, phone and "what do you need" are required;
email is deliberately optional, because requiring it costs enquiries from people
on a phone.

### 3. Fill in the `[to confirm]` placeholders

Six values on `trailer-hire.html` are unknown and are shown as amber
`[to confirm]` chips so they cannot be missed:

| Where | Field |
| --- | --- |
| Trailer card | Deck length, load capacity, hire period, rate |
| "Not sure what you need?" panel | Deposit or bond, minimum hire |

Replace the whole `<span class="tbc">[to confirm]</span>` — brackets and all —
with the real figure. Nothing else on the site is a placeholder.

## Deploying

### Netlify drag-and-drop

```bash
bash tools/make-zip.sh
```

That writes `ozcar-services-netlify.zip` (60 files, ~4.8 MB) with the site at
the **root** of the archive, which is what Netlify Drop expects. Drop it on
<https://app.netlify.com/drop> and it is live.

The archive leaves out the full-size source photographs in `assets/img/src`,
the build tooling and this README — only what gets served goes in. It also
carries its own `netlify.toml` with the cache and security headers but no
`publish` key, because in a dropped zip the archive root already *is* the
publish directory. (The repo-root `netlify.toml` keeps `publish =
"ozcar-services"` for git-connected deploys.)

Netlify Forms works with drop deploys — it scans the deployed HTML for
`data-netlify="true"` — so the enquiry form starts collecting on upload. Check
**Forms** in the site dashboard after the first submission.

Re-run the script after changing anything; the zip is regenerated from scratch
and is gitignored.

### Git-connected deploy

Point Netlify at the repo and it reads the root `netlify.toml`, which publishes
`ozcar-services/`. No build command is needed.

## Adding a trailer

`trailer-hire.html` has one trailer card wrapped in a clearly marked
`TRAILER CARD TEMPLATE` comment. To add another:

1. Put a photograph at `assets/img/src/<name>.jpg` (roughly 2400px wide).
2. Add it to `RECIPES` in `tools/build-images.py`:
   ```python
   "my-trailer": ("my-trailer", 4 / 3, CARD, 0.50, 74),
   ```
3. Run `python3 tools/build-images.py` — it prints the placeholder tone to use.
4. Copy the `<article class="trailer">` block, paste it after the original, and
   change the image filenames, alt text, heading, tag, each `<dd>` value and the
   `?about=` value on the button.

The grid reflows on its own; the "Not sure what you need?" panel can stay where
it is or move to the end.

Each card's button links to `contact.html?about=Trailer%20hire#enquiry`, and the
form reads `?about=` to preselect the matching option. Any value that is not one
of the four select options is dropped into the message field instead, so
`?about=Tandem%20box%20trailer` works too.

## Photographs

**The photos currently on the site are placeholders.** Free-licence stock from
Unsplash, chosen to match the real work. Four genuine OZCAR photographs have
been supplied but did not reach the build environment as files, so they could
not be processed. Swapping them in is the single biggest improvement available
to this site.

### Dropping the real photos in

Save each photo over the matching file in `assets/img/src/`, keeping the
filename exactly, then run one command:

```bash
python3 tools/build-images.py
```

| Save as | Which photo | Appears on |
| --- | --- | --- |
| `assets/img/src/hero.jpg` | The tan Hilux strapped on the OZCAR trailer at dusk, under the streetlight | Home hero, trailer hire hero, social card |
| `assets/img/src/trailer-hire.jpg` | The empty tandem flat-top trailer with the checker-plate toolbox, parked on the roadside | Trailer hire service card and trailer card |
| `assets/img/src/transport.jpg` | The red tractor strapped down on the trailer, in front of the billboard | Vehicle transport card and hero |
| `assets/img/src/towing.jpg` | *Still needed* — a towing job, ideally a vehicle being loaded | Towing service card and hero |
| `assets/img/src/coast.jpg` | Optional — any local coast or highway shot | Service-area band, contact hero |

Feed the script the largest version you have; it crops, resizes, sharpens and
encodes every rendition the pages reference, plus the social card, and prints
the average colour of each image. That colour is the `--tone` value on the
matching `<div class="media">` — the shade shown while the photo loads — so
update those to match.

Two things worth knowing about the Hilux photo: it is the strongest of the set
because it shows OZCAR's **own** trailer with the phone number on the back, and
it is portrait, so the 21:9 hero crop will use a band across the middle. If the
framing comes out badly, adjust the `anchor` value for `"hero"` in
`tools/build-images.py` — `0.0` keeps the top, `0.5` the middle, `1.0` the
bottom.

### The logo

The OZCAR "TRAILER HIRE & TOWING" logo has not been added — it was supplied as
an image the build could not read, and it is artwork on a white background that
needs its background removed before it can sit on a dark page. The header and
footer currently use a type-only wordmark (`OZCAR` in Archivo with the O in
amber, over the words "Trailer hire & towing") which matches the real brand
name. To use the real logo instead, replace the contents of `<a class="brand">`
in all five pages with an `<img>` of a transparent PNG or SVG version.

The logo artwork also shows a motorbike trailer and a caged box trailer. Neither
is claimed anywhere on the site, because logo illustrations are often generic —
if those are real hire options, they are worth adding as trailer cards.

### About the current placeholders

- `hero.jpg` **has already been cropped** to remove signage. The uncropped frame
  has another business's name and phone number painted on the trailer's side
  panel. If you re-crop it from an original, keep the bottom out of frame.
- `trailer-hire.jpg` is a rally car with sponsor livery on it. Harmless at card
  size, but another reason to swap in a real photo.

## What is real and what is not

Everything factual on the site came from the brief. Nothing about the business
was invented:

- **Name, address, phone and hours** — real, and consistent across all five
  pages, the footer, the structured data and the map.
- **The 5.0 rating and four reviews** — real, quoted word for word. Three are
  attributed by name; the fourth ("Great customer service!") is shown as "Google
  reviewer" because no name was supplied. Only the three named reviews appear in
  the structured data, since a schema review needs an author.
- **Services** — trailer hire, towing, vehicle transport. Nothing else claimed.
- **Service area** — Leopold, Geelong, the Bellarine and surrounds, with vehicle
  transport "further afield across Victoria". The Victoria claim rests on
  Dimitri Pantopolis's review about a car moved across the state.
- **Not claimed anywhere**: trailer models, dimensions, capacities, prices, hire
  periods, response times, years in business, fleet size, insurance, licences,
  or an email address (none was supplied — add one to the footer and contact
  page if there is one).

## SEO

- One `LocalBusiness` + `AutoRental` JSON-LD block on the home page carrying the
  NAP, 24-hour opening times, service area, offer catalogue, the aggregate
  rating and the three named reviews.
- `FAQPage` structured data on the trailer hire, towing and vehicle transport
  pages, matching the visible FAQ text exactly, plus a `Service` block on each.
- `BreadcrumbList` on all four inner pages; `ContactPage` on contact.
- Titles and descriptions target trailer hire and towing in Leopold, Geelong and
  the Bellarine without keyword stuffing, and there are no duplicate location
  pages.
- **`geo` coordinates were deliberately left out** of the structured data rather
  than guessed. If you want them, take the exact latitude and longitude from the
  Google Business Profile and add a `geo` property to the JSON-LD in
  `index.html`.
- The `aggregateRating` block mirrors the public Google rating. Google
  discourages self-serving review markup for local businesses; if that is a
  concern, delete the `aggregateRating` and `review` properties — the reviews
  stay visible on the page either way.

## Verified

Checked while building, all five pages at 1440px and 390px:

- **W3C Nu HTML checker** — 0 errors, 0 warnings on every page.
- **axe-core** (WCAG 2.1 A/AA + best practice) — 0 violations on every page at
  both widths.
- **36 interaction tests** — FAQ open/close, header scroll state, mobile menu
  (open, Escape, scroll lock), the mobile action bar showing and standing down
  over the form, required-field validation, email format, return-date-before-
  pickup-date, the no-backend error path, the success path, form reset,
  `?about=` prefill, `tel:` links, the desktop nav not overflowing at 1200px and
  1440px and collapsing to the burger below 1080px, and every reveal-animated
  element staying visible with JavaScript disabled.
- **Internal links** — every href, in-page anchor and image reference resolves.

The Google Maps iframe on the contact page cannot load in a sandboxed
environment; it was not visually verified. It is a standard embed of the real
address and should be checked once on a live deploy.

## Design notes

Worth preserving if the site is extended:

- **One accent.** Hazard amber (`--amber`) is for primary buttons, section
  eyebrows, icons and the accented word in the hero. Spreading it further is
  what makes a page look templated.
- **Depth from tone, not shadow.** Six surface steps from `--ink-900` up, plus
  hairlines. There is not a single drop shadow in the stylesheet.
- **One typeface.** Archivo, as a single variable file carrying both the weight
  and the width axis, so headings can be set genuinely wide (`font-stretch:
  106–112%`) rather than faked with letter-spacing. One request, every weight.
- **The phone number is the loudest element** on every page, and there is a
  persistent call/enquire bar under 760px that stands down when the form is on
  screen.
- **Restrained motion.** A slow hero scale, one fade-and-rise on scroll with a
  short stagger between siblings, and the FAQ height transition. Everything is
  disabled under `prefers-reduced-motion`, and nothing is hidden if the reveal
  script never runs.
- **Photography is graded in CSS**, not baked into the files, so a replacement
  photo inherits the same look without being re-edited.
