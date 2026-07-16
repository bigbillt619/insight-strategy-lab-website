import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Extract YouTube video ID from youtu.be or youtube.com URLs. */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch { /* not a valid URL */ }
  return null;
}

/**
 * Given a thumbnail_url or youtube_url, return a proper image src.
 * If the stored URL is itself a YouTube link, swap it for the HQ thumbnail.
 */
export function resolveAppThumbnail(
  thumbnailUrl: string | null | undefined,
  youtubeUrl: string | null | undefined
): string | null {
  // Try thumbnail first — but if it's a YouTube watch URL, convert it
  const thumbId = thumbnailUrl ? extractYouTubeId(thumbnailUrl) : null;
  if (thumbId) return `https://img.youtube.com/vi/${thumbId}/hqdefault.jpg`;
  if (thumbnailUrl && !thumbId) return thumbnailUrl; // real image URL

  // Fall back to deriving thumbnail from youtube_url
  const ytId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

  return null;
}
