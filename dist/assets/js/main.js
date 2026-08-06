/* Sulex Electrics — small, dependency-free page behaviour. */
(function () {
  'use strict';

  /* ------------------------------------------------------------- nav --- */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close on Escape, and whenever the layout grows past the mobile breakpoint.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    var wide = window.matchMedia('(min-width: 861px)');
    var onWide = function (e) {
      if (e.matches) setOpen(false);
    };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else wide.addListener(onWide);
  }

  /* ------------------------------------------------------------ year --- */

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------- enquiry form --- */

  /*
   * Submission strategy
   * -------------------
   * With no `data-endpoint` set on the form, submitting opens the visitor's
   * own email client via a mailto: link. That works everywhere but relies on
   * the visitor having a mail client configured, and nothing is recorded if
   * they abandon it.
   *
   * To have enquiries arrive by email properly, create a form at a service
   * such as Formspree (https://formspree.io) and paste the endpoint URL into
   * the form's data-endpoint attribute in contact.html. The code below then
   * POSTs the fields as JSON instead — no other change required.
   */

  var form = document.getElementById('enquiryForm');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var EMAIL = form.getAttribute('data-email') || 'Info@sulex.com.au';
  var PHONE = form.getAttribute('data-phone') || '0400 594 109';
  var LABELS = {
    name: 'Your name',
    phone: 'Phone',
    email: 'Email',
    suburb: 'Suburb',
    enquiry: 'Enquiry',
    message: 'Message',
  };

  var setStatus = function (text, state) {
    if (!status) return;
    status.textContent = text;
    if (state) status.setAttribute('data-state', state);
    else status.removeAttribute('data-state');
  };

  var showError = function (field, message) {
    var slot = form.querySelector('[data-error-for="' + field.name + '"]');
    if (slot) slot.textContent = message || '';
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };

  var validate = function () {
    var problems = [];
    var required = form.querySelectorAll('[required]');

    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      var value = field.value.trim();
      var message = '';

      if (!value) {
        message = (LABELS[field.name] || 'This field') + ' is required.';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        message = 'That email address does not look quite right.';
      } else if (field.type === 'tel' && value.replace(/\D/g, '').length < 8) {
        message = 'Please enter a contact number we can reach you on.';
      }

      showError(field, message);
      if (message) problems.push(field);
    }

    return problems;
  };

  // Clear a field's error as soon as the visitor starts fixing it.
  form.addEventListener('input', function (e) {
    if (e.target && e.target.hasAttribute('required')) showError(e.target, '');
  });

  var values = function () {
    var data = {};
    ['name', 'phone', 'email', 'suburb', 'enquiry', 'message'].forEach(function (key) {
      var field = form.elements[key];
      if (field) data[key] = field.value.trim();
    });
    return data;
  };

  var mailtoFallback = function (data) {
    var lines = Object.keys(data).map(function (key) {
      return (LABELS[key] || key) + ': ' + (data[key] || '—');
    });
    var subject = 'Website enquiry — ' + (data.enquiry || 'General') +
      (data.suburb ? ' (' + data.suburb + ')' : '');
    window.location.href =
      'mailto:' + EMAIL + '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(lines.join('\n'));
    setStatus('Opening your email app with the details filled in — just hit send.');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot: only a bot fills this in.
    if (form.elements.company && form.elements.company.value) return;

    var problems = validate();
    if (problems.length) {
      setStatus('Have a look at the highlighted fields.', 'error');
      problems[0].focus();
      return;
    }

    var data = values();
    var endpoint = (form.getAttribute('data-endpoint') || '').trim();

    if (!endpoint) {
      mailtoFallback(data);
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }
    setStatus('Sending…');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Bad response');
        form.reset();
        setStatus('Thanks — that has come through. We will be in touch shortly.');
      })
      .catch(function () {
        setStatus(
          'That did not send. Give us a call on ' + PHONE + ' and we will sort it out.',
          'error'
        );
      })
      .finally(function () {
        if (button) {
          button.disabled = false;
          button.textContent = 'Send enquiry';
        }
      });
  });
})();
