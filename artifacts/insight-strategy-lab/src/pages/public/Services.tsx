import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";

export default function Services() {
  const { get } = useContent("services");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const toPoints = (key: string) => get(key).split("\n").map((s) => s.trim()).filter(Boolean);
  const paragraphs = (key: string) => get(key).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  const capabilities = [
    { title: get("cap1_title"), points: toPoints("cap1_points") },
    { title: get("cap2_title"), points: toPoints("cap2_points") },
    { title: get("cap3_title"), points: toPoints("cap3_points") },
    { title: get("cap4_title"), points: toPoints("cap4_points") },
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
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            {get("hero_title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {get("hero_subtitle")}
          </p>
        </div>

        {/* Top diagnostic banner */}
        {bannerHeading && (
          <div className="mb-24 p-8 md:p-10 rounded-3xl bg-secondary/50 border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{bannerHeading}</h2>
              {get("banner_body") && (
                <p className="text-muted-foreground max-w-2xl">{get("banner_body")}</p>
              )}
            </div>
            {bannerButton && (
              <Button asChild size="lg" className="shrink-0 h-12 px-6">
                <Link href="/diagnostic">
                  {bannerButton} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* System Components */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-foreground mb-4">{get("build_heading")}</h2>
          {get("build_intro") && (
            <p className="text-lg text-muted-foreground mb-10 max-w-3xl">{get("build_intro")}</p>
          )}
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

        {/* How We Engage */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-foreground mb-4">{get("models_heading")}</h2>
          {get("models_intro") && (
            <p className="text-lg text-muted-foreground mb-10 max-w-3xl">{get("models_intro")}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model, i) => (
              <div key={i} className={`p-8 border rounded-2xl flex flex-col ${i === 1 ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
                <h3 className="text-2xl font-bold mb-3">{model.title}</h3>
                <p className={`leading-relaxed mb-6 ${i === 1 ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                  {model.desc}
                </p>
                {model.bestFor && (
                  <p className={`text-sm leading-relaxed mb-6 ${i === 1 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    <span className="font-semibold">Best for: </span>{model.bestFor}
                  </p>
                )}
                {model.fee && (
                  <p className={`mt-auto text-sm font-semibold ${i === 1 ? 'text-primary-foreground/90' : 'text-accent'}`}>
                    {model.fee}
                  </p>
                )}
              </div>
            ))}
          </div>
          {modelsNote && (
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-muted-foreground">{modelsNote}</p>
              {bannerButton && (
                <Button asChild variant="outline" className="shrink-0">
                  <Link href="/diagnostic">
                    {bannerButton} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Why Systems Are Scoped Individually */}
        {scopedHeading && scopedBody.length > 0 && (
          <div className="mb-32 max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">{scopedHeading}</h2>
            <div className="space-y-4">
              {scopedBody.map((p, i) => (
                <p key={i} className="text-lg text-muted-foreground leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* What You Get */}
        {getHeading && getItems.length > 0 && (
          <div className="mb-32">
            <h2 className="text-3xl font-bold text-foreground mb-10">{getHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-6 border border-border rounded-2xl bg-card">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span className="text-lg text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center p-12 md:p-20 bg-secondary/50 rounded-3xl border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{get("cta_heading")}</h2>
          {ctaBody && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{ctaBody}</p>
          )}
          <Button asChild size="lg" className="h-14 px-8 text-lg">
            <Link href="/diagnostic">
              {get("cta_button")} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
