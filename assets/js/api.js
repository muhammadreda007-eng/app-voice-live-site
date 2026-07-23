(function () {
  "use strict";

  const fallback = window.AppConfig || {};

  function client() {
    return window.AppSupabase.getClient();
  }

  function publicClient() {
    return window.AppSupabase.getPublicClient();
  }

  async function fetchPublicSettings() {
    if (!window.AppSupabase.isConfigured()) return [];
    const { data, error } = await publicClient()
      .from("site_settings")
      .select("setting_key,setting_value")
      .eq("is_public", true);
    if (error) throw error;
    return data || [];
  }

  async function fetchRoomPackages() {
    if (!window.AppSupabase.isConfigured()) return fallback.roomPackages || [];
    const { data, error } = await publicClient().from("room_packages").select("*").eq("is_active", true).order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function fetchFaqs() {
    if (!window.AppSupabase.isConfigured()) return fallback.faqs || [];
    const { data, error } = await publicClient().from("faqs").select("*").eq("is_active", true).order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function fetchPublishedNews(limit) {
    if (!window.AppSupabase.isConfigured()) return [];
    let query = publicClient().from("news").select("id,title_ar,title_en,slug,excerpt_ar,excerpt_en,cover_image_url,published_at").eq("status", "published").order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async function fetchNewsBySlug(slug) {
    if (!window.AppSupabase.isConfigured()) return null;
    const { data, error } = await publicClient().from("news").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function insertPublic(table, payload) {
    if (!window.AppSupabase.isConfigured()) throw new Error("SUPABASE_NOT_CONFIGURED");
    const { error } = await window.AppSupabase.getPublicClient().from(table).insert(payload);
    if (error) {
      console.error("Public form submission failed", {
        table,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    return true;
  }

  async function adminList(table, options = {}) {
    const sb = client();
    let query = sb.from(table).select(options.select || "*");
    if (options.status) query = query.eq("status", options.status);
    if (options.orderBy) query = query.order(options.orderBy, { ascending: options.ascending ?? false });
    if (options.limit) query = query.limit(options.limit);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async function adminCount(table, filter) {
    let query = client().from(table).select("*", { count: "exact", head: true });
    if (filter) query = query.match(filter);
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  async function adminUpsert(table, payload, onConflict) {
    const { data, error } = await client().from(table).upsert(payload, onConflict ? { onConflict } : undefined).select().single();
    if (error) throw error;
    return data;
  }

  async function adminUpdate(table, id, payload) {
    const { error } = await client().from(table).update(payload).eq("id", id);
    if (error) throw error;
    return true;
  }

  async function adminDelete(table, id) {
    const { error } = await client().from(table).delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  async function uploadNewsImage(file) {
    if (!file) return "";
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
    const path = crypto.randomUUID() + "-" + safeName;
    const { data, error } = await client().storage.from("news-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type
    });
    if (error) throw error;
    const { data: publicData } = client().storage.from("news-images").getPublicUrl(data.path);
    return publicData.publicUrl;
  }

  window.AppApi = {
    fetchPublicSettings,
    fetchRoomPackages,
    fetchFaqs,
    fetchPublishedNews,
    fetchNewsBySlug,
    insertPublic,
    adminList,
    adminCount,
    adminUpsert,
    adminUpdate,
    adminDelete,
    uploadNewsImage
  };
})();
