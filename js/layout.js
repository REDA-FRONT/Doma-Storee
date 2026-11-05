/* DOMA STORE shared page shell: header, mobile navigation, footer and contact links. */
(function(){
  const config = window.DOMA_CONFIG || {};
  const pageName = location.pathname.split("/").pop() || "index.html";

  const navItems = [
    ["index.html","nav_home"], ["store.html","nav_store"], ["compare.html","nav_compare"],
    ["request.html","nav_request"], ["sell.html","nav_sell"], ["reviews.html","nav_reviews"], ["faq.html","nav_faq"]
  ];

  function navLinks(className){
    return navItems.map(([href,key]) => `<a class="nav-link ${pageName === href ? "active" : ""}" href="${href}" data-i18n="${key}">${window.t(key)}</a>`).join("");
  }

  function headerMarkup(){
    return `<header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="DOMA STORE home">
          <img class="brand-logo" src="assets/logo.png" alt="DOMA STORE logo">
          <span class="brand-wordmark">DOMA <span>STORE</span></span>
        </a>
        <nav class="primary-nav" aria-label="Primary navigation">${navLinks("primary-nav")}</nav>
        <div class="header-actions">
          <div class="currency-toggle" role="group" aria-label="${window.t("currency_label")}">
            <button type="button" data-currency="EGP">EGP</button>
            <button type="button" data-currency="USD">USD</button>
          </div>
          <button class="header-action" type="button" data-lang-toggle aria-label="${window.t("lang_switch")}">${window.utils.currentLang() === "ar" ? "EN" : "ع"}</button>
          <a class="header-action" href="compare.html" aria-label="${window.t("nav_compare")}"><i data-lucide="scale"></i><span class="counter-badge hidden" data-compare-count>0</span></a>
          <a class="header-action" href="cart.html" aria-label="${window.t("cart")}"><i data-lucide="shopping-cart"></i><span class="counter-badge hidden" data-cart-count>0</span></a>
          <button class="header-action mobile-menu-btn" type="button" data-menu-open aria-label="${window.t("open_menu")}"><i data-lucide="menu"></i></button>
        </div>
      </div>
    </header>
    <div class="drawer-overlay" data-drawer-overlay></div>
    <aside class="mobile-drawer" data-mobile-drawer aria-label="${window.t("nav_home")}">
      <div class="drawer-head"><a class="brand" href="index.html"><img class="brand-logo" src="assets/logo.png" alt="DOMA STORE logo"><span class="brand-wordmark">DOMA <span>STORE</span></span></a><button class="icon-btn" data-menu-close type="button" aria-label="${window.t("close_menu")}"><i data-lucide="x"></i></button></div>
      <nav class="drawer-nav" aria-label="Mobile navigation">${navLinks("drawer-nav")}</nav>
      <div class="drawer-bottom"><div class="currency-toggle" role="group" aria-label="${window.t("currency_label")}"><button type="button" data-currency="EGP">EGP</button><button type="button" data-currency="USD">USD</button></div><button class="btn btn-ice btn-sm" type="button" data-lang-toggle><i data-lucide="languages"></i><span>${window.t("lang_switch")}</span></button></div>
    </aside>`;
  }

  function footerMarkup(){
    const socials = `${config.TIKTOK_URL ? `<a class="icon-btn" href="${window.utils.escapeHTML(config.TIKTOK_URL)}" target="_blank" rel="noopener" aria-label="TikTok"><i data-lucide="music-2"></i></a>` : ""}${config.INSTAGRAM_URL ? `<a class="icon-btn" href="${window.utils.escapeHTML(config.INSTAGRAM_URL)}" target="_blank" rel="noopener" aria-label="Instagram"><i data-lucide="instagram"></i></a>` : ""}`;
    return `<footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about"><a class="brand" href="index.html"><img class="brand-logo" src="assets/logo.png" alt="DOMA STORE logo"><span class="brand-wordmark">DOMA <span>STORE</span></span></a><p data-i18n="footer_about">${window.t("footer_about")}</p></div>
          <div><h3 class="footer-title" data-i18n="footer_quick_links">${window.t("footer_quick_links")}</h3><nav class="footer-links">${navLinks("footer-links")}</nav></div>
          <div><h3 class="footer-title" data-i18n="footer_contact">${window.t("footer_contact")}</h3><div class="footer-contact">
            <a href="${window.utils.whatsappURL("")}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i><span dir="ltr">+${window.utils.escapeHTML(config.WHATSAPP || "")}</span></a>
            <a href="${window.utils.telegramURL("")}" target="_blank" rel="noopener"><i data-lucide="send"></i><span dir="ltr">@${window.utils.escapeHTML(config.TELEGRAM || "")}</span></a>
            <button type="button" data-copy-cash><i data-lucide="wallet"></i><span dir="ltr">${window.utils.escapeHTML(config.CASH_NUMBER || "")}</span><small data-i18n="footer_copy">${window.t("footer_copy")}</small></button>
          </div></div>
          <div><h3 class="footer-title" data-i18n="footer_social">${window.t("footer_social")}</h3><div class="footer-social">${socials || `<span class="muted small">—</span>`}</div></div>
        </div>
        <div class="footer-bottom"><span>© 2026 DOMA STORE</span><span data-i18n="footer_disclaimer">${window.t("footer_disclaimer")}</span></div>
      </div>
    </footer>`;
  }

  function floatingMarkup(){
    return `<div class="floating-contact" aria-label="Quick contact">
      <a class="float-btn whatsapp" href="${window.utils.whatsappURL("")}" target="_blank" rel="noopener" aria-label="WhatsApp"><i data-lucide="message-circle"></i><span class="float-tooltip">WhatsApp</span></a>
      <a class="float-btn telegram" href="${window.utils.telegramURL("")}" target="_blank" rel="noopener" aria-label="Telegram"><i data-lucide="send"></i><span class="float-tooltip">Telegram</span></a>
    </div>`;
  }

  function setCurrency(currency){
    const selected = currency === "USD" ? "USD" : "EGP";
    localStorage.setItem("doma_currency", selected);
    document.querySelectorAll("[data-currency]").forEach(button => button.classList.toggle("active", button.dataset.currency === selected));
    window.dispatchEvent(new CustomEvent("doma:currency", {detail:{currency:selected}}));
    window.dispatchEvent(new CustomEvent("doma:rerender", {detail:{reason:"currency"}}));
  }

  function openDrawer(){
    document.querySelector("[data-mobile-drawer]")?.classList.add("open");
    document.querySelector("[data-drawer-overlay]")?.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer(){
    document.querySelector("[data-mobile-drawer]")?.classList.remove("open");
    document.querySelector("[data-drawer-overlay]")?.classList.remove("show");
    document.body.style.overflow = "";
  }

  async function copyCash(){
    const number = String(config.CASH_NUMBER || "");
    try {
      await navigator.clipboard.writeText(number);
      window.utils.toast(window.t("footer_copied"));
    } catch(error) {
      const temp = document.createElement("textarea");
      temp.value = number; temp.setAttribute("readonly", ""); temp.style.position = "fixed"; temp.style.opacity = "0";
      document.body.appendChild(temp); temp.select();
      try { document.execCommand("copy"); window.utils.toast(window.t("footer_copied")); }
      catch(copyError) { window.utils.toast(number); }
      temp.remove();
    }
  }

  function initReveal(){
    const items = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) { items.forEach(item => item.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, {threshold:.12});
    items.forEach(item => observer.observe(item));
  }

  function refreshShell(){
    document.querySelectorAll("[data-currency]").forEach(button => button.classList.toggle("active", button.dataset.currency === window.utils.currentCurrency()));
    window.utils.updateCounters();
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  document.addEventListener("DOMContentLoaded", function(){
    const headerHost = document.getElementById("site-header");
    if (headerHost) headerHost.innerHTML = headerMarkup();
    else document.body.insertAdjacentHTML("afterbegin", headerMarkup());

    const footerHost = document.getElementById("site-footer");
    if (footerHost) footerHost.innerHTML = footerMarkup();
    else document.body.insertAdjacentHTML("beforeend", footerMarkup());
    document.body.insertAdjacentHTML("beforeend", floatingMarkup());

    document.addEventListener("click", function(event){
      if (event.target.closest("[data-menu-open]")) openDrawer();
      if (event.target.closest("[data-menu-close]") || event.target.closest("[data-drawer-overlay]")) closeDrawer();
      const currencyButton = event.target.closest("[data-currency]");
      if (currencyButton) setCurrency(currencyButton.dataset.currency);
      if (event.target.closest("[data-lang-toggle]")) {
        const next = window.utils.currentLang() === "ar" ? "en" : "ar";
        window.setLang(next);
        closeDrawer();
      }
      if (event.target.closest("[data-copy-cash]")) copyCash();
    });
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeDrawer(); });

    if (!localStorage.getItem("doma_currency")) localStorage.setItem("doma_currency", config.DEFAULT_CURRENCY || "EGP");
    refreshShell();
    initReveal();
    if (window.utils.renderCompareBar) window.utils.renderCompareBar();
    if (window.lucide?.createIcons) window.lucide.createIcons();
  });

  window.addEventListener("doma:language", refreshShell);
  window.addEventListener("doma:currency", refreshShell);
  window.DOMA_LAYOUT = {setCurrency, openDrawer, closeDrawer, initReveal, refreshShell};
})();
