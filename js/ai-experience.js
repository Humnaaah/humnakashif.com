/* AI section: accessible tabs + Accept / Edit / Dismiss feedback. */
(function () {
  "use strict";
  var MESSAGES = {
    accept: "Applied. You can undo this at any time.",
    edit: "Editing: change any tag and the result updates.",
    dismiss: "Dismissed. Nothing was changed."
  };

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-ai-ux]");
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));

    function select(i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, n) {
        var on = n === i;
        p.hidden = !on;
        p.classList.remove("is-in");
        if (on) {
          void p.offsetWidth;
          p.classList.add("is-in");
          var st = p.querySelector("[data-ai-status]");
          if (st) st.textContent = "";
          Array.prototype.forEach.call(p.querySelectorAll(".ai-ux__btn"), function (b) { b.classList.remove("is-chosen"); });
        }
      });
      if (focus) tabs[i].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowRight") n = (i + 1) % tabs.length;
        else if (k === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
        else if (k === "Home") n = 0;
        else if (k === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });

    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var panel = b.closest('[role="tabpanel"]');
      Array.prototype.forEach.call(panel.querySelectorAll(".ai-ux__btn"), function (x) { x.classList.remove("is-chosen"); });
      b.classList.add("is-chosen");
      var st = panel.querySelector("[data-ai-status]");
      if (st) st.textContent = MESSAGES[b.getAttribute("data-act")] || "";
    });
  });
})();
