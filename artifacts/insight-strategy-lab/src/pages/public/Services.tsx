import { CheckCircle2, ArrowRight, BarChart3, Layers, Bot, Map, Users, Zap, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { FadeUp } from "@/components/FadeUp";

const SERVICE_ICONS = [BarChart3, Layers, Bot, Map];

export default function Services() {
  const { get } = useContent("services");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const toPoints = (key: string) => get(key).split("\n").map((s) => s.trim()).filter(Boolean);
  const paragraphs = (key: string) => get(key).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  const capabilities = [
    { title: get("cap1_title"), points: toPoints("cap1_points"), icon: SERVICE_ICONS[0] },
    { title: get("cap2_title"), points: toPoints("cap2_points"), icon: SERVICE_ICONS[1] },
    { title: get("cap3_title"), points: toPoints("cap3_points"), icon: SERVICE_ICONS[2] },
    { title: get("cap4_title"), points: toPoints("cap4_points"), icon: SERVICE_ICONS[3] },
  ];

  const models = [
    { title: get("model1_title"), fee: get("model1_fee"), desc: get("model1_desc"), bestFor: get("model1_best_for") },
    { title: get("model2_title"), fee: get("model2_fee"), desc: get("model2_desc"), bestFor: get("model2_best_for") },
    { title: get("model3_title"), fee: get("model3_fee"), desc: get("model3_desc"), bestFor: get("model3_best_for") },
  ];

  const bannerHeading = get("banner_heading");
  const bannerButton = get("banner_button");
  const modelsNote = get("models_note");
  const scopedHeading = get("scoped_heading");
  const scopedBody = paragraphs("scoped_body");
  const getHeading = get("get_heading");
  const getItems = toPoints("get_items");
  const ctaBody = get("cta_body");

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="bg-white pt-20 pb-16 md:pt-28 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle,#2563EB,transparent)", transform: "translate(25%,-25%)" }} />
        </div>
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <FadeUp>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border mb-6" style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB" }}>
              Services &amp; Pricing
            </span>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-[1.05]">
              {get("hero_title") || "Build the Operating System Your Organization Needs"}
            </h1>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              {get("hero_subtitle") || "Services designed to align your people, processes, technology, data, and AI into one scalable framework."}
            </p>
          </FadeUp>

          {bannerHeading && (
            <FadeUp delay={240}>
              <div className="mt-10 p-7 md:p-10 rounded-2xl border flex flex-col md:flex-row md:items-center md:justify-between gap-6" style={{ background: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.15)" }}>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{bannerHeading}</h2>
                  {get("banner_body") && (
                    <p className="text-gray-600 max-w-2xl">{get("banner_body")}</p>
                  )}
                </div>
                {bannerButton && (
                  <Button asChild size="lg" className="shrink-0 h-12 px-6 font-semibold" style={{ background: "#2563EB", color: "white" }}>
                    <Link href="/diagnostic">
                      {bannerButton} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ─── 6-Phase Callout ──────────────────────────────── */}
      <section className="py-10 border-b border-gray-100" style={{ background: "#F8FAFF" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: "#2563EB" }}>Our Methodology</span>
                <p className="text-gray-800 font-semibold text-lg">
                  Every engagement follows our structured <a href="/#process" style={{ color: "#2563EB", textDecoration: "underline", textUnderlineOffset: "3px" }}>6-Phase Approach</a> — from Discovery to Optimization.
                </p>
              </div>
              <a
                href="/diagnostic"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all hover:shadow-md"
                style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB" }}
              >
                Start System Diagnostic <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Capabilities ─────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{get("build_heading") || "What We Build Together"}</h2>
          </FadeUp>
          {get("build_intro") && (
            <FadeUp delay={80}>
              <p className="text-lg text-gray-600 mb-12 max-w-3xl leading-relaxed">{get("build_intro")}</p>
            </FadeUp>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <FadeUp key={i} delay={i * 80}>
                  <div className="h-full p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(37,99,235,0.08)" }}>
                      <Icon className="h-6 w-6" style={{ color: "#2563EB" }} aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-5">{cat.title}</h3>
                    <ul className="space-y-3">
                      {cat.points.map((pt, j) => (
                        <li key={j} className="flex items-start gap-3 text-gray-600 text-[15px]">
                          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#2563EB" }} aria-hidden="true" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Engagement Models ─────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{get("models_heading") || "How We Engage"}</h2>
          </FadeUp>
          {get("models_intro") && (
            <FadeUp delay={80}>
              <p className="text-lg text-gray-600 mb-12 max-w-3xl leading-relaxed">{get("models_intro")}</p>
            </FadeUp>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model, i) => {
              const featured = i === 1;
              return (
                <FadeUp key={i} delay={i * 100}>
                  <div
                    className="h-full p-8 rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1"
                    style={featured
                      ? { background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", boxShadow: "0 20px 40px rgba(37,99,235,0.3)" }
                      : { background: "white", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }
                    }
                  >
                    <h3 className={`text-xl font-bold mb-3 ${featured ? "text-white" : "text-gray-900"}`}>{model.title}</h3>
                    <p className={`leading-relaxed mb-6 text-[15px] ${featured ? "text-blue-100" : "text-gray-600"}`}>{model.desc}</p>
                    {model.bestFor && (
                      <p className={`text-sm leading-relaxed mb-6 ${featured ? "text-blue-200" : "text-gray-500"}`}>
                        <span className="font-semibold">Best for: </span>{model.bestFor}
                      </p>
                    )}
                    {model.fee && (
                      <p className={`mt-auto text-sm font-semibold pt-4 border-t ${featured ? "text-blue-200 border-white/20" : "text-blue-600 border-gray-100"}`}>{model.fee}</p>
                    )}
                  </div>
                </FadeUp>
              );
            })}
          </div>
          {(modelsNote || bannerButton) && (
            <FadeUp delay={200}>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
                {modelsNote && <p className="text-gray-600">{modelsNote}</p>}
                {bannerButton && (
                  <Button asChild variant="outline" className="shrink-0">
                    <Link href="/diagnostic">{bannerButton} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                )}
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ─── Why Scoped Individually ────────────────────────── */}
      {scopedHeading && scopedBody.length > 0 && (
        <section className="py-20 md:py-24" style={{ background: "#F3F4F6" }}>
          <div className="container mx-auto px-6 max-w-3xl">
            <FadeUp>
              <h2 className="text-3xl font-black text-gray-900 mb-6">{scopedHeading}</h2>
            </FadeUp>
            <div className="space-y-4">
              {scopedBody.map((p, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <p className="text-lg text-gray-600 leading-relaxed">{p}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── What You Get ──────────────────────────────────── */}
      {getHeading && getItems.length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{getHeading}</h2>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {getItems.map((item, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <div className="flex items-start gap-4 p-6 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5" style={{ color: "#2563EB" }} aria-hidden="true" />
                    <span className="text-gray-800 font-medium leading-relaxed">{item}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Bottom CTA ────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#111827" }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-10" style={{ background: "radial-gradient(circle,#2563EB,transparent)" }} />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-3xl">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{get("cta_heading") || "Ready to Build a Better Operating System?"}</h2>
          </FadeUp>
          {ctaBody && (
            <FadeUp delay={100}>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">{ctaBody}</p>
            </FadeUp>
          )}
          <FadeUp delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold" style={{ background: "#2563EB", color: "white" }}>
                <Link href="/contact">{get("cta_button") || "Book a Free Strategy Session"} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold text-white border-white/20 hover:bg-white/5">
                <Link href="/diagnostic">Take the Free Assessment</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
