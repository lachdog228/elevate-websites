import { site, nav } from '../data/site.mjs';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Schibsted+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Brand mark.
 *
 * NOTE: the original handoff described the real vector logo (extracted from
 * Alex's .ai file) as inline SVG path data. That file was not present in this
 * repository, so the icon below is a clean redraw of the same idea — a circular
 * power symbol in lime beside the "sulex / ELECTRICS" wordmark. If the original
 * path data turns up, replace the <path> elements here only; nothing else needs
 * to change.
 */
export function logo({ tone = 'light', href = '/' } = {}) {
  const label = tone === 'dark' ? 'logo logo--dark' : 'logo';
  return `<a class="${label}" href="${href}" aria-label="${esc(site.name)} — home">
  <svg class="logo__mark" viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" focusable="false">
    <path d="M14.25 11.08A17 17 0 1 0 33.75 11.08" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M24 5.5V25" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/>
  </svg>
  <span class="logo__type">
    <span class="logo__word">sulex</span>
    <span class="logo__sub">Electrics</span>
  </span>
</a>`;
}

export function head({ title, description, slug, ogImage = 'assets/img/hero.jpg' }) {
  const path = slug === 'index' ? '/' : `/${slug}.html`;
  const canonical = `${site.origin}${path}`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_AU">
<meta property="og:image" content="${site.origin}/${ogImage}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${site.origin}/${ogImage}">

<meta name="theme-color" content="#182B55">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONT_HREF}" onload="this.rel='stylesheet'">
<link rel="stylesheet" href="${FONT_HREF}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONT_HREF}"></noscript>

<link rel="stylesheet" href="/assets/css/styles.css">`;
}

export function header({ slug }) {
  const links = nav
    .map((item) => {
      const current = item.slug === slug;
      return `<li><a href="${item.href}"${current ? ' aria-current="page"' : ''}>${esc(
        item.label
      )}</a></li>`;
    })
    .join('\n        ');

  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap site-header__inner">
    ${logo({ tone: 'dark' })}
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="nav-toggle__label">Menu</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul>
        ${links}
      </ul>
      <a class="btn btn--lime btn--sm site-nav__cta" href="${site.phoneHref}">Call ${esc(
        site.phone
      )}</a>
    </nav>
  </div>
</header>`;
}

export function footer() {
  const areas = site.serviceArea.map(esc).join(' · ');
  return `<footer class="site-footer">
  <div class="wrap site-footer__inner">
    <div class="site-footer__brand">
      ${logo({ tone: 'dark' })}
      <p class="site-footer__line">${esc(site.taglineAlt)}</p>
    </div>

    <div class="site-footer__col">
      <h2 class="site-footer__heading">Get in touch</h2>
      <ul class="plain">
        <li><a href="${site.phoneHref}">${esc(site.phone)}</a></li>
        <li><a href="${site.emailHref}">${esc(site.email)}</a></li>
        <li><a href="${site.instagramUrl}" rel="noopener">${esc(site.instagram)}</a></li>
      </ul>
    </div>

    <div class="site-footer__col">
      <h2 class="site-footer__heading">Hours</h2>
      <p>${esc(site.hours)}</p>
      <h2 class="site-footer__heading">Where we work</h2>
      <p>${areas}</p>
    </div>
  </div>

  <div class="wrap site-footer__base">
    <p>&copy; <span data-year>${new Date().getFullYear()}</span> ${esc(
      site.name
    )}. Registered Electrical Contractor ${esc(site.licence)}.</p>
    <p class="site-footer__since">Sparking away since ${esc(site.foundingDate)}.</p>
  </div>
</footer>`;
}

/**
 * LocalBusiness / Electrician structured data.
 * No street address is published — this is a mobile trade business, not a
 * shopfront. Leave it that way unless Alex asks for an address.
 */
export function jsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Electrician'],
    '@id': `${site.origin}/#business`,
    name: site.name,
    url: `${site.origin}/`,
    telephone: site.phoneIntl,
    email: site.email,
    description:
      'Solar panel, solar battery and EV charger installation plus general electrical work across Geelong, the Surf Coast and Colac.',
    foundingDate: site.foundingDate,
    priceRange: '$$',
    image: `${site.origin}/assets/img/hero.jpg`,
    logo: `${site.origin}/apple-touch-icon.png`,
    sameAs: [site.instagramUrl],
    areaServed: site.serviceArea.map((name) => ({
      '@type': 'City',
      name,
      addressRegion: 'VIC',
      addressCountry: 'AU',
    })),
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'VIC',
      addressCountry: 'AU',
    },
    // Deliberately no aggregateRating. It requires a reviewCount/ratingCount to
    // be valid, and publishing a count is off the table (counts change, and the
    // brief says the bare "5.0" is what's safe). Self-serving review markup also
    // breaches Google's review-snippet guidelines. The 5.0 still appears on the
    // page for people — it just isn't claimed as structured data.
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.hoursSchema.days,
        opens: site.hoursSchema.opens,
        closes: site.hoursSchema.closes,
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: [
        'Solar panel installation',
        'Solar battery installation',
        'EV charger installation',
        'General electrical work',
      ].map((n) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: n },
      })),
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function page({ title, description, slug, body, extraHead = '' }) {
  return `<!doctype html>
<html lang="en-AU">
<head>
${head({ title, description, slug })}
${extraHead}
${jsonLd()}
</head>
<body>
${header({ slug })}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

export { esc };
