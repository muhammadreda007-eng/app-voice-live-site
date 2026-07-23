(function () {
  "use strict";

  window.AppConfig = {
    brand: {
      appName: "SOHBETNA | صٌحبتنا",
      taglineAr: "شات صوتي ومرئي ولايفات",
      taglineEn: "Voice, video chat, and live rooms",
      shortDescriptionAr: "منصة اجتماعية مستقبلية لغرف الصوت والفيديو والبث المباشر.",
      shortDescriptionEn: "A future social platform for voice rooms, video chat, and live streams.",
      appStatus: "SOON - قريبًا",
      developerName: "سـيـزر إيجينسي"
    },
    theme: {
      primary: "#00a99d",
      accent: "#ff5a6d",
      violet: "#5855ee"
    },
    supabase: {
      url: "https://czxregndvfmvkshrexzf.supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6eHJlZ25kdmZtdmtzaHJleHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTY2MzUsImV4cCI6MjEwMDI5MjYzNX0.g6KH5fKtcWrHXTYxPo_ohgMS2uxnR2chDd1pknfVgNc"
    },
    contact: {
      email: "Sohbetna@gmail.com",
      whatsapp: "+201124724749"
    },
    links: {
      googlePlay: "",
      appStore: "",
      huawei: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      privacy: "privacy-policy.html",
      terms: "terms.html",
      deleteAccount: "delete-account.html"
    },
    assets: {
      logo: "assets/images/brand/logo.svg",
      favicon: "assets/images/brand/favicon.svg",
      appIcon: "assets/images/brand/app-icon.svg",
      heroMockup: "assets/images/mockups/hero-phone.svg",
      promoVideoPoster: "assets/images/placeholders/video-poster.svg"
    },
    stats: [
      { key: "rooms", labelAr: "غرف قابلة للإطلاق", labelEn: "Configurable rooms", valueAr: "من لوحة التحكم", valueEn: "From dashboard" },
      { key: "platforms", labelAr: "Android و iOS", labelEn: "Android and iOS", valueAr: "جاهز للروابط", valueEn: "Links ready" },
      { key: "security", labelAr: "حماية البيانات", labelEn: "Data safety", valueAr: "Supabase RLS", valueEn: "Supabase RLS" }
    ],
    features: [
      { icon: "صوت", titleAr: "غرف صوتية", titleEn: "Voice rooms", textAr: "غرف محادثة صوتية مع مايكات متعددة وإدارة واضحة.", textEn: "Audio chat rooms with multiple microphones and room controls." },
      { icon: "Live", titleAr: "بث مباشر", titleEn: "Live streams", textAr: "مساحات لايف للفيديو والصوت مناسبة للمجتمع والترفيه.", textEn: "Live video and audio spaces for communities and entertainment." },
      { icon: "HD", titleAr: "فيديو وصوت HD", titleEn: "HD audio and video", textAr: "تصميم يعرض جودة التجربة دون ادعاء أرقام غير مؤكدة.", textEn: "A clear way to present quality without unsupported claims." },
      { icon: "Mic", titleAr: "مايكات متعددة", titleEn: "Multi mic", textAr: "إمكانية إبراز أماكن المتحدثين داخل الغرف.", textEn: "Room layouts that can highlight several speakers." },
      { icon: "Gift", titleAr: "هدايا رقمية", titleEn: "Digital gifts", textAr: "مكان منظم لشرح Coins والهدايا عند إطلاق التطبيق.", textEn: "A structured place for coins and digital gifts." },
      { icon: "VIP", titleAr: "غرف VIP", titleEn: "VIP rooms", textAr: "باقات قابلة للتعديل من الإعدادات ولوحة التحكم.", textEn: "Editable room packages controlled from settings." },
      { icon: "أمان", titleAr: "حماية وخصوصية", titleEn: "Safety and privacy", textAr: "صفحات سياسات وRLS لحماية بيانات الزوار والإدارة.", textEn: "Policy pages and RLS-ready data protection." },
      { icon: "Follow", titleAr: "أصدقاء ومتابعة", titleEn: "Friends and follows", textAr: "شرح واضح لتجربة اجتماعية ستكتمل في التطبيق.", textEn: "A clear description of the future social experience." }
    ],
    roomPackages: [
      { type: "standard", nameAr: "الغرفة العادية", nameEn: "Standard room", coins: 1000, price: 1000, currency: "EGP", durationDays: 45, featured: false, featuresAr: ["ظهور أساسي", "مدة شهر ونصف", "إعدادات قابلة للتعديل"], featuresEn: ["Basic visibility", "45 days", "Editable settings"] },
      { type: "premium", nameAr: "الغرفة المميزة", nameEn: "Premium room", coins: 3000, price: 1750, currency: "EGP", durationDays: 45, featured: true, featuresAr: ["ظهور أعلى", "مزايا إدارة إضافية", "قابلة للتحديث من لوحة التحكم"], featuresEn: ["Higher visibility", "Extra moderation tools", "Dashboard editable"] },
      { type: "vip", nameAr: "غرفة VIP", nameEn: "VIP room", coins: 5000, price: 2500, currency: "EGP", durationDays: 45, featured: false, featuresAr: ["أولوية في العرض", "تجربة خاصة", "مدة قابلة للتعديل"], featuresEn: ["Priority placement", "Private experience", "Editable duration"] }
    ],
    screenshots: [
      { titleAr: "واجهة الغرف", titleEn: "Rooms screen", textAr: "Placeholder واضح لصورة موبايل.", textEn: "Clear placeholder for a mobile screenshot.", image: "assets/images/screenshots/screen-rooms.svg" },
      { titleAr: "شاشة اللايف", titleEn: "Live screen", textAr: "مكان لصورة البث عند توفرها.", textEn: "A place for live stream imagery.", image: "assets/images/screenshots/screen-live.svg" },
      { titleAr: "الملف الشخصي", titleEn: "Profile screen", textAr: "مكان لصورة الملف الشخصي.", textEn: "A place for the profile screen.", image: "assets/images/screenshots/screen-profile.svg" },
      { titleAr: "الهدايا", titleEn: "Gifts screen", textAr: "مكان لصورة الهدايا والعملات.", textEn: "A place for gifts and coins.", image: "assets/images/screenshots/screen-gifts.svg" }
    ],
    faqs: [
      { questionAr: "هل الموقع هو تطبيق الشات نفسه؟", questionEn: "Is this the chat app itself?", answerAr: "لا. هذا موقع دعائي وإداري، أما تطبيق الشات واللايف فسيكون له Backend مستقل مستقبلًا.", answerEn: "No. This is a marketing and admin website; the chat/live app will have a separate backend later." },
      { questionAr: "هل يمكن تعديل الاسم والروابط؟", questionEn: "Can I change the name and links?", answerAr: "نعم، من assets/js/config.js ثم من لوحة التحكم بعد ربط Supabase.", answerEn: "Yes. Start with assets/js/config.js, then use the admin dashboard after Supabase is connected." },
      { questionAr: "هل توجد مفاتيح سرية داخل الموقع؟", questionEn: "Are there secret keys in the site?", answerAr: "لا. الواجهة تستخدم Supabase URL وAnon Key فقط عند التفعيل، ولا تستخدم Service Role Key.", answerEn: "No. The frontend only uses Supabase URL and Anon Key when enabled, never the Service Role Key." },
      { questionAr: "متى تعمل النماذج فعليًا؟", questionEn: "When do the forms save data?", answerAr: "بعد إنشاء مشروع Supabase وتشغيل ملفات SQL وإضافة URL وAnon Key في الإعدادات.", answerEn: "After creating Supabase, running the SQL files, and adding URL and Anon Key to the config." }
    ]
  };
})();
