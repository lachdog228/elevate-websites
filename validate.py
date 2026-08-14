#!/usr/bin/env python3
"""
Post-build validation.

Checks the things that silently break SEO: missing canonicals, duplicate
or oversized titles, broken internal links, schema that doesn't parse, and
FAQ markup that claims answers the page doesn't actually show.

    python3 validate.py       -> non-zero exit if anything FAILs
"""

import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

DIST = Path(__file__).parent / "dist"
ORIGIN = "https://elevatewebsites.co.site"

fails, warns = [], []


def fail(page, msg):
    fails.append(f"{page}: {msg}")


def warn(page, msg):
    warns.append(f"{page}: {msg}")


def page_url(path: Path) -> str:
    rel = path.parent.relative_to(DIST).as_posix()
    return "/" if rel == "." else f"/{rel}"


pages = sorted(DIST.rglob("index.html"))
if not pages:
    print("No pages found in dist/ — run build.py first.")
    sys.exit(1)

built_paths = {page_url(p) for p in pages}
titles, descriptions = {}, {}

print("=" * 78)
print(f"{'PAGE':<36}{'WORDS':>7}{'TITLE':>7}{'DESC':>6}  SCHEMA")
print("=" * 78)

for path in pages:
    url = page_url(path)
    raw = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(raw, "html.parser")

    # Unrendered template tokens
    for token in re.findall(r"\{\{[A-Z_]+\}\}", raw):
        fail(url, f"unrendered template token {token}")

    # Title / description
    t = soup.find("title")
    title = t.get_text().strip() if t else ""
    if not title:
        fail(url, "missing <title>")
    elif len(title) > 62:
        warn(url, f"title {len(title)} chars — may truncate in results")
    if title in titles:
        fail(url, f"duplicate title, same as {titles[title]}")
    titles[title] = url

    dm = soup.find("meta", attrs={"name": "description"})
    desc = dm.get("content", "") if dm else ""
    if not desc:
        fail(url, "missing meta description")
    elif not 110 <= len(desc) <= 165:
        warn(url, f"description {len(desc)} chars — aim for 110-165")
    if desc in descriptions:
        fail(url, f"duplicate description, same as {descriptions[desc]}")
    descriptions[desc] = url

    # Canonical
    can = soup.find("link", rel=lambda v: v and "canonical" in v)
    expected = f"{ORIGIN}/" if url == "/" else f"{ORIGIN}{url}"
    if not can:
        fail(url, "missing canonical")
    elif can.get("href") != expected:
        fail(url, f"canonical {can.get('href')} != {expected}")

    # Social
    if not soup.find("meta", property="og:image"):
        fail(url, "missing og:image")
    if not soup.find("meta", attrs={"name": "twitter:card"}):
        warn(url, "missing twitter:card")

    # Headings
    h1s = soup.find_all("h1")
    if len(h1s) != 1:
        fail(url, f"{len(h1s)} <h1> tags (need exactly 1)")

    # Language
    html_tag = soup.find("html")
    if html_tag.get("lang") != "en-AU":
        warn(url, f"lang={html_tag.get('lang')} (expected en-AU)")

    # Schema
    schema_types = []
    faq_schema_qs = []
    for s in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(s.string)
        except Exception as e:
            fail(url, f"JSON-LD does not parse: {e}")
            continue
        for node in data.get("@graph", [data]):
            nt = node.get("@type")
            schema_types.append(nt if isinstance(nt, str) else "/".join(nt))
            if nt == "FAQPage":
                faq_schema_qs = [q["name"] for q in node.get("mainEntity", [])]
            if nt == "ProfessionalService":
                for req in ("name", "address", "url", "areaServed"):
                    if req not in node:
                        fail(url, f"ProfessionalService missing {req}")

    if not schema_types:
        fail(url, "no structured data")

    # FAQ schema must match what the page actually renders — mismatched
    # FAQ markup is a manual-action risk, not just a lint warning.
    visible_qs = [b.get_text(strip=True) for b in soup.select(".faq-q")]
    if faq_schema_qs or visible_qs:
        if sorted(faq_schema_qs) != sorted(visible_qs):
            fail(url, f"FAQ schema ({len(faq_schema_qs)}) != visible FAQs ({len(visible_qs)})")

    # Internal links resolve
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith(("http", "mailto:", "tel:", "#")):
            continue
        target = href.split("#")[0].split("?")[0].rstrip("/") or "/"
        if target not in built_paths:
            fail(url, f"broken internal link -> {href}")

    # Word count
    body = BeautifulSoup(raw, "html.parser")
    for tag in body(["script", "style", "nav", "footer"]):
        tag.decompose()
    words = len(body.get_text(" ", strip=True).split())
    if words < 300:
        warn(url, f"only {words} words — thin content risk")

    print(f"{url:<36}{words:>7}{len(title):>7}{len(desc):>6}  {','.join(sorted(set(schema_types)))}")

print("=" * 78)

if warns:
    print(f"\n⚠️  {len(warns)} WARNING(S)")
    for w in warns:
        print(f"   {w}")

if fails:
    print(f"\n❌ {len(fails)} FAILURE(S)")
    for f in fails:
        print(f"   {f}")
    sys.exit(1)

print(f"\n✅ All {len(pages)} pages passed validation.")
