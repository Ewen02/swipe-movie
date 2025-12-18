import type { RoomInviteEmailData, MatchNotificationEmailData, WeeklyDigestEmailData } from './types';

export function buildBaseTemplate(content: string, baseUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swipe Movie</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 32px 24px; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .footer { background: #f9f9f9; padding: 24px; text-align: center; color: #666; font-size: 14px; }
    .footer a { color: #667eea; }
    .movie-card { background: #f9f9f9; border-radius: 12px; padding: 16px; margin: 16px 0; display: flex; align-items: center; gap: 16px; }
    .movie-poster { width: 80px; height: 120px; border-radius: 8px; object-fit: cover; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
    .stat-item { background: #f9f9f9; padding: 16px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: 700; color: #667eea; }
    .stat-label { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Swipe Movie</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Swipe Movie - Trouvez votre prochain film entre amis</p>
      <p><a href="${baseUrl}">swipe-movie.com</a></p>
      <p style="font-size: 12px; margin-top: 16px;">
        Vous recevez cet email car vous avez un compte Swipe Movie.<br>
        <a href="${baseUrl}/settings">Gérer vos préférences email</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function buildRoomInviteEmail(data: RoomInviteEmailData, baseUrl: string): string {
  return buildBaseTemplate(`
    <h2>Vous êtes invité(e) !</h2>
    <p>Bonjour ${data.inviteeName},</p>
    <p><strong>${data.inviterName}</strong> vous invite à rejoindre la room <strong>"${data.roomName}"</strong> sur Swipe Movie.</p>
    <p>Swipez ensemble pour trouver le film parfait à regarder !</p>
    <p style="text-align: center;">
      <a href="${data.joinUrl}" class="button">Rejoindre la room</a>
    </p>
    <p style="color: #666; font-size: 14px;">
      Code de la room : <strong>${data.roomCode}</strong><br>
      Ou copiez ce lien : ${data.joinUrl}
    </p>
  `, baseUrl);
}

export function buildMatchNotificationEmail(data: MatchNotificationEmailData, baseUrl: string): string {
  const posterHtml = data.moviePoster
    ? `<img src="${data.moviePoster}" alt="${data.movieTitle}" class="movie-poster">`
    : '';

  return buildBaseTemplate(`
    <h2>Nouveau match !</h2>
    <p>Bonjour ${data.userName},</p>
    <p>Bonne nouvelle ! Vous avez un nouveau match dans la room <strong>"${data.roomName}"</strong> :</p>
    <div class="movie-card">
      ${posterHtml}
      <div>
        <h3 style="margin: 0;">${data.movieTitle}</h3>
        <p style="margin: 8px 0 0; color: #666;">Tout le monde a swipé à droite !</p>
      </div>
    </div>
    <p style="text-align: center;">
      <a href="${data.roomUrl}" class="button">Voir les détails</a>
    </p>
  `, baseUrl);
}

export function buildWeeklyDigestEmail(data: WeeklyDigestEmailData, baseUrl: string): string {
  const topMatchHtml = data.topMatch ? `
    <h3>Film le plus matché</h3>
    <div class="movie-card">
      ${data.topMatch.poster ? `<img src="${data.topMatch.poster}" alt="${data.topMatch.title}" class="movie-poster">` : ''}
      <div>
        <h4 style="margin: 0;">${data.topMatch.title}</h4>
      </div>
    </div>
  ` : '';

  return buildBaseTemplate(`
    <h2>Votre semaine en résumé</h2>
    <p>Bonjour ${data.userName},</p>
    <p>Voici votre activité de la semaine sur Swipe Movie :</p>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">${data.totalSwipes}</div>
        <div class="stat-label">Swipes</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${data.newMatches}</div>
        <div class="stat-label">Nouveaux matchs</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${data.roomsActive}</div>
        <div class="stat-label">Rooms actives</div>
      </div>
    </div>
    ${topMatchHtml}
    <p style="text-align: center;">
      <a href="${baseUrl}/rooms" class="button">Continuer à swiper</a>
    </p>
  `, baseUrl);
}

export function buildWelcomeEmail(userName: string, baseUrl: string): string {
  return buildBaseTemplate(`
    <h2>Bienvenue sur Swipe Movie !</h2>
    <p>Bonjour ${userName},</p>
    <p>Merci de rejoindre Swipe Movie ! Vous êtes prêt(e) à découvrir une nouvelle façon de choisir vos films.</p>
    <h3>Comment ça marche ?</h3>
    <ol>
      <li><strong>Créez une room</strong> et invitez vos amis ou votre famille</li>
      <li><strong>Swipez</strong> sur les films : droite si ça vous tente, gauche sinon</li>
      <li><strong>Découvrez vos matchs</strong> : les films que tout le monde veut voir !</li>
    </ol>
    <p style="text-align: center;">
      <a href="${baseUrl}/rooms" class="button">Créer ma première room</a>
    </p>
    <p style="color: #666; font-size: 14px;">
      Des questions ? Répondez simplement à cet email, nous sommes là pour vous aider.
    </p>
  `, baseUrl);
}

export function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
