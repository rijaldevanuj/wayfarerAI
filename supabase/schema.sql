create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  destination text not null,
  summary text not null,
  itinerary jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_trips_user_updated_at
  on public.trips (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_trips_updated_at on public.trips;
create trigger set_trips_updated_at
before update on public.trips
for each row
execute function public.set_updated_at();

alter table public.trips enable row level security;

create policy "Users can view their own trips"
on public.trips for select
using (auth.uid() = user_id);

create policy "Users can insert their own trips"
on public.trips for insert
with check (auth.uid() = user_id);

create policy "Users can update their own trips"
on public.trips for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own trips"
on public.trips for delete
using (auth.uid() = user_id);
