import { useContent } from "@/features/content/api";
import { Link } from "wouter";
import { Award, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        // If the image field actually holds a (non-image) link, treat it as the link.
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
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 text-center">
          {photo && (
            <img
              src={photo}
              alt=""
              className="mx-auto mb-8 h-72 w-72 md:h-96 md:w-96 rounded-2xl object-cover border border-border"
            />
          )}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            {get("hero_title")}
          </h1>
        </div>

        <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-p:text-muted-foreground max-w-none">
          {lead.map((p, i) => (
            <p key={i} className="lead text-xl text-foreground font-medium mb-6">
              {p}
            </p>
          ))}

          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {get("philosophy_heading").trim() && philosophy.length > 0 && (
            <>
              <hr className="my-12 border-border" />
              <h3 className="text-2xl font-bold text-foreground mb-6">{get("philosophy_heading")}</h3>
              <div className="border-l-4 border-accent pl-6">
                {philosophy.map((p, i) => (
                  <p key={i} className="text-lg text-foreground font-medium">{p}</p>
                ))}
              </div>
            </>
          )}

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-3">{get("creds_heading")}</h3>
          {get("creds_intro").trim() && (
            <p className="mb-6">{get("creds_intro")}</p>
          )}
          <ul className="space-y-3 list-none pl-0">
            {creds.map((c, i) => (
              <li key={i} className="flex items-center gap-4 border border-border p-4 rounded-lg bg-card">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="font-medium text-foreground">{c}</span>
              </li>
            ))}
          </ul>

          {badges.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-foreground mt-12 mb-3">{get("badges_heading")}</h3>
              {get("badges_caption").trim() && (
                <p className="mb-6">{get("badges_caption")}</p>
              )}
              <div className="flex flex-wrap items-center gap-6 not-prose">
                {badges.map((b, i) => {
                  if (b.image) {
                    const img = (
                      <img
                        src={b.image}
                        alt=""
                        className="relative z-0 h-24 w-auto origin-center object-contain rounded-lg border border-border bg-card p-3 shadow-sm transition-transform duration-300 ease-out hover:z-30 hover:scale-[3] hover:shadow-2xl"
                      />
                    );
                    return b.link ? (
                      <a
                        key={i}
                        href={b.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        {img}
                      </a>
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
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-4 text-sm font-medium text-foreground transition-transform duration-300 ease-out hover:scale-105 hover:border-accent"
                    >
                      <Award className="h-5 w-5 text-accent" />
                      View Certificate
                    </a>
                  );
                })}
              </div>
            </>
          )}

          {publications.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-foreground mt-12 mb-3">{get("pubs_heading")}</h3>
              {get("pubs_intro").trim() && (
                <p className="mb-6">{get("pubs_intro")}</p>
              )}
              <ul className="space-y-3 list-none pl-0 not-prose">
                {publications.map((p, i) => {
                  const label = p.title || "View publication";
                  const content = (
                    <>
                      <FileText className="h-5 w-5 shrink-0 text-accent" />
                      <span className="font-medium text-foreground">{label}</span>
                    </>
                  );
                  return p.link ? (
                    <li key={i}>
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 border border-border p-4 rounded-lg bg-card transition-colors hover:border-accent"
                      >
                        {content}
                      </a>
                    </li>
                  ) : (
                    <li key={i} className="flex items-center gap-4 border border-border p-4 rounded-lg bg-card">
                      {content}
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {get("howiwork_heading").trim() && howIWork.length > 0 && (
            <>
              <hr className="my-12 border-border" />
              <h3 className="text-2xl font-bold text-foreground mb-6">{get("howiwork_heading")}</h3>
              <ol className="space-y-4 list-none pl-0 not-prose">
                {howIWork.map((step, i) => (
                  <li key={i} className="flex items-start gap-4 border border-border p-5 rounded-lg bg-card">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="font-medium text-foreground pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>

        {get("cta_heading").trim() && (
          <div className="mt-16 rounded-3xl border border-border bg-primary/5 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{get("cta_heading")}</h2>
            {get("cta_body").trim() && (
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{get("cta_body")}</p>
            )}
            <Button asChild size="lg">
              <Link href="/diagnostic">
                {get("cta_button")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
