/* Case study: scroll stepper (progress + active step) and animated goal counters. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function paused() { return document.documentElement.getAttribute("data-motion") === "paused"; }

  function initStepper() {
    var stepper = document.querySelector("[data-stepper]");
    if (!stepper) return;
    var links = Array.prototype.slice.call(stepper.querySelectorAll("[data-step-link]"));
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute("data-step-link")); });
    var fill = stepper.querySelector("[data-stepper-fill]");
    var current = 0;

    function setActive(i) {
      current = i;
      links.forEach(function (a, k) {
        a.classList.toggle("is-active", k === i);
        a.classList.toggle("is-done", k < i);
        if (k === i) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current");
      });
      var act = links[i];
      var ol = act && act.closest("ol");
      if (ol && ol.scrollWidth > ol.clientWidth) ol.scrollTo({ left: act.offsetLeft - 8, behavior: "smooth" });
    }

    function update() {
      var probe = window.innerHeight * 0.35, idx = 0;
      sections.forEach(function (sec, k) { if (sec && sec.getBoundingClientRect().top <= probe) idx = k; });
      if (idx !== current) setActive(idx);
      var first = sections[0], last = sections[sections.length - 1];
      if (first && last && fill) {
        var top = first.getBoundingClientRect().top + window.scrollY;
        var end = last.getBoundingClientRect().top + window.scrollY;
        var p = (window.scrollY + probe - top) / Math.max(1, end - top);
        fill.parentNode.parentNode.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
      }
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", update);
    links.forEach(function (a, k) {
      a.addEventListener("click", function (e) {
        var t = sections[k]; if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: (reduce || paused()) ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", "#" + t.id);
        t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true });
      });
    });
    setActive(0); update();
  }

  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    function run(el) {
      var end = parseInt(el.getAttribute("data-count"), 10) || 0;
      if (reduce || paused()) { el.textContent = end; return; }
      var start = null, dur = 1100;
      function frame(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(end * eased);
        if (t < 1) requestAnimationFrame(frame);
      }
      el.textContent = 0; requestAnimationFrame(frame);
    }
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });

    var bars = document.querySelectorAll(".cs-goalbars li");
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io2.unobserve(en.target); } });
    }, { threshold: 0.6 });
    bars.forEach(function (b) { io2.observe(b); });
  }

  function init() { initStepper(); initCounters(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
