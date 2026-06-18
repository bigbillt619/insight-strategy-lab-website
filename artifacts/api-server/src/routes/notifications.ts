import { Router, type IRouter } from "express";
import sgMail from "@sendgrid/mail";
import { logger } from "../lib/logger";

const router: IRouter = Router();

type LeadField = { label: string; value: unknown };

function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SOURCE_LABELS: Record<string, string> = {
  diagnostic: "System Diagnostic",
  contact_direct: "Contact form",
};

/**
 * Public endpoint: notify the site owner by email when a visitor submits a
 * lead (from either the contact form or the diagnostic funnel). The lead has
 * already been persisted to Supabase by the browser; this is a best-effort
 * side-channel, so a failure here must never break the visitor's submission.
 */
router.post("/notifications/lead", async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const name = asText(body.name);
  const email = asText(body.email);

  // Minimal guard: a real submission always carries a name and an email.
  if (!name || !email || name.length > 200 || email.length > 320) {
    res.status(400).json({ ok: false, error: "Invalid lead payload" });
    return;
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
  const from = process.env.SENDGRID_FROM_EMAIL || to;

  if (!apiKey || !to || !from) {
    logger.warn(
      { hasApiKey: !!apiKey, hasTo: !!to, hasFrom: !!from },
      "Lead notification skipped: SendGrid is not fully configured",
    );
    // Report success to the caller so the browser does not surface an error;
    // the missing configuration is an operator concern, visible in the logs.
    res.json({ ok: true, sent: false, reason: "not_configured" });
    return;
  }

  const sourceRaw = asText(body.source);
  const sourceLabel = SOURCE_LABELS[sourceRaw] ?? "Website form";

  const fields: LeadField[] = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Phone", value: body.phone },
    { label: "Business type", value: body.business_type },
    { label: "Company size", value: body.company_size },
    { label: "Biggest bottleneck", value: body.biggest_bottleneck },
    { label: "Current tools", value: body.current_tools },
    { label: "Revenue range", value: body.revenue_range },
    { label: "Message", value: body.message },
  ].filter((f) => asText(f.value).length > 0);

  const rows = fields
    .map(
      (f) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#0f172a;vertical-align:top">${escapeHtml(
          f.label,
        )}</td><td style="padding:6px 12px;color:#334155">${escapeHtml(
          asText(f.value),
        ).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#0f172a;margin-bottom:4px">New lead from your website</h2>
      <p style="color:#64748b;margin-top:0">Source: ${escapeHtml(sourceLabel)}</p>
      <table style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0;border-radius:8px">${rows}</table>
    </div>`;

  const text = fields
    .map((f) => `${f.label}: ${asText(f.value)}`)
    .join("\n");

  try {
    sgMail.setApiKey(apiKey);
    await sgMail.send({
      to,
      from,
      replyTo: email,
      subject: `New ${sourceLabel} lead: ${name}`,
      text,
      html,
    });
    res.json({ ok: true, sent: true });
  } catch (err) {
    logger.error({ err }, "Failed to send lead notification email");
    // Best-effort: the lead is already saved, so do not fail the visitor flow.
    res.status(502).json({ ok: false, sent: false, error: "send_failed" });
  }
});

export default router;
