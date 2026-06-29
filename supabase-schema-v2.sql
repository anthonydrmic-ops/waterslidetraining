-- SlideSure Schema v2 - Run AFTER the initial schema
-- Adds: certificate verification
--
-- NOTE: a server-side quiz_questions pool table used to live here. It was
-- removed because quizzes are graded client-side from src/data/training-modules.ts
-- (the /api/quiz route that read this table was never wired into the UI). If an
-- older v2 already created the table in your Supabase project, it is inert
-- (RLS denies all client access) and can be dropped with:
--   drop table if exists quiz_questions;

-- Certificate verification
alter table user_progress add column if not exists cert_id text unique;

-- Certificates table for public verification
create table certificates (
  id text primary key, -- short unique ID like 'SS-A7K9X2'
  user_id uuid references users(id) on delete cascade,
  user_name text not null,
  course_id text not null default 'waterslide-safety',
  score int,
  total int,
  issued_at timestamptz default now(),
  verified boolean default true
);

create index idx_certs_user on certificates(user_id);

-- Public read access for certificate verification
alter table certificates enable row level security;
create policy "Anyone can verify certificates" on certificates
  for select using (true);
