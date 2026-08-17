# OZCAR Services — website

A four-page site for OZCAR Services, trailer hire and towing at 621 Bellarine
Hwy, Leopold VIC 3224.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step and no
third-party requests at runtime except the Google Maps embed on the contact
page. Drop the folder on any static host and it works.

> **Before it goes live** there are three things to do: set the real domain,
> point the enquiry form at a real inbox, and fill in the eight `[to confirm]`
> placeholders on the trailer hire page. Each is covered below.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, services, reviews, process, service area, FAQ, enquiry form |
| `trailer-hire.html` | Trailer hire, the trailer cards, hire details, hire FAQ |
| `towing-transport.html` | Towing and vehicle transport, pulled-out review, FAQ |
| `contact.html` | Contact details, hours, map and the enquiry form |

```
index.html  trailer-hire.html  towing-transport.html  contact.html
robots.txt  sitemap.xml
assets/
  css/styles.css              all styling, one file
  js/main.js                  nav, reveals, FAQ, form, mobile action bar
  fonts/archivo-var-latin.woff2
  img/*.webp  *.jpg           built renditions — do not edit by hand
  img/src/*.jpg               the full-size source photographs
tools/build-images.py         rebuilds assets/img from assets/img/src
```

Local preview:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

**Editing the shared chrome.** With no build step, the icon sprite, header,
mobile menu, footer and mobile action bar are repeated verbatim in all four
pages. Change one and change the other three — a quick
`grep -n 'class="footer"' *.html` will find them. The enquiry form appears
twice, in `index.html` and `contact.html`.

## Before you go live

### 1. Set the real domain

The canonical URLs, Open Graph tags, sitemap and structured data currently use
`https://www.ozcarservices.com.au` as a stand-in. **This domain has not been
confirmed** — replace it with whatever the site is actually published on:

```bash
cd ozcar-services
grep -rl 'www.ozcarservices.com.au' . | xargs sed -i 's|https://www\.ozcarservices\.com\.au|https://YOUR-REAL-DOMAIN|g'
```

That covers all four pages plus `robots.txt` and `sitemap.xml` (28 references).

### 2. Wire up the enquiry form

The form is marked up for **Netlify Forms**, which needs no configuration: if
the site is deployed to Netlify, submissions start arriving in the Netlify
dashboard as soon as it is live, and the honeypot (`company`) is already
declared via `data-netlify-honeypot`.

Hosting somewhere else? Add an `action` to both copies of the form — one in
`index.html`, one in `contact.html`:

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

Eight values on `trailer-hire.html` are unknown and are shown as amber
`[to confirm]` chips so they cannot be missed:

| Where | Field |
| --- | --- |
| Trailer card | Deck length, deck width, load capacity, hire period, rate |
| Hire details | Anything else to bring, deposit or bond, min/max hire period |

Replace the whole `<span class="tbc">[to confirm]</span>` — brackets and all —
with the real figure. Nothing else on the site is a placeholder.

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

**These are placeholders.** OZCAR's own photographs could not be retrieved from
the Google Business Profile, so the site ships with free-licence photography
from Unsplash chosen to match the real work. Replacing them with the business's
own photos is the single biggest improvement available to this site, and takes
one command:

```bash
# overwrite the file in assets/img/src/ keeping the same name, then
python3 tools/build-images.py
```

The script crops, resizes, sharpens and encodes every rendition the pages
reference, plus the social card, and prints the average colour of each image —
that is the `--tone` value on the corresponding `<div class="media">`, the
colour shown while the photo loads. Update it if the new photo is a different
tone.

| Source | Used for |
| --- | --- |
| `hero.jpg` | Home hero, trailer hire hero, social card |
| `trailer-hire.jpg` | Trailer hire service card, trailer card |
| `towing.jpg` | Towing service card and hero |
| `transport.jpg` | Vehicle transport card |
| `coast.jpg` | Service-area band, contact hero |

Two notes on the sourcing, in case they matter later:

- `hero.jpg` **has already been cropped** to remove signage. The uncropped frame
  has another business's name and phone number painted on the trailer's side
  panel. If you re-crop it from an original, keep the bottom out of frame.
- `trailer-hire.jpg` is a rally car with sponsor livery on it. Harmless at card
  size, but it is another reason to swap in a real photo.

## What is real and what is not

Everything factual on the site came from the brief. Nothing about the business
was invented:

- **Name, address, phone and hours** — real, and consistent across all four
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
- `FAQPage` structured data on the home, trailer hire and towing pages, matching
  the visible FAQ text exactly.
- `BreadcrumbList` on the three inner pages; `ContactPage` on contact.
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

Checked while building, all four pages at 1440px and 390px:

- **W3C Nu HTML checker** — 0 errors, 0 warnings on every page.
- **axe-core** (WCAG 2.1 A/AA + best practice) — 0 violations on every page at
  both widths.
- **29 interaction tests** — FAQ open/close, header scroll state, mobile menu
  (open, Escape, scroll lock), the mobile action bar showing and standing down
  over the form, required-field validation, email format, return-date-before-
  pickup-date, the no-backend error path, the success path, form reset,
  `?about=` prefill, `tel:` links, and every reveal-animated element staying
  visible with JavaScript disabled.

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
