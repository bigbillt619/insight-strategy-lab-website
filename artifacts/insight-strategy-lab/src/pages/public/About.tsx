import { useContent } from "@/features/content/api";
import { Award, FileText } from "lucide-react";

function isImageUrl(url: string) {
  return (
    /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url) ||
    url.includes("/storage/v1/object/public/")
  );
}

export default function About() {
  const { get } = useContent("about");
  const photo = get("photo");
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
          <p className="lead text-xl text-foreground font-medium mb-8">
            {get("lead")}
          </p>

          <p>
            {get("body")}
          </p>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-6">{get("creds_heading")}</h3>
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
              <h3 className="text-2xl font-bold text-foreground mt-12 mb-6">{get("badges_heading")}</h3>
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
              <h3 className="text-2xl font-bold text-foreground mt-12 mb-6">{get("pubs_heading")}</h3>
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
        </div>
      </div>
    </div>
  );
}
