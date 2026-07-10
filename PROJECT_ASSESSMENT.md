# Insight Strategy Lab — Project Assessment & Migration Diagnostic

Prepared for handoff/review by another AI or developer. Purpose: give full context on architecture, current state, known issues, and what to check before/while migrating off the current build environment.

---

## 1. What This Project Is

Marketing and lead-generation website for Insight Strategy Lab (AI systems for small businesses), live at **insightstrategylab.com**. Mobile-first single-page app with a full content-management system so the non-technical owner can edit nearly everything from a password-protected admin dashboard.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, TypeScript |
| Routing | Wouter (NOT React Router — smaller, hook-based API) |
| Styling | Tailwind CSS |
| Data fetching | TanStack React Query |
| Backend/DB | Supabase (Postgres + Auth + Storage), accessed **directly from the browser** via `@supabase/supabase-js` — no custom backend for reads/writes to content |
| Small API server | Express (Node), used only for: health check, sending lead-notification emails via SendGrid |
| Auth | Supabase Auth (email/password), single owner account gated by an `is_admin()` Postgres function + `app_admins` allowlist table |
| Analytics | Google Analytics 4 (gtag.js), measurement ID `G-Z19T054XE0` |
| Email | SendGrid (transactional lead notifications) |

**No custom backend framework, ORM, or server-rendering** — this is a client-only SPA that talks to Supabase directly using Row Level Security (RLS) for authorization. This is the single most important architectural fact for any migration: **security is enforced in Postgres RLS policies, not in application code.**

---

## 3. Repository Structure

```
artifacts/
  insight-strategy-lab/       # Main web app (Vite React SPA)
    public/                   # sitemap.xml, robots.txt, favicon, static assets
    src/
      features/
        content/               # CMS core: schema.ts (defaults), api.ts (useContent hook), BrandStyle.tsx
        auth/                  # useSession, useIsAdmin, signIn/signOut
      pages/
        public/                 # Home, Services, About, Contact, Diagnostic, Apps, VehicleQrLanding
        admin/                  # Login, ResetPassword, Dashboard, PageContentManager, SiteSettingsManager,
                                 # LeadManager, AppManager, RecommendationManager, ContentGroupForm
      components/
        layout/                 # Navbar, Footer, PublicLayout, AdminLayout
        ui/                     # shared UI primitives (shadcn-style)
      lib/
        supabase.ts             # Supabase client init
        usePageMeta.ts           # per-page <title>/meta tag hook, reads SEO fields from CMS
    supabase/
      migrations/               # 0001_owner_scoped_rls.sql, 0002_content_blocks_and_media.sql,
                                 # 0003_apps_problem_solved.sql
      schema.sql                # full current schema snapshot
  api-server/                  # Express server: /healthz, /notifications/lead (SendGrid)
  mockup-sandbox/              # Design/prototyping sandbox, not part of production app
```

---

## 4. Database Schema (Supabase Postgres)

Tables (see `artifacts/insight-strategy-lab/supabase/schema.sql` for authoritative DDL):

- `content_blocks` — CMS overrides. Columns: `id, page, key, label, type, value, sort_order, updated_at`. Unique on `(page, key)`. Public read; write requires `is_admin()`.
- `app_admins` — allowlist of admin user IDs/emails backing `is_admin()`.
- `leads` — diagnostic/contact form submissions.
- `lead_events` — event log tied to leads (e.g., source tracking — vehicle QR vs. organic).
- `diagnostic_results` — stored results from the diagnostic tool.
- `recommendation_map` — config table driving the diagnostic tool's recommendation logic.
- `apps` — "Apps in Production" showcase entries.
- `reviews` — client testimonials/reviews.

**Storage:** a `media` Supabase Storage bucket (public read, admin write) holds uploaded images/videos referenced by URL in `content_blocks.value`.

**RLS pattern:** every table scopes writes through the `is_admin()` SECURITY DEFINER function, which checks the `app_admins` table — not just "is there a logged-in session." A valid Supabase session alone is not sufficient for admin access anywhere in this schema.

---

## 5. Content Management System (Core Architecture)

This is the most distinctive part of the app and the piece most likely to need careful re-implementation on another stack:

- **`schema.ts`** is the single source of truth for every editable field across the whole site: field key, label, input type (`text`, `textarea`, `list`, `url`, `image`, `video`, `color`, `number`), grouped by page (`global`, `home`, `services`, `about`, `contact`, `diagnostic`, `apps`, `vehicle_qr`).
- **`useContent(page)`** hook fetches all rows from `content_blocks` once (React Query, 30s stale time), merges them over the in-code defaults from `schema.ts`, and returns a `get(key, fallback)` accessor.
- **Important nuance:** an override row with an *empty* value still counts as "set" — this lets the owner intentionally clear a field rather than always falling back to the default.
- Admin editors (`PageContentManager.tsx`, `SiteSettingsManager.tsx`) render forms driven entirely by `schema.ts`'s field type, and upsert to `content_blocks` on save.
- **Known UX issue (unresolved):** because content loads asynchronously after the schema defaults render first, users briefly see default placeholder copy before the real Supabase-backed content swaps in on every fresh page load. This was diagnosed but not yet fixed — see Section 7.

---

## 6. Public Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Home |
| `/services` | Services & Pricing |
| `/apps` | Apps in Production |
| `/about` | About |
| `/contact` | Contact form |
| `/diagnostic` | Lead-gen diagnostic tool |
| `/vehicle-qr-code-1` | Hidden standalone landing page for vehicle signage QR code (no navbar/footer), tracked via `sessionStorage` lead-source tagging |
| `/admin/login` | Admin sign-in |
| `/admin/reset-password` | Password reset (Supabase Auth recovery flow) |
| `/admin` (nested) | Dashboard: Page Content, Site Settings, Leads Pipeline, Apps Manager, Recommendation Map |

Navbar order (as currently configured): Home → Services & Pricing → Apps in Production → About → Contact.

---

## 7. Known Issues / Open Items (as of this handoff)

1. **Content flash on load** — public pages render in-code defaults first, then swap to real CMS content once Supabase responds. Diagnosed; fix proposed (cache-then-network via React Query persistence) but **not yet implemented**. A full SSR/static-generation rewrite was scoped as an alternative but assessed as multi-day, high-risk, and not recommended for this site's size.
2. **GitHub sync** — the GitHub repo (`bigbillt619/insight-strategy-lab-website`) was disconnected/stale for most of the project's life; it has now been force-pushed with full history, but going forward pushes must be done manually via the Shell (`git push github main`) unless the Replit-GitHub UI connection is set up for auto-push.
3. **Supabase Auth Site URL** — was defaulted to `localhost:3000`, causing password-recovery emails to redirect to a dead localhost link in production. This was corrected in the Supabase dashboard (Authentication → URL Configuration) to point to `https://insightstrategylab.com`, and a proper in-app `/admin/reset-password` page + "Forgot password?" flow was added (previously did not exist at all — recovery links had nowhere to land).
4. **Sitemap/robots deployment gotcha** — `public/sitemap.xml` and `public/robots.txt` are correct in source, but a stale production build once caused Google Search Console to see the sitemap served as HTML (SPA fallback) instead of raw XML. Root cause: the deployed build predated the files being added. Fix was simply republishing to pick up a fresh build — **any future SEO-file changes require a republish to take effect**, they are not hot-reloaded in production.
5. **Google Analytics** added recently (`G-Z19T054XE0`); page views are tracked via a `GaTracker` component listening to Wouter's `useLocation()` so SPA route changes count as page views (GA's default snippet alone only tracks hard loads). No conversion/event tracking (e.g., lead form submits) is wired up yet.

---

## 8. Environment Variables / Secrets Required

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY     (server-side only — never expose to client)
SUPABASE_DB_URL
SUPABASE_POOLER_URL
SENDGRID_API_KEY
SENDGRID_FROM_EMAIL
ADMIN_EMAIL
ADMIN_PASSWORD
```

Note: `SUPABASE_DB_URL` historically broke when the DB password contained special characters — needs URL-encoding if regenerated.

---

## 9. Portability Notes for Migration

- **No Replit-specific runtime dependencies in application logic** — the project was deliberately built to avoid platform lock-in. Replit-specific pieces are limited to: Vite plugins (`@replit/vite-plugin-*`, dev-only, safe to strip), the `.replit`/workflow config, and the deployment/publish mechanism.
- **Supabase is the portable backbone** — DB, auth, and storage all live in Supabase, independent of Replit. Migrating hosting does NOT require migrating data; only the frontend build/deploy pipeline and the small Express API server need a new home.
- **RLS is the real security boundary.** Any migration must preserve or faithfully port the `is_admin()` function and `app_admins`-gated policies — do not assume any server-side authorization exists elsewhere, because it doesn't.
- **Build outputs to `dist/public`** via Vite; this is a static bundle plus the Express API server needs separate hosting (or could be merged into a single Node server if migrating away from Replit's multi-artifact model).
- **DNS/domain**: production domain `insightstrategylab.com` — check current DNS provider and SSL setup before cutover.

---

## 10. Recommended Next Steps for Reviewing AI

1. Confirm whether the target platform can host: a static Vite build + a small Node/Express API + persistent connection to an external Supabase project. If yes, migration is mostly a lift-and-shift of `artifacts/insight-strategy-lab` and `artifacts/api-server`.
2. Decide whether to fix the content-flash issue (Section 7.1) before or after migration — it's independent of hosting platform.
3. Re-verify Supabase Auth Site URL / Redirect URLs after any domain change.
4. Re-submit `sitemap.xml` in Google Search Console after migration and confirm it serves raw XML (not HTML) on the new host.
5. Re-test the admin password reset flow end-to-end on the new domain (redirect URL is domain-dependent).
