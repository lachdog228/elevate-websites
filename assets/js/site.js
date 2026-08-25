(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Header: transparent over the hero, solid once scrolled ---------- */
  var hdr = document.getElementById("hdr");
  var stuck = false;
  function onScroll() {
    var s = window.scrollY > 24;
    if (s !== stuck) { stuck = s; hdr.classList.toggle("is-stuck", s); }
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");
  var drawerLinks = drawer.querySelectorAll(".drawer__link");
  var lastFocus = null;

  Array.prototype.forEach.call(drawerLinks, function (a, i) {
    a.style.transitionDelay = (0.08 + i * 0.055) + "s, " + (0.08 + i * 0.055) + "s, 0s";
  });

  function setDrawer(open) {
    drawer.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("is-locked", open);
    if (open) { lastFocus = document.activeElement; drawerLinks[0].focus({ preventScroll: true }); }
    else if (lastFocus) { lastFocus.focus({ preventScroll: true }); }
  }
  burger.addEventListener("click", function () {
    setDrawer(burger.getAttribute("aria-expanded") !== "true");
  });
  drawer.addEventListener("click", function (e) {
    if (e.target.closest("a")) setDrawer(false);
  });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") setDrawer(false);
    if (e.key !== "Tab" || burger.getAttribute("aria-expanded") !== "true") return;
    var f = drawer.querySelectorAll("a[href], button:not([disabled])");
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  /* Close the drawer if the viewport grows past the mobile breakpoint */
  matchMedia("(min-width: 901px)").addEventListener("change", function (m) {
    if (m.matches && burger.getAttribute("aria-expanded") === "true") setDrawer(false);
  });

  /* ---------- Scroll reveal ---------- */
  var hero = document.getElementById("hero");
  function revealAll() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-rv]"), function (el) { el.classList.add("is-in"); });
    Array.prototype.forEach.call(document.querySelectorAll(".map, .panel"), function (el) { el.classList.add("is-in"); });
    if (hero) hero.classList.add("is-in");
  }

  if (!("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(document.querySelectorAll("[data-rv], .map, .panel"), function (el) { io.observe(el); });

    /* the hero animates on load rather than on scroll */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (hero) hero.classList.add("is-in"); });
    });
  }

  /* ---------- Process timeline ---------- */
  var track = document.getElementById("procTrack");
  if (track) {
    var fill = document.getElementById("procFill");
    var vfill = document.getElementById("procVFill");
    var steps = track.querySelectorAll("[data-step]");
    var dots = track.querySelectorAll(".proc__dot");
    var ran = false;

    /* The rail stops dead on the last node rather than running off the end,
       so measure it rather than guessing a percentage. */
    function sizeRail() {
      if (!dots.length) return;
      var t = track.getBoundingClientRect();
      var d = dots[dots.length - 1].getBoundingClientRect();
      if (fill) fill.style.width = (d.left + d.width / 2 - t.left) + "px";
      if (vfill) vfill.style.height = (d.top + d.height / 2 - t.top) + "px";
    }
    function runTimeline() {
      if (ran) return;
      ran = true;
      sizeRail();
      Array.prototype.forEach.call(steps, function (s, i) {
        setTimeout(function () { s.classList.add("is-on"); }, reduce.matches ? 0 : 260 + i * 280);
      });
    }
    var rsz;
    addEventListener("resize", function () {
      if (!ran) return;
      clearTimeout(rsz);
      rsz = setTimeout(sizeRail, 150);
    }, { passive: true });
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { runTimeline(); tio.disconnect(); }
      }, { threshold: 0.25 });
      tio.observe(track);
    } else { runTimeline(); }
  }

  /* ---------- Misc ---------- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
