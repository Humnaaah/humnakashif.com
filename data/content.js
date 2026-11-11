/* ==========================================================================
   CONTENT.JS: DATA FOR THE "ASK MY AI" CHAT ONLY.
   The hero chat and the floating assistant answer from this file.
   The page itself is plain HTML: edit index.html and project/*.html directly.
   If you change something important there (role, availability, contact
   details, a project), update the matching line here so the chat agrees.

   ⚠️ CONFIRM markers show text written from your brief and project list
   without details from you. Check each one before publishing.
   ========================================================================== */

const portfolio = {
  /* ---------- Page metadata, search and social previews ---------- */
  meta: {
    title: "Humna Kashif | Senior UI/UX & Product Designer, Frontend Developer",
    description:
      "Humna Kashif is a Senior UI/UX and Product Designer and Frontend Developer with 7+ years of experience across SaaS, AI, enterprise, government, healthcare and e-commerce products. Skilled in UX research, design systems, React, JavaScript and CMS development.",
    ogTitle: "Humna Kashif — Product Designer & Frontend Developer",
    ogDescription:
      "7+ years creating user-centred digital products, scalable design systems and responsive web experiences, from Figma to frontend.",
    canonical: "https://humnaaah.github.io/Portfolio/",
    image: "assets/images/profile.webp",
    schemaJobTitle: "Senior UI/UX Designer, Product Designer and Frontend Developer",
    knowsAbout: ["UX/UI Design", "Product Design", "UX Research", "Interaction Design", "Design Systems", "AI Product Design", "Conversational UX", "AI Agent Interfaces", "React.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "WordPress", "Shopify", "Webflow", "Technical SEO", "Accessibility"],
  },

  personal: {
    name: "Humna Kashif",
    title: "Senior UI/UX & Product Designer | Frontend Developer",
    availability: "Open to global opportunities · Remote, hybrid or on-site",
    email: "humnakashif9@gmail.com",
    phoneUae: "+971 55 711 4804",
    phoneUaeHref: "tel:+971557114804",
    linkedin: "https://linkedin.com/in/humna-kashif",
    portfolioUrl: "https://humnaaah.github.io/Portfolio",
    resumePdf: "assets/Humna-Kashif-Resume.pdf", // add this file to show the Download button
    logoText: "HUMNA",
    avatar: "assets/images/profile-small.webp",
    photo: "assets/images/profile.webp",
  },

  nav: [
    { label: "Work", id: "projects" },
    { label: "Expertise", id: "expertise" },
    { label: "AI UX", id: "ai-experience" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
  ],
  navContactLabel: "Contact",

  /* ---------- Hero ---------- */
  hero: {
    role: "Senior UI/UX & Product Designer · Frontend Developer",
    headlinePre: "I design products and",
    headlineAccent: "build them too.",
    description:
      "UI/UX and product designer and frontend developer with 7+ years of experience, turning complex requirements into clear, accessible products, from research and design systems to AI-powered workflows and production code.",
    primaryCta: { label: "View work", id: "projects" },
    secondaryCta: { label: "Let’s connect", id: "contact" },
    facts: [
      { title: "7+ years", text: "Of professional experience" },
      { title: "Product & AI UX", text: "Enterprise, government and healthcare" },
      { title: "Frontend development", text: "React, JavaScript and CMS platforms" },
      { title: "Design systems", text: "Reusable components for scalable builds" },
    ],
    chat: {
      title: "Ask about my design and development work",
      status: "Answers from the portfolio",
      seedQuestion: "What can Humna help a product team deliver?",
      seedAnswer:
        "I combine product design and frontend development: from understanding user needs and mapping workflows to designing interfaces, building responsive experiences and improving usability.",
      seedAction: { label: "See the work", id: "projects" },
      placeholder: "Ask about her design or code…",
      chips: [
        { intent: "design", label: "Design", question: "What does she design?" },
        { intent: "frontend", label: "Build", question: "What does she build?" },
        { intent: "ai", label: "AI UX", question: "How does she design AI experiences?" },
        { intent: "availability", label: "Hire", question: "Is she available?" },
      ],
    },
  },

  /* ---------- Work ---------- */
  work: {
    eyebrow: "Selected work",
    heading: { muted: "Selected work,", bold: "built around", em: "real users." },
    intro:
      "Enterprise, government, healthcare, fintech and e-commerce products. Client work under NDA is shown on request.",
    featured: {
      kicker: "Featured case study · Enterprise / Public sector",
      title: "Operations Management Platform",
      summary:
        "A platform concept focused on bringing operational workflows into one clear experience, helping teams navigate information, manage tasks and make informed decisions.",
      role: "Product Designer / UX/UI Designer · Concept case study",
      href: "project/operations-management-platform.html",
      image: "assets/images/project-ops.webp",
      cta: "Read the case study",
    },
    moreTitle: "More projects",
    // Add a real screenshot by setting image: "assets/images/projects/<name>.webp".
    // Without an image, the card shows a clean tile with the project name.
    // ⚠️ CONFIRM: every summary below is written from your brief; edit to match what you did and are allowed to share.
    items: [
      { slug: "moj", name: "Ministry of Justice (MOJ)", sector: "Government", category: "Product Design", role: "UX/UI Designer", summary: "Turning complex legal and administrative journeys into clear, guided digital services.", view: "detail", problem: "Legal and administrative journeys were dense and hard to complete without guidance.", decisions: ["Broke the journey into short, guided steps", "Used plain-language labels and clear status feedback", "Kept patterns consistent so users learn once"], outcome: "Confidential client work. Results and a walkthrough are shared on request.", goals: ["Fewer steps to finish a service", "Clear status at every stage", "Consistent patterns across screens"] },
      { slug: "poa", name: "Power of Attorney Services App", sector: "Government service app", category: "Product Design", role: "UX/UI Designer", summary: "A document-heavy process simplified into clear, step-by-step mobile and web flows.", view: "pdf", pdf: "assets/case-studies/poa.pdf", problem: "A document-heavy process needed to feel simple on mobile and web.", decisions: ["Split the process into one task per screen", "Showed progress and required documents up front", "Designed clear error and review states"], outcome: "Confidential client work. Results and a walkthrough are shared on request.", goals: ["One task per screen", "Required documents visible up front", "Clear review before submitting"] },
      { slug: "moh-kuwait", name: "Ministry of Health Kuwait", sector: "Healthcare · Government", category: "Product Design", role: "UX/UI Designer", summary: "Healthcare service interfaces designed for clarity, accessibility and fast task completion.", view: "detail", problem: "Healthcare service tasks had to be clear and accessible for a wide range of users.", decisions: ["Put the most frequent tasks first", "Designed for readability, contrast and simple forms", "Built reusable components for consistency"], outcome: "Confidential client work. Results and a walkthrough are shared on request.", goals: ["Fast access to frequent tasks", "Readable, accessible forms", "Consistent components across services"] },
      { slug: "payoneer", name: "Payoneer", sector: "Fintech", category: "Product Design", role: "UX/UI Designer", summary: "Usability and interface consistency for a global payments platform.", view: "detail", problem: "Interfaces needed to feel consistent and easier to use across a global payments platform.", decisions: ["Reviewed inconsistent patterns across screens", "Aligned components, spacing and states", "Simplified key task flows"], outcome: "Confidential client work. Results and a walkthrough are shared on request.", goals: ["Consistent patterns across the product", "Simpler key task flows", "Reusable, documented components"] },
      { slug: "edible", name: "Edible Arrangements", sector: "E-commerce", category: "Frontend Development", role: "UX Designer & Frontend Developer", summary: "UX and frontend improvements across e-commerce sites and franchise-management platforms, backed by reusable React components and a design system.", view: "pdf", pdf: "assets/case-studies/edible.pdf", problem: "E-commerce and franchise-management sites needed better UX and a scalable frontend.", decisions: ["Ran research and usability testing to find friction", "Built reusable React components and a design system", "Tested flow changes with A/B experiments"], outcome: "Confidential client work. Results and a walkthrough are shared on request.", goals: ["Less friction in key flows", "Reusable React components", "Decisions backed by testing"] },
      { slug: "techunicorn", name: "TechUnicorn / CXUnicorn", sector: "Enterprise · AI", category: "AI UX", role: "Senior UI/UX Designer", summary: "End-to-end UX for enterprise and government platforms, plus AI-powered workflows, conversational interfaces and agent experiences.", view: "detail", problem: "Enterprise and government platforms, and AI workflows, needed clear and consistent UX.", decisions: ["Designed end-to-end journeys and prototypes", "Made AI actions visible, editable and reviewable", "Maintained a design system for developer handoff"], outcome: "Confidential client work. Results and a walkthrough are shared on request.", goals: ["Clear end-to-end journeys", "AI actions people can review and correct", "One design system for handoff"] },
      { slug: "aibers", name: "Aibers Healthcare Management System", sector: "Healthcare", category: "Frontend Development", role: "UI/UX Designer & Frontend Developer", summary: "Healthcare management portals and dashboards, designed and built as accessible, responsive interfaces.", view: "pdf", pdf: "assets/case-studies/aibers.pdf", problem: "Healthcare staff needed dashboards and portals that are quick to scan and use.", decisions: ["Structured data into scannable dashboards", "Designed and built accessible responsive interfaces", "Iterated on feedback from users"], outcome: "Confidential client work. Results and a walkthrough are shared on request.", goals: ["Dashboards that are quick to scan", "Accessible, responsive interfaces", "Refinements based on user feedback"] },
      { slug: "gameboggy-aoyo", name: "Gameboggy and Aoyo", sector: "Social · Entertainment", category: "Product Design", role: "UI/UX Designer", summary: "Responsive social and entertainment experiences: chat, forums, rich media and data dashboards.", view: "pdf", pdf: "assets/case-studies/gameboggy-aoyo.pdf", problem: "Social and entertainment products needed responsive, engaging interfaces.", decisions: ["Designed chat, forums and rich-media layouts", "Created data dashboards for clarity", "Kept responsive behaviour consistent"], outcome: "Confidential client work. Results and a walkthrough are shared on request.", goals: ["Responsive behaviour on every screen", "Clear, engaging layouts", "Dashboards that make data readable"] },
    ],
    note: "Client work under NDA is not shown publicly.",
  },

  /* ---------- Expertise (what I do) ---------- */
  expertise: {
    eyebrow: "Expertise",
    heading: { muted: "What I do,", bold: "end to", em: "end." },
    intro: "One person who understands both how a product should work and how it gets built.",
    pillars: [
      { icon: "grid", tag: "Product & UX", title: "Product & UX Design", text: "Simplifying complex journeys for enterprise and government platforms." },
      { icon: "spark", tag: "AI", title: "AI Product Design", text: "AI agents, agentic workflows and conversational UX that keep people in control." },
      { icon: "code", tag: "Frontend", title: "Frontend Development", text: "Websites and products built from scratch in React, JavaScript and CMS platforms." },
      { icon: "layers", tag: "Systems", title: "Design Systems", text: "Reusable components that keep UI consistent and speed up development." },
    ],
  },

  /* ---------- AI product design ---------- */
  ai: {
    eyebrow: "Designing for the AI era",
    heading: { bold: "AI that keeps", em: "people in control." },
    intro:
      "AI agents, agentic workflows, conversational UX and human–AI interaction, designed to remove friction while staying clear and user-controlled. Pick an everyday moment to see the difference.",
    focus: ["AI agents", "Agentic workflows", "Conversational UX", "Human–AI interaction"],
    examples: [
      {
        tab: "Find information faster",
        beforeCount: "5 steps",
        before: ["Open the filters", "Pick a category", "Set a date range", "Choose a sort order", "Start over when it's wrong"],
        prompt: "Show unpaid invoices from last month.",
        resultTitle: "14 unpaid invoices from September",
        resultLines: ["Sorted with the oldest first"],
        chips: ["Status: Unpaid", "Date: Last month", "Sorted: Oldest first"],
        decision: "People ask in their own words instead of setting filters, and the screen shows what the AI understood so they can correct it.",
      },
      {
        tab: "Understand long content",
        beforeCount: "4 steps",
        before: ["Open the 40-page report", "Read all of it", "Pull out the key points", "Copy them into a doc"],
        prompt: "Summarize the key risks.",
        resultTitle: "3 key risks found",
        resultLines: ["Renewals dropped in two customer segments (p.4)", "Support backlog is growing week over week (p.12)", "One vendor contract expires next quarter (p.27)"],
        chips: ["Source: p.4", "Source: p.12", "Source: p.27"],
        decision: "A short summary with page references, so people can check the source.",
      },
      {
        tab: "Reduce repetitive entry",
        beforeCount: "4 steps",
        before: ["Type your name and address", "Upload the same documents again", "Re-enter company details", "Check everything for typos"],
        prompt: "Use my details from the last application.",
        resultTitle: "9 of 12 fields filled in",
        resultLines: ["Name, address and company details added", "3 fields need a quick check"],
        chips: ["Auto-filled", "Needs review"],
        decision: "Fill in what is already known and clearly mark what still needs a person to check.",
      },
      {
        tab: "Make setup easier",
        beforeCount: "4 steps",
        before: ["Read the setup guide", "Go through a 7-step wizard", "Configure each setting", "Invite the team one by one"],
        prompt: "Set this up for a 5-person design team.",
        resultTitle: "Workspace ready to review",
        resultLines: ["5 seats and roles set", "3 starter templates added", "Invites drafted, not sent"],
        chips: ["Preview", "Nothing sent yet"],
        decision: "The AI does the setup work, but nothing is sent until the person reviews it.",
      },
    ],
    examplesNote: "Illustrative interface examples.",
    principlesTitle: "Design principles",
    principles: ["Transparency", "User control", "Editable AI suggestions", "Source visibility", "Clear error and recovery states", "Privacy-aware interactions", "Human review for consequential actions"],
    toolsTitle: "AI tools I work with",
    tools: ["ChatGPT", "Claude", "Gemini", "GitHub Copilot", "Cursor AI", "Perplexity AI", "Midjourney", "Lovable", "Bolt.new", "v0 by Vercel"],
  },

  /* ---------- How I work ---------- */
  process: {
    id: "funnel",
    eyebrow: "How I work",
    heading: { muted: "From problem", bold: "to", em: "shipped product." },
    steps: [
      { title: "Discover", text: "Understand business goals, user needs, constraints and existing workflows through stakeholder discussions and research." },
      { title: "Define and design", text: "Map journeys, structure information, create wireframes and prototypes, and develop consistent UI systems." },
      { title: "Build and collaborate", text: "Translate designs into responsive interfaces, work with engineering teams and support implementation." },
      { title: "Test and improve", text: "Review usability, accessibility, performance and analytics; iterate based on evidence and feedback." },
    ],
  },

  /* ---------- About ---------- */
  about: {
    eyebrow: "About",
    heading: { muted: "Hi, I’m Humna.", bold: "I design it and", em: "build it too." },
    lead: ["Complex products don’t need complicated experiences.", "I make them clear, accessible and ready to build."],
    body: [
      "My background spans UX research, interface design, design systems, AI-enabled workflows and frontend implementation. I also create presentations and business materials that support lead generation.",
    ],
    cardTitle: "Senior UI/UX & Product Designer",
    tags: ["7+ years", "Product design", "Frontend"],
  },

  /* ---------- Experience (dates left blank until you confirm them) ---------- */
  experience: {
    title: "Where I’ve worked",
    items: [
      { company: "TechUnicorn / CXUnicorn", blurb: "Enterprise, government and AI-powered product UX, plus design systems.", role: "Senior UI/UX Designer · Product Designer", period: "", points: ["Designed end-to-end UX for enterprise and government platforms.", "Designed AI-powered workflows, conversational interfaces and AI-agent experiences.", "Built and maintained scalable design systems and worked with developers on implementation."] },
      { company: "Teamroids", blurb: "E-commerce, dashboards and web apps, from flows to high-fidelity UI.", role: "UI/UX Designer · CMS and SEO Specialist", period: "", points: ["Designed e-commerce platforms, dashboards and web applications in Figma and Adobe XD.", "Turned stakeholder requirements into user flows, prototypes and high-fidelity interfaces.", "Improved landing pages for usability, SEO and lead generation."] },
      { company: "Freelance UAE clients", blurb: "Responsive WordPress, Shopify, Wix and Webflow websites.", role: "Frontend Developer · CMS Specialist", period: "", points: ["Developed and maintained responsive websites on WordPress, Shopify, Wix and Webflow.", "Integrated REST APIs, forms, analytics and third-party tools.", "Supported hosting, content updates, technical SEO and performance."] },
      { company: "Edible Arrangements", blurb: "UX and React frontend for e-commerce and franchise platforms.", role: "Software Engineer · UI/UX Designer · Frontend Developer", period: "", points: ["Led UX and frontend improvements across e-commerce websites and franchise-management platforms.", "Built reusable React components and a design system that supported scalable development.", "Ran user research, usability testing and A/B experiments to improve user flows."] },
      { company: "Aibers", blurb: "Healthcare management portals and dashboards, designed and built.", role: "UI/UX Designer · Frontend Developer", period: "", points: ["Designed and developed healthcare management portals, dashboards and responsive interfaces.", "Converted requirements into clear, accessible experiences and iterated on feedback."] },
      { company: "SAS Group of Companies", blurb: "Social, entertainment and enterprise web experiences and dashboards.", role: "UI/UX Designer · Web Interface Developer", period: "", points: ["Designed social, entertainment and enterprise web experiences, including chat, forums and rich media.", "Created data-driven dashboards and lead-capture interfaces, including work with Highcharts."] },
      { company: "Nitro9", blurb: "WordPress websites for legal and e-commerce clients.", role: "UI/UX Designer · WordPress Developer", period: "", points: ["Designed and developed WordPress websites for legal and e-commerce clients.", "Created branding, UI elements and custom layouts with a focus on responsive behavior, accessibility and SEO."] },
    ],
  },

  /* ---------- Skills ---------- */
  skills: {
    eyebrow: "Skills and tools",
    heading: { muted: "What I work with,", bold: "", em: "at a glance." },
    resumeLabel: "Download resume",
    groups: [
      { group: "Design", items: ["UX research", "Wireframing and prototyping", "Design systems", "Accessibility (WCAG)", "Figma", "Adobe XD"] },
      { group: "AI experience", items: ["AI agents", "Agentic workflows", "Conversational UX", "Human–AI interaction"] },
      { group: "Frontend and CMS", items: ["HTML, CSS, JavaScript", "TypeScript", "React", "WordPress", "Shopify", "Webflow"] },
      { group: "AI tools", items: ["ChatGPT", "Claude", "Gemini", "Cursor", "Midjourney", "Lovable"] },
    ],
    fullListNote: "The full skills list is in my resume.",
  },

  /* ---------- Testimonials ---------- */
  // ⚠️ SAMPLE CONTENT: replace every bracketed placeholder with a real quote, name and role.
  // Set `published: true` once the quotes are real. While false, the section stays on the page but is clearly labelled as sample content.
  testimonials: {
    published: false,
    eyebrow: "Kind words",
    heading: { bold: "Kind words from", em: "collaborators." },
    items: [
      { topic: "Product design", quote: "[Quote about the design work: what changed for users or the team.]", name: "[Name]", role: "[Role, Company]" },
      { topic: "Frontend development", quote: "[Quote about the build: quality, responsiveness and handover.]", name: "[Name]", role: "[Role, Company]" },
      { topic: "AI product UX", quote: "[Quote about the AI experience: how it made the product easier to use.]", name: "[Name]", role: "[Role, Company]" },
      { topic: "Design systems", quote: "[Quote about the design system or components and how they sped up delivery.]", name: "[Name]", role: "[Role, Company]" },
      { topic: "Collaboration", quote: "[Quote about working with product and engineering teams.]", name: "[Name]", role: "[Role, Company]" },
      { topic: "E-commerce", quote: "[Quote about an e-commerce project: ease of use or management.]", name: "[Name]", role: "[Role, Company]" },
      { topic: "Healthcare", quote: "[Quote about a healthcare project: clarity and accessibility.]", name: "[Name]", role: "[Role, Company]" },
      { topic: "Websites", quote: "[Quote about a website: how it presented the business.]", name: "[Name]", role: "[Role, Company]" },
    ],
  },

  /* ---------- FAQ ---------- */
  faq: {
    eyebrow: "FAQ",
    heading: { muted: "Good questions.", bold: "Straight", em: "answers." },
    items: [
      { question: "Can you design the product and build it too?", answer: "Yes. I work across UX research, product design and design systems, then build responsive interfaces with HTML, CSS, JavaScript, React and CMS platforms, so what gets designed is what gets built." },
      { question: "How do you approach AI in a product?", answer: "AI should make complex work feel simpler. I design it to be transparent and user-controlled: show what the system understood, keep suggestions editable, cite sources and ask for review before anything consequential happens." },
      { question: "What kinds of products have you worked on?", answer: "Enterprise and government platforms, healthcare systems, fintech, e-commerce, social and entertainment platforms, and AI-enabled products, plus websites for businesses and non-profits." },
      { question: "Can you work on an existing product or website?", answer: "Yes. I can step into an existing experience, review usability, accessibility and performance, and redesign or rebuild the parts that are not working." },
      { question: "Where are you available to work?", answer: "I’m open to international opportunities, remote, hybrid or on-site, with experience working with teams and clients across Pakistan, the UAE and remote markets." },
    ],
  },

  /* ---------- Contact and footer ---------- */
  contact: {
    eyebrow: "Contact",
    heading: "Have a product or website to move forward?",
    description:
      "Whether you need product design, a responsive website or help improving an existing digital experience, I’d be happy to discuss the brief.",
    emailLabel: "Email me",
    linkedinLabel: "LinkedIn",
    marquee: ["Product design", "Frontend development", "AI product UX", "Design systems", "Let’s connect"],
  },

  footer: {
    cyclingWords: ["design", "build", "improve"],
    prefix: "Let’s",
    suffix: "something great together.",
    legal: [
      { label: "Terms of service", href: "terms.html" },
      { label: "Privacy Policy", href: "privacy-policy.html" },
    ],
    copyright: "© 2026 Humna Kashif",
  },

  /* ---------- Floating assistant (rule-based, answers from this file) ---------- */
  // chatbot: {
  //   launcherLabel: "Ask my AI",
  //   panelTitle: "Ask about Humna’s work",
  //   statusText: "Design and development, answered quickly",
  //   greeting: "Hi! I’m {name}’s assistant.",
  //   subtext: "Quick answers for recruiters and hiring teams. Pick a question or type your own.",
  //   inputPlaceholder: "Ask about the work...",
  //   moreQuestionsLabel: "More questions",
  //   fallbackMessage:
  //     "I don’t have that listed yet, but I can tell you about the design work, development work, AI product experience, experience or how to get in touch.",
  //   primaryPrompts: [
  //     { id: "projects", icon: "○", label: "Show me her strongest projects" },
  //     { id: "experience", icon: "↻", label: "Where has {name} worked?" },
  //     { id: "categories", icon: "◇", label: "Which industries has she worked in?" },
  //     { id: "process", icon: "→", label: "How does she approach a project?" },
  //     { id: "availability", icon: "✓", label: "Is she available to hire?" },
  //   ],
  //   secondaryPrompts: [
  //     { id: "about", label: "What can {name} help a team deliver?" },
  //     { id: "design", label: "What does she design?" },
  //     { id: "frontend", label: "What does she build?" },
  //     { id: "ai", label: "How does she design AI experiences?" },
  //     { id: "tools", label: "What tools does she use?" },
  //     { id: "differentiator", label: "Why hire a designer who codes?" },
  //     { id: "contact", label: "How can I get in touch?" },
  //   ],

  // },
   chatbot: {
    launcherLabel: "Ask my AI",
    panelTitle: "Ask about Humna’s work",
    statusText: "Design and development, answered quickly",
    greeting: "Hi! I’m {name}’s assistant.",
    subtext: "Quick answers for recruiters and hiring teams. Pick a question or type your own.",
    inputPlaceholder: "Ask about the work...",
    moreQuestionsLabel: "More questions",
    fallbackMessage:
      "I don’t have that listed yet, but I can tell you about her projects, government, healthcare, franchise and AI work, her design system experience, her frontend development, or how to get in touch.",
    primaryPrompts: [
      { id: "projects", icon: "○", label: "Show me her projects" },
      { id: "government", icon: "◇", label: "Has she built government platforms?" },
      { id: "franchise", icon: "↻", label: "What franchise and e-commerce work has she done?" },
      { id: "ai", icon: "→", label: "How does she design AI experiences?" },
      { id: "availability", icon: "✓", label: "Is she available to hire?" },
    ],
    secondaryPrompts: [
      { id: "about", label: "What can {name} help a team deliver?" },
      { id: "healthcare", label: "What healthcare products has she designed?" },
      { id: "designsystem", label: "Has she built a design system?" },
      { id: "design", label: "What does she design?" },
      { id: "frontend", label: "What does she build?" },
      { id: "process", label: "How does she approach a project?" },
      { id: "experience", label: "Where has {name} worked?" },
      { id: "categories", label: "Which industries has she worked in?" },
      { id: "tools", label: "What tools does she use?" },
      { id: "differentiator", label: "Why hire a designer who codes?" },
      { id: "contact", label: "How can I get in touch?" },
    ],
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = portfolio;
