/* ==========================================================================
   THEME.JS
   Light/dark mode toggle.

   Initial theme resolution (localStorage → prefers-color-scheme →
   light default) happens in a small inline script in index.html's
   <head>, before any stylesheet loads — that part MUST run
   synchronously and before first paint to avoid a flash of the wrong
   theme, which an external deferred script can't guarantee. This file
   only handles the toggle button's behavior after the DOM is ready:
   click handling, persisting the choice, updating aria-label, and
   listening for OS-level theme changes when the user hasn't made an
   explicit choice yet.
   ========================================================================== */

(function () {
  "use strict";

  const TRANSITION_CLASS = "theme-transitioning";
  const TRANSITION_DURATION_MS = 400;

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function setTheme(theme, persist) {
    const root = document.documentElement;

    // Briefly enable the uniform cross-fade transition (see base.css),
    // then remove it once the switch has visually settled so it
    // doesn't affect any other transition on the page afterward.
    root.classList.add(TRANSITION_CLASS);
    window.setTimeout(() => {
      root.classList.remove(TRANSITION_CLASS);
    }, TRANSITION_DURATION_MS);

    root.setAttribute("data-theme", theme);

    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        // Storage unavailable (privacy mode) — theme still applies
        // for this page view, it just won't persist across reloads.
      }
    }

    updateToggleLabel(theme);
  }

  // function updateToggleLabel(theme) {
  //   const button = document.querySelector("[data-theme-toggle]");
  //   if (!button) return;
  //   button.setAttribute(
  //     "aria-label",
  //     theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  //   );
  // }
function updateToggleLabel(theme) {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  });
}
function initToggle() {
  const buttons = document.querySelectorAll("[data-theme-toggle]");
  if (!buttons.length) return;

  updateToggleLabel(getCurrentTheme());

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = getCurrentTheme() === "dark" ? "light" : "dark";
      setTheme(next, true);
    });
  });
}
  // function initToggle() {
  //   const button = document.querySelector("[data-theme-toggle]");
  //   if (!button) return;

  //   // Sync the label with whatever the no-FOUC inline script already
  //   // resolved before this file ran.
  //   updateToggleLabel(getCurrentTheme());

  //   button.addEventListener("click", () => {
  //     const next = getCurrentTheme() === "dark" ? "light" : "dark";
  //     setTheme(next, true);
  //   });
  // }

  /**
   * If the person has never explicitly chosen a theme (no localStorage
   * value), keep following the OS-level setting live — e.g. if their
   * system switches to dark mode at sunset, the page follows. The
   * moment they click the toggle, setTheme() persists an explicit
   * choice and this listener's updates are moot for them going
   * forward (localStorage always wins over the OS on next load, per
   * the inline script's own priority order).
   */
  function initSystemPreferenceListener() {
    let hasStoredChoice = false;
    try {
      hasStoredChoice = localStorage.getItem("theme") !== null;
    } catch (e) {
      hasStoredChoice = false;
    }

    if (hasStoredChoice || !window.matchMedia) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setTheme(event.matches ? "dark" : "light", false);
    };

    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
    } else if (media.addListener) {
      // Safari < 14 fallback
      media.addListener(handleChange);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initToggle();
    initSystemPreferenceListener();
  });
})();
