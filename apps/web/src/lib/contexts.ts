/**
 * Contextual landing pages — the highest-intent, lowest-competition SEO surface.
 *
 * Each entry maps a real-world use case ("films pour une soirée couple",
 * "films horreur pour Halloween entre amis") to a deterministic set of TMDb
 * genres + filters. URLs are stable and curated by hand because they target
 * specific search queries; do not rename a slug without a 301.
 */

import type { Locale } from '@/i18n';

export type ContextEntry = {
  slug: string;
  /** TMDb genre IDs blended into the discover() query, in priority order. */
  genreIds: number[];
  /** Optional vote_average floor for higher-quality suggestions. */
  minRating?: number;
  /** Optional release-year window. */
  releaseYearMin?: number;
  releaseYearMax?: number;
  /** Headline shown as h1 on the page. */
  title: Record<Locale, string>;
  /** SEO meta description (140-160 chars). */
  description: Record<Locale, string>;
  /** Editorial intro shown under the h1 (2-3 paragraphs welcome). */
  intro: Record<Locale, string>;
  /** Sections of long-form content that drive on-page word count. */
  sections: Record<Locale, Array<{ heading: string; body: string }>>;
  /** FAQ entries — rendered visually and as FAQPage JSON-LD. */
  faq: Record<Locale, Array<{ question: string; answer: string }>>;
  /** Genre slugs to cross-link to (internal linking / SEO mesh). */
  relatedGenres: string[];
  /** Provider slugs to cross-link to. */
  relatedProviders: string[];
};

function entry<T extends ContextEntry>(c: T): T {
  return c;
}

export const CONTEXTS: Record<string, ContextEntry> = {
  'soiree-couple': entry({
    slug: 'soiree-couple',
    genreIds: [10749, 35, 18],
    minRating: 6.5,
    relatedGenres: ['romance', 'comedie', 'drame'],
    relatedProviders: ['netflix', 'prime-video', 'disney-plus'],
    title: {
      fr: 'Films pour une soirée en couple',
      en: "Movies for a couple's movie night",
      es: 'Películas para una noche en pareja',
      de: 'Filme für einen gemeinsamen Pärchen-Abend',
      it: 'Film per una serata in coppia',
    },
    description: {
      fr: 'La meilleure sélection de films à regarder en couple : romance, comédies romantiques, drames intenses. Swipez ensemble et trouvez le film parfait.',
      en: 'The best couple movies to watch together: romance, romantic comedies, intense dramas. Swipe together and find the perfect film.',
      es: 'La mejor selección de películas para ver en pareja: romance, comedias románticas, dramas intensos. Desliza juntos y encuentra la película perfecta.',
      de: 'Die beste Auswahl an Paar-Filmen: Romantik, romantische Komödien, intensive Dramen. Swipt gemeinsam und findet den perfekten Film.',
      it: 'La migliore selezione di film da guardare in coppia: romanticismo, commedie romantiche, drammi intensi. Swippate insieme e trovate il film perfetto.',
    },
    intro: {
      fr: 'Choisir un film à deux peut tourner au débat sans fin. Swipe Movie résout le problème : tu lances une room, tu invites ton/ta partenaire, vous swipez chacun de votre côté sur une sélection adaptée aux soirées en couple, et vous matchez instantanément sur un film qui plaît aux deux.\n\nLa sélection ci-dessous mélange romance, comédies romantiques et drames intenses — les trois genres les plus matchés en mode couple sur Swipe Movie. Tu peux filtrer ensuite par plateforme (Netflix, Prime, Disney+...) ou ajuster selon ton humeur.',
      en: 'Picking a movie as a couple can turn into an endless debate. Swipe Movie solves it: start a room, invite your partner, both swipe on a curated selection for couple nights, and instantly match on a film you both want to watch.\n\nThe selection below blends romance, romantic comedies and intense dramas — the three genres that match most often in couple mode on Swipe Movie. You can then filter by platform (Netflix, Prime, Disney+...) or tweak depending on your mood.',
      es: 'Elegir una película en pareja puede convertirse en un debate sin fin. Swipe Movie lo resuelve: abres una sala, invitas a tu pareja, ambos deslizáis en una selección adaptada a las noches en pareja, y hacéis match al instante en una película que os guste a los dos.\n\nLa selección de abajo mezcla romance, comedias románticas y dramas intensos — los tres géneros que más matchean en modo pareja en Swipe Movie. Después puedes filtrar por plataforma (Netflix, Prime, Disney+...) o ajustar según tu estado de ánimo.',
      de: 'Einen Film zu zweit zu wählen kann zu endloser Diskussion werden. Swipe Movie löst das: Du startest einen Raum, lädst deinen Partner ein, beide swipt ihr durch eine kuratierte Auswahl für Pärchen-Abende, und ihr matched sofort auf einen Film, den ihr beide schauen wollt.\n\nDie Auswahl unten mischt Romantik, romantische Komödien und intensive Dramen — die drei Genres, die im Pärchen-Modus auf Swipe Movie am häufigsten matchen. Danach kannst du nach Plattform filtern (Netflix, Prime, Disney+...) oder je nach Stimmung anpassen.',
      it: "Scegliere un film in due può trasformarsi in un dibattito infinito. Swipe Movie risolve il problema: apri una room, inviti il tuo partner, entrambi swippate su una selezione adatta alle serate in coppia, e fate match all'istante su un film che piace a entrambi.\n\nLa selezione qui sotto mescola romance, commedie romantiche e drammi intensi — i tre generi che matchano di più in modalità coppia su Swipe Movie. Puoi poi filtrare per piattaforma (Netflix, Prime, Disney+...) o regolare in base al tuo umore.",
    },
    sections: {
      fr: [
        {
          heading: 'Comment choisir un film à deux en quelques minutes',
          body: 'L\'astuce : ne plus essayer de proposer un film en premier. À la place, lancez une room sur Swipe Movie, swipez chacun sur les 20-30 films proposés, et laissez l\'algo trouver les intersections. La plupart des couples matchent en moins de 5 minutes — sans une seule discussion houleuse sur "on a déjà vu celui-là".',
        },
        {
          heading: 'Les genres qui matchent le plus en couple',
          body: "Les données Swipe Movie montrent que les comédies romantiques (Crazy Stupid Love, La La Land) ont le taux de match le plus élevé, suivies des drames intenses (Marriage Story, Past Lives) et des thrillers maîtrisés. Les films d'horreur et d'action pure matchent beaucoup moins en mode couple — sauf chez certains profils.",
        },
        {
          heading: 'Sur quelle plateforme regarder ?',
          body: 'Netflix reste le catalogue le plus large pour les films couple, suivi de Prime Video et Disney+. Si vous êtes abonnés à plusieurs services, lancez la room en mode multi-plateforme et Swipe Movie agrégera les disponibilités.',
        },
      ],
      en: [
        {
          heading: 'How to pick a movie as a couple in minutes',
          body: 'The trick: stop trying to propose a movie first. Instead, start a room on Swipe Movie, both swipe on the 20-30 suggested films, and let the algorithm find the intersections. Most couples match in under 5 minutes — without a single argument about "we\'ve already seen that one".',
        },
        {
          heading: 'The genres that match most as a couple',
          body: 'Swipe Movie data shows romantic comedies (Crazy Stupid Love, La La Land) have the highest match rate, followed by intense dramas (Marriage Story, Past Lives) and tight thrillers. Pure horror and action movies match much less in couple mode — except for specific profiles.',
        },
        {
          heading: 'Which streaming platform to watch on?',
          body: 'Netflix remains the broadest catalog for couple movies, followed by Prime Video and Disney+. If you subscribe to several services, start a multi-platform room and Swipe Movie will aggregate availability.',
        },
      ],
      es: [
        {
          heading: 'Cómo elegir una película en pareja en pocos minutos',
          body: 'El truco: deja de intentar proponer una película primero. En su lugar, abrid una sala en Swipe Movie, ambos deslizad en las 20-30 películas propuestas, y dejad que el algoritmo encuentre las intersecciones. La mayoría de las parejas hacen match en menos de 5 minutos — sin una sola discusión sobre "esa ya la hemos visto".',
        },
        {
          heading: 'Los géneros que más matchean en pareja',
          body: 'Los datos de Swipe Movie muestran que las comedias románticas (Crazy Stupid Love, La La Land) tienen la mayor tasa de match, seguidas de los dramas intensos (Marriage Story, Past Lives) y los thrillers cuidados. Las películas de terror y acción pura matchean mucho menos en modo pareja — salvo en perfiles concretos.',
        },
        {
          heading: '¿En qué plataforma ver?',
          body: 'Netflix sigue siendo el catálogo más amplio para películas de pareja, seguido de Prime Video y Disney+. Si estáis suscritos a varios servicios, abrid la sala en modo multiplataforma y Swipe Movie agregará las disponibilidades.',
        },
      ],
      de: [
        {
          heading: 'Wie man als Paar in wenigen Minuten einen Film wählt',
          body: 'Der Trick: Versuch nicht mehr, einen Film als Erster vorzuschlagen. Stattdessen startet einen Raum auf Swipe Movie, swipt beide durch die 20-30 vorgeschlagenen Filme, und lasst den Algorithmus die Schnittmengen finden. Die meisten Paare matchen in unter 5 Minuten — ohne eine einzige Debatte über „den haben wir schon gesehen“.',
        },
        {
          heading: 'Die Genres, die als Paar am meisten matchen',
          body: 'Swipe-Movie-Daten zeigen: Romantische Komödien (Crazy Stupid Love, La La Land) haben die höchste Match-Rate, gefolgt von intensiven Dramen (Marriage Story, Past Lives) und stringenten Thrillern. Reine Horror- und Actionfilme matchen im Pärchen-Modus deutlich weniger — außer bei bestimmten Profilen.',
        },
        {
          heading: 'Auf welcher Plattform schauen?',
          body: 'Netflix bleibt der breiteste Katalog für Paar-Filme, gefolgt von Prime Video und Disney+. Wenn ihr mehrere Abos habt, startet den Raum im Multi-Plattform-Modus, und Swipe Movie aggregiert die Verfügbarkeiten.',
        },
      ],
      it: [
        {
          heading: 'Come scegliere un film in coppia in pochi minuti',
          body: 'Il trucco: smetti di provare a proporre per primo un film. Aprite invece una room su Swipe Movie, swippate entrambi sui 20-30 film proposti, e lasciate che l\'algoritmo trovi le intersezioni. La maggior parte delle coppie matcha in meno di 5 minuti — senza una sola discussione su "quello l\'abbiamo già visto".',
        },
        {
          heading: 'I generi che matchano di più in coppia',
          body: 'I dati Swipe Movie mostrano che le commedie romantiche (Crazy Stupid Love, La La Land) hanno il tasso di match più alto, seguite dai drammi intensi (Marriage Story, Past Lives) e dai thriller ben costruiti. I film horror e action puri matchano molto meno in modalità coppia — tranne per certi profili.',
        },
        {
          heading: 'Su quale piattaforma guardare?',
          body: 'Netflix rimane il catalogo più ampio per i film di coppia, seguito da Prime Video e Disney+. Se siete abbonati a più servizi, aprite la room in modalità multi-piattaforma e Swipe Movie aggregherà le disponibilità.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel est le meilleur film à regarder en couple ce soir ?',
          answer:
            'Plutôt que de chercher LE film parfait, lancez une room sur Swipe Movie. Vous swipez chacun sur 20 films sélectionnés pour les soirées couple et vous matchez en quelques minutes — sans débat.',
        },
        {
          question: 'Quel genre de film plaît le plus en couple ?',
          answer:
            "Les comédies romantiques et drames intenses sont les plus matchés en mode couple sur Swipe Movie, devant les thrillers et les films d'auteur. L'horreur et l'action pure matchent beaucoup moins.",
        },
        {
          question: 'Comment éviter de toujours regarder les mêmes films ?',
          answer:
            "Swipe Movie t'évite de re-proposer les films déjà vus en se synchronisant avec ta watchlist Trakt ou AniList. Tu peux aussi exclure manuellement les films déjà regardés ensemble.",
        },
      ],
      en: [
        {
          question: "What's the best movie to watch with your partner tonight?",
          answer:
            'Instead of looking for the one perfect movie, start a room on Swipe Movie. You both swipe on 20 films curated for couple nights and match in minutes — no debate needed.',
        },
        {
          question: "Which genre works best for a couple's movie night?",
          answer:
            'Romantic comedies and intense dramas are the most matched in couple mode on Swipe Movie, ahead of thrillers and arthouse films. Horror and pure action match much less.',
        },
        {
          question: 'How do I avoid always watching the same movies?',
          answer:
            "Swipe Movie skips films you've already watched by syncing with your Trakt or AniList watchlist. You can also manually exclude films you've already seen together.",
        },
      ],
      es: [
        {
          question: '¿Cuál es la mejor película para ver en pareja esta noche?',
          answer:
            'En vez de buscar LA película perfecta, abrid una sala en Swipe Movie. Ambos deslizáis en 20 películas seleccionadas para noches en pareja y hacéis match en pocos minutos — sin debate.',
        },
        {
          question: '¿Qué género funciona mejor en pareja?',
          answer:
            'Las comedias románticas y los dramas intensos son los más matcheados en modo pareja en Swipe Movie, por delante de los thrillers y el cine de autor. El terror y la acción pura matchean mucho menos.',
        },
        {
          question: '¿Cómo evitar ver siempre las mismas películas?',
          answer:
            'Swipe Movie evita reproponer las películas ya vistas sincronizándose con tu watchlist de Trakt o AniList. También puedes excluir manualmente las películas que ya habéis visto juntos.',
        },
      ],
      de: [
        {
          question: 'Welcher Film für den heutigen Pärchen-Abend?',
          answer:
            'Anstatt nach DEM perfekten Film zu suchen, startet einen Raum auf Swipe Movie. Beide swipt durch 20 Filme, die für Pärchen-Abende kuratiert sind, und matched in wenigen Minuten — ohne Debatte.',
        },
        {
          question: 'Welches Genre funktioniert für einen Pärchen-Abend am besten?',
          answer:
            'Romantische Komödien und intensive Dramen werden im Pärchen-Modus auf Swipe Movie am häufigsten gematched, vor Thrillern und Arthouse-Filmen. Horror und reine Action matchen deutlich weniger.',
        },
        {
          question: 'Wie vermeide ich, immer dieselben Filme zu schauen?',
          answer:
            'Swipe Movie überspringt bereits gesehene Filme durch Synchronisierung mit deiner Trakt- oder AniList-Watchlist. Du kannst auch manuell Filme ausschließen, die ihr bereits gemeinsam gesehen habt.',
        },
      ],
      it: [
        {
          question: 'Qual è il miglior film da guardare in coppia stasera?',
          answer:
            'Invece di cercare IL film perfetto, aprite una room su Swipe Movie. Entrambi swippate su 20 film selezionati per le serate in coppia e fate match in pochi minuti — senza dibattito.',
        },
        {
          question: 'Quale genere funziona meglio per una serata in coppia?',
          answer:
            "Commedie romantiche e drammi intensi sono i più matchati in modalità coppia su Swipe Movie, davanti ai thriller e al cinema d'autore. Horror e action puri matchano molto meno.",
        },
        {
          question: 'Come evitare di guardare sempre gli stessi film?',
          answer:
            'Swipe Movie evita di riproporre i film già visti sincronizzandosi con la tua watchlist Trakt o AniList. Puoi anche escludere manualmente i film che avete già guardato insieme.',
        },
      ],
    },
  }),

  'entre-amis': entry({
    slug: 'entre-amis',
    genreIds: [35, 28, 53, 27],
    minRating: 6,
    relatedGenres: ['comedie', 'action', 'horreur', 'thriller'],
    relatedProviders: ['netflix', 'prime-video'],
    title: {
      fr: 'Films pour une soirée entre amis',
      en: 'Movies for a movie night with friends',
      es: 'Películas para una noche entre amigos',
      de: 'Filme für einen Filmabend mit Freunden',
      it: 'Film per una serata tra amici',
    },
    description: {
      fr: 'Films idéaux à regarder entre amis : comédies, action, horreur, thrillers. Swipez à plusieurs sur Swipe Movie et matchez en quelques minutes sans débat interminable.',
      en: 'Ideal movies to watch with friends: comedies, action, horror, thrillers. Swipe together on Swipe Movie and match in minutes without endless debate.',
      es: 'Películas ideales para ver entre amigos: comedias, acción, terror, thrillers. Desliza en grupo en Swipe Movie y haz match en pocos minutos sin debates interminables.',
      de: 'Ideale Filme für Freundesabende: Komödien, Action, Horror, Thriller. Swipt gemeinsam auf Swipe Movie und matched in Minuten ohne endlose Debatten.',
      it: 'Film ideali da guardare tra amici: commedie, azione, horror, thriller. Swippate in gruppo su Swipe Movie e fate match in pochi minuti senza dibattiti infiniti.',
    },
    intro: {
      fr: "Soirée film entre potes : tu connais le problème. À quatre, cinq, parfois six, chacun a son film en tête et personne ne veut céder. Résultat : 45 minutes de débat, et vous finissez par lancer une série au hasard.\n\nSwipe Movie automatise la décision. Tu crées une room, tu partages le code, chacun swipe sur sa sélection, et le premier film validé par tout le monde devient votre match. La sélection ci-dessous est celle qui matche le mieux en groupe d'amis : comédies, action, horreur, thrillers.",
      en: 'Movie night with friends: you know the drill. Four, five, sometimes six people, everyone has a movie in mind, no one wants to back down. 45 minutes of debate later, you give up and pick a random show.\n\nSwipe Movie automates the decision. You create a room, share the code, everyone swipes on their selection, and the first film validated by everyone becomes your match. The selection below is what matches best in friend groups: comedies, action, horror, thrillers.',
      es: 'Noche de cine entre colegas: ya conoces el problema. Cuatro, cinco, a veces seis personas, cada uno tiene su película en mente, nadie quiere ceder. 45 minutos de debate después, os rendís y poneis una serie al azar.\n\nSwipe Movie automatiza la decisión. Creas una sala, compartes el código, cada uno desliza en su selección, y la primera película validada por todos se convierte en vuestro match. La selección de abajo es la que mejor matchea en grupos de amigos: comedias, acción, terror, thrillers.',
      de: 'Filmabend mit Freunden: du kennst das. Vier, fünf, manchmal sechs Leute, jeder hat einen Film im Kopf, keiner will nachgeben. 45 Minuten Debatte später gebt ihr auf und startet eine zufällige Serie.\n\nSwipe Movie automatisiert die Entscheidung. Du erstellst einen Raum, teilst den Code, jeder swipt durch seine Auswahl, und der erste von allen validierte Film wird euer Match. Die Auswahl unten ist die, die in Freundesgruppen am besten matched: Komödien, Action, Horror, Thriller.',
      it: 'Serata film tra amici: conosci il problema. In quattro, cinque, a volte sei, ognuno ha il suo film in mente, nessuno vuole cedere. 45 minuti di dibattito dopo, vi arrendete e mettete una serie a caso.\n\nSwipe Movie automatizza la decisione. Crei una room, condividi il codice, ognuno swippa sulla sua selezione, e il primo film validato da tutti diventa il vostro match. La selezione qui sotto è quella che matcha meglio nei gruppi di amici: commedie, azione, horror, thriller.',
    },
    sections: {
      fr: [
        {
          heading: 'Combien de personnes dans une room ?',
          body: "Swipe Movie supporte jusqu'à 10 participants par room en plan gratuit (illimité en Premium). Au-delà de 6, les matchs deviennent plus rares mais quand ils arrivent c'est imparable — vous savez que vous avez trouvé un film qui marche pour tout le monde.",
        },
        {
          heading: 'Pourquoi les comédies dominent les soirées entre amis',
          body: "Les données Swipe Movie le confirment : les comédies (Superbad, Hangover, La Cité de la Peur) ont un taux de match 40% supérieur en mode multi-utilisateurs. Pourquoi ? Le rire fonctionne mieux en groupe, et l'humour est plus consensuel que les émotions fortes.",
        },
        {
          heading: 'Astuce : le mode "un film par mois"',
          body: "Beaucoup de groupes d'amis utilisent Swipe Movie pour leur soirée mensuelle. Ils gardent la même room ouverte, ajoutent des films au fur et à mesure, et matchent à la séance suivante.",
        },
      ],
      en: [
        {
          heading: 'How many people can join a room?',
          body: "Swipe Movie supports up to 10 participants per room on the free plan (unlimited on Premium). Above 6, matches become rarer but when they happen they're solid — you know you've found a film that works for everyone.",
        },
        {
          heading: 'Why comedies dominate friend movie nights',
          body: 'Swipe Movie data confirms it: comedies (Superbad, Hangover, Anchorman) have a 40% higher match rate in multi-user mode. Why? Laughter works better in groups, and humor is more consensual than strong emotions.',
        },
        {
          heading: 'Pro tip: the "one movie a month" mode',
          body: 'Many friend groups use Swipe Movie for their monthly movie night. They keep the same room open, add movies as they go, and match again at the next session.',
        },
      ],
      es: [
        {
          heading: '¿Cuántas personas en una sala?',
          body: 'Swipe Movie soporta hasta 10 participantes por sala en el plan gratuito (ilimitado en Premium). Por encima de 6, los matches son más raros pero cuando llegan son inapelables — sabéis que habéis encontrado una película que funciona para todos.',
        },
        {
          heading: 'Por qué las comedias dominan las noches entre amigos',
          body: 'Los datos de Swipe Movie lo confirman: las comedias (Superbad, Resacón en Las Vegas, Anchorman) tienen una tasa de match un 40% superior en modo multiusuario. ¿Por qué? La risa funciona mejor en grupo, y el humor es más consensual que las emociones fuertes.',
        },
        {
          heading: 'Truco: el modo "una película al mes"',
          body: 'Muchos grupos de amigos usan Swipe Movie para su noche de cine mensual. Mantienen la misma sala abierta, añaden películas sobre la marcha, y hacen match en la siguiente sesión.',
        },
      ],
      de: [
        {
          heading: 'Wie viele Personen in einem Raum?',
          body: 'Swipe Movie unterstützt bis zu 10 Teilnehmer pro Raum im Free-Plan (unbegrenzt mit Premium). Ab 6 werden Matches seltener, aber wenn sie kommen, sind sie eindeutig — ihr wisst, dass ihr einen Film gefunden habt, der für alle funktioniert.',
        },
        {
          heading: 'Warum Komödien Freundesabende dominieren',
          body: 'Swipe-Movie-Daten bestätigen es: Komödien (Superbad, Hangover, Anchorman) haben im Multi-User-Modus eine 40% höhere Match-Rate. Warum? Lachen funktioniert besser in Gruppen, und Humor ist konsensfähiger als starke Emotionen.',
        },
        {
          heading: 'Profi-Tipp: Der „ein Film pro Monat“-Modus',
          body: 'Viele Freundesgruppen nutzen Swipe Movie für ihren monatlichen Filmabend. Sie halten denselben Raum offen, fügen Filme nach und nach hinzu und matchen bei der nächsten Sitzung.',
        },
      ],
      it: [
        {
          heading: 'Quante persone in una room?',
          body: 'Swipe Movie supporta fino a 10 partecipanti per room nel piano gratuito (illimitati su Premium). Sopra i 6, i match diventano più rari ma quando arrivano sono inappellabili — sapete di aver trovato un film che funziona per tutti.',
        },
        {
          heading: 'Perché le commedie dominano le serate tra amici',
          body: "I dati Swipe Movie lo confermano: le commedie (Superbad, Hangover, Anchorman) hanno un tasso di match del 40% superiore in modalità multi-utente. Perché? La risata funziona meglio in gruppo, e l'umorismo è più consensuale delle emozioni forti.",
        },
        {
          heading: 'Trucco: la modalità "un film al mese"',
          body: 'Molti gruppi di amici usano Swipe Movie per la loro serata film mensile. Tengono la stessa room aperta, aggiungono film man mano e matchano alla sessione successiva.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel film regarder entre amis ce week-end ?',
          answer:
            'Plutôt que de débattre, créez une room sur Swipe Movie, partagez le code, et chacun swipe. Vous matcherez en moins de 10 minutes sur un film validé par tout le monde.',
        },
        {
          question: 'Comment trouver un film qui plaît à 5 ou 6 personnes ?',
          answer:
            'Swipe Movie utilise un algorithme de matching qui détecte les intersections entre tous les swipes positifs. Plus vous êtes nombreux, plus le matching devient strict — c\'est exactement ce qu\'il faut pour éviter "oui mais bof".',
        },
        {
          question: 'Quelles plateformes streaming sont supportées ?',
          answer:
            'Swipe Movie agrège Netflix, Prime Video, Disney+, Apple TV+, Canal+, Max, Paramount+ et Crunchyroll. Vous voyez immédiatement où regarder le film matché.',
        },
      ],
      en: [
        {
          question: 'What movie should we watch with friends this weekend?',
          answer:
            "Instead of debating, create a room on Swipe Movie, share the code, and everyone swipes. You'll match in under 10 minutes on a film validated by everyone.",
        },
        {
          question: 'How do you find a movie that pleases 5 or 6 people?',
          answer:
            "Swipe Movie uses a matching algorithm that detects intersections between all positive swipes. The more of you there are, the stricter the matching gets — exactly what you need to avoid 'yeah but meh'.",
        },
        {
          question: 'Which streaming platforms are supported?',
          answer:
            'Swipe Movie aggregates Netflix, Prime Video, Disney+, Apple TV+, HBO Max, Paramount+ and Crunchyroll. You see immediately where to watch the matched film.',
        },
      ],
      es: [
        {
          question: '¿Qué película ver con amigos este fin de semana?',
          answer:
            'En vez de debatir, crea una sala en Swipe Movie, comparte el código y cada uno desliza. Haréis match en menos de 10 minutos en una película validada por todos.',
        },
        {
          question: '¿Cómo encontrar una película que guste a 5 o 6 personas?',
          answer:
            'Swipe Movie usa un algoritmo de matching que detecta las intersecciones entre todos los swipes positivos. Cuantos más seáis, más estricto se vuelve el matching — exactamente lo necesario para evitar el "sí pero meh".',
        },
        {
          question: '¿Qué plataformas de streaming están soportadas?',
          answer:
            'Swipe Movie agrega Netflix, Prime Video, Disney+, Apple TV+, Max, Paramount+ y Crunchyroll. Ves inmediatamente dónde ver la película matcheada.',
        },
      ],
      de: [
        {
          question: 'Welchen Film schauen wir dieses Wochenende mit Freunden?',
          answer:
            'Statt zu debattieren, erstellt einen Raum auf Swipe Movie, teilt den Code, und jeder swipt. Ihr matched in unter 10 Minuten auf einen Film, den alle validiert haben.',
        },
        {
          question: 'Wie findet man einen Film, der 5 oder 6 Personen gefällt?',
          answer:
            'Swipe Movie nutzt einen Matching-Algorithmus, der Schnittmengen zwischen allen positiven Swipes erkennt. Je mehr ihr seid, desto strenger wird das Matching — genau das, was nötig ist, um „ja aber meh“ zu vermeiden.',
        },
        {
          question: 'Welche Streaming-Plattformen werden unterstützt?',
          answer:
            'Swipe Movie aggregiert Netflix, Prime Video, Disney+, Apple TV+, Max, Paramount+ und Crunchyroll. Du siehst sofort, wo der gematchte Film läuft.',
        },
      ],
      it: [
        {
          question: 'Che film guardare con gli amici questo weekend?',
          answer:
            'Invece di dibattere, crea una room su Swipe Movie, condividi il codice, e ognuno swippa. Farete match in meno di 10 minuti su un film validato da tutti.',
        },
        {
          question: 'Come trovare un film che piaccia a 5 o 6 persone?',
          answer:
            'Swipe Movie usa un algoritmo di matching che rileva le intersezioni tra tutti gli swipe positivi. Più siete, più il matching diventa rigoroso — esattamente ciò che serve per evitare il "sì ma boh".',
        },
        {
          question: 'Quali piattaforme streaming sono supportate?',
          answer:
            'Swipe Movie aggrega Netflix, Prime Video, Disney+, Apple TV+, Max, Paramount+ e Crunchyroll. Vedi subito dove guardare il film matchato.',
        },
      ],
    },
  }),

  'en-famille': entry({
    slug: 'en-famille',
    genreIds: [10751, 16, 12],
    minRating: 6.5,
    relatedGenres: ['famille', 'animation', 'aventure'],
    relatedProviders: ['disney-plus', 'netflix'],
    title: {
      fr: 'Films à regarder en famille',
      en: 'Movies to watch as a family',
      es: 'Películas para ver en familia',
      de: 'Filme für den Familienabend',
      it: 'Film da guardare in famiglia',
    },
    description: {
      fr: 'Films familiaux qui plaisent aux parents et aux enfants : animation, aventure, classiques. Swipez tous ensemble et trouvez le film parfait pour ce soir.',
      en: 'Family movies that please parents and kids: animation, adventure, classics. Swipe together and find the perfect film for tonight.',
      es: 'Películas familiares que gustan a padres e hijos: animación, aventura, clásicos. Deslizad todos juntos y encontrad la película perfecta para esta noche.',
      de: 'Familienfilme, die Eltern und Kindern gefallen: Animation, Abenteuer, Klassiker. Swipt alle gemeinsam und findet den perfekten Film für heute Abend.',
      it: 'Film per famiglie che piacciono a genitori e bambini: animazione, avventura, classici. Swippate tutti insieme e trovate il film perfetto per stasera.',
    },
    intro: {
      fr: "Choisir un film en famille = équilibre fragile entre ce que les enfants veulent et ce que les parents peuvent supporter pour la 3e fois cette semaine. Swipe Movie t'aide à trouver des films qui font consensus — animation Pixar/Ghibli, aventure famille, classiques intemporels.\n\nLa sélection ci-dessous est filtrée pour la note minimale et le genre famille. Tu peux affiner par âge dans les paramètres de la room.",
      en: 'Picking a family movie = a fragile balance between what the kids want and what the parents can endure for the 3rd time this week. Swipe Movie helps you find consensus films — Pixar/Ghibli animation, family adventure, timeless classics.\n\nThe selection below is filtered for minimum rating and family genre. You can refine by age in the room settings.',
      es: 'Elegir una película en familia = un equilibrio frágil entre lo que quieren los niños y lo que los padres pueden aguantar por 3ª vez esta semana. Swipe Movie te ayuda a encontrar películas de consenso — animación Pixar/Ghibli, aventura familiar, clásicos intemporales.\n\nLa selección de abajo está filtrada por nota mínima y género familiar. Puedes afinar por edad en los ajustes de la sala.',
      de: 'Einen Familienfilm wählen = ein fragiles Gleichgewicht zwischen dem, was die Kinder wollen, und dem, was die Eltern zum 3. Mal in dieser Woche ertragen können. Swipe Movie hilft dir, Konsensfilme zu finden — Pixar/Ghibli-Animation, Familien-Abenteuer, zeitlose Klassiker.\n\nDie Auswahl unten ist nach Mindestbewertung und Familien-Genre gefiltert. Im Raum-Einstellungen kannst du nach Alter verfeinern.',
      it: 'Scegliere un film in famiglia = un equilibrio fragile tra ciò che vogliono i bambini e ciò che i genitori possono sopportare per la 3ª volta questa settimana. Swipe Movie ti aiuta a trovare film di consenso — animazione Pixar/Ghibli, avventura famiglia, classici senza tempo.\n\nLa selezione qui sotto è filtrata per voto minimo e genere famiglia. Puoi affinare per età nelle impostazioni della room.',
    },
    sections: {
      fr: [
        {
          heading: 'Pour quel âge ?',
          body: 'Swipe Movie ne se substitue pas à un contrôle parental, mais filtre par défaut les contenus adultes. Les films marqués famille sur TMDb sont tous adaptés à un visionnage en famille (pas de scène choquante, pas de langage explicite).',
        },
        {
          heading: "Les valeurs sûres de l'animation",
          body: 'Pixar (Vice-Versa, Soul, Là-haut), Ghibli (Mon Voisin Totoro, Le Voyage de Chihiro), Disney (Encanto, Vaiana) — ces univers matchent quasi systématiquement quand parents et enfants swipent ensemble.',
        },
      ],
      en: [
        {
          heading: 'What age range?',
          body: "Swipe Movie doesn't replace parental controls but filters out adult content by default. Movies tagged 'family' on TMDb are all suitable for family viewing (no shocking scenes, no explicit language).",
        },
        {
          heading: 'Animation safe bets',
          body: 'Pixar (Inside Out, Soul, Up), Ghibli (My Neighbor Totoro, Spirited Away), Disney (Encanto, Moana) — these universes match almost systematically when parents and kids swipe together.',
        },
      ],
      es: [
        {
          heading: '¿Para qué edad?',
          body: 'Swipe Movie no sustituye al control parental, pero filtra por defecto los contenidos adultos. Las películas marcadas familia en TMDb son todas aptas para ver en familia (sin escenas chocantes, sin lenguaje explícito).',
        },
        {
          heading: 'Apuestas seguras de la animación',
          body: 'Pixar (Del Revés, Soul, Up), Ghibli (Mi Vecino Totoro, El Viaje de Chihiro), Disney (Encanto, Vaiana) — estos universos matchean casi siempre cuando padres e hijos deslizan juntos.',
        },
      ],
      de: [
        {
          heading: 'Für welches Alter?',
          body: 'Swipe Movie ersetzt keine Kindersicherung, filtert aber standardmäßig Erwachsenen-Inhalte aus. Filme, die auf TMDb als „Familie“ markiert sind, eignen sich alle für den Familien-Abend (keine schockierenden Szenen, keine explizite Sprache).',
        },
        {
          heading: 'Sichere Animations-Bets',
          body: 'Pixar (Alles steht Kopf, Soul, Oben), Ghibli (Mein Nachbar Totoro, Chihiros Reise), Disney (Encanto, Vaiana) — diese Welten matchen fast immer, wenn Eltern und Kinder gemeinsam swipen.',
        },
      ],
      it: [
        {
          heading: 'Per che età?',
          body: 'Swipe Movie non sostituisce il controllo parentale, ma filtra di default i contenuti per adulti. I film taggati famiglia su TMDb sono tutti adatti alla visione in famiglia (nessuna scena scioccante, nessun linguaggio esplicito).',
        },
        {
          heading: "Le scommesse sicure dell'animazione",
          body: 'Pixar (Inside Out, Soul, Up), Ghibli (Il mio vicino Totoro, La città incantata), Disney (Encanto, Oceania) — questi universi matchano quasi sempre quando genitori e figli swippano insieme.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel film regarder en famille ce soir ?',
          answer:
            'Crée une room Swipe Movie en mode famille : la sélection est filtrée pour les âges, et toute la famille swipe ensemble. Vous matchez en quelques minutes sur un film qui plaît à tout le monde.',
        },
        {
          question: 'Comment filtrer les films adaptés aux enfants ?',
          answer:
            "Swipe Movie utilise les classifications d'âge TMDb et exclut automatiquement les contenus adultes. Tu peux aussi exclure manuellement des genres comme l'horreur ou les thrillers.",
        },
      ],
      en: [
        {
          question: 'What movie to watch as a family tonight?',
          answer:
            'Create a Swipe Movie room in family mode: the selection is filtered for age, and the whole family swipes together. You match in minutes on a movie everyone enjoys.',
        },
        {
          question: 'How do I filter age-appropriate movies?',
          answer:
            'Swipe Movie uses TMDb age ratings and automatically excludes adult content. You can also manually exclude genres like horror or thrillers.',
        },
      ],
      es: [
        {
          question: '¿Qué película ver en familia esta noche?',
          answer:
            'Crea una sala Swipe Movie en modo familia: la selección se filtra por edad y toda la familia desliza junta. Hacéis match en pocos minutos en una película que gusta a todos.',
        },
        {
          question: '¿Cómo filtrar películas aptas para niños?',
          answer:
            'Swipe Movie usa las clasificaciones de edad de TMDb y excluye automáticamente los contenidos adultos. También puedes excluir manualmente géneros como el terror o los thrillers.',
        },
      ],
      de: [
        {
          question: 'Welcher Film für den heutigen Familienabend?',
          answer:
            'Erstelle einen Swipe-Movie-Raum im Familienmodus: Die Auswahl wird nach Alter gefiltert und die ganze Familie swipt gemeinsam. Ihr matched in wenigen Minuten auf einen Film, den alle mögen.',
        },
        {
          question: 'Wie filtere ich kindgerechte Filme?',
          answer:
            'Swipe Movie nutzt TMDb-Altersfreigaben und schließt Erwachsenen-Inhalte automatisch aus. Du kannst auch manuell Genres wie Horror oder Thriller ausschließen.',
        },
      ],
      it: [
        {
          question: 'Che film guardare in famiglia stasera?',
          answer:
            'Crea una room Swipe Movie in modalità famiglia: la selezione è filtrata per età, e tutta la famiglia swippa insieme. Fate match in pochi minuti su un film che piace a tutti.',
        },
        {
          question: 'Come filtrare i film adatti ai bambini?',
          answer:
            "Swipe Movie usa le classificazioni d'età di TMDb ed esclude automaticamente i contenuti per adulti. Puoi anche escludere manualmente generi come l'horror o i thriller.",
        },
      ],
    },
  }),

  'soiree-halloween': entry({
    slug: 'soiree-halloween',
    genreIds: [27, 53, 9648],
    minRating: 6,
    relatedGenres: ['horreur', 'thriller', 'mystere'],
    relatedProviders: ['netflix', 'max', 'prime-video'],
    title: {
      fr: "Films d'horreur pour Halloween",
      en: 'Horror movies for Halloween',
      es: 'Películas de terror para Halloween',
      de: 'Horrorfilme für Halloween',
      it: 'Film horror per Halloween',
    },
    description: {
      fr: "Les meilleurs films d'horreur à regarder à plusieurs pour Halloween : classiques, slashers, films de fantômes et nouveautés. Swipez entre amis et matchez sur le bon film à frissonner.",
      en: 'The best horror movies to watch together for Halloween: classics, slashers, ghost stories and new releases. Swipe with friends and match on the right scary film.',
      es: 'Las mejores películas de terror para ver en grupo en Halloween: clásicos, slashers, historias de fantasmas y novedades. Desliza con amigos y haz match en la película de miedo perfecta.',
      de: 'Die besten Horrorfilme für Halloween im Gruppen-Mode: Klassiker, Slasher, Geistergeschichten und Neuheiten. Swipe mit Freunden und matche auf den richtigen Gruselfilm.',
      it: 'I migliori film horror da guardare in gruppo per Halloween: classici, slasher, storie di fantasmi e novità. Swippa con gli amici e fai match sul film da brividi giusto.',
    },
    intro: {
      fr: "Halloween c'est le seul moment de l'année où tout le monde est d'accord pour mettre un film d'horreur — mais lequel ? Slasher classique ? Found footage ? Nouveau A24 ? Swipe Movie tranche en quelques minutes.\n\nLance une room horreur, invite tes potes, et swipez sur la sélection ci-dessous. La sélection mélange horreur, thrillers et mystère pour les profils plus sensibles.",
      en: 'Halloween is the one moment of the year when everyone agrees to watch a horror movie — but which one? Classic slasher? Found footage? New A24 release? Swipe Movie settles it in minutes.\n\nStart a horror room, invite your friends, and swipe on the selection below. It blends horror, thrillers and mystery for less-hardcore profiles.',
      es: 'Halloween es el único momento del año en que todos están de acuerdo en poner una peli de terror — pero ¿cuál? ¿Slasher clásico? ¿Found footage? ¿Nuevo A24? Swipe Movie lo zanja en pocos minutos.\n\nAbre una sala de terror, invita a tus amigos y deslizad en la selección de abajo. La selección mezcla terror, thrillers y misterio para perfiles más sensibles.',
      de: 'Halloween ist der eine Moment im Jahr, an dem sich alle einig sind, einen Horrorfilm zu schauen — aber welchen? Klassischer Slasher? Found Footage? Neuer A24? Swipe Movie löst das in Minuten.\n\nStarte einen Horror-Raum, lade deine Freunde ein und swipt durch die Auswahl unten. Sie mischt Horror, Thriller und Mystery für weniger hartgesottene Profile.',
      it: "Halloween è l'unico momento dell'anno in cui tutti sono d'accordo a mettere un film horror — ma quale? Slasher classico? Found footage? Nuovo A24? Swipe Movie risolve in pochi minuti.\n\nApri una room horror, invita i tuoi amici e swippate sulla selezione qui sotto. Mescola horror, thriller e mistero per i profili più sensibili.",
    },
    sections: {
      fr: [
        {
          heading: 'Slasher, surnaturel ou psychologique ?',
          body: "Les trois sous-genres d'horreur attirent des profils très différents. Swipe Movie te montre instantanément qui dans le groupe est plutôt slasher (Halloween, Scream) vs surnaturel (Conjuring, Hereditary) vs psychologique (Get Out, Midsommar) — et trouve le compromis.",
        },
        {
          heading: 'Les sorties horreur récentes qui matchent',
          body: 'Sur Swipe Movie, les films horreur récents avec le meilleur taux de match en groupe sont Smile 2, Longlegs, Late Night with the Devil et Substance. Tous notés au-dessus de 7 sur TMDb et largement validés par les communautés horreur.',
        },
      ],
      en: [
        {
          heading: 'Slasher, supernatural or psychological?',
          body: 'The three horror sub-genres attract very different profiles. Swipe Movie shows you instantly who in the group leans slasher (Halloween, Scream) vs supernatural (Conjuring, Hereditary) vs psychological (Get Out, Midsommar) — and finds the compromise.',
        },
        {
          heading: 'Recent horror releases that match well',
          body: 'On Swipe Movie, recent horror films with the best group match rate are Smile 2, Longlegs, Late Night with the Devil and Substance. All rated above 7 on TMDb and broadly validated by horror communities.',
        },
      ],
      es: [
        {
          heading: '¿Slasher, sobrenatural o psicológico?',
          body: 'Los tres subgéneros de terror atraen perfiles muy distintos. Swipe Movie te muestra al instante quién en el grupo es más slasher (Halloween, Scream) vs sobrenatural (Expediente Warren, Hereditary) vs psicológico (Déjame salir, Midsommar) — y encuentra el compromiso.',
        },
        {
          heading: 'Estrenos de terror recientes que matchean',
          body: 'En Swipe Movie, las películas de terror recientes con mejor tasa de match en grupo son Smile 2, Longlegs, Late Night with the Devil y Substance. Todas con nota superior a 7 en TMDb y ampliamente validadas por las comunidades de terror.',
        },
      ],
      de: [
        {
          heading: 'Slasher, übernatürlich oder psychologisch?',
          body: 'Die drei Horror-Subgenres ziehen sehr unterschiedliche Profile an. Swipe Movie zeigt dir sofort, wer in der Gruppe eher Slasher (Halloween, Scream) vs übernatürlich (Conjuring, Hereditary) vs psychologisch (Get Out, Midsommar) ist — und findet den Kompromiss.',
        },
        {
          heading: 'Aktuelle Horror-Releases, die gut matchen',
          body: 'Auf Swipe Movie sind die aktuellen Horrorfilme mit der besten Gruppen-Match-Rate Smile 2, Longlegs, Late Night with the Devil und Substance. Alle über 7 auf TMDb bewertet und breit von Horror-Communities validiert.',
        },
      ],
      it: [
        {
          heading: 'Slasher, soprannaturale o psicologico?',
          body: "I tre sottogeneri horror attirano profili molto diversi. Swipe Movie ti mostra all'istante chi nel gruppo è più slasher (Halloween, Scream) vs soprannaturale (The Conjuring, Hereditary) vs psicologico (Scappa, Midsommar) — e trova il compromesso.",
        },
        {
          heading: 'Uscite horror recenti che matchano',
          body: 'Su Swipe Movie, i film horror recenti con il miglior tasso di match in gruppo sono Smile 2, Longlegs, Late Night with the Devil e Substance. Tutti valutati sopra il 7 su TMDb e ampiamente validati dalle community horror.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: "Quel film d'horreur regarder pour Halloween ?",
          answer:
            'Lance une room horreur sur Swipe Movie, partage le code, et chacun swipe sur la sélection. Vous matcherez en quelques minutes sur le film parfait — slasher, surnaturel ou psychologique selon vos goûts.',
        },
        {
          question: "Comment faire matcher des amateurs et des non-amateurs d'horreur ?",
          answer:
            "Swipe Movie te permet d'élargir au thriller et au mystère plutôt qu'à l'horreur pure. Les profils sensibles swipent sur la version soft (Insidious, Hereditary), les hardcore sur les slashers — et l'algo trouve l'intersection.",
        },
      ],
      en: [
        {
          question: 'Which horror movie should we watch for Halloween?',
          answer:
            "Start a horror room on Swipe Movie, share the code, and everyone swipes. You'll match in minutes on the perfect film — slasher, supernatural or psychological depending on tastes.",
        },
        {
          question: 'How do you match horror fans with non-fans?',
          answer:
            'Swipe Movie lets you broaden to thriller and mystery instead of pure horror. Sensitive profiles swipe on softer titles (Insidious, Hereditary), hardcore on slashers — and the algorithm finds the intersection.',
        },
      ],
      es: [
        {
          question: '¿Qué película de terror ver en Halloween?',
          answer:
            'Abre una sala de terror en Swipe Movie, comparte el código y cada uno desliza. Haréis match en pocos minutos en la película perfecta — slasher, sobrenatural o psicológica según los gustos.',
        },
        {
          question: '¿Cómo matchear a fans y no fans del terror?',
          answer:
            'Swipe Movie te permite ampliar al thriller y al misterio en vez del terror puro. Los perfiles sensibles deslizan en la versión soft (Insidious, Hereditary), los hardcore en los slashers — y el algoritmo encuentra la intersección.',
        },
      ],
      de: [
        {
          question: 'Welchen Horrorfilm für Halloween?',
          answer:
            'Starte einen Horror-Raum auf Swipe Movie, teile den Code, und jeder swipt. Ihr matched in Minuten auf den perfekten Film — Slasher, übernatürlich oder psychologisch je nach Geschmack.',
        },
        {
          question: 'Wie matched man Horror-Fans und Nicht-Fans?',
          answer:
            'Mit Swipe Movie kannst du auf Thriller und Mystery erweitern statt reinem Horror. Sensible Profile swipen auf softer Titel (Insidious, Hereditary), Hardcore auf Slasher — und der Algorithmus findet die Schnittmenge.',
        },
      ],
      it: [
        {
          question: 'Quale film horror guardare per Halloween?',
          answer:
            'Apri una room horror su Swipe Movie, condividi il codice e ognuno swippa. Farete match in pochi minuti sul film perfetto — slasher, soprannaturale o psicologico secondo i gusti.',
        },
        {
          question: "Come far matchare amanti e non amanti dell'horror?",
          answer:
            "Swipe Movie ti permette di allargare al thriller e al mistero invece dell'horror puro. I profili sensibili swippano sulla versione soft (Insidious, Hereditary), gli hardcore sugli slasher — e l'algoritmo trova l'intersezione.",
        },
      ],
    },
  }),

  'soiree-noel': entry({
    slug: 'soiree-noel',
    genreIds: [10751, 10749, 35],
    minRating: 6,
    relatedGenres: ['famille', 'romance', 'comedie'],
    relatedProviders: ['disney-plus', 'netflix'],
    title: {
      fr: 'Films de Noël à regarder en famille ou en couple',
      en: 'Christmas movies for family or couple nights',
      es: 'Películas de Navidad para ver en familia o en pareja',
      de: 'Weihnachtsfilme für Familien- oder Pärchen-Abende',
      it: 'Film di Natale da guardare in famiglia o in coppia',
    },
    description: {
      fr: "La meilleure sélection de films de Noël pour les fêtes : classiques, comédies romantiques, films famille. Swipez ensemble et trouvez le film qui mettra tout le monde dans l'ambiance.",
      en: 'The best selection of Christmas movies for the holidays: classics, romantic comedies, family films. Swipe together and find the film that gets everyone in the mood.',
      es: 'La mejor selección de películas de Navidad para las fiestas: clásicos, comedias románticas, películas familiares. Deslizad juntos y encontrad la película que pondrá a todos en el ambiente.',
      de: 'Die beste Auswahl an Weihnachtsfilmen für die Feiertage: Klassiker, romantische Komödien, Familienfilme. Swipt gemeinsam und findet den Film, der alle in Stimmung bringt.',
      it: 'La migliore selezione di film di Natale per le feste: classici, commedie romantiche, film per famiglie. Swippate insieme e trovate il film che metterà tutti in atmosfera.',
    },
    intro: {
      fr: "Les fêtes c'est aussi la saison des films de Noël — et le moment où tout le monde a son classique préféré (Maman j'ai raté l'avion, Love Actually, Le Père Noël est une ordure). Swipe Movie te permet de trancher rapidement sans relire 15 ans de débats familiaux.\n\nLa sélection mélange comédies romantiques, films famille et grands classiques de Noël.",
      en: "The holiday season is also Christmas movie season — and the moment when everyone has their favorite classic (Home Alone, Love Actually, Die Hard if you're that kind of person). Swipe Movie helps you settle it fast without rehashing 15 years of family debates.\n\nThe selection mixes romantic comedies, family films and Christmas classics.",
      es: 'Las fiestas son también la temporada de películas de Navidad — y el momento en que todos tienen su clásico favorito (Solo en casa, Love Actually, Jungla de cristal si eres de los míos). Swipe Movie te ayuda a zanjarlo rápido sin repasar 15 años de debates familiares.\n\nLa selección mezcla comedias románticas, películas familiares y grandes clásicos de Navidad.',
      de: 'Die Feiertage sind auch Weihnachtsfilm-Saison — und der Moment, in dem jeder seinen Lieblingsklassiker hat (Kevin – Allein zu Haus, Tatsächlich Liebe, Stirb langsam für die Hartgesottenen). Swipe Movie hilft dir, das schnell zu entscheiden, ohne 15 Jahre Familienstreit aufzuwärmen.\n\nDie Auswahl mischt romantische Komödien, Familienfilme und Weihnachtsklassiker.',
      it: "Le feste sono anche la stagione dei film di Natale — e il momento in cui tutti hanno il loro classico preferito (Mamma ho perso l'aereo, Love Actually, Die Hard se sei di quel tipo). Swipe Movie ti aiuta a deciderlo in fretta senza rivangare 15 anni di dibattiti familiari.\n\nLa selezione mescola commedie romantiche, film per famiglie e grandi classici di Natale.",
    },
    sections: {
      fr: [
        {
          heading: 'Classiques vs nouveautés',
          body: 'Les classiques Noël (Home Alone, Le Grinch, Love Actually) dominent toujours les matches sur Swipe Movie en décembre, mais les nouveautés Netflix et Apple TV+ gagnent du terrain chaque année. Garde un œil sur Spirited (Apple) et A Christmas Story Christmas.',
        },
      ],
      en: [
        {
          heading: 'Classics vs new releases',
          body: 'Christmas classics (Home Alone, The Grinch, Love Actually) still dominate matches on Swipe Movie in December, but Netflix and Apple TV+ new releases gain ground every year. Keep an eye on Spirited (Apple) and A Christmas Story Christmas.',
        },
      ],
      es: [
        {
          heading: 'Clásicos vs novedades',
          body: 'Los clásicos de Navidad (Solo en casa, El Grinch, Love Actually) siguen dominando los matches en Swipe Movie en diciembre, pero las novedades de Netflix y Apple TV+ ganan terreno cada año. No pierdas de vista Spirited (Apple) y A Christmas Story Christmas.',
        },
      ],
      de: [
        {
          heading: 'Klassiker vs Neuheiten',
          body: 'Weihnachtsklassiker (Kevin – Allein zu Haus, Der Grinch, Tatsächlich Liebe) dominieren weiterhin die Matches auf Swipe Movie im Dezember, aber Netflix- und Apple-TV+-Neuheiten gewinnen jedes Jahr an Boden. Behalte Spirited (Apple) und A Christmas Story Christmas im Auge.',
        },
      ],
      it: [
        {
          heading: 'Classici vs novità',
          body: "I classici di Natale (Mamma ho perso l'aereo, Il Grinch, Love Actually) dominano ancora i match su Swipe Movie a dicembre, ma le novità Netflix e Apple TV+ guadagnano terreno ogni anno. Tieni d'occhio Spirited (Apple) e A Christmas Story Christmas.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel film de Noël regarder ce soir ?',
          answer:
            'Crée une room Swipe Movie en mode famille ou couple, et chacun swipe sur la sélection Noël. Vous matchez en quelques minutes sur le film parfait pour la soirée.',
        },
      ],
      en: [
        {
          question: 'Which Christmas movie should we watch tonight?',
          answer:
            'Create a Swipe Movie room in family or couple mode, and everyone swipes on the Christmas selection. You match in minutes on the perfect film for the evening.',
        },
      ],
      es: [
        {
          question: '¿Qué película de Navidad ver esta noche?',
          answer:
            'Crea una sala Swipe Movie en modo familia o pareja, y cada uno desliza en la selección de Navidad. Hacéis match en pocos minutos en la película perfecta para la noche.',
        },
      ],
      de: [
        {
          question: 'Welchen Weihnachtsfilm heute Abend?',
          answer:
            'Erstelle einen Swipe-Movie-Raum im Familien- oder Pärchen-Modus, und jeder swipt durch die Weihnachts-Auswahl. Ihr matched in Minuten auf den perfekten Film für den Abend.',
        },
      ],
      it: [
        {
          question: 'Quale film di Natale guardare stasera?',
          answer:
            'Crea una room Swipe Movie in modalità famiglia o coppia, e ognuno swippa sulla selezione Natale. Fate match in pochi minuti sul film perfetto per la serata.',
        },
      ],
    },
  }),

  'premier-rendez-vous': entry({
    slug: 'premier-rendez-vous',
    genreIds: [10749, 35],
    minRating: 7,
    relatedGenres: ['romance', 'comedie', 'drame'],
    relatedProviders: ['netflix', 'prime-video', 'disney-plus'],
    title: {
      fr: 'Films pour un premier rendez-vous',
      en: 'Movies for a first date',
      es: 'Películas para una primera cita',
      de: 'Filme für das erste Date',
      it: 'Film per un primo appuntamento',
    },
    description: {
      fr: 'La meilleure sélection de films pour un premier rendez-vous : comédies romantiques, classiques, films qui font réfléchir sans être lourds.',
      en: 'The best selection of movies for a first date: romantic comedies, classics, films that spark conversation without being heavy.',
      es: 'La mejor selección de películas para una primera cita: comedias románticas, clásicos, películas que invitan a pensar sin ser pesadas.',
      de: 'Die beste Auswahl an Filmen fürs erste Date: romantische Komödien, Klassiker, nachdenkliche aber nicht schwere Filme.',
      it: 'La migliore selezione di film per un primo appuntamento: commedie romantiche, classici, film che fanno riflettere senza essere pesanti.',
    },
    intro: {
      fr: "Un premier rendez-vous \"film à la maison\" est délicat : tu veux un film qui crée une ambiance sans tuer la conversation, ni mettre mal à l'aise. Swipe Movie te propose une sélection éprouvée — comédies romantiques légères et films qui ouvrent à la discussion.\n\nLance une room à deux et swipez ensemble. Bonus : c'est une façon ludique d'apprendre à connaître les goûts de l'autre.",
      en: "A first-date 'movie at home' is tricky: you want a film that sets a mood without killing the conversation or making things awkward. Swipe Movie offers a proven selection — light romantic comedies and conversation-starting films.\n\nStart a room for two and swipe together. Bonus: it's a fun way to discover each other's tastes.",
      es: "Una primera cita 'película en casa' es delicada: quieres una película que cree ambiente sin matar la conversación ni incomodar. Swipe Movie te propone una selección probada — comedias románticas ligeras y películas que abren al diálogo.\n\nAbre una sala de dos y deslizad juntos. Bonus: es una forma divertida de conocer los gustos del otro.",
      de: 'Ein erstes Date „Film zu Hause“ ist heikel: Du willst einen Film, der eine Stimmung schafft, ohne das Gespräch zu killen oder unangenehm zu sein. Swipe Movie bietet dir eine bewährte Auswahl — leichte romantische Komödien und gesprächsöffnende Filme.\n\nStarte einen Raum für zwei und swipt gemeinsam. Bonus: Es ist ein spielerischer Weg, den Geschmack des anderen kennenzulernen.',
      it: "Un primo appuntamento 'film a casa' è delicato: vuoi un film che crei un'atmosfera senza uccidere la conversazione o mettere a disagio. Swipe Movie ti propone una selezione collaudata — commedie romantiche leggere e film che aprono al dialogo.\n\nApri una room a due e swippate insieme. Bonus: è un modo divertente per scoprire i gusti dell'altro.",
    },
    sections: {
      fr: [
        {
          heading: 'Évite les films trop longs ou trop lourds',
          body: 'Les recommandations Swipe Movie pour un premier rendez-vous filtrent automatiquement les films de plus de 2h30 et les drames très lourds. Tu veux pouvoir discuter après, pas être épuisé(e).',
        },
      ],
      en: [
        {
          heading: 'Skip films that are too long or too heavy',
          body: 'Swipe Movie recommendations for first dates automatically filter out films longer than 2h30 and heavy dramas. You want to be able to talk afterwards, not be drained.',
        },
      ],
      es: [
        {
          heading: 'Evita las películas demasiado largas o pesadas',
          body: 'Las recomendaciones de Swipe Movie para primeras citas filtran automáticamente las películas de más de 2h30 y los dramas muy pesados. Quieres poder hablar después, no estar agotada/o.',
        },
      ],
      de: [
        {
          heading: 'Vermeide zu lange oder zu schwere Filme',
          body: 'Swipe-Movie-Empfehlungen für erste Dates filtern automatisch Filme über 2h30 und schwere Dramen heraus. Du willst danach reden können, nicht erschöpft sein.',
        },
      ],
      it: [
        {
          heading: 'Evita film troppo lunghi o troppo pesanti',
          body: 'Le raccomandazioni Swipe Movie per i primi appuntamenti filtrano automaticamente i film di oltre 2h30 e i drammi molto pesanti. Vuoi poter parlare dopo, non essere esausta/o.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel film proposer pour un premier date à la maison ?',
          answer:
            'Plutôt que de proposer, laisse Swipe Movie décider. Crée une room à deux, swipez sur la sélection "premier rendez-vous", et matchez sur un film qui plaît aux deux. C\'est aussi une bonne façon de briser la glace.',
        },
      ],
      en: [
        {
          question: 'Which movie to suggest for a first date at home?',
          answer:
            "Instead of suggesting, let Swipe Movie decide. Create a room for two, swipe on the 'first date' selection, and match on a film that pleases both. It's also a great icebreaker.",
        },
      ],
      es: [
        {
          question: '¿Qué película proponer para una primera cita en casa?',
          answer:
            "En vez de proponer, deja que Swipe Movie decida. Crea una sala de dos, deslizad en la selección 'primera cita' y haced match en una película que guste a ambos. Es también una gran forma de romper el hielo.",
        },
      ],
      de: [
        {
          question: 'Welcher Film für ein erstes Date zu Hause?',
          answer:
            'Statt vorzuschlagen, lass Swipe Movie entscheiden. Erstelle einen Raum für zwei, swipt durch die „Erstes-Date“-Auswahl und matched auf einen Film, der beiden gefällt. Ist auch ein super Eisbrecher.',
        },
      ],
      it: [
        {
          question: 'Quale film proporre per un primo appuntamento a casa?',
          answer:
            "Invece di proporre, lascia decidere Swipe Movie. Crea una room a due, swippate sulla selezione 'primo appuntamento' e fate match su un film che piaccia a entrambi. È anche un ottimo modo per rompere il ghiaccio.",
        },
      ],
    },
  }),

  'long-week-end': entry({
    slug: 'long-week-end',
    genreIds: [12, 28, 18, 14],
    minRating: 7,
    relatedGenres: ['aventure', 'action', 'fantastique', 'science-fiction'],
    relatedProviders: ['netflix', 'prime-video', 'max'],
    title: {
      fr: 'Films à regarder pendant un long week-end',
      en: 'Movies to watch on a long weekend',
      es: 'Películas para ver durante un puente largo',
      de: 'Filme für ein langes Wochenende',
      it: 'Film da guardare in un weekend lungo',
    },
    description: {
      fr: "Films à regarder en marathon pendant un long week-end : épopées, sagas, films à grand spectacle. Swipe Movie t'aide à planifier la sélection parfaite.",
      en: 'Movies to binge during a long weekend: epics, sagas, blockbusters. Swipe Movie helps you plan the perfect selection.',
      es: 'Películas para maratonear durante un puente largo: epopeyas, sagas, blockbusters. Swipe Movie te ayuda a planificar la selección perfecta.',
      de: 'Filme zum Bingen am langen Wochenende: Epen, Sagas, Blockbuster. Swipe Movie hilft dir, die perfekte Auswahl zu planen.',
      it: 'Film da maratonare in un weekend lungo: epopee, saghe, blockbuster. Swipe Movie ti aiuta a pianificare la selezione perfetta.',
    },
    intro: {
      fr: 'Long week-end = trois jours pour rattraper des films que tu repousses depuis des mois. Plutôt que de scroller Netflix pendant 2h, lance une room Swipe Movie et matche sur une sélection de films plus longs ou plus exigeants qui méritent une vraie séance.\n\nLa sélection privilégie les films notés 7+, idéaux pour une vraie soirée cinéma.',
      en: "Long weekend = three days to catch up on movies you've been putting off for months. Instead of scrolling Netflix for 2 hours, start a Swipe Movie room and match on a selection of longer or more demanding films that deserve a real session.\n\nThe selection prioritizes films rated 7+, ideal for a real movie night.",
      es: 'Puente largo = tres días para ponerte al día con películas que vienes posponiendo desde hace meses. En vez de hacer scroll por Netflix 2 horas, abre una sala Swipe Movie y matchea en una selección de películas más largas o exigentes que merecen una sesión real.\n\nLa selección prioriza películas con nota 7+, ideales para una verdadera noche de cine.',
      de: 'Langes Wochenende = drei Tage, um Filme nachzuholen, die du seit Monaten aufschiebst. Statt 2 Stunden auf Netflix zu scrollen, starte einen Swipe-Movie-Raum und matche auf eine Auswahl längerer oder anspruchsvollerer Filme, die eine echte Sitzung verdienen.\n\nDie Auswahl priorisiert Filme mit Bewertung 7+, ideal für einen echten Filmabend.',
      it: 'Weekend lungo = tre giorni per recuperare i film che rimandi da mesi. Invece di scrollare Netflix per 2 ore, apri una room Swipe Movie e matcha su una selezione di film più lunghi o impegnativi che meritano una vera sessione.\n\nLa selezione privilegia i film valutati 7+, ideali per una vera serata cinema.',
    },
    sections: {
      fr: [
        {
          heading: 'Idée : un genre par soirée',
          body: "Plutôt qu'un film par soir au hasard, certains utilisateurs Swipe Movie attribuent un genre par soirée du week-end. Vendredi action, samedi drame, dimanche comédie. La room reste ouverte, vous matchez au fur et à mesure.",
        },
      ],
      en: [
        {
          heading: 'Idea: one genre per evening',
          body: 'Instead of one random movie per night, some Swipe Movie users assign a genre per weekend evening. Friday action, Saturday drama, Sunday comedy. The room stays open, you match as you go.',
        },
      ],
      es: [
        {
          heading: 'Idea: un género por noche',
          body: 'En vez de una peli al azar por noche, algunos usuarios de Swipe Movie asignan un género por noche del puente. Viernes acción, sábado drama, domingo comedia. La sala queda abierta y vais matcheando.',
        },
      ],
      de: [
        {
          heading: 'Idee: ein Genre pro Abend',
          body: 'Statt jeden Abend einen zufälligen Film, weisen manche Swipe-Movie-User pro Wochenend-Abend ein Genre zu. Freitag Action, Samstag Drama, Sonntag Komödie. Der Raum bleibt offen, ihr matched nach und nach.',
        },
      ],
      it: [
        {
          heading: 'Idea: un genere per sera',
          body: 'Invece di un film a caso a sera, alcuni utenti Swipe Movie assegnano un genere per sera del weekend. Venerdì azione, sabato drammatico, domenica commedia. La room resta aperta e matchate man mano.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels films marathoner ce week-end ?',
          answer:
            'Lance une room Swipe Movie multi-soirées et matche sur 2 ou 3 films par jour. La sélection long week-end privilégie les films exigeants (notés 7+) qui méritent une vraie séance.',
        },
      ],
      en: [
        {
          question: 'Which movies to binge this weekend?',
          answer:
            'Start a multi-evening Swipe Movie room and match on 2 or 3 films per day. The long weekend selection prioritizes demanding films (rated 7+) that deserve a real session.',
        },
      ],
      es: [
        {
          question: '¿Qué películas maratonear este finde?',
          answer:
            'Abre una sala Swipe Movie multi-noche y matchea en 2 o 3 películas al día. La selección de puente largo prioriza películas exigentes (con nota 7+) que merecen una sesión real.',
        },
      ],
      de: [
        {
          question: 'Welche Filme dieses Wochenende bingen?',
          answer:
            'Starte einen Multi-Abend-Swipe-Movie-Raum und matche auf 2-3 Filme pro Tag. Die Auswahl fürs lange Wochenende priorisiert anspruchsvolle Filme (Bewertung 7+), die eine echte Sitzung verdienen.',
        },
      ],
      it: [
        {
          question: 'Quali film maratonare questo weekend?',
          answer:
            'Apri una room Swipe Movie multi-sera e matcha su 2 o 3 film al giorno. La selezione weekend lungo privilegia film impegnativi (valutati 7+) che meritano una vera sessione.',
        },
      ],
    },
  }),

  'ado-entre-amis': entry({
    slug: 'ado-entre-amis',
    genreIds: [35, 28, 12, 14],
    minRating: 6.5,
    relatedGenres: ['comedie', 'action', 'aventure', 'fantastique'],
    relatedProviders: ['netflix', 'prime-video'],
    title: {
      fr: 'Films pour ados entre amis',
      en: 'Movies for teens with friends',
      es: 'Películas para adolescentes con amigos',
      de: 'Filme für Teens mit Freunden',
      it: 'Film per adolescenti tra amici',
    },
    description: {
      fr: 'Films idéaux pour une soirée entre ados : comédies récentes, action, aventure, fantasy. Trouve le film parfait avec ta team en 5 minutes.',
      en: 'Ideal movies for a teen movie night with friends: recent comedies, action, adventure, fantasy. Find the perfect film with your crew in 5 minutes.',
      es: 'Películas ideales para una noche entre adolescentes con amigos: comedias recientes, acción, aventura, fantasía. Encuentra la película perfecta con tu grupo en 5 minutos.',
      de: 'Ideale Filme für einen Teen-Filmabend mit Freunden: aktuelle Komödien, Action, Abenteuer, Fantasy. Finde den perfekten Film mit deiner Crew in 5 Minuten.',
      it: 'Film ideali per una serata tra adolescenti: commedie recenti, azione, avventura, fantasy. Trova il film perfetto con il tuo gruppo in 5 minuti.',
    },
    intro: {
      fr: "Les soirées film ado c'est souvent 5 personnes, 5 films différents, 0 décision. Swipe Movie est fait pour ça : crée une room, partage le code, chacun swipe sur son téléphone, et le premier film validé par tout le monde gagne. Pas de débat, pas de spoil.\n\nLa sélection mélange comédies récentes, action, aventure et fantasy — les genres qui matchent le plus dans les groupes 13-18 ans.",
      en: 'Teen movie nights are often 5 people, 5 different films, 0 decisions. Swipe Movie was built for this: create a room, share the code, everyone swipes on their phone, and the first film validated by all wins. No debate, no spoilers.\n\nThe selection mixes recent comedies, action, adventure and fantasy — the genres that match most in teen groups.',
      es: 'Las noches de cine adolescentes son a menudo 5 personas, 5 películas diferentes, 0 decisiones. Swipe Movie está hecho para esto: crea una sala, comparte el código, cada uno desliza en su móvil, y la primera película validada por todos gana. Sin debate, sin spoilers.\n\nLa selección mezcla comedias recientes, acción, aventura y fantasía — los géneros que más matchean en grupos de 13-18 años.',
      de: 'Teen-Filmabende sind oft 5 Leute, 5 verschiedene Filme, 0 Entscheidungen. Swipe Movie wurde dafür gebaut: erstelle einen Raum, teile den Code, jeder swipt auf seinem Handy, und der erste von allen validierte Film gewinnt. Keine Debatte, keine Spoiler.\n\nDie Auswahl mischt aktuelle Komödien, Action, Abenteuer und Fantasy — die Genres, die in Teen-Gruppen am meisten matchen.',
      it: 'Le serate film adolescenti sono spesso 5 persone, 5 film diversi, 0 decisioni. Swipe Movie è fatto per questo: crea una room, condividi il codice, ognuno swippa sul suo telefono, e il primo film validato da tutti vince. Niente dibattito, niente spoiler.\n\nLa selezione mescola commedie recenti, azione, avventura e fantasy — i generi che matchano di più nei gruppi 13-18 anni.',
    },
    sections: {
      fr: [
        {
          heading: 'Comment partager une room en 10 secondes',
          body: "Ton code de room fait 6 caractères. Tu peux le partager sur WhatsApp, Snap ou en lecteur QR. Tes amis ouvrent Swipe Movie, entrent le code, et c'est parti — pas besoin de créer un compte au premier essai.",
        },
      ],
      en: [
        {
          heading: 'How to share a room in 10 seconds',
          body: "Your room code is 6 characters. You can share it on WhatsApp, Snap or via QR code. Your friends open Swipe Movie, enter the code, and you're off — no account needed for the first try.",
        },
      ],
      es: [
        {
          heading: 'Cómo compartir una sala en 10 segundos',
          body: 'Tu código de sala tiene 6 caracteres. Puedes compartirlo por WhatsApp, Snap o por código QR. Tus amigos abren Swipe Movie, meten el código, y a deslizar — sin necesidad de cuenta en el primer intento.',
        },
      ],
      de: [
        {
          heading: 'Wie man einen Raum in 10 Sekunden teilt',
          body: "Dein Raum-Code hat 6 Zeichen. Du kannst ihn per WhatsApp, Snap oder QR-Code teilen. Deine Freunde öffnen Swipe Movie, geben den Code ein, und los geht's — kein Account beim ersten Versuch nötig.",
        },
      ],
      it: [
        {
          heading: 'Come condividere una room in 10 secondi',
          body: 'Il tuo codice room è di 6 caratteri. Puoi condividerlo su WhatsApp, Snap o via QR code. I tuoi amici aprono Swipe Movie, inseriscono il codice, e via — senza bisogno di account al primo tentativo.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel film regarder entre potes ado ce soir ?',
          answer:
            "Crée une room Swipe Movie, partage le code à ta team, chacun swipe sur son tel. Vous matchez en moins de 5 minutes sur un film qui plaît à tout le monde — c'est gratuit et sans débat.",
        },
      ],
      en: [
        {
          question: 'What movie to watch with teen friends tonight?',
          answer:
            'Create a Swipe Movie room, share the code with your crew, everyone swipes on their phone. You match in under 5 minutes on a film everyone likes — free and debate-free.',
        },
      ],
      es: [
        {
          question: '¿Qué película ver entre colegas adolescentes esta noche?',
          answer:
            'Crea una sala Swipe Movie, comparte el código con tu grupo, cada uno desliza en su móvil. Hacéis match en menos de 5 minutos en una película que guste a todos — gratis y sin debate.',
        },
      ],
      de: [
        {
          question: 'Welcher Film mit Teen-Freunden heute Abend?',
          answer:
            'Erstelle einen Swipe-Movie-Raum, teile den Code mit deiner Crew, jeder swipt auf seinem Handy. Ihr matched in unter 5 Minuten auf einen Film, den alle mögen — kostenlos und ohne Debatte.',
        },
      ],
      it: [
        {
          question: 'Quale film con amici adolescenti stasera?',
          answer:
            'Crea una room Swipe Movie, condividi il codice con il tuo gruppo, ognuno swippa sul suo telefono. Fate match in meno di 5 minuti su un film che piace a tutti — gratis e senza dibattito.',
        },
      ],
    },
  }),

  'court-soir': entry({
    slug: 'moins-de-90-minutes',
    genreIds: [35, 28, 27],
    minRating: 6.5,
    releaseYearMin: 2000,
    relatedGenres: ['comedie', 'action', 'horreur'],
    relatedProviders: ['netflix', 'prime-video'],
    title: {
      fr: 'Films de moins de 90 minutes',
      en: 'Movies under 90 minutes',
      es: 'Películas de menos de 90 minutos',
      de: 'Filme unter 90 Minuten',
      it: 'Film sotto i 90 minuti',
    },
    description: {
      fr: "Une sélection de films courts (moins de 90 minutes) pour les soirs où tu n'as pas 3 heures devant toi. Sélection notée 6.5+ sur TMDb.",
      en: "A selection of short films (under 90 minutes) for evenings when you don't have 3 hours ahead. Selection rated 6.5+ on TMDb.",
      es: 'Una selección de películas cortas (menos de 90 minutos) para las noches en que no tienes 3 horas por delante. Selección con nota 6.5+ en TMDb.',
      de: 'Eine Auswahl kurzer Filme (unter 90 Minuten) für Abende, an denen du keine 3 Stunden vor dir hast. Auswahl mit Bewertung 6.5+ auf TMDb.',
      it: 'Una selezione di film brevi (sotto i 90 minuti) per le sere in cui non hai 3 ore davanti. Selezione valutata 6.5+ su TMDb.',
    },
    intro: {
      fr: 'Pas le temps pour un film de 3h ? Cette sélection regroupe des films de moins de 90 minutes qui valent vraiment le détour. Idéal pour les soirs de semaine ou les moments où tu veux finir avant minuit.',
      en: "Don't have time for a 3-hour movie? This selection gathers films under 90 minutes that are genuinely worth your time. Perfect for weeknights or when you want to be done before midnight.",
      es: '¿Sin tiempo para una película de 3 horas? Esta selección reúne películas de menos de 90 minutos que realmente merecen la pena. Ideal para entre semana o para acabar antes de medianoche.',
      de: 'Keine Zeit für einen 3-Stunden-Film? Diese Auswahl versammelt Filme unter 90 Minuten, die deine Zeit wirklich wert sind. Perfekt für Wochentage oder wenn du vor Mitternacht fertig sein willst.',
      it: 'Non hai tempo per un film di 3 ore? Questa selezione raccoglie film sotto i 90 minuti che valgono davvero la pena. Ideali per le serate infrasettimanali o per finire prima di mezzanotte.',
    },
    sections: {
      fr: [
        {
          heading: 'Pourquoi les films courts gagnent du terrain',
          body: 'L\'attention moyenne baisse, et les studios répondent avec des formats plus serrés. Sur Swipe Movie, les films de 85-95 minutes ont un taux de match 25% supérieur en soirée semaine — le format "je dois bosser demain".',
        },
      ],
      en: [
        {
          heading: 'Why short films are gaining ground',
          body: "Average attention is dropping, and studios respond with tighter formats. On Swipe Movie, 85-95 minute films have a 25% higher match rate on weekday nights — the 'I have work tomorrow' format.",
        },
      ],
      es: [
        {
          heading: 'Por qué las películas cortas ganan terreno',
          body: "La atención media baja y los estudios responden con formatos más ajustados. En Swipe Movie, las películas de 85-95 minutos tienen una tasa de match un 25% superior entre semana — el formato 'mañana curro'.",
        },
      ],
      de: [
        {
          heading: 'Warum kurze Filme an Boden gewinnen',
          body: 'Die durchschnittliche Aufmerksamkeit sinkt, und Studios reagieren mit knapperen Formaten. Auf Swipe Movie haben 85-95-minütige Filme an Wochentagen eine 25% höhere Match-Rate — das „Ich muss morgen arbeiten“-Format.',
        },
      ],
      it: [
        {
          heading: 'Perché i film brevi guadagnano terreno',
          body: "L'attenzione media cala, e gli studi rispondono con formati più stretti. Su Swipe Movie, i film di 85-95 minuti hanno un tasso di match del 25% superiore nelle serate infrasettimanali — il formato 'domani lavoro'.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels films courts sont vraiment bons ?',
          answer:
            "Cette sélection filtre les films de moins de 90 minutes notés au moins 6.5 sur TMDb, pour t'éviter les courts métrages publicitaires. Lance une room Swipe Movie pour matcher en couple ou entre amis sur un film court.",
        },
      ],
      en: [
        {
          question: 'Which short films are actually good?',
          answer:
            'This selection filters movies under 90 minutes rated at least 6.5 on TMDb, to avoid ad-style shorts. Start a Swipe Movie room to match with friends or your partner on a quality short film.',
        },
      ],
      es: [
        {
          question: '¿Qué películas cortas son realmente buenas?',
          answer:
            'Esta selección filtra películas de menos de 90 minutos con nota mínima 6.5 en TMDb, para evitar cortos publicitarios. Abre una sala Swipe Movie para matchear en pareja o entre amigos en una película corta de calidad.',
        },
      ],
      de: [
        {
          question: 'Welche Kurzfilme sind wirklich gut?',
          answer:
            'Diese Auswahl filtert Filme unter 90 Minuten mit mindestens 6.5 auf TMDb, um Werbe-Kurzfilme zu vermeiden. Starte einen Swipe-Movie-Raum, um mit Freunden oder als Paar auf einen qualitativen Kurzfilm zu matchen.',
        },
      ],
      it: [
        {
          question: 'Quali film brevi sono davvero buoni?',
          answer:
            'Questa selezione filtra film sotto i 90 minuti valutati almeno 6.5 su TMDb, per evitare i cortometraggi pubblicitari. Apri una room Swipe Movie per matchare in coppia o tra amici su un film breve di qualità.',
        },
      ],
    },
  }),

  'feel-good': entry({
    slug: 'feel-good',
    genreIds: [35, 10751, 10749, 16],
    minRating: 7,
    relatedGenres: ['comedie', 'famille', 'romance', 'animation'],
    relatedProviders: ['netflix', 'disney-plus', 'prime-video'],
    title: {
      fr: 'Films feel-good pour se remonter le moral',
      en: 'Feel-good movies to lift your mood',
      es: 'Películas feel-good para subir el ánimo',
      de: 'Feel-Good-Filme zum Stimmungsheben',
      it: 'Film feel-good per tirarsi su il morale',
    },
    description: {
      fr: 'La meilleure sélection de films feel-good : comédies, films famille, animations qui font du bien. Pour les soirs où tu as besoin de positivité.',
      en: 'The best selection of feel-good movies: comedies, family films, uplifting animations. For evenings when you need positivity.',
      es: 'La mejor selección de películas feel-good: comedias, películas familiares, animaciones que sientan bien. Para las noches en que necesitas positividad.',
      de: 'Die beste Auswahl an Feel-Good-Filmen: Komödien, Familienfilme, aufmunternde Animationen. Für Abende, an denen du Positivität brauchst.',
      it: 'La migliore selezione di film feel-good: commedie, film per famiglie, animazioni che fanno bene. Per le sere in cui hai bisogno di positività.',
    },
    intro: {
      fr: "Soirée après une journée difficile, weekend grisâtre, besoin d'oublier l'actualité — il y a des soirs où tu cherches juste un film qui fait du bien. Cette sélection regroupe les films les mieux notés du genre feel-good : comédies positives, films famille réconfortants, animations qui finissent bien.",
      en: 'Evening after a tough day, gray weekend, need to forget the news — sometimes you just want a film that feels good. This selection gathers the best-rated feel-good films: uplifting comedies, comforting family films, animations with happy endings.',
      es: 'Noche tras un día duro, finde gris, necesidad de olvidar las noticias — hay noches en que solo buscas una película que siente bien. Esta selección reúne las películas mejor valoradas del género feel-good: comedias positivas, películas familiares reconfortantes, animaciones con final feliz.',
      de: 'Abend nach einem harten Tag, graues Wochenende, das Bedürfnis, die Nachrichten zu vergessen — manchmal willst du einfach einen Film, der guttut. Diese Auswahl versammelt die bestbewerteten Feel-Good-Filme: aufmunternde Komödien, tröstliche Familienfilme, Animationen mit Happy End.',
      it: 'Sera dopo una giornata dura, weekend grigio, bisogno di dimenticare le notizie — ci sono sere in cui cerchi solo un film che faccia bene. Questa selezione raccoglie i film più valutati del genere feel-good: commedie positive, film per famiglie confortanti, animazioni con lieto fine.',
    },
    sections: {
      fr: [
        {
          heading: 'Pourquoi le feel-good marche',
          body: 'Les neuroscientifiques le confirment : les films feel-good augmentent les niveaux de sérotonine et réduisent le stress. Sur Swipe Movie, les soirées feel-good matchent plus vite (~3 min en moyenne) car les goûts convergent rapidement sur le positif.',
        },
      ],
      en: [
        {
          heading: 'Why feel-good works',
          body: 'Neuroscientists confirm it: feel-good films increase serotonin and reduce stress. On Swipe Movie, feel-good evenings match faster (~3 min on average) because tastes converge quickly on positivity.',
        },
      ],
      es: [
        {
          heading: 'Por qué funciona el feel-good',
          body: 'Los neurocientíficos lo confirman: las películas feel-good aumentan la serotonina y reducen el estrés. En Swipe Movie, las noches feel-good matchean más rápido (~3 min de media) porque los gustos convergen rápido en lo positivo.',
        },
      ],
      de: [
        {
          heading: 'Warum Feel-Good funktioniert',
          body: 'Neurowissenschaftler bestätigen es: Feel-Good-Filme erhöhen Serotonin und reduzieren Stress. Auf Swipe Movie matchen Feel-Good-Abende schneller (~3 Min im Schnitt), weil sich Geschmäcker schnell auf Positivität einigen.',
        },
      ],
      it: [
        {
          heading: 'Perché il feel-good funziona',
          body: 'I neuroscienziati lo confermano: i film feel-good aumentano i livelli di serotonina e riducono lo stress. Su Swipe Movie, le serate feel-good matchano più velocemente (~3 min in media) perché i gusti convergono rapidamente sul positivo.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel film feel-good regarder ce soir ?',
          answer:
            'Crée une room Swipe Movie en mode feel-good et la sélection est filtrée pour ne montrer que les films positifs notés 7+. Idéal seul, en couple ou entre amis.',
        },
      ],
      en: [
        {
          question: 'What feel-good movie should I watch tonight?',
          answer:
            'Create a Swipe Movie room in feel-good mode and the selection is filtered to show only uplifting films rated 7+. Perfect alone, as a couple or with friends.',
        },
      ],
      es: [
        {
          question: '¿Qué película feel-good ver esta noche?',
          answer:
            'Crea una sala Swipe Movie en modo feel-good y la selección se filtra para mostrar solo películas positivas con nota 7+. Ideal en solitario, en pareja o entre amigos.',
        },
      ],
      de: [
        {
          question: 'Welcher Feel-Good-Film heute Abend?',
          answer:
            'Erstelle einen Swipe-Movie-Raum im Feel-Good-Modus und die Auswahl wird gefiltert, um nur aufmunternde Filme mit Bewertung 7+ zu zeigen. Perfekt allein, als Paar oder mit Freunden.',
        },
      ],
      it: [
        {
          question: 'Quale film feel-good guardare stasera?',
          answer:
            'Crea una room Swipe Movie in modalità feel-good e la selezione è filtrata per mostrare solo film positivi valutati 7+. Ideale da solo, in coppia o con amici.',
        },
      ],
    },
  }),

  cinephile: entry({
    slug: 'cinephile',
    genreIds: [18, 36, 99],
    minRating: 7.5,
    relatedGenres: ['drame', 'histoire', 'documentaire'],
    relatedProviders: ['max', 'canal-plus', 'apple-tv-plus'],
    title: {
      fr: "Films pour cinéphiles : grands classiques et chefs-d'œuvre",
      en: 'Films for cinephiles: classics and masterpieces',
      es: 'Películas para cinéfilos: grandes clásicos y obras maestras',
      de: 'Filme für Cinephile: Klassiker und Meisterwerke',
      it: 'Film per cinefili: grandi classici e capolavori',
    },
    description: {
      fr: "La meilleure sélection de films pour cinéphiles : drames d'auteur, classiques, films historiques notés 7.5+ sur TMDb. Pour les soirées cinéma exigeantes.",
      en: 'The best selection of films for cinephiles: arthouse dramas, classics, historical films rated 7.5+ on TMDb. For demanding cinema nights.',
      es: 'La mejor selección de películas para cinéfilos: dramas de autor, clásicos, películas históricas con nota 7.5+ en TMDb. Para noches de cine exigentes.',
      de: 'Die beste Auswahl an Filmen für Cinephile: Arthouse-Dramen, Klassiker, historische Filme mit Bewertung 7.5+ auf TMDb. Für anspruchsvolle Filmabende.',
      it: "La migliore selezione di film per cinefili: drammi d'autore, classici, film storici valutati 7.5+ su TMDb. Per serate cinema esigenti.",
    },
    intro: {
      fr: "Tu cherches autre chose que les blockbusters et les comédies romantiques. Cette sélection regroupe les films les mieux notés du cinéma d'auteur — drames intenses, films historiques, documentaires marquants. Note minimale TMDb : 7.5.\n\nLance une room avec ton/ta partenaire ou un ami cinéphile et matchez sur un film qui mérite vraiment l'attention.",
      en: 'Looking for something beyond blockbusters and rom-coms. This selection gathers the best-rated arthouse cinema — intense dramas, historical films, landmark documentaries. Minimum TMDb rating: 7.5.\n\nStart a room with your partner or a cinephile friend and match on a film that truly deserves attention.',
      es: 'Buscas algo más allá de los blockbusters y las comedias románticas. Esta selección reúne las películas mejor valoradas del cine de autor — dramas intensos, películas históricas, documentales emblemáticos. Nota mínima TMDb: 7.5.\n\nAbre una sala con tu pareja o un amigo cinéfilo y haced match en una película que realmente merezca atención.',
      de: 'Du suchst etwas jenseits von Blockbustern und Rom-Coms. Diese Auswahl versammelt das bestbewertete Arthouse-Kino — intensive Dramen, historische Filme, prägende Dokumentationen. TMDb-Mindestbewertung: 7.5.\n\nStarte einen Raum mit deinem Partner oder einem cinephilen Freund und matched auf einen Film, der wirklich Aufmerksamkeit verdient.',
      it: "Cerchi qualcosa oltre i blockbuster e le commedie romantiche. Questa selezione raccoglie i film più valutati del cinema d'autore — drammi intensi, film storici, documentari memorabili. Voto minimo TMDb: 7.5.\n\nApri una room con il tuo partner o un amico cinefilo e matchate su un film che merita davvero attenzione.",
    },
    sections: {
      fr: [
        {
          heading: 'Au-delà du score TMDb',
          body: "Le score TMDb n'est qu'un indicateur — il y a des chefs-d'œuvre sous-notés et des films surcôtés. Swipe Movie t'aide à filtrer par décennie, pays, réalisateur si tu veux explorer une œuvre en profondeur.",
        },
      ],
      en: [
        {
          heading: 'Beyond the TMDb score',
          body: 'TMDb score is only one signal — there are underrated masterpieces and overhyped films. Swipe Movie helps you filter by decade, country, director if you want to explore a body of work in depth.',
        },
      ],
      es: [
        {
          heading: 'Más allá de la nota TMDb',
          body: 'La nota TMDb es solo un indicador — hay obras maestras infravaloradas y películas sobrevaloradas. Swipe Movie te ayuda a filtrar por década, país, director si quieres explorar una obra en profundidad.',
        },
      ],
      de: [
        {
          heading: 'Jenseits des TMDb-Scores',
          body: 'Der TMDb-Score ist nur ein Signal — es gibt unterbewertete Meisterwerke und überschätzte Filme. Swipe Movie hilft dir, nach Jahrzehnt, Land oder Regisseur zu filtern, wenn du ein Werk vertieft erkunden willst.',
        },
      ],
      it: [
        {
          heading: 'Oltre il punteggio TMDb',
          body: "Il punteggio TMDb è solo un segnale — ci sono capolavori sottovalutati e film sopravvalutati. Swipe Movie ti aiuta a filtrare per decennio, paese, regista se vuoi esplorare un'opera in profondità.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: "Quel film d'auteur regarder ce soir ?",
          answer:
            'Crée une room Swipe Movie en mode cinéphile : la sélection est filtrée sur les films notés 7.5+ dans les genres drama, historique et documentaire. Idéal pour une soirée ciné exigeante.',
        },
      ],
      en: [
        {
          question: 'Which arthouse film should I watch tonight?',
          answer:
            'Create a Swipe Movie room in cinephile mode: the selection is filtered to films rated 7.5+ in drama, history and documentary genres. Perfect for a demanding movie night.',
        },
      ],
      es: [
        {
          question: '¿Qué película de autor ver esta noche?',
          answer:
            'Crea una sala Swipe Movie en modo cinéfilo: la selección se filtra a películas con nota 7.5+ en los géneros drama, histórico y documental. Ideal para una noche de cine exigente.',
        },
      ],
      de: [
        {
          question: 'Welcher Arthouse-Film heute Abend?',
          answer:
            'Erstelle einen Swipe-Movie-Raum im Cinephile-Modus: Die Auswahl wird auf Filme mit Bewertung 7.5+ in den Genres Drama, Historie und Dokumentation gefiltert. Perfekt für einen anspruchsvollen Filmabend.',
        },
      ],
      it: [
        {
          question: "Quale film d'autore guardare stasera?",
          answer:
            'Crea una room Swipe Movie in modalità cinefilo: la selezione è filtrata sui film valutati 7.5+ nei generi drammatico, storico e documentario. Ideale per una serata cinema esigente.',
        },
      ],
    },
  }),
};

export type ContextSlug = keyof typeof CONTEXTS;

export function getContextBySlug(slug: string): ContextEntry | null {
  return CONTEXTS[slug] ?? null;
}

export function listContexts(): ContextEntry[] {
  return Object.values(CONTEXTS);
}
