/* Pause-animations control (WCAG 2.2.2) + "(opens in a new tab)" hints. */
(function () {
  "use strict";
  var root = document.documentElement;
  function store(v) { try { v ? localStorage.setItem("motion", v) : localStorage.removeItem("motion"); } catch (e) {} }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector("[data-motion-toggle]");
    function paint() {
      var paused = root.getAttribute("data-motion") === "paused";
      if (btn) { btn.setAttribute("aria-pressed", String(paused)); btn.textContent = paused ? "Resume animations" : "Pause animations"; }
    }
    if (btn) {
      btn.addEventListener("click", function () {
        var paused = root.getAttribute("data-motion") === "paused";
        if (paused) { root.removeAttribute("data-motion"); store(null); }
        else { root.setAttribute("data-motion", "paused"); store("paused"); }
        paint();
      });
      paint();
    }
    document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
      if (a.querySelector(".visually-hidden") || a.hasAttribute("aria-label")) return;
      var s = document.createElement("span");
      s.className = "visually-hidden"; s.textContent = " (opens in a new tab)";
      a.appendChild(s);
    });
  });
})();
