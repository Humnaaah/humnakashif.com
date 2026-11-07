/* ==========================================================================
   CONTACT-SLIDER.JS
   Renders the closing contact section's marquee phrases from
   data/content.js (`portfolio.contact.marquee`), duplicated into two
   identical groups per the seamless-loop technique used by every
   other marquee on the site (see animations.css). Kept as its own
   small file rather than folded into animations.js since it owns a
   distinct piece of content (contact prompts, not clients/logos).
   ========================================================================== */

(function () {
  "use strict";

  const SEPARATOR_SVG =
    '<svg class="contact-slider__phrase-mark" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" /></svg>';

  function renderContactMarquee() {
    const track = document.querySelector("[data-contact-marquee-track]");
    if (!track) return;
    if (track.children.length) return; // marquee is written in the HTML (edit it there)
    if (typeof portfolio === "undefined" || !portfolio.contact || !Array.isArray(portfolio.contact.marquee)) {
      console.warn("contact-slider.js: no `portfolio.contact.marquee` array found in data/content.js.");
      return;
    }

    function buildGroup() {
      const group = document.createElement("div");
      group.className = "marquee__group";
      portfolio.contact.marquee.forEach((phrase) => {
        const span = document.createElement("span");
        span.className = "contact-slider__phrase";
        span.textContent = phrase;
        group.appendChild(span);
        group.insertAdjacentHTML("beforeend", SEPARATOR_SVG);
      });
      return group;
    }

    // Two identical groups — animating the track to translateX(-50%)
    // and looping back to 0% lines the second group up exactly where
    // the first started, so the loop point is invisible.
    track.appendChild(buildGroup());
    track.appendChild(buildGroup());
  }

  document.addEventListener("DOMContentLoaded", renderContactMarquee);
})();
