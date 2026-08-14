# Elevate Website Designs

Static site for [elevatewebsites.co.site](https://elevatewebsites.co.site) — web
design and local SEO for Torquay, Geelong and the Surf Coast.

Every page is generated from one shared shell, so nav, footer, canonicals and
structured data can't drift apart between pages.

## Before you go live

Two values in `build.py` are still placeholders. The build prints a warning
while they are, and deliberately omits them from the structured data rather
than inventing them — a fabricated phone number or ABN in schema markup is a
Google policy problem, not a cosmetic one.

```python
PHONE_DISPLAY = "TODO_PHONE"      # e.g. "0412 345 678"
PHONE_E164    = "TODO_PHONE_E164" # e.g. "+61412345678"
ABN           = "TODO_ABN"        # e.g. "12 345 678 901"
```

Set them and re-run `python3 build.py`. That single change adds `tel:` links to
the nav and footer, the phone number to the contact page, `telephone` to the
LocalBusiness schema, and the ABN to the footer.

Also worth doing: `src/pages/about.html` carries a TODO comment listing the
personal details that would strengthen the page's E-E-A-T signals. Nothing was
invented there either.

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
