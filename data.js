/*
  ARCHIVIO — contenuti dell'hub.

  Per aggiungere una pagina:
  1. crea il file dentro /pagine (copia pagine/_modello.html)
  2. aggiungi un oggetto in fondo a HUB.items
  3. in index.html alza il numero ?v= di data.js (es. ?v=3 → ?v=4), così il browser non usa la versione vecchia

  Le card si ordinano per data: le più recenti in alto.
  A parità di data, la voce scritta più in basso qui sotto va prima.

  Campi:
    id          identificativo unico, senza spazi (usato nell'URL: #voce=id)
    title       titolo della card
    category    categoria libera (es. Ricetta, Guida, Nota): compare da sola nei filtri
    subtitle    riga in corsivo sotto il titolo (facoltativa)
    date        data di aggiunta, AAAA-MM-GG
    url         percorso della pagina, oppure un link esterno; vuoto = pagina non ancora creata
    description testo mostrato nel pannello di dettaglio
    tags        lista di etichette (servono per filtri e ricerca)
    related     lista di id di altre voci collegate
*/
window.HUB = {
  title: "Archivio",

  items: [
    {
      id: "burfi-cocco-pistacchio",
      title: "Burfi al cocco e pistacchio",
      category: "Ricetta",
      subtitle: "Dolce indiano · 45 min",
      date: "2026-10-23",
      url: "pagine/ricette/burfi-cocco-pistacchio.html",
      description: "Nariyal barfi di Hebbar's Kitchen, tradotto e con granella di pistacchio in superficie. Dosi calcolate sulla pirofila IKEA che scegli.",
      tags: ["Dolce", "Indiana", "Cocco", "Pistacchio", "Senza forno"],
      related: []
    }
  ]
};
