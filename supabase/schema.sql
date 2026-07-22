-- APP_NAME Supabase schema
-- شغل هذا الملف داخل Supabase SQL Editor بعد إنشاء المشروع.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('owner', 'admin', 'editor', 'support')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.is_active = true
  );
$$;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  phone text check (phone is null or char_length(trim(phone)) between 7 and 30),
  platform text not null check (platform in ('android', 'ios')),
  consent boolean not null check (consent = true),
  status text not null default 'new' check (status in ('new', 'contacted', 'invited', 'closed')),
  created_at timestamptz not null default now(),
  unique (email)
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  phone text check (phone is null or char_length(trim(phone)) between 7 and 30),
  subject text not null check (char_length(trim(subject)) between 3 and 160),
  message text not null check (char_length(trim(message)) between 10 and 3000),
  status text not null default 'new' check (status in ('new', 'read', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  category text not null check (category in ('account', 'safety', 'billing', 'other')),
  subject text not null check (char_length(trim(subject)) between 3 and 160),
  message text not null check (char_length(trim(message)) between 10 and 3000),
  status text not null default 'new' check (status in ('new', 'read', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  username_or_email text not null check (char_length(trim(username_or_email)) between 3 and 160),
  contact_email text not null check (contact_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  reason text check (reason is null or char_length(trim(reason)) <= 1200),
  confirmation boolean not null check (confirmation = true),
  status text not null default 'new' check (status in ('new', 'read', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  slug text not null unique,
  excerpt_ar text,
  excerpt_en text,
  content_ar text,
  content_en text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.room_packages (
  id uuid primary key default gen_random_uuid(),
  package_name_ar text not null,
  package_name_en text not null,
  package_type text not null unique check (package_type in ('standard', 'premium', 'vip')),
  coins integer not null check (coins >= 0),
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'EGP',
  duration_days integer not null check (duration_days > 0),
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique check (platform in ('google_play', 'app_store', 'huawei', 'facebook', 'instagram', 'tiktok', 'youtube')),
  url text not null default '',
  is_active boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question_ar text not null,
  question_en text not null,
  answer_ar text not null,
  answer_en text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  media_type text not null check (media_type in ('logo', 'favicon', 'app_icon', 'screenshot', 'mockup', 'room', 'live', 'video', 'news_cover')),
  file_url text not null,
  alt_text text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_waitlist_created_at on public.waitlist (created_at desc);
create index if not exists idx_waitlist_status on public.waitlist (status);
create index if not exists idx_contact_status_created on public.contact_messages (status, created_at desc);
create index if not exists idx_support_status_created on public.support_requests (status, created_at desc);
create index if not exists idx_delete_status_created on public.account_deletion_requests (status, created_at desc);
create index if not exists idx_news_status_published on public.news (status, published_at desc);
create index if not exists idx_room_packages_active_order on public.room_packages (is_active, sort_order);
create index if not exists idx_faqs_active_order on public.faqs (is_active, sort_order);
create index if not exists idx_media_active_type on public.media (is_active, media_type);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_news_updated_at on public.news;
create trigger set_news_updated_at before update on public.news for each row execute function public.set_updated_at();
drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
drop trigger if exists set_room_packages_updated_at on public.room_packages;
create trigger set_room_packages_updated_at before update on public.room_packages for each row execute function public.set_updated_at();
drop trigger if exists set_app_links_updated_at on public.app_links;
create trigger set_app_links_updated_at before update on public.app_links for each row execute function public.set_updated_at();
drop trigger if exists set_faqs_updated_at on public.faqs;
create trigger set_faqs_updated_at before update on public.faqs for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.waitlist enable row level security;
alter table public.contact_messages enable row level security;
alter table public.support_requests enable row level security;
alter table public.account_deletion_requests enable row level security;
alter table public.news enable row level security;
alter table public.site_settings enable row level security;
alter table public.room_packages enable row level security;
alter table public.app_links enable row level security;
alter table public.faqs enable row level security;
alter table public.media enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

drop policy if exists "admin_users_select_self_or_admin" on public.admin_users;
create policy "admin_users_select_self_or_admin" on public.admin_users for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admin_users_admin_manage" on public.admin_users;
create policy "admin_users_admin_manage" on public.admin_users for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "waitlist_public_insert" on public.waitlist;
create policy "waitlist_public_insert" on public.waitlist for insert to anon, authenticated with check (consent = true);
drop policy if exists "waitlist_admin_manage" on public.waitlist;
create policy "waitlist_admin_manage" on public.waitlist for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contact_public_insert" on public.contact_messages;
create policy "contact_public_insert" on public.contact_messages for insert to anon, authenticated with check (true);
drop policy if exists "contact_admin_manage" on public.contact_messages;
create policy "contact_admin_manage" on public.contact_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "support_public_insert" on public.support_requests;
create policy "support_public_insert" on public.support_requests for insert to anon, authenticated with check (true);
drop policy if exists "support_admin_manage" on public.support_requests;
create policy "support_admin_manage" on public.support_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "delete_public_insert" on public.account_deletion_requests;
create policy "delete_public_insert" on public.account_deletion_requests for insert to anon, authenticated with check (confirmation = true);
drop policy if exists "delete_admin_manage" on public.account_deletion_requests;
create policy "delete_admin_manage" on public.account_deletion_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "news_public_select_published" on public.news;
create policy "news_public_select_published" on public.news for select to anon, authenticated using (status = 'published' and published_at is not null);
drop policy if exists "news_admin_manage" on public.news;
create policy "news_admin_manage" on public.news for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings_public_select" on public.site_settings;
create policy "settings_public_select" on public.site_settings for select to anon, authenticated using (is_public = true);
drop policy if exists "settings_admin_manage" on public.site_settings;
create policy "settings_admin_manage" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "packages_public_select_active" on public.room_packages;
create policy "packages_public_select_active" on public.room_packages for select to anon, authenticated using (is_active = true);
drop policy if exists "packages_admin_manage" on public.room_packages;
create policy "packages_admin_manage" on public.room_packages for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "app_links_public_select_active" on public.app_links;
create policy "app_links_public_select_active" on public.app_links for select to anon, authenticated using (is_active = true);
drop policy if exists "app_links_admin_manage" on public.app_links;
create policy "app_links_admin_manage" on public.app_links for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "faqs_public_select_active" on public.faqs;
create policy "faqs_public_select_active" on public.faqs for select to anon, authenticated using (is_active = true);
drop policy if exists "faqs_admin_manage" on public.faqs;
create policy "faqs_admin_manage" on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "media_public_select_active" on public.media;
create policy "media_public_select_active" on public.media for select to anon, authenticated using (is_active = true);
drop policy if exists "media_admin_manage" on public.media;
create policy "media_admin_manage" on public.media for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();
