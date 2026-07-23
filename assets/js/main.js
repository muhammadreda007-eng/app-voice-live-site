(function () {
  "use strict";

  const config = window.AppConfig || {};
  const defaultBrandName = config.brand?.appName || "SOHBETNA | صٌحبتنا";
  const translations = window.AppTranslations || {};
  const body = document.body;
  const prefix = body.dataset.prefix || "";
  const currentPath = location.pathname.split("/").pop() || "index.html";
  let lang = localStorage.getItem("app_lang") || "ar";

  function t(key) {
    const pack = translations[lang] || translations.ar || {};
    return pack[key] || (translations.ar && translations.ar[key]) || key;
  }

  function localized(item, arKey, enKey) {
    return lang === "en" ? item[enKey] || item[arKey] : item[arKey] || item[enKey];
  }

  function pageHref(href) {
    if (!href || href === "#") return "#";
    if (/^(https?:|mailto:|tel:)/.test(href)) return href;
    return prefix + href;
  }

  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach((el) => { el.textContent = text; });
  }

  async function hydratePublicSettings() {
    if (!window.AppApi?.fetchPublicSettings) return;
    try {
      const rows = await window.AppApi.fetchPublicSettings();
      const settings = Object.fromEntries(rows.map((row) => [row.setting_key, row.setting_value]));
      config.brand = config.brand || {};
      config.links = config.links || {};
      config.contact = config.contact || {};
      if (settings.app_name) config.brand.appName = String(settings.app_name);
      if (settings.app_status) config.brand.appStatus = String(settings.app_status);
      if (settings.developer_name) config.brand.developerName = String(settings.developer_name);
      if (settings.short_description) config.brand.shortDescriptionAr = String(settings.short_description);
      if (settings.google_play) config.links.googlePlay = String(settings.google_play);
      if (settings.app_store) config.links.appStore = String(settings.app_store);
      if (settings.huawei_store) config.links.huawei = String(settings.huawei_store);
      if (settings.email) config.contact.email = String(settings.email);
      if (settings.whatsapp) config.contact.whatsapp = String(settings.whatsapp);
    } catch (_) {
      // Keep the local configuration as a reliable fallback.
    }
  }

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const header = node("header", "site-header");
    const inner = node("div", "container header-inner");
    const brand = node("a", "brand");
    brand.href = pageHref("index.html");
    brand.setAttribute("aria-label", config.brand?.appName || "SOHBETNA | صٌحبتنا");
    const mark = node("span", "brand-mark", "S");
    const brandText = node("span", "brand-text");
    const strong = node("strong", "", config.brand?.appName || "SOHBETNA | صٌحبتنا");
    const small = node("small", "", lang === "en" ? config.brand?.taglineEn : config.brand?.taglineAr);
    brandText.append(strong, small);
    brand.append(mark, brandText);

    const navWrap = node("nav", "nav-wrap");
    navWrap.id = "primary-navigation";
    navWrap.setAttribute("aria-label", lang === "en" ? "Primary navigation" : "التنقل الرئيسي");
    const ul = node("ul", "nav-menu");
    const navItems = [["index.html","nav.home"],["about.html","nav.about"],["features.html","nav.features"],["rooms.html","nav.rooms"],["download.html","nav.download"],["news.html","nav.news"],["support.html","nav.support"],["contact.html","nav.contact"]];
    navItems.forEach(([href, key]) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = pageHref(href);
      a.textContent = t(key);
      if (href === currentPath || (currentPath === "" && href === "index.html")) a.setAttribute("aria-current", "page");
      li.append(a);
      ul.append(li);
    });
    const adminLi = document.createElement("li");
    const adminLink = document.createElement("a");
    adminLink.href = pageHref("admin/login.html");
    adminLink.textContent = t("nav.admin");
    adminLi.append(adminLink);
    ul.append(adminLi);
    navWrap.append(ul);

    const actions = node("div", "header-actions");
    const download = node("a", "btn btn-secondary download-action", t("common.downloadApp"));
    download.href = pageHref("download.html");
    const langBtn = node("button", "btn btn-quiet", lang === "ar" ? "English" : "العربية");
    langBtn.type = "button";
    langBtn.setAttribute("data-lang-toggle", "true");
    const toggle = node("button", "mobile-toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-label", lang === "en" ? "Open menu" : "فتح القائمة");
    toggle.setAttribute("aria-controls", "primary-navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.append(node("span"), node("span"), node("span"));
    actions.append(download, langBtn, toggle);
    inner.append(brand, navWrap, actions);
    header.append(inner);
    mount.replaceChildren(header);
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    const footer = node("footer", "site-footer");
    const container = node("div", "container");
    const grid = node("div", "footer-grid");
    const brandCol = node("div");
    brandCol.append(node("h2", "", config.brand?.appName || "SOHBETNA | صٌحبتنا"));
    brandCol.append(node("p", "", lang === "en" ? config.brand?.shortDescriptionEn : config.brand?.shortDescriptionAr));
    grid.append(brandCol);
    const groups = [
      [lang === "en" ? "Site" : "الموقع", [["about.html", t("nav.about")], ["features.html", t("nav.features")], ["rooms.html", t("nav.rooms")], ["news.html", t("nav.news")]]],
      [lang === "en" ? "Support" : "الدعم", [["support.html", t("nav.support")], ["contact.html", t("nav.contact")], ["faq.html", t("nav.faq") || "FAQ"], ["delete-account.html", lang === "en" ? "Delete account" : "طلب حذف الحساب"]]],
      [lang === "en" ? "Legal" : "القانوني", [["privacy-policy.html", lang === "en" ? "Privacy policy" : "سياسة الخصوصية"], ["terms.html", lang === "en" ? "Terms" : "الشروط"], ["community-guidelines.html", lang === "en" ? "Community guidelines" : "إرشادات المجتمع"], ["safety.html", lang === "en" ? "Safety" : "الأمان"]]]
    ];
    groups.forEach(([title, links]) => {
      const col = node("div");
      col.append(node("h3", "", title));
      const list = node("ul", "footer-links");
      links.forEach(([href, label]) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = pageHref(href);
        a.textContent = label;
        li.append(a);
        list.append(li);
      });
      col.append(list);
      grid.append(col);
    });
    const bottom = node("div", "footer-bottom");
    bottom.append(node("p", "", "© " + new Date().getFullYear() + " " + (config.brand?.appName || "SOHBETNA | صٌحبتنا") + ". " + (lang === "en" ? "All rights reserved." : "كل الحقوق محفوظة.")));
    bottom.append(node("p", "", (lang === "en" ? "Developer: " : "المطور: ") + (config.brand?.developerName || "")));
    container.append(grid, bottom);
    footer.append(container);
    mount.replaceChildren(footer);
  }

  function applyTranslations() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n).replaceAll(defaultBrandName, config.brand?.appName || defaultBrandName);
      el.textContent = value;
    });
    document.querySelectorAll("[data-app-status]").forEach((el) => {
      el.textContent = config.brand?.appStatus === "available" ? (lang === "en" ? "Available now" : "متاح الآن") : (lang === "en" ? "Coming soon" : "قريبًا");
    });
    setText("[data-config-email]", config.contact?.email || "");
    setText("[data-config-whatsapp]", config.contact?.whatsapp || "");
  }

  function renderStats() {
    const mount = document.getElementById("heroStats");
    if (!mount) return;
    mount.replaceChildren(...(config.stats || []).map((item) => {
      const box = node("div", "metric");
      box.append(node("strong", "", localized(item, "valueAr", "valueEn")));
      box.append(node("span", "", localized(item, "labelAr", "labelEn")));
      return box;
    }));
  }

  function renderFeatures() {
    document.querySelectorAll("#featureGrid").forEach((mount) => {
      mount.replaceChildren(...(config.features || []).map((item) => {
        const card = node("article", "feature-card reveal");
        card.append(node("span", "feature-icon", item.icon));
        card.append(node("h3", "", localized(item, "titleAr", "titleEn")));
        card.append(node("p", "", localized(item, "textAr", "textEn")));
        return card;
      }));
    });
  }

  function renderRoomPackages(packages) {
    document.querySelectorAll("#roomPackages").forEach((mount) => {
      const data = packages && packages.length ? packages : (config.roomPackages || []);
      mount.replaceChildren(...data.map((item) => {
        const card = node("article", "pricing-card reveal" + (item.featured || item.package_type === "premium" ? " featured" : ""));
        const title = item.package_name_ar ? (lang === "en" ? item.package_name_en : item.package_name_ar) : localized(item, "nameAr", "nameEn");
        const features = item.featuresAr || item.features || [];
        card.append(node("h3", "", title));
        const price = node("div", "price");
        price.append(node("strong", "", String(item.coins || 0)));
        price.append(node("span", "", "Coins"));
        card.append(price);
        card.append(node("p", "", (lang === "en" ? "Suggested price" : "السعر المقترح") + ": " + (item.price || 0) + " " + (item.currency || "EGP")));
        card.append(node("p", "", (lang === "en" ? "Duration" : "المدة") + ": " + (item.durationDays || item.duration_days || 45) + " " + (lang === "en" ? "days" : "يوم")));
        const list = node("ul", "checked-list");
        (Array.isArray(features) ? features : []).forEach((feature) => list.append(Object.assign(document.createElement("li"), { textContent: feature })));
        card.append(list);
        return card;
      }));
    });
  }

  function renderScreenshots() {
    const mount = document.getElementById("screenshotTrack");
    if (!mount) return;
    mount.replaceChildren(...(config.screenshots || []).map((item) => {
      const card = node("article", "screen-card");
      if (item.image) {
        const img = node("img", "screen-image");
        img.src = pageHref(item.image);
        img.alt = localized(item, "titleAr", "titleEn");
        img.loading = "lazy";
        card.append(img);
      }
      card.append(node("h3", "", localized(item, "titleAr", "titleEn")));
      card.append(node("p", "", localized(item, "textAr", "textEn")));
      return card;
    }));
  }

  function renderStoreLinks() {
    document.querySelectorAll("#storeLinks").forEach((mount) => {
      const stores = [
        ["googlePlay", "Google Play"],
        ["appStore", "App Store"],
        ["huawei", "Huawei AppGallery"]
      ];
      mount.replaceChildren(...stores.map(([key, label]) => {
        const a = node("a", "btn btn-secondary", label);
        const url = config.links?.[key];
        a.href = url || pageHref("waitlist.html");
        if (url && /^https?:/.test(url)) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        return a;
      }));
    });
  }

  function renderFaqs(items) {
    document.querySelectorAll("#faqList").forEach((mount) => {
      const limit = Number(mount.dataset.limit || 0);
      const data = items && items.length ? items : (config.faqs || []);
      const visible = limit ? data.slice(0, limit) : data;
      mount.replaceChildren(...visible.map((item, index) => {
        const wrap = node("article", "accordion-item reveal");
        const btn = node("button", "accordion-button", item.question_ar ? (lang === "en" ? item.question_en : item.question_ar) : localized(item, "questionAr", "questionEn"));
        const panel = node("div", "accordion-panel", item.answer_ar ? (lang === "en" ? item.answer_en : item.answer_ar) : localized(item, "answerAr", "answerEn"));
        btn.type = "button";
        btn.setAttribute("aria-expanded", index === 0 ? "true" : "false");
        panel.classList.toggle("is-open", index === 0);
        btn.addEventListener("click", () => {
          const isOpen = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!isOpen));
          panel.classList.toggle("is-open", !isOpen);
        });
        wrap.append(btn, panel);
        return wrap;
      }));
    });
  }

  function setupInteractions() {
    const header = document.querySelector(".site-header");
    const navWrap = document.querySelector(".nav-wrap");
    const mobile = document.querySelector(".mobile-toggle");
    const langToggle = document.querySelector("[data-lang-toggle]");
    window.addEventListener("scroll", () => header?.classList.toggle("is-scrolled", window.scrollY > 8), { passive: true });
    mobile?.addEventListener("click", () => {
      const open = mobile.getAttribute("aria-expanded") !== "true";
      mobile.setAttribute("aria-expanded", String(open));
      navWrap?.classList.toggle("is-open", open);
      body.classList.toggle("menu-open", open);
    });
    langToggle?.addEventListener("click", () => {
      lang = lang === "ar" ? "en" : "ar";
      localStorage.setItem("app_lang", lang);
      bootstrap();
    });
    document.querySelector("[data-slider-prev]")?.addEventListener("click", () => document.getElementById("screenshotTrack")?.scrollBy({ left: document.documentElement.dir === "rtl" ? 260 : -260, behavior: "smooth" }));
    document.querySelector("[data-slider-next]")?.addEventListener("click", () => document.getElementById("screenshotTrack")?.scrollBy({ left: document.documentElement.dir === "rtl" ? -260 : 260, behavior: "smooth" }));
    const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 }) : null;
    document.querySelectorAll(".reveal").forEach((el) => observer ? observer.observe(el) : el.classList.add("is-visible"));
  }

  async function hydrateFromSupabase() {
    if (!window.AppApi) return;
    try {
      const [packages, faqs] = await Promise.all([
        window.AppApi.fetchRoomPackages?.(),
        window.AppApi.fetchFaqs?.()
      ]);
      renderRoomPackages(packages);
      renderFaqs(faqs);
    } catch (_) {
      renderRoomPackages();
      renderFaqs();
    }
  }

  async function bootstrap() {
    await hydratePublicSettings();
    renderHeader();
    renderFooter();
    applyTranslations();
    renderStats();
    renderFeatures();
    renderRoomPackages();
    renderScreenshots();
    renderStoreLinks();
    renderFaqs();
    setupInteractions();
    hydrateFromSupabase();
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
