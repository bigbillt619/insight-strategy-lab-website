export default function About() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            About the Founder
          </h1>
        </div>

        <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-p:text-muted-foreground max-w-none">
          <p className="lead text-xl text-foreground font-medium mb-8">
            Bill Tamayo is a 25+ year U.S. military veteran, lifelong learner, and organizational strategist who helps leaders navigate complexity with clarity, purpose, and systemized insight. A family man at heart and a systems thinker by trade, Bill blends experience, empathy, and execution in everything he builds.
          </p>

          <p>
            Bill is the founder of Insight Strategy Lab, a consultancy dedicated to helping mission-driven organizations transform through people-first innovation, modular agentic workflows, and performance-driven architecture. His work centers on creating simple, elegant systems that remove operational friction and empower small businesses to focus on the work that matters.
          </p>

          <hr className="my-12 border-border" />

          <h3 className="text-2xl font-bold text-foreground mb-6">Education & Professional Credentials</h3>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex items-center gap-4 border border-border p-4 rounded-lg bg-card">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-medium text-foreground">BBA in Human Resource Management</span>
              <span className="text-muted-foreground text-sm ml-auto">(minor in Economics)</span>
            </li>
            <li className="flex items-center gap-4 border border-border p-4 rounded-lg bg-card">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-medium text-foreground">MS in Management</span>
            </li>
            <li className="flex items-center gap-4 border border-border p-4 rounded-lg bg-card">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-medium text-foreground">MA in Military Studies</span>
            </li>
            <li className="flex items-center gap-4 border border-border p-4 rounded-lg bg-card">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-medium text-foreground">MBA in Business</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
