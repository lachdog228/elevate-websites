/* ═══════════════════════════════════════════════════════════════════
   Daily Soup Go. — behaviour

   No dependencies, no build step. Everything degrades: with JavaScript
   off the page is still complete, navigable and readable.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Trading hours ────────────────────────────────────────────────
     EDIT HERE if the shop's hours change. Keys are JS weekday numbers
     (0 = Sunday). `open`/`close` are minutes past midnight, local time.
     A day left out of this object is treated as closed.
  */
  var HOURS = {
    1: { open: 11 * 60, close: 15 * 60 },  // Monday
    2: { open: 11 * 60, close: 15 * 60 },  // Tuesday
    3: { open: 11 * 60, close: 15 * 60 },  // Wednesday
    4: { open: 11 * 60, close: 15 * 60 },  // Thursday
    5: { open: 11 * 60, close: 15 * 60 }   // Friday
  };

  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  /* ── Mobile navigation ──────────────────────────────────────────── */

  (function nav() {
    var toggle = $('.nav-toggle');
    var menu = $('#site-nav');
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Following a link, clicking away or pressing Escape all close it.
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', function (event) {
      if (!menu.classList.contains('is-open')) return;
      if (menu.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !menu.classList.contains('is-open')) return;
      setOpen(false);
      toggle.focus();
    });

    // Reset when the layout goes back to the desktop nav.
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  }());

  /* ── Header shadow once the page has scrolled ───────────────────── */

  (function stickyHeader() {
    var header = $('.site-header');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }());

  /* ── Highlight the section currently in view ────────────────────── */

  (function scrollSpy() {
    var links = $$('.site-nav ul a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];

    links.forEach(function (link) {
      var section = document.getElementById(link.hash.slice(1));
      if (!section) return;
      byId[section.id] = link;
      sections.push(section);
    });

    var visible = {};

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });

      var current = null;
      sections.forEach(function (section) {
        if (visible[section.id] && !current) current = section.id;
      });

      links.forEach(function (link) { link.removeAttribute('aria-current'); });
      if (current && byId[current]) byId[current].setAttribute('aria-current', 'true');
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }());

  /* ── Reveal on scroll ───────────────────────────────────────────── */

  (function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (item) { observer.observe(item); });
  }());

  /* ── Open / closed status ───────────────────────────────────────── */

  function minutesToLabel(minutes) {
    var hour = Math.floor(minutes / 60);
    var minute = minutes % 60;
    var suffix = hour >= 12 ? 'pm' : 'am';
    var display = hour % 12 === 0 ? 12 : hour % 12;
    return display + (minute ? ':' + String(minute).padStart(2, '0') : '') + suffix;
  }

  function nextOpening(from) {
    for (var offset = 0; offset <= 7; offset++) {
      var day = (from.getDay() + offset) % 7;
      var slot = HOURS[day];
      if (!slot) continue;
      var nowMinutes = from.getHours() * 60 + from.getMinutes();
      if (offset === 0 && nowMinutes >= slot.open) continue;
      return {
        day: day,
        offset: offset,
        label: minutesToLabel(slot.open)
      };
    }
    return null;
  }

  function statusNow() {
    var now = new Date();
    var slot = HOURS[now.getDay()];
    var minutes = now.getHours() * 60 + now.getMinutes();

    if (slot && minutes >= slot.open && minutes < slot.close) {
      return { open: true, text: 'Open until ' + minutesToLabel(slot.close) };
    }

    var next = nextOpening(now);
    if (!next) return { open: false, text: 'Closed' };
    if (next.offset === 0) return { open: false, text: 'Opens at ' + next.label };
    if (next.offset === 1) return { open: false, text: 'Opens tomorrow, ' + next.label };
    return { open: false, text: 'Opens ' + DAY_NAMES[next.day] + ', ' + next.label };
  }

  (function openStatus() {
    var pills = $$('[data-open-status]');
    var neon = $('[data-neon]');
    var todayRow = $('.hours tr[data-day="' + new Date().getDay() + '"]');

    if (todayRow) todayRow.classList.add('is-today');

    function paint() {
      var state = statusNow();

      pills.forEach(function (pill) {
        var label = $('[data-open-status-text]', pill);
        if (label) label.textContent = state.text;
        pill.classList.toggle('is-open', state.open);
        pill.hidden = false;
      });

      if (neon) {
        neon.setAttribute('data-state', state.open ? 'open' : 'closed');
        neon.textContent = state.open ? 'OPEN' : 'CLOSED';
      }
    }

    paint();
    // Cheap enough to keep honest across a long-lived tab.
    setInterval(paint, 60 * 1000);
  }());

  /* ── Footer year ────────────────────────────────────────────────── */

  (function year() {
    var slot = $('[data-year]');
    if (slot) slot.textContent = String(new Date().getFullYear());
  }());

  /* ── Placeholder links ──────────────────────────────────────────────
     Phone, email, map and social links are real elements pointing at
     `#` until the client's details are filled in. Swallow the click so
     the draft never jumps to the top of the page unexpectedly.
     Delete this block once the hrefs are real.
  */
  (function placeholderLinks() {
    var selector = '[data-tel], [data-email], [data-map-link], [data-social]';
    $$(selector).forEach(function (link) {
      if (link.getAttribute('href') && link.getAttribute('href') !== '#') return;
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', function (event) { event.preventDefault(); });
    });
  }());

}());
