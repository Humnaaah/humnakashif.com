/* ==========================================================================
   ANIMATIONS.JS
   The shared animation layer referenced from every section:
     1. Auto-tags a small set of not-yet-animated elements (section
        headings, FAQ rows, the featured testimonial block) with
        `.reveal-up` so they participate in scroll-reveal without every
        section needing to remember to add the class by hand.
     2. Drives the generic scroll-reveal observer for every
        `.reveal-on-scroll` / `.reveal-up` / `.reveal-left` /
        `.reveal-right` / `.reveal-scale` element on the page.
     3. Renders the trusted-clients logo marquee from data/content.js
        (duplicated into two groups for a seamless loop, matching the
        technique used for the divider tickers).
     4. Drives the footer's cycling word ("design" / "build" / "create").

   Per-section interactive behavior (accordions, tabs, carousels) stays
   in its own file (faq.js, experience.js, testimonials.js, etc.) —
   this file only covers cross-section motion.
   ========================================================================== */

(function () {
  "use strict";

  const AUTO_REVEAL_SELECTORS = [
    ".section-heading",
    ".faq__item",
    ".testimonial-featured__inner",
  ];

  const REVEAL_SELECTOR =
    ".reveal-on-scroll, .reveal-up, .reveal-left, .reveal-right, .reveal-scale";

  function autoTagRevealElements() {
    AUTO_REVEAL_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        const alreadyTagged =
          el.classList.contains("reveal-up") ||
          el.classList.contains("reveal-on-scroll") ||
          el.classList.contains("reveal-left") ||
          el.classList.contains("reveal-right") ||
          el.classList.contains("reveal-scale");
        if (!alreadyTagged) el.classList.add("reveal-up");
      });
    });
  }

  function initScrollReveal() {
    const elements = document.querySelectorAll(REVEAL_SELECTOR);
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function renderClientLogos() {
    const track = document.querySelector("[data-client-logos]");
    if (!track) return;
    if (typeof portfolio === "undefined" || !Array.isArray(portfolio.clients)) {
      console.warn("animations.js: no `portfolio.clients` array found in data/content.js.");
      return;
    }

    function buildGroup() {
      const group = document.createElement("div");
      group.className = "marquee__group";
      portfolio.clients.forEach((client) => {
        const img = document.createElement("img");
        img.src = client.logo;
        img.alt = client.name;
        img.loading = "lazy";
        img.className = "trusted-clients__logo";
        group.appendChild(img);
      });
      return group;
    }

    // Two identical groups, per the seamless-loop technique described
    // in animations.css.
    track.appendChild(buildGroup());
    track.appendChild(buildGroup());
  }

  function initFooterCyclingWord() {
    const el = document.querySelector("[data-footer-cycling-word]");
    if (!el) return;
    // Words live in the HTML: <span data-footer-cycling-word data-words="design|build|create">
    const words = (el.getAttribute("data-words") || "").split("|").map((w) => w.trim()).filter(Boolean);
    if (words.length < 2) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return; // leave the first word static

    const SWAP_INTERVAL_MS = 2200;
    const FADE_DURATION_MS = 300;
    let index = 0;

    window.setInterval(() => {
      index = (index + 1) % words.length;
      el.classList.add("is-swapping");
      window.setTimeout(() => {
        el.textContent = words[index];
        el.classList.remove("is-swapping");
      }, FADE_DURATION_MS);
    }, SWAP_INTERVAL_MS);
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderClientLogos();
    autoTagRevealElements();
    initScrollReveal();
    initFooterCyclingWord();
  });
})();
