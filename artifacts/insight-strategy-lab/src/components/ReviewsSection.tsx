import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/features/content/api";

interface ReviewsSectionProps {
  heading?: string;
  className?: string;
}

/** Social-proof block linking out to the owner's Google reviews. */
export function ReviewsSection({
  heading = "Trusted by Operators",
  className = "",
}: ReviewsSectionProps) {
  const { get } = useContent("global");
  const url = get("google_reviews_url").trim();

  if (!/^https?:\/\//i.test(url)) return null;

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
          {heading}
        </h2>
        <div className="flex items-center justify-center gap-1 text-accent mb-6" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-current" />
          ))}
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          See what clients are saying about working with Insight Strategy Lab.
        </p>
        <Button asChild size="lg">
          <a href={url} target="_blank" rel="noreferrer">
            Read our Google reviews
          </a>
        </Button>
      </div>
    </section>
  );
}
