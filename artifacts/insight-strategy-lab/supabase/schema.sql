-- Insight Strategy Lab — schema, RLS, and seed data
-- Idempotent: safe to re-run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  business_type text,
  company_size text,
  biggest_bottleneck text,
  current_tools text,
  revenue_range text,
  message text,
  source text not null default 'contact_direct',
  status text not null default 'New' check (status in ('New','Contacted','Qualified','Closed')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  event_type text not null check (event_type in ('created','status_changed','note_added')),
  from_status text,
  to_status text,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists lead_events_lead_id_idx on public.lead_events(lead_id);

create table if not exists public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  answers jsonb not null default '{}'::jsonb,
  recommended_systems jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.recommendation_map (
  id uuid primary key default gen_random_uuid(),
  trigger_type text not null,
  trigger_value text not null,
  recommended_systems text[] not null default '{}',
  rationale text,
  priority int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  youtube_url text,
  thumbnail_url text,
  category text,
  use_case text,
  results_summary text,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null default 5 check (rating between 1 and 5),
  text text not null,
  source text not null default 'Google',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Owner allowlist. Membership here (not merely "is logged in") is what grants
-- admin access, so the site stays safe even if public signups are enabled.
create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.diagnostic_results enable row level security;
alter table public.recommendation_map enable row level security;
alter table public.apps enable row level security;
alter table public.reviews enable row level security;
alter table public.app_admins enable row level security;
-- app_admins intentionally has NO policies: it is unreadable by anon/authenticated
-- directly. is_admin() is SECURITY DEFINER so it can still check membership.

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

-- Reset policies (idempotent)
drop policy if exists leads_anon_insert on public.leads;
drop policy if exists leads_admin_all on public.leads;
drop policy if exists lead_events_anon_insert on public.lead_events;
drop policy if exists lead_events_admin_all on public.lead_events;
drop policy if exists diag_anon_insert on public.diagnostic_results;
drop policy if exists diag_admin_all on public.diagnostic_results;
drop policy if exists recmap_public_read on public.recommendation_map;
drop policy if exists recmap_admin_all on public.recommendation_map;
drop policy if exists apps_public_read on public.apps;
drop policy if exists apps_admin_all on public.apps;
drop policy if exists reviews_public_read on public.reviews;
drop policy if exists reviews_admin_all on public.reviews;

-- leads: public can submit (no read); only an owner can read/manage
create policy leads_anon_insert on public.leads
  for insert to anon with check (true);
create policy leads_admin_all on public.leads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- lead_events: public can write only the initial 'created' event; owner full
create policy lead_events_anon_insert on public.lead_events
  for insert to anon with check (event_type = 'created');
create policy lead_events_admin_all on public.lead_events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- diagnostic_results: public can submit (no read); owner full
create policy diag_anon_insert on public.diagnostic_results
  for insert to anon with check (true);
create policy diag_admin_all on public.diagnostic_results
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- recommendation_map: public read (drives the diagnostic); owner full
create policy recmap_public_read on public.recommendation_map
  for select to anon, authenticated using (true);
create policy recmap_admin_all on public.recommendation_map
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- apps: public reads published only; owner sees/edits all
create policy apps_public_read on public.apps
  for select to anon, authenticated using (published = true or public.is_admin());
create policy apps_admin_all on public.apps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- reviews: public reads published only; owner sees/edits all
create policy reviews_public_read on public.reviews
  for select to anon, authenticated using (published = true or public.is_admin());
create policy reviews_admin_all on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Seed the site owner into the allowlist (project-specific auth.users id; this
-- is a random uuid, not a secret). Add more ids here to grant other owners.
insert into public.app_admins (user_id) values ('5154898f-69c4-4531-82f7-e063b80876e2')
  on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Seed: recommendation map (aligned to the diagnostic answer values)
-- ---------------------------------------------------------------------------

delete from public.recommendation_map;
insert into public.recommendation_map (trigger_type, trigger_value, recommended_systems, rationale, priority) values
  -- biggest bottleneck (strongest signal)
  ('biggest_bottleneck','manual_scheduling', array['Automated Scheduling System','Custom CRM'], 'Manual scheduling and bookings are a weekly time sink — an automated system books, reminds, and reschedules for you.', 90),
  ('biggest_bottleneck','lead_followup', array['Lead Follow-up Automation','Custom CRM'], 'Leads go cold without consistent follow-up — automated sequences keep every prospect warm.', 90),
  ('biggest_bottleneck','scattered_data', array['Operations Dashboard','ROI & Analytics Dashboard'], 'When your numbers live in five places, a single dashboard turns scattered data into decisions.', 90),
  ('biggest_bottleneck','repetitive_admin', array['Workflow Automation','Custom Internal Tools'], 'Repetitive admin is exactly what automation eliminates, handing your hours back.', 90),
  ('biggest_bottleneck','no_custom_tools', array['Custom Internal Tools','Custom CRM'], 'Off-the-shelf tools force your business into their box — a custom system is built around your workflow.', 90),
  -- business type
  ('business_type','fitness_facility', array['Fitness CRM','Automated Scheduling System'], 'Fitness facilities run on memberships, classes, and bookings — a fitness CRM keeps them all flowing.', 60),
  ('business_type','sports_academy', array['Athlete Management System','Automated Scheduling System'], 'Academies juggle athletes, sessions, and progress — a management system keeps it organized at scale.', 60),
  ('business_type','property_management', array['Property Operations Hub','Operations Dashboard'], 'Property operations span units, tenants, and tasks — one hub keeps every moving part visible.', 60),
  ('business_type','service_business', array['Field Service CRM','Workflow Automation'], 'Service businesses win on responsiveness — a field CRM and automation keep jobs moving.', 60),
  ('business_type','other', array['Custom System Audit'], 'Every business is different — a short audit pinpoints the highest-leverage system to build first.', 40),
  -- current tools
  ('current_tools','spreadsheets', array['Operations Dashboard','Workflow Automation'], 'Spreadsheets break down as you grow — a dashboard and automation pick up where they leave off.', 50),
  ('current_tools','generic_crm', array['Custom CRM'], 'A generic CRM rarely fits your exact process — a custom one is shaped to how you actually work.', 50),
  ('current_tools','pen_paper', array['Custom CRM','Automated Scheduling System'], 'Moving off pen and paper to a simple, tailored system is the fastest win available to you.', 50),
  ('current_tools','disconnected_apps', array['Custom Internal Tools','Workflow Automation'], 'Disconnected apps create double-entry and dropped balls — one connected system removes both.', 50),
  -- company size
  ('company_size','20_plus', array['Operations Dashboard','Custom Internal Tools'], 'At 20+ people, visibility and role-based tools matter most.', 30),
  ('company_size','6_20', array['Operations Dashboard'], 'A growing team needs shared visibility into the numbers that matter.', 30),
  ('company_size','2_5', array['Workflow Automation'], 'A small team gets the biggest lift from removing repetitive work.', 20),
  ('company_size','solo', array['Workflow Automation'], 'Solo operators win back the most time by automating the busywork.', 20);

-- ---------------------------------------------------------------------------
-- Seed: apps in production (Bill's real projects; videos/thumbnails added later)
-- ---------------------------------------------------------------------------

delete from public.apps;
insert into public.apps (title, description, category, use_case, results_summary, sort_order, published) values
  ('Baseball Trainer Facility Operations',
   'A custom operations system for a baseball training facility — scheduling, athlete tracking, and day-to-day facility management in one place.',
   'Sports Academy',
   'Replace scattered spreadsheets and texts with a single hub for sessions, athletes, and staff.',
   'Centralized facility operations and freed up coaching time for training instead of admin.',
   1, true),
  ('Landscaper Hub',
   'An operations hub for a landscaping business covering job intake, scheduling, and crew coordination.',
   'Service Business',
   'Route incoming jobs, schedule crews, and keep field work organized end to end.',
   'Smoother job flow from intake to completion with less back-and-forth.',
   2, true),
  ('Trainer Hub — Fitness CRM',
   'A purpose-built fitness CRM for trainers and studios to manage clients, sessions, and follow-ups.',
   'Fitness',
   'Manage memberships, schedule sessions, and keep client relationships warm.',
   'Kept client communication consistent and bookings organized in one system.',
   3, true),
  ('Delivery ROI Analysis',
   'A data dashboard that turns delivery operations data into clear ROI and performance insights.',
   'Analytics',
   'See cost, performance, and ROI across delivery operations at a glance.',
   'Turned raw delivery data into decisions leadership could act on.',
   4, true),
  ('Building Hub',
   'A property and building operations system for tracking units, tasks, and ongoing maintenance.',
   'Property Management',
   'Keep units, tasks, and maintenance visible and on schedule.',
   'Gave property operations a single source of truth for every unit and task.',
   5, true),
  ('Smoot Hoops Academy',
   'A custom management system for a basketball academy handling athletes, scheduling, and program operations.',
   'Sports Academy',
   'Organize athletes, sessions, and programs without the spreadsheet sprawl.',
   'Streamlined academy operations so coaches could focus on player development.',
   6, true);
