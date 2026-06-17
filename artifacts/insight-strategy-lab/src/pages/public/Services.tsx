import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useContent } from "@/features/content/api";

export default function Services() {
  const { get } = useContent("services");

  const toPoints = (key: string) => get(key).split("\n").map((s) => s.trim()).filter(Boolean);

  const capabilities = [
    { title: get("cap1_title"), points: toPoints("cap1_points") },
    { title: get("cap2_title"), points: toPoints("cap2_points") },
    { title: get("cap3_title"), points: toPoints("cap3_points") },
    { title: get("cap4_title"), points: toPoints("cap4_points") },
  ];

  const models = [
    { title: get("model1_title"), fee: get("model1_fee"), desc: get("model1_desc") },
    { title: get("model2_title"), fee: get("model2_fee"), desc: get("model2_desc") },
    { title: get("model3_title"), fee: get("model3_fee"), desc: get("model3_desc") },
  ];

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-20 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            {get("hero_title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {get("hero_subtitle")}
          </p>
        </div>

        {/* What We Build */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-foreground mb-10">{get("build_heading")}</h2>
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

        {/* Engagement Models */}
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-foreground mb-10">{get("models_heading")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model, i) => (
              <div key={i} className={`p-8 border rounded-2xl flex flex-col ${i === 1 ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
                <h3 className="text-2xl font-bold mb-2">{model.title}</h3>
                <p className={`text-sm font-semibold uppercase tracking-wider mb-6 ${i === 1 ? 'text-primary-foreground/80' : 'text-accent'}`}>
                  {model.fee}
                </p>
                <p className={`leading-relaxed ${i === 1 ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                  {model.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 md:p-20 bg-secondary/50 rounded-3xl border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{get("cta_heading")}</h2>
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
