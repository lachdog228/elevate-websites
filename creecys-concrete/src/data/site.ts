/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CREECY'S CONCRETE — SITE CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything the business needs to change lives in this one file.
 *
 *  ⚠️  PLACEHOLDERS TO REPLACE BEFORE LAUNCH
 *      The values marked `TODO` below are placeholders, not real details.
 *      Replace them with the real phone number, email, service area and
 *      domain, and the rest of the site updates automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Creecy's Concrete",
  shortName: 'Creecy’s',
  /** Used for the <title> suffix and the footer. */
  tagline: 'Concreting Specialists',

  /** TODO: replace with the real production domain (no trailing slash). */
  url: 'https://creecysconcrete.com.au',

  /** TODO: replace with the real phone number. */
  phone: '0400 000 000',
  /** TODO: replace with the real email address. */
  email: 'hello@creecysconcrete.com.au',

  /** TODO: replace with the real service area. */
  serviceArea: 'Servicing the local region and surrounds',
  /** Short form used in the trust bar and structured data. */
  serviceAreaShort: 'Local & surrounding areas',

  /** TODO: replace with real opening hours if you want them shown. */
  hours: 'Mon – Fri, 7am – 5pm',

  seo: {
    title: "Creecy's Concrete | Concreting Specialists",
    description:
      'Creecy’s Concrete delivers driveways, slabs, paths and decorative concrete finished to a high standard. Quality workmanship, reliable service and free quotes.',
    ogAlt:
      'A broad, freshly finished concrete driveway sweeping toward a modern home',
  },
} as const;

/** Derived helpers — no need to edit these. */
export const telHref = `tel:${site.phone.replace(/[^\d+]/g, '')}`;
export const mailHref = `mailto:${site.email}`;

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;
