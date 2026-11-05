/* DOMA STORE home page: category counts, featured accounts and review preview. */
(function(){
  const config = window.DOMA_CONFIG || {};
  const utils = window.utils;
  const homeText = {
    ar: {
      categories_subtitle: "اختر نوع الحساب والمواصفات التي تبحث عنها.",
      how_subtitle: "خطوات واضحة لمراجعة الحساب والتواصل قبل الاتفاق.",
      how_choose_text: "تصفح الحسابات وحدد المواصفات المناسبة لك.",
      how_video_text: "راجع فيديو الحساب وتفاصيله قبل اتخاذ القرار.",
      how_order_text: "تواصل معنا لتأكيد التفاصيل والاتفاق.",
      how_receive_text: "تتم مراجعة خطوات التسليم وبيانات الدخول المتفق عليها."
    },
    en: {
      categories_subtitle: "Choose the account type and specifications you are looking for.",
      how_subtitle: "Clear steps to review an account and contact the store before making an agreement.",
      how_choose_text: "Browse the listings and choose the specifications that suit you.",
      how_video_text: "Review the account video and details before making a decision.",
      how_order_text: "Contact the store to confirm the details and discuss the agreement.",
      how_receive_text: "Review the agreed handover steps and login details."
    }
  };

  const categories = [
    { key: "category_economy", filter: "economy", icon: "wallet", match: account => account.tier === "economy" },
    { key: "category_mid", filter: "mid", icon: "layers", match: account => account.tier === "mid" },
    { key: "category_vip", filter: "vip", icon: "crown", className: "vip", match: account => account.tier === "vip" },
    { key: "category_xsuit", filter: "xsuit", icon: "zap", className: "xsuit", match: account => (account.xSuits || []).length > 0 || (account.tags || []).includes("xsuit") },
    { key: "category_mythic", filter: "mythic", icon: "gem", match: account => Number(account.mythicCount) >= 50 || (account.tags || []).includes("mythic") },
    { key: "category_labs", filter: "labweapons", icon: "swords", match: account => Number(account.gunLabs) > 0 || (account.tags || []).includes("labweapons") },
    { key: "category_vehicles", filter: "vehicles", icon: "car", match: account => (account.vehicles || []).length > 0 || (account.tags || []).includes("vehicles") },
    { key: "category_rank", filter: "highrank", icon: "trophy", match: account => ["Ace", "Ace Master", "Ace Dominator", "Conqueror"].includes(account.rank) || (account.tags || []).includes("highrank") }
  ];

  function applyHomeTranslations(){
    const lang = utils.currentLang() === "en" ? "en" : "ar";
    document.querySelectorAll("[data-home-i18n]").forEach(element => {
      const key = element.getAttribute("data-home-i18n");
      if (homeText[lang][key]) element.textContent = homeText[lang][key];
    });
  }

  function renderCategories(){
    const host = document.getElementById("home-categories");
    if (!host) return;
    const accounts = Array.isArray(window.ACCOUNTS) ? window.ACCOUNTS : [];
    host.innerHTML = categories.map(category => {
      const count = accounts.filter(category.match).length;
      const label = utils.escapeHTML(window.t(category.key));
      return `<a class="card category-tile ${category.className || ""} reveal" href="store.html?cat=${encodeURIComponent(category.filter)}" aria-label="${label}">
        <span class="category-icon"><i data-lucide="${category.icon}" aria-hidden="true"></i></span>
        <strong>${label}</strong>
        <small>${utils.formatNumber(count)} ${utils.escapeHTML(window.t("results"))}</small>
      </a>`;
    }).join("");
  }

  function renderFeaturedAccounts(){
    const host = document.getElementById("featured-accounts");
    if (!host) return;
    const featured = (window.ACCOUNTS || [])
      .filter(account => account.status === "available")
      .slice()
      .sort((a,b) => String(b.addedAt || "").localeCompare(String(a.addedAt || "")))
      .slice(0,8);
    host.innerHTML = featured.map(account => utils.renderAccountCard(account)).join("");
  }

  function initials(name){
    const value = String(name || "?").trim();
    return value ? Array.from(value)[0] : "?";
  }

  function renderReviewCard(review){
    const name = utils.t(review.name);
    const city = utils.t(review.city);
    const sampleBadge = review.placeholder && config.SHOW_SAMPLE_BADGE
      ? `<span class="badge badge-sample">${utils.escapeHTML(window.t("sample"))}</span>`
      : "";
    const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));
    const stars = Array.from({length:5}, (_,index) => `<i data-lucide="star" aria-hidden="true" class="${index < rating ? "filled" : ""}"></i>`).join("");
    return `<article class="review-card reveal">
      <i class="review-quote" data-lucide="quote" aria-hidden="true"></i>
      <div class="review-top">
        <span class="review-avatar" aria-hidden="true">${utils.escapeHTML(initials(name))}</span>
        <div>
          <div class="review-name">${utils.escapeHTML(name)}</div>
          <div class="review-meta">${utils.escapeHTML(city)}</div>
        </div>
        ${sampleBadge}
      </div>
      <div class="review-stars" aria-label="${rating} / 5">${stars}</div>
      <p class="review-text">${utils.escapeHTML(utils.t(review.text))}</p>
      <time class="review-date" datetime="${utils.escapeHTML(review.date || "")}">${utils.escapeHTML(review.date || "")}</time>
    </article>`;
  }

  function renderReviews(){
    const host = document.getElementById("home-reviews");
    if (!host) return;
    const reviews = (window.REVIEWS || []).slice(0,3);
    host.innerHTML = reviews.map(renderReviewCard).join("");
    const disclaimer = document.getElementById("home-review-disclaimer");
    if (disclaimer) disclaimer.hidden = !(reviews.some(review => review.placeholder) && config.SHOW_SAMPLE_BADGE);
  }

  function renderWarrantyStat(){
    const node = document.getElementById("hero-warranty-number");
    if (!node) return;
    const days = Math.max(0, Number(config.WARRANTY_DAYS) || 0);
    node.textContent = `${utils.formatNumber(days)} ${window.t("days")}`;
  }

  function renderHome(){
    if (!utils) return;
    applyHomeTranslations();
    renderCategories();
    renderFeaturedAccounts();
    renderReviews();
    renderWarrantyStat();
    if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
    if (window.DOMA_LAYOUT && typeof window.DOMA_LAYOUT.initReveal === "function") window.DOMA_LAYOUT.initReveal();
  }

  document.addEventListener("DOMContentLoaded", function(){
    window.onLangChange = renderHome;
    renderHome();
    window.addEventListener("doma:currency", renderHome);
    window.addEventListener("doma:rerender", renderHome);
    window.addEventListener("storage", renderHome);
  });
})();
