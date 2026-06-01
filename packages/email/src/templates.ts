import type {
  RoomInviteEmailData,
  MatchNotificationEmailData,
  WeeklyDigestEmailData,
  RoomExpiryReminderEmailData,
} from './types';
import {
  t,
  fill,
  resolveEmailLocale,
  type EmailLocale,
} from './i18n';

/**
 * Brand palette (from the app's globals.css):
 *   pink   #EC4899  →  purple #A855F7   (logo gradient)
 * Dark "cinema" theme. Everything is TABLE-BASED with INLINE styles because
 * email clients (Outlook, parts of Gmail) ignore <style>/flex/grid.
 *
 * All copy comes from ./i18n keyed by locale (fr/en/es/it/de).
 */
const C = {
  bg: '#0b0b10',
  card: '#15151f',
  cardAlt: '#1d1d2b',
  border: '#2a2a3a',
  text: '#ececf1',
  textMuted: '#a0a0b0',
  textFaint: '#6b6b7b',
  pink: '#EC4899',
  purple: '#A855F7',
  white: '#ffffff',
};

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function button(label: string, href: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 24px auto;">
    <tr>
      <td align="center">
        <a href="${href}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: ${FONT}; font-size: 16px; font-weight: 700; color: ${C.white}; text-decoration: none; border-radius: 10px; background-color: ${C.purple}; background-image: linear-gradient(135deg, ${C.pink} 0%, ${C.purple} 100%);">${label}</a>
      </td>
    </tr>
  </table>`;
}

export function buildBaseTemplate(
  content: string,
  baseUrl: string,
  locale: EmailLocale = 'fr',
): string {
  const s = t(locale);
  return `<!DOCTYPE html>
<html lang="${locale}" style="margin:0;padding:0;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Swipe Movie</title>
</head>
<body style="margin:0; padding:0; background-color:${C.bg}; color:${C.text}; font-family:${FONT}; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">Swipe Movie</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.bg};">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%; background-color:${C.card}; border:1px solid ${C.border}; border-radius:16px; overflow:hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, ${C.pink} 0%, ${C.purple} 100%); background-color:${C.purple}; padding: 36px 24px; text-align:center;">
              <span style="font-family:${FONT}; font-size:26px; font-weight:800; letter-spacing:-0.5px; color:${C.white};">🎬 Swipe Movie</span>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 32px;">
              ${content}
            </td>
          </tr>

          <tr>
            <td style="padding: 28px 32px; border-top:1px solid ${C.border}; text-align:center;">
              <p style="margin:0 0 6px; font-family:${FONT}; font-size:14px; color:${C.textMuted};">${s.footer_tagline}</p>
              <p style="margin:0 0 16px; font-family:${FONT}; font-size:14px;">
                <a href="${baseUrl}" target="_blank" style="color:${C.pink}; text-decoration:none;">swipe-movie.com</a>
              </p>
              <p style="margin:0; font-family:${FONT}; font-size:12px; color:${C.textFaint}; line-height:1.6;">
                ${s.footer_legal}<br>
                <a href="${baseUrl}/settings" target="_blank" style="color:${C.textFaint}; text-decoration:underline;">${s.footer_manage}</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function h2(text: string): string {
  return `<h1 style="margin:0 0 20px; font-family:${FONT}; font-size:24px; font-weight:800; color:${C.text}; letter-spacing:-0.4px;">${text}</h1>`;
}
function p(text: string, muted = false): string {
  return `<p style="margin:0 0 16px; font-family:${FONT}; font-size:16px; line-height:1.65; color:${muted ? C.textMuted : C.text};">${text}</p>`;
}

function movieCard(title: string, poster: string | undefined, subtitle: string): string {
  const posterCell = poster
    ? `<td width="80" valign="top" style="padding-right:16px;">
         <img src="${poster}" alt="${title}" width="80" style="width:80px; border-radius:8px; display:block;">
       </td>`
    : '';
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.cardAlt}; border:1px solid ${C.border}; border-radius:12px; margin:20px 0;">
    <tr>
      <td style="padding:16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            ${posterCell}
            <td valign="middle">
              <div style="font-family:${FONT}; font-size:18px; font-weight:700; color:${C.text};">${title}</div>
              <div style="font-family:${FONT}; font-size:14px; color:${C.textMuted}; margin-top:6px;">${subtitle}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export function buildRoomInviteEmail(
  data: RoomInviteEmailData,
  baseUrl: string,
  localeInput?: string,
): string {
  const locale = resolveEmailLocale(localeInput);
  const s = t(locale);
  return buildBaseTemplate(
    `
    ${h2(s.invite_title)}
    ${p(fill(s.greeting, { name: data.inviteeName }))}
    ${p(fill(s.invite_body, { inviterName: `<strong style="color:${C.text};">${data.inviterName}</strong>`, roomName: `<strong style="color:${C.pink};">${data.roomName}</strong>` }))}
    ${p(s.invite_sub, true)}
    ${button(s.invite_cta, data.joinUrl)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.cardAlt}; border:1px dashed ${C.border}; border-radius:10px; margin-top:8px;">
      <tr><td style="padding:14px 16px; text-align:center; font-family:${FONT}; font-size:14px; color:${C.textMuted};">
        ${s.invite_code_label} <strong style="color:${C.text}; letter-spacing:2px;">${data.roomCode}</strong>
      </td></tr>
    </table>
  `,
    baseUrl,
    locale,
  );
}

export function buildMatchNotificationEmail(
  data: MatchNotificationEmailData,
  baseUrl: string,
  localeInput?: string,
): string {
  const locale = resolveEmailLocale(localeInput);
  const s = t(locale);
  return buildBaseTemplate(
    `
    ${h2(s.match_title)}
    ${p(fill(s.greeting, { name: data.userName }))}
    ${p(fill(s.match_body, { roomName: `<strong style="color:${C.pink};">${data.roomName}</strong>` }))}
    ${movieCard(data.movieTitle, data.moviePoster, s.match_card_subtitle)}
    ${button(s.match_cta, data.roomUrl)}
  `,
    baseUrl,
    locale,
  );
}

export function buildWeeklyDigestEmail(
  data: WeeklyDigestEmailData,
  baseUrl: string,
  localeInput?: string,
): string {
  const locale = resolveEmailLocale(localeInput);
  const s = t(locale);
  const stat = (value: number | string, label: string) => `
    <td width="33%" align="center" style="padding:8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.cardAlt}; border:1px solid ${C.border}; border-radius:12px;">
        <tr><td align="center" style="padding:18px 8px;">
          <div style="font-family:${FONT}; font-size:30px; font-weight:800; color:${C.pink};">${value}</div>
          <div style="font-family:${FONT}; font-size:13px; color:${C.textMuted}; margin-top:4px;">${label}</div>
        </td></tr>
      </table>
    </td>`;

  const topMatchHtml = data.topMatch
    ? `${p(`<strong style="color:${C.text};">${s.digest_topmatch_label}</strong>`)}
       ${movieCard(data.topMatch.title, data.topMatch.poster, s.digest_topmatch_subtitle)}`
    : '';

  return buildBaseTemplate(
    `
    ${h2(s.digest_title)}
    ${p(fill(s.greeting, { name: data.userName }))}
    ${p(s.digest_intro, true)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">
      <tr>
        ${stat(data.totalSwipes, s.digest_stat_swipes)}
        ${stat(data.newMatches, s.digest_stat_matches)}
        ${stat(data.roomsActive, s.digest_stat_rooms)}
      </tr>
    </table>
    ${topMatchHtml}
    ${button(s.digest_cta, `${baseUrl}/rooms`)}
  `,
    baseUrl,
    locale,
  );
}

export function buildRoomExpiryReminderEmail(
  data: RoomExpiryReminderEmailData,
  baseUrl: string,
  localeInput?: string,
): string {
  const locale = resolveEmailLocale(localeInput);
  const s = t(locale);
  const matchLine =
    data.matchCount > 0
      ? p(
          fill(s.expiry_with_matches, {
            matchCount: `<strong style="color:${C.pink};">${data.matchCount}</strong>`,
            // crude pluralization marker used by some locales ("match"/"matchs"/"match(es)")
            plural: data.matchCount > 1 ? 's' : '',
          }),
        )
      : p(s.expiry_no_matches, true);

  return buildBaseTemplate(
    `
    ${h2(s.expiry_title)}
    ${p(fill(s.greeting, { name: data.userName }))}
    ${p(fill(s.expiry_body, { roomName: `<strong style="color:${C.pink};">${data.roomName}</strong>`, timeLeft: `<strong style="color:${C.text};">${data.timeLeft}</strong>` }))}
    ${matchLine}
    ${button(s.expiry_cta, data.roomUrl)}
  `,
    baseUrl,
    locale,
  );
}

export function buildWelcomeEmail(
  userName: string,
  baseUrl: string,
  localeInput?: string,
): string {
  const locale = resolveEmailLocale(localeInput);
  const s = t(locale);
  const step = (n: number, title: string, desc: string) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
      <tr>
        <td width="36" valign="top">
          <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, ${C.pink}, ${C.purple}); background-color:${C.pink}; color:${C.white}; font-family:${FONT}; font-size:14px; font-weight:700; text-align:center; line-height:28px;">${n}</div>
        </td>
        <td valign="top" style="font-family:${FONT}; font-size:15px; line-height:1.5; color:${C.text};">
          <strong>${title}</strong> <span style="color:${C.textMuted};">${desc}</span>
        </td>
      </tr>
    </table>`;

  return buildBaseTemplate(
    `
    ${h2(s.welcome_title)}
    ${p(fill(s.greeting, { name: userName }))}
    ${p(s.welcome_intro, true)}
    <div style="margin:24px 0;">
      ${step(1, s.welcome_step1_title, s.welcome_step1_desc)}
      ${step(2, s.welcome_step2_title, s.welcome_step2_desc)}
      ${step(3, s.welcome_step3_title, s.welcome_step3_desc)}
    </div>
    ${button(s.welcome_cta, `${baseUrl}/rooms`)}
    ${p(s.welcome_help, true)}
  `,
    baseUrl,
    locale,
  );
}

export function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
