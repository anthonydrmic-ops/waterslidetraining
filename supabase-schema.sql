-- SlideSure Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Organizations (companies that buy licenses)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  clerk_org_id text unique,
  stripe_customer_id text unique,
  created_at timestamptz default now()
);

-- Licenses (what an org has purchased)
create table licenses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  course_id text not null, -- e.g. 'waterslide-safety'
  total_seats int not null default 1,
  used_seats int not null default 0,
  stripe_subscription_id text,
  status text not null default 'active', -- active, expired, cancelled
  purchased_at timestamptz default now(),
  expires_at timestamptz
);

-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text not null,
  full_name text,
  org_id uuid references organizations(id) on delete set null,
  role text not null default 'member', -- admin, member
  created_at timestamptz default now()
);

-- Course enrollments (links user to a course via license)
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  license_id uuid references licenses(id) on delete cascade,
  course_id text not null,
  status text not null default 'active', -- active, completed
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

-- User progress (replaces localStorage)
create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  completed_lessons text[] default '{}',
  completed_modules text[] default '{}',
  quiz_scores jsonb default '{}',
  current_module text,
  current_lesson text,
  certified boolean default false,
  certification_date timestamptz,
  user_name text,
  updated_at timestamptz default now()
);

-- Indexes
create index idx_users_clerk on users(clerk_user_id);
create index idx_users_org on users(org_id);
create index idx_licenses_org on licenses(org_id);
create index idx_enrollments_user on enrollments(user_id);
create index idx_enrollments_course on enrollments(course_id);

-- Row Level Security
alter table organizations enable row level security;
alter table licenses enable row level security;
alter table users enable row level security;
alter table enrollments enable row level security;
alter table user_progress enable row level security;

-- RLS Policies (service role bypasses these, anon key respects them)
-- Users can read their own data
create policy "Users can read own data" on users
  for select using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can read their own progress
create policy "Users can read own progress" on user_progress
  for select using (user_id in (
    select id from users where clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Users can update their own progress
create policy "Users can update own progress" on user_progress
  for update using (user_id in (
    select id from users where clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));
