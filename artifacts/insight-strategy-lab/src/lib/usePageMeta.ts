import { useEffect } from "react";

interface PageMetaOptions {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

function getMeta(selector: string): HTMLMetaElement | null {
  return document.querySelector<HTMLMetaElement>(selector);
}

export function usePageMeta({ title, description, ogTitle, ogDescription }: PageMetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;

    const descEl = getMeta('meta[name="description"]');
    const prevDesc = descEl?.getAttribute("content") ?? null;

    const ogTitleEl = getMeta('meta[property="og:title"]');
    const prevOgTitle = ogTitleEl?.getAttribute("content") ?? null;

    const ogDescEl = getMeta('meta[property="og:description"]');
    const prevOgDesc = ogDescEl?.getAttribute("content") ?? null;

    const twitterTitleEl = getMeta('meta[name="twitter:title"]');
    const prevTwitterTitle = twitterTitleEl?.getAttribute("content") ?? null;

    const twitterDescEl = getMeta('meta[name="twitter:description"]');
    const prevTwitterDesc = twitterDescEl?.getAttribute("content") ?? null;

    document.title = title;
    if (descEl) descEl.setAttribute("content", description);
    if (ogTitleEl) ogTitleEl.setAttribute("content", ogTitle ?? title);
    if (ogDescEl) ogDescEl.setAttribute("content", ogDescription ?? description);
    if (twitterTitleEl) twitterTitleEl.setAttribute("content", ogTitle ?? title);
    if (twitterDescEl) twitterDescEl.setAttribute("content", ogDescription ?? description);

    return () => {
      document.title = prevTitle;
      if (descEl && prevDesc !== null) descEl.setAttribute("content", prevDesc);
      if (ogTitleEl && prevOgTitle !== null) ogTitleEl.setAttribute("content", prevOgTitle);
      if (ogDescEl && prevOgDesc !== null) ogDescEl.setAttribute("content", prevOgDesc);
      if (twitterTitleEl && prevTwitterTitle !== null) twitterTitleEl.setAttribute("content", prevTwitterTitle);
      if (twitterDescEl && prevTwitterDesc !== null) twitterDescEl.setAttribute("content", prevTwitterDesc);
    };
  }, [title, description, ogTitle, ogDescription]);
}
