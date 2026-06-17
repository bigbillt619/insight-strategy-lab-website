---
name: Content-override CMS pattern
description: How the owner-editable content store layers DB overrides over in-code defaults, and the empty-value trap.
---

# Content-override CMS (Insight Strategy Lab)

Public copy/media/brand are editable from the admin dashboard via a single
`content_blocks` table (page,key,label,type,value, unique(page,key)). In-code
defaults live in `src/features/content/schema.ts`; the DB stores OVERRIDES only.

## Rules to keep consistent
- **A row means "override", absence means "use the code default".** `useContent`
  must apply a row whenever it exists for (page,key) — *even when value is ""* —
  otherwise the owner cannot intentionally clear a field (social URL, tagline,
  phone, etc.). Filtering out empty values silently reverts clears to defaults.
- **Admin saves overrides only.** Upsert a field when its value differs from the
  code default OR a row already exists. This keeps untouched fields rowless so
  they keep tracking the code default, while preserving edits-back-to-default and
  intentional clears.
- **Defaults must match the exact prior copy** (including punctuation like the `·`
  middot separators in the Home hero) so the live site is unchanged until edited.

**Why:** the whole point is "edit anything, but nothing changes until you do".
Both the empty-value merge and the changed-only save are required for that to hold.

**How to apply:** when adding new editable fields, add them to `schema.ts` with a
default equal to the current hardcoded copy, and read them via `useContent(page).get(key)`.
Brand colors are injected as CSS vars (BrandStyle); empty = theme default. Media
goes to the public Supabase Storage 'media' bucket; store the public URL in value.
