import { site } from '../data/site.mjs';
import { esc } from './layout.mjs';

/** Small mono eyebrow label used above section headings. */
export const eyebrow = (text) => `<p class="eyebrow">${esc(text)}</p>`;

/**
 * Photo figure. Real job photos only — width/height are set so the browser
 * reserves space and the page does not shift while images load.
 */
export function photo({ src, alt, w, h, loading = 'lazy', className = '' }) {
  const cls = ['photo', className].filter(Boolean).join(' ');
  const priority = loading === 'eager' ? ' fetchpriority="high"' : '';
  return `<figure class="${cls}">
  <img src="/assets/img/${src}" alt="${esc(alt)}" width="${w}" height="${h}"
       loading="${loading}" decoding="async"${priority}>
</figure>`;
}

export function reviewCard(review) {
  return `<figure class="review">
  <div class="review__stars" role="img" aria-label="Five out of five">
    ${'<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 1.6l2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.9 2.6.95-5.5-4-3.9 5.5-.8z"/></svg>'.repeat(
      5
    )}
  </div>
  <blockquote>${esc(review.quote)}</blockquote>
  <figcaption>${esc(review.author)}</figcaption>
</figure>`;
}

export function suburbChips() {
  return `<ul class="chips">
  ${site.serviceArea.map((s) => `<li>${esc(s)}</li>`).join('\n  ')}
</ul>`;
}

/** Navy call-to-action band that closes every page. */
export function ctaBand({
  heading = 'Want a number on it?',
  text = `Tell ${esc(site.owner)} what you are after and he will come out, have a look and put a proper quote together. No call centre, no sales rep.`,
} = {}) {
  return `<section class="band">
  <div class="wrap band__inner">
    <div>
      <h2 class="band__title">${heading}</h2>
      <p class="band__text">${text}</p>
    </div>
    <div class="band__actions">
      <a class="btn btn--lime" href="/contact.html">Get a quote</a>
      <a class="btn btn--ghost" href="${site.phoneHref}">${esc(site.phone)}</a>
    </div>
  </div>
</section>`;
}

/** Custom EV charger illustration — stands in for the missing EV job photo. */
export const evIllustration = `<div class="ev-art" role="img" aria-label="Illustration of an EV charger and charging cable">
  <svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">
    <rect x="96" y="24" width="88" height="132" rx="14" class="ev-art__body"/>
    <rect x="112" y="44" width="56" height="42" rx="7" class="ev-art__screen"/>
    <circle cx="140" cy="112" r="13" class="ev-art__dot"/>
    <path d="M140 100v10h8" class="ev-art__bolt"/>
    <path d="M184 76c34 0 34 34 34 52s6 40 34 40" class="ev-art__cable"/>
    <rect x="248" y="152" width="30" height="40" rx="8" class="ev-art__plug"/>
    <path d="M60 196h200" class="ev-art__ground"/>
    <path d="M136 60l-10 16h12l-8 14 22-20h-13l9-10z" class="ev-art__flash"/>
  </svg>
</div>`;
