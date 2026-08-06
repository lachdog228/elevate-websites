import { site, services } from '../data/site.mjs';
import { esc } from '../templates/layout.mjs';
import {
  eyebrow,
  photo,
  reviewCard,
  suburbChips,
  ctaBand,
} from '../templates/components.mjs';

const serviceCard = (s, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `<article class="svc-card" id="${s.id}">
      <span class="svc-card__num" aria-hidden="true">${n}</span>
      <h3 class="svc-card__title">${esc(s.name)}</h3>
      <p>${esc(s.lead)}</p>
      <a class="link-arrow" href="/services.html#${s.id}">
        More on ${esc(s.short)}<span aria-hidden="true">→</span>
      </a>
    </article>`;
};

export default {
  slug: 'index',
  title: 'Solar, Battery & EV Charger Installs Geelong | Sulex Electrics',
  description:
    'Family-run solar, battery and EV charger installs plus electrical work across Geelong, the Surf Coast and Colac. Trading since 2013. Rated 5.0 on Google.',
  body: `
<section class="hero">
  <div class="hero__media">
    <img src="/assets/img/hero.jpg"
         alt="Completed rooftop solar panel installation on a home near Colac"
         width="1600" height="900" fetchpriority="high" decoding="async">
  </div>
  <div class="wrap hero__inner">
    <p class="eyebrow eyebrow--on-dark">Solar · Batteries · EV charging · Electrical</p>
    <h1 class="hero__title">Real people.<br>Real solar.<br>Real results.</h1>
    <p class="hero__text">
      Sulex Electrics is ${esc(site.owner)} — a qualified sparky who has been on the tools
      since ${esc(site.foundingDate)}. He quotes the job, he does the job.
      Solar, batteries and EV charging across Geelong, the Surf Coast and out to Colac.
    </p>
    <div class="hero__actions">
      <a class="btn btn--lime" href="/contact.html">Get a quote</a>
      <a class="btn btn--outline-light" href="${site.phoneHref}">Call ${esc(site.phone)}</a>
    </div>
  </div>
</section>

<section class="cred" aria-label="Why people call us">
  <div class="wrap cred__inner">
    <div class="cred__item">
      <span class="cred__big">${esc(site.rating)}<svg class="cred__star" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 1.6l2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.9 2.6.95-5.5-4-3.9 5.5-.8z"/></svg></span>
      <span class="cred__label">Rated on Google</span>
    </div>
    <div class="cred__item">
      <span class="cred__big">${esc(site.foundingDate)}</span>
      <span class="cred__label">Trading since</span>
    </div>
    <div class="cred__item">
      <span class="cred__big">Accredited</span>
      <span class="cred__label">Qualified electrician</span>
    </div>
    <div class="cred__item">
      <span class="cred__big">Geelong<span class="cred__to"> → </span>Colac</span>
      <span class="cred__label">Where we work</span>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="what-we-do">
  <div class="wrap">
    <div class="section__head">
      ${eyebrow('What we do')}
      <h2 class="stamp" id="what-we-do">Make it. Store it. Drive on it.</h2>
      <p class="section__lede">
        Three things we do most days, and a fair bit of everyday electrical work in between.
      </p>
    </div>

    <div class="svc-grid">
      ${services.map(serviceCard).join('\n      ')}
    </div>

    <p class="section__foot">
      Switchboards, power points, heat pumps and solar hot water too —
      <a href="/services.html#everyday">the everyday stuff</a>.
    </p>
  </div>
</section>

<section class="owner" aria-labelledby="owner-heading">
  <div class="wrap owner__inner">
    ${photo({
      src: 'alex.jpg',
      alt: `${site.owner}, owner of Sulex Electrics, standing beside the company van`,
      w: 900,
      h: 1100,
      className: 'owner__photo',
    })}
    <div class="owner__body">
      ${eyebrow('Who we are')}
      <h2 class="stamp" id="owner-heading">One bloke, start to finish.</h2>
      <p>
        No subbies you have never met, no sales team, no handover to someone else on install day.
        ${esc(site.owner)} turns up, works out what suits your place, gives you a straight price and
        then does the work himself.
      </p>
      <p>
        He has been a qualified electrician since ${esc(site.foundingDate)}, and the business runs on
        people ringing back and telling their neighbours. That only works if the job is done properly.
      </p>
      <p class="owner__quip">${esc(site.taglineAlt)}</p>
      <a class="btn btn--navy" href="/contact.html">Talk to ${esc(site.owner)}</a>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="reviews-heading">
  <div class="wrap">
    <div class="section__head section__head--center">
      ${eyebrow('What people say')}
      <h2 class="stamp" id="reviews-heading">Straight from the customers.</h2>
    </div>
    <div class="reviews">
      ${site.reviews.map(reviewCard).join('\n      ')}
    </div>
  </div>
</section>

<section class="area" aria-labelledby="area-heading">
  <div class="wrap">
    <div class="section__head">
      ${eyebrow('Where we work')}
      <h2 class="stamp" id="area-heading">Geelong. The Surf Coast. Out to Colac.</h2>
      <p class="section__lede">
        Homes and businesses right across the region. If you are somewhere in between, ring and ask —
        odds are we are already out that way.
      </p>
    </div>

    ${suburbChips()}

    <div class="area__photos">
      ${photo({
        src: 'job-recent-surfcoast.jpg',
        alt: `${site.owner} on a roof mid-install on a job near the Surf Coast`,
        w: 1200,
        h: 900,
      })}
      ${photo({
        src: 'job-recent-armstrong.jpg',
        alt: 'Indoor home battery and switchboard installation at Armstrong Creek',
        w: 1200,
        h: 900,
      })}
    </div>
  </div>
</section>

${ctaBand()}
`,
};
