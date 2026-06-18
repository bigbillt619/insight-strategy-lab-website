-- Add a structured "problem solved" field to apps so each production system can
-- be presented as What it does / Problem solved / Outcome on the public page.
-- Idempotent: safe to run more than once.

alter table public.apps add column if not exists problem_solved text;
