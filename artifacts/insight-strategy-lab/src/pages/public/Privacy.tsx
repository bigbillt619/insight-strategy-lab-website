import { usePageMeta } from "@/lib/usePageMeta";

export default function Privacy() {
  usePageMeta({
    title: "Privacy, Governance & Data Protection | Insight Strategy Lab",
    description:
      "Learn how Insight Strategy Lab protects client information through privacy, governance, risk management, compliance, and responsible technology practices.",
  });

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Privacy, Governance & Data Protection Commitment
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Trust is not a feature—it is a responsibility.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-p:text-muted-foreground max-w-none">
          <p>
            At Insight Strategy Lab (ISL), we are committed to protecting client information,
            minimizing risk, maintaining strong governance practices, and handling data with
            integrity, transparency, and respect. As a veteran-owned consulting practice focused
            on business operating systems, digital transformation, data, and AI, we recognize
            that trust is foundational to every engagement.
          </p>

          <div className="not-prose border-l-4 border-accent bg-secondary/50 rounded-r-xl p-6 my-10">
            <p className="text-lg font-semibold text-foreground m-0">
              Insight Strategy Lab does not sell, rent, trade, distribute, or monetize personal
              information or client data to third parties.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-3">Our Commitment</h3>
          <p>We are committed to:</p>
          <ul>
            <li>Protecting client and stakeholder information</li>
            <li>Minimizing privacy, cybersecurity, and operational risks</li>
            <li>Applying sound governance practices</li>
            <li>Using information only for authorized business purposes</li>
            <li>Supporting ethical and responsible AI adoption</li>
            <li>Continuously improving our security and privacy posture</li>
          </ul>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">Information We Collect</h3>
          <p>We collect only the information necessary to:</p>
          <ul>
            <li>Respond to inquiries and requests</li>
            <li>Deliver consulting services</li>
            <li>Conduct assessments and diagnostics</li>
            <li>Improve website functionality and user experience</li>
            <li>Communicate with prospective and current clients</li>
          </ul>
          <p>Information may include:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Organization information</li>
            <li>Assessment responses</li>
            <li>Website analytics</li>
            <li>Information voluntarily submitted through forms</li>
          </ul>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">We Do Not Sell Your Information</h3>
          <p>
            Insight Strategy Lab does not sell, rent, trade, distribute, or monetize personal
            information or client data to third parties.
          </p>
          <p>Information provided to ISL is used solely to:</p>
          <ul>
            <li>Deliver requested services</li>
            <li>Support client engagements</li>
            <li>Conduct business operations</li>
            <li>Satisfy legal or contractual obligations</li>
          </ul>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">Limited Information Sharing</h3>
          <p>Information may be shared only when necessary to:</p>
          <ul>
            <li>Deliver contracted services through trusted providers</li>
            <li>Comply with legal requirements</li>
            <li>Protect the security, rights, or safety of clients and stakeholders</li>
          </ul>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">Governance & Risk Management</h3>
          <p>Our approach incorporates:</p>
          <ul>
            <li>Data minimization</li>
            <li>Access controls</li>
            <li>Accountability and oversight</li>
            <li>Risk assessment and mitigation</li>
            <li>Change management practices</li>
            <li>Responsible technology governance</li>
          </ul>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">AI & Emerging Technology</h3>
          <p>When using AI-enabled tools, ISL is committed to:</p>
          <ul>
            <li>Human oversight and accountability</li>
            <li>Ethical and responsible use</li>
            <li>Protection of confidential information</li>
            <li>Transparency where appropriate</li>
            <li>Continuous evaluation of risks and impacts</li>
          </ul>
          <p>
            Client confidential information will not be intentionally used to train public AI
            models without authorization.
          </p>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">Data Security</h3>
          <p>
            ISL maintains reasonable administrative, technical, and organizational safeguards
            designed to protect information from unauthorized access, disclosure, alteration,
            misuse, loss, or destruction.
          </p>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">Your Rights</h3>
          <p>You may request to:</p>
          <ul>
            <li>Access information we maintain about you</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion where legally permissible</li>
            <li>Opt out of future communications</li>
          </ul>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-6">Compliance Philosophy</h3>
          <div className="border-l-4 border-accent pl-6">
            <p className="text-lg text-foreground font-medium mb-1">Protect people.</p>
            <p className="text-lg text-foreground font-medium mb-1">Govern responsibly.</p>
            <p className="text-lg text-foreground font-medium mb-1">Minimize risk.</p>
            <p className="text-lg text-foreground font-medium mb-1">Respect privacy.</p>
            <p className="text-lg text-foreground font-medium">Build trust.</p>
          </div>
          <p>
            These principles guide how Insight Strategy Lab designs systems, manages information,
            and serves clients.
          </p>
          <p>
            This commitment will be reviewed periodically and updated as our services,
            technologies, and regulatory requirements evolve.
          </p>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">Contact</h3>
          <p className="mb-1">Insight Strategy Lab</p>
          <p className="mb-1">Murrieta, California</p>
          <p>
            <a href="mailto:info@insightstrategylab.com">info@insightstrategylab.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
