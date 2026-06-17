import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { defaultsFor } from "./schema";
import type { ContentBlock, ContentBlockInput } from "./types";

export const contentKey = ["content_blocks"] as const;

/** Fetch every content block once; pages select the keys they need. */
export function useContentBlocks() {
  return useQuery({
    queryKey: contentKey,
    queryFn: async (): Promise<ContentBlock[]> => {
      const { data, error } = await supabase.from("content_blocks").select("*");
      if (error) throw error;
      return (data ?? []) as ContentBlock[];
    },
    staleTime: 30_000,
  });
}

export interface ContentAccessor {
  get: (key: string, fallback?: string) => string;
  isLoading: boolean;
}

/**
 * Public read helper for a page. Returns a `get(key)` that yields the DB override
 * when present, otherwise the in-code default from the schema.
 */
export function useContent(page: string): ContentAccessor {
  const { data: blocks = [], isLoading } = useContentBlocks();

  const map = useMemo(() => {
    const defaults = defaultsFor(page);
    const merged: Record<string, string> = { ...defaults };
    // Apply an override whenever a row exists for this page/key, even when its
    // value is empty, so the owner can intentionally clear a field.
    for (const b of blocks) {
      if (b.page === page) merged[b.key] = b.value;
    }
    return merged;
  }, [blocks, page]);

  const get = (key: string, fallback = "") =>
    map[key] !== undefined ? map[key] : fallback;

  return { get, isLoading };
}

/** Admin: current saved override value for a single field, or "" if unset. */
export function blockValue(
  blocks: ContentBlock[],
  page: string,
  key: string,
): string {
  return blocks.find((b) => b.page === page && b.key === key)?.value ?? "";
}

export function useUpsertContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inputs: ContentBlockInput[]) => {
      if (inputs.length === 0) return;
      const { error } = await supabase
        .from("content_blocks")
        .upsert(inputs, { onConflict: "page,key" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKey }),
  });
}

/** Upload a file to the public 'media' bucket; returns its public URL. */
export async function uploadMedia(
  page: string,
  key: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${page}/${key}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
