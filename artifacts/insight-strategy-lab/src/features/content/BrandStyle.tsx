import { useEffect } from "react";
import { hexToHslTriplet } from "@/lib/color";
import { useContent } from "./api";

/**
 * Reads global brand colors and applies them as CSS variables at runtime, so the
 * owner can recolor the site from the admin dashboard. Empty values keep the
 * theme defaults from index.css.
 */
export default function BrandStyle() {
  const { get } = useContent("global");
  const primary = get("color_primary");
  const accent = get("color_accent");

  useEffect(() => {
    const root = document.documentElement;
    const primaryHsl = primary ? hexToHslTriplet(primary) : null;
    const accentHsl = accent ? hexToHslTriplet(accent) : null;

    if (primaryHsl) root.style.setProperty("--primary", primaryHsl);
    else root.style.removeProperty("--primary");

    if (accentHsl) root.style.setProperty("--accent", accentHsl);
    else root.style.removeProperty("--accent");
  }, [primary, accent]);

  return null;
}
