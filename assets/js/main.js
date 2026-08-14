/* ═══════════════════════════════════════════════════════════════════
   Daily Soup Go.

   No dependencies, no build step. The page is complete and readable
   with JavaScript off, and complete and beautiful if the film never
   loads.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Trading hours ────────────────────────────────────────────────
     EDIT HERE if the shop's hours change. Keys are JS weekday numbers
     (0 = Sunday). Values are minutes past midnight, local time. A day
     left out is treated as closed. Change the table in the HTML too:
     that is what search engines and non-JS visitors read.
  */
  var HOURS = {
    1: { open: 11 * 60, close: 15 * 60 },
    2: { open: 11 * 60, close: 15 * 60 },
    3: { open: 11 * 60, close: 15 * 60 },
    4: { open: 11 * 60, close: 15 * 60 },
    5: { open: 11 * 60, close: 15 * 60 }
  };

  /* The film ships in two codecs and the browser picks. H.264 in an mp4 is the
     wide, hardware-accelerated default and what Safari needs; VP9 in a webm is
     the fallback for the Chromium builds that ship without an H.264 decoder,
     which is common on Linux. Only one is ever downloaded. Byte sizes are the
     fallback when a host omits Content-Length. */
  var SOURCES = [
    { url: 'assets/hero-scrub.mp4',  type: 'video/mp4; codecs="avc1.640028"', bytes: 2052591 },
    { url: 'assets/hero-scrub.webm', type: 'video/webm; codecs="vp9"',        bytes: 704295 }
  ];
  var POSTER_URL = 'assets/hero-poster.jpg';
  var STILL_URL = 'assets/hero-ending.jpg';

  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /* The five static-hero gates. These strings must stay identical to the
     media query list in styles.css, or one side loads what the other hides. */
  var GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function smoothstep(p, e0, e1) {
    var t = clamp((p - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function onMedia(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }
  // seeded, so the "random" jitter is the same on every load
  function rng(seed) {
    var s = seed >>> 0;
    return function () { return (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Open or closed ─────────────────────────────────────────────── */

  function label(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var suffix = h >= 12 ? 'pm' : 'am';
    var d = h % 12 === 0 ? 12 : h % 12;
    return d + (m ? ':' + String(m).padStart(2, '0') : '') + suffix;
  }
  function nextOpening(from) {
    for (var o = 0; o <= 7; o++) {
      var day = (from.getDay() + o) % 7, slot = HOURS[day];
      if (!slot) continue;
      if (o === 0 && from.getHours() * 60 + from.getMinutes() >= slot.open) continue;
      return { day: day, offset: o, at: label(slot.open) };
    }
    return null;
  }
  function status() {
    var now = new Date(), slot = HOURS[now.getDay()];
    var mins = now.getHours() * 60 + now.getMinutes();
    if (slot && mins >= slot.open && mins < slot.close) {
      return { open: true, text: 'Open until ' + label(slot.close), short: 'Open' };
    }
    var next = nextOpening(now);
    if (!next) return { open: false, text: 'Closed', short: 'Closed' };
    if (next.offset === 0) return { open: false, text: 'Opens at ' + next.at, short: 'Closed' };
    if (next.offset === 1) return { open: false, text: 'Opens tomorrow, ' + next.at, short: 'Closed' };
    return { open: false, text: 'Opens ' + DAYS[next.day] + ', ' + next.at, short: 'Closed' };
  }

  (function openStatus() {
    var pills = $$('[data-open-status]');
    var today = $('.hours tr[data-day="' + new Date().getDay() + '"]');
    if (today) today.classList.add('is-today');
    if (!pills.length) return;
    function paint() {
      var s = status();
      pills.forEach(function (pill) {
        var t = $('[data-open-status-text]', pill);
        if (t) t.textContent = s.text;
        pill.classList.toggle('is-open', s.open);
        pill.hidden = false;
      });
    }
    paint();
    setInterval(paint, 60000);
  }());

  /* ── Mobile navigation ──────────────────────────────────────────── */

  (function nav() {
    var toggle = $('.nav-toggle'), menu = $('#site-nav');
    if (!toggle || !menu) return;
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !menu.classList.contains('is-open')) return;
      setOpen(false); toggle.focus();
    });
    onMedia(window.matchMedia('(min-width: 861px)'), function (e) { if (e.matches) setOpen(false); });
  }());

  /* ── Header state ───────────────────────────────────────────────── */

  (function header() {
    var el = $('.site-header'); if (!el) return;
    var hero = $('[data-hero]');
    var ticking = false, lastStuck = null, lastFilm = null;
    function update() {
      ticking = false;
      var stuck = window.scrollY > 8;
      if (stuck !== lastStuck) { lastStuck = stuck; el.classList.toggle('is-stuck', stuck); }
      var film = false;
      if (hero) {
        var r = hero.getBoundingClientRect();
        film = r.top <= 0 && r.bottom > el.offsetHeight + 40;
      }
      if (film !== lastFilm) { lastFilm = film; el.classList.toggle('on-film', film); }
    }
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true; requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }());

  /* ── Scroll spy ─────────────────────────────────────────────────── */

  (function spy() {
    var links = $$('.site-nav ul a[data-spy]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var byId = {}, sections = [];
    links.forEach(function (a) {
      var s = document.getElementById(a.getAttribute('data-spy'));
      if (!s) return;
      byId[s.id] = a; sections.push(s);
    });
    if (!sections.length) return;
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      var cur = null;
      sections.forEach(function (s) { if (seen[s.id] && !cur) cur = s.id; });
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (cur && byId[cur]) byId[cur].setAttribute('aria-current', 'true');
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }());

  /* ── Reveals ────────────────────────────────────────────────────── */

  (function reveals() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (reduced.matches || !('IntersectionObserver' in window)) {
      items.forEach(function (i) { i.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (i) { io.observe(i); });
  }());

  /* ═══════════════════════════════════════════════════════════════════
     THE SCRUB HERO

     A tall section with a sticky stage. Scroll progress through it maps
     0 to 1 and drives the film's time. Four caption bands ride the same
     progress. Nothing intercepts the scroll: no wheel handlers, no
     scroll-jacking. The five gates below hand phones, portrait tablets
     and reduced-motion visitors a composed still instead, and they never
     download the film.
     ═══════════════════════════════════════════════════════════════════ */

  (function scrubHero() {
    var hero = $('[data-hero]');
    if (!hero) return;

    var stage = $('[data-stage]', hero);
    var video = $('[data-video]', hero);
    var poster = $('[data-poster]', hero);
    var loader = $('[data-loader]', hero);
    var bandEls = $$('[data-band]', hero);
    if (!stage || !video || !poster || !bandEls.length) return;

    var ring = $('.ring', loader);

    /* ── split the headlines into word and character spans ── */
    var R = rng(20260814);

    function build(text, entrance, cls) {
      var wrap = document.createElement('span');
      wrap.className = 'split' + (cls ? ' ' + cls : '');
      wrap.setAttribute('aria-hidden', 'true');
      var words = text.split(/\s+/);
      words.forEach(function (word, wi) {
        var w = document.createElement('span');
        w.className = 'w';
        // ordered stagger for the entrances that read left to right,
        // a light shuffle for the one that lands like an impact
        var base = wi / Math.max(1, words.length - 1);
        var th = entrance === 'punch'
          ? base * 0.30 + R() * 0.10
          : base * 0.46 + R() * 0.05;
        w.style.setProperty('--th', th.toFixed(3));
        w.textContent = word;
        wrap.appendChild(w);
        if (wi < words.length - 1) wrap.appendChild(document.createTextNode(' '));
      });
      return wrap;
    }

    bandEls.forEach(function (band) {
      var entrance = band.getAttribute('data-entrance') || 'rise';
      $$('[data-split]', band).forEach(function (line) {
        var text = line.textContent.replace(/\s+/g, ' ').trim();
        line.textContent = '';
        var sr = document.createElement('span');
        sr.className = 'visually-hidden';
        sr.textContent = text;
        line.appendChild(sr);
        if (entrance === 'blur') {
          // two stacked copies crossfaded; the blur is static, never animated
          line.appendChild(build(text, entrance, 'split-soft'));
          line.appendChild(build(text, entrance, 'split-sharp'));
        } else {
          line.appendChild(build(text, entrance, ''));
        }
      });
    });

    /* ── band ranges ── */
    var bands = bandEls.map(function (el, i) {
      var r = (el.getAttribute('data-range') || '0,1').split(',');
      var a = parseFloat(r[0]), b = parseFloat(r[1]);
      var ramp = parseFloat(el.getAttribute('data-ramp')) || Math.min(0.025, (b - a) * 0.35);
      return {
        el: el, a: a, b: b, ramp: ramp,
        first: i === 0, last: i === bandEls.length - 1,
        op: -1, k: -1, live: null
      };
    });

    /* ── state ── */
    var scrubOn = false;
    var onScreen = true;
    var target = 0, shown = 0, rafId = null, lastTick = 0;
    var seekBusy = false, pending = null;
    var loadStart = 0, loadK = 0;
    var started = false, failed = false;

    function heroProgress() {
      var travel = hero.offsetHeight - window.innerHeight;
      if (travel <= 0) return 0;
      return clamp(-hero.getBoundingClientRect().top / travel, 0, 1);
    }

    /* ── seeks, gated so they never overlap ── */
    function requestSeek(t) {
      if (!video.duration || failed) return;
      if (seekBusy) { pending = t; return; }
      seekBusy = true;
      try { video.currentTime = t; } catch (e) { seekBusy = false; }
    }
    video.addEventListener('seeked', function () {
      seekBusy = false;
      if (pending !== null) { var t = pending; pending = null; requestSeek(t); }
    });
    video.addEventListener('error', function () {   // the deadlock escape
      seekBusy = false; pending = null; failVideo();
    });

    /* ── captions ── */
    function paintBands(p) {
      for (var i = 0; i < bands.length; i++) {
        var d = bands[i];
        var f = Math.min(0.02, (d.b - d.a) / 3);
        var inE = d.first ? 1 : smoothstep(p, d.a, d.a + f);
        var outE = d.last ? 1 : (1 - smoothstep(p, d.b - f, d.b));
        var op = inE * outE;

        var k = clamp((p - d.a) / d.ramp, 0, 1);
        if (d.first) k = Math.max(k, loadK);   // band one opens settled

        if (Math.abs(op - d.op) > 0.004) {
          d.op = op;
          d.el.style.opacity = op.toFixed(3);
        }
        if (Math.abs(k - d.k) > 0.008) {
          d.k = k;
          d.el.style.setProperty('--k', k.toFixed(3));
          if (d.last) {
            d.el.style.setProperty('--ks', clamp((k - 0.5) * 3, 0, 1).toFixed(3));
            d.el.style.setProperty('--kb', clamp((k - 0.68) * 3.4, 0, 1).toFixed(3));
          }
        }
        var live = op > 0.5;
        if (live !== d.live) { d.live = live; d.el.classList.toggle('is-live', live); }
      }
    }

    /* ── the drive loop, which rests when it converges ── */
    function tick(now) {
      var dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      var k = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));

      if (loadK < 1 && loadStart) {
        loadK = clamp((now - loadStart) / 900, 0, 1);
      }

      var converged = Math.abs(target - shown) < 0.0005 && loadK >= 1;
      if (converged) { shown = target; rafId = null; lastTick = 0; }
      else { rafId = requestAnimationFrame(tick); }

      if (video.duration) requestSeek(shown * video.duration);
      paintBands(shown);
    }
    function kick() { if (rafId === null && onScreen && scrubOn) { rafId = requestAnimationFrame(tick); } }
    function onScroll() { target = heroProgress(); kick(); }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        onScreen = e[0].isIntersecting;
        if (onScreen) kick();
      }, { rootMargin: '10% 0px' }).observe(hero);
    }

    /* ── the film, fetched as a Blob so seeking works on any host ── */
    function failVideo() {
      if (failed) return;
      failed = true;
      stage.classList.add('video-failed');
      if (loader && loader.parentNode) {
        var cue = document.createElement('div');
        cue.className = 'hero-cue';
        cue.setAttribute('aria-hidden', 'true');
        cue.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" ' +
          'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 4v14M6 13l6 6 6-6"/></svg>';
        loader.replaceWith(cue);
      }
    }

    function pickSource() {
      for (var i = 0; i < SOURCES.length; i++) {
        if (video.canPlayType(SOURCES[i].type)) return SOURCES[i];
      }
      return SOURCES[0];
    }

    async function loadFilm() {
      var src = pickSource();

      /* build-preview.py rewrites the two URLs above into data: URIs so the
         whole site fits in one file. A data: URI is already in memory, so it
         needs neither the progress ring nor the Blob dance, and seeking it is
         instant. On the deployed site this branch never runs. */
      if (src.url.slice(0, 5) === 'data:') {
        if (ring) ring.style.setProperty('--ld', 0);
        video.src = src.url;
        video.load();
        video.addEventListener('canplay', filmReady, { once: true });
        return;
      }

      var ctrl = new AbortController();
      var watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
      var res = await fetch(src.url, { signal: ctrl.signal });
      if (!res.ok || !res.body) throw new Error('film ' + res.status);
      var total = Number(res.headers.get('Content-Length')) || src.bytes;
      var reader = res.body.getReader();
      var chunks = [], got = 0, lastRing = 0;
      for (;;) {
        var step = await reader.read();
        if (step.done) break;
        clearTimeout(watchdog);
        watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
        chunks.push(step.value);
        got += step.value.length;
        var frac = Math.min(1, got / total);
        var now = performance.now();
        if (ring && (now - lastRing > 100 || frac === 1)) {
          lastRing = now;
          ring.style.setProperty('--ld', Math.round(126 * (1 - frac)));
        }
      }
      clearTimeout(watchdog);
      if (ring) ring.style.setProperty('--ld', 0);
      video.src = URL.createObjectURL(new Blob(chunks, { type: src.type.split(';')[0] }));
      video.load();
      video.addEventListener('canplay', filmReady, { once: true });
    }

    /* Both paths land here: retire the loader, then jump the film to wherever
       the visitor has already scrolled to rather than starting it at zero. */
    function filmReady() {
      if (loader) loader.classList.add('is-done');
      stage.classList.add('video-ready');
      target = heroProgress();
      requestSeek(target * video.duration);
      kick();
    }

    function initOnce() {
      if (started) return;
      started = true;
      // the poster wins the bandwidth race by design
      poster.style.backgroundImage = "url('" + POSTER_URL + "')";
      loadStart = performance.now();
      var go = false;
      function begin() {
        if (go) return; go = true;
        loadFilm().catch(failVideo);
      }
      var img = new Image();
      img.onload = begin; img.onerror = begin;
      img.src = POSTER_URL;
      setTimeout(begin, 4000);      // a hung poster never blocks the film forever
    }

    /* ── the gate, live in both directions ── */
    function enable() {
      if (scrubOn) return;
      scrubOn = true;
      initOnce();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      bands.forEach(function (d) { d.op = -1; d.k = -1; d.live = null; });
      target = heroProgress();
      paintBands(target);
      kick();
    }
    function disable() {
      if (!scrubOn) return;
      scrubOn = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }
    function applyHeroMode() {
      if (MQLS.some(function (m) { return m.matches; })) {
        disable();
        // the still hero is a designed layout, so give it the composed ending frame
        poster.style.backgroundImage = "url('" + STILL_URL + "')";
      } else {
        if (started) poster.style.backgroundImage = "url('" + POSTER_URL + "')";
        enable();
      }
    }
    var MQLS = GATES.map(function (q) { return window.matchMedia(q); });
    MQLS.forEach(function (m) { onMedia(m, applyHeroMode); });
    applyHeroMode();
  }());

  /* ── The docket, the signature element ──────────────────────────── */

  (function docket() {
    var el = $('[data-docket]');
    if (!el) return;
    var dayEl = $('[data-docket-day]', el);
    var stateEl = $('[data-docket-state]', el);
    var hereEl = $('[data-docket-here]', el);
    var hero = $('[data-hero]');

    var marks = $$('main section[id], main section[data-docket-name]').map(function (s) {
      var h = $('h1,h2', s);
      var fallback = h ? h.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : s.id;
      return { el: s, name: (s.getAttribute('data-docket-name') || fallback).replace(/\s+/g, ' ').trim() };
    });

    var lastHere = '', lastState = '', lastFilm = null, ticking = false;
    if (dayEl) dayEl.textContent = DAYS_SHORT[new Date().getDay()] + ' · ' + new Date().getDate();

    function paint() {
      ticking = false;
      var s = status();
      if (s.short !== lastState) {
        lastState = s.short;
        if (stateEl) stateEl.textContent = s.short;
      }
      var mid = window.innerHeight * 0.5, here = '';
      for (var i = 0; i < marks.length; i++) {
        var r = marks[i].el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { here = marks[i].name; break; }
      }
      if (here.length > 22) here = here.slice(0, 21) + '…';
      if (here !== lastHere) { lastHere = here; if (hereEl) hereEl.textContent = here; }

      if (hero) {
        var hr = hero.getBoundingClientRect();
        var film = hr.top <= 0 && hr.bottom > window.innerHeight * 0.5;
        if (film !== lastFilm) { lastFilm = film; el.classList.toggle('on-film', film); }
      }
    }
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true; requestAnimationFrame(paint);
    }, { passive: true });
    window.addEventListener('resize', paint, { passive: true });
    paint();
    setTimeout(function () { el.classList.add('is-in'); }, 900);
    setInterval(paint, 60000);
  }());

  /* ── The steam line, drawn by scroll ────────────────────────────── */

  (function steamline() {
    var svg = $('[data-steamline]');
    if (!svg) return;
    var path = $('path', svg);
    if (!path) return;
    var len = path.getTotalLength();
    svg.style.setProperty('--len', len);
    path.style.strokeDasharray = len;

    if (reduced.matches) { path.style.strokeDashoffset = 0; return; }

    var section = svg.closest('section');
    var last = -1, ticking = false;
    function paint() {
      ticking = false;
      var r = section.getBoundingClientRect();
      var p = clamp(1 - (r.bottom - window.innerHeight * 0.35) / (r.height * 0.7), 0, 1);
      var off = Math.round(len * (1 - p));
      if (Math.abs(off - last) < 2) return;
      last = off;
      path.style.strokeDashoffset = off;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true; requestAnimationFrame(paint);
    }, { passive: true });
    paint();
  }());

  /* ── Hold to pour, the one interactive moment ────────────────────
     The visitor performs the brand's one idea. Holding fills the cup,
     letting go early eases it back down rather than snapping, and
     filling it lights up today's board. Reduced motion gets the filled
     state instantly with no hold required.
  */

  (function holdToPour() {
    var root = $('[data-pour]');
    if (!root) return;
    var btn = $('[data-pour-btn]', root);
    var labelEl = $('[data-pour-label]', root);
    if (!btn) return;

    var LABEL_IDLE = labelEl ? labelEl.textContent : '';
    var LABEL_DONE = "That is today's board";

    function finish() {
      root.classList.add('is-full');
      root.style.setProperty('--pk', 1);
      root.style.setProperty('--done', 1);
      if (labelEl) labelEl.textContent = LABEL_DONE;
      btn.setAttribute('aria-pressed', 'true');
    }

    if (reduced.matches) { finish(); return; }

    var level = 0, holding = false, done = false, raf = null, last = 0;

    function frame(now) {
      var dt = Math.min(64, now - (last || now));
      last = now;
      var rate = holding ? 0.00105 : -0.0013;      // fills in about a second, eases back a touch faster
      level = clamp(level + rate * dt, 0, 1);
      root.style.setProperty('--pk', level.toFixed(3));
      if (level >= 1 && !done) { done = true; finish(); raf = null; last = 0; return; }
      if ((holding && level < 1) || (!holding && level > 0)) raf = requestAnimationFrame(frame);
      else { raf = null; last = 0; }
    }
    function start(e) {
      if (done) return;
      if (e && e.type === 'pointerdown' && e.button !== undefined && e.button !== 0) return;
      holding = true;
      if (raf === null) raf = requestAnimationFrame(frame);
    }
    function stop() {
      holding = false;
      if (raf === null && level > 0 && !done) raf = requestAnimationFrame(frame);
    }

    btn.addEventListener('pointerdown', function (e) { btn.setPointerCapture && btn.setPointerCapture(e.pointerId); start(e); });
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointercancel', stop);
    btn.addEventListener('pointerleave', stop);
    // keyboard: space or enter held down
    btn.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); start(); }
    });
    btn.addEventListener('keyup', function (e) {
      if (e.key === ' ' || e.key === 'Enter') stop();
    });
    btn.addEventListener('blur', stop);

    // if motion is turned on mid-session, the pins come off; if it is turned
    // off, jump straight to the finished state
    onMedia(reduced, function (e) { if (e.matches && !done) { done = true; finish(); } });
  }());

  /* ── The soup sequence on the menu page ─────────────────────────── */

  (function soupScrub() {
    var scroller = $('[data-scrub]');
    if (!scroller) return;
    var panels = $$('[data-soup]', scroller);
    var indexList = $('[data-scrub-index]', scroller);
    var buttons = indexList ? $$('button[data-scrub-to]', indexList) : [];
    if (panels.length < 2) return;

    var parts = panels.map(function (p) { return { art: $('.soup-art', p), copy: $('.soup-info', p) }; });
    if (parts.some(function (p) { return !p.art || !p.copy; })) return;

    var wide = window.matchMedia('(min-width: 900px)');
    var on = false, queued = false, lastIndex = -1;

    // The bowls are opaque and identically framed, so a later one fades in over
    // the one before and stays. Copy is transparent and would overprint, so it
    // fades out as the next fades in, the ramps meeting at the hand-over.
    function artOp(i, pos) { return i === 0 ? 1 : clamp((pos - (i - 0.2)) / 0.5, 0, 1); }
    function copyOp(i, pos) { return clamp((0.5 - Math.abs(pos - (i + 0.5))) / 0.14, 0, 1); }

    function paint() {
      queued = false;
      if (!on) return;
      var travel = scroller.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      var p = clamp(-scroller.getBoundingClientRect().top / travel, 0, 1);
      var pos = p * (panels.length - 1) + 0.5;
      var cur = Math.round(clamp(pos - 0.5, 0, panels.length - 1));
      for (var i = 0; i < panels.length; i++) {
        var a = artOp(i, pos), c = copyOp(i, pos);
        parts[i].art.style.opacity = a;
        parts[i].copy.style.opacity = c;
        parts[i].copy.style.transform = 'translateY(' + ((1 - c) * 14).toFixed(2) + 'px)';
        if (i === cur) panels[i].removeAttribute('aria-hidden');
        else panels[i].setAttribute('aria-hidden', 'true');
      }
      if (cur !== lastIndex) {
        lastIndex = cur;
        buttons.forEach(function (b, i) {
          if (i === cur) b.setAttribute('aria-current', 'true');
          else b.removeAttribute('aria-current');
        });
      }
    }
    function request() { if (queued) return; queued = true; requestAnimationFrame(paint); }
    function enable() {
      if (on) return; on = true;
      scroller.style.setProperty('--panels', String(panels.length));
      scroller.classList.add('is-scrub');
      if (indexList) indexList.hidden = false;
      lastIndex = -1; paint();
    }
    function disable() {
      on = false;
      scroller.classList.remove('is-scrub');
      scroller.style.removeProperty('--panels');
      if (indexList) indexList.hidden = true;
      lastIndex = -1;
      panels.forEach(function (p, i) {
        parts[i].art.style.opacity = '';
        parts[i].copy.style.opacity = '';
        parts[i].copy.style.transform = '';
        p.removeAttribute('aria-hidden');
      });
      buttons.forEach(function (b) { b.removeAttribute('aria-current'); });
    }
    function sync() { if (wide.matches && !reduced.matches) enable(); else disable(); }

    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () {
        if (!on) return;
        var travel = scroller.offsetHeight - window.innerHeight;
        var top = scroller.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: top + travel * ((i + 0.5) / panels.length),
          behavior: reduced.matches ? 'auto' : 'smooth'
        });
      });
    });

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    onMedia(wide, sync);
    onMedia(reduced, sync);
    sync();
  }());

  /* ── Pause every loop on a hidden tab ───────────────────────────── */

  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  /* ── Footer year ────────────────────────────────────────────────── */

  (function year() {
    var el = $('[data-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }());

  /* ── Placeholder links ──────────────────────────────────────────────
     Phone, email, map and social links point at `#` until the client's
     details are filled in. Swallow the click so the draft never jumps.
     Delete this block once the hrefs are real.
  */
  (function placeholders() {
    $$('[data-tel], [data-email], [data-map-link], [data-social]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href !== '#') return;
      a.setAttribute('aria-disabled', 'true');
      a.addEventListener('click', function (e) { e.preventDefault(); });
    });
  }());

}());
