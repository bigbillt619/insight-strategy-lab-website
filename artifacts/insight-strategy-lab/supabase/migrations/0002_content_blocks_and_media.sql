-- Content management: editable site content + media storage.
-- content_blocks stores OVERRIDES only; in-code defaults render when a key is
-- absent, so the public site works with an empty table. Public reads all blocks;
-- only owners (is_admin()) may write.

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  key text not null,
  label text not null default '',
  type text not null default 'text',
  value text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  unique (page, key)
);

alter table public.content_blocks enable row level security;

drop policy if exists content_blocks_public_read on public.content_blocks;
create policy content_blocks_public_read on public.content_blocks
  for select to anon, authenticated using (true);

drop policy if exists content_blocks_admin_all on public.content_blocks;
create policy content_blocks_admin_all on public.content_blocks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Media bucket: public read so the live site can display uploads; owner-only write.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists media_admin_insert on storage.objects;
create policy media_admin_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
