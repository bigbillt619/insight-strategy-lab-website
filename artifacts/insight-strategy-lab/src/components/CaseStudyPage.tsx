/**
 * Generic case study page renderer.
 *
 * Adding a new case study only requires:
 *  1. Adding <prefix>_* keys to SOLUTIONS_GROUP in schema.ts (same structure as ttb_* keys)
 *  2. A new route in App.tsx that renders <CaseStudyPage prefix="xxx_" />
 *
 * No new page component or structural changes are needed.
 */

import { useState } from "react";
import { Link } from "wouter";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/FadeUp";
import {
  ArrowRight, CheckCircle2, Download, Users, Cog, Monitor, Database, Brain,
  ArrowDown, Star, ChevronLeft, ChevronRight,
} from "lucide-react";

const MODULE_ICONS = [Users, CheckCircle2, Cog, Monitor, ArrowRight, Monitor];

interface CaseStudyPageProps {
  prefix: string;
}

export function CaseStudyPage({ prefix }: CaseStudyPageProps) {
  const { get: getRaw } = useContent("solutions");

  const get = (suffix: string) => getRaw(`${prefix}${suffix}`);

  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const challengeItems = get("challenge_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const whyBody = get("why_body").split("\n\n").filter(Boolean);

  const pillars = [
    { labelSuffix: "pillar_people_label", descSuffix: "pillar_people_desc", Icon: Users },
    { labelSuffix: "pillar_process_label", descSuffix: "pillar_process_desc", Icon: Cog },
    { labelSuffix: "pillar_technology_label", descSuffix: "pillar_technology_desc", Icon: Monitor },
    { labelSuffix: "pillar_data_label", descSuffix: "pillar_data_desc", Icon: Database },
    { labelSuffix: "pillar_ai_label", descSuffix: "pillar_ai_desc", Icon: Brain },
  ];

  const mctrKeys = [
    { letter: "M", labelSuffix: "mctr_m_label", descSuffix: "mctr_m_desc" },
    { letter: "C", labelSuffix: "mctr_c_label", descSuffix: "mctr_c_desc" },
    { letter: "T", labelSuffix: "mctr_t_label", descSuffix: "mctr_t_desc" },
    { letter: "R", labelSuffix: "mctr_r_label", descSuffix: "mctr_r_desc" },
  ];

  const beforeItems = get("before_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const afterItems = get("after_items").split("\n").map((s) => s.trim()).filter(Boolean);

  const modules = [
    { titleSuffix: "mod_1_title", descSuffix: "mod_1_desc" },
    { titleSuffix: "mod_2_title", descSuffix: "mod_2_desc" },
    { titleSuffix: "mod_3_title", descSuffix: "mod_3_desc" },
    { titleSuffix: "mod_4_title", descSuffix: "mod_4_desc" },
    { titleSuffix: "mod_5_title", descSuffix: "mod_5_desc" },
    { titleSuffix: "mod_6_title", descSuffix: "mod_6_desc" },
  ];

  const resultsItems = get("results_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const downloadUrl = get("download_url");
  const downloadHeading = get("download_heading");

  const slides = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((n) => ({ image: get(`slide_${n}_image`), caption: get(`slide_${n}_caption`) }))
    .filter((s) => s.image);
  const slidesHeading = get("slides_heading");

  const [activeSlide, setActiveSlide] = useState(0);
  const prevSlide = () => setActiveSlide((i) => (i - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((i) => (i + 1) % slides.length);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ─── 1. Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28" style={{ background: "#0F172A" }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle,#2563EB,transparent)" }} />
        </div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <FadeUp>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white border mb-6" style={{ borderColor: "rgba(37,99,235,0.5)", background: "rgba(37,99,235,0.15)" }}>
              <Star className="h-3 w-3 fill-current text-blue-400" />
              {get("hero_badge") || "Featured Case Study"}
            </span>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-[1.05] tracking-tight">
              {get("hero_title")}
            </h1>
          </FadeUp>
          <FadeUp delay={140}>
            <p className="text-xl md:text-2xl font-semibold mb-6" style={{ color: "#60A5FA" }}>
              {get("hero_subtitle")}
            </p>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              {get("hero_body")}
            </p>
          </FadeUp>
          <FadeUp delay={260}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold" style={{ background: "#2563EB", color: "white" }}>
                <Link href="/contact">{get("cta_button") || "Schedule a Free Strategy Call"} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold border-gray-600 text-gray-300 hover:border-blue-400 hover:text-white">
                <Link href="/apps">← Back to Solutions</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 2. Business Challenge ───────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "#2563EB" }}>The Problem</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">{get("challenge_heading") || "The Business Challenge"}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <FadeUp delay={80}>
              <p className="text-gray-600 text-lg leading-relaxed">{get("challenge_body")}</p>
            </FadeUp>
            <div className="space-y-3">
              {challengeItems.map((item, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-red-100 bg-red-50">
                    <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 text-xs font-black">✕</span>
                    </div>
                    <span className="text-gray-800 text-sm leading-relaxed">{item}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Why This Matters ─────────────────────────── */}
      <section className="py-20 md:py-24" style={{ background: "#F8FAFF" }}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "#2563EB" }}>Context</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10">{get("why_heading") || "Why This Matters"}</h2>
          </FadeUp>
          <FadeUp delay={80}>
            <div className="relative rounded-2xl p-8 md:p-12 text-left" style={{ background: "#EFF6FF", borderLeft: "4px solid #2563EB" }}>
              <div className="absolute top-4 left-4 text-blue-200 text-7xl font-black leading-none select-none">"</div>
              <div className="relative z-10 space-y-4">
                {whyBody.map((para, i) => (
                  <p key={i} className="text-gray-800 text-lg leading-relaxed font-medium">{para}</p>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 4. Transformation Approach ─────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "#2563EB" }}>Methodology</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{get("approach_heading") || "The Transformation Approach"}</h2>
            <p className="text-gray-600 text-lg max-w-3xl mb-14 leading-relaxed">{get("approach_body")}</p>
          </FadeUp>

          {/* Five Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
            {pillars.map(({ labelSuffix, descSuffix, Icon }, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,99,235,0.08)" }}>
                    <Icon className="h-6 w-6" style={{ color: "#2563EB" }} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">{get(labelSuffix)}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{get(descSuffix)}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* MCTR Framework */}
          <FadeUp>
            <div className="rounded-2xl p-8 md:p-10" style={{ background: "#0F172A" }}>
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 block">Framework</span>
                <h3 className="text-2xl md:text-3xl font-black text-white">{get("mctr_heading") || "The MCTR Framework"}</h3>
                <p className="text-gray-400 mt-3 max-w-2xl mx-auto">{get("mctr_body")}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {mctrKeys.map(({ letter, labelSuffix, descSuffix }, i) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.2)" }}>
                    <div className="text-3xl font-black mb-2" style={{ color: "#60A5FA" }}>{letter}</div>
                    <h4 className="font-black text-white mb-2">{get(labelSuffix)}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{get(descSuffix)}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 5. Before vs After ──────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "#2563EB" }}>Transformation</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{get("bva_heading") || "Before & After"}</h2>
          </FadeUp>
          <FadeUp delay={80}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              {/* Before */}
              <div className="rounded-2xl border-2 border-red-200 bg-white overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                  <h3 className="font-black text-red-700 uppercase tracking-wide text-sm">{get("before_label") || "Before"}</h3>
                </div>
                <div className="p-6 space-y-3">
                  {beforeItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="h-5 w-5 shrink-0 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-black">✕</span>
                      <span className="text-gray-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ background: "#2563EB" }}>
                  <ArrowDown className="h-6 w-6 text-white md:hidden" />
                  <ArrowRight className="h-6 w-6 text-white hidden md:block" />
                </div>
              </div>

              {/* After */}
              <div className="rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: "#2563EB", background: "white" }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(37,99,235,0.2)", background: "rgba(37,99,235,0.06)" }}>
                  <h3 className="font-black uppercase tracking-wide text-sm" style={{ color: "#2563EB" }}>{get("after_label") || "After"}</h3>
                </div>
                <div className="p-6 space-y-3">
                  {afterItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#2563EB" }} />
                      <span className="text-gray-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 6. Solution Overview ────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "#2563EB" }}>The System</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{get("overview_heading") || "Solution Overview"}</h2>
            <p className="text-gray-600 text-lg max-w-3xl mb-14 leading-relaxed">{get("overview_body")}</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(({ titleSuffix, descSuffix }, i) => {
              const Icon = MODULE_ICONS[i] ?? Cog;
              return (
                <FadeUp key={i} delay={i * 60}>
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(37,99,235,0.08)" }}>
                      <Icon className="h-5 w-5" style={{ color: "#2563EB" }} />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2">{get(titleSuffix)}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{get(descSuffix)}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. Results & Lessons Learned ───────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <FadeUp>
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "#2563EB" }}>Outcomes</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{get("results_heading") || "Results & Lessons Learned"}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              {resultsItems.map((item, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <div className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#2563EB" }} />
                    <span className="text-gray-800 leading-relaxed">{item}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={100}>
              <div className="rounded-2xl p-8 relative" style={{ background: "#EFF6FF", borderLeft: "4px solid #2563EB" }}>
                <div className="absolute top-4 left-4 text-blue-200 text-7xl font-black leading-none select-none">"</div>
                <p className="relative z-10 text-gray-800 text-lg leading-relaxed font-medium italic">{get("results_lesson")}</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── 8. Screenshot Slideshow ─────────────────────── */}
      {slides.length > 0 && slidesHeading && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <FadeUp>
              <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "#2563EB" }}>Screenshots</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{slidesHeading}</h2>
            </FadeUp>

            <FadeUp delay={80}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 select-none" style={{ border: "1px solid rgba(37,99,235,0.15)" }}>
                {/* Slide image */}
                <div className="relative aspect-video overflow-hidden">
                  {slides.map((slide, i) => (
                    <img
                      key={i}
                      src={slide.image}
                      alt={slide.caption || `Screenshot ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                      style={{ opacity: i === activeSlide ? 1 : 0, pointerEvents: i === activeSlide ? "auto" : "none" }}
                    />
                  ))}

                  {/* Prev / Next arrows */}
                  {slides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Slide counter */}
                  {slides.length > 1 && (
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-semibold tabular-nums">
                      {activeSlide + 1} / {slides.length}
                    </div>
                  )}
                </div>

                {/* Caption + dots */}
                <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ background: "#0F172A" }}>
                  <p className="text-sm text-gray-400 min-h-[1.25rem]">
                    {slides[activeSlide]?.caption || ""}
                  </p>
                  {slides.length > 1 && (
                    <div className="flex gap-1.5 shrink-0">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveSlide(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: i === activeSlide ? "1.5rem" : "0.375rem",
                            background: i === activeSlide ? "#2563EB" : "rgba(255,255,255,0.3)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>

            {/* Thumbnail strip for 3+ slides */}
            {slides.length >= 3 && (
              <FadeUp delay={120}>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {slides.map((slide, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSlide(i)}
                      aria-label={`View screenshot ${i + 1}`}
                      className="shrink-0 rounded-lg overflow-hidden transition-all duration-200"
                      style={{
                        width: "5rem",
                        aspectRatio: "16/9",
                        outline: i === activeSlide ? "2px solid #2563EB" : "2px solid transparent",
                        outlineOffset: "2px",
                        opacity: i === activeSlide ? 1 : 0.55,
                      }}
                    >
                      <img src={slide.image} alt={slide.caption || `Slide ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* ─── 9. Download Case Study ──────────────────────── */}
      {downloadUrl && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                {downloadHeading || "Download the Full Case Study"}
              </h2>
              <p className="text-gray-600 mb-8">{get("download_body")}</p>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-2" style={{ borderColor: "#2563EB", color: "#2563EB" }}>
                <a href={downloadUrl} target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  {get("download_button") || "Download Full Case Study PDF"}
                </a>
              </Button>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ─── 9. Bottom CTA ───────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#111827" }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-10" style={{ background: "radial-gradient(circle,#2563EB,transparent)" }} />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-2xl">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{get("cta_heading") || "Ready to transform how your organization operates?"}</h2>
          </FadeUp>
          <FadeUp delay={80}>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">{get("cta_body")}</p>
          </FadeUp>
          <FadeUp delay={160}>
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold" style={{ background: "#2563EB", color: "white" }}>
              <Link href="/contact">{get("cta_button") || "Schedule a Free Strategy Call"} <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
