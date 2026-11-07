/* ==========================================================================
   NAVIGATION.JS
   Everything specific to the navbar:
     1. Scroll-state background/blur toggle (.is-scrolled).
     2. Mobile drawer open/close, including the staggered link reveal
        (handled by adding/removing .is-open — the actual stagger
        timing lives in navigation.css via nth-child transition-delay).

   Split out of main.js now that the navbar has real motion behavior
   attached to it, per the file architecture.
   ========================================================================== */

(function () {
  "use strict";

  // Hysteresis: collapse past 96px, only re-expand back near the top (<24px).
  // A single 8px threshold made the pill flip back and forth while scrolling.
  const COLLAPSE_AT = 96;
  const EXPAND_AT = 24;

  function initScrollState() {
    const nav = document.querySelector("[data-nav]");
    if (!nav) return;

    let ticking = false;

    function updateScrollState() {
      ticking = false;
      const y = window.scrollY;
      const scrolled = nav.classList.contains("is-scrolled");
      if (!scrolled && y > COLLAPSE_AT) nav.classList.add("is-scrolled");
      else if (scrolled && y < EXPAND_AT) nav.classList.remove("is-scrolled");
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollState);
      }
    }

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileDrawer() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav-mobile]");
    if (!toggle || !menu) return;

    let isMenuOpen = false;
    let releaseFocusTrap = null;

    function openMenu() {
      menu.hidden = false;
      isMenuOpen = true;
      // Force layout so the browser registers `hidden` being removed
      // before the `.is-open` transition classes are applied.
      requestAnimationFrame(() => {
        menu.classList.add("is-open");
      });
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");

      const firstLink = menu.querySelector("a");
      if (firstLink) window.setTimeout(() => firstLink.focus(), 200);
      if (window.a11y && window.a11y.trapFocus) {
        releaseFocusTrap = window.a11y.trapFocus(menu, () => isMenuOpen);
      }
    }

    function closeMenu() {
      menu.classList.remove("is-open");
      isMenuOpen = false;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      if (releaseFocusTrap) {
        releaseFocusTrap();
        releaseFocusTrap = null;
      }

      // Wait for the collapse transition (max-height) before hiding,
      // so the drawer visibly closes instead of snapping away.
      const DRAWER_TRANSITION_MS = 350;
      window.setTimeout(() => {
        if (!menu.classList.contains("is-open")) {
          menu.hidden = true;
        }
      }, DRAWER_TRANSITION_MS);
    }

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape for keyboard users.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });
  }

  function initMoreMenu() {
    const wrap = document.querySelector("[data-nav-more-wrap]");
    const trigger = document.querySelector("[data-nav-more]");
    const menu = document.querySelector("[data-nav-more-menu]");
    if (!wrap || !trigger || !menu) return;

    function closeMenu() {
      trigger.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      trigger.setAttribute("aria-expanded", "true");
    }

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!wrap.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
        closeMenu();
        trigger.focus();
      }
    });

    // If the pill un-collapses (scrolled back to top) while the
    // dropdown happens to be open, close it so it doesn't linger
    // detached from the (now hidden) "•••" trigger.
    const nav = document.querySelector("[data-nav]");
    if (nav) {
      const collapseObserver = new MutationObserver(() => {
        if (!nav.classList.contains("is-scrolled")) closeMenu();
      });
      collapseObserver.observe(nav, { attributes: true, attributeFilter: ["class"] });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initScrollState();
    initMobileDrawer();
    initMoreMenu();
  });
})();
