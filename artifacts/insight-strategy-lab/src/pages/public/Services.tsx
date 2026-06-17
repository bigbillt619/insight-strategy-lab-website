import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Services() {
  const capabilities = [
    {
      title: "Custom CRMs",
      points: ["Client onboarding", "Notes, history & touch-points", "Communication flows", "Progress tracking"]
    },
    {
      title: "Automations",
      points: ["Intake -> workflow routing", "Appointment reminders", "Follow-up sequences", "Internal task automation"]
    },
    {
      title: "Dashboards & OS Systems",
      points: ["Metrics & KPIs", "Scheduling", "Workflows", "Task management", "Multi-user role systems"]
    },
    {
      title: "AI Tools",
      points: ["Lead scoring", "Recommendations", "Client personalization", "AI-powered reporting"]
    }
  ];

  const models = [
    {
      title: "We Own, We Manage",
      fee: "Low monthly subscription",
      desc: "Perfect for businesses that want a proven system managed entirely by our team without upfront capital expense."
    },
    {
      title: "You Own, We Manage",
      fee: "Moderate setup fee + monthly support",
      desc: "You own the IP and architecture, but we handle the ongoing maintenance, hosting, and adjustments."
    },
    {
      title: "You Own, You Manage",
      fee: "Custom one-time project fee",
      desc: "A pure build-and-transfer model. We build your custom system, train your team, and hand over the keys."
    }
  ];

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="mb-20 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Services & Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Why no flat prices? Because every system is scoped to you, not forced into a predetermined template.
          </p>
        </div>

        {/* What We Build */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-foreground mb-10">What We Build</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilities.map((cat, i) => (
              <div key={i} className="p-8 border border-border rounded-2xl bg-card">
                <h3 className="text-2xl font-bold text-foreground mb-6">{cat.title}</h3>
                <ul className="space-y-4">
                  {cat.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Models */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-foreground mb-10">Engagement Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model, i) => (
              <div key={i} className={`p-8 border rounded-2xl flex flex-col ${i === 1 ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
                <h3 className="text-2xl font-bold mb-2">{model.title}</h3>
                <p className={`text-sm font-semibold uppercase tracking-wider mb-6 ${i === 1 ? 'text-primary-foreground/80' : 'text-accent'}`}>
                  {model.fee}
                </p>
                <p className={`leading-relaxed ${i === 1 ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                  {model.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 md:p-20 bg-secondary/50 rounded-3xl border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Build Your Custom System?</h2>
          <Button asChild size="lg" className="h-14 px-8 text-lg">
            <Link href="/diagnostic">
              Book a free strategy call <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
