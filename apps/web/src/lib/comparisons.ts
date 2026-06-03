/**
 * Comparison / alternative landing pages — bottom-of-funnel SEO.
 *
 * Two kinds of intent:
 *  - "alternative à X" — people searching for a known tool/category and
 *    open to options (e.g. an installable movie-matching app vs our web app).
 *  - "vs" — people comparing our collaborative-matching approach to a naive
 *    method (random pick / wheel / coin flip).
 *
 * Content must stay HONEST and factual — we compare on real, verifiable
 * differences (web vs native app, free, no install, shared link, multilingual)
 * and never disparage a competitor. URLs are curated; never rename a slug
 * without a 301.
 */

import type { Locale } from '@/i18n';

export type ComparisonEntry = {
  slug: string;
  /** 'alternative' = "alternative to X"; 'vs' = approach comparison. */
  kind: 'alternative' | 'vs';
  /** H1. */
  title: Record<Locale, string>;
  /** SEO meta description (140-160 chars). */
  description: Record<Locale, string>;
  /** Editorial intro (2-3 paragraphs separated by \n\n). */
  intro: Record<Locale, string>;
  /**
   * The comparison table: a list of rows, each comparing Swipe Movie to the
   * "other". `feature` is the row label, `us`/`them` the two cells.
   */
  table: Record<
    Locale,
    {
      themLabel: string;
      rows: Array<{ feature: string; us: string; them: string }>;
    }
  >;
  /** Long-form sections that drive word count. */
  sections: Record<Locale, Array<{ heading: string; body: string }>>;
  /** FAQ — rendered visually and as FAQPage JSON-LD. */
  faq: Record<Locale, Array<{ question: string; answer: string }>>;
  /** Genre slugs to cross-link. */
  relatedGenres: string[];
  /** Provider slugs to cross-link. */
  relatedProviders: string[];
};

function entry<T extends ComparisonEntry>(c: T): T {
  return c;
}

export const COMPARISONS: Record<string, ComparisonEntry> = {
  // Model entry — fully filled across all 5 locales. Use this as the template
  // for additional comparison pages.
  'application-choisir-film': entry({
    slug: 'application-choisir-film',
    kind: 'alternative',
    title: {
      fr: 'Application pour choisir un film : Swipe Movie, sans installation',
      en: 'App to choose a movie: Swipe Movie, no install needed',
      es: 'App para elegir película: Swipe Movie, sin instalación',
      de: 'App zur Filmauswahl: Swipe Movie, ohne Installation',
      it: 'App per scegliere un film: Swipe Movie, senza installazione',
    },
    description: {
      fr: 'À la recherche d’une application pour choisir un film à plusieurs ? Swipe Movie marche dans le navigateur, sans installer d’app, gratuitement.',
      en: 'Looking for an app to choose a movie with friends? Swipe Movie runs in your browser, no install, free to start. Compare and start a room.',
      es: '¿Buscas una app para elegir una película en grupo? Swipe Movie funciona en el navegador, sin instalar nada y gratis para empezar.',
      de: 'Auf der Suche nach einer App zur Filmauswahl in der Gruppe? Swipe Movie läuft im Browser, ohne Installation, kostenlos zum Starten.',
      it: 'Cerchi un’app per scegliere un film in gruppo? Swipe Movie funziona nel browser, senza installazione e gratis per iniziare.',
    },
    intro: {
      fr: 'La plupart des outils pour choisir un film à plusieurs sont des applications mobiles à télécharger : chaque personne doit installer l’app, créer un compte, puis se synchroniser. Swipe Movie prend le problème autrement : tout se passe dans le navigateur. Tu lances une room, tu partages un lien, et tout le monde swipe — sur téléphone, ordinateur ou tablette, sans rien installer.\n\nCette page compare l’approche « application à installer » à celle de Swipe Movie, et t’explique quand l’une ou l’autre a du sens.',
      en: 'Most tools for choosing a movie together are mobile apps you have to download: everyone installs the app, creates an account, then syncs up. Swipe Movie takes a different route: everything happens in the browser. Start a room, share a link, and everyone swipes — on phone, laptop or tablet, with nothing to install.\n\nThis page compares the "install an app" approach to Swipe Movie, and explains when each one makes sense.',
      es: 'La mayoría de las herramientas para elegir una película en grupo son apps móviles que hay que descargar: cada persona instala la app, crea una cuenta y luego se sincroniza. Swipe Movie lo aborda de otra forma: todo ocurre en el navegador. Abres una sala, compartes un enlace y todos deslizan — en móvil, ordenador o tablet, sin instalar nada.\n\nEsta página compara el enfoque de "instalar una app" con el de Swipe Movie, y explica cuándo tiene sentido cada uno.',
      de: 'Die meisten Tools zur gemeinsamen Filmauswahl sind mobile Apps zum Herunterladen: Jede Person installiert die App, erstellt ein Konto und synchronisiert sich dann. Swipe Movie geht es anders an: Alles passiert im Browser. Du startest einen Raum, teilst einen Link, und alle swipen — auf Handy, Laptop oder Tablet, ohne Installation.\n\nDiese Seite vergleicht den "App-installieren"-Ansatz mit Swipe Movie und erklärt, wann welcher Sinn ergibt.',
      it: 'La maggior parte degli strumenti per scegliere un film in gruppo sono app mobili da scaricare: ogni persona installa l’app, crea un account e poi si sincronizza. Swipe Movie affronta il problema in modo diverso: tutto avviene nel browser. Apri una room, condividi un link e tutti swippano — su telefono, computer o tablet, senza installare nulla.\n\nQuesta pagina confronta l’approccio "installa un’app" con quello di Swipe Movie e spiega quando ha senso ciascuno.',
    },
    table: {
      fr: {
        themLabel: 'Apps à installer',
        rows: [
          { feature: 'Installation', us: 'Aucune — dans le navigateur', them: 'Téléchargement requis pour chacun' },
          { feature: 'Inviter des amis', us: 'Un simple lien à partager', them: 'Chacun installe l’app + compte' },
          { feature: 'Appareils', us: 'Téléphone, ordi, tablette', them: 'Souvent mobile uniquement' },
          { feature: 'Prix', us: 'Gratuit pour commencer', them: 'Variable, parfois payant' },
          { feature: 'Plateformes de streaming', us: 'Netflix, Prime, Disney+, Max…', them: 'Variable' },
        ],
      },
      en: {
        themLabel: 'Apps to install',
        rows: [
          { feature: 'Install', us: 'None — runs in the browser', them: 'Download required for everyone' },
          { feature: 'Inviting friends', us: 'Just share a link', them: 'Everyone installs the app + account' },
          { feature: 'Devices', us: 'Phone, laptop, tablet', them: 'Often mobile only' },
          { feature: 'Price', us: 'Free to start', them: 'Varies, sometimes paid' },
          { feature: 'Streaming platforms', us: 'Netflix, Prime, Disney+, Max…', them: 'Varies' },
        ],
      },
      es: {
        themLabel: 'Apps para instalar',
        rows: [
          { feature: 'Instalación', us: 'Ninguna — en el navegador', them: 'Descarga obligatoria para todos' },
          { feature: 'Invitar amigos', us: 'Solo compartir un enlace', them: 'Cada uno instala la app + cuenta' },
          { feature: 'Dispositivos', us: 'Móvil, ordenador, tablet', them: 'A menudo solo móvil' },
          { feature: 'Precio', us: 'Gratis para empezar', them: 'Variable, a veces de pago' },
          { feature: 'Plataformas de streaming', us: 'Netflix, Prime, Disney+, Max…', them: 'Variable' },
        ],
      },
      de: {
        themLabel: 'Apps zum Installieren',
        rows: [
          { feature: 'Installation', us: 'Keine — im Browser', them: 'Download für alle erforderlich' },
          { feature: 'Freunde einladen', us: 'Einfach einen Link teilen', them: 'Jeder installiert App + Konto' },
          { feature: 'Geräte', us: 'Handy, Laptop, Tablet', them: 'Oft nur mobil' },
          { feature: 'Preis', us: 'Kostenlos zum Starten', them: 'Unterschiedlich, teils kostenpflichtig' },
          { feature: 'Streaming-Plattformen', us: 'Netflix, Prime, Disney+, Max…', them: 'Unterschiedlich' },
        ],
      },
      it: {
        themLabel: 'App da installare',
        rows: [
          { feature: 'Installazione', us: 'Nessuna — nel browser', them: 'Download richiesto per tutti' },
          { feature: 'Invitare amici', us: 'Basta condividere un link', them: 'Ognuno installa l’app + account' },
          { feature: 'Dispositivi', us: 'Telefono, computer, tablet', them: 'Spesso solo mobile' },
          { feature: 'Prezzo', us: 'Gratis per iniziare', them: 'Variabile, a volte a pagamento' },
          { feature: 'Piattaforme streaming', us: 'Netflix, Prime, Disney+, Max…', them: 'Variabile' },
        ],
      },
    },
    sections: {
      fr: [
        {
          heading: 'Pourquoi pas d’application à installer ?',
          body: 'Demander à chaque ami d’installer une app est le plus gros point de friction d’une soirée film : il y a toujours quelqu’un qui n’a pas de place sur son téléphone ou qui abandonne au moment de créer un compte. Swipe Movie supprime cette étape — un lien partagé ouvre la room directement dans le navigateur, et le swipe commence en quelques secondes.',
        },
        {
          heading: 'Quand une app native a quand même du sens',
          body: 'Si tu veux des notifications push natives et un usage 100% solo au quotidien, une app installée peut être plus pratique. Pour une décision ponctuelle à plusieurs — le cas le plus fréquent — le web sans installation gagne presque toujours sur la simplicité.',
        },
      ],
      en: [
        {
          heading: 'Why no app to install?',
          body: 'Asking every friend to install an app is the biggest friction point of a movie night: there’s always someone with no storage left or who bails when asked to create an account. Swipe Movie removes that step — a shared link opens the room straight in the browser, and swiping starts in seconds.',
        },
        {
          heading: 'When a native app still makes sense',
          body: 'If you want native push notifications and heavy solo daily use, an installed app can be handier. For a one-off group decision — the most common case — no-install web almost always wins on simplicity.',
        },
      ],
      es: [
        {
          heading: '¿Por qué sin app que instalar?',
          body: 'Pedir a cada amigo que instale una app es el mayor punto de fricción de una noche de cine: siempre hay alguien sin espacio en el móvil o que se rinde al crear una cuenta. Swipe Movie elimina ese paso — un enlace compartido abre la sala directamente en el navegador y el swipe empieza en segundos.',
        },
        {
          heading: 'Cuándo una app nativa sí tiene sentido',
          body: 'Si quieres notificaciones push nativas y un uso intensivo en solitario a diario, una app instalada puede ser más cómoda. Para una decisión puntual en grupo — el caso más común — la web sin instalación casi siempre gana en simplicidad.',
        },
      ],
      de: [
        {
          heading: 'Warum keine App zum Installieren?',
          body: 'Jeden Freund zu bitten, eine App zu installieren, ist der größte Reibungspunkt eines Filmabends: Immer hat jemand keinen Speicher mehr oder bricht beim Konto-Erstellen ab. Swipe Movie entfernt diesen Schritt — ein geteilter Link öffnet den Raum direkt im Browser, und das Swipen beginnt in Sekunden.',
        },
        {
          heading: 'Wann eine native App trotzdem Sinn ergibt',
          body: 'Wenn du native Push-Benachrichtigungen und intensive tägliche Solo-Nutzung willst, kann eine installierte App praktischer sein. Für eine einmalige Gruppenentscheidung — der häufigste Fall — gewinnt Web ohne Installation fast immer bei der Einfachheit.',
        },
      ],
      it: [
        {
          heading: 'Perché nessuna app da installare?',
          body: 'Chiedere a ogni amico di installare un’app è il maggiore punto di attrito di una serata film: c’è sempre qualcuno senza spazio sul telefono o che rinuncia al momento di creare un account. Swipe Movie elimina questo passaggio — un link condiviso apre la room direttamente nel browser e lo swipe inizia in pochi secondi.',
        },
        {
          heading: 'Quando un’app nativa ha comunque senso',
          body: 'Se vuoi notifiche push native e un uso intensivo in solitaria ogni giorno, un’app installata può essere più comoda. Per una decisione occasionale di gruppo — il caso più frequente — il web senza installazione vince quasi sempre in semplicità.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Faut-il télécharger une application pour utiliser Swipe Movie ?',
          answer: 'Non. Swipe Movie fonctionne entièrement dans le navigateur. Tu peux l’ajouter à ton écran d’accueil comme une app (PWA) si tu veux, mais aucune installation n’est requise.',
        },
        {
          question: 'Comment inviter mes amis sans qu’ils installent quoi que ce soit ?',
          answer: 'Tu partages le lien de la room. Chaque personne l’ouvre dans son navigateur et commence à swiper immédiatement, sur n’importe quel appareil.',
        },
        {
          question: 'Swipe Movie est-il gratuit ?',
          answer: 'Oui, gratuit pour commencer : créer une room, swiper et matcher ne coûte rien.',
        },
      ],
      en: [
        {
          question: 'Do I need to download an app to use Swipe Movie?',
          answer: 'No. Swipe Movie runs entirely in the browser. You can add it to your home screen like an app (PWA) if you want, but no install is required.',
        },
        {
          question: 'How do I invite friends without them installing anything?',
          answer: 'You share the room link. Everyone opens it in their browser and starts swiping right away, on any device.',
        },
        {
          question: 'Is Swipe Movie free?',
          answer: 'Yes, free to start: creating a room, swiping and matching costs nothing.',
        },
      ],
      es: [
        {
          question: '¿Necesito descargar una app para usar Swipe Movie?',
          answer: 'No. Swipe Movie funciona enteramente en el navegador. Puedes añadirlo a tu pantalla de inicio como una app (PWA) si quieres, pero no hace falta instalar nada.',
        },
        {
          question: '¿Cómo invito a mis amigos sin que instalen nada?',
          answer: 'Compartes el enlace de la sala. Cada persona lo abre en su navegador y empieza a deslizar al instante, en cualquier dispositivo.',
        },
        {
          question: '¿Swipe Movie es gratis?',
          answer: 'Sí, gratis para empezar: crear una sala, deslizar y hacer match no cuesta nada.',
        },
      ],
      de: [
        {
          question: 'Muss ich eine App herunterladen, um Swipe Movie zu nutzen?',
          answer: 'Nein. Swipe Movie läuft komplett im Browser. Du kannst es bei Bedarf wie eine App (PWA) zum Startbildschirm hinzufügen, aber eine Installation ist nicht nötig.',
        },
        {
          question: 'Wie lade ich Freunde ein, ohne dass sie etwas installieren?',
          answer: 'Du teilst den Raum-Link. Jeder öffnet ihn im Browser und beginnt sofort zu swipen, auf jedem Gerät.',
        },
        {
          question: 'Ist Swipe Movie kostenlos?',
          answer: 'Ja, kostenlos zum Starten: Einen Raum erstellen, swipen und matchen kostet nichts.',
        },
      ],
      it: [
        {
          question: 'Devo scaricare un’app per usare Swipe Movie?',
          answer: 'No. Swipe Movie funziona interamente nel browser. Puoi aggiungerlo alla schermata home come un’app (PWA) se vuoi, ma non serve installare nulla.',
        },
        {
          question: 'Come invito gli amici senza che installino niente?',
          answer: 'Condividi il link della room. Ognuno lo apre nel browser e inizia subito a swippare, su qualsiasi dispositivo.',
        },
        {
          question: 'Swipe Movie è gratis?',
          answer: 'Sì, gratis per iniziare: creare una room, swippare e fare match non costa nulla.',
        },
      ],
    },
    relatedGenres: ['comedie', 'drame', 'action'],
    relatedProviders: ['netflix', 'prime-video', 'disney-plus'],
  }),

  // "vs" entry — collaborative matching compared to picking at random.
  'swipe-movie-vs-tirage-au-sort': entry({
    slug: 'swipe-movie-vs-tirage-au-sort',
    kind: 'vs',
    title: {
      fr: 'Choisir un film : matching collaboratif ou tirage au sort ?',
      en: 'Choosing a movie: collaborative matching or random pick?',
      es: 'Elegir película: matching colaborativo o sorteo al azar?',
      de: 'Film wählen: gemeinsames Matching oder Zufallslos?',
      it: 'Scegliere un film: matching collaborativo o sorteggio?',
    },
    description: {
      fr: 'Tirage au sort, roue aléatoire ou matching collaboratif pour choisir un film à plusieurs ? On compare honnêtement vitesse et satisfaction du groupe.',
      en: 'Random pick, spin wheel or collaborative matching to choose a movie together? We honestly compare speed and how happy the whole group ends up.',
      es: 'Sorteo al azar, ruleta o matching colaborativo para elegir película en grupo? Comparamos con honestidad la rapidez y la satisfacción del grupo.',
      de: 'Zufallslos, Glücksrad oder gemeinsames Matching, um zusammen einen Film zu wählen? Wir vergleichen ehrlich Tempo und Zufriedenheit der Gruppe.',
      it: 'Sorteggio, ruota casuale o matching collaborativo per scegliere un film in gruppo? Confrontiamo onestamente velocità e soddisfazione del gruppo.',
    },
    intro: {
      fr: 'Quand un groupe n’arrive pas à se décider, on finit souvent par bricoler une méthode : tirage au sort dans une liste, roue aléatoire en ligne, pile ou face, ou le fameux « ce soir c’est toi qui choisis ». Ces méthodes ont un mérite : elles tranchent vite. Mais elles ont un défaut commun — elles ignorent totalement les goûts de chacun, donc rien ne garantit que le film tiré plaira au groupe.\n\nLe matching collaboratif de Swipe Movie part de l’autre bout : tout le monde swipe sur les mêmes films, et on ne garde que ceux qui plaisent à TOUS. Cette page compare honnêtement les deux approches — le hasard est plus rapide à lancer, le matching demande quelques minutes de swipe mais cherche un vrai consensus.',
      en: 'When a group can’t decide, people often improvise a method: drawing lots from a list, an online spin wheel, a coin flip, or the classic "tonight it’s your turn to choose". These methods have one merit: they settle things fast. But they share one flaw — they ignore everyone’s taste entirely, so nothing guarantees the chosen film will please the group.\n\nSwipe Movie’s collaborative matching starts from the opposite end: everyone swipes on the same films, and you only keep the ones EVERYONE likes. This page honestly compares the two approaches — randomness is faster to launch, matching takes a few minutes of swiping but looks for real consensus.',
      es: 'Cuando un grupo no se decide, suele improvisar un método: sortear de una lista, una ruleta online, cara o cruz, o el clásico "esta noche eliges tú". Estos métodos tienen un mérito: zanjan rápido. Pero comparten un fallo — ignoran por completo los gustos de cada uno, así que nada garantiza que la película sorteada guste al grupo.\n\nEl matching colaborativo de Swipe Movie parte del lado contrario: todos deslizan sobre las mismas películas y solo se conserva lo que gusta a TODOS. Esta página compara con honestidad ambos enfoques — el azar es más rápido de lanzar, el matching pide unos minutos de swipe pero busca un consenso real.',
      de: 'Wenn eine Gruppe sich nicht einigen kann, improvisiert man oft eine Methode: aus einer Liste losen, ein Online-Glücksrad, Münzwurf oder das klassische "heute wählst du". Diese Methoden haben einen Vorteil: Sie entscheiden schnell. Doch sie teilen einen Mangel — sie ignorieren den Geschmack aller völlig, also garantiert nichts, dass der gezogene Film der Gruppe gefällt.\n\nDas gemeinsame Matching von Swipe Movie setzt am anderen Ende an: Alle swipen über dieselben Filme, und es bleibt nur, was ALLEN gefällt. Diese Seite vergleicht ehrlich beide Ansätze — der Zufall ist schneller gestartet, das Matching kostet ein paar Minuten Swipen, sucht aber echten Konsens.',
      it: 'Quando un gruppo non riesce a decidere, spesso si improvvisa un metodo: estrarre a sorte da una lista, una ruota online, testa o croce, o il classico "stasera scegli tu". Questi metodi hanno un pregio: decidono in fretta. Ma condividono un difetto — ignorano del tutto i gusti di ognuno, quindi nulla garantisce che il film estratto piaccia al gruppo.\n\nIl matching collaborativo di Swipe Movie parte dal lato opposto: tutti swippano sugli stessi film e si tiene solo ciò che piace a TUTTI. Questa pagina confronta onestamente i due approcci — il caso è più rapido da avviare, il matching richiede qualche minuto di swipe ma cerca un vero consenso.',
    },
    table: {
      fr: {
        themLabel: 'Tirage aléatoire / au sort',
        rows: [
          { feature: 'Prise en compte des goûts', us: 'Oui — chacun swipe ses envies', them: 'Aucune — purement aléatoire' },
          { feature: 'Satisfaction du groupe', us: 'Élevée — on garde ce qui plaît à tous', them: 'Au petit bonheur la chance' },
          { feature: 'Risque d’un film que personne n’aime', us: 'Faible — filtré par les swipes', them: 'Réel — rien ne filtre' },
          { feature: 'Frustrations / tour de rôle', us: 'Évitées — décision commune', them: 'Fréquentes — chacun son tour' },
          { feature: 'Rapidité de mise en place', us: 'Quelques minutes de swipe', them: 'Immédiate' },
          { feature: 'Marche à plusieurs', us: 'Oui, tout le groupe en même temps', them: 'Oui, mais sans consensus' },
        ],
      },
      en: {
        themLabel: 'Random draw / lottery',
        rows: [
          { feature: 'Takes taste into account', us: 'Yes — everyone swipes their picks', them: 'None — purely random' },
          { feature: 'Group satisfaction', us: 'High — keeps what everyone likes', them: 'Hit or miss' },
          { feature: 'Risk of a film nobody likes', us: 'Low — filtered by swipes', them: 'Real — nothing filters it' },
          { feature: 'Frustration / taking turns', us: 'Avoided — shared decision', them: 'Common — each their turn' },
          { feature: 'Setup speed', us: 'A few minutes of swiping', them: 'Instant' },
          { feature: 'Works for a group', us: 'Yes, the whole group at once', them: 'Yes, but without consensus' },
        ],
      },
      es: {
        themLabel: 'Sorteo / azar',
        rows: [
          { feature: 'Tiene en cuenta los gustos', us: 'Sí — cada uno desliza lo suyo', them: 'Ninguno — puro azar' },
          { feature: 'Satisfacción del grupo', us: 'Alta — conserva lo que gusta a todos', them: 'A la suerte' },
          { feature: 'Riesgo de una peli que nadie quiere', us: 'Bajo — filtrado por los swipes', them: 'Real — nada lo filtra' },
          { feature: 'Frustración / por turnos', us: 'Evitada — decisión común', them: 'Frecuente — cada uno su turno' },
          { feature: 'Rapidez de puesta en marcha', us: 'Unos minutos de swipe', them: 'Inmediata' },
          { feature: 'Funciona en grupo', us: 'Sí, todo el grupo a la vez', them: 'Sí, pero sin consenso' },
        ],
      },
      de: {
        themLabel: 'Zufallslos / Verlosung',
        rows: [
          { feature: 'Berücksichtigt den Geschmack', us: 'Ja — jeder swipt seine Wünsche', them: 'Keiner — rein zufällig' },
          { feature: 'Zufriedenheit der Gruppe', us: 'Hoch — behält, was allen gefällt', them: 'Glückssache' },
          { feature: 'Risiko eines ungeliebten Films', us: 'Gering — durch Swipes gefiltert', them: 'Real — nichts filtert' },
          { feature: 'Frust / Reihum-Wählen', us: 'Vermieden — gemeinsame Entscheidung', them: 'Häufig — jeder mal dran' },
          { feature: 'Tempo der Einrichtung', us: 'Ein paar Minuten Swipen', them: 'Sofort' },
          { feature: 'Funktioniert für Gruppen', us: 'Ja, die ganze Gruppe gleichzeitig', them: 'Ja, aber ohne Konsens' },
        ],
      },
      it: {
        themLabel: 'Sorteggio / caso',
        rows: [
          { feature: 'Tiene conto dei gusti', us: 'Sì — ognuno swippa le sue voglie', them: 'Nessuno — puro caso' },
          { feature: 'Soddisfazione del gruppo', us: 'Alta — tiene ciò che piace a tutti', them: 'A fortuna' },
          { feature: 'Rischio di un film che nessuno ama', us: 'Basso — filtrato dagli swipe', them: 'Reale — nulla lo filtra' },
          { feature: 'Frustrazione / a turni', us: 'Evitata — decisione comune', them: 'Frequente — ognuno il suo turno' },
          { feature: 'Rapidità di avvio', us: 'Qualche minuto di swipe', them: 'Immediata' },
          { feature: 'Funziona in gruppo', us: 'Sì, tutto il gruppo insieme', them: 'Sì, ma senza consenso' },
        ],
      },
    },
    sections: {
      fr: [
        {
          heading: 'Le hasard ignore ce que vous aimez',
          body: 'Un tirage au sort ou une roue aléatoire traite tous les films comme équivalents : le générateur ne sait pas que la moitié du groupe déteste l’horreur ou que personne n’a envie d’un film de trois heures un soir de semaine. Le résultat tombe, et il faut soit l’accepter à contrecœur, soit relancer — ce qui annule le gain de temps. Le matching collaboratif part au contraire des envies réelles : chaque swipe à droite est un vote, et un match n’apparaît que lorsque l’intersection des goûts existe vraiment.',
        },
        {
          heading: 'Quand le tirage au sort reste une bonne idée',
          body: 'Soyons honnêtes : si vous êtes deux, déjà d’accord sur le genre, et qu’il ne reste que deux titres à départager, un pile ou face est parfait — instantané et sans appli. Le tour de rôle (« ce soir tu choisis ») fonctionne aussi sur la durée, à condition d’accepter qu’une personne sur deux subisse le choix de l’autre. Le matching brille surtout quand le groupe est plus large, les goûts plus éloignés, et que vous voulez éviter la déception d’un film que personne n’a vraiment choisi.',
        },
      ],
      en: [
        {
          heading: 'Randomness ignores what you like',
          body: 'A random draw or spin wheel treats every film as equivalent: the generator doesn’t know that half the group hates horror or that nobody wants a three-hour film on a weeknight. The result lands, and you either accept it reluctantly or spin again — which cancels the time saved. Collaborative matching starts from real preferences instead: each right swipe is a vote, and a match only appears when an overlap of taste genuinely exists.',
        },
        {
          heading: 'When a random pick is still a good idea',
          body: 'Let’s be honest: if there are two of you, already agreed on the genre, with just two titles left to settle, a coin flip is perfect — instant and app-free. Taking turns ("tonight you choose") also works over time, as long as you accept that one in two people endures the other’s pick. Matching shines most when the group is larger, tastes are further apart, and you want to avoid the letdown of a film nobody really chose.',
        },
      ],
      es: [
        {
          heading: 'El azar ignora lo que te gusta',
          body: 'Un sorteo o una ruleta trata todas las películas como equivalentes: el generador no sabe que la mitad del grupo odia el terror o que nadie quiere un peliculón de tres horas entre semana. Sale el resultado y o lo aceptas a regañadientes o vuelves a tirar — lo que anula el tiempo ahorrado. El matching colaborativo parte en cambio de las ganas reales: cada swipe a la derecha es un voto y un match solo aparece cuando existe de verdad una coincidencia de gustos.',
        },
        {
          heading: 'Cuándo el sorteo sigue siendo buena idea',
          body: 'Seamos honestos: si sois dos, ya de acuerdo en el género y solo quedan dos títulos por desempatar, cara o cruz es perfecto — instantáneo y sin app. El turno rotativo ("esta noche eliges tú") también funciona a la larga, siempre que aceptéis que una de cada dos veces alguien sufre la elección del otro. El matching brilla sobre todo cuando el grupo es más grande, los gustos más dispares y queréis evitar la decepción de una peli que nadie eligió de verdad.',
        },
      ],
      de: [
        {
          heading: 'Der Zufall ignoriert, was ihr mögt',
          body: 'Ein Zufallslos oder Glücksrad behandelt jeden Film als gleichwertig: Der Generator weiß nicht, dass die halbe Gruppe Horror hasst oder niemand unter der Woche einen Dreistünder will. Das Ergebnis fällt, und ihr akzeptiert es widerwillig oder dreht erneut — was den Zeitgewinn aufhebt. Das gemeinsame Matching geht stattdessen von echten Vorlieben aus: Jeder Swipe nach rechts ist eine Stimme, und ein Match erscheint nur, wenn eine Überschneidung des Geschmacks wirklich existiert.',
        },
        {
          heading: 'Wann ein Zufallslos trotzdem gut ist',
          body: 'Seien wir ehrlich: Wenn ihr zu zweit seid, euch beim Genre schon einig und nur zwei Titel übrig bleiben, ist ein Münzwurf perfekt — sofort und ohne App. Reihum wählen ("heute wählst du") funktioniert auf Dauer auch, sofern ihr akzeptiert, dass jeder Zweite die Wahl des anderen erträgt. Matching glänzt vor allem, wenn die Gruppe größer ist, die Vorlieben weiter auseinanderliegen und ihr die Enttäuschung über einen Film vermeiden wollt, den niemand wirklich gewählt hat.',
        },
      ],
      it: [
        {
          heading: 'Il caso ignora ciò che ti piace',
          body: 'Un sorteggio o una ruota tratta ogni film come equivalente: il generatore non sa che metà del gruppo odia l’horror o che nessuno vuole un film di tre ore in una sera feriale. Il risultato esce e o lo accetti controvoglia o rilanci — il che annulla il tempo risparmiato. Il matching collaborativo parte invece dalle voglie reali: ogni swipe a destra è un voto e un match appare solo quando esiste davvero una sovrapposizione di gusti.',
        },
        {
          heading: 'Quando il sorteggio resta una buona idea',
          body: 'Siamo onesti: se siete in due, già d’accordo sul genere e restano solo due titoli da spareggiare, testa o croce è perfetto — istantaneo e senza app. Il turno a rotazione ("stasera scegli tu") funziona anche a lungo andare, purché accettiate che una volta su due qualcuno subisce la scelta dell’altro. Il matching brilla soprattutto quando il gruppo è più ampio, i gusti più distanti e volete evitare la delusione di un film che nessuno ha davvero scelto.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Le tirage au sort n’est-il pas plus rapide que de swiper ?',
          answer: 'Pour lancer, oui : un tirage est instantané. Mais si le film tiré ne plaît pas, vous relancez ou vous le subissez. Quelques minutes de swipe en amont évitent souvent ces allers-retours et la déception.',
        },
        {
          question: 'Comment le matching évite-t-il un film que personne n’aime ?',
          answer: 'Un match n’apparaît que lorsqu’un même film a été aimé par les personnes concernées. Comme rien ne remonte sans accord, le risque de tomber sur un titre rejeté par tous disparaît.',
        },
        {
          question: 'Et le « ce soir c’est toi qui choisis » ?',
          answer: 'Le tour de rôle marche, mais une personne décide pendant que les autres suivent. Le matching cherche au contraire un choix qui convient à tout le monde la même soirée.',
        },
      ],
      en: [
        {
          question: 'Isn’t a random draw faster than swiping?',
          answer: 'To launch, yes: a draw is instant. But if the drawn film flops, you redraw or endure it. A few minutes of swiping upfront often avoids that back-and-forth and the disappointment.',
        },
        {
          question: 'How does matching avoid a film nobody likes?',
          answer: 'A match only appears when the same film was liked by the people involved. Since nothing surfaces without agreement, the risk of landing on a title everyone rejects disappears.',
        },
        {
          question: 'What about "tonight it’s your turn to choose"?',
          answer: 'Taking turns works, but one person decides while the others follow along. Matching instead looks for a choice that suits everyone on the same night.',
        },
      ],
      es: [
        {
          question: 'No es más rápido un sorteo que ponerse a deslizar?',
          answer: 'Para lanzar, sí: un sorteo es instantáneo. Pero si la película sorteada no gusta, vuelves a tirar o la aguantas. Unos minutos de swipe antes suelen evitar ese ir y venir y la decepción.',
        },
        {
          question: 'Cómo evita el matching una película que nadie quiere?',
          answer: 'Un match solo aparece cuando una misma película ha gustado a las personas implicadas. Como nada sale sin acuerdo, desaparece el riesgo de caer en un título que todos rechazan.',
        },
        {
          question: 'Y lo de "esta noche eliges tú"?',
          answer: 'El turno rotativo funciona, pero una persona decide mientras las demás siguen. El matching busca en cambio una elección que convenga a todos la misma noche.',
        },
      ],
      de: [
        {
          question: 'Ist ein Zufallslos nicht schneller als Swipen?',
          answer: 'Zum Starten ja: Ein Los ist sofort. Doch wenn der gezogene Film floppt, lost ihr neu oder ertragt ihn. Ein paar Minuten Swipen vorab ersparen oft dieses Hin und Her und die Enttäuschung.',
        },
        {
          question: 'Wie vermeidet Matching einen Film, den niemand mag?',
          answer: 'Ein Match erscheint nur, wenn derselbe Film den beteiligten Personen gefallen hat. Da ohne Einigung nichts auftaucht, verschwindet das Risiko, bei einem von allen abgelehnten Titel zu landen.',
        },
        {
          question: 'Und das "heute wählst du"?',
          answer: 'Reihum wählen funktioniert, aber eine Person entscheidet, während die anderen mitziehen. Matching sucht stattdessen eine Wahl, die am selben Abend allen passt.',
        },
      ],
      it: [
        {
          question: 'Un sorteggio non è più veloce che mettersi a swippare?',
          answer: 'Per avviare sì: un sorteggio è istantaneo. Ma se il film estratto non piace, riestrai o lo subisci. Qualche minuto di swipe prima evita spesso questo avanti e indietro e la delusione.',
        },
        {
          question: 'Come evita il matching un film che nessuno vuole?',
          answer: 'Un match appare solo quando lo stesso film è piaciuto alle persone coinvolte. Poiché nulla emerge senza accordo, sparisce il rischio di capitare su un titolo rifiutato da tutti.',
        },
        {
          question: 'E il "stasera scegli tu"?',
          answer: 'Il turno a rotazione funziona, ma una persona decide mentre le altre seguono. Il matching cerca invece una scelta che vada bene a tutti la stessa sera.',
        },
      ],
    },
    relatedGenres: ['comedie', 'action', 'drame'],
    relatedProviders: ['netflix', 'prime-video', 'disney-plus'],
  }),

  // "alternative" entry — web alternative to installable couple-movie apps.
  'alternative-application-film-couple': entry({
    slug: 'alternative-application-film-couple',
    kind: 'alternative',
    title: {
      fr: 'Alternative aux applications de film pour couples : Swipe Movie sur le web',
      en: 'Alternative to couple movie apps: Swipe Movie on the web',
      es: 'Alternativa a las apps de película para parejas: Swipe Movie en la web',
      de: 'Alternative zu Paar-Film-Apps: Swipe Movie im Web',
      it: 'Alternativa alle app di film per coppie: Swipe Movie sul web',
    },
    description: {
      fr: 'Cherches une alternative aux apps mobiles de film pour couples ? Swipe Movie marche sur le web, sans installer d’app, à deux ou à plusieurs, et multilingue.',
      en: 'Looking for an alternative to installable couple movie apps? Swipe Movie runs on the web, no app to install, for two or a group, and multilingual.',
      es: 'Buscas una alternativa a las apps móviles de película para parejas? Swipe Movie funciona en la web, sin instalar app, en pareja o en grupo, y multilingüe.',
      de: 'Suchst du eine Alternative zu installierbaren Paar-Film-Apps? Swipe Movie läuft im Web, ohne App-Installation, zu zweit oder in der Gruppe, mehrsprachig.',
      it: 'Cerchi un’alternativa alle app mobili di film per coppie? Swipe Movie funziona sul web, senza installare app, in due o in gruppo, e multilingue.',
    },
    intro: {
      fr: 'Beaucoup d’outils du type « film pour couples » sont des applications mobiles à télécharger : il faut installer l’app sur chaque téléphone et, souvent, l’expérience est pensée pour deux personnes. Swipe Movie propose une autre voie — une alternative web qui s’ouvre dans le navigateur, sans rien installer, sur n’importe quel appareil.\n\nL’autre différence est le format : là où une app « pour couples » se limite souvent à deux, Swipe Movie fonctionne aussi bien à deux qu’à plusieurs, ce qui couvre la soirée en couple comme la soirée entre amis. C’est multilingue, et gratuit pour commencer.',
      en: 'Many "couple movie" tools are mobile apps you download: you install the app on each phone and the experience is often built for two people. Swipe Movie offers another path — a web alternative that opens in the browser, with nothing to install, on any device.\n\nThe other difference is the format: where a "for couples" app often caps at two, Swipe Movie works just as well for two as for a group, covering both the date night and the night with friends. It’s multilingual, and free to start.',
      es: 'Muchas herramientas de tipo "película para parejas" son apps móviles que se descargan: instalas la app en cada móvil y la experiencia suele estar pensada para dos personas. Swipe Movie ofrece otra vía — una alternativa web que se abre en el navegador, sin instalar nada, en cualquier dispositivo.\n\nLa otra diferencia es el formato: donde una app "para parejas" suele limitarse a dos, Swipe Movie funciona igual de bien en pareja que en grupo, cubriendo tanto la cita como la noche con amigos. Es multilingüe y gratis para empezar.',
      de: 'Viele "Paar-Film"-Tools sind mobile Apps zum Herunterladen: Du installierst die App auf jedem Handy, und das Erlebnis ist oft für zwei Personen gedacht. Swipe Movie bietet einen anderen Weg — eine Web-Alternative, die im Browser öffnet, ohne Installation, auf jedem Gerät.\n\nDer andere Unterschied ist das Format: Wo eine "für Paare"-App oft bei zwei endet, funktioniert Swipe Movie zu zweit genauso gut wie in der Gruppe und deckt den Paarabend wie den Abend mit Freunden ab. Es ist mehrsprachig und kostenlos zum Starten.',
      it: 'Molti strumenti di tipo "film per coppie" sono app mobili da scaricare: installi l’app su ogni telefono e l’esperienza è spesso pensata per due persone. Swipe Movie propone un’altra via — un’alternativa web che si apre nel browser, senza installare nulla, su qualsiasi dispositivo.\n\nL’altra differenza è il formato: dove un’app "per coppie" spesso si ferma a due, Swipe Movie funziona bene sia in due sia in gruppo, coprendo la serata di coppia come quella con gli amici. È multilingue e gratis per iniziare.',
    },
    table: {
      fr: {
        themLabel: 'Apps mobiles pour couples',
        rows: [
          { feature: 'Installation', us: 'Aucune — dans le navigateur', them: 'App mobile à télécharger' },
          { feature: 'Nombre de participants', us: 'À deux ou à plusieurs', them: 'Souvent pensé pour deux' },
          { feature: 'Appareils', us: 'Téléphone, ordi, tablette', them: 'Mobile (iOS / Android)' },
          { feature: 'Langues', us: 'Multilingue (fr, en, es, de, it)', them: 'Variable selon l’app' },
          { feature: 'Prix', us: 'Gratuit pour commencer', them: 'Variable selon l’app' },
        ],
      },
      en: {
        themLabel: 'Mobile couple apps',
        rows: [
          { feature: 'Install', us: 'None — in the browser', them: 'Mobile app to download' },
          { feature: 'Number of participants', us: 'For two or a group', them: 'Often built for two' },
          { feature: 'Devices', us: 'Phone, laptop, tablet', them: 'Mobile (iOS / Android)' },
          { feature: 'Languages', us: 'Multilingual (en, fr, es, de, it)', them: 'Varies by app' },
          { feature: 'Price', us: 'Free to start', them: 'Varies by app' },
        ],
      },
      es: {
        themLabel: 'Apps móviles para parejas',
        rows: [
          { feature: 'Instalación', us: 'Ninguna — en el navegador', them: 'App móvil que descargar' },
          { feature: 'Número de participantes', us: 'En pareja o en grupo', them: 'A menudo pensada para dos' },
          { feature: 'Dispositivos', us: 'Móvil, ordenador, tablet', them: 'Móvil (iOS / Android)' },
          { feature: 'Idiomas', us: 'Multilingüe (es, en, fr, de, it)', them: 'Variable según la app' },
          { feature: 'Precio', us: 'Gratis para empezar', them: 'Variable según la app' },
        ],
      },
      de: {
        themLabel: 'Mobile Paar-Apps',
        rows: [
          { feature: 'Installation', us: 'Keine — im Browser', them: 'Mobile App zum Herunterladen' },
          { feature: 'Zahl der Teilnehmer', us: 'Zu zweit oder in der Gruppe', them: 'Oft für zwei gedacht' },
          { feature: 'Geräte', us: 'Handy, Laptop, Tablet', them: 'Mobil (iOS / Android)' },
          { feature: 'Sprachen', us: 'Mehrsprachig (de, en, fr, es, it)', them: 'Je nach App' },
          { feature: 'Preis', us: 'Kostenlos zum Starten', them: 'Je nach App' },
        ],
      },
      it: {
        themLabel: 'App mobili per coppie',
        rows: [
          { feature: 'Installazione', us: 'Nessuna — nel browser', them: 'App mobile da scaricare' },
          { feature: 'Numero di partecipanti', us: 'In due o in gruppo', them: 'Spesso pensata per due' },
          { feature: 'Dispositivi', us: 'Telefono, computer, tablet', them: 'Mobile (iOS / Android)' },
          { feature: 'Lingue', us: 'Multilingue (it, en, fr, es, de)', them: 'Variabile per app' },
          { feature: 'Prezzo', us: 'Gratis per iniziare', them: 'Variabile per app' },
        ],
      },
    },
    sections: {
      fr: [
        {
          heading: 'Une alternative web, sans installation',
          body: 'L’atout principal d’une alternative web est l’absence d’installation : pas besoin que chaque personne télécharge une app, crée un compte mobile et se synchronise. Avec Swipe Movie, tu ouvres une room et tu partages un lien — l’autre personne (ou tout le groupe) le suit dans son navigateur et commence à swiper. Ça fonctionne sur iPhone, Android, ordinateur ou tablette, sans passer par un store.',
        },
        {
          heading: 'Pas seulement pour les couples',
          body: 'Le terme « app de film pour couples » suppose deux personnes. Swipe Movie ne fait pas cette hypothèse : la même room marche pour un couple un mardi soir et pour quatre amis le samedi. Le mécanisme reste identique — chacun swipe, et on garde les films qui plaisent à l’ensemble — ce qui évite d’avoir un outil pour le couple et un autre pour le groupe.',
        },
      ],
      en: [
        {
          heading: 'A web alternative, no install',
          body: 'The main upside of a web alternative is no install: no need for each person to download an app, create a mobile account and sync up. With Swipe Movie you open a room and share a link — the other person (or the whole group) follows it in their browser and starts swiping. It works on iPhone, Android, laptop or tablet, without going through a store.',
        },
        {
          heading: 'Not just for couples',
          body: 'The phrase "couple movie app" assumes two people. Swipe Movie makes no such assumption: the same room works for a couple on a Tuesday night and for four friends on Saturday. The mechanism stays identical — everyone swipes, and you keep the films the whole set likes — so you don’t need one tool for the couple and another for the group.',
        },
      ],
      es: [
        {
          heading: 'Una alternativa web, sin instalación',
          body: 'La principal ventaja de una alternativa web es la ausencia de instalación: no hace falta que cada persona descargue una app, cree una cuenta móvil y se sincronice. Con Swipe Movie abres una sala y compartes un enlace — la otra persona (o todo el grupo) lo abre en su navegador y empieza a deslizar. Funciona en iPhone, Android, ordenador o tablet, sin pasar por una tienda.',
        },
        {
          heading: 'No solo para parejas',
          body: 'La expresión "app de película para parejas" da por hecho que son dos. Swipe Movie no asume eso: la misma sala sirve para una pareja un martes y para cuatro amigos el sábado. El mecanismo es idéntico — todos deslizan y se conservan las películas que gustan al conjunto — así no necesitas una herramienta para la pareja y otra para el grupo.',
        },
      ],
      de: [
        {
          heading: 'Eine Web-Alternative, ohne Installation',
          body: 'Der Hauptvorteil einer Web-Alternative ist der Verzicht auf Installation: Niemand muss eine App herunterladen, ein mobiles Konto erstellen und sich synchronisieren. Mit Swipe Movie öffnest du einen Raum und teilst einen Link — die andere Person (oder die ganze Gruppe) folgt ihm im Browser und beginnt zu swipen. Es läuft auf iPhone, Android, Laptop oder Tablet, ohne über einen Store zu gehen.',
        },
        {
          heading: 'Nicht nur für Paare',
          body: 'Der Begriff "Paar-Film-App" setzt zwei Personen voraus. Swipe Movie trifft diese Annahme nicht: Derselbe Raum funktioniert für ein Paar am Dienstagabend und für vier Freunde am Samstag. Der Mechanismus bleibt gleich — alle swipen, und ihr behaltet die Filme, die der ganzen Gruppe gefallen — so braucht ihr nicht ein Tool fürs Paar und eins für die Gruppe.',
        },
      ],
      it: [
        {
          heading: 'Un’alternativa web, senza installazione',
          body: 'Il vantaggio principale di un’alternativa web è l’assenza di installazione: non serve che ogni persona scarichi un’app, crei un account mobile e si sincronizzi. Con Swipe Movie apri una room e condividi un link — l’altra persona (o tutto il gruppo) lo apre nel browser e inizia a swippare. Funziona su iPhone, Android, computer o tablet, senza passare da uno store.',
        },
        {
          heading: 'Non solo per coppie',
          body: 'L’espressione "app di film per coppie" presuppone due persone. Swipe Movie non fa questa ipotesi: la stessa room funziona per una coppia un martedì sera e per quattro amici il sabato. Il meccanismo resta identico — tutti swippano e si tengono i film che piacciono all’insieme — così non serve uno strumento per la coppia e un altro per il gruppo.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Faut-il installer une application pour l’utiliser à deux ?',
          answer: 'Non. Swipe Movie est une alternative web : tu ouvres une room dans le navigateur et tu partages le lien. Aucune app à télécharger, ni sur ton téléphone ni sur celui de l’autre personne.',
        },
        {
          question: 'Est-ce réservé aux couples ?',
          answer: 'Non. Swipe Movie marche à deux comme à plusieurs. La même room sert pour une soirée en couple ou une soirée entre amis, avec le même principe de swipe et de match.',
        },
        {
          question: 'Est-ce disponible dans plusieurs langues ?',
          answer: 'Oui. L’interface est disponible en français, anglais, espagnol, allemand et italien, ce qui aide quand les participants ne parlent pas tous la même langue.',
        },
      ],
      en: [
        {
          question: 'Do we need to install an app to use it as a couple?',
          answer: 'No. Swipe Movie is a web alternative: you open a room in the browser and share the link. No app to download, neither on your phone nor on the other person’s.',
        },
        {
          question: 'Is it only for couples?',
          answer: 'No. Swipe Movie works for two and for a group. The same room serves a date night or a night with friends, with the same swipe-and-match principle.',
        },
        {
          question: 'Is it available in several languages?',
          answer: 'Yes. The interface is available in English, French, Spanish, German and Italian, which helps when participants don’t all speak the same language.',
        },
      ],
      es: [
        {
          question: 'Hay que instalar una app para usarlo en pareja?',
          answer: 'No. Swipe Movie es una alternativa web: abres una sala en el navegador y compartes el enlace. Ninguna app que descargar, ni en tu móvil ni en el de la otra persona.',
        },
        {
          question: 'Es solo para parejas?',
          answer: 'No. Swipe Movie funciona en pareja y en grupo. La misma sala sirve para una cita o una noche con amigos, con el mismo principio de swipe y match.',
        },
        {
          question: 'Está disponible en varios idiomas?',
          answer: 'Sí. La interfaz está disponible en español, inglés, francés, alemán e italiano, lo que ayuda cuando los participantes no hablan todos el mismo idioma.',
        },
      ],
      de: [
        {
          question: 'Müssen wir eine App installieren, um es zu zweit zu nutzen?',
          answer: 'Nein. Swipe Movie ist eine Web-Alternative: Du öffnest einen Raum im Browser und teilst den Link. Keine App zum Herunterladen, weder auf deinem Handy noch auf dem der anderen Person.',
        },
        {
          question: 'Ist es nur für Paare?',
          answer: 'Nein. Swipe Movie funktioniert zu zweit und in der Gruppe. Derselbe Raum dient einem Paarabend oder einem Abend mit Freunden, mit demselben Swipe-und-Match-Prinzip.',
        },
        {
          question: 'Ist es in mehreren Sprachen verfügbar?',
          answer: 'Ja. Die Oberfläche gibt es auf Deutsch, Englisch, Französisch, Spanisch und Italienisch, was hilft, wenn die Teilnehmer nicht alle dieselbe Sprache sprechen.',
        },
      ],
      it: [
        {
          question: 'Bisogna installare un’app per usarlo in due?',
          answer: 'No. Swipe Movie è un’alternativa web: apri una room nel browser e condividi il link. Nessuna app da scaricare, né sul tuo telefono né su quello dell’altra persona.',
        },
        {
          question: 'È solo per coppie?',
          answer: 'No. Swipe Movie funziona in due e in gruppo. La stessa room serve per una serata di coppia o una con gli amici, con lo stesso principio di swipe e match.',
        },
        {
          question: 'È disponibile in più lingue?',
          answer: 'Sì. L’interfaccia è disponibile in italiano, inglese, francese, spagnolo e tedesco, utile quando i partecipanti non parlano tutti la stessa lingua.',
        },
      ],
    },
    relatedGenres: ['romance', 'comedie', 'drame'],
    relatedProviders: ['netflix', 'prime-video', 'disney-plus'],
  }),
};

export type ComparisonSlug = keyof typeof COMPARISONS;

export function getComparisonBySlug(slug: string): ComparisonEntry | null {
  return COMPARISONS[slug] ?? null;
}

export function listComparisons(): ComparisonEntry[] {
  return Object.values(COMPARISONS);
}
