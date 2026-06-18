import { useEffect } from "react";
import { Link } from "wouter";
import {
  Zap,
  BarChart,
  Layers,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/features/content/api";
import logo from "@/assets/logo.png";

const VALUE_BLOCKS = [
  {
    icon: Zap,
    title: "Automate operations",
    desc: "Cut the repetitive, manual work that eats your team's day so the business runs without you babysitting it.",
  },
  {
    icon: BarChart,
    title: "Turn data into decisions",
    desc: "Make your numbers actually useful — clear signals you can act on instead of spreadsheets nobody opens.",
  },
  {
    icon: Layers,
    title: "Build scalable systems",
    desc: "Put the right foundation in place so growth doesn't break what you've already built.",
  },
];

const WHO_FOR = [
  "Business owners wearing too many hats",
  "Service businesses trying to scale",
  "Teams drowning in manual processes",
  "People curious about using AI practically",
];

const CREDIBILITY = [
  "Build AI systems for small businesses",
  "Focus on real-world implementation (not theory)",
  "Strategy + execution",
];

/**
 * Hidden, QR-only landing page reachable solely via direct URL
 * (/vehicle-qr-code-1). Rendered outside PublicLayout, so it has no shared
 * Navbar/Footer — only a minimal logo header. Excluded from indexing via a
 * page-scoped robots meta (set on mount, restored on unmount) plus a
 * robots.txt disallow rule.
 */
export default function VehicleQrLanding() {
  const { get } = useContent("global");
  const logoScale = Number(get("logo_scale")) || 1;
  const logoStyle = { height: `${3.5 * logoScale}rem` };

  useEffect(() => {
    sessionStorage.setItem("isl_lead_source", "vehicle_qr");

    const existing = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    const previousContent = existing?.getAttribute("content") ?? null;

    let created = false;
    let meta = existing;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
      created = true;
    }
    meta.setAttribute("content", "noindex, nofollow");

    return () => {
      if (!meta) return;
      if (created) {
        meta.remove();
      } else if (previousContent !== null) {
        meta.setAttribute("content", previousContent);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal header — logo only, no navigation */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 h-20 flex items-center">
          <img
            src={logo}
            alt="Insight Strategy Lab"
            className="w-auto"
            style={logoStyle}
          />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
              <Zap className="h-4 w-4 text-accent" />
              <span>Private access</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              You Found This for a Reason
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              I build AI-powered systems that help small businesses scale
              smarter, not harder.
            </p>
            <p className="text-base text-muted-foreground">
              If you're curious what that could look like for your business,
              you're in the right place.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                <Link href="/diagnostic">
                  See How This Works
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What I do */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUE_BLOCKS.map((block) => (
              <div
                key={block.title}
                className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border shadow-sm"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <block.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{block.title}</h3>
                <p className="text-sm text-muted-foreground">{block.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">
              Who This Is For
            </h2>
            <ul className="space-y-4">
              {WHO_FOR.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-foreground text-lg"
                >
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quick credibility */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl shadow-sm p-8 sm:p-10">
            <p className="text-lg text-foreground mb-8">
              I'm <span className="font-semibold">Bill Tamayo Jr.</span>, a
              Digital Transformation Architect and founder of Insight Strategy
              Lab.
            </p>
            <ul className="space-y-4">
              {CREDIBILITY.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-foreground"
                >
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA block */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Want to Explore What This Could Look Like for You?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                <Link href="/diagnostic">
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Book a Quick Call
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg h-14 px-8"
              >
                <Link href="/contact">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send Me a Message
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Closing line */}
      <section className="pb-24 bg-background">
        <div className="container mx-auto px-4">
          <p className="max-w-2xl mx-auto text-center text-muted-foreground">
            Also—thanks for scanning. That already puts you ahead of most
            people.
          </p>
        </div>
      </section>
    </div>
  );
}
