import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, X, ArrowRight, Play, Database,
  BarChart3, Layers, Brain, Map, Zap, Eye, Bot,
  GitBranch, TrendingUp, Clock, ClipboardList, Star,
  Shield, Award, Cpu, Heart,
} from "lucide-react";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { usePublishedApps } from "@/features/apps/api";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { VideoEmbed, youTubeThumb } from "@/components/MediaEmbed";
import { BOSVisualization } from "@/components/BOSVisualization";
import { FadeUp } from "@/components/FadeUp";
import type { AppItem } from "@/lib/types";

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.round(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCard({ value, suffix = "%", label, delay, active }: { value: number; suffix?: string; label: string; delay: number; active: boolean }) {
  const count = useCountUp(value, 1600, active);
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms` }}
    >
      <div className="text-5xl font-black mb-3" style={{ color: "#2563EB" }}>{count}{suffix}</div>
      <p className="text-gray-600 text-sm leading-relaxed">{label}</p>
    </div>
  );
}


function StatNum({ value, active }: { value: number; active: boolean }) {
  const count = useCountUp(value, 1600, active);
  return <>{count}</>;
}

function AppPreviewCard({ app }: { app: AppItem }) {
  const [playing, setPlaying] = useState(false);
  const thumb = youTubeThumb(app.youtube_url ?? "") ?? (app.thumbnail_url || "");
  const hasVideo = Boolean(app.youtube_url);
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-video bg-gray-50 relative overflow-hidden">
        {playing && hasVideo ? (
          <VideoEmbed url={app.youtube_url!} autoPlay className="absolute inset-0 h-full w-full rounded-none" />
        ) : thumb ? (
          <>
            <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            {hasVideo && (
              <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${app.title} video`} className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <Play className="h-6 w-6 translate-x-0.5 fill-current text-blue-600" />
                </span>
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="h-12 w-12 text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-6">
        <Link href="/apps" className="block">
          <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-blue-600 transition-colors">{app.title}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2">{app.description}</p>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "What is a Business Operating System?",
    a: "A Business Operating System is the framework that connects people, processes, technology, data, and AI into one unified way of operating. It creates visibility, accountability, consistency, and scalability across your entire organization.",
  },
  {
    q: "Do we need new software?",
    a: "Not necessarily. We first maximize the value of your existing systems before recommending additional investments. Our goal is to eliminate waste and create integration, not add complexity.",
  },
  {
    q: "What organizations do you work with?",
    a: "We support small businesses, nonprofits, and mission-driven organizations looking to improve operations, adopt AI, and scale effectively without adding unnecessary overhead.",
  },
  {
    q: "Can you help implement AI?",
    a: "Yes. We identify practical AI opportunities, select appropriate technologies, and integrate them into existing workflows so AI actually helps your team instead of creating more complexity.",
  },
  {
    q: "How long does a project take?",
    a: "Most engagements follow our 6-phase approach, starting with Discovery and Strategize before moving into Design and Implementation. Many clients start seeing measurable improvements within weeks. Full Business Operating System implementation timelines vary based on organizational complexity.",
  },
  {
    q: "Do you offer ongoing support?",
    a: "Yes. We provide implementation assistance, governance support, strategic advising, and continuous improvement services so your operating system evolves as your organization grows.",
  },
  {
    q: "How much does it cost?",
    a: "Pricing is customized based on organizational goals, complexity, and scope. We provide recommendations after an initial strategy session—there is no obligation.",
  },
];

export default function Home() {
  const { data: apps = [], isLoading: appsLoading } = usePublishedApps();
  const { get } = useContent("home");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const statsRef = useRef<HTMLElement>(null);
  const [statsInView, setStatsInView] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsInView(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleProcessScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-animate { animation: hero-fade-up 0.7s ease both; }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {/* ─── SECTION 1+2: HERO + STATS (two-column) ─────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle,#2563EB,transparent)", transform: "translate(20%,-20%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle,#2563EB,transparent)", transform: "translate(-30%,30%)" }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start py-8 md:py-10">

            {/* ── LEFT: Hero content ── */}
            <div>
              {/* Review badge */}
              <div className="hero-animate mb-2" style={{ animationDelay: "0ms" }}>
                <a
                  href="https://g.page/r/CX2HyTtBwIIVEAE/review"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB" }}
                >
                  <span aria-hidden="true">★★★★★</span> Trusted by Small Businesses
                </a>
              </div>

              {/* Credibility tags — row below badge */}
              <div className="hero-animate flex flex-wrap items-center gap-2 mb-4" style={{ animationDelay: "60ms" }}>
                {[
                  { icon: Brain,  label: "AI Business Strategy" },
                  { icon: Shield, label: "SHRM-CP" },
                  { icon: Award,  label: "Veteran" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border"
                    style={{ background: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.18)", color: "#1e40af" }}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>

              <h1 className="hero-animate text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight text-gray-900 mb-3" style={{ animationDelay: "120ms" }}>
                Finally get your people, processes, technology, data, and AI{" "}
                <span style={{ color: "#2563EB" }}>working together.</span>
              </h1>

              <p className="hero-animate text-sm text-gray-600 leading-relaxed mb-2" style={{ animationDelay: "200ms" }}>
                Build a scalable operating system that creates clarity, efficiency, accountability, and measurable growth — without adding complexity.
              </p>

              <p className="hero-animate text-sm font-semibold mb-4" style={{ animationDelay: "240ms", color: "#2563EB" }}>
                Stop managing disconnected systems — start leading with clarity, visibility, and confidence.
              </p>

              <div className="hero-animate flex flex-col sm:flex-row gap-3 mb-4" style={{ animationDelay: "280ms" }}>
                <Button asChild size="lg" className="text-base h-11 px-6 font-semibold" style={{ background: "#2563EB", borderColor: "#2563EB", color: "white" }}>
                  <Link href="/contact">Book Free Strategy Session</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base h-11 px-6 font-semibold">
                  <a href="#process" onClick={handleProcessScroll}>See How It Works</a>
                </Button>
              </div>

              <div className="hero-animate flex flex-wrap gap-x-4 gap-y-1.5" style={{ animationDelay: "340ms" }}>
                {[
                  "Eliminate manual work",
                  "Connect AI into one workflow",
                  "Real-time visibility",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#2563EB" }} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: BOS Framework Visualization ── */}
            <BOSVisualization />

          </div>
        </div>
      </section>

      {/* ─── SECTION: HIDDEN COST STATS ─────────────────────────── */}
      <section ref={statsRef} className="py-16 md:py-20" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">The Hidden Cost of Operational Complexity</h2>
            </FadeUp>
            <FadeUp delay={80}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Most organizations struggle not from lack of effort, but from systems that consume time, visibility, and growth.
              </p>
            </FadeUp>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { value: 36, label: "of workweek spent on admin instead of growth" },
              { value: 31, label: "of owners spend half their time on repetitive tasks" },
              { value: 81, label: "of leaders say digital transformation is essential" },
              { value: 56, label: "of organizations exceeded expected ROI with transformation" },
            ].map(({ value, label }, i) => (
              <StatCard key={label} value={value} label={label} delay={i * 100} active={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: PROBLEM ──────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Most Organizations Don't Have a People Problem.<br className="hidden md:block" /> They Have a Systems Problem.</h2>
            </FadeUp>
            <FadeUp delay={100}>
              <p className="text-gray-600 text-lg leading-relaxed">
                Information is scattered across platforms. Processes live inside people's heads. Teams duplicate work. Leadership lacks visibility. Everyone works harder, but outcomes don't improve.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Layers, title: "Disconnected Technology", desc: "Systems don't communicate, creating silos and inefficiencies that slow everyone down." },
              { icon: ClipboardList, title: "Manual Processes", desc: "Critical workflows rely on spreadsheets, emails, and workarounds instead of automated systems." },
              { icon: Eye, title: "Lack of Visibility", desc: "Leadership struggles to see performance data and identify operational bottlenecks in real time." },
              { icon: GitBranch, title: "Operational Bottlenecks", desc: "Growth slows because the organization depends on individuals rather than repeatable systems." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 100}>
                <div className="group h-full p-7 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(37,99,235,0.08)" }}>
                    <Icon className="h-6 w-6" style={{ color: "#2563EB" }} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: TRANSFORMATION ───────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">Imagine Operating With Complete Clarity</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-14 text-lg max-w-2xl mx-auto">Transform operational chaos into an integrated system that supports growth.</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 max-w-4xl mx-auto items-center">
            <FadeUp delay={0}>
              <div className="rounded-2xl border p-8 bg-white shadow-sm" style={{ borderColor: "rgba(220,38,38,0.2)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(220,38,38,0.1)" }}>
                    <X className="h-4 w-4" style={{ color: "#DC2626" }} aria-hidden="true" />
                  </div>
                  <h3 className="font-black text-gray-900 text-lg">Before</h3>
                </div>
                <ul className="space-y-4" aria-label="Before transformation">
                  {["Disorganized", "Reactive", "Manual", "Data Silos", "Slow Decisions", "Unclear Responsibilities"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <X className="h-4 w-4 shrink-0" style={{ color: "#DC2626" }} aria-hidden="true" />
                      <span className="text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={150}>
              <div className="flex items-center justify-center py-4 md:py-0">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-px h-8 md:hidden" style={{ background: "linear-gradient(to bottom,#DC2626,#2563EB)" }} aria-hidden="true" />
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }}>
                    <ArrowRight className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="w-px h-8 md:hidden" style={{ background: "linear-gradient(to bottom,#2563EB,#16A34A)" }} aria-hidden="true" />
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={100}>
              <div className="rounded-2xl border p-8 bg-white shadow-sm" style={{ borderColor: "rgba(22,163,74,0.2)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(22,163,74,0.1)" }}>
                    <CheckCircle2 className="h-4 w-4" style={{ color: "#16A34A" }} aria-hidden="true" />
                  </div>
                  <h3 className="font-black text-gray-900 text-lg">After</h3>
                </div>
                <ul className="space-y-4" aria-label="After transformation">
                  {["Aligned", "Efficient", "Automated", "Connected Data", "Faster Decisions", "Clear Accountability"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#16A34A" }} aria-hidden="true" />
                      <span className="text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: HOW WE HELP ──────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">How Insight Strategy Lab Helps</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-14 text-lg max-w-2xl mx-auto">Four core services designed to align your entire organization and drive measurable results.</p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: "Operational Assessment", desc: "Identify operational gaps, inefficiencies, and opportunities for improvement across your entire organization." },
              { icon: Layers, title: "Business Operating System Design", desc: "Create a framework that aligns people, processes, technology, data, and AI into one integrated operational model." },
              { icon: Bot, title: "AI Integration", desc: "Implement practical AI solutions that improve productivity, automate repetitive work, and reduce manual effort." },
              { icon: Map, title: "Digital Transformation Roadmap", desc: "Build a prioritized implementation plan that delivers measurable business outcomes at each milestone." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 100}>
                <div className="group h-full p-7 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(37,99,235,0.08)" }}>
                    <Icon className="h-6 w-6" style={{ color: "#2563EB" }} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
                  <span className="text-xs font-semibold border-b pb-px cursor-pointer group-hover:border-opacity-100 transition-all" style={{ color: "#2563EB", borderColor: "rgba(37,99,235,0.3)" }}>
                    Learn More →
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APPS SHOWCASE (optional) ────────────────────────────── */}
      {apps.length > 0 && (
        <section className="py-20 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-6">
            <FadeUp>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Real Systems Running Inside Businesses</h2>
                  <p className="text-gray-500 max-w-xl">These aren't prototypes or templates. These are production systems actively used to run operations.</p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <Link href="/apps">View All Apps</Link>
                </Button>
              </div>
            </FadeUp>
            {appsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {apps.slice(0, 3).map((app) => <AppPreviewCard key={app.id} app={app} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── SECTION 6: WHY ISL ──────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <FadeUp>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
                  Most Consultants Give Advice.<br />
                  <span style={{ color: "#2563EB" }}>We Build Operating Systems.</span>
                </h2>
              </FadeUp>
              <div className="space-y-5">
                {[
                  "Most consultants deliver recommendations.",
                  "Most software vendors sell tools.",
                  "Most AI providers sell automation.",
                ].map((text, i) => (
                  <FadeUp key={i} delay={i * 80}>
                    <p className="text-gray-500 text-lg">{text}</p>
                  </FadeUp>
                ))}
                <FadeUp delay={300}>
                  <p className="text-gray-900 text-lg font-semibold leading-relaxed pt-2">
                    We integrate everything into a single operational framework that helps organizations operate with clarity, consistency, accountability, and confidence.
                  </p>
                </FadeUp>
              </div>
            </div>
            <FadeUp delay={100}>
              <div className="flex items-center justify-center">
                <BOSVisualization mode="diagram" className="w-full max-w-[320px]" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: RESULTS & BENEFITS ──────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">What Better Operations Look Like</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-14 text-lg max-w-2xl mx-auto">The result is not just efficiency. It's a stronger, more scalable organization.</p>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Clock, label: "Faster Decision-Making" },
              { icon: ClipboardList, label: "Reduced Administrative Work" },
              { icon: Eye, label: "Improved Visibility" },
              { icon: Zap, label: "More Automation" },
              { icon: GitBranch, label: "Standardized Workflows" },
              { icon: TrendingUp, label: "Scalable Growth" },
            ].map(({ icon: Icon, label }, i) => (
              <FadeUp key={label} delay={i * 80}>
                <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,99,235,0.08)" }}>
                    <Icon className="h-6 w-6" style={{ color: "#2563EB" }} aria-hidden="true" />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{label}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: PROCESS ──────────────────────────────────── */}
      <section id="process" className="py-20 md:py-28 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">Our 6-Phase Approach</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-10 text-lg max-w-xl mx-auto">
              A structured, proven methodology that takes organizations from operational chaos to a fully integrated Business Operating System.
            </p>
          </FadeUp>

          {/* Intro video */}
          <FadeUp delay={150}>
            <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-100" style={{ background: "#0f172a" }}>
              <video
                src="/intro-video.mp4"
                controls
                preload="metadata"
                className="w-full block"
                style={{ maxHeight: "520px" }}
                aria-label="Insight Strategy Lab introduction and 6-phase approach overview"
              >
                Your browser does not support video playback.
              </video>
            </div>
          </FadeUp>

          {/* 6-phase cards */}
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <p className="text-center text-xs font-bold uppercase tracking-widest mb-10" style={{ color: "#2563EB" }}>The Six Phases</p>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {[
                { num: "01", label: "Discover", desc: "Assess the current state of your people, processes, technology, data, and systems to identify gaps and opportunities." },
                { num: "02", label: "Strategize", desc: "Define organizational goals, priorities, and the blueprint for your Business Operating System." },
                { num: "03", label: "Design", desc: "Map workflows, accountability structures, integration points, and the operating model in detail." },
                { num: "04", label: "Implement", desc: "Deploy technology, automation, and new operational workflows across the organization." },
                { num: "05", label: "Integrate", desc: "Connect people, data, and AI into one unified system that operates consistently at scale." },
                { num: "06", label: "Optimize", desc: "Measure outcomes, refine systems, and continuously improve performance and scalability." },
              ].map(({ num, label, desc }, i) => (
                <FadeUp key={label} delay={i * 80}>
                  <div className="h-full flex flex-col p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 font-black text-base text-white shrink-0" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }}>
                      {num}
                    </div>
                    <h3 className="font-black text-gray-900 mb-2 text-base md:text-lg">{label}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: FAQ ──────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">Frequently Asked Questions</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-12 text-lg max-w-xl mx-auto">Everything you need to know about working with Insight Strategy Lab.</p>
          </FadeUp>
          <FadeUp delay={150}>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <Accordion type="single" collapsible className="divide-y divide-gray-100">
                {FAQ_ITEMS.map(({ q, a }, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-0">
                    <AccordionTrigger className="px-7 py-5 text-left text-[15px] font-semibold text-gray-900 hover:no-underline hover:bg-gray-50 transition-colors">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="px-7 pb-6 text-gray-600 leading-relaxed text-[15px]">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── SECTION 10: FINAL CTA ───────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#111827" }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle,#2563EB,transparent)" }} />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <div className="flex items-center justify-center gap-1 mb-8" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-5 w-5 fill-current" style={{ color: "#2563EB" }} />)}
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Stop Managing Chaos.<br />Start Operating With Clarity.
            </h2>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Get a clear understanding of your biggest operational opportunities and a practical roadmap for improvement.
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="text-base h-12 px-8 font-semibold" style={{ background: "#2563EB", borderColor: "#2563EB", color: "white" }}>
                <Link href="/contact">Book Your Free Strategy Session</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base h-12 px-8 font-semibold text-white border-white/20 hover:bg-white/5">
                <Link href="/contact">Schedule a Discovery Call</Link>
              </Button>
            </div>
          </FadeUp>
          <FadeUp delay={400}>
            <p className="text-gray-500 text-sm">No obligation. Just actionable insights and a clear path forward.</p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
