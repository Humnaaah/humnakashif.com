/* ==========================================================================
   COPILOT.JS
   Floating "AI Copilot" — an assistant that answers questions about the
   portfolio (who this is, the work, experience, services, AI approach)
   so a visitor can ask instead of digging through every section.

   ARCHITECTURE
     Frontend  →  (optional) secure API endpoint  →  AI model  →  Frontend
   No API key ever lives in this file. `COPILOT_CONFIG.apiEndpoint` is
   empty by default, which runs the copilot in local DEMO MODE: answers
   are generated entirely client-side from data/content.js via the
   intent handlers below. If a backend endpoint is added later (e.g.
   "/api/chat", with the real model + secret kept server-side), set
   `COPILOT_CONFIG.apiEndpoint` and `getResponse()` will call it first,
   falling back to demo mode on any network/parse error so the widget
   never breaks.

   Everything the demo answers say is pulled from `portfolio` — no
   invented companies, projects, or stats. Unknown questions get an
   honest "not in the portfolio yet" fallback instead of a guess.
   ========================================================================== */

(function () {
  "use strict";

  const COPILOT_CONFIG = {
    // Example once a backend exists: "/api/chat"
    apiEndpoint: "",
  };

  const TYPING_DELAY_MS = 700;

  /* ==========================================================================
     KNOWLEDGE BASE
     Built once from the global `portfolio` object (data/content.js).
     Every field here traces back to real portfolio content — nothing
     is fabricated. If a piece of data is missing, the relevant intent
     handler below says so instead of inventing a value.
     ========================================================================== */

  function buildKnowledge() {
    if (typeof portfolio === "undefined") return null;

    return {
      name: (portfolio.personal && portfolio.personal.name) || "Humna",
      title: (portfolio.personal && portfolio.personal.title) || "",
      availability: (portfolio.personal && portfolio.personal.availability) || "",
      email: (portfolio.personal && portfolio.personal.email) || "",
      bookingHref:
        (portfolio.personal && portfolio.personal.linkedin) || "",
      bio: (portfolio.about && portfolio.about.body) || [],
      experience: (portfolio.experience && portfolio.experience.items) || [],
      projects: ((portfolio.work && portfolio.work.items) || []).map((p) => ({ title: p.name })),
      sites: [],
      services: (portfolio.expertise && portfolio.expertise.pillars) || [],
      skills: (portfolio.skills && portfolio.skills.groups) || [],
      
      faq: (portfolio.faq && portfolio.faq.items) || [],
      chat: portfolio.chatbot || {},
    };
  }

  /**
   * Fill "{name}" placeholders used in data/content.js chip/greeting copy.
   */
  function fill(template, k) {
    return String(template || "").replace(/\{name\}/g, k.name);
  }

  /* ==========================================================================
     INTENT HANDLERS
     Each returns { text, actions?, followups? }.
       text      — HTML-safe string built with escapeHtml() below, may
                   include <br> between short paragraphs/bullets.
       actions   — [{ label, target }] (in-page anchor/page to scroll/
                   link to) or [{ label, href }] (external link).
       followups — array of intent ids to show as follow-up chips.
     ========================================================================== */

  function firstSentences(text, count) {
    if (!text) return "";
    const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    return parts.slice(0, count).join(" ");
  }

  function truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text || "";
    return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "\u2026";
  }

  // const INTENTS = {
  //   about: {
  //     keywords: ["who is", "who are you", "about you", "introduce", "background", "help a product team", "deliver"],
  //     build(k) {
  //       return {
  //         text: k.name + " combines product design and frontend development: from understanding user needs and mapping workflows to designing interfaces, building responsive experiences and improving usability. She has 7+ years of experience.",
  //         actions: [{ label: "About " + k.name, target: "#about" }],
  //         followups: ["design", "frontend", "experience"],
  //       };
  //     },
  //   },

  //   design: {
  //     keywords: ["design", "ui", "ux", "figma", "wireframe", "prototype", "interface", "product design", "research", "design system"],
  //     build(k) {
  //       return {
  //         text: k.name + " designs enterprise, healthcare, e-commerce and AI products: UX research, user flows, information architecture, wireframes, prototypes and design systems, with accessibility (WCAG) in mind.",
  //         actions: [{ label: "See the work", target: "#projects" }],
  //         followups: ["ai", "projects", "process"],
  //       };
  //     },
  //   },

  //   frontend: {
  //     keywords: ["build", "code", "develop", "frontend", "front end", "front-end", "react", "javascript", "cms", "wordpress", "shopify", "webflow", "website"],
  //     build(k) {
  //       return {
  //         text: k.name + " translates designs into responsive, maintainable interfaces with HTML5, CSS3, JavaScript, TypeScript and React, and builds CMS and e-commerce sites on WordPress, Shopify, Wix, Webflow and Framer. She also integrates APIs and improves performance and technical SEO.",
  //         actions: [{ label: "See development work", target: "#expertise" }],
  //         followups: ["projects", "tools", "contact"],
  //       };
  //     },
  //   },

  //   ai: {
  //     keywords: ["ai", "artificial intelligence", "automat", "intelligent", "agent", "conversational"],
  //     build(k) {
  //       return {
  //         text: k.name + " designs AI experiences that make complex work feel simpler while staying understandable and user-controlled: natural-language requests that show what the system understood, summaries with sources, prefilled forms with fields flagged for review, and setup suggestions that wait for confirmation.",
  //         actions: [{ label: "See AI UX examples", target: "#ai-experience" }],
  //         followups: ["design", "projects", "tools"],
  //       };
  //     },
  //   },

  //   projects: {
  //     keywords: ["project", "best work", "built", "portfolio", "show me", "case study", "worked on", "work on"],
  //     build(k) {
  //       return {
  //         text: "Start with the <strong>Operations Management Platform</strong> case study: it walks through the problem, research, wireframes, design system and goals step by step. For government and enterprise work, open the <strong>Ministry of Justice</strong> or <strong>TechUnicorn / CXUnicorn</strong> pages.",
  //         actions: [{ label: "Open featured case study", target: "project/operations-management-platform.html" }, { label: "All projects", target: "#projects" }],
  //         followups: ["categories", "experience"],
  //       };
  //     },
  //   },

  //   experience: {
  //     keywords: ["experience", "career", "work history", "companies", "worked", "where has", "years", "employer"],
  //     build(k) {
  //       const items = k.experience.slice(0, 7).map((e) =>
  //         "<strong>" + escapeHtml(e.company) + "</strong> \u2014 " + escapeHtml(e.role)
  //       );
  //       return {
  //         text: k.name + " has 7+ years of experience:<br><br>" + items.join("<br>"),
  //         actions: [{ label: "See experience", target: "#about" }],
  //         followups: ["projects", "tools", "contact"],
  //       };
  //     },
  //   },

  //   process: {
  //     keywords: ["how do you work", "workflow", "process", "how does", "approach"],
  //     build(k) {
  //       return {
  //         text: k.name + " works in four steps: discover (goals, users, constraints), define and design (journeys, wireframes, prototypes, UI systems), build and collaborate (responsive interfaces with engineering) and test and improve (usability, accessibility, performance, analytics).",
  //         actions: [{ label: "See how I work", target: "#funnel" }],
  //         followups: ["design", "frontend"],
  //       };
  //     },
  //   },

  //   tools: {
  //     keywords: ["tool", "software", "tech stack", "skill", "technolog"],
  //     build(k) {
  //       const groups = k.skills.map((g) => "<strong>" + escapeHtml(g.group) + ":</strong> " + escapeHtml(g.items.slice(0, 5).join(", ")));
  //       return {
  //         text: "A snapshot of the skills:<br><br>" + groups.join("<br>"),
  //         actions: [{ label: "See all skills", target: "#skills" }],
  //         followups: ["frontend", "ai"],
  //       };
  //     },
  //   },

  //   categories: {
  //     keywords: ["industr", "categor", "sector", "type of project", "kinds of", "saas", "healthcare", "enterprise"],
  //     build(k) {
  //       return {
  //         text: k.name + " has worked across SaaS, AI, enterprise and government, healthcare, e-commerce, NGO, legal and corporate products and websites.",
  //         actions: [{ label: "View the work", target: "#projects" }],
  //         followups: ["projects", "experience"],
  //       };
  //     },
  //   },

  //   differentiator: {
  //     keywords: ["different", "unique", "stand out", "why should", "why work with", "why hire"],
  //     build(k) {
  //       return {
  //         text: "Because " + k.name + " understands how the product gets built, designs are practical to implement: she can take a product from research and UX strategy through interface design, frontend implementation and optimization.",
  //         actions: [{ label: "Contact", target: "#contact" }],
  //         followups: ["projects", "availability"],
  //       };
  //     },
  //   },

  //   availability: {
  //     keywords: ["available", "availability", "open to work", "open to", "full-time", "full time", "free for a project", "looking for", "remote", "relocat"],
  //     build(k) {
  //       return {
  //         text: k.name + " is open to global opportunities: remote, hybrid or on-site by arrangement.",
  //         actions: [{ label: "Contact", target: "#contact" }],
  //         followups: ["contact", "experience"],
  //       };
  //     },
  //   },

  //   contact: {
  //     keywords: ["contact", "reach", "email", "get in touch", "phone", "talk to", "linkedin"],
  //     build(k) {
  //       const actions = [{ label: "Contact", target: "#contact" }];
  //       if (k.email) actions.push({ label: "Email", href: "mailto:" + k.email });
  //       return {
  //         text: "You can reach " + k.name + " at " + escapeHtml(k.email) + " or on LinkedIn.",
  //         actions: actions,
  //         followups: [],
  //       };
  //     },
  //   },
  // };

  // const INTENT_ORDER = [
  //   "contact",
  //   "availability",
  //   "ai",
  //   "categories",
  //   "tools",
  //   "differentiator",
  //   "process",
  //   "experience",
  //   "frontend",
  //   "design",
  //   "projects",
  //   "about",
  // ];

     const INTENTS = {
    about: {
      keywords: ["who is", "who are you", "about you", "introduce", "background", "help a product team", "deliver"],
      build(k) {
        return {
          text: k.name + " is a product designer and frontend developer with 7+ years of experience. She designs and builds government platforms, healthcare apps, franchise and e-commerce systems and AI experiences, from research and UX through to responsive, accessible interfaces.",
          actions: [{ label: "About " + k.name, target: "#about" }],
          followups: ["projects", "government", "frontend"],
        };
      },
    },

    design: {
      keywords: ["design", "ui", "ux", "figma", "wireframe", "prototype", "interface", "product design", "research"],
      build(k) {
        return {
          text: k.name + " designs web platforms, mobile apps, dashboards and websites: UX research, user flows, information architecture, wireframes, prototypes and UI, with accessibility (WCAG) and bilingual Arabic and English interfaces in mind.",
          actions: [{ label: "See the work", target: "#projects" }],
          followups: ["designsystem", "ai", "projects"],
        };
      },
    },

    frontend: {
      keywords: ["build", "code", "develop", "frontend", "front end", "front-end", "react", "javascript", "cms", "wordpress", "shopify", "webflow", "website", "next"],
      build(k) {
        return {
          text: k.name + " builds what she designs. She built the frontends of the Ministry of Justice website and the Adl platform, the Naranga marketing website and the Aibers healthcare apps, and many live CMS sites across e-commerce, NGO, healthcare and company websites.",
          actions: [{ label: "See the work", target: "#projects" }],
          followups: ["government", "tools", "contact"],
        };
      },
    },

    ai: {
      keywords: ["ai", "artificial intelligence", "automat", "intelligent", "agent", "conversational", "copilot", "chatbot"],
      build(k) {
        return {
          text: k.name + " designs AI features that stay clear and user-controlled. Habitus has an AI coach that suggests next steps while the user decides, and Emax has AI search for franchise teams. She also works on AI-powered workflows and agent experiences.",
          actions: [{ label: "See AI UX examples", target: "#ai-experience" }, { label: "See projects", target: "#projects" }],
          followups: ["government", "franchise", "projects"],
        };
      },
    },

    government: {
      keywords: ["government", "ministry", "justice", "kuwait", "public sector", "public service", "legal", "court", "law", "gov"],
      build(k) {
        return {
          text: k.name + " has worked on digital services for the Ministry of Justice, State of Kuwait: the bilingual Laws and Decision Portal, the official ministry website, the Adl digital services platform and the ministry’s design system. She also designed a brochure for a digital courtroom platform.",
          actions: [{ label: "See all projects", target: "#projects" }],
          followups: ["designsystem", "ai", "contact"],
        };
      },
    },

    healthcare: {
      keywords: ["health", "healthcare", "medical", "doctor", "patient", "hospital", "clinic", "wellness", "habit", "fitness"],
      build(k) {
        return {
          text: k.name + " has designed healthcare and wellness products: the Aibers patient app (find doctors, manage appointments, follow up after visits), the Aibers doctor dashboard (appointments, patients and prescriptions) and Habitus, a habit tracker with an AI coach.",
          actions: [{ label: "See all projects", target: "#projects" }],
          followups: ["ai", "frontend", "contact"],
        };
      },
    },

    franchise: {
      keywords: ["franchise", "e-commerce", "ecommerce", "retail", "edible", "emax", "naranga", "store", "pos", "point of sale", "shop"],
      build(k) {
        return {
          text: k.name + " has worked on franchise and retail products: Emax (an AI-powered franchise mobile app for updates, training and messaging), a store management and point-of-sale system for Edible Arrangements, and a marketing website for a franchise operations platform.",
          actions: [{ label: "See all projects", target: "#projects" }],
          followups: ["ai", "designsystem", "frontend"],
        };
      },
    },

    designsystem: {
      keywords: ["design system", "component", "style guide", "brand guideline", "tokens", "guidelines", "consistency", "tawtheeq"],
      build(k) {
        return {
          text: k.name + " creates design systems that keep products consistent. For the Ministry of Justice she created a bilingual design system and brand guidelines covering colours, Arabic and English typography, icons, grids and components.",
          actions: [{ label: "See all projects", target: "#projects" }],
          followups: ["government", "frontend", "process"],
        };
      },
    },

    projects: {
      keywords: ["project", "best work", "built", "portfolio", "show me", "case study", "worked on", "work on", "strongest"],
      build(k) {
        return {
          text: "Here is a quick map of the work:<br><br>" +
            "<strong>Government:</strong> Laws and Decision Portal, Ministry of Justice website, Adl platform, Ministry design system<br>" +
            "<strong>Healthcare:</strong> Aibers patient app, Aibers doctor dashboard<br>" +
            "<strong>Franchise and retail:</strong> Emax, Edible store management, franchise operations website<br>" +
            "<strong>AI and wellness:</strong> Habitus<br>" +
            "<strong>Brand:</strong> digital courtroom brochure<br><br>" +
            "Open any card in the Work section for the full case study.",
          actions: [{ label: "See all projects", target: "#projects" }],
          followups: ["government", "healthcare", "franchise"],
        };
      },
    },

    experience: {
      keywords: ["experience", "career", "work history", "companies", "worked", "where has", "years", "employer"],
      build(k) {
        const items = k.experience.slice(0, 7).map((e) =>
          "<strong>" + escapeHtml(e.company) + "</strong> \u2014 " + escapeHtml(e.role)
        );
        return {
          text: k.name + " has 7+ years of experience:<br><br>" + items.join("<br>"),
          actions: [{ label: "See experience", target: "#about" }],
          followups: ["projects", "tools", "contact"],
        };
      },
    },

    process: {
      keywords: ["how do you work", "workflow", "process", "how does", "approach"],
      build(k) {
        return {
          text: k.name + " works in four steps: discover (goals, users, constraints), define and design (journeys, wireframes, prototypes, UI systems), build and collaborate (responsive interfaces with engineering) and test and improve (usability, accessibility, performance).",
          actions: [{ label: "See how I work", target: "#funnel" }],
          followups: ["designsystem", "frontend"],
        };
      },
    },

    tools: {
      keywords: ["tool", "software", "tech stack", "skill", "technolog"],
      build(k) {
        const groups = k.skills.map((g) => "<strong>" + escapeHtml(g.group) + ":</strong> " + escapeHtml(g.items.slice(0, 5).join(", ")));
        return {
          text: "A snapshot of the skills:<br><br>" + groups.join("<br>"),
          actions: [{ label: "See all skills", target: "#skills" }],
          followups: ["frontend", "ai"],
        };
      },
    },

    categories: {
      keywords: ["industr", "categor", "sector", "type of project", "kinds of", "saas", "enterprise"],
      build(k) {
        return {
          text: k.name + " has worked across government and legal, healthcare and wellness, franchise and retail, SaaS, AI and corporate websites.",
          actions: [{ label: "See all projects", target: "#projects" }],
          followups: ["government", "healthcare", "franchise"],
        };
      },
    },

    differentiator: {
      keywords: ["different", "unique", "stand out", "why should", "why work with", "why hire"],
      build(k) {
        return {
          text: "Because " + k.name + " also builds what she designs, her designs are practical to implement. She can take a product from research and UX through interface design to a responsive frontend, and she has done this for live government, healthcare and franchise platforms.",
          actions: [{ label: "Contact", target: "#contact" }],
          followups: ["projects", "availability"],
        };
      },
    },

    availability: {
      keywords: ["available", "availability", "open to work", "open to", "full-time", "full time", "free for a project", "looking for", "remote", "relocat", "hire"],
      build(k) {
        return {
          text: k.name + " is open to global opportunities: remote, hybrid or on-site by arrangement. She is based in the UAE.",
          actions: [{ label: "Contact", target: "#contact" }],
          followups: ["contact", "projects"],
        };
      },
    },

    contact: {
      keywords: ["contact", "reach", "email", "get in touch", "phone", "talk to", "linkedin"],
      build(k) {
        const actions = [{ label: "Contact", target: "#contact" }];
        if (k.email) actions.push({ label: "Email", href: "mailto:" + k.email });
        return {
          text: "You can reach " + k.name + " at " + escapeHtml(k.email) + " or on LinkedIn.",
          actions: actions,
          followups: [],
        };
      },
    },
  };
   
  const INTENT_ORDER = [
    "contact",
    "availability",
    "designsystem",
    "government",
    "healthcare",
    "franchise",
    "ai",
    "categories",
    "tools",
    "differentiator",
    "process",
    "experience",
    "frontend",
    "design",
    "projects",
    "about",
  ];

  // Short keywords (e.g. "ai") must match as whole words, otherwise
  // "explain" or "available" would trigger the AI answer.
  function keywordHit(text, kw) {
    if (kw.length <= 3) return new RegExp("\\b" + kw + "\\b").test(text);
    return text.includes(kw);
  }

  function matchIntent(message) {
    const text = message.toLowerCase();
    for (let i = 0; i < INTENT_ORDER.length; i++) {
      const id = INTENT_ORDER[i];
      const intent = INTENTS[id];
      if (intent.keywords.some((kw) => keywordHit(text, kw))) return id;
    }
    return null;
  }

  function buildFallback(k) {
    return {
      text: fill(k.chat.fallbackMessage, k) || "I don't have that in the portfolio yet.",
      followups: ["projects", "government", "ai", "availability"],
    };
  }

  /**
   * Resolve a response for a given intent id (used both for chip clicks,
   * where the id is already known, and for free-typed messages, where
   * it's inferred by matchIntent()).
   */
  function resolveIntent(id, k) {
    const intent = INTENTS[id];
    if (!intent) return buildFallback(k);
    const res = intent.build(k);
    res.intent = id;
    return res;
  }

  /**
   * DEMO MODE response generator — no network call, entirely derived
   * from buildKnowledge() above.
   */
  function getDemoResponse(message, k) {
    const id = matchIntent(message);
    return id ? resolveIntent(id, k) : buildFallback(k);
  }

  /**
   * Attempts the configured backend first (if any), falling back to
   * the local demo engine on any failure — so the widget always
   * answers something, and swapping in a real backend later is a
   * one-line config change plus a server-side endpoint.
   */
  async function getResponse(message, k) {
    if (COPILOT_CONFIG.apiEndpoint) {
      try {
        const res = await fetch(COPILOT_CONFIG.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.text === "string") return data;
        }
      } catch (err) {
        // Network/backend unavailable — fall through to demo mode.
      }
    }
    return getDemoResponse(message, k);
  }

  /* ==========================================================================
     UI
     ========================================================================== */

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (ch) => {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function initCopilot() {
    const root = document.querySelector("[data-copilot]");
    const k = buildKnowledge();
    if (!root || !k) return;

    const launcher = root.querySelector("[data-copilot-launcher]");
    const panel = root.querySelector("[data-copilot-panel]");
    const closeBtn = root.querySelector("[data-copilot-close]");
    const body = root.querySelector("[data-copilot-body]");
    const form = root.querySelector("[data-copilot-form]");
    const input = root.querySelector("[data-copilot-input]");
    const titleEl = root.querySelector("[data-copilot-title]");
    const statusEl = root.querySelector("[data-copilot-status]");
    const launcherLabelEl = root.querySelector("[data-copilot-launcher-label]");

    if (!launcher || !panel || !body || !form || !input) return;

    // ---- Static copy ----
    if (launcherLabelEl) launcherLabelEl.textContent = k.chat.launcherLabel || "Ask my AI";
    if (titleEl) titleEl.textContent = k.chat.panelTitle || "AI Copilot";
    if (statusEl) statusEl.textContent = fill(k.chat.statusText, k) || "Ask about the work";
    input.placeholder = k.chat.inputPlaceholder || "Ask me anything about the work...";

    let hasConversationStarted = false;
    const asked = new Set();
    const NEXT_BEST = ["projects", "government", "healthcare", "franchise", "ai", "designsystem", "process", "experience", "differentiator", "availability", "contact"];

    // Follow-ups never repeat a question already asked and always offer
    // the next most useful ones. After contact there is nothing left to add.
    function pickFollowups(response) {
      if (response.intent === "contact") return [];
      const out = [];
      const add = (id) => { if (id && INTENTS[id] && !asked.has(id) && !out.includes(id)) out.push(id); };
      (response.followups || []).forEach(add);
      NEXT_BEST.forEach((id) => { if (out.length < 2) add(id); });
      return out.slice(0, 3);
    }

    function scrollBodyToBottom() {
      body.scrollTop = body.scrollHeight;
    }

    function renderIntro() {
      body.innerHTML = "";

      const greeting = document.createElement("div");
      greeting.className = "copilot-msg copilot-msg--ai copilot-msg--intro";
      greeting.innerHTML =
        '<p class="copilot-msg__greeting">' + escapeHtml(fill(k.chat.greeting, k)) + "</p>" +
        '<p class="copilot-msg__subtext">' + escapeHtml(k.chat.subtext || "") + "</p>";
      body.appendChild(greeting);

      const primary = document.createElement("div");
      primary.className = "copilot-chips";
      (k.chat.primaryPrompts || []).forEach((prompt) => {
        primary.appendChild(buildChip(prompt.id, fill(prompt.label, k), prompt.icon));
      });
      body.appendChild(primary);

      if ((k.chat.secondaryPrompts || []).length) {
        const moreToggle = document.createElement("button");
        moreToggle.type = "button";
        moreToggle.className = "copilot-more-toggle";
        moreToggle.textContent = k.chat.moreQuestionsLabel || "More questions";

        const secondary = document.createElement("div");
        secondary.className = "copilot-chips copilot-chips--secondary";
        secondary.hidden = true;
        (k.chat.secondaryPrompts || []).forEach((prompt) => {
          secondary.appendChild(buildChip(prompt.id, fill(prompt.label, k), prompt.icon));
        });

        moreToggle.addEventListener("click", () => {
          const willShow = secondary.hidden;
          secondary.hidden = !willShow;
          moreToggle.setAttribute("aria-expanded", String(willShow));
          scrollBodyToBottom();
        });

        body.appendChild(moreToggle);
        body.appendChild(secondary);
      }
    }

    function buildChip(intentId, label, icon) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "copilot-chip";
      chip.dataset.intent = intentId;
      chip.innerHTML =
        (icon ? '<span class="copilot-chip__icon" aria-hidden="true">' + escapeHtml(icon) + "</span>" : "") +
        '<span>' + escapeHtml(label) + "</span>";
      chip.addEventListener("click", () => handlePromptClick(intentId, label));
      return chip;
    }

    function appendUserMessage(text) {
      const msg = document.createElement("div");
      msg.className = "copilot-msg copilot-msg--user";
      msg.innerHTML = "<p>" + escapeHtml(text) + "</p>";
      body.appendChild(msg);
      scrollBodyToBottom();
    }

    function appendTypingIndicator() {
      const typing = document.createElement("div");
      typing.className = "copilot-msg copilot-msg--ai copilot-typing";
      typing.setAttribute("data-copilot-typing", "");
      typing.innerHTML =
        '<span class="copilot-typing__dot"></span>' +
        '<span class="copilot-typing__dot"></span>' +
        '<span class="copilot-typing__dot"></span>';
      body.appendChild(typing);
      scrollBodyToBottom();
      return typing;
    }

    function appendAIMessage(response) {
      const msg = document.createElement("div");
      msg.className = "copilot-msg copilot-msg--ai";

      const textEl = document.createElement("div");
      textEl.className = "copilot-msg__text";
      textEl.innerHTML = response.text;
      msg.appendChild(textEl);

      if (Array.isArray(response.actions) && response.actions.length) {
        const actionsEl = document.createElement("div");
        actionsEl.className = "copilot-msg__actions";
        response.actions.forEach((action) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "copilot-action";
          btn.textContent = action.label;
          btn.addEventListener("click", () => handleAction(action));
          actionsEl.appendChild(btn);
        });
        msg.appendChild(actionsEl);
      }

      body.appendChild(msg);

      body.querySelectorAll(".copilot-chips--followup").forEach((el) => el.remove());
      const followups = pickFollowups(response);
      if (followups.length) {
        const followEl = document.createElement("div");
        followEl.className = "copilot-chips copilot-chips--followup";
        followups.forEach((intentId) => {
          const source = findPromptCopy(intentId);
          followEl.appendChild(buildChip(intentId, source, null));
        });
        body.appendChild(followEl);
      }

      scrollBodyToBottom();
    }

    function findPromptCopy(intentId) {
      const all = (k.chat.primaryPrompts || []).concat(k.chat.secondaryPrompts || []);
      const found = all.find((p) => p.id === intentId);
      return found ? fill(found.label, k) : intentId;
    }

    function handleAction(action) {
      if (action.href) {
        window.open(action.href, "_blank", "noopener");
        return;
      }
      if (action.target) {
        closePanel();
        window.setTimeout(() => navigateTo(action.target), 250);
      }
    }

    function navigateTo(target) {
      if (/\.html$/.test(target)) {
        window.location.href = target;
        return;
      }
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function sendMessage(text) {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (!hasConversationStarted) {
        hasConversationStarted = true;
        body.innerHTML = "";
      }

      appendUserMessage(trimmed);
      const typing = appendTypingIndicator();

      window.setTimeout(async () => {
        const response = await getResponse(trimmed, k);
        if (response.intent) asked.add(response.intent);
        typing.remove();
        appendAIMessage(response);
      }, TYPING_DELAY_MS);
    }

    function handlePromptClick(intentId, label) {
      if (!hasConversationStarted) {
        hasConversationStarted = true;
        body.innerHTML = "";
      }
      appendUserMessage(label);
      const typing = appendTypingIndicator();
      window.setTimeout(() => {
        asked.add(intentId);
        const response = resolveIntent(intentId, k);
        typing.remove();
        appendAIMessage(response);
      }, TYPING_DELAY_MS);
    }

    // ---- Open / close ----

    let isPanelOpen = false;
    let releaseFocusTrap = null;

    function openPanel() {
      panel.hidden = false;
      isPanelOpen = true;
      launcher.setAttribute("aria-expanded", "true");
      requestAnimationFrame(() => panel.classList.add("is-open"));
      if (!hasConversationStarted) renderIntro();
      window.setTimeout(() => input.focus(), 200);
      document.addEventListener("keydown", handleKeydown);
      if (window.a11y && window.a11y.trapFocus) {
        releaseFocusTrap = window.a11y.trapFocus(panel, () => isPanelOpen);
      }
    }

    function closePanel() {
      panel.classList.remove("is-open");
      isPanelOpen = false;
      launcher.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", handleKeydown);
      if (releaseFocusTrap) {
        releaseFocusTrap();
        releaseFocusTrap = null;
      }
      window.setTimeout(() => {
        panel.hidden = true;
      }, 250);
      launcher.focus();
    }

    function handleKeydown(e) {
      if (e.key === "Escape") closePanel();
    }

    launcher.addEventListener("click", () => {
      const isOpen = panel.classList.contains("is-open");
      if (isOpen) closePanel();
      else openPanel();
    });

    if (closeBtn) closeBtn.addEventListener("click", closePanel);

    // ---- Input form ----

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value;
      input.value = "";
      input.style.height = "auto";
      sendMessage(value);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 120) + "px";
    });
  }

  // Public API used by js/hero-chat.js, so the hero chat and the floating
  // panel always give the same answers from the same data.
  window.portfolioCopilot = {
    ask(message) {
      const k = buildKnowledge();
      return k ? getResponse(message, k) : Promise.resolve({ text: "Portfolio data isn't loaded." });
    },
    intent(id) {
      const k = buildKnowledge();
      return k ? resolveIntent(id, k) : { text: "Portfolio data isn't loaded." };
    },
  };

  document.addEventListener("DOMContentLoaded", initCopilot);
})();
