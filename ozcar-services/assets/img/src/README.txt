OZCAR Services — source photographs
===================================

Drop the business's own photos in HERE, keeping these exact filenames, then run
from the ozcar-services folder:

    python3 tools/build-images.py

That regenerates every cropped, resized, optimised rendition the pages use,
plus the social card. Nothing else needs editing.

  hero.jpg           The tan Hilux strapped on the OZCAR trailer at dusk under
                     the streetlight. Strongest shot available: it is OZCAR's
                     own trailer with the phone number on the back.
                     -> Home hero, trailer hire hero, social preview card

  trailer-hire.jpg   The empty tandem flat-top trailer with the checker-plate
                     toolbox, parked on the roadside.
                     -> Trailer hire service card and the trailer card

  transport.jpg      The red tractor strapped down on the trailer in front of
                     the billboard.
                     -> Vehicle transport card and page hero

  towing.jpg         STILL NEEDED. A towing job — ideally a vehicle being
                     loaded or on the trailer.
                     -> Towing service card and page hero

  coast.jpg          Optional scenery. Any local coast or highway shot.
                     -> Service-area band, contact page hero

Use the largest version you have; the script does the downscaling.

Everything currently in this folder is free-licence stock standing in until the
real photos land. Two notes on those stand-ins:

  - hero.jpg is already cropped to cut another business's name and phone number
    off the trailer's side panel. Do not re-crop it lower.
  - trailer-hire.jpg is a rally car carrying sponsor livery.

After swapping photos, the script prints an average colour per image. That is
the --tone value on the matching <div class="media"> in the HTML — the shade
shown while the photo loads. Update those to match.

If a crop comes out badly framed, adjust the `anchor` for that recipe in
tools/build-images.py: 0.0 keeps the top, 0.5 the middle, 1.0 the bottom.

--- UPDATE ---------------------------------------------------------------

machinery.jpg is now a REAL OZCAR photo (the tractor on the trailer) and is
live on the site. It is only 387x280 though — a thumbnail, not the original —
so its recipe is capped at 720px wide and it is kept out of every hero banner.
Replacing it with the full-size version off the phone is worth doing: same
filename, re-run build-images.py, then change its recipe from SMALL_CARD to
CARD in tools/build-images.py.

Still wanted at full resolution: the Hilux at dusk (hero.jpg), the empty
trailer with the toolbox (trailer-hire.jpg), and a towing shot (towing.jpg).
