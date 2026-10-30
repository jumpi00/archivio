/*
  Versioni: due (o più) pulsanti che cambiano la versione della ricetta, es. lievitazione corta o lunga.
  La scelta resta salvata in questo browser (per pagina).

  Per usarlo:
    <div class="versioni">
      <button type="button" data-v="corta">Corta</button>
      <button type="button" data-v="lunga">Lunga</button>
    </div>
    data-default="lunga" sul div sceglie la versione iniziale (di base la prima)
    data-ver="corta" su qualunque elemento (ingrediente, passaggio, testo): si vede solo in quella versione
  e in fondo alla pagina <script src="../versioni.js?v=1"></script>.
*/
(() => {
  const box = document.querySelector(".versioni");
  if (!box) return;
  const key = "hub.versione." + location.pathname;
  const btns = [...box.querySelectorAll("button[data-v]")];
  let v = box.dataset.default || btns[0].dataset.v;
  try { const s = localStorage.getItem(key); if (btns.some(b => b.dataset.v === s)) v = s; } catch {}

  function set(next) {
    v = next;
    btns.forEach(b => {
      b.classList.toggle("active", b.dataset.v === v);
      b.setAttribute("aria-pressed", b.dataset.v === v);
    });
    document.querySelectorAll("[data-ver]").forEach(el => el.hidden = el.dataset.ver !== v);
    try { localStorage.setItem(key, v); } catch {}
  }
  btns.forEach(b => b.addEventListener("click", () => set(b.dataset.v)));
  set(v);
})();
