/*
  ARCHIVIO — contenuti dell'hub.

  Per aggiungere una pagina:
  1. crea il file dentro /pagine (copia pagine/_modello.html)
  2. aggiungi un oggetto qui sotto in HUB.items

  Campi:
    id          identificativo unico, senza spazi (usato nell'URL: #voce=id)
    title       titolo della card
    category    una delle chiavi di HUB.categories
    subtitle    riga in corsivo sotto il titolo (facoltativa)
    date        data di aggiunta, AAAA-MM-GG (serve per l'ordinamento "più recenti")
    url         percorso della pagina, oppure un link esterno; vuoto = pagina non ancora creata
    description testo mostrato nel pannello di dettaglio
    tags        lista di etichette (servono per filtri e ricerca)
    related     lista di id di altre voci collegate
*/
window.HUB = {
  title: "Archivio",

  categories: {
    "Ricetta": "#4f7a2e",
    "Dolce":   "#9a6b12",
    "Guida":   "#1f7a7a",
    "Nota":    "#5d44a8",
    "Link":    "#2f6fb3",
    "Lista":   "#b4532a"
  },

  items: [
    {
      id: "carbonara",
      title: "Carbonara",
      category: "Ricetta",
      subtitle: "Primo · Roma · 20 min",
      date: "2026-10-23",
      url: "pagine/ricette/carbonara.html",
      description: "Guanciale croccante, tuorli, pecorino e pepe. Niente panna, niente aglio: la crema si fa fuori dal fuoco con l'acqua di cottura.",
      tags: ["Pasta", "Veloce", "Uova", "Classico"],
      related: ["cacio-e-pepe", "lista-dispensa"]
    },
    {
      id: "cacio-e-pepe",
      title: "Cacio e pepe",
      category: "Ricetta",
      subtitle: "Primo · Roma · 15 min",
      date: "2026-10-20",
      url: "",
      description: "Tre ingredienti e una sola tecnica da imparare: la crema di pecorino che non fa grumi.",
      tags: ["Pasta", "Veloce", "Classico", "Vegetariano"],
      related: ["carbonara"]
    },
    {
      id: "pizza-teglia",
      title: "Pizza in teglia",
      category: "Ricetta",
      subtitle: "Lievitati · 24 h di riposo",
      date: "2026-10-12",
      url: "",
      description: "Impasto ad alta idratazione, lievitazione lunga in frigo, cottura nel forno di casa al massimo.",
      tags: ["Lievitati", "Forno", "Weekend"],
      related: ["pane-cassetta"]
    },
    {
      id: "pane-cassetta",
      title: "Pane in cassetta",
      category: "Ricetta",
      subtitle: "Lievitati · 3 h",
      date: "2026-10-05",
      url: "",
      description: "Morbido, da tostare. Metodo con il tangzhong per farlo durare quattro giorni.",
      tags: ["Lievitati", "Forno", "Colazione"],
      related: ["pizza-teglia"]
    },
    {
      id: "tiramisu",
      title: "Tiramisù",
      category: "Dolce",
      subtitle: "Dolce al cucchiaio · 30 min + frigo",
      date: "2026-10-18",
      url: "",
      description: "Versione con uova pastorizzate a bagnomaria, da preparare la sera prima.",
      tags: ["Senza cottura", "Uova", "Classico", "Weekend"],
      related: []
    },
    {
      id: "lista-dispensa",
      title: "Dispensa di base",
      category: "Lista",
      subtitle: "Cosa tenere sempre in casa",
      date: "2026-10-01",
      url: "",
      description: "La lista di cose da ricomprare prima che finiscano: pasta, legumi, conserve, spezie.",
      tags: ["Spesa", "Casa"],
      related: ["carbonara"]
    },
    {
      id: "backup",
      title: "Backup del Mac",
      category: "Guida",
      subtitle: "Time Machine + copia esterna",
      date: "2026-09-28",
      url: "",
      description: "I passaggi per avere sempre due copie dei file, una in casa e una fuori.",
      tags: ["Tech", "Casa"],
      related: []
    },
    {
      id: "appunti-viaggio",
      title: "Prima di partire",
      category: "Nota",
      subtitle: "Checklist viaggio",
      date: "2026-09-15",
      url: "",
      description: "Documenti, caricatori, adattatori, cose da spegnere in casa.",
      tags: ["Viaggi", "Casa"],
      related: ["lista-dispensa"]
    }
  ]
};
