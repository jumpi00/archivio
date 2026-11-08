/*
  Archivia: in fondo alla pagina, prima dei commenti, un riquadro per archiviare questa scheda
  (o ripristinarla) con un commento. Serve il PIN dei commenti. Si vede solo a te (vedi condividi.js).
  La scheda è quella con lo stesso id di <section id="commenti" data-page="…">.
  Per usarlo: <script src="../archivia.js?v=1"></script> in fondo alla pagina, prima di commenti.js.
*/
(() => {
  const SUPABASE_URL = "https://uwkwhuxhsqtyeqejqapv.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Iu5sGXn2BwxZWjse-sJ8Yw_ZoovbbQh";

  const anchor = document.getElementById("commenti");
  if (!anchor || !document.documentElement.classList.contains("owner")) return;
  const id = anchor.dataset.page;

  const api = async (path, body) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method: body ? "POST" : "GET",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: body && JSON.stringify(body)
    });
    const text = await r.text();
    const data = text ? JSON.parse(text) : null;
    if (!r.ok) throw new Error((data && data.message) || `Errore ${r.status}`);
    return data;
  };
  const pin = {
    get() { try { return sessionStorage.getItem("hub.commentPin"); } catch { return null; } },
    set(v) { try { v ? sessionStorage.setItem("hub.commentPin", v) : sessionStorage.removeItem("hub.commentPin"); } catch {} }
  };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = d => new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });

  const box = document.createElement("section");
  box.className = "archivia";
  anchor.before(box);

  let archived = null;  // { note, date } se la scheda è archiviata
  let open = false;     // modulo aperto

  const pinField = () => pin.get() ? "" : `<input name="pin" type="password" inputmode="numeric" placeholder="PIN" aria-label="PIN" autocomplete="off" required>`;

  function render(msg = "") {
    const head = `<h2>${archived ? "Archiviata" : "Archivia"}</h2>`;
    if (archived) {
      box.innerHTML = `${head}<div class="note"><p><b>Archiviata il ${esc(fmtDate(archived.date))}.</b> ${archived.note ? esc(archived.note) : "Nessun commento."}</p></div>
        <form class="c-form arch-form" data-restore>
          ${open ? pinField() : ""}
          <div class="c-actions"><span class="c-status err">${esc(msg)}</span>
            ${open ? `<button type="button" class="arch-cancel">Annulla</button>` : ""}<button type="submit" class="c-send">Ripristina</button></div>
        </form>`;
    } else if (open) {
      box.innerHTML = `${head}<form class="c-form arch-form">
          <textarea name="note" maxlength="300" placeholder="Perché la archivi? Es. provata, non ci è piaciuta"></textarea>
          ${pinField()}
          <div class="c-actions"><span class="c-status err">${esc(msg)}</span>
            <button type="button" class="arch-cancel">Annulla</button><button type="submit" class="c-send">Archivia</button></div>
        </form>`;
    } else {
      box.innerHTML = `${head}<div class="c-actions arch-start"><span class="c-status">Non ti serve più? Toglila dalla lista dell'Archivio.</span><button type="button" class="c-send" data-open>Archivia questa scheda</button></div>`;
    }
  }

  async function load() {
    try {
      const rows = await api(`archivio_archived?item_id=eq.${encodeURIComponent(id)}&select=note,archived_at`);
      archived = rows[0] ? { note: rows[0].note, date: rows[0].archived_at } : null;
    } catch { archived = null; }
    render();
  }

  box.addEventListener("click", e => {
    if (e.target.closest("[data-open]")) { open = true; render(); box.querySelector("textarea").focus(); }
    if (e.target.closest(".arch-cancel")) { open = false; render(); }
  });

  box.addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target;
    const restore = "restore" in f.dataset;
    if (restore && !open && !pin.get()) { open = true; render(); box.querySelector("[name=pin]").focus(); return; }
    const note = restore ? "" : f.note.value.trim();
    const p = pin.get() || f.pin.value;
    f.querySelector("[type=submit]").disabled = true;
    try {
      const ok = restore
        ? await api("rpc/archivio_unarchive", { p_id: id, p_pin: p })
        : await api("rpc/archivio_archive", { p_id: id, p_note: note, p_pin: p });
      if (!ok) { pin.set(null); throw new Error("PIN sbagliato"); }
      pin.set(p);
      open = false;
      await load();
    } catch (err) {
      open = true;
      render(err.message);
      if (!restore) box.querySelector("textarea").value = note;
    }
  });

  render();
  load();
})();
