/* Reveal the résumé download only if the PDF actually exists. */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var link = document.querySelector("[data-resume-link]");
    if (!link || !window.fetch) return;
    fetch(link.getAttribute("href"), { method: "HEAD" }).then(function (r) {
      var type = r.headers.get("content-type") || "";
      if (r.ok && /pdf/i.test(type)) link.hidden = false;
    }).catch(function () {});
  });
})();
