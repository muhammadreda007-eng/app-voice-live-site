# SOHBETNA | صٌحبتنا Website

موقع Static كامل لتطبيق شات صوتي ومرئي ولايفات. مبني بـ HTML5 وCSS3 وVanilla JavaScript فقط، ومجهز للنشر على Cloudflare Pages والربط مع Supabase.

## أهم الملفات التي تعدل منها الهوية

- `assets/js/config.js`: اسم التطبيق، الشعار النصي، الحالة، الروابط، البريد، واتساب، الألوان، باقات الغرف، والأسئلة.
- `assets/js/translations.js`: النصوص العربية والإنجليزية.
- `assets/images/brand/`: مكان اللوجو والأيقونة والـ favicon.
- `assets/images/mockups/` و `assets/images/screenshots/`: أماكن صور التطبيق.

## التشغيل المحلي البسيط

من داخل مجلد المشروع، يمكن تشغيل خادم محلي بسيط. لا تحتاج Framework أو Build Process.

```powershell
python -m http.server 8080
```

ثم افتح الرابط المحلي الذي يظهر لك في نافذة الأوامر.

## Supabase

1. شغل `supabase/schema.sql`.
2. شغل `supabase/seed.sql`.
3. شغل `supabase/storage-policies.sql`.
4. انسخ `assets/js/env.example.js` إلى `assets/js/env.js` وضع Supabase URL وAnon Key بنفسك.

لا تضع Service Role Key داخل أي ملف من ملفات الموقع.

## النشر

المشروع مناسب لـ Cloudflare Pages كملفات Static، بدون Framework أو لغة خادم.
