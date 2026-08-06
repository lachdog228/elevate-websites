import { site, services, everydayWork } from '../data/site.mjs';
import { esc } from '../templates/layout.mjs';
import { eyebrow, photo, ctaBand, evIllustration } from '../templates/components.mjs';

const tile = (s, i) => {
  const media = s.photo
    ? photo({ src: s.photo, alt: s.photoAlt, w: 1200, h: 900, className: 'tile__photo' })
    : `<div class="tile__photo tile__photo--art">${evIllustration}</div>`;

  return `<article class="tile${i % 2 ? ' tile--flip' : ''}" id="${s.id}">
      ${media}
      <div class="tile__body">
        <p class="tile__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
        <h2 class="tile__title">${esc(s.name)}</h2>
        <p class="tile__lead">${esc(s.lead)}</p>
        <ul class="ticks">
          ${s.points.map((p) => `<li>${esc(p)}</li>`).join('\n          ')}
        </ul>
        <a class="btn btn--lime btn--sm" href="/contact.html">${esc(s.cta)}</a>
      </div>
    </article>`;
};

const steps = [
  {
    title: 'Have a chat',
    text: 'Ring or send through the form. Tell us what you are after and what the place is like.',
  },
  {
    title: 'Site visit',
    text: `${site.owner} comes out, gets on the roof or opens the board, and works out what actually suits.`,
  },
  {
    title: 'A proper quote',
    text: 'A written price for the job in front of you. No pressure, no sales pitch, no follow-up pestering.',
  },
  {
    title: 'Install day',
    text: 'Same bloke who quoted it does the work, cleans up after himself and shows you how it runs.',
  },
];

export default {
  slug: 'services',
  title: 'What We Do: Solar, Batteries, EV & Electrical | Sulex Electrics',
  description:
    'Solar panel installs, solar batteries and EV charger installation, plus switchboards, power points and heat pumps. Geelong, the Surf Coast and Colac.',
  body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('What we do')}
    <h1 class="page-head__title">Panels, batteries, chargers.<br>And the everyday stuff.</h1>
    <p class="page-head__text">
      Residential and commercial, from Geelong through the Surf Coast and out to Colac.
      One qualified electrician, quoting and installing every job himself.
    </p>
  </div>
</section>

<section class="section" aria-label="Solar, battery and EV charging">
  <div class="wrap tiles">
    ${services.map(tile).join('\n    ')}
  </div>
</section>

<section class="everyday" id="everyday" aria-labelledby="everyday-heading">
  <div class="wrap">
    <div class="everyday__head">
      ${eyebrow('Also on the books')}
      <h2 class="everyday__title" id="everyday-heading">Everyday electrical work.</h2>
      <p class="everyday__lede">
        Solar is the day job, but the toolbox does not only come out for roofs.
      </p>
    </div>
    <ul class="everyday__list">
      ${everydayWork
        .map(
          (w) => `<li>
        <h3>${esc(w.name)}</h3>
        <p>${esc(w.text)}</p>
      </li>`
        )
        .join('\n      ')}
    </ul>
  </div>
</section>

<section class="section section--paper" aria-labelledby="how-heading">
  <div class="wrap">
    <div class="section__head">
      ${eyebrow('How it goes')}
      <h2 class="stamp" id="how-heading">Four steps, no mystery.</h2>
    </div>
    <ol class="steps">
      ${steps
        .map(
          (s, i) => `<li class="step">
        <span class="step__num" aria-hidden="true">${i + 1}</span>
        <h3 class="step__title">${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
        <p class="step__refrain" aria-hidden="true">Easy.</p>
      </li>`
        )
        .join('\n      ')}
    </ol>
  </div>
</section>

${ctaBand({
  heading: 'Know what you want? Or no idea at all?',
  text: 'Both are fine. Ring for a chat or send the details through and we will work it out from there.',
})}
`,
};
