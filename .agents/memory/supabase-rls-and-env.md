---
name: Supabase browser-direct RLS + env pitfalls (insight-strategy-lab)
description: Security model and operational quirks for the insight-strategy-lab web app talking straight to Supabase from the browser.
---

# Browser-direct Supabase security model

This artifact has no backend; the browser uses the anon key and security is
RLS-only. **Admin access must be scoped to an explicit owner allowlist
(`app_admins` + SECURITY DEFINER `is_admin()`), never to "any authenticated
user".**

**Why:** Supabase public signups are enabled on this project
(`/auth/v1/settings` -> `disable_signup:false`) and cannot be turned off without
the Management API / dashboard. With blanket `for all to authenticated using(true)`
policies, anyone who self-registers could read/modify every lead. Owner-scoping
closes this regardless of the signup setting.

**How to apply:** Any new admin-readable/writable table needs an
`is_admin()`-gated policy, plus narrow `to anon` insert / published-only select
policies for the public funnel. `app_admins` itself has RLS enabled and NO
policies (only `is_admin()` / service_role can read it).

# Applying DDL
The `SUPABASE_DB_URL` and `SUPABASE_POOLER_URL` secrets contain placeholder /
wrong passwords (DB_URL host is a template `abcd1234`; pooler password is wrong),
so psql DDL fails. Schema/RLS migrations currently have to be run by the user in
the Supabase SQL editor, or after the DB connection secret is fixed.

# Vite env is baked at server start
`VITE_SUPABASE_*` are inlined when the Vite server boots; HMR does NOT replace the
already-instantiated `supabase` client. After changing those env values you must
fully restart the web workflow — otherwise a stale in-memory client (e.g. old
project URL) surfaces as "Invalid API key" / 401 in the browser even though curl
against the server works fine.
