/* DOMA STORE contact forms, review listing and FAQ configuration. */
(function(){
  const utils = window.utils;
  const config = window.DOMA_CONFIG || {};
  const generatedMessages = { request: "", sell: "" };

  function esc(value){ return utils.escapeHTML(value ?? ""); }
  function tr(key){ return window.t(key); }
  function lang(){ return utils.currentLang() === "en" ? "en" : "ar"; }
  function translated(value){ return utils.t(value); }

  const tierLabels = {
    economy: { ar: "اقتصادي", en: "Economy" },
    mid: { ar: "متوسط", en: "Mid-range" },
    vip: { ar: "VIP", en: "VIP" }
  };
  const specLabels = {
    xsuit: { ar: "بدلات X-Suit", en: "X-Suits" },
    mythic: { ar: "أغراض ميثيك", en: "Mythic items" },
    glacier_lab: { ar: "جليشر / أسلحة مطورة", en: "Glacier / Lab weapons" },
    supercars: { ar: "سيارات مميزة", en: "Supercars" },
    conqueror: { ar: "كونكر", en: "Conqueror" },
    og: { ar: "مواسم قديمة / OG", en: "OG / old seasons" }
  };

  function normalizePhone(value){ return String(value || "").replace(/[^\d]/g, ""); }
  function validPhone(value){ const phone = normalizePhone(value); return phone.length >= 8 && phone.length <= 15; }

  function showInputError(input, key){
    input.setCustomValidity(tr(key));
    input.reportValidity();
    input.setCustomValidity("");
  }

  function openWhatsApp(message){
    const url = utils.whatsappURL(message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyText(message){
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      utils.toast(tr("copied"));
    } catch (error) {
      const field = document.createElement("textarea");
      field.value = message;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
        utils.toast(tr("copied"));
      } catch (copyError) {
        utils.toast(message);
      }
      field.remove();
    }
  }

  function setupContactLinks(){
    document.querySelectorAll("[data-contact-whatsapp]").forEach(link => {
      link.href = utils.whatsappURL("");
    });
    document.querySelectorAll("[data-contact-telegram]").forEach(link => {
      link.href = utils.telegramURL("");
    });
  }

  function requestMessage(form){
    const data = new FormData(form);
    const language = lang();
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const minBudget = Number(data.get("minBudget"));
    const maxBudget = Number(data.get("maxBudget"));
    const currency = data.get("currency") === "USD" ? "USD" : "EGP";
    const tier = String(data.get("tier") || "");
    const minimumLevel = String(data.get("minLevel") || "").trim();
    const version = String(data.get("version") || "");
    const specs = data.getAll("specs").map(value => specLabels[value]?.[language] || value);
    const notes = String(data.get("notes") || "").trim();
    const cash = amount => `${Number(amount).toLocaleString("en-US")} ${currency}`;

    if (language === "ar") {
      return [
        "طلب حساب جديد — DOMA STORE",
        `الاسم: ${name}`,
        `رقم واتساب: ${phone}`,
        `الميزانية: من ${cash(minBudget)} إلى ${cash(maxBudget)}`,
        `الفئة المفضلة: ${tier ? tierLabels[tier]?.ar || tier : "أي فئة"}`,
        `المواصفات المطلوبة: ${specs.length ? specs.join("، ") : "لا توجد مواصفات إلزامية"}`,
        `أقل مستوى: ${minimumLevel || "غير محدد"}`,
        `النسخة: ${version ? (version === "global" ? "عالمي" : "كوري") : "لا يهم"}`,
        notes ? `ملاحظات: ${notes}` : ""
      ].filter(Boolean).join("\n");
    }

    return [
      "New account request — DOMA STORE",
      `Name: ${name}`,
      `WhatsApp: ${phone}`,
      `Budget: ${cash(minBudget)} to ${cash(maxBudget)}`,
      `Preferred tier: ${tier ? tierLabels[tier]?.en || tier : "Any"}`,
      `Must-have specifications: ${specs.length ? specs.join(", ") : "No mandatory specifications"}`,
      `Minimum level: ${minimumLevel || "Not specified"}`,
      `Version: ${version ? version[0].toUpperCase() + version.slice(1) : "Any"}`,
      notes ? `Notes: ${notes}` : ""
    ].filter(Boolean).join("\n");
  }

  function sellMessage(form){
    const data = new FormData(form);
    const language = lang();
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const level = String(data.get("level") || "");
    const rank = String(data.get("rank") || "");
    const mythics = String(data.get("mythics") || "0");
    const xsuits = String(data.get("xsuits") || "0");
    const platform = String(data.get("platform") || "");
    const price = String(data.get("price") || "").trim();
    const items = String(data.get("items") || "").trim();
    const video = String(data.get("video") || "").trim();

    if (language === "ar") {
      return [
        "عرض بيع حساب — DOMA STORE",
        `الاسم: ${name}`,
        `رقم واتساب: ${phone}`,
        `المستوى: ${level}`,
        `الرتبة: ${rank}`,
        `أغراض الميثيك: ${mythics}`,
        `بدلات X-Suit: ${xsuits}`,
        `منصة الربط: ${platform}`,
        `السعر المتوقع: ${price ? `${Number(price).toLocaleString("en-US")} ${utils.currentCurrency()}` : "غير محدد"}`,
        `العناصر المهمة: ${items}`,
        `رابط الفيديو / الصور: ${video || "لم يتم إرفاق رابط"}`,
        "ملاحظة: لن أرسل كلمة المرور في هذا النموذج."
      ].join("\n");
    }

    return [
      "Account sale offer — DOMA STORE",
      `Name: ${name}`,
      `WhatsApp: ${phone}`,
      `Level: ${level}`,
      `Rank: ${rank}`,
      `Mythic items: ${mythics}`,
      `X-Suits: ${xsuits}`,
      `Linked platform: ${platform}`,
      `Expected price: ${price ? `${Number(price).toLocaleString("en-US")} ${utils.currentCurrency()}` : "Not specified"}`,
      `Key items: ${items}`,
      `Video / screenshots link: ${video || "No link provided"}`,
      "Note: I am not sharing a password in this form."
    ].join("\n");
  }

  function handleRequestSubmit(form){
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const phone = form.elements.phone;
    if (!validPhone(phone.value)) { showInputError(phone, "invalid_phone"); return; }

    const min = Number(form.elements.minBudget.value);
    const max = Number(form.elements.maxBudget.value);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min) {
      utils.toast(tr("invalid_budget"));
      form.elements.maxBudget.focus();
      return;
    }

    const message = requestMessage(form);
    generatedMessages.request = message;
    const actions = document.getElementById("request-message-actions");
    if (actions) actions.hidden = false;
    openWhatsApp(message);
    utils.toast(tr("form_success"));
  }

  function handleSellSubmit(form){
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const phone = form.elements.phone;
    if (!validPhone(phone.value)) { showInputError(phone, "invalid_phone"); return; }

    const video = String(form.elements.video.value || "").trim();
    if (video) {
      try {
        const parsed = new URL(video);
        if (!/^https?:$/.test(parsed.protocol)) throw new Error("Unsupported protocol");
      } catch (error) {
        form.elements.video.setCustomValidity(lang() === "ar" ? "أدخل رابطًا صحيحًا يبدأ بـ https:// أو http://" : "Enter a valid http:// or https:// link.");
        form.elements.video.reportValidity();
        form.elements.video.setCustomValidity("");
        return;
      }
    }

    const message = sellMessage(form);
    generatedMessages.sell = message;
    const actions = document.getElementById("sell-message-actions");
    if (actions) actions.hidden = false;
    openWhatsApp(message);
    utils.toast(tr("form_success"));
  }

  function renderReviews(){
    const grid = document.getElementById("reviews-grid");
    if (!grid) return;

    const reviews = Array.isArray(window.REVIEWS) ? window.REVIEWS : [];
    const validRatings = reviews.map(review => Math.max(0, Math.min(5, Number(review.rating) || 0)));
    const average = validRatings.length
      ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
      : 0;

    const averageNode = document.getElementById("reviews-average");
    const countNode = document.getElementById("reviews-count");
    const starsHost = document.getElementById("reviews-summary-stars");
    if (averageNode) averageNode.textContent = reviews.length ? average.toFixed(1) : "—";
    if (countNode) countNode.textContent = utils.formatNumber(reviews.length);
    if (starsHost) {
      starsHost.innerHTML = Array.from({length:5}, (_,index) =>
        `<i data-lucide="star" aria-hidden="true" class="${index < Math.round(average) ? "filled" : ""}"></i>`
      ).join("");
    }

    grid.innerHTML = reviews.map(review => {
      const name = translated(review.name);
      const city = translated(review.city);
      const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));
      const first = Array.from(String(name || "?").trim())[0] || "?";
      const sample = review.placeholder && config.SHOW_SAMPLE_BADGE
        ? `<span class="badge badge-sample">${esc(tr("sample"))}</span>`
        : "";
      const date = review.date ? new Date(`${review.date}T12:00:00`) : null;
      const formattedDate = date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString(lang() === "ar" ? "ar-EG" : "en-US", {year:"numeric",month:"short",day:"numeric"})
        : "";
      const stars = Array.from({length:5}, (_,index) =>
        `<i data-lucide="star" aria-hidden="true" class="${index < rating ? "filled" : ""}"></i>`
      ).join("");
      return `
        <article class="review-card">
          <i class="review-quote" data-lucide="quote" aria-hidden="true"></i>
          <div class="review-top">
            <span class="review-avatar" aria-hidden="true">${esc(first)}</span>
            <div><div class="review-name">${esc(name)}</div><div class="review-meta">${esc(city)}</div></div>
            ${sample}
          </div>
          <div class="review-stars" aria-label="${rating} / 5">${stars}</div>
          <p class="review-text">${esc(translated(review.text))}</p>
          <time class="review-date" datetime="${esc(review.date || "")}">${esc(formattedDate)}</time>
        </article>
      `;
    }).join("");

    const sampleNote = document.getElementById("reviews-sample-note");
    if (sampleNote) {
      sampleNote.hidden = !(config.SHOW_SAMPLE_BADGE && reviews.some(review => review.placeholder));
    }
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  function renderFaqWarranty(){
    const node = document.getElementById("faq-warranty-days");
    if (!node) return;
    const days = Math.max(0, Number(config.WARRANTY_DAYS) || 0);
    node.textContent = `${utils.formatNumber(days)} ${tr("days")}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupContactLinks();
    const requestForm = document.getElementById("request-form");
    const sellForm = document.getElementById("sell-form");
    const requestCurrency = document.getElementById("request-currency");
    if (requestCurrency && ["EGP", "USD"].includes(utils.currentCurrency())) {
      requestCurrency.value = utils.currentCurrency();
    }

    requestForm?.addEventListener("submit", event => {
      event.preventDefault();
      handleRequestSubmit(requestForm);
    });
    sellForm?.addEventListener("submit", event => {
      event.preventDefault();
      handleSellSubmit(sellForm);
    });

    renderReviews();
    renderFaqWarranty();

    window.onLangChange = () => {
      renderReviews();
      renderFaqWarranty();
      setupContactLinks();
    };
  });

  document.addEventListener("click", event => {
    const copyButton = event.target.closest("[data-copy-form-message]");
    if (!copyButton) return;
    copyText(generatedMessages[copyButton.dataset.copyFormMessage] || "");
  });
})();
