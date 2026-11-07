/* FAQ accordion: one item open at a time, animated via .is-open */
(function () {
  "use strict";

  const COLLAPSE_TRANSITION_MS = 350;

  function closeFaq(trigger) {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    trigger.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    window.setTimeout(function () {
      if (!panel.classList.contains("is-open")) panel.hidden = true;
    }, COLLAPSE_TRANSITION_MS);
  }

  function openFaq(trigger) {
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () {
      panel.classList.add("is-open");
    });
  }

  function initFaqAccordion() {
    const triggers = Array.from(document.querySelectorAll("[data-faq-trigger]"));

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closeFaq(trigger);
          return;
        }
        // Close every other open item first
        triggers.forEach(function (other) {
          if (other !== trigger && other.getAttribute("aria-expanded") === "true") {
            closeFaq(other);
          }
        });
        openFaq(trigger);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initFaqAccordion);
})();