/* DOMA STORE shared helpers: text, prices, storage, messages and cards. */
(function(){
  const CONFIG = window.DOMA_CONFIG || {};
  const CART_KEY = "doma_cart";
  const COMPARE_KEY = "doma_compare";

  function safeParse(value, fallback){
    try { return value ? JSON.parse(value) : fallback; }
    catch (error) { console.warn("DOMA STORE: could not read saved data", error); return fallback; }
  }

  function escapeHTML(value){
    return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }

  function currentLang(){ return localStorage.getItem("doma_lang") || CONFIG.DEFAULT_LANG || "ar"; }
  function currentCurrency(){ return localStorage.getItem("doma_currency") || CONFIG.DEFAULT_CURRENCY || "EGP"; }

  function translate(value){
    if (value && typeof value === "object" && (value.ar !== undefined || value.en !== undefined)) {
      return value[currentLang()] ?? value.ar ?? value.en ?? "";
    }
    return value ?? "";
  }

  function formatNumber(value){
    return Number(value || 0).toLocaleString("en-US", {maximumFractionDigits:0});
  }

  function formatPrice(egp){
    const amount = Number(egp) || 0;
    const usd = Math.round(amount / (Number(CONFIG.USD_RATE) || 50));
    const lang = currentLang();
    let primary, secondary;
    if (currentCurrency() === "USD") {
      primary = "$" + formatNumber(usd);
      secondary = lang === "ar" ? formatNumber(amount) + " ج.م" : "EGP " + formatNumber(amount);
    } else {
      primary = lang === "ar" ? formatNumber(amount) + " ج.م" : "EGP " + formatNumber(amount);
      secondary = "$" + formatNumber(usd);
    }
    return `<span class="price-primary">${escapeHTML(primary)}</span><span class="price-secondary">${escapeHTML(secondary)}</span>`;
  }

  function getCart(){
    const value = safeParse(localStorage.getItem(CART_KEY), []);
    return Array.isArray(value) ? [...new Set(value.map(String))] : [];
  }
  function saveCart(ids){
    const cleaned = [...new Set((ids || []).map(String))];
    localStorage.setItem(CART_KEY, JSON.stringify(cleaned));
    updateCounters();
    window.dispatchEvent(new CustomEvent("doma:cart", {detail:{ids:cleaned}}));
    return cleaned;
  }
  function addToCart(id){
    const acc = getAccount(id);
    if (!acc || acc.status !== "available") { toast(window.t("sold")); return false; }
    const ids = getCart();
    if (!ids.includes(String(id))) ids.push(String(id));
    saveCart(ids);
    toast(window.t("added_to_cart"));
    return true;
  }
  function removeFromCart(id){ saveCart(getCart().filter(item => item !== String(id))); }
  function clearCart(){ saveCart([]); }

  function getCompare(){
    const value = safeParse(localStorage.getItem(COMPARE_KEY), []);
    return Array.isArray(value) ? [...new Set(value.map(String))].slice(0,3) : [];
  }
  function saveCompare(ids){
    const cleaned = [...new Set((ids || []).map(String))].slice(0,3);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(cleaned));
    updateCounters();
    renderCompareBar();
    window.dispatchEvent(new CustomEvent("doma:compare", {detail:{ids:cleaned}}));
    return cleaned;
  }
  function toggleCompare(id){
    const ids = getCompare();
    const key = String(id);
    if (ids.includes(key)) saveCompare(ids.filter(item => item !== key));
    else {
      if (ids.length >= 3) { toast(window.t("compare_limit")); return false; }
      saveCompare([...ids,key]);
    }
    return true;
  }

  function getAccount(id){
    return (window.ACCOUNTS || []).find(item => String(item.id) === String(id));
  }

  function toast(message){
    let region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "true");
      document.body.appendChild(region);
    }
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    region.appendChild(item);
    window.setTimeout(() => { item.remove(); if (!region.children.length) region.remove(); }, 2500);
  }

  function whatsappURL(message){
    const number = String(CONFIG.WHATSAPP || "").replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message || "")}`;
  }
  function telegramURL(message){
    const username = String(CONFIG.TELEGRAM || "").replace(/^@/, "");
    const base = `https://t.me/${encodeURIComponent(username)}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }
  function accountMessage(acc){
    if (!acc) return "";
    return currentLang() === "ar"
      ? `مرحبًا، أريد الاستفسار عن الحساب ${acc.id} - ${translate(acc.title)}.`
      : `Hello, I would like to ask about account ${acc.id} - ${translate(acc.title)}.`;
  }

  function tierBadge(tier){
    const key = tier === "vip" ? "tier_vip" : tier === "mid" ? "tier_mid" : "tier_economy";
    const cls = tier === "vip" ? "badge-vip" : tier === "mid" ? "badge-mid" : "badge-economy";
    return `<span class="badge ${cls}">${escapeHTML(window.t(key))}</span>`;
  }
  function statusBadge(status){
    const key = status === "sold" ? "status_sold" : status === "reserved" ? "status_reserved" : "status_available";
    const cls = status === "sold" ? "sold" : status === "reserved" ? "reserved" : "";
    return `<span class="badge badge-status ${cls}">${escapeHTML(window.t(key))}</span>`;
  }
  function accountMedia(acc){
    const video = acc.video || {type:"none"};
    let media = "";
    if (video.type === "youtube" && video.src) {
      media = `<img loading="lazy" src="https://i.ytimg.com/vi/${escapeHTML(video.src)}/hqdefault.jpg" alt="${escapeHTML(translate(acc.title))}">`;
    } else if (video.type === "mp4" && video.src) {
      media = `<video muted playsinline preload="metadata" src="${escapeHTML(video.src)}#t=0.8" aria-label="${escapeHTML(translate(acc.title))}"></video>`;
    } else {
      media = `<div class="media-placeholder"><i data-lucide="circle-play" aria-hidden="true"></i><span>${escapeHTML(window.t("video_soon"))}</span></div>`;
    }
    return `<div class="account-media">${media}<div class="media-fade"></div><span class="media-play" aria-hidden="true"><i data-lucide="play"></i></span><div class="media-badges"><div class="media-badges-start">${tierBadge(acc.tier)}</div><div class="media-badges-end">${statusBadge(acc.status)}${acc.sample && CONFIG.SHOW_SAMPLE_BADGE ? `<span class="badge badge-sample">${escapeHTML(window.t("sample"))}</span>` : ""}</div></div><span class="account-id">${escapeHTML(acc.id)}</span></div>`;
  }

  function featureChips(acc){
    const tags = Array.isArray(acc.tags) ? acc.tags : [];
    const chips = [];
    if (tags.includes("xsuit") || (acc.xSuits || []).length) chips.push(["zap",window.t("xsuit")]);
    if (tags.includes("mythic") || Number(acc.mythicCount) >= 50) chips.push(["gem",window.t("mythic")]);
    if (tags.includes("labweapons") || Number(acc.gunLabs) > 0) chips.push(["swords",window.t("gun_labs")]);
    if (tags.includes("vehicles") || (acc.vehicles || []).length) chips.push(["car",window.t("vehicles")]);
    return chips.slice(0,3).map(([icon,label]) => `<span class="chip"><i data-lucide="${icon}" aria-hidden="true"></i>${escapeHTML(label)}</span>`).join("");
  }

  function renderAccountCard(acc){
    if (!acc) return "";
    const compareActive = getCompare().includes(String(acc.id));
    const disabled = acc.status !== "available";
    const oldPrice = Number(acc.oldPriceEGP) > Number(acc.priceEGP)
      ? `<span class="price-old">${escapeHTML(currentCurrency() === "USD" ? "$" + formatNumber(Math.round(acc.oldPriceEGP/(Number(CONFIG.USD_RATE)||50))) : (currentLang()==="ar" ? formatNumber(acc.oldPriceEGP)+" ج.م" : "EGP "+formatNumber(acc.oldPriceEGP)))}</span><span class="discount-badge">-${Math.round((1-acc.priceEGP/acc.oldPriceEGP)*100)}%</span>` : "";
    const title = escapeHTML(translate(acc.title));
    return `<article class="card account-card ${acc.status === "sold" ? "is-sold" : ""}" data-account-card="${escapeHTML(acc.id)}">
      <a class="account-card-link" href="account.html?id=${encodeURIComponent(acc.id)}" aria-label="${title}">
        ${accountMedia(acc)}
        <div class="account-body">
          <h3 class="account-title">${title}</h3>
          <div class="mini-stats">
            <span class="mini-stat"><i data-lucide="gauge" aria-hidden="true"></i><span>${escapeHTML(window.t("level"))}:</span><strong>${escapeHTML(acc.level)}</strong></span>
            <span class="mini-stat"><i data-lucide="trophy" aria-hidden="true"></i><span>${escapeHTML(window.t("rank"))}:</span><strong>${escapeHTML(acc.rank || "—")}</strong></span>
            <span class="mini-stat"><i data-lucide="gem" aria-hidden="true"></i><span>${escapeHTML(window.t("mythic"))}:</span><strong>${escapeHTML(acc.mythicCount ?? 0)}</strong></span>
            <span class="mini-stat"><i data-lucide="zap" aria-hidden="true"></i><span>${escapeHTML(window.t("xsuit"))}:</span><strong>${escapeHTML((acc.xSuits || []).length)}</strong></span>
          </div>
          <div class="account-features">${featureChips(acc)}</div>
        </div>
      </a>
      <div class="account-footer">
        <div class="price-wrap">${oldPrice}<div class="price-main">${formatPrice(acc.priceEGP)}</div></div>
        <div class="account-actions">
          <button class="icon-btn ${compareActive ? "active" : ""}" type="button" data-compare-toggle="${escapeHTML(acc.id)}" aria-label="${escapeHTML(window.t(compareActive ? "compare_remove" : "compare_add"))}" title="${escapeHTML(window.t(compareActive ? "compare_remove" : "compare_add"))}"><i data-lucide="scale"></i></button>
          <button class="icon-btn" type="button" data-cart-add="${escapeHTML(acc.id)}" aria-label="${escapeHTML(window.t("add_to_cart"))}" title="${escapeHTML(window.t("add_to_cart"))}" ${disabled ? "disabled" : ""}><i data-lucide="shopping-cart"></i></button>
        </div>
      </div>
    </article>`;
  }

  function updateCounters(){
    const cartCount = getCart().length;
    const compareCount = getCompare().length;
    document.querySelectorAll("[data-cart-count]").forEach(el => {el.textContent = cartCount; el.classList.toggle("hidden", cartCount === 0);});
    document.querySelectorAll("[data-compare-count]").forEach(el => {el.textContent = compareCount; el.classList.toggle("hidden", compareCount === 0);});
  }

  function renderCompareBar(){
    const ids = getCompare();
    let bar = document.querySelector(".compare-bar");
    if (!ids.length) { bar?.remove(); return; }
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "compare-bar";
      document.body.appendChild(bar);
    }
    const slots = ids.map(id => `<span class="compare-slot">${escapeHTML(id)}</span>`).join("");
    const url = "compare.html";
    bar.innerHTML = `<div class="container compare-bar-inner"><div class="compare-slots">${slots}</div><div class="compare-bar-actions"><button type="button" class="btn btn-primary" data-compare-go ${ids.length < 2 ? "disabled" : ""}>${escapeHTML(window.t("compare_now"))}</button><button type="button" class="btn btn-ghost" data-compare-clear>${escapeHTML(window.t("clear"))}</button></div></div>`;
    bar.querySelector("[data-compare-go]")?.addEventListener("click", () => { if (ids.length >= 2) location.href = url; else toast(window.t("compare_need_two")); });
    bar.querySelector("[data-compare-clear]")?.addEventListener("click", () => saveCompare([]));
  }

  document.addEventListener("click", function(event){
    const cartButton = event.target.closest("[data-cart-add]");
    if (cartButton) { event.preventDefault(); event.stopPropagation(); addToCart(cartButton.dataset.cartAdd); return; }
    const compareButton = event.target.closest("[data-compare-toggle]");
    if (compareButton) {
      event.preventDefault(); event.stopPropagation();
      if (toggleCompare(compareButton.dataset.compareToggle)) {
        const active = getCompare().includes(String(compareButton.dataset.compareToggle));
        compareButton.classList.toggle("active", active);
        const label = window.t(active ? "compare_remove" : "compare_add");
        compareButton.setAttribute("aria-label", label); compareButton.setAttribute("title", label);
      }
    }
  });

  document.addEventListener("mouseover", function(event){
    const card = event.target.closest(".account-card");
    if (!card || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const video = card.querySelector(".account-media video");
    if (video) { const play = video.play(); if (play?.catch) play.catch(() => {}); }
  });
  document.addEventListener("mouseout", function(event){
    const card = event.target.closest(".account-card");
    if (!card || card.contains(event.relatedTarget)) return;
    const video = card.querySelector(".account-media video");
    if (video) { video.pause(); try { video.currentTime = 0.8; } catch(error) {} }
  });

  window.addEventListener("storage", updateCounters);
  document.addEventListener("DOMContentLoaded", function(){ updateCounters(); renderCompareBar(); });
  window.addEventListener("doma:language", function(){ updateCounters(); renderCompareBar(); });
  window.addEventListener("doma:currency", function(){ window.dispatchEvent(new CustomEvent("doma:rerender")); });

  window.utils = {
    t: translate, escapeHTML, formatPrice, formatNumber,
    getCart, saveCart, addToCart, removeFromCart, clearCart,
    getCompare, saveCompare, toggleCompare, getAccount,
    toast, whatsappURL, telegramURL, accountMessage,
    tierBadge, statusBadge, renderAccountCard, updateCounters, renderCompareBar,
    currentLang, currentCurrency
  };
})();
