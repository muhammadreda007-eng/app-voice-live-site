-- Supabase Storage setup and RLS policies
-- شغل هذا الملف بعد schema.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-media', 'public-media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'video/mp4']),
  ('news-images', 'news-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/avif']),
  ('app-screenshots', 'app-screenshots', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/avif']),
  ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_read_public_buckets" on storage.objects;
create policy "public_read_public_buckets"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('public-media', 'news-images', 'app-screenshots', 'avatars'));

drop policy if exists "admin_insert_storage_objects" on storage.objects;
create policy "admin_insert_storage_objects"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('public-media', 'news-images', 'app-screenshots', 'avatars')
  and public.is_admin()
  and lower(name) !~ '\.(exe|bat|cmd|sh|php|js|html|svg)$'
);

drop policy if exists "admin_update_storage_objects" on storage.objects;
create policy "admin_update_storage_objects"
on storage.objects for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_delete_storage_objects" on storage.objects;
create policy "admin_delete_storage_objects"
on storage.objects for delete
to authenticated
using (public.is_admin());
