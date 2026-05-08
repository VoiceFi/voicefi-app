-- Contacts: each row belongs to exactly one user.
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).

create table public.contacts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 64),
  address     text not null check (address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$'),
  created_at  timestamptz not null default now(),
  unique (user_id, address)
);

create index contacts_user_id_created_at_idx
  on public.contacts (user_id, created_at desc);

-- RLS makes contacts exclusive to the user who created them.
alter table public.contacts enable row level security;

create policy "select own contacts"
  on public.contacts for select
  using (auth.uid() = user_id);

create policy "insert own contacts"
  on public.contacts for insert
  with check (auth.uid() = user_id);

create policy "update own contacts"
  on public.contacts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own contacts"
  on public.contacts for delete
  using (auth.uid() = user_id);
