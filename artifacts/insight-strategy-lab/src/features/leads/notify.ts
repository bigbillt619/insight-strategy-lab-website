import type { Lead } from "@/lib/types";

/**
 * Best-effort: ask the API server to email the site owner about a new lead.
 * The lead is already saved in Supabase by the time this runs, so any failure
 * here is swallowed and only logged — it must never break the visitor's
 * submission. The API server is served at `/api` on the same origin (in both
 * dev and production), and BASE_URL already includes a trailing slash.
 */
export async function notifyNewLead(lead: Lead): Promise<void> {
  try {
    const base = import.meta.env.BASE_URL ?? "/";
    await fetch(`${base}api/notifications/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        business_type: lead.business_type,
        company_size: lead.company_size,
        biggest_bottleneck: lead.biggest_bottleneck,
        current_tools: lead.current_tools,
        revenue_range: lead.revenue_range,
        message: lead.message,
        source: lead.source,
      }),
    });
  } catch (err) {
    console.error("Lead notification email request failed:", err);
  }
}
