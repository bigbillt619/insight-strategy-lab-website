/** Renders a video URL: YouTube/Vimeo as an iframe embed, otherwise a file <video>. */
export function VideoEmbed({ url, className = "", autoPlay = false }: { url: string; className?: string; autoPlay?: boolean }) {
  const embed = toEmbedUrl(url);
  if (embed) {
    const src = autoPlay ? `${embed}${embed.includes("?") ? "&" : "?"}autoplay=1` : embed;
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl ${className}`} style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={src}
          title="Video"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video src={url} controls autoPlay={autoPlay} className={`w-full rounded-2xl ${className}`} />
  );
}

/** Returns a YouTube thumbnail image URL for a given YouTube link, or null. */
export function youTubeThumb(url: string): string | null {
  const id = youTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function youTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.slice(1) || null;
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
    }
  } catch {
    return null;
  }
  return null;
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}
