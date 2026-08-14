#!/usr/bin/env python3
"""
Elevate Website Designs — static site builder.

Renders every page from one shared shell so nav, footer, canonicals and
structured data cannot drift apart between pages. FAQ content is defined
once and emitted twice: as accordion markup and as FAQPage JSON-LD.

    python3 build.py          -> writes dist/
"""

import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src" / "pages"
DIST = ROOT / "dist"

# ═══════════════════════════════════════════════════════════════════
#  SITE CONFIG
#
#  Anything still marked TODO_ is reported by the build as a warning and
#  is deliberately left OUT of the structured data rather than faked,
#  because invented contact details in schema markup is a Google policy
#  problem, not just a cosmetic one.
# ═══════════════════════════════════════════════════════════════════
ORIGIN = "https://elevatewebsites.co.site"

PHONE_DISPLAY = "0480 214 918"
PHONE_E164 = "+61480214918"

# ABN is displayed as text only. Schema's identifier property expects the
# actual registration number, so asserting one without having it would be
# a false claim in machine-readable data — the footer note carries the
# trust signal instead. Set ABN to the real number to emit it properly.
ABN = ""
ABN_NOTE = "ABN Registered"

EMAIL = "lachlan@elevatewebsites.co.site"
BUSINESS = "Elevate Website Designs"
OWNER = "Lachlan Mooney"
LOCALITY = "Torquay"
REGION = "VIC"
REGION_FULL = "Victoria"
POSTCODE = "3228"
LAT, LNG = -38.3306, 144.3161      # Torquay VIC
FOUNDED = "2025"
OG_IMAGE = f"{ORIGIN}/assets/img/og-cover.jpg"
BUILD_DATE = date.today().isoformat()

SUBURBS = [
    "Torquay", "Jan Juc", "Barwon Heads", "Ocean Grove", "Anglesea",
    "Geelong", "Armstrong Creek", "Lorne", "Aireys Inlet", "Winchelsea",
]


def has(value: str) -> bool:
    """A field is usable only if it isn't still a placeholder."""
    return bool(value) and not value.startswith("TODO_")


# ═══════════════════════════════════════════════════════════════════
#  STRUCTURED DATA
# ═══════════════════════════════════════════════════════════════════
BUSINESS_ID = f"{ORIGIN}/#business"
PERSON_ID = f"{ORIGIN}/#lachlan"
WEBSITE_ID = f"{ORIGIN}/#website"


def business_node():
    node = {
        "@type": "ProfessionalService",
        "@id": BUSINESS_ID,
        "name": BUSINESS,
        "alternateName": ["Elevate", "Elevate Websites"],
        "url": f"{ORIGIN}/",
        "description": (
            "Web design, local SEO and website maintenance for small businesses "
            "across Torquay, Geelong and the Surf Coast."
        ),
        "email": EMAIL,
        "image": OG_IMAGE,
        "logo": f"{ORIGIN}/assets/img/logo.png",
        "priceRange": "$$",
        "foundingDate": FOUNDED,
        "founder": {"@id": PERSON_ID},
        "address": {
            "@type": "PostalAddress",
            "addressLocality": LOCALITY,
            "addressRegion": REGION,
            "postalCode": POSTCODE,
            "addressCountry": "AU",
        },
        "geo": {"@type": "GeoCoordinates", "latitude": LAT, "longitude": LNG},
        # Service-area business: it serves a radius, it isn't a walk-in shopfront.
        "areaServed": [{"@type": "City", "name": s} for s in SUBURBS[:6]],
        "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {"@type": "GeoCoordinates", "latitude": LAT, "longitude": LNG},
            "geoRadius": "60000",
        },
        "knowsAbout": [
            "Web design", "Search engine optimisation", "Local SEO",
            "Google Business Profile optimisation", "Website maintenance",
            "Core Web Vitals", "Website hosting",
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Web design and SEO services",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": n,
                                                   "url": f"{ORIGIN}{u}"}}
                for n, u in [
                    ("Website Design & Build", "/services/web-design"),
                    ("Local SEO Setup & Management", "/services/local-seo"),
                    ("Website Maintenance", "/services/website-maintenance"),
                    ("Google Business Profile Optimisation", "/services/google-business-profile"),
                ]
            ],
        },
    }
    if has(PHONE_E164):
        node["telephone"] = PHONE_E164
    if has(ABN):
        node["identifier"] = {"@type": "PropertyValue", "name": "ABN", "value": ABN}
    return node


def person_node():
    return {
        "@type": "Person",
        "@id": PERSON_ID,
        "name": OWNER,
        "url": f"{ORIGIN}/about",
        "jobTitle": "Web Designer & SEO Consultant",
        "worksFor": {"@id": BUSINESS_ID},
        "knowsAbout": ["Web design", "Local SEO", "Front-end development"],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": LOCALITY,
            "addressRegion": REGION,
            "addressCountry": "AU",
        },
    }


def breadcrumb_node(crumbs, url):
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": f"{ORIGIN}/"}]
    for i, (name, href) in enumerate(crumbs, start=2):
        entry = {"@type": "ListItem", "position": i, "name": name}
        if href:
            entry["item"] = f"{ORIGIN}{href}"
        items.append(entry)
    return {"@type": "BreadcrumbList", "@id": f"{url}#breadcrumb", "itemListElement": items}


def faq_node(faqs, url):
    return {
        "@type": "FAQPage",
        "@id": f"{url}#faq",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)},
            }
            for q, a in faqs
        ],
    }


def strip_tags(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()


def build_graph(page, url):
    graph = [business_node(), person_node(), {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        "url": f"{ORIGIN}/",
        "name": BUSINESS,
        "publisher": {"@id": BUSINESS_ID},
        "inLanguage": "en-AU",
    }]

    webpage = {
        "@type": page.get("page_type", "WebPage"),
        "@id": f"{url}#webpage",
        "url": url,
        "name": page["title"],
        "description": page["description"],
        "isPartOf": {"@id": WEBSITE_ID},
        "about": {"@id": BUSINESS_ID},
        "inLanguage": "en-AU",
        "datePublished": "2026-08-12",
        "dateModified": BUILD_DATE,
    }
    if page.get("crumbs"):
        webpage["breadcrumb"] = {"@id": f"{url}#breadcrumb"}
        graph.append(breadcrumb_node(page["crumbs"], url))
    graph.append(webpage)

    if page.get("service"):
        svc = {
            "@type": "Service",
            "@id": f"{url}#service",
            "name": page["service"]["name"],
            "description": page["service"]["desc"],
            "provider": {"@id": BUSINESS_ID},
            "areaServed": [{"@type": "City", "name": s} for s in SUBURBS[:6]],
            "serviceType": page["service"]["name"],
            "url": url,
        }
        graph.append(svc)

    if page.get("faqs"):
        graph.append(faq_node(page["faqs"], url))

    return {"@context": "https://schema.org", "@graph": graph}


# ═══════════════════════════════════════════════════════════════════
#  SHELL
# ═══════════════════════════════════════════════════════════════════
NAV_ITEMS = [
    ("Services", "/services"),
    ("Areas", "/web-design-torquay"),
    ("About", "/about"),
]


def render_nav(active):
    links = []
    for label, href in NAV_ITEMS:
        cur = ' aria-current="page"' if active.startswith(href) and href != "/" else ""
        links.append(f'      <li><a href="{href}"{cur}>{label}</a></li>')
    if has(PHONE_DISPLAY):
        links.append(
            f'      <li><a href="tel:{PHONE_E164}" class="nav-phone">{PHONE_DISPLAY}</a></li>'
        )
    links.append('      <li><a href="/contact" class="btn-nav">Get a Quote</a></li>')
    return f"""<nav>
  <a href="/" class="nav-logo" aria-label="{BUSINESS} home">Elevate<span>.</span></a>
  <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links" id="navLinks">
{chr(10).join(links)}
  </ul>
</nav>
<div class="nav-backdrop"></div>"""


def render_footer():
    contact_bits = [f'<li><a href="mailto:{EMAIL}">Email</a></li>']
    if has(PHONE_DISPLAY):
        contact_bits.insert(0, f'<li><a href="tel:{PHONE_E164}">{PHONE_DISPLAY}</a></li>')
    if has(ABN):
        abn_line = f" · ABN {ABN}"
    elif ABN_NOTE:
        abn_line = f" · {ABN_NOTE}"
    else:
        abn_line = ""

    return f"""<footer>
  <div class="footer-ghost" aria-hidden="true">ELEVATE</div>
  <div class="footer-inner">
    <div class="footer-cols">
      <div>
        <a href="/" class="footer-brand-logo">Elevate<span>.</span> Website Designs</a>
        <p class="footer-blurb">Custom-built websites and local SEO for small businesses
        across Torquay, Geelong and the Surf Coast.</p>
      </div>
      <div>
        <p class="footer-h">Services</p>
        <ul class="footer-list">
          <li><a href="/services/web-design">Web Design</a></li>
          <li><a href="/services/local-seo">Local SEO</a></li>
          <li><a href="/services/website-maintenance">Maintenance</a></li>
          <li><a href="/services/google-business-profile">Google Business Profile</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-h">Areas</p>
        <ul class="footer-list">
          <li><a href="/web-design-torquay">Torquay</a></li>
          <li><a href="/web-design-geelong">Geelong</a></li>
          <li><a href="/web-design-surf-coast">Surf Coast</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-h">Contact</p>
        <ul class="footer-list">
          {chr(10).join("          " + b for b in contact_bits).strip()}
          <li><a href="/contact">Get a Quote</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-row">
      <p class="footer-text">© {date.today().year} {BUSINESS} · {LOCALITY}, {REGION}{abn_line}</p>
      <p class="footer-text">Serving Torquay, Geelong &amp; the Surf Coast</p>
    </div>
  </div>
</footer>"""


def render_faqs(faqs, heading="Frequently asked questions"):
    if not faqs:
        return ""
    items = []
    for i, (q, a) in enumerate(faqs):
        items.append(f"""      <div class="faq-item">
        <h3>
          <button class="faq-q" id="faq-q{i}" aria-expanded="false" aria-controls="faq-a{i}">{q}</button>
        </h3>
        <div class="faq-a" id="faq-a{i}" role="region" aria-labelledby="faq-q{i}">
          <div class="faq-a-inner">{a}</div>
        </div>
      </div>""")
    return f"""
<section id="faq">
  <div class="section-inner section-narrow">
    <p class="eyebrow-sm fade-up">FAQ</p>
    <h2 class="section-heading fade-up">{heading}</h2>
    <div class="faq-list">
{chr(10).join(items)}
    </div>
  </div>
</section>"""


def render_breadcrumbs(crumbs):
    if not crumbs:
        return ""
    lis = ['      <li><a href="/">Home</a></li>']
    for name, href in crumbs:
        if href:
            lis.append(f'      <li><a href="{href}">{name}</a></li>')
        else:
            lis.append(f'      <li aria-current="page">{name}</li>')
    return f"""<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
{chr(10).join(lis)}
  </ol>
</nav>"""


def render_cta(heading, sub):
    tel = ""
    if has(PHONE_DISPLAY):
        tel = f'<a href="tel:{PHONE_E164}" class="btn-ghost magnetic">Call {PHONE_DISPLAY}</a>'
    return f"""
<section class="cta-section">
  <div class="section-inner">
    <h2 class="section-heading fade-up">{heading}</h2>
    <p class="section-sub fade-up">{sub}</p>
    <div class="cta-actions fade-up">
      <a href="/contact" class="btn-primary magnetic">Get a free quote →</a>
      {tel}
    </div>
  </div>
</section>"""


def render_page(page):
    url = f"{ORIGIN}{page['path']}" if page["path"] != "/" else f"{ORIGIN}/"
    graph = json.dumps(build_graph(page, url), indent=2, ensure_ascii=False)
    body = (SRC / page["file"]).read_text(encoding="utf-8")

    body = body.replace("{{FAQ}}", render_faqs(page.get("faqs", []),
                                               page.get("faq_heading", "Frequently asked questions")))
    body = body.replace("{{CTA}}", render_cta(
        page.get("cta_heading", "Ready to get more customers?"),
        page.get("cta_sub", "Tell me about your business and I'll come back with a plan and a fixed price — no obligation."),
    ))
    body = body.replace("{{BREADCRUMBS}}", render_breadcrumbs(page.get("crumbs")))
    body = body.replace("{{PHONE_DISPLAY}}", PHONE_DISPLAY if has(PHONE_DISPLAY) else "")
    body = body.replace("{{PHONE_E164}}", PHONE_E164 if has(PHONE_E164) else "")
    body = body.replace("{{EMAIL}}", EMAIL)

    return f"""<!DOCTYPE html>
<html lang="en-AU" class="no-js">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{page['title']}</title>
<meta name="description" content="{page['description']}" />
<link rel="canonical" href="{url}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="theme-color" content="#050608" />
<meta name="author" content="{OWNER}" />
<meta name="geo.region" content="AU-{REGION}" />
<meta name="geo.placename" content="{LOCALITY}" />

<meta property="og:site_name" content="{BUSINESS}" />
<meta property="og:title" content="{page.get('og_title', page['title'])}" />
<meta property="og:description" content="{page['description']}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{url}" />
<meta property="og:locale" content="en_AU" />
<meta property="og:image" content="{OG_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="{BUSINESS} — web design and local SEO for Surf Coast businesses" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{page.get('og_title', page['title'])}" />
<meta name="twitter:description" content="{page['description']}" />
<meta name="twitter:image" content="{OG_IMAGE}" />

<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

<link rel="preload" href="/assets/fonts/archivo-900.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/assets/css/main.css" />
<script>document.documentElement.className=document.documentElement.className.replace('no-js','js')</script>

<script type="application/ld+json">
{graph}
</script>
</head>
<body>

<a href="#main" class="skip-link">Skip to content</a>
<div id="progress"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>
<div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
<div class="mesh" aria-hidden="true"><div class="mesh-blob mesh-1"></div><div class="mesh-blob mesh-2"></div><div class="mesh-blob mesh-3"></div></div>
<div class="vignette" aria-hidden="true"></div>
<div class="grain" aria-hidden="true"></div>

{render_nav(page['path'])}

<main id="main">
{body}
</main>

{render_footer()}

<script src="/assets/js/main.js" defer></script>
</body>
</html>
"""


# ═══════════════════════════════════════════════════════════════════
#  BUILD
# ═══════════════════════════════════════════════════════════════════
def main():
    from pages_config import PAGES  # noqa: E402

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    for asset in ["assets"]:
        shutil.copytree(ROOT / asset, DIST / asset)
    for f in ROOT.glob("static/*"):
        shutil.copy2(f, DIST / f.name)

    urls = []
    for page in PAGES:
        html = render_page(page)
        path = page["path"]
        out = DIST / "index.html" if path == "/" else DIST / path.lstrip("/") / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html, encoding="utf-8")
        urls.append((path, page.get("priority", "0.8"), page.get("changefreq", "monthly")))
        print(f"  {path:<38} {len(html)/1024:>6.1f} KB")

    # Sitemap — generated from the same page list, so it can never list a
    # URL that doesn't exist or miss one that does.
    entries = "\n".join(
        f"""  <url>
    <loc>{ORIGIN}{'/' if p == '/' else p}</loc>
    <lastmod>{BUILD_DATE}</lastmod>
    <changefreq>{cf}</changefreq>
    <priority>{pr}</priority>
  </url>"""
        for p, pr, cf in urls
    )
    (DIST / "sitemap.xml").write_text(
        f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{entries}
</urlset>
""", encoding="utf-8")

    print(f"\n  Built {len(PAGES)} pages -> dist/")

    warnings, notes = [], []
    if not has(PHONE_DISPLAY):
        warnings.append("PHONE_DISPLAY / PHONE_E164 still placeholder — no tel: links, "
                        "no telephone in LocalBusiness schema")
    if not has(ABN) and ABN_NOTE:
        notes.append(f"ABN shown as '{ABN_NOTE}' text only; not asserted in structured data. "
                     "Set ABN to the real number to emit it in schema.")

    if warnings:
        print("\n  ⚠️  INCOMPLETE BUSINESS DATA")
        for w in warnings:
            print(f"     - {w}")
        print("     Set these at the top of build.py and re-run.")
    if notes:
        print("\n  ℹ️  NOTES")
        for n in notes:
            print(f"     - {n}")
    return 0


if __name__ == "__main__":
    sys.path.insert(0, str(ROOT))
    sys.exit(main())
