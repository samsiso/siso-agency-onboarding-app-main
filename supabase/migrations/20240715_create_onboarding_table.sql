
-- Create a table for storing onboarding data
create table public.onboarding (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  organization text not null,
  app_idea text not null,
  email text,
  social_links jsonb default '{}'::jsonb,
  status text default 'new'
);

-- Set up RLS policies
alter table public.onboarding enable row level security;

-- Allow anon users to insert (needed for the onboarding form)
create policy "Anyone can insert onboarding data"
on public.onboarding for insert
to anon
with check (true);

-- Only allow authenticated users to select their own data
create policy "Users can view their own onboarding data"
on public.onboarding for select
to authenticated
using (auth.uid() = id);

-- Only allow service role to update and delete
create policy "Service role can do everything"
on public.onboarding
to service_role
using (true)
with check (true);
