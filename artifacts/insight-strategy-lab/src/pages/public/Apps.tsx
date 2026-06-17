import { usePublishedApps } from "@/features/apps/api";
import { Database, PlayCircle } from "lucide-react";

export default function Apps() {
  const { data: apps = [], isLoading } = usePublishedApps();

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Systems in Production
          </h1>
          <p className="text-xl text-muted-foreground">
            A gallery of real tools built for real businesses. See what's possible when you stop fighting generic software and start building around your actual operations.
          </p>
        </div>

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
                {/* Video/Thumbnail Placeholder */}
                <div className="aspect-video bg-muted relative border-b border-border flex items-center justify-center overflow-hidden">
                  <Database className="h-16 w-16 text-muted-foreground/20 absolute" />
                  {app.youtube_url ? (
                    <a href={app.youtube_url} target="_blank" rel="noreferrer" className="relative z-10 flex flex-col items-center gap-2 text-foreground/80 hover:text-accent transition-colors">
                      <PlayCircle className="h-12 w-12" />
                      <span className="text-sm font-semibold bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">Watch Demo</span>
                    </a>
                  ) : (
                    <div className="relative z-10 text-muted-foreground/50 text-sm font-medium">Interactive Demo Unavailable</div>
                  )}
                </div>
                
                <div className="p-8">
                  {app.category && (
                    <div className="inline-flex px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold mb-4">
                      {app.category}
                    </div>
                  )}
                  <h3 className="font-bold text-2xl mb-3 text-foreground">{app.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {app.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 mt-auto">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Use Case</h4>
                      <p className="text-sm font-medium text-foreground">{app.use_case || "Operational Workflow"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Result</h4>
                      <p className="text-sm font-medium text-accent">{app.results_summary || "Increased efficiency"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card border border-border rounded-2xl">
            <Database className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Showcase updating</h3>
            <p className="text-muted-foreground">We are currently compiling our latest case studies and production systems.</p>
          </div>
        )}
      </div>
    </div>
  );
}
