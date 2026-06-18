import { Link } from "wouter";
import { usePublishedApps } from "@/features/apps/api";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { VideoEmbed } from "@/components/MediaEmbed";
import { Button } from "@/components/ui/button";
import { Database, CheckCircle2 } from "lucide-react";

export default function Apps() {
  const { data: apps = [], isLoading } = usePublishedApps();
  const { get } = useContent("apps");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const includesHeading = get("includes_heading");
  const includesItems = get("includes_items").split("\n").map((s) => s.trim()).filter(Boolean);
  const galleryLabel = get("gallery_label");
  const ctaHeading = get("cta_heading");

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            {get("hero_title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {get("hero_subtitle")}
          </p>
        </div>

        {galleryLabel && apps.length > 0 && (
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8">
            {galleryLabel}
          </h2>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse border border-border" />
            ))}
          </div>
        ) : apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {apps.map((app) => (
              <div key={app.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-accent">
                {/* Embedded video, thumbnail, or placeholder */}
                {app.youtube_url ? (
                  <VideoEmbed url={app.youtube_url} className="rounded-none border-b border-border" />
                ) : app.thumbnail_url ? (
                  <div className="aspect-video border-b border-border overflow-hidden">
                    <img src={app.thumbnail_url} alt={app.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted relative border-b border-border flex items-center justify-center overflow-hidden">
                    <Database className="h-16 w-16 text-muted-foreground/20 absolute" />
                    <div className="relative z-10 text-muted-foreground/50 text-sm font-medium">Demo coming soon</div>
                  </div>
                )}
                
                <div className="p-8">
                  {app.category && (
                    <div className="inline-flex px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold mb-4">
                      {app.category}
                    </div>
                  )}
                  <h3 className="font-bold text-2xl mb-5 text-foreground">{app.title}</h3>

                  <div className="space-y-5">
                    {app.description && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">What it does</h4>
                        <p className="text-sm text-foreground leading-relaxed">{app.description}</p>
                      </div>
                    )}
                    {app.problem_solved && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Problem solved</h4>
                        <p className="text-sm text-foreground leading-relaxed">{app.problem_solved}</p>
                      </div>
                    )}
                    {(app.use_case || app.results_summary) && (
                      <div className="grid grid-cols-2 gap-4 border-t border-border pt-5">
                        {app.use_case && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Use case</h4>
                            <p className="text-sm font-medium text-foreground">{app.use_case}</p>
                          </div>
                        )}
                        {app.results_summary && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Outcome</h4>
                            <p className="text-sm font-medium text-accent">{app.results_summary}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card border border-border rounded-2xl">
            <Database className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">{get("empty_heading")}</h3>
            <p className="text-muted-foreground">{get("empty_body")}</p>
          </div>
        )}

        {includesHeading && includesItems.length > 0 && (
          <section className="mt-24 bg-card border border-border rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-8">
              {includesHeading}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {includesItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {ctaHeading && (
          <section className="mt-16 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
              {ctaHeading}
            </h2>
            {get("cta_body") && (
              <p className="text-lg text-muted-foreground mb-8">{get("cta_body")}</p>
            )}
            {get("cta_button") && (
              <Button asChild size="lg">
                <Link href="/contact">{get("cta_button")}</Link>
              </Button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
