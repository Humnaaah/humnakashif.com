/* ==========================================================================
   A11Y-UTILS.JS
   Small shared accessibility helpers used by any overlay/panel pattern
   on the site (the AI Copilot dialog, the mobile nav drawer). Kept
   framework-free and dependency-free so it can be dropped into any
   page that needs it.
   ========================================================================== */

(function () {
  "use strict";

  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), ' +
    'select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /**
   * Traps Tab/Shift+Tab focus within `container` while `isActive()`
   * returns true. Returns a cleanup function that removes the
   * listener — call it when the panel/drawer closes.
   *
   * This does NOT move focus on its own (the caller decides when to
   * focus the panel and when to return focus to the trigger); it only
   * stops Tab from escaping to the rest of the page while active,
   * which is what `aria-modal="true"` promises assistive tech.
   */
  window.a11y = window.a11y || {};

  window.a11y.trapFocus = function trapFocus(container, isActive) {
    function handleKeydown(event) {
      if (event.key !== "Tab" || !isActive()) return;

      const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null // skip hidden elements
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      } else if (!container.contains(current)) {
        // Focus somehow landed outside the container (e.g. the user
        // clicked elsewhere) — pull it back in rather than letting Tab
        // continue from an unpredictable place.
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeydown);
    };
  };
})();
