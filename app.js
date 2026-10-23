(() => {
  const { title, categories, items } = window.HUB;
  const byId = Object.fromEntries(items.map(i => [i.id, i]));
  const $ = s => document.querySelector(s);

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  const SORTS = [
    { key: "az", label: "A → Z", fn: (a, b) => a.title.localeCompare(b.title, "it") },
    { key: "za", label: "Z → A", fn: (a, b) => b.title.localeCompare(a.title, "it") },
    { key: "new", label: "Più recenti", fn: (a, b) => (b.date || "").localeCompare(a.date || "") }
  ];

  const state = {
    view: store.get("hub.view", "cards"),
    q: "",
    cats: new Set(),
    tags: new Set(),
    sort: store.get("hub.sort", "az"),
    saved: new Set(store.get("hub.saved", []))
  };

  const ICON = {
    bookmark: '<svg viewBox="0 0 24 24"><path d="M6.5 3.5h11v17L12 16l-5.5 4.5z"/></svg>',
    link: '<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8 15.8 7.2M8.2 13.2l7.6 3.6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    open: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
  };

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const color = i => categories[i.category] || "#555";
  const norm = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const isExternal = url => /^https?:\/\//.test(url);

  document.title = title;
  $("#brand").textContent = title;

  // ---------- filtering ----------
  function visible() {
    const q = norm(state.q.trim());
    const sort = SORTS.find(s => s.key === state.sort) || SORTS[0];
    return items.filter(i => {
      if (state.view === "saved" && !state.saved.has(i.id)) return false;
      if (state.cats.size && !state.cats.has(i.category)) return false;
      if (state.tags.size && ![...state.tags].every(t => (i.tags || []).includes(t))) return false;
      if (q && !norm([i.title, i.subtitle, i.category, i.description, ...(i.tags || [])].join(" ")).includes(q)) return false;
      return true;
    }).sort(sort.fn);
  }

  // ---------- render ----------
  function saveBtn(i, cls = "save") {
    const on = state.saved.has(i.id);
    return `<button class="${cls}" data-save="${esc(i.id)}" aria-pressed="${on}" aria-label="${on ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}">${ICON.bookmark}${cls === "save" ? "" : `<span>${on ? "Salvato" : "Salva"}</span>`}</button>`;
  }

  function card(i) {
    const tags = i.tags || [];
    const shown = tags.slice(0, 5);
    const rel = (i.related || []).filter(id => byId[id]).length;
    return `<article class="card" tabindex="0" data-open="${esc(i.id)}" style="--c:${color(i)}">
      <div class="card-head">
        <h3 class="card-title">${esc(i.title)}</h3>
        <span class="badge">${esc(i.category)}</span>
        ${saveBtn(i)}
      </div>
      ${i.subtitle ? `<p class="card-sub">${esc(i.subtitle)}</p>` : ""}
      ${rel ? `<p class="card-meta">${ICON.link}${rel} ${rel === 1 ? "collegamento" : "collegamenti"}</p>` : ""}
      ${!i.url ? `<span class="soon">— pagina da creare</span>` : ""}
      <div class="tags">${shown.map(t => `<span class="tag">${esc(t)}</span>`).join("")}${tags.length > shown.length ? `<span class="tag more">+${tags.length - shown.length}</span>` : ""}</div>
    </article>`;
  }

  function indexView(list) {
    const groups = {};
    [...list].sort(SORTS[0].fn).forEach(i => {
      const l = norm(i.title)[0]?.toUpperCase() || "#";
      (groups[l] ||= []).push(i);
    });
    return `<div class="index">${Object.keys(groups).sort().map(l => `
      <section><h3 class="letter">${l}</h3>
        ${groups[l].map(i => `<button class="row" data-open="${esc(i.id)}" style="--c:${color(i)}">
          <span class="row-title">${esc(i.title)}</span><span class="row-cat">${esc(i.category)}</span>
          ${i.subtitle ? `<span class="row-sub">${esc(i.subtitle)}</span>` : ""}
        </button>`).join("")}
      </section>`).join("")}</div>`;
  }

  function render() {
    document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("active", b.dataset.view === state.view));
    const list = visible();
    const n = state.cats.size + state.tags.size;
    $("#filterCount").textContent = n || "";
    const sort = SORTS.find(s => s.key === state.sort);
    $("#status").textContent = `${list.length} ${list.length === 1 ? "voce" : "voci"} · ${state.view === "index" ? "A → Z" : sort.label}`;

    let html;
    if (!list.length) {
      html = state.view === "saved" && !state.saved.size
        ? `<div class="empty"><strong>Nessun preferito</strong>Tocca il segnalibro su una card per salvarla qui.</div>`
        : `<div class="empty"><strong>Niente da mostrare</strong>Prova a cambiare la ricerca o i filtri.</div>`;
    } else if (state.view === "index") {
      html = indexView(list);
    } else {
      html = `<div class="grid">${list.map(card).join("")}</div>`;
    }
    $("#main").innerHTML = html;
    if (!$("#filtersPop").hidden) renderFilters();
  }

  function renderFilters() {
    const allTags = [...new Set(items.flatMap(i => i.tags || []))].sort((a, b) => a.localeCompare(b, "it"));
    $("#filtersPop").innerHTML = `
      <h4>Categoria</h4>
      <div class="chips">${Object.entries(categories).map(([c, col]) =>
        `<button class="chip" style="--c:${col}" data-cat="${esc(c)}" aria-pressed="${state.cats.has(c)}">${esc(c)}</button>`).join("")}</div>
      <h4>Tag</h4>
      <div class="chips">${allTags.map(t =>
        `<button class="chip" data-tag="${esc(t)}" aria-pressed="${state.tags.has(t)}">${esc(t)}</button>`).join("")}</div>
      <div class="pop-foot"><button class="link-btn" data-clear>Azzera filtri</button></div>`;
  }

  // ---------- sheet ----------
  function openSheet(html) {
    $("#sheetBody").innerHTML = html;
    document.body.classList.add("sheet-open");
    $("#sheet").setAttribute("aria-hidden", "false");
    $("#sheet").scrollTop = 0;
  }
  function closeSheet() {
    document.body.classList.remove("sheet-open");
    $("#sheet").setAttribute("aria-hidden", "true");
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    document.title = title;
  }

  function showItem(id) {
    const i = byId[id];
    if (!i) return closeSheet();
    document.title = `${i.title} — ${title}`;
    const meta = [i.category, i.subtitle, i.date && new Date(i.date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })].filter(Boolean).join(" · ");
    const rel = (i.related || []).map(r => byId[r]).filter(Boolean);
    const ext = isExternal(i.url);
    openSheet(`
      <h2 style="color:${color(i)}">${esc(i.title)}</h2>
      <div class="meta">${esc(meta)}</div>
      ${saveBtn(i, "pill-btn")}
      ${i.description ? `<p class="desc">${esc(i.description)}</p>` : ""}
      <a class="pill-btn primary" ${i.url ? `href="${esc(i.url)}"${ext ? ' target="_blank" rel="noopener"' : ""}` : 'aria-disabled="true"'}>
        ${ext ? ICON.open : ICON.arrow}${i.url ? (ext ? "Apri link" : "Apri pagina") : "Pagina non ancora creata"}
      </a>
      ${rel.length ? `<h5>Collegati</h5>${rel.map(r => `
        <button class="rel" data-open="${esc(r.id)}">${ICON.arrow}<span>${esc(r.title)}<small>${esc([r.category, r.subtitle].filter(Boolean).join(" · "))}</small></span></button>`).join("")}` : ""}
      ${(i.tags || []).length ? `<h5>Tag</h5><div class="tags" style="--c:${color(i)}">${i.tags.map(t => `<button class="tag" data-filter-tag="${esc(t)}">${esc(t)}</button>`).join("")}</div>` : ""}
    `);
  }

  function showHelp() {
    openSheet(`
      <h2>Come aggiungere una pagina</h2>
      <div class="meta">Niente login: tutto vive nei file del sito.</div>
      <div class="help">
        <ol>
          <li>Duplica <code>pagine/_modello.html</code> e mettilo in una cartella, es. <code>pagine/ricette/</code>.</li>
          <li>Apri <code>data.js</code> e aggiungi una voce a <code>items</code>:</li>
        </ol>
        <pre>{
  id: "risotto",
  title: "Risotto ai funghi",
  category: "Ricetta",
  subtitle: "Primo · 35 min",
  date: "2026-10-23",
  url: "pagine/ricette/risotto.html",
  description: "Testo del pannello.",
  tags: ["Riso", "Autunno"],
  related: ["carbonara"]
}</pre>
        <ol start="3">
          <li>Per una nuova categoria aggiungila in <code>categories</code> con il suo colore.</li>
          <li>I preferiti restano salvati solo in questo browser.</li>
        </ol>
      </div>`);
  }

  function route() {
    const m = location.hash.match(/^#voce=(.+)$/);
    if (m) showItem(decodeURIComponent(m[1]));
    else if (document.body.classList.contains("sheet-open")) closeSheet();
  }

  // ---------- events ----------
  document.addEventListener("click", e => {
    const t = e.target.closest("button, [data-open], a");
    if (!t) {
      if (!e.target.closest(".pop")) togglePop(false);
      return;
    }
    if (t.dataset.save) {
      e.stopPropagation();
      const id = t.dataset.save;
      state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
      store.set("hub.saved", [...state.saved]);
      render();
      if (document.body.classList.contains("sheet-open") && location.hash === `#voce=${encodeURIComponent(id)}`) showItem(id);
      return;
    }
    if (t.dataset.open) { location.hash = `voce=${encodeURIComponent(t.dataset.open)}`; return; }
    if (t.dataset.view) { state.view = t.dataset.view; store.set("hub.view", state.view); render(); return; }
    if (t.dataset.cat) { toggle(state.cats, t.dataset.cat); render(); return; }
    if (t.dataset.tag) { toggle(state.tags, t.dataset.tag); render(); return; }
    if (t.dataset.filterTag) {
      state.tags = new Set([t.dataset.filterTag]); state.cats.clear();
      if (state.view === "saved") state.view = "cards";
      closeSheet(); render(); return;
    }
    if ("clear" in t.dataset) { state.cats.clear(); state.tags.clear(); render(); return; }
    if (!t.closest(".pop") && t.id !== "filtersBtn") togglePop(false);
  });

  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); }

  function togglePop(force) {
    const pop = $("#filtersPop");
    const open = force ?? pop.hidden;
    if (open) renderFilters();
    pop.hidden = !open;
    $("#filtersBtn").setAttribute("aria-expanded", open);
  }

  $("#filtersBtn").addEventListener("click", () => togglePop());
  $("#sortBtn").addEventListener("click", () => {
    const idx = SORTS.findIndex(s => s.key === state.sort);
    state.sort = SORTS[(idx + 1) % SORTS.length].key;
    store.set("hub.sort", state.sort);
    render();
  });
  $("#q").addEventListener("input", e => { state.q = e.target.value; render(); });
  $("#sheetClose").addEventListener("click", closeSheet);
  $("#scrim").addEventListener("click", closeSheet);
  $("#infoBtn").addEventListener("click", showHelp);
  $("#brand").addEventListener("click", e => {
    e.preventDefault();
    state.q = ""; $("#q").value = ""; state.cats.clear(); state.tags.clear(); state.view = "cards";
    closeSheet(); render();
  });
  $("#main").addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.dataset.open) location.hash = `voce=${encodeURIComponent(e.target.dataset.open)}`;
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { togglePop(false); closeSheet(); }
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); $("#q").focus(); }
  });

  // theme
  const savedTheme = store.get("hub.theme", null);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  $("#themeBtn").addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("hub.theme", next);
  });

  window.addEventListener("hashchange", route);
  render();
  route();
})();
