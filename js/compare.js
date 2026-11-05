/* DOMA STORE: side-by-side comparison for two or three saved account IDs. */
(function(){
  const utils = window.utils;
  const host = document.getElementById("compare-content");

  function escape(value){ return utils.escapeHTML(value ?? "—"); }
  function t(key){ return window.t(key); }
  function translated(value){ return utils.t(value); }

  function thumbMarkup(account){
    const video = account.video || {};
    if (video.type === "youtube" && video.src && /^[\w-]{6,}$/.test(video.src)) {
      return `<img loading="lazy" src="https://i.ytimg.com/vi/${escape(video.src)}/hqdefault.jpg" alt="${escape(translated(account.title))}">`;
    }
    return `<div class="media-placeholder"><i data-lucide="circle-play" aria-hidden="true"></i></div>`;
  }

  function accountHeader(account){
    const available = account.status === "available";
    return `<article class="card compare-product panel">
      ${thumbMarkup(account)}
      ${utils.tierBadge(account.tier)}
      <a class="compare-product-title" href="account.html?id=${encodeURIComponent(account.id)}">${escape(translated(account.title))}</a>
      <span class="display accent">${escape(account.id)}</span>
      <div class="price-main">${utils.formatPrice(account.priceEGP)}</div>
      <div class="compare-product-actions">
        <button class="icon-btn" type="button" data-compare-remove="${escape(account.id)}" aria-label="${escape(t("remove"))}" title="${escape(t("remove"))}"><i data-lucide="x" aria-hidden="true"></i></button>
        ${available ? `<a class="btn btn-primary btn-sm" href="checkout.html?buy=${encodeURIComponent(account.id)}">${escape(t("buy_now"))}</a>` : `<button class="btn btn-ghost btn-sm" type="button" disabled>${escape(t(account.status === "sold" ? "status_sold" : "status_reserved"))}</button>`}
      </div>
    </article>`;
  }

  function listValue(items){
    if (!Array.isArray(items) || !items.length) return "—";
    return items.map(item => typeof item === "string" ? item : item.name || "").filter(Boolean).join("، ");
  }

  function statusLabel(status){
    return t(status === "sold" ? "status_sold" : status === "reserved" ? "status_reserved" : "status_available");
  }
  function rankLabel(rank){
    const key = "rank_" + String(rank || "").toLowerCase().replace(/[^a-z]+/g, "_");
    return window.I18N?.[utils.currentLang()]?.[key] || rank || "—";
  }

  function tableRow(label, values, bestIndex){
    return `<tr><th scope="row">${escape(label)}</th>${values.map((value,index) => `<td>${bestIndex === index ? `<span class="best-value"><i data-lucide="badge-check" aria-hidden="true"></i>${value}</span>` : value}</td>`).join("")}</tr>`;
  }

  function comparisonTable(accounts){
    const prices = accounts.map(account => Number(account.priceEGP) || 0);
    const levels = accounts.map(account => Number(account.level) || 0);
    const mythics = accounts.map(account => Number(account.mythicCount) || 0);
    const xSuits = accounts.map(account => (account.xSuits || []).length);
    const labs = accounts.map(account => Number(account.gunLabs) || 0);
    const minPrice = Math.min(...prices);
    const bestPrice = prices.indexOf(minPrice);

    const rows = [];
    rows.push(tableRow(t("price"), accounts.map(account => utils.formatPrice(account.priceEGP)), bestPrice));
    rows.push(tableRow(t("tier"), accounts.map(account => escape(t(account.tier === "vip" ? "tier_vip" : account.tier === "mid" ? "tier_mid" : "tier_economy"))), -1));
    rows.push(tableRow(t("level"), levels.map(String), levels.indexOf(Math.max(...levels))));
    rows.push(tableRow(t("rank"), accounts.map(account => escape(rankLabel(account.rank))), -1));
    rows.push(tableRow(t("mythics"), mythics.map(String), mythics.indexOf(Math.max(...mythics))));
    rows.push(tableRow(t("xsuits"), accounts.map((account,index) => `<strong>${xSuits[index]}</strong><br><span class="muted">${escape(listValue(account.xSuits || []))}</span>`), xSuits.indexOf(Math.max(...xSuits))));
    rows.push(tableRow(t("gun_labs"), labs.map(String), labs.indexOf(Math.max(...labs))));
    rows.push(tableRow(t("weapons_list"), accounts.map(account => escape(listValue(account.weapons || []))), -1));
    rows.push(tableRow(t("vehicles"), accounts.map(account => escape(listValue(account.vehicles || []))), -1));
    rows.push(tableRow(t("outfits"), accounts.map(account => escape(listValue(account.outfits || []))), -1));
    rows.push(tableRow(t("version"), accounts.map(account => escape(t(account.version || "other"))), -1));
    rows.push(tableRow(t("linked_account"), accounts.map(account => escape(t(account.link || "other"))), -1));
    rows.push(tableRow(t("status"), accounts.map(account => escape(statusLabel(account.status))), -1));

    return `<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th scope="col">${escape(t("specs"))}</th>${accounts.map(account => `<th scope="col">${escape(account.id)}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
  }

  function renderCompare(){
    if (!host || !utils) return;
    const selectedIds = utils.getCompare();
    const accounts = selectedIds.map(id => utils.getAccount(id)).filter(Boolean);
    if (accounts.length !== selectedIds.length) utils.saveCompare(accounts.map(account => account.id));

    const intro = document.querySelector("[data-compare-intro]");
    if (intro) intro.textContent = utils.currentLang() === "ar"
      ? "راجع الفروق بين الأسعار والمواصفات قبل اتخاذ القرار."
      : "Review the differences in price and specifications before making a decision.";

    if (!accounts.length) {
      host.innerHTML = `<div class="empty-state"><i data-lucide="scale" aria-hidden="true"></i><h2>${escape(t("compare_empty"))}</h2><p>${escape(t("compare_empty_text"))}</p><a class="btn btn-primary" href="store.html">${escape(t("back_to_store"))}</a></div>`;
    } else if (accounts.length === 1) {
      host.innerHTML = `<div class="compare-page-grid">${accounts.map(accountHeader).join("")}</div><div class="empty-state"><i data-lucide="plus" aria-hidden="true"></i><h2>${escape(t("compare_need_two"))}</h2><p>${escape(t("compare_empty_text"))}</p><a class="btn btn-ice" href="store.html">${escape(t("back_to_store"))}</a></div>`;
    } else {
      host.innerHTML = `<div class="compare-page-grid">${accounts.map(accountHeader).join("")}</div>${comparisonTable(accounts)}<div class="form-actions"><a class="btn btn-ice" href="store.html">${escape(t("continue_shopping"))}</a><button class="btn btn-ghost" type="button" id="clear-compare">${escape(t("clear_all"))}</button></div>`;
    }
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  document.addEventListener("DOMContentLoaded", function(){
    window.onLangChange = renderCompare;
    renderCompare();
    document.addEventListener("click", function(event){
      const remove = event.target.closest("[data-compare-remove]");
      if (remove) {
        utils.saveCompare(utils.getCompare().filter(id => id !== remove.dataset.compareRemove));
        renderCompare();
      }
      if (event.target.closest("#clear-compare")) {
        utils.saveCompare([]);
        renderCompare();
      }
    });
    window.addEventListener("doma:compare", renderCompare);
    window.addEventListener("doma:currency", renderCompare);
    window.addEventListener("doma:language", renderCompare);
    window.addEventListener("doma:rerender", renderCompare);
  });
})();
