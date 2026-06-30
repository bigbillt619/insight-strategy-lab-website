# Insight Strategy Lab Website

Live site: [insightstrategylab.com](https://insightstrategylab.com)

Marketing and lead-generation site for Insight Strategy Lab — AI-powered systems for small businesses. Built as a mobile-first React SPA with a full content management system and admin dashboard.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services overview, featured review |
| `/services` | Services detail |
| `/about` | About the business |
| `/diagnostic` | Lead-gen diagnostic tool |
| `/contact` | Contact form |
| `/apps` | Apps in production showcase |
| `/vehicle-qr-code-1` | Hidden QR landing page (vehicle signage) |
| `/admin` | Owner dashboard (password protected) |

---

## Tech Stack

- **React + Vite** — frontend SPA
- **Wouter** — client-side routing
- **Tailwind CSS** — styling
- **Supabase** — database, auth, and file storage
- **React Query** — data fetching and caching
- **SendGrid** — transactional email (lead notifications)
- **Google Analytics 4** — traffic tracking (G-Z19T054XE0)

---

## Admin Dashboard

Owner logs in at `/admin` and can:

- **Page Content** — edit all copy on every public page
- **Site Settings** — brand colors, logo size, social links, contact info, footer
- **Leads Pipeline** — view and manage diagnostic form submissions
- **Apps Manager** — add / edit / remove app showcase entries
- **Recommendation Map** — configure diagnostic tool logic

All content is stored in Supabase (`content_blocks` table) and merged over in-code defaults. Media (images, videos) upload to Supabase Storage.

---

## Local Development

```bash
# Install dependencies
pnpm install

# Start the frontend
pnpm --filter @workspace/insight-strategy-lab run dev

# Start the API server
pnpm --filter @workspace/api-server run dev
```

Requires a `.env` file (or Replit secrets) with:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

---

## Project Structure

```
artifacts/
  insight-strategy-lab/   # React + Vite frontend
    public/               # Static files (sitemap.xml, robots.txt, favicon)
    src/
      features/content/   # CMS: useContent hook, schema, admin editors
      pages/public/       # Public-facing pages
      pages/admin/        # Dashboard + managers
      components/         # Layout, UI, shared components
  api-server/             # Express API (leads, email, admin auth)
```

---

## Deployment

Hosted on Replit Autoscale. Pushes to `main` do not auto-deploy — publish manually via the Replit Publishing panel.

SEO: sitemap at `/sitemap.xml`, robots at `/robots.txt`.
