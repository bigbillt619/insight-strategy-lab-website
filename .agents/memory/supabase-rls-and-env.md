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
`SUPABASE_DB_URL` is the working transaction-pooler connection
(`postgres.<ref>@aws-1-us-west-1.pooler.supabase.com:5432/postgres`), but its
password contains special characters that break libpq's URI parser (psql reports
a bogus host like `789!@aws-...`). To run DDL: parse the URL in Node
(`new URL(...)`, `decodeURIComponent(password)`) and either use the `pg` driver
with explicit `{host,user,password,port,database,ssl}` OR shell out to `psql -h
-U -p -d` with `PGPASSWORD`/`PGSSLMODE=require`. Never feed the raw URI to psql.
Note: `pg` is NOT installed in the code_execution sandbox, and that sandbox has no
`process.env` — run such scripts via bash `node`, not code_execution.

# Vite env is baked at server start
`VITE_SUPABASE_*` are inlined when the Vite server boots; HMR does NOT replace the
already-instantiated `supabase` client. After changing those env values you must
fully restart the web workflow — otherwise a stale in-memory client (e.g. old
project URL) surfaces as "Invalid API key" / 401 in the browser even though curl
against the server works fine.
