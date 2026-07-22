-- شغل هذا الملف إذا كان نموذج التواصل لا يحفظ رغم أن باقي النماذج تعمل.
-- يعيد ضبط سياسة إدخال رسائل التواصل للزوار فقط، بدون فتح قراءة البيانات العامة.

alter table public.contact_messages enable row level security;

drop policy if exists "contact_public_insert" on public.contact_messages;
create policy "contact_public_insert"
on public.contact_messages
for insert
to anon, authenticated
with check (
  char_length(trim(full_name)) between 2 and 120
  and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and (phone is null or char_length(trim(phone)) between 7 and 30)
  and char_length(trim(subject)) between 3 and 160
  and char_length(trim(message)) between 10 and 3000
);

