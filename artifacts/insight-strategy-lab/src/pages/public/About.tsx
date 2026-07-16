import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { Link } from "wouter";
import { Award, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/FadeUp";

function isImageUrl(url: string) {
  return (
    /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url) ||
    url.includes("/storage/v1/object/public/")
  );
}

function paragraphs(text: string) {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export default function About() {
  const { get } = useContent("about");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const photo = get("photo");
  const lead = paragraphs(get("lead"));
  const body = paragraphs(get("body"));
  const philosophy = paragraphs(get("philosophy_body"));
  const howIWork = get("howiwork_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const creds = get("creds").split("\n").map((s) => s.trim()).filter(Boolean);

  const badges = [1, 2, 3, 4, 5, 6]
    .map((n) => {
      const raw = get(`badge_${n}`).trim();
      const link = get(`badge_${n}_link`).trim();
      const hasImage = isImageUrl(raw);
      return {
        image: hasImage ? raw : "",
        link: link || (!hasImage ? raw : ""),
      };
    })
    .filter((b) => b.image || b.link);

  const publications = [1, 2, 3, 4]
    .map((n) => ({
      title: get(`pub_${n}_title`).trim(),
      link: get(`pub_${n}_link`).trim(),
    }))
    .filter((p) => p.title || p.link);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="bg-white pt-20 pb-16 md:pt-28 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle,#2563EB,transparent)", transform: "translate(25%,-25%)" }} />
        </div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <FadeUp>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border mb-6" style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB" }}>
              About
            </span>
          </FadeUp>

          {photo && (
            <FadeUp delay={60}>
              <img
                src={photo}
                alt=""
                className="mb-10 h-64 w-64 md:h-80 md:w-80 rounded-2xl object-cover border border-gray-100 shadow-xl"
              />
            </FadeUp>
          )}

          <FadeUp delay={120}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-8 leading-[1.05]">
              {get("hero_title") || "About Insight Strategy Lab"}
            </h1>
          </FadeUp>

          {lead.length > 0 && (
            <div className="space-y-5 max-w-3xl">
              {lead.map((p, i) => (
                <FadeUp key={i} delay={160 + i * 60}>
                  <p className="text-xl text-gray-700 font-medium leading-relaxed">{p}</p>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Body ─────────────────────────────────────────── */}
      {body.length > 0 && (
        <section className="py-16 md:py-24" style={{ background: "#F3F4F6" }}>
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="prose prose-lg prose-gray max-w-none space-y-6">
              {body.map((p, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <p className="text-gray-700 leading-relaxed text-lg">{p}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Philosophy ───────────────────────────────────── */}
      {get("philosophy_heading").trim() && philosophy.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 max-w-3xl">
            <FadeUp>
              <h2 className="text-3xl font-black text-gray-900 mb-8">{get("philosophy_heading")}</h2>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="rounded-2xl p-8 border-l-4" style={{ background: "rgba(37,99,235,0.04)", borderLeftColor: "#2563EB" }}>
                {philosophy.map((p, i) => (
                  <p key={i} className="text-lg text-gray-800 font-medium leading-relaxed mb-4 last:mb-0">{p}</p>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ─── Credentials ──────────────────────────────────── */}
      {creds.length > 0 && (
        <section className="py-16 md:py-24" style={{ background: "#F3F4F6" }}>
          <div className="container mx-auto px-6 max-w-4xl">
            <FadeUp>
              <h2 className="text-3xl font-black text-gray-900 mb-3">{get("creds_heading") || "Credentials"}</h2>
            </FadeUp>
            {get("creds_intro").trim() && (
              <FadeUp delay={60}>
                <p className="text-gray-600 text-lg mb-10">{get("creds_intro")}</p>
              </FadeUp>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creds.map((c, i) => (
                <FadeUp key={i} delay={i * 50}>
                  <div className="flex items-center gap-4 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#2563EB" }} aria-hidden="true" />
                    <span className="font-medium text-gray-800">{c}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Badges ───────────────────────────────────────── */}
      {badges.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <FadeUp>
              <h2 className="text-3xl font-black text-gray-900 mb-3">{get("badges_heading") || "Certifications"}</h2>
            </FadeUp>
            {get("badges_caption").trim() && (
              <FadeUp delay={60}>
                <p className="text-gray-600 text-lg mb-10">{get("badges_caption")}</p>
              </FadeUp>
            )}
            <FadeUp delay={100}>
              <div className="flex flex-wrap items-center gap-6">
                {badges.map((b, i) => {
                  if (b.image) {
                    const img = (
                      <img
                        src={b.image}
                        alt=""
                        className="relative z-0 h-24 w-auto origin-center object-contain rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-transform duration-300 ease-out hover:z-30 hover:scale-[2.5] hover:shadow-2xl"
                      />
                    );
                    return b.link ? (
                      <a key={i} href={b.link} target="_blank" rel="noreferrer" className="block">{img}</a>
                    ) : (
                      <div key={i}>{img}</div>
                    );
                  }
                  return (
                    <a
                      key={i}
                      href={b.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-5 py-4 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:scale-105 hover:border-blue-200 hover:shadow-md"
                    >
                      <Award className="h-5 w-5" style={{ color: "#2563EB" }} aria-hidden="true" />
                      View Certificate
                    </a>
                  );
                })}
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ─── Publications ─────────────────────────────────── */}
      {publications.length > 0 && (
        <section className="py-16 md:py-24" style={{ background: "#F3F4F6" }}>
          <div className="container mx-auto px-6 max-w-4xl">
            <FadeUp>
              <h2 className="text-3xl font-black text-gray-900 mb-3">{get("pubs_heading") || "Publications"}</h2>
            </FadeUp>
            {get("pubs_intro").trim() && (
              <FadeUp delay={60}>
                <p className="text-gray-600 text-lg mb-10">{get("pubs_intro")}</p>
              </FadeUp>
            )}
            <div className="space-y-3">
              {publications.map((p, i) => {
                const label = p.title || "View publication";
                const content = (
                  <>
                    <FileText className="h-5 w-5 shrink-0" style={{ color: "#2563EB" }} aria-hidden="true" />
                    <span className="font-medium text-gray-800">{label}</span>
                    {p.link && <ArrowRight className="h-4 w-4 ml-auto" style={{ color: "#2563EB" }} aria-hidden="true" />}
                  </>
                );
                return p.link ? (
                  <FadeUp key={i} delay={i * 50}>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200"
                    >
                      {content}
                    </a>
                  </FadeUp>
                ) : (
                  <FadeUp key={i} delay={i * 50}>
                    <div className="flex items-center gap-4 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                      {content}
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Family & Values ──────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeUp>
              <img
                src="/family-photo.jpg"
                alt="Bill Trampe and family"
                className="w-full rounded-2xl object-cover shadow-xl border border-gray-100"
                style={{ maxHeight: "420px" }}
              />
            </FadeUp>
            <div>
              <FadeUp delay={80}>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border mb-5" style={{ background: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)", color: "#2563EB" }}>
                  Family &amp; Values
                </span>
              </FadeUp>
              <FadeUp delay={140}>
                <h2 className="text-3xl font-black text-gray-900 mb-5">Driven by Purpose, Grounded in Family</h2>
              </FadeUp>
              <FadeUp delay={200}>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  The same values that guide our family — commitment, accountability, and showing up for each other — are the same values that drive the work at Insight Strategy Lab.
                </p>
              </FadeUp>
              <FadeUp delay={260}>
                <p className="text-gray-600 leading-relaxed">
                  Building systems that actually work for people isn't just a business philosophy — it's personal. When organizations run well, families thrive, communities strengthen, and missions get fulfilled.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How I Work ───────────────────────────────────── */}
      {get("howiwork_heading").trim() && howIWork.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <FadeUp>
              <h2 className="text-3xl font-black text-gray-900 mb-10">{get("howiwork_heading")}</h2>
            </FadeUp>
            <div className="space-y-4">
              {howIWork.map((step, i) => (
                <FadeUp key={i} delay={i * 70}>
                  <div className="flex items-start gap-5 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: "#2563EB" }}>
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-800 pt-1 leading-relaxed">{step}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ──────────────────────────────────────────── */}
      {get("cta_heading").trim() && (
        <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#111827" }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-10" style={{ background: "radial-gradient(circle,#2563EB,transparent)" }} />
          </div>
          <div className="container mx-auto px-6 text-center relative z-10 max-w-2xl">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{get("cta_heading")}</h2>
            </FadeUp>
            {get("cta_body").trim() && (
              <FadeUp delay={100}>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">{get("cta_body")}</p>
              </FadeUp>
            )}
            <FadeUp delay={200}>
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold" style={{ background: "#2563EB", color: "white" }}>
                <Link href="/contact">
                  {get("cta_button") || "Book a Free Strategy Session"} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </FadeUp>
          </div>
        </section>
      )}
    </div>
  );
}
