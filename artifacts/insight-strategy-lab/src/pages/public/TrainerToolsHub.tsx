import { Link } from "wouter";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/FadeUp";
import {
  ArrowRight, CheckCircle2, Download, Users, Cog, Monitor, Database, Brain,
  ArrowDown, Star,
} from "lucide-react";

const PILLAR_ICONS = [Users, Cog, Monitor, Database, Brain];
const MCTR_LETTERS = ["M", "C", "T", "R"];
const MODULE_ICONS = [Users, CheckCircle2, Cog, Monitor, ArrowRight, Monitor];

export default function TrainerToolsHub() {
  const { get } = useContent("solutions");

  usePageMeta({
    title: get("ttb_seo_title"),
    description: get("ttb_seo_description"),
  });

  const challengeItems = get("ttb_challenge_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const whyBody = get("ttb_why_body").split("\n\n").filter(Boolean);

  const pillars = [
    { labelKey: "ttb_pillar_people_label", descKey: "ttb_pillar_people_desc", Icon: Users },
    { labelKey: "ttb_pillar_process_label", descKey: "ttb_pillar_process_desc", Icon: Cog },
    { labelKey: "ttb_pillar_technology_label", descKey: "ttb_pillar_technology_desc", Icon: Monitor },
    { labelKey: "ttb_pillar_data_label", descKey: "ttb_pillar_data_desc", Icon: Database },
    { labelKey: "ttb_pillar_ai_label", descKey: "ttb_pillar_ai_desc", Icon: Brain },
  ];

  const mctrKeys = [
    { letter: "M", labelKey: "ttb_mctr_m_label", descKey: "ttb_mctr_m_desc" },
    { letter: "C", labelKey: "ttb_mctr_c_label", descKey: "ttb_mctr_c_desc" },
    { letter: "T", labelKey: "ttb_mctr_t_label", descKey: "ttb_mctr_t_desc" },
    { letter: "R", labelKey: "ttb_mctr_r_label", descKey: "ttb_mctr_r_desc" },
  ];

  const beforeItems = get("ttb_before_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const afterItems = get("ttb_after_items").split("\n").map((s) => s.trim()).filter(Boolean);

  const modules = [
    { titleKey: "ttb_mod_1_title", descKey: "ttb_mod_1_desc" },
    { titleKey: "ttb_mod_2_title", descKey: "ttb_mod_2_desc" },
    { titleKey: "ttb_mod_3_title", descKey: "ttb_mod_3_desc" },
    { titleKey: "ttb_mod_4_title", descKey: "ttb_mod_4_desc" },
    { titleKey: "ttb_mod_5_title", descKey: "ttb_mod_5_desc" },
    { titleKey: "ttb_mod_6_title", descKey: "ttb_mod_6_desc" },
  ];

  const resultsItems = get("ttb_results_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const downloadUrl = get("ttb_download_url");
  const downloadHeading = get("ttb_download_heading");

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
              {get("ttb_hero_badge") || "Featured Case Study"}
            </span>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-[1.05] tracking-tight">
              {get("ttb_hero_title") || "Trainer Tools Hub"}
            </h1>
          </FadeUp>
          <FadeUp delay={140}>
            <p className="text-xl md:text-2xl font-semibold mb-6" style={{ color: "#60A5FA" }}>
              {get("ttb_hero_subtitle") || "Business Transformation Through Strategic Integration"}
            </p>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              {get("ttb_hero_body")}
            </p>
          </FadeUp>
          <FadeUp delay={260}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold" style={{ background: "#2563EB", color: "white" }}>
                <Link href="/contact">{get("ttb_cta_button") || "Schedule a Free Strategy Call"} <ArrowRight className="ml-2 h-5 w-5" /></Link>
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">{get("ttb_challenge_heading") || "The Business Challenge"}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <FadeUp delay={80}>
              <p className="text-gray-600 text-lg leading-relaxed">{get("ttb_challenge_body")}</p>
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10">{get("ttb_why_heading") || "Why This Matters"}</h2>
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{get("ttb_approach_heading") || "The Transformation Approach"}</h2>
            <p className="text-gray-600 text-lg max-w-3xl mb-14 leading-relaxed">{get("ttb_approach_body")}</p>
          </FadeUp>

          {/* Five Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
            {pillars.map(({ labelKey, descKey, Icon }, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,99,235,0.08)" }}>
                    <Icon className="h-6 w-6" style={{ color: "#2563EB" }} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">{get(labelKey)}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{get(descKey)}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* MCTR Framework */}
          <FadeUp>
            <div className="rounded-2xl p-8 md:p-10" style={{ background: "#0F172A" }}>
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 block">Framework</span>
                <h3 className="text-2xl md:text-3xl font-black text-white">{get("ttb_mctr_heading") || "The MCTR Framework"}</h3>
                <p className="text-gray-400 mt-3 max-w-2xl mx-auto">{get("ttb_mctr_body")}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {mctrKeys.map(({ letter, labelKey, descKey }, i) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.2)" }}>
                    <div className="text-3xl font-black mb-2" style={{ color: "#60A5FA" }}>{letter}</div>
                    <h4 className="font-black text-white mb-2">{get(labelKey)}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{get(descKey)}</p>
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{get("ttb_bva_heading") || "Before & After"}</h2>
          </FadeUp>
          <FadeUp delay={80}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              {/* Before */}
              <div className="rounded-2xl border-2 border-red-200 bg-white overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                  <h3 className="font-black text-red-700 uppercase tracking-wide text-sm">{get("ttb_before_label") || "Before"}</h3>
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
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ background: "#2563EB" }}>
                    <ArrowDown className="h-6 w-6 text-white md:hidden" />
                    <ArrowRight className="h-6 w-6 text-white hidden md:block" />
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: "#2563EB", background: "white" }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(37,99,235,0.2)", background: "rgba(37,99,235,0.06)" }}>
                  <h3 className="font-black uppercase tracking-wide text-sm" style={{ color: "#2563EB" }}>{get("ttb_after_label") || "Trainer Tools Hub"}</h3>
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{get("ttb_overview_heading") || "Solution Overview"}</h2>
            <p className="text-gray-600 text-lg max-w-3xl mb-14 leading-relaxed">{get("ttb_overview_body")}</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(({ titleKey, descKey }, i) => {
              const Icon = MODULE_ICONS[i] ?? Cog;
              return (
                <FadeUp key={i} delay={i * 60}>
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(37,99,235,0.08)" }}>
                      <Icon className="h-5 w-5" style={{ color: "#2563EB" }} />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2">{get(titleKey)}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{get(descKey)}</p>
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
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{get("ttb_results_heading") || "Results & Lessons Learned"}</h2>
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
                <p className="relative z-10 text-gray-800 text-lg leading-relaxed font-medium italic">{get("ttb_results_lesson")}</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── 8. Download Case Study ──────────────────────── */}
      {downloadHeading && downloadUrl && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{downloadHeading}</h2>
              <p className="text-gray-600 mb-8">{get("ttb_download_body")}</p>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-2" style={{ borderColor: "#2563EB", color: "#2563EB" }}>
                <a href={downloadUrl} target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  {get("ttb_download_button") || "Download Full Case Study PDF"}
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
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{get("ttb_cta_heading") || "Ready to transform how your organization operates?"}</h2>
          </FadeUp>
          <FadeUp delay={80}>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">{get("ttb_cta_body")}</p>
          </FadeUp>
          <FadeUp delay={160}>
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold" style={{ background: "#2563EB", color: "white" }}>
              <Link href="/contact">{get("ttb_cta_button") || "Schedule a Free Strategy Call"} <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
