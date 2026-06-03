import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { buildLanguageAlternates, SITE_NAME, SITE_URL } from '@/lib/seo';
import { SEOPageTracker } from '@/components/seo/SEOPageTracker';

export const dynamicParams = false;
export const revalidate = 86400;

const PATH = '/guide/choisir-un-film-a-plusieurs';

type Params = { locale: string };

type Section = { heading: string; body: string[] };
type Faq = { question: string; answer: string };
type GuideContent = {
  breadcrumbHome: string;
  breadcrumbGuide: string;
  title: string;
  description: string;
  intro: string[];
  cta: string;
  sections: Section[];
  faqHeading: string;
  faq: Faq[];
  linksHeading: string;
  links: { label: string; href: string }[];
};

const CONTENT: Record<Locale, GuideContent> = {
  fr: {
    breadcrumbHome: 'Accueil',
    breadcrumbGuide: 'Comment choisir un film à plusieurs',
    title: 'Comment choisir un film à plusieurs : le guide complet',
    description:
      "Indécis devant le catalogue ? Notre guide explique comment choisir un film à plusieurs (couple, famille, amis) sans débat sans fin, en moins de 5 minutes.",
    intro: [
      "Vendredi soir, le canapé est prêt, le pop-corn aussi. Reste une seule question, et c'est toujours la même : « On regarde quoi ? » Trente minutes plus tard, vous scrollez encore le catalogue, personne n'est d'accord, et l'envie de regarder un film s'est presque évaporée.",
      "Choisir un film à plusieurs est l'un des petits casse-têtes les plus universels de la vie moderne. Plus il y a de monde, plus il y a de goûts, et plus la décision devient difficile. Ce guide rassemble les méthodes qui fonctionnent vraiment pour trancher vite et bien, que vous soyez deux, en famille ou tout un groupe.",
    ],
    cta: 'Choisir un film maintenant',
    sections: [
      {
        heading: "Pourquoi c'est si difficile de choisir un film à plusieurs",
        body: [
          "Le problème n'est pas le manque de films, c'est l'inverse. Les plateformes proposent des dizaines de milliers de titres, et cette abondance crée ce que les psychologues appellent le « paradoxe du choix » : plus les options sont nombreuses, plus on a peur de se tromper, et moins on arrive à décider. C'est la paralysie du choix.",
          "À plusieurs, ce phénomène est multiplié. Chacun arrive avec ses envies (comédie pour l'un, thriller pour l'autre, rien de trop long pour un troisième) et personne ne veut imposer son choix. On tombe alors dans une négociation polie où tout le monde dit « moi ça m'est égal », alors que ce n'est pas vrai.",
          "S'ajoute la peur du jugement : proposer un film, c'est s'exposer. Si le film est mauvais, on en porte la responsabilité. Résultat, beaucoup préfèrent ne rien proposer plutôt que de risquer un mauvais choix. Comprendre ces mécanismes, c'est déjà la moitié du chemin : le but n'est pas de trouver le film parfait, mais un film que tout le monde accepte volontiers.",
        ],
      },
      {
        heading: 'Méthode 1 : le matching collaboratif (le swipe)',
        body: [
          "C'est l'approche la plus efficace quand vous êtes plusieurs, et c'est exactement ce que propose Swipe Movie. Le principe est emprunté aux applications de rencontre : au lieu de débattre, chacun swipe.",
          "Concrètement, une personne crée une « room » et partage un lien. Chaque participant rejoint la room sur son téléphone et fait défiler les films un par un : à droite si ça l'intéresse, à gauche sinon. Personne ne voit les choix des autres, donc pas de pression sociale ni de jugement.",
          "Dès que tout le monde a aimé le même film, c'est un « match » : l'application le révèle, et vous avez votre gagnant. La décision émerge d'un consensus réel, pas du plus insistant ou du plus timide. Ça marche parce que ça supprime le débat, anonymise les envies, et transforme une corvée en jeu de quelques minutes.",
        ],
      },
      {
        heading: 'Méthode 2 : la présélection',
        body: [
          "Si vous n'utilisez pas d'application, la présélection est la méthode manuelle la plus fiable. L'idée est d'éviter de voter sur l'ensemble du catalogue (impossible) en réduisant d'abord le champ.",
          "Une personne (ou chacun à tour de rôle) propose deux ou trois titres maximum, en tenant compte de l'humeur du soir et de la durée disponible. On obtient une short-list de trois à cinq films. Le groupe vote ensuite uniquement sur cette liste réduite.",
          "L'avantage : choisir entre trois films est infiniment plus facile qu'entre dix mille. L'inconvénient : la qualité dépend de la personne qui présélectionne, et certains goûts peuvent être oubliés dès le départ.",
        ],
      },
      {
        heading: 'Méthode 3 : le tour de rôle',
        body: [
          "Le tour de rôle consiste à laisser chacun choisir à son tour, d'une séance à l'autre. Ce soir c'est toi, la prochaine fois c'est moi. C'est simple, juste sur la durée, et ça évite toute négociation immédiate.",
          "Mais cette méthode a des limites réelles. Elle ne résout pas le choix d'un soir précis : celui dont c'est le tour peut imposer un film que les autres subissent. Elle suppose aussi un groupe stable qui se revoit régulièrement, ce qui n'est pas le cas d'une soirée entre amis ponctuelle. À utiliser entre colocataires ou en couple, moins pour un grand groupe.",
        ],
      },
      {
        heading: 'À deux, en famille, entre amis ou en grand groupe',
        body: [
          "À deux : le risque est la fausse politesse, où chacun attend que l'autre décide. Le matching à deux est idéal car il révèle vos envies communes sans avoir à les verbaliser. Pour une soirée couple, ciblez un film, pas une série, pour rester ensemble jusqu'au bout.",
          "En famille : la contrainte d'âge domine. Présélectionnez des titres adaptés à tous, puis laissez les enfants trancher parmi ces options validées. Ils se sentent impliqués, et vous gardez le contrôle sur le contenu.",
          "Entre amis : les goûts sont les plus éclatés. Le swipe collaboratif brille ici, car il trouve le dénominateur commun sans froisser personne. Évitez les films trop clivants et privilégiez le consensus.",
          "En grand groupe (6 personnes et plus) : le débat est ingérable à l'oral. Une application devient quasi indispensable : chacun swipe en parallèle et le match tombe en quelques minutes, là où une discussion durerait une heure.",
        ],
      },
      {
        heading: 'Comment décider en moins de 5 minutes',
        body: [
          "1. Fixez le cadre en 30 secondes : durée disponible, humeur générale (léger ou intense), plateformes accessibles. Cela élimine déjà la moitié des options.",
          "2. Choisissez une méthode et tenez-vous-y : matching collaboratif si vous êtes plusieurs, présélection à trois titres sinon. Ne mélangez pas tout.",
          "3. Lancez une room sur Swipe Movie, partagez le lien, et laissez chacun swiper sur son téléphone pendant deux minutes.",
          "4. Au premier match, arrêtez-vous. Ne cherchez pas mieux : un film accepté par tous maintenant vaut mieux qu'un film parfait jamais lancé.",
          "5. Appuyez sur lecture. La meilleure soirée film est celle qui commence vraiment, pas celle qui se débat encore à 22h30.",
        ],
      },
      {
        heading: 'Conclusion',
        body: [
          "Choisir un film à plusieurs ne devrait jamais prendre plus longtemps que le générique. Le secret n'est pas de trouver le film idéal, mais d'avoir une méthode qui transforme la décision en moment léger plutôt qu'en négociation.",
          "Le matching collaboratif reste, de loin, la façon la plus rapide et la plus juste d'y parvenir en groupe. Créez une room, partagez le lien, et laissez le consensus faire le travail à votre place.",
        ],
      },
    ],
    faqHeading: 'Questions fréquentes',
    faq: [
      {
        question: "Comment choisir un film quand on n'est pas d'accord ?",
        answer:
          "Plutôt que de débattre, faites swiper chacun de son côté sur les mêmes films : un match apparaît dès que tout le monde aime le même titre. Cette approche, utilisée par Swipe Movie, supprime la négociation et révèle le vrai consensus sans que personne n'impose son choix.",
      },
      {
        question: 'Quelle est la meilleure app pour choisir un film à plusieurs ?',
        answer:
          "Swipe Movie est conçue spécifiquement pour ça : on crée une room, on partage un lien, chacun swipe les films sur son téléphone et l'application affiche un match dès que les envies se rejoignent. C'est plus rapide qu'une discussion et ça fonctionne aussi bien à deux qu'en grand groupe.",
      },
      {
        question: 'Comment choisir un film rapidement ?',
        answer:
          "Fixez d'abord trois contraintes en 30 secondes (durée, humeur, plateforme), puis présélectionnez trois titres maximum ou lancez un match collaboratif. Arrêtez-vous au premier choix accepté par tous : chercher le film parfait est la principale cause de soirées qui ne commencent jamais.",
      },
      {
        question: 'Comment choisir un film en couple ?',
        answer:
          "Le matching à deux est idéal : vous swipez chacun de votre côté et vous découvrez vos envies communes sans avoir à les verbaliser, ce qui évite la fausse politesse du « moi ça m'est égal ». Privilégiez un film à une série pour rester ensemble du début à la fin.",
      },
      {
        question: 'Comment choisir un film en famille avec des enfants ?',
        answer:
          "Présélectionnez d'abord des titres adaptés à l'âge de tous, puis laissez les enfants choisir parmi ces options validées. Ils se sentent impliqués dans la décision tandis que vous gardez le contrôle sur le contenu, le meilleur compromis entre plaisir et sécurité.",
      },
    ],
    linksHeading: 'Pour aller plus loin',
    links: [
      { label: 'Lancer une room et choisir un film', href: '/try' },
      { label: 'Parcourir le catalogue de films', href: '/films' },
      { label: 'Que regarder ce soir ?', href: '/contexte/quoi-regarder-ce-soir' },
      { label: 'Idées de films pour une soirée couple', href: '/contexte/soiree-couple' },
      { label: 'Films à regarder en famille', href: '/contexte/en-famille' },
    ],
  },
  en: {
    breadcrumbHome: 'Home',
    breadcrumbGuide: 'How to pick a movie as a group',
    title: 'How to Choose a Movie as a Group: The Complete Guide',
    description:
      "Can't agree on what to watch? Our guide shows how to choose a movie as a group, couple or family without endless debate, in under 5 minutes.",
    intro: [
      "Friday night, the couch is ready and so is the popcorn. There's just one question left, and it's always the same one: \"What should we watch?\" Thirty minutes later you're still scrolling the catalogue, nobody agrees, and the urge to watch anything at all has nearly faded.",
      "Choosing a movie as a group is one of the most universal little headaches of modern life. The more people involved, the more tastes collide, and the harder the decision gets. This guide gathers the methods that actually work to decide quickly and fairly, whether you're a couple, a family or a whole group.",
    ],
    cta: 'Choose a movie now',
    sections: [
      {
        heading: "Why choosing a movie as a group is so hard",
        body: [
          "The problem isn't a lack of films, it's the opposite. Streaming platforms offer tens of thousands of titles, and that abundance creates what psychologists call the \"paradox of choice\": the more options there are, the more we fear making the wrong call, and the less able we are to decide. It's choice paralysis.",
          "In a group, the effect multiplies. Everyone arrives with their own mood (a comedy for one, a thriller for another, nothing too long for a third) and nobody wants to impose. So we slip into polite negotiation where everyone says \"I don't mind\" even though they do.",
          "Add the fear of judgement: suggesting a film exposes you. If it's bad, you own that. As a result, many people would rather propose nothing than risk a bad pick. Understanding these mechanics is half the battle: the goal isn't to find the perfect film, but one everyone gladly accepts.",
        ],
      },
      {
        heading: 'Method 1: collaborative matching (swiping)',
        body: [
          "This is the most effective approach for a group, and it's exactly what Swipe Movie does. The idea is borrowed from dating apps: instead of debating, everyone swipes.",
          "In practice, one person creates a \"room\" and shares a link. Each participant joins on their phone and goes through films one by one: right if it appeals to them, left if not. Nobody sees anyone else's choices, so there's no social pressure and no judgement.",
          "As soon as everyone has liked the same film, that's a \"match\": the app reveals it and you have your winner. The decision emerges from a real consensus, not from whoever is loudest or shyest. It works because it removes the debate, anonymises preferences, and turns a chore into a game that lasts a few minutes.",
        ],
      },
      {
        heading: 'Method 2: the shortlist',
        body: [
          "If you're not using an app, shortlisting is the most reliable manual method. The idea is to avoid voting on the entire catalogue (impossible) by narrowing the field first.",
          "One person (or each in turn) proposes two or three titles at most, factoring in the mood of the evening and the time available. You end up with a shortlist of three to five films. The group then votes only on that reduced list.",
          "The upside: choosing between three films is infinitely easier than between ten thousand. The downside: quality depends on whoever shortlists, and some tastes may be left out from the start.",
        ],
      },
      {
        heading: 'Method 3: taking turns',
        body: [
          "Taking turns means letting each person choose in rotation, from one session to the next. Tonight it's your pick, next time it's mine. It's simple, fair over time, and avoids any immediate negotiation.",
          "But this method has real limits. It doesn't solve any single given night: whoever's turn it is can impose a film the others merely endure. It also assumes a stable group that meets regularly, which isn't the case for a one-off night with friends. Best used between flatmates or as a couple, less so for a large group.",
        ],
      },
      {
        heading: 'As a couple, a family, with friends or a large group',
        body: [
          "As a couple: the risk is false politeness, each waiting for the other to decide. Matching for two is ideal because it surfaces your shared tastes without having to voice them. For a date night, target a film rather than a series so you stay together to the end.",
          "As a family: age constraints dominate. Shortlist titles suitable for everyone, then let the kids pick from those vetted options. They feel involved while you keep control over the content.",
          "With friends: tastes are at their most scattered. Collaborative swiping shines here because it finds the common denominator without bruising anyone. Avoid divisive films and favour consensus.",
          "In a large group (six or more): debating out loud is unmanageable. An app becomes almost essential: everyone swipes in parallel and the match lands in minutes, where a discussion would drag on for an hour.",
        ],
      },
      {
        heading: 'How to decide in under 5 minutes',
        body: [
          "1. Set the frame in 30 seconds: time available, overall mood (light or intense), accessible platforms. That already eliminates half the options.",
          "2. Pick one method and stick to it: collaborative matching if you're several, a three-title shortlist otherwise. Don't mix everything.",
          "3. Start a room on Swipe Movie, share the link, and let everyone swipe on their phone for two minutes.",
          "4. Stop at the first match. Don't seek better: a film everyone accepts now beats a perfect film that never starts.",
          "5. Press play. The best movie night is the one that actually begins, not the one still being argued at 10:30 pm.",
        ],
      },
      {
        heading: 'Conclusion',
        body: [
          "Choosing a movie as a group should never take longer than the opening credits. The secret isn't finding the ideal film, it's having a method that turns the decision into a light moment rather than a negotiation.",
          "Collaborative matching remains by far the fastest and fairest way to get there as a group. Create a room, share the link, and let consensus do the work for you.",
        ],
      },
    ],
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        question: "How do you choose a movie when you can't agree?",
        answer:
          "Instead of debating, have everyone swipe separately through the same films: a match appears the moment everyone likes the same title. This approach, used by Swipe Movie, removes the negotiation and surfaces the real consensus without anyone imposing their choice.",
      },
      {
        question: 'What is the best app to choose a movie as a group?',
        answer:
          "Swipe Movie is built specifically for this: you create a room, share a link, everyone swipes films on their phone, and the app shows a match as soon as your tastes align. It's faster than a discussion and works just as well for two people as for a large group.",
      },
      {
        question: 'How do you choose a movie quickly?',
        answer:
          "First set three constraints in 30 seconds (length, mood, platform), then shortlist three titles at most or run a collaborative match. Stop at the first pick everyone accepts: hunting for the perfect film is the main reason movie nights never start.",
      },
      {
        question: 'How do you choose a movie as a couple?',
        answer:
          "Matching for two is ideal: you each swipe on your own side and discover your shared tastes without having to voice them, which avoids the false politeness of \"I don't mind\". Favour a film over a series so you stay together from start to finish.",
      },
      {
        question: 'How do you choose a movie for family with kids?',
        answer:
          "First shortlist titles suitable for everyone's age, then let the children pick from those vetted options. They feel part of the decision while you keep control over the content, the best compromise between fun and safety.",
      },
    ],
    linksHeading: 'Keep exploring',
    links: [
      { label: 'Start a room and choose a movie', href: '/try' },
      { label: 'Browse the movie catalogue', href: '/films' },
      { label: 'What to watch tonight?', href: '/contexte/quoi-regarder-ce-soir' },
      { label: 'Movie ideas for a date night', href: '/contexte/soiree-couple' },
      { label: 'Movies to watch with family', href: '/contexte/en-famille' },
    ],
  },
  es: {
    breadcrumbHome: 'Inicio',
    breadcrumbGuide: 'Cómo elegir una película en grupo',
    title: 'Cómo elegir una película en grupo: la guía completa',
    description:
      "¿No os ponéis de acuerdo? Nuestra guía explica cómo elegir una película en grupo, en pareja o en familia sin debates eternos, en menos de 5 minutos.",
    intro: [
      "Viernes por la noche, el sofá está listo y las palomitas también. Solo queda una pregunta, y siempre es la misma: «¿Qué vemos?». Treinta minutos después seguís deslizando el catálogo, nadie se pone de acuerdo y las ganas de ver una película casi se han esfumado.",
      "Elegir una película en grupo es uno de los pequeños quebraderos de cabeza más universales de la vida moderna. Cuanta más gente hay, más gustos chocan y más difícil se vuelve la decisión. Esta guía reúne los métodos que de verdad funcionan para decidir rápido y bien, ya seáis dos, una familia o todo un grupo.",
    ],
    cta: 'Elegir una película ahora',
    sections: [
      {
        heading: 'Por qué cuesta tanto elegir una película en grupo',
        body: [
          "El problema no es la falta de películas, es lo contrario. Las plataformas ofrecen decenas de miles de títulos, y esa abundancia genera lo que los psicólogos llaman la «paradoja de la elección»: cuantas más opciones hay, más miedo tenemos a equivocarnos, y menos capaces somos de decidir. Es la parálisis por análisis.",
          "En grupo, el efecto se multiplica. Cada uno llega con su ánimo (comedia para uno, thriller para otro, nada demasiado largo para un tercero) y nadie quiere imponerse. Así caemos en una negociación educada donde todos dicen «a mí me da igual» aunque no sea verdad.",
          "Se añade el miedo al juicio: proponer una película te expone. Si es mala, cargas con ello. Por eso muchos prefieren no proponer nada antes que arriesgarse a una mala elección. Entender estos mecanismos es media batalla: el objetivo no es encontrar la película perfecta, sino una que todos acepten de buena gana.",
        ],
      },
      {
        heading: 'Método 1: el matching colaborativo (deslizar)',
        body: [
          "Es el enfoque más eficaz cuando sois varios, y es exactamente lo que ofrece Swipe Movie. La idea está tomada de las apps de citas: en lugar de debatir, cada uno desliza.",
          "En la práctica, una persona crea una «sala» y comparte un enlace. Cada participante se une desde su móvil y recorre las películas una a una: a la derecha si le interesa, a la izquierda si no. Nadie ve las elecciones de los demás, así que no hay presión social ni juicios.",
          "En cuanto todos han dado «me gusta» a la misma película, hay un «match»: la app la revela y tenéis ganador. La decisión surge de un consenso real, no del más insistente ni del más tímido. Funciona porque elimina el debate, anonimiza los gustos y convierte una lata en un juego de unos minutos.",
        ],
      },
      {
        heading: 'Método 2: la preselección',
        body: [
          "Si no usáis una app, la preselección es el método manual más fiable. La idea es evitar votar sobre todo el catálogo (imposible) reduciendo antes el campo.",
          "Una persona (o cada uno por turnos) propone dos o tres títulos como máximo, teniendo en cuenta el ánimo de la noche y el tiempo disponible. Se obtiene una lista corta de tres a cinco películas. El grupo vota entonces solo sobre esa lista reducida.",
          "La ventaja: elegir entre tres películas es infinitamente más fácil que entre diez mil. El inconveniente: la calidad depende de quien preselecciona, y algunos gustos pueden quedar fuera desde el principio.",
        ],
      },
      {
        heading: 'Método 3: por turnos',
        body: [
          "Ir por turnos consiste en dejar que cada uno elija en rotación, de una sesión a la siguiente. Esta noche eliges tú, la próxima yo. Es sencillo, justo a largo plazo y evita toda negociación inmediata.",
          "Pero este método tiene límites reales. No resuelve una noche concreta: a quien le toca puede imponer una película que el resto simplemente soporta. También exige un grupo estable que se reúne con regularidad, lo que no ocurre en una noche puntual con amigos. Mejor entre compañeros de piso o en pareja, menos para un grupo grande.",
        ],
      },
      {
        heading: 'En pareja, en familia, con amigos o en grupo grande',
        body: [
          "En pareja: el riesgo es la falsa cortesía, cada uno esperando que el otro decida. El matching de dos es ideal porque saca a la luz vuestros gustos comunes sin tener que verbalizarlos. Para una noche romántica, apuntad a una película y no a una serie para quedaros juntos hasta el final.",
          "En familia: manda la restricción de edad. Preseleccionad títulos aptos para todos y dejad que los niños elijan entre esas opciones validadas. Se sienten implicados mientras vosotros controláis el contenido.",
          "Con amigos: los gustos son los más dispersos. El swipe colaborativo brilla aquí, porque encuentra el denominador común sin molestar a nadie. Evitad películas demasiado polarizantes y priorizad el consenso.",
          "En grupo grande (seis o más): debatir en voz alta es inmanejable. Una app se vuelve casi imprescindible: cada uno desliza en paralelo y el match llega en minutos, donde una discusión duraría una hora.",
        ],
      },
      {
        heading: 'Cómo decidir en menos de 5 minutos',
        body: [
          "1. Fijad el marco en 30 segundos: tiempo disponible, ánimo general (ligero o intenso), plataformas accesibles. Eso ya elimina la mitad de las opciones.",
          "2. Elegid un método y mantenedlo: matching colaborativo si sois varios, preselección de tres títulos si no. No mezcléis todo.",
          "3. Abrid una sala en Swipe Movie, compartid el enlace y dejad que cada uno deslice en su móvil durante dos minutos.",
          "4. Parad en el primer match. No busquéis algo mejor: una película que todos aceptan ahora vale más que una perfecta que nunca empieza.",
          "5. Pulsad play. La mejor noche de cine es la que de verdad empieza, no la que aún se debate a las 22:30.",
        ],
      },
      {
        heading: 'Conclusión',
        body: [
          "Elegir una película en grupo no debería llevar más que los títulos de crédito. El secreto no es encontrar la película ideal, sino tener un método que convierta la decisión en un momento ligero en lugar de una negociación.",
          "El matching colaborativo sigue siendo, con diferencia, la forma más rápida y justa de lograrlo en grupo. Crea una sala, comparte el enlace y deja que el consenso trabaje por ti.",
        ],
      },
    ],
    faqHeading: 'Preguntas frecuentes',
    faq: [
      {
        question: '¿Cómo elegir una película cuando no os ponéis de acuerdo?',
        answer:
          "En vez de debatir, que cada uno deslice por separado las mismas películas: aparece un match en cuanto todos dan «me gusta» al mismo título. Este enfoque, usado por Swipe Movie, elimina la negociación y revela el consenso real sin que nadie imponga su elección.",
      },
      {
        question: '¿Cuál es la mejor app para elegir una película en grupo?',
        answer:
          "Swipe Movie está pensada justo para esto: creas una sala, compartes un enlace, cada uno desliza películas en su móvil y la app muestra un match en cuanto vuestros gustos coinciden. Es más rápido que una discusión y funciona igual de bien entre dos que en un grupo grande.",
      },
      {
        question: '¿Cómo elegir una película rápido?',
        answer:
          "Fijad primero tres restricciones en 30 segundos (duración, ánimo, plataforma) y luego preseleccionad tres títulos como máximo o lanzad un match colaborativo. Parad en la primera opción que todos acepten: buscar la película perfecta es la principal causa de noches que nunca empiezan.",
      },
      {
        question: '¿Cómo elegir una película en pareja?',
        answer:
          "El matching de dos es ideal: cada uno desliza por su lado y descubrís vuestros gustos comunes sin tener que verbalizarlos, lo que evita la falsa cortesía del «a mí me da igual». Preferid una película antes que una serie para quedaros juntos de principio a fin.",
      },
      {
        question: '¿Cómo elegir una película en familia con niños?',
        answer:
          "Preseleccionad primero títulos adecuados a la edad de todos y dejad que los niños elijan entre esas opciones validadas. Se sienten parte de la decisión mientras vosotros controláis el contenido, el mejor equilibrio entre diversión y seguridad.",
      },
    ],
    linksHeading: 'Sigue explorando',
    links: [
      { label: 'Abrir una sala y elegir película', href: '/try' },
      { label: 'Explorar el catálogo de películas', href: '/films' },
      { label: '¿Qué ver esta noche?', href: '/contexte/quoi-regarder-ce-soir' },
      { label: 'Ideas de películas para una noche en pareja', href: '/contexte/soiree-couple' },
      { label: 'Películas para ver en familia', href: '/contexte/en-famille' },
    ],
  },
  de: {
    breadcrumbHome: 'Start',
    breadcrumbGuide: 'Wie man zu mehreren einen Film auswählt',
    title: 'Zu mehreren einen Film auswählen: der komplette Leitfaden',
    description:
      "Ihr werdet euch nicht einig? Unser Leitfaden zeigt, wie ihr zu mehreren, als Paar oder Familie ohne endlose Debatte in unter 5 Minuten einen Film auswählt.",
    intro: [
      "Freitagabend, das Sofa ist bereit und das Popcorn auch. Bleibt nur eine Frage, und es ist immer dieselbe: „Was schauen wir?\" Dreißig Minuten später scrollt ihr noch durch den Katalog, niemand ist sich einig, und die Lust auf einen Film ist fast verflogen.",
      "Zu mehreren einen Film auszuwählen ist eines der universellsten kleinen Probleme des modernen Lebens. Je mehr Leute, desto mehr prallen Geschmäcker aufeinander und desto schwerer wird die Entscheidung. Dieser Leitfaden sammelt die Methoden, die wirklich funktionieren, um schnell und fair zu entscheiden, ob zu zweit, als Familie oder als ganze Gruppe.",
    ],
    cta: 'Jetzt einen Film auswählen',
    sections: [
      {
        heading: 'Warum es so schwer ist, zu mehreren einen Film zu wählen',
        body: [
          "Das Problem ist nicht der Mangel an Filmen, sondern das Gegenteil. Die Plattformen bieten Zehntausende Titel, und diese Fülle erzeugt das, was Psychologen das „Paradox der Wahl\" nennen: Je mehr Optionen es gibt, desto mehr fürchten wir, falsch zu wählen, und desto weniger können wir entscheiden. Das ist die Entscheidungslähmung.",
          "In der Gruppe vervielfacht sich der Effekt. Jeder kommt mit seiner Stimmung (eine Komödie für den einen, ein Thriller für den anderen, nichts zu Langes für den dritten) und niemand will sich aufdrängen. So geraten wir in eine höfliche Verhandlung, in der alle sagen „mir egal\", obwohl es nicht stimmt.",
          "Dazu kommt die Angst vor dem Urteil: Einen Film vorzuschlagen heißt, sich zu exponieren. Ist er schlecht, trägt man die Verantwortung. Deshalb schlagen viele lieber nichts vor, als eine schlechte Wahl zu riskieren. Diese Mechanismen zu verstehen, ist schon die halbe Miete: Das Ziel ist nicht der perfekte Film, sondern einer, den alle gern akzeptieren.",
        ],
      },
      {
        heading: 'Methode 1: kollaboratives Matching (Swipen)',
        body: [
          "Das ist der wirksamste Ansatz, wenn ihr zu mehreren seid, und genau das bietet Swipe Movie. Die Idee stammt von Dating-Apps: Statt zu debattieren, swipt jeder.",
          "Konkret erstellt eine Person einen „Raum\" und teilt einen Link. Jeder Teilnehmer tritt am Handy bei und geht die Filme einzeln durch: nach rechts, wenn er interessiert, nach links, wenn nicht. Niemand sieht die Wahl der anderen, also kein sozialer Druck und kein Urteil.",
          "Sobald alle denselben Film mögen, gibt es ein „Match\": Die App zeigt ihn, und ihr habt euren Gewinner. Die Entscheidung entsteht aus einem echten Konsens, nicht aus dem Lautesten oder Schüchternsten. Es funktioniert, weil es die Debatte beseitigt, die Vorlieben anonymisiert und eine lästige Pflicht in ein Spiel von wenigen Minuten verwandelt.",
        ],
      },
      {
        heading: 'Methode 2: die Vorauswahl',
        body: [
          "Ohne App ist die Vorauswahl die zuverlässigste manuelle Methode. Die Idee: nicht über den ganzen Katalog abstimmen (unmöglich), sondern das Feld zuerst eingrenzen.",
          "Eine Person (oder jeder reihum) schlägt höchstens zwei oder drei Titel vor und berücksichtigt die Stimmung des Abends und die verfügbare Zeit. So entsteht eine Shortlist von drei bis fünf Filmen. Die Gruppe stimmt dann nur über diese reduzierte Liste ab.",
          "Der Vorteil: Zwischen drei Filmen zu wählen ist unendlich leichter als zwischen zehntausend. Der Nachteil: Die Qualität hängt von der vorauswählenden Person ab, und manche Geschmäcker können von Anfang an übergangen werden.",
        ],
      },
      {
        heading: 'Methode 3: das Reihum-Prinzip',
        body: [
          "Das Reihum-Prinzip lässt jeden abwechselnd wählen, von einem Abend zum nächsten. Heute wählst du, das nächste Mal ich. Einfach, langfristig fair und vermeidet jede unmittelbare Verhandlung.",
          "Doch diese Methode hat echte Grenzen. Sie löst keinen konkreten Abend: Wer dran ist, kann einen Film durchsetzen, den die anderen nur ertragen. Sie setzt zudem eine stabile Gruppe voraus, die sich regelmäßig trifft, was bei einem einmaligen Abend mit Freunden nicht der Fall ist. Eher für WG-Mitbewohner oder Paare, weniger für große Gruppen.",
        ],
      },
      {
        heading: 'Zu zweit, als Familie, mit Freunden oder in großer Gruppe',
        body: [
          "Zu zweit: Das Risiko ist falsche Höflichkeit, jeder wartet auf die Entscheidung des anderen. Matching zu zweit ist ideal, weil es eure gemeinsamen Vorlieben sichtbar macht, ohne sie aussprechen zu müssen. Für einen Date-Abend zielt auf einen Film statt eine Serie, damit ihr bis zum Ende zusammenbleibt.",
          "Als Familie: Die Altersfrage dominiert. Wählt Titel vor, die für alle geeignet sind, und lasst dann die Kinder unter diesen geprüften Optionen wählen. Sie fühlen sich beteiligt, während ihr die Inhalte kontrolliert.",
          "Mit Freunden: Hier sind die Geschmäcker am breitesten gestreut. Kollaboratives Swipen glänzt, weil es den gemeinsamen Nenner findet, ohne jemanden zu verprellen. Vermeidet zu spaltende Filme und setzt auf Konsens.",
          "In großer Gruppe (sechs oder mehr): Lautes Debattieren ist nicht mehr zu steuern. Eine App wird fast unverzichtbar: Jeder swipt parallel und das Match fällt in Minuten, wo eine Diskussion eine Stunde dauern würde.",
        ],
      },
      {
        heading: 'Wie ihr in unter 5 Minuten entscheidet',
        body: [
          "1. Setzt den Rahmen in 30 Sekunden: verfügbare Zeit, Grundstimmung (leicht oder intensiv), zugängliche Plattformen. Das streicht schon die Hälfte der Optionen.",
          "2. Wählt eine Methode und bleibt dabei: kollaboratives Matching, wenn ihr mehrere seid, sonst eine Shortlist mit drei Titeln. Nicht alles vermischen.",
          "3. Startet einen Raum auf Swipe Movie, teilt den Link und lasst jeden zwei Minuten lang am Handy swipen.",
          "4. Stoppt beim ersten Match. Sucht nichts Besseres: Ein Film, den jetzt alle akzeptieren, schlägt einen perfekten Film, der nie startet.",
          "5. Drückt auf Play. Der beste Filmabend ist der, der wirklich beginnt, nicht der, über den um 22:30 Uhr noch gestritten wird.",
        ],
      },
      {
        heading: 'Fazit',
        body: [
          "Zu mehreren einen Film zu wählen sollte nie länger dauern als der Vorspann. Das Geheimnis ist nicht der ideale Film, sondern eine Methode, die die Entscheidung in einen leichten Moment statt in eine Verhandlung verwandelt.",
          "Kollaboratives Matching bleibt mit Abstand der schnellste und fairste Weg, das in der Gruppe zu erreichen. Erstellt einen Raum, teilt den Link und lasst den Konsens die Arbeit für euch machen.",
        ],
      },
    ],
    faqHeading: 'Häufig gestellte Fragen',
    faq: [
      {
        question: 'Wie wählt man einen Film, wenn man sich nicht einig ist?',
        answer:
          "Statt zu debattieren, swipt jeder für sich durch dieselben Filme: Ein Match erscheint, sobald alle denselben Titel mögen. Dieser Ansatz, den Swipe Movie nutzt, beseitigt die Verhandlung und zeigt den echten Konsens, ohne dass jemand seine Wahl aufzwingt.",
      },
      {
        question: 'Was ist die beste App, um zu mehreren einen Film zu wählen?',
        answer:
          "Swipe Movie ist genau dafür gemacht: Man erstellt einen Raum, teilt einen Link, jeder swipt Filme am Handy, und die App zeigt ein Match, sobald sich eure Geschmäcker treffen. Das ist schneller als eine Diskussion und funktioniert zu zweit ebenso gut wie in einer großen Gruppe.",
      },
      {
        question: 'Wie wählt man schnell einen Film aus?',
        answer:
          "Legt zuerst in 30 Sekunden drei Bedingungen fest (Länge, Stimmung, Plattform) und erstellt dann höchstens drei Titel als Shortlist oder startet ein kollaboratives Match. Stoppt bei der ersten Wahl, die alle akzeptieren: Die Suche nach dem perfekten Film ist der Hauptgrund, warum Filmabende nie beginnen.",
      },
      {
        question: 'Wie wählt man als Paar einen Film?',
        answer:
          "Matching zu zweit ist ideal: Jeder swipt auf seiner Seite und ihr entdeckt eure gemeinsamen Vorlieben, ohne sie aussprechen zu müssen, was die falsche Höflichkeit des „mir egal\" vermeidet. Bevorzugt einen Film statt einer Serie, um von Anfang bis Ende zusammenzubleiben.",
      },
      {
        question: 'Wie wählt man als Familie mit Kindern einen Film?',
        answer:
          "Wählt zuerst altersgerechte Titel für alle vor und lasst dann die Kinder unter diesen geprüften Optionen wählen. Sie fühlen sich an der Entscheidung beteiligt, während ihr die Inhalte kontrolliert, der beste Kompromiss zwischen Spaß und Sicherheit.",
      },
    ],
    linksHeading: 'Weiter erkunden',
    links: [
      { label: 'Einen Raum starten und einen Film wählen', href: '/try' },
      { label: 'Den Filmkatalog durchstöbern', href: '/films' },
      { label: 'Was heute Abend schauen?', href: '/contexte/quoi-regarder-ce-soir' },
      { label: 'Filmideen für einen Paarabend', href: '/contexte/soiree-couple' },
      { label: 'Filme für den Familienabend', href: '/contexte/en-famille' },
    ],
  },
  it: {
    breadcrumbHome: 'Home',
    breadcrumbGuide: 'Come scegliere un film in gruppo',
    title: 'Come scegliere un film in gruppo: la guida completa',
    description:
      "Non riuscite a mettervi d'accordo? La nostra guida spiega come scegliere un film in gruppo, in coppia o in famiglia senza dibattiti infiniti, in meno di 5 minuti.",
    intro: [
      "Venerdì sera, il divano è pronto e i popcorn anche. Resta una sola domanda, ed è sempre la stessa: «Cosa guardiamo?». Trenta minuti dopo state ancora scorrendo il catalogo, nessuno è d'accordo e la voglia di vedere un film è quasi svanita.",
      "Scegliere un film in gruppo è uno dei piccoli grattacapi più universali della vita moderna. Più persone ci sono, più i gusti si scontrano e più la decisione diventa difficile. Questa guida raccoglie i metodi che funzionano davvero per decidere in fretta e bene, che siate in due, in famiglia o in tutto un gruppo.",
    ],
    cta: 'Scegli un film ora',
    sections: [
      {
        heading: 'Perché è così difficile scegliere un film in gruppo',
        body: [
          "Il problema non è la mancanza di film, è il contrario. Le piattaforme offrono decine di migliaia di titoli, e questa abbondanza crea ciò che gli psicologi chiamano il «paradosso della scelta»: più opzioni ci sono, più temiamo di sbagliare e meno riusciamo a decidere. È la paralisi da scelta.",
          "In gruppo l'effetto si moltiplica. Ognuno arriva con il suo umore (una commedia per uno, un thriller per l'altro, niente di troppo lungo per un terzo) e nessuno vuole imporsi. Così si scivola in una trattativa educata in cui tutti dicono «per me è uguale» anche se non è vero.",
          "Si aggiunge la paura del giudizio: proporre un film ti espone. Se è brutto, te ne assumi la responsabilità. Per questo molti preferiscono non proporre nulla piuttosto che rischiare una scelta sbagliata. Capire questi meccanismi è già metà dell'opera: l'obiettivo non è trovare il film perfetto, ma uno che tutti accettino volentieri.",
        ],
      },
      {
        heading: 'Metodo 1: il matching collaborativo (lo swipe)',
        body: [
          "È l'approccio più efficace quando siete in tanti, ed è esattamente ciò che offre Swipe Movie. L'idea è presa dalle app di incontri: invece di discutere, ognuno fa swipe.",
          "In pratica, una persona crea una «room» e condivide un link. Ogni partecipante si unisce dal proprio telefono e scorre i film uno per uno: a destra se interessa, a sinistra se no. Nessuno vede le scelte degli altri, quindi niente pressione sociale né giudizi.",
          "Appena tutti hanno messo «mi piace» allo stesso film, ecco un «match»: l'app lo rivela e avete il vincitore. La decisione nasce da un vero consenso, non dal più insistente o dal più timido. Funziona perché elimina il dibattito, rende anonime le preferenze e trasforma una scocciatura in un gioco di pochi minuti.",
        ],
      },
      {
        heading: 'Metodo 2: la preselezione',
        body: [
          "Se non usate un'app, la preselezione è il metodo manuale più affidabile. L'idea è evitare di votare su tutto il catalogo (impossibile) restringendo prima il campo.",
          "Una persona (o ciascuno a turno) propone al massimo due o tre titoli, tenendo conto dell'umore della serata e del tempo a disposizione. Si ottiene una short-list di tre-cinque film. Il gruppo vota poi solo su questa lista ridotta.",
          "Il vantaggio: scegliere tra tre film è infinitamente più facile che tra diecimila. Lo svantaggio: la qualità dipende da chi preseleziona, e alcuni gusti possono restare esclusi fin dall'inizio.",
        ],
      },
      {
        heading: 'Metodo 3: a turno',
        body: [
          "Andare a turno significa lasciare che ognuno scelga a rotazione, da una serata all'altra. Stasera scegli tu, la prossima volta io. È semplice, equo nel lungo periodo ed evita ogni trattativa immediata.",
          "Ma questo metodo ha limiti reali. Non risolve una serata precisa: chi è di turno può imporre un film che gli altri si limitano a subire. Presuppone inoltre un gruppo stabile che si rivede con regolarità, cosa che non vale per una serata occasionale tra amici. Meglio tra coinquilini o in coppia, meno per un gruppo numeroso.",
        ],
      },
      {
        heading: 'In due, in famiglia, tra amici o in un grande gruppo',
        body: [
          "In due: il rischio è la falsa cortesia, ognuno aspetta che decida l'altro. Il matching in due è ideale perché fa emergere i gusti comuni senza doverli esprimere a parole. Per una serata di coppia, puntate su un film e non su una serie per restare insieme fino alla fine.",
          "In famiglia: domina il vincolo dell'età. Preselezionate titoli adatti a tutti, poi lasciate scegliere ai bambini tra queste opzioni approvate. Si sentono coinvolti mentre voi mantenete il controllo sui contenuti.",
          "Tra amici: i gusti sono i più dispersi. Lo swipe collaborativo brilla qui, perché trova il denominatore comune senza scontentare nessuno. Evitate film troppo divisivi e privilegiate il consenso.",
          "In un grande gruppo (sei o più): discutere a voce è ingestibile. Un'app diventa quasi indispensabile: ognuno fa swipe in parallelo e il match arriva in pochi minuti, dove una discussione durerebbe un'ora.",
        ],
      },
      {
        heading: 'Come decidere in meno di 5 minuti',
        body: [
          "1. Fissate la cornice in 30 secondi: tempo disponibile, umore generale (leggero o intenso), piattaforme accessibili. Questo elimina già metà delle opzioni.",
          "2. Scegliete un metodo e mantenetelo: matching collaborativo se siete in tanti, preselezione di tre titoli altrimenti. Non mescolate tutto.",
          "3. Aprite una room su Swipe Movie, condividete il link e lasciate che ognuno faccia swipe sul telefono per due minuti.",
          "4. Fermatevi al primo match. Non cercate di meglio: un film che tutti accettano ora vale più di un film perfetto che non parte mai.",
          "5. Premete play. La miglior serata film è quella che inizia davvero, non quella su cui si discute ancora alle 22:30.",
        ],
      },
      {
        heading: 'Conclusione',
        body: [
          "Scegliere un film in gruppo non dovrebbe mai richiedere più dei titoli di testa. Il segreto non è trovare il film ideale, ma avere un metodo che trasformi la decisione in un momento leggero invece che in una trattativa.",
          "Il matching collaborativo resta, di gran lunga, il modo più rapido ed equo per arrivarci in gruppo. Crea una room, condividi il link e lascia che il consenso lavori al posto tuo.",
        ],
      },
    ],
    faqHeading: 'Domande frequenti',
    faq: [
      {
        question: 'Come scegliere un film quando non si è d\'accordo?',
        answer:
          "Invece di discutere, fate fare swipe a ciascuno separatamente sugli stessi film: un match appare appena tutti mettono «mi piace» allo stesso titolo. Questo approccio, usato da Swipe Movie, elimina la trattativa e rivela il vero consenso senza che nessuno imponga la propria scelta.",
      },
      {
        question: "Qual è la migliore app per scegliere un film in gruppo?",
        answer:
          "Swipe Movie è pensata proprio per questo: crei una room, condividi un link, ognuno fa swipe sui film dal telefono e l'app mostra un match appena i gusti coincidono. È più veloce di una discussione e funziona bene sia in due sia in un grande gruppo.",
      },
      {
        question: 'Come scegliere un film velocemente?',
        answer:
          "Fissate prima tre vincoli in 30 secondi (durata, umore, piattaforma), poi preselezionate al massimo tre titoli o avviate un match collaborativo. Fermatevi alla prima scelta accettata da tutti: cercare il film perfetto è la causa principale delle serate che non iniziano mai.",
      },
      {
        question: 'Come scegliere un film in coppia?',
        answer:
          "Il matching in due è ideale: ognuno fa swipe dalla propria parte e scoprite i gusti comuni senza doverli esprimere a parole, evitando la falsa cortesia del «per me è uguale». Preferite un film a una serie per restare insieme dall'inizio alla fine.",
      },
      {
        question: 'Come scegliere un film in famiglia con i bambini?',
        answer:
          "Preselezionate prima titoli adatti all'età di tutti, poi lasciate scegliere ai bambini tra queste opzioni approvate. Si sentono parte della decisione mentre voi mantenete il controllo sui contenuti, il miglior compromesso tra divertimento e sicurezza.",
      },
    ],
    linksHeading: 'Continua a esplorare',
    links: [
      { label: 'Apri una room e scegli un film', href: '/try' },
      { label: 'Sfoglia il catalogo di film', href: '/films' },
      { label: 'Cosa guardare stasera?', href: '/contexte/quoi-regarder-ce-soir' },
      { label: 'Idee di film per una serata di coppia', href: '/contexte/soiree-couple' },
      { label: 'Film da vedere in famiglia', href: '/contexte/en-famille' },
    ],
  },
};

function getContent(locale: string): GuideContent {
  return CONTENT[locale as Locale] ?? CONTENT.fr;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(locale);
  const canonical = `${SITE_URL}/${locale}${PATH}`;
  const title = content.title;
  const description = content.description.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(PATH),
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const content = getContent(locale);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: content.breadcrumbHome,
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: content.breadcrumbGuide,
        item: `${SITE_URL}/${locale}${PATH}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <SEOPageTracker
        pageType="guide"
        locale={locale}
        slug="choisir-un-film-a-plusieurs"
        title={content.title}
      />
      <article className="container mx-auto px-4 py-8 md:py-12 space-y-10 max-w-4xl">
        <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={`/${locale}`} className="hover:text-foreground transition">
                {content.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {content.breadcrumbGuide}
            </li>
          </ol>
        </nav>

        <header className="space-y-5">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {content.title}
            </span>
          </h1>
          {content.intro.map((paragraph, i) => (
            <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
          <Link
            href={`/${locale}/try`}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
          >
            {content.cta}
          </Link>
        </header>

        {content.sections.map((s, i) => (
          <section key={i} className="space-y-3">
            <h2 className="text-2xl font-semibold">{s.heading}</h2>
            {s.body.map((paragraph, j) => (
              <p key={j} className="text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section aria-labelledby="faq" className="space-y-4">
          <h2 id="faq" className="text-2xl font-semibold">
            {content.faqHeading}
          </h2>
          <dl className="space-y-4">
            {content.faq.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <dt className="font-medium mb-2">{f.question}</dt>
                <dd className="text-muted-foreground leading-relaxed">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="links" className="space-y-4">
          <h2 id="links" className="text-2xl font-semibold">
            {content.linksHeading}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {content.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={`/${locale}${l.href}`}
                  className="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}
