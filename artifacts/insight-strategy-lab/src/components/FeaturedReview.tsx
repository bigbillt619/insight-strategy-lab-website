import { Star, Quote } from "lucide-react";
import { useContent } from "@/features/content/api";

/** A single featured client review, shown below the hero on the home page. */
export function FeaturedReview({ className = "" }: { className?: string }) {
  const { get } = useContent("home");
  const quote = get("review_quote").trim();
  if (!quote) return null;

  const author = get("review_author").trim();
  const role = get("review_role").trim();
  const link = get("review_link").trim();
  const ratingRaw = parseInt(get("review_rating"), 10);
  const rating = Number.isFinite(ratingRaw) ? Math.min(Math.max(ratingRaw, 1), 5) : 5;

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <figure className="relative max-w-3xl mx-auto rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm text-center">
          <Quote className="mx-auto mb-6 h-10 w-10 text-accent/40" aria-hidden />
          <div className="flex items-center justify-center gap-1 text-accent mb-6" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <blockquote className="text-lg md:text-xl leading-relaxed text-foreground">
            {quote}
          </blockquote>
          {(author || role) && (
            <figcaption className="mt-6 text-sm">
              {author && <span className="font-semibold text-foreground">{author}</span>}
              {author && role && <span className="text-muted-foreground"> · </span>}
              {role && <span className="text-muted-foreground">{role}</span>}
            </figcaption>
          )}
          {/^https?:\/\//i.test(link) && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
            >
              Read on Google
            </a>
          )}
        </figure>
      </div>
    </section>
  );
}
