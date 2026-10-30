/*
  Condividi: la ricetta si può mandare da sola.
  - Il link "← Archivio" si vede solo a chi ha già aperto l'Archivio su quel dispositivo (cioè tu)
    o a chi ci arriva dall'Archivio. Chi riceve il link della ricetta vede solo la ricetta.
  - Aggiunge un pulsante "Condividi" accanto ai link in cima: sul telefono apre la condivisione
    (WhatsApp, Messaggi…), sul computer copia il link.
  Per usarlo: <script src="../condividi.js?v=1"></script> dentro <head>, prima di pagina.css.
*/
(() => {
  let owner = false;
  try { owner = localStorage.getItem("hub.owner") === "1"; } catch {}
  const hub = location.origin + location.pathname.split("/pagine/")[0] + "/";
  const from = document.referrer.split(/[?#]/)[0];
  if (from === hub || from === hub + "index.html") owner = true;
  if (owner) document.documentElement.classList.add("owner");

  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".page > header");
    if (!header) return;
    let links = header.querySelector(".links");
    if (!links) { links = document.createElement("div"); links.className = "links"; header.append(links); }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "share";
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg><span>Condividi</span>';
    const label = btn.querySelector("span");
    links.append(btn);

    const url = location.origin + location.pathname;
    const title = document.title.replace(/ — Archivio$/, "");
    btn.addEventListener("click", async () => {
      if (navigator.share) {
        try { await navigator.share({ title, url }); } catch {}
        return;
      }
      try {
        await navigator.clipboard.writeText(url);
        label.textContent = "Link copiato";
      } catch {
        prompt("Copia il link:", url);
      }
      setTimeout(() => label.textContent = "Condividi", 2000);
    });
  });
})();
