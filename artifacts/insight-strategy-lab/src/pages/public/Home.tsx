import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Cog, BarChart, Zap, LayoutDashboard, Database } from "lucide-react";
import { usePublishedApps } from "@/features/apps/api";
import { useContent } from "@/features/content/api";
import { usePageMeta } from "@/lib/usePageMeta";
import { VideoEmbed, youTubeThumb } from "@/components/MediaEmbed";
import { Play } from "lucide-react";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FeaturedReview } from "@/components/FeaturedReview";
import type { AppItem } from "@/lib/types";

function AppPreviewCard({ app }: { app: AppItem }) {
  const [playing, setPlaying] = useState(false);
  const thumb = youTubeThumb(app.youtube_url ?? "") ?? (app.thumbnail_url || "");
  const hasVideo = Boolean(app.youtube_url);

  return (
    <div className="group block bg-background border border-border rounded-xl overflow-hidden hover:border-accent transition-colors hover-elevate">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {playing && hasVideo ? (
          <VideoEmbed url={app.youtube_url!} autoPlay className="absolute inset-0 h-full w-full rounded-none" />
        ) : thumb ? (
          <>
            <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            {hasVideo && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play ${app.title} video`}
                className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30 cursor-pointer"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <Play className="h-6 w-6 translate-x-0.5 fill-current text-primary" />
                </span>
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <div className="p-6">
        <Link href="/apps" className="block">
          <h3 className="font-bold text-xl mb-2 hover:text-accent transition-colors">{app.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: apps = [], isLoading: appsLoading } = usePublishedApps();
  const { get } = useContent("home");
  usePageMeta({ title: get("seo_title"), description: get("seo_description") });

  const steps = [
    { title: get("step1_title"), desc: get("step1_desc"), icon: BarChart },
    { title: get("step2_title"), desc: get("step2_desc"), icon: LayoutDashboard },
    { title: get("step3_title"), desc: get("step3_desc"), icon: Cog },
    { title: get("step4_title"), desc: get("step4_desc"), icon: Zap },
  ];

  const whoBullets = get("who_bullets").split("\n").map((s) => s.trim()).filter(Boolean);
  const whoImage = get("who_image");
  const whoVideo = get("who_video");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>{get("hero_badge")}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              {get("hero_title")}
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              {get("hero_subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                <Link href="/diagnostic">{get("hero_cta_primary")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                <Link href="/apps">{get("hero_cta_secondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured client review */}
      <FeaturedReview className="bg-background" />

      {/* How it works */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{get("how_heading")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{get("how_subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {i < 3 && <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 h-6 w-6" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">{get("who_heading")}</h2>
              <p className="text-lg text-muted-foreground">
                {get("who_body")}
              </p>
              <ul className="space-y-4">
                {whoBullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Button asChild variant="default" size="lg">
                  <Link href="/services">{get("who_cta")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            {whoVideo ? (
              <VideoEmbed url={whoVideo} className="border border-border shadow-xl" />
            ) : whoImage ? (
              <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-auto md:h-[600px] border border-border bg-card shadow-xl">
                <img src={whoImage} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-auto md:h-[600px] border border-border bg-card shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent z-0" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="relative z-10 h-full flex items-center justify-center p-12">
                  <div className="grid grid-cols-2 gap-4 w-full opacity-80">
                    <div className="h-32 rounded-lg bg-primary/20 animate-pulse" />
                    <div className="h-32 rounded-lg bg-accent/20 animate-pulse delay-75" />
                    <div className="h-48 rounded-lg bg-muted animate-pulse delay-150" />
                    <div className="h-48 rounded-lg bg-primary/10 animate-pulse delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Apps Preview */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{get("systems_heading")}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">{get("systems_subtitle")}</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/apps">View All Apps</Link>
            </Button>
          </div>

          {appsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : apps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {apps.slice(0, 3).map((app) => (
                <AppPreviewCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-background rounded-xl border border-border">
              <p className="text-muted-foreground">App showcase updating soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Social proof - links to Google reviews */}
      <ReviewsSection heading={get("testimonials_heading")} className="bg-background" />
    </div>
  );
}
