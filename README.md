# Daily Soup Go. — website

A one-page site for a fixed-location soup shop: four soups cooked fresh every
weekday morning (two Basic, two Gourmet), served takeaway only 11am–3pm, with
whatever is left over chilled into 1L packs.

> **This is a draft for client approval.** Every price and contact detail is a
> bracketed placeholder highlighted in yellow, the page carries `noindex`, and a
> "Draft preview" banner sits at the top. See [Draft state](#draft-state) and
> [Going live](#going-live).

## Stack

Plain HTML, CSS and vanilla JS. No framework, no build step, no dependencies and
no third-party requests at runtime. Drop the folder on any static host (Netlify,
Cloudflare Pages, cPanel, S3) and it works.

```
index.html                the whole site — one page, six sections
robots.txt
netlify.toml
assets/
  css/styles.css          all styling, numbered sections, tokens at the top
  js/main.js              nav, scroll spy, the soup scrub, live open/closed status
  fonts/*.woff2           Fraunces + Work Sans, latin subset, self-hosted
  img/soup-*.svg          the four soup illustrations
  img/takeaway-tub.svg    the 1L pack
  img/favicon.svg
```

Local preview:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Total page weight is about 150 KB, most of it fonts. All artwork is SVG, so it
is sharp at any size and costs a few kilobytes.

## Where the design came from

Everything is taken from the client's own counter photo — the striped cream
stoneware pot, the menu board, the "HOT SOUP MADE FRESH DAILY" and "TAKEAWAY
ONLY" signs, the neon `OPEN` in the window, and the warm wood and bone palette.

| From the photo | Where it shows up |
| --- | --- |
| Cream / amber / orange / brown stripe band | The pot and the 1L tub |
| Chunky 70s signage lettering | Fraunces 900 for every heading and the pot wordmark |
| Neon `OPEN` in the window | The live open/closed line in the header and hours card |
| "Takeaway only" card | The hero eyebrow |
| Stacked 1L tubs on the back shelf | The chilled-packs illustration |

**Note on imagery.** The client's photo itself was supplied as a reference, not
as a file, so nothing on the site is that photograph. The artwork is
hand-drawn SVG matching its palette and subject. If the client sends the real
photos, the best places to use them are the hero (behind or instead of the pot),
the four soup cards, and the fridge of 1L packs. Swapping a soup card is a
one-line change — see below.

## The scroll-scrubbed soup sequence

On a wide screen the four soups are not a grid of cards. They share one
position on screen and cross-fade from one to the next as you scroll, with an
index rail down the left that tracks and jumps between them.

**How it is built.** A tall wrapper (`.soups-scroll`) supplies the scroll
distance; its child (`.soups-stage`) is `position: sticky`, so the soup holds
still in the viewport while you read it. Nothing intercepts the scroll — there
are no wheel or touch handlers and no scroll-jacking, so flicking, keyboard
paging, find-in-page and the scrollbar all behave normally. This is the
sticky-parent variant of the pinned-scrub pattern; it avoids the layout
thrash that pinning an element causes.

`main.js` reads one number per frame (how far through the wrapper you are,
clamped 0–1), converts it to a position along the sequence, and sets opacity.
Reads and writes are batched into a `requestAnimationFrame` callback, and only
`opacity` and `transform` are touched, so nothing triggers layout.

**Artwork and copy use different curves,** which matters:

- The **bowls** are opaque and identically framed, so each one fades in *over*
  the one before and then stays. Nothing shows through mid-transition.
- The **copy** is transparent — two blocks at once would overprint and become
  unreadable — so each fades out as the next fades in, the two ramps meeting
  exactly at the hand-over point.

**It is an enhancement, never a requirement.** The effect only switches on at
900px and wider *and* when the visitor has not asked for reduced motion.
Otherwise the same four blocks stay in normal document flow and read as a
plain list — which is also exactly what renders with JavaScript disabled. The
content is identical either way; nothing is hidden behind the animation. Only
the soup currently on top is exposed to assistive technology, matching what is
actually legible.

**Tuning it.** Scroll distance per soup is the `80vh` in
`.soups-scroll.is-scrub`'s height calculation — raise it for a slower scrub,
lower it for a brisker one. The cross-fade sharpness is the divisors in
`artOpacity` and `copyOpacity` in `main.js`. The 900px cut-off is the
`wideEnough` media query in the same block. Adding or removing a soup needs no
changes: the count is read from the DOM and written to the `--panels` custom
property.

## Editing the content

Everything a shop owner would want to change is in one of three places.

### The four soups — `index.html`, the `TODAY'S SOUPS` block

Each soup is one `<article class="soup" data-soup>`. The four are in order: two
Basic (label reads "Classic") then two Gourmet. To change a soup, edit these
inside its block:

| What | Where |
| --- | --- |
| Illustration | `<img src="assets/img/soup-….svg" alt="…">` inside `.soup-art` |
| Label | `<p class="soup-tier">Classic</p>`, or add `soup-tier-gourmet` for Gourmet |
| Name | `<h3>` |
| Description | `<p class="soup-desc">` |
| Dietary tags | `<ul class="soup-tags">` — add or remove `<li>` items |
| Price | `<p class="soup-price">` — replace `[$0.00]` |

Setting a price means replacing the whole placeholder span:

```html
<!-- before -->
<p class="soup-price"><span class="placeholder">[$0.00]</span> <span class="soup-size">cup</span></p>
<!-- after -->
<p class="soup-price">$9.50 <span class="soup-size">cup</span></p>
```

Adding or removing a soup is just copying or deleting a whole `<article>`. The
scroll sequence counts them itself, so nothing else needs changing — though if
you add one, add a matching `<li>` to the `.soups-index` rail above so the
index stays in step. Keep `data-soup` on the article and the `.soup-art` /
`.soup-info` wrappers inside it: those are what the scrub animates.

The 1L pack price is the same pattern, in the `1L TAKEAWAY PACKS` block.

### Location, hours and contact — `index.html`

- **Address** appears twice: in the `LOCATION & HOURS` block and in the footer.
- **Opening hours** are in the `<table class="hours">`, one row per day. Each row
  carries `data-day="0…6"` (0 = Sunday) — leave those alone, they drive the
  "Today" marker.
- **Phone, email and socials** are in the footer, marked `data-tel`,
  `data-email` and `data-social`.
- **The directions button** is marked `data-map-link`.

### Hours logic — `assets/js/main.js`

The live "Open until 3pm" / "Opens tomorrow, 11am" line in the header and the
hours card reads from one object at the top of the file:

```js
var HOURS = {
  1: { open: 11 * 60, close: 15 * 60 },  // Monday
  …
};
```

Keys are weekday numbers, values are minutes past midnight in the visitor's
local time. A day left out is treated as closed. **If the hours change, edit
both this object and the table in the HTML** — the table is what search engines
and non-JS visitors read.

## Draft state

Nothing real is published while the site is a proposal:

- **Prices and contact details are placeholders** — `[$0.00]`, `[PHONE NUMBER]`,
  `[EMAIL ADDRESS]`, `[STREET ADDRESS]`, `[SUBURB STATE POSTCODE]`,
  `[NEAREST TRANSPORT]`, `[YEAR]` — highlighted in yellow so they are impossible
  to miss.
- Phone, email, social and map links are real `<a>` elements pointing at `#`.
  `main.js` marks them `aria-disabled` and swallows the click, so the draft never
  jumps unexpectedly.
- **`noindex, nofollow`** on the page and `Disallow: /` in `robots.txt`.
- **No canonical or `og:url` tag** and no JSON-LD, so nothing points at a real
  domain yet. The block to add is [below](#structured-data-to-add).
- **The map is a placeholder panel** rather than a Google embed.
- No `sitemap.xml`.

## Going live

1. Replace every `<span class="placeholder">…</span>` with the real value —
   searching for `placeholder` finds all of them.
2. Point the links at real destinations:
   ```html
   <a href="tel:+61390000000" data-tel>(03) 9000 0000</a>
   <a href="mailto:hello@example.com" data-email>hello@example.com</a>
   <a href="https://instagram.com/…" data-social="instagram">…</a>
   <a class="btn btn-primary" href="https://maps.google.com/?q=…" data-map-link>Get directions</a>
   ```
   Once an `href` is real, `main.js` leaves the link alone automatically — the
   guard only applies to links still pointing at `#`. Delete the
   `placeholderLinks` block in `main.js` when they are all done.
3. Delete the `DRAFT BANNER` block in `index.html` and the `noindex` meta tag.
4. Replace the `.map-placeholder` block with the real embed:
   ```html
   <div class="map">
     <iframe title="Map showing the shop"
             src="https://www.google.com/maps?q=URL+ENCODED+ADDRESS&output=embed"
             loading="lazy" referrerpolicy="no-referrer-when-downgrade"
             allowfullscreen></iframe>
   </div>
   ```
5. Open up `robots.txt` and add a `sitemap.xml`.
6. Add the canonical, `og:url` and structured data below.

### Structured data to add

This is what Google reads for the business listing. Put it in the `<head>` with
the real values:

```html
<link rel="canonical" href="https://YOURDOMAIN/">
<meta property="og:url" content="https://YOURDOMAIN/">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "servesCuisine": "Soup",
  "name": "Daily Soup Go.",
  "description": "Four soups cooked from scratch every weekday morning. Takeaway only, 11am to 3pm.",
  "url": "https://YOURDOMAIN/",
  "telephone": "+61XXXXXXXXX",
  "email": "EMAIL",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "STREET",
    "addressLocality": "SUBURB",
    "addressRegion": "STATE",
    "postalCode": "POSTCODE",
    "addressCountry": "AU"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "11:00",
    "closes": "15:00"
  }]
}
</script>
```

## Copy that needs confirming

The layout is real; some of the words are a considered guess and should be
checked with the client before launch:

- **Soup names and descriptions.** The four names come from the menu board in
  the client's photo. The tasting notes and the dietary tags were written to
  fill the design and have not been confirmed against the actual recipes —
  **the allergen tags in particular must be checked**.
- **"Cooked from 6am"**, **"braised three hours"**, **"stock goes on before
  six"** and the market-buying story in About are plausible but invented.
- **"Keeps three days in the fridge, or freeze for up to three months"** is
  standard food-safety guidance, not the client's own stated policy.
- **Prices.** The photo's menu board shows `$` with no figures, so the shop had
  not set them. Nothing has been guessed.
- There are **no testimonials or review counts** anywhere, on purpose. Add real
  ones when they exist.

## Testing

Checked in Chromium at 320, 390, 768, 1024 and 1440 px:

- no horizontal overflow at any width, and no console or network errors
- mobile nav opens, closes on Escape, on outside click and on following a link
- scroll spy marks the right nav item for each section
- anchored sections clear the sticky header
- every in-page anchor resolves to a real element
- the open/closed line and the "Today" row were tested against a fixed clock at
  Wed 10:30am, Wed 12:30pm, Wed 3:30pm, Fri 2:59pm and Sat noon
- the soup scrub was stepped through at four scroll positions, checking that
  the right soup is active, the rail agrees, and **only one copy block is ever
  visible at a time**
- both fallbacks were asserted: under `prefers-reduced-motion` and at 390px the
  scrub stays off, all four soups render at full opacity, and the rail is hidden
- text contrast meets WCAG AA (4.5:1) against its background everywhere

## Design notes

The look is meant to read as an established food business with a real
kitchen, not as a template. Worth preserving if the site is extended:

- **Restraint is the whole idea.** No floating badges, no rotated signs, no
  scrolling marquee, no glow, no stat counters, no cards that lift and tilt on
  hover. Those read as decoration for its own sake and are the fastest way to
  make a site look generated rather than designed. Depth comes from hairline
  rules, flat colour and whitespace.
- **Type carries the page.** Fraunces 900 for headings, Work Sans for
  everything else, and a short scale used consistently. The headline is allowed
  to be big; nothing else competes with it.
- **One accent, used sparingly.** Cream and cocoa do the work. Orange appears
  in the wordmark and on button hover, rust on the Gourmet label. That is all.
- **Square-ish corners.** `--radius` is 4px. The rounded, pill-shaped version of
  this page looked like a template; the flatter one looks like a shop.
- **Dark sections earn their place.** Only the 1L packs section and the footer
  are cocoa. Two dark bands in a cream page give it structure.
- **Motion is either functional or absent.** The scrub sequence is the one real
  flourish, and it carries content rather than decorating it. Beyond that: a
  short fade-up on scroll and the drifting steam. Everything stops under
  `prefers-reduced-motion`.
- **The food is the only illustration.** No icon sets, no stock photography.
