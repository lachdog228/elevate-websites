# Daily Soup Go. — website

A two-page site for a fixed-location soup shop: four soups cooked fresh every
weekday morning (two Basic, two Gourmet), served takeaway only 11am–3pm, with
whatever is left over chilled into 1L packs.

| Page | What it is |
| --- | --- |
| `index.html` | Home — the scroll-driven hero film, the turn, the board, 1L packs, about, questions, find us |
| `menu.html` | The menu — the scroll-scrubbed soups, then sizes, packs, dietary key and notes |

**The four soups live on `menu.html` only.** The home page links to it rather
than repeating it, so when the board changes there is exactly one file to
edit.

> **This is a draft for client approval.** Every price and contact detail is a
> bracketed placeholder highlighted in yellow, the page carries `noindex`, and a
> "Draft preview" banner sits at the top. See [Draft state](#draft-state) and
> [Going live](#going-live).

## Stack

Plain HTML, CSS and vanilla JS. No framework, no build step, no dependencies and
no third-party requests at runtime. Drop the folder on any static host (Netlify,
Cloudflare Pages, cPanel, S3) and it works.

```
index.html                home            ┐
menu.html                 the menu        │ edit these
robots.txt                                ┘
design-package.md         the brand decisions: palette, type, band map, the docket
build-dist.py             copies the above into dist/ and writes _headers
build-preview.py          bundles the whole site into one self-contained file
netlify.toml              points Netlify's publish directory at dist/
dist/                     GENERATED — the folder that actually deploys
preview.html              GENERATED — both pages in a single file
review/                   the film's source renderer, NOT deployed
assets/
  css/styles.css          all styling, numbered sections, tokens at the top
  js/main.js              nav, scroll spy, the hero scrub, the soup scrub, hours
  fonts/*.woff2           Playfair Display + Work Sans + IBM Plex Mono, latin subset
  hero-scrub.mp4          the hero film, H.264      ┐ only one is ever downloaded
  hero-scrub.webm         the hero film, VP9        ┘
  hero-poster.jpg         first frame, shown while the film loads
  hero-ending.jpg         last frame, the static hero on phones
  pour-still.jpg          the same frame, used in the turn section
  img/soup-*.svg          the four soup illustrations
  img/takeaway-tub.svg    the 1L pack
  img/favicon.svg
```

Local preview:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

**Weight.** Everything except the film is about 250 KB, most of it fonts. The
film adds 704 KB (webm) or 2.0 MB (mp4) on top, but only on screens that
actually play it — phones and anyone with reduced motion get the 42 KB still
instead and never request it. The poster renders first either way, so the page
is readable long before the film arrives.

`review/` holds the Canvas renderer and the Playwright script that produced the
film's frames. It is kept so the film can be regenerated or retimed, and it is
deliberately outside the `FILES`/`DIRS` lists in `build-dist.py` so it never
ships.

## Where the design came from

Everything is taken from the client's own counter photo — the striped cream
stoneware pot, the menu board, the "HOT SOUP MADE FRESH DAILY" and "TAKEAWAY
ONLY" signs, the neon `OPEN` in the window, and the warm wood and bone palette.

| From the photo | Where it shows up |
| --- | --- |
| Cream / amber / orange / brown stripe band | The 1L tub, and the fill line on Hold to pour |
| Painted shopfront lettering | Playfair Display for the wordmark and every heading |
| Neon `OPEN` in the window | The live open/closed line in the header and the docket |
| "Takeaway only" card | The closing band of the hero film |
| "HOT SOUP MADE FRESH DAILY" board | The third band's line, near enough verbatim |
| Stacked 1L tubs on the back shelf | The chilled-packs illustration |
| The steam over the counter | The hero film, and the drawn steam line on the turn |

**Note on imagery.** The client's photo itself was supplied as a reference, not
as a file, so nothing on the site is that photograph. The remaining artwork —
the four soups and the 1L tub — is hand-drawn SVG matching its palette.

**The hero film is rendered, not filmed.** It is a Canvas animation of a pour,
built to hold the sequence's shape until real footage exists. Replacing it with
six seconds of the actual shop is the single biggest upgrade available to this
site, and the swap is three files (`hero-scrub.mp4`, `.webm`, and the two
stills) plus the byte sizes in `SOURCES`. Keep the cup in the right third of
frame so the copy still has its half. The other places real photography belongs
are the four soups on the menu and the fridge of 1L packs; swapping a soup
illustration for a photo is a one-line `src` change.

`design-package.md` records the decisions behind all of this — the palette
tokens, the type trio, the four-beat band map and the docket — and is the file
to read before changing any of them.

## The hero film

The top of `index.html` is a six-second film of soup being poured. It does not
autoplay. **Scroll drives it frame by frame** — down runs it forward, up runs
it backward — and four lines of copy land on top as it goes. At the end it
settles on the last frame and the real page begins. `design-package.md` holds
the band map; the four beats are:

| Range | Line | Entrance |
| --- | --- | --- |
| 0.00–0.19 | Another cold sandwich. | word-punch |
| 0.24–0.46 | Or something that was cooked this morning. | drift-down |
| 0.52–0.72 | Hot soup, made fresh daily. | blur-to-sharp |
| 0.80–1.00 | Daily Soup Go. + hours + the one CTA | word-by-word rise |

**How it is built.** Same sticky-parent pattern as the soup scrub: a 480vh
`.hero` gives the scroll distance, `.hero-stage` is `position: sticky`, and one
number per frame (progress 0–1) sets `video.currentTime`. Nothing intercepts
the scroll.

Four details are what make it work, and all four are easy to break:

- **The film is fetched whole as a Blob**, then played from an object URL.
  Seeking a video streamed over HTTP needs Range support, and plenty of hosts
  answer a Range request with the whole file — which silently clamps every seek
  to zero and freezes the film on frame one. Downloading it once removes the
  question. The loading ring is that fetch's progress.
- **Seeks are gated.** Writing `currentTime` while a seek is already in flight
  drops frames, so a new seek waits for `seeked` and only the newest queued
  position is used. The `error` handler clears the same flag — without that, one
  failed seek deadlocks the film for good.
- **The lerp is time-normalised**, `1 - pow(1 - k, dt / 16.667)`, so a 120Hz
  laptop and a 60Hz monitor ease at the same speed rather than one running
  double.
- **DOM writes are delta-gated.** Every frame computes the numbers; a write only
  happens when the value actually changed. Text updates at about 10Hz.

**Legibility.** Bone text on moving film is the easiest thing in the world to
make unreadable, so there are four layers: a base scrim over the whole stage, a
per-band scrim whose opacity rides that band's own progress, a three-layer text
shadow, and a smaller scrim behind chips and labels. The audit measures the
lightest pixel behind each headline on the real composited page, at three scroll
positions per band; the worst frame measured 14.5:1 against a floor of 3.5:1.

**It is an enhancement, never a requirement.** Five gates turn it off and show
`hero-ending.jpg` instead: width ≤720px, portrait ≤1024px, portrait with a
coarse pointer, short landscape with a coarse pointer, and
`prefers-reduced-motion`. **Those five strings are duplicated in `styles.css`
and `main.js` and must stay character-identical** — if they drift, one side
hides what the other is loading. If the film fails to download at all, the
poster stays, the loading ring is replaced by a scroll cue rather than spinning
forever, and the four captions still carry the whole sequence.

**Two codecs ship** because neither alone is enough: Safari needs H.264 in an
mp4, and many Linux Chromium builds have no H.264 decoder at all and need VP9.
`canPlayType` picks one and only that file is downloaded.

**Regenerating the film.** `review/pour-renderer.html` draws the frames on a
canvas and `review/render.js` steps it through 150 frames at 25fps. The encode
matters as much as the footage — a scrubbed video needs keyframes everywhere,
or seeking lands on the nearest one and the motion stutters:

```bash
ffmpeg -framerate 25 -i frames/f%04d.jpg \
  -c:v libx264 -crf 18 -preset slow -g 8 -keyint_min 8 \
  -pix_fmt yuv420p -movflags +faststart -an assets/hero-scrub.mp4
```

`-g 8` is the important flag. After re-encoding, update the byte sizes in
`SOURCES` at the top of `main.js` — they are the fallback when a host omits
`Content-Length`, and only affect the loading ring's accuracy.

## The docket

A thin monospace strip down the right edge showing the day, whether the shop is
open, and which section you are in. It is the one piece of furniture that
persists across the whole page, and it exists because kitchen dockets are
monospaced — it is the reason IBM Plex Mono is in the type stack at all.

Section names come from each `<section>`'s `data-docket-name`. **Set that
attribute when adding a section.** There is a fallback that derives a name from
the heading, but headings contain `<br>` and joining across one gives
"FOUR SOUPSON THE BOARD", so the explicit attribute is what should be relied on.

## The scroll-scrubbed soup sequence

Lives at the top of `menu.html`. On a wide screen the four soups are not a grid
of cards. They share one position on screen and cross-fade from one to the next
as you scroll, with an index rail down the left that tracks and jumps between
them.

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

### The four soups — `menu.html`, the `TODAY'S SOUPS` block

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

### Sizes, packs and extras — `menu.html`, the `THE PRINTED MENU` block

Cup, bowl, roll and the 1L pack are rows in `.menu-list`. Each is a name, a
dotted leader and a price, laid out like the shop's own board. Add a row by
copying an `<li>`; the leader stretches on its own.

The 1L pack price also appears in the `1L TAKEAWAY PACKS` block on
`index.html` — the one figure that is deliberately in two places, because it
belongs in the pitch as well as the menu.

### Location, hours and contact

- **Address** appears three times: the `LOCATION & HOURS` block on
  `index.html`, and the footer of both pages.
- **Opening hours** are in the `<table class="hours">`, one row per day. Each row
  carries `data-day="0…6"` (0 = Sunday) — leave those alone, they drive the
  "Today" marker.
- **Phone, email and socials** are in the footer of both pages, marked
  `data-tel`, `data-email` and `data-social`.
- **The header and footer blocks are duplicated across the two pages on
  purpose** — no build step means no includes. They are marked with a comment
  saying to keep them identical; change one, change both.
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

## Deploying

`dist/` is the folder to upload. It holds the site and nothing else — no
README, no build script, no git history — plus a `_headers` file carrying the
security and caching rules.

**Drag and drop.** Open <https://app.netlify.com/drop> and drop the `dist`
folder onto it. That is the whole process; there is no build to configure.

**From the repo.** Connect the repository in Netlify and leave the build
command empty. `netlify.toml` already sets the publish directory to `dist`, so
a git deploy ships exactly the same bytes as a drag-and-drop one.

**After editing anything**, rebuild the folder:

```bash
python3 build-dist.py
```

It prints every file and the total size. Edit the files at the repo root — the
copies inside `dist/` are overwritten on every build.

Any other static host works too (Cloudflare Pages, cPanel, S3). Only Netlify
reads `_headers`; on anything else the headers in `build-dist.py` need
translating into that host's own config, and **the site is meaningfully less
safe without them**.

## Single-file preview

`build-preview.py` bundles the entire site — both pages, the stylesheet, the
script, all eight font faces, every illustration and the hero film in both
codecs — into one `preview.html` with zero external requests. About 4 MB, of
which roughly 3.7 MB is the film as base64.

That is a lot for one file, and it buys the thing the preview exists to show.
Dropping a codec would halve it and strand either Safari or the Chromium builds
without an H.264 decoder, so both stay. `main.js` recognises a `data:` URI and
skips its Blob fetch, since the bytes are already in memory.

```bash
python3 build-preview.py
```

Useful for emailing the client a preview, opening the site off a USB stick, or
publishing it somewhere that only accepts a single file. Because one file can
only be one page, the two pages become two panels the nav swaps on the URL hash
(`#home` / `#menu`); everything else, including the scroll sequence, is the real
site running unmodified.

This is a preview artefact, not the deliverable. What ships is `dist/`.

## Security

The site makes **no third-party requests at all** — no CDN, no analytics, no
web fonts, no embeds, no trackers. Fonts, styles, script and artwork are all
served from the same origin. That is what makes the headers in
`build-dist.py` as tight as they are:

| Header | Why |
| --- | --- |
| `Content-Security-Policy` | `default-src 'none'` with same-origin script, style, image, font, `connect-src` and `media-src` only, plus `blob:` for media. `form-action 'none'` means nothing can be submitted anywhere; `base-uri 'none'` blocks `<base>` hijacking. Anything injected into the page can only reach this origin, and has nowhere to phone home to. |
| `X-Content-Type-Options: nosniff` | Stops a browser second-guessing a declared content type. |
| `X-Frame-Options: DENY` + `frame-ancestors 'none'` | The site cannot be framed, so it cannot be clickjacked. |
| `Referrer-Policy` | Full URLs are never leaked to other origins. |
| `Permissions-Policy` | Camera, microphone, geolocation and the rest are switched off outright. |
| `Cross-Origin-Opener-Policy` / `-Resource-Policy` | Isolates the page from other windows and stops other sites hotlinking assets. |
| `X-Robots-Tag: noindex, nofollow` | Draft only — see below. |

The page has no forms, no cookies, no `localStorage`, and no user input of any
kind, so there is nothing to inject into and nothing to steal. `main.js` writes
text through `textContent`, which cannot execute markup, and never calls `eval`,
`document.write` or `new Function`. There is no inline script and no inline
`style` attribute anywhere, which is what lets the CSP run without a single
`'unsafe-inline'`.

**`connect-src 'self'` and `media-src 'self' blob:` are the film's doing**, and
they are the loosest two lines in the policy. `connect-src` is what lets the
hero `fetch()` its own film; `blob:` is what lets the resulting object URL play.
Both are same-origin. Two things follow: an inline `style="…"` attribute is
still blocked — the loading ring's `stroke-dashoffset` lives in the stylesheet
for exactly that reason, though the same property set from JavaScript is fine,
since CSSOM writes are not what `style-src` governs — and if the film is ever
dropped, both lines should come back out.

**Two things to change at launch:**

1. **Remove the three noindex switches** — `X-Robots-Tag` in `build-dist.py`,
   the `<meta name="robots">` in both HTML files, and `Disallow: /` in
   `robots.txt`. All three are draft-only. Miss one and the site stays out of
   Google.
2. **Adding the Google Maps embed needs one CSP line**, and only one:
   `frame-src https://www.google.com;`. Nothing else should be loosened.

`Strict-Transport-Security` is deliberately **not** set. Netlify already serves
HTTPS and redirects HTTP, and HSTS is very hard to undo once browsers have
cached it. Add it at launch, on the real domain, once every subdomain can
serve HTTPS.

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

Every suite below runs against the built `dist/` folder served with its real
`_headers` rules, so what is tested is what deploys.

**Layout**, on both pages at 320, 360, 375, 390, 414, 430, 667×375, 844×390,
768 and 1440 px:

- no horizontal overflow at any width, and no console or network errors
- every link on both pages resolves (200), including the cross-page anchors
- mobile nav opens, closes on Escape, on outside click and on following a link
- scroll spy marks the right nav item for each section, and leaves the
  current-page marker on `menu.html` alone
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
- no text below 12px, and every link and button is at least 32×32 — the
  wordmark and the menu button are 43 and 44px, thumb-sized
- checked in both orientations; the scroll sequence correctly stays off below
  900px, where a pinned section would fight a phone's scrolling

**The hero film:**

- `currentTime` tracks scroll across the whole runway — 0%→0s, 25%→1.5s,
  50%→3s, 75%→4.5s, 100%→6s
- **the flick test**, because visitors flick rather than drag: stepped in wheel
  increments of 120, 240 and 360px. Every beat holds fully readable for at least
  five 120px flicks (measured 6, 5, 5, 7), and **no beat is skippable even at
  360px**
- **worst-frame legibility**: the glyphs are hidden, the real composited page is
  screenshotted at three positions per band, and the lightest pixel behind the
  headline is measured. Worst result 14.5:1, floor 3.5:1
- each band leads in its own range and the closing headline assembles word by
  word
- **reduced motion**, asserted in both directions: the still hero replaces the
  scrub, the film is never requested at all, the pour arrives already full, and
  flipping the preference mid-session swaps each way without a reload
- **complete without the film**: with the download blocked, the poster stays,
  the loading ring becomes a scroll cue rather than spinning forever, and the
  captions still carry the sequence
- the docket shows the right day, open state and section name

**Under the strict CSP**, both pages, desktop and mobile: stylesheet applies,
all eight font faces load, the script runs, both scroll sequences and the mobile
nav work, and the browser reports zero policy violations. The film is checked
here too — that the whole 6s buffers from one Blob and that scrolling still
moves it — since `connect-src` and `media-src` are the two lines the policy
would otherwise break silently.

One thing is filtered from the CSP harness and worth knowing about: Chromium
reports a `requestfailed` on the `blob:` URL after the film is already fully
buffered. It is duplicate-request bookkeeping, not a policy or network problem,
and the assertions above are what prove it harmless.

**Code**: `main.js` passes ESLint with no real findings; the stylesheet's
braces balance, every `var()` resolves, and there are no unused tokens. The
markup was parsed on both pages — no unclosed tags, no duplicate ids, every
image has `alt` and explicit dimensions, exactly one `h1` per page, and no
external requests.

## Design notes

The look is meant to read as an established food business with a real
kitchen, not as a template. Worth preserving if the site is extended:

- **Restraint is the whole idea.** No floating badges, no rotated signs, no
  scrolling marquee, no glow, no stat counters, no cards that lift and tilt on
  hover. Those read as decoration for its own sake and are the fastest way to
  make a site look generated rather than designed. Depth comes from hairline
  rules, flat colour and whitespace.
- **Type carries the page.** Playfair Display for headings and the wordmark,
  Work Sans for everything else, IBM Plex Mono for the docket and small labels,
  and a short scale used consistently. The mono is not decoration: it is the
  kitchen-docket voice, and it should stay confined to labels, the docket and
  numbers rather than spreading into body copy. The
  headline is allowed to be big; nothing else competes with it. Playfair is a
  high-contrast face, which is where the fanciness comes from — it needs less
  negative tracking and a little more leading than a chunky face would, and its
  **default oldstyle figures have to be overridden** wherever a number is read
  as a number, or `$0.00` renders with zeros that look like lowercase o's.
- **The hero is a film that reads as type.** The pour is the background; the
  four lines are the point. The cup sits in the right third of frame precisely
  so the left half stays clear for the copy — if the film is ever replaced,
  that empty left half is the requirement to keep.
- **The film argues rather than decorates.** It opens on the thing the customer
  would otherwise have had ("Another cold sandwich.") before offering the
  alternative. That is why the copy is worth scrolling through, and it is the
  reason the sequence is four beats rather than one logo reveal.
- **One accent, used sparingly.** Cream and cocoa do the work. Orange appears
  in the wordmark and on button hover, rust on the Gourmet label. That is all.
- **Square-ish corners.** `--radius` is 4px. The rounded, pill-shaped version of
  this page looked like a template; the flatter one looks like a shop.
- **Dark sections earn their place.** Only the 1L packs section and the footer
  are cocoa. Two dark bands in a cream page give it structure.
- **Motion is either functional or absent.** Both scrubs carry content rather
  than decorating it, and Hold to pour is the one place the visitor is invited
  to do something. Beyond that: a short fade-up on scroll and the drifting
  steam. Everything stops under `prefers-reduced-motion`, where Hold to pour
  arrives already poured rather than demanding a hold.
- **"Made this morning. Gone by three."** is a deliberate staccato pair, not a
  sentence that wants joining. It is the line the whole brand rests on, and it
  should survive any future copy edit intact.
- **The food is the only illustration.** No icon sets, no stock photography.
- **The menu reads like a menu.** Name, dotted leader, price — the layout on
  the shop's own board — rather than product cards with badges. Nav and group
  labels are uppercase and letterspaced, and interior pages open with a centred
  title. This direction was taken from thekyn.com.au at the client's request;
  the palette, type, artwork and scroll sequence remain this site's own.
