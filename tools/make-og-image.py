#!/usr/bin/env python3
"""Rebuild assets/img/og-image.jpg — the image shown when the site is shared.

It composites a photograph with a dark gradient and the DeMarzi wordmark, so a
shared link reads as branded rather than as a stray photo.

    python3 -m pip install pillow fonttools brotli
    python3 tools/make-og-image.py path/to/photo.jpg

Run from the repository root. Landscape photos work best; the script crops to
1200x630 and keeps the type clear of the busiest part of the frame.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont, ImageOps

W, H = 1200, 630
INK = (28, 26, 22)          # --ink
BONE = (245, 242, 236)      # --bone
OXIDE_LIGHT = (208, 128, 85)  # --oxide-light

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, "assets", "fonts")
OUT = os.path.join(ROOT, "assets", "img", "og-image.jpg")


def load_variable_font(woff2_name):
    """PIL cannot read woff2, so unpack the shipped font to a temporary TTF."""
    from fontTools.ttLib import TTFont

    src = os.path.join(FONT_DIR, woff2_name)
    dst = os.path.join("/tmp", woff2_name.replace(".woff2", ".ttf"))
    if not os.path.exists(dst):
        font = TTFont(src)
        font.flavor = None
        font.save(dst)
    return dst


def build(photo_path):
    photo = ImageOps.exif_transpose(Image.open(photo_path).convert("RGB"))
    base = ImageOps.fit(photo, (W, H), Image.LANCZOS, centering=(0.5, 0.42))

    # Scrim: rises from the foot and deepens toward the left, where type sits.
    mask = Image.new("L", (W, H))
    px = mask.load()
    for y in range(H):
        vert = max(0.0, (y - H * 0.22) / (H * 0.78)) ** 1.25
        for x in range(W):
            horiz = max(0.0, 1.0 - x / (W * 0.62)) ** 1.4
            px[x, y] = int(255 * min(1.0, vert * 0.90 + horiz * vert * 0.75 + horiz * 0.30))
    base = Image.composite(Image.new("RGB", (W, H), INK), base, mask)

    fraunces = load_variable_font("fraunces-var.woff2")
    archivo = load_variable_font("archivo-var.woff2")

    def serif(size, weight):
        f = ImageFont.truetype(fraunces, size)
        f.set_variation_by_axes([144, weight])  # [optical size, weight]
        return f

    def sans(size, weight):
        f = ImageFont.truetype(archivo, size)
        f.set_variation_by_axes([weight])
        return f

    draw = ImageDraw.Draw(base)
    x, baseline = 72, H - 74

    draw.text((x, baseline), "Brothers and Sons", font=serif(58, 400), fill=BONE, anchor="ls")
    draw.text((x, baseline - 66), "DeMarzi", font=serif(92, 300), fill=BONE, anchor="ls")

    label_font = sans(17, 500)
    label = "C O N C R E T I N G   &   C I V I L   W O R K S"
    label_y = baseline - 158
    draw.text((x, label_y), label, font=label_font, fill=OXIDE_LIGHT, anchor="ls")
    width = draw.textlength(label, font=label_font)
    draw.line([(x + width + 26, label_y - 6), (x + width + 116, label_y - 6)],
              fill=(150, 140, 126), width=1)

    base.save(OUT, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"wrote {OUT} ({os.path.getsize(OUT) // 1024} KB)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    build(sys.argv[1])
