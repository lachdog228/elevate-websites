#!/usr/bin/env python3
"""Build preview.html — the whole site as one self-contained file.

Both pages, the stylesheet, the script, the fonts and the artwork are
inlined into a single HTML file with no external requests at all. Useful
for emailing the client a preview, opening the site straight off a USB
stick, or publishing it somewhere that only accepts one file.

    python3 build-preview.py

The two pages become two panels switched by the nav via the URL hash
(#home / #menu), because one file can only be one page. Everything else —
markup, styles, behaviour, the scroll sequence — is the real site.

This is a preview artefact, not the deliverable. What ships is dist/;
see build-dist.py.
"""

import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "preview.html"


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def data_uri(rel: str, mime: str) -> str:
    raw = (ROOT / rel).read_bytes()
    return f"data:{mime};base64," + base64.b64encode(raw).decode("ascii")


def grab(html: str, tag: str, needle: str) -> str:
    """Pull one whole element out of a page by its opening-tag signature."""
    start = html.index(needle)
    depth = 0
    for m in re.finditer(rf"<{tag}\b[^>]*>|</{tag}>", html[start:]):
        depth += 1 if m.group(0).startswith(f"</{tag}") is False else -1
        if depth == 0:
            return html[start:start + m.end()]
    raise ValueError(f"unbalanced <{tag}> from {needle!r}")


def inline_fonts(css: str) -> str:
    def sub(m):
        name = m.group(1)
        return "url(" + data_uri(f"assets/fonts/{name}", "font/woff2") + ")"
    return re.sub(r"url\('\.\./fonts/([^']+)'\)", sub, css)


def inline_images(html: str) -> str:
    def sub(m):
        return 'src="' + data_uri("assets/img/" + m.group(1), "image/svg+xml") + '"'
    return re.sub(r'src="assets/img/([^"]+)"', sub, html)


def rewrite_links(html: str) -> str:
    """Point every cross-page link at the hash router instead of a file."""
    html = html.replace('href="index.html#', 'href="#')
    html = html.replace('href="index.html"', 'href="#home"')
    html = html.replace('href="menu.html"', 'href="#menu"')
    html = html.replace('href="#top"', 'href="#home"')
    return html


ROUTER = """
/* ── Preview-only router ──────────────────────────────────────────
   One file can only be one page, so the two pages sit side by side
   and the nav swaps them on the URL hash. Nothing else about the
   site changes. This block does not exist in the deployed site.
*/
(function preview() {
  'use strict';
  var panels = {
    home: document.querySelector('[data-page="home"]'),
    menu: document.querySelector('[data-page="menu"]')
  };
  if (!panels.home || !panels.menu) return;

  var menuLink = document.querySelector('.site-nav ul a[href="#menu"]');

  function show(name, targetId) {
    panels.home.hidden = name !== 'home';
    panels.menu.hidden = name !== 'menu';

    if (menuLink) {
      if (name === 'menu') menuLink.setAttribute('aria-current', 'page');
      else menuLink.removeAttribute('aria-current');
    }

    if (targetId) {
      var el = document.getElementById(targetId);
      if (el) { el.scrollIntoView(); return nudge(); }
    }
    window.scrollTo(0, 0);
    nudge();
  }

  // The scroll sequence measures itself on scroll; a panel that was
  // hidden a moment ago has no height yet, so ask for one more frame.
  function nudge() {
    window.dispatchEvent(new Event('scroll'));
    window.requestAnimationFrame(function () {
      window.dispatchEvent(new Event('scroll'));
    });
  }

  function route() {
    var hash = (window.location.hash || '').slice(1);
    if (hash === 'menu') return show('menu');
    if (!hash || hash === 'home' || hash === 'main') return show('home');
    show('home', hash);
  }

  window.addEventListener('hashchange', route);
  route();
}());
"""

PREVIEW_CSS = """
/* Preview-only: the two pages are panels, not documents. */
[data-page][hidden] { display: none; }
"""


def main() -> int:
    try:
        index_html = read("index.html")
        menu_html = read("menu.html")
        css = inline_fonts(read("assets/css/styles.css"))
        js = read("assets/js/main.js")
    except FileNotFoundError as err:
        print(f"missing source file: {err}", file=sys.stderr)
        return 1

    banner = grab(index_html, "div", '<div class="draft-banner"')
    header = grab(index_html, "header", '<header class="site-header"')
    footer = grab(index_html, "footer", '<footer class="site-footer"')
    home_main = grab(index_html, "main", '<main id="main">')
    menu_main = grab(menu_html, "main", '<main id="main">')

    # Strip the <main> wrapper off each page; one wrapper serves both.
    inner = lambda block: re.sub(r"^<main[^>]*>|</main>$", "", block).strip()
    home_body, menu_body = inner(home_main), inner(menu_main)

    # Both pages name their soups section the same thing. Two elements
    # cannot share an id in one document, so the home teaser gives way.
    home_body = (home_body
                 .replace('id="soups"', 'id="soups-home"')
                 .replace('id="soups-title"', 'id="soups-home-title"')
                 .replace('aria-labelledby="soups-title"', 'aria-labelledby="soups-home-title"'))

    parts = [banner, header, home_body, menu_body, footer]
    parts = [inline_images(rewrite_links(p)) for p in parts]
    banner, header, home_body, menu_body, footer = parts

    page = f"""<title>Daily Soup Go.</title>
<style>
{css}
{PREVIEW_CSS}</style>

{banner}
{header}

<main id="main">
  <div data-page="home">
{home_body}
  </div>
  <div data-page="menu" hidden>
{menu_body}
  </div>
</main>

{footer}

<script>
{js}
{ROUTER}</script>
"""

    OUT.write_text(page, encoding="utf-8")

    external = len(re.findall(r'(?:src|href)="https?://', page))
    leftover = len(re.findall(r'"assets/', page))
    print("  preview.html   %.0f KB" % (OUT.stat().st_size / 1024))
    print("  external requests: %d" % external)
    print("  unresolved asset paths: %d" % leftover)
    return 1 if (external or leftover) else 0


if __name__ == "__main__":
    raise SystemExit(main())
