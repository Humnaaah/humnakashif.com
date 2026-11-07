/* TESTIMONIALS.JS: highlighted quote + scrollable list; arrows, click and keyboard. */
(function () {
  "use strict";
  var feat = document.querySelector("[data-tfeature]");
  if (!feat) return;
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-tcard]"));
  var track = document.querySelector("[data-ttrack]");
  var quote = feat.querySelector("[data-tf-quote]"), topic = feat.querySelector("[data-tf-topic]");
  var name = feat.querySelector("[data-tf-name]"), role = feat.querySelector("[data-tf-role]");
  var count = feat.querySelector("[data-tf-count]"), avatar = feat.querySelector(".tcard__avatar");
  var cur = 0;
  function init(s) { var m = String(s).replace(/[\[\]]/g, "").match(/\b\w/g); return (m ? m.slice(0, 2).join("") : "•").toUpperCase(); }
  function show(i, scroll) {
    cur = (i + cards.length) % cards.length;
    var c = cards[cur];
    quote.textContent = "“" + c.dataset.quote + "”";
    topic.textContent = c.dataset.topic; name.textContent = c.dataset.name; role.textContent = c.dataset.role;
    avatar.textContent = init(c.dataset.name);
    count.textContent = (cur + 1) + " / " + cards.length;
    cards.forEach(function (x, k) { x.classList.toggle("is-active", k === cur); x.setAttribute("aria-pressed", k === cur ? "true" : "false"); });
    feat.classList.remove("is-swap"); void feat.offsetWidth; feat.classList.add("is-swap");
    if (scroll && track) { var li = cards[cur].parentElement; track.scrollTo({ left: li.offsetLeft - track.offsetLeft - 8, behavior: "smooth" }); }
  }
  cards.forEach(function (c, i) { c.addEventListener("click", function () { show(i, false); }); });
  feat.querySelector("[data-tf-prev]").addEventListener("click", function () { show(cur - 1, true); });
  feat.querySelector("[data-tf-next]").addEventListener("click", function () { show(cur + 1, true); });
})();
