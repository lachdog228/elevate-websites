#!/bin/sh
# Builds airmech-repairs-site.zip — the deploy package for Netlify.
# Only what the site actually serves; README, the OG source SVG and git are left out.
# index.html sits at the zip root, which is what Netlify Drop expects.
set -e
cd "$(dirname "$0")"
OUT=airmech-repairs-site.zip
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/assets/fonts" "$STAGE/assets/img"
cp index.html netlify.toml robots.txt sitemap.xml _headers "$STAGE/"
cp assets/fonts/*.woff2 "$STAGE/assets/fonts/"
cp assets/img/favicon.svg assets/img/og.jpg "$STAGE/assets/img/"

rm -f "$OUT"
(cd "$STAGE" && zip -r -X -9 - . -x '.*') > "$OUT"
echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
