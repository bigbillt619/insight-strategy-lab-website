/**
 * Business-context qualifier fields shown on the lead capture forms
 * (diagnostic result screen + direct contact form). These are independent of
 * the 6 BOS pillar assessment questions -- they simply give the owner
 * business-identifying context (industry, size, tools, revenue) about a
 * lead before following up, same as before the BOS maturity rewrite.
 */
export interface QualifierOption {
  value: string;
  label: string;
}

export interface QualifierField {
  name: "business_type" | "company_size" | "biggest_bottleneck" | "current_tools" | "revenue_range";
  label: string;
  options: QualifierOption[];
}

export const QUALIFIER_FIELDS: QualifierField[] = [
  {
    name: "business_type",
    label: "Business type",
    options: [
      { value: "fitness_facility", label: "Fitness facility / studio" },
      { value: "sports_academy", label: "Sports academy" },
      { value: "property_management", label: "Property management" },
      { value: "service_business", label: "Service business" },
      { value: "other", label: "Other" },
    ],
  },
  {
    name: "company_size",
    label: "Team size",
    options: [
      { value: "solo", label: "Just me" },
      { value: "2_5", label: "2-5 people" },
      { value: "6_20", label: "6-20 people" },
      { value: "20_plus", label: "20+ people" },
    ],
  },
  {
    name: "biggest_bottleneck",
    label: "Biggest bottleneck",
    options: [
      { value: "manual_scheduling", label: "Manual scheduling & bookings" },
      { value: "lead_followup", label: "Lead follow-up" },
      { value: "scattered_data", label: "Scattered data / reporting" },
      { value: "repetitive_admin", label: "Repetitive admin work" },
      { value: "no_custom_tools", label: "No tools built for how we work" },
    ],
  },
  {
    name: "current_tools",
    label: "Current tools",
    options: [
      { value: "spreadsheets", label: "Spreadsheets" },
      { value: "generic_crm", label: "A generic CRM" },
      { value: "pen_paper", label: "Pen and paper" },
      { value: "disconnected_apps", label: "Several disconnected apps" },
    ],
  },
  {
    name: "revenue_range",
    label: "Annual revenue",
    options: [
      { value: "under_250k", label: "Under $250k" },
      { value: "250k_1m", label: "$250k - $1M" },
      { value: "1m_5m", label: "$1M - $5M" },
      { value: "5m_plus", label: "$5M+" },
    ],
  },
];
