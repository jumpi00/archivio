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
    },
    {
      id: "curry-merluzzo-cocco",
      title: "Merluzzo al curry e cocco",
      category: "Ricetta",
      subtitle: "Pesce · 35 min",
      date: "2026-10-29",
      url: "pagine/ricette/curry-merluzzo-cocco.html",
      description: "Filetti di merluzzo in sugo di curry rosso e latte di cocco, con peperone e taccole. Porzioni regolabili e note per il pesce surgelato.",
      tags: ["Pesce", "Merluzzo", "Curry", "Cocco", "Veloce"],
      related: ["merluzzo-thai-cocco", "curry-pesce-cocco-lime", "merluzzo-brodo-cocco-lime"]
    },
    {
      id: "merluzzo-thai-cocco",
      title: "Merluzzo thai al cocco",
      category: "Ricetta",
      subtitle: "Pesce · 30 min",
      date: "2026-10-29",
      url: "pagine/ricette/merluzzo-thai-cocco.html",
      description: "Merluzzo in padella con latte di cocco, curry rosso thai e lime, da servire con riso o noodles. Porzioni regolabili e note per il pesce surgelato.",
      tags: ["Pesce", "Merluzzo", "Thai", "Cocco", "Veloce"],
      related: ["curry-merluzzo-cocco", "curry-pesce-cocco-lime", "merluzzo-brodo-cocco-lime"]
    },
    {
      id: "curry-pesce-cocco-lime",
      title: "Curry di pesce al cocco e lime",
      category: "Ricetta",
      subtitle: "Pesce e riso jasmine · 30 min",
      date: "2026-10-29",
      url: "pagine/ricette/curry-pesce-cocco-lime.html",
      description: "Pesce bianco in un curry leggero al cocco e lime, servito sul riso jasmine. Porzioni regolabili e note per il pesce surgelato.",
      tags: ["Pesce", "Curry", "Cocco", "Lime", "Riso"],
      related: ["curry-merluzzo-cocco", "merluzzo-thai-cocco", "merluzzo-brodo-cocco-lime"]
    },
    {
      id: "merluzzo-brodo-cocco-lime",
      title: "Merluzzo in brodo di cocco e lime",
      category: "Ricetta",
      subtitle: "Pesce · 30 min",
      date: "2026-10-29",
      url: "pagine/ricette/merluzzo-brodo-cocco-lime.html",
      description: "Merluzzo cotto in un brodo di cocco, lime e citronella con pak choi, zenzero fritto e peperoncino al lime. Porzioni regolabili e note per il pesce surgelato.",
      tags: ["Pesce", "Merluzzo", "Cocco", "Lime", "Senza glutine"],
      related: ["curry-merluzzo-cocco", "merluzzo-thai-cocco", "curry-pesce-cocco-lime"]
    },
    {
      id: "branzino-salsa-limone",
      title: "Branzino con salsa cremosa al limone",
      category: "Ricetta",
      subtitle: "Pesce · 25 min",
      date: "2026-10-29",
      url: "pagine/ricette/branzino-salsa-limone.html",
      description: "Filetti di branzino con la pelle croccante e salsa di burro, panna e limone (da Mary Berry Recipes). Porzioni regolabili e note per il pesce surgelato.",
      tags: ["Pesce", "Branzino", "Limone", "Veloce", "Secondo"],
      related: []
    },
    {
      id: "pizza-teglia-simo",
      title: "Pizza in teglia di Massimo (Simo)",
      category: "Ricetta",
      subtitle: "Pizza · lievitazione corta o lunga",
      date: "2026-10-30",
      url: "pagine/ricette/pizza-teglia-simo.html",
      description: "La ricetta del cugino Massimo (Simo) per una teglia di casa: farina 0 e semola, idratazione 70%, acqua e ghiaccio. Due pulsanti per la lievitazione corta (2–4 ore) o lunga in frigo (24–48 ore), dosi per numero di teglie.",
      tags: ["Pizza", "Lievitati", "Forno", "Di famiglia"],
      related: ["pizza-teglia-romana"]
    },
    {
      id: "pizza-teglia-romana",
      title: "Pizza romana in teglia",
      category: "Ricetta",
      subtitle: "Pizza · @the_romano_baker",
      date: "2026-10-30",
      url: "pagine/ricette/pizza-teglia-romana.html",
      description: "L'impasto del reel di @the_romano_baker: idratazione 67%, miele e pirlatura sulla semola. Due pulsanti per la lievitazione corta o lunga in frigo, dosi per numero di teglie.",
      tags: ["Pizza", "Lievitati", "Forno", "Romana"],
      related: ["pizza-teglia-simo"]
    },
    {
      id: "pane-ticinese",
      title: "Pane ticinese (tipo Migros)",
      category: "Ricetta",
      subtitle: "Pane · ~2 h 30",
      date: "2026-10-31",
      url: "pagine/ricette/pane-ticinese.html",
      description: "Pane bianco morbido fatto di panetti ovali uniti in fila, col solco chiaro al centro, come quello della Migros. Scegli quanti panetti fare e le dosi si ricalcolano.",
      tags: ["Pane", "Lievitati", "Forno", "Svizzera"],
      related: ["pizza-teglia-simo", "pizza-teglia-romana"]
    }
  ]
};
