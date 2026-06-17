-- Migration: scope admin access to an explicit owner allowlist.
--
-- Why: public signups are enabled on the Supabase project, and the original
-- admin RLS policies granted full access to ANY authenticated user. That means
-- anyone who signed up could read/modify every lead. This migration replaces
-- those blanket policies with owner-scoped ones backed by an app_admins table.
--
-- Safe to run more than once (idempotent). Run it in the Supabase SQL editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run) or via psql with a
-- valid connection string.

begin;

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.app_admins enable row level security;
-- intentionally no policies: only the SECURITY DEFINER is_admin() helper or
-- service_role may read it.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists leads_admin_all on public.leads;
create policy leads_admin_all on public.leads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists lead_events_admin_all on public.lead_events;
create policy lead_events_admin_all on public.lead_events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists diag_admin_all on public.diagnostic_results;
create policy diag_admin_all on public.diagnostic_results
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists recmap_admin_all on public.recommendation_map;
create policy recmap_admin_all on public.recommendation_map
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists apps_public_read on public.apps;
create policy apps_public_read on public.apps
  for select to anon, authenticated using (published = true or public.is_admin());
drop policy if exists apps_admin_all on public.apps;
create policy apps_admin_all on public.apps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select to anon, authenticated using (published = true or public.is_admin());
drop policy if exists reviews_admin_all on public.reviews;
create policy reviews_admin_all on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Seed the site owner (project-specific auth.users id; a random uuid, not a secret).
insert into public.app_admins (user_id) values ('5154898f-69c4-4531-82f7-e063b80876e2')
  on conflict do nothing;

commit;
