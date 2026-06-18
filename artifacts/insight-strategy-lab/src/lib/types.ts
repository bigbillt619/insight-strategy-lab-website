export type LeadStatus = "New" | "Contacted" | "Qualified" | "Closed";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Closed",
];

export type LeadSource = "diagnostic" | "contact_direct" | "vehicle_qr";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_type: string | null;
  company_size: string | null;
  biggest_bottleneck: string | null;
  current_tools: string | null;
  revenue_range: string | null;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

export interface LeadInput {
  name: string;
  email: string;
  phone?: string | null;
  business_type?: string | null;
  company_size?: string | null;
  biggest_bottleneck?: string | null;
  current_tools?: string | null;
  revenue_range?: string | null;
  message?: string | null;
  source: LeadSource;
}

export type LeadEventType =
  | "created"
  | "status_changed"
  | "note_added";

export interface LeadEvent {
  id: string;
  lead_id: string;
  event_type: LeadEventType;
  from_status: LeadStatus | null;
  to_status: LeadStatus | null;
  note: string | null;
  created_at: string;
}

export interface DiagnosticAnswers {
  business_type?: string;
  company_size?: string;
  biggest_bottleneck?: string;
  current_tools?: string;
  revenue_range?: string;
}

export interface DiagnosticResult {
  id: string;
  lead_id: string | null;
  answers: DiagnosticAnswers;
  recommended_systems: RecommendationOutput;
  created_at: string;
}

export interface RecommendationOutput {
  primary: string | null;
  also_consider: string[];
  why: string;
}

export interface RecommendationMap {
  id: string;
  trigger_type: string;
  trigger_value: string;
  recommended_systems: string[];
  rationale: string | null;
  priority: number;
  created_at: string;
}

export interface RecommendationMapInput {
  trigger_type: string;
  trigger_value: string;
  recommended_systems: string[];
  rationale?: string | null;
  priority: number;
}

export interface AppItem {
  id: string;
  title: string;
  description: string | null;
  problem_solved: string | null;
  youtube_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  use_case: string | null;
  results_summary: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface AppInput {
  title: string;
  description?: string | null;
  problem_solved?: string | null;
  youtube_url?: string | null;
  thumbnail_url?: string | null;
  category?: string | null;
  use_case?: string | null;
  results_summary?: string | null;
  sort_order?: number;
  published?: boolean;
}

