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
    sections: {
      fr: [
        {
          heading: "Les grands sous-genres du film d'action",
          body: "Le film d'action ne se résume pas aux explosions : il englobe le film de John Wick et ses chorégraphies au cordeau, le buddy cop movie (L'Arme fatale), le film de braquage tendu, et les blockbusters de super-héros. Les amateurs distinguent le pur action movie nerveux comme Mad Max: Fury Road du film d'action-aventure plus ample, ou du thriller d'action à la Mission: Impossible. Le genre brille quand la mise en scène reste lisible : Die Hard ou The Raid sont des références justement parce qu'on suit chaque coup. C'est le genre parfait pour une soirée où personne n'a envie de réfléchir mais où tout le monde veut être scotché.",
        },
        {
          heading: 'Choisir un film d’action à plusieurs sans débat',
          body: "Le problème avec l'action en groupe, c'est que les goûts divergent vite : certains veulent du Fast & Furious bon enfant, d'autres un film de guerre nerveux ou un polar musclé. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de films d'action, et le premier titre qui plaît à tout le monde devient votre match. Fini les vingt minutes à hésiter : vous lancez le film en quelques minutes.",
        },
      ],
      en: [
        {
          heading: 'The main sub-genres of action cinema',
          body: "Action movies are far more than explosions: the genre spans the precise gun-fu of John Wick, the buddy-cop movie (Lethal Weapon), the tense heist film, and the superhero blockbuster. Fans separate the lean, kinetic action movie like Mad Max: Fury Road from the broader action-adventure, or the action-thriller à la Mission: Impossible. The genre shines when the staging stays legible — Die Hard and The Raid are touchstones precisely because you follow every punch. It's the perfect pick for a night when nobody wants to think but everyone wants to be glued to the screen.",
        },
        {
          heading: 'Picking an action movie as a group without arguing',
          body: "The trouble with action in a group is that tastes split fast: some want a fun Fast & Furious ride, others a gritty war film or a hard-boiled cop thriller. On Swipe Movie you open a room, everyone swipes on a selection of action movies, and the first title everyone likes becomes your match. No more twenty minutes of hesitating — you hit play in a few minutes.",
        },
      ],
      es: [
        {
          heading: 'Los grandes subgéneros del cine de acción',
          body: 'El cine de acción es mucho más que explosiones: abarca el gun-fu milimétrico de John Wick, el buddy-cop (Arma letal), el atraco tenso y el blockbuster de superhéroes. Los aficionados distinguen la acción pura y nerviosa de Mad Max: Furia en la carretera de la acción-aventura más amplia, o del action-thriller estilo Misión Imposible. El género brilla cuando la puesta en escena es legible: La jungla de cristal y The Raid son referentes precisamente porque sigues cada golpe. Es la elección perfecta para una noche en la que nadie quiere pensar pero todos quieren quedarse pegados a la pantalla.',
        },
        {
          heading: 'Elegir una película de acción en grupo sin discutir',
          body: 'El problema de la acción en grupo es que los gustos se separan rápido: unos quieren un Fast & Furious desenfadado, otros una película bélica nerviosa o un thriller policiaco duro. En Swipe Movie abres una sala, cada uno desliza sobre una selección de películas de acción y el primer título que gusta a todos se convierte en vuestro match. Se acabaron los veinte minutos de duda: le dais al play en pocos minutos.',
        },
      ],
      de: [
        {
          heading: 'Die großen Subgenres des Actionkinos',
          body: 'Actionfilme sind weit mehr als Explosionen: Das Genre reicht vom präzisen Gun-Fu eines John Wick über den Buddy-Cop-Film (Lethal Weapon) und den spannungsgeladenen Heist bis zum Superhelden-Blockbuster. Kenner unterscheiden den schlanken, kinetischen Actionfilm wie Mad Max: Fury Road vom breiteren Action-Adventure oder vom Action-Thriller à la Mission: Impossible. Das Genre glänzt, wenn die Inszenierung lesbar bleibt — Stirb langsam und The Raid sind genau deshalb Klassiker, weil man jeden Schlag verfolgt. Die perfekte Wahl für einen Abend, an dem niemand nachdenken, aber jeder gefesselt sein will.',
        },
        {
          heading: 'Einen Actionfilm in der Gruppe ohne Streit wählen',
          body: 'Das Problem mit Action in der Gruppe: Die Geschmäcker gehen schnell auseinander — die einen wollen ein lockeres Fast & Furious, die anderen einen harten Kriegsfilm oder einen düsteren Cop-Thriller. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Actionfilmen, und der erste Titel, der allen gefällt, wird euer Match. Keine zwanzig Minuten Zögern mehr — ihr drückt in wenigen Minuten auf Play.',
        },
      ],
      it: [
        {
          heading: "I grandi sottogeneri del cinema d'azione",
          body: "Il cinema d'azione è molto più che esplosioni: spazia dal gun-fu millimetrico di John Wick al buddy-cop (Arma letale), dalla rapina tesa al blockbuster di supereroi. Gli appassionati distinguono l'azione pura e nervosa di Mad Max: Fury Road dall'action-adventure più ampio, o dall'action-thriller alla Mission: Impossible. Il genere brilla quando la regia resta leggibile: Trappola di cristallo e The Raid sono punti di riferimento proprio perché segui ogni colpo. È la scelta perfetta per una serata in cui nessuno vuole pensare ma tutti vogliono restare incollati allo schermo.",
        },
        {
          heading: "Scegliere un film d'azione in gruppo senza litigare",
          body: "Il problema dell'azione in gruppo è che i gusti si dividono in fretta: c'è chi vuole un Fast & Furious spensierato, chi un film di guerra nervoso o un poliziesco duro. Su Swipe Movie apri una room, ognuno swippa su una selezione di film d'azione e il primo titolo che piace a tutti diventa il vostro match. Niente più venti minuti di dubbi: premete play in pochi minuti.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: "Quels sont les meilleurs films d'action de tous les temps ?",
          answer:
            "Parmi les références incontournables : Die Hard, Mad Max: Fury Road, John Wick, The Raid et la saga Mission: Impossible. La sélection ci-dessus est classée selon les notes et la popularité via les données TMDB.",
        },
        {
          question: "Quel film d'action regarder ce soir à plusieurs ?",
          answer:
            "Lance une room sur Swipe Movie : chacun swipe sur les films d'action proposés et vous matchez en quelques minutes sur un titre qui met tout le monde d'accord.",
        },
        {
          question: "Où regarder des films d'action en streaming ?",
          answer:
            'La plupart des grands films d’action sont disponibles sur Netflix, Prime Video, Disney+ ou Max selon ta région. Tu peux filtrer par plateforme directement sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best action movies of all time?',
          answer:
            'Essential references include Die Hard, Mad Max: Fury Road, John Wick, The Raid and the Mission: Impossible saga. The selection above is ranked by rating and popularity using TMDB data.',
        },
        {
          question: 'What action movie should we watch tonight as a group?',
          answer:
            'Start a room on Swipe Movie: everyone swipes on the suggested action movies and you match in minutes on a title that satisfies the whole group.',
        },
        {
          question: 'Where can I stream action movies?',
          answer:
            'Most major action films are available on Netflix, Prime Video, Disney+ or Max depending on your region. You can filter by platform directly on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de acción de todos los tiempos?',
          answer:
            'Entre las referencias imprescindibles: La jungla de cristal, Mad Max: Furia en la carretera, John Wick, The Raid y la saga Misión Imposible. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué película de acción ver esta noche en grupo?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza sobre las películas de acción propuestas y hacéis match en pocos minutos en un título que contenta a todos.',
        },
        {
          question: '¿Dónde ver películas de acción en streaming?',
          answer:
            'La mayoría de los grandes títulos de acción están en Netflix, Prime Video, Disney+ o Max según tu región. Puedes filtrar por plataforma directamente en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Actionfilme aller Zeiten?',
          answer:
            'Zu den unverzichtbaren Klassikern zählen Stirb langsam, Mad Max: Fury Road, John Wick, The Raid und die Mission:-Impossible-Reihe. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welchen Actionfilm heute Abend in der Gruppe schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt durch die vorgeschlagenen Actionfilme und ihr matched in Minuten auf einen Titel, der allen gefällt.',
        },
        {
          question: 'Wo kann ich Actionfilme streamen?',
          answer:
            'Die meisten großen Actionfilme laufen je nach Region auf Netflix, Prime Video, Disney+ oder Max. Du kannst direkt auf Swipe Movie nach Plattform filtern.',
        },
      ],
      it: [
        {
          question: "Quali sono i migliori film d'azione di tutti i tempi?",
          answer:
            "Tra i riferimenti imprescindibili: Trappola di cristallo, Mad Max: Fury Road, John Wick, The Raid e la saga di Mission: Impossible. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.",
        },
        {
          question: "Quale film d'azione guardare stasera in gruppo?",
          answer:
            "Apri una room su Swipe Movie: ognuno swippa sui film d'azione proposti e fate match in pochi minuti su un titolo che mette tutti d'accordo.",
        },
        {
          question: "Dove guardare film d'azione in streaming?",
          answer:
            'La maggior parte dei grandi film d’azione è disponibile su Netflix, Prime Video, Disney+ o Max a seconda della regione. Puoi filtrare per piattaforma direttamente su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: "Ce qui définit un grand film d'aventure",
          body: "L'aventure, c'est avant tout le mouvement et le dépaysement : un héros quitte son monde familier pour une quête, traverse des paysages spectaculaires et affronte l'inconnu. Le genre englobe l'aventure archéologique d'Indiana Jones, le récit de survie en pleine nature, le film de pirates, ou la grande fresque comme Le Seigneur des anneaux. Souvent hybride, il se mêle au fantastique (Jurassic Park), à la science-fiction ou à la comédie. Ce qui fait une bonne aventure, c'est le souffle : le sentiment qu'on voyage avec les personnages et qu'on ne sait jamais ce qu'il y a derrière la prochaine colline.",
        },
        {
          heading: "Trouver le film d'aventure idéal pour la soirée",
          body: "L'aventure plaît à un large public, ce qui en fait un excellent choix de groupe — encore faut-il s'accorder sur le ton. Sur Swipe Movie, lance une room, chacun swipe sur des films d'aventure, et le match émerge naturellement vers le titre qui fait l'unanimité, qu'on parte sur une épopée familiale ou une expédition plus rude.",
        },
      ],
      en: [
        {
          heading: 'What makes a great adventure movie',
          body: "Adventure is above all about movement and escape: a hero leaves the familiar world for a quest, crosses spectacular landscapes and faces the unknown. The genre spans the archaeological thrills of Indiana Jones, wilderness survival stories, pirate films and sweeping epics like The Lord of the Rings. Often a hybrid, it blends with fantasy (Jurassic Park), science fiction or comedy. What makes a good adventure is sweep — the feeling that you're travelling alongside the characters and never quite know what lies over the next hill.",
        },
        {
          heading: 'Finding the perfect adventure movie for the night',
          body: 'Adventure appeals to a wide audience, which makes it a great group pick — as long as you agree on the tone. On Swipe Movie, start a room, everyone swipes on adventure films, and the match emerges naturally toward the title everyone agrees on, whether you fancy a family epic or a grittier expedition.',
        },
      ],
      es: [
        {
          heading: 'Qué hace grande a una película de aventuras',
          body: 'La aventura va sobre todo de movimiento y evasión: un héroe deja su mundo conocido por una misión, atraviesa paisajes espectaculares y se enfrenta a lo desconocido. El género abarca la emoción arqueológica de Indiana Jones, las historias de supervivencia en plena naturaleza, las películas de piratas y las grandes epopeyas como El Señor de los Anillos. A menudo híbrido, se mezcla con la fantasía (Parque Jurásico), la ciencia ficción o la comedia. Lo que hace buena a una aventura es el aliento épico: la sensación de viajar junto a los personajes sin saber qué hay tras la próxima colina.',
        },
        {
          heading: 'Encontrar la película de aventuras ideal para la noche',
          body: 'La aventura gusta a un público amplio, lo que la convierte en una gran elección grupal, siempre que coincidáis en el tono. En Swipe Movie abre una sala, cada uno desliza sobre películas de aventuras y el match surge de forma natural hacia el título que une a todos, ya sea una epopeya familiar o una expedición más dura.',
        },
      ],
      de: [
        {
          heading: 'Was einen großartigen Abenteuerfilm ausmacht',
          body: 'Abenteuer bedeutet vor allem Bewegung und Eskapismus: Ein Held verlässt die vertraute Welt für eine Quest, durchquert spektakuläre Landschaften und stellt sich dem Unbekannten. Das Genre reicht vom archäologischen Nervenkitzel eines Indiana Jones über Survival-Geschichten in der Wildnis und Piratenfilme bis zu großen Epen wie Der Herr der Ringe. Oft ein Hybrid, mischt es sich mit Fantasy (Jurassic Park), Science-Fiction oder Komödie. Ein gutes Abenteuer lebt vom Schwung — dem Gefühl, mit den Figuren zu reisen und nie zu wissen, was hinter dem nächsten Hügel liegt.',
        },
        {
          heading: 'Den perfekten Abenteuerfilm für den Abend finden',
          body: 'Abenteuer spricht ein breites Publikum an und ist damit eine starke Gruppenwahl — sofern man sich auf den Ton einigt. Auf Swipe Movie startest du einen Raum, jeder swipt durch Abenteuerfilme, und das Match findet sich von selbst zum Titel, der alle überzeugt, ob familienfreundliches Epos oder rauere Expedition.',
        },
      ],
      it: [
        {
          heading: "Cosa rende grande un film d'avventura",
          body: "L'avventura è soprattutto movimento ed evasione: un eroe lascia il mondo familiare per una missione, attraversa paesaggi spettacolari e affronta l'ignoto. Il genere spazia dal brivido archeologico di Indiana Jones alle storie di sopravvivenza nella natura, dai film di pirati alle grandi epopee come Il Signore degli Anelli. Spesso ibrido, si mescola al fantasy (Jurassic Park), alla fantascienza o alla commedia. Ciò che rende buona un'avventura è il respiro: la sensazione di viaggiare insieme ai personaggi senza mai sapere cosa c'è oltre la prossima collina.",
        },
        {
          heading: "Trovare il film d'avventura ideale per la serata",
          body: "L'avventura piace a un pubblico ampio, il che la rende un'ottima scelta di gruppo — basta accordarsi sul tono. Su Swipe Movie apri una room, ognuno swippa su film d'avventura e il match emerge naturalmente verso il titolo che mette tutti d'accordo, che si tratti di un'epopea familiare o di una spedizione più dura.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: "Quels sont les meilleurs films d'aventure à voir ?",
          answer:
            "Des incontournables comme Indiana Jones, Le Seigneur des anneaux, Jurassic Park, Pirates des Caraïbes ou Into the Wild. La sélection ci-dessus est triée par note et popularité via les données TMDB.",
        },
        {
          question: "Quel film d'aventure regarder en famille ?",
          answer:
            "Beaucoup de films d'aventure conviennent à toute la famille. Lance une room sur Swipe Movie avec tes proches et matchez sur un titre tout public en quelques minutes.",
        },
        {
          question: "Où trouver des films d'aventure en streaming ?",
          answer:
            "Selon ta région, ils sont répartis entre Disney+, Netflix, Prime Video et Max. Swipe Movie te permet de filtrer la sélection par plateforme.",
        },
      ],
      en: [
        {
          question: 'What are the best adventure movies to watch?',
          answer:
            'Classics like Indiana Jones, The Lord of the Rings, Jurassic Park, Pirates of the Caribbean or Into the Wild. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What adventure movie should I watch with the family?',
          answer:
            'Many adventure films work for the whole family. Start a room on Swipe Movie with your group and match on an all-ages title in minutes.',
        },
        {
          question: 'Where can I stream adventure movies?',
          answer:
            'Depending on your region, they are spread across Disney+, Netflix, Prime Video and Max. Swipe Movie lets you filter the selection by platform.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de aventuras?',
          answer:
            'Clásicos como Indiana Jones, El Señor de los Anillos, Parque Jurásico, Piratas del Caribe o Hacia rutas salvajes. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué película de aventuras ver en familia?',
          answer:
            'Muchas películas de aventuras valen para toda la familia. Abre una sala en Swipe Movie con los tuyos y haced match en un título apto para todos en pocos minutos.',
        },
        {
          question: '¿Dónde ver películas de aventuras en streaming?',
          answer:
            'Según tu región se reparten entre Disney+, Netflix, Prime Video y Max. Swipe Movie te permite filtrar la selección por plataforma.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Abenteuerfilme?',
          answer:
            'Klassiker wie Indiana Jones, Der Herr der Ringe, Jurassic Park, Fluch der Karibik oder Into the Wild. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welchen Abenteuerfilm mit der Familie schauen?',
          answer:
            'Viele Abenteuerfilme eignen sich für die ganze Familie. Starte einen Raum auf Swipe Movie mit deiner Gruppe und matched in Minuten auf einen Titel für alle Altersgruppen.',
        },
        {
          question: 'Wo kann ich Abenteuerfilme streamen?',
          answer:
            'Je nach Region verteilen sie sich auf Disney+, Netflix, Prime Video und Max. Swipe Movie lässt dich die Auswahl nach Plattform filtern.',
        },
      ],
      it: [
        {
          question: "Quali sono i migliori film d'avventura da vedere?",
          answer:
            "Classici come Indiana Jones, Il Signore degli Anelli, Jurassic Park, Pirati dei Caraibi o Into the Wild. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.",
        },
        {
          question: "Quale film d'avventura guardare in famiglia?",
          answer:
            "Molti film d'avventura vanno bene per tutta la famiglia. Apri una room su Swipe Movie con i tuoi e fate match su un titolo per tutti in pochi minuti.",
        },
        {
          question: "Dove guardare film d'avventura in streaming?",
          answer:
            'A seconda della regione sono distribuiti tra Disney+, Netflix, Prime Video e Max. Swipe Movie ti permette di filtrare la selezione per piattaforma.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: "L'animation, un genre pour tous les âges",
          body: "L'erreur la plus courante est de croire que l'animation est réservée aux enfants. Le studio Pixar (Là-haut, Vice-versa) bouleverse autant les adultes ; le Studio Ghibli de Miyazaki (Le Voyage de Chihiro, Princesse Mononoké) signe des chefs-d'œuvre d'une profondeur rare ; et l'animation peut être franchement adulte, du film en stop-motion (L'Étrange Noël de monsieur Jack) au long-métrage primé Spider-Man: New Generation. Entre la 2D traditionnelle de Disney, l'image de synthèse, l'animé japonais et les pépites européennes, c'est l'un des genres les plus inventifs visuellement.",
        },
        {
          heading: 'Mettre tout le monde d’accord sur un film d’animation',
          body: "L'animation est le terrain de jeu idéal pour une soirée intergénérationnelle : enfants, ados et adultes y trouvent leur compte. Mais le choix entre un Pixar, un Ghibli ou un animé peut diviser. Avec Swipe Movie, ouvre une room, chacun swipe, et le match désigne le film qui ravira toute la pièce sans négociation interminable.",
        },
      ],
      en: [
        {
          heading: 'Animation: a genre for all ages',
          body: "The most common mistake is assuming animation is only for kids. Pixar (Up, Inside Out) moves adults just as deeply; Miyazaki's Studio Ghibli (Spirited Away, Princess Mononoke) delivers masterpieces of rare depth; and animation can be firmly adult, from stop-motion (The Nightmare Before Christmas) to the award-winning Spider-Man: Into the Spider-Verse. Between Disney's traditional 2D, CGI, Japanese anime and European gems, it's one of the most visually inventive genres in cinema.",
        },
        {
          heading: 'Getting everyone to agree on an animated film',
          body: "Animation is the ideal playground for a cross-generational night: kids, teens and adults all find something to love. But choosing between a Pixar, a Ghibli or an anime can split the room. With Swipe Movie, open a room, everyone swipes, and the match points to the film that will delight the whole room without endless negotiation.",
        },
      ],
      es: [
        {
          heading: 'La animación, un género para todas las edades',
          body: 'El error más común es creer que la animación es solo para niños. Pixar (Up, Del revés) emociona igual a los adultos; el Studio Ghibli de Miyazaki (El viaje de Chihiro, La princesa Mononoke) firma obras maestras de una profundidad poco común; y la animación puede ser claramente adulta, desde el stop-motion (Pesadilla antes de Navidad) hasta la premiada Spider-Man: Un nuevo universo. Entre la 2D tradicional de Disney, la imagen por ordenador, el anime japonés y las joyas europeas, es uno de los géneros más inventivos visualmente.',
        },
        {
          heading: 'Poner a todos de acuerdo con una película de animación',
          body: 'La animación es el terreno ideal para una noche intergeneracional: niños, adolescentes y adultos encuentran lo suyo. Pero elegir entre un Pixar, un Ghibli o un anime puede dividir. Con Swipe Movie abre una sala, cada uno desliza y el match señala la película que encantará a toda la sala sin negociaciones interminables.',
        },
      ],
      de: [
        {
          heading: 'Animation: ein Genre für jedes Alter',
          body: 'Der häufigste Irrtum ist, Animation sei nur für Kinder. Pixar (Oben, Alles steht Kopf) berührt Erwachsene genauso tief; Miyazakis Studio Ghibli (Chihiros Reise ins Zauberland, Prinzessin Mononoke) schafft Meisterwerke von seltener Tiefe; und Animation kann klar erwachsen sein, vom Stop-Motion (Nightmare Before Christmas) bis zum preisgekrönten Spider-Man: A New Universe. Zwischen Disneys traditioneller 2D, CGI, japanischem Anime und europäischen Perlen ist es eines der visuell erfindungsreichsten Genres.',
        },
        {
          heading: 'Alle auf einen Animationsfilm einigen',
          body: 'Animation ist das ideale Terrain für einen generationenübergreifenden Abend: Kinder, Teenager und Erwachsene finden etwas. Doch die Wahl zwischen Pixar, Ghibli oder Anime kann spalten. Mit Swipe Movie öffnest du einen Raum, jeder swipt, und das Match zeigt den Film, der den ganzen Raum begeistert — ohne endloses Verhandeln.',
        },
      ],
      it: [
        {
          heading: "L'animazione, un genere per tutte le età",
          body: "L'errore più comune è credere che l'animazione sia solo per bambini. Pixar (Up, Inside Out) commuove anche gli adulti; lo Studio Ghibli di Miyazaki (La città incantata, Principessa Mononoke) firma capolavori di rara profondità; e l'animazione può essere decisamente adulta, dallo stop-motion (Nightmare Before Christmas) al premiato Spider-Man: Un nuovo universo. Tra la 2D tradizionale Disney, la computer grafica, l'anime giapponese e le perle europee, è uno dei generi più inventivi sul piano visivo.",
        },
        {
          heading: "Mettere tutti d'accordo su un film d'animazione",
          body: "L'animazione è il terreno ideale per una serata intergenerazionale: bambini, adolescenti e adulti trovano pane per i loro denti. Ma scegliere tra un Pixar, un Ghibli o un anime può dividere. Con Swipe Movie apri una room, ognuno swippa e il match indica il film che conquisterà tutta la stanza senza trattative infinite.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: "Quels sont les meilleurs films d'animation de tous les temps ?",
          answer:
            "Souvent cités : Le Voyage de Chihiro, Vice-versa, Là-haut, Le Roi Lion et Spider-Man: New Generation. La sélection ci-dessus est classée par note et popularité via les données TMDB.",
        },
        {
          question: "L'animation, c'est seulement pour les enfants ?",
          answer:
            "Non. De nombreux films d'animation (Ghibli, Pixar, certains animés) s'adressent autant aux adultes. Tu peux composer une room adaptée à ton public sur Swipe Movie.",
        },
        {
          question: "Où regarder des films d'animation en streaming ?",
          answer:
            'Disney+ concentre Disney et Pixar, Netflix propose beaucoup d’animés, et Ghibli est dispo selon les régions. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best animated movies of all time?',
          answer:
            'Frequently cited: Spirited Away, Inside Out, Up, The Lion King and Spider-Man: Into the Spider-Verse. The selection above is ranked by rating and popularity via TMDB data.',
        },
        {
          question: 'Is animation only for kids?',
          answer:
            'No. Many animated films (Ghibli, Pixar, certain anime) speak just as much to adults. You can build a room tailored to your audience on Swipe Movie.',
        },
        {
          question: 'Where can I stream animated movies?',
          answer:
            'Disney+ holds Disney and Pixar, Netflix offers plenty of anime, and Ghibli availability varies by region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de animación de todos los tiempos?',
          answer:
            'A menudo citadas: El viaje de Chihiro, Del revés, Up, El Rey León y Spider-Man: Un nuevo universo. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿La animación es solo para niños?',
          answer:
            'No. Muchas películas de animación (Ghibli, Pixar, ciertos anime) hablan igual a los adultos. Puedes montar una sala adaptada a tu público en Swipe Movie.',
        },
        {
          question: '¿Dónde ver películas de animación en streaming?',
          answer:
            'Disney+ reúne Disney y Pixar, Netflix ofrece mucho anime y Ghibli está disponible según la región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Animationsfilme aller Zeiten?',
          answer:
            'Häufig genannt: Chihiros Reise ins Zauberland, Alles steht Kopf, Oben, Der König der Löwen und Spider-Man: A New Universe. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Ist Animation nur etwas für Kinder?',
          answer:
            'Nein. Viele Animationsfilme (Ghibli, Pixar, manche Anime) sprechen Erwachsene ebenso an. Du kannst auf Swipe Movie einen Raum passend zu deinem Publikum zusammenstellen.',
        },
        {
          question: 'Wo kann ich Animationsfilme streamen?',
          answer:
            'Disney+ bündelt Disney und Pixar, Netflix bietet viele Anime, und Ghibli ist je nach Region verfügbar. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: "Quali sono i migliori film d'animazione di tutti i tempi?",
          answer:
            "Spesso citati: La città incantata, Inside Out, Up, Il Re Leone e Spider-Man: Un nuovo universo. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.",
        },
        {
          question: "L'animazione è solo per bambini?",
          answer:
            "No. Molti film d'animazione (Ghibli, Pixar, certi anime) parlano anche agli adulti. Puoi creare una room su misura per il tuo pubblico su Swipe Movie.",
        },
        {
          question: "Dove guardare film d'animazione in streaming?",
          answer:
            'Disney+ raccoglie Disney e Pixar, Netflix offre molti anime e Ghibli è disponibile a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Tous les visages de la comédie',
          body: "La comédie est sans doute le genre le plus varié : la comédie romantique (Quand Harry rencontre Sally, Love Actually), le buddy movie, la comédie potache, le film choral, la satire grinçante ou la comédie britannique pince-sans-rire des Monty Python. À côté des classiques cultes, il y a la comédie d'auteur plus douce-amère. Le rire ne se commande pas : une comédie qui fait pleurer de rire un groupe en laissera un autre de marbre, car l'humour est très culturel et personnel. C'est précisément pour ça que le choix collectif est un casse-tête.",
        },
        {
          heading: 'Choisir une comédie qui fait rire tout le groupe',
          body: "Rien de pire qu'une comédie lancée en solo qui ne fait sourire personne d'autre. Sur Swipe Movie, tu crées une room, chacun swipe sur une sélection de comédies, et le match révèle le film dont l'humour rassemble la pièce. Vous gagnez du temps et vous évitez le silence gêné des blagues qui tombent à plat.",
        },
      ],
      en: [
        {
          heading: 'Every face of comedy',
          body: "Comedy is arguably the most varied genre: the rom-com (When Harry Met Sally, Love Actually), the buddy movie, the raunchy comedy, the ensemble film, biting satire and the deadpan British wit of Monty Python. Alongside cult classics sits the gentler, bittersweet comedy-drama. Laughter can't be forced — a comedy that has one group in stitches leaves another cold, because humour is deeply cultural and personal. Which is exactly why choosing one as a group is such a headache.",
        },
        {
          heading: 'Picking a comedy that makes the whole group laugh',
          body: "Nothing is worse than a comedy you pick solo that nobody else finds funny. On Swipe Movie, you create a room, everyone swipes on a selection of comedies, and the match reveals the film whose humour unites the room. You save time and dodge the awkward silence of jokes falling flat.",
        },
      ],
      es: [
        {
          heading: 'Todas las caras de la comedia',
          body: 'La comedia es seguramente el género más variado: la comedia romántica (Cuando Harry encontró a Sally, Love Actually), el buddy movie, la comedia gamberra, el film coral, la sátira mordaz y el humor seco británico de los Monty Python. Junto a los clásicos de culto está la comedia de autor más agridulce. La risa no se ordena: una comedia que parte de risa a un grupo deja indiferente a otro, porque el humor es muy cultural y personal. Por eso justamente elegir una en grupo es un quebradero de cabeza.',
        },
        {
          heading: 'Elegir una comedia que haga reír a todo el grupo',
          body: 'No hay nada peor que una comedia elegida en solitario que no hace gracia a nadie más. En Swipe Movie creas una sala, cada uno desliza sobre una selección de comedias y el match revela la película cuyo humor une a la sala. Ahorráis tiempo y evitáis el silencio incómodo de los chistes que caen en saco roto.',
        },
      ],
      de: [
        {
          heading: 'Alle Gesichter der Komödie',
          body: 'Die Komödie ist wohl das vielfältigste Genre: die Romcom (Harry und Sally, Tatsächlich… Liebe), der Buddy-Film, die derbe Komödie, der Ensemblefilm, die bissige Satire und der trockene britische Witz von Monty Python. Neben den Kultklassikern steht die sanftere, bittersüße Tragikomödie. Lachen lässt sich nicht erzwingen — eine Komödie, die eine Gruppe vor Lachen umhaut, lässt die nächste kalt, denn Humor ist stark kulturell und persönlich geprägt. Genau deshalb ist die Auswahl in der Gruppe so knifflig.',
        },
        {
          heading: 'Eine Komödie wählen, über die alle lachen',
          body: 'Nichts ist schlimmer als eine allein ausgewählte Komödie, die sonst niemanden zum Lachen bringt. Auf Swipe Movie erstellst du einen Raum, jeder swipt durch eine Auswahl an Komödien, und das Match zeigt den Film, dessen Humor den Raum vereint. Ihr spart Zeit und vermeidet das peinliche Schweigen verpuffter Pointen.',
        },
      ],
      it: [
        {
          heading: 'Tutti i volti della commedia',
          body: "La commedia è probabilmente il genere più vario: la commedia romantica (Harry ti presento Sally, Love Actually), il buddy movie, la commedia demenziale, il film corale, la satira pungente e l'umorismo flemmatico britannico dei Monty Python. Accanto ai classici di culto c'è la commedia d'autore più agrodolce. La risata non si comanda: una commedia che spacca un gruppo lascia indifferente un altro, perché l'umorismo è molto culturale e personale. Proprio per questo sceglierla in gruppo è un rompicapo.",
        },
        {
          heading: 'Scegliere una commedia che faccia ridere tutto il gruppo',
          body: "Non c'è niente di peggio di una commedia scelta da soli che non fa ridere nessun altro. Su Swipe Movie crei una room, ognuno swippa su una selezione di commedie e il match rivela il film il cui umorismo unisce la stanza. Risparmiate tempo ed evitate il silenzio imbarazzato delle battute a vuoto.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films comiques à voir ?',
          answer:
            'Parmi les valeurs sûres : Quand Harry rencontre Sally, La Vie de Brian, Very Bad Trip, OSS 117 ou Intouchables. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quelle comédie regarder ce soir pour rire en groupe ?',
          answer:
            'Lance une room sur Swipe Movie : chacun swipe et vous matchez sur la comédie qui fait l’unanimité dans le groupe en quelques minutes.',
        },
        {
          question: 'Où regarder des comédies en streaming ?',
          answer:
            'Les comédies sont réparties entre Netflix, Prime Video, Disney+ et Max selon ta région. Tu peux filtrer par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best comedy movies to watch?',
          answer:
            'Safe bets include When Harry Met Sally, Life of Brian, The Hangover, Superbad or Bridesmaids. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What comedy should we watch tonight as a group?',
          answer:
            'Start a room on Swipe Movie: everyone swipes and you match in minutes on the comedy the whole group agrees on.',
        },
        {
          question: 'Where can I stream comedies?',
          answer:
            'Comedies are spread across Netflix, Prime Video, Disney+ and Max depending on your region. You can filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de comedia?',
          answer:
            'Apuestas seguras: Cuando Harry encontró a Sally, La vida de Brian, Resacón en Las Vegas, Superfumados o La boda de mi mejor amiga. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué comedia ver esta noche para reír en grupo?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza y hacéis match en pocos minutos en la comedia que une a todo el grupo.',
        },
        {
          question: '¿Dónde ver comedias en streaming?',
          answer:
            'Las comedias se reparten entre Netflix, Prime Video, Disney+ y Max según tu región. Puedes filtrar por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Komödien?',
          answer:
            'Sichere Tipps: Harry und Sally, Das Leben des Brian, Hangover, Superbad oder Brautalarm. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welche Komödie heute Abend für die Gruppe schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt und ihr matched in Minuten auf die Komödie, über die sich die ganze Gruppe einig ist.',
        },
        {
          question: 'Wo kann ich Komödien streamen?',
          answer:
            'Komödien verteilen sich je nach Region auf Netflix, Prime Video, Disney+ und Max. Du kannst auf Swipe Movie nach Plattform filtern.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film comici da vedere?',
          answer:
            'Scelte sicure: Harry ti presento Sally, Brian di Nazareth, Una notte da leoni, Suxbad o Le amiche della sposa. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Quale commedia guardare stasera per ridere in gruppo?',
          answer:
            'Apri una room su Swipe Movie: ognuno swippa e fate match in pochi minuti sulla commedia che mette d’accordo tutto il gruppo.',
        },
        {
          question: 'Dove guardare commedie in streaming?',
          answer:
            'Le commedie sono distribuite tra Netflix, Prime Video, Disney+ e Max a seconda della regione. Puoi filtrare per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Du film de mafia au polar urbain',
          body: "Le cinéma de crime est l'un des plus riches de l'histoire du septième art. Il y a la fresque mafieuse (Le Parrain, Les Affranchis de Scorsese), le film de braquage (Heat, Reservoir Dogs), le polar nerveux et le récit du crime vu de l'intérieur. Ce genre fascine parce qu'il explore la frontière trouble entre loi et hors-la-loi, et qu'il offre souvent ses plus grands rôles à des acteurs marquants. Contrairement au pur thriller, le crime s'attache aux mécanismes : comment naît une organisation, comment un coup se prépare, comment tout finit par s'effondrer.",
        },
        {
          heading: 'Trouver le bon polar pour la soirée',
          body: "Un film de crime, ça se savoure souvent à deux ou trois, pour commenter les retournements et les coups montés. Sur Swipe Movie, lance une room, chacun swipe sur une sélection de polars et films de gangsters, et vous matchez sur le titre qui tient tout le monde en haleine, sans passer la soirée à comparer les bandes-annonces.",
        },
      ],
      en: [
        {
          heading: 'From mob sagas to urban crime',
          body: "Crime cinema is one of the richest traditions in film history. There's the mafia epic (The Godfather, Scorsese's Goodfellas), the heist movie (Heat, Reservoir Dogs), the gritty cop thriller and the story of crime seen from the inside. The genre fascinates because it explores the blurred line between law and outlaw, and often hands its greatest roles to landmark performances. Unlike the pure thriller, crime focuses on mechanics: how an organization is born, how a job is planned, how it all eventually collapses.",
        },
        {
          heading: 'Finding the right crime film for the night',
          body: "A crime film is often best savoured with two or three people, so you can argue over the twists and double-crosses. On Swipe Movie, start a room, everyone swipes on a selection of crime and gangster films, and you match on the title that keeps the whole group on edge — without spending the night comparing trailers.",
        },
      ],
      es: [
        {
          heading: 'De la saga mafiosa al policiaco urbano',
          body: 'El cine criminal es una de las tradiciones más ricas de la historia del cine. Está la epopeya mafiosa (El Padrino, Uno de los nuestros de Scorsese), la película de atracos (Heat, Reservoir Dogs), el policiaco crudo y el relato del crimen visto desde dentro. El género fascina porque explora la frontera borrosa entre la ley y el fuera de la ley, y suele ofrecer sus mejores papeles a interpretaciones memorables. A diferencia del thriller puro, el crimen se centra en los mecanismos: cómo nace una organización, cómo se prepara un golpe, cómo acaba todo derrumbándose.',
        },
        {
          heading: 'Encontrar el policiaco adecuado para la noche',
          body: 'Una película criminal se saborea a menudo entre dos o tres, para comentar los giros y las traiciones. En Swipe Movie abre una sala, cada uno desliza sobre una selección de policiacos y películas de gánsteres y hacéis match en el título que mantiene a todos en vilo, sin pasar la noche comparando tráilers.',
        },
      ],
      de: [
        {
          heading: 'Vom Mafia-Epos zum urbanen Krimi',
          body: 'Das Krimikino gehört zu den reichsten Traditionen der Filmgeschichte. Da ist das Mafia-Epos (Der Pate, Scorseses GoodFellas), der Heist-Film (Heat, Reservoir Dogs), der raue Cop-Thriller und die Geschichte des Verbrechens von innen. Das Genre fasziniert, weil es die unscharfe Grenze zwischen Gesetz und Gesetzlosigkeit auslotet und oft seine größten Rollen herausragenden Darstellern überlässt. Anders als der reine Thriller konzentriert sich der Krimi auf die Mechanik: Wie eine Organisation entsteht, wie ein Coup geplant wird, wie am Ende alles zusammenbricht.',
        },
        {
          heading: 'Den richtigen Krimi für den Abend finden',
          body: 'Ein Krimi genießt sich oft zu zweit oder dritt — um über Wendungen und Doppelspiele zu diskutieren. Auf Swipe Movie startest du einen Raum, jeder swipt durch eine Auswahl an Krimis und Gangsterfilmen, und ihr matched auf den Titel, der die ganze Gruppe in Atem hält, ohne den Abend mit Trailervergleichen zu verbringen.',
        },
      ],
      it: [
        {
          heading: 'Dalla saga mafiosa al poliziesco urbano',
          body: "Il cinema crime è una delle tradizioni più ricche della storia del cinema. C'è l'epopea mafiosa (Il Padrino, Quei bravi ragazzi di Scorsese), il film di rapina (Heat, Le iene), il poliziesco crudo e il racconto del crimine visto dall'interno. Il genere affascina perché esplora il confine sfumato tra legge e fuorilegge, e spesso affida i suoi ruoli più grandi a interpretazioni memorabili. A differenza del thriller puro, il crime si concentra sui meccanismi: come nasce un'organizzazione, come si prepara un colpo, come tutto finisce per crollare.",
        },
        {
          heading: 'Trovare il poliziesco giusto per la serata',
          body: 'Un film crime spesso si gusta meglio in due o tre, per commentare i colpi di scena e i doppi giochi. Su Swipe Movie apri una room, ognuno swippa su una selezione di polizieschi e film di gangster e fate match sul titolo che tiene tutti col fiato sospeso, senza passare la serata a confrontare i trailer.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films de crime de tous les temps ?',
          answer:
            'Souvent en tête : Le Parrain, Les Affranchis, Heat, Pulp Fiction et Scarface. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quelle est la différence entre un film de crime et un thriller ?',
          answer:
            "Le crime s'intéresse aux criminels et aux mécanismes du délit ; le thriller mise sur le suspense et la tension. Beaucoup de films mêlent les deux.",
        },
        {
          question: 'Où regarder des polars en streaming ?',
          answer:
            'Les grands films de crime sont répartis entre Netflix, Prime Video et Max selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best crime movies of all time?',
          answer:
            'Often at the top: The Godfather, Goodfellas, Heat, Pulp Fiction and Scarface. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What is the difference between a crime film and a thriller?',
          answer:
            'Crime focuses on the criminals and the mechanics of the offence; the thriller is built on suspense and tension. Many films blend both.',
        },
        {
          question: 'Where can I stream crime movies?',
          answer:
            'Major crime films are spread across Netflix, Prime Video and Max depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de crimen de todos los tiempos?',
          answer:
            'A menudo en cabeza: El Padrino, Uno de los nuestros, Heat, Pulp Fiction y El precio del poder. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Cuál es la diferencia entre una película de crimen y un thriller?',
          answer:
            'El crimen se centra en los criminales y los mecanismos del delito; el thriller se apoya en el suspense y la tensión. Muchas películas mezclan ambos.',
        },
        {
          question: '¿Dónde ver películas de crimen en streaming?',
          answer:
            'Los grandes títulos criminales se reparten entre Netflix, Prime Video y Max según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Krimis aller Zeiten?',
          answer:
            'Oft ganz oben: Der Pate, GoodFellas, Heat, Pulp Fiction und Scarface. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Was ist der Unterschied zwischen Krimi und Thriller?',
          answer:
            'Der Krimi richtet den Blick auf die Täter und die Mechanik der Tat; der Thriller setzt auf Spannung und Anspannung. Viele Filme verbinden beides.',
        },
        {
          question: 'Wo kann ich Krimis streamen?',
          answer:
            'Große Krimis verteilen sich je nach Region auf Netflix, Prime Video und Max. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film crime di tutti i tempi?',
          answer:
            'Spesso in testa: Il Padrino, Quei bravi ragazzi, Heat, Pulp Fiction e Scarface. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Qual è la differenza tra un film crime e un thriller?',
          answer:
            'Il crime si concentra sui criminali e sui meccanismi del reato; il thriller punta su suspense e tensione. Molti film mescolano entrambi.',
        },
        {
          question: 'Dove guardare film crime in streaming?',
          answer:
            'I grandi film crime sono distribuiti tra Netflix, Prime Video e Max a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Le documentaire, bien plus que des images d’archives',
          body: "Le documentaire a connu un âge d'or, porté notamment par le streaming. Il y a le documentaire animalier et de nature à grand spectacle, le true crime qui a explosé (The Jinx, Making a Murderer), le portrait de société, le documentaire musical (Amy, sur Amy Winehouse) et le récit sportif. Des films comme Free Solo ou March of the Penguins ont prouvé qu'un documentaire pouvait tenir une salle en haleine autant qu'une fiction. Le genre se distingue par sa capacité à raconter le réel avec une tension narrative digne d'un thriller.",
        },
        {
          heading: 'Un documentaire pour lancer la discussion',
          body: "Le documentaire est idéal en groupe : il nourrit la conversation bien après le générique. Sur Swipe Movie, ouvre une room, chacun swipe sur des documentaires (nature, true crime, société, musique), et vous matchez sur le sujet qui intrigue tout le monde — parfait pour une soirée à la fois divertissante et stimulante.",
        },
      ],
      en: [
        {
          heading: 'Documentary: far more than archive footage',
          body: "The documentary has enjoyed a golden age, driven in large part by streaming. There's the spectacular nature doc, the true-crime boom (The Jinx, Making a Murderer), the social portrait, the music doc (Amy, on Amy Winehouse) and the sports story. Films like Free Solo or March of the Penguins proved a documentary can grip a room as tightly as any fiction. The genre stands out for telling real stories with the narrative tension of a thriller.",
        },
        {
          heading: 'A documentary to spark conversation',
          body: 'Documentaries are ideal for a group: they fuel conversation long after the credits roll. On Swipe Movie, open a room, everyone swipes on documentaries (nature, true crime, society, music), and you match on the subject that intrigues everyone — perfect for a night that is both entertaining and thought-provoking.',
        },
      ],
      es: [
        {
          heading: 'El documental, mucho más que imágenes de archivo',
          body: 'El documental ha vivido una edad de oro impulsada en gran parte por el streaming. Está el documental de naturaleza de gran espectáculo, el boom del true crime (The Jinx, Making a Murderer), el retrato social, el documental musical (Amy, sobre Amy Winehouse) y el relato deportivo. Películas como Free Solo o El viaje del emperador demostraron que un documental puede tener a una sala en vilo como una ficción. El género destaca por contar lo real con la tensión narrativa de un thriller.',
        },
        {
          heading: 'Un documental para abrir el debate',
          body: 'El documental es ideal en grupo: alimenta la conversación mucho después de los créditos. En Swipe Movie abre una sala, cada uno desliza sobre documentales (naturaleza, true crime, sociedad, música) y hacéis match en el tema que intriga a todos, perfecto para una noche entretenida y estimulante a la vez.',
        },
      ],
      de: [
        {
          heading: 'Dokumentarfilm: weit mehr als Archivmaterial',
          body: 'Der Dokumentarfilm erlebt ein goldenes Zeitalter, getrieben vor allem vom Streaming. Da ist die spektakuläre Naturdoku, der True-Crime-Boom (The Jinx, Making a Murderer), das Gesellschaftsporträt, die Musikdoku (Amy, über Amy Winehouse) und die Sportgeschichte. Filme wie Free Solo oder Die Reise der Pinguine bewiesen, dass eine Doku einen Saal so fesseln kann wie jede Fiktion. Das Genre besticht dadurch, das Reale mit der erzählerischen Spannung eines Thrillers zu erzählen.',
        },
        {
          heading: 'Eine Doku als Gesprächsanstoß',
          body: 'Dokumentarfilme sind ideal für die Gruppe: Sie befeuern das Gespräch noch lange nach dem Abspann. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch Dokus (Natur, True Crime, Gesellschaft, Musik), und ihr matched auf das Thema, das alle interessiert — perfekt für einen Abend, der unterhält und zugleich anregt.',
        },
      ],
      it: [
        {
          heading: "Il documentario, molto più di immagini d'archivio",
          body: "Il documentario vive un'età dell'oro, trainata soprattutto dallo streaming. C'è il documentario naturalistico spettacolare, il boom del true crime (The Jinx, Making a Murderer), il ritratto sociale, il documentario musicale (Amy, su Amy Winehouse) e il racconto sportivo. Film come Free Solo o La marcia dei pinguini hanno dimostrato che un documentario può tenere una sala col fiato sospeso come una fiction. Il genere si distingue per raccontare il reale con la tensione narrativa di un thriller.",
        },
        {
          heading: 'Un documentario per accendere la discussione',
          body: 'Il documentario è ideale in gruppo: alimenta la conversazione ben oltre i titoli di coda. Su Swipe Movie apri una room, ognuno swippa su documentari (natura, true crime, società, musica) e fate match sul tema che incuriosisce tutti, perfetto per una serata divertente e stimolante insieme.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs documentaires à voir ?',
          answer:
            'Souvent recommandés : Free Solo, Amy, The Social Dilemma, Won’t You Be My Neighbor? et 13th. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quel documentaire regarder à plusieurs ce soir ?',
          answer:
            'Lance une room sur Swipe Movie : chacun swipe sur des documentaires et vous matchez sur un sujet qui intéresse tout le groupe en quelques minutes.',
        },
        {
          question: 'Où regarder des documentaires en streaming ?',
          answer:
            'Netflix et Prime Video proposent de grandes collections de documentaires, complétées par Disney+ pour la nature. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best documentaries to watch?',
          answer:
            'Frequently recommended: Free Solo, Amy, The Social Dilemma, Won’t You Be My Neighbor? and 13th. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What documentary should we watch together tonight?',
          answer:
            'Start a room on Swipe Movie: everyone swipes on documentaries and you match in minutes on a topic that interests the whole group.',
        },
        {
          question: 'Where can I stream documentaries?',
          answer:
            'Netflix and Prime Video host large documentary collections, with Disney+ strong on nature. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son los mejores documentales para ver?',
          answer:
            'A menudo recomendados: Free Solo, Amy, El dilema de las redes, Won’t You Be My Neighbor? y Enmienda XIII. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué documental ver en grupo esta noche?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza sobre documentales y hacéis match en pocos minutos en un tema que interesa a todo el grupo.',
        },
        {
          question: '¿Dónde ver documentales en streaming?',
          answer:
            'Netflix y Prime Video reúnen grandes colecciones de documentales, con Disney+ fuerte en naturaleza. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Dokumentationen?',
          answer:
            'Häufig empfohlen: Free Solo, Amy, The Social Dilemma, Won’t You Be My Neighbor? und 13th. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welche Doku heute Abend in der Gruppe schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt durch Dokus und ihr matched in Minuten auf ein Thema, das die ganze Gruppe interessiert.',
        },
        {
          question: 'Wo kann ich Dokumentationen streamen?',
          answer:
            'Netflix und Prime Video bieten große Doku-Sammlungen, Disney+ ist stark bei Naturfilmen. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori documentari da vedere?',
          answer:
            'Spesso consigliati: Free Solo, Amy, The Social Dilemma, Won’t You Be My Neighbor? e 13th. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Quale documentario guardare in gruppo stasera?',
          answer:
            'Apri una room su Swipe Movie: ognuno swippa su documentari e fate match in pochi minuti su un tema che interessa tutto il gruppo.',
        },
        {
          question: 'Dove guardare documentari in streaming?',
          answer:
            'Netflix e Prime Video offrono grandi collezioni di documentari, con Disney+ forte sulla natura. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Le drame, le genre qui rafle les Oscars',
          body: "Le drame est le genre roi des récompenses, et pour cause : il met l'émotion humaine au centre. Il englobe le drame social (Nomadland, Parasite), le drame intime sur la famille ou le deuil, le récit judiciaire, le coming-of-age et le mélodrame. Des films comme Les Évadés, La Liste de Schindler ou Manchester by the Sea marquent durablement parce qu'ils osent rester sur les visages et sur le silence. Le drame ne cherche pas l'effet : il cherche la vérité d'un personnage, ce qui en fait le genre le plus discuté après une projection.",
        },
        {
          heading: 'Choisir un drame sans plomber l’ambiance du groupe',
          body: "Tous les drames ne se valent pas pour une soirée : certains sont bouleversants, d'autres plus lumineux. Sur Swipe Movie, lance une room, chacun swipe sur une sélection de drames, et vous matchez sur le film dont l'intensité convient à l'humeur du groupe — sans imposer un choix trop lourd à tout le monde.",
        },
      ],
      en: [
        {
          heading: 'Drama: the genre that sweeps the Oscars',
          body: "Drama is the awards genre par excellence, and for good reason: it puts human emotion at its centre. It spans the social drama (Nomadland, Parasite), the intimate film about family or grief, the courtroom story, the coming-of-age and the melodrama. Films like The Shawshank Redemption, Schindler's List or Manchester by the Sea leave a lasting mark because they dare to stay on faces and silence. Drama isn't after spectacle — it's after the truth of a character, which makes it the most-discussed genre once the credits roll.",
        },
        {
          heading: 'Picking a drama without killing the group’s mood',
          body: "Not every drama suits a night in: some are devastating, others more hopeful. On Swipe Movie, start a room, everyone swipes on a selection of dramas, and you match on the film whose intensity fits the group's mood — without forcing too heavy a choice on everyone.",
        },
      ],
      es: [
        {
          heading: 'El drama, el género que arrasa en los Óscar',
          body: 'El drama es el género de los premios por excelencia, y con razón: pone la emoción humana en el centro. Abarca el drama social (Nomadland, Parásitos), el drama íntimo sobre la familia o el duelo, el relato judicial, el coming-of-age y el melodrama. Películas como Cadena perpetua, La lista de Schindler o Manchester frente al mar dejan huella porque se atreven a quedarse en los rostros y el silencio. El drama no busca el efecto: busca la verdad de un personaje, lo que lo convierte en el género más comentado tras la proyección.',
        },
        {
          heading: 'Elegir un drama sin hundir el ánimo del grupo',
          body: 'No todos los dramas valen para una noche: unos son demoledores, otros más luminosos. En Swipe Movie abre una sala, cada uno desliza sobre una selección de dramas y hacéis match en la película cuya intensidad encaja con el ánimo del grupo, sin imponer a todos una elección demasiado pesada.',
        },
      ],
      de: [
        {
          heading: 'Das Drama: das Genre, das die Oscars abräumt',
          body: 'Das Drama ist das Preisgenre schlechthin, und das aus gutem Grund: Es rückt das menschliche Gefühl ins Zentrum. Es reicht vom Sozialdrama (Nomadland, Parasite) über das intime Familien- oder Trauerdrama, das Gerichtsdrama, den Coming-of-Age-Film bis zum Melodram. Filme wie Die Verurteilten, Schindlers Liste oder Manchester by the Sea bleiben in Erinnerung, weil sie es wagen, auf Gesichtern und Stille zu verweilen. Das Drama sucht nicht den Effekt, sondern die Wahrheit einer Figur — was es zum meistdiskutierten Genre nach dem Abspann macht.',
        },
        {
          heading: 'Ein Drama wählen, ohne die Stimmung zu drücken',
          body: 'Nicht jedes Drama passt zum Abend: manche sind erschütternd, andere hoffnungsvoller. Auf Swipe Movie startest du einen Raum, jeder swipt durch eine Auswahl an Dramen, und ihr matched auf den Film, dessen Intensität zur Stimmung der Gruppe passt — ohne allen eine zu schwere Wahl aufzuzwingen.',
        },
      ],
      it: [
        {
          heading: 'Il dramma, il genere che fa incetta di Oscar',
          body: "Il dramma è il genere dei premi per eccellenza, e a ragione: mette l'emozione umana al centro. Spazia dal dramma sociale (Nomadland, Parasite) al dramma intimo su famiglia o lutto, dal racconto giudiziario al coming-of-age fino al melodramma. Film come Le ali della libertà, Schindler's List o Manchester by the Sea lasciano il segno perché osano restare sui volti e sul silenzio. Il dramma non cerca l'effetto: cerca la verità di un personaggio, il che lo rende il genere più discusso dopo la visione.",
        },
        {
          heading: "Scegliere un dramma senza affossare l'umore del gruppo",
          body: "Non tutti i drammi vanno bene per una serata: alcuni sono devastanti, altri più luminosi. Su Swipe Movie apri una room, ognuno swippa su una selezione di drammi e fate match sul film la cui intensità si adatta all'umore del gruppo, senza imporre a tutti una scelta troppo pesante.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films dramatiques de tous les temps ?',
          answer:
            'Très souvent cités : Les Évadés, La Liste de Schindler, Forrest Gump, Parasite et La Ligne verte. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quel drame regarder ce soir à plusieurs ?',
          answer:
            'Lance une room sur Swipe Movie : chacun swipe et vous matchez sur le drame qui correspond à l’humeur du groupe en quelques minutes.',
        },
        {
          question: 'Où regarder des films dramatiques en streaming ?',
          answer:
            'Les drames sont nombreux sur Netflix, Prime Video et Max selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best drama movies of all time?',
          answer:
            'Very often cited: The Shawshank Redemption, Schindler\'s List, Forrest Gump, Parasite and The Green Mile. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What drama should we watch tonight as a group?',
          answer:
            'Start a room on Swipe Movie: everyone swipes and you match in minutes on the drama that fits the group\'s mood.',
        },
        {
          question: 'Where can I stream drama movies?',
          answer:
            'Dramas are plentiful on Netflix, Prime Video and Max depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas dramáticas de todos los tiempos?',
          answer:
            'Muy citadas: Cadena perpetua, La lista de Schindler, Forrest Gump, Parásitos y La milla verde. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué drama ver esta noche en grupo?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza y hacéis match en pocos minutos en el drama que encaja con el ánimo del grupo.',
        },
        {
          question: '¿Dónde ver películas dramáticas en streaming?',
          answer:
            'Hay muchos dramas en Netflix, Prime Video y Max según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Dramen aller Zeiten?',
          answer:
            'Sehr oft genannt: Die Verurteilten, Schindlers Liste, Forrest Gump, Parasite und The Green Mile. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welches Drama heute Abend in der Gruppe schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt und ihr matched in Minuten auf das Drama, das zur Stimmung der Gruppe passt.',
        },
        {
          question: 'Wo kann ich Dramen streamen?',
          answer:
            'Dramen gibt es reichlich auf Netflix, Prime Video und Max je nach Region. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film drammatici di tutti i tempi?',
          answer:
            'Spesso citati: Le ali della libertà, Schindler\'s List, Forrest Gump, Parasite e Il miglio verde. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Quale dramma guardare stasera in gruppo?',
          answer:
            'Apri una room su Swipe Movie: ognuno swippa e fate match in pochi minuti sul dramma che si adatta all’umore del gruppo.',
        },
        {
          question: 'Dove guardare film drammatici in streaming?',
          answer:
            'I drammi abbondano su Netflix, Prime Video e Max a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Le film familial : plaire aux enfants comme aux parents',
          body: "Le bon film familial réussit un exercice difficile : captiver les enfants tout en gardant les adultes éveillés. Les meilleurs y parviennent avec un double niveau de lecture — les aventures de E.T. ou Paddington fonctionnent à 6 comme à 40 ans. Le genre couvre la comédie familiale (Maman, j'ai raté l'avion), le film d'animation tout public, l'aventure de Noël et le récit initiatique. Contrairement à l'idée reçue, un film familial n'est pas un film édulcoré : Le Géant de fer ou Vice-versa abordent des émotions profondes avec une justesse rare.",
        },
        {
          heading: 'Le bon film pour une soirée en famille sans dispute',
          body: "Choisir un film qui convienne aux petits et aux grands, c'est souvent là que la soirée déraille. Sur Swipe Movie, crée une room avec toute la famille, chacun swipe sur une sélection tout public, et le match désigne le film qui met tout le monde d'accord — enfants compris — en quelques minutes.",
        },
      ],
      en: [
        {
          heading: 'The family film: pleasing kids and parents alike',
          body: "A great family film pulls off a tough trick: holding the kids while keeping the adults awake. The best manage it with a double layer of meaning — E.T. or Paddington work as well at six as at forty. The genre covers the family comedy (Home Alone), the all-ages animated film, the Christmas adventure and the coming-of-age story. Contrary to the cliché, a family film isn't a watered-down film: The Iron Giant or Inside Out tackle deep emotions with rare honesty.",
        },
        {
          heading: 'The right film for a family night without arguments',
          body: 'Choosing a film that works for both little ones and grown-ups is usually where the evening derails. On Swipe Movie, create a room with the whole family, everyone swipes on an all-ages selection, and the match points to the film everyone agrees on — kids included — in minutes.',
        },
      ],
      es: [
        {
          heading: 'La película familiar: gustar a niños y a padres por igual',
          body: 'Una buena película familiar logra algo difícil: cautivar a los niños y mantener despiertos a los adultos. Las mejores lo consiguen con un doble nivel de lectura: las aventuras de E.T. o Paddington funcionan a los 6 y a los 40. El género abarca la comedia familiar (Solo en casa), el film de animación apto para todos, la aventura navideña y el relato iniciático. Al contrario del tópico, una película familiar no es una película edulcorada: El gigante de hierro o Del revés abordan emociones profundas con una sinceridad poco común.',
        },
        {
          heading: 'La película adecuada para una noche en familia sin peleas',
          body: 'Elegir una película que valga para pequeños y mayores es justo donde suele descarrilar la noche. En Swipe Movie crea una sala con toda la familia, cada uno desliza sobre una selección apta para todos y el match señala la película que une a todos —incluidos los niños— en pocos minutos.',
        },
      ],
      de: [
        {
          heading: 'Der Familienfilm: Kinder und Eltern gleichermaßen begeistern',
          body: 'Ein guter Familienfilm meistert eine schwierige Aufgabe: die Kinder zu fesseln und die Erwachsenen wach zu halten. Die besten schaffen das mit einer doppelten Ebene — die Abenteuer von E.T. oder Paddington funktionieren mit sechs wie mit vierzig. Das Genre umfasst die Familienkomödie (Kevin – Allein zu Haus), den Animationsfilm für alle, das Weihnachtsabenteuer und die Coming-of-Age-Geschichte. Anders als das Klischee ist ein Familienfilm kein verharmlosender Film: Der Gigant aus dem All oder Alles steht Kopf behandeln tiefe Emotionen mit seltener Ehrlichkeit.',
        },
        {
          heading: 'Der richtige Film für den Familienabend ohne Streit',
          body: 'Einen Film zu finden, der Klein und Groß passt, ist meist der Moment, in dem der Abend kippt. Auf Swipe Movie erstellst du einen Raum mit der ganzen Familie, jeder swipt durch eine Auswahl für alle Altersgruppen, und das Match zeigt in Minuten den Film, über den sich alle einig sind — Kinder inklusive.',
        },
      ],
      it: [
        {
          heading: 'Il film per famiglie: piacere a bambini e genitori insieme',
          body: "Un buon film per famiglie riesce in un'impresa difficile: catturare i bambini tenendo svegli gli adulti. I migliori ci riescono con un doppio livello di lettura: le avventure di E.T. o Paddington funzionano a 6 come a 40 anni. Il genere comprende la commedia familiare (Mamma, ho perso l'aereo), il film d'animazione per tutti, l'avventura natalizia e il racconto di formazione. Contrariamente al luogo comune, un film per famiglie non è un film edulcorato: Il gigante di ferro o Inside Out affrontano emozioni profonde con rara sincerità.",
        },
        {
          heading: 'Il film giusto per una serata in famiglia senza litigi',
          body: "Scegliere un film che vada bene per piccoli e grandi è spesso il punto in cui la serata deraglia. Su Swipe Movie crea una room con tutta la famiglia, ognuno swippa su una selezione per tutti e il match indica in pochi minuti il film che mette d'accordo tutti, bambini compresi.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films à regarder en famille ?',
          answer:
            "Des valeurs sûres : E.T., Paddington, Le Roi Lion, Vice-versa et Maman, j'ai raté l'avion. La sélection ci-dessus est triée par note et popularité via les données TMDB.",
        },
        {
          question: 'Comment trouver un film adapté à tous les âges ?',
          answer:
            "Crée une room famille sur Swipe Movie : chacun swipe sur une sélection tout public et vous matchez sur un film qui convient aux enfants comme aux parents.",
        },
        {
          question: 'Où regarder des films familiaux en streaming ?',
          answer:
            'Disney+ est la référence pour le familial, complété par Netflix et Prime Video selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best films to watch as a family?',
          answer:
            'Safe bets: E.T., Paddington, The Lion King, Inside Out and Home Alone. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'How do I find an all-ages film?',
          answer:
            'Create a family room on Swipe Movie: everyone swipes on an all-ages selection and you match on a film that suits kids and parents alike.',
        },
        {
          question: 'Where can I stream family movies?',
          answer:
            'Disney+ is the go-to for family content, with Netflix and Prime Video adding more depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas para ver en familia?',
          answer:
            'Apuestas seguras: E.T., Paddington, El Rey León, Del revés y Solo en casa. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Cómo encontrar una película apta para todas las edades?',
          answer:
            'Crea una sala familiar en Swipe Movie: cada uno desliza sobre una selección apta para todos y hacéis match en una película que vale para niños y padres.',
        },
        {
          question: '¿Dónde ver películas familiares en streaming?',
          answer:
            'Disney+ es la referencia para lo familiar, con Netflix y Prime Video sumando más según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Filme für die ganze Familie?',
          answer:
            'Sichere Tipps: E.T., Paddington, Der König der Löwen, Alles steht Kopf und Kevin – Allein zu Haus. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Wie finde ich einen Film für alle Altersgruppen?',
          answer:
            'Erstelle einen Familienraum auf Swipe Movie: Jeder swipt durch eine Auswahl für alle, und ihr matched auf einen Film, der Kindern wie Eltern passt.',
        },
        {
          question: 'Wo kann ich Familienfilme streamen?',
          answer:
            'Disney+ ist die erste Adresse für Familieninhalte, ergänzt durch Netflix und Prime Video je nach Region. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film da guardare in famiglia?',
          answer:
            "Scelte sicure: E.T., Paddington, Il Re Leone, Inside Out e Mamma, ho perso l'aereo. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.",
        },
        {
          question: 'Come trovare un film adatto a tutte le età?',
          answer:
            'Crea una room famiglia su Swipe Movie: ognuno swippa su una selezione per tutti e fate match su un film che va bene per bambini e genitori.',
        },
        {
          question: 'Dove guardare film per famiglie in streaming?',
          answer:
            'Disney+ è il riferimento per i contenuti familiari, con Netflix e Prime Video a completare a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Mondes imaginaires et magie : les piliers du fantastique',
          body: "Le fantastique invente des mondes régis par leurs propres règles : magie, créatures et destinées épiques. Le genre va de l'heroic-fantasy monumentale (Le Seigneur des anneaux, Harry Potter) au conte sombre de Guillermo del Toro (Le Labyrinthe de Pan), en passant par la fantasy urbaine et le récit de quête. À ne pas confondre avec la science-fiction : ici, l'inexpliqué relève du merveilleux et non de la technologie. Le fantastique séduit par sa capacité à créer des univers entiers où l'on rêverait de vivre, portés par une mythologie soignée et des images marquantes.",
        },
        {
          heading: 'Lancer une saga fantastique à plusieurs',
          body: "Le fantastique se prête merveilleusement aux longues soirées et aux marathons de saga. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de films fantastiques, et vous matchez sur l'univers qui fait rêver tout le groupe — idéal pour démarrer une trilogie ou redécouvrir un classique ensemble.",
        },
      ],
      en: [
        {
          heading: 'Imaginary worlds and magic: the pillars of fantasy',
          body: "Fantasy invents worlds ruled by their own laws: magic, creatures and epic destinies. The genre runs from monumental heroic fantasy (The Lord of the Rings, Harry Potter) to Guillermo del Toro's dark fairy tales (Pan's Labyrinth), through urban fantasy and the quest narrative. Not to be confused with science fiction: here the unexplained belongs to the marvellous, not to technology. Fantasy captivates through its ability to build whole universes you'd dream of living in, carried by careful mythology and unforgettable imagery.",
        },
        {
          heading: 'Starting a fantasy saga as a group',
          body: "Fantasy lends itself wonderfully to long evenings and saga marathons. On Swipe Movie, open a room, everyone swipes on a selection of fantasy films, and you match on the world that captures the whole group's imagination — perfect for kicking off a trilogy or rediscovering a classic together.",
        },
      ],
      es: [
        {
          heading: 'Mundos imaginarios y magia: los pilares de la fantasía',
          body: 'La fantasía inventa mundos regidos por sus propias reglas: magia, criaturas y destinos épicos. El género va de la heroic-fantasy monumental (El Señor de los Anillos, Harry Potter) al cuento oscuro de Guillermo del Toro (El laberinto del fauno), pasando por la fantasía urbana y el relato de búsqueda. No confundir con la ciencia ficción: aquí lo inexplicable pertenece a lo maravilloso, no a la tecnología. La fantasía seduce por su capacidad de crear universos enteros en los que soñarías vivir, sostenidos por una mitología cuidada e imágenes memorables.',
        },
        {
          heading: 'Empezar una saga de fantasía en grupo',
          body: 'La fantasía se presta de maravilla a las noches largas y a los maratones de saga. En Swipe Movie abre una sala, cada uno desliza sobre una selección de películas fantásticas y hacéis match en el universo que hace soñar a todo el grupo, ideal para arrancar una trilogía o redescubrir un clásico juntos.',
        },
      ],
      de: [
        {
          heading: 'Fantasiewelten und Magie: die Säulen der Fantasy',
          body: 'Fantasy erfindet Welten mit eigenen Gesetzen: Magie, Kreaturen und epische Schicksale. Das Genre reicht von monumentaler Heroic Fantasy (Der Herr der Ringe, Harry Potter) bis zu Guillermo del Toros düsteren Märchen (Pans Labyrinth), über Urban Fantasy und die Queste. Nicht mit Science-Fiction zu verwechseln: Hier gehört das Unerklärliche ins Wunderbare, nicht zur Technologie. Fantasy fesselt durch ihre Fähigkeit, ganze Universen zu erschaffen, in denen man leben möchte — getragen von sorgfältiger Mythologie und unvergesslichen Bildern.',
        },
        {
          heading: 'Eine Fantasy-Saga in der Gruppe starten',
          body: 'Fantasy eignet sich wunderbar für lange Abende und Saga-Marathons. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Fantasyfilmen, und ihr matched auf die Welt, die die ganze Gruppe verzaubert — ideal, um eine Trilogie zu beginnen oder einen Klassiker gemeinsam wiederzuentdecken.',
        },
      ],
      it: [
        {
          heading: 'Mondi immaginari e magia: i pilastri del fantasy',
          body: "Il fantasy inventa mondi governati da regole proprie: magia, creature e destini epici. Il genere va dalla heroic fantasy monumentale (Il Signore degli Anelli, Harry Potter) alla fiaba oscura di Guillermo del Toro (Il labirinto del fauno), passando per l'urban fantasy e il racconto di ricerca. Da non confondere con la fantascienza: qui l'inspiegabile appartiene al meraviglioso, non alla tecnologia. Il fantasy conquista per la capacità di creare universi interi in cui sogneresti di vivere, sostenuti da una mitologia curata e da immagini indimenticabili.",
        },
        {
          heading: 'Avviare una saga fantasy in gruppo',
          body: "Il fantasy si presta benissimo alle serate lunghe e alle maratone di saga. Su Swipe Movie apri una room, ognuno swippa su una selezione di film fantasy e fate match sull'universo che fa sognare tutto il gruppo, ideale per iniziare una trilogia o riscoprire un classico insieme.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films fantastiques à voir ?',
          answer:
            'Incontournables : Le Seigneur des anneaux, Harry Potter, Le Labyrinthe de Pan, Le Monde de Narnia et Stardust. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quelle est la différence entre fantastique et science-fiction ?',
          answer:
            "Le fantastique repose sur la magie et le merveilleux ; la science-fiction sur la technologie et la spéculation scientifique. Certains films mélangent les deux.",
        },
        {
          question: 'Où regarder des films fantastiques en streaming ?',
          answer:
            'Les grandes sagas sont réparties entre Max, Prime Video, Netflix et Disney+ selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best fantasy movies to watch?',
          answer:
            'Essentials: The Lord of the Rings, Harry Potter, Pan\'s Labyrinth, The Chronicles of Narnia and Stardust. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What is the difference between fantasy and science fiction?',
          answer:
            'Fantasy is built on magic and the marvellous; science fiction on technology and scientific speculation. Some films blend the two.',
        },
        {
          question: 'Where can I stream fantasy movies?',
          answer:
            'The big sagas are spread across Max, Prime Video, Netflix and Disney+ depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas fantásticas para ver?',
          answer:
            'Imprescindibles: El Señor de los Anillos, Harry Potter, El laberinto del fauno, Las crónicas de Narnia y Stardust. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Cuál es la diferencia entre fantasía y ciencia ficción?',
          answer:
            'La fantasía se basa en la magia y lo maravilloso; la ciencia ficción en la tecnología y la especulación científica. Algunas películas mezclan ambas.',
        },
        {
          question: '¿Dónde ver películas fantásticas en streaming?',
          answer:
            'Las grandes sagas se reparten entre Max, Prime Video, Netflix y Disney+ según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Fantasyfilme?',
          answer:
            'Pflichttitel: Der Herr der Ringe, Harry Potter, Pans Labyrinth, Die Chroniken von Narnia und Der Sternwanderer. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Was ist der Unterschied zwischen Fantasy und Science-Fiction?',
          answer:
            'Fantasy baut auf Magie und das Wunderbare; Science-Fiction auf Technologie und wissenschaftliche Spekulation. Manche Filme verbinden beides.',
        },
        {
          question: 'Wo kann ich Fantasyfilme streamen?',
          answer:
            'Die großen Sagas verteilen sich je nach Region auf Max, Prime Video, Netflix und Disney+. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film fantasy da vedere?',
          answer:
            'Imprescindibili: Il Signore degli Anelli, Harry Potter, Il labirinto del fauno, Le cronache di Narnia e Stardust. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Qual è la differenza tra fantasy e fantascienza?',
          answer:
            'Il fantasy si basa sulla magia e sul meraviglioso; la fantascienza sulla tecnologia e sulla speculazione scientifica. Alcuni film mescolano i due.',
        },
        {
          question: 'Dove guardare film fantasy in streaming?',
          answer:
            'Le grandi saghe sono distribuite tra Max, Prime Video, Netflix e Disney+ a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Revivre l’Histoire à l’écran',
          body: "Le film historique transporte le spectateur dans une autre époque avec un souci de reconstitution qui fait sa force : costumes, décors, batailles. Le genre couvre la grande fresque (Gladiator, Braveheart), le biopic de figures réelles (Lincoln, Oppenheimer), le film de guerre à valeur historique et le récit de cour. Les meilleurs ne se contentent pas d'illustrer un manuel : ils donnent chair à une période en suivant un destin individuel. C'est un genre exigeant et spectaculaire, souvent récompensé, qui éclaire le présent autant qu'il ressuscite le passé.",
        },
        {
          heading: 'Un film historique pour une soirée qui marque',
          body: "Le film historique se savoure à plusieurs, parce qu'il invite au débat sur ce qui s'est vraiment passé. Sur Swipe Movie, lance une room, chacun swipe sur une sélection de films historiques et biopics, et vous matchez sur l'époque ou le personnage qui intrigue tout le groupe — sans hésiter une heure devant le catalogue.",
        },
      ],
      en: [
        {
          heading: 'Reliving history on screen',
          body: "The historical film carries the viewer into another era, its strength lying in meticulous reconstruction: costumes, sets, battles. The genre covers the sweeping epic (Gladiator, Braveheart), the biopic of real figures (Lincoln, Oppenheimer), the historically grounded war film and the court drama. The best don't just illustrate a textbook: they give flesh to a period by following one individual destiny. It's a demanding, spectacular genre, often awarded, that illuminates the present as much as it resurrects the past.",
        },
        {
          heading: 'A historical film for a memorable night',
          body: "Historical films are best enjoyed with others, because they invite debate about what really happened. On Swipe Movie, start a room, everyone swipes on a selection of historical films and biopics, and you match on the era or figure that intrigues the whole group — without spending an hour staring at the catalog.",
        },
      ],
      es: [
        {
          heading: 'Revivir la Historia en la pantalla',
          body: 'La película histórica traslada al espectador a otra época con un cuidado por la reconstrucción que es su fuerza: vestuario, decorados, batallas. El género abarca la gran epopeya (Gladiator, Braveheart), el biopic de figuras reales (Lincoln, Oppenheimer), la película bélica de valor histórico y el drama de corte. Las mejores no se limitan a ilustrar un manual: dan cuerpo a una época siguiendo un destino individual. Es un género exigente y espectacular, a menudo premiado, que ilumina el presente tanto como resucita el pasado.',
        },
        {
          heading: 'Una película histórica para una noche que deja huella',
          body: 'La película histórica se disfruta en grupo, porque invita al debate sobre lo que realmente pasó. En Swipe Movie abre una sala, cada uno desliza sobre una selección de películas históricas y biopics y hacéis match en la época o el personaje que intriga a todo el grupo, sin dudar una hora ante el catálogo.',
        },
      ],
      de: [
        {
          heading: 'Geschichte auf der Leinwand neu erleben',
          body: 'Der Historienfilm versetzt den Zuschauer in eine andere Epoche, seine Stärke liegt in der sorgfältigen Rekonstruktion: Kostüme, Kulissen, Schlachten. Das Genre umfasst das große Epos (Gladiator, Braveheart), das Biopic realer Figuren (Lincoln, Oppenheimer), den historisch fundierten Kriegsfilm und das Hofdrama. Die besten illustrieren nicht nur ein Schulbuch: Sie geben einer Epoche Gestalt, indem sie einem einzelnen Schicksal folgen. Ein anspruchsvolles, spektakuläres und oft preisgekröntes Genre, das die Gegenwart ebenso erhellt, wie es die Vergangenheit auferstehen lässt.',
        },
        {
          heading: 'Ein Historienfilm für einen denkwürdigen Abend',
          body: 'Historienfilme genießt man am besten gemeinsam, weil sie zur Debatte über das tatsächlich Geschehene einladen. Auf Swipe Movie startest du einen Raum, jeder swipt durch eine Auswahl an Historienfilmen und Biopics, und ihr matched auf die Epoche oder Figur, die die ganze Gruppe fesselt — ohne eine Stunde vor dem Katalog zu zögern.',
        },
      ],
      it: [
        {
          heading: 'Rivivere la Storia sullo schermo',
          body: "Il film storico trasporta lo spettatore in un'altra epoca con una cura per la ricostruzione che ne è la forza: costumi, scenografie, battaglie. Il genere comprende la grande epopea (Il gladiatore, Braveheart), il biopic di figure reali (Lincoln, Oppenheimer), il film di guerra di valore storico e il dramma di corte. I migliori non si limitano a illustrare un manuale: danno carne a un'epoca seguendo un destino individuale. È un genere esigente e spettacolare, spesso premiato, che illumina il presente tanto quanto resuscita il passato.",
        },
        {
          heading: 'Un film storico per una serata memorabile',
          body: "Il film storico si gusta in gruppo, perché invita al dibattito su ciò che è davvero accaduto. Su Swipe Movie apri una room, ognuno swippa su una selezione di film storici e biopic e fate match sull'epoca o il personaggio che incuriosisce tutto il gruppo, senza esitare un'ora davanti al catalogo.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films historiques à voir ?',
          answer:
            'Souvent cités : Gladiator, Braveheart, La Liste de Schindler, Lincoln et Oppenheimer. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Un film historique est-il fidèle à la réalité ?',
          answer:
            "Les films historiques s'inspirent de faits réels mais prennent des libertés dramatiques. Ils restent une excellente porte d'entrée vers une époque.",
        },
        {
          question: 'Où regarder des films historiques en streaming ?',
          answer:
            'On en trouve sur Netflix, Prime Video et Max selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best historical movies to watch?',
          answer:
            'Often cited: Gladiator, Braveheart, Schindler\'s List, Lincoln and Oppenheimer. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'Are historical films accurate?',
          answer:
            'Historical films draw on real events but take dramatic liberties. They remain a great gateway into a period.',
        },
        {
          question: 'Where can I stream historical movies?',
          answer:
            'You\'ll find them on Netflix, Prime Video and Max depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas históricas para ver?',
          answer:
            'A menudo citadas: Gladiator, Braveheart, La lista de Schindler, Lincoln y Oppenheimer. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Una película histórica es fiel a la realidad?',
          answer:
            'Las películas históricas se inspiran en hechos reales pero se toman licencias dramáticas. Siguen siendo una gran puerta de entrada a una época.',
        },
        {
          question: '¿Dónde ver películas históricas en streaming?',
          answer:
            'Se encuentran en Netflix, Prime Video y Max según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Historienfilme?',
          answer:
            'Oft genannt: Gladiator, Braveheart, Schindlers Liste, Lincoln und Oppenheimer. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Sind Historienfilme historisch korrekt?',
          answer:
            'Historienfilme stützen sich auf reale Ereignisse, nehmen sich aber dramatische Freiheiten. Sie bleiben ein guter Einstieg in eine Epoche.',
        },
        {
          question: 'Wo kann ich Historienfilme streamen?',
          answer:
            'Du findest sie je nach Region auf Netflix, Prime Video und Max. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film storici da vedere?',
          answer:
            'Spesso citati: Il gladiatore, Braveheart, Schindler\'s List, Lincoln e Oppenheimer. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Un film storico è fedele alla realtà?',
          answer:
            "I film storici si ispirano a fatti reali ma si prendono libertà drammatiche. Restano un'ottima porta d'ingresso verso un'epoca.",
        },
        {
          question: 'Dove guardare film storici in streaming?',
          answer:
            'Si trovano su Netflix, Prime Video e Max a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Slashers, horreur psychologique et found footage',
          body: "L'horreur est un genre aux multiples visages. Il y a le slasher avec son tueur masqué (Halloween, Scream), l'horreur psychologique qui distille un malaise insidieux (Hérédité, The Witch), le film de maison hantée, le found footage (Paranormal Activity) et le body horror viscéral à la David Cronenberg. Sans oublier les classiques absolus comme The Thing de Carpenter ou Shining. Le genre connaît un âge d'or grâce à des studios comme A24 et Blumhouse, qui réinventent la peur avec des films aussi intelligents qu'effrayants. Bien choisir son film d'horreur, c'est jauger jusqu'où le groupe est prêt à frissonner.",
        },
        {
          heading: 'Choisir un film d’horreur que tout le monde ose regarder',
          body: "Rien de plus délicat que l'horreur en groupe : entre celui qui veut du gore et celui qui déteste sursauter, les seuils de tolérance varient. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de films d'horreur, et vous matchez sur le titre qui fait l'unanimité — assez effrayant pour la soirée, pas au point de gâcher l'ambiance.",
        },
      ],
      en: [
        {
          heading: 'Slashers, psychological horror and found footage',
          body: "Horror is a genre of many faces. There's the slasher with its masked killer (Halloween, Scream), psychological horror that builds insidious dread (Hereditary, The Witch), the haunted-house film, found footage (Paranormal Activity) and visceral body horror à la David Cronenberg. Not to mention absolute classics like Carpenter's The Thing or The Shining. The genre is enjoying a golden age thanks to studios like A24 and Blumhouse, which reinvent fear with films as smart as they are scary. Picking the right horror film means gauging how far the group is willing to be spooked.",
        },
        {
          heading: 'Choosing a horror film everyone dares to watch',
          body: "Nothing is trickier than horror in a group: between the one who wants gore and the one who hates jump scares, tolerance levels vary. On Swipe Movie, open a room, everyone swipes on a selection of horror films, and you match on the title that gets unanimous approval — scary enough for the night, not enough to ruin the mood.",
        },
      ],
      es: [
        {
          heading: 'Slashers, terror psicológico y found footage',
          body: 'El terror es un género de mil caras. Está el slasher con su asesino enmascarado (La noche de Halloween, Scream), el terror psicológico que destila un malestar insidioso (Hereditary, La bruja), el film de casa encantada, el found footage (Paranormal Activity) y el body horror visceral al estilo de David Cronenberg. Sin olvidar clásicos absolutos como La cosa de Carpenter o El resplandor. El género vive una edad de oro gracias a estudios como A24 y Blumhouse, que reinventan el miedo con películas tan inteligentes como aterradoras. Elegir bien la película de terror es calibrar hasta dónde está dispuesto a temblar el grupo.',
        },
        {
          heading: 'Elegir una película de terror que todos se atrevan a ver',
          body: 'Nada más delicado que el terror en grupo: entre quien quiere gore y quien odia los sustos, los umbrales de tolerancia varían. En Swipe Movie abre una sala, cada uno desliza sobre una selección de películas de terror y hacéis match en el título que une a todos: lo bastante terrorífico para la noche, sin llegar a arruinar el ambiente.',
        },
      ],
      de: [
        {
          heading: 'Slasher, psychologischer Horror und Found Footage',
          body: 'Horror ist ein Genre mit vielen Gesichtern. Da ist der Slasher mit seinem maskierten Killer (Halloween, Scream), der psychologische Horror, der schleichendes Unbehagen aufbaut (Hereditary, The Witch), der Haunted-House-Film, Found Footage (Paranormal Activity) und viszeraler Body Horror à la David Cronenberg. Ganz zu schweigen von absoluten Klassikern wie Carpenters Das Ding aus einer anderen Welt oder Shining. Das Genre erlebt dank Studios wie A24 und Blumhouse ein goldenes Zeitalter, die die Angst mit Filmen neu erfinden, die so klug wie erschreckend sind. Den richtigen Horrorfilm zu wählen heißt abzuschätzen, wie weit die Gruppe sich gruseln will.',
        },
        {
          heading: 'Einen Horrorfilm wählen, den sich alle trauen',
          body: 'Nichts ist heikler als Horror in der Gruppe: Zwischen dem, der Gore will, und dem, der Schreckmomente hasst, gehen die Toleranzgrenzen auseinander. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Horrorfilmen, und ihr matched auf den Titel, der einstimmig durchgeht — gruselig genug für den Abend, aber nicht so sehr, dass die Stimmung kippt.',
        },
      ],
      it: [
        {
          heading: 'Slasher, horror psicologico e found footage',
          body: "L'horror è un genere dai mille volti. C'è lo slasher con il suo killer mascherato (Halloween, Scream), l'horror psicologico che distilla un disagio insidioso (Hereditary, The Witch), il film di casa infestata, il found footage (Paranormal Activity) e il body horror viscerale alla David Cronenberg. Senza dimenticare i classici assoluti come La cosa di Carpenter o Shining. Il genere vive un'età dell'oro grazie a studi come A24 e Blumhouse, che reinventano la paura con film tanto intelligenti quanto spaventosi. Scegliere bene il film horror significa valutare fin dove il gruppo è disposto a tremare.",
        },
        {
          heading: 'Scegliere un horror che tutti abbiano il coraggio di guardare',
          body: "Niente di più delicato dell'horror in gruppo: tra chi vuole il gore e chi odia i salti sulla sedia, le soglie di tolleranza variano. Su Swipe Movie apri una room, ognuno swippa su una selezione di film horror e fate match sul titolo che mette tutti d'accordo: abbastanza spaventoso per la serata, senza rovinare l'atmosfera.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: "Quels sont les meilleurs films d'horreur de tous les temps ?",
          answer:
            "Souvent en tête : The Thing, Shining, Hérédité, Halloween et Get Out. La sélection ci-dessus est triée par note et popularité via les données TMDB.",
        },
        {
          question: "Quel film d'horreur regarder pour une soirée entre amis ?",
          answer:
            "Lance une room sur Swipe Movie : chacun swipe sur des films d'horreur et vous matchez sur celui qui met tout le monde d'accord, quel que soit votre seuil de frissons.",
        },
        {
          question: "Où regarder des films d'horreur en streaming ?",
          answer:
            'Netflix, Prime Video et Max proposent de larges catalogues d’horreur selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best horror movies of all time?',
          answer:
            'Often at the top: The Thing, The Shining, Hereditary, Halloween and Get Out. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What horror movie should we watch for a night with friends?',
          answer:
            'Start a room on Swipe Movie: everyone swipes on horror films and you match on the one everyone agrees on, whatever your scare threshold.',
        },
        {
          question: 'Where can I stream horror movies?',
          answer:
            'Netflix, Prime Video and Max offer large horror catalogs depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de terror de todos los tiempos?',
          answer:
            'A menudo en cabeza: La cosa, El resplandor, Hereditary, La noche de Halloween y Déjame salir. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué película de terror ver para una noche entre amigos?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza sobre películas de terror y hacéis match en la que une a todos, sea cual sea vuestro umbral de sustos.',
        },
        {
          question: '¿Dónde ver películas de terror en streaming?',
          answer:
            'Netflix, Prime Video y Max ofrecen amplios catálogos de terror según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Horrorfilme aller Zeiten?',
          answer:
            'Oft ganz oben: Das Ding aus einer anderen Welt, Shining, Hereditary, Halloween und Get Out. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welchen Horrorfilm für einen Abend mit Freunden schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt durch Horrorfilme und ihr matched auf den, über den sich alle einig sind — egal, wie viel Grusel ihr vertragt.',
        },
        {
          question: 'Wo kann ich Horrorfilme streamen?',
          answer:
            'Netflix, Prime Video und Max bieten je nach Region große Horror-Kataloge. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film horror di tutti i tempi?',
          answer:
            'Spesso in testa: La cosa, Shining, Hereditary, Halloween e Scappa - Get Out. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Quale film horror guardare per una serata tra amici?',
          answer:
            "Apri una room su Swipe Movie: ognuno swippa su film horror e fate match su quello che mette tutti d'accordo, qualunque sia la vostra soglia di paura.",
        },
        {
          question: 'Dove guardare film horror in streaming?',
          answer:
            'Netflix, Prime Video e Max offrono ampi cataloghi horror a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Comédies musicales, biopics et films-concerts',
          body: "Le film musical recouvre plusieurs réalités distinctes. Il y a la comédie musicale classique où les personnages chantent (La La Land, Chantons sous la pluie), le biopic de musicien qui retrace une légende (Bohemian Rhapsody sur Queen, Rocketman sur Elton John), le film-concert et le drame centré sur la musique (Whiplash, A Star Is Born). Le point commun : la musique n'est pas un décor, elle porte l'émotion et structure le récit. C'est un genre fédérateur, qui touche aussi bien les mélomanes que ceux qui aiment simplement se laisser emporter par une bande-son.",
        },
        {
          heading: 'Un film musical pour une soirée qui chante',
          body: "Le film musical est parfait pour une soirée conviviale : tout le monde connaît au moins une chanson. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de films musicaux et biopics, et vous matchez sur le titre qui donne envie de monter le son — comédie musicale entraînante ou biopic émouvant, selon l'humeur du groupe.",
        },
      ],
      en: [
        {
          heading: 'Musicals, biopics and concert films',
          body: "The music film covers several distinct things. There's the classic musical where characters sing (La La Land, Singin' in the Rain), the musician biopic that retraces a legend (Bohemian Rhapsody on Queen, Rocketman on Elton John), the concert film and the music-driven drama (Whiplash, A Star Is Born). The common thread: music isn't a backdrop, it carries the emotion and shapes the story. It's a unifying genre that speaks to music lovers and to anyone who simply likes being swept up by a soundtrack.",
        },
        {
          heading: 'A music film for a night that sings',
          body: "The music film is perfect for a sociable night: everyone knows at least one of the songs. On Swipe Movie, open a room, everyone swipes on a selection of music films and biopics, and you match on the title that makes you want to turn the volume up — an upbeat musical or a moving biopic, depending on the group's mood.",
        },
      ],
      es: [
        {
          heading: 'Musicales, biopics y películas-concierto',
          body: 'El cine musical abarca varias realidades distintas. Está el musical clásico en el que los personajes cantan (La La Land, Cantando bajo la lluvia), el biopic de músico que recorre una leyenda (Bohemian Rhapsody sobre Queen, Rocketman sobre Elton John), la película-concierto y el drama centrado en la música (Whiplash, Ha nacido una estrella). El hilo común: la música no es decorado, lleva la emoción y estructura el relato. Es un género que une, que toca tanto a los melómanos como a quien simplemente disfruta dejándose llevar por una banda sonora.',
        },
        {
          heading: 'Una película musical para una noche que canta',
          body: 'El cine musical es perfecto para una noche animada: todos conocen al menos una de las canciones. En Swipe Movie abre una sala, cada uno desliza sobre una selección de películas musicales y biopics y hacéis match en el título que da ganas de subir el volumen: musical pegadizo o biopic emotivo, según el ánimo del grupo.',
        },
      ],
      de: [
        {
          heading: 'Musicals, Biopics und Konzertfilme',
          body: 'Der Musikfilm umfasst mehrere ganz unterschiedliche Dinge. Da ist das klassische Musical, in dem die Figuren singen (La La Land, Singin\' in the Rain), das Musiker-Biopic, das eine Legende nachzeichnet (Bohemian Rhapsody über Queen, Rocketman über Elton John), der Konzertfilm und das musikgetriebene Drama (Whiplash, A Star Is Born). Der rote Faden: Musik ist keine Kulisse, sie trägt die Emotion und formt die Erzählung. Ein verbindendes Genre, das Musikliebhaber ebenso anspricht wie alle, die sich gern von einem Soundtrack mitreißen lassen.',
        },
        {
          heading: 'Ein Musikfilm für einen Abend, der singt',
          body: 'Der Musikfilm ist ideal für einen geselligen Abend: Jeder kennt mindestens einen der Songs. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Musikfilmen und Biopics, und ihr matched auf den Titel, bei dem man die Lautstärke aufdrehen will — mitreißendes Musical oder berührendes Biopic, je nach Stimmung der Gruppe.',
        },
      ],
      it: [
        {
          heading: 'Musical, biopic e film-concerto',
          body: "Il cinema musicale comprende realtà ben diverse. C'è il musical classico in cui i personaggi cantano (La La Land, Cantando sotto la pioggia), il biopic di musicista che ripercorre una leggenda (Bohemian Rhapsody su Queen, Rocketman su Elton John), il film-concerto e il dramma incentrato sulla musica (Whiplash, A Star Is Born). Il filo comune: la musica non è scenografia, porta l'emozione e struttura il racconto. È un genere che unisce, che tocca sia i melomani sia chi semplicemente ama lasciarsi trasportare da una colonna sonora.",
        },
        {
          heading: 'Un film musicale per una serata che canta',
          body: "Il film musicale è perfetto per una serata conviviale: tutti conoscono almeno una delle canzoni. Su Swipe Movie apri una room, ognuno swippa su una selezione di film musicali e biopic e fate match sul titolo che fa venire voglia di alzare il volume: musical trascinante o biopic commovente, a seconda dell'umore del gruppo.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films musicaux à voir ?',
          answer:
            'Souvent cités : La La Land, Bohemian Rhapsody, Whiplash, A Star Is Born et Rocketman. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quel film sur la musique regarder à plusieurs ?',
          answer:
            'Lance une room sur Swipe Movie : chacun swipe sur des films musicaux et biopics, et vous matchez sur celui qui plaît à tout le groupe en quelques minutes.',
        },
        {
          question: 'Où regarder des films musicaux en streaming ?',
          answer:
            'On en trouve sur Netflix, Prime Video et Disney+ selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best music movies to watch?',
          answer:
            'Often cited: La La Land, Bohemian Rhapsody, Whiplash, A Star Is Born and Rocketman. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What music film should we watch as a group?',
          answer:
            'Start a room on Swipe Movie: everyone swipes on music films and biopics, and you match in minutes on the one the whole group likes.',
        },
        {
          question: 'Where can I stream music movies?',
          answer:
            'You\'ll find them on Netflix, Prime Video and Disney+ depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas musicales para ver?',
          answer:
            'A menudo citadas: La La Land, Bohemian Rhapsody, Whiplash, Ha nacido una estrella y Rocketman. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué película sobre música ver en grupo?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza sobre películas musicales y biopics, y hacéis match en pocos minutos en la que gusta a todo el grupo.',
        },
        {
          question: '¿Dónde ver películas musicales en streaming?',
          answer:
            'Se encuentran en Netflix, Prime Video y Disney+ según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Musikfilme?',
          answer:
            'Oft genannt: La La Land, Bohemian Rhapsody, Whiplash, A Star Is Born und Rocketman. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welchen Musikfilm in der Gruppe schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt durch Musikfilme und Biopics, und ihr matched in Minuten auf den, der der ganzen Gruppe gefällt.',
        },
        {
          question: 'Wo kann ich Musikfilme streamen?',
          answer:
            'Du findest sie je nach Region auf Netflix, Prime Video und Disney+. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film musicali da vedere?',
          answer:
            'Spesso citati: La La Land, Bohemian Rhapsody, Whiplash, A Star Is Born e Rocketman. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Quale film sulla musica guardare in gruppo?',
          answer:
            'Apri una room su Swipe Movie: ognuno swippa su film musicali e biopic e fate match in pochi minuti su quello che piace a tutto il gruppo.',
        },
        {
          question: 'Dove guardare film musicali in streaming?',
          answer:
            'Si trovano su Netflix, Prime Video e Disney+ a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Le plaisir de l’enquête : whodunits et fausses pistes',
          body: "Le film à mystère repose sur une question lancinante : qui, comment, pourquoi ? Le whodunit à l'anglaise (À couteaux tirés, Le Crime de l'Orient-Express) invite le spectateur à mener l'enquête en même temps que le détective. À côté, il y a le mystère plus retors où la réalité elle-même vacille (Shutter Island, Memento), et le thriller à énigme dont la résolution renverse tout. La force du genre, c'est de transformer le spectateur en enquêteur : on accumule les indices, on suspecte tout le monde, et le plaisir tient autant à la révélation qu'au cheminement.",
        },
        {
          heading: 'Résoudre l’énigme du film à plusieurs',
          body: "Le film à mystère est encore meilleur en groupe : chacun avance sa théorie, et la révélation finale déclenche débats et fous rires. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de films à énigme, et vous matchez sur celui qui tiendra tout le monde en haleine jusqu'au twist final.",
        },
      ],
      en: [
        {
          heading: 'The thrill of the investigation: whodunits and red herrings',
          body: "The mystery film rests on one nagging question: who, how, why? The English-style whodunit (Knives Out, Murder on the Orient Express) invites the viewer to investigate alongside the detective. Alongside it sits the trickier mystery where reality itself wavers (Shutter Island, Memento), and the puzzle thriller whose resolution upends everything. The genre's strength is turning the viewer into an investigator: you gather clues, suspect everyone, and the pleasure lies as much in the reveal as in the journey there.",
        },
        {
          heading: 'Solving the mystery as a group',
          body: "Mystery films are even better in a group: everyone floats a theory, and the final reveal sparks debate and laughter. On Swipe Movie, open a room, everyone swipes on a selection of puzzle films, and you match on the one that will keep everyone hooked right up to the final twist.",
        },
      ],
      es: [
        {
          heading: 'El placer de la investigación: whodunits y pistas falsas',
          body: 'El cine de misterio se apoya en una pregunta machacona: ¿quién, cómo, por qué? El whodunit a la inglesa (Puñales por la espalda, Asesinato en el Orient Express) invita al espectador a investigar a la vez que el detective. Junto a él está el misterio más retorcido donde la propia realidad vacila (Shutter Island, Memento) y el thriller de enigma cuya resolución lo cambia todo. La fuerza del género es convertir al espectador en investigador: acumulas pistas, sospechas de todos, y el placer está tanto en la revelación como en el camino.',
        },
        {
          heading: 'Resolver el enigma en grupo',
          body: 'El cine de misterio es aún mejor en grupo: cada uno lanza su teoría y la revelación final desata debates y risas. En Swipe Movie abre una sala, cada uno desliza sobre una selección de películas de enigma y hacéis match en la que mantendrá a todos en vilo hasta el giro final.',
        },
      ],
      de: [
        {
          heading: 'Der Reiz der Ermittlung: Whodunits und falsche Fährten',
          body: 'Der Mystery-Film lebt von einer bohrenden Frage: wer, wie, warum? Der Whodunit englischer Schule (Knives Out, Mord im Orient-Express) lädt den Zuschauer ein, gemeinsam mit dem Detektiv zu ermitteln. Daneben steht das vertracktere Mysterium, in dem die Realität selbst ins Wanken gerät (Shutter Island, Memento), und der Rätselthriller, dessen Auflösung alles auf den Kopf stellt. Die Stärke des Genres: Es macht den Zuschauer zum Ermittler — man sammelt Indizien, verdächtigt jeden, und das Vergnügen liegt ebenso in der Auflösung wie im Weg dorthin.',
        },
        {
          heading: 'Das Rätsel in der Gruppe lösen',
          body: 'Mystery-Filme sind in der Gruppe noch besser: Jeder stellt eine Theorie auf, und die finale Auflösung löst Debatten und Lacher aus. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Rätselfilmen, und ihr matched auf den, der alle bis zum finalen Twist fesselt.',
        },
      ],
      it: [
        {
          heading: "Il piacere dell'indagine: whodunit e false piste",
          body: "Il film mystery si regge su una domanda assillante: chi, come, perché? Il whodunit all'inglese (Knives Out, Assassinio sull'Orient Express) invita lo spettatore a indagare insieme al detective. Accanto c'è il mistero più contorto in cui la realtà stessa vacilla (Shutter Island, Memento) e il thriller a enigma la cui soluzione ribalta tutto. La forza del genere è trasformare lo spettatore in investigatore: accumuli indizi, sospetti di tutti, e il piacere sta tanto nella rivelazione quanto nel percorso.",
        },
        {
          heading: "Risolvere l'enigma in gruppo",
          body: "Il film mystery è ancora migliore in gruppo: ognuno lancia la sua teoria e la rivelazione finale scatena dibattiti e risate. Su Swipe Movie apri una room, ognuno swippa su una selezione di film a enigma e fate match su quello che terrà tutti col fiato sospeso fino al colpo di scena finale.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films à mystère à voir ?',
          answer:
            "Souvent cités : Shutter Island, À couteaux tirés, Memento, Le Crime de l'Orient-Express et Seven. La sélection ci-dessus est triée par note et popularité via les données TMDB.",
        },
        {
          question: 'Quelle est la différence entre mystère et thriller ?',
          answer:
            "Le mystère met l'accent sur l'énigme à résoudre et les indices ; le thriller sur la tension et le danger. Beaucoup de films combinent les deux.",
        },
        {
          question: 'Où regarder des films à énigme en streaming ?',
          answer:
            'On en trouve sur Netflix, Prime Video et Max selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best mystery movies to watch?',
          answer:
            'Often cited: Shutter Island, Knives Out, Memento, Murder on the Orient Express and Se7en. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What is the difference between mystery and thriller?',
          answer:
            'Mystery emphasizes the puzzle to solve and the clues; the thriller emphasizes tension and danger. Many films combine both.',
        },
        {
          question: 'Where can I stream mystery movies?',
          answer:
            'You\'ll find them on Netflix, Prime Video and Max depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de misterio para ver?',
          answer:
            'A menudo citadas: Shutter Island, Puñales por la espalda, Memento, Asesinato en el Orient Express y Seven. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Cuál es la diferencia entre misterio y thriller?',
          answer:
            'El misterio pone el acento en el enigma a resolver y las pistas; el thriller en la tensión y el peligro. Muchas películas combinan ambos.',
        },
        {
          question: '¿Dónde ver películas de enigma en streaming?',
          answer:
            'Se encuentran en Netflix, Prime Video y Max según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Mystery-Filme?',
          answer:
            'Oft genannt: Shutter Island, Knives Out, Memento, Mord im Orient-Express und Sieben. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Was ist der Unterschied zwischen Mystery und Thriller?',
          answer:
            'Mystery betont das zu lösende Rätsel und die Indizien; der Thriller die Spannung und die Gefahr. Viele Filme verbinden beides.',
        },
        {
          question: 'Wo kann ich Mystery-Filme streamen?',
          answer:
            'Du findest sie je nach Region auf Netflix, Prime Video und Max. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film mystery da vedere?',
          answer:
            'Spesso citati: Shutter Island, Knives Out, Memento, Assassinio sull\'Orient Express e Seven. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Qual è la differenza tra mystery e thriller?',
          answer:
            "Il mystery mette l'accento sull'enigma da risolvere e sugli indizi; il thriller sulla tensione e sul pericolo. Molti film combinano entrambi.",
        },
        {
          question: 'Dove guardare film a enigma in streaming?',
          answer:
            'Si trovano su Netflix, Prime Video e Max a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'De la comédie romantique au grand mélo',
          body: "La romance se décline en mille nuances. La comédie romantique légère (Coup de foudre à Notting Hill, Love Actually) fait sourire et réchauffe ; le grand drame d'amour (Titanic, Orgueil et Préjugés) bouleverse ; et la romance contemporaine plus mélancolique (Eternal Sunshine of the Spotless Mind, La La Land) interroge ce qu'on est prêt à sacrifier pour aimer. Le genre traverse toutes les époques parce qu'il parle d'un sentiment universel. Bien choisie, une romance peut être le film parfait pour une soirée à deux comme pour un moment de réconfort entre amis.",
        },
        {
          heading: 'La romance idéale pour une soirée à deux ou entre amis',
          body: "Le bon film romantique dépend de l'occasion : soirée en amoureux, réconfort entre amis, ou simple envie de légèreté. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de films romantiques, et vous matchez sur le ton qui correspond — comédie pétillante ou mélo qui fait fondre, sans imposer son choix à l'autre.",
        },
      ],
      en: [
        {
          heading: 'From rom-com to grand melodrama',
          body: "Romance comes in a thousand shades. The light rom-com (Notting Hill, Love Actually) makes you smile and warms the heart; the sweeping love drama (Titanic, Pride & Prejudice) moves you to tears; and the more melancholy contemporary romance (Eternal Sunshine of the Spotless Mind, La La Land) asks what we're willing to sacrifice for love. The genre spans every era because it speaks to a universal feeling. Chosen well, a romance can be the perfect film for a couple's night or a comforting moment with friends.",
        },
        {
          heading: 'The right romance for a date night or with friends',
          body: "The right romantic film depends on the occasion: a date night, comfort with friends, or just a craving for something light. On Swipe Movie, open a room, everyone swipes on a selection of romance films, and you match on the tone that fits — sparkling comedy or heart-melting melodrama, without forcing your pick on the other.",
        },
      ],
      es: [
        {
          heading: 'De la comedia romántica al gran melodrama',
          body: 'La romance se declina en mil matices. La comedia romántica ligera (Notting Hill, Love Actually) hace sonreír y calienta el corazón; el gran drama de amor (Titanic, Orgullo y prejuicio) emociona hasta las lágrimas; y la romance contemporánea más melancólica (¡Olvídate de mí!, La La Land) cuestiona lo que estamos dispuestos a sacrificar por amar. El género atraviesa todas las épocas porque habla de un sentimiento universal. Bien elegida, una romance puede ser la película perfecta para una noche en pareja o un momento de consuelo entre amigos.',
        },
        {
          heading: 'La romance ideal para una noche en pareja o entre amigos',
          body: 'La película romántica adecuada depende de la ocasión: noche en pareja, consuelo entre amigos o simples ganas de ligereza. En Swipe Movie abre una sala, cada uno desliza sobre una selección de películas románticas y hacéis match en el tono que encaja: comedia chispeante o melodrama que derrite, sin imponer tu elección al otro.',
        },
      ],
      de: [
        {
          heading: 'Von der Romcom zum großen Melodram',
          body: 'Romantik gibt es in tausend Schattierungen. Die leichte Romcom (Notting Hill, Tatsächlich… Liebe) bringt zum Lächeln und wärmt das Herz; das große Liebesdrama (Titanic, Stolz und Vorurteil) rührt zu Tränen; und die melancholischere zeitgenössische Romanze (Vergiss mein nicht!, La La Land) fragt, was wir für die Liebe zu opfern bereit sind. Das Genre überspannt alle Epochen, weil es ein universelles Gefühl berührt. Gut gewählt, ist eine Romanze der perfekte Film für einen Date-Abend oder einen tröstlichen Moment mit Freunden.',
        },
        {
          heading: 'Die richtige Romanze für den Date-Abend oder mit Freunden',
          body: 'Der richtige Liebesfilm hängt vom Anlass ab: Date-Abend, Trost mit Freunden oder einfach Lust auf Leichtes. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Liebesfilmen, und ihr matched auf den passenden Ton — spritzige Komödie oder herzerweichendes Melodram, ohne dem anderen die Wahl aufzuzwingen.',
        },
      ],
      it: [
        {
          heading: 'Dalla commedia romantica al grande melodramma',
          body: "Il romance si declina in mille sfumature. La commedia romantica leggera (Notting Hill, Love Actually) fa sorridere e scalda il cuore; il grande dramma d'amore (Titanic, Orgoglio e pregiudizio) commuove fino alle lacrime; e il romance contemporaneo più malinconico (Se mi lasci ti cancello, La La Land) interroga ciò che siamo disposti a sacrificare per amare. Il genere attraversa tutte le epoche perché parla di un sentimento universale. Ben scelto, un romance può essere il film perfetto per una serata in coppia o per un momento di conforto tra amici.",
        },
        {
          heading: 'Il romance ideale per una serata in coppia o tra amici',
          body: "Il film romantico giusto dipende dall'occasione: serata in coppia, conforto tra amici o semplice voglia di leggerezza. Su Swipe Movie apri una room, ognuno swippa su una selezione di film romantici e fate match sul tono che si adatta: commedia frizzante o melodramma che scioglie, senza imporre la propria scelta all'altro.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films romantiques à voir ?',
          answer:
            "Souvent cités : Titanic, Coup de foudre à Notting Hill, La La Land, Eternal Sunshine of the Spotless Mind et Love Actually. La sélection ci-dessus est triée par note et popularité via les données TMDB.",
        },
        {
          question: 'Quel film romantique regarder pour une soirée en couple ?',
          answer:
            'Lance une room sur Swipe Movie : chacun swipe sur des films romantiques et vous matchez sur celui qui vous met d’accord, comédie légère ou grand mélo.',
        },
        {
          question: 'Où regarder des films romantiques en streaming ?',
          answer:
            'On en trouve sur Netflix, Prime Video et Disney+ selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best romance movies to watch?',
          answer:
            'Often cited: Titanic, Notting Hill, La La Land, Eternal Sunshine of the Spotless Mind and Love Actually. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What romantic film should we watch for a date night?',
          answer:
            'Start a room on Swipe Movie: everyone swipes on romance films and you match on the one you both agree on, light comedy or grand melodrama.',
        },
        {
          question: 'Where can I stream romance movies?',
          answer:
            'You\'ll find them on Netflix, Prime Video and Disney+ depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas románticas para ver?',
          answer:
            'A menudo citadas: Titanic, Notting Hill, La La Land, ¡Olvídate de mí! y Love Actually. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué película romántica ver para una noche en pareja?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza sobre películas románticas y hacéis match en la que os une, comedia ligera o gran melodrama.',
        },
        {
          question: '¿Dónde ver películas románticas en streaming?',
          answer:
            'Se encuentran en Netflix, Prime Video y Disney+ según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Liebesfilme?',
          answer:
            'Oft genannt: Titanic, Notting Hill, La La Land, Vergiss mein nicht! und Tatsächlich… Liebe. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welchen Liebesfilm für einen Date-Abend schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt durch Liebesfilme, und ihr matched auf den, über den ihr euch einig seid — leichte Komödie oder großes Melodram.',
        },
        {
          question: 'Wo kann ich Liebesfilme streamen?',
          answer:
            'Du findest sie je nach Region auf Netflix, Prime Video und Disney+. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film romantici da vedere?',
          answer:
            'Spesso citati: Titanic, Notting Hill, La La Land, Se mi lasci ti cancello e Love Actually. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Quale film romantico guardare per una serata in coppia?',
          answer:
            "Apri una room su Swipe Movie: ognuno swippa su film romantici e fate match su quello che vi mette d'accordo, commedia leggera o grande melodramma.",
        },
        {
          question: 'Dove guardare film romantici in streaming?',
          answer:
            'Si trovano su Netflix, Prime Video e Disney+ a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Hard SF, space opera et dystopie',
          body: "La science-fiction est sans doute le genre le plus stimulant intellectuellement. On distingue la hard SF, exigeante et scientifiquement rigoureuse (Interstellar, Arrival, Blade Runner), du space opera spectaculaire centré sur l'aventure galactique (Star Wars, Dune), et de la dystopie qui interroge nos sociétés (Matrix, Children of Men). À cela s'ajoutent le film de voyage temporel et la SF cérébrale qui joue avec le réel (Inception, Ex Machina). Ce qui distingue une grande SF, c'est l'idée : elle prend une hypothèse — et si l'IA devenait consciente ? et si le temps n'était pas linéaire ? — et la pousse jusqu'au vertige.",
        },
        {
          heading: 'Choisir un film de SF qui plaît à tout le groupe',
          body: "La SF divise vite : certains veulent du divertissement galactique, d'autres un film contemplatif qui fait réfléchir. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de films de science-fiction, et vous matchez sur le titre qui équilibre spectacle et idées — de quoi nourrir le débat bien après le générique.",
        },
      ],
      en: [
        {
          heading: 'Hard SF, space opera and dystopia',
          body: "Science fiction is arguably the most intellectually stimulating genre. We distinguish hard SF — demanding and scientifically rigorous (Interstellar, Arrival, Blade Runner) — from the spectacular space opera built around galactic adventure (Star Wars, Dune), and from the dystopia that questions our societies (The Matrix, Children of Men). Add to that the time-travel film and the cerebral SF that plays with reality (Inception, Ex Machina). What sets a great sci-fi film apart is the idea: it takes a premise — what if AI became conscious? what if time weren't linear? — and pushes it to the point of vertigo.",
        },
        {
          heading: 'Choosing a sci-fi film that pleases the whole group',
          body: "Sci-fi splits people fast: some want galactic spectacle, others a contemplative, thought-provoking film. On Swipe Movie, open a room, everyone swipes on a selection of science-fiction films, and you match on the title that balances spectacle and ideas — enough to fuel debate long after the credits.",
        },
      ],
      es: [
        {
          heading: 'Hard SF, space opera y distopía',
          body: 'La ciencia ficción es seguramente el género más estimulante intelectualmente. Se distingue la hard SF, exigente y científicamente rigurosa (Interstellar, La llegada, Blade Runner), del space opera espectacular centrado en la aventura galáctica (Star Wars, Dune), y de la distopía que cuestiona nuestras sociedades (Matrix, Hijos de los hombres). A ello se suman el cine de viajes en el tiempo y la SF cerebral que juega con lo real (Origen, Ex Machina). Lo que distingue a una gran SF es la idea: toma una hipótesis —¿y si la IA tuviera conciencia? ¿y si el tiempo no fuera lineal?— y la lleva hasta el vértigo.',
        },
        {
          heading: 'Elegir una película de SF que guste a todo el grupo',
          body: 'La SF divide rápido: unos quieren espectáculo galáctico, otros una película contemplativa que haga pensar. En Swipe Movie abre una sala, cada uno desliza sobre una selección de películas de ciencia ficción y hacéis match en el título que equilibra espectáculo e ideas, suficiente para alimentar el debate mucho después de los créditos.',
        },
      ],
      de: [
        {
          heading: 'Hard SF, Space Opera und Dystopie',
          body: 'Science-Fiction ist wohl das intellektuell anregendste Genre. Man unterscheidet die Hard SF — anspruchsvoll und wissenschaftlich präzise (Interstellar, Arrival, Blade Runner) — von der spektakulären Space Opera rund um das galaktische Abenteuer (Star Wars, Dune) und von der Dystopie, die unsere Gesellschaften hinterfragt (Matrix, Children of Men). Dazu kommen der Zeitreisefilm und die zerebrale SF, die mit der Realität spielt (Inception, Ex Machina). Eine große SF zeichnet die Idee aus: Sie nimmt eine Hypothese — was, wenn KI Bewusstsein erlangt? was, wenn die Zeit nicht linear ist? — und treibt sie bis zum Schwindel.',
        },
        {
          heading: 'Einen SF-Film wählen, der der ganzen Gruppe gefällt',
          body: 'SF spaltet schnell: Die einen wollen galaktisches Spektakel, die anderen einen kontemplativen, nachdenklichen Film. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Science-Fiction-Filmen, und ihr matched auf den Titel, der Spektakel und Ideen ausbalanciert — genug Stoff für Debatten noch lange nach dem Abspann.',
        },
      ],
      it: [
        {
          heading: 'Hard SF, space opera e distopia',
          body: "La fantascienza è probabilmente il genere più stimolante sul piano intellettuale. Si distingue la hard SF, esigente e scientificamente rigorosa (Interstellar, Arrival, Blade Runner), dalla space opera spettacolare incentrata sull'avventura galattica (Star Wars, Dune), e dalla distopia che interroga le nostre società (Matrix, I figli degli uomini). A ciò si aggiungono il film di viaggi nel tempo e la SF cerebrale che gioca con il reale (Inception, Ex Machina). Ciò che distingue una grande SF è l'idea: prende un'ipotesi — e se l'IA diventasse cosciente? e se il tempo non fosse lineare? — e la spinge fino alla vertigine.",
        },
        {
          heading: 'Scegliere un film di SF che piaccia a tutto il gruppo',
          body: "La SF divide in fretta: c'è chi vuole spettacolo galattico e chi un film contemplativo che fa pensare. Su Swipe Movie apri una room, ognuno swippa su una selezione di film di fantascienza e fate match sul titolo che bilancia spettacolo e idee, abbastanza da alimentare il dibattito ben oltre i titoli di coda.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films de science-fiction de tous les temps ?',
          answer:
            'Très souvent cités : Blade Runner, Interstellar, Matrix, Arrival et 2001 : l’Odyssée de l’espace. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quelle est la différence entre science-fiction et fantastique ?',
          answer:
            "La science-fiction s'appuie sur la technologie et la spéculation scientifique ; le fantastique sur la magie et le merveilleux. Certains films mélangent les deux.",
        },
        {
          question: 'Où regarder des films de science-fiction en streaming ?',
          answer:
            'Les grands titres sont répartis entre Netflix, Prime Video, Max et Disney+ selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best science fiction movies of all time?',
          answer:
            'Very often cited: Blade Runner, Interstellar, The Matrix, Arrival and 2001: A Space Odyssey. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What is the difference between science fiction and fantasy?',
          answer:
            'Science fiction is built on technology and scientific speculation; fantasy on magic and the marvellous. Some films blend the two.',
        },
        {
          question: 'Where can I stream science fiction movies?',
          answer:
            'The big titles are spread across Netflix, Prime Video, Max and Disney+ depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas de ciencia ficción de todos los tiempos?',
          answer:
            'Muy citadas: Blade Runner, Interstellar, Matrix, La llegada y 2001: Una odisea del espacio. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Cuál es la diferencia entre ciencia ficción y fantasía?',
          answer:
            'La ciencia ficción se basa en la tecnología y la especulación científica; la fantasía en la magia y lo maravilloso. Algunas películas mezclan ambas.',
        },
        {
          question: '¿Dónde ver películas de ciencia ficción en streaming?',
          answer:
            'Los grandes títulos se reparten entre Netflix, Prime Video, Max y Disney+ según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Science-Fiction-Filme aller Zeiten?',
          answer:
            'Sehr oft genannt: Blade Runner, Interstellar, Matrix, Arrival und 2001: Odyssee im Weltraum. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Was ist der Unterschied zwischen Science-Fiction und Fantasy?',
          answer:
            'Science-Fiction baut auf Technologie und wissenschaftliche Spekulation; Fantasy auf Magie und das Wunderbare. Manche Filme verbinden beides.',
        },
        {
          question: 'Wo kann ich Science-Fiction-Filme streamen?',
          answer:
            'Die großen Titel verteilen sich je nach Region auf Netflix, Prime Video, Max und Disney+. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film di fantascienza di tutti i tempi?',
          answer:
            'Spesso citati: Blade Runner, Interstellar, Matrix, Arrival e 2001: Odissea nello spazio. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Qual è la differenza tra fantascienza e fantasy?',
          answer:
            'La fantascienza si basa sulla tecnologia e sulla speculazione scientifica; il fantasy sulla magia e sul meraviglioso. Alcuni film mescolano i due.',
        },
        {
          question: 'Dove guardare film di fantascienza in streaming?',
          answer:
            'I grandi titoli sono distribuiti tra Netflix, Prime Video, Max e Disney+ a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'L’art de la tension : du thriller psychologique à l’espionnage',
          body: "Le thriller est avant tout une affaire de rythme et de tension : il maintient le spectateur en alerte permanente. Le genre se décline en thriller psychologique qui joue avec les nerfs (Le Silence des agneaux, Gone Girl), thriller d'espionnage (la saga Jason Bourne), techno-thriller et thriller de complot. Maître absolu du genre, Hitchcock définissait le suspense comme le fait de montrer la bombe sous la table : le spectateur sait, attend, et ronge son frein. Un bon thriller, c'est celui où l'on retient son souffle sans s'en rendre compte, jusqu'au twist qui rebat les cartes.",
        },
        {
          heading: 'Le thriller qui tient le groupe en haleine',
          body: "Le thriller est idéal en groupe : la tension partagée décuple l'expérience, et personne ne décroche. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de thrillers, et vous matchez sur celui qui promet de vous scotcher au canapé du début à la fin, sans débat préliminaire qui casse le suspense.",
        },
      ],
      en: [
        {
          heading: 'The art of tension: from psychological thriller to spy game',
          body: "The thriller is above all about pace and tension: it keeps the viewer on permanent alert. The genre breaks down into the psychological thriller that plays with your nerves (The Silence of the Lambs, Gone Girl), the spy thriller (the Jason Bourne saga), the techno-thriller and the conspiracy thriller. The master of the form, Hitchcock, defined suspense as showing the bomb under the table: the viewer knows, waits, and squirms. A good thriller is one where you hold your breath without realizing it, right up to the twist that reshuffles the deck.",
        },
        {
          heading: 'The thriller that keeps the group on edge',
          body: "Thrillers are ideal for a group: shared tension multiplies the experience, and nobody zones out. On Swipe Movie, open a room, everyone swipes on a selection of thrillers, and you match on the one that promises to glue you to the couch from start to finish — no preliminary debate to break the suspense.",
        },
      ],
      es: [
        {
          heading: 'El arte de la tensión: del thriller psicológico al espionaje',
          body: 'El thriller es ante todo cuestión de ritmo y tensión: mantiene al espectador en alerta permanente. El género se declina en thriller psicológico que juega con los nervios (El silencio de los corderos, Perdida), thriller de espionaje (la saga Jason Bourne), tecno-thriller y thriller de conspiración. Maestro absoluto del género, Hitchcock definía el suspense como mostrar la bomba bajo la mesa: el espectador sabe, espera y se impacienta. Un buen thriller es aquel en el que contienes la respiración sin darte cuenta, hasta el giro que reparte de nuevo las cartas.',
        },
        {
          heading: 'El thriller que mantiene al grupo en vilo',
          body: 'El thriller es ideal en grupo: la tensión compartida multiplica la experiencia y nadie se descuelga. En Swipe Movie abre una sala, cada uno desliza sobre una selección de thrillers y hacéis match en el que promete pegaros al sofá de principio a fin, sin debate previo que rompa el suspense.',
        },
      ],
      de: [
        {
          heading: 'Die Kunst der Spannung: vom Psychothriller zum Agentenspiel',
          body: 'Der Thriller ist vor allem eine Frage von Tempo und Spannung: Er hält den Zuschauer in ständiger Alarmbereitschaft. Das Genre gliedert sich in den Psychothriller, der mit den Nerven spielt (Das Schweigen der Lämmer, Gone Girl), den Spionagethriller (die Jason-Bourne-Reihe), den Techno-Thriller und den Verschwörungsthriller. Der Großmeister des Fachs, Hitchcock, definierte Suspense so: Man zeigt die Bombe unter dem Tisch — der Zuschauer weiß es, wartet und windet sich. Ein guter Thriller ist einer, bei dem man den Atem anhält, ohne es zu merken, bis zum Twist, der die Karten neu mischt.',
        },
        {
          heading: 'Der Thriller, der die Gruppe in Atem hält',
          body: 'Thriller sind ideal für die Gruppe: Die geteilte Spannung vervielfacht das Erlebnis, und niemand klinkt sich aus. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Thrillern, und ihr matched auf den, der euch von Anfang bis Ende auf die Couch fesselt — ohne vorherige Debatte, die die Spannung bricht.',
        },
      ],
      it: [
        {
          heading: "L'arte della tensione: dal thriller psicologico allo spionaggio",
          body: "Il thriller è prima di tutto una questione di ritmo e tensione: tiene lo spettatore in allerta permanente. Il genere si declina in thriller psicologico che gioca con i nervi (Il silenzio degli innocenti, L'amore bugiardo), thriller di spionaggio (la saga di Jason Bourne), techno-thriller e thriller di cospirazione. Maestro assoluto del genere, Hitchcock definiva la suspense come mostrare la bomba sotto il tavolo: lo spettatore sa, aspetta e si rode. Un buon thriller è quello in cui trattieni il respiro senza accorgertene, fino al colpo di scena che rimescola le carte.",
        },
        {
          heading: 'Il thriller che tiene il gruppo col fiato sospeso',
          body: "Il thriller è ideale in gruppo: la tensione condivisa moltiplica l'esperienza e nessuno si distrae. Su Swipe Movie apri una room, ognuno swippa su una selezione di thriller e fate match su quello che promette di incollarvi al divano dall'inizio alla fine, senza dibattito preliminare che rovini la suspense.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs thrillers à voir ?',
          answer:
            'Souvent cités : Le Silence des agneaux, Seven, Gone Girl, Prisoners et Les Infiltrés. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quel thriller regarder ce soir à plusieurs ?',
          answer:
            'Lance une room sur Swipe Movie : chacun swipe sur des thrillers et vous matchez sur celui qui tiendra tout le groupe en haleine en quelques minutes.',
        },
        {
          question: 'Où regarder des thrillers en streaming ?',
          answer:
            'Les thrillers sont nombreux sur Netflix, Prime Video et Max selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best thrillers to watch?',
          answer:
            'Often cited: The Silence of the Lambs, Se7en, Gone Girl, Prisoners and The Departed. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What thriller should we watch tonight as a group?',
          answer:
            'Start a room on Swipe Movie: everyone swipes on thrillers and you match in minutes on the one that will keep the whole group on edge.',
        },
        {
          question: 'Where can I stream thrillers?',
          answer:
            'Thrillers are plentiful on Netflix, Prime Video and Max depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son los mejores thrillers para ver?',
          answer:
            'A menudo citados: El silencio de los corderos, Seven, Perdida, Prisioneros e Infiltrados. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué thriller ver esta noche en grupo?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza sobre thrillers y hacéis match en pocos minutos en el que mantendrá a todo el grupo en vilo.',
        },
        {
          question: '¿Dónde ver thrillers en streaming?',
          answer:
            'Hay muchos thrillers en Netflix, Prime Video y Max según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Thriller?',
          answer:
            'Oft genannt: Das Schweigen der Lämmer, Sieben, Gone Girl, Prisoners und Departed. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welchen Thriller heute Abend in der Gruppe schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt durch Thriller, und ihr matched in Minuten auf den, der die ganze Gruppe in Atem hält.',
        },
        {
          question: 'Wo kann ich Thriller streamen?',
          answer:
            'Thriller gibt es reichlich auf Netflix, Prime Video und Max je nach Region. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori thriller da vedere?',
          answer:
            "Spesso citati: Il silenzio degli innocenti, Seven, L'amore bugiardo, Prisoners e The Departed. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.",
        },
        {
          question: 'Quale thriller guardare stasera in gruppo?',
          answer:
            'Apri una room su Swipe Movie: ognuno swippa su thriller e fate match in pochi minuti su quello che terrà tutto il gruppo col fiato sospeso.',
        },
        {
          question: 'Dove guardare thriller in streaming?',
          answer:
            'I thriller abbondano su Netflix, Prime Video e Max a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Du débarquement aux conflits modernes',
          body: "Le film de guerre confronte le spectateur à l'expérience la plus extrême : le combat, la peur, le sacrifice. Le genre couvre le récit de la Seconde Guerre mondiale (Il faut sauver le soldat Ryan, Dunkerque), le film du Vietnam et son traumatisme (Apocalypse Now, Full Metal Jacket), et les conflits contemporains. Les meilleurs ne glorifient pas la guerre : ils en montrent l'absurdité et le coût humain, souvent avec une immersion technique saisissante — la séquence d'ouverture d'Il faut sauver le soldat Ryan a redéfini le réalisme du genre. C'est un cinéma puissant, qui mêle spectacle et réflexion sur la condition humaine.",
        },
        {
          heading: 'Un film de guerre à partager et à discuter',
          body: "Le film de guerre marque les esprits et appelle l'échange après la projection. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de films de guerre, et vous matchez sur le récit qui interpelle tout le groupe — fresque historique immersive ou drame intime au cœur du conflit.",
        },
      ],
      en: [
        {
          heading: 'From the landings to modern conflicts',
          body: "The war film confronts the viewer with the most extreme experience: combat, fear, sacrifice. The genre covers the World War II story (Saving Private Ryan, Dunkirk), the Vietnam film and its trauma (Apocalypse Now, Full Metal Jacket), and contemporary conflicts. The best don't glorify war: they show its absurdity and human cost, often with gripping technical immersion — the opening sequence of Saving Private Ryan redefined the genre's realism. It's powerful cinema that blends spectacle with reflection on the human condition.",
        },
        {
          heading: 'A war film to share and discuss',
          body: 'The war film leaves a mark and invites conversation after the screening. On Swipe Movie, open a room, everyone swipes on a selection of war films, and you match on the story that resonates with the whole group — an immersive historical epic or an intimate drama at the heart of the conflict.',
        },
      ],
      es: [
        {
          heading: 'Del desembarco a los conflictos modernos',
          body: 'La película bélica confronta al espectador con la experiencia más extrema: el combate, el miedo, el sacrificio. El género abarca el relato de la Segunda Guerra Mundial (Salvar al soldado Ryan, Dunkerque), el film de Vietnam y su trauma (Apocalypse Now, La chaqueta metálica) y los conflictos contemporáneos. Las mejores no glorifican la guerra: muestran su absurdo y su coste humano, a menudo con una inmersión técnica sobrecogedora; la secuencia inicial de Salvar al soldado Ryan redefinió el realismo del género. Es un cine poderoso que mezcla espectáculo y reflexión sobre la condición humana.',
        },
        {
          heading: 'Una película bélica para compartir y debatir',
          body: 'La película bélica deja huella e invita a la conversación tras la proyección. En Swipe Movie abre una sala, cada uno desliza sobre una selección de películas bélicas y hacéis match en el relato que interpela a todo el grupo: epopeya histórica inmersiva o drama íntimo en el corazón del conflicto.',
        },
      ],
      de: [
        {
          heading: 'Von der Landung bis zu modernen Konflikten',
          body: 'Der Kriegsfilm konfrontiert den Zuschauer mit der extremsten Erfahrung: Kampf, Angst, Opfer. Das Genre umfasst die Geschichte des Zweiten Weltkriegs (Der Soldat James Ryan, Dunkirk), den Vietnamfilm und sein Trauma (Apocalypse Now, Full Metal Jacket) sowie zeitgenössische Konflikte. Die besten verherrlichen den Krieg nicht: Sie zeigen seine Absurdität und seinen menschlichen Preis, oft mit packender technischer Immersion — die Eröffnungssequenz von Der Soldat James Ryan definierte den Realismus des Genres neu. Ein kraftvolles Kino, das Spektakel mit der Reflexion über die menschliche Existenz verbindet.',
        },
        {
          heading: 'Ein Kriegsfilm zum Teilen und Diskutieren',
          body: 'Der Kriegsfilm hinterlässt Eindruck und lädt nach der Vorführung zum Gespräch ein. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Kriegsfilmen, und ihr matched auf die Geschichte, die die ganze Gruppe berührt — immersives Historienepos oder intimes Drama mitten im Konflikt.',
        },
      ],
      it: [
        {
          heading: 'Dallo sbarco ai conflitti moderni',
          body: "Il film di guerra mette lo spettatore di fronte all'esperienza più estrema: il combattimento, la paura, il sacrificio. Il genere comprende il racconto della Seconda guerra mondiale (Salvate il soldato Ryan, Dunkirk), il film sul Vietnam e il suo trauma (Apocalypse Now, Full Metal Jacket) e i conflitti contemporanei. I migliori non glorificano la guerra: ne mostrano l'assurdità e il costo umano, spesso con un'immersione tecnica sconvolgente — la sequenza d'apertura di Salvate il soldato Ryan ha ridefinito il realismo del genere. È un cinema potente che fonde spettacolo e riflessione sulla condizione umana.",
        },
        {
          heading: 'Un film di guerra da condividere e discutere',
          body: "Il film di guerra lascia il segno e invita al confronto dopo la visione. Su Swipe Movie apri una room, ognuno swippa su una selezione di film di guerra e fate match sul racconto che colpisce tutto il gruppo: epopea storica immersiva o dramma intimo nel cuore del conflitto.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films de guerre à voir ?',
          answer:
            'Souvent cités : Il faut sauver le soldat Ryan, Apocalypse Now, Dunkerque, Full Metal Jacket et 1917. La sélection ci-dessus est triée par note et popularité via les données TMDB.',
        },
        {
          question: 'Quel film de guerre regarder à plusieurs ce soir ?',
          answer:
            'Lance une room sur Swipe Movie : chacun swipe sur des films de guerre et vous matchez sur celui qui marque tout le groupe en quelques minutes.',
        },
        {
          question: 'Où regarder des films de guerre en streaming ?',
          answer:
            'On en trouve sur Netflix, Prime Video et Max selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best war movies to watch?',
          answer:
            'Often cited: Saving Private Ryan, Apocalypse Now, Dunkirk, Full Metal Jacket and 1917. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What war movie should we watch together tonight?',
          answer:
            'Start a room on Swipe Movie: everyone swipes on war films and you match in minutes on the one that resonates with the whole group.',
        },
        {
          question: 'Where can I stream war movies?',
          answer:
            'You\'ll find them on Netflix, Prime Video and Max depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas bélicas para ver?',
          answer:
            'A menudo citadas: Salvar al soldado Ryan, Apocalypse Now, Dunkerque, La chaqueta metálica y 1917. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Qué película bélica ver en grupo esta noche?',
          answer:
            'Abre una sala en Swipe Movie: cada uno desliza sobre películas bélicas y hacéis match en pocos minutos en la que marca a todo el grupo.',
        },
        {
          question: '¿Dónde ver películas bélicas en streaming?',
          answer:
            'Se encuentran en Netflix, Prime Video y Max según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Kriegsfilme?',
          answer:
            'Oft genannt: Der Soldat James Ryan, Apocalypse Now, Dunkirk, Full Metal Jacket und 1917. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Welchen Kriegsfilm heute Abend in der Gruppe schauen?',
          answer:
            'Starte einen Raum auf Swipe Movie: Jeder swipt durch Kriegsfilme, und ihr matched in Minuten auf den, der die ganze Gruppe berührt.',
        },
        {
          question: 'Wo kann ich Kriegsfilme streamen?',
          answer:
            'Du findest sie je nach Region auf Netflix, Prime Video und Max. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film di guerra da vedere?',
          answer:
            'Spesso citati: Salvate il soldato Ryan, Apocalypse Now, Dunkirk, Full Metal Jacket e 1917. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.',
        },
        {
          question: 'Quale film di guerra guardare in gruppo stasera?',
          answer:
            'Apri una room su Swipe Movie: ognuno swippa su film di guerra e fate match in pochi minuti su quello che colpisce tutto il gruppo.',
        },
        {
          question: 'Dove guardare film di guerra in streaming?',
          answer:
            'Si trovano su Netflix, Prime Video e Max a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
    sections: {
      fr: [
        {
          heading: 'Du western classique au néo-western',
          body: "Le western est le genre fondateur du cinéma américain, et il s'est constamment réinventé. Il y a le western classique de John Ford qui célèbre la conquête de l'Ouest, le western spaghetti de Sergio Leone et ses duels mythiques (Le Bon, la Brute et le Truand, Il était une fois dans l'Ouest), et le western crépusculaire qui démythifie la légende (Impitoyable de Clint Eastwood). Plus récemment, le néo-western transpose ses codes à l'époque moderne (No Country for Old Men). Grands espaces, duels au pistolet, figures solitaires et morale ambiguë : le western explore la frontière entre civilisation et sauvagerie.",
        },
        {
          heading: 'Un western pour une grande soirée cinéma',
          body: "Le western est un genre de cinéphiles qui se savoure sur grand écran, et il fédère autour de ses classiques. Sur Swipe Movie, ouvre une room, chacun swipe sur une sélection de westerns, et vous matchez sur le titre qui fait l'unanimité — duel de Leone légendaire ou néo-western tendu, selon les envies du groupe.",
        },
      ],
      en: [
        {
          heading: 'From the classic western to the neo-western',
          body: "The western is the founding genre of American cinema, and it has constantly reinvented itself. There's John Ford's classic western celebrating the conquest of the West, Sergio Leone's spaghetti western with its mythic duels (The Good, the Bad and the Ugly, Once Upon a Time in the West), and the twilight western that demythologizes the legend (Clint Eastwood's Unforgiven). More recently, the neo-western transposes its codes to the modern age (No Country for Old Men). Wide-open spaces, gun duels, solitary figures and ambiguous morality: the western explores the line between civilization and wilderness.",
        },
        {
          heading: 'A western for a great movie night',
          body: "The western is a cinephile's genre best savoured on a big screen, and it unites people around its classics. On Swipe Movie, open a room, everyone swipes on a selection of westerns, and you match on the title everyone agrees on — a legendary Leone duel or a tense neo-western, depending on the group's mood.",
        },
      ],
      es: [
        {
          heading: 'Del western clásico al neowestern',
          body: 'El western es el género fundacional del cine americano, y se ha reinventado sin cesar. Está el western clásico de John Ford que celebra la conquista del Oeste, el spaghetti western de Sergio Leone con sus duelos míticos (El bueno, el feo y el malo, Hasta que llegó su hora) y el western crepuscular que desmitifica la leyenda (Sin perdón de Clint Eastwood). Más recientemente, el neowestern traslada sus códigos a la época moderna (No es país para viejos). Grandes espacios, duelos a pistola, figuras solitarias y moral ambigua: el western explora la frontera entre civilización y salvajismo.',
        },
        {
          heading: 'Un western para una gran noche de cine',
          body: 'El western es un género de cinéfilos que se saborea en pantalla grande y une en torno a sus clásicos. En Swipe Movie abre una sala, cada uno desliza sobre una selección de westerns y hacéis match en el título que une a todos: duelo legendario de Leone o neowestern tenso, según las ganas del grupo.',
        },
      ],
      de: [
        {
          heading: 'Vom klassischen Western zum Neo-Western',
          body: 'Der Western ist das Gründungsgenre des amerikanischen Kinos, und er hat sich immer wieder neu erfunden. Da ist der klassische Western von John Ford, der die Eroberung des Westens feiert, der Italowestern von Sergio Leone mit seinen mythischen Duellen (Zwei glorreiche Halunken, Spiel mir das Lied vom Tod) und der Spätwestern, der die Legende entmystifiziert (Clint Eastwoods Erbarmungslos). In jüngerer Zeit überträgt der Neo-Western seine Codes in die Moderne (No Country for Old Men). Weite Landschaften, Pistolenduelle, einsame Gestalten und ambivalente Moral: Der Western erkundet die Grenze zwischen Zivilisation und Wildnis.',
        },
        {
          heading: 'Ein Western für einen großen Filmabend',
          body: 'Der Western ist ein Genre für Cineasten, das man am besten auf großer Leinwand genießt, und er vereint rund um seine Klassiker. Auf Swipe Movie öffnest du einen Raum, jeder swipt durch eine Auswahl an Western, und ihr matched auf den Titel, über den sich alle einig sind — ein legendäres Leone-Duell oder ein angespannter Neo-Western, je nach Lust der Gruppe.',
        },
      ],
      it: [
        {
          heading: 'Dal western classico al neo-western',
          body: "Il western è il genere fondativo del cinema americano e si è reinventato di continuo. C'è il western classico di John Ford che celebra la conquista del West, lo spaghetti western di Sergio Leone con i suoi duelli mitici (Il buono, il brutto e il cattivo, C'era una volta il West) e il western crepuscolare che demitizza la leggenda (Gli spietati di Clint Eastwood). Più di recente, il neo-western trasporta i suoi codici nell'epoca moderna (Non è un paese per vecchi). Grandi spazi, duelli alla pistola, figure solitarie e morale ambigua: il western esplora il confine tra civiltà e barbarie.",
        },
        {
          heading: 'Un western per una grande serata al cinema',
          body: "Il western è un genere da cinefili che si gusta sul grande schermo e unisce attorno ai suoi classici. Su Swipe Movie apri una room, ognuno swippa su una selezione di western e fate match sul titolo che mette tutti d'accordo: duello leggendario di Leone o neo-western teso, a seconda della voglia del gruppo.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs westerns de tous les temps ?',
          answer:
            "Souvent cités : Le Bon, la Brute et le Truand, Il était une fois dans l'Ouest, Impitoyable, No Country for Old Men et La Prisonnière du désert. La sélection ci-dessus est triée par note et popularité via les données TMDB.",
        },
        {
          question: 'Quelle est la différence entre western classique et néo-western ?',
          answer:
            "Le western classique se déroule au Far West du XIXe siècle ; le néo-western transpose ses thèmes (frontière, justice, violence) à l'époque moderne.",
        },
        {
          question: 'Où regarder des westerns en streaming ?',
          answer:
            'On en trouve sur Netflix, Prime Video et Max selon ta région. Filtre par plateforme sur Swipe Movie.',
        },
      ],
      en: [
        {
          question: 'What are the best westerns of all time?',
          answer:
            'Often cited: The Good, the Bad and the Ugly, Once Upon a Time in the West, Unforgiven, No Country for Old Men and The Searchers. The selection above is sorted by rating and popularity via TMDB data.',
        },
        {
          question: 'What is the difference between a classic western and a neo-western?',
          answer:
            'The classic western is set in the 19th-century Wild West; the neo-western transposes its themes (frontier, justice, violence) to the modern era.',
        },
        {
          question: 'Where can I stream westerns?',
          answer:
            'You\'ll find them on Netflix, Prime Video and Max depending on your region. Filter by platform on Swipe Movie.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son los mejores westerns de todos los tiempos?',
          answer:
            'A menudo citados: El bueno, el feo y el malo, Hasta que llegó su hora, Sin perdón, No es país para viejos y Centauros del desierto. La selección de arriba se ordena por valoración y popularidad con datos de TMDB.',
        },
        {
          question: '¿Cuál es la diferencia entre western clásico y neowestern?',
          answer:
            'El western clásico transcurre en el Lejano Oeste del siglo XIX; el neowestern traslada sus temas (frontera, justicia, violencia) a la época moderna.',
        },
        {
          question: '¿Dónde ver westerns en streaming?',
          answer:
            'Se encuentran en Netflix, Prime Video y Max según tu región. Filtra por plataforma en Swipe Movie.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Western aller Zeiten?',
          answer:
            'Oft genannt: Zwei glorreiche Halunken, Spiel mir das Lied vom Tod, Erbarmungslos, No Country for Old Men und Der schwarze Falke. Die Auswahl oben ist nach Bewertung und Beliebtheit über TMDB-Daten sortiert.',
        },
        {
          question: 'Was ist der Unterschied zwischen klassischem Western und Neo-Western?',
          answer:
            'Der klassische Western spielt im Wilden Westen des 19. Jahrhunderts; der Neo-Western überträgt seine Themen (Grenze, Gerechtigkeit, Gewalt) in die Moderne.',
        },
        {
          question: 'Wo kann ich Western streamen?',
          answer:
            'Du findest sie je nach Region auf Netflix, Prime Video und Max. Filtere auf Swipe Movie nach Plattform.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori western di tutti i tempi?',
          answer:
            "Spesso citati: Il buono, il brutto e il cattivo, C'era una volta il West, Gli spietati, Non è un paese per vecchi e Sentieri selvaggi. La selezione qui sopra è ordinata per voto e popolarità tramite i dati TMDB.",
        },
        {
          question: 'Qual è la differenza tra western classico e neo-western?',
          answer:
            "Il western classico si svolge nel Far West dell'Ottocento; il neo-western trasporta i suoi temi (frontiera, giustizia, violenza) nell'epoca moderna.",
        },
        {
          question: 'Dove guardare western in streaming?',
          answer:
            'Si trovano su Netflix, Prime Video e Max a seconda della regione. Filtra per piattaforma su Swipe Movie.',
        },
      ],
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
