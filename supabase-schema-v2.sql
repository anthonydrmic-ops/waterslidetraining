-- SlideSure Schema v2 - Run AFTER the initial schema
-- Adds: quiz question pool, certificate verification

-- Quiz question pool (server-side, never sent to client with answers)
create table quiz_questions (
  id text primary key, -- e.g. 'q1-1-1'
  lesson_id text not null, -- e.g. '1-1'
  module_id text not null, -- e.g. 'system-understanding'
  question text not null,
  options text[] not null,
  correct_index int not null,
  explanation text not null,
  type text not null default 'knowledge', -- knowledge, scenario, defect
  created_at timestamptz default now()
);

create index idx_quiz_lesson on quiz_questions(lesson_id);
create index idx_quiz_module on quiz_questions(module_id);

-- RLS for quiz_questions - no direct client access (service role only)
alter table quiz_questions enable row level security;
-- No policies = no anon/authenticated access. Only service_role can read.

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
