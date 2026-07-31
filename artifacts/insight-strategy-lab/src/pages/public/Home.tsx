import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2, Award, Shield, Brain, TrendingUp,
  Layers, ClipboardList, Eye, GitBranch, BarChart3, Bot, Map,
  Clock, Zap, X, ArrowRight, Star,
} from "lucide-react";
import { FadeUp } from "@/components/FadeUp";
import { resolveAppThumbnail, extractYouTubeId } from "@/lib/utils";
import { usePublishedApps } from "@/features/apps/api";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { BOSVisualization } from "@/components/BOSVisualization";

function StatCard({ value, label, delay, active }: { value: number; label: string; delay: number; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, value]);
  return (
    <FadeUp delay={delay}>
      <div className="flex flex-col items-center text-center p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: "#2563EB" }}>
          {active ? count : 0}%
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{label}</p>
      </div>
    </FadeUp>
  );
}

function AppPreviewCard({ app }: { app: { id: string; title: string; description: string; thumbnail_url?: string; youtube_url?: string } }) {
  const [imgError, setImgError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const resolvedThumb = resolveAppThumbnail(app.thumbnail_url, app.youtube_url);
  const showImg = resolvedThumb && !imgError;
  const ytId = extractYouTubeId(app.youtube_url ?? "") || extractYouTubeId(app.thumbnail_url ?? "");
  const canPlay = !!ytId;

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      <div className="aspect-video bg-gray-100 overflow-hidden relative">
        {playing && ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            title={app.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : showImg ? (
          <>
            <img
              src={resolvedThumb!}
              alt={app.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
            {canPlay && (
              <button
                onClick={() => setPlaying(true)}
                aria-label={`Play ${app.title} video`}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-600 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(37,99,235,0.08),rgba(37,99,235,0.02))" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(37,99,235,0.12)" }}>
              <Bot className="h-8 w-8" style={{ color: "#2563EB" }} aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <Link href="/apps">
          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer text-sm md:text-base">{app.title}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2">{app.description}</p>
        {canPlay && !playing && (
          <button
            onClick={() => setPlaying(true)}
            className="mt-3 self-start text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch demo
          </button>
        )}
      </div>
    </div>
  );
}

const PROBLEM_ICONS = [Layers, ClipboardList, Eye, GitBranch];
const RESULT_ICONS = [Clock, ClipboardList, Eye, Zap, GitBranch, TrendingUp];

export default function Home() {
  const { data: apps = [], isLoading: appsLoading } = usePublishedApps();
  const { get } = useContent("home");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const transformBefore = get("transform_before").split("\n").map((s) => s.trim()).filter(Boolean);
  const transformAfter = get("transform_after").split("\n").map((s) => s.trim()).filter(Boolean);
  const resultsItems = get("results_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const faqItems = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    q: get(`faq_${n}_q`),
    a: get(`faq_${n}_a`),
  })).filter((item) => item.q.trim() && item.a.trim());
  const finalCtaLines = get("final_cta_heading").split("\n");

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

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-animate { animation: hero-fade-up 0.7s ease both; }
      `}</style>

      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle,#2563EB,transparent)", transform: "translate(20%,-20%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle,#2563EB,transparent)", transform: "translate(-30%,30%)" }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-12 items-start py-8 md:py-10">

            <div>
              {/* Review badge */}
              <div className="hero-animate mb-2" style={{ animationDelay: "0ms" }}>
                <a
                  href={get("hero_badge_link") || "https://g.page/r/CX2HyTtBwIIVEAE/review"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB" }}
                >
                  {get("hero_badge")}
                </a>
              </div>

              {/* Credentials strip */}
              <p className="hero-animate text-xs font-semibold mb-4 flex flex-wrap gap-x-2 gap-y-0.5" style={{ animationDelay: "60ms", color: "#1e40af" }}>
                {get("hero_cred_1") && <span className="flex items-center gap-1"><Award className="h-3 w-3" aria-hidden="true" />{get("hero_cred_1")}</span>}
                {get("hero_cred_1") && get("hero_cred_2") && <span className="text-gray-300" aria-hidden="true">·</span>}
                {get("hero_cred_2") && <span className="flex items-center gap-1"><Shield className="h-3 w-3" aria-hidden="true" />{get("hero_cred_2")}</span>}
                {get("hero_cred_2") && get("hero_cred_3") && <span className="text-gray-300" aria-hidden="true">·</span>}
                {get("hero_cred_3") && <span className="flex items-center gap-1"><Brain className="h-3 w-3" aria-hidden="true" />{get("hero_cred_3")}</span>}
                {get("hero_cred_3") && get("hero_cred_4") && <span className="text-gray-300" aria-hidden="true">·</span>}
                {get("hero_cred_4") && <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" aria-hidden="true" />{get("hero_cred_4")}</span>}
              </p>

              <h1 className="hero-animate text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight text-gray-900 mb-1" style={{ animationDelay: "120ms" }}>
                {get("hero_headline")}
              </h1>
              <p className="hero-animate text-xl md:text-2xl font-black tracking-tight mb-3" style={{ animationDelay: "160ms", color: "#2563EB" }}>
                {get("hero_subtitle")}
              </p>

              <p className="hero-animate text-sm text-gray-600 leading-relaxed mb-2" style={{ animationDelay: "200ms" }}>
                {get("hero_body")}
              </p>

              {get("hero_tagline") && (
                <p className="hero-animate text-sm font-semibold mb-2" style={{ animationDelay: "230ms", color: "#2563EB" }}>
                  {get("hero_tagline")}
                </p>
              )}

              <div className="hero-animate flex flex-col sm:flex-row gap-3 mb-4" style={{ animationDelay: "270ms" }}>
                <Button asChild size="lg" className="text-base h-11 px-6 font-semibold" style={{ background: "#2563EB", borderColor: "#2563EB", color: "white" }}>
                  <Link href="/contact">{get("hero_cta_1")}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base h-11 px-6 font-semibold">
                  <Link href={get("hero_cta_2_href") || "/diagnostic"}>{get("hero_cta_2")}</Link>
                </Button>
              </div>

              <div className="hero-animate flex flex-wrap gap-x-4 gap-y-1.5" style={{ animationDelay: "340ms" }}>
                {[get("hero_check_1"), get("hero_check_2"), get("hero_check_3"), get("hero_check_4")].filter(Boolean).map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#2563EB" }} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <BOSVisualization />
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-16 md:py-20" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">{get("stats_heading")}</h2>
            </FadeUp>
            <FadeUp delay={80}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">{get("stats_body")}</p>
            </FadeUp>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { value: Number(get("stat_1_value")) || 36, label: get("stat_1_label") },
              { value: Number(get("stat_2_value")) || 31, label: get("stat_2_label") },
              { value: Number(get("stat_3_value")) || 81, label: get("stat_3_label") },
              { value: Number(get("stat_4_value")) || 56, label: get("stat_4_label") },
            ].map(({ value, label }, i) => (
              <StatCard key={i} value={value} label={label} delay={i * 100} active={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">{get("problem_heading")}</h2>
            </FadeUp>
            <FadeUp delay={100}>
              <p className="text-gray-600 text-lg leading-relaxed">{get("problem_body")}</p>
            </FadeUp>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: PROBLEM_ICONS[0], title: get("problem_1_title"), desc: get("problem_1_desc") },
              { icon: PROBLEM_ICONS[1], title: get("problem_2_title"), desc: get("problem_2_desc") },
              { icon: PROBLEM_ICONS[2], title: get("problem_3_title"), desc: get("problem_3_desc") },
              { icon: PROBLEM_ICONS[3], title: get("problem_4_title"), desc: get("problem_4_desc") },
            ].map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={i} delay={i * 100}>
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

      {/* ─── TRANSFORMATION ──────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">{get("transform_heading")}</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-14 text-lg max-w-2xl mx-auto">{get("transform_body")}</p>
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
                  {transformBefore.map((item) => (
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
                  {transformAfter.map((item) => (
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

      {/* ─── HOW WE HELP ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">{get("help_heading")}</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-14 text-lg max-w-2xl mx-auto">{get("help_body")}</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: get("help_1_title"), desc: get("help_1_desc") },
              { icon: Layers,    title: get("help_2_title"), desc: get("help_2_desc") },
              { icon: Bot,       title: get("help_3_title"), desc: get("help_3_desc") },
              { icon: Map,       title: get("help_4_title"), desc: get("help_4_desc") },
            ].map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={i} delay={i * 100}>
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

      {/* ─── APPS SHOWCASE ───────────────────────────────────────── */}
      {apps.length > 0 && (
        <section className="py-20 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-6">
            <FadeUp>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{get("apps_heading")}</h2>
                  <p className="text-gray-500 max-w-xl">{get("apps_body")}</p>
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

      {/* ─── WHY ISL ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <FadeUp>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
                  {get("why_heading_1")}<br />
                  <span style={{ color: "#2563EB" }}>{get("why_heading_2")}</span>
                </h2>
              </FadeUp>
              <div className="space-y-5">
                {[get("why_item_1"), get("why_item_2"), get("why_item_3")].filter(Boolean).map((text, i) => (
                  <FadeUp key={i} delay={i * 80}>
                    <p className="text-gray-500 text-lg">{text}</p>
                  </FadeUp>
                ))}
                {get("why_summary") && (
                  <FadeUp delay={300}>
                    <p className="text-gray-900 text-lg font-semibold leading-relaxed pt-2">
                      {get("why_summary")}
                    </p>
                  </FadeUp>
                )}
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

      {/* ─── RESULTS & BENEFITS ──────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">{get("results_heading")}</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-14 text-lg max-w-2xl mx-auto">{get("results_body")}</p>
          </FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {resultsItems.map((label, i) => {
              const Icon = RESULT_ICONS[i % RESULT_ICONS.length];
              return (
                <FadeUp key={label} delay={i * 80}>
                  <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,99,235,0.08)" }}>
                      <Icon className="h-6 w-6" style={{ color: "#2563EB" }} aria-hidden="true" />
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{label}</span>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─────────────────────────────────────────────── */}
      <section id="process" className="py-20 md:py-28 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">{get("process_heading")}</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-10 text-lg max-w-xl mx-auto">{get("process_body")}</p>
          </FadeUp>

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

          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <p className="text-center text-xs font-bold uppercase tracking-widest mb-10" style={{ color: "#2563EB" }}>The Six Phases</p>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {[
                { num: "01", label: get("phase_1_label"), desc: get("phase_1_desc") },
                { num: "02", label: get("phase_2_label"), desc: get("phase_2_desc") },
                { num: "03", label: get("phase_3_label"), desc: get("phase_3_desc") },
                { num: "04", label: get("phase_4_label"), desc: get("phase_4_desc") },
                { num: "05", label: get("phase_5_label"), desc: get("phase_5_desc") },
                { num: "06", label: get("phase_6_label"), desc: get("phase_6_desc") },
              ].map(({ num, label, desc }, i) => (
                <FadeUp key={num} delay={i * 80}>
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

      {/* ─── FAQ ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">{get("faq_heading")}</h2>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-gray-600 text-center mb-12 text-lg max-w-xl mx-auto">{get("faq_body")}</p>
          </FadeUp>
          <FadeUp delay={150}>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <Accordion type="single" collapsible className="divide-y divide-gray-100">
                {faqItems.map(({ q, a }, i) => (
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

      {/* ─── FINAL CTA ───────────────────────────────────────────── */}
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
              {finalCtaLines[0]}
              {finalCtaLines.length > 1 && <><br />{finalCtaLines[1]}</>}
            </h2>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">{get("final_cta_body")}</p>
          </FadeUp>
          <FadeUp delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="text-base h-12 px-8 font-semibold" style={{ background: "#2563EB", borderColor: "#2563EB", color: "white" }}>
                <Link href="/diagnostic">{get("final_cta_1")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base h-12 px-8 font-semibold text-white border-white/20 hover:bg-white/5">
                <Link href="/contact">{get("final_cta_2")}</Link>
              </Button>
            </div>
          </FadeUp>
          <FadeUp delay={400}>
            <p className="text-gray-500 text-sm">{get("final_cta_note")}</p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
