-- شغل هذا الملف مرة واحدة بعد schema.sql إذا كان المشروع موجودًا بالفعل.
-- يمنع أي تسجيل جديد في قائمة الانتظار بدون رقم هاتف دولي صحيح.

alter table public.waitlist
  drop constraint if exists waitlist_phone_required_format;

alter table public.waitlist
  add constraint waitlist_phone_required_format
  check (phone is not null and phone ~ '^\+[1-9][0-9]{7,14}$')
  not valid;

