export interface DiagnosticOption {
  value: string;
  label: string;
}

export interface DiagnosticQuestion {
  /** Maps directly to a lead field + recommendation_map trigger_type */
  key:
    | "business_type"
    | "company_size"
    | "biggest_bottleneck"
    | "current_tools"
    | "revenue_range";
  question: string;
  helper?: string;
  options: DiagnosticOption[];
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    key: "business_type",
    question: "What type of operation are we designing a system for?",
    helper: "This helps us tailor the system architecture to your operations.",
    options: [
      { value: "fitness_facility", label: "Gym / Fitness Facility" },
      { value: "sports_academy", label: "Sports Training Academy" },
      { value: "property_management", label: "Property Management" },
      {
        value: "service_business",
        label: "Service-Based Business (landscaping, delivery, trades)",
      },
      { value: "other", label: "Something else" },
    ],
  },
  {
    key: "company_size",
    question: "How big is your team?",
    options: [
      { value: "solo", label: "Just me" },
      { value: "2_5", label: "2–5 people" },
      { value: "6_20", label: "6–20 people" },
      { value: "20_plus", label: "20+ people" },
    ],
  },
  {
    key: "biggest_bottleneck",
    question: "What's slowing you down the most right now?",
    helper: "Pick the one that costs you the most time or money.",
    options: [
      { value: "manual_scheduling", label: "Manual scheduling & bookings" },
      { value: "lead_followup", label: "Chasing leads & follow-ups" },
      {
        value: "scattered_data",
        label: "Scattered data with no clear dashboards",
      },
      { value: "repetitive_admin", label: "Repetitive admin & busywork" },
      {
        value: "no_custom_tools",
        label: "No custom tools built for my workflow",
      },
    ],
  },
  {
    key: "current_tools",
    question: "What are you using to run things today?",
    options: [
      { value: "spreadsheets", label: "Spreadsheets" },
      { value: "generic_crm", label: "A generic CRM (GoHighLevel, etc.)" },
      { value: "pen_paper", label: "Pen & paper / nothing yet" },
      { value: "disconnected_apps", label: "A mix of disconnected apps" },
    ],
  },
  {
    key: "revenue_range",
    question: "What's your approximate annual revenue?",
    helper: "Optional — it helps us scope the right engagement.",
    options: [
      { value: "under_250k", label: "Under $250k" },
      { value: "250k_1m", label: "$250k – $1M" },
      { value: "1m_5m", label: "$1M – $5M" },
      { value: "5m_plus", label: "$5M+" },
      { value: "private", label: "Prefer not to say" },
    ],
  },
];

/** Human-readable label lookup for storing/displaying answer values. */
export function labelForAnswer(
  key: DiagnosticQuestion["key"],
  value: string | undefined,
): string {
  if (!value) return "";
  const q = DIAGNOSTIC_QUESTIONS.find((q) => q.key === key);
  return q?.options.find((o) => o.value === value)?.label ?? value;
}
