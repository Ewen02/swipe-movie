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
