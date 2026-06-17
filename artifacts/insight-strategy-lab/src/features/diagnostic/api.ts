import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  DiagnosticAnswers,
  RecommendationMap,
  RecommendationMapInput,
  RecommendationOutput,
} from "@/lib/types";

export const recommendationMapKey = ["recommendation_map"] as const;

/** Public: read the recommendation map that drives the diagnostic. */
export function useRecommendationMap() {
  return useQuery({
    queryKey: recommendationMapKey,
    queryFn: async (): Promise<RecommendationMap[]> => {
      const { data, error } = await supabase
        .from("recommendation_map")
        .select("*")
        .order("priority", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RecommendationMap[];
    },
  });
}

/**
 * Lightweight, data-driven recommendation engine.
 * Matches each diagnostic answer against the recommendation_map
 * (trigger_type = answer key, trigger_value = answer value), then
 * produces a confidence-framed result: a primary opportunity, a few
 * "also consider" options, and a short "why this matters" rationale.
 */
export function computeRecommendation(
  answers: DiagnosticAnswers,
  map: RecommendationMap[],
): RecommendationOutput {
  const matches = map
    .filter((row) => {
      const answerValue = (answers as Record<string, string | undefined>)[
        row.trigger_type
      ];
      return answerValue !== undefined && answerValue === row.trigger_value;
    })
    .sort((a, b) => b.priority - a.priority);

  const orderedSystems: string[] = [];
  for (const row of matches) {
    for (const system of row.recommended_systems) {
      if (!orderedSystems.includes(system)) orderedSystems.push(system);
    }
  }

  const why =
    matches.find((m) => m.rationale)?.rationale ??
    "Based on your answers, a custom system would remove the manual work that's currently capping your growth.";

  return {
    primary: orderedSystems[0] ?? "Custom System Audit",
    also_consider: orderedSystems.slice(1, 3),
    why,
  };
}

/** Public: persist a diagnostic result, linked to a lead. */
export function useSaveDiagnosticResult() {
  return useMutation({
    mutationFn: async (input: {
      lead_id: string | null;
      answers: DiagnosticAnswers;
      recommended_systems: RecommendationOutput;
    }) => {
      const { data, error } = await supabase
        .from("diagnostic_results")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}

/* ---------------- Admin: recommendation map CRUD ---------------- */

export function useCreateRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecommendationMapInput) => {
      const { data, error } = await supabase
        .from("recommendation_map")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as RecommendationMap;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: recommendationMapKey }),
  });
}

export function useUpdateRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: RecommendationMapInput & { id: string }) => {
      const { data, error } = await supabase
        .from("recommendation_map")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as RecommendationMap;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: recommendationMapKey }),
  });
}

export function useDeleteRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recommendation_map")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: recommendationMapKey }),
  });
}
