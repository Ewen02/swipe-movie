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

  'quoi-regarder-ce-soir': entry({
    slug: 'quoi-regarder-ce-soir',
    genreIds: [18, 35, 28, 53],
    minRating: 6.5,
    relatedGenres: ['comedie', 'drame', 'thriller', 'action'],
    relatedProviders: ['netflix', 'prime-video', 'disney-plus'],
    title: {
      fr: 'Quel film regarder ce soir ? Notre sélection pour décider en 2 minutes',
      en: 'What to watch tonight? A pick to decide in 2 minutes',
      es: '¿Qué película ver esta noche? Una selección para decidir en 2 minutos',
      de: 'Was heute Abend schauen? Eine Auswahl, um in 2 Minuten zu entscheiden',
      it: 'Che film guardare stasera? Una selezione per decidere in 2 minuti',
    },
    description: {
      fr: "Tu ne sais pas quoi regarder ce soir ? Une sélection grand public — drame, comédie, action, thriller — pour décider vite, seul ou à plusieurs, sans scroller.",
      en: "Don't know what to watch tonight? A mainstream pick — drama, comedy, action, thriller — to decide fast, alone or together, without scrolling for 40 minutes.",
      es: '¿No sabes qué ver esta noche? Una selección generalista — drama, comedia, acción, thriller — para decidir rápido, solo o en grupo, sin scrollear 40 minutos.',
      de: 'Du weißt nicht, was du heute Abend schauen sollst? Eine Mainstream-Auswahl — Drama, Komödie, Action, Thriller — um schnell zu entscheiden, allein oder zusammen.',
      it: 'Non sai che film guardare stasera? Una selezione generalista — dramma, commedia, azione, thriller — per decidere in fretta, da solo o in gruppo.',
    },
    intro: {
      fr: "\"Je sais pas quoi regarder ce soir.\" C'est devenu le vrai problème de l'ère du streaming : entre Netflix, Prime, Disney+ et Max, tu as accès à des dizaines de milliers de films — et tu passes plus de temps à chercher qu'à regarder. Le paradoxe du choix te paralyse, et tu finis souvent par relancer une série déjà vue.\n\nCette page est faite pour casser ce syndrome de l'indécision. La sélection ci-dessous mélange les valeurs sûres grand public — drame, comédie, action, thriller — toutes notées au-dessus de 6.5 sur TMDb. Lance une room Swipe Movie, swipe quelques minutes (seul ou avec les autres), et laisse l'algo trancher à ta place.",
      en: "\"I don't know what to watch tonight.\" It's become the real problem of the streaming era: between Netflix, Prime, Disney+ and Max, you have access to tens of thousands of films — and you spend more time searching than watching. The paradox of choice paralyzes you, and you often end up re-running a show you've already seen.\n\nThis page exists to break that indecision loop. The selection below blends mainstream safe bets — drama, comedy, action, thriller — all rated above 6.5 on TMDb. Start a Swipe Movie room, swipe for a few minutes (alone or with others), and let the algorithm decide for you.",
      es: "\"No sé qué ver esta noche.\" Se ha convertido en el verdadero problema de la era del streaming: entre Netflix, Prime, Disney+ y Max, tienes acceso a decenas de miles de películas — y pasas más tiempo buscando que viendo. La paradoja de la elección te paraliza y acabas reponiendo una serie que ya viste.\n\nEsta página existe para romper ese síndrome de la indecisión. La selección de abajo mezcla apuestas seguras generalistas — drama, comedia, acción, thriller — todas con nota superior a 6.5 en TMDb. Abre una sala Swipe Movie, desliza unos minutos (solo o con los demás) y deja que el algoritmo decida por ti.",
      de: "\"Ich weiß nicht, was ich heute Abend schauen soll.\" Das ist das eigentliche Problem der Streaming-Ära geworden: Zwischen Netflix, Prime, Disney+ und Max hast du Zugriff auf Zehntausende Filme — und verbringst mehr Zeit mit Suchen als mit Schauen. Das Paradox der Wahl lähmt dich, und am Ende startest du oft eine schon gesehene Serie neu.\n\nDiese Seite soll dieses Unentschlossenheits-Syndrom durchbrechen. Die Auswahl unten mischt Mainstream-Sicherheiten — Drama, Komödie, Action, Thriller — alle über 6.5 auf TMDb bewertet. Starte einen Swipe-Movie-Raum, swipe ein paar Minuten (allein oder mit anderen) und lass den Algorithmus für dich entscheiden.",
      it: "\"Non so che film guardare stasera.\" È diventato il vero problema dell'era dello streaming: tra Netflix, Prime, Disney+ e Max hai accesso a decine di migliaia di film — e passi più tempo a cercare che a guardare. Il paradosso della scelta ti paralizza, e spesso finisci per rilanciare una serie già vista.\n\nQuesta pagina serve a rompere questa sindrome dell'indecisione. La selezione qui sotto mescola le sicurezze generaliste — dramma, commedia, azione, thriller — tutte valutate sopra il 6.5 su TMDb. Apri una room Swipe Movie, swippa qualche minuto (da solo o con gli altri) e lascia che l'algoritmo decida per te.",
    },
    sections: {
      fr: [
        {
          heading: 'Comment décider vite quand on ne sait pas quoi regarder',
          body: "La pire stratégie : ouvrir Netflix et scroller en espérant qu'un titre te saute aux yeux. À la place, fixe-toi une contrainte (un genre, une humeur, une durée max) et lance une room Swipe Movie. Le swipe binaire — j'ai envie / pas envie — court-circuite la paralysie : en 2 minutes tu as éliminé 80% du catalogue et le film qui reste est celui que tu veux vraiment.",
        },
        {
          heading: 'Décider seul vs à plusieurs',
          body: "Seul, l'enjeu c'est de battre ta propre indécision : Swipe Movie te propose une file de films adaptés et tu valides le premier qui te fait vraiment envie. À plusieurs, le problème change — il faut un film qui plaise à tout le monde. Là, chacun swipe de son côté et l'algo ne garde que les films validés par tous. Dans les deux cas, fini le \"vas-y choisis, toi\".",
        },
        {
          heading: 'Choisir par humeur plutôt que par genre',
          body: "Souvent tu ne cherches pas un genre, tu cherches une humeur : te détendre, rire, pleurer un bon coup, ou prendre une claque. Swipe Movie te laisse filtrer par contexte (feel-good, film pour pleurer, action adrénaline...) plutôt que par étiquette de genre. C'est plus proche de ce que tu ressens vraiment un soir donné.",
        },
      ],
      en: [
        {
          heading: "How to decide fast when you don't know what to watch",
          body: 'The worst strategy: open Netflix and scroll, hoping a title jumps out. Instead, set yourself a constraint (a genre, a mood, a max runtime) and start a Swipe Movie room. Binary swiping — want it / skip it — short-circuits the paralysis: in 2 minutes you have ruled out 80% of the catalog and the film that remains is the one you actually want.',
        },
        {
          heading: 'Deciding alone vs together',
          body: 'Alone, the challenge is beating your own indecision: Swipe Movie hands you a queue of fitting films and you validate the first one you genuinely want. Together, the problem changes — you need a film everyone likes. There, each person swipes separately and the algorithm only keeps films everyone validated. Either way, no more "you pick".',
        },
        {
          heading: 'Choosing by mood rather than genre',
          body: "Often you're not after a genre, you're after a mood: to unwind, to laugh, to have a good cry, or to be floored. Swipe Movie lets you filter by context (feel-good, tearjerker, action adrenaline...) instead of by genre label. It's closer to what you actually feel on a given evening.",
        },
      ],
      es: [
        {
          heading: 'Cómo decidir rápido cuando no sabes qué ver',
          body: 'La peor estrategia: abrir Netflix y scrollear esperando que un título te salte a la vista. En su lugar, ponte una restricción (un género, un estado de ánimo, una duración máxima) y abre una sala Swipe Movie. El swipe binario — me apetece / paso — cortocircuita la parálisis: en 2 minutos has descartado el 80% del catálogo y la película que queda es la que realmente quieres.',
        },
        {
          heading: 'Decidir solo vs en grupo',
          body: 'Solo, el reto es vencer tu propia indecisión: Swipe Movie te ofrece una cola de películas adaptadas y validas la primera que de verdad te apetece. En grupo, el problema cambia — hace falta una película que guste a todos. Ahí cada uno desliza por su cuenta y el algoritmo solo conserva las películas validadas por todos. En ambos casos, se acabó el "elige tú".',
        },
        {
          heading: 'Elegir por estado de ánimo en vez de por género',
          body: 'A menudo no buscas un género, buscas un estado de ánimo: relajarte, reír, llorar a gusto o quedarte sin palabras. Swipe Movie te deja filtrar por contexto (feel-good, película para llorar, acción con adrenalina...) en vez de por etiqueta de género. Está más cerca de lo que realmente sientes una noche dada.',
        },
      ],
      de: [
        {
          heading: 'Wie man schnell entscheidet, wenn man nicht weiß, was man schauen will',
          body: 'Die schlechteste Strategie: Netflix öffnen und scrollen in der Hoffnung, dass ein Titel ins Auge springt. Setz dir stattdessen eine Vorgabe (ein Genre, eine Stimmung, eine maximale Laufzeit) und starte einen Swipe-Movie-Raum. Binäres Swipen — will ich / weg damit — umgeht die Lähmung: In 2 Minuten hast du 80% des Katalogs ausgeschlossen, und der übrige Film ist der, den du wirklich willst.',
        },
        {
          heading: 'Allein vs gemeinsam entscheiden',
          body: 'Allein geht es darum, deine eigene Unentschlossenheit zu schlagen: Swipe Movie gibt dir eine Reihe passender Filme, und du bestätigst den ersten, den du wirklich willst. Gemeinsam ändert sich das Problem — ihr braucht einen Film, der allen gefällt. Da swipt jeder für sich, und der Algorithmus behält nur Filme, die alle bestätigt haben. So oder so: kein „such du aus“ mehr.',
        },
        {
          heading: 'Nach Stimmung statt nach Genre wählen',
          body: 'Oft suchst du kein Genre, sondern eine Stimmung: entspannen, lachen, mal richtig weinen oder umgehauen werden. Swipe Movie lässt dich nach Kontext filtern (Feel-Good, Film zum Weinen, Action-Adrenalin...) statt nach Genre-Etikett. Das kommt dem näher, was du an einem bestimmten Abend wirklich fühlst.',
        },
      ],
      it: [
        {
          heading: 'Come decidere in fretta quando non sai cosa guardare',
          body: 'La strategia peggiore: aprire Netflix e scrollare sperando che un titolo salti all\'occhio. Datti invece un vincolo (un genere, un umore, una durata massima) e apri una room Swipe Movie. Lo swipe binario — mi va / passo — cortocircuita la paralisi: in 2 minuti hai scartato l\'80% del catalogo e il film che resta è quello che vuoi davvero.',
        },
        {
          heading: 'Decidere da soli vs in gruppo',
          body: 'Da solo, la sfida è battere la tua stessa indecisione: Swipe Movie ti propone una coda di film adatti e tu validi il primo che ti va davvero. In gruppo il problema cambia — serve un film che piaccia a tutti. Lì ognuno swippa per conto suo e l\'algoritmo tiene solo i film validati da tutti. In entrambi i casi, basta col "scegli tu".',
        },
        {
          heading: "Scegliere per umore invece che per genere",
          body: "Spesso non cerchi un genere, cerchi un umore: rilassarti, ridere, farti un bel pianto o restare a bocca aperta. Swipe Movie ti lascia filtrare per contesto (feel-good, film per piangere, azione adrenalina...) invece che per etichetta di genere. È più vicino a ciò che senti davvero una certa sera.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel film regarder ce soir ?',
          answer:
            "Plutôt que de chercher LE bon film, lance une room Swipe Movie : tu swipes sur une sélection grand public (drame, comédie, action, thriller) et tu valides en 2 minutes le premier qui te fait envie. À plusieurs, l'algo trouve le film qui plaît à tout le monde.",
        },
        {
          question: "Comment arrêter de scroller sans rien lancer ?",
          answer:
            "Le scroll infini entretient l'indécision. Swipe Movie inverse la logique : au lieu de tout parcourir, tu réagis film par film (envie / pas envie). Le cerveau décide beaucoup plus vite en binaire — la plupart des gens matchent en moins de 3 minutes.",
        },
        {
          question: 'Est-ce que ça marche aussi quand je suis seul ?',
          answer:
            "Oui. En solo, Swipe Movie te propose une file de films adaptés à ton humeur et tu valides le premier qui te tente vraiment, sans repasser par le menu Netflix. C'est conçu pour battre ta propre indécision, pas seulement pour les groupes.",
        },
      ],
      en: [
        {
          question: 'What movie should I watch tonight?',
          answer:
            'Instead of hunting for the one right film, start a Swipe Movie room: you swipe on a mainstream selection (drama, comedy, action, thriller) and validate in 2 minutes the first one you fancy. Together, the algorithm finds the film everyone likes.',
        },
        {
          question: 'How do I stop scrolling without ever pressing play?',
          answer:
            'Infinite scroll feeds indecision. Swipe Movie flips the logic: instead of browsing everything, you react film by film (want it / skip it). The brain decides far faster in binary — most people match in under 3 minutes.',
        },
        {
          question: 'Does it work when I am on my own?',
          answer:
            "Yes. Solo, Swipe Movie hands you a queue of films matched to your mood and you validate the first one you genuinely want, without going back to the Netflix menu. It's built to beat your own indecision, not just for groups.",
        },
      ],
      es: [
        {
          question: '¿Qué película ver esta noche?',
          answer:
            'En vez de buscar LA película correcta, abre una sala Swipe Movie: deslizas en una selección generalista (drama, comedia, acción, thriller) y validas en 2 minutos la primera que te apetece. En grupo, el algoritmo encuentra la que gusta a todos.',
        },
        {
          question: '¿Cómo dejar de scrollear sin poner nada?',
          answer:
            'El scroll infinito alimenta la indecisión. Swipe Movie invierte la lógica: en vez de recorrerlo todo, reaccionas película a película (me apetece / paso). El cerebro decide mucho más rápido en binario — la mayoría hace match en menos de 3 minutos.',
        },
        {
          question: '¿Funciona también cuando estoy solo?',
          answer:
            'Sí. En solitario, Swipe Movie te ofrece una cola de películas adaptadas a tu estado de ánimo y validas la primera que de verdad te tienta, sin volver al menú de Netflix. Está pensado para vencer tu propia indecisión, no solo para grupos.',
        },
      ],
      de: [
        {
          question: 'Welchen Film soll ich heute Abend schauen?',
          answer:
            'Statt nach DEM richtigen Film zu suchen, starte einen Swipe-Movie-Raum: Du swipst durch eine Mainstream-Auswahl (Drama, Komödie, Action, Thriller) und bestätigst in 2 Minuten den ersten, auf den du Lust hast. Zu mehreren findet der Algorithmus den Film, der allen gefällt.',
        },
        {
          question: 'Wie höre ich auf zu scrollen, ohne je etwas zu starten?',
          answer:
            'Endloses Scrollen nährt die Unentschlossenheit. Swipe Movie dreht die Logik um: Statt alles zu durchstöbern, reagierst du Film für Film (will ich / weg). Das Gehirn entscheidet binär viel schneller — die meisten matchen in unter 3 Minuten.',
        },
        {
          question: 'Funktioniert das auch, wenn ich allein bin?',
          answer:
            'Ja. Allein gibt dir Swipe Movie eine Reihe von Filmen passend zu deiner Stimmung, und du bestätigst den ersten, den du wirklich willst, ohne zurück ins Netflix-Menü. Es ist gemacht, um deine eigene Unentschlossenheit zu schlagen, nicht nur für Gruppen.',
        },
      ],
      it: [
        {
          question: 'Che film guardare stasera?',
          answer:
            "Invece di cercare IL film giusto, apri una room Swipe Movie: swippi su una selezione generalista (dramma, commedia, azione, thriller) e validi in 2 minuti il primo che ti va. In gruppo, l'algoritmo trova il film che piace a tutti.",
        },
        {
          question: 'Come smettere di scrollare senza far partire niente?',
          answer:
            "Lo scroll infinito alimenta l'indecisione. Swipe Movie inverte la logica: invece di sfogliare tutto, reagisci film per film (mi va / passo). Il cervello decide molto più in fretta in binario — la maggior parte matcha in meno di 3 minuti.",
        },
        {
          question: 'Funziona anche quando sono da solo?',
          answer:
            "Sì. Da solo, Swipe Movie ti propone una coda di film adatti al tuo umore e validi il primo che ti tenta davvero, senza tornare al menu di Netflix. È pensato per battere la tua stessa indecisione, non solo per i gruppi.",
        },
      ],
    },
  }),

  'film-pour-pleurer': entry({
    slug: 'film-pour-pleurer',
    genreIds: [18, 10749],
    minRating: 7,
    relatedGenres: ['drame', 'romance'],
    relatedProviders: ['netflix', 'prime-video', 'disney-plus'],
    title: {
      fr: 'Film pour pleurer : les meilleurs films tristes et émouvants',
      en: 'Movies to cry to: the saddest, most moving films',
      es: 'Películas para llorar: las más tristes y emotivas',
      de: 'Filme zum Weinen: die traurigsten, bewegendsten Filme',
      it: 'Film per piangere: i più tristi ed emozionanti',
    },
    description: {
      fr: "Envie d'un bon film pour pleurer ? Notre sélection de films tristes et émouvants — drames et romances notés 7+ qui garantissent les larmes. Mouchoirs requis.",
      en: 'In the mood for a good cry? Our pick of the saddest, most moving films — dramas and romances rated 7+ that guarantee the tears. Bring tissues and watch tonight.',
      es: '¿Te apetece llorar a gusto? Nuestra selección de películas tristes y emotivas — dramas y romances con nota 7+ que garantizan las lágrimas. Con pañuelos.',
      de: 'Lust auf einen guten Heulanfall? Unsere Auswahl trauriger, bewegender Filme — Dramen und Romanzen mit 7+, die Tränen garantieren. Taschentücher bereithalten.',
      it: 'Voglia di un bel pianto? La nostra selezione di film tristi ed emozionanti — drammi e romance valutati 7+ che garantiscono le lacrime. Con i fazzoletti.',
    },
    intro: {
      fr: "Il y a des soirs où on cherche exactement le contraire d'un feel-good : un film qui serre la gorge, qui fait monter les larmes et qui vide la tête. Pleurer devant un film, c'est cathartique — et parfois c'est précisément ce dont on a besoin après une longue semaine.\n\nCette sélection regroupe les plus grands tire-larmes du cinéma : drames bouleversants et romances déchirantes, tous notés au moins 7 sur TMDb. Hachiko, La Ligne verte, Titanic, Marley & Me... des films dont on ressort les yeux rouges mais le cœur un peu plus léger. Lance une room et prépare les mouchoirs.",
      en: "Some evenings you want the exact opposite of a feel-good: a film that tightens your throat, brings the tears and empties your head. Crying at a movie is cathartic — and sometimes it's precisely what you need after a long week.\n\nThis selection gathers cinema's greatest tearjerkers: devastating dramas and heartbreaking romances, all rated at least 7 on TMDb. Hachi, The Green Mile, Titanic, Marley & Me... films you leave with red eyes but a slightly lighter heart. Start a room and grab the tissues.",
      es: "Hay noches en que buscas justo lo contrario de un feel-good: una película que te haga un nudo en la garganta, que saque las lágrimas y vacíe la cabeza. Llorar con una película es catártico — y a veces es exactamente lo que necesitas tras una semana larga.\n\nEsta selección reúne los mayores tira-lágrimas del cine: dramas demoledores y romances desgarradores, todos con nota mínima 7 en TMDb. Hachiko, La milla verde, Titanic, Marley y yo... películas de las que sales con los ojos rojos pero el corazón más ligero. Abre una sala y prepara los pañuelos.",
      de: "An manchen Abenden willst du genau das Gegenteil von Feel-Good: einen Film, der dir die Kehle zuschnürt, die Tränen kommen lässt und den Kopf leert. Bei einem Film zu weinen ist kathartisch — und manchmal genau das, was du nach einer langen Woche brauchst.\n\nDiese Auswahl versammelt die größten Tränendrücker des Kinos: erschütternde Dramen und herzzerreißende Romanzen, alle mit mindestens 7 auf TMDb. Hachiko, The Green Mile, Titanic, Marley & Me... Filme, aus denen du mit roten Augen, aber etwas leichterem Herzen herauskommst. Starte einen Raum und halt die Taschentücher bereit.",
      it: "Ci sono sere in cui cerchi l'esatto contrario di un feel-good: un film che stringe la gola, fa salire le lacrime e svuota la testa. Piangere davanti a un film è catartico — e a volte è esattamente ciò di cui hai bisogno dopo una settimana lunga.\n\nQuesta selezione raccoglie i più grandi strappalacrime del cinema: drammi sconvolgenti e romance strazianti, tutti valutati almeno 7 su TMDb. Hachiko, Il miglio verde, Titanic, Io & Marley... film da cui esci con gli occhi rossi ma il cuore un po' più leggero. Apri una room e prepara i fazzoletti.",
    },
    sections: {
      fr: [
        {
          heading: 'Les films tire-larmes incontournables',
          body: "Certains titres sont devenus des références absolues du genre. Hachiko (la fidélité d'un chien après la mort de son maître), La Ligne verte (l'innocence face à la peine de mort), Marley & Me (toute une vie de famille avec un chien), Titanic (l'amour et la perte) — impossible de les regarder sans craquer. Ajoute à ça Une bouteille à la mer, Nos étoiles contraires ou Si je reste pour les profils romance.",
        },
        {
          heading: 'Drame poignant ou romance déchirante ?',
          body: "Tous les tire-larmes ne se valent pas selon ton humeur. Les drames poignants (La Ligne verte, Philadelphia, La vie est belle) jouent sur l'injustice et le sacrifice. Les romances déchirantes (Titanic, Nos étoiles contraires, La La Land) sur l'amour impossible ou perdu. Swipe Movie te laisse pondérer les deux : tu swipes, et la sélection s'ajuste au type d'émotion que tu cherches ce soir.",
        },
        {
          heading: 'Pleurer à deux, ça rapproche',
          body: "Regarder un film triste en couple ou avec un ami proche crée un moment de complicité rare. Lance une room à deux : vous swipez sur la sélection tire-larmes et matchez sur le film qui va vous démolir tous les deux. Bonus : c'est l'excuse parfaite pour un câlin sur le canapé.",
        },
      ],
      en: [
        {
          heading: 'The essential tearjerkers',
          body: "Some titles have become absolute references of the genre. Hachi (a dog's loyalty after his master's death), The Green Mile (innocence facing the death penalty), Marley & Me (a whole family life with a dog), Titanic (love and loss) — impossible to watch without breaking down. Add Message in a Bottle, The Fault in Our Stars or If I Stay for romance profiles.",
        },
        {
          heading: 'Poignant drama or heartbreaking romance?',
          body: "Not all tearjerkers fit the same mood. Poignant dramas (The Green Mile, Philadelphia, Life Is Beautiful) play on injustice and sacrifice. Heartbreaking romances (Titanic, The Fault in Our Stars, La La Land) on impossible or lost love. Swipe Movie lets you weigh both: you swipe, and the selection adjusts to the kind of emotion you're after tonight.",
        },
        {
          heading: 'Crying together brings you closer',
          body: 'Watching a sad film as a couple or with a close friend creates a rare moment of intimacy. Start a room for two: you swipe on the tearjerker selection and match on the film that will destroy you both. Bonus: it\'s the perfect excuse for a cuddle on the couch.',
        },
      ],
      es: [
        {
          heading: 'Los tira-lágrimas imprescindibles',
          body: 'Algunos títulos se han vuelto referencias absolutas del género. Hachiko (la lealtad de un perro tras la muerte de su dueño), La milla verde (la inocencia frente a la pena de muerte), Marley y yo (toda una vida en familia con un perro), Titanic (el amor y la pérdida) — imposible verlas sin derrumbarse. Añade Mensaje en una botella, Bajo la misma estrella o Si decido quedarme para perfiles romance.',
        },
        {
          heading: '¿Drama desgarrador o romance demoledor?',
          body: 'No todos los tira-lágrimas encajan con el mismo estado de ánimo. Los dramas desgarradores (La milla verde, Philadelphia, La vida es bella) juegan con la injusticia y el sacrificio. Los romances demoledores (Titanic, Bajo la misma estrella, La La Land) con el amor imposible o perdido. Swipe Movie te deja ponderar ambos: deslizas y la selección se ajusta al tipo de emoción que buscas esta noche.',
        },
        {
          heading: 'Llorar juntos acerca',
          body: 'Ver una película triste en pareja o con un amigo cercano crea un momento de complicidad poco común. Abre una sala de dos: deslizáis en la selección tira-lágrimas y hacéis match en la película que os va a destrozar a ambos. Bonus: es la excusa perfecta para un abrazo en el sofá.',
        },
      ],
      de: [
        {
          heading: 'Die unverzichtbaren Tränendrücker',
          body: 'Manche Titel sind zu absoluten Referenzen des Genres geworden. Hachiko (die Treue eines Hundes nach dem Tod seines Herrchens), The Green Mile (Unschuld angesichts der Todesstrafe), Marley & Me (ein ganzes Familienleben mit einem Hund), Titanic (Liebe und Verlust) — unmöglich, sie ohne Zusammenbruch zu schauen. Dazu Message in a Bottle, Das Schicksal ist ein mieser Verräter oder Wenn ich bleibe für Romance-Profile.',
        },
        {
          heading: 'Ergreifendes Drama oder herzzerreißende Romanze?',
          body: 'Nicht jeder Tränendrücker passt zur selben Stimmung. Ergreifende Dramen (The Green Mile, Philadelphia, Das Leben ist schön) spielen mit Ungerechtigkeit und Opfer. Herzzerreißende Romanzen (Titanic, Das Schicksal ist ein mieser Verräter, La La Land) mit unmöglicher oder verlorener Liebe. Swipe Movie lässt dich beide gewichten: Du swipst, und die Auswahl passt sich der Emotion an, die du heute Abend suchst.',
        },
        {
          heading: 'Gemeinsam weinen verbindet',
          body: 'Einen traurigen Film als Paar oder mit einem engen Freund zu schauen schafft einen seltenen Moment der Verbundenheit. Starte einen Raum für zwei: Ihr swipt durch die Tränendrücker-Auswahl und matched auf den Film, der euch beide zerstören wird. Bonus: die perfekte Ausrede für eine Kuscheleinheit auf dem Sofa.',
        },
      ],
      it: [
        {
          heading: 'Gli strappalacrime imprescindibili',
          body: "Alcuni titoli sono diventati riferimenti assoluti del genere. Hachiko (la fedeltà di un cane dopo la morte del padrone), Il miglio verde (l'innocenza davanti alla pena di morte), Io & Marley (un'intera vita di famiglia con un cane), Titanic (l'amore e la perdita) — impossibile guardarli senza crollare. Aggiungi Le pagine della nostra vita, Colpa delle stelle o Se resto per i profili romance.",
        },
        {
          heading: 'Dramma struggente o romance straziante?',
          body: "Non tutti gli strappalacrime si adattano allo stesso umore. I drammi struggenti (Il miglio verde, Philadelphia, La vita è bella) giocano sull'ingiustizia e il sacrificio. I romance strazianti (Titanic, Colpa delle stelle, La La Land) sull'amore impossibile o perduto. Swipe Movie ti lascia pesare entrambi: swippi, e la selezione si adatta al tipo di emozione che cerchi stasera.",
        },
        {
          heading: 'Piangere insieme avvicina',
          body: "Guardare un film triste in coppia o con un amico stretto crea un raro momento di intimità. Apri una room a due: swippate sulla selezione strappalacrime e matchate sul film che vi distruggerà entrambi. Bonus: è la scusa perfetta per una coccola sul divano.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quel est le meilleur film pour pleurer ?',
          answer:
            "Difficile d'en désigner un seul, mais Hachiko, La Ligne verte, Marley & Me et Titanic sont les tire-larmes les plus cités. Lance une room Swipe Movie sur la sélection \"film pour pleurer\" et matche sur celui qui correspond à ton humeur du soir.",
        },
        {
          question: 'Pourquoi ça fait du bien de pleurer devant un film ?',
          answer:
            "C'est une catharsis : pleurer devant une fiction libère des tensions sans le poids du réel. Beaucoup de gens cherchent volontairement un film triste après une semaine difficile — c'est une façon saine d'évacuer ses émotions.",
        },
        {
          question: 'Ces films sont-ils dispos sur Netflix ou Prime ?',
          answer:
            "La sélection vient du catalogue TMDb, mais la disponibilité dépend de ta région et de tes abonnements. Swipe Movie t'indique sur quelle plateforme (Netflix, Prime, Disney+...) chaque film matché est regardable chez toi.",
        },
      ],
      en: [
        {
          question: "What's the best movie to cry to?",
          answer:
            'Hard to name just one, but Hachi, The Green Mile, Marley & Me and Titanic are the most-cited tearjerkers. Start a Swipe Movie room on the "movies to cry to" selection and match on the one that fits your mood tonight.',
        },
        {
          question: 'Why does crying at a film feel good?',
          answer:
            "It's catharsis: crying at fiction releases tension without the weight of real life. Many people deliberately seek out a sad film after a hard week — it's a healthy way to let emotions out.",
        },
        {
          question: 'Are these films available on Netflix or Prime?',
          answer:
            'The selection comes from the TMDb catalog, but availability depends on your region and subscriptions. Swipe Movie shows you which platform (Netflix, Prime, Disney+...) each matched film is watchable on where you are.',
        },
      ],
      es: [
        {
          question: '¿Cuál es la mejor película para llorar?',
          answer:
            'Difícil elegir una sola, pero Hachiko, La milla verde, Marley y yo y Titanic son los tira-lágrimas más citados. Abre una sala Swipe Movie en la selección "película para llorar" y haz match en la que encaje con tu estado de ánimo de esta noche.',
        },
        {
          question: '¿Por qué sienta bien llorar con una película?',
          answer:
            'Es catarsis: llorar con la ficción libera tensión sin el peso de la vida real. Mucha gente busca a propósito una película triste tras una semana dura — es una forma sana de soltar las emociones.',
        },
        {
          question: '¿Están estas películas en Netflix o Prime?',
          answer:
            'La selección viene del catálogo de TMDb, pero la disponibilidad depende de tu región y tus suscripciones. Swipe Movie te indica en qué plataforma (Netflix, Prime, Disney+...) puedes ver cada película matcheada donde estés.',
        },
      ],
      de: [
        {
          question: 'Was ist der beste Film zum Weinen?',
          answer:
            'Schwer, nur einen zu nennen, aber Hachiko, The Green Mile, Marley & Me und Titanic sind die meistgenannten Tränendrücker. Starte einen Swipe-Movie-Raum auf der Auswahl „Film zum Weinen“ und matche auf den, der zu deiner Stimmung heute Abend passt.',
        },
        {
          question: 'Warum tut es gut, bei einem Film zu weinen?',
          answer:
            'Es ist Katharsis: Bei Fiktion zu weinen löst Spannung, ohne das Gewicht des echten Lebens. Viele suchen nach einer harten Woche bewusst einen traurigen Film — eine gesunde Art, Emotionen rauszulassen.',
        },
        {
          question: 'Sind diese Filme auf Netflix oder Prime verfügbar?',
          answer:
            'Die Auswahl stammt aus dem TMDb-Katalog, aber die Verfügbarkeit hängt von deiner Region und deinen Abos ab. Swipe Movie zeigt dir, auf welcher Plattform (Netflix, Prime, Disney+...) jeder gematchte Film bei dir schaubar ist.',
        },
      ],
      it: [
        {
          question: 'Qual è il miglior film per piangere?',
          answer:
            'Difficile sceglierne uno solo, ma Hachiko, Il miglio verde, Io & Marley e Titanic sono gli strappalacrime più citati. Apri una room Swipe Movie sulla selezione "film per piangere" e matcha su quello adatto al tuo umore di stasera.',
        },
        {
          question: 'Perché fa bene piangere davanti a un film?',
          answer:
            "È catarsi: piangere davanti alla finzione libera tensione senza il peso della vita reale. Molti cercano apposta un film triste dopo una settimana difficile — è un modo sano di sfogare le emozioni.",
        },
        {
          question: 'Questi film sono disponibili su Netflix o Prime?',
          answer:
            'La selezione viene dal catalogo TMDb, ma la disponibilità dipende dalla tua regione e dai tuoi abbonamenti. Swipe Movie ti indica su quale piattaforma (Netflix, Prime, Disney+...) ogni film matchato è guardabile da te.',
        },
      ],
    },
  }),

  'film-histoire-vraie': entry({
    slug: 'film-histoire-vraie',
    genreIds: [18, 36, 80],
    minRating: 6.8,
    relatedGenres: ['drame', 'histoire', 'crime'],
    relatedProviders: ['netflix', 'prime-video', 'max'],
    title: {
      fr: "Films basés sur une histoire vraie : les incontournables",
      en: 'Movies based on a true story: the must-sees',
      es: 'Películas basadas en hechos reales: las imprescindibles',
      de: 'Filme nach wahren Begebenheiten: die Must-sees',
      it: 'Film basati su una storia vera: gli imperdibili',
    },
    description: {
      fr: "Les meilleurs films basés sur une histoire vraie : drames, biopics, faits réels et scandales. Sélection notée 6.8+ sur TMDb. Le réel dépasse souvent la fiction.",
      en: 'The best movies based on a true story: dramas, biopics, real events and scandals. Selection rated 6.8+ on TMDb. Truth is often stranger than fiction.',
      es: 'Las mejores películas basadas en hechos reales: dramas, biopics, sucesos y escándalos. Selección con nota 6.8+ en TMDb. La realidad supera a la ficción.',
      de: 'Die besten Filme nach wahren Begebenheiten: Dramen, Biopics, reale Ereignisse und Skandale. Auswahl mit 6.8+ auf TMDb. Wahrheit schlägt oft die Fiktion.',
      it: 'I migliori film basati su una storia vera: drammi, biopic, fatti reali e scandali. Selezione valutata 6.8+ su TMDb. La realtà supera spesso la finzione.',
    },
    intro: {
      fr: "Il y a quelque chose de plus puissant dans un film quand on sait que \"c'est vraiment arrivé\". Les histoires vraies ajoutent un poids que la fiction pure n'atteint pas toujours : on sait que ces gens ont existé, que ces injustices ont eu lieu, que ce courage était réel.\n\nCette sélection regroupe les meilleurs films basés sur des faits réels, tous notés au moins 6.8 sur TMDb. Le Loup de Wall Street (l'ascension et la chute de Jordan Belfort), 12 Years a Slave (l'esclavage raconté de l'intérieur), Spotlight (l'enquête qui a fait tomber l'Église de Boston), Le Discours d'un roi (un monarque face à son bégaiement)... Lance une room et plonge dans des récits que personne n'aurait osé inventer.",
      en: "There's something more powerful about a film when you know it \"really happened\". True stories carry a weight that pure fiction doesn't always reach: you know these people existed, these injustices took place, this courage was real.\n\nThis selection gathers the best films based on real events, all rated at least 6.8 on TMDb. The Wolf of Wall Street (the rise and fall of Jordan Belfort), 12 Years a Slave (slavery told from within), Spotlight (the investigation that brought down the Boston Church), The King's Speech (a monarch facing his stammer)... Start a room and dive into stories no one would have dared to invent.",
      es: 'Hay algo más poderoso en una película cuando sabes que "ocurrió de verdad". Las historias reales cargan un peso que la ficción pura no siempre alcanza: sabes que esa gente existió, que esas injusticias pasaron, que ese coraje fue real.\n\nEsta selección reúne las mejores películas basadas en hechos reales, todas con nota mínima 6.8 en TMDb. El lobo de Wall Street (el ascenso y caída de Jordan Belfort), 12 años de esclavitud (la esclavitud contada desde dentro), Spotlight (la investigación que tumbó a la Iglesia de Boston), El discurso del rey (un monarca frente a su tartamudez)... Abre una sala y sumérgete en relatos que nadie se habría atrevido a inventar.',
      de: 'Ein Film hat etwas Stärkeres, wenn man weiß, dass es „wirklich passiert ist“. Wahre Geschichten tragen ein Gewicht, das reine Fiktion nicht immer erreicht: Man weiß, dass diese Menschen existierten, diese Ungerechtigkeiten geschahen, dieser Mut echt war.\n\nDiese Auswahl versammelt die besten Filme nach realen Ereignissen, alle mit mindestens 6.8 auf TMDb. The Wolf of Wall Street (Aufstieg und Fall von Jordan Belfort), 12 Years a Slave (Sklaverei von innen erzählt), Spotlight (die Recherche, die die Kirche von Boston zu Fall brachte), The King\'s Speech (ein Monarch im Kampf mit seinem Stottern)... Starte einen Raum und tauche in Geschichten ein, die sich niemand zu erfinden gewagt hätte.',
      it: "C'è qualcosa di più potente in un film quando sai che \"è successo davvero\". Le storie vere portano un peso che la finzione pura non sempre raggiunge: sai che quelle persone sono esistite, che quelle ingiustizie sono accadute, che quel coraggio era reale.\n\nQuesta selezione raccoglie i migliori film basati su fatti reali, tutti valutati almeno 6.8 su TMDb. The Wolf of Wall Street (ascesa e caduta di Jordan Belfort), 12 anni schiavo (la schiavitù raccontata dall'interno), Il caso Spotlight (l'inchiesta che fece cadere la Chiesa di Boston), Il discorso del re (un monarca alle prese con la balbuzie)... Apri una room e immergiti in racconti che nessuno avrebbe osato inventare.",
    },
    sections: {
      fr: [
        {
          heading: 'Biopic, fait divers ou enquête ?',
          body: "Le \"basé sur une histoire vraie\" couvre des registres très différents. Les biopics retracent une vie (Le Loup de Wall Street, Bohemian Rhapsody, Le Discours d'un roi). Les faits divers reconstituent un événement (127 Heures, Sully, Captain Phillips). Les films d'enquête démontent une affaire (Spotlight, Les Hommes du président, Le Stratège). Swipe Movie te laisse pondérer le registre que tu préfères ce soir.",
        },
        {
          heading: 'Quand le réel dépasse la fiction',
          body: "Certains films sont presque incroyables alors qu'ils sont vrais. L'arnaque de Jordan Belfort dans Le Loup de Wall Street, l'évasion d'Argo, la survie d'Aron Ralston dans 127 Heures, l'amerrissage du vol 1549 dans Sully — autant d'histoires qu'aucun scénariste n'aurait osé écrire. C'est ce qui rend le genre si addictif.",
        },
        {
          heading: 'À regarder seul ou pour lancer le débat',
          body: "Les films d'histoire vraie sont parfaits pour une soirée à plusieurs : ils déclenchent presque toujours une discussion après le générique (\"c'était vraiment comme ça ?\", \"qu'est-ce qu'ils sont devenus ?\"). Lance une room avec des amis ou ton partenaire, matchez sur un fait réel marquant, et gardez Wikipédia ouvert pour la suite.",
        },
      ],
      en: [
        {
          heading: 'Biopic, true crime or investigation?',
          body: '"Based on a true story" spans very different registers. Biopics trace a life (The Wolf of Wall Street, Bohemian Rhapsody, The King\'s Speech). True-event films reconstruct a moment (127 Hours, Sully, Captain Phillips). Investigation films unpack a case (Spotlight, All the President\'s Men, Moneyball). Swipe Movie lets you weight the register you prefer tonight.',
        },
        {
          heading: 'When reality outdoes fiction',
          body: "Some films are almost unbelievable yet true. Jordan Belfort's scam in The Wolf of Wall Street, the escape in Argo, Aron Ralston's survival in 127 Hours, the ditching of Flight 1549 in Sully — stories no screenwriter would have dared to write. That's what makes the genre so addictive.",
        },
        {
          heading: 'Watch alone or to spark debate',
          body: 'True-story films are perfect for a group night: they almost always trigger a discussion after the credits ("was it really like that?", "what happened to them?"). Start a room with friends or your partner, match on a striking real event, and keep Wikipedia open for the aftermath.',
        },
      ],
      es: [
        {
          heading: '¿Biopic, crimen real o investigación?',
          body: 'El "basado en hechos reales" abarca registros muy distintos. Los biopics trazan una vida (El lobo de Wall Street, Bohemian Rhapsody, El discurso del rey). Los sucesos reconstruyen un momento (127 horas, Sully, Capitán Phillips). Las películas de investigación desmontan un caso (Spotlight, Todos los hombres del presidente, Moneyball). Swipe Movie te deja ponderar el registro que prefieras esta noche.',
        },
        {
          heading: 'Cuando la realidad supera a la ficción',
          body: 'Algunas películas son casi increíbles y sin embargo ciertas. La estafa de Jordan Belfort en El lobo de Wall Street, la huida de Argo, la supervivencia de Aron Ralston en 127 horas, el amerizaje del vuelo 1549 en Sully — historias que ningún guionista se habría atrevido a escribir. Eso es lo que hace el género tan adictivo.',
        },
        {
          heading: 'Para ver solo o para abrir debate',
          body: 'Las películas basadas en hechos reales son perfectas para una noche en grupo: casi siempre desatan una conversación tras los créditos ("¿fue de verdad así?", "¿qué fue de ellos?"). Abre una sala con amigos o tu pareja, haced match en un suceso real impactante, y deja Wikipedia abierta para después.',
        },
      ],
      de: [
        {
          heading: 'Biopic, True Crime oder Recherche?',
          body: '„Nach einer wahren Geschichte“ umfasst sehr unterschiedliche Register. Biopics zeichnen ein Leben nach (The Wolf of Wall Street, Bohemian Rhapsody, The King\'s Speech). Tatsachenfilme rekonstruieren einen Moment (127 Hours, Sully, Captain Phillips). Recherchefilme zerlegen einen Fall (Spotlight, Die Unbestechlichen, Moneyball). Swipe Movie lässt dich das Register gewichten, das du heute Abend bevorzugst.',
        },
        {
          heading: 'Wenn die Realität die Fiktion übertrifft',
          body: 'Manche Filme sind fast unglaublich und doch wahr. Jordan Belforts Betrug in The Wolf of Wall Street, die Flucht in Argo, Aron Ralstons Überleben in 127 Hours, die Notwasserung von Flug 1549 in Sully — Geschichten, die kein Drehbuchautor zu schreiben gewagt hätte. Genau das macht das Genre so süchtig.',
        },
        {
          heading: 'Allein schauen oder die Debatte starten',
          body: 'Filme nach wahren Begebenheiten sind perfekt für einen Gruppenabend: Sie lösen fast immer eine Diskussion nach dem Abspann aus („war das wirklich so?“, „was wurde aus ihnen?“). Starte einen Raum mit Freunden oder deinem Partner, matche auf ein eindrückliches reales Ereignis und halte Wikipedia für danach offen.',
        },
      ],
      it: [
        {
          heading: 'Biopic, true crime o inchiesta?',
          body: 'Il "basato su una storia vera" copre registri molto diversi. I biopic ripercorrono una vita (The Wolf of Wall Street, Bohemian Rhapsody, Il discorso del re). I fatti reali ricostruiscono un momento (127 ore, Sully, Captain Phillips). I film d\'inchiesta smontano un caso (Il caso Spotlight, Tutti gli uomini del presidente, L\'arte di vincere). Swipe Movie ti lascia pesare il registro che preferisci stasera.',
        },
        {
          heading: 'Quando la realtà supera la finzione',
          body: "Alcuni film sono quasi incredibili eppure veri. La truffa di Jordan Belfort in The Wolf of Wall Street, la fuga di Argo, la sopravvivenza di Aron Ralston in 127 ore, l'ammaraggio del volo 1549 in Sully — storie che nessuno sceneggiatore avrebbe osato scrivere. È questo che rende il genere così avvincente.",
        },
        {
          heading: 'Da guardare da soli o per aprire il dibattito',
          body: 'I film tratti da storie vere sono perfetti per una serata in gruppo: scatenano quasi sempre una discussione dopo i titoli di coda ("era davvero così?", "che fine hanno fatto?"). Apri una room con amici o il tuo partner, matchate su un fatto reale marcante, e tieni Wikipedia aperta per dopo.',
        },
      ],
    },
    faq: {
      fr: [
        {
          question: 'Quels sont les meilleurs films basés sur une histoire vraie ?',
          answer:
            "Parmi les plus salués : Le Loup de Wall Street, 12 Years a Slave, Spotlight, Le Discours d'un roi, Sully ou 127 Heures. Lance une room Swipe Movie sur la sélection \"histoire vraie\" et matche sur celui qui t'intrigue le plus.",
        },
        {
          question: '"Basé sur une histoire vraie" veut dire que tout est vrai ?',
          answer:
            "Pas toujours. La plupart des films prennent des libertés (dialogues recréés, personnages fusionnés, raccourcis dramatiques) tout en respectant la trame réelle. C'est \"inspiré de\" plutôt que documentaire — le générique précise souvent le degré de fidélité.",
        },
        {
          question: 'Où regarder ces films ?',
          answer:
            "La sélection est issue du catalogue TMDb ; la disponibilité varie selon ta région et tes abonnements. Swipe Movie t'indique pour chaque film matché la plateforme (Netflix, Prime, Max...) où le regarder chez toi.",
        },
      ],
      en: [
        {
          question: 'What are the best movies based on a true story?',
          answer:
            'Among the most acclaimed: The Wolf of Wall Street, 12 Years a Slave, Spotlight, The King\'s Speech, Sully or 127 Hours. Start a Swipe Movie room on the "true story" selection and match on the one that intrigues you most.',
        },
        {
          question: 'Does "based on a true story" mean everything is true?',
          answer:
            'Not always. Most films take liberties (recreated dialogue, merged characters, dramatic shortcuts) while respecting the real arc. It\'s "inspired by" rather than documentary — the credits often state how faithful it is.',
        },
        {
          question: 'Where can I watch these films?',
          answer:
            'The selection comes from the TMDb catalog; availability varies by region and subscriptions. For each matched film, Swipe Movie shows the platform (Netflix, Prime, Max...) where you can watch it where you are.',
        },
      ],
      es: [
        {
          question: '¿Cuáles son las mejores películas basadas en hechos reales?',
          answer:
            'Entre las más aclamadas: El lobo de Wall Street, 12 años de esclavitud, Spotlight, El discurso del rey, Sully o 127 horas. Abre una sala Swipe Movie en la selección "hechos reales" y haz match en la que más te intrigue.',
        },
        {
          question: '¿"Basada en hechos reales" significa que todo es verdad?',
          answer:
            'No siempre. La mayoría de las películas se toman licencias (diálogos recreados, personajes fusionados, atajos dramáticos) respetando la trama real. Es "inspirada en" más que un documental — los créditos suelen aclarar el grado de fidelidad.',
        },
        {
          question: '¿Dónde ver estas películas?',
          answer:
            'La selección viene del catálogo de TMDb; la disponibilidad varía según tu región y tus suscripciones. Para cada película matcheada, Swipe Movie te indica la plataforma (Netflix, Prime, Max...) donde verla donde estés.',
        },
      ],
      de: [
        {
          question: 'Was sind die besten Filme nach einer wahren Geschichte?',
          answer:
            'Zu den gefeiertsten zählen: The Wolf of Wall Street, 12 Years a Slave, Spotlight, The King\'s Speech, Sully oder 127 Hours. Starte einen Swipe-Movie-Raum auf der Auswahl „wahre Geschichte“ und matche auf den, der dich am meisten reizt.',
        },
        {
          question: 'Heißt „nach einer wahren Geschichte“, dass alles wahr ist?',
          answer:
            'Nicht immer. Die meisten Filme nehmen sich Freiheiten (nachgestellte Dialoge, zusammengelegte Figuren, dramatische Abkürzungen), achten aber auf den realen Verlauf. Es ist „inspiriert von“ statt Dokumentation — der Abspann nennt oft den Grad der Treue.',
        },
        {
          question: 'Wo kann ich diese Filme schauen?',
          answer:
            'Die Auswahl stammt aus dem TMDb-Katalog; die Verfügbarkeit variiert je nach Region und Abos. Für jeden gematchten Film zeigt dir Swipe Movie die Plattform (Netflix, Prime, Max...), auf der du ihn bei dir schauen kannst.',
        },
      ],
      it: [
        {
          question: 'Quali sono i migliori film basati su una storia vera?',
          answer:
            'Tra i più acclamati: The Wolf of Wall Street, 12 anni schiavo, Il caso Spotlight, Il discorso del re, Sully o 127 ore. Apri una room Swipe Movie sulla selezione "storia vera" e matcha su quello che ti incuriosisce di più.',
        },
        {
          question: '"Basato su una storia vera" vuol dire che è tutto vero?',
          answer:
            'Non sempre. La maggior parte dei film si prende licenze (dialoghi ricreati, personaggi fusi, scorciatoie drammatiche) rispettando la trama reale. È "ispirato a" più che un documentario — i titoli di coda spesso chiariscono il grado di fedeltà.',
        },
        {
          question: 'Dove guardare questi film?',
          answer:
            'La selezione viene dal catalogo TMDb; la disponibilità varia per regione e abbonamenti. Per ogni film matchato, Swipe Movie ti indica la piattaforma (Netflix, Prime, Max...) dove guardarlo da te.',
        },
      ],
    },
  }),

  'film-action-adrenaline': entry({
    slug: 'film-action-adrenaline',
    genreIds: [28, 53, 12],
    minRating: 6.5,
    relatedGenres: ['action', 'thriller', 'aventure'],
    relatedProviders: ['netflix', 'prime-video', 'max'],
    title: {
      fr: "Films d'action : les meilleurs pour une dose d'adrénaline",
      en: 'Action movies: the best for an adrenaline hit',
      es: 'Películas de acción: las mejores para una dosis de adrenalina',
      de: 'Actionfilme: die besten für einen Adrenalin-Kick',
      it: "Film d'azione: i migliori per una dose di adrenalina",
    },
    description: {
      fr: "Les meilleurs films d'action pour une montée d'adrénaline : courses-poursuites, fusillades, cascades dingues. Action, thriller, aventure notés 6.5+ sur TMDb.",
      en: 'The best action movies for a guaranteed adrenaline rush: car chases, shootouts, insane stunts. Action, thriller and adventure rated 6.5+ on TMDb.',
      es: 'Las mejores películas de acción para una subida de adrenalina: persecuciones, tiroteos, acrobacias de locura. Acción, thriller, aventura con nota 6.5+ en TMDb.',
      de: 'Die besten Actionfilme für einen Adrenalinschub: Verfolgungsjagden, Schießereien, irre Stunts. Action, Thriller, Abenteuer mit 6.5+ auf TMDb.',
      it: "I migliori film d'azione per una scarica di adrenalina: inseguimenti, sparatorie, stunt folli. Azione, thriller, avventura valutati 6.5+ su TMDb.",
    },
    intro: {
      fr: "Parfois tu n'as pas envie de réfléchir, tu veux juste te prendre une claque visuelle : des poursuites, des explosions, des cascades qui défient la mort et un rythme qui ne lâche jamais. Le film d'action, c'est la montée d'adrénaline garantie, le pop-corn movie qui te scotche au canapé.\n\nCette sélection regroupe les meilleurs films d'action, tous notés au moins 6.5 sur TMDb. Mad Max: Fury Road (la course-poursuite la plus folle jamais filmée), John Wick (le ballet de gunfights le plus stylé), Mission: Impossible (Tom Cruise qui risque sa vie pour de vrai), Top Gun: Maverick (le dogfight aérien ultime)... Lance une room, swipe, et choisis ta dose d'adrénaline du soir.",
      en: "Sometimes you don't want to think, you just want a visual punch: chases, explosions, death-defying stunts and a pace that never lets up. The action movie is the guaranteed adrenaline rush, the popcorn movie that glues you to the couch.\n\nThis selection gathers the best action films, all rated at least 6.5 on TMDb. Mad Max: Fury Road (the wildest chase ever filmed), John Wick (the most stylish gunfight ballet), Mission: Impossible (Tom Cruise risking his life for real), Top Gun: Maverick (the ultimate aerial dogfight)... Start a room, swipe, and pick tonight's adrenaline hit.",
      es: "A veces no te apetece pensar, solo quieres un puñetazo visual: persecuciones, explosiones, acrobacias que desafían la muerte y un ritmo que no afloja. La película de acción es la subida de adrenalina garantizada, el peliculón de palomitas que te clava al sofá.\n\nEsta selección reúne las mejores películas de acción, todas con nota mínima 6.5 en TMDb. Mad Max: Furia en la carretera (la persecución más loca jamás rodada), John Wick (el ballet de tiroteos más estiloso), Misión Imposible (Tom Cruise jugándose la vida de verdad), Top Gun: Maverick (el combate aéreo definitivo)... Abre una sala, desliza y elige tu dosis de adrenalina de la noche.",
      de: "Manchmal willst du nicht nachdenken, du willst nur einen visuellen Schlag: Verfolgungsjagden, Explosionen, todesmutige Stunts und ein Tempo, das nie nachlässt. Der Actionfilm ist der garantierte Adrenalinschub, der Popcorn-Film, der dich aufs Sofa nagelt.\n\nDiese Auswahl versammelt die besten Actionfilme, alle mit mindestens 6.5 auf TMDb. Mad Max: Fury Road (die wildeste je gefilmte Verfolgungsjagd), John Wick (das stilvollste Gunfight-Ballett), Mission: Impossible (Tom Cruise riskiert echt sein Leben), Top Gun: Maverick (der ultimative Luftkampf)... Starte einen Raum, swipe und wähle deinen Adrenalin-Kick für heute Abend.",
      it: "A volte non hai voglia di pensare, vuoi solo un pugno visivo: inseguimenti, esplosioni, stunt che sfidano la morte e un ritmo che non molla mai. Il film d'azione è la scarica di adrenalina garantita, il popcorn movie che ti inchioda al divano.\n\nQuesta selezione raccoglie i migliori film d'azione, tutti valutati almeno 6.5 su TMDb. Mad Max: Fury Road (l'inseguimento più folle mai filmato), John Wick (il balletto di sparatorie più stiloso), Mission: Impossible (Tom Cruise che rischia la vita davvero), Top Gun: Maverick (il duello aereo definitivo)... Apri una room, swippa e scegli la tua dose di adrenalina della serata.",
    },
    sections: {
      fr: [
        {
          heading: 'Action pure, thriller nerveux ou blockbuster ?',
          body: "Tous les films d'action ne donnent pas la même montée. L'action pure mise sur les cascades et le rythme (Mad Max: Fury Road, John Wick, The Raid). Le thriller nerveux ajoute la tension et le suspense (Heat, Sicario, Mission: Impossible). Le blockbuster spectaculaire vise le grand divertissement (Top Gun: Maverick, Mad Max, les Marvel). Swipe Movie te laisse pondérer ces nuances selon ton envie du soir.",
        },
        {
          heading: 'Les films d\'action récents qui valent le coup',
          body: "Le genre s'est renouvelé ces dernières années. Top Gun: Maverick a relancé le blockbuster aérien, la saga John Wick a redéfini la chorégraphie de combat, Mad Max: Fury Road reste une référence visuelle, et les derniers Mission: Impossible repoussent les limites des cascades réelles. Tous notés haut sur TMDb et plébiscités par les amateurs d'action.",
        },
        {
          heading: 'Le film d\'action, roi des soirées entre amis',
          body: "L'action est l'un des genres qui matchent le plus vite en groupe : pas besoin d'être d'humeur particulière pour apprécier une bonne course-poursuite. Lance une room avec tes potes, swipez sur la sélection adrénaline, et matchez sur un film qui mettra tout le monde d'accord — idéal aussi avec de la pizza et une bière.",
        },
      ],
      en: [
        {
          heading: 'Pure action, tense thriller or blockbuster?',
          body: "Not every action film delivers the same rush. Pure action leans on stunts and pace (Mad Max: Fury Road, John Wick, The Raid). The tense thriller adds suspense (Heat, Sicario, Mission: Impossible). The spectacle blockbuster aims for big entertainment (Top Gun: Maverick, Mad Max, the Marvels). Swipe Movie lets you weight these nuances depending on tonight's craving.",
        },
        {
          heading: 'Recent action films worth your time',
          body: 'The genre has reinvented itself in recent years. Top Gun: Maverick revived the aerial blockbuster, the John Wick saga redefined fight choreography, Mad Max: Fury Road remains a visual benchmark, and the latest Mission: Impossible entries push real-stunt limits. All rated high on TMDb and championed by action fans.',
        },
        {
          heading: 'The action movie, king of nights with friends',
          body: "Action is one of the fastest-matching genres in a group: you don't need a particular mood to enjoy a great chase. Start a room with your friends, swipe on the adrenaline selection, and match on a film everyone agrees on — also ideal with pizza and a beer.",
        },
      ],
      es: [
        {
          heading: '¿Acción pura, thriller tenso o blockbuster?',
          body: 'No toda película de acción da la misma subida. La acción pura apuesta por las acrobacias y el ritmo (Mad Max: Furia en la carretera, John Wick, The Raid). El thriller tenso añade suspense (Heat, Sicario, Misión Imposible). El blockbuster espectacular busca el gran entretenimiento (Top Gun: Maverick, Mad Max, las de Marvel). Swipe Movie te deja ponderar estos matices según tu antojo de la noche.',
        },
        {
          heading: 'Películas de acción recientes que valen la pena',
          body: 'El género se ha reinventado en los últimos años. Top Gun: Maverick relanzó el blockbuster aéreo, la saga John Wick redefinió la coreografía de combate, Mad Max: Furia en la carretera sigue siendo un referente visual, y las últimas Misión Imposible llevan al límite las acrobacias reales. Todas con nota alta en TMDb y aclamadas por los fans de la acción.',
        },
        {
          heading: 'La película de acción, reina de las noches entre amigos',
          body: 'La acción es uno de los géneros que más rápido matchean en grupo: no hace falta un estado de ánimo concreto para disfrutar una buena persecución. Abre una sala con tus colegas, deslizad en la selección de adrenalina, y haced match en una película que ponga a todos de acuerdo — ideal también con pizza y cerveza.',
        },
      ],
      de: [
        {
          heading: 'Reine Action, nervenaufreibender Thriller oder Blockbuster?',
          body: 'Nicht jeder Actionfilm liefert denselben Kick. Reine Action setzt auf Stunts und Tempo (Mad Max: Fury Road, John Wick, The Raid). Der nervenaufreibende Thriller fügt Spannung hinzu (Heat, Sicario, Mission: Impossible). Der spektakuläre Blockbuster zielt auf große Unterhaltung (Top Gun: Maverick, Mad Max, die Marvels). Swipe Movie lässt dich diese Nuancen je nach Lust am Abend gewichten.',
        },
        {
          heading: 'Aktuelle Actionfilme, die sich lohnen',
          body: 'Das Genre hat sich in den letzten Jahren neu erfunden. Top Gun: Maverick belebte den Luft-Blockbuster, die John-Wick-Saga definierte die Kampfchoreografie neu, Mad Max: Fury Road bleibt eine visuelle Referenz, und die neuesten Mission: Impossible loten die Grenzen echter Stunts aus. Alle hoch auf TMDb bewertet und von Action-Fans gefeiert.',
        },
        {
          heading: 'Der Actionfilm, König der Abende mit Freunden',
          body: 'Action ist eines der am schnellsten matchenden Genres in der Gruppe: Du brauchst keine bestimmte Stimmung, um eine großartige Verfolgungsjagd zu genießen. Starte einen Raum mit deinen Freunden, swipt durch die Adrenalin-Auswahl und matched auf einen Film, auf den sich alle einigen — auch ideal mit Pizza und Bier.',
        },
      ],
      it: [
        {
          heading: 'Azione pura, thriller teso o blockbuster?',
          body: "Non ogni film d'azione dà la stessa scarica. L'azione pura punta su stunt e ritmo (Mad Max: Fury Road, John Wick, The Raid). Il thriller teso aggiunge suspense (Heat, Sicario, Mission: Impossible). Il blockbuster spettacolare punta al grande intrattenimento (Top Gun: Maverick, Mad Max, i Marvel). Swipe Movie ti lascia pesare queste sfumature secondo la voglia della serata.",
        },
        {
          heading: "Film d'azione recenti che valgono",
          body: "Il genere si è reinventato negli ultimi anni. Top Gun: Maverick ha rilanciato il blockbuster aereo, la saga di John Wick ha ridefinito la coreografia di combattimento, Mad Max: Fury Road resta un riferimento visivo, e gli ultimi Mission: Impossible spingono al limite gli stunt reali. Tutti valutati alti su TMDb e acclamati dagli appassionati d'azione.",
        },
        {
          heading: "Il film d'azione, re delle serate tra amici",
          body: "L'azione è uno dei generi che matchano più in fretta in gruppo: non serve un umore particolare per godersi un bell'inseguimento. Apri una room con i tuoi amici, swippate sulla selezione adrenalina, e matchate su un film che mette tutti d'accordo — ideale anche con pizza e birra.",
        },
      ],
    },
    faq: {
      fr: [
        {
          question: "Quel est le meilleur film d'action à regarder ?",
          answer:
            "Parmi les références : Mad Max: Fury Road, John Wick, Mission: Impossible et Top Gun: Maverick. Lance une room Swipe Movie sur la sélection \"action adrénaline\" et matche sur celui qui correspond à ton envie — action pure, thriller nerveux ou blockbuster.",
        },
        {
          question: "Quels films d'action récents valent le coup ?",
          answer:
            "Top Gun: Maverick, les derniers John Wick et Mission: Impossible sont parmi les meilleurs films d'action récents, tous notés haut sur TMDb. Swipe Movie filtre la sélection pour ne garder que les films d'action vraiment bien notés.",
        },
        {
          question: 'Où regarder ces films d\'action ?',
          answer:
            "La sélection provient du catalogue TMDb ; la disponibilité dépend de ta région et de tes abonnements. Swipe Movie t'indique pour chaque film matché la plateforme (Netflix, Prime, Max...) où le regarder chez toi.",
        },
      ],
      en: [
        {
          question: "What's the best action movie to watch?",
          answer:
            'Among the references: Mad Max: Fury Road, John Wick, Mission: Impossible and Top Gun: Maverick. Start a Swipe Movie room on the "action adrenaline" selection and match on the one fitting your craving — pure action, tense thriller or blockbuster.',
        },
        {
          question: 'Which recent action films are worth it?',
          answer:
            'Top Gun: Maverick, the latest John Wick and Mission: Impossible entries are among the best recent action films, all rated high on TMDb. Swipe Movie filters the selection to keep only genuinely well-rated action movies.',
        },
        {
          question: 'Where can I watch these action films?',
          answer:
            'The selection comes from the TMDb catalog; availability depends on your region and subscriptions. For each matched film, Swipe Movie shows the platform (Netflix, Prime, Max...) where you can watch it where you are.',
        },
      ],
      es: [
        {
          question: '¿Cuál es la mejor película de acción para ver?',
          answer:
            'Entre las referencias: Mad Max: Furia en la carretera, John Wick, Misión Imposible y Top Gun: Maverick. Abre una sala Swipe Movie en la selección "acción adrenalina" y haz match en la que encaje con tu antojo — acción pura, thriller tenso o blockbuster.',
        },
        {
          question: '¿Qué películas de acción recientes valen la pena?',
          answer:
            'Top Gun: Maverick, las últimas John Wick y Misión Imposible están entre las mejores películas de acción recientes, todas con nota alta en TMDb. Swipe Movie filtra la selección para conservar solo las películas de acción realmente bien valoradas.',
        },
        {
          question: '¿Dónde ver estas películas de acción?',
          answer:
            'La selección viene del catálogo de TMDb; la disponibilidad depende de tu región y tus suscripciones. Para cada película matcheada, Swipe Movie te indica la plataforma (Netflix, Prime, Max...) donde verla donde estés.',
        },
      ],
      de: [
        {
          question: 'Was ist der beste Actionfilm zum Schauen?',
          answer:
            'Zu den Referenzen: Mad Max: Fury Road, John Wick, Mission: Impossible und Top Gun: Maverick. Starte einen Swipe-Movie-Raum auf der Auswahl „Action-Adrenalin“ und matche auf den, der zu deiner Lust passt — reine Action, nervenaufreibender Thriller oder Blockbuster.',
        },
        {
          question: 'Welche aktuellen Actionfilme lohnen sich?',
          answer:
            'Top Gun: Maverick sowie die neuesten John Wick und Mission: Impossible gehören zu den besten aktuellen Actionfilmen, alle hoch auf TMDb bewertet. Swipe Movie filtert die Auswahl, um nur wirklich gut bewertete Actionfilme zu behalten.',
        },
        {
          question: 'Wo kann ich diese Actionfilme schauen?',
          answer:
            'Die Auswahl stammt aus dem TMDb-Katalog; die Verfügbarkeit hängt von deiner Region und deinen Abos ab. Für jeden gematchten Film zeigt dir Swipe Movie die Plattform (Netflix, Prime, Max...), auf der du ihn bei dir schauen kannst.',
        },
      ],
      it: [
        {
          question: "Qual è il miglior film d'azione da guardare?",
          answer:
            'Tra i riferimenti: Mad Max: Fury Road, John Wick, Mission: Impossible e Top Gun: Maverick. Apri una room Swipe Movie sulla selezione "azione adrenalina" e matcha su quello adatto alla tua voglia — azione pura, thriller teso o blockbuster.',
        },
        {
          question: "Quali film d'azione recenti valgono la pena?",
          answer:
            "Top Gun: Maverick, gli ultimi John Wick e Mission: Impossible sono tra i migliori film d'azione recenti, tutti valutati alti su TMDb. Swipe Movie filtra la selezione per tenere solo i film d'azione davvero ben valutati.",
        },
        {
          question: "Dove guardare questi film d'azione?",
          answer:
            'La selezione viene dal catalogo TMDb; la disponibilità dipende dalla tua regione e dai tuoi abbonamenti. Per ogni film matchato, Swipe Movie ti indica la piattaforma (Netflix, Prime, Max...) dove guardarlo da te.',
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
