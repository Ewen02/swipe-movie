/**
 * Email translations. Mirrors the app's 5 locales (fr/en/es/it/de). Kept in the
 * email package so templates and subject lines share one source of truth.
 *
 * Placeholders in {braces} are substituted by the templates, not translated.
 */
export type EmailLocale = 'fr' | 'en' | 'es' | 'it' | 'de';

export const EMAIL_LOCALES: EmailLocale[] = ['fr', 'en', 'es', 'it', 'de'];
export const DEFAULT_EMAIL_LOCALE: EmailLocale = 'fr';

/** Normalize any incoming locale string (e.g. "en-US") to a supported one. */
export function resolveEmailLocale(input?: string | null): EmailLocale {
  if (!input) return DEFAULT_EMAIL_LOCALE;
  const short = input.toLowerCase().split('-')[0] as EmailLocale;
  return EMAIL_LOCALES.includes(short) ? short : DEFAULT_EMAIL_LOCALE;
}

type EmailStrings = {
  footer_tagline: string;
  footer_legal: string;
  footer_manage: string;
  greeting: string;
  welcome_title: string;
  welcome_subject: string;
  welcome_intro: string;
  welcome_step1_title: string;
  welcome_step1_desc: string;
  welcome_step2_title: string;
  welcome_step2_desc: string;
  welcome_step3_title: string;
  welcome_step3_desc: string;
  welcome_cta: string;
  welcome_help: string;
  match_subject: string;
  match_title: string;
  match_body: string;
  match_card_subtitle: string;
  match_cta: string;
  invite_subject: string;
  invite_title: string;
  invite_body: string;
  invite_sub: string;
  invite_cta: string;
  invite_code_label: string;
  expiry_subject: string;
  expiry_title: string;
  expiry_body: string;
  expiry_with_matches: string;
  expiry_no_matches: string;
  expiry_cta: string;
  digest_subject: string;
  digest_title: string;
  digest_intro: string;
  digest_stat_swipes: string;
  digest_stat_matches: string;
  digest_stat_rooms: string;
  digest_topmatch_label: string;
  digest_topmatch_subtitle: string;
  digest_cta: string;
  time_hours_one: string;
  time_hours_other: string;
  magiclink_subject: string;
  magiclink_title: string;
  magiclink_body: string;
  magiclink_cta: string;
  magiclink_expiry: string;
  magiclink_fallback: string;
  magiclink_ignore: string;
  otp_subject: string;
  otp_reset_subject: string;
  otp_title: string;
  otp_body: string;
  otp_expiry: string;
  otp_ignore: string;
};

/** Localized "{n} hour(s)" string for the expiry reminder's time-left copy. */
export function formatHoursLeft(locale: EmailLocale, hours: number): string {
  const s = t(locale);
  const unit = hours > 1 ? s.time_hours_other : s.time_hours_one;
  return `${hours} ${unit}`;
}

export const EMAIL_TRANSLATIONS: Record<EmailLocale, EmailStrings> = {
  fr: {
    footer_tagline: 'Trouvez votre prochain film entre amis 🍿',
    footer_legal: 'Vous recevez cet email car vous avez un compte Swipe Movie.',
    footer_manage: 'Gérer vos préférences email',
    greeting: 'Bonjour {name},',
    welcome_title: 'Bienvenue sur Swipe Movie&nbsp;!',
    welcome_subject: 'Bienvenue sur Swipe Movie, {name} !',
    welcome_intro:
      'Vous êtes prêt(e) à découvrir une nouvelle façon de choisir vos films — ensemble, en temps réel.',
    welcome_step1_title: 'Créez une room',
    welcome_step1_desc: 'et invitez vos amis ou votre famille',
    welcome_step2_title: 'Swipez sur les films',
    welcome_step2_desc: 'droite si ça vous tente, gauche sinon',
    welcome_step3_title: 'Découvrez vos matchs',
    welcome_step3_desc: 'les films que tout le monde veut voir&nbsp;!',
    welcome_cta: 'Créer ma première room',
    welcome_help:
      'Des questions&nbsp;? Répondez simplement à cet email, nous sommes là pour vous aider.',
    match_subject: 'Nouveau match : {movieTitle}',
    match_title: '🎉 Nouveau match&nbsp;!',
    match_body: 'Tout le monde a swipé à droite dans la room «&nbsp;{roomName}&nbsp;»&nbsp;:',
    match_card_subtitle: 'Match unanime — à regarder ensemble&nbsp;!',
    match_cta: 'Voir le match',
    invite_subject: '{inviterName} vous invite à rejoindre « {roomName} » sur Swipe Movie',
    invite_title: 'Vous êtes invité(e)&nbsp;! 🎟️',
    invite_body:
      '{inviterName} vous invite à rejoindre la room «&nbsp;{roomName}&nbsp;» sur Swipe Movie.',
    invite_sub:
      'Swipez ensemble, en temps réel, pour trouver le film parfait à regarder ce soir.',
    invite_cta: 'Rejoindre la room',
    invite_code_label: 'Code de la room&nbsp;:',
    expiry_subject: 'Votre room « {roomName} » expire bientôt',
    expiry_title: '⏳ Votre room va bientôt expirer',
    expiry_body: 'Votre room «&nbsp;{roomName}&nbsp;» expire dans environ {timeLeft}.',
    expiry_with_matches:
      'Vous avez déjà {matchCount} match{plural} dans cette room — ne les perdez pas&nbsp;!',
    expiry_no_matches:
      "Vous n'avez pas encore de match. Il vous reste un peu de temps pour en trouver un&nbsp;!",
    expiry_cta: 'Retourner dans la room',
    digest_subject: 'Votre semaine sur Swipe Movie',
    digest_title: 'Votre semaine en résumé 📊',
    digest_intro: 'Voici votre activité de la semaine sur Swipe Movie&nbsp;:',
    digest_stat_swipes: 'Swipes',
    digest_stat_matches: 'Matchs',
    digest_stat_rooms: 'Rooms actives',
    digest_topmatch_label: 'Film le plus matché cette semaine',
    digest_topmatch_subtitle: 'Le favori du groupe',
    digest_cta: 'Continuer à swiper',
    time_hours_one: 'heure',
    time_hours_other: 'heures',
    magiclink_subject: 'Votre lien de connexion Swipe Movie',
    magiclink_title: 'Connexion en un clic 🔑',
    magiclink_body:
      'Appuyez sur le bouton ci-dessous pour vous connecter à Swipe Movie. Aucun mot de passe à retenir.',
    magiclink_cta: 'Me connecter',
    magiclink_expiry: 'Ce lien expire dans 5 minutes et ne fonctionne qu\'une seule fois.',
    magiclink_fallback: 'Le bouton ne fonctionne pas&nbsp;? Copiez-collez ce lien dans votre navigateur&nbsp;:',
    magiclink_ignore:
      'Si vous n\'avez pas demandé ce lien, vous pouvez ignorer cet email en toute sécurité.',
    otp_subject: 'Votre code de connexion Swipe Movie',
    otp_reset_subject: 'Votre code de réinitialisation Swipe Movie',
    otp_title: 'Votre code de connexion 🔐',
    otp_body: 'Saisissez ce code dans Swipe Movie pour vous connecter&nbsp;:',
    otp_expiry: 'Ce code expire dans 10 minutes.',
    otp_ignore:
      'Si vous n\'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.',
  },
  en: {
    footer_tagline: 'Find your next movie with friends 🍿',
    footer_legal: "You're receiving this email because you have a Swipe Movie account.",
    footer_manage: 'Manage your email preferences',
    greeting: 'Hi {name},',
    welcome_title: 'Welcome to Swipe Movie!',
    welcome_subject: 'Welcome to Swipe Movie, {name}!',
    welcome_intro:
      "You're all set to discover a new way to pick your movies — together, in real time.",
    welcome_step1_title: 'Create a room',
    welcome_step1_desc: 'and invite your friends or family',
    welcome_step2_title: 'Swipe on movies',
    welcome_step2_desc: "right if you're into it, left if not",
    welcome_step3_title: 'Discover your matches',
    welcome_step3_desc: 'the movies everyone wants to watch!',
    welcome_cta: 'Create my first room',
    welcome_help: "Got questions? Just reply to this email, we're here to help.",
    match_subject: 'New match: {movieTitle}',
    match_title: '🎉 New match!',
    match_body: 'Everyone swiped right in the room “{roomName}”:',
    match_card_subtitle: 'Unanimous match — watch it together!',
    match_cta: 'View the match',
    invite_subject: '{inviterName} invites you to join “{roomName}” on Swipe Movie',
    invite_title: "You're invited! 🎟️",
    invite_body: '{inviterName} invites you to join the room “{roomName}” on Swipe Movie.',
    invite_sub: 'Swipe together, in real time, to find the perfect movie to watch tonight.',
    invite_cta: 'Join the room',
    invite_code_label: 'Room code:',
    expiry_subject: 'Your room “{roomName}” is expiring soon',
    expiry_title: '⏳ Your room is about to expire',
    expiry_body: 'Your room “{roomName}” expires in about {timeLeft}.',
    expiry_with_matches:
      "You already have {matchCount} match{plural} in this room — don't lose them!",
    expiry_no_matches: "You don't have a match yet. There's still a little time to find one!",
    expiry_cta: 'Back to the room',
    digest_subject: 'Your week on Swipe Movie',
    digest_title: 'Your week in review 📊',
    digest_intro: "Here's your activity this week on Swipe Movie:",
    digest_stat_swipes: 'Swipes',
    digest_stat_matches: 'Matches',
    digest_stat_rooms: 'Active rooms',
    digest_topmatch_label: 'Most matched movie this week',
    digest_topmatch_subtitle: "The group's favorite",
    digest_cta: 'Keep swiping',
    time_hours_one: 'hour',
    time_hours_other: 'hours',
    magiclink_subject: 'Your Swipe Movie sign-in link',
    magiclink_title: 'Sign in with one tap 🔑',
    magiclink_body:
      'Tap the button below to sign in to Swipe Movie. No password to remember.',
    magiclink_cta: 'Sign me in',
    magiclink_expiry: 'This link expires in 5 minutes and only works once.',
    magiclink_fallback: 'Button not working? Copy and paste this link into your browser:',
    magiclink_ignore: "If you didn't request this link, you can safely ignore this email.",
    otp_subject: 'Your Swipe Movie sign-in code',
    otp_reset_subject: 'Your Swipe Movie reset code',
    otp_title: 'Your sign-in code 🔐',
    otp_body: 'Enter this code in Swipe Movie to sign in:',
    otp_expiry: 'This code expires in 10 minutes.',
    otp_ignore: "If you didn't request this code, you can safely ignore this email.",
  },
  es: {
    footer_tagline: 'Encuentra tu próxima película entre amigos 🍿',
    footer_legal: 'Recibes este correo porque tienes una cuenta de Swipe Movie.',
    footer_manage: 'Gestionar tus preferencias de correo',
    greeting: 'Hola {name},',
    welcome_title: '¡Bienvenido a Swipe Movie!',
    welcome_subject: '¡Bienvenido a Swipe Movie, {name}!',
    welcome_intro:
      'Estás listo para descubrir una nueva forma de elegir tus películas: juntos y en tiempo real.',
    welcome_step1_title: 'Crea una room',
    welcome_step1_desc: 'e invita a tus amigos o a tu familia',
    welcome_step2_title: 'Desliza sobre las películas',
    welcome_step2_desc: 'a la derecha si te apetece, a la izquierda si no',
    welcome_step3_title: 'Descubre vuestros matches',
    welcome_step3_desc: '¡las películas que todos quieren ver!',
    welcome_cta: 'Crear mi primera room',
    welcome_help: '¿Tienes preguntas? Solo responde a este correo, estamos aquí para ayudarte.',
    match_subject: 'Nuevo match: {movieTitle}',
    match_title: '🎉 ¡Nuevo match!',
    match_body: 'Todos deslizaron a la derecha en la room «{roomName}»:',
    match_card_subtitle: 'Match unánime: ¡a verla juntos!',
    match_cta: 'Ver el match',
    invite_subject: '{inviterName} te invita a unirte a «{roomName}» en Swipe Movie',
    invite_title: '¡Estás invitado! 🎟️',
    invite_body: '{inviterName} te invita a unirte a la room «{roomName}» en Swipe Movie.',
    invite_sub:
      'Deslizad juntos, en tiempo real, para encontrar la película perfecta para ver esta noche.',
    invite_cta: 'Unirse a la room',
    invite_code_label: 'Código de la room:',
    expiry_subject: 'Tu room «{roomName}» expira pronto',
    expiry_title: '⏳ Tu room está a punto de expirar',
    expiry_body: 'Tu room «{roomName}» expira en aproximadamente {timeLeft}.',
    expiry_with_matches: 'Ya tienes {matchCount} match{plural} en esta room: ¡no los pierdas!',
    expiry_no_matches:
      'Todavía no tienes ningún match. ¡Aún te queda un poco de tiempo para encontrar uno!',
    expiry_cta: 'Volver a la room',
    digest_subject: 'Tu semana en Swipe Movie',
    digest_title: 'Tu semana en resumen 📊',
    digest_intro: 'Aquí tienes tu actividad de la semana en Swipe Movie:',
    digest_stat_swipes: 'Swipes',
    digest_stat_matches: 'Matches',
    digest_stat_rooms: 'Rooms activas',
    digest_topmatch_label: 'Película con más matches esta semana',
    digest_topmatch_subtitle: 'La favorita del grupo',
    digest_cta: 'Seguir deslizando',
    time_hours_one: 'hora',
    time_hours_other: 'horas',
    magiclink_subject: 'Tu enlace de acceso a Swipe Movie',
    magiclink_title: 'Inicia sesión con un toque 🔑',
    magiclink_body:
      'Pulsa el botón de abajo para iniciar sesión en Swipe Movie. Sin contraseñas que recordar.',
    magiclink_cta: 'Iniciar sesión',
    magiclink_expiry: 'Este enlace caduca en 5 minutos y solo funciona una vez.',
    magiclink_fallback: '¿El botón no funciona? Copia y pega este enlace en tu navegador:',
    magiclink_ignore: 'Si no solicitaste este enlace, puedes ignorar este correo con tranquilidad.',
    otp_subject: 'Tu código de acceso a Swipe Movie',
    otp_reset_subject: 'Tu código de restablecimiento de Swipe Movie',
    otp_title: 'Tu código de acceso 🔐',
    otp_body: 'Introduce este código en Swipe Movie para iniciar sesión:',
    otp_expiry: 'Este código caduca en 10 minutos.',
    otp_ignore: 'Si no solicitaste este código, puedes ignorar este correo con tranquilidad.',
  },
  it: {
    footer_tagline: 'Trova il tuo prossimo film tra amici 🍿',
    footer_legal: 'Ricevi questa email perché hai un account Swipe Movie.',
    footer_manage: 'Gestisci le tue preferenze email',
    greeting: 'Ciao {name},',
    welcome_title: 'Benvenuto su Swipe Movie!',
    welcome_subject: 'Benvenuto su Swipe Movie, {name}!',
    welcome_intro:
      'Sei pronto a scoprire un nuovo modo di scegliere i tuoi film: insieme, in tempo reale.',
    welcome_step1_title: 'Crea una room',
    welcome_step1_desc: 'e invita i tuoi amici o la tua famiglia',
    welcome_step2_title: 'Scorri sui film',
    welcome_step2_desc: 'a destra se ti va, a sinistra se no',
    welcome_step3_title: 'Scopri i vostri match',
    welcome_step3_desc: 'i film che tutti vogliono vedere!',
    welcome_cta: 'Crea la mia prima room',
    welcome_help: 'Hai domande? Rispondi semplicemente a questa email, siamo qui per aiutarti.',
    match_subject: 'Nuovo match: {movieTitle}',
    match_title: '🎉 Nuovo match!',
    match_body: 'Tutti hanno scorso a destra nella room «{roomName}»:',
    match_card_subtitle: 'Match unanime: da guardare insieme!',
    match_cta: 'Vedi il match',
    invite_subject: '{inviterName} ti invita a unirti a «{roomName}» su Swipe Movie',
    invite_title: 'Sei stato invitato! 🎟️',
    invite_body: '{inviterName} ti invita a unirti alla room «{roomName}» su Swipe Movie.',
    invite_sub:
      'Scorrete insieme, in tempo reale, per trovare il film perfetto da guardare stasera.',
    invite_cta: 'Unisciti alla room',
    invite_code_label: 'Codice della room:',
    expiry_subject: 'La tua room «{roomName}» scade presto',
    expiry_title: '⏳ La tua room sta per scadere',
    expiry_body: 'La tua room «{roomName}» scade tra circa {timeLeft}.',
    expiry_with_matches: 'Hai già {matchCount} match in questa room: non perderli!',
    expiry_no_matches:
      "Non hai ancora nessun match. Ti resta ancora un po' di tempo per trovarne uno!",
    expiry_cta: 'Torna nella room',
    digest_subject: 'La tua settimana su Swipe Movie',
    digest_title: 'La tua settimana in sintesi 📊',
    digest_intro: 'Ecco la tua attività della settimana su Swipe Movie:',
    digest_stat_swipes: 'Swipe',
    digest_stat_matches: 'Match',
    digest_stat_rooms: 'Room attive',
    digest_topmatch_label: 'Film con più match questa settimana',
    digest_topmatch_subtitle: 'Il preferito del gruppo',
    digest_cta: 'Continua a scorrere',
    time_hours_one: 'ora',
    time_hours_other: 'ore',
    magiclink_subject: 'Il tuo link di accesso a Swipe Movie',
    magiclink_title: 'Accedi con un tocco 🔑',
    magiclink_body:
      'Tocca il pulsante qui sotto per accedere a Swipe Movie. Nessuna password da ricordare.',
    magiclink_cta: 'Accedi',
    magiclink_expiry: 'Questo link scade tra 5 minuti e funziona una sola volta.',
    magiclink_fallback: 'Il pulsante non funziona? Copia e incolla questo link nel tuo browser:',
    magiclink_ignore: 'Se non hai richiesto questo link, puoi ignorare questa email in tutta sicurezza.',
    otp_subject: 'Il tuo codice di accesso a Swipe Movie',
    otp_reset_subject: 'Il tuo codice di reimpostazione di Swipe Movie',
    otp_title: 'Il tuo codice di accesso 🔐',
    otp_body: 'Inserisci questo codice in Swipe Movie per accedere:',
    otp_expiry: 'Questo codice scade tra 10 minuti.',
    otp_ignore: 'Se non hai richiesto questo codice, puoi ignorare questa email in tutta sicurezza.',
  },
  de: {
    footer_tagline: 'Findet euren nächsten Film mit Freunden 🍿',
    footer_legal: 'Sie erhalten diese E-Mail, weil Sie ein Swipe-Movie-Konto haben.',
    footer_manage: 'E-Mail-Einstellungen verwalten',
    greeting: 'Hallo {name},',
    welcome_title: 'Willkommen bei Swipe Movie!',
    welcome_subject: 'Willkommen bei Swipe Movie, {name}!',
    welcome_intro:
      'Sie sind bereit, eine neue Art zu entdecken, Ihre Filme auszuwählen – gemeinsam und in Echtzeit.',
    welcome_step1_title: 'Erstellen Sie eine Room',
    welcome_step1_desc: 'und laden Sie Ihre Freunde oder Familie ein',
    welcome_step2_title: 'Swipen Sie durch die Filme',
    welcome_step2_desc: 'nach rechts, wenn Sie Lust haben, sonst nach links',
    welcome_step3_title: 'Entdecken Sie Ihre Matches',
    welcome_step3_desc: 'die Filme, die alle sehen wollen!',
    welcome_cta: 'Meine erste Room erstellen',
    welcome_help: 'Noch Fragen? Antworten Sie einfach auf diese E-Mail, wir helfen Ihnen gerne.',
    match_subject: 'Neues Match: {movieTitle}',
    match_title: '🎉 Neues Match!',
    match_body: 'Alle haben in der Room „{roomName}“ nach rechts geswipt:',
    match_card_subtitle: 'Einstimmiges Match – schaut ihn gemeinsam!',
    match_cta: 'Match ansehen',
    invite_subject: '{inviterName} lädt Sie ein, „{roomName}“ auf Swipe Movie beizutreten',
    invite_title: 'Sie sind eingeladen! 🎟️',
    invite_body: '{inviterName} lädt Sie ein, der Room „{roomName}“ auf Swipe Movie beizutreten.',
    invite_sub:
      'Swipen Sie gemeinsam, in Echtzeit, um den perfekten Film für heute Abend zu finden.',
    invite_cta: 'Der Room beitreten',
    invite_code_label: 'Room-Code:',
    expiry_subject: 'Ihre Room „{roomName}“ läuft bald ab',
    expiry_title: '⏳ Ihre Room läuft bald ab',
    expiry_body: 'Ihre Room „{roomName}“ läuft in etwa {timeLeft} ab.',
    expiry_with_matches:
      'Sie haben bereits {matchCount} Match{plural} in dieser Room – verlieren Sie sie nicht!',
    expiry_no_matches:
      'Sie haben noch kein Match. Es bleibt Ihnen noch etwas Zeit, um eines zu finden!',
    expiry_cta: 'Zurück zur Room',
    digest_subject: 'Ihre Woche bei Swipe Movie',
    digest_title: 'Ihre Woche im Überblick 📊',
    digest_intro: 'Hier ist Ihre Aktivität dieser Woche bei Swipe Movie:',
    digest_stat_swipes: 'Swipes',
    digest_stat_matches: 'Matches',
    digest_stat_rooms: 'Aktive Rooms',
    digest_topmatch_label: 'Meistgematchter Film dieser Woche',
    digest_topmatch_subtitle: 'Der Favorit der Gruppe',
    digest_cta: 'Weiter swipen',
    time_hours_one: 'Stunde',
    time_hours_other: 'Stunden',
    magiclink_subject: 'Ihr Swipe-Movie-Anmeldelink',
    magiclink_title: 'Mit einem Tippen anmelden 🔑',
    magiclink_body:
      'Tippen Sie auf die Schaltfläche unten, um sich bei Swipe Movie anzumelden. Kein Passwort nötig.',
    magiclink_cta: 'Jetzt anmelden',
    magiclink_expiry: 'Dieser Link läuft in 5 Minuten ab und funktioniert nur einmal.',
    magiclink_fallback:
      'Schaltfläche funktioniert nicht? Kopieren Sie diesen Link in Ihren Browser:',
    magiclink_ignore:
      'Wenn Sie diesen Link nicht angefordert haben, können Sie diese E-Mail ignorieren.',
    otp_subject: 'Ihr Swipe-Movie-Anmeldecode',
    otp_reset_subject: 'Ihr Swipe-Movie-Zurücksetzungscode',
    otp_title: 'Ihr Anmeldecode 🔐',
    otp_body: 'Geben Sie diesen Code in Swipe Movie ein, um sich anzumelden:',
    otp_expiry: 'Dieser Code läuft in 10 Minuten ab.',
    otp_ignore:
      'Wenn Sie diesen Code nicht angefordert haben, können Sie diese E-Mail ignorieren.',
  },
};

/** Get the string set for a locale, falling back to the default. */
export function t(locale: EmailLocale): EmailStrings {
  return EMAIL_TRANSLATIONS[locale] ?? EMAIL_TRANSLATIONS[DEFAULT_EMAIL_LOCALE];
}

/** Substitute {placeholders} in a translated string. */
export function fill(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
