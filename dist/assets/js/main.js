/* ═══════════════════════════════════════════════════════════════
   Elevate Website Designs — shared behaviour
   Deferred; nothing here blocks first paint.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ───── NAV: scrolled state + mobile drawer ───── */
  (function () {
    var nav = document.querySelector('nav');
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('navLinks');
    var backdrop = document.querySelector('.nav-backdrop');

    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('scrolled', window.scrollY > 12);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (!toggle || !links) return;

    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('open', open);
      if (backdrop) backdrop.classList.toggle('show', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  })();

  /* ───── SCROLL PROGRESS ───── */
  (function () {
    var bar = document.getElementById('progress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ───── FAQ ACCORDION ─────
     Answers live in the DOM at all times so crawlers index them and
     they stay eligible for FAQ rich results; only height is animated. */
  (function () {
    var items = document.querySelectorAll('.faq-q');
    if (!items.length) return;

    Array.prototype.forEach.call(items, function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;

      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
      });

      // Keep an open panel correctly sized if the text reflows.
      window.addEventListener('resize', function () {
        if (btn.getAttribute('aria-expanded') === 'true') {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }, { passive: true });
    });
  })();

  /* ───── SCROLL REVEAL ───── */
  (function () {
    var els = document.querySelectorAll('.fade-up');
    if (!els.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(els, function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + 'ms';
      obs.observe(el);
    });
  })();

  /* ───── STATEMENT WORD REVEAL ───── */
  (function () {
    var el = document.getElementById('statementTxt');
    if (!el || !('IntersectionObserver' in window)) return;

    var accent = (el.dataset.accent || '').split(',').map(function (s) { return s.trim().toLowerCase(); });
    var text = el.textContent.trim();

    el.innerHTML = text.split(/\s+/).map(function (w) {
      var bare = w.toLowerCase().replace(/[^a-z]/g, '');
      var hit = accent.indexOf(bare) !== -1;
      return '<span class="word' + (hit ? ' accent' : '') + '">' + w + '</span>';
    }).join(' ');

    if (reduceMotion) {
      Array.prototype.forEach.call(el.querySelectorAll('.word'), function (w) { w.classList.add('lit'); });
      return;
    }

    var words = el.querySelectorAll('.word');
    var wObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = Array.prototype.indexOf.call(words, e.target);
        setTimeout(function () { e.target.classList.add('lit'); }, idx * 26);
        wObs.unobserve(e.target);
      });
    }, { threshold: 0.85 });
    Array.prototype.forEach.call(words, function (w) { wObs.observe(w); });
  })();

  if (isTouch || reduceMotion) return;

  /* ───── CUSTOM CURSOR ───── */
  (function () {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    var rx = 0, ry = 0, mx = 0, my = 0;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a,button,input,textarea,select').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
    });
  })();

  /* ───── MAGNETIC BUTTONS ───── */
  document.querySelectorAll('.magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * 0.28;
      var y = (e.clientY - r.top - r.height / 2) * 0.28;
      btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = 'translate(0,0)'; });
  });

  /* ───── HERO TILT CARD ───── */
  (function () {
    var wrap = document.getElementById('tiltWrap');
    var card = document.getElementById('tiltCard');
    if (!wrap || !card) return;
    wrap.addEventListener('mousemove', function (e) {
      var r = wrap.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg)';
    });
    wrap.addEventListener('mouseleave', function () {
      card.style.transform = 'rotateY(0) rotateX(0)';
    });
  })();
})();
