export interface DiagnosticOption {
  /** Maturity score this answer contributes for its pillar, 1 (lowest) - 5 (highest). */
  score: 1 | 2 | 3 | 4 | 5;
  label: string;
}

export type BosPillar =
  | "strategy"
  | "people"
  | "processes"
  | "technology"
  | "data"
  | "ai";

export interface DiagnosticQuestion {
  /** One of the six Business Operating System pillars this question scores. */
  key: BosPillar;
  pillarLabel: string;
  question: string;
  helper?: string;
  options: DiagnosticOption[];
}

export const PILLAR_LABELS: Record<BosPillar, string> = {
  strategy: "Strategy",
  people: "People",
  processes: "Processes",
  technology: "Technology",
  data: "Data",
  ai: "AI",
};

/** The 6 pillars of the ISL Business Operating System framework, each scored 1-5. */
export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    key: "strategy",
    pillarLabel: "Leadership & Strategy",
    question: "Does your organization have documented goals that everyone understands?",
    options: [
      { score: 1, label: "No defined goals" },
      { score: 2, label: "Leadership only knows them" },
      { score: 3, label: "Some teams know them" },
      { score: 4, label: "Mostly aligned" },
      { score: 5, label: "Fully aligned and tracked" },
    ],
  },
  {
    key: "people",
    pillarLabel: "People & Accountability",
    question: "Are roles and responsibilities clearly defined?",
    options: [
      { score: 1, label: "Constant confusion" },
      { score: 2, label: "Mostly informal" },
      { score: 3, label: "Defined but inconsistent" },
      { score: 4, label: "Clear for most employees" },
      { score: 5, label: "Fully documented and governed" },
    ],
  },
  {
    key: "processes",
    pillarLabel: "Processes",
    question: "How are your core business processes managed?",
    options: [
      { score: 1, label: "Mostly tribal knowledge" },
      { score: 2, label: "Some written procedures" },
      { score: 3, label: "Key workflows documented" },
      { score: 4, label: "Standardized across teams" },
      { score: 5, label: "Continuously measured and improved" },
    ],
  },
  {
    key: "technology",
    pillarLabel: "Technology",
    question: "Do your systems work together?",
    options: [
      { score: 1, label: "Mostly manual" },
      { score: 2, label: "Many disconnected tools" },
      { score: 3, label: "Partial integrations" },
      { score: 4, label: "Well integrated" },
      { score: 5, label: "Unified technology ecosystem" },
    ],
  },
  {
    key: "data",
    pillarLabel: "Data & Visibility",
    question: "How easily can leadership understand business performance?",
    options: [
      { score: 1, label: "We guess" },
      { score: 2, label: "Spreadsheets everywhere" },
      { score: 3, label: "Periodic reports" },
      { score: 4, label: "Real-time dashboards" },
      { score: 5, label: "Data-driven decision making" },
    ],
  },
  {
    key: "ai",
    pillarLabel: "AI Readiness",
    question: "How is AI currently used?",
    options: [
      { score: 1, label: "Not using AI" },
      { score: 2, label: "Experiments only" },
      { score: 3, label: "Individual usage" },
      { score: 4, label: "Team usage" },
      { score: 5, label: "Integrated into business workflows" },
    ],
  },
];

/** Human-readable label lookup for a pillar's chosen score (for display/storage). */
export function labelForScore(
  key: BosPillar,
  score: number | undefined,
): string {
  if (!score) return "";
  const q = DIAGNOSTIC_QUESTIONS.find((q) => q.key === key);
  return q?.options.find((o) => o.score === score)?.label ?? "";
}
