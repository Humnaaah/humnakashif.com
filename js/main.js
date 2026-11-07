/* ==========================================================================
   MAIN.JS
   Current responsibilities:
     1. Hydrate simple/scalar text content from data/content.js via
        [data-bind="path.to.field"] attributes.
     2. Trigger the hero's page-load entrance animation.
     3. Structural (non-animated) FAQ accordion open/close.

   Mobile nav lives in js/navigation.js, project cards in js/projects.js,
   the testimonial carousel in js/testimonials.js, the tech stack/service
   list in js/services.js, and the work-history tabs (including the
   "Show all" control) in js/experience.js — each section's interactive
   behavior travels with its own module per the file architecture.

   Remaining list-driven sections (pricing, blog) stay as static
   reference markup in the HTML for now, pending their own phases.
   ========================================================================== */

(function () {
  "use strict";

  /**
   * Resolve a dot-notation path ("hero.headline") against the global
   * `portfolio` object defined in data/content.js.
   */
  function resolvePath(path, source) {
    return path
      .split(".")
      .reduce((value, key) => (value == null ? undefined : value[key]), source);
  }

  /**
   * Hydrate every element with a [data-bind] attribute using the
   * matching value from data/content.js. Links (<a>) get their
   * visible text bound the same way; if the element is an <a> whose
   * bound value looks like a URL, this only touches textContent —
   * hrefs are left to the markup/author intentionally, since several
   * links (mailto:, anchors) need exact formatting.
   */
  function hydrateContent() {
    if (typeof portfolio === "undefined") {
      console.warn("main.js: `portfolio` data object not found. Was data/content.js loaded first?");
      return;
    }

    const boundElements = document.querySelectorAll("[data-bind]");

    boundElements.forEach((el) => {
      const path = el.getAttribute("data-bind");
      const value = resolvePath(path, portfolio);

      if (typeof value === "string" && value.length > 0) {
        el.textContent = value;
      }
    });
  }

  /**
   * Hero entrance animation trigger. Adds `.is-revealed` on load so
   * hero.css's staggered fade/rise keyframes (headline, description,
   * CTA, proof row) play once, on first paint. A short delay lets the
   * browser finish its initial layout pass so the animation doesn't
   * appear to start mid-flight on slower devices.
   */
  function initHeroReveal() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    requestAnimationFrame(() => {
      hero.classList.add("is-revealed");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateContent();
    initHeroReveal();
  });
})();
