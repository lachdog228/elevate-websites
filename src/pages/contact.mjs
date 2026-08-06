import { site } from '../data/site.mjs';
import { esc } from '../templates/layout.mjs';
import { eyebrow, suburbChips } from '../templates/components.mjs';

const enquiryOptions = [
  'Solar panels',
  'Solar batteries',
  'EV charging',
  'General electrical work',
  'Not sure yet',
];

export default {
  slug: 'contact',
  title: 'Contact Sulex Electrics | Solar & Electrical, Geelong to Colac',
  description:
    'Get a quote from Sulex Electrics. Call 0400 594 109 or send an enquiry. Solar, batteries, EV charging and electrical across Geelong and the Surf Coast.',
  body: `
<section class="page-head">
  <div class="wrap">
    ${eyebrow('Contact')}
    <h1 class="page-head__title">Let’s have a chat.</h1>
    <p class="page-head__text">
      Ring ${esc(site.owner)} on <a href="${site.phoneHref}">${esc(site.phone)}</a>, or fill in the
      form and he will get back to you.
    </p>
  </div>
</section>

<section class="section contact" aria-label="Contact details and enquiry form">
  <div class="wrap contact__inner">

    <div class="contact__aside">
      <h2 class="contact__heading">Straight to the source</h2>
      <ul class="contact__list">
        <li>
          <span class="contact__label">Phone</span>
          <a class="contact__value" href="${site.phoneHref}">${esc(site.phone)}</a>
        </li>
        <li>
          <span class="contact__label">Email</span>
          <a class="contact__value" href="${site.emailHref}">${esc(site.email)}</a>
        </li>
        <li>
          <span class="contact__label">Hours</span>
          <span class="contact__value contact__value--plain">${esc(site.hours)}</span>
        </li>
        <li>
          <span class="contact__label">Instagram</span>
          <a class="contact__value" href="${site.instagramUrl}" rel="noopener">${esc(
            site.instagram
          )}</a>
        </li>
      </ul>

      <div class="contact__area">
        <h3 class="contact__heading contact__heading--sm">Where we work</h3>
        <p>Residential and commercial, right across:</p>
        ${suburbChips()}
        <p class="contact__note">
          Somewhere just outside that list? Ring and ask — we are often nearby anyway.
        </p>
      </div>
    </div>

    <div class="contact__form-wrap">
      <h2 class="contact__heading">Send an enquiry</h2>
      <p class="contact__intro">
        The more you can tell us about the place, the better the first answer will be.
      </p>

      <!--
        Submission handling lives in assets/js/main.js.
        With no endpoint configured the form opens the visitor's email client
        (mailto:). To have submissions arrive by email properly, create a form
        at a service like Formspree and put the endpoint URL in the form's
        data-endpoint attribute below — no other change is needed.
      -->
      <form class="form" id="enquiryForm" data-endpoint=""
            data-email="${esc(site.email)}" data-phone="${esc(site.phone)}" novalidate
            action="${site.emailHref}" method="post" enctype="text/plain">

        <div class="form__row">
          <div class="field">
            <label for="name">Your name <span class="req" aria-hidden="true">*</span></label>
            <input id="name" name="name" type="text" autocomplete="name" required
                   aria-describedby="name-error">
            <p class="field__error" id="name-error" data-error-for="name"></p>
          </div>
          <div class="field">
            <label for="phone">Phone <span class="req" aria-hidden="true">*</span></label>
            <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required
                   aria-describedby="phone-error">
            <p class="field__error" id="phone-error" data-error-for="phone"></p>
          </div>
        </div>

        <div class="form__row">
          <div class="field">
            <label for="email">Email <span class="req" aria-hidden="true">*</span></label>
            <input id="email" name="email" type="email" autocomplete="email" required
                   aria-describedby="email-error">
            <p class="field__error" id="email-error" data-error-for="email"></p>
          </div>
          <div class="field">
            <label for="suburb">Suburb</label>
            <input id="suburb" name="suburb" type="text" autocomplete="address-level2">
          </div>
        </div>

        <div class="field">
          <label for="enquiry">What is it about?</label>
          <select id="enquiry" name="enquiry">
            ${enquiryOptions
              .map((o) => `<option value="${esc(o)}">${esc(o)}</option>`)
              .join('\n            ')}
          </select>
        </div>

        <div class="field">
          <label for="message">Tell us a bit more <span class="req" aria-hidden="true">*</span></label>
          <textarea id="message" name="message" rows="6" required
                    aria-describedby="message-error"
                    placeholder="Single or double storey? Tile or tin roof? Any solar already there? Whatever you know."></textarea>
          <p class="field__error" id="message-error" data-error-for="message"></p>
        </div>

        <!-- Spam trap: hidden from people, tempting to bots. -->
        <div class="hp" aria-hidden="true">
          <label for="company">Company</label>
          <input id="company" name="company" type="text" tabindex="-1" autocomplete="off">
        </div>

        <button class="btn btn--lime" type="submit">Send enquiry</button>

        <p class="form__status" id="formStatus" role="status" aria-live="polite"></p>
        <p class="form__fineprint">
          Prefer the phone? <a href="${site.phoneHref}">${esc(site.phone)}</a>,
          ${esc(site.hoursShort)}.
        </p>
      </form>
    </div>

  </div>
</section>
`,
};
