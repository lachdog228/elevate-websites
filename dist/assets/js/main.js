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

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  // Safari < 14 only has the deprecated addListener.
  function onMediaChange(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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

    onMediaChange(window.matchMedia('(min-width: 861px)'), function (event) {
      if (event.matches) setOpen(false);
    });
  }());

  /* ── Header rule once the page has scrolled ─────────────────────── */

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
    // Nav links point across pages now (index.html#about), so the section
    // each one tracks is named by data-spy rather than parsed from the href.
    // Links whose section is not on this page simply never light up.
    var links = $$('.site-nav ul a[data-spy]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];

    links.forEach(function (link) {
      var section = document.getElementById(link.getAttribute('data-spy'));
      if (!section) return;
      byId[section.id] = link;
      sections.push(section);
    });
    if (!sections.length) return;

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

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
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

  /* ── Scroll-scrubbed soup sequence ───────────────────────────────
     The four soups share one grid cell and cross-fade as the page
     scrolls through a tall wrapper whose inner stage is `sticky`. A
     sticky parent rather than a pinned element means native scrolling
     is never intercepted — no scroll-jacking, no wheel handlers.

     Only switched on when the viewport is wide enough for the two-up
     layout and the visitor has not asked for reduced motion. In every
     other case the same four blocks stay in normal flow and read as a
     plain list, so nothing is hidden behind the effect.
  */

  (function soupScrub() {
    var scroller = $('[data-scrub]');
    if (!scroller) return;

    var panels = $$('[data-soup]', scroller);
    var indexList = $('[data-scrub-index]', scroller);
    var buttons = indexList ? $$('button[data-scrub-to]', indexList) : [];
    if (panels.length < 2) return;

    var parts = panels.map(function (panel) {
      return { art: $('.soup-art', panel), copy: $('.soup-info', panel) };
    });
    if (parts.some(function (part) { return !part.art || !part.copy; })) return;

    var wideEnough = window.matchMedia('(min-width: 900px)');
    var active = false;
    var queued = false;
    var lastIndex = -1;

    // Artwork and copy need different curves. The bowls are opaque and
    // identically framed, so a later one can simply fade in on top of the
    // one before and stay there. Copy is transparent — two blocks at once
    // would overprint — so it fades out and the next fades in, the two
    // ramps meeting exactly at the hand-over point.
    function artOpacity(i, position) {
      if (i === 0) return 1;
      return clamp((position - (i - 0.2)) / 0.5, 0, 1);
    }
    function copyOpacity(i, position) {
      return clamp((0.5 - Math.abs(position - (i + 0.5))) / 0.14, 0, 1);
    }

    function paint() {
      queued = false;
      if (!active) return;

      var travel = scroller.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      var progress = clamp(-scroller.getBoundingClientRect().top / travel, 0, 1);
      // Centre the first soup at the start of the run and the last at the
      // end, so neither is caught mid-fade when the sequence comes to rest.
      var position = progress * (panels.length - 1) + 0.5;
      var current = Math.round(clamp(position - 0.5, 0, panels.length - 1));

      for (var i = 0; i < panels.length; i++) {
        var art = artOpacity(i, position);
        var copy = copyOpacity(i, position);

        parts[i].art.style.opacity = art;
        parts[i].copy.style.opacity = copy;
        parts[i].copy.style.transform = 'translateY(' + ((1 - copy) * 14).toFixed(2) + 'px)';

        if (i === current) panels[i].removeAttribute('aria-hidden');
        else panels[i].setAttribute('aria-hidden', 'true');
      }

      if (current !== lastIndex) {
        lastIndex = current;
        buttons.forEach(function (button, i) {
          if (i === current) button.setAttribute('aria-current', 'true');
          else button.removeAttribute('aria-current');
        });
      }
    }

    function request() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(paint);
    }

    function enable() {
      if (active) return;
      active = true;
      scroller.style.setProperty('--panels', String(panels.length));
      scroller.classList.add('is-scrub');
      if (indexList) indexList.hidden = false;
      lastIndex = -1;
      paint();
    }

    function disable() {
      active = false;
      scroller.classList.remove('is-scrub');
      scroller.style.removeProperty('--panels');
      if (indexList) indexList.hidden = true;
      lastIndex = -1;
      panels.forEach(function (panel, i) {
        parts[i].art.style.opacity = '';
        parts[i].copy.style.opacity = '';
        parts[i].copy.style.transform = '';
        panel.removeAttribute('aria-hidden');
      });
      buttons.forEach(function (button) { button.removeAttribute('aria-current'); });
    }

    function sync() {
      if (wideEnough.matches && !reducedMotion.matches) enable();
      else disable();
    }

    // Jump to a soup from the index rail.
    buttons.forEach(function (button, i) {
      button.addEventListener('click', function () {
        if (!active) return;
        var travel = scroller.offsetHeight - window.innerHeight;
        var top = scroller.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: top + travel * ((i + 0.5) / panels.length),
          behavior: reducedMotion.matches ? 'auto' : 'smooth'
        });
      });
    });

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    onMediaChange(wideEnough, sync);
    onMediaChange(reducedMotion, sync);

    sync();
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
      return { day: day, offset: offset, label: minutesToLabel(slot.open) };
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
    $$('[data-tel], [data-email], [data-map-link], [data-social]').forEach(function (link) {
      if (link.getAttribute('href') && link.getAttribute('href') !== '#') return;
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', function (event) { event.preventDefault(); });
    });
  }());

}());
