/* DOMA STORE: filters, sorting, URL state and paginated account cards. */
(function(){
  const config = window.DOMA_CONFIG || {};
  const utils = window.utils;
  const MIN_PRICE = Number(config.PRICE_MIN_EGP) || 500;
  const MAX_PRICE = Number(config.PRICE_MAX_EGP) || 100000;
  const PRICE_STEP = Number(config.PRICE_STEP_EGP) || 500;
  const PAGE_SIZE = 12;
  const RANKS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Crown", "Ace", "Ace Master", "Ace Dominator", "Conqueror"];
  const CATEGORIES = [
    ["xsuit", "zap", "xsuit"],
    ["mythic", "gem", "mythic"],
    ["labweapons", "swords", "gun_labs"],
    ["vehicles", "car", "vehicles"],
    ["highrank", "trophy", "category_rank"],
    ["og", "history", "og"]
  ];

  const defaultState = () => ({
    q: "", sort: "newest", minPrice: MIN_PRICE, maxPrice: MAX_PRICE,
    tiers: [], cats: [], rank: "", minLevel: "", maxLevel: "",
    version: "", link: "", available: true, minMythics: 0, minXSuits: 0
  });

  let state = defaultState();
  let visibleCount = PAGE_SIZE;
  let allFiltered = [];
  let isInitialized = false;

  function lang(){ return utils.currentLang() === "en" ? "en" : "ar"; }
  function text(key){ return window.t(key); }
  function safeNum(value, fallback){
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }
  function localizedPrice(value){
    const amount = Math.max(0, Number(value) || 0);
    const language = lang();
    if (utils.currentCurrency() === "USD") {
      const usd = Math.round(amount / (Number(config.USD_RATE) || 50));
      return "$" + utils.formatNumber(usd);
    }
    return language === "ar" ? utils.formatNumber(amount) + " ج.م" : "EGP " + utils.formatNumber(amount);
  }
  function translatedRank(rank){
    const key = "rank_" + String(rank || "").toLowerCase().replace(/[^a-z]+/g, "_");
    return window.I18N?.[lang()]?.[key] || rank || "—";
  }

  function checkboxOptions(name, choices, selected, suffix){
    return choices.map(choice => {
      const [value, key, icon] = choice;
      const checked = selected.includes(value) ? " checked" : "";
      const prefix = icon ? `<i data-lucide="${utils.escapeHTML(icon)}" aria-hidden="true"></i>` : "";
      return `<label class="check-option">${prefix}<input type="checkbox" data-filter-check="${utils.escapeHTML(name)}" value="${utils.escapeHTML(value)}"${checked}><span>${utils.escapeHTML(text(key))}</span></label>`;
    }).join("");
  }

  function filtersMarkup(suffix){
    const ranks = [`<option value="">${utils.escapeHTML(text("all_ranks"))}</option>`]
      .concat(RANKS.map(rank => `<option value="${utils.escapeHTML(rank)}">${utils.escapeHTML(translatedRank(rank))}</option>`)).join("");
    const tiers = [
      ["economy", "tier_economy"], ["mid", "tier_mid"], ["vip", "tier_vip"]
    ];
    const categoryChoices = CATEGORIES.map(([value,icon,key]) => [value,key,icon]);
    const currencyMin = localizedPrice(state.minPrice);
    const currencyMax = localizedPrice(state.maxPrice);
    return `
      <div class="filters-panel" data-filter-panel="${suffix}">
        <div class="filter-group">
          <h3 class="filter-title"><i data-lucide="wallet" aria-hidden="true"></i>${utils.escapeHTML(text("price_range"))}</h3>
          <div class="range-labels"><span data-price-label="min">${utils.escapeHTML(currencyMin)}</span><span data-price-label="max">${utils.escapeHTML(currencyMax)}</span></div>
          <div class="range-slider" data-range-slider>
            <div class="range-track"></div><div class="range-fill" data-range-fill></div>
            <input type="range" min="${MIN_PRICE}" max="${MAX_PRICE}" step="${PRICE_STEP}" value="${state.minPrice}" data-filter-value="minPrice" aria-label="Minimum price">
            <input type="range" min="${MIN_PRICE}" max="${MAX_PRICE}" step="${PRICE_STEP}" value="${state.maxPrice}" data-filter-value="maxPrice" aria-label="Maximum price">
          </div>
          <div class="preset-chips">
            <button type="button" data-price-preset="under5000">${utils.escapeHTML(text("under_5000"))}</button>
            <button type="button" data-price-preset="5000-20000">${utils.escapeHTML(text("range_5000_20000"))}</button>
            <button type="button" data-price-preset="20000-50000">${utils.escapeHTML(text("range_20000_50000"))}</button>
            <button type="button" data-price-preset="over50000">${utils.escapeHTML(text("over_50000"))}</button>
          </div>
        </div>

        <div class="filter-group">
          <h3 class="filter-title"><i data-lucide="layers" aria-hidden="true"></i>${utils.escapeHTML(text("tier"))}</h3>
          <div class="filter-checks">${checkboxOptions("tiers", tiers, state.tiers, suffix)}</div>
        </div>

        <div class="filter-group">
          <h3 class="filter-title"><i data-lucide="filter" aria-hidden="true"></i>${utils.escapeHTML(text("categories"))}</h3>
          <div class="filter-checks">${checkboxOptions("cats", categoryChoices, state.cats, suffix)}</div>
        </div>

        <div class="filter-group">
          <label class="filter-title" for="rank-${suffix}"><i data-lucide="trophy" aria-hidden="true"></i>${utils.escapeHTML(text("rank"))}</label>
          <select class="number-input" id="rank-${suffix}" data-filter-value="rank">${ranks}</select>
        </div>

        <div class="filter-group">
          <h3 class="filter-title"><i data-lucide="gauge" aria-hidden="true"></i>${utils.escapeHTML(text("level"))}</h3>
          <div class="filter-number-row">
            <label class="field"><span class="small muted">${utils.escapeHTML(text("min_level"))}</span><input class="number-input" type="number" min="1" max="100" inputmode="numeric" placeholder="1" value="${utils.escapeHTML(state.minLevel)}" data-filter-value="minLevel"></label>
            <label class="field"><span class="small muted">${utils.escapeHTML(text("max_level"))}</span><input class="number-input" type="number" min="1" max="100" inputmode="numeric" placeholder="100" value="${utils.escapeHTML(state.maxLevel)}" data-filter-value="maxLevel"></label>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-title" for="version-${suffix}"><i data-lucide="layers" aria-hidden="true"></i>${utils.escapeHTML(text("version"))}</label>
          <select class="number-input" id="version-${suffix}" data-filter-value="version">
            <option value="">—</option><option value="global">${utils.escapeHTML(text("global"))}</option><option value="korea">${utils.escapeHTML(text("korea"))}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-title" for="link-${suffix}"><i data-lucide="user" aria-hidden="true"></i>${utils.escapeHTML(text("linked_platform"))}</label>
          <select class="number-input" id="link-${suffix}" data-filter-value="link">
            <option value="">—</option><option value="facebook">${utils.escapeHTML(text("facebook"))}</option><option value="twitter">${utils.escapeHTML(text("twitter"))}</option><option value="google">${utils.escapeHTML(text("google"))}</option><option value="gmail">${utils.escapeHTML(text("gmail"))}</option><option value="other">${utils.escapeHTML(text("other"))}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="check-option"><input type="checkbox" data-filter-value="available" ${state.available ? "checked" : ""}><span>${utils.escapeHTML(text("show_available"))}</span></label>
        </div>

        <div class="filter-group">
          <h3 class="filter-title"><i data-lucide="gem" aria-hidden="true"></i>${utils.escapeHTML(text("min_mythics"))}</h3>
          <input class="number-input" type="number" min="0" max="500" value="${state.minMythics}" data-filter-value="minMythics" aria-label="${utils.escapeHTML(text("min_mythics"))}">
        </div>

        <div class="filter-group">
          <h3 class="filter-title"><i data-lucide="zap" aria-hidden="true"></i>${utils.escapeHTML(text("min_xsuits"))}</h3>
          <input class="number-input" type="number" min="0" max="30" value="${state.minXSuits}" data-filter-value="minXSuits" aria-label="${utils.escapeHTML(text("min_xsuits"))}">
        </div>

        <div class="filter-sheet-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-filter-reset><i data-lucide="rotate-ccw" aria-hidden="true"></i>${utils.escapeHTML(text("reset"))}</button>
        </div>
      </div>`;
  }

  function readURLState(){
    const params = new URLSearchParams(location.search);
    const next = defaultState();
    next.q = params.get("q") || "";
    next.sort = params.get("sort") || "newest";
    const tier = params.get("tier");
    if (tier) next.tiers = tier.split(",").filter(value => ["economy","mid","vip"].includes(value));
    const cat = params.get("cat");
    if (cat) {
      const categoryValues = cat.split(",");
      categoryValues.forEach(value => {
        if (["economy","mid","vip"].includes(value) && !next.tiers.includes(value)) next.tiers.push(value);
        else if (CATEGORIES.some(item => item[0] === value) && !next.cats.includes(value)) next.cats.push(value);
      });
    }
    const min = params.get("min");
    const max = params.get("max");
    if (min !== null) next.minPrice = Math.max(MIN_PRICE, Math.min(MAX_PRICE, safeNum(min, MIN_PRICE)));
    if (max !== null) next.maxPrice = Math.max(MIN_PRICE, Math.min(MAX_PRICE, safeNum(max, MAX_PRICE)));
    if (next.minPrice > next.maxPrice) [next.minPrice, next.maxPrice] = [next.maxPrice, next.minPrice];
    next.rank = params.get("rank") || "";
    next.minLevel = params.get("minLevel") || "";
    next.maxLevel = params.get("maxLevel") || "";
    next.version = params.get("version") || "";
    next.link = params.get("link") || "";
    next.available = params.get("available") === "0" ? false : true;
    next.minMythics = Math.max(0, safeNum(params.get("mythics"), 0));
    next.minXSuits = Math.max(0, safeNum(params.get("xsuits"), 0));
    return next;
  }

  function writeURLState(){
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.sort !== "newest") params.set("sort", state.sort);
    if (state.tiers.length) params.set("tier", state.tiers.join(","));
    if (state.cats.length) params.set("cat", state.cats.join(","));
    if (state.minPrice !== MIN_PRICE) params.set("min", String(state.minPrice));
    if (state.maxPrice !== MAX_PRICE) params.set("max", String(state.maxPrice));
    if (state.rank) params.set("rank", state.rank);
    if (state.minLevel) params.set("minLevel", state.minLevel);
    if (state.maxLevel) params.set("maxLevel", state.maxLevel);
    if (state.version) params.set("version", state.version);
    if (state.link) params.set("link", state.link);
    if (!state.available) params.set("available", "0");
    if (state.minMythics) params.set("mythics", String(state.minMythics));
    if (state.minXSuits) params.set("xsuits", String(state.minXSuits));
    const query = params.toString();
    history.replaceState({}, "", location.pathname + (query ? "?" + query : "") + location.hash);
  }

  function renderFilterPanels(){
    const desktop = document.getElementById("desktop-filters");
    const mobile = document.getElementById("mobile-filters");
    if (desktop) desktop.innerHTML = filtersMarkup("desktop");
    if (mobile) mobile.innerHTML = filtersMarkup("mobile");
    syncControls();
  }

  function syncControls(){
    document.querySelectorAll("[data-filter-value]").forEach(control => {
      const key = control.dataset.filterValue;
      if (!(key in state)) return;
      if (control.type === "checkbox") control.checked = Boolean(state[key]);
      else control.value = state[key];
    });
    document.querySelectorAll("[data-filter-check]").forEach(control => {
      const values = state[control.dataset.filterCheck] || [];
      control.checked = values.includes(control.value);
    });
    document.querySelectorAll("[data-price-label='min']").forEach(node => node.textContent = localizedPrice(state.minPrice));
    document.querySelectorAll("[data-price-label='max']").forEach(node => node.textContent = localizedPrice(state.maxPrice));
    document.querySelectorAll("[data-range-fill]").forEach(fill => {
      const left = ((state.minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
      const right = ((state.maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
      fill.style.left = left + "%";
      fill.style.width = Math.max(0, right - left) + "%";
    });
    updatePresetState();
  }

  function updatePresetState(){
    document.querySelectorAll("[data-price-preset]").forEach(button => {
      const key = button.dataset.pricePreset;
      const active = (key === "under5000" && state.minPrice === MIN_PRICE && state.maxPrice <= Math.min(5000, MAX_PRICE)) ||
        (key === "5000-20000" && state.minPrice === Math.max(MIN_PRICE,5000) && state.maxPrice === Math.min(MAX_PRICE,20000)) ||
        (key === "20000-50000" && state.minPrice === Math.max(MIN_PRICE,20000) && state.maxPrice === Math.min(MAX_PRICE,50000)) ||
        (key === "over50000" && state.minPrice >= Math.max(MIN_PRICE,50000) && state.maxPrice === MAX_PRICE);
      button.classList.toggle("active", active);
    });
  }

  function accountMatchesCategory(account, category){
    const tags = Array.isArray(account.tags) ? account.tags : [];
    if (category === "xsuit") return tags.includes("xsuit") || (account.xSuits || []).length > 0;
    if (category === "mythic") return tags.includes("mythic") || Number(account.mythicCount) >= 50;
    if (category === "labweapons") return tags.includes("labweapons") || Number(account.gunLabs) > 0 || (account.weapons || []).length > 0;
    if (category === "vehicles") return tags.includes("vehicles") || (account.vehicles || []).length > 0;
    if (category === "highrank") return tags.includes("highrank") || ["Ace","Ace Master","Ace Dominator","Conqueror"].includes(account.rank);
    if (category === "og") return tags.includes("og");
    return true;
  }

  function accountSearchText(account){
    const searchable = [
      account.id, utils.t(account.title), account.title?.ar, account.title?.en,
      account.rank, account.link, account.version, account.tags,
      account.description?.ar, account.description?.en,
      (account.weapons || []).map(item => item.name),
      (account.xSuits || []).map(item => item.name), account.vehicles, account.outfits, account.extras
    ];
    return JSON.stringify(searchable).toLocaleLowerCase();
  }

  function filterAccounts(){
    const query = state.q.trim().toLocaleLowerCase();
    let results = (window.ACCOUNTS || []).filter(account => {
      const price = Number(account.priceEGP) || 0;
      const xSuitCount = (account.xSuits || []).length;
      if (price < state.minPrice || price > state.maxPrice) return false;
      if (state.tiers.length && !state.tiers.includes(account.tier)) return false;
      if (state.cats.some(category => !accountMatchesCategory(account, category))) return false;
      if (state.rank && account.rank !== state.rank) return false;
      if (state.minLevel !== "" && Number(account.level) < Number(state.minLevel)) return false;
      if (state.maxLevel !== "" && Number(account.level) > Number(state.maxLevel)) return false;
      if (state.version && account.version !== state.version) return false;
      if (state.link && account.link !== state.link) return false;
      if (state.available && account.status !== "available") return false;
      if (Number(account.mythicCount) < Number(state.minMythics)) return false;
      if (xSuitCount < Number(state.minXSuits)) return false;
      if (query && !accountSearchText(account).includes(query)) return false;
      return true;
    });

    results.sort((a,b) => {
      if (state.sort === "price-asc") return Number(a.priceEGP) - Number(b.priceEGP);
      if (state.sort === "price-desc") return Number(b.priceEGP) - Number(a.priceEGP);
      if (state.sort === "level") return Number(b.level) - Number(a.level);
      if (state.sort === "mythics") return Number(b.mythicCount) - Number(a.mythicCount);
      return String(b.addedAt || "").localeCompare(String(a.addedAt || ""));
    });
    return results;
  }

  function renderActiveFilters(){
    const host = document.getElementById("active-filters");
    if (!host) return;
    const chips = [];
    if (state.q) chips.push(["q", `${text("search_label")}: ${state.q}`]);
    state.tiers.forEach(value => chips.push(["tiers:" + value, text(value === "vip" ? "tier_vip" : value === "mid" ? "tier_mid" : "tier_economy")]));
    state.cats.forEach(value => {
      const row = CATEGORIES.find(item => item[0] === value);
      chips.push(["cats:" + value, row ? text(row[2]) : value]);
    });
    if (state.minPrice !== MIN_PRICE || state.maxPrice !== MAX_PRICE) chips.push(["price", `${localizedPrice(state.minPrice)} – ${localizedPrice(state.maxPrice)}`]);
    if (state.rank) chips.push(["rank", translatedRank(state.rank)]);
    if (state.minLevel) chips.push(["minLevel", text("min_level") + ": " + state.minLevel]);
    if (state.maxLevel) chips.push(["maxLevel", text("max_level") + ": " + state.maxLevel]);
    if (state.version) chips.push(["version", text(state.version)]);
    if (state.link) chips.push(["link", text(state.link)]);
    if (!state.available) chips.push(["available", text("show_all_statuses")]);
    if (state.minMythics) chips.push(["minMythics", text("mythic") + ": ≥ " + state.minMythics]);
    if (state.minXSuits) chips.push(["minXSuits", text("xsuit") + ": ≥ " + state.minXSuits]);

    host.innerHTML = chips.map(([key,label]) => `<span class="active-filter">${utils.escapeHTML(label)}<button type="button" data-remove-filter="${utils.escapeHTML(key)}" aria-label="${utils.escapeHTML(text("remove"))}"><i data-lucide="x" aria-hidden="true"></i></button></span>`).join("");
    if (chips.length) host.insertAdjacentHTML("beforeend", `<button class="btn btn-ghost btn-sm" type="button" data-clear-all>${utils.escapeHTML(text("clear_all"))}</button>`);
  }

  function renderResults(){
    allFiltered = filterAccounts();
    const visible = allFiltered.slice(0, visibleCount);
    const grid = document.getElementById("store-account-grid");
    const empty = document.getElementById("store-empty");
    const count = document.getElementById("store-result-count");
    const pagination = document.getElementById("store-pagination");
    if (grid) grid.innerHTML = visible.map(account => utils.renderAccountCard(account)).join("");
    if (empty) empty.hidden = allFiltered.length !== 0;
    if (count) count.textContent = `${utils.formatNumber(allFiltered.length)} ${text("results")}`;
    if (pagination) {
      pagination.innerHTML = allFiltered.length > visibleCount
        ? `<button class="btn btn-ice" type="button" id="load-more">${utils.escapeHTML(text("load_more"))}</button>`
        : "";
    }
    renderActiveFilters();
    if (window.lucide?.createIcons) window.lucide.createIcons();
    window.DOMA_LAYOUT?.initReveal?.();
  }

  function renderStore(){
    if (!utils || !isInitialized) return;
    const search = document.getElementById("store-search");
    const sort = document.getElementById("store-sort");
    if (search && search.value !== state.q) search.value = state.q;
    if (sort && sort.value !== state.sort) sort.value = state.sort;
    renderFilterPanels();
    renderResults();
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  function setStateValue(key, value){
    state[key] = value;
    visibleCount = PAGE_SIZE;
    syncControls();
    writeURLState();
    renderResults();
  }

  function resetFilters(){
    const keepSort = state.sort;
    state = defaultState();
    state.sort = keepSort;
    visibleCount = PAGE_SIZE;
    const search = document.getElementById("store-search");
    if (search) search.value = "";
    syncControls();
    writeURLState();
    renderResults();
  }

  function openFilterSheet(){
    const sheet = document.getElementById("filter-sheet");
    const overlay = document.getElementById("filter-overlay");
    if (!sheet || !overlay) return;
    overlay.hidden = false;
    overlay.classList.add("show");
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("close-filters")?.focus();
  }
  function closeFilterSheet(){
    const sheet = document.getElementById("filter-sheet");
    const overlay = document.getElementById("filter-overlay");
    if (!sheet || !overlay) return;
    sheet.classList.remove("open");
    overlay.classList.remove("show");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    window.setTimeout(() => { overlay.hidden = true; }, 250);
  }

  function applyPreset(key){
    if (key === "under5000") {
      state.minPrice = MIN_PRICE; state.maxPrice = Math.min(5000, MAX_PRICE);
    } else if (key === "5000-20000") {
      state.minPrice = Math.max(MIN_PRICE, 5000); state.maxPrice = Math.min(MAX_PRICE, 20000);
    } else if (key === "20000-50000") {
      state.minPrice = Math.max(MIN_PRICE, 20000); state.maxPrice = Math.min(MAX_PRICE, 50000);
    } else if (key === "over50000") {
      state.minPrice = Math.max(MIN_PRICE, 50000); state.maxPrice = MAX_PRICE;
    }
    visibleCount = PAGE_SIZE;
    syncControls(); writeURLState(); renderResults();
  }

  function removeFilter(key){
    if (key.startsWith("tiers:")) state.tiers = state.tiers.filter(value => value !== key.split(":")[1]);
    else if (key.startsWith("cats:")) state.cats = state.cats.filter(value => value !== key.split(":")[1]);
    else if (key === "price") { state.minPrice = MIN_PRICE; state.maxPrice = MAX_PRICE; }
    else if (key === "available") state.available = true;
    else if (["minMythics","minXSuits"].includes(key)) state[key] = 0;
    else if (key in state) state[key] = key === "sort" ? "newest" : "";
    if (key === "q") { const input = document.getElementById("store-search"); if (input) input.value = ""; }
    visibleCount = PAGE_SIZE;
    syncControls(); writeURLState(); renderResults();
  }

  function handleFilterChange(event){
    const target = event.target;
    if (target.matches("[data-filter-check]")) {
      const key = target.dataset.filterCheck;
      const panel = target.closest("[data-filter-panel]");
      state[key] = Array.from(panel.querySelectorAll(`[data-filter-check="${key}"]:checked`)).map(input => input.value);
    } else if (target.matches("[data-filter-value]")) {
      const key = target.dataset.filterValue;
      if (target.type === "checkbox") state[key] = target.checked;
      else if (target.type === "range") {
        let value = safeNum(target.value, key === "minPrice" ? MIN_PRICE : MAX_PRICE);
        if (key === "minPrice") {
          value = Math.min(value, state.maxPrice - PRICE_STEP);
          state.minPrice = Math.max(MIN_PRICE, value);
        } else {
          value = Math.max(value, state.minPrice + PRICE_STEP);
          state.maxPrice = Math.min(MAX_PRICE, value);
        }
      } else if (["minMythics","minXSuits"].includes(key)) state[key] = Math.max(0, safeNum(target.value, 0));
      else if (["minLevel","maxLevel"].includes(key)) state[key] = target.value === "" ? "" : String(Math.max(1, Math.min(100, safeNum(target.value, 1))));
      else state[key] = target.value;
    } else return;
    visibleCount = PAGE_SIZE;
    syncControls();
    writeURLState();
    renderResults();
  }

  function bindEvents(){
    document.addEventListener("input", function(event){
      if (event.target.matches("#store-search")) {
        state.q = event.target.value;
        visibleCount = PAGE_SIZE;
        writeURLState(); renderResults();
      } else if (event.target.matches("[data-filter-value], [data-filter-check]")) {
        handleFilterChange(event);
      }
    });
    document.addEventListener("change", function(event){
      if (event.target.matches("#store-sort")) setStateValue("sort", event.target.value);
      else if (event.target.matches("[data-filter-value], [data-filter-check]")) handleFilterChange(event);
    });
    document.addEventListener("click", function(event){
      const preset = event.target.closest("[data-price-preset]");
      if (preset) { applyPreset(preset.dataset.pricePreset); return; }
      if (event.target.closest("[data-filter-reset]") || event.target.closest("#mobile-reset")) { resetFilters(); return; }
      if (event.target.closest("[data-clear-all]")) { resetFilters(); return; }
      const remove = event.target.closest("[data-remove-filter]");
      if (remove) { removeFilter(remove.dataset.removeFilter); return; }
      if (event.target.closest("#load-more")) {
        visibleCount += PAGE_SIZE;
        renderResults();
        return;
      }
      if (event.target.closest("#open-filters")) { openFilterSheet(); return; }
      if (event.target.closest("#close-filters") || event.target.closest("#filter-overlay")) { closeFilterSheet(); return; }
      if (event.target.closest("#apply-filters")) { closeFilterSheet(); return; }
    });
    document.addEventListener("keydown", function(event){ if (event.key === "Escape") closeFilterSheet(); });
    window.addEventListener("doma:currency", syncControls);
    window.addEventListener("doma:currency", renderResults);
    window.addEventListener("doma:language", renderStore);
    window.addEventListener("doma:rerender", renderStore);
  }

  document.addEventListener("DOMContentLoaded", function(){
    state = readURLState();
    isInitialized = true;
    renderFilterPanels();
    const search = document.getElementById("store-search");
    const sort = document.getElementById("store-sort");
    if (search) search.value = state.q;
    if (sort) sort.value = state.sort;
    bindEvents();
    window.onLangChange = renderStore;
    renderResults();
  });
})();
