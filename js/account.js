/* DOMA STORE: single account detail view, actions and similar listings. */
(function(){
  const config = window.DOMA_CONFIG || {};
  const utils = window.utils;
  const accountId = new URLSearchParams(location.search).get("id") || "";
  const host = document.getElementById("account-content");

  function escape(value){ return utils.escapeHTML(value ?? "—"); }
  function lang(){ return utils.currentLang() === "en" ? "en" : "ar"; }
  function t(key){ return window.t(key); }
  function translated(value){ return utils.t(value); }
  function localizedDate(value){
    if (!value) return "";
    return value;
  }
  function rankLabel(rank){
    const key = "rank_" + String(rank || "").toLowerCase().replace(/[^a-z]+/g, "_");
    return window.I18N?.[lang()]?.[key] || rank || "—";
  }

  function mediaMarkup(account){
    const video = account.video || {type:"none",src:""};
    if (video.type === "youtube" && video.src && /^[\w-]{6,}$/.test(video.src)) {
      return `<iframe src="https://www.youtube-nocookie.com/embed/${escape(video.src)}?rel=0" title="${escape(translated(account.title))}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
    if (video.type === "mp4" && video.src) {
      return `<video controls playsinline preload="metadata" src="${escape(video.src)}" aria-label="${escape(translated(account.title))}"></video>`;
    }
    return `<div class="media-placeholder"><i data-lucide="circle-play" aria-hidden="true"></i><span>${escape(t("video_soon"))}</span></div>`;
  }

  function itemList(values, formatter){
    if (!Array.isArray(values) || !values.length) return `<li>—</li>`;
    return values.map(item => `<li>${formatter(item)}</li>`).join("");
  }

  function detailSection(titleKey, icon, values, formatter){
    return `<section class="detail-section"><h3><i data-lucide="${icon}" aria-hidden="true"></i>${escape(t(titleKey))}</h3><ul class="detail-list">${itemList(values, formatter)}</ul></section>`;
  }

  function specItem(icon, labelKey, value){
    return `<div class="spec-item"><i data-lucide="${icon}" aria-hidden="true"></i><span>${escape(t(labelKey))}</span><strong>${escape(value)}</strong></div>`;
  }

  function stars(count){
    const total = Math.max(0, Math.min(10, Number(count) || 0));
    return `<span class="gold" aria-label="${total} ${escape(t("stars"))}">${"★".repeat(total)}${"☆".repeat(Math.max(0, Math.min(3, 3-total)))}</span>`;
  }

  function statusText(status){
    return t(status === "sold" ? "status_sold" : status === "reserved" ? "status_reserved" : "status_available");
  }

  function actionMarkup(account){
    const id = encodeURIComponent(account.id);
    const title = translated(account.title);
    const message = utils.accountMessage(account);
    const available = account.status === "available";
    const isCompared = utils.getCompare().includes(String(account.id));
    const compareLabel = isCompared ? t("compare_remove") : t("compare_add");
    const primary = available
      ? `<a class="btn btn-primary" href="checkout.html?buy=${id}"><i data-lucide="shopping-bag" aria-hidden="true"></i>${escape(t("buy_now"))}</a>
         <button class="btn btn-ice" type="button" data-cart-add="${escape(account.id)}"><i data-lucide="shopping-cart" aria-hidden="true"></i>${escape(t("add_to_cart"))}</button>`
      : `<button class="btn btn-ghost" type="button" disabled>${escape(statusText(account.status))}</button>
         <a class="btn btn-ice" href="request.html?similar=${id}">${escape(t("request_this"))}</a>`;
    const telegramUrl = utils.telegramURL(message);
    return `<div class="account-buy-actions">${primary}
      <button class="btn btn-ghost ${isCompared ? "active" : ""}" type="button" data-compare-toggle="${escape(account.id)}"><i data-lucide="scale" aria-hidden="true"></i>${escape(compareLabel)}</button>
    </div>
    <div class="account-contact-actions">
      <a class="btn btn-whatsapp btn-sm" href="${escape(utils.whatsappURL(message))}" target="_blank" rel="noopener"><i data-lucide="message-circle" aria-hidden="true"></i>${escape(t("ask_whatsapp"))}</a>
      <a class="btn btn-telegram btn-sm" href="${escape(telegramUrl)}" target="_blank" rel="noopener"><i data-lucide="send" aria-hidden="true"></i>${escape(t("ask_telegram"))}</a>
    </div>`;
  }

  function renderAccount(){
    const account = utils.getAccount(accountId);
    if (!host) return;
    document.body.classList.remove("has-sticky-buy");
    document.querySelector(".mobile-buy-bar")?.remove();

    if (!account) {
      host.innerHTML = `<div class="empty-state"><i data-lucide="search" aria-hidden="true"></i><h1>${escape(t("not_found"))}</h1><p>${escape(t("no_results_text"))}</p><a class="btn btn-primary" href="store.html">${escape(t("back_to_store"))}</a></div>`;
      document.title = `${t("not_found")} | DOMA STORE`;
      if (window.lucide?.createIcons) window.lucide.createIcons();
      return;
    }

    const title = translated(account.title);
    const description = translated(account.description);
    const xSuits = account.xSuits || [];
    const available = account.status === "available";
    const specs = [
      ["gauge", "level", account.level],
      ["trophy", "rank", rankLabel(account.rank)],
      ["gem", "mythics", account.mythicCount ?? 0],
      ["zap", "xsuits", xSuits.length],
      ["swords", "gun_labs", account.gunLabs ?? 0],
      ["layers", "version", t(account.version || "other")],
      ["user", "linked_account", t(account.link || "other")],
      ["file-text", "account_id", account.id]
    ];

    const xSuitItems = xSuits.map(item => `<strong>${escape(item.name)}</strong> · ${stars(item.stars)} <span class="muted">${escape(t("stars"))}</span>`);
    const weaponItems = (account.weapons || []).map(item => `<strong>${escape(item.name)}</strong> <span class="chip">Lv.${escape(item.level)}</span>`);
    const vehicles = account.vehicles || [];
    const outfits = account.outfits || [];
    const extras = account.extras || [];
    const sampleBadge = account.sample && config.SHOW_SAMPLE_BADGE ? `<span class="badge badge-sample">${escape(t("sample"))}</span>` : "";

    host.innerHTML = `
      <div class="account-detail-layout">
        <div class="account-detail-main">
          <div class="account-detail-media">${mediaMarkup(account)}</div>
          <section class="spec-grid" aria-label="${escape(t("specs"))}">
            ${specs.map(([icon,key,value]) => specItem(icon,key,value)).join("")}
          </section>
          <div class="detail-sections">
            ${detailSection("xsuits", "zap", xSuitItems, value => value)}
            ${detailSection("weapons", "swords", weaponItems, value => value)}
            ${detailSection("vehicles", "car", vehicles, value => escape(value))}
            ${detailSection("outfits", "shirt", outfits, value => escape(value))}
            ${detailSection("extras", "layers", extras, value => escape(value))}
            <section class="detail-section"><h3><i data-lucide="file-text" aria-hidden="true"></i>${escape(t("description"))}</h3><p class="mb-0">${escape(description)}</p></section>
          </div>
        </div>

        <aside class="account-info account-info-sticky">
          <div class="check-row">${utils.tierBadge(account.tier)}${utils.statusBadge(account.status)}${sampleBadge}</div>
          <h1>${escape(title)}</h1>
          <span class="account-id-inline display">${escape(account.id)}</span>
          <div class="account-price">
            ${Number(account.oldPriceEGP) > Number(account.priceEGP) ? `<div><span class="price-old">${escape(utils.currentCurrency() === "USD" ? "$" + utils.formatNumber(Math.round(account.oldPriceEGP/(Number(config.USD_RATE)||50))) : (lang()==="ar" ? utils.formatNumber(account.oldPriceEGP)+" ج.م" : "EGP "+utils.formatNumber(account.oldPriceEGP)))}</span> <span class="discount-badge">-${Math.round((1-account.priceEGP/account.oldPriceEGP)*100)}%</span></div>` : ""}
            <div class="price-main">${utils.formatPrice(account.priceEGP)}</div>
          </div>
          ${actionMarkup(account)}
          <ul class="trust-list">
            <li><i data-lucide="shield-check" aria-hidden="true"></i>${escape(t("warranty_label"))} ${escape(config.WARRANTY_DAYS)} ${escape(t("warranty_days"))}</li>
            <li><i data-lucide="lock" aria-hidden="true"></i>${escape(t("full_login"))}</li>
            <li><i data-lucide="headphones" aria-hidden="true"></i>${escape(t("support_available"))}</li>
          </ul>
        </aside>
      </div>

      <section class="similar-section section">
        <div class="section-head"><h2>${escape(t("similar_accounts"))}</h2><a class="btn btn-ghost btn-sm" href="store.html">${escape(t("view_all"))}</a></div>
        <div class="account-grid" id="similar-accounts"></div>
      </section>
    `;

    const similar = (window.ACCOUNTS || [])
      .filter(item => item.id !== account.id && item.tier === account.tier && item.status === "available")
      .sort((a,b) => Math.abs(Number(a.priceEGP)-Number(account.priceEGP)) - Math.abs(Number(b.priceEGP)-Number(account.priceEGP)))
      .slice(0,4);
    const similarHost = document.getElementById("similar-accounts");
    if (similarHost) similarHost.innerHTML = similar.map(item => utils.renderAccountCard(item)).join("") || `<p class="muted">${escape(t("no_similar"))}</p>`;

    document.title = `${title} (${account.id}) | DOMA STORE`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `${title} — ${description}`.slice(0,300));

    if (available) {
      document.body.classList.add("has-sticky-buy");
      document.body.insertAdjacentHTML("beforeend", `<div class="mobile-buy-bar"><div class="container mobile-buy-inner"><div class="price-wrap"><div class="price-main">${utils.formatPrice(account.priceEGP)}</div></div><a class="btn btn-primary" href="checkout.html?buy=${encodeURIComponent(account.id)}"><i data-lucide="shopping-bag" aria-hidden="true"></i>${escape(t("buy_now"))}</a></div></div>`);
    }

    if (window.lucide?.createIcons) window.lucide.createIcons();
    window.DOMA_LAYOUT?.initReveal?.();
  }

  document.addEventListener("DOMContentLoaded", function(){
    window.onLangChange = renderAccount;
    renderAccount();
    window.addEventListener("doma:currency", renderAccount);
    window.addEventListener("doma:rerender", renderAccount);
    window.addEventListener("doma:compare", renderAccount);
  });
})();
