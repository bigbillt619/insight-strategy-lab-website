import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Review, ReviewInput } from "@/lib/types";

export const reviewsKey = ["reviews"] as const;
export const publishedReviewsKey = ["reviews", "published"] as const;

/** Public: published reviews for the social-proof sections. */
export function usePublishedReviews() {
  return useQuery({
    queryKey: publishedReviewsKey,
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });
}

/* ---------------- Admin ---------------- */

export function useAllReviews() {
  return useQuery({
    queryKey: reviewsKey,
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: reviewsKey });
  qc.invalidateQueries({ queryKey: publishedReviewsKey });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ReviewInput) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as Review;
    },
    onSuccess: () => invalidate(qc),
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<ReviewInput> & { id: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Review;
    },
    onSuccess: () => invalidate(qc),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(qc),
  });
}
