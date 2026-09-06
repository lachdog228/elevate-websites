/* =============================================================================
   Demasi Brothers and Sons — interactions

   Principles
   - The page is complete and readable without this file. Every effect here is
     additive, and the `js` class is only added once we know we can run.
   - All motion is skipped when the visitor prefers reduced motion.
   - Scroll work is batched into a single rAF-throttled listener.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Opt in to the hidden-then-revealed styles only now that JS is running. */
  root.classList.add('js');

  /* --- Current year -------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* --- Scroll reveals ------------------------------------------------------
     One observer for the whole page. Elements are unobserved once shown so
     nothing re-animates on the way back up.                                 */
  var revealables = document.querySelectorAll('[data-reveal]');

  function showAll() {
    for (var i = 0; i < revealables.length; i++) revealables[i].classList.add('is-in');
  }

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { observer.observe(el); });

    /* If a visitor lands deep in the page (an anchor, or a restored scroll
       position), reveal anything already above the fold immediately. */
    requestAnimationFrame(function () {
      revealables.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add('is-in');
        }
      });
    });

    /* Safety net: nothing on this page may stay invisible because of a
       missed observer callback. Anything still hidden after the visitor has
       scrolled past it is shown outright. */
    window.addEventListener('scroll', function sweep() {
      var pending = 0;
      revealables.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
        else pending++;
      });
      if (!pending) window.removeEventListener('scroll', sweep);
    }, { passive: true });
  }

  /* --- Hero entrance -------------------------------------------------------
     Waits for fonts so the headline lines don't rise, reflow, then jump.    */
  function ready() { root.classList.add('is-ready'); }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ready);
    setTimeout(ready, 1200); // never let a slow font block the reveal
  } else {
    ready();
  }

  /* --- Sticky nav + scroll progress ---------------------------------------- */
  var nav = document.getElementById('nav');
  var progress = nav ? nav.querySelector('.nav__progress') : null;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-stuck', y > 40);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* --- Mobile menu ---------------------------------------------------------
     `hidden` keeps the panel out of the accessibility tree when closed; it is
     removed a frame before opening so the transition still runs.            */
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('menu');

  if (toggle && menu) {
    var open = false;

    var setMenu = function (next) {
      open = next;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);

      if (open) {
        menu.hidden = false;
        requestAnimationFrame(function () { menu.classList.add('is-open'); });
      } else {
        menu.classList.remove('is-open');
        var done = function () { if (!open) menu.hidden = true; };
        if (reduceMotion.matches) done();
        else setTimeout(done, 700); // matches the panel transition
      }
    };

    toggle.addEventListener('click', function () { setMenu(!open); });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) { setMenu(false); toggle.focus(); }
    });

    /* A resize past the desktop breakpoint must not leave the body locked. */
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (e) {
      if (e.matches && open) setMenu(false);
    });
  }

  /* --- Services hover preview ----------------------------------------------
     Fine pointers on wide screens only. A single fixed element holds every
     preview image; hovering a row cross-fades to that row's image while the
     element eases to the row's height. It is pinned to the right margin and
     tracks the pointer vertically only — following the cursor in both axes
     put the picture on top of the label being read. Position is written
     once per frame, off a rAF loop that stops when there is nothing to do.
     The width below must match the `min-width` in site.css that hides the
     static thumbnail. */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1080px)');
  var rows = Array.prototype.slice.call(document.querySelectorAll('.service[data-preview]'));

  if (rows.length && finePointer.matches && !reduceMotion.matches) {
    var preview = document.createElement('div');
    preview.className = 'service-preview';
    preview.setAttribute('aria-hidden', 'true');

    var images = rows.map(function (row) {
      var img = new Image();
      img.src = row.getAttribute('data-preview');
      img.alt = '';
      img.decoding = 'async';
      preview.appendChild(img);
      return img;
    });
    document.body.appendChild(preview);

    var targetY = 0;
    var currentY = 0;
    var active = false;
    var raf = null;

    /* Keep the picture fully on screen even when the pointer is near the
       top or bottom edge of a tall row. */
    function clampY(y) {
      var half = preview.offsetHeight / 2;
      return Math.min(Math.max(y, half + 8), window.innerHeight - half - 8);
    }

    function frame() {
      /* Lerp toward the pointer — the lag is what makes it feel considered. */
      currentY += (targetY - currentY) * 0.12;
      preview.style.transform =
        'translate3d(0,' + currentY.toFixed(1) + 'px,0) translateY(-50%)' +
        ' scale(' + (active ? 1 : 0.94) + ')';

      if (active || Math.abs(targetY - currentY) > 0.5) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = null;
      }
    }

    function start() { if (raf === null) raf = requestAnimationFrame(frame); }

    document.getElementById('services-list').addEventListener('pointermove', function (e) {
      targetY = clampY(e.clientY);
      start();
    });

    rows.forEach(function (row, i) {
      row.addEventListener('pointerenter', function (e) {
        /* Settle straight onto the first row entered, rather than sliding
           in from wherever the previous hover ended. */
        if (!active) currentY = targetY = clampY(e.clientY);
        active = true;
        preview.classList.add('is-visible');
        images.forEach(function (img, j) { img.classList.toggle('is-active', i === j); });
        start();
      });

      row.addEventListener('pointerleave', function () {
        active = false;
        preview.classList.remove('is-visible');
        start();
      });
    });
  }
})();
