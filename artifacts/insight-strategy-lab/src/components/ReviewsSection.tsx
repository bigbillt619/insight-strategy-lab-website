import { usePublishedReviews } from "@/features/reviews/api";

interface ReviewsSectionProps {
  heading?: string;
  limit?: number;
  className?: string;
}

/** Shared social-proof block, used on Home and Contact. */
export function ReviewsSection({
  heading = "Trusted by Operators",
  limit = 3,
  className = "",
}: ReviewsSectionProps) {
  const { data: reviews = [], isLoading } = usePublishedReviews();

  if (isLoading || reviews.length === 0) return null;

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, limit).map((review) => (
            <div
              key={review.id}
              className="p-8 bg-card border border-border rounded-2xl"
            >
              <div className="text-accent mb-4 text-2xl" aria-hidden>
                {"\u2605".repeat(Math.max(1, Math.min(5, review.rating)))}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{review.text}"</p>
              <p className="font-bold text-foreground">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
