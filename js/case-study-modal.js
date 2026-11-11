/* ==========================================================================
   CASE-STUDY-MODAL.JS
   Opens a project's PDF case study in an accessible popup.
   Any link with [data-case-study="path/to.pdf"] (and optional
   data-case-study-title) opens it. Without JS the link simply opens the
   PDF, so nothing breaks. Browsers that can't display PDFs inline
   (most phones) get a clear "open / download" panel instead.
   ========================================================================== */

(function () {
  "use strict";

  let dialog, titleEl, bodyEl, openLink, downloadLink, closeBtn;
  let lastTrigger = null;
  let open = false;

  function build() {
    dialog = document.createElement("div");
    dialog.className = "cs-modal";
    dialog.hidden = true;
    dialog.innerHTML =
      '<div class="cs-modal__backdrop" data-cs-close></div>' +
      '<div class="cs-modal__panel" role="dialog" aria-modal="true" aria-labelledby="cs-modal-title">' +
      '<header class="cs-modal__header">' +
      '<div><p class="cs-modal__eyebrow">Case study</p><h2 id="cs-modal-title" class="cs-modal__title"></h2></div>' +
      '<div class="cs-modal__actions">' +
      '<a class="cs-modal__btn" data-cs-open target="_blank" rel="noopener">Open in new tab</a>' +
      '<a class="cs-modal__btn" data-cs-download download>Download</a>' +
      '<button type="button" class="cs-modal__close" data-cs-close aria-label="Close case study">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      "</button></div></header>" +
      '<div class="cs-modal__body" data-cs-body></div>' +
      "</div>";
    document.body.appendChild(dialog);

    titleEl = dialog.querySelector(".cs-modal__title");
    bodyEl = dialog.querySelector("[data-cs-body]");
    openLink = dialog.querySelector("[data-cs-open]");
    downloadLink = dialog.querySelector("[data-cs-download]");
    closeBtn = dialog.querySelector(".cs-modal__close");

    dialog.addEventListener("click", (e) => {
      if (e.target.closest("[data-cs-close]")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (open && e.key === "Escape") close();
    });
    if (window.a11y && window.a11y.trapFocus) {
      window.a11y.trapFocus(dialog.querySelector(".cs-modal__panel"), () => open);
    }
  }

  function show(url, title, trigger) {
    if (!dialog) build();
    lastTrigger = trigger || null;
    titleEl.textContent = title || "Case study";
    openLink.href = url;
    downloadLink.href = url;

    const canEmbed = navigator.pdfViewerEnabled !== false;
    const isImage = /\.(webp|png|jpe?g|gif|avif|svg)(\?|#|$)/i.test(url);
    bodyEl.innerHTML = "";


      if (isImage) {
      const img = document.createElement("img");
      img.className = "cs-modal__image";
      img.src = url;
      img.alt = (title || "Case study") + " overview";
      bodyEl.appendChild(img);
    } else if (canEmbed) {
      const frame = document.createElement("iframe");
      frame.className = "cs-modal__frame";
      frame.title = (title || "Case study") + " (PDF)";
      frame.src = url + "#toolbar=0&navpanes=0&view=FitH";
      bodyEl.appendChild(frame);
    } else {
      const fallback = document.createElement("div");
      fallback.className = "cs-modal__fallback";
      fallback.innerHTML =
        "<p>Your browser can\u2019t show PDFs inside the page.</p>" +
        '<a class="btn btn--primary" href="' + url + '" target="_blank" rel="noopener">Open case study</a>';
      bodyEl.appendChild(fallback);
    }

     
    dialog.hidden = false;
    document.documentElement.classList.add("cs-lock");
    // next frame so the transition runs
    requestAnimationFrame(() => dialog.classList.add("is-open"));
    open = true;
    closeBtn.focus();
  }

  function close() {
    if (!open) return;
    open = false;
    dialog.classList.remove("is-open");
    document.documentElement.classList.remove("cs-lock");
    window.setTimeout(() => {
      if (!open) {
        dialog.hidden = true;
        bodyEl.innerHTML = ""; // stop the PDF from running in the background
      }
    }, 250);
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-case-study]");
    if (!trigger) return;
    // let ctrl/cmd/shift/middle-click behave like a normal link
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    show(
      trigger.getAttribute("data-case-study"),
      trigger.getAttribute("data-case-study-title"),
      trigger
    );
  });

  window.caseStudyModal = { open: show, close: close };
})();
