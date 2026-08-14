# Elevate Website Designs

Static site for [elevatewebsites.co.site](https://elevatewebsites.co.site) — web
design and local SEO for Torquay, Geelong and the Surf Coast.

Every page is generated from one shared shell, so nav, footer, canonicals and
structured data can't drift apart between pages.

## Business details

Phone is set (`0480 214 918`) and appears in the nav, footer, contact page and
the `telephone` property of the LocalBusiness schema.

The ABN is displayed as the text "ABN Registered" in the footer and is
deliberately **not** in the structured data. Schema's `identifier` property
expects the actual registration number, so asserting one without having it
would be a false claim in machine-readable data. To emit it properly:

```python
ABN = "12 345 678 901"   # in build.py — schema picks it up automatically
```

Still worth doing: `src/pages/about.html` carries a TODO comment listing the
personal details that would strengthen that page's E-E-A-T signals — how you
got into this, how long you've been doing it, and a real photo. Nothing was
invented there.

## Build

```bash
python3 build.py        # -> dist/   (standard library only, no deps)
python3 validate.py     # SEO checks; non-zero exit on failure
```

`validate.py` needs `beautifulsoup4`. It checks for missing or duplicate titles
and descriptions, missing canonicals, broken internal links, JSON-LD that
doesn't parse, FAQ schema that doesn't match the visible FAQs, pages with more
or fewer than one `<h1>`, and thin content.

## Layout

```
build.py            page shell, schema graph, sitemap generation
pages_config.py     per-page titles, descriptions, FAQs, schema hints
validate.py         post-build SEO checks
src/pages/*.html    body content only — no nav, footer or <head>
static/             copied verbatim to dist/ (robots, redirects, favicons)
assets/             css, js, self-hosted fonts, images
dist/               build output (committed, so it can be drag-dropped)
```

FAQs live in `pages_config.py` and are rendered twice — as the visible accordion
and as `FAQPage` JSON-LD. Editing a question updates both, so the markup can
never claim an answer the page doesn't show.

## Deploying

`dist/` is committed, so it can be dragged straight into Netlify.

To deploy on push instead, connect this repo in Netlify — `netlify.toml`
already sets the build command and publish directory. `build.py` uses only the
standard library, so there's nothing to install.

## Notes on the rebuild

- `_redirects` 301s the old `/services.html` and `/contact.html` URLs onto the
  extensionless versions. Both previously returned 200 with no canonical, which
  split ranking signals between two copies of every page.
- Fonts are self-hosted. The previous build loaded them from
  `fonts.googleapis.com`, and hid all content behind a preloader until
  `window.load` — which waits for every subresource, including that third-party
  request. A slow font CDN meant a blank screen.
- The `<h1>` now paints at full opacity immediately; only its transform
  animates. Fading it in delayed Largest Contentful Paint by the length of the
  animation.
