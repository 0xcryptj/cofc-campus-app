-- ============================================================
-- CofC Campus App — Supabase Schema
-- Paste this entire file into Supabase SQL Editor and Run.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Extensions
-- ────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 1. users
-- ────────────────────────────────────────────────────────────
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  email_verified boolean not null default false,
  role          text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  status        text not null default 'active' check (status in ('active', 'warned', 'suspended', 'banned')),
  created_at    timestamptz not null default now()
);

alter table public.users enable row level security;

-- Users can read their own row; admins can read all (via service role bypass)
create policy "users: read own" on public.users
  for select using (auth.uid() = id);

create policy "users: insert own on signup" on public.users
  for insert with check (auth.uid() = id);

create policy "users: update own" on public.users
  for update using (auth.uid() = id);

-- ────────────────────────────────────────────────────────────
-- 2. user_aliases  (anonymous display names)
-- ────────────────────────────────────────────────────────────
create table if not exists public.user_aliases (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  alias      text not null,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create index on public.user_aliases(user_id);

alter table public.user_aliases enable row level security;

create policy "aliases: read own" on public.user_aliases
  for select using (auth.uid() = user_id);

create policy "aliases: insert own" on public.user_aliases
  for insert with check (auth.uid() = user_id);

create policy "aliases: update own" on public.user_aliases
  for update using (auth.uid() = user_id);

create policy "aliases: delete own" on public.user_aliases
  for delete using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 3. sessions  (device / IP metadata)
-- ────────────────────────────────────────────────────────────
create table if not exists public.sessions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  ip_address    text,
  user_agent    text,
  device_class  text,
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);

create index on public.sessions(user_id);

alter table public.sessions enable row level security;

create policy "sessions: read own" on public.sessions
  for select using (auth.uid() = user_id);

create policy "sessions: insert own" on public.sessions
  for insert with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 4. posts
-- ────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id             uuid primary key default uuid_generate_v4(),
  channel        text not null check (channel in ('general', 'dating', 'lore', 'events')),
  author_user_id uuid not null references public.users(id) on delete set null,
  public_alias   text not null,
  body           text not null,
  image_id       uuid,
  upvote_count   integer not null default 0,
  comment_count  integer not null default 0,
  visibility     text not null default 'public' check (visibility in ('public', 'hidden')),
  status         text not null default 'active' check (status in ('active', 'hidden', 'deleted')),
  reports_count  integer not null default 0,
  created_at     timestamptz not null default now()
);

create index on public.posts(channel, created_at desc);
create index on public.posts(author_user_id);
create index on public.posts(status);

alter table public.posts enable row level security;

-- Anyone authenticated can read active/public posts
create policy "posts: read published" on public.posts
  for select using (
    auth.role() = 'authenticated'
    and status = 'active'
    and visibility = 'public'
  );

create policy "posts: insert authenticated" on public.posts
  for insert with check (auth.role() = 'authenticated' and auth.uid() = author_user_id);

create policy "posts: update own" on public.posts
  for update using (auth.uid() = author_user_id);

-- ────────────────────────────────────────────────────────────
-- 5. comments
-- ────────────────────────────────────────────────────────────
create table if not exists public.comments (
  id             uuid primary key default uuid_generate_v4(),
  post_id        uuid not null references public.posts(id) on delete cascade,
  author_user_id uuid not null references public.users(id) on delete set null,
  public_alias   text not null,
  body           text not null,
  status         text not null default 'active' check (status in ('active', 'hidden', 'deleted')),
  reports_count  integer not null default 0,
  created_at     timestamptz not null default now()
);

create index on public.comments(post_id, created_at asc);
create index on public.comments(author_user_id);

alter table public.comments enable row level security;

create policy "comments: read active" on public.comments
  for select using (auth.role() = 'authenticated' and status = 'active');

create policy "comments: insert authenticated" on public.comments
  for insert with check (auth.role() = 'authenticated' and auth.uid() = author_user_id);

-- ────────────────────────────────────────────────────────────
-- 6. reports
-- ────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id          uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references public.users(id) on delete set null,
  target_type text not null check (target_type in ('post', 'comment', 'user')),
  target_id   uuid not null,
  reason      text not null check (reason in ('spam', 'harassment', 'inappropriate', 'misinformation', 'other')),
  status      text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at  timestamptz not null default now()
);

create index on public.reports(status, created_at desc);
create index on public.reports(reporter_id);

alter table public.reports enable row level security;

create policy "reports: insert authenticated" on public.reports
  for insert with check (auth.role() = 'authenticated' and auth.uid() = reporter_id);

create policy "reports: read own" on public.reports
  for select using (auth.uid() = reporter_id);

-- ────────────────────────────────────────────────────────────
-- 7. blocks
-- ────────────────────────────────────────────────────────────
create table if not exists public.blocks (
  id         uuid primary key default uuid_generate_v4(),
  blocker_id uuid not null references public.users(id) on delete cascade,
  blocked_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id)
);

create index on public.blocks(blocker_id);

alter table public.blocks enable row level security;

create policy "blocks: manage own" on public.blocks
  for all using (auth.uid() = blocker_id);

-- ────────────────────────────────────────────────────────────
-- 8. moderation_actions
-- ────────────────────────────────────────────────────────────
create table if not exists public.moderation_actions (
  id          uuid primary key default uuid_generate_v4(),
  admin_id    uuid not null references public.users(id) on delete set null,
  target_type text not null check (target_type in ('post', 'comment', 'user')),
  target_id   uuid not null,
  action      text not null check (action in ('warn', 'hide', 'delete', 'suspend', 'ban', 'restore')),
  note        text,
  created_at  timestamptz not null default now()
);

create index on public.moderation_actions(admin_id);
create index on public.moderation_actions(target_id);

alter table public.moderation_actions enable row level security;
-- Only readable/writable via service role (admin backend)

-- ────────────────────────────────────────────────────────────
-- 9. media_uploads
-- ────────────────────────────────────────────────────────────
create table if not exists public.media_uploads (
  id           uuid primary key default uuid_generate_v4(),
  uploader_id  uuid not null references public.users(id) on delete set null,
  storage_path text not null,
  mime_type    text not null,
  size_bytes   integer not null,
  created_at   timestamptz not null default now()
);

create index on public.media_uploads(uploader_id);

alter table public.media_uploads enable row level security;

create policy "media: insert own" on public.media_uploads
  for insert with check (auth.role() = 'authenticated' and auth.uid() = uploader_id);

create policy "media: read own" on public.media_uploads
  for select using (auth.uid() = uploader_id);

-- ────────────────────────────────────────────────────────────
-- 10. security_profiles
-- ────────────────────────────────────────────────────────────
create table if not exists public.security_profiles (
  user_id       uuid primary key references public.users(id) on delete cascade,
  last_ip       text,
  last_user_agent text,
  device_class  text,
  coarse_geo    text,
  risk_score    numeric(4,2) not null default 0,
  last_seen_at  timestamptz not null default now()
);

alter table public.security_profiles enable row level security;
-- Only readable/writable via service role (admin backend)

-- ────────────────────────────────────────────────────────────
-- 11. audit_logs
-- ────────────────────────────────────────────────────────────
create table if not exists public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  admin_id    uuid references public.users(id) on delete set null,
  action      text not null,
  target_type text,
  target_id   uuid,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index on public.audit_logs(admin_id);
create index on public.audit_logs(created_at desc);

alter table public.audit_logs enable row level security;
-- Only readable/writable via service role (admin backend)

-- ────────────────────────────────────────────────────────────
-- Trigger: auto-insert user row on auth.users sign-up
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, email_verified)
  values (
    new.id,
    new.email,
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- Trigger: keep post comment_count in sync
-- ────────────────────────────────────────────────────────────
create or replace function public.increment_comment_count()
returns trigger language plpgsql as $$
begin
  update public.posts
  set comment_count = comment_count + 1
  where id = new.post_id;
  return new;
end;
$$;

drop trigger if exists on_comment_insert on public.comments;
create trigger on_comment_insert
  after insert on public.comments
  for each row execute procedure public.increment_comment_count();
