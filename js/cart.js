/* DOMA STORE commerce UI. Checkout is a demo only: no payment is collected or stored. */
(function(){
  const utils = window.utils;
  const config = window.DOMA_CONFIG || {};
  const cartHost = document.getElementById("cart-content");
  const checkoutHost = document.getElementById("checkout-content");
  const checkoutState = { items: [], customerName: "", success: false };
  let isRenderingCheckout = false;

  function esc(value){ return utils.escapeHTML(value ?? ""); }
  function tr(key){ return window.t(key); }
  function lang(){ return utils.currentLang() === "en" ? "en" : "ar"; }
  function accountTitle(account){ return utils.t(account.title); }

  function pricePlainEGP(amount){
    const value = Math.round(Number(amount) || 0).toLocaleString("en-US");
    return lang() === "ar" ? `${value} ج.م` : `EGP ${value}`;
  }

  function pricePlainUSD(amount){
    const rate = Number(config.USD_RATE) || 50;
    return `$${Math.round((Number(amount) || 0) / rate).toLocaleString("en-US")}`;
  }

  function totalBlock(amount){
    return `<div class="price-main">${utils.formatPrice(amount)}</div>`;
  }

  function thumb(account){
    const video = account.video || {};
    if (video.type === "youtube" && video.src && /^[\w-]{6,}$/.test(video.src)) {
      return `<img loading="lazy" src="https://i.ytimg.com/vi/${esc(video.src)}/hqdefault.jpg" alt="${esc(accountTitle(account))}">`;
    }
    if (video.type === "mp4" && video.src) {
      return `<video muted playsinline preload="none" src="${esc(video.src)}" aria-label="${esc(accountTitle(account))}"></video>`;
    }
    return `<div class="cart-thumb media-placeholder" aria-hidden="true"><i data-lucide="circle-play"></i></div>`;
  }

  function availableCartAccounts(){
    const saved = utils.getCart();
    const valid = saved.filter(id => {
      const account = utils.getAccount(id);
      return account && account.status === "available";
    });
    if (valid.length !== saved.length) {
      utils.saveCart(valid);
      utils.toast(lang() === "ar"
        ? "تم حذف الحسابات التي لم تعد متاحة من السلة."
        : "Accounts that are no longer available were removed from your cart.");
    }
    return valid.map(id => utils.getAccount(id)).filter(Boolean);
  }

  function cartRow(account){
    return `
      <article class="cart-row" data-cart-row="${esc(account.id)}">
        <a class="cart-row-media" href="account.html?id=${encodeURIComponent(account.id)}" aria-label="${esc(accountTitle(account))}">
          ${thumb(account)}
        </a>
        <div class="cart-row-info">
          <a class="cart-row-title" href="account.html?id=${encodeURIComponent(account.id)}">${esc(accountTitle(account))}</a>
          <div class="cart-row-meta"><span class="display">${esc(account.id)}</span> · ${utils.tierBadge(account.tier)}</div>
          <div class="price-main cart-row-price">${utils.formatPrice(account.priceEGP)}</div>
        </div>
        <button class="icon-btn cart-remove" type="button" data-cart-remove="${esc(account.id)}" aria-label="${esc(tr("item_remove"))}" title="${esc(tr("item_remove"))}">
          <i data-lucide="trash-2" aria-hidden="true"></i>
        </button>
      </article>
    `;
  }

  function renderCart(){
    if (!cartHost) return;
    const accounts = availableCartAccounts();

    if (!accounts.length) {
      cartHost.innerHTML = `
        <div class="empty-state">
          <i data-lucide="shopping-cart" aria-hidden="true"></i>
          <h2>${esc(tr("cart_empty"))}</h2>
          <p>${esc(tr("cart_empty_text"))}</p>
          <a class="btn btn-primary" href="store.html">${esc(tr("continue_shopping"))}</a>
        </div>
      `;
      refreshIcons();
      return;
    }

    const subtotal = accounts.reduce((sum, account) => sum + (Number(account.priceEGP) || 0), 0);

    cartHost.innerHTML = `
      <div class="commerce-layout">
        <section class="cart-list" aria-label="${esc(tr("cart_heading"))}">
          ${accounts.map(cartRow).join("")}
        </section>

        <aside class="cart-summary">
          <h2>${esc(tr("order_summary"))}</h2>
          <div class="summary-line"><span>${esc(tr("subtotal"))} (${accounts.length})</span><strong>${pricePlainEGP(subtotal)}</strong></div>
          <div class="summary-line"><span>${lang() === "ar" ? "بالدولار" : "In USD"}</span><strong>${pricePlainUSD(subtotal)}</strong></div>
          <div class="summary-line total"><span>${esc(tr("total"))}</span><strong>${totalBlock(subtotal)}</strong></div>
          <div class="summary-actions">
            <a class="btn btn-primary btn-block" href="checkout.html"><i data-lucide="shopping-bag" aria-hidden="true"></i><span>${esc(tr("proceed_checkout"))}</span></a>
            <a class="btn btn-ice btn-block" href="store.html">${esc(tr("continue_shopping"))}</a>
          </div>
        </aside>
      </div>
    `;
    refreshIcons();
  }

  function checkoutSummaryMarkup(accounts){
    if (!accounts.length) {
      return `
        <div class="empty-state">
          <i data-lucide="shopping-cart" aria-hidden="true"></i>
          <h2>${esc(tr("cart_empty"))}</h2>
          <p>${esc(tr("cart_empty_text"))}</p>
          <a class="btn btn-primary" href="store.html">${esc(tr("back_to_store"))}</a>
        </div>
      `;
    }
    const subtotal = accounts.reduce((sum, account) => sum + (Number(account.priceEGP) || 0), 0);
    return `
      <aside class="cart-summary checkout-summary">
        <h2>${esc(tr("order_summary"))}</h2>
        <div class="checkout-summary-items">
          ${accounts.map(account => `
            <div class="summary-line checkout-summary-item">
              <span><strong>${esc(account.id)}</strong><br>${esc(accountTitle(account))}</span>
              <strong>${pricePlainEGP(account.priceEGP)}</strong>
            </div>
          `).join("")}
        </div>
        <div class="summary-line"><span>${esc(tr("subtotal"))}</span><strong>${pricePlainEGP(subtotal)}</strong></div>
        <div class="summary-line"><span>${lang() === "ar" ? "بالدولار" : "In USD"}</span><strong>${pricePlainUSD(subtotal)}</strong></div>
        <div class="summary-line total"><span>${esc(tr("total"))}</span><strong>${totalBlock(subtotal)}</strong></div>
      </aside>
    `;
  }

  function checkoutFormMarkup(accounts){
    return `
      <div class="checkout-columns">
        <section class="form-card">
          <form id="checkout-form" novalidate>
            <h2>${esc(tr("your_details"))}</h2>
            <div class="form-grid">
              <div class="field">
                <label for="checkout-name">${esc(tr("full_name"))}</label>
                <input id="checkout-name" name="name" type="text" maxlength="80" autocomplete="name" required>
              </div>
              <div class="field">
                <label for="checkout-phone">${esc(tr("whatsapp_number"))}</label>
                <input id="checkout-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" required>
              </div>
              <div class="field">
                <label for="checkout-telegram">${esc(tr("telegram_username"))}</label>
                <input id="checkout-telegram" name="telegram" type="text" maxlength="64" placeholder="@username">
              </div>
              <div class="field">
                <label for="checkout-notes">${esc(tr("notes"))}</label>
                <textarea id="checkout-notes" name="notes" maxlength="1000" rows="3"></textarea>
              </div>
            </div>

            <hr class="divider">
            <h2>${esc(tr("payment"))}</h2>
            <div class="payment-notice" role="note">${esc(tr("payment_demo_notice"))}</div>
            <div class="payment-options">
              <div class="payment-option" aria-disabled="true"><i data-lucide="wallet" aria-hidden="true"></i><div><strong>${esc(tr("vodafone_cash"))}</strong><small>${esc(tr("coming_soon"))}</small></div></div>
              <div class="payment-option" aria-disabled="true"><i data-lucide="coins" aria-hidden="true"></i><div><strong>${esc(tr("instapay"))}</strong><small>${esc(tr("coming_soon"))}</small></div></div>
              <div class="payment-option" aria-disabled="true"><i data-lucide="credit-card" aria-hidden="true"></i><div><strong>${esc(tr("bank_card"))}</strong><small>${esc(tr("coming_soon"))}</small></div></div>
            </div>
            <div id="payment-slot"></div>
            <!-- FUTURE: mount the real payment integration here -->

            <div class="form-actions">
              <button class="btn btn-primary" type="submit"><i data-lucide="check" aria-hidden="true"></i><span>${esc(tr("confirm_demo"))}</span></button>
              <button class="btn btn-whatsapp" type="button" id="send-order-whatsapp"><i data-lucide="message-circle" aria-hidden="true"></i><span>${esc(tr("send_order_whatsapp"))}</span></button>
            </div>
          </form>
        </section>
        <div id="checkout-summary">${checkoutSummaryMarkup(accounts)}</div>
      </div>
    `;
  }

  function currentAvailableCheckoutAccounts(){
    return availableCartAccounts();
  }

  function makeOrderMessage(accounts, customer){
    const total = accounts.reduce((sum, account) => sum + (Number(account.priceEGP) || 0), 0);
    const lines = accounts.map(account => `• ${account.id} — ${accountTitle(account)} — ${pricePlainEGP(account.priceEGP)}`);
    if (lang() === "ar") {
      return [
        "طلب جديد من DOMA STORE (تجريبي)",
        `الاسم: ${customer.name}`,
        `رقم واتساب: ${customer.phone}`,
        customer.telegram ? `تليجرام: ${customer.telegram}` : "",
        "الحسابات:", ...lines,
        `الإجمالي: ${pricePlainEGP(total)} / ${pricePlainUSD(total)}`,
        customer.notes ? `ملاحظات: ${customer.notes}` : "",
        "ملاحظة: لم يتم الدفع من خلال الموقع. هذه رسالة طلب فقط."
      ].filter(Boolean).join("\n");
    }
    return [
      "New DOMA STORE order inquiry (demo)",
      `Name: ${customer.name}`,
      `WhatsApp: ${customer.phone}`,
      customer.telegram ? `Telegram: ${customer.telegram}` : "",
      "Accounts:", ...lines,
      `Total: ${pricePlainEGP(total)} / ${pricePlainUSD(total)}`,
      customer.notes ? `Notes: ${customer.notes}` : "",
      "Note: No payment was made through the website. This is an order inquiry only."
    ].filter(Boolean).join("\n");
  }

  function normalizePhone(value){ return String(value || "").replace(/[^\d]/g, ""); }

  function validateCheckoutForm(form){
    if (!form.checkValidity()) { form.reportValidity(); return null; }
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = normalizePhone(data.get("phone"));
    if (phone.length < 8 || phone.length > 15) {
      const input = form.elements.phone;
      input.setCustomValidity(tr("invalid_phone"));
      input.reportValidity();
      input.setCustomValidity("");
      return null;
    }
    return {
      name,
      phone,
      telegram: String(data.get("telegram") || "").trim(),
      notes: String(data.get("notes") || "").trim()
    };
  }

  function renderCheckoutSuccess(){
    const accounts = checkoutState.items;
    const subtotal = accounts.reduce((sum, account) => sum + (Number(account.priceEGP) || 0), 0);
    checkoutHost.innerHTML = `
      <section class="success-panel">
        <i data-lucide="badge-check" aria-hidden="true"></i>
        <h2>${esc(tr("order_success"))}</h2>
        <p>${esc(tr("order_demo_note"))}</p>
        <div class="cart-summary" style="text-align:start;margin-top:22px">
          <h3>${esc(tr("order_summary"))}</h3>
          ${accounts.map(account => `<div class="summary-line"><span>${esc(account.id)} — ${esc(accountTitle(account))}</span><strong>${pricePlainEGP(account.priceEGP)}</strong></div>`).join("")}
          <div class="summary-line total"><span>${esc(tr("total"))}</span><strong>${totalBlock(subtotal)}</strong></div>
        </div>
        <div class="form-actions" style="justify-content:center">
          <a class="btn btn-ice" href="store.html">${esc(tr("continue_shopping"))}</a>
        </div>
      </section>
    `;
    refreshIcons();
  }

  function renderCheckout(){
    if (!checkoutHost || isRenderingCheckout) return;
    isRenderingCheckout = true;

    const buyId = new URLSearchParams(location.search).get("buy");
    if (buyId) {
      const buyAccount = utils.getAccount(buyId);
      if (buyAccount && buyAccount.status === "available") {
        utils.saveCart([buyAccount.id]);
      } else {
        utils.saveCart([]);
        utils.toast(lang() === "ar" ? "هذا الحساب غير متاح للشراء." : "This account is not available for purchase.");
      }
      history.replaceState({}, "", location.pathname);
    }

    const accounts = currentAvailableCheckoutAccounts();
    checkoutState.items = accounts;
    checkoutState.success = false;

    if (!accounts.length) {
      checkoutHost.innerHTML = checkoutSummaryMarkup(accounts);
      refreshIcons();
      isRenderingCheckout = false;
      return;
    }

    checkoutHost.innerHTML = checkoutFormMarkup(accounts);
    bindCheckoutActions();
    refreshIcons();
    isRenderingCheckout = false;
  }

  function updateCheckoutSummary(){
    const summary = document.getElementById("checkout-summary");
    if (!summary) return;
    summary.innerHTML = checkoutSummaryMarkup(currentAvailableCheckoutAccounts());
    refreshIcons();
  }

  function bindCheckoutActions(){
    const form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", event => {
      event.preventDefault();
      const latest = currentAvailableCheckoutAccounts();
      if (!latest.length || latest.length !== checkoutState.items.length) {
        renderCheckout();
        utils.toast(lang() === "ar" ? "تغيرت حالة أحد الحسابات. راجع السلة." : "An account status changed. Please review your cart.");
        return;
      }
      const customer = validateCheckoutForm(form);
      if (!customer) return;
      checkoutState.items = latest;
      checkoutState.customerName = customer.name;
      checkoutState.success = true;
      utils.toast(tr("demo_mode"));
      renderCheckoutSuccess();
    });

    document.getElementById("send-order-whatsapp")?.addEventListener("click", () => {
      const customer = validateCheckoutForm(form);
      if (!customer) return;
      const latest = currentAvailableCheckoutAccounts();
      if (!latest.length) { renderCheckout(); return; }
      const message = makeOrderMessage(latest, customer);
      const target = utils.whatsappURL(message);
      window.open(target, "_blank", "noopener,noreferrer");
      utils.toast(tr("message_opening"));
    });
  }

  function refreshIcons(){
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  document.addEventListener("click", event => {
    const remove = event.target.closest("[data-cart-remove]");
    if (remove) {
      utils.removeFromCart(remove.dataset.cartRemove);
      utils.toast(lang() === "ar" ? "تم حذف الحساب من السلة." : "Account removed from cart.");
      renderCart();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (cartHost) {
      window.onLangChange = renderCart;
      renderCart();
    }
    if (checkoutHost) {
      window.onLangChange = () => {
        if (checkoutState.success) renderCheckoutSuccess();
        else updateCheckoutSummary();
      };
      renderCheckout();
    }
  });

  window.addEventListener("doma:cart", () => {
    if (cartHost) renderCart();
    if (checkoutHost && !checkoutState.success && !isRenderingCheckout) renderCheckout();
  });
  window.addEventListener("doma:currency", () => {
    if (cartHost) renderCart();
    if (checkoutHost) {
      if (checkoutState.success) renderCheckoutSuccess();
      else updateCheckoutSummary();
    }
  });
  window.addEventListener("doma:rerender", () => {
    if (cartHost) renderCart();
    if (checkoutHost) {
      if (checkoutState.success) renderCheckoutSuccess();
      else updateCheckoutSummary();
    }
  });
})();
