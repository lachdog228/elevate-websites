#!/usr/bin/env python3
"""Build the responsive image set for the OZCAR Services site.

Reads full-size source photographs from ``assets/img/src/`` and writes cropped,
resized, optimised ``.webp`` (with ``.jpg`` fallbacks) into ``assets/img/``.

Every output the site references is produced here, so replacing a photograph is
a two-step job: drop the new file into ``assets/img/src/`` under the same name,
then re-run this script.

    python3 tools/build-images.py

Requires Pillow (``pip install Pillow``).
"""

from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image, ImageFilter
except ImportError:  # pragma: no cover - dependency guard
    sys.exit("Pillow is required:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "src"
OUT = ROOT / "assets" / "img"

# output name -> (source stem, aspect ratio, output widths, crop anchor, quality)
#
# Several photographs are published twice: once cropped square-ish for a card,
# once as a wide banner for a page hero. The source stem is therefore separate
# from the output name.
#
# The anchor decides which slice of a too-tall photograph survives the crop:
# 0 keeps the top, 0.5 the middle, 1 the bottom.
#
# Quality is tuned per photograph rather than globally. Heroes are the largest
# thing the browser downloads before it can paint, so they are pushed harder
# than the cards; the grainy monochrome transport shot needs a lower setting
# again because noise is expensive to encode.
BANNER = (1920, 1280, 800)
CARD = (1120, 720, 480)
# A source too small for the full card ladder. Offering widths it cannot fill
# only invites the browser to download an upscale that looks worse.
SMALL_CARD = (720, 480)

RECIPES = {
    # The hero source is already a wide letterbox crop, so it stays at 21:9
    # rather than being cropped a second time into 16:9 — the hero box crops it
    # again at display size, and two crops on top of each other zoom too far in.
    "hero":              ("hero",         21 / 9, BANNER,              0.50, 66),
    "trailer-hire":      ("trailer-hire",  4 / 3, CARD,                0.50, 74),
    "towing":            ("towing",        4 / 3, CARD,                0.40, 74),
    "towing-wide":       ("towing",       21 / 9, BANNER,              0.40, 68),
    # Only the wide banner rendition is still used; the card slot it used to
    # fill now carries the business's own machinery photo.
    "transport-wide":    ("transport",    21 / 9, BANNER,              0.50, 66),
    # The business's own photo of a tractor on the trailer. It arrived as a
    # 387px thumbnail, so it is capped at 720 and given a high quality setting
    # to spend bits on the upscale rather than the compression.
    "machinery":         ("machinery",     4 / 3, SMALL_CARD,          0.50, 82),
    "coast":             ("coast",        21 / 9, (1920, 1280, 800),   0.50, 68),
}


def crop_to_ratio(im: Image.Image, ratio: float, anchor: float) -> Image.Image:
    """Centre-crop (horizontally) and anchor-crop (vertically) to ``ratio``."""
    w, h = im.size
    if w / h > ratio:
        new_w = round(h * ratio)
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = round(w / ratio)
    top = round((h - new_h) * anchor)
    return im.crop((0, top, w, top + new_h))


def average_hex(im: Image.Image) -> str:
    """Average colour, used as the placeholder tone behind a loading image."""
    r, g, b = im.resize((1, 1), Image.Resampling.LANCZOS).convert("RGB").getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


def build(name: str, stem: str, ratio: float, widths: tuple[int, ...],
          anchor: float, quality: int) -> str:
    source = SRC / f"{stem}.jpg"
    if not source.exists():
        raise FileNotFoundError(f"missing source photograph: {source}")

    with Image.open(source) as raw:
        base = crop_to_ratio(raw.convert("RGB"), ratio, anchor)

    for width in widths:
        height = round(width / ratio)
        resized = base.resize((width, height), Image.Resampling.LANCZOS)
        # A touch of sharpening restores the bite lost in the downscale. Small
        # renditions lose the most and can take the most before they look crunchy.
        percent = 60 if width <= 800 else 35
        resized = resized.filter(ImageFilter.UnsharpMask(radius=0.9, percent=percent, threshold=3))
        resized.save(OUT / f"{name}-{width}.webp", "WEBP", quality=quality, method=6)
        resized.save(OUT / f"{name}-{width}.jpg", "JPEG", quality=min(quality + 8, 86),
                     optimize=True, progressive=True)

    return average_hex(base)


def prune(expected: set[str]) -> list[str]:
    """Delete renditions left behind by an earlier, different recipe.

    Changing a recipe's widths otherwise leaves the old files sitting in
    assets/img, where they get shipped and nothing references them.
    """
    keep = expected | {"og-card.jpg", "favicon.svg"}
    stale = sorted(f for f in OUT.iterdir() if f.is_file() and f.name not in keep)
    for f in stale:
        f.unlink()
    return [f.name for f in stale]


def build_open_graph() -> None:
    """1200x630 social preview card, cropped from the hero photograph."""
    with Image.open(SRC / "hero.jpg") as raw:
        card = crop_to_ratio(raw.convert("RGB"), 1200 / 630, 0.5)
    card = card.resize((1200, 630), Image.Resampling.LANCZOS)
    card.save(OUT / "og-card.jpg", "JPEG", quality=84, optimize=True, progressive=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"sources: {SRC}\noutput:  {OUT}\n")

    tones = {}
    expected: set[str] = set()
    for name, (stem, ratio, widths, anchor, quality) in RECIPES.items():
        tones[name] = build(name, stem, ratio, widths, anchor, quality)
        expected.update(f"{name}-{w}.{ext}" for w in widths for ext in ("webp", "jpg"))
        sizes = ", ".join(str(w) for w in widths)
        print(f"  {name:<19} {sizes:<20} q{quality}  placeholder {tones[name]}")

    build_open_graph()
    print("  og-card       1200x630")

    removed = prune(expected)
    if removed:
        print(f"\nremoved {len(removed)} stale rendition(s): {', '.join(removed)}")

    total = sum(f.stat().st_size for f in OUT.glob("*") if f.is_file())
    print(f"\n{len(list(OUT.glob('*.webp')))} webp + fallbacks, {total / 1024:.0f} KB total")
    print("\nPlaceholder tones (the --tone value on each figure in the HTML):")
    for name, tone in tones.items():
        print(f"  {name}: {tone}")


if __name__ == "__main__":
    main()
