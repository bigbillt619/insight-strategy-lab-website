# Insight Strategy Lab

Mobile-first marketing site and lead-gen funnel for Insight Strategy Lab (Bill Tamayo) — a consultancy that builds custom CRMs, automations, dashboards, and AI systems for small businesses. Visitors take a diagnostic that produces a tailored recommendation and prefills an intake; an owner-only admin dashboard manages leads, apps, and reviews.

## Run & Operate

- `pnpm --filter @workspace/insight-strategy-lab run dev` — run the web app (Vite, binds to `PORT`)
- `pnpm --filter @workspace/insight-strategy-lab run typecheck` — typecheck the web app
- `pnpm --filter @workspace/insight-strategy-lab run build` — production build
- Required env (secrets): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (browser client); `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, `SUPABASE_POOLER_URL` (server/admin/DB only — never shipped to the browser); `ADMIN_EMAIL`, `ADMIN_PASSWORD` (seeded owner login)

## Stack

- React 19 + Vite 7, TypeScript, Tailwind v4, wouter (routing), @tanstack/react-query
- Backend: Supabase (Postgres + RLS + Auth) accessed directly from the browser via `@supabase/supabase-js` — no custom API layer for this artifact
- UI: shadcn-style components under `src/components/ui`

## Where things live

- App + routing: `artifacts/insight-strategy-lab/src/App.tsx`, entry `src/main.tsx`
- Supabase client (single shared instance): `src/lib/supabase.ts`; DB types: `src/lib/types.ts`
- Feature data hooks: `src/features/{leads,diagnostic,apps,reviews,auth}/api.ts`
- Diagnostic questions + scoring: `src/features/diagnostic/questions.ts` + `computeRecommendation` in `src/features/diagnostic/api.ts`
- Public pages: `src/pages/public/*`; admin pages: `src/pages/admin/*`; layouts: `src/components/layout/*`
- DB schema source of truth: `artifacts/insight-strategy-lab/supabase/schema.sql` (6 tables: leads, lead_events, diagnostic_results, recommendation_map, apps, reviews)

## Architecture decisions

- Browser talks to Supabase directly; security is enforced by RLS, not a backend. Anon visitors can INSERT leads/diagnostic_results and SELECT only published apps/reviews + recommendation_map; reading leads requires an authenticated (owner) session.
- Public writes use client-generated `crypto.randomUUID()` and omit `.select()` so inserts never require an anon SELECT policy.
- Admin is gated solely by the presence of a valid Supabase auth session (no email allowlist). The owner account is seeded via the service-role Admin API.
- Routing: the public branch is a no-path catch-all `<Route>` wrapping `PublicLayout` — a wouter `/:rest*` wildcard does NOT match the bare root `/`, which previously produced a blank home page.

## Product

- Five public pages: Home, Apps in Production (data-driven gallery), Services & Pricing, About, Contact.
- Diagnostic funnel: radio wizard → computed recommendation from `recommendation_map` → prefilled intake that creates a lead + diagnostic_results row → confirmation.
- Owner "Command Center" dashboard: leads pipeline, apps management, reviews.

## User preferences

- NO emojis in the UI.
- Site must stay portable (no Replit lock-in); the user manages DNS for insightstrategylab.com.
- Do not fabricate testimonials/reviews — reviews are only shown when real ones exist.

## Gotchas

- `VITE_SUPABASE_*` values are inlined at Vite server start. After changing them, fully restart the web workflow — HMR will NOT swap the already-instantiated supabase client, and a stale in-memory client (e.g. pointing at an old project URL) surfaces as "Invalid API key" or 401 in the browser even though curl against the server works.
- A stale/expired auth session in a browser makes the shared client send a bad token and can 401 public reads too; a fresh visitor (no session) uses the anon key and works.
- Admin access is scoped to the `app_admins` allowlist via the SECURITY DEFINER `is_admin()` function — NOT to "any authenticated user". This matters because public signups are enabled on the Supabase project (`disable_signup:false`) and can't be toggled without the Management API/dashboard. Never write admin RLS as `to authenticated using(true)`.
- `SUPABASE_DB_URL` / `SUPABASE_POOLER_URL` secrets currently hold placeholder/invalid passwords, so DDL via psql fails. Apply schema/RLS migrations (`supabase/migrations/*.sql`, e.g. `0001_owner_scoped_rls.sql`) through the Supabase SQL editor, or fix the DB connection secret first.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
