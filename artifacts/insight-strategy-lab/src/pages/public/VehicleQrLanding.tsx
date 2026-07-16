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
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/features/content/api";
import { FadeUp } from "@/components/FadeUp";
import logo from "@/assets/logo.png";

const VALUE_ICONS = [Zap, BarChart, Layers];

/**
 * Hidden, QR-only landing page reachable solely via direct URL
 * (/vehicle-qr-code-1). Rendered outside PublicLayout, so it has no shared
 * Navbar/Footer — only a minimal logo header. Excluded from indexing via a
 * page-scoped robots meta (set on mount, restored on unmount) plus a
 * robots.txt disallow rule.
 */
export default function VehicleQrLanding() {
  const { get: getGlobal } = useContent("global");
  const { get } = useContent("vehicle_qr");
  const logoScale = Number(getGlobal("logo_scale")) || 1;
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

  const valueBlocks = [
    { icon: VALUE_ICONS[0], title: get("value1_title"), desc: get("value1_desc") },
    { icon: VALUE_ICONS[1], title: get("value2_title"), desc: get("value2_desc") },
    { icon: VALUE_ICONS[2], title: get("value3_title"), desc: get("value3_desc") },
  ];

  const whoItems = get("who_items").split("\n").filter(Boolean);
  const credItems = get("cred_items").split("\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col overflow-x-hidden">
      <style>{`
        @keyframes qr-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .qr-hero-animate { animation: qr-fade-up 0.65s ease both; }
      `}</style>

      {/* ─── Minimal header — logo only, no navigation ─── */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center">
          <img
            src={logo}
            alt="Insight Strategy Lab"
            className="w-auto"
            style={logoStyle}
          />
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle,#2563EB,transparent)" }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="qr-hero-animate inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border mb-7"
              style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB", animationDelay: "0ms" }}
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span>{get("hero_badge") || "Exclusive Offer"}</span>
            </div>

            <h1
              className="qr-hero-animate text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-6 leading-[1.08]"
              style={{ animationDelay: "80ms" }}
            >
              {get("hero_title")}
            </h1>

            <p
              className="qr-hero-animate text-lg sm:text-xl text-gray-600 leading-relaxed mb-4"
              style={{ animationDelay: "160ms" }}
            >
              {get("hero_subtitle")}
            </p>

            {get("hero_body") && (
              <p
                className="qr-hero-animate text-base text-gray-500 leading-relaxed mb-10"
                style={{ animationDelay: "220ms" }}
              >
                {get("hero_body")}
              </p>
            )}

            <div
              className="qr-hero-animate pt-2"
              style={{ animationDelay: "300ms" }}
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto text-base h-13 px-8 font-semibold"
                style={{ background: "#2563EB", color: "white" }}
              >
                <Link href="/diagnostic">
                  {get("hero_cta") || "Start Your Free Assessment"}
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Value blocks ─────────────────────────────── */}
      <section className="py-20" style={{ background: "#F3F4F6" }}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {valueBlocks.map((block, i) => (
              <FadeUp key={block.title || i} delay={i * 100}>
                <div className="flex flex-col items-center text-center p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div
                    className="h-13 w-13 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(37,99,235,0.08)", width: "3.25rem", height: "3.25rem" }}
                  >
                    <block.icon className="h-6 w-6" style={{ color: "#2563EB" }} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{block.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{block.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Who this is for ──────────────────────────── */}
      {whoItems.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <FadeUp>
                <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
                  {get("who_heading") || "Who This Is For"}
                </h2>
              </FadeUp>
              <div className="space-y-4">
                {whoItems.map((item, i) => (
                  <FadeUp key={i} delay={i * 60}>
                    <div className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#2563EB" }} aria-hidden="true" />
                      <span className="text-gray-800 font-medium leading-relaxed">{item}</span>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Credibility ──────────────────────────────── */}
      {credItems.length > 0 && (
        <section className="py-20" style={{ background: "#F3F4F6" }}>
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <FadeUp>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(37,99,235,0.08)" }}
                    >
                      <Shield className="h-5 w-5" style={{ color: "#2563EB" }} aria-hidden="true" />
                    </div>
                    <span className="font-black text-gray-900 text-lg">About Insight Strategy Lab</span>
                  </div>
                  {get("cred_intro") && (
                    <p className="text-gray-700 mb-7 leading-relaxed">{get("cred_intro")}</p>
                  )}
                  <div className="space-y-3">
                    {credItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#2563EB" }} aria-hidden="true" />
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA block ────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#111827" }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#2563EB,transparent)" }}
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-10 leading-tight">
                {get("cta_heading") || "Ready to Get Started?"}
              </h2>
            </FadeUp>
            <FadeUp delay={100}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto text-base h-13 px-8 font-semibold"
                  style={{ background: "#2563EB", color: "white", height: "3.25rem" }}
                >
                  <Link href="/diagnostic">
                    <CalendarClock className="mr-2 h-5 w-5" aria-hidden="true" />
                    {get("cta_primary") || "Start the Free Assessment"}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base font-semibold text-white border-white/20 hover:bg-white/5"
                  style={{ height: "3.25rem" }}
                >
                  <Link href="/contact">
                    <MessageSquare className="mr-2 h-5 w-5" aria-hidden="true" />
                    {get("cta_secondary") || "Send a Message"}
                  </Link>
                </Button>
              </div>
            </FadeUp>

            {get("closing") && (
              <FadeUp delay={200}>
                <p className="mt-10 text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">
                  {get("closing")}
                </p>
              </FadeUp>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
