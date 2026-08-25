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
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "Contact", href: "#contact" },
] as const;

export const services = [
  {
    index: "01",
    title: "Interior Painting",
    description:
      "Walls, ceilings, doors and trim — prepared properly, cut in by hand and finished clean. Furniture covered, surfaces protected, the room left tidy at the end of each day.",
    image: "/images/work-1.jpg",
    alt: "Afternoon light falling across a freshly painted interior wall",
  },
  {
    index: "02",
    title: "Exterior Painting",
    description:
      "Weatherboard, render and trim, prepared for the coastal weather the Bellarine throws at a house. Sound preparation first, then coats that are built to last.",
    image: "/images/work-3.jpg",
    alt: "Rendered house exterior painted in a clean off-white",
  },
  {
    index: "03",
    title: "Repaints & Decorating",
    description:
      "New work and repaints, plus the ongoing property maintenance that keeps a home looking cared for. A considered colour, applied carefully, changes a whole room.",
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
