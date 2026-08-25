# Elevate Websites

Client sites built and maintained here.

## Great Ocean Road Sports Cars

Single-page site for a BMW Z4 convertible hire business in Torquay, VIC.
Live at <https://greatoceanroadsportscarhire.netlify.app/>.

### Layout

```
src/index.template.html   the page you edit (HTML + CSS + a little JS)
assets/img/               source images
build.py                  inlines the images and writes dist/
dist/                     built output — this is what Netlify publishes
netlify.toml              build + header config
```

### Editing

Edit `src/index.template.html`, then rebuild:

```bash
python3 build.py
```

`build.py` replaces the `{{BOOKING_URL}}`, `{{HERO_IMG}}` and `{{QR_IMG}}`
placeholders — the booking URL lives at the top of `build.py`, so it only has
to be changed in one place. Images are embedded as base64 data URIs, which
keeps `dist/index.html` self-contained: it renders correctly even if that one
file is deployed on its own. The same images are copied to `dist/assets/` so
the social-preview image resolves.

Commit the rebuilt `dist/` along with your source change.

### Design notes

- **Type**: Barlow Condensed (display) + Inter (body), served from Google Fonts.
- **Palette**: near-black `#0B0F12` ground, cream `#FBF7EE` text, `#D62B20`
  for calls to action. Every text/background pair used on the page meets
  WCAG AA (4.5:1); the CTA red was picked specifically so its cream label
  clears that bar.
- **The hero photo is 647×591**, so it is never rendered wider than that —
  the framed panel caps at 620px and the photo is downscaled at every
  breakpoint rather than stretched. Replacing it with a higher-resolution
  shot is the single biggest available visual upgrade; the frame will scale
  up on its own once a larger file is dropped in.
- **Motion** (scroll reveals, the marquee, nav state) is fully disabled under
  `prefers-reduced-motion: reduce`, which renders every section in its final
  state immediately.
- Audited with axe-core at 1440px and 390px: 0 violations.
