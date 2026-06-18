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

export const GLOBAL_GROUP: ContentGroup = {
  page: "global",
  title: "Brand, Social & Contact",
  description: "Applies across the whole site — header, footer, and contact details.",
  fields: [
    { key: "logo_scale", label: "Logo size", type: "number", default: "1", help: "Multiplier. 1 = default, 1.5 = 50% larger." },
    { key: "color_primary", label: "Primary brand color", type: "color", default: "", help: "Leave empty to keep the default theme color." },
    { key: "color_accent", label: "Accent color", type: "color", default: "", help: "Leave empty to keep the default theme color." },
    { key: "social_facebook", label: "Facebook URL", type: "url", default: "https://www.facebook.com/InsightStrategyLab" },
    { key: "social_linkedin", label: "LinkedIn URL", type: "url", default: "https://www.linkedin.com/in/billtamayo/" },
    { key: "social_youtube", label: "YouTube URL", type: "url", default: "https://www.youtube.com/@InsightStrategyLab" },
    { key: "contact_address", label: "Address", type: "text", default: "Murrieta, CA 92563" },
    { key: "contact_phone", label: "Phone", type: "text", default: "(951) 528-1192" },
    { key: "contact_email", label: "Email", type: "text", default: "" },
    { key: "google_reviews_url", label: "Google reviews URL", type: "url", default: "", help: "Link to your Google Business reviews. The reviews call-to-action only appears once this is set." },
    { key: "footer_tagline", label: "Footer tagline", type: "textarea", default: "Helping mission-driven organizations transform through people-first innovation, modular agentic workflows, and performance-driven architecture." },
    { key: "footer_copyright", label: "Footer copyright", type: "text", default: "Copyright \u00a9 2026 Insight Strategy Lab - All Rights Reserved." },
  ],
};

export const HOME_GROUP: ContentGroup = {
  page: "home",
  title: "Home Page",
  fields: [
    { key: "hero_badge", label: "Hero badge", type: "text", default: "Veteran Owned · Secure · Proven" },
    { key: "hero_title", label: "Hero headline", type: "textarea", default: "Small Business Owners, Get Custom Systems Tailored to Your Workflow" },
    { key: "hero_subtitle", label: "Hero subtitle", type: "text", default: "CRMs · Automations · Dashboards · AI" },
    { key: "hero_cta_primary", label: "Primary button", type: "text", default: "Schedule your free strategy call" },
    { key: "hero_cta_secondary", label: "Secondary button", type: "text", default: "See how it works" },
    { key: "how_heading", label: "How it works - heading", type: "text", default: "How It Works" },
    { key: "how_subtitle", label: "How it works - subtitle", type: "textarea", default: "We don't force you into generic templates. We build for how you actually operate." },
    { key: "step1_title", label: "Step 1 title", type: "text", default: "Diagnose" },
    { key: "step1_desc", label: "Step 1 description", type: "textarea", default: "Identify your biggest operational bottlenecks and time-sinks." },
    { key: "step2_title", label: "Step 2 title", type: "text", default: "Design" },
    { key: "step2_desc", label: "Step 2 description", type: "textarea", default: "Map out a custom workflow and system architecture." },
    { key: "step3_title", label: "Step 3 title", type: "text", default: "Build" },
    { key: "step3_desc", label: "Step 3 description", type: "textarea", default: "Develop the tailored solution with secure, reliable tools." },
    { key: "step4_title", label: "Step 4 title", type: "text", default: "Deploy" },
    { key: "step4_desc", label: "Step 4 description", type: "textarea", default: "Launch into your operations and provide ongoing support." },
    { key: "who_heading", label: "Who it's for - heading", type: "textarea", default: "Built for operators buried in manual work." },
    { key: "who_body", label: "Who it's for - body", type: "textarea", default: "Insight Strategy Lab partners with gym & training-facility owners, property managers, and service businesses who are hitting an operational ceiling." },
    { key: "who_bullets", label: "Who it's for - bullet points", type: "list", default: "Stop chasing leads through scattered spreadsheets\nAutomate repetitive admin and follow-ups\nGet clear visibility into your metrics and KPIs\nScale your capacity without doubling your headcount" },
    { key: "who_cta", label: "Who it's for - button", type: "text", default: "View Our Services" },
    { key: "who_image", label: "Who it's for - image", type: "image", default: "", help: "Optional. Replaces the placeholder graphic beside the section when set." },
    { key: "who_video", label: "Who it's for - video", type: "video", default: "", help: "Optional. YouTube/Vimeo link or uploaded file. Takes priority over the image." },
    { key: "systems_heading", label: "Systems section - heading", type: "text", default: "Systems in Production" },
    { key: "systems_subtitle", label: "Systems section - subtitle", type: "textarea", default: "Real tools built for real businesses. See what's possible when you move beyond generic software." },
    { key: "testimonials_heading", label: "Testimonials heading", type: "text", default: "Trusted by Operators" },
    { key: "review_quote", label: "Featured review - quote", type: "textarea", default: "", help: "The review text to feature below the hero. Leave empty to hide the section." },
    { key: "review_author", label: "Featured review - author name", type: "text", default: "" },
    { key: "review_role", label: "Featured review - author title / location", type: "text", default: "" },
    { key: "review_rating", label: "Featured review - star rating (1-5)", type: "number", default: "5" },
    { key: "review_link", label: "Featured review - Google link", type: "url", default: "https://maps.app.goo.gl/fbzCAdZQJHdtRAnJ8", help: "Where 'Read on Google' opens." },
  ],
};

export const SERVICES_GROUP: ContentGroup = {
  page: "services",
  title: "Services & Pricing Page",
  fields: [
    { key: "hero_title", label: "Page title", type: "text", default: "Services & Pricing" },
    { key: "hero_subtitle", label: "Page subtitle", type: "textarea", default: "Why no flat prices? Because every system is scoped to you, not forced into a predetermined template." },
    { key: "build_heading", label: "What we build - heading", type: "text", default: "What We Build" },
    { key: "cap1_title", label: "Capability 1 - title", type: "text", default: "Custom CRMs" },
    { key: "cap1_points", label: "Capability 1 - points", type: "list", default: "Client onboarding\nNotes, history & touch-points\nCommunication flows\nProgress tracking" },
    { key: "cap2_title", label: "Capability 2 - title", type: "text", default: "Automations" },
    { key: "cap2_points", label: "Capability 2 - points", type: "list", default: "Intake -> workflow routing\nAppointment reminders\nFollow-up sequences\nInternal task automation" },
    { key: "cap3_title", label: "Capability 3 - title", type: "text", default: "Dashboards & OS Systems" },
    { key: "cap3_points", label: "Capability 3 - points", type: "list", default: "Metrics & KPIs\nScheduling\nWorkflows\nTask management\nMulti-user role systems" },
    { key: "cap4_title", label: "Capability 4 - title", type: "text", default: "AI Tools" },
    { key: "cap4_points", label: "Capability 4 - points", type: "list", default: "Lead scoring\nRecommendations\nClient personalization\nAI-powered reporting" },
    { key: "models_heading", label: "Engagement models - heading", type: "text", default: "Engagement Models" },
    { key: "model1_title", label: "Model 1 - title", type: "text", default: "We Own, We Manage" },
    { key: "model1_fee", label: "Model 1 - fee", type: "text", default: "Low monthly subscription" },
    { key: "model1_desc", label: "Model 1 - description", type: "textarea", default: "Perfect for businesses that want a proven system managed entirely by our team without upfront capital expense." },
    { key: "model2_title", label: "Model 2 - title", type: "text", default: "You Own, We Manage" },
    { key: "model2_fee", label: "Model 2 - fee", type: "text", default: "Moderate setup fee + monthly support" },
    { key: "model2_desc", label: "Model 2 - description", type: "textarea", default: "You own the IP and architecture, but we handle the ongoing maintenance, hosting, and adjustments." },
    { key: "model3_title", label: "Model 3 - title", type: "text", default: "You Own, You Manage" },
    { key: "model3_fee", label: "Model 3 - fee", type: "text", default: "Custom one-time project fee" },
    { key: "model3_desc", label: "Model 3 - description", type: "textarea", default: "A pure build-and-transfer model. We build your custom system, train your team, and hand over the keys." },
    { key: "cta_heading", label: "Bottom CTA - heading", type: "text", default: "Ready to Build Your Custom System?" },
    { key: "cta_button", label: "Bottom CTA - button", type: "text", default: "Book a free strategy call" },
  ],
};

export const APPS_GROUP: ContentGroup = {
  page: "apps",
  title: "Apps in Production Page",
  description: "Text sections on the Apps in Production page. The systems themselves (including 'What it does', 'Problem solved', and 'Outcome') are managed per-app in the Apps tab.",
  fields: [
    { key: "hero_title", label: "Page title", type: "text", default: "Real Systems Running Inside Businesses" },
    { key: "hero_subtitle", label: "Page subtitle", type: "textarea", default: "These aren't prototypes or templates. These are production systems actively used to run operations, manage clients, and drive decisions." },
    { key: "gallery_label", label: "Label above the systems", type: "text", default: "See the systems in action", help: "Small heading shown directly above the gallery. Leave empty to hide." },
    { key: "includes_heading", label: "'Every system includes' - heading", type: "text", default: "Every System We Build Includes", help: "Leave empty to hide the whole section." },
    { key: "includes_items", label: "'Every system includes' - items", type: "list", default: "Centralized data (a single source of truth)\nWorkflow automation that reduces manual work\nRole-based views so each user sees what matters\nReal-time reporting and dashboards\nScalable architecture that grows with your business" },
    { key: "cta_heading", label: "Bottom CTA - heading", type: "text", default: "Want a system like this built for your business?", help: "Leave empty to hide the bottom call-to-action." },
    { key: "cta_body", label: "Bottom CTA - body", type: "textarea", default: "We start by mapping your current operations and identifying the highest-leverage system to build first." },
    { key: "cta_button", label: "Bottom CTA - button", type: "text", default: "Book a free strategy call" },
    { key: "empty_heading", label: "Empty state - heading", type: "text", default: "Showcase updating", help: "Shown when no apps are published yet." },
    { key: "empty_body", label: "Empty state - body", type: "textarea", default: "We are currently compiling our latest case studies and production systems." },
  ],
};

export const ABOUT_GROUP: ContentGroup = {
  page: "about",
  title: "About Page",
  fields: [
    { key: "hero_title", label: "Page title", type: "text", default: "About the Founder" },
    { key: "photo", label: "Founder photo", type: "image", default: "", help: "Optional. Shows at the top of the page when set." },
    { key: "lead", label: "Lead paragraph", type: "textarea", default: "Bill Tamayo is a 25+ year U.S. military veteran, lifelong learner, and organizational strategist who helps leaders navigate complexity with clarity, purpose, and systemized insight. A family man at heart and a systems thinker by trade, Bill blends experience, empathy, and execution in everything he builds." },
    { key: "body", label: "Body paragraph", type: "textarea", default: "Bill is the founder of Insight Strategy Lab, a consultancy dedicated to helping mission-driven organizations transform through people-first innovation, modular agentic workflows, and performance-driven architecture. His work centers on creating simple, elegant systems that remove operational friction and empower small businesses to focus on the work that matters." },
    { key: "creds_heading", label: "Credentials - heading", type: "text", default: "Education & Professional Credentials" },
    { key: "creds", label: "Credentials list", type: "list", default: "BBA in Human Resource Management (minor in Economics)\nMS in Management\nMA in Military Studies\nMBA in Business" },
    { key: "badges_heading", label: "Badges & certifications - heading", type: "text", default: "Certifications & Badges" },
    { key: "badge_1", label: "Badge 1 image", type: "image", default: "", help: "Optional. Upload or link a certification / credential badge image." },
    { key: "badge_1_link", label: "Badge 1 link", type: "url", default: "", help: "Optional. Where the badge opens when clicked (e.g. the certificate page)." },
    { key: "badge_2", label: "Badge 2 image", type: "image", default: "" },
    { key: "badge_2_link", label: "Badge 2 link", type: "url", default: "" },
    { key: "badge_3", label: "Badge 3 image", type: "image", default: "" },
    { key: "badge_3_link", label: "Badge 3 link", type: "url", default: "" },
    { key: "badge_4", label: "Badge 4 image", type: "image", default: "" },
    { key: "badge_4_link", label: "Badge 4 link", type: "url", default: "" },
    { key: "badge_5", label: "Badge 5 image", type: "image", default: "" },
    { key: "badge_5_link", label: "Badge 5 link", type: "url", default: "" },
    { key: "badge_6", label: "Badge 6 image", type: "image", default: "" },
    { key: "badge_6_link", label: "Badge 6 link", type: "url", default: "" },
    { key: "pubs_heading", label: "Publications - heading", type: "text", default: "Publications" },
    { key: "pub_1_title", label: "Publication 1 title", type: "text", default: "", help: "Optional. e.g. the title of a thesis or paper." },
    { key: "pub_1_link", label: "Publication 1 URL", type: "url", default: "", help: "Optional. Link to read the publication." },
    { key: "pub_2_title", label: "Publication 2 title", type: "text", default: "" },
    { key: "pub_2_link", label: "Publication 2 URL", type: "url", default: "" },
    { key: "pub_3_title", label: "Publication 3 title", type: "text", default: "" },
    { key: "pub_3_link", label: "Publication 3 URL", type: "url", default: "" },
    { key: "pub_4_title", label: "Publication 4 title", type: "text", default: "" },
    { key: "pub_4_link", label: "Publication 4 URL", type: "url", default: "" },
  ],
};

export const CONTACT_GROUP: ContentGroup = {
  page: "contact",
  title: "Contact Page",
  fields: [
    { key: "hero_title", label: "Page title", type: "text", default: "Contact Us" },
    { key: "intro", label: "Intro paragraph", type: "textarea", default: "Tell us about your business and where the friction is. The more you share, the sharper the system we can scope for you." },
  ],
};

export const CONTENT_GROUPS: ContentGroup[] = [
  GLOBAL_GROUP,
  HOME_GROUP,
  SERVICES_GROUP,
  APPS_GROUP,
  ABOUT_GROUP,
  CONTACT_GROUP,
];

export const PAGE_GROUPS: ContentGroup[] = [
  HOME_GROUP,
  SERVICES_GROUP,
  APPS_GROUP,
  ABOUT_GROUP,
  CONTACT_GROUP,
];

/** Flatten all defaults for a page into a key -> default map. */
export function defaultsFor(page: string): Record<string, string> {
  const group = CONTENT_GROUPS.find((g) => g.page === page);
  const out: Record<string, string> = {};
  if (group) for (const f of group.fields) out[f.key] = f.default;
  return out;
}

export function fieldDef(page: string, key: string): ContentField | undefined {
  return CONTENT_GROUPS.find((g) => g.page === page)?.fields.find((f) => f.key === key);
}
