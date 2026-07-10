import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  BosAssessmentResult,
  BosMaturityLevel,
  BosPillar,
  DiagnosticAnswers,
} from "@/lib/types";
import { DIAGNOSTIC_QUESTIONS, PILLAR_LABELS } from "./questions";

/**
 * Fixed maturity-level bands for the 6-pillar x 5-point BOS assessment
 * (overall score range 6-30). These, along with the pillar questions, are
 * intentionally code constants rather than CMS/owner-editable content -- the
 * ISL signature framework itself shouldn't drift from an admin screen.
 */
export const BOS_MATURITY_LEVELS: BosMaturityLevel[] = [
  {
    name: "Foundational",
    minScore: 6,
    maxScore: 10,
    focusAreas: ["Strategic clarity", "Accountability", "Process documentation"],
    nextStep:
      "Focus on documenting core processes, clarifying responsibilities, and establishing leadership alignment before investing heavily in technology or AI.",
  },
  {
    name: "Operational",
    minScore: 11,
    maxScore: 15,
    focusAreas: ["Workflow consistency", "Team coordination", "Basic reporting"],
    nextStep:
      "Standardize workflows and improve operational visibility by connecting people, processes, and systems.",
  },
  {
    name: "Integrated",
    minScore: 16,
    maxScore: 20,
    focusAreas: ["System integration", "Process automation", "Organizational visibility"],
    nextStep:
      "Expand automation and strengthen cross-functional data flows to improve decision-making.",
  },
  {
    name: "Optimized",
    minScore: 21,
    maxScore: 25,
    focusAreas: ["KPI-driven management", "Data governance", "Advanced automation"],
    nextStep:
      "Leverage advanced reporting, governance, and AI-enabled workflows to improve performance.",
  },
  {
    name: "Adaptive Enterprise",
    minScore: 26,
    maxScore: 30,
    focusAreas: ["AI-enabled operations", "Predictive decision-making", "Continuous improvement"],
    nextStep:
      "Continue evolving a fully integrated operating system through AI, continuous improvement, and strategic innovation.",
  },
];

function levelForScore(overallScore: number): BosMaturityLevel {
  return (
    BOS_MATURITY_LEVELS.find(
      (l) => overallScore >= l.minScore && overallScore <= l.maxScore,
    ) ?? BOS_MATURITY_LEVELS[0]
  );
}

/** Human-readable risk label per pillar, used when surfacing "key risk areas". */
const RISK_LABELS: Record<BosPillar, string> = {
  strategy: "Strategic Alignment",
  people: "Role Clarity & Accountability",
  processes: "Process Standardization",
  technology: "Technology Integration",
  data: "Data Visibility",
  ai: "AI Readiness",
};

export function riskLabel(pillar: BosPillar): string {
  return RISK_LABELS[pillar];
}

export function pillarLabel(pillar: BosPillar): string {
  return PILLAR_LABELS[pillar];
}

/**
 * Pure scoring engine: sums the 6 pillar scores (1-5 each) into an overall
 * score (6-30), maps it to a fixed maturity level band, and surfaces the 3
 * lowest-scoring pillars as key risk areas (ties broken by pillar order).
 */
export function computeAssessment(
  answers: DiagnosticAnswers,
): BosAssessmentResult {
  const scores = {} as Record<BosPillar, number>;
  let overallScore = 0;
  for (const q of DIAGNOSTIC_QUESTIONS) {
    const score = answers[q.key] ?? 0;
    scores[q.key] = score;
    overallScore += score;
  }

  const riskAreas = [...DIAGNOSTIC_QUESTIONS]
    .map((q) => q.key)
    .sort((a, b) => scores[a] - scores[b])
    .slice(0, 3);

  return {
    scores,
    overallScore,
    level: levelForScore(overallScore),
    riskAreas,
  };
}

/** Public: persist a diagnostic result, linked to a lead. */
export function useSaveDiagnosticResult() {
  return useMutation({
    mutationFn: async (input: {
      lead_id: string | null;
      answers: DiagnosticAnswers;
      assessment: BosAssessmentResult;
    }) => {
      // No .select() so the public (anon) flow needs INSERT only, never a
      // readable SELECT policy on diagnostic_results.
      const { error } = await supabase.from("diagnostic_results").insert(input);
      if (error) throw error;
    },
  });
}
