import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AppItem, AppInput } from "@/lib/types";

export const appsKey = ["apps"] as const;
export const publishedAppsKey = ["apps", "published"] as const;

/** Public: published apps for the "Apps in Production" gallery. */
export function usePublishedApps() {
  return useQuery({
    queryKey: publishedAppsKey,
    queryFn: async (): Promise<AppItem[]> => {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as AppItem[];
    },
  });
}

/* ---------------- Admin ---------------- */

export function useAllApps() {
  return useQuery({
    queryKey: appsKey,
    queryFn: async (): Promise<AppItem[]> => {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as AppItem[];
    },
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: appsKey });
  qc.invalidateQueries({ queryKey: publishedAppsKey });
}

export function useCreateApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AppInput) => {
      const { data, error } = await supabase
        .from("apps")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as AppItem;
    },
    onSuccess: () => invalidate(qc),
  });
}

export function useUpdateApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<AppInput> & { id: string }) => {
      const { data, error } = await supabase
        .from("apps")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as AppItem;
    },
    onSuccess: () => invalidate(qc),
  });
}

export function useDeleteApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("apps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(qc),
  });
}
