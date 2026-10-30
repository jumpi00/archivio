/*
  Porzioni: con − e + cambi il numero di porzioni e tutte le dosi della pagina si ricalcolano,
  sia negli ingredienti sia nei passaggi. La scelta resta salvata in questo browser (per pagina).

  Per usarlo:
    <div class="porzioni" data-base="4"></div>        dove vuoi i pulsanti (data-base = porzioni della ricetta)
    data-label="Teglie"                                facoltativo: cosa si conta (di base "Porzioni")
    data-preciso                                       facoltativo: grammi al grammo, senza arrotondare a 5 o 10 (impasti)
    <span data-q="500" data-u="g">500 g</span>         ogni dose da ricalcolare
    data-q="4-5"                                       un intervallo: diventa "4–5 g"
    data-u="spicchio|spicchi"                          singolare|plurale per i pezzi
    data-int                                           solo numeri interi, minimo 1 (es. foglie, spicchi)
    <span data-porzioni>4</span>                       mostra il numero di porzioni scelto
  e in fondo alla pagina <script src="../porzioni.js?v=1"></script>, dopo spesa.js.
*/
(() => {
  const box = document.querySelector(".porzioni[data-base]");
  if (!box) return;
  const base = +box.dataset.base;
  const precise = "preciso" in box.dataset;
  const key = "hub.porzioni." + location.pathname;
  let n = base;
  try { n = +localStorage.getItem(key) || base; } catch {}

  const frac = v => {
    const i = Math.floor(v), h = v - i >= 0.5;
    return i ? i + (h ? "½" : "") : "½";
  };
  function fmt(el, f) {
    const [one, many = one] = el.dataset.u.split("|");
    const nums = el.dataset.q.split("-").map(q => +q * f);
    if (one === "g" || one === "ml") {
      const r = v => {
        if (v < 10) return String(Math.max(0.1, Math.round(v * 10) / 10)).replace(".", ",");  // es. lievito 0,8 g
        const step = precise || v < 50 ? 1 : v < 200 ? 5 : 10;
        return Math.round(v / step) * step;
      };
      return nums.map(r).join("–") + " " + one;
    }
    const r = nums.map(v => "int" in el.dataset ? Math.max(1, Math.round(v)) : Math.max(0.5, Math.round(v * 2) / 2));
    const last = r[r.length - 1];
    return r.map(frac).join("–") + (one ? " " + (last > 1 ? many : one) : "");
  }

  const label = box.dataset.label || "Porzioni";
  box.innerHTML = `<span class="field-label">${label}</span>
    <div class="stepper"><button type="button" aria-label="Meno">−</button><output></output><button type="button" aria-label="Più">+</button></div>`;
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
