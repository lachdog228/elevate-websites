/**
 * Every value here is sourced from M. McCrohan's own public listings
 * (Google Business Profile, Facebook, Yellow Pages, Localsearch, TradiesNearYou).
 * Nothing in this file is invented. If a claim cannot be verified from one of
 * those listings, it does not belong here — see PHOTOS.md and README.md.
 */

export const business = {
  name: "M. McCrohan",
  legalName: "M. McCrohan - Painting And Decorating",
  tagline: "Painting & Decorating",
  phone: "0411 353 716",
  phoneHref: "tel:+61411353716",
  phoneE164: "+61411353716",
  address: {
    street: "10 Kambalda Ct",
    suburb: "Leopold",
    state: "VIC",
    postcode: "3224",
    country: "AU",
  },
  areaServed: ["Geelong", "Leopold", "Bellarine Peninsula"],
  rating: {
    value: 5.0,
    count: 3,
    source: "Google",
  },
  hours: [
    { days: "Monday – Friday", time: "7:00am – 6:30pm" },
    { days: "Saturday", time: "8:00am – 12:30pm" },
    { days: "Sunday", time: "Closed" },
  ],
  /** Schema.org openingHours, same data as `hours` above. */
  openingHours: ["Mo-Fr 07:00-18:30", "Sa 08:00-12:30"],
} as const;

export const addressLine = `${business.address.street}, ${business.address.suburb} ${business.address.state} ${business.address.postcode}`;

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${business.legalName}, ${addressLine}`,
)}`;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "Contact", href: "/contact" },
] as const;

export const services = [
  {
    index: "01",
    title: "Interior Painting",
    description:
      "Walls, ceilings, doors and trim — prepared properly, cut in by hand and finished clean.",
    detail:
      "Most of the work happens before a finish coat goes on: filling, sanding, spot-priming, and masking everything that isn't meant to be painted. Furniture is covered and floors are protected, edges are cut in by hand rather than taped where the line matters, and the room is left tidy at the end of every day.",
    image: "/images/work-1.jpg",
    alt: "Afternoon light falling across a freshly painted interior wall",
  },
  {
    index: "02",
    title: "Exterior Painting",
    description:
      "Weatherboard, render and trim, prepared for the coastal weather the Bellarine throws at a house.",
    detail:
      "Salt air and westerly weather are hard on a house near the coast. Loose and flaking paint comes back to a sound edge, bare timber is primed, gaps are sealed, and the right product goes on the right surface — so the finish is still holding years later rather than lifting at the first wet winter.",
    image: "/images/work-3.jpg",
    alt: "Rendered house exterior painted in a clean off-white",
  },
  {
    index: "03",
    title: "Repaints & Decorating",
    description:
      "New work and repaints, plus the ongoing property maintenance that keeps a home looking cared for.",
    detail:
      "A repaint is the cheapest way to change how a house feels. We work through colour with you against the light the room actually gets, then treat the trim, doors and ceilings as carefully as the walls — because that is usually what separates a room that looks freshly painted from one that looks properly finished.",
    image: "/images/work-2.jpg",
    alt: "Hallway with white walls and carefully painted door frames",
  },
] as const;

export const gallery = [
  {
    src: "/images/work-1.jpg",
    alt: "Living space with afternoon light across a freshly painted wall",
    caption: "Interior — living space",
    /** Grid footprint. Mobile is one column; these apply from sm upward. */
    frame: "sm:col-span-6 lg:col-span-5 aspect-4/5",
  },
  {
    src: "/images/work-5.jpg",
    alt: "Freshly painted room with crisp skirting and architraves",
    caption: "Interior — repaint",
    frame: "sm:col-span-6 lg:col-span-7 aspect-4/5 sm:aspect-auto",
  },
  {
    src: "/images/work-2.jpg",
    alt: "Hallway with white walls and painted door frames",
    caption: "Interior — hallway and trim",
    frame: "sm:col-span-6 lg:col-span-4 aspect-4/5 lg:aspect-3/4",
  },
  {
    src: "/images/work-3.jpg",
    alt: "Rendered house exterior finished in a clean off-white",
    caption: "Exterior — rendered facade",
    frame: "sm:col-span-6 lg:col-span-4 aspect-4/5 lg:aspect-3/4",
  },
  {
    src: "/images/work-4.jpg",
    alt: "Window light falling across a painted interior wall",
    caption: "Detail — wall finish",
    frame: "sm:col-span-12 lg:col-span-4 aspect-4/5 sm:aspect-16/9 lg:aspect-3/4",
  },
  {
    src: "/images/work-6.jpg",
    alt: "Close detail of a hand-finished wall surface",
    caption: "Detail — surface texture",
    frame: "sm:col-span-12 aspect-16/9 sm:aspect-[3/1] lg:aspect-[4/1]",
  },
] as const;

export type GalleryItem = {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  /** Tailwind column span + aspect ratio for this frame's slot in the grid. */
  readonly frame: string;
};

/**
 * The home page shows the first three frames on their own, so they need
 * footprints that balance as a row of three rather than slots in the six-up
 * spread above.
 */
export const galleryPreview: readonly GalleryItem[] = [
  { ...gallery[0], frame: "sm:col-span-6 lg:col-span-4 aspect-4/5" },
  { ...gallery[1], frame: "sm:col-span-6 lg:col-span-4 aspect-4/5" },
  {
    ...gallery[2],
    frame: "sm:col-span-12 lg:col-span-4 aspect-4/5 sm:aspect-16/9 lg:aspect-4/5",
  },
];
