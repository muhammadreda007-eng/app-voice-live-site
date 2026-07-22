(function () {
  "use strict";

  const config = window.AppConfig || {};
  const env = window.APP_ENV || {};
  const url = String(env.SUPABASE_URL || config.supabase?.url || "").trim();
  const anonKey = String(env.SUPABASE_ANON_KEY || config.supabase?.anonKey || "").trim();
  let client = null;

  function isConfigured() {
    return /^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(url) && anonKey.length > 30 && !/service[_-]?role/i.test(anonKey);
  }

  function getClient() {
    if (!isConfigured()) {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      throw new Error("SUPABASE_LIBRARY_MISSING");
    }
    if (!client) {
      client = window.supabase.createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return client;
  }

  function publicMessage(error) {
    if (!error) return "حدث خطأ غير متوقع.";
    if (error.message === "SUPABASE_NOT_CONFIGURED") return "تم التحقق من البيانات. فعّل إعدادات Supabase ليتم الحفظ الفعلي.";
    if (error.message === "SUPABASE_LIBRARY_MISSING") return "تعذر تحميل مكتبة Supabase. حاول لاحقًا.";
    return "تعذر تنفيذ الطلب الآن. راجع الإعدادات وحاول مرة أخرى.";
  }

  window.AppSupabase = {
    isConfigured,
    getClient,
    publicMessage,
    getConfigStatus() {
      return { configured: isConfigured(), urlReady: Boolean(url), anonKeyReady: Boolean(anonKey) };
    }
  };
})();