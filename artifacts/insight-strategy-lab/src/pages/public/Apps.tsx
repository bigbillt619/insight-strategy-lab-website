import { Link } from "wouter";
import { usePublishedApps } from "@/features/apps/api";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { VideoEmbed } from "@/components/MediaEmbed";
import { Button } from "@/components/ui/button";
import { Database, CheckCircle2, ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import { FadeUp } from "@/components/FadeUp";
import type { AppItem } from "@/lib/types";

function AppCard({ app }: { app: AppItem }) {
  const [playing, setPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const thumbSrc = imgError ? null : app.thumbnail_url;
  return (
    <FadeUp>
      <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Media */}
        <div className="aspect-video bg-gray-50 relative overflow-hidden">
          {playing && app.youtube_url ? (
            <VideoEmbed url={app.youtube_url} autoPlay className="absolute inset-0 h-full w-full rounded-none" />
          ) : app.youtube_url ? (
            <>
              {thumbSrc && (
                <img src={thumbSrc} alt="" onError={() => setImgError(true)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play ${app.title} video`}
                className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-colors"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl">
                  <Play className="h-7 w-7 translate-x-0.5 fill-current" style={{ color: "#2563EB" }} aria-hidden="true" />
                </span>
              </button>
            </>
          ) : thumbSrc ? (
            <img src={thumbSrc} alt="" onError={() => setImgError(true)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Database className="h-12 w-12 text-gray-200" aria-hidden="true" />
              <span className="text-gray-400 text-sm">Demo coming soon</span>
            </div>
          )}
        </div>

        <div className="p-8">
          {app.category && (
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(37,99,235,0.08)", color: "#2563EB" }}>
              {app.category}
            </span>
          )}
          <h3 className="font-black text-xl mb-5 text-gray-900 leading-tight">{app.title}</h3>

          <div className="space-y-5">
            {app.description && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#2563EB" }}>What it does</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{app.description}</p>
              </div>
            )}
            {app.problem_solved && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#2563EB" }}>Problem solved</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{app.problem_solved}</p>
              </div>
            )}
            {(app.use_case || app.results_summary) && (
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                {app.use_case && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">Use case</h4>
                    <p className="text-sm font-semibold text-gray-800">{app.use_case}</p>
                  </div>
                )}
                {app.results_summary && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">Outcome</h4>
                    <p className="text-sm font-semibold" style={{ color: "#2563EB" }}>{app.results_summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

export default function Apps() {
  const { data: apps = [], isLoading } = usePublishedApps();
  const { get } = useContent("apps");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const includesHeading = get("includes_heading");
  const includesItems = get("includes_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const galleryLabel = get("gallery_label");
  const ctaHeading = get("cta_heading");

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="bg-white pt-20 pb-16 md:pt-28 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle,#2563EB,transparent)", transform: "translate(25%,-25%)" }} />
        </div>
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <FadeUp>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border mb-6" style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB" }}>
              Apps in Production
            </span>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-[1.05]">
              {get("hero_title") || "Real Systems Running Inside Businesses"}
            </h1>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              {get("hero_subtitle") || "These aren't prototypes or templates. These are production systems actively used to run operations."}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── Gallery ──────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          {galleryLabel && apps.length > 0 && (
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-10" style={{ color: "#2563EB" }}>{galleryLabel}</p>
            </FadeUp>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : apps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {apps.map((app) => <AppCard key={app.id} app={app} />)}
            </div>
          ) : (
            <FadeUp>
              <div className="text-center py-24 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <Database className="h-12 w-12 mx-auto mb-4" style={{ color: "rgba(37,99,235,0.3)" }} aria-hidden="true" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{get("empty_heading") || "Coming Soon"}</h3>
                <p className="text-gray-500">{get("empty_body") || "Production apps will appear here."}</p>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ─── What's Included ──────────────────────────────── */}
      {includesHeading && includesItems.length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12">{includesHeading}</h2>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {includesItems.map((item, i) => (
                <FadeUp key={i} delay={i * 50}>
                  <div className="flex items-start gap-4 p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#2563EB" }} aria-hidden="true" />
                    <span className="text-gray-800 leading-relaxed">{item}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ──────────────────────────────────────────── */}
      {ctaHeading && (
        <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#111827" }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-10" style={{ background: "radial-gradient(circle,#2563EB,transparent)" }} />
          </div>
          <div className="container mx-auto px-6 text-center relative z-10 max-w-2xl">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{ctaHeading}</h2>
            </FadeUp>
            {get("cta_body") && (
              <FadeUp delay={100}>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">{get("cta_body")}</p>
              </FadeUp>
            )}
            {get("cta_button") && (
              <FadeUp delay={200}>
                <Button asChild size="lg" className="h-12 px-8 text-base font-semibold" style={{ background: "#2563EB", color: "white" }}>
                  <Link href="/contact">{get("cta_button")} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </FadeUp>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
