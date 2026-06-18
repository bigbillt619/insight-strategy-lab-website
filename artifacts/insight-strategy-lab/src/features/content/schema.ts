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
    { key: "seo_title", label: "SEO page title", type: "text", default: "AI Systems for Small Businesses in Murrieta, Menifee, Temecula, Wildomar, and Lake Elsinore | Insight Strategy Lab", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "We build AI-powered systems that help small businesses in Murrieta, Menifee, Temecula, Wildomar, and Lake Elsinore automate operations, scale smarter, and make better decisions.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
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
  description: "Framed as a system-build engagement, not a services menu. Components are presented as system layers and every section bridges into the System Diagnostic funnel.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "AI Automation & Business Systems in Murrieta & Temecula Area | Insight Strategy Lab", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "AI system design and implementation for small and service businesses across Murrieta, Temecula, Menifee, and surrounding areas to streamline operations and scale efficiently.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "hero_title", label: "Page title", type: "text", default: "How We Build Your System" },
    { key: "hero_subtitle", label: "Page subtitle", type: "textarea", default: "Every system is designed around how your business actually operates \u2014 not forced into templates or prebuilt tools." },
    { key: "banner_heading", label: "Diagnostic banner - heading", type: "text", default: "Most clients begin with a short system diagnostic.", help: "Shown near the top of the page. Leave empty to hide." },
    { key: "banner_body", label: "Diagnostic banner - body", type: "textarea", default: "This helps us identify your biggest bottlenecks and determine the right system to build." },
    { key: "banner_button", label: "Diagnostic banner - button", type: "text", default: "Start System Diagnostic" },
    { key: "build_heading", label: "System components - heading", type: "text", default: "System Components" },
    { key: "build_intro", label: "System components - intro", type: "textarea", default: "Every system we build integrates these components into one unified operating layer." },
    { key: "cap1_title", label: "Component 1 - title", type: "text", default: "Client & Operations Layer" },
    { key: "cap1_points", label: "Component 1 - points", type: "list", default: "Client onboarding\nCRM, notes, history & touch-points\nCommunication tracking\nProgress tracking" },
    { key: "cap2_title", label: "Component 2 - title", type: "text", default: "Workflow & Automation Layer" },
    { key: "cap2_points", label: "Component 2 - points", type: "list", default: "Intake -> workflow routing\nAppointment reminders\nFollow-up sequences\nInternal task automation" },
    { key: "cap3_title", label: "Component 3 - title", type: "text", default: "Operational Intelligence Layer" },
    { key: "cap3_points", label: "Component 3 - points", type: "list", default: "Dashboards\nMetrics & KPIs\nReporting\nMulti-user role views" },
    { key: "cap4_title", label: "Component 4 - title", type: "text", default: "AI Enhancement Layer" },
    { key: "cap4_points", label: "Component 4 - points", type: "list", default: "Lead scoring\nRecommendations\nClient personalization\nPredictive insights" },
    { key: "models_heading", label: "How we engage - heading", type: "text", default: "How We Engage" },
    { key: "models_intro", label: "How we engage - intro", type: "textarea", default: "We structure every engagement based on how much ownership and control you want over your system." },
    { key: "model1_title", label: "Model 1 - title", type: "text", default: "Fully Managed System" },
    { key: "model1_fee", label: "Model 1 - investment", type: "text", default: "Typical investment: monthly subscription (no upfront build cost)" },
    { key: "model1_desc", label: "Model 1 - description", type: "textarea", default: "We design, build, host, and manage your system." },
    { key: "model1_best_for", label: "Model 1 - best for", type: "textarea", default: "Businesses that want results without managing the backend." },
    { key: "model2_title", label: "Model 2 - title", type: "text", default: "Hybrid Ownership Model" },
    { key: "model2_fee", label: "Model 2 - investment", type: "text", default: "Typical investment: setup fee + monthly support" },
    { key: "model2_desc", label: "Model 2 - description", type: "textarea", default: "You own the system and architecture while we handle maintenance, updates, and support." },
    { key: "model2_best_for", label: "Model 2 - best for", type: "textarea", default: "Businesses that want control with expert support." },
    { key: "model3_title", label: "Model 3 - title", type: "text", default: "Full System Build & Transfer" },
    { key: "model3_fee", label: "Model 3 - investment", type: "text", default: "Typical investment: one-time build fee" },
    { key: "model3_desc", label: "Model 3 - description", type: "textarea", default: "We design and build your system, train your team, and hand over full control." },
    { key: "model3_best_for", label: "Model 3 - best for", type: "textarea", default: "Businesses that want complete ownership and internal management." },
    { key: "models_note", label: "How we engage - diagnostic note", type: "textarea", default: "Most clients start with a system diagnostic to determine which model fits best.", help: "Short prompt shown below the engagement models. Leave empty to hide." },
    { key: "scoped_heading", label: "Pricing positioning - heading", type: "text", default: "Why Systems Are Scoped Individually", help: "Leave empty to hide this section." },
    { key: "scoped_body", label: "Pricing positioning - body", type: "textarea", default: "Every system is built around your specific workflows, team structure, and operational needs.\n\nNo two businesses operate the same \u2014 and your system shouldn't either.", help: "Leave a blank line between paragraphs to create separate paragraphs." },
    { key: "get_heading", label: "What you get - heading", type: "text", default: "What You Get", help: "Leave empty to hide this section." },
    { key: "get_items", label: "What you get - items", type: "list", default: "A system designed specifically for how your business operates\nElimination of manual work and inefficiencies\nCentralized operations and visibility\nScalable architecture that grows with your business" },
    { key: "cta_heading", label: "Bottom CTA - heading", type: "text", default: "Ready to build the system your business actually needs?" },
    { key: "cta_body", label: "Bottom CTA - body", type: "textarea", default: "Start with a short system diagnostic to identify your biggest bottlenecks and the right system to build first.", help: "Optional line below the bottom CTA heading." },
    { key: "cta_button", label: "Bottom CTA - button", type: "text", default: "Start Your System Diagnostic" },
  ],
};

export const APPS_GROUP: ContentGroup = {
  page: "apps",
  title: "Apps in Production Page",
  description: "Text sections on the Apps in Production page. The systems themselves (including 'What it does', 'Problem solved', and 'Outcome') are managed per-app in the Apps tab.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "AI Tools & Applications | Insight Strategy Lab", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Explore custom-built AI tools and applications designed to automate workflows and improve business operations.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
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
  description: "Positioning page for the founder. Leads with capability (systems builder), backs it with credentials, and bridges into the System Diagnostic funnel.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "About Bill Tamayo Jr. | Digital Transformation Architect", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Meet Bill Tamayo Jr., founder of Insight Strategy Lab, helping small businesses implement practical AI systems that drive real results.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "hero_title", label: "Page title", type: "text", default: "The Architect Behind the Systems" },
    { key: "photo", label: "Founder photo", type: "image", default: "", help: "Optional. Shows at the top of the page when set." },
    { key: "lead", label: "Lead paragraph", type: "textarea", default: "I design and build operational systems that help service-based businesses run more efficiently, scale their capacity, and eliminate manual friction.\n\nWith over 25 years of experience in high-performance environments, I bring a systems-first approach to solving business problems \u2014 combining strategy, technology, and execution into one integrated solution.", help: "Leave a blank line between paragraphs to create separate paragraphs." },
    { key: "body", label: "Body paragraph", type: "textarea", default: "Insight Strategy Lab exists to build integrated operating systems for businesses that have outgrown spreadsheets, disconnected tools, and manual workflows.\n\nEvery system is designed to reduce friction, centralize operations, and help owners focus on growth instead of administrative overload.", help: "Leave a blank line between paragraphs to create separate paragraphs." },
    { key: "philosophy_heading", label: "Philosophy - heading", type: "text", default: "Philosophy", help: "Leave empty to hide the philosophy section." },
    { key: "philosophy_body", label: "Philosophy - body", type: "textarea", default: "Most businesses don't have a strategy problem.\nThey have a system problem.\n\nMy approach is simple: systems should reduce complexity, not add to it.\n\nEvery build is designed to simplify operations, eliminate friction, and make the business easier to run.", help: "Leave a blank line between paragraphs to create separate paragraphs." },
    { key: "creds_heading", label: "Credentials - heading", type: "text", default: "Foundation & Training" },
    { key: "creds_intro", label: "Credentials - intro", type: "textarea", default: "Formal education across management, analytics, and organizational systems provides the foundation behind every system built.", help: "Optional context line above the credentials list." },
    { key: "creds", label: "Credentials list", type: "list", default: "BBA in Human Resource Management (minor in Economics)\nMS in Management\nMA in Military Studies\nMBA in Business" },
    { key: "badges_heading", label: "Badges & certifications - heading", type: "text", default: "Certifications & Badges" },
    { key: "badges_caption", label: "Badges - caption", type: "textarea", default: "Additional certifications across analytics, systems, and digital transformation.", help: "Optional line shown above the badges." },
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
    { key: "pubs_heading", label: "Publications - heading", type: "text", default: "Research & Publications" },
    { key: "pubs_intro", label: "Publications - intro", type: "textarea", default: "My work includes research on operational systems, workforce dynamics, and organizational performance, reinforcing a systems-driven approach to business design.", help: "Optional context line above the publications list." },
    { key: "pub_1_title", label: "Publication 1 title", type: "text", default: "", help: "Optional. e.g. the title of a thesis or paper." },
    { key: "pub_1_link", label: "Publication 1 URL", type: "url", default: "", help: "Optional. Link to read the publication." },
    { key: "pub_2_title", label: "Publication 2 title", type: "text", default: "" },
    { key: "pub_2_link", label: "Publication 2 URL", type: "url", default: "" },
    { key: "pub_3_title", label: "Publication 3 title", type: "text", default: "" },
    { key: "pub_3_link", label: "Publication 3 URL", type: "url", default: "" },
    { key: "pub_4_title", label: "Publication 4 title", type: "text", default: "" },
    { key: "pub_4_link", label: "Publication 4 URL", type: "url", default: "" },
    { key: "howiwork_heading", label: "How I work - heading", type: "text", default: "How I Work", help: "Leave empty to hide this section." },
    { key: "howiwork_items", label: "How I work - steps", type: "list", default: "Diagnose the current system (or lack of one)\nDesign a system aligned to how the business operates\nBuild and integrate the solution\nSupport adoption and evolution over time", help: "One step per line." },
    { key: "cta_heading", label: "Bottom CTA - heading", type: "text", default: "Ready to see what your system could look like?", help: "Leave empty to hide the bottom call-to-action." },
    { key: "cta_body", label: "Bottom CTA - body", type: "textarea", default: "Start with the System Diagnostic to identify where your operations can improve." },
    { key: "cta_button", label: "Bottom CTA - button", type: "text", default: "Start System Diagnostic" },
  ],
};

export const CONTACT_GROUP: ContentGroup = {
  page: "contact",
  title: "Contact Page",
  description: "The contact page is the secondary path. The System Diagnostic is the primary funnel, so this page points people there first.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "Contact Insight Strategy Lab | Start Your AI Transformation", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Get in touch to explore how AI systems can improve your workflows, scale your business, and reduce manual effort.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "hero_title", label: "Page title", type: "text", default: "Direct Contact & Inquiries" },
    { key: "intro", label: "Intro paragraph", type: "textarea", default: "For referrals, direct connections, or anything that doesn't fit the diagnostic, reach us here. If you want a scoped system recommendation, start with the System Diagnostic first." },
    { key: "diagnostic_cta_heading", label: "Diagnostic redirect - heading", type: "text", default: "Looking to improve your systems?" },
    { key: "diagnostic_cta_body", label: "Diagnostic redirect - body", type: "textarea", default: "Start with our System Diagnostic so we can better understand your operations before we speak." },
    { key: "diagnostic_cta_button", label: "Diagnostic redirect - button", type: "text", default: "Start System Diagnostic" },
    { key: "form_heading", label: "Inquiry form - heading", type: "text", default: "General Inquiry / Direct Request" },
    { key: "form_submit", label: "Inquiry form - submit button", type: "text", default: "Submit Inquiry" },
  ],
};

export const DIAGNOSTIC_GROUP: ContentGroup = {
  page: "diagnostic",
  title: "Free Strategy Call Page",
  description: "Copy on the diagnostic / free strategy call flow (the intro framing, report, intake form, and confirmation). The audit questions are managed separately.",
  fields: [
    { key: "seo_title", label: "SEO page title", type: "text", default: "AI Business Diagnostic | Identify Opportunities to Automate & Scale", help: "Shown in browser tab and Google search results (~50–60 chars ideal)." },
    { key: "seo_description", label: "SEO meta description", type: "textarea", default: "Discover where AI can improve your business operations with a structured diagnostic designed for small and service-based businesses.", help: "Shown in Google search snippets (~140–160 chars ideal)." },
    { key: "wizard_intro_eyebrow", label: "Wizard intro - eyebrow", type: "text", default: "System Diagnostic", help: "Small label shown above the first question." },
    { key: "wizard_intro_body", label: "Wizard intro - body", type: "textarea", default: "We'll map your current operations so we can design the right system for your business." },
    { key: "wizard_outcome_heading", label: "Wizard intro - outcome heading", type: "text", default: "At the end of this, you'll have a clear picture of:" },
    { key: "wizard_outcome_items", label: "Wizard intro - outcome items", type: "list", default: "Where your current system is breaking down\nWhat should be built first\nWhat a working system would look like for your business", help: "One item per line." },
    { key: "report_label", label: "Report - label", type: "text", default: "Insight Report" },
    { key: "report_opportunity_prefix", label: "Report - opportunity prefix", type: "text", default: "Your Primary Opportunity:", help: "Shown before the recommended system name." },
    { key: "report_also_consider", label: "Report - 'also consider' heading", type: "text", default: "Also Consider:" },
    { key: "form_heading", label: "Intake form - heading", type: "text", default: "Claim Your Strategy Call" },
    { key: "form_body", label: "Intake form - body", type: "textarea", default: "We've prefilled your audit answers below \u2014 review or adjust anything, add any detail, and book your deep-dive with Bill Tamayo." },
    { key: "form_message_placeholder", label: "Intake form - message placeholder", type: "text", default: "Tell us about your current systems and the bottleneck you most want solved..." },
    { key: "form_submit", label: "Intake form - submit button", type: "text", default: "Submit & Schedule Call" },
    { key: "finished_heading", label: "Confirmation - heading", type: "text", default: "Audit Received" },
    { key: "finished_body", label: "Confirmation - body", type: "textarea", default: "Your results and intake have been saved. Bill will review your answers and reach out to schedule your free strategy call." },
    { key: "finished_button", label: "Confirmation - button", type: "text", default: "Return to Home" },
  ],
};

export const VEHICLE_QR_GROUP: ContentGroup = {
  page: "vehicle_qr",
  title: "QR Landing Page",
  description: "Copy for the private QR-code landing page (/vehicle-qr-code-1). Visitors arrive here after scanning the vehicle QR code.",
  fields: [
    { key: "hero_badge", label: "Hero badge", type: "text", default: "Private access" },
    { key: "hero_title", label: "Hero headline", type: "textarea", default: "You Found This for a Reason" },
    { key: "hero_subtitle", label: "Hero subtitle", type: "textarea", default: "I build AI-powered systems that help small businesses scale smarter, not harder." },
    { key: "hero_body", label: "Hero body text", type: "textarea", default: "If you're curious what that could look like for your business, you're in the right place." },
    { key: "hero_cta", label: "Hero CTA button", type: "text", default: "See How This Works" },
    { key: "value1_title", label: "Value block 1 - title", type: "text", default: "Automate operations" },
    { key: "value1_desc", label: "Value block 1 - description", type: "textarea", default: "Cut the repetitive, manual work that eats your team's day so the business runs without you babysitting it." },
    { key: "value2_title", label: "Value block 2 - title", type: "text", default: "Turn data into decisions" },
    { key: "value2_desc", label: "Value block 2 - description", type: "textarea", default: "Make your numbers actually useful — clear signals you can act on instead of spreadsheets nobody opens." },
    { key: "value3_title", label: "Value block 3 - title", type: "text", default: "Build scalable systems" },
    { key: "value3_desc", label: "Value block 3 - description", type: "textarea", default: "Put the right foundation in place so growth doesn't break what you've already built." },
    { key: "who_heading", label: "Who it's for - heading", type: "text", default: "Who This Is For" },
    { key: "who_items", label: "Who it's for - items", type: "list", default: "Business owners wearing too many hats\nService businesses trying to scale\nTeams drowning in manual processes\nPeople curious about using AI practically", help: "One item per line." },
    { key: "cred_intro", label: "Credibility - intro sentence", type: "textarea", default: "I'm Bill Tamayo Jr., a Digital Transformation Architect and founder of Insight Strategy Lab." },
    { key: "cred_items", label: "Credibility - bullet points", type: "list", default: "Build AI systems for small businesses\nFocus on real-world implementation (not theory)\nStrategy + execution", help: "One item per line." },
    { key: "cta_heading", label: "Bottom CTA - heading", type: "textarea", default: "Want to Explore What This Could Look Like for You?" },
    { key: "cta_primary", label: "Bottom CTA - primary button", type: "text", default: "Book a Quick Call" },
    { key: "cta_secondary", label: "Bottom CTA - secondary button", type: "text", default: "Send Me a Message" },
    { key: "closing", label: "Closing line", type: "textarea", default: "Also—thanks for scanning. That already puts you ahead of most people." },
  ],
};

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
