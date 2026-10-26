/*
  Commenti condivisi (Supabase). Per usarli in una pagina:
    <section id="commenti" data-page="id-della-voce"></section>
    <script src="../commenti.js?v=1"></script>
  data-page = lo stesso id della voce in data.js.
  Chiunque può scrivere; per cancellare serve il PIN (impostato nel SQL di sql/001-commenti.sql).
*/
(() => {
  const SUPABASE_URL = "https://uwkwhuxhsqtyeqejqapv.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Iu5sGXn2BwxZWjse-sJ8Yw_ZoovbbQh";

  const root = document.getElementById("commenti");
  if (!root) return;
  const page = root.dataset.page;

  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" };
  const api = async (path, opts = {}) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...opts, headers: { ...headers, ...opts.headers } });
    const text = await r.text();
    const data = text ? JSON.parse(text) : null;
    if (!r.ok) throw new Error((data && data.message) || `Errore ${r.status}`);
    return data;
  };

  const store = {
    get(s, k) { try { return s.getItem(k); } catch { return null; } },
    set(s, k, v) { try { v == null ? s.removeItem(k) : s.setItem(k, v); } catch {} }
  };

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const when = iso => new Date(iso).toLocaleString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  root.innerHTML = `
    <h2>Commenti <span class="c-count"></span></h2>
    <ul class="comments"></ul>
    <form class="c-form" autocomplete="off">
      <input class="c-name" name="name" maxlength="40" placeholder="Nome (facoltativo)">
      <textarea class="c-body" name="body" maxlength="1000" rows="3" placeholder="Scrivi un commento…" required></textarea>
      <input class="c-hp" name="website" tabindex="-1" aria-hidden="true">
      <div class="c-actions"><span class="c-status" role="status"></span><button class="c-send" type="submit">Pubblica</button></div>
    </form>`;

  const list = root.querySelector(".comments");
  const form = root.querySelector(".c-form");
  const status = root.querySelector(".c-status");
  const nameInput = root.querySelector(".c-name");
  nameInput.value = store.get(localStorage, "hub.commentName") || "";

  const say = (msg, err) => { status.textContent = msg || ""; status.classList.toggle("err", !!err); };

  async function load() {
    try {
      const rows = await api(`archivio_comments?page=eq.${encodeURIComponent(page)}&select=id,name,body,created_at&order=created_at.asc`);
      root.querySelector(".c-count").textContent = rows.length ? `(${rows.length})` : "";
      list.innerHTML = rows.length
        ? rows.map(c => `<li data-id="${c.id}">
            <div class="c-head"><span>${esc(c.name || "Anonimo")} · ${when(c.created_at)}</span>
              <button class="c-del" type="button" aria-label="Elimina commento">×</button></div>
            <p class="c-text">${esc(c.body)}</p>
          </li>`).join("")
        : `<li class="c-empty">Ancora nessun commento.</li>`;
    } catch (e) {
      list.innerHTML = `<li class="c-empty">Non riesco a caricare i commenti.</li>`;
    }
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (form.website.value) return; // campo trappola per i bot
    const body = form.body.value.trim();
    const name = nameInput.value.trim();
    if (!body) return;
    const btn = form.querySelector(".c-send");
    btn.disabled = true; say("Invio…");
    try {
      await api("archivio_comments", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ page, name: name || null, body }) });
      store.set(localStorage, "hub.commentName", name || null);
      form.body.value = "";
      say("");
      await load();
    } catch (err) {
      say(err.message, true);
    } finally {
      btn.disabled = false;
    }
  });

  async function remove(li, pin) {
    const ok = await api("rpc/archivio_delete_comment", { method: "POST", body: JSON.stringify({ p_id: Number(li.dataset.id), p_pin: pin }) });
    if (!ok) throw new Error("PIN sbagliato");
    store.set(sessionStorage, "hub.commentPin", pin);
    await load();
  }

  list.addEventListener("click", async e => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;

    if (e.target.closest(".c-del")) {
      const saved = store.get(sessionStorage, "hub.commentPin");
      if (saved) {
        if (!confirm("Eliminare questo commento?")) return;
        try { await remove(li, saved); }
        catch (err) { store.set(sessionStorage, "hub.commentPin", null); say(err.message, true); }
        return;
      }
      list.querySelectorAll(".c-pin").forEach(f => f.remove());
      li.insertAdjacentHTML("beforeend", `<form class="c-pin">
        <input type="password" inputmode="numeric" placeholder="PIN" aria-label="PIN" required>
        <button type="submit">Elimina</button><button type="button" class="c-cancel">Annulla</button>
        <span class="c-pin-msg" role="status"></span></form>`);
      li.querySelector(".c-pin input").focus();
      return;
    }
    if (e.target.closest(".c-cancel")) e.target.closest(".c-pin").remove();
  });

  list.addEventListener("submit", async e => {
    const f = e.target.closest(".c-pin");
    if (!f) return;
    e.preventDefault();
    const msg = f.querySelector(".c-pin-msg");
    msg.textContent = "…";
    try { await remove(f.closest("li"), f.querySelector("input").value); }
    catch (err) { msg.textContent = err.message; }
  });

  load();
})();
