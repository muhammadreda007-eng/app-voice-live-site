(function () {
  "use strict";

  const page = document.body.dataset.adminPage;
  if (!page) return;

  const sidebarLinks = [
    ["dashboard.html", "لوحة التحكم"],
    ["news.html", "الأخبار"],
    ["messages.html", "الرسائل"],
    ["waitlist.html", "قائمة الانتظار"],
    ["settings.html", "الإعدادات"]
  ];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function alert(message, type = "warning") {
    document.querySelectorAll("[data-admin-alert]").forEach((node) => {
      node.textContent = message;
      node.className = "form-alert is-" + type;
    });
  }

  function renderSidebar() {
    const mount = document.getElementById("adminSidebar");
    if (!mount) return;
    mount.replaceChildren(...sidebarLinks.map(([href, label]) => {
      const a = el("a", "", label);
      a.href = href;
      if (href.startsWith(page)) a.setAttribute("aria-current", "page");
      return a;
    }));
  }

  async function safeAdmin(callback) {
    if (!window.AppSupabase.isConfigured()) return null;
    try {
      return await callback();
    } catch (_) {
      return null;
    }
  }

  async function dashboard() {
    const statsMount = document.getElementById("adminStats");
    if (!statsMount) return;
    const counts = await safeAdmin(async () => ({
      waitlist: await AppApi.adminCount("waitlist"),
      contact: await AppApi.adminCount("contact_messages"),
      support: await AppApi.adminCount("support_requests"),
      deleteRequests: await AppApi.adminCount("account_deletion_requests"),
      published: await AppApi.adminCount("news", { status: "published" })
    })) || { waitlist: 0, contact: 0, support: 0, deleteRequests: 0, published: 0 };
    const labels = [["waitlist", "قائمة الانتظار"], ["contact", "رسائل التواصل"], ["support", "طلبات الدعم"], ["deleteRequests", "طلبات الحذف"], ["published", "أخبار منشورة"]];
    statsMount.replaceChildren(...labels.map(([key, label]) => {
      const card = el("article", "stat-card");
      card.append(el("strong", "", String(counts[key])), el("span", "", label));
      return card;
    }));
    const messages = await safeAdmin(() => AppApi.adminList("contact_messages", { orderBy: "created_at", limit: 5 })) || [];
    document.getElementById("recentMessages")?.replaceChildren(...(messages.length ? messages.map((m) => listItem(m.full_name || m.email, m.subject || m.message, m.created_at)) : [el("p", "empty-state", "لا توجد رسائل بعد.")]));
    const waitlist = await safeAdmin(() => AppApi.adminList("waitlist", { orderBy: "created_at", limit: 5 })) || [];
    document.getElementById("recentWaitlist")?.replaceChildren(...(waitlist.length ? waitlist.map((m) => listItem(m.full_name, [m.email, m.phone].filter(Boolean).join(" • "), m.created_at)) : [el("p", "empty-state", "لا توجد بيانات بعد.")]));
  }

  function listItem(title, sub, date) {
    const row = el("div", "admin-list-item");
    row.append(el("strong", "", title || "-"), el("span", "", sub || ""), el("span", "", date ? new Date(date).toLocaleDateString("ar-EG") : ""));
    return row;
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90);
  }

  async function loadNewsAdmin() {
    const table = document.getElementById("adminNewsTable");
    const form = document.querySelector("[data-admin-news-form]");
    if (!table || !form) return;
    form.elements.title_ar.addEventListener("input", () => {
      if (!form.elements.slug.value) form.elements.slug.value = slugify(form.elements.title_ar.value);
    });
    form.querySelector("[data-clear-news]")?.addEventListener("click", () => form.reset());
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!window.AppSupabase.isConfigured()) {
        alert("اربط Supabase أولًا حتى يتم حفظ الأخبار.", "warning");
        return;
      }
      try {
        let cover = form.elements.cover_image_url.value.trim();
        if (form.elements.cover_image.files[0]) {
          cover = await AppApi.uploadNewsImage(form.elements.cover_image.files[0]);
        }
        const payload = {
          title_ar: form.elements.title_ar.value.trim(),
          title_en: form.elements.title_en.value.trim(),
          slug: form.elements.slug.value.trim() || slugify(form.elements.title_ar.value),
          excerpt_ar: form.elements.excerpt_ar.value.trim(),
          excerpt_en: form.elements.excerpt_en.value.trim(),
          content_ar: form.elements.content_ar.value.trim(),
          content_en: form.elements.content_en.value.trim(),
          cover_image_url: cover || null,
          status: form.elements.status.value,
          published_at: form.elements.status.value === "published" ? new Date().toISOString() : null
        };
        if (form.elements.id.value) payload.id = form.elements.id.value;
        await AppApi.adminUpsert("news", payload, "id");
        alert("تم حفظ الخبر.", "success");
        form.reset();
        await loadNewsAdmin();
      } catch (_) {
        alert("تعذر حفظ الخبر. راجع الصلاحيات والإعدادات.", "error");
      }
    });
    const data = await safeAdmin(() => AppApi.adminList("news", { orderBy: "created_at" })) || [];
    table.replaceChildren(...(data.length ? data.map((item) => {
      const tr = document.createElement("tr");
      [item.title_ar, item.status, item.published_at || item.created_at].forEach((value) => tr.append(el("td", "", value ? String(value).slice(0, 80) : "-")));
      const actions = el("td");
      const edit = el("button", "btn btn-quiet", "تعديل");
      edit.type = "button";
      edit.addEventListener("click", () => {
        Object.keys(form.elements).forEach((key) => {
          if (item[key] !== undefined && form.elements[key]) form.elements[key].value = item[key] || "";
        });
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      const del = el("button", "btn btn-quiet", "حذف");
      del.type = "button";
      del.addEventListener("click", async () => {
        if (!confirm("هل تريد حذف الخبر؟")) return;
        await AppApi.adminDelete("news", item.id);
        await loadNewsAdmin();
      });
      actions.append(edit, del);
      tr.append(actions);
      return tr;
    }) : [emptyRow("لا توجد أخبار بعد.", 4)]));
  }

  async function loadMessages() {
    const table = document.getElementById("adminMessagesTable");
    const type = document.getElementById("messageType");
    const status = document.getElementById("messageStatus");
    const search = document.getElementById("messageSearch");
    if (!table || !type) return;
    async function refresh() {
      const data = await safeAdmin(() => AppApi.adminList(type.value, { orderBy: "created_at", status: status.value || undefined })) || [];
      const term = (search.value || "").toLowerCase();
      const rows = data.filter((item) => !term || JSON.stringify(item).toLowerCase().includes(term));
      table.replaceChildren(...(rows.length ? rows.map((item) => {
        const tr = document.createElement("tr");
        const title = item.full_name || item.username_or_email || item.email || item.contact_email || "-";
        const subject = item.subject || item.reason || item.message || "-";
        [title, subject, item.status || "new", item.created_at].forEach((value) => tr.append(el("td", "", value ? String(value).slice(0, 90) : "-")));
        const actions = el("td");
        ["read", "closed"].forEach((next) => {
          const btn = el("button", "btn btn-quiet", next === "read" ? "مقروء" : "إغلاق");
          btn.type = "button";
          btn.addEventListener("click", async () => { await AppApi.adminUpdate(type.value, item.id, { status: next }); refresh(); });
          actions.append(btn);
        });
        tr.append(actions);
        return tr;
      }) : [emptyRow("لا توجد بيانات.", 5)]));
    }
    [type, status, search].forEach((node) => node.addEventListener("input", refresh));
    await refresh();
  }

  async function loadWaitlist() {
    const table = document.getElementById("adminWaitlistTable");
    const search = document.getElementById("waitlistSearch");
    const status = document.getElementById("waitlistStatus");
    let cache = [];
    if (!table) return;
    async function refresh() {
      cache = await safeAdmin(() => AppApi.adminList("waitlist", { orderBy: "created_at", status: status.value || undefined })) || [];
      const term = (search.value || "").toLowerCase();
      const rows = cache.filter((item) => !term || ((item.full_name || "") + " " + (item.email || "") + " " + (item.phone || "")).toLowerCase().includes(term));
      table.replaceChildren(...(rows.length ? rows.map((item) => {
        const tr = document.createElement("tr");
        [item.full_name, item.email, item.phone, item.platform, item.status, item.created_at].forEach((value) => tr.append(el("td", "", value ? String(value).slice(0, 80) : "-")));
        const actions = el("td");
        ["contacted", "invited"].forEach((next) => {
          const btn = el("button", "btn btn-quiet", next === "contacted" ? "تم التواصل" : "دعوة");
          btn.type = "button";
          btn.addEventListener("click", async () => { await AppApi.adminUpdate("waitlist", item.id, { status: next }); refresh(); });
          actions.append(btn);
        });
        tr.append(actions);
        return tr;
      }) : [emptyRow("لا توجد بيانات.", 7)]));
    }
    document.getElementById("exportWaitlist")?.addEventListener("click", () => {
      const csvRows = cache.map((r) => [r.full_name, r.email, r.phone, r.platform, r.status, r.created_at].map((v) => '"' + String(v || "").replaceAll('"', '""') + '"').join(","));
      const csv = ["full_name,email,phone,platform,status,created_at", ...csvRows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = el("a");
      a.href = url;
      a.download = "waitlist.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
    [search, status].forEach((node) => node?.addEventListener("input", refresh));
    await refresh();
  }

  function loadSettings() {
    const config = window.AppConfig || {};
    const form = document.querySelector("[data-admin-settings-form]");
    if (form) {
      form.elements.app_name.value = config.brand?.appName || "";
      form.elements.app_status.value = config.brand?.appStatus || "soon";
      form.elements.short_description.value = config.brand?.shortDescriptionAr || "";
      form.elements.google_play.value = config.links?.googlePlay || "";
      form.elements.app_store.value = config.links?.appStore || "";
      form.elements.huawei_store.value = config.links?.huawei || "";
      form.elements.email.value = config.contact?.email || "";
      form.elements.whatsapp.value = config.contact?.whatsapp || "";
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!window.AppSupabase.isConfigured()) {
          alert("تعديل القيم محليًا يتم من assets/js/config.js. بعد ربط Supabase يمكن الحفظ من هنا.", "warning");
          return;
        }
        try {
          const values = Array.from(new FormData(form).entries()).map(([setting_key, value]) => ({ setting_key, setting_value: value, is_public: true }));
          for (const row of values) await AppApi.adminUpsert("site_settings", row, "setting_key");
          alert("تم حفظ الإعدادات.", "success");
        } catch (_) {
          alert("تعذر حفظ الإعدادات.", "error");
        }
      });
    }
    document.getElementById("settingsPackages")?.replaceChildren(...(config.roomPackages || []).map((pkg) => {
      const card = el("article", "settings-card");
      card.append(el("strong", "", pkg.nameAr), el("span", "", String(pkg.coins) + " Coins"), el("span", "", String(pkg.price) + " " + pkg.currency));
      return card;
    }));
    document.getElementById("settingsFaqs")?.replaceChildren(...(config.faqs || []).map((faq) => {
      const card = el("article", "settings-card");
      card.append(el("strong", "", faq.questionAr), el("span", "", faq.answerAr));
      return card;
    }));
  }

  function emptyRow(message, colspan) {
    const tr = document.createElement("tr");
    const td = el("td", "", message);
    td.colSpan = colspan;
    td.className = "empty-state";
    tr.append(td);
    return tr;
  }

  async function boot() {
    renderSidebar();
    if (page === "login") return;
    if (!window.AppSupabase.isConfigured()) return;
    if (page === "dashboard") await dashboard();
    if (page === "news") await loadNewsAdmin();
    if (page === "messages") await loadMessages();
    if (page === "waitlist") await loadWaitlist();
    if (page === "settings") loadSettings();
  }

  document.addEventListener("DOMContentLoaded", renderSidebar);
  document.addEventListener("app:admin-ready", boot);
})();
