-- Run this once in your Supabase project's SQL Editor (Database -> SQL Editor)

create table if not exists public.household_members (
  id text primary key,
  household_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  avatar_emoji text not null default '🧭',
  pin text,
  thai_polite_form text not null default 'khrap',
  active_language text not null default 'th',
  learned_phrase_ids jsonb not null default '[]'::jsonb,
  favorite_phrase_ids jsonb not null default '[]'::jsonb,
  saved_custom_phrases jsonb not null default '[]'::jsonb,
  intro_prefs jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.household_members enable row level security;

-- Only the signed-in household account can read/write its own family members
create policy "Household can view own members"
  on public.household_members
  for select
  using (auth.uid() = household_user_id);

create policy "Household can insert own members"
  on public.household_members
  for insert
  with check (auth.uid() = household_user_id);

create policy "Household can update own members"
  on public.household_members
  for update
  using (auth.uid() = household_user_id);

create policy "Household can delete own members"
  on public.household_members
  for delete
  using (auth.uid() = household_user_id);
