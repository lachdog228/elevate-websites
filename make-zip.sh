#!/bin/sh
# Builds airmech-repairs-site.zip — the deploy package for Netlify.
# Runs build.py first so the zip can never contain stale HTML.
# index.html sits at the zip root, which is what Netlify Drop expects.
set -e
cd "$(dirname "$0")"

python3 build.py

OUT=airmech-repairs-site.zip
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/assets/fonts" "$STAGE/assets/img" "$STAGE/assets/css" "$STAGE/assets/js"
cp index.html netlify.toml robots.txt sitemap.xml _headers "$STAGE/"
for d in services about service-area contact; do
  mkdir -p "$STAGE/$d"
  cp "$d/index.html" "$STAGE/$d/"
done
cp assets/fonts/*.woff2 "$STAGE/assets/fonts/"
cp assets/css/site.css "$STAGE/assets/css/"
cp assets/js/site.js "$STAGE/assets/js/"
cp assets/img/favicon.svg assets/img/og.jpg "$STAGE/assets/img/"

rm -f "$OUT"
(cd "$STAGE" && zip -r -X -9 - . -x '.*') > "$OUT"
echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
