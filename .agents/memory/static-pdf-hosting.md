---
name: Static PDF hosting via Vite public dir
description: When Supabase storage upload from shell is blocked by RLS and no service role key exists for the correct project, host PDFs in the Vite public/ directory instead.
---

# Static PDF hosting fallback

## The rule
When a PDF or large static asset needs to be served from the ISL web app and Supabase storage upload from the shell is not available, copy the file to `artifacts/insight-strategy-lab/public/pdfs/` and write the content_block URL as `/pdfs/<filename>` via psql.

**Why:** The Supabase anon key blocks storage uploads via RLS. The service role key in env (`SUPABASE_SERVICE_ROLE_KEY`) is for project `nayerqaszbyqhaokebxj`, NOT the app's project `uojvfdivwhcisbdaojrd`. No service key for the correct project is available in env. Vite's `public/` directory is served as-is in dev and bundled into `dist/public/` at build time — files there are reachable at `/<path>` without any additional routing.

**How to apply:**
1. Copy file: `cp <source> artifacts/insight-strategy-lab/public/pdfs/<name>.pdf`
2. Verify Vite serves it: `curl -s -o /dev/null -w "%{http_code}" http://localhost:<PORT>/pdfs/<name>.pdf` → expect 200
3. Write URL to DB: use the psql + Node.js pattern from `supabase-rls-and-env.md` — INSERT INTO content_blocks (page, key, value) VALUES (..., '/pdfs/<name>.pdf') ON CONFLICT DO UPDATE
4. On deploy: the file is included in the static bundle automatically — no extra step needed.

**Limit:** Only suitable for files the user can also upload via the admin CMS later (Supabase storage upload works fine from the browser with an authenticated admin session).
