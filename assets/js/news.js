(function () {
  "use strict";

  const lang = () => localStorage.getItem("app_lang") || "ar";

  function textFor(item, ar, en) {
    return lang() === "en" ? item[en] || item[ar] : item[ar] || item[en];
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function dateText(date) {
    if (!date) return "";
    return new Intl.DateTimeFormat(lang() === "en" ? "en" : "ar-EG", { dateStyle: "medium" }).format(new Date(date));
  }

  function renderNewsCard(item) {
    const card = el("article", "news-card reveal");
    const title = textFor(item, "title_ar", "title_en");
    const excerpt = textFor(item, "excerpt_ar", "excerpt_en");
    const link = el("a");
    link.href = "news-details.html?slug=" + encodeURIComponent(item.slug);
    link.append(el("h3", "", title));
    if (excerpt) link.append(el("p", "", excerpt));
    link.append(el("span", "text-link", lang() === "en" ? "Read more" : "قراءة المزيد"));
    card.append(el("p", "article-meta", dateText(item.published_at)));
    card.append(link);
    return card;
  }

  async function loadList() {
    const mounts = [...document.querySelectorAll("#newsList, #latestNews")];
    if (!mounts.length || !window.AppApi) return;
    for (const mount of mounts) {
      const limit = Number(mount.dataset.limit || 0);
      try {
        const data = await window.AppApi.fetchPublishedNews(limit);
        if (!data.length) {
          mount.replaceChildren(el("p", "empty-state", "لا توجد أخبار منشورة بعد. ستظهر الأخبار هنا بعد إضافتها من لوحة التحكم."));
          continue;
        }
        mount.replaceChildren(...data.map(renderNewsCard));
      } catch (_) {
        mount.replaceChildren(el("p", "empty-state", "تعذر تحميل الأخبار الآن. راجع إعدادات Supabase."));
      }
    }
  }

  async function loadDetails() {
    const mount = document.getElementById("newsDetails");
    if (!mount || !window.AppApi) return;
    const slug = new URLSearchParams(location.search).get("slug");
    if (!slug) {
      mount.replaceChildren(el("p", "empty-state", "لم يتم تحديد الخبر المطلوب."));
      return;
    }
    try {
      const item = await window.AppApi.fetchNewsBySlug(slug);
      if (!item) {
        mount.replaceChildren(el("p", "empty-state", "الخبر غير موجود أو غير منشور."));
        return;
      }
      const title = el("h1", "", textFor(item, "title_ar", "title_en"));
      const meta = el("p", "article-meta", dateText(item.published_at));
      const content = el("div", "article-content");
      String(textFor(item, "content_ar", "content_en") || "").split(/\n+/).filter(Boolean).forEach((para) => content.append(el("p", "", para)));
      mount.replaceChildren(title, meta, content);
      document.title = title.textContent + " | APP_NAME";
    } catch (_) {
      mount.replaceChildren(el("p", "empty-state", "تعذر تحميل تفاصيل الخبر."));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadList();
    loadDetails();
    document.getElementById("newsSearch")?.addEventListener("input", (event) => {
      const term = event.target.value.trim().toLowerCase();
      document.querySelectorAll("#newsList .news-card").forEach((card) => {
        card.hidden = term && !card.textContent.toLowerCase().includes(term);
      });
    });
  });
})();