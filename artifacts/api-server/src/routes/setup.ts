import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * ONE-TIME admin user bootstrap.
 * Creates the Supabase auth user and adds them to app_admins,
 * then sends a password-reset email so the owner can set their password.
 * DELETE this file once the admin account is working.
 */
router.post("/admin/setup", async (req, res) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({ ok: false, error: "Supabase env vars not configured" });
    return;
  }

  const { email } = (req.body ?? {}) as { email?: string };
  if (!email) {
    res.status(400).json({ ok: false, error: "email required" });
    return;
  }

  const headers = {
    "apikey": serviceKey,
    "Authorization": `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };

  try {
    // 1. Try to create the auth user (email_confirm:true skips the verification step)
    let userId: string | null = null;

    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password: "ChangeMe123!", email_confirm: true }),
    });
    const createData = await createRes.json() as any;

    if (createRes.ok) {
      userId = createData.id;
      logger.info({ userId, email }, "Admin auth user created");
    } else if (createData?.msg?.includes("already been registered") || createData?.code === "email_exists") {
      // User exists — look them up
      const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=1&per_page=200`, { headers });
      const listData = await listRes.json() as any;
      const match = (listData?.users ?? []).find((u: any) => u.email === email);
      userId = match?.id ?? null;
      logger.info({ userId, email }, "Admin auth user already exists");
    } else {
      logger.error({ createData }, "Failed to create auth user");
      res.status(502).json({ ok: false, error: "Failed to create auth user", detail: createData });
      return;
    }

    if (!userId) {
      res.status(500).json({ ok: false, error: "Could not determine user ID" });
      return;
    }

    // 2. Upsert into app_admins
    const adminRes = await fetch(`${supabaseUrl}/rest/v1/app_admins`, {
      method: "POST",
      headers: { ...headers, "Prefer": "resolution=ignore-duplicates" },
      body: JSON.stringify({ user_id: userId }),
    });
    logger.info({ status: adminRes.status }, "app_admins upsert");

    // 3. Send password reset email so the owner can set a real password
    const resetRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}/generate-link`, {
      method: "POST",
      headers,
      body: JSON.stringify({ type: "recovery", email }),
    });
    const resetData = await resetRes.json() as any;
    const resetLink: string = resetData?.properties?.action_link ?? resetData?.action_link ?? "";
    logger.info({ resetLink: !!resetLink }, "Password reset link generated");

    res.json({
      ok: true,
      userId,
      resetLink,
      note: "Visit resetLink in a browser to set your password, then log in at /admin/login",
    });
  } catch (err: any) {
    logger.error({ err }, "Admin setup failed");
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
