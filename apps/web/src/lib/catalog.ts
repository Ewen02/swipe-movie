/**
 * Curated, SEO-stable catalog of providers and genres used by the
 * programmatic pages (/genre/[slug], /plateforme/[provider], combos).
 *
 * IDs come from TMDb. Slugs are stable across deploys because they're
 * embedded in the URL — never rename without a 301.
 */

import type { Locale } from '@/i18n';

export type CatalogEntry<Slug extends string = string> = {
  slug: Slug;
  tmdbId: number;
  /** Display name + localized blurbs used in metadata/intros. */
  name: Record<Locale, string>;
  /** SEO intro: 2–3 sentences shown above the grid. Drives long-tail relevance. */
  intro: Record<Locale, string>;
  /** Long-form editorial sections shown below the grid (SEO word count). */
  sections?: Record<Locale, Array<{ heading: string; body: string }>>;
  /** FAQ entries — rendered visually and as FAQPage JSON-LD. */
  faq?: Record<Locale, Array<{ question: string; answer: string }>>;
};

// ---------------- Streaming providers ----------------

export const PROVIDERS = {
  netflix: {
    slug: 'netflix',
    tmdbId: 8,
    name: { fr: 'Netflix', en: 'Netflix', es: 'Netflix', de: 'Netflix', it: 'Netflix' },
    intro: {
      fr: 'Catalogue Netflix mis à jour : trouve les meilleurs films disponibles sur Netflix France et lance une room pour les regarder avec tes amis sans débat interminable.',
      en: 'Up-to-date Netflix catalog: find the best movies on Netflix and start a room to watch them with friends without endless debates.',
      es: 'Catálogo de Netflix actualizado: encuentra las mejores películas disponibles en Netflix España y abre una sala para verlas con tus amigos sin debates interminables.',
      de: 'Aktueller Netflix-Katalog: Finde die besten Filme auf Netflix Deutschland und starte einen Raum, um sie ohne endlose Debatten mit Freunden zu schauen.',
      it: 'Catalogo Netflix aggiornato: trova i migliori film su Netflix Italia e apri una room per guardarli con i tuoi amici senza dibattiti infiniti.',
    },
    sections: {
      fr: [
        {
          heading: 'Que regarder sur Netflix ce soir ?',
          body: "Netflix reste le catalogue le plus large de tous les services de streaming, et c'est aussi ce qui rend le choix difficile : entre les blockbusters récents, les comédies, les thrillers et l'immense rayon des Netflix Originals (films exclusifs produits par la plateforme), il y a de quoi tourner en rond pendant vingt minutes. La force de Netflix, c'est la profondeur : tu y trouveras autant des grosses sorties que des films d'auteur internationaux, du cinéma coréen, espagnol ou indien rarement disponible ailleurs.",
        },
        {
          heading: 'Comment choisir un film sur Netflix à plusieurs',
          body: "Le moteur de recommandation de Netflix optimise pour une seule personne — pas pour un groupe. Quand vous êtes deux, trois ou plus, vous repassez en boucle sur les mêmes lignes sans jamais trancher. Avec Swipe Movie, tu lances une room, chacun swipe sur une sélection de films disponibles sur Netflix, et le premier titre validé par tout le monde devient votre match. Plus de télécommande qui passe de main en main : la décision est partagée et prend quelques minutes.",
        },
      ],
      en: [
        {
          heading: 'What to watch on Netflix tonight?',
          body: "Netflix has the broadest catalog of any streaming service — which is exactly what makes choosing so hard. Between recent blockbusters, comedies, thrillers and the huge shelf of Netflix Originals (exclusive films produced by the platform), it's easy to scroll in circles for twenty minutes. Netflix's strength is depth: you'll find major releases alongside international auteur cinema — Korean, Spanish or Indian films rarely available elsewhere.",
        },
        {
          heading: 'How to pick a Netflix movie as a group',
          body: "Netflix's recommendation engine optimizes for one person, not a group. When you're two, three or more, you loop over the same rows without ever committing. With Swipe Movie, you start a room, everyone swipes on a selection of films available on Netflix, and the first title everyone approves becomes your match. No more passing the remote around: the decision is shared and takes minutes.",
        },
      ],
      es: [
        {
          heading: '¿Qué ver en Netflix esta noche?',
          body: 'Netflix tiene el catálogo más amplio de todos los servicios de streaming, y eso es justo lo que dificulta la elección. Entre los grandes estrenos, las comedias, los thrillers y la enorme estantería de Netflix Originals (películas exclusivas producidas por la plataforma), es fácil dar vueltas durante veinte minutos. La fuerza de Netflix es la profundidad: encontrarás grandes estrenos junto a cine de autor internacional — películas coreanas, españolas o indias poco disponibles en otros sitios.',
        },
        {
          heading: 'Cómo elegir una película de Netflix en grupo',
          body: 'El motor de recomendación de Netflix optimiza para una sola persona, no para un grupo. Cuando sois dos, tres o más, dais vueltas sobre las mismas filas sin decidiros nunca. Con Swipe Movie abres una sala, cada uno desliza sobre una selección de películas disponibles en Netflix, y el primer título que todos aprueban se convierte en vuestro match. Se acabó pasarse el mando: la decisión es compartida y tarda pocos minutos.',
        },
      ],
      de: [
        {
          heading: 'Was heute Abend auf Netflix schauen?',
          body: 'Netflix hat den breitesten Katalog aller Streamingdienste — und genau das macht die Wahl so schwer. Zwischen aktuellen Blockbustern, Komödien, Thrillern und dem riesigen Regal an Netflix Originals (exklusive, von der Plattform produzierte Filme) scrollt man leicht zwanzig Minuten im Kreis. Die Stärke von Netflix ist die Tiefe: Du findest Großproduktionen neben internationalem Autorenkino — koreanische, spanische oder indische Filme, die woanders kaum verfügbar sind.',
        },
        {
          heading: 'Wie man als Gruppe einen Netflix-Film wählt',
          body: 'Die Empfehlungs-Engine von Netflix optimiert für eine Person, nicht für eine Gruppe. Zu zweit, zu dritt oder mehr dreht ihr euch über denselben Reihen im Kreis, ohne euch je festzulegen. Mit Swipe Movie startest du einen Raum, jeder swipt durch eine Auswahl an Filmen, die auf Netflix verfügbar sind, und der erste Titel, dem alle zustimmen, wird euer Match. Kein Herumreichen der Fernbedienung mehr: Die Entscheidung ist gemeinsam und dauert Minuten.',
        },
      ],
      it: [
        {
          heading: 'Cosa guardare su Netflix stasera?',
          body: "Netflix ha il catalogo più ampio di tutti i servizi di streaming, ed è proprio questo a rendere difficile la scelta. Tra i grandi successi recenti, le commedie, i thriller e l'enorme scaffale dei Netflix Originals (film esclusivi prodotti dalla piattaforma), è facile girare a vuoto per venti minuti. La forza di Netflix è la profondità: troverai grandi uscite accanto al cinema d'autore internazionale — film coreani, spagnoli o indiani raramente disponibili altrove.",
        },
        {
          heading: 'Come scegliere un film su Netflix in gruppo',
          body: "Il motore di raccomandazione di Netflix ottimizza per una singola persona, non per un gruppo. Quando siete in due, tre o più, girate in tondo sulle stesse righe senza mai decidere. Con Swipe Movie apri una room, ognuno swippa su una selezione di film disponibili su Netflix, e il primo titolo approvato da tutti diventa il vostro match. Niente più telecomando che passa di mano in mano: la decisione è condivisa e richiede pochi minuti.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Comment trouver quoi regarder sur Netflix rapidement ?',
          answer:
            "Lance une room sur Swipe Movie, invite tes amis et swipez chacun sur une sélection de films Netflix. Vous matchez en quelques minutes sur un titre qui plaît à tout le monde, sans scroller indéfiniment.",
        },
        {
          question: 'Quels sont les meilleurs films sur Netflix en ce moment ?',
          answer:
            'La sélection ci-dessus est générée à partir des films Netflix les mieux notés et les plus populaires via les données TMDB, et se met à jour automatiquement. La disponibilité exacte dépend de ta région.',
        },
        {
          question: 'Netflix est-il inclus dans Swipe Movie ?',
          answer:
            "Swipe Movie ne remplace pas ton abonnement : tu regardes le film sur Netflix. L'app t'aide juste à choisir quoi regarder en filtrant sur les films disponibles sur Netflix.",
        },
      ],
      en: [
        {
          question: 'How do I quickly find something to watch on Netflix?',
          answer:
            'Start a room on Swipe Movie, invite your friends and everyone swipes on a selection of Netflix films. You match in minutes on a title everyone likes, without endless scrolling.',
        },
        {
          question: 'What are the best movies on Netflix right now?',
          answer:
            'The selection above is generated from the top-rated and most popular Netflix films via TMDB data, and updates automatically. Exact availability depends on your region.',
        },
        {
          question: 'Is Netflix included with Swipe Movie?',
          answer:
            "Swipe Movie doesn't replace your subscription: you watch the film on Netflix. The app just helps you decide what to watch by filtering on movies available on Netflix.",
        },
      ],
      es: [
        {
          question: '¿Cómo encuentro rápido algo que ver en Netflix?',
          answer:
            'Abre una sala en Swipe Movie, invita a tus amigos y cada uno desliza sobre una selección de películas de Netflix. Hacéis match en pocos minutos en un título que gusta a todos, sin scroll interminable.',
        },
        {
          question: '¿Cuáles son las mejores películas en Netflix ahora mismo?',
          answer:
            'La selección de arriba se genera a partir de las películas de Netflix mejor valoradas y más populares mediante los datos de TMDB, y se actualiza automáticamente. La disponibilidad exacta depende de tu región.',
        },
        {
          question: '¿Netflix está incluido en Swipe Movie?',
          answer:
            'Swipe Movie no sustituye tu suscripción: ves la película en Netflix. La app solo te ayuda a decidir qué ver filtrando las películas disponibles en Netflix.',
        },
      ],
      de: [
        {
          question: 'Wie finde ich schnell etwas auf Netflix zum Anschauen?',
          answer:
            'Starte einen Raum auf Swipe Movie, lade deine Freunde ein und jeder swipt durch eine Auswahl an Netflix-Filmen. Ihr matched in Minuten auf einen Titel, der allen gefällt — ohne endloses Scrollen.',
        },
        {
          question: 'Was sind gerade die besten Filme auf Netflix?',
          answer:
            'Die Auswahl oben wird aus den bestbewerteten und beliebtesten Netflix-Filmen über TMDB-Daten generiert und aktualisiert sich automatisch. Die genaue Verfügbarkeit hängt von deiner Region ab.',
        },
        {
          question: 'Ist Netflix in Swipe Movie enthalten?',
          answer:
            'Swipe Movie ersetzt dein Abo nicht: Du schaust den Film auf Netflix. Die App hilft dir nur bei der Entscheidung, indem sie auf Filme filtert, die auf Netflix verfügbar sind.',
        },
      ],
      it: [
        {
          question: 'Come trovo velocemente cosa guardare su Netflix?',
          answer:
            'Apri una room su Swipe Movie, invita i tuoi amici e ognuno swippa su una selezione di film Netflix. Fate match in pochi minuti su un titolo che piace a tutti, senza scrollare all\'infinito.',
        },
        {
          question: 'Quali sono i migliori film su Netflix in questo momento?',
          answer:
            'La selezione qui sopra è generata dai film Netflix più votati e popolari tramite i dati TMDB, e si aggiorna automaticamente. La disponibilità esatta dipende dalla tua regione.',
        },
        {
          question: 'Netflix è incluso in Swipe Movie?',
          answer:
            'Swipe Movie non sostituisce il tuo abbonamento: guardi il film su Netflix. L\'app ti aiuta solo a decidere cosa guardare filtrando sui film disponibili su Netflix.',
        },
      ],
    },
  },
  'prime-video': {
    slug: 'prime-video',
    tmdbId: 119,
    name: {
      fr: 'Prime Video',
      en: 'Prime Video',
      es: 'Prime Video',
      de: 'Prime Video',
      it: 'Prime Video',
    },
    intro: {
      fr: 'Tous les films disponibles sur Amazon Prime Video. Swipez entre amis et trouvez instantanément un film qui plaît à tout le monde.',
      en: 'All movies streaming on Amazon Prime Video. Swipe with friends and instantly match on a film everyone agrees on.',
      es: 'Todas las películas disponibles en Amazon Prime Video. Desliza con tus amigos y haz match al instante en una película que guste a todos.',
      de: 'Alle Filme bei Amazon Prime Video im Stream. Swipe mit Freunden und matche sofort auf einen Film, dem alle zustimmen.',
      it: "Tutti i film in streaming su Amazon Prime Video. Swippa con i tuoi amici e fai match all'istante su un film che piace a tutti.",
    },
    sections: {
      fr: [
        {
          heading: 'Que regarder sur Prime Video ce soir ?',
          body: "Prime Video combine deux choses : un catalogue inclus dans l'abonnement Amazon Prime, et un immense rayon de films en location ou achat à l'unité. Concrètement, tu y trouves un mélange d'Amazon Originals, de grands classiques hollywoodiens et de sorties récentes accessibles avant les autres plateformes en location. C'est souvent là qu'un film disparu de Netflix réapparaît. L'interface peut être confuse — Swipe Movie te montre directement ce qui vaut le coup.",
        },
        {
          heading: 'Comment choisir un film sur Prime Video à plusieurs',
          body: "La séparation entre films inclus et films payants rend le choix encore plus pénible à plusieurs : on hésite, on ouvre les fiches, on referme. Avec Swipe Movie, tu crées une room, tu partages le code, et chacun swipe sur les films disponibles sur Prime Video. Le match tombe en quelques minutes et vous lancez le film tout de suite, sans vous perdre dans les onglets « Inclus » et « Louer ».",
        },
      ],
      en: [
        {
          heading: 'What to watch on Prime Video tonight?',
          body: "Prime Video mixes two things: a catalog included with your Amazon Prime subscription, and a huge shelf of films to rent or buy individually. In practice you get a blend of Amazon Originals, Hollywood classics and recent releases available to rent before they hit other platforms. It's often where a movie that left Netflix resurfaces. The interface can be confusing — Swipe Movie shows you straight away what's worth your evening.",
        },
        {
          heading: 'How to pick a Prime Video movie as a group',
          body: "The split between included and paid titles makes choosing together even more painful: you hesitate, open detail pages, close them again. With Swipe Movie you create a room, share the code, and everyone swipes on the films available on Prime Video. The match lands in minutes and you start watching right away, without getting lost between the 'Included' and 'Rent' tabs.",
        },
      ],
      es: [
        {
          heading: '¿Qué ver en Prime Video esta noche?',
          body: 'Prime Video combina dos cosas: un catálogo incluido en la suscripción de Amazon Prime y una enorme estantería de películas para alquilar o comprar por separado. En la práctica encuentras una mezcla de Amazon Originals, clásicos de Hollywood y estrenos recientes disponibles en alquiler antes que en otras plataformas. Suele ser donde reaparece una película que se fue de Netflix. La interfaz puede confundir — Swipe Movie te muestra directamente lo que merece la pena.',
        },
        {
          heading: 'Cómo elegir una película de Prime Video en grupo',
          body: 'La separación entre películas incluidas y de pago hace la elección aún más pesada en grupo: dudáis, abrís fichas, las cerráis. Con Swipe Movie creas una sala, compartes el código y cada uno desliza sobre las películas disponibles en Prime Video. El match llega en pocos minutos y empezáis a ver enseguida, sin perderos entre las pestañas «Incluido» y «Alquilar».',
        },
      ],
      de: [
        {
          heading: 'Was heute Abend auf Prime Video schauen?',
          body: 'Prime Video kombiniert zwei Dinge: einen im Amazon-Prime-Abo enthaltenen Katalog und ein riesiges Regal an Filmen zum Leihen oder einzeln Kaufen. In der Praxis bekommst du eine Mischung aus Amazon Originals, Hollywood-Klassikern und aktuellen Titeln, die hier oft früher zum Leihen verfügbar sind als anderswo. Häufig taucht hier ein Film wieder auf, der Netflix verlassen hat. Die Oberfläche kann verwirren — Swipe Movie zeigt dir direkt, was sich lohnt.',
        },
        {
          heading: 'Wie man als Gruppe einen Prime-Video-Film wählt',
          body: 'Die Trennung zwischen enthaltenen und kostenpflichtigen Titeln macht die Wahl in der Gruppe noch mühsamer: Man zögert, öffnet Detailseiten, schließt sie wieder. Mit Swipe Movie erstellst du einen Raum, teilst den Code, und jeder swipt durch die auf Prime Video verfügbaren Filme. Das Match steht in Minuten und ihr legt sofort los, ohne euch zwischen „Enthalten“ und „Leihen“ zu verlieren.',
        },
      ],
      it: [
        {
          heading: 'Cosa guardare su Prime Video stasera?',
          body: "Prime Video combina due cose: un catalogo incluso nell'abbonamento Amazon Prime e un enorme scaffale di film a noleggio o acquisto singolo. In pratica trovi un mix di Amazon Originals, classici di Hollywood e uscite recenti disponibili a noleggio prima che su altre piattaforme. Spesso è qui che riappare un film uscito da Netflix. L'interfaccia può confondere — Swipe Movie ti mostra subito cosa vale la serata.",
        },
        {
          heading: 'Come scegliere un film su Prime Video in gruppo',
          body: "La separazione tra film inclusi e a pagamento rende la scelta ancora più pesante in gruppo: si esita, si aprono le schede, si richiudono. Con Swipe Movie crei una room, condividi il codice e ognuno swippa sui film disponibili su Prime Video. Il match arriva in pochi minuti e iniziate subito, senza perdervi tra le schede «Incluso» e «Noleggia».",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Comment trouver quoi regarder sur Prime Video ?',
          answer:
            "Lance une room sur Swipe Movie : vous swipez chacun sur les films disponibles sur Prime Video et vous matchez en quelques minutes, sans naviguer entre les films inclus et les locations.",
        },
        {
          question: 'Les films payants de Prime Video apparaissent-ils ici ?',
          answer:
            "La sélection s'appuie sur les données TMDB pour Prime Video. La distinction entre films inclus dans l'abonnement et films en location dépend de ta région ; vérifie le mode d'accès sur Prime Video avant de lancer.",
        },
        {
          question: 'Prime Video est-il inclus dans Swipe Movie ?',
          answer:
            "Non, tu gardes ton abonnement Amazon Prime. Swipe Movie sert uniquement à choisir le film à plusieurs, puis tu le regardes sur Prime Video.",
        },
      ],
      en: [
        {
          question: 'How do I find something to watch on Prime Video?',
          answer:
            'Start a room on Swipe Movie: everyone swipes on the films available on Prime Video and you match in minutes, without navigating between included titles and rentals.',
        },
        {
          question: 'Do Prime Video rental titles show up here?',
          answer:
            'The selection relies on TMDB data for Prime Video. Whether a film is included with your subscription or rental-only depends on your region; check the access type on Prime Video before starting.',
        },
        {
          question: 'Is Prime Video included with Swipe Movie?',
          answer:
            'No, you keep your Amazon Prime subscription. Swipe Movie is only for choosing the film as a group; you then watch it on Prime Video.',
        },
      ],
      es: [
        {
          question: '¿Cómo encuentro qué ver en Prime Video?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza sobre las películas disponibles en Prime Video y hacéis match en pocos minutos, sin navegar entre los títulos incluidos y los alquileres.',
        },
        {
          question: '¿Aparecen aquí las películas de alquiler de Prime Video?',
          answer:
            'La selección se basa en los datos de TMDB para Prime Video. Que una película esté incluida en la suscripción o solo en alquiler depende de tu región; comprueba el tipo de acceso en Prime Video antes de empezar.',
        },
        {
          question: '¿Prime Video está incluido en Swipe Movie?',
          answer:
            'No, conservas tu suscripción a Amazon Prime. Swipe Movie solo sirve para elegir la película en grupo; después la ves en Prime Video.',
        },
      ],
      de: [
        {
          question: 'Wie finde ich etwas auf Prime Video zum Anschauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt durch die auf Prime Video verfügbaren Filme und ihr matched in Minuten, ohne zwischen enthaltenen Titeln und Leihfilmen zu navigieren.',
        },
        {
          question: 'Tauchen Prime-Video-Leihtitel hier auf?',
          answer:
            'Die Auswahl basiert auf TMDB-Daten für Prime Video. Ob ein Film im Abo enthalten oder nur leihbar ist, hängt von deiner Region ab; prüfe die Zugriffsart auf Prime Video, bevor du startest.',
        },
        {
          question: 'Ist Prime Video in Swipe Movie enthalten?',
          answer:
            'Nein, dein Amazon-Prime-Abo bleibt bestehen. Swipe Movie dient nur dazu, den Film als Gruppe zu wählen; geschaut wird dann auf Prime Video.',
        },
      ],
      it: [
        {
          question: 'Come trovo cosa guardare su Prime Video?',
          answer:
            'Apri una room su Swipe Movie: ognuno swippa sui film disponibili su Prime Video e fate match in pochi minuti, senza navigare tra i titoli inclusi e i noleggi.',
        },
        {
          question: 'I film a noleggio di Prime Video appaiono qui?',
          answer:
            "La selezione si basa sui dati TMDB per Prime Video. Se un film sia incluso nell'abbonamento o solo a noleggio dipende dalla tua regione; verifica il tipo di accesso su Prime Video prima di iniziare.",
        },
        {
          question: 'Prime Video è incluso in Swipe Movie?',
          answer:
            "No, mantieni il tuo abbonamento Amazon Prime. Swipe Movie serve solo a scegliere il film in gruppo; poi lo guardi su Prime Video.",
        },
      ],
    },
  },
  'disney-plus': {
    slug: 'disney-plus',
    tmdbId: 337,
    name: { fr: 'Disney+', en: 'Disney+', es: 'Disney+', de: 'Disney+', it: 'Disney+' },
    intro: {
      fr: 'Le catalogue Disney+ filtré pour toi : Marvel, Pixar, Star Wars et bien plus. Idéal pour une soirée film en famille.',
      en: 'The Disney+ catalog at your fingertips: Marvel, Pixar, Star Wars and more. Perfect for a family movie night.',
      es: 'El catálogo de Disney+ a tu medida: Marvel, Pixar, Star Wars y mucho más. Ideal para una noche de cine en familia.',
      de: 'Der Disney+-Katalog auf einen Klick: Marvel, Pixar, Star Wars und mehr. Perfekt für einen Filmabend mit der Familie.',
      it: 'Il catalogo Disney+ a portata di mano: Marvel, Pixar, Star Wars e molto altro. Perfetto per una serata film in famiglia.',
    },
    sections: {
      fr: [
        {
          heading: 'Que regarder sur Disney+ ce soir ?',
          body: "Disney+ est la plateforme la plus cohérente du marché : tout y tourne autour de cinq univers forts — Disney (animation et classiques), Pixar, Marvel, Star Wars et National Geographic. C'est le catalogue idéal pour une soirée en famille ou avec des enfants, mais aussi pour qui veut enchaîner les films Marvel dans l'ordre ou redécouvrir les grands Pixar. Moins large que Netflix, mais beaucoup plus lisible : on sait ce qu'on vient y chercher.",
        },
        {
          heading: 'Comment choisir un film sur Disney+ à plusieurs',
          body: "En famille, le débat n'est pas le même : les enfants veulent Marvel ou un film d'animation, les parents un classique. Plutôt que de négocier, lance une room Swipe Movie. Chacun swipe sur une sélection de films disponibles sur Disney+, et l'app trouve le film qui met tout le monde d'accord — un Pixar qui plaît aux petits comme aux grands, ou un Star Wars consensuel. Décision rapide, soirée lancée.",
        },
      ],
      en: [
        {
          heading: 'What to watch on Disney+ tonight?',
          body: "Disney+ is the most coherent platform on the market: everything revolves around five strong universes — Disney (animation and classics), Pixar, Marvel, Star Wars and National Geographic. It's the ideal catalog for a family night or one with kids, but also for anyone who wants to binge the Marvel films in order or rediscover the great Pixar movies. Less broad than Netflix, but far more readable: you know what you came for.",
        },
        {
          heading: 'How to pick a Disney+ movie as a group',
          body: "With family, the debate is different: kids want Marvel or an animated film, parents a classic. Instead of negotiating, start a Swipe Movie room. Everyone swipes on a selection of films available on Disney+, and the app finds the movie everyone agrees on — a Pixar that works for young and old, or a crowd-pleasing Star Wars. Quick decision, night under way.",
        },
      ],
      es: [
        {
          heading: '¿Qué ver en Disney+ esta noche?',
          body: 'Disney+ es la plataforma más coherente del mercado: todo gira en torno a cinco universos fuertes — Disney (animación y clásicos), Pixar, Marvel, Star Wars y National Geographic. Es el catálogo ideal para una noche en familia o con niños, pero también para quien quiere ver las películas de Marvel en orden o redescubrir los grandes Pixar. Menos amplio que Netflix, pero mucho más legible: sabes a qué vienes.',
        },
        {
          heading: 'Cómo elegir una película de Disney+ en grupo',
          body: 'En familia el debate es distinto: los niños quieren Marvel o una película de animación, los padres un clásico. En vez de negociar, abre una sala de Swipe Movie. Cada uno desliza sobre una selección de películas disponibles en Disney+, y la app encuentra la película que pone a todos de acuerdo — un Pixar que gusta a pequeños y mayores, o un Star Wars de consenso. Decisión rápida, noche en marcha.',
        },
      ],
      de: [
        {
          heading: 'Was heute Abend auf Disney+ schauen?',
          body: 'Disney+ ist die kohärenteste Plattform am Markt: Alles dreht sich um fünf starke Universen — Disney (Animation und Klassiker), Pixar, Marvel, Star Wars und National Geographic. Es ist der ideale Katalog für einen Familienabend oder einen mit Kindern, aber auch für alle, die die Marvel-Filme der Reihe nach schauen oder die großen Pixar-Filme wiederentdecken wollen. Weniger breit als Netflix, dafür viel übersichtlicher: Man weiß, wofür man kommt.',
        },
        {
          heading: 'Wie man als Gruppe einen Disney+-Film wählt',
          body: 'In der Familie ist die Debatte anders: Kinder wollen Marvel oder einen Animationsfilm, Eltern einen Klassiker. Statt zu verhandeln, startet einen Swipe-Movie-Raum. Jeder swipt durch eine Auswahl an Filmen, die auf Disney+ verfügbar sind, und die App findet den Film, dem alle zustimmen — einen Pixar für Groß und Klein oder einen Star Wars, der alle abholt. Schnelle Entscheidung, Abend gestartet.',
        },
      ],
      it: [
        {
          heading: 'Cosa guardare su Disney+ stasera?',
          body: "Disney+ è la piattaforma più coerente sul mercato: tutto ruota attorno a cinque universi forti — Disney (animazione e classici), Pixar, Marvel, Star Wars e National Geographic. È il catalogo ideale per una serata in famiglia o con i bambini, ma anche per chi vuole guardare i film Marvel in ordine o riscoprire i grandi Pixar. Meno ampio di Netflix, ma molto più leggibile: sai cosa vieni a cercare.",
        },
        {
          heading: 'Come scegliere un film su Disney+ in gruppo',
          body: "In famiglia il dibattito è diverso: i bambini vogliono Marvel o un film d'animazione, i genitori un classico. Invece di negoziare, apri una room Swipe Movie. Ognuno swippa su una selezione di film disponibili su Disney+, e l'app trova il film che mette tutti d'accordo — un Pixar che piace a piccoli e grandi, o uno Star Wars condiviso. Decisione rapida, serata avviata.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films Disney+ pour une soirée en famille ?',
          answer:
            "La sélection ci-dessus met en avant les films Disney+ les mieux notés, du Pixar au Marvel. Pour trancher en famille, lance une room Swipe Movie et laissez chacun swiper.",
        },
        {
          question: 'Comment regarder les films Marvel dans le bon ordre sur Disney+ ?',
          answer:
            'Disney+ regroupe les films Marvel par saga et chronologie. Swipe Movie ne réordonne pas la saga, mais t\'aide à choisir un titre Marvel quand le groupe hésite.',
        },
        {
          question: 'Disney+ est-il inclus dans Swipe Movie ?',
          answer:
            "Non. Tu gardes ton abonnement Disney+ et tu y regardes le film. Swipe Movie sert uniquement à choisir quoi regarder à plusieurs.",
        },
      ],
      en: [
        {
          question: 'What are the best Disney+ movies for a family night?',
          answer:
            'The selection above highlights the top-rated Disney+ films, from Pixar to Marvel. To settle it as a family, start a Swipe Movie room and let everyone swipe.',
        },
        {
          question: 'How do I watch the Marvel films in order on Disney+?',
          answer:
            'Disney+ groups the Marvel films by saga and timeline. Swipe Movie doesn\'t reorder the saga, but it helps you pick a Marvel title when the group is undecided.',
        },
        {
          question: 'Is Disney+ included with Swipe Movie?',
          answer:
            "No. You keep your Disney+ subscription and watch the film there. Swipe Movie is only for deciding what to watch as a group.",
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de Disney+ para una noche en familia?',
          answer:
            'La selección de arriba destaca las películas de Disney+ mejor valoradas, de Pixar a Marvel. Para decidir en familia, abre una sala de Swipe Movie y dejad que cada uno deslice.',
        },
        {
          question: '¿Cómo veo las películas de Marvel en orden en Disney+?',
          answer:
            'Disney+ agrupa las películas de Marvel por saga y cronología. Swipe Movie no reordena la saga, pero te ayuda a elegir un título de Marvel cuando el grupo duda.',
        },
        {
          question: '¿Disney+ está incluido en Swipe Movie?',
          answer:
            'No. Conservas tu suscripción a Disney+ y ves la película allí. Swipe Movie solo sirve para decidir qué ver en grupo.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Disney+-Filme für einen Familienabend?',
          answer:
            'Die Auswahl oben hebt die bestbewerteten Disney+-Filme hervor, von Pixar bis Marvel. Um es als Familie zu klären, starte einen Swipe-Movie-Raum und lass alle swipen.',
        },
        {
          question: 'Wie schaue ich die Marvel-Filme in der richtigen Reihenfolge auf Disney+?',
          answer:
            'Disney+ ordnet die Marvel-Filme nach Saga und Chronologie. Swipe Movie ordnet die Saga nicht um, hilft dir aber, einen Marvel-Titel zu wählen, wenn die Gruppe unschlüssig ist.',
        },
        {
          question: 'Ist Disney+ in Swipe Movie enthalten?',
          answer:
            'Nein. Dein Disney+-Abo bleibt bestehen und du schaust den Film dort. Swipe Movie dient nur dazu, als Gruppe zu entscheiden, was ihr schaut.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film Disney+ per una serata in famiglia?',
          answer:
            'La selezione qui sopra evidenzia i film Disney+ più votati, da Pixar a Marvel. Per decidere in famiglia, apri una room Swipe Movie e lascia che ognuno swippi.',
        },
        {
          question: 'Come guardo i film Marvel in ordine su Disney+?',
          answer:
            'Disney+ raggruppa i film Marvel per saga e cronologia. Swipe Movie non riordina la saga, ma ti aiuta a scegliere un titolo Marvel quando il gruppo è indeciso.',
        },
        {
          question: 'Disney+ è incluso in Swipe Movie?',
          answer:
            'No. Mantieni il tuo abbonamento Disney+ e guardi il film lì. Swipe Movie serve solo a decidere cosa guardare in gruppo.',
        },
      ],
    },
  },
  'apple-tv-plus': {
    slug: 'apple-tv-plus',
    tmdbId: 350,
    name: { fr: 'Apple TV+', en: 'Apple TV+', es: 'Apple TV+', de: 'Apple TV+', it: 'Apple TV+' },
    intro: {
      fr: 'Les productions exclusives Apple TV+ avec des films primés et originaux. Lance une room pour décider quoi regarder ce soir.',
      en: 'Apple TV+ award-winning originals and exclusives. Start a room to decide what to watch tonight.',
      es: 'Las producciones exclusivas de Apple TV+ con películas premiadas y originales. Abre una sala para decidir qué ver esta noche.',
      de: 'Apple TV+ Originale und Exklusivtitel mit Preisen. Starte einen Raum, um zu entscheiden, was ihr heute Abend schaut.',
      it: 'Le produzioni esclusive di Apple TV+ con film premiati e originali. Apri una room per decidere cosa guardare stasera.',
    },
    sections: {
      fr: [
        {
          heading: 'Que regarder sur Apple TV+ ce soir ?',
          body: "Apple TV+ joue une carte unique : un catalogue 100 % original, sans films sous licence, mais soigné. La plateforme mise sur la qualité plutôt que la quantité — c'est elle qui a décroché l'Oscar du meilleur film avec CODA. Tu y trouves des drames exigeants, des thrillers léchés et quelques grosses productions avec des stars. Le catalogue est plus resserré, donc parfait quand tu veux un film bien noté sans passer une heure à trier.",
        },
        {
          heading: 'Comment choisir un film sur Apple TV+ à plusieurs',
          body: "Comme le catalogue est plus restreint, le risque n'est pas de se noyer mais de ne pas connaître les titres — ce sont surtout des originaux. Swipe Movie aide là où ça compte : tu lances une room, chacun swipe sur les films Apple TV+ proposés (avec affiche et infos), et vous matchez sur une production primée que personne n'aurait pensé à proposer. Idéal pour sortir des sentiers battus à deux ou en groupe.",
        },
      ],
      en: [
        {
          heading: 'What to watch on Apple TV+ tonight?',
          body: "Apple TV+ plays a unique hand: a 100% original catalog with no licensed films, but carefully crafted. The platform bets on quality over quantity — it's the one that won the Best Picture Oscar with CODA. You'll find demanding dramas, polished thrillers and a few big star-driven productions. The catalog is tighter, which is perfect when you want a well-rated film without spending an hour sorting.",
        },
        {
          heading: 'How to pick an Apple TV+ movie as a group',
          body: "Because the catalog is smaller, the risk isn't drowning in options but not recognizing the titles — they're mostly originals. Swipe Movie helps exactly there: you start a room, everyone swipes on the suggested Apple TV+ films (with poster and info), and you match on an award-winning production no one would have thought to propose. Great for going off the beaten path as a pair or group.",
        },
      ],
      es: [
        {
          heading: '¿Qué ver en Apple TV+ esta noche?',
          body: 'Apple TV+ juega una baza única: un catálogo 100 % original, sin películas con licencia, pero muy cuidado. La plataforma apuesta por la calidad antes que la cantidad — es la que ganó el Óscar a mejor película con CODA. Encontrarás dramas exigentes, thrillers pulidos y algunas grandes producciones con estrellas. El catálogo es más reducido, ideal cuando quieres una película bien valorada sin pasar una hora filtrando.',
        },
        {
          heading: 'Cómo elegir una película de Apple TV+ en grupo',
          body: 'Como el catálogo es más reducido, el riesgo no es ahogarse en opciones sino no conocer los títulos — son sobre todo originales. Swipe Movie ayuda justo ahí: abres una sala, cada uno desliza sobre las películas de Apple TV+ propuestas (con cartel e info) y hacéis match en una producción premiada que nadie habría pensado proponer. Ideal para salir de lo de siempre en pareja o en grupo.',
        },
      ],
      de: [
        {
          heading: 'Was heute Abend auf Apple TV+ schauen?',
          body: 'Apple TV+ setzt auf eine einzigartige Karte: einen 100 % originalen Katalog ohne Lizenzfilme, dafür sorgfältig kuratiert. Die Plattform setzt auf Qualität statt Quantität — sie holte mit CODA den Oscar für den besten Film. Du findest anspruchsvolle Dramen, geschliffene Thriller und einige große, starbesetzte Produktionen. Der Katalog ist kompakter, perfekt also, wenn du einen gut bewerteten Film willst, ohne eine Stunde zu sortieren.',
        },
        {
          heading: 'Wie man als Gruppe einen Apple-TV+-Film wählt',
          body: 'Weil der Katalog kleiner ist, besteht das Risiko nicht im Ertrinken in Optionen, sondern darin, die Titel nicht zu kennen — es sind meist Originale. Genau hier hilft Swipe Movie: Du startest einen Raum, jeder swipt durch die vorgeschlagenen Apple-TV+-Filme (mit Poster und Infos), und ihr matched auf eine preisgekrönte Produktion, an die niemand gedacht hätte. Ideal, um zu zweit oder in der Gruppe neue Wege zu gehen.',
        },
      ],
      it: [
        {
          heading: 'Cosa guardare su Apple TV+ stasera?',
          body: "Apple TV+ gioca una carta unica: un catalogo 100% originale, senza film su licenza, ma curato. La piattaforma punta sulla qualità più che sulla quantità — è quella che ha vinto l'Oscar per il miglior film con CODA. Trovi drammi impegnativi, thriller raffinati e alcune grandi produzioni con star. Il catalogo è più ristretto, perfetto quando vuoi un film ben votato senza passare un'ora a filtrare.",
        },
        {
          heading: 'Come scegliere un film su Apple TV+ in gruppo',
          body: "Poiché il catalogo è più piccolo, il rischio non è annegare tra le opzioni ma non conoscere i titoli — sono soprattutto originali. Swipe Movie aiuta proprio qui: apri una room, ognuno swippa sui film Apple TV+ proposti (con locandina e info) e fate match su una produzione premiata che nessuno avrebbe pensato di proporre. Ideale per uscire dai soliti titoli in coppia o in gruppo.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films sur Apple TV+ en ce moment ?',
          answer:
            "Apple TV+ se distingue par ses originaux primés. La sélection ci-dessus remonte les films Apple TV+ les mieux notés via TMDB, mise à jour automatiquement.",
        },
        {
          question: 'Apple TV+ propose-t-il des films sous licence ?',
          answer:
            "Non, le catalogue Apple TV+ est presque entièrement composé de productions originales. C'est pourquoi il est plus resserré mais souvent mieux noté.",
        },
        {
          question: 'Apple TV+ est-il inclus dans Swipe Movie ?',
          answer:
            "Non. Swipe Movie t'aide à choisir un film Apple TV+ à plusieurs, mais tu le regardes avec ton propre abonnement Apple TV+.",
        },
      ],
      en: [
        {
          question: 'What are the best movies on Apple TV+ right now?',
          answer:
            'Apple TV+ stands out for its award-winning originals. The selection above surfaces the top-rated Apple TV+ films via TMDB, updated automatically.',
        },
        {
          question: 'Does Apple TV+ have licensed films?',
          answer:
            "No, the Apple TV+ catalog is almost entirely original productions. That's why it's tighter but often better rated.",
        },
        {
          question: 'Is Apple TV+ included with Swipe Movie?',
          answer:
            'No. Swipe Movie helps you choose an Apple TV+ film as a group, but you watch it with your own Apple TV+ subscription.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas en Apple TV+ ahora mismo?',
          answer:
            'Apple TV+ destaca por sus originales premiados. La selección de arriba muestra las películas de Apple TV+ mejor valoradas vía TMDB, actualizada automáticamente.',
        },
        {
          question: '¿Apple TV+ tiene películas con licencia?',
          answer:
            'No, el catálogo de Apple TV+ está compuesto casi por completo de producciones originales. Por eso es más reducido pero suele estar mejor valorado.',
        },
        {
          question: '¿Apple TV+ está incluido en Swipe Movie?',
          answer:
            'No. Swipe Movie te ayuda a elegir una película de Apple TV+ en grupo, pero la ves con tu propia suscripción a Apple TV+.',
        },
      ],
      de: [
        {
          question: 'Was sind gerade die besten Filme auf Apple TV+?',
          answer:
            'Apple TV+ besticht durch seine preisgekrönten Originale. Die Auswahl oben zeigt die bestbewerteten Apple-TV+-Filme über TMDB, automatisch aktualisiert.',
        },
        {
          question: 'Gibt es auf Apple TV+ Lizenzfilme?',
          answer:
            'Nein, der Apple-TV+-Katalog besteht fast ausschließlich aus Eigenproduktionen. Deshalb ist er kompakter, aber oft besser bewertet.',
        },
        {
          question: 'Ist Apple TV+ in Swipe Movie enthalten?',
          answer:
            'Nein. Swipe Movie hilft dir, als Gruppe einen Apple-TV+-Film zu wählen, geschaut wird aber mit deinem eigenen Apple-TV+-Abo.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film su Apple TV+ in questo momento?',
          answer:
            'Apple TV+ si distingue per i suoi originali premiati. La selezione qui sopra mostra i film Apple TV+ più votati tramite TMDB, aggiornata automaticamente.',
        },
        {
          question: 'Apple TV+ ha film su licenza?',
          answer:
            'No, il catalogo Apple TV+ è composto quasi interamente da produzioni originali. Per questo è più ristretto ma spesso meglio votato.',
        },
        {
          question: 'Apple TV+ è incluso in Swipe Movie?',
          answer:
            'No. Swipe Movie ti aiuta a scegliere un film Apple TV+ in gruppo, ma lo guardi con il tuo abbonamento Apple TV+.',
        },
      ],
    },
  },
  'canal-plus': {
    slug: 'canal-plus',
    tmdbId: 381,
    name: { fr: 'Canal+', en: 'Canal+', es: 'Canal+', de: 'Canal+', it: 'Canal+' },
    intro: {
      fr: "Le catalogue Canal+ et myCanal : grands films, créations originales et cinéma d'auteur. Trouvez votre film en quelques swipes.",
      en: 'The Canal+ catalog: blockbusters, originals and arthouse cinema. Find your movie in a few swipes.',
      es: 'El catálogo de Canal+: grandes películas, originales y cine de autor. Encuentra tu película en unos pocos swipes.',
      de: 'Der Canal+-Katalog: Blockbuster, Originale und Arthouse-Kino. Finde deinen Film in wenigen Swipes.',
      it: "Il catalogo Canal+: grandi film, originali e cinema d'autore. Trova il tuo film in pochi swipe.",
    },
    sections: {
      fr: [
        {
          heading: 'Que regarder sur Canal+ ce soir ?',
          body: "Canal+ (et myCanal) reste le rendez-vous du cinéma en France : c'est la chaîne historique du grand écran, avec des films récents diffusés peu après leur sortie en salle, du cinéma français et d'auteur qu'on ne trouve nulle part ailleurs, et les Créations Originales Canal+. Si tu cherches un film primé à Cannes, un drame français exigeant ou une sortie récente, c'est souvent ici qu'elle arrive en premier dans l'écosystème streaming.",
        },
        {
          heading: 'Comment choisir un film sur Canal+ à plusieurs',
          body: "Le catalogue Canal+ est riche mais éclaté entre offres et chaînes thématiques, ce qui complique la décision à plusieurs. Lance une room Swipe Movie : chacun swipe sur une sélection de films disponibles sur Canal+, du blockbuster récent au film d'auteur, et vous matchez sur un titre qui convient à tout le monde. Parfait pour une soirée cinéphile sans interminable parcours dans myCanal.",
        },
      ],
      en: [
        {
          heading: 'What to watch on Canal+ tonight?',
          body: "Canal+ (and myCanal) remains the home of cinema in France: it's the historic movie channel, with recent films aired shortly after their theatrical release, French and arthouse cinema you won't find elsewhere, and the Canal+ Original Creations. If you're after a Cannes award-winner, a demanding French drama or a recent release, it's often the first place it lands in the streaming ecosystem.",
        },
        {
          heading: 'How to pick a Canal+ movie as a group',
          body: "The Canal+ catalog is rich but scattered across bundles and themed channels, which makes group decisions harder. Start a Swipe Movie room: everyone swipes on a selection of films available on Canal+, from recent blockbusters to arthouse, and you match on a title that suits the whole group. Perfect for a cinephile night without an endless journey through myCanal.",
        },
      ],
      es: [
        {
          heading: '¿Qué ver en Canal+ esta noche?',
          body: 'Canal+ (y myCanal) sigue siendo la cita con el cine en Francia: es el canal histórico de la gran pantalla, con películas recientes emitidas poco después de su estreno en sala, cine francés y de autor que no encontrarás en otro sitio, y las Creaciones Originales de Canal+. Si buscas una premiada en Cannes, un drama francés exigente o un estreno reciente, suele ser el primer lugar donde llega dentro del ecosistema del streaming.',
        },
        {
          heading: 'Cómo elegir una película de Canal+ en grupo',
          body: 'El catálogo de Canal+ es rico pero está repartido entre paquetes y canales temáticos, lo que complica decidir en grupo. Abre una sala de Swipe Movie: cada uno desliza sobre una selección de películas disponibles en Canal+, del gran estreno reciente al cine de autor, y hacéis match en un título que conviene a todos. Perfecto para una noche cinéfila sin recorrer interminablemente myCanal.',
        },
      ],
      de: [
        {
          heading: 'Was heute Abend auf Canal+ schauen?',
          body: 'Canal+ (und myCanal) bleibt die Heimat des Kinos in Frankreich: der historische Filmsender, mit aktuellen Filmen kurz nach dem Kinostart, französischem und Autorenkino, das man sonst nirgends findet, und den Canal+ Original Creations. Wer einen Cannes-Preisträger, ein anspruchsvolles französisches Drama oder einen aktuellen Titel sucht, findet ihn im Streaming-Ökosystem oft hier zuerst.',
        },
        {
          heading: 'Wie man als Gruppe einen Canal+-Film wählt',
          body: 'Der Canal+-Katalog ist reichhaltig, aber über Pakete und Themenkanäle verstreut, was Gruppenentscheidungen erschwert. Starte einen Swipe-Movie-Raum: Jeder swipt durch eine Auswahl an Filmen, die auf Canal+ verfügbar sind, vom aktuellen Blockbuster bis zum Autorenfilm, und ihr matched auf einen Titel, der zur ganzen Gruppe passt. Perfekt für einen Cineasten-Abend ohne endlose Suche in myCanal.',
        },
      ],
      it: [
        {
          heading: 'Cosa guardare su Canal+ stasera?',
          body: "Canal+ (e myCanal) rimane il punto di riferimento del cinema in Francia: è il canale storico del grande schermo, con film recenti trasmessi poco dopo l'uscita in sala, cinema francese e d'autore introvabile altrove, e le Creazioni Originali Canal+. Se cerchi un premiato a Cannes, un dramma francese impegnativo o un'uscita recente, spesso è il primo posto in cui arriva nell'ecosistema dello streaming.",
        },
        {
          heading: 'Come scegliere un film su Canal+ in gruppo',
          body: "Il catalogo Canal+ è ricco ma frammentato tra pacchetti e canali tematici, il che complica le decisioni in gruppo. Apri una room Swipe Movie: ognuno swippa su una selezione di film disponibili su Canal+, dal grande successo recente al film d'autore, e fate match su un titolo adatto a tutti. Perfetto per una serata da cinefili senza percorsi infiniti in myCanal.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films sur Canal+ en ce moment ?',
          answer:
            "Canal+ brille sur le cinéma récent et d'auteur. La sélection ci-dessus remonte les films Canal+ les mieux notés via TMDB ; la disponibilité dépend de ton offre et de ta région.",
        },
        {
          question: 'Comment trouver un bon film français sur Canal+ ?',
          answer:
            "Canal+ est la meilleure adresse pour le cinéma français. Lance une room Swipe Movie, filtre sur Canal+ et swipez pour matcher sur un titre qui plaît à tout le monde.",
        },
        {
          question: 'Canal+ est-il inclus dans Swipe Movie ?',
          answer:
            "Non. Tu regardes le film via ton abonnement Canal+ ou myCanal. Swipe Movie sert seulement à choisir quoi regarder ensemble.",
        },
      ],
      en: [
        {
          question: 'What are the best movies on Canal+ right now?',
          answer:
            'Canal+ shines on recent and arthouse cinema. The selection above surfaces the top-rated Canal+ films via TMDB; availability depends on your plan and region.',
        },
        {
          question: 'How do I find a good French film on Canal+?',
          answer:
            'Canal+ is the best address for French cinema. Start a Swipe Movie room, filter on Canal+ and swipe to match on a title everyone likes.',
        },
        {
          question: 'Is Canal+ included with Swipe Movie?',
          answer:
            'No. You watch the film through your Canal+ or myCanal subscription. Swipe Movie is only for choosing what to watch together.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas en Canal+ ahora mismo?',
          answer:
            'Canal+ brilla en el cine reciente y de autor. La selección de arriba muestra las películas de Canal+ mejor valoradas vía TMDB; la disponibilidad depende de tu plan y región.',
        },
        {
          question: '¿Cómo encuentro una buena película francesa en Canal+?',
          answer:
            'Canal+ es la mejor dirección para el cine francés. Abre una sala de Swipe Movie, filtra por Canal+ y deslizad para hacer match en un título que guste a todos.',
        },
        {
          question: '¿Canal+ está incluido en Swipe Movie?',
          answer:
            'No. Ves la película con tu suscripción a Canal+ o myCanal. Swipe Movie solo sirve para elegir qué ver juntos.',
        },
      ],
      de: [
        {
          question: 'Was sind gerade die besten Filme auf Canal+?',
          answer:
            'Canal+ glänzt bei aktuellem und Autorenkino. Die Auswahl oben zeigt die bestbewerteten Canal+-Filme über TMDB; die Verfügbarkeit hängt von deinem Tarif und deiner Region ab.',
        },
        {
          question: 'Wie finde ich einen guten französischen Film auf Canal+?',
          answer:
            'Canal+ ist die beste Adresse für französisches Kino. Starte einen Swipe-Movie-Raum, filtere auf Canal+ und swipt, um auf einen Titel zu matchen, der allen gefällt.',
        },
        {
          question: 'Ist Canal+ in Swipe Movie enthalten?',
          answer:
            'Nein. Du schaust den Film über dein Canal+- oder myCanal-Abo. Swipe Movie dient nur dazu, gemeinsam auszuwählen, was ihr schaut.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film su Canal+ in questo momento?',
          answer:
            "Canal+ eccelle nel cinema recente e d'autore. La selezione qui sopra mostra i film Canal+ più votati tramite TMDB; la disponibilità dipende dal tuo piano e dalla tua regione.",
        },
        {
          question: 'Come trovo un buon film francese su Canal+?',
          answer:
            'Canal+ è il miglior indirizzo per il cinema francese. Apri una room Swipe Movie, filtra su Canal+ e swippate per fare match su un titolo che piace a tutti.',
        },
        {
          question: 'Canal+ è incluso in Swipe Movie?',
          answer:
            'No. Guardi il film tramite il tuo abbonamento Canal+ o myCanal. Swipe Movie serve solo a scegliere cosa guardare insieme.',
        },
      ],
    },
  },
  max: {
    slug: 'max',
    tmdbId: 1899,
    name: { fr: 'Max', en: 'Max', es: 'Max', de: 'Max', it: 'Max' },
    intro: {
      fr: 'Le catalogue Max (ex HBO Max) avec les hits HBO et Warner. Swipez ensemble et trouvez le film parfait.',
      en: 'The Max catalog with HBO and Warner hits. Swipe together and find the perfect movie.',
      es: 'El catálogo Max (antes HBO Max) con los hits de HBO y Warner. Desliza juntos y encuentra la película perfecta.',
      de: 'Der Max-Katalog (früher HBO Max) mit HBO- und Warner-Hits. Swipt zusammen und findet den perfekten Film.',
      it: 'Il catalogo Max (ex HBO Max) con i grandi titoli HBO e Warner. Swippate insieme e trovate il film perfetto.',
    },
    sections: {
      fr: [
        {
          heading: 'Que regarder sur Max ce soir ?',
          body: "Max (ex HBO Max) est la plateforme du prestige : c'est la maison de HBO et du catalogue Warner Bros, avec des films de réalisateurs reconnus, des blockbusters DC et un fonds de classiques hollywoodiens impressionnant. Si tu cherches du cinéma adulte, ambitieux, à la mise en scène soignée — du thriller au drame récompensé — c'est l'un des catalogues les plus solides. La qualité prime ici sur le volume.",
        },
        {
          heading: 'Comment choisir un film sur Max à plusieurs',
          body: "Le catalogue Warner est large et le niveau global élevé, ce qui rend paradoxalement le choix difficile : trop de bons films tuent la décision. Avec Swipe Movie, tu crées une room, chacun swipe sur une sélection de films disponibles sur Max, et le match émerge en quelques minutes. Plus besoin de comparer cinq thrillers entre vous : l'app tranche pour vous, à plusieurs.",
        },
      ],
      en: [
        {
          heading: 'What to watch on Max tonight?',
          body: "Max (formerly HBO Max) is the prestige platform: it's the home of HBO and the Warner Bros catalog, with films from acclaimed directors, DC blockbusters and an impressive trove of Hollywood classics. If you're after adult, ambitious, well-directed cinema — from thrillers to award-winning dramas — it's one of the strongest catalogs out there. Quality wins over volume here.",
        },
        {
          heading: 'How to pick a Max movie as a group',
          body: "The Warner catalog is broad and the overall level high, which paradoxically makes choosing hard: too many good films kill the decision. With Swipe Movie, you create a room, everyone swipes on a selection of films available on Max, and the match emerges in minutes. No more comparing five thrillers among yourselves: the app decides for you, together.",
        },
      ],
      es: [
        {
          heading: '¿Qué ver en Max esta noche?',
          body: 'Max (antes HBO Max) es la plataforma del prestigio: es la casa de HBO y del catálogo de Warner Bros, con películas de directores reconocidos, blockbusters de DC y un fondo impresionante de clásicos de Hollywood. Si buscas cine adulto, ambicioso y con una puesta en escena cuidada — del thriller al drama premiado — es uno de los catálogos más sólidos. Aquí prima la calidad sobre el volumen.',
        },
        {
          heading: 'Cómo elegir una película de Max en grupo',
          body: 'El catálogo de Warner es amplio y el nivel general alto, lo que paradójicamente dificulta la elección: demasiadas buenas películas matan la decisión. Con Swipe Movie creas una sala, cada uno desliza sobre una selección de películas disponibles en Max, y el match surge en pocos minutos. Se acabó comparar cinco thrillers entre vosotros: la app decide por vosotros, en grupo.',
        },
      ],
      de: [
        {
          heading: 'Was heute Abend auf Max schauen?',
          body: 'Max (früher HBO Max) ist die Prestige-Plattform: die Heimat von HBO und des Warner-Bros-Katalogs, mit Filmen renommierter Regisseure, DC-Blockbustern und einem beeindruckenden Fundus an Hollywood-Klassikern. Wer erwachsenes, ambitioniertes, sorgfältig inszeniertes Kino sucht — vom Thriller bis zum preisgekrönten Drama — findet hier einen der stärksten Kataloge. Qualität schlägt hier Quantität.',
        },
        {
          heading: 'Wie man als Gruppe einen Max-Film wählt',
          body: 'Der Warner-Katalog ist breit und das Gesamtniveau hoch, was die Wahl paradoxerweise erschwert: Zu viele gute Filme verhindern die Entscheidung. Mit Swipe Movie erstellst du einen Raum, jeder swipt durch eine Auswahl an Filmen, die auf Max verfügbar sind, und das Match entsteht in Minuten. Kein Vergleichen von fünf Thrillern mehr: Die App entscheidet für euch, gemeinsam.',
        },
      ],
      it: [
        {
          heading: 'Cosa guardare su Max stasera?',
          body: "Max (ex HBO Max) è la piattaforma del prestigio: è la casa di HBO e del catalogo Warner Bros, con film di registi affermati, blockbuster DC e un'impressionante riserva di classici di Hollywood. Se cerchi cinema adulto, ambizioso e dalla regia curata — dal thriller al dramma premiato — è uno dei cataloghi più solidi. Qui la qualità batte la quantità.",
        },
        {
          heading: 'Come scegliere un film su Max in gruppo',
          body: "Il catalogo Warner è ampio e il livello generale alto, il che paradossalmente rende difficile la scelta: troppi bei film uccidono la decisione. Con Swipe Movie crei una room, ognuno swippa su una selezione di film disponibili su Max, e il match emerge in pochi minuti. Niente più confronti tra cinque thriller: l'app decide per voi, in gruppo.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films sur Max en ce moment ?',
          answer:
            "Max concentre les productions HBO et Warner, souvent très bien notées. La sélection ci-dessus remonte les films Max les mieux notés via TMDB, mise à jour automatiquement.",
        },
        {
          question: 'Max remplace-t-il HBO Max ?',
          answer:
            "Oui, Max est le nouveau nom de HBO Max et regroupe les catalogues HBO et Warner. Le contenu disponible dépend de ta région.",
        },
        {
          question: 'Max est-il inclus dans Swipe Movie ?',
          answer:
            "Non. Tu regardes le film avec ton abonnement Max. Swipe Movie t'aide seulement à choisir quoi regarder à plusieurs.",
        },
      ],
      en: [
        {
          question: 'What are the best movies on Max right now?',
          answer:
            'Max concentrates HBO and Warner productions, often very well rated. The selection above surfaces the top-rated Max films via TMDB, updated automatically.',
        },
        {
          question: 'Does Max replace HBO Max?',
          answer:
            'Yes, Max is the new name for HBO Max and brings together the HBO and Warner catalogs. Available content depends on your region.',
        },
        {
          question: 'Is Max included with Swipe Movie?',
          answer:
            'No. You watch the film with your Max subscription. Swipe Movie only helps you choose what to watch as a group.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas en Max ahora mismo?',
          answer:
            'Max concentra las producciones de HBO y Warner, a menudo muy bien valoradas. La selección de arriba muestra las películas de Max mejor valoradas vía TMDB, actualizada automáticamente.',
        },
        {
          question: '¿Max sustituye a HBO Max?',
          answer:
            'Sí, Max es el nuevo nombre de HBO Max y reúne los catálogos de HBO y Warner. El contenido disponible depende de tu región.',
        },
        {
          question: '¿Max está incluido en Swipe Movie?',
          answer:
            'No. Ves la película con tu suscripción a Max. Swipe Movie solo te ayuda a elegir qué ver en grupo.',
        },
      ],
      de: [
        {
          question: 'Was sind gerade die besten Filme auf Max?',
          answer:
            'Max bündelt die HBO- und Warner-Produktionen, oft sehr gut bewertet. Die Auswahl oben zeigt die bestbewerteten Max-Filme über TMDB, automatisch aktualisiert.',
        },
        {
          question: 'Ersetzt Max HBO Max?',
          answer:
            'Ja, Max ist der neue Name von HBO Max und vereint die HBO- und Warner-Kataloge. Die verfügbaren Inhalte hängen von deiner Region ab.',
        },
        {
          question: 'Ist Max in Swipe Movie enthalten?',
          answer:
            'Nein. Du schaust den Film mit deinem Max-Abo. Swipe Movie hilft dir nur, als Gruppe auszuwählen, was ihr schaut.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film su Max in questo momento?',
          answer:
            'Max concentra le produzioni HBO e Warner, spesso molto ben votate. La selezione qui sopra mostra i film Max più votati tramite TMDB, aggiornata automaticamente.',
        },
        {
          question: 'Max sostituisce HBO Max?',
          answer:
            'Sì, Max è il nuovo nome di HBO Max e riunisce i cataloghi HBO e Warner. I contenuti disponibili dipendono dalla tua regione.',
        },
        {
          question: 'Max è incluso in Swipe Movie?',
          answer:
            'No. Guardi il film con il tuo abbonamento Max. Swipe Movie ti aiuta solo a scegliere cosa guardare in gruppo.',
        },
      ],
    },
  },
  'paramount-plus': {
    slug: 'paramount-plus',
    tmdbId: 531,
    name: {
      fr: 'Paramount+',
      en: 'Paramount+',
      es: 'Paramount+',
      de: 'Paramount+',
      it: 'Paramount+',
    },
    intro: {
      fr: 'Le catalogue Paramount+ avec les grandes franchises Paramount et CBS. Lance une room et matchez sur un film.',
      en: 'The Paramount+ catalog with major Paramount and CBS franchises. Start a room and match on a movie.',
      es: 'El catálogo de Paramount+ con las grandes franquicias de Paramount y CBS. Abre una sala y haz match en una película.',
      de: 'Der Paramount+-Katalog mit den großen Paramount- und CBS-Franchises. Starte einen Raum und matche auf einen Film.',
      it: 'Il catalogo Paramount+ con i grandi franchise Paramount e CBS. Apri una room e fai match su un film.',
    },
    sections: {
      fr: [
        {
          heading: 'Que regarder sur Paramount+ ce soir ?',
          body: "Paramount+ est la plateforme des grandes franchises : c'est ici que vivent Mission: Impossible, Transformers, Star Trek, Sonic et le catalogue CBS. Si tu aimes le blockbuster d'action grand public, la science-fiction populaire ou les sagas à enchaîner, c'est un terrain de jeu idéal. Paramount+ mise sur des licences fortes et reconnaissables plutôt que sur le film d'auteur — parfait pour une soirée pop-corn sans prise de tête.",
        },
        {
          heading: 'Comment choisir un film sur Paramount+ à plusieurs',
          body: "Avec autant de sagas, le risque c'est de relancer toujours les mêmes franchises ou de bloquer sur l'ordre des films. Lance une room Swipe Movie : chacun swipe sur une sélection de films disponibles sur Paramount+, et vous matchez sur un titre qui plaît au groupe — un opus de Mission: Impossible, un Transformers ou une comédie familiale. La décision tombe vite, vous lancez le film.",
        },
      ],
      en: [
        {
          heading: 'What to watch on Paramount+ tonight?',
          body: "Paramount+ is the franchise platform: it's home to Mission: Impossible, Transformers, Star Trek, Sonic and the CBS catalog. If you love crowd-pleasing action blockbusters, popular sci-fi or sagas to binge, it's an ideal playground. Paramount+ leans on strong, recognizable licenses rather than arthouse films — perfect for a no-fuss popcorn night.",
        },
        {
          heading: 'How to pick a Paramount+ movie as a group',
          body: "With so many sagas, the risk is replaying the same franchises or getting stuck on film order. Start a Swipe Movie room: everyone swipes on a selection of films available on Paramount+, and you match on a title the group likes — a Mission: Impossible entry, a Transformers or a family comedy. The decision lands fast and you start the film.",
        },
      ],
      es: [
        {
          heading: '¿Qué ver en Paramount+ esta noche?',
          body: 'Paramount+ es la plataforma de las grandes franquicias: aquí viven Mission: Impossible, Transformers, Star Trek, Sonic y el catálogo de CBS. Si te gusta el blockbuster de acción comercial, la ciencia ficción popular o las sagas para enlazar, es un terreno de juego ideal. Paramount+ apuesta por licencias fuertes y reconocibles antes que por el cine de autor — perfecto para una noche de palomitas sin complicaciones.',
        },
        {
          heading: 'Cómo elegir una película de Paramount+ en grupo',
          body: 'Con tantas sagas, el riesgo es repetir siempre las mismas franquicias o atascarse con el orden de las películas. Abre una sala de Swipe Movie: cada uno desliza sobre una selección de películas disponibles en Paramount+, y hacéis match en un título que guste al grupo — una entrega de Mission: Impossible, un Transformers o una comedia familiar. La decisión llega rápido y empezáis la película.',
        },
      ],
      de: [
        {
          heading: 'Was heute Abend auf Paramount+ schauen?',
          body: 'Paramount+ ist die Franchise-Plattform: Hier leben Mission: Impossible, Transformers, Star Trek, Sonic und der CBS-Katalog. Wer massentaugliche Action-Blockbuster, populäre Science-Fiction oder Sagen zum Bingen liebt, findet hier einen idealen Spielplatz. Paramount+ setzt auf starke, wiedererkennbare Lizenzen statt auf Autorenkino — perfekt für einen unkomplizierten Popcorn-Abend.',
        },
        {
          heading: 'Wie man als Gruppe einen Paramount+-Film wählt',
          body: 'Bei so vielen Sagen besteht das Risiko, immer dieselben Franchises zu starten oder bei der Reihenfolge hängenzubleiben. Starte einen Swipe-Movie-Raum: Jeder swipt durch eine Auswahl an Filmen, die auf Paramount+ verfügbar sind, und ihr matched auf einen Titel, der der Gruppe gefällt — einen Mission:-Impossible-Teil, einen Transformers oder eine Familienkomödie. Die Entscheidung fällt schnell und ihr startet den Film.',
        },
      ],
      it: [
        {
          heading: 'Cosa guardare su Paramount+ stasera?',
          body: "Paramount+ è la piattaforma dei grandi franchise: qui vivono Mission: Impossible, Transformers, Star Trek, Sonic e il catalogo CBS. Se ami il blockbuster d'azione commerciale, la fantascienza popolare o le saghe da guardare di seguito, è un terreno di gioco ideale. Paramount+ punta su licenze forti e riconoscibili più che sul cinema d'autore — perfetto per una serata popcorn senza pensieri.",
        },
        {
          heading: 'Come scegliere un film su Paramount+ in gruppo',
          body: "Con così tante saghe, il rischio è rilanciare sempre gli stessi franchise o bloccarsi sull'ordine dei film. Apri una room Swipe Movie: ognuno swippa su una selezione di film disponibili su Paramount+, e fate match su un titolo che piace al gruppo — un capitolo di Mission: Impossible, un Transformers o una commedia per famiglie. La decisione arriva in fretta e iniziate il film.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films sur Paramount+ en ce moment ?',
          answer:
            "Paramount+ excelle sur les grosses franchises d'action et de SF. La sélection ci-dessus remonte les films Paramount+ les mieux notés via TMDB, mise à jour automatiquement.",
        },
        {
          question: 'Où trouver les films Mission: Impossible ou Transformers ?',
          answer:
            "Ces franchises Paramount sont généralement sur Paramount+ selon la région. Filtre sur Paramount+ dans Swipe Movie et swipez pour choisir l'opus à regarder.",
        },
        {
          question: 'Paramount+ est-il inclus dans Swipe Movie ?',
          answer:
            "Non. Tu regardes le film avec ton abonnement Paramount+. Swipe Movie sert seulement à choisir quoi regarder à plusieurs.",
        },
      ],
      en: [
        {
          question: 'What are the best movies on Paramount+ right now?',
          answer:
            'Paramount+ excels at big action and sci-fi franchises. The selection above surfaces the top-rated Paramount+ films via TMDB, updated automatically.',
        },
        {
          question: 'Where can I find Mission: Impossible or Transformers films?',
          answer:
            'These Paramount franchises are generally on Paramount+ depending on region. Filter on Paramount+ in Swipe Movie and swipe to choose which entry to watch.',
        },
        {
          question: 'Is Paramount+ included with Swipe Movie?',
          answer:
            'No. You watch the film with your Paramount+ subscription. Swipe Movie only helps you choose what to watch as a group.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas en Paramount+ ahora mismo?',
          answer:
            'Paramount+ destaca en las grandes franquicias de acción y ciencia ficción. La selección de arriba muestra las películas de Paramount+ mejor valoradas vía TMDB, actualizada automáticamente.',
        },
        {
          question: '¿Dónde encuentro las películas de Mission: Impossible o Transformers?',
          answer:
            'Estas franquicias de Paramount suelen estar en Paramount+ según la región. Filtra por Paramount+ en Swipe Movie y deslizad para elegir qué entrega ver.',
        },
        {
          question: '¿Paramount+ está incluido en Swipe Movie?',
          answer:
            'No. Ves la película con tu suscripción a Paramount+. Swipe Movie solo te ayuda a elegir qué ver en grupo.',
        },
      ],
      de: [
        {
          question: 'Was sind gerade die besten Filme auf Paramount+?',
          answer:
            'Paramount+ glänzt bei großen Action- und Sci-Fi-Franchises. Die Auswahl oben zeigt die bestbewerteten Paramount+-Filme über TMDB, automatisch aktualisiert.',
        },
        {
          question: 'Wo finde ich die Mission:-Impossible- oder Transformers-Filme?',
          answer:
            'Diese Paramount-Franchises sind je nach Region in der Regel auf Paramount+. Filtere in Swipe Movie auf Paramount+ und swipt, um den Teil zum Anschauen zu wählen.',
        },
        {
          question: 'Ist Paramount+ in Swipe Movie enthalten?',
          answer:
            'Nein. Du schaust den Film mit deinem Paramount+-Abo. Swipe Movie hilft dir nur, als Gruppe auszuwählen, was ihr schaut.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film su Paramount+ in questo momento?',
          answer:
            "Paramount+ eccelle nei grandi franchise d'azione e fantascienza. La selezione qui sopra mostra i film Paramount+ più votati tramite TMDB, aggiornata automaticamente.",
        },
        {
          question: 'Dove trovo i film di Mission: Impossible o Transformers?',
          answer:
            "Questi franchise Paramount sono generalmente su Paramount+ a seconda della regione. Filtra su Paramount+ in Swipe Movie e swippate per scegliere quale capitolo guardare.",
        },
        {
          question: 'Paramount+ è incluso in Swipe Movie?',
          answer:
            'No. Guardi il film con il tuo abbonamento Paramount+. Swipe Movie ti aiuta solo a scegliere cosa guardare in gruppo.',
        },
      ],
    },
  },
  crunchyroll: {
    slug: 'crunchyroll',
    tmdbId: 283,
    name: {
      fr: 'Crunchyroll',
      en: 'Crunchyroll',
      es: 'Crunchyroll',
      de: 'Crunchyroll',
      it: 'Crunchyroll',
    },
    intro: {
      fr: "Le meilleur de l'animation japonaise sur Crunchyroll. Swipez avec ta team et trouvez le film d'animation parfait.",
      en: 'The best of Japanese animation on Crunchyroll. Swipe with your crew and pick the perfect anime film.',
      es: 'Lo mejor de la animación japonesa en Crunchyroll. Desliza con tu grupo y encuentra la película de anime perfecta.',
      de: 'Das Beste der japanischen Animation auf Crunchyroll. Swipe mit deiner Crew und finde den perfekten Anime-Film.',
      it: "Il meglio dell'animazione giapponese su Crunchyroll. Swippa con il tuo gruppo e trova il film d'animazione perfetto.",
    },
    sections: {
      fr: [
        {
          heading: 'Que regarder sur Crunchyroll ce soir ?',
          body: "Crunchyroll est LA référence de l'animation japonaise : c'est le plus grand catalogue d'anime au monde, des films événements aux longs-métrages adaptés de séries cultes. Si tu cherches un film d'animation japonais — un shōnen spectaculaire, un drame contemplatif ou un film tiré de ta licence préférée — c'est ici qu'il se trouve, souvent en VOSTFR comme en VF. Un catalogue ultra-spécialisé pour les fans d'anime.",
        },
        {
          heading: 'Comment choisir un anime à plusieurs sur Crunchyroll',
          body: "Entre fans d'anime, les goûts divergent vite : action contre slice of life, sub contre dub, licence A contre licence B. Plutôt que de débattre, lance une room Swipe Movie. Chacun swipe sur une sélection de films d'animation disponibles sur Crunchyroll, et vous matchez sur un titre qui met la team d'accord. Idéal pour une soirée anime entre potes sans dix minutes de négociation.",
        },
      ],
      en: [
        {
          heading: 'What to watch on Crunchyroll tonight?',
          body: "Crunchyroll is THE reference for Japanese animation: the largest anime catalog in the world, from event films to features adapted from cult series. If you're after a Japanese animated film — a spectacular shōnen, a contemplative drama or a film from your favorite franchise — this is where it lives, often in both subbed and dubbed versions. An ultra-specialized catalog for anime fans.",
        },
        {
          heading: 'How to pick an anime as a group on Crunchyroll',
          body: "Among anime fans, tastes diverge fast: action versus slice of life, sub versus dub, franchise A versus franchise B. Instead of debating, start a Swipe Movie room. Everyone swipes on a selection of animated films available on Crunchyroll, and you match on a title the crew agrees on. Ideal for an anime night with friends without ten minutes of negotiation.",
        },
      ],
      es: [
        {
          heading: '¿Qué ver en Crunchyroll esta noche?',
          body: 'Crunchyroll es LA referencia de la animación japonesa: el mayor catálogo de anime del mundo, desde películas-evento hasta largometrajes adaptados de series de culto. Si buscas una película de animación japonesa — un shōnen espectacular, un drama contemplativo o una película de tu franquicia favorita — aquí la encuentras, a menudo en versión subtitulada y doblada. Un catálogo ultraespecializado para fans del anime.',
        },
        {
          heading: 'Cómo elegir un anime en grupo en Crunchyroll',
          body: 'Entre fans del anime, los gustos divergen rápido: acción contra slice of life, sub contra dub, franquicia A contra franquicia B. En vez de debatir, abre una sala de Swipe Movie. Cada uno desliza sobre una selección de películas de animación disponibles en Crunchyroll, y hacéis match en un título que pone al grupo de acuerdo. Ideal para una noche de anime entre amigos sin diez minutos de negociación.',
        },
      ],
      de: [
        {
          heading: 'Was heute Abend auf Crunchyroll schauen?',
          body: 'Crunchyroll ist DIE Referenz für japanische Animation: der weltweit größte Anime-Katalog, von Event-Filmen bis zu Spielfilmen, die aus Kultserien adaptiert wurden. Wer einen japanischen Animationsfilm sucht — einen spektakulären Shōnen, ein kontemplatives Drama oder einen Film aus seiner Lieblingsreihe — wird hier fündig, oft im Original mit Untertiteln wie auch synchronisiert. Ein hochspezialisierter Katalog für Anime-Fans.',
        },
        {
          heading: 'Wie man als Gruppe einen Anime auf Crunchyroll wählt',
          body: 'Unter Anime-Fans gehen die Geschmäcker schnell auseinander: Action gegen Slice of Life, Sub gegen Dub, Reihe A gegen Reihe B. Statt zu debattieren, starte einen Swipe-Movie-Raum. Jeder swipt durch eine Auswahl an Animationsfilmen, die auf Crunchyroll verfügbar sind, und ihr matched auf einen Titel, dem die Crew zustimmt. Ideal für einen Anime-Abend mit Freunden ohne zehn Minuten Verhandlung.',
        },
      ],
      it: [
        {
          heading: 'Cosa guardare su Crunchyroll stasera?',
          body: "Crunchyroll è IL riferimento dell'animazione giapponese: il più grande catalogo di anime al mondo, dai film-evento ai lungometraggi tratti da serie di culto. Se cerchi un film d'animazione giapponese — uno shōnen spettacolare, un dramma contemplativo o un film tratto dalla tua serie preferita — è qui che lo trovi, spesso sia sottotitolato che doppiato. Un catalogo ultra-specializzato per i fan degli anime.",
        },
        {
          heading: 'Come scegliere un anime in gruppo su Crunchyroll',
          body: "Tra fan degli anime i gusti divergono in fretta: azione contro slice of life, sub contro dub, serie A contro serie B. Invece di discutere, apri una room Swipe Movie. Ognuno swippa su una selezione di film d'animazione disponibili su Crunchyroll, e fate match su un titolo che mette d'accordo il gruppo. Ideale per una serata anime tra amici senza dieci minuti di trattativa.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films d\'animation sur Crunchyroll ?',
          answer:
            "Crunchyroll concentre le meilleur de l'anime. La sélection ci-dessus remonte les films Crunchyroll les mieux notés via TMDB ; la disponibilité dépend de ta région.",
        },
        {
          question: 'Crunchyroll propose-t-il les films en VF et VOSTFR ?',
          answer:
            "Une grande partie du catalogue Crunchyroll est disponible en version originale sous-titrée et en version française. L'option exacte dépend du titre et de ta région.",
        },
        {
          question: 'Crunchyroll est-il inclus dans Swipe Movie ?',
          answer:
            "Non. Tu regardes l'anime avec ton abonnement Crunchyroll. Swipe Movie t'aide seulement à choisir quel film d'animation regarder à plusieurs.",
        },
      ],
      en: [
        {
          question: 'What are the best animated films on Crunchyroll?',
          answer:
            'Crunchyroll concentrates the best of anime. The selection above surfaces the top-rated Crunchyroll films via TMDB; availability depends on your region.',
        },
        {
          question: 'Does Crunchyroll offer films subbed and dubbed?',
          answer:
            'A large part of the Crunchyroll catalog is available in original subtitled and dubbed versions. The exact option depends on the title and your region.',
        },
        {
          question: 'Is Crunchyroll included with Swipe Movie?',
          answer:
            'No. You watch the anime with your Crunchyroll subscription. Swipe Movie only helps you choose which animated film to watch as a group.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de animación en Crunchyroll?',
          answer:
            'Crunchyroll concentra lo mejor del anime. La selección de arriba muestra las películas de Crunchyroll mejor valoradas vía TMDB; la disponibilidad depende de tu región.',
        },
        {
          question: '¿Crunchyroll ofrece las películas subtituladas y dobladas?',
          answer:
            'Gran parte del catálogo de Crunchyroll está disponible en versión original subtitulada y doblada. La opción exacta depende del título y de tu región.',
        },
        {
          question: '¿Crunchyroll está incluido en Swipe Movie?',
          answer:
            'No. Ves el anime con tu suscripción a Crunchyroll. Swipe Movie solo te ayuda a elegir qué película de animación ver en grupo.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Animationsfilme auf Crunchyroll?',
          answer:
            'Crunchyroll bündelt das Beste des Anime. Die Auswahl oben zeigt die bestbewerteten Crunchyroll-Filme über TMDB; die Verfügbarkeit hängt von deiner Region ab.',
        },
        {
          question: 'Bietet Crunchyroll die Filme mit Untertiteln und synchronisiert an?',
          answer:
            'Ein großer Teil des Crunchyroll-Katalogs ist im Original mit Untertiteln sowie synchronisiert verfügbar. Die genaue Option hängt vom Titel und deiner Region ab.',
        },
        {
          question: 'Ist Crunchyroll in Swipe Movie enthalten?',
          answer:
            'Nein. Du schaust den Anime mit deinem Crunchyroll-Abo. Swipe Movie hilft dir nur, als Gruppe auszuwählen, welchen Animationsfilm ihr schaut.',
        },
      ],
      it: [
        {
          question: "Quali sono i migliori film d'animazione su Crunchyroll?",
          answer:
            "Crunchyroll concentra il meglio dell'anime. La selezione qui sopra mostra i film Crunchyroll più votati tramite TMDB; la disponibilità dipende dalla tua regione.",
        },
        {
          question: 'Crunchyroll offre i film sottotitolati e doppiati?',
          answer:
            'Gran parte del catalogo Crunchyroll è disponibile in versione originale sottotitolata e doppiata. L\'opzione esatta dipende dal titolo e dalla tua regione.',
        },
        {
          question: 'Crunchyroll è incluso in Swipe Movie?',
          answer:
            "No. Guardi l'anime con il tuo abbonamento Crunchyroll. Swipe Movie ti aiuta solo a scegliere quale film d'animazione guardare in gruppo.",
        },
      ],
    },
  },
} as const satisfies Record<string, CatalogEntry>;

export type ProviderSlug = keyof typeof PROVIDERS;

export function getProviderBySlug(slug: string): CatalogEntry | null {
  return (PROVIDERS as Record<string, CatalogEntry>)[slug] ?? null;
}

export function listProviders(): CatalogEntry[] {
  return Object.values(PROVIDERS);
}

// ---------------- Genres ----------------
// TMDb genre IDs reference: https://developer.themoviedb.org/reference/genre-movie-list

export const GENRES = {
  action: {
    slug: 'action',
    tmdbId: 28,
    name: { fr: 'Action', en: 'Action', es: 'Acción', de: 'Action', it: 'Azione' },
    intro: {
      fr: "Les meilleurs films d'action à regarder à plusieurs. Adrénaline garantie, idéal pour une soirée entre potes.",
      en: 'The best action movies to watch together. Adrenaline guaranteed, perfect for a movie night with friends.',
      es: 'Las mejores películas de acción para ver entre varios. Adrenalina garantizada, ideal para una noche entre amigos.',
      de: 'Die besten Actionfilme für den gemeinsamen Filmabend. Adrenalin garantiert, perfekt für die Runde mit Freunden.',
      it: "I migliori film d'azione da guardare in gruppo. Adrenalina garantita, ideali per una serata tra amici.",
    },
  },
  aventure: {
    slug: 'aventure',
    tmdbId: 12,
    name: { fr: 'Aventure', en: 'Adventure', es: 'Aventura', de: 'Abenteuer', it: 'Avventura' },
    intro: {
      fr: "Films d'aventure et d'évasion : quêtes épiques, voyages extraordinaires et héros inoubliables.",
      en: 'Adventure and escape movies: epic quests, extraordinary journeys and unforgettable heroes.',
      es: 'Películas de aventuras y evasión: misiones épicas, viajes extraordinarios y héroes inolvidables.',
      de: 'Abenteuer- und Eskapismusfilme: epische Quests, außergewöhnliche Reisen und unvergessliche Helden.',
      it: "Film d'avventura ed evasione: missioni epiche, viaggi straordinari ed eroi indimenticabili.",
    },
  },
  animation: {
    slug: 'animation',
    tmdbId: 16,
    name: { fr: 'Animation', en: 'Animation', es: 'Animación', de: 'Animation', it: 'Animazione' },
    intro: {
      fr: "Le meilleur de l'animation pour petits et grands : Disney, Pixar, Ghibli, animés et créations originales.",
      en: 'The best of animation for all ages: Disney, Pixar, Ghibli, anime and original creations.',
      es: 'Lo mejor de la animación para todas las edades: Disney, Pixar, Ghibli, anime y creaciones originales.',
      de: 'Das Beste der Animation für jedes Alter: Disney, Pixar, Ghibli, Anime und Originale.',
      it: "Il meglio dell'animazione per tutte le età: Disney, Pixar, Ghibli, anime e creazioni originali.",
    },
  },
  comedie: {
    slug: 'comedie',
    tmdbId: 35,
    name: { fr: 'Comédie', en: 'Comedy', es: 'Comedia', de: 'Komödie', it: 'Commedia' },
    intro: {
      fr: 'Films comiques pour rire en groupe : comédies récentes, classiques cultes et pépites à découvrir.',
      en: 'Comedy movies to laugh together: recent comedies, cult classics and hidden gems.',
      es: 'Películas de comedia para reír en grupo: comedias recientes, clásicos de culto y joyas por descubrir.',
      de: 'Komödien für gemeinsames Lachen: aktuelle Komödien, Kultklassiker und Geheimtipps.',
      it: 'Film comici per ridere in gruppo: commedie recenti, classici di culto e perle da scoprire.',
    },
  },
  crime: {
    slug: 'crime',
    tmdbId: 80,
    name: { fr: 'Crime', en: 'Crime', es: 'Crimen', de: 'Krimi', it: 'Crime' },
    intro: {
      fr: 'Polars, films de gangsters et thrillers criminels. Suspense et adrénaline garantis.',
      en: 'Crime thrillers, gangster films and detective stories. Suspense and adrenaline guaranteed.',
      es: 'Thrillers criminales, películas de gánsteres e historias de detectives. Suspense y adrenalina garantizados.',
      de: 'Krimi-Thriller, Gangsterfilme und Detektivgeschichten. Spannung und Adrenalin garantiert.',
      it: 'Thriller crime, film di gangster e storie di detective. Suspense e adrenalina garantite.',
    },
  },
  documentaire: {
    slug: 'documentaire',
    tmdbId: 99,
    name: {
      fr: 'Documentaire',
      en: 'Documentary',
      es: 'Documental',
      de: 'Dokumentation',
      it: 'Documentario',
    },
    intro: {
      fr: 'Les meilleurs documentaires à découvrir entre amis ou en couple. Apprendre tout en passant une soirée mémorable.',
      en: 'The best documentaries to discover with friends or as a couple. Learn while having a memorable night.',
      es: 'Los mejores documentales para descubrir con amigos o en pareja. Aprender mientras pasas una noche memorable.',
      de: 'Die besten Dokumentationen zum Entdecken mit Freunden oder als Paar. Lernen und gleichzeitig einen besonderen Abend erleben.',
      it: 'I migliori documentari da scoprire con amici o in coppia. Imparare durante una serata indimenticabile.',
    },
  },
  drame: {
    slug: 'drame',
    tmdbId: 18,
    name: { fr: 'Drame', en: 'Drama', es: 'Drama', de: 'Drama', it: 'Drammatico' },
    intro: {
      fr: 'Films dramatiques poignants et inoubliables. Émotions fortes garanties pour vos soirées film.',
      en: 'Powerful and unforgettable dramas. Strong emotions guaranteed for your movie nights.',
      es: 'Dramas poderosos e inolvidables. Emociones fuertes garantizadas para tus noches de cine.',
      de: 'Eindringliche und unvergessliche Dramen. Starke Emotionen für deinen Filmabend garantiert.',
      it: 'Drammi potenti e indimenticabili. Emozioni forti garantite per le vostre serate film.',
    },
  },
  famille: {
    slug: 'famille',
    tmdbId: 10751,
    name: { fr: 'Famille', en: 'Family', es: 'Familiar', de: 'Familie', it: 'Famiglia' },
    intro: {
      fr: 'Films familiaux à regarder avec les enfants. Sélection adaptée à tous les âges pour une soirée réussie.',
      en: 'Family movies to watch with kids. All-ages selection for a successful night in.',
      es: 'Películas familiares para ver con niños. Selección apta para todas las edades para una noche redonda.',
      de: 'Familienfilme zum Anschauen mit Kindern. Auswahl für alle Altersgruppen für einen gelungenen Abend.',
      it: 'Film per famiglie da guardare con i bambini. Selezione adatta a tutte le età per una serata riuscita.',
    },
  },
  fantastique: {
    slug: 'fantastique',
    tmdbId: 14,
    name: { fr: 'Fantastique', en: 'Fantasy', es: 'Fantasía', de: 'Fantasy', it: 'Fantasy' },
    intro: {
      fr: 'Films fantastiques, sagas heroic-fantasy et univers imaginaires. Évasion totale en perspective.',
      en: 'Fantasy movies, heroic-fantasy sagas and imaginary worlds. Total escape ahead.',
      es: 'Películas fantásticas, sagas de heroic-fantasy y universos imaginarios. Evasión total a la vista.',
      de: 'Fantasyfilme, Heroic-Fantasy-Sagen und imaginäre Welten. Totale Eskapismus-Erfahrung.',
      it: 'Film fantasy, saghe heroic-fantasy e universi immaginari. Evasione totale in arrivo.',
    },
  },
  histoire: {
    slug: 'histoire',
    tmdbId: 36,
    name: { fr: 'Histoire', en: 'History', es: 'Historia', de: 'Historie', it: 'Storico' },
    intro: {
      fr: "Films historiques et biopics. Replongez dans les grandes époques et destins de l'humanité.",
      en: 'Historical movies and biopics. Dive back into the great eras and destinies of humankind.',
      es: 'Películas históricas y biopics. Vuelve a sumergirte en las grandes épocas y destinos de la humanidad.',
      de: 'Historische Filme und Biopics. Tauche in die großen Epochen und Schicksale der Menschheit ein.',
      it: "Film storici e biopic. Rituffati nelle grandi epoche e nei destini dell'umanità.",
    },
  },
  horreur: {
    slug: 'horreur',
    tmdbId: 27,
    name: { fr: 'Horreur', en: 'Horror', es: 'Terror', de: 'Horror', it: 'Horror' },
    intro: {
      fr: "Films d'horreur pour soirées frissons : slashers, films de fantômes, body horror et classiques cultes.",
      en: 'Horror movies for chilling nights: slashers, ghost stories, body horror and cult classics.',
      es: 'Películas de terror para noches escalofriantes: slashers, historias de fantasmas, body horror y clásicos de culto.',
      de: 'Horrorfilme für schaurige Nächte: Slasher, Geistergeschichten, Body Horror und Kultklassiker.',
      it: 'Film horror per serate da brivido: slasher, storie di fantasmi, body horror e classici di culto.',
    },
  },
  musique: {
    slug: 'musique',
    tmdbId: 10402,
    name: { fr: 'Musique', en: 'Music', es: 'Música', de: 'Musik', it: 'Musica' },
    intro: {
      fr: 'Films musicaux, biopics de musiciens et concerts. Le meilleur du cinéma autour de la musique.',
      en: 'Music movies, musician biopics and concert films. The best of cinema around music.',
      es: 'Películas musicales, biopics de músicos y películas-concierto. Lo mejor del cine sobre la música.',
      de: 'Musikfilme, Musiker-Biopics und Konzertfilme. Das Beste des Kinos rund um Musik.',
      it: 'Film musicali, biopic di musicisti e film-concerto. Il meglio del cinema sulla musica.',
    },
  },
  mystere: {
    slug: 'mystere',
    tmdbId: 9648,
    name: { fr: 'Mystère', en: 'Mystery', es: 'Misterio', de: 'Mystery', it: 'Mistero' },
    intro: {
      fr: "Films à énigme, whodunits et mystères à élucider. Garde tes amis sur le qui-vive jusqu'à la dernière minute.",
      en: 'Whodunits and mysteries to solve. Keep your friends on the edge of their seat until the very end.',
      es: 'Whodunits y misterios por resolver. Mantén a tus amigos en vilo hasta el último minuto.',
      de: 'Whodunits und Mysterien zum Lösen. Halte deine Freunde bis zur letzten Minute in Atem.',
      it: "Whodunit e misteri da risolvere. Tieni i tuoi amici col fiato sospeso fino all'ultimo minuto.",
    },
  },
  romance: {
    slug: 'romance',
    tmdbId: 10749,
    name: { fr: 'Romance', en: 'Romance', es: 'Romance', de: 'Romanze', it: 'Romance' },
    intro: {
      fr: 'Films romantiques pour soirées en couple ou entre potes. Comédies romantiques et grands classiques.',
      en: 'Romance movies for couple nights or with friends. Rom-coms and classics.',
      es: 'Películas románticas para noches en pareja o entre amigos. Comedias románticas y grandes clásicos.',
      de: 'Romantische Filme für Pärchen- oder Freundesabende. Romantische Komödien und Klassiker.',
      it: 'Film romantici per serate in coppia o tra amici. Commedie romantiche e grandi classici.',
    },
  },
  'science-fiction': {
    slug: 'science-fiction',
    tmdbId: 878,
    name: {
      fr: 'Science-fiction',
      en: 'Science Fiction',
      es: 'Ciencia ficción',
      de: 'Science-Fiction',
      it: 'Fantascienza',
    },
    intro: {
      fr: 'Sci-fi pour rêver et débattre : space operas, dystopies, voyages dans le temps. Le meilleur du genre.',
      en: 'Sci-fi to dream and debate: space operas, dystopias, time travel. The best of the genre.',
      es: 'Ciencia ficción para soñar y debatir: space operas, distopías, viajes en el tiempo. Lo mejor del género.',
      de: 'Sci-Fi zum Träumen und Diskutieren: Space Operas, Dystopien, Zeitreisen. Das Beste des Genres.',
      it: 'Fantascienza per sognare e discutere: space opera, distopie, viaggi nel tempo. Il meglio del genere.',
    },
  },
  thriller: {
    slug: 'thriller',
    tmdbId: 53,
    name: { fr: 'Thriller', en: 'Thriller', es: 'Thriller', de: 'Thriller', it: 'Thriller' },
    intro: {
      fr: 'Thrillers haletants : suspense, retournements de situation et tension du début à la fin.',
      en: 'Gripping thrillers: suspense, plot twists and tension from start to finish.',
      es: 'Thrillers trepidantes: suspense, giros argumentales y tensión de principio a fin.',
      de: 'Packende Thriller: Spannung, Plot-Twists und Anspannung von Anfang bis Ende.',
      it: "Thriller mozzafiato: suspense, colpi di scena e tensione dall'inizio alla fine.",
    },
  },
  guerre: {
    slug: 'guerre',
    tmdbId: 10752,
    name: { fr: 'Guerre', en: 'War', es: 'Bélica', de: 'Krieg', it: 'Guerra' },
    intro: {
      fr: 'Films de guerre, de la Seconde Guerre mondiale aux conflits contemporains. Histoire et émotion fortes.',
      en: 'War movies from World War II to modern conflicts. Strong history and emotion.',
      es: 'Películas bélicas desde la Segunda Guerra Mundial hasta los conflictos contemporáneos. Historia y emoción fuertes.',
      de: 'Kriegsfilme vom Zweiten Weltkrieg bis zu modernen Konflikten. Starke Geschichte und Emotionen.',
      it: 'Film di guerra dalla Seconda guerra mondiale ai conflitti contemporanei. Storia ed emozioni forti.',
    },
  },
  western: {
    slug: 'western',
    tmdbId: 37,
    name: { fr: 'Western', en: 'Western', es: 'Western', de: 'Western', it: 'Western' },
    intro: {
      fr: 'Westerns classiques et modernes : duels, grands espaces et héros mythiques.',
      en: 'Classic and modern westerns: duels, wide-open spaces and mythical heroes.',
      es: 'Westerns clásicos y modernos: duelos, grandes espacios y héroes míticos.',
      de: 'Klassische und moderne Western: Duelle, weite Landschaften und mythische Helden.',
      it: 'Western classici e moderni: duelli, grandi spazi ed eroi mitici.',
    },
  },
} as const satisfies Record<string, CatalogEntry>;

export type GenreSlug = keyof typeof GENRES;

export function getGenreBySlug(slug: string): CatalogEntry | null {
  return (GENRES as Record<string, CatalogEntry>)[slug] ?? null;
}

export function listGenres(): CatalogEntry[] {
  return Object.values(GENRES);
}
