// Single source of truth for editable site content.
// The DB (content_blocks) stores OVERRIDES only; these defaults render when a key
// is absent, so the public site always works even with an empty table. The admin
// editor iterates this schema, so every field here becomes editable.

export type FieldType =
  | "text"
  | "textarea"
  | "list"
  | "url"
  | "image"
  | "video"
  | "color"
  | "number";

export interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  help?: string;
}

export interface ContentGroup {
  page: string;
  title: string;
  description?: string;
  fields: ContentField[];
}

// ─── GLOBAL ─────────────────────────────────────────────────────────────────

export const GLOBAL_GROUP: ContentGroup = {
  page: "global",
  title: "Site Settings",
  description: "Brand, social links, and contact info that appear across every page — logo, footer, and navigation.",
  fields: [
    { key: "logo_scale", label: "Logo size", type: "number", default: "1", help: "Multiplier. 1 = default, 1.5 = 50% larger." },
    { key: "social_facebook", label: "Facebook URL", type: "url", default: "https://www.facebook.com/InsightStrategyLab" },
    { key: "social_linkedin", label: "LinkedIn URL", type: "url", default: "https://www.linkedin.com/in/billtamayo/" },
    { key: "social_youtube", label: "YouTube URL", type: "url", default: "https://www.youtube.com/@InsightStrategyLab" },
    { key: "contact_address", label: "Address", type: "text", default: "Murrieta, CA 92563" },
    { key: "contact_phone", label: "Phone", type: "text", default: "(951) 528-1192" },
    { key: "contact_email", label: "Email", type: "text", default: "" },
    { key: "google_reviews_url", label: "Google reviews URL", type: "url", default: "", help: "Link to your Google Business reviews page. The reviews call-to-action only appears once this is set." },
    { key: "footer_tagline", label: "Footer tagline", type: "textarea", default: "Helping mission-driven organizations transform through people-first innovation, modular agentic workflows, and performance-driven architecture.\n\nServing Murrieta, Temecula, Menifee, Wildomar, Lake Elsinore, and organizations nationwide." },
    { key: "footer_copyright", label: "Footer copyright line", type: "text", default: "Copyright \u00a9 2026 Insight Strategy Lab - All Rights Reserved." },
  ],
};

// ─── HOME ────────────────────────────────────────────────────────────────────

export const HOME_GROUP: ContentGroup = {
  page: "home",
  title: "Home Page",
  description: "The home page layout and sections are fixed by design. These fields control SEO and the optional featured review shown below the hero.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "Business Operating Systems for Small Businesses | Insight Strategy Lab", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Insight Strategy Lab helps small businesses, nonprofits, and mission-driven organizations integrate people, processes, technology, data, and AI into a scalable Business Operating System that drives clarity, accountability, and growth.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "review_quote", label: "Featured review — quote", type: "textarea", default: "", help: "A client quote shown below the hero section. Leave empty to hide it entirely." },
    { key: "review_author", label: "Featured review — author name", type: "text", default: "" },
    { key: "review_role", label: "Featured review — author title / business", type: "text", default: "" },
    { key: "review_rating", label: "Featured review — star rating (1–5)", type: "number", default: "5" },
    { key: "review_link", label: "Featured review — Google link", type: "url", default: "", help: "Where 'Read on Google' opens. Leave empty to hide the link." },
  ],
};

// ─── SERVICES ────────────────────────────────────────────────────────────────

export const SERVICES_GROUP: ContentGroup = {
  page: "services",
  title: "Services & Pricing",
  description: "Every section on the Services page — hero, system components, engagement models, pricing rationale, and the bottom call-to-action.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "Business Operating System Design & AI Integration | Insight Strategy Lab", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Design and implementation of Business Operating Systems that align people, processes, technology, data, and AI to improve efficiency, visibility, and organizational performance.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "hero_title", label: "Page title", type: "text", default: "How We Build Your System" },
    { key: "hero_subtitle", label: "Page subtitle", type: "textarea", default: "Every system is designed around how your business actually operates \u2014 not forced into templates or prebuilt tools." },
    { key: "banner_heading", label: "Diagnostic banner — heading", type: "text", default: "Most clients begin with a short system diagnostic.", help: "Shown near the top of the page. Leave empty to hide." },
    { key: "banner_body", label: "Diagnostic banner — body", type: "textarea", default: "This helps us identify your biggest bottlenecks and determine the right system to build." },
    { key: "banner_button", label: "Diagnostic banner — button", type: "text", default: "Start System Diagnostic" },
    { key: "build_heading", label: "System components — heading", type: "text", default: "System Components" },
    { key: "build_intro", label: "System components — intro", type: "textarea", default: "Every system we build integrates these components into one unified operating layer." },
    { key: "cap1_title", label: "Component 1 — title", type: "text", default: "Client & Operations Layer" },
    { key: "cap2_title", label: "Component 2 — title", type: "text", default: "Workflow & Automation Layer" },
    { key: "cap3_title", label: "Component 3 — title", type: "text", default: "Operational Intelligence Layer" },
    { key: "cap4_title", label: "Component 4 — title", type: "text", default: "AI Enhancement Layer" },
    { key: "models_heading", label: "Engagement models — heading", type: "text", default: "How We Engage" },
    { key: "models_intro", label: "Engagement models — intro", type: "textarea", default: "We structure every engagement based on how much ownership and control you want over your system." },
    { key: "model1_title", label: "Model 1 — title", type: "text", default: "Fully Managed System" },
    { key: "model1_fee", label: "Model 1 — investment note", type: "text", default: "Typical investment: monthly subscription (no upfront build cost)" },
    { key: "model1_desc", label: "Model 1 — description", type: "textarea", default: "We design, build, host, and manage your system." },
    { key: "model1_best_for", label: "Model 1 — best for", type: "textarea", default: "Businesses that want results without managing the backend." },
    { key: "model2_title", label: "Model 2 — title", type: "text", default: "Hybrid Ownership Model" },
    { key: "model2_fee", label: "Model 2 — investment note", type: "text", default: "Typical investment: setup fee + monthly support" },
    { key: "model2_desc", label: "Model 2 — description", type: "textarea", default: "You own the system and architecture while we handle maintenance, updates, and support." },
    { key: "model2_best_for", label: "Model 2 — best for", type: "textarea", default: "Businesses that want control with expert support." },
    { key: "model3_title", label: "Model 3 — title", type: "text", default: "Full System Build & Transfer" },
    { key: "model3_fee", label: "Model 3 — investment note", type: "text", default: "Typical investment: one-time build fee" },
    { key: "model3_desc", label: "Model 3 — description", type: "textarea", default: "We design and build your system, train your team, and hand over full control." },
    { key: "model3_best_for", label: "Model 3 — best for", type: "textarea", default: "Businesses that want complete ownership and internal management." },
    { key: "models_note", label: "Engagement models — note below cards", type: "textarea", default: "Most clients start with a system diagnostic to determine which model fits best.", help: "Short prompt shown below the engagement models. Leave empty to hide." },
    { key: "scoped_heading", label: "Pricing rationale — heading", type: "text", default: "Why Systems Are Scoped Individually", help: "Leave empty to hide this section." },
    { key: "get_heading", label: "What you get — heading", type: "text", default: "What You Get", help: "Leave empty to hide this section." },
    { key: "cta_heading", label: "Bottom CTA — heading", type: "text", default: "Ready to build the system your business actually needs?" },
    { key: "cta_body", label: "Bottom CTA — body", type: "textarea", default: "Start with a short system diagnostic to identify your biggest bottlenecks and the right system to build first." },
    { key: "cta_button", label: "Bottom CTA — button", type: "text", default: "Start Your System Diagnostic" },
  ],
};

// ─── APPS ────────────────────────────────────────────────────────────────────

export const APPS_GROUP: ContentGroup = {
  page: "apps",
  title: "Apps in Production",
  description: "Text sections on the Apps page. The individual app cards (title, description, video, outcome) are managed in the Apps Manager tab.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "Business Operating System Applications | Insight Strategy Lab", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Explore real-world applications built to support Business Operating Systems through workflow automation, data management, AI integration, and operational visibility.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "hero_title", label: "Page title", type: "text", default: "Real Systems Running Inside Businesses" },
    { key: "hero_subtitle", label: "Page subtitle", type: "textarea", default: "These aren't prototypes or templates. These are production systems actively used to run operations, manage clients, and drive decisions." },
    { key: "gallery_label", label: "Label above the systems grid", type: "text", default: "See the systems in action", help: "Small eyebrow label shown above the app cards. Leave empty to hide." },
    { key: "includes_heading", label: "'Every system includes' — heading", type: "text", default: "Every System We Build Includes", help: "Leave empty to hide this section." },
    { key: "includes_items", label: "'Every system includes' — items", type: "list", default: "Centralized data (a single source of truth)\nWorkflow automation that reduces manual work\nRole-based views so each user sees what matters\nReal-time reporting and dashboards\nScalable architecture that grows with your business" },
    { key: "cta_heading", label: "Bottom CTA — heading", type: "text", default: "Want a system like this built for your business?", help: "Leave empty to hide the bottom call-to-action." },
    { key: "cta_body", label: "Bottom CTA — body", type: "textarea", default: "We start by mapping your current operations and identifying the highest-leverage system to build first." },
    { key: "cta_button", label: "Bottom CTA — button", type: "text", default: "Book a free strategy call" },
    { key: "empty_heading", label: "Empty state — heading", type: "text", default: "Showcase updating", help: "Shown if no apps are published yet." },
    { key: "empty_body", label: "Empty state — body", type: "textarea", default: "We are currently compiling our latest case studies and production systems." },
  ],
};

// ─── ABOUT ───────────────────────────────────────────────────────────────────

export const ABOUT_GROUP: ContentGroup = {
  page: "about",
  title: "About Page",
  description: "The founder positioning page — bio, philosophy, credentials, certifications, publications, and how-I-work. Every field here maps directly to a section on the page.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "About Bill Tamayo Jr. | Founder, Insight Strategy Lab", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Meet Bill Tamayo Jr., retired Marine Corps Lieutenant Colonel and founder of Insight Strategy Lab, helping organizations build Business Operating Systems that integrate people, processes, technology, data, and AI.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "hero_title", label: "Page headline", type: "text", default: "The Architect Behind the Business Operating System" },
    { key: "photo", label: "Founder photo", type: "image", default: "", help: "Shown at the top of the page. Upload a headshot or professional photo." },
    { key: "lead", label: "Opening paragraphs", type: "textarea", default: "I help small businesses, nonprofits, and mission-driven organizations integrate People, Processes, Technology, Data, and AI into one Business Operating System.\n\nMy work focuses on reducing complexity, improving visibility, and creating the operational foundation organizations need to scale sustainably.\n\nAfter more than 27 years leading teams and solving complex organizational challenges, I\u2019ve learned that most organizations don\u2019t fail because people aren\u2019t working hard \u2014 they struggle because their systems aren\u2019t working together.\n\nInsight Strategy Lab exists to solve that problem.", help: "Blank line between paragraphs creates separate paragraphs." },
    { key: "body", label: "Leadership background", type: "textarea", default: "Before founding Insight Strategy Lab, I served for 27 years on active duty in the United States Marine Corps, retiring as a Lieutenant Colonel.\n\nThroughout that career, I led complex organizations, managed large-scale operations, and learned firsthand that successful execution depends on systems, accountability, and alignment.\n\nThose same principles now guide every engagement at Insight Strategy Lab.", help: "Blank line between paragraphs creates separate paragraphs." },
    { key: "philosophy_heading", label: "Philosophy — heading", type: "text", default: "Most Organizations Don\u2019t Have a Strategy Problem. They Have a System Problem.", help: "Leave empty to hide the philosophy section." },
    { key: "philosophy_body", label: "Philosophy — body", type: "textarea", default: "Many organizations already know where they want to go.\n\nThe challenge is that information is scattered, processes are inconsistent, technology is disconnected, and leaders lack the visibility needed to execute effectively.\n\nMy approach is simple: systems should reduce complexity, not create it.\n\nEvery Business Operating System is designed to improve clarity, accountability, efficiency, and growth by integrating the five pillars of organizational performance:", help: "Blank line between paragraphs creates separate paragraphs." },
    { key: "philosophy_pillars", label: "Philosophy — five pillars", type: "list", default: "People\nProcesses\nTechnology\nData\nAI", help: "One pillar per line. Rendered as a bullet list after the philosophy body." },
    { key: "creds_heading", label: "Education — heading", type: "text", default: "Education" },
    { key: "creds_intro", label: "Education — intro", type: "textarea", default: "My formal education spans business, leadership, analytics, organizational systems, and strategic planning \u2014 a multidisciplinary background that informs the Business Operating System framework used in every client engagement." },
    { key: "creds", label: "Education — degree list", type: "list", default: "Bachelor of Business Administration in Human Resource Management (Minor in Economics)\nMaster of Science in Management\nMaster of Arts in Military Studies\nMaster of Business Administration", help: "One degree per line." },
    { key: "badges_heading", label: "Certifications — heading", type: "text", default: "Certifications & Badges" },
    { key: "badges_caption", label: "Certifications — caption", type: "textarea", default: "Additional certifications across analytics, systems, and digital transformation." },
    { key: "badge_1", label: "Badge 1 — image", type: "image", default: "", help: "Upload or paste a URL for a certification badge image." },
    { key: "badge_1_link", label: "Badge 1 — link", type: "url", default: "", help: "Where the badge opens when clicked (e.g. the certificate page)." },
    { key: "badge_2", label: "Badge 2 — image", type: "image", default: "" },
    { key: "badge_2_link", label: "Badge 2 — link", type: "url", default: "" },
    { key: "badge_3", label: "Badge 3 — image", type: "image", default: "" },
    { key: "badge_3_link", label: "Badge 3 — link", type: "url", default: "" },
    { key: "badge_4", label: "Badge 4 — image", type: "image", default: "" },
    { key: "badge_4_link", label: "Badge 4 — link", type: "url", default: "" },
    { key: "badge_5", label: "Badge 5 — image", type: "image", default: "" },
    { key: "badge_5_link", label: "Badge 5 — link", type: "url", default: "" },
    { key: "badge_6", label: "Badge 6 — image", type: "image", default: "" },
    { key: "badge_6_link", label: "Badge 6 — link", type: "url", default: "" },
    { key: "pubs_heading", label: "Publications — heading", type: "text", default: "Research & Publications" },
    { key: "pubs_intro", label: "Publications — intro", type: "textarea", default: "My research has focused on organizational performance, workforce dynamics, strategic human resource management, and predictive analytics \u2014 areas that directly influence how organizations operate and scale.\n\nThese projects reinforced a foundational belief: better systems lead to better outcomes." },
    { key: "pub_1_title", label: "Publication 1 — title", type: "text", default: "" },
    { key: "pub_1_link", label: "Publication 1 — URL", type: "url", default: "" },
    { key: "pub_2_title", label: "Publication 2 — title", type: "text", default: "" },
    { key: "pub_2_link", label: "Publication 2 — URL", type: "url", default: "" },
    { key: "pub_3_title", label: "Publication 3 — title", type: "text", default: "" },
    { key: "pub_3_link", label: "Publication 3 — URL", type: "url", default: "" },
    { key: "pub_4_title", label: "Publication 4 — title", type: "text", default: "" },
    { key: "pub_4_link", label: "Publication 4 — URL", type: "url", default: "" },
    { key: "howiwork_heading", label: "How I work — heading", type: "text", default: "How I Work", help: "Leave empty to hide this section." },
    { key: "howiwork_items", label: "How I work — steps", type: "list", default: "Diagnose the current system (or lack of one)\nDesign a system aligned to how the business operates\nBuild and integrate the solution\nSupport adoption and evolution over time", help: "One step per line." },
    { key: "cta_heading", label: "Bottom CTA — heading", type: "text", default: "Ready to Build Your Business Operating System?", help: "Leave empty to hide the bottom call-to-action." },
    { key: "cta_body", label: "Bottom CTA — body", type: "textarea", default: "Start with a strategy session and discover where People, Processes, Technology, Data, and AI can be better aligned to create clarity, accountability, and growth." },
    { key: "cta_button", label: "Bottom CTA — button", type: "text", default: "Get My Free Strategy Session" },
  ],
};

// ─── CONTACT ─────────────────────────────────────────────────────────────────

export const CONTACT_GROUP: ContentGroup = {
  page: "contact",
  title: "Contact Page",
  description: "Every editable field on the Contact page. The contact details themselves (phone, email, address) are set in Site Settings.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "Contact Insight Strategy Lab | Schedule a Strategy Session", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Schedule a strategy session to explore how a Business Operating System can help your organization improve efficiency, visibility, accountability, and growth.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "hero_title", label: "Page title", type: "text", default: "Direct Contact & Inquiries" },
    { key: "intro", label: "Intro paragraph", type: "textarea", default: "Based in Murrieta, California. For referrals, direct connections, or anything that doesn't fit the diagnostic, reach us here. If you want a scoped system recommendation, start with the System Diagnostic first." },
    { key: "diagnostic_cta_heading", label: "Diagnostic redirect — heading", type: "text", default: "Looking to improve your systems?" },
    { key: "diagnostic_cta_body", label: "Diagnostic redirect — body", type: "textarea", default: "Start with our System Diagnostic so we can better understand your operations before we speak." },
    { key: "diagnostic_cta_button", label: "Diagnostic redirect — button", type: "text", default: "Start System Diagnostic" },
    { key: "form_heading", label: "Inquiry form — heading", type: "text", default: "General Inquiry / Direct Request" },
    { key: "form_submit", label: "Inquiry form — submit button", type: "text", default: "Submit Inquiry" },
  ],
};

// ─── DIAGNOSTIC ──────────────────────────────────────────────────────────────

export const DIAGNOSTIC_GROUP: ContentGroup = {
  page: "diagnostic",
  title: "System Diagnostic",
  description: "The diagnostic flow — intro screen, scorecard labels, intake form, and confirmation message. The assessment questions are managed separately in the database.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "Business Operating System Assessment | Insight Strategy Lab", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Identify operational gaps and opportunities across people, processes, technology, data, and AI with a Business Operating System assessment.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "wizard_intro_eyebrow", label: "Intro screen — eyebrow label", type: "text", default: "System Diagnostic" },
    { key: "wizard_intro_body", label: "Intro screen — body", type: "textarea", default: "We'll map your current operations so we can design the right system for your business." },
    { key: "wizard_outcome_heading", label: "Intro screen — outcome heading", type: "text", default: "At the end of this, you'll have a clear picture of:" },
    { key: "wizard_outcome_items", label: "Intro screen — outcome items", type: "list", default: "Where your current system is breaking down\nWhat should be built first\nWhat a working system would look like for your business", help: "One item per line." },
    { key: "scorecard_label", label: "Scorecard — main label", type: "text", default: "ISL Business Operating System Score" },
    { key: "overall_score_label", label: "Scorecard — overall score label", type: "text", default: "Overall BOS Score" },
    { key: "level_prefix", label: "Scorecard — maturity level prefix", type: "text", default: "Your BOS Maturity Level:", help: "Shown before the maturity level name (e.g. Foundational, Operational)." },
    { key: "risk_areas_label", label: "Scorecard — key risk areas heading", type: "text", default: "Key Risk Areas" },
    { key: "form_heading", label: "Intake form — heading", type: "text", default: "Get Your Free Operating System Review" },
    { key: "form_body", label: "Intake form — body", type: "textarea", default: "Get a free, no-obligation review of your Business Operating System with Bill Tamayo \u2014 we'll walk through your results and what to tackle first." },
    { key: "form_message_placeholder", label: "Intake form — message placeholder", type: "text", default: "Tell us about your current systems and the bottleneck you most want solved..." },
    { key: "form_submit", label: "Intake form — submit button", type: "text", default: "Get Your Free Operating System Review" },
    { key: "finished_heading", label: "Confirmation — heading", type: "text", default: "Assessment Received" },
    { key: "finished_body", label: "Confirmation — body", type: "textarea", default: "Your Business Operating System results have been saved. Bill will review your assessment and reach out to schedule your free Operating System Review." },
    { key: "finished_button", label: "Confirmation — button", type: "text", default: "Return to Home" },
  ],
};

// ─── QR LANDING ──────────────────────────────────────────────────────────────

export const VEHICLE_QR_GROUP: ContentGroup = {
  page: "vehicle_qr",
  title: "QR Code Landing Page",
  description: "Private landing page reached by scanning the vehicle QR code (/vehicle-qr-code-1). Every field here maps to a visible section on that page.",
  fields: [
    { key: "hero_badge", label: "Hero — badge label", type: "text", default: "Private access" },
    { key: "hero_title", label: "Hero — headline", type: "textarea", default: "You Found This for a Reason" },
    { key: "hero_subtitle", label: "Hero — subtitle", type: "textarea", default: "I build AI-powered systems that help small businesses scale smarter, not harder." },
    { key: "hero_body", label: "Hero — body text", type: "textarea", default: "If you're curious what that could look like for your business, you're in the right place." },
    { key: "hero_cta", label: "Hero — CTA button", type: "text", default: "See How This Works" },
    { key: "value1_title", label: "Value 1 — title", type: "text", default: "Automate operations" },
    { key: "value1_desc", label: "Value 1 — description", type: "textarea", default: "Cut the repetitive, manual work that eats your team's day so the business runs without you babysitting it." },
    { key: "value2_title", label: "Value 2 — title", type: "text", default: "Turn data into decisions" },
    { key: "value2_desc", label: "Value 2 — description", type: "textarea", default: "Make your numbers actually useful — clear signals you can act on instead of spreadsheets nobody opens." },
    { key: "value3_title", label: "Value 3 — title", type: "text", default: "Build scalable systems" },
    { key: "value3_desc", label: "Value 3 — description", type: "textarea", default: "Put the right foundation in place so growth doesn't break what you've already built." },
    { key: "who_heading", label: "Who it's for — heading", type: "text", default: "Who This Is For" },
    { key: "who_items", label: "Who it's for — items", type: "list", default: "Business owners wearing too many hats\nService businesses trying to scale\nTeams drowning in manual processes\nPeople curious about using AI practically", help: "One item per line." },
    { key: "cred_intro", label: "Credibility — intro", type: "textarea", default: "I'm Bill Tamayo Jr., a Digital Transformation Architect and founder of Insight Strategy Lab." },
    { key: "cred_items", label: "Credibility — bullet points", type: "list", default: "Build AI systems for small businesses\nFocus on real-world implementation (not theory)\nStrategy + execution", help: "One item per line." },
    { key: "cta_heading", label: "Bottom CTA — heading", type: "textarea", default: "Want to Explore What This Could Look Like for You?" },
    { key: "cta_primary", label: "Bottom CTA — primary button", type: "text", default: "Book a Quick Call" },
    { key: "cta_secondary", label: "Bottom CTA — secondary button", type: "text", default: "Send Me a Message" },
    { key: "closing", label: "Closing line", type: "textarea", default: "Also—thanks for scanning. That already puts you ahead of most people." },
  ],
};

// ─── EXPORTS ─────────────────────────────────────────────────────────────────

export const CONTENT_GROUPS: ContentGroup[] = [
  GLOBAL_GROUP,
  HOME_GROUP,
  SERVICES_GROUP,
  APPS_GROUP,
  ABOUT_GROUP,
  CONTACT_GROUP,
  DIAGNOSTIC_GROUP,
  VEHICLE_QR_GROUP,
];

export const PAGE_GROUPS: ContentGroup[] = [
  HOME_GROUP,
  SERVICES_GROUP,
  APPS_GROUP,
  ABOUT_GROUP,
  CONTACT_GROUP,
  DIAGNOSTIC_GROUP,
  VEHICLE_QR_GROUP,
];

export function defaultsFor(page: string): Record<string, string> {
  const group = CONTENT_GROUPS.find((g) => g.page === page);
  const out: Record<string, string> = {};
  if (group) for (const f of group.fields) out[f.key] = f.default;
  return out;
}

export function fieldDef(page: string, key: string): ContentField | undefined {
  return CONTENT_GROUPS.find((g) => g.page === page)?.fields.find((f) => f.key === key);
}
