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
      description: "Nariyal barfi di Hebbar's Kitchen, tradotto, meno dolce e con granella di pistacchio in superficie. Dosi calcolate sulla pirofila IKEA che scegli.",
      tags: ["Dolce", "India", "Cocco", "Pistacchio", "Senza forno"],
      related: []
    },
    {
      id: "lemon-rolls-cambrea",
      title: "Lemon rolls · Cambrea Bakes",
      category: "Ricetta",
      subtitle: "Girelle al limone · 2 h 30",
      date: "2026-10-28",
      url: "pagine/ricette/lemon-rolls-cambrea.html",
      description: "Impasto col tangzhong, morbidissimo, ripieno di burro, zucchero di canna e lemon curd, frosting al formaggio cremoso. Più ricca e lunga di quella di Chelsweets.",
      tags: ["Dolce", "Lievitati", "Limone", "Forno", "Weekend"],
      related: ["lemon-rolls-chelsweets", "blueberry-cinnamon-rolls"]
    },
    {
      id: "lemon-rolls-chelsweets",
      title: "Lemon rolls · Chelsweets",
      category: "Ricetta",
      subtitle: "Girelle al limone · 1 h 30",
      date: "2026-10-28",
      url: "pagine/ricette/lemon-rolls-chelsweets.html",
      description: "Girelle soffici con semi di papavero, ripieno di zucchero e scorza di limone e glassa al succo. Lievitazione veloce nel forno spento.",
      tags: ["Dolce", "Lievitati", "Limone", "Forno", "Colazione"],
      related: ["lemon-rolls-cambrea", "blueberry-cinnamon-rolls"]
    },
    {
      id: "blueberry-cinnamon-rolls",
      title: "Blueberry cinnamon rolls",
      category: "Ricetta",
      subtitle: "Girelle ai mirtilli e cannella · 2 h 20",
      date: "2026-10-28",
      url: "pagine/ricette/blueberry-cinnamon-rolls.html",
      description: "Girelle alla cannella con salsa di mirtilli fatta in casa e glassa al limone. In fondo alla pagina: come sostituire la cannella.",
      tags: ["Dolce", "Lievitati", "Mirtilli", "Cannella", "Forno", "Colazione"],
      related: ["lemon-rolls-chelsweets", "lemon-rolls-cambrea"]
    },
    {
      id: "zuppa-fagioli-ditaloni",
      title: "Zuppa di fagioli con ditaloni",
      category: "Ricetta",
      subtitle: "Primo · 1 h",
      date: "2026-10-29",
      url: "pagine/ricette/zuppa-fagioli-ditaloni.html",
      description: "La pasta e fagioli di casa: borlotti (o borlotti e cannellini), patata, brodo e un po' di pomodoro, frullata col minipimer. Scegli le porzioni e le dosi si ricalcolano.",
      tags: ["Primo", "Zuppa", "Legumi", "Pasta", "Inverno"],
      related: []
    }
  ]
};
