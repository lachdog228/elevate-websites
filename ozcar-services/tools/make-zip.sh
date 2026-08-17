#!/usr/bin/env bash
# Build a deploy-ready zip for Netlify's drag-and-drop uploader.
#
#   bash tools/make-zip.sh
#
# Produces ozcar-services-netlify.zip with the site files at the root of the
# archive, which is what Netlify Drop expects. Left out: the full-size source
# photographs in assets/img/src (only the built renditions are served), the
# build tooling, and the README.
#
# Netlify Forms works with drag-and-drop deploys — it scans the deployed HTML
# for data-netlify="true" — so the enquiry form starts collecting on upload.

set -euo pipefail

cd "$(dirname "$0")/.."
SITE="$PWD"
OUT="$SITE/ozcar-services-netlify.zip"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

# Pages and site-level files.
cp "$SITE"/*.html "$SITE"/robots.txt "$SITE"/sitemap.xml "$STAGE"/

# Assets, minus the source photographs.
mkdir -p "$STAGE/assets"
cp -r "$SITE/assets/css" "$SITE/assets/js" "$SITE/assets/fonts" "$STAGE/assets/"
mkdir -p "$STAGE/assets/img"
find "$SITE/assets/img" -maxdepth 1 -type f -exec cp {} "$STAGE/assets/img/" \;

# The repo's netlify.toml sets publish = "ozcar-services" for git deploys. In a
# dropped zip the archive root is already the publish directory, so ship the
# headers only.
cat > "$STAGE/netlify.toml" <<'TOML'
[[headers]]
  for = "/assets/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/img/*"
  [headers.values]
    Cache-Control = "public, max-age=2592000"

[[headers]]
  for = "/assets/css/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[[headers]]
  for = "/assets/js/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
TOML

rm -f "$OUT"
(cd "$STAGE" && zip -rq9 "$OUT" . -x '.*' '*/.*')

echo "built $OUT"
echo "$(unzip -l "$OUT" | tail -1 | awk '{print $2}') files, $(du -h "$OUT" | cut -f1)"
