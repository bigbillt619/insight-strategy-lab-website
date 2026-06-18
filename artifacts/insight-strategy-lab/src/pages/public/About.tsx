import { useContent } from "@/features/content/api";

export default function About() {
  const { get } = useContent("about");
  const photo = get("photo");
  const creds = get("creds").split("\n").map((s) => s.trim()).filter(Boolean);
  const badges = ["badge_1", "badge_2", "badge_3", "badge_4", "badge_5", "badge_6"]
    .map((k) => get(k))
    .filter(Boolean);

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
                {badges.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-24 w-auto object-contain rounded-lg border border-border bg-card p-3"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
