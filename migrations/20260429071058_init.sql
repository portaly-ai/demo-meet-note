-- MeetNote AI · Insforge schema
-- public.profiles：對應到 Insforge auth.users 的 id（由 trigger 自動建立）
create table if not exists public.profiles (
  id text primary key,
  email text,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  monthly_minutes_used int not null default 0,
  monthly_summaries_used int not null default 0,
  usage_period_start timestamptz not null default date_trunc('month', now()),
  subscription_id text,
  current_period_end timestamptz,
  welcomed_at timestamptz default now(),
  activation_email_sent_at timestamptz,
  quota_warning_sent_at timestamptz,
  quota_exceeded_sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- 自動建立 profile 的 trigger（auth.users 是 Insforge 內建）
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id::text, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- public.notes
create table if not exists public.notes (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.profiles(id) on delete cascade,
  title text not null default '未命名會議',
  source text not null check (source in ('audio', 'transcript')),
  audio_path text,
  duration_seconds int default 0,
  transcript text,
  summary jsonb,
  share_token text unique,
  created_at timestamptz not null default now()
);
create index if not exists notes_user_id_created_idx
  on public.notes (user_id, created_at desc);
create index if not exists notes_share_token_idx on public.notes (share_token)
  where share_token is not null;

-- public.webhook_events（payment webhook 冪等用 — 待 provider 串接時使用）
create table if not exists public.webhook_events (
  id text primary key,
  source text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

-- 用量原子增量函數，避免 race
create or replace function public.increment_minutes(p_user text, p_delta int)
returns void language sql as $$
  update public.profiles
     set monthly_minutes_used = monthly_minutes_used + p_delta
   where id = p_user
$$;

create or replace function public.increment_summaries(p_user text)
returns void language sql as $$
  update public.profiles
     set monthly_summaries_used = monthly_summaries_used + 1
   where id = p_user
$$;
