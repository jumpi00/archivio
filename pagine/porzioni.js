/*
  Porzioni: con − e + cambi il numero di porzioni e tutte le dosi della pagina si ricalcolano,
  sia negli ingredienti sia nei passaggi. La scelta resta salvata in questo browser (per pagina).

  Per usarlo:
    <div class="porzioni" data-base="4"></div>        dove vuoi i pulsanti (data-base = porzioni della ricetta)
    <span data-q="500" data-u="g">500 g</span>         ogni dose da ricalcolare
    data-u="spicchio|spicchi"                          singolare|plurale per i pezzi
    data-int                                           solo numeri interi, minimo 1 (es. foglie, spicchi)
    <span data-porzioni>4</span>                       mostra il numero di porzioni scelto
  e in fondo alla pagina <script src="../porzioni.js?v=1"></script>, dopo spesa.js.
*/
(() => {
  const box = document.querySelector(".porzioni[data-base]");
  if (!box) return;
  const base = +box.dataset.base;
  const key = "hub.porzioni." + location.pathname;
  let n = base;
  try { n = +localStorage.getItem(key) || base; } catch {}

  const frac = v => {
    const i = Math.floor(v), h = v - i >= 0.5;
    return i ? i + (h ? "½" : "") : "½";
  };
  function fmt(el, f) {
    const v = +el.dataset.q * f;
    const [one, many = one] = el.dataset.u.split("|");
    if (one === "g" || one === "ml") {
      const step = v < 50 ? 1 : v < 200 ? 5 : 10;
      return Math.max(step, Math.round(v / step) * step) + " " + one;
    }
    const r = "int" in el.dataset ? Math.max(1, Math.round(v)) : Math.max(0.5, Math.round(v * 2) / 2);
    return frac(r) + (one ? " " + (r > 1 ? many : one) : "");
  }

  box.innerHTML = `<span class="field-label">Porzioni</span>
    <div class="stepper"><button type="button" aria-label="Meno porzioni">−</button><output></output><button type="button" aria-label="Più porzioni">+</button></div>`;
  const [minus, plus] = box.querySelectorAll("button");
  const out = box.querySelector("output");

  function render() {
    out.textContent = n;
    minus.disabled = n <= 1;
    plus.disabled = n >= 20;
    document.querySelectorAll("[data-porzioni]").forEach(el => el.textContent = n);
    document.querySelectorAll("[data-q]").forEach(el => el.textContent = fmt(el, n / base));
    try { n === base ? localStorage.removeItem(key) : localStorage.setItem(key, n); } catch {}
  }
  minus.addEventListener("click", () => { n--; render(); });
  plus.addEventListener("click", () => { n++; render(); });
  render();
})();
