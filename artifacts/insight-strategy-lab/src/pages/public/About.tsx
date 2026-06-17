import { useContent } from "@/features/content/api";

export default function About() {
  const { get } = useContent("about");
  const photo = get("photo");
  const creds = get("creds").split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16">
          {photo && (
            <img src={photo} alt="" className="h-40 w-40 rounded-2xl object-cover border border-border mb-8" />
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
        </div>
      </div>
    </div>
  );
}
