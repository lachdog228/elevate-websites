#!/usr/bin/env python3
"""Build the deployable site into dist/.

Images are inlined as base64 data URIs so index.html renders correctly even
if it is deployed on its own; the same images are also copied to
dist/assets/ so the social-preview (og:image) URL resolves. Run after
editing src/index.template.html:

    python3 build.py
"""
import base64
import pathlib
import shutil
import sys

ROOT = pathlib.Path(__file__).parent
TEMPLATE = ROOT / "src" / "index.template.html"
DIST = ROOT / "dist"
OUTPUT = DIST / "index.html"

BOOKING_URL = "https://drivemate.au/l/bmw/66da8fc9-2b0c-46a0-acb6-a475f9c3715f"

IMAGES = {
    "HERO_IMG": ("assets/img/hero-z4.jpg", "image/jpeg"),
    "QR_IMG": ("assets/img/qr-drivemate.png", "image/png"),
}


def data_uri(path: pathlib.Path, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def main() -> int:
    html = TEMPLATE.read_text(encoding="utf-8")
    html = html.replace("{{BOOKING_URL}}", BOOKING_URL)

    for token, (rel, mime) in IMAGES.items():
        src = ROOT / rel
        if not src.exists():
            print(f"error: missing asset {rel}", file=sys.stderr)
            return 1
        html = html.replace("{{" + token + "}}", data_uri(src, mime))

    if "{{" in html:
        leftover = html[html.index("{{"):html.index("{{") + 40]
        print(f"error: unresolved placeholder near {leftover!r}", file=sys.stderr)
        return 1

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    shutil.copytree(ROOT / "assets", DIST / "assets")
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"built {OUTPUT.relative_to(ROOT)} ({len(html.encode('utf-8')) / 1024:.0f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
