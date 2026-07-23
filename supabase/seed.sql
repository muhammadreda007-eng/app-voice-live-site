-- بيانات بداية قابلة للتعديل. لا تضيف مستخدم الإدارة هنا قبل إنشائه في Supabase Auth.

insert into public.site_settings (setting_key, setting_value, is_public)
values
  ('app_name', '"SOHBETNA | صٌحبتنا"'::jsonb, true),
  ('app_status', '"soon"'::jsonb, true),
  ('developer_name', '"سـيـزر إيجينسي"'::jsonb, true),
  ('short_description', '"منصة اجتماعية مستقبلية لغرف الصوت والفيديو والبث المباشر."'::jsonb, true),
  ('short_description_ar', '"منصة اجتماعية مستقبلية لغرف الصوت والفيديو والبث المباشر."'::jsonb, true),
  ('short_description_en', '"A future social platform for voice rooms, video, and live streaming."'::jsonb, true),
  ('email', '"Sohbetna@gmail.com"'::jsonb, true),
  ('support_email', '"Sohbetna@gmail.com"'::jsonb, true),
  ('whatsapp', '"+201124724749"'::jsonb, true)
on conflict (setting_key) do update set setting_value = excluded.setting_value, is_public = excluded.is_public;

insert into public.room_packages (package_name_ar, package_name_en, package_type, coins, price, currency, duration_days, features, is_active, sort_order)
values
  ('الغرفة العادية', 'Standard room', 'standard', 1000, 1000, 'EGP', 45, '["ظهور أساسي", "مدة شهر ونصف", "إعدادات قابلة للتعديل"]'::jsonb, true, 1),
  ('الغرفة المميزة', 'Premium room', 'premium', 3000, 1750, 'EGP', 45, '["ظهور أعلى", "مزايا إدارة إضافية", "قابلة للتحديث من لوحة التحكم"]'::jsonb, true, 2),
  ('غرفة VIP', 'VIP room', 'vip', 5000, 2500, 'EGP', 45, '["أولوية في العرض", "تجربة خاصة", "مدة قابلة للتعديل"]'::jsonb, true, 3)
on conflict (package_type) do update set
  package_name_ar = excluded.package_name_ar,
  package_name_en = excluded.package_name_en,
  coins = excluded.coins,
  price = excluded.price,
  currency = excluded.currency,
  duration_days = excluded.duration_days,
  features = excluded.features,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.app_links (platform, url, is_active)
values
  ('google_play', '', false),
  ('app_store', '', false),
  ('huawei', '', false),
  ('facebook', '', false),
  ('instagram', '', false),
  ('tiktok', '', false),
  ('youtube', '', false)
on conflict (platform) do update set url = excluded.url, is_active = excluded.is_active;

insert into public.faqs (question_ar, question_en, answer_ar, answer_en, is_active, sort_order)
values
  ('هل الموقع هو تطبيق الشات نفسه؟', 'Is this the chat app itself?', 'لا. هذا موقع دعائي وإداري، أما تطبيق الشات واللايف فسيكون له Backend مستقل مستقبلًا.', 'No. This is a marketing and admin website; the chat/live app will have a separate backend later.', true, 1),
  ('هل يمكن تعديل الاسم والروابط؟', 'Can I change the name and links?', 'نعم، من assets/js/config.js ثم من لوحة التحكم بعد ربط Supabase.', 'Yes. Start with assets/js/config.js, then use the dashboard after Supabase is connected.', true, 2),
  ('هل توجد مفاتيح سرية داخل الموقع؟', 'Are there secret keys in the site?', 'لا. الواجهة تستخدم Supabase URL وAnon Key فقط عند التفعيل، ولا تستخدم Service Role Key.', 'No. The frontend only uses Supabase URL and Anon Key when enabled, never the Service Role Key.', true, 3),
  ('متى تعمل النماذج فعليًا؟', 'When do forms save data?', 'بعد إنشاء مشروع Supabase وتشغيل ملفات SQL وإضافة URL وAnon Key في الإعدادات.', 'After creating Supabase, running SQL files, and adding URL and Anon Key.', true, 4)
on conflict do nothing;
