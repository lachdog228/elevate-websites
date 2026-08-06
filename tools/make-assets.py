#!/usr/bin/env python3
"""
Generates the raster favicons and the temporary photo placeholders.

The real job photos were not present in this repository. Rather than leave
broken <img> tags, each photo slot gets a clearly-labelled brand-coloured
placeholder at the exact filename the site expects. Drop the real JPEG in over
the top — same filename, no code change needed.

Run:  python3 tools/make-assets.py     (requires pillow)
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "src" / "static" / "assets" / "img"
STATIC = ROOT / "src" / "static"

NAVY = (24, 43, 85)
LIME = (126, 191, 65)
GOLD = (239, 162, 58)
BONE = (234, 239, 235)
MIST = (154, 166, 161)

SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


# --------------------------------------------------------------- favicons ---

def draw_mark(size, bg=NAVY, fg=LIME, radius_ratio=0.21, pad_ratio=0.22):
    """Circular power symbol on a rounded navy tile, drawn 4x then downsampled."""
    s = size * 4
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * radius_ratio), fill=bg)

    pad = int(s * pad_ratio)
    stroke = max(2, int(s * 0.10))
    box = [pad, pad + int(s * 0.05), s - pad, s - pad + int(s * 0.05)]

    # Arc with a gap at the top (angles run clockwise from 3 o'clock).
    d.arc(box, start=-55, end=235, fill=fg, width=stroke)

    cx = s // 2
    top = pad - int(s * 0.06)
    bottom = (box[1] + box[3]) // 2
    d.line([(cx, top), (cx, bottom)], fill=fg, width=stroke)

    return img.resize((size, size), Image.LANCZOS)


def build_favicons():
    draw_mark(32).save(STATIC / "favicon-32x32.png")
    draw_mark(180).save(STATIC / "apple-touch-icon.png")
    print("favicon-32x32.png, apple-touch-icon.png")


# ----------------------------------------------------------- placeholders ---

PHOTOS = [
    ("hero.jpg", 1600, 900, "Rooftop solar install", "Colac / Birregurra — 16:9 crop"),
    ("job-solar.jpg", 1200, 900, "Rooftop solar array", "Rural property near Geelong"),
    ("job-battery.jpg", 1200, 900, "Outdoor home battery", "Torquay job"),
    ("job-recent-surfcoast.jpg", 1200, 900, "Alex on a roof, mid-install", "Near the Surf Coast"),
    ("job-recent-armstrong.jpg", 1200, 900, "Battery + switchboard, indoors", "Armstrong Creek"),
    ("alex.jpg", 900, 1100, "Alex beside the company van", "Owner portrait — 4:5 crop"),
]


def build_placeholder(name, w, h, title, note):
    img = Image.new("RGB", (w, h), NAVY)
    d = ImageDraw.Draw(img)

    # Quiet diagonal hatch so it never reads as a real photo.
    step = max(28, w // 34)
    for x in range(-h, w, step):
        d.line([(x, h), (x + h, 0)], fill=(30, 51, 97), width=2)

    scale = min(w, h)
    f_label = font(MONO, int(scale * 0.032))
    f_title = font(SANS_BOLD, int(scale * 0.062))
    f_note = font(MONO, int(scale * 0.030))
    f_file = font(MONO, int(scale * 0.030))

    pad = int(scale * 0.09)
    y = pad

    d.text((pad, y), "PLACEHOLDER — REPLACE", font=f_label, fill=GOLD)
    y += int(scale * 0.075)
    d.text((pad, y), title, font=f_title, fill=BONE)
    y += int(scale * 0.095)
    d.text((pad, y), note, font=f_note, fill=MIST)

    d.text((pad, h - pad), name, font=f_file, fill=LIME, anchor="ls")

    # Lime rule along the bottom edge.
    bar = max(4, int(h * 0.012))
    d.rectangle([0, h - bar, w, h], fill=LIME)

    img.save(IMG_DIR / name, "JPEG", quality=80, optimize=True, progressive=True)


def build_placeholders():
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    for name, w, h, title, note in PHOTOS:
        build_placeholder(name, w, h, title, note)
        print(name)


if __name__ == "__main__":
    build_favicons()
    build_placeholders()
