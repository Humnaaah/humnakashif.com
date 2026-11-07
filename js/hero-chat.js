/* ==========================================================================
   HERO-CHAT.JS
   The floating "Ask Humna's AI" chat in the hero.
     - The first Q&A is plain HTML in index.html (readable without JS).
       This script replays it once as a live demo (typed question ->
       typing dots -> answer), unless the visitor prefers reduced motion.
     - Suggested chips and the input call window.portfolioCopilot (the same
       engine as the floating panel, js/copilot.js), so answers always come
       from data/content.js. Nothing is invented and no network call is made.
     - Gentle pointer parallax on fine pointers.
     - The sitewide "Ask my AI" launcher tucks away while this chat is on
       screen, and returns once the hero scrolls out of view.
   ========================================================================== */

(function () {
  "use strict";

  const TYPE_MS = 28;

  function init() {
    const root = document.querySelector("[data-hchat]");
    if (!root) return;

    const log = root.querySelector("[data-hchat-log]");
    const form = root.querySelector("[data-hchat-form]");
    const input = root.querySelector("[data-hchat-input]");
    const chips = root.querySelector("[data-hchat-chips]");
    let paused = false; try { paused = localStorage.getItem("motion") === "paused"; } catch (e) {}
    const reduced = paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = () => window.portfolioCopilot;

    let demoStopped = false;
    const sleep = (ms) => new Promise((r) => window.setTimeout(r, ms));
    const toBottom = () => { log.scrollTop = log.scrollHeight; };

    function el(tag, cls, html) {
      const node = document.createElement(tag);
      if (cls) node.className = cls;
      if (html != null) node.innerHTML = html;
      return node;
    }

    function userMsg(text) {
      const m = el("div", "hmsg hmsg--user");
      const p = document.createElement("p");
      p.textContent = text;
      m.appendChild(p);
      log.appendChild(m);
      toBottom();
    }

    function typing() {
      const t = el("div", "hmsg hmsg--ai hmsg--typing", "<i></i><i></i><i></i>");
      t.setAttribute("aria-hidden", "true");
      log.appendChild(t);
      toBottom();
      return t;
    }

    function go(target) {
      if (!target) return;
      if (/^https?:|^mailto:/.test(target)) { window.open(target, "_blank", "noopener"); return; }
      const node = document.querySelector(target);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // response = { text (HTML built by copilot.js with escaping), actions?, followups? }
    function aiMsg(response) {
      const m = el("div", "hmsg hmsg--ai");
      m.appendChild(el("div", "hmsg__text", response.text));
      (response.actions || []).forEach((a) => {
        const b = el("button", "hmsg__action");
        b.type = "button";
        b.innerHTML = "";
        b.appendChild(document.createTextNode(a.label + " "));
        b.appendChild(el("span", null, "→"));
        b.addEventListener("click", () => go(a.href || a.target));
        m.appendChild(b);
      });
      log.appendChild(m);
      toBottom();
      return m;
    }

    // reveal an element's text progressively (keeps markup, e.g. <strong>)
    async function typeReveal(node, ms) {
      if (reduced) return;
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      const parts = [];
      while (walker.nextNode()) parts.push([walker.currentNode, walker.currentNode.nodeValue]);
      parts.forEach(([n]) => { n.nodeValue = ""; });
      for (const [n, full] of parts) {
        for (let k = 1; k <= full.length; k += 2) {
          if (demoStopped && !busy) { n.nodeValue = full; break; }
          n.nodeValue = full.slice(0, k);
          toBottom();
          await sleep(ms);
        }
        n.nodeValue = full;
      }
    }

    let busy = false;

    async function ask(label, getter) {
      if (busy) return;
      busy = true;
      log.setAttribute("aria-live", "polite"); // announce replies once the visitor engages
      userMsg(label);
      const t = typing();
      await sleep(reduced ? 0 : 750);
      let res;
      try { res = await getter(); } catch (e) { res = { text: "Something went wrong. Please try again." }; }
      t.remove();
      const m = aiMsg(res);
      await typeReveal(m.querySelector(".hmsg__text"), 14);
      busy = false;
    }

    chips.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-intent]");
      if (!chip || !engine()) return;
      stopDemo();
      const id = chip.getAttribute("data-intent");
      ask(chip.getAttribute("data-q") || chip.textContent.trim(), () => engine().intent(id));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || !engine()) return;
      stopDemo();
      input.value = "";
      ask(text, () => engine().ask(text));
    });

    /* ---- replay the seeded example as a live demo ---- */
    function stopDemo() { demoStopped = true; }
    input.addEventListener("focus", stopDemo);

    async function playDemo() {
      const seeds = Array.from(log.querySelectorAll("[data-seed]"));
      if (seeds.length < 2 || reduced) return;
      const question = seeds[0].textContent.trim();
      const answer = seeds[1];
      seeds.forEach((s) => s.remove());

      await sleep(900);
      if (demoStopped) { seeds.forEach((s) => log.appendChild(s)); return; }

      // "type" the question into the input like a visitor would
      for (let i = 1; i <= question.length; i++) {
        if (demoStopped) break;
        input.value = question.slice(0, i);
        await sleep(TYPE_MS);
      }
      if (demoStopped) { input.value = ""; seeds.forEach((s) => log.appendChild(s)); return; }
      await sleep(350);
      input.value = "";
      userMsg(question);
      const t = typing();
      await sleep(1100);
      t.remove();
      if (demoStopped) { log.appendChild(answer); return; }
      answer.classList.remove("hmsg--ai-seed");
      answer.removeAttribute("data-seed");
      log.appendChild(answer);
      toBottom();
      await typeReveal(answer.querySelector(".hmsg__text"), 16);
    }

    playDemo();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
