create table workouts (
  id bigint generated always as identity primary key,
  name text not null,
  activity text not null,
  mins integer not null,
  date date not null,
  created_at timestamptz default now()
);

alter table workouts enable row level security;

create policy "Anyone can insert"
  on workouts for insert
  with check (true);

create policy "Anyone can read"
  on workouts for select
  using (true);

create policy "Anyone can delete"
  on workouts for delete
  using (true);
