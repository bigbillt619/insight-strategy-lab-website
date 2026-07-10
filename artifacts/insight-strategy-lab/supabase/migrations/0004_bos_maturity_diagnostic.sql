-- Replace the old rule-based recommendation-map diagnostic with the scored
-- 6-pillar Business Operating System (BOS) Maturity Assessment. Pillar
-- questions, scoring, and maturity level bands now live as code constants,
-- so the trigger/value recommendation_map table and its admin manager no
-- longer apply. Idempotent: safe to run more than once.

drop policy if exists recmap_public_read on public.recommendation_map;
drop policy if exists recmap_admin_all on public.recommendation_map;
drop table if exists public.recommendation_map;

-- diagnostic_results now stores a computed BOS assessment (pillar scores,
-- overall score, maturity level, risk areas) instead of a recommended
-- system list.
alter table public.diagnostic_results rename column recommended_systems to assessment;
alter table public.diagnostic_results alter column assessment set default '{}'::jsonb;
