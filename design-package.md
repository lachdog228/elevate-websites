# Design Package: Daily Soup Go.

The single deliverable of the creative loop. Written before anything is
generated, consumed by the build. Every line of copy here ships verbatim.
Numbers are starting points, validated later by the flick test.

Tier 1, the single journey. One continuous shot, scrubbed by scroll.

---

## 1. The brand premise

**Today.** Everything on the board was cooked this morning and will be gone by
three. Not a menu, a day's work. The site teaches and sells that one idea: what
you get is what was made today, and today only. The film pours it, the board
lists it, the hours limit it, and the closing line asks you to come before it
runs out.

Every section serves that. A section that does not is cut.

## 2. The palette as CSS tokens

Sampled from Alicia's own counter photo, and from the film's warm grade. The
hero is a dark cinema; the page below is the shop's own cream. The settle is
where the visitor arrives out of the film and into the room.

```css
:root{
  --canvas:#F2E4CE;        /* the page below, the shop's cream, never pure white */
  --panel:#FBF3E6;         /* raised surfaces */
  --stage:#170D06;         /* the film's ground, warm near-black, never pure #000 */
  --accent:#C0631A;        /* the CTA and rare emphasis only */
  --accent-hover:#A83F19;
  --accent-muted:#EFA83A;  /* whisper level: borders, particles, the steam line */
  --text-primary:#2B1B0E;
  --text-secondary:#6B5540;
  --on-stage:#F6EBD8;      /* text over the film */
  --on-stage-dim:#C7B092;
}
```

**Declared deviation.** Cream with a warm accent is on the skill's banned list
as a default reach. It is not a reach here: it is the shop's real material
world, read off the client's photograph of her own counter. The carve-out is
earned by sampling her tones, inventing the signature element below, and
staying off the stock template layout.

## 3. The type trio

| Role | Face | Weights | Why |
|---|---|---|---|
| Display | Playfair Display | 500, 600, 700 | High contrast, elegant, holds a price. The client asked for fancy. |
| Body | Work Sans | 400, 500, 600 | Quiet, warm, legible small. |
| Mono | IBM Plex Mono | 400, 500 | The docket voice. Kitchen dockets and receipts are monospaced, so every small label on the site sounds like it came off the pass. |

Not Inter, not Roboto anywhere.

## 4. The band map

Hero height 480vh, so the scroll range is 380vh and each beat gets roughly 95vh
of plateau. The arc is the buyer's own complaint, then the turn, then the
promise, then the arrival.

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.19 | Empty cup on the counter, ladle entering from the top of frame | "Another cold sandwich." | Word-punch with overshoot. The words land like the ladle arriving. |
| 2 | 0.24 to 0.46 | The pour falling, the stream breaking the surface | "Or something that was cooked this morning." | Drift-down. Each word falls into place, echoing the pour. |
| 3 | 0.52 to 0.72 | The cup filling, steam lifting off the surface | "Hot soup, made fresh daily." | Blur-to-sharp. The line resolves as the steam clears. |
| 4 | 0.80 to 1.00 | The full cup at rest, lid set beside it | "Daily Soup Go." then "Monday to Friday, 11 to 3. Takeaway only." then the button "Find the shop" | Word-by-word rise into a staged settle. Three arrivals, one band. |

Band 1 skips the ease-in and opens settled with its one-time load ramp. Band 4
skips the ease-out and holds.

## 5. The static-hero copy block

For phones, portrait tablets and reduced motion. Composed over the ending
frame, no journey behind it.

- Headline: **Hot soup, made fresh daily.**
- Subline: **Four soups, cooked this morning. Monday to Friday, 11 to 3. Takeaway only.**
- Button: **Find the shop**

## 6. The below-fold outline

Every section funnels to one anchor: `#visit`, the address and the directions
button. There is no form and no cart, because the conversion is a person
walking in. Stated plainly so nobody expects an inbox.

**a. The turn.** Sets the premise against the buyer's real complaint.

> Kicker: `TODAY`
> Heading: **Made this morning. Gone by three.**
> Body: Four soups a day, cooked from scratch in our kitchen each morning, two
> classics and two that go a bit further. Ladled into a cup, lidded, and out the
> door.

**b. Today's board.** A pointer, not a copy. The soups live on `menu.html` so
there is one place to edit when the board changes.

> Kicker: `THE BOARD`
> Heading: **Four soups on the board**
> Body: Two classics and two gourmet, held hot until three. The board changes
> every weekday. When a soup runs out it is gone for the day.
> Button: **View the menu**

**c. The interactive moment. Hold to pour.** The one designed interaction,
living inside the board section. The visitor presses and holds; a cup fills as
they hold; releasing early eases the level back down rather than snapping. When
it fills, the four soup names light up in sequence underneath. The visitor
performs the brand's one idea instead of reading it. Reduced motion gets the
filled state instantly with no hold required.

> Microcopy above: `HOLD TO POUR`
> Microcopy after it fills: `THAT IS TODAY'S BOARD`

**d. 1L packs.**

> Kicker: `TAKE IT HOME`
> Heading: **Chilled 1L packs**
> Body: Whatever is left in the pots at 3pm gets chilled down the same afternoon
> and sealed into one-litre packs. Same soup, same day it was cooked. Feeds two
> or three.
> Note: Stock depends on what is left over, so packs sell out. Ring ahead if you
> want a particular soup put aside.

**e. About.**

> Kicker: `THE SHOP`
> Heading: **One kitchen, one job**
> Body: We are a small shop on a single site with a stove, four pots and a
> counter. There is no second kitchen, no central production and nothing arrives
> frozen in a bag.
> Body: Stock goes on before six. The four soups are decided by what came in
> from the market that week, which is why the board is different on Tuesday to
> what it was on Monday. We make what we think will sell that day and no more.

**f. The questions people actually ask.** The three real hesitations from the
research, answered in their words.

> Q: **Is soup actually enough for lunch?**
> A: A cup with a roll gets most people through the afternoon. If you want more,
> ask for a bowl.
>
> Q: **Will it still be hot when I get back to my desk?**
> A: It goes out lidded, straight off the heat. Five minutes' walk is fine. Much
> further and the 1L pack is the better buy.
>
> Q: **What if I get there and it is gone?**
> A: It happens on cold days. Earlier is safer, and there is always something
> left on the board even late.

**g. Find us.** The call to action.

> Kicker: `FIND US`
> Heading: **One shop, one address**
> Address, the live open state, the hours table, and the button: **Get directions**
> Note: Street parking out front.

**h. Footer.** Contact, hours, socials, nav. The brand is real, so there is no
fictional-brand disclosure. Prices and details stay as marked placeholders until
Alicia confirms them.

## 7. The vector layer plan

Drawn by hand, all reduced-motion safe (final states shown, drives stopped).

- **The steam line.** One continuous SVG curve, drawn in `--accent-muted` at
  whisper opacity, that draws itself with `stroke-dashoffset` as the visitor
  scrolls the page below the hero. It rises through the sections the way steam
  rises off a cup, and it ties the page back to the film.
- **The stripe band.** The amber, orange and brown band painted round Alicia's
  own stoneware, used as a section rule. Already the brand's device.
- **The environment layer.** One fixed background behind everything: a very slow
  warm glow drift on a 70 second cycle, so scrolling feels like moving through a
  room rather than past stacked boxes. Paused off-screen and on hidden tabs.
- **Steam motes.** Six to nine whisper-level particles drifting upward behind
  the board section, at 3 percent opacity. Transform and opacity only.

## 8. The signature element

**The docket.** A thin monospaced strip fixed to the right edge of the desktop
viewport, set like a kitchen docket: today's day, the live open or closed state,
and the section the visitor is currently in, updating as they scroll. It is the
kitchen's own voice running down the side of the page.

It is a signature and not a decoration because removing it would change the
page: it is the only element that speaks in the shop's operational voice, it
carries live information nothing else carries, and it is what makes the page
feel like it belongs to a working kitchen rather than to a design template.

Hidden under 1100px wide and on short screens, where it has no room.

## 9. The engineering list

The build owes all of it:

- Blob fetch for the film with the poster painted first, an honest progress ring,
  a 20 second watchdog, and an unbroken page if the film never arrives.
- The dt-normalised lerp in a rAF loop that rests when converged and when the
  hero is off screen.
- Gated seeks, coalesced to the newest target, with the error handler that breaks
  the deadlock.
- Delta-gated DOM writes everywhere, throttled to about 10Hz for text.
- Band pacing in vh, validated by the flick test at 120, 240 and 360px steps.
- The four-layer legibility system: base scrim, per-band scrim riding `--k`,
  the three-layer text shadow token, chips for small labels. Worst-frame audit
  at 3.5:1 or better.
- The five static-hero gates, identical in CSS and JS, armed and disarmed live
  from change listeners.
- Reduced motion honoured completely and in both directions.
- `overflow-x: clip` on html and body, with `hidden` first as fallback.
- The quality floor: semantic landmarks, skip link, focus-visible in the accent,
  44px touch targets under coarse pointers, real title and meta, inline SVG
  favicon, og tags left with a `<!-- DEPLOY STEP -->` marker.

## 10. The copy gate

Every viewer-facing line above ships verbatim. The built page must pass the grep
gate before anyone sees it: zero em dashes, zero instances of leverage,
seamless, empower, unlock, robust, actionable, data-driven, solutions. Then the
body sweep for the quieter tells.

One deliberate device is protected as craft, not drift: **"Made this morning.
Gone by three."** is a planned staccato pair, chosen here on purpose for this
brand. It stays.
