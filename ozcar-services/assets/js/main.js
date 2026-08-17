/* OZCAR Services — site behaviour.
 *
 * Vanilla, no dependencies, safe to load with `defer`. Everything degrades:
 * with JavaScript off the navigation is still reachable, the FAQ still opens
 * (native <details>), and the enquiry form still posts normally.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PHONE_DISPLAY = "0429 500 070";

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* --- Header: solid once the page has moved off the hero ---------------- */

  function initHeader() {
    var header = $(".header");
    if (!header) return;

    var stuck = false;

    function update() {
      var should = window.scrollY > 24;
      if (should !== stuck) {
        stuck = should;
        header.classList.toggle("is-stuck", stuck);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* --- Mobile menu -------------------------------------------------------- */

  function initMenu() {
    var burger = $(".burger");
    var menu = $("#site-menu");
    if (!burger || !menu) return;

    function setOpen(open) {
      burger.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      menu.hidden = !open;
      document.body.classList.toggle("is-locked", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        var first = $("a", menu);
        if (first) first.focus();
      }
    }

    // `hidden` keeps the menu out of the tab order while it is closed; the
    // class drives the transition.
    menu.hidden = true;

    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        burger.focus();
      }
    });

    // A resize past the breakpoint must not leave the body scroll-locked.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080 && burger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
      }
    });
  }

  /* --- Scroll reveals ----------------------------------------------------- */

  function initReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    // Items that share a parent come in one after another rather than all at
    // once, which is what stops a grid of cards looking like a slide build.
    items.forEach(function (el) {
      if (el.style.getPropertyValue("--delay")) return;
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (n) {
        return n.hasAttribute && n.hasAttribute("data-reveal");
      });
      var index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--delay", Math.min(index, 5) * 80 + "ms");
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* --- FAQ ---------------------------------------------------------------- */

  function initFaq() {
    $$(".faq details").forEach(function (details) {
      var summary = $("summary", details);
      var panel = $(".faq__answer", details);
      if (!summary || !panel) return;

      panel.style.height = details.open ? "auto" : "0px";

      summary.addEventListener("click", function (e) {
        e.preventDefault();

        if (reduceMotion) {
          details.open = !details.open;
          panel.style.height = details.open ? "auto" : "0px";
          return;
        }

        if (details.open) {
          // Collapse: pin the current height, then animate to zero and only
          // drop the `open` attribute once the animation has finished.
          panel.style.height = panel.scrollHeight + "px";
          requestAnimationFrame(function () {
            panel.style.transition = "height .34s cubic-bezier(.16,1,.3,1)";
            panel.style.height = "0px";
          });
          panel.addEventListener("transitionend", function done(ev) {
            if (ev.propertyName !== "height") return;
            panel.removeEventListener("transitionend", done);
            panel.style.transition = "";
            details.open = false;
          });
        } else {
          details.open = true;
          panel.style.height = "0px";
          requestAnimationFrame(function () {
            panel.style.transition = "height .34s cubic-bezier(.16,1,.3,1)";
            panel.style.height = panel.scrollHeight + "px";
          });
          panel.addEventListener("transitionend", function done(ev) {
            if (ev.propertyName !== "height") return;
            panel.removeEventListener("transitionend", done);
            panel.style.transition = "";
            // Back to auto so the answer can reflow if the window resizes.
            panel.style.height = "auto";
          });
        }
      });
    });
  }

  /* --- Persistent mobile call/enquire bar --------------------------------- */

  function initActionBar() {
    var bar = $(".action-bar");
    if (!bar) return;

    var formInView = false;

    // No point covering the screen with "Enquire" while the form is on it.
    var form = $("#enquiry");
    if (form && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        formInView = entries[0].isIntersecting;
        update();
      }, { threshold: 0.12 }).observe(form);
    }

    function update() {
      bar.classList.toggle("is-shown", window.scrollY > 420 && !formInView);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* --- Enquiry form ------------------------------------------------------- */

  var VALIDATORS = {
    name: function (v) { return v.trim().length >= 2 || "Please tell us your name."; },
    phone: function (v) {
      var digits = v.replace(/[^0-9]/g, "");
      return (digits.length >= 8 && digits.length <= 15) || "Please enter a contact number we can reach you on.";
    },
    email: function (v) {
      if (!v.trim()) return true; // optional
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "That email address doesn't look right.";
    },
    service: function (v) { return v.trim() !== "" || "Let us know what you need."; }
  };

  function fieldOf(input) { return input.closest(".field"); }

  function setError(input, message) {
    var field = fieldOf(input);
    if (!field) return;
    var slot = $(".error", field);
    var bad = typeof message === "string";
    field.classList.toggle("is-invalid", bad);
    input.setAttribute("aria-invalid", bad ? "true" : "false");
    if (slot) slot.textContent = bad ? message : "";
  }

  function validateField(input) {
    var rule = VALIDATORS[input.name];
    if (!rule) return true;
    var result = rule(input.value);
    setError(input, result);
    return result === true;
  }

  function initForm() {
    var form = $("[data-enquiry-form]");
    if (!form) return;

    var status = $(".form-status", form);
    var statusText = status ? $(".form-status__text", status) : null;
    var submit = $("[type=submit]", form);
    var start = form.elements.hire_from;
    var end = form.elements.hire_to;

    function showStatus(kind, html) {
      if (!status || !statusText) return;
      status.classList.remove("form-status--ok", "form-status--bad");
      status.classList.add("is-shown", "form-status--" + kind);
      // These are <svg>, which has no `hidden` IDL attribute — set display.
      $(".form-status__icon-ok", status).style.display = kind === "ok" ? "" : "none";
      $(".form-status__icon-bad", status).style.display = kind === "ok" ? "none" : "";
      statusText.innerHTML = html;
      status.focus();
    }

    // Validate on the way out of a field, then live once it has been flagged.
    $$("input, select, textarea", form).forEach(function (input) {
      if (!VALIDATORS[input.name]) return;
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        if (fieldOf(input) && fieldOf(input).classList.contains("is-invalid")) validateField(input);
      });
    });

    // A return date before the pickup date is the one cross-field mistake
    // worth catching in the browser.
    function syncDates() {
      if (!start || !end) return;
      if (start.value) end.min = start.value;
      if (start.value && end.value && end.value < start.value) {
        setError(end, "The return date is before the pickup date.");
        return false;
      }
      setError(end, true);
      return true;
    }

    if (start) start.addEventListener("change", syncDates);
    if (end) end.addEventListener("change", syncDates);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var inputs = $$("input, select, textarea", form).filter(function (i) { return VALIDATORS[i.name]; });
      var ok = true;
      inputs.forEach(function (input) { if (!validateField(input)) ok = false; });
      if (!syncDates()) ok = false;

      if (!ok) {
        var firstBad = $(".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea", form);
        if (firstBad) firstBad.focus();
        showStatus("bad", "Please check the highlighted fields and send it again.");
        return;
      }

      // Silently drop anything that filled the honeypot.
      if (form.elements.company && form.elements.company.value) return;

      var data = new FormData(form);
      var action = form.getAttribute("action") || window.location.pathname;

      if (status) status.classList.remove("is-shown");
      if (submit) {
        submit.classList.add("is-busy");
        submit.dataset.label = submit.textContent;
        submit.textContent = "Sending…";
      }

      fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          form.reset();
          $$(".field.is-invalid", form).forEach(function (f) { f.classList.remove("is-invalid"); });
          showStatus(
            "ok",
            "<strong>Thanks — your enquiry is in.</strong> We'll get back to you to confirm " +
            "availability and pricing. If it's urgent, call <a href=\"tel:+61429500070\">" +
            PHONE_DISPLAY + "</a>."
          );
        })
        .catch(function () {
          // Never claim an enquiry was sent when it was not. The phone always
          // works, so point at it.
          showStatus(
            "bad",
            "<strong>That didn't send.</strong> Sorry — something went wrong at our end. " +
            "Please call <a href=\"tel:+61429500070\">" + PHONE_DISPLAY + "</a> and we'll " +
            "sort it out straight away."
          );
        })
        .then(function () {
          if (submit) {
            submit.classList.remove("is-busy");
            submit.textContent = submit.dataset.label || "Send enquiry";
          }
        });
    });

    prefillFromLink(form);
  }

  /* Buttons around the site link through as contact.html?about=Towing, so the
   * visitor lands on the form with the right thing already chosen. */
  function prefillFromLink(form) {
    var about = new URLSearchParams(window.location.search).get("about");
    if (!about) return;

    var select = form.elements.service;
    if (select) {
      var match = Array.prototype.filter.call(select.options, function (o) {
        return o.value.toLowerCase() === about.toLowerCase();
      })[0];
      if (match) {
        select.value = match.value;
        return;
      }
    }

    var message = form.elements.message;
    if (message && !message.value) message.value = "Enquiry about: " + about + "\n\n";
  }

  /* --- Footer year -------------------------------------------------------- */

  function initYear() {
    $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  /* --- Boot --------------------------------------------------------------- */

  function boot() {
    initHeader();
    initMenu();
    initReveal();
    initFaq();
    initActionBar();
    initForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
