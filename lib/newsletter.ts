import crypto from 'crypto'
import sgMail from '@sendgrid/mail'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.optimazed.de'

export const CONSENT_TEXT_NEWSLETTER =
  'Ich abonniere den OPTIMAZED-Newsletter und erhalte E-Mails mit Tipps zu KI-Automatisierung, neuen Blogartikeln und Produktneuigkeiten. Mit Klick auf den Bestätigungslink in der nächsten E-Mail bestätige ich meine Einwilligung. Eine Abmeldung ist jederzeit möglich.'

export const CONSENT_TEXT_LEAD_MAGNET =
  'Ich erhalte die ausgewählte Checkliste/das Whitepaper per E-Mail und abonniere damit den OPTIMAZED-Newsletter mit Tipps zu KI-Automatisierung. Mit Klick auf den Bestätigungslink in der nächsten E-Mail bestätige ich meine Einwilligung. Eine Abmeldung ist jederzeit möglich.'

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function confirmUrl(token: string): string {
  return `${BASE_URL}/api/newsletter/confirm?token=${token}`
}

export function unsubscribeUrl(token: string): string {
  return `${BASE_URL}/api/newsletter/unsubscribe?token=${token}`
}

// Lead-magnet downloads: map source slug → public PDF URL + display name.
// Drop files into public/downloads/ and add an entry here.
export const LEAD_MAGNETS: Record<
  string,
  { title: string; url: string }
> = {
  lead_magnet_praxis_checklist: {
    title: 'Checkliste: 7 Aufgaben, die KI in Ihrer Praxis sofort übernehmen kann',
    url: `${BASE_URL}/downloads/checkliste-ki-praxis.pdf`,
  },
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

type ConfirmationEmailOptions = {
  to: string
  name?: string | null
  confirmToken: string
  source: string
}

export async function sendConfirmationEmail(opts: ConfirmationEmailOptions): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  if (!apiKey || !fromEmail) {
    throw new Error('SENDGRID_API_KEY / SENDGRID_FROM_EMAIL not configured')
  }
  sgMail.setApiKey(apiKey)

  const url = confirmUrl(opts.confirmToken)
  const greeting = opts.name ? `Hallo ${escapeHtml(opts.name)},` : 'Hallo,'
  const magnet = LEAD_MAGNETS[opts.source]
  const subject = magnet
    ? `Bitte bestätigen: Ihr Download "${magnet.title}"`
    : 'Bitte bestätigen Sie Ihre Newsletter-Anmeldung'

  const html = `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px; color:#0a1027; line-height:1.6;">
  <h1 style="color:#0a1027; font-size:24px; margin-bottom:16px;">${
    magnet ? `Ihr Download liegt bereit` : `Fast geschafft!`
  }</h1>
  <p>${greeting}</p>
  ${
    magnet
      ? `<p>Sie haben unsere Checkliste <strong>${escapeHtml(magnet.title)}</strong> angefordert. Sobald Sie unten bestätigen, schicken wir Ihnen den Download-Link an diese Adresse.</p>`
      : `<p>Sie haben sich für den OPTIMAZED-Newsletter angemeldet. Damit wir Ihnen E-Mails senden dürfen, bestätigen Sie bitte Ihre Anmeldung — das ist gesetzlich vorgeschrieben (Double-Opt-in).</p>`
  }
  <p style="text-align:center; margin:32px 0;">
    <a href="${url}"
       style="background-color:#06b6d4; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:600; display:inline-block;">
      ${magnet ? 'Anmeldung bestätigen & Download erhalten' : 'Anmeldung bestätigen'}
    </a>
  </p>
  <p style="font-size:13px; color:#666;">Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br>
    <a href="${url}" style="color:#06b6d4; word-break:break-all;">${url}</a>
  </p>
  <hr style="border:none; border-top:1px solid #eee; margin:32px 0;">
  <p style="font-size:12px; color:#999;">
    Sie haben diese E-Mail erhalten, weil Ihre Adresse zur Anmeldung beim OPTIMAZED-Newsletter angegeben wurde. Falls das ein Versehen war, ignorieren Sie diese E-Mail einfach — ohne Bestätigung erfolgt keine Speicherung über die rechtlich notwendige Frist hinaus.
  </p>
  <p style="font-size:12px; color:#999;">
    OPTIMAZED · ${BASE_URL.replace(/^https?:\/\//, '')}
  </p>
</body></html>`

  const text = `${greeting}

${
  magnet
    ? `Sie haben unsere Checkliste "${magnet.title}" angefordert. Bitte bestätigen Sie Ihre Anmeldung über den folgenden Link — danach erhalten Sie den Download:`
    : 'Sie haben sich für den OPTIMAZED-Newsletter angemeldet. Bitte bestätigen Sie Ihre Anmeldung über den folgenden Link (Double-Opt-in ist gesetzlich vorgeschrieben):'
}

${url}

Falls das ein Versehen war, ignorieren Sie diese E-Mail.

OPTIMAZED · ${BASE_URL.replace(/^https?:\/\//, '')}`

  await sgMail.send({ to: opts.to, from: fromEmail, subject, html, text })
}

type WelcomeEmailOptions = {
  to: string
  name?: string | null
  source: string
  unsubscribeToken: string
}

export async function sendWelcomeAndDeliverMagnet(opts: WelcomeEmailOptions): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  if (!apiKey || !fromEmail) {
    throw new Error('SENDGRID_API_KEY / SENDGRID_FROM_EMAIL not configured')
  }
  sgMail.setApiKey(apiKey)

  const magnet = LEAD_MAGNETS[opts.source]
  const greeting = opts.name ? `Hallo ${escapeHtml(opts.name)},` : 'Hallo,'
  const unsub = unsubscribeUrl(opts.unsubscribeToken)
  const subject = magnet
    ? `Ihr Download: ${magnet.title}`
    : 'Willkommen beim OPTIMAZED-Newsletter'

  const html = `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px; color:#0a1027; line-height:1.6;">
  <h1 style="color:#0a1027; font-size:24px; margin-bottom:16px;">${
    magnet ? 'Vielen Dank — hier ist Ihr Download' : 'Willkommen!'
  }</h1>
  <p>${greeting}</p>
  ${
    magnet
      ? `<p>danke für Ihre Bestätigung. Hier ist Ihre Checkliste:</p>
         <p style="text-align:center; margin:24px 0;">
           <a href="${magnet.url}"
              style="background-color:#06b6d4; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:600; display:inline-block;">
             ${escapeHtml(magnet.title)} herunterladen
           </a>
         </p>
         <p>Sie sind jetzt auch beim OPTIMAZED-Newsletter angemeldet und bekommen ca. 1 Mail pro Woche mit Tipps zu KI-Automatisierung, neuen Blogartikeln und Branchen-Updates.</p>`
      : `<p>vielen Dank, dass Sie sich für unseren Newsletter angemeldet haben. Sie erhalten ca. 1 Mail pro Woche mit:</p>
         <ul>
           <li>Praxisnahen Tipps zu KI-Automatisierung im Mittelstand</li>
           <li>Neuen Artikeln aus unserem Blog</li>
           <li>Branchen-Updates zu DSGVO, AI Act &amp; Co.</li>
         </ul>`
  }
  <p>Viele Grüße<br>Ihr OPTIMAZED-Team</p>
  <hr style="border:none; border-top:1px solid #eee; margin:32px 0;">
  <p style="font-size:12px; color:#999;">
    Sie erhalten diese E-Mail, weil Sie sich am ${new Date().toLocaleDateString('de-DE')} für den OPTIMAZED-Newsletter angemeldet und Ihre Anmeldung bestätigt haben.
    <br><br>
    <a href="${unsub}" style="color:#999;">Newsletter abbestellen</a> ·
    <a href="${BASE_URL}/datenschutz" style="color:#999;">Datenschutz</a> ·
    <a href="${BASE_URL}/impressum" style="color:#999;">Impressum</a>
  </p>
</body></html>`

  const text = `${greeting}

${
  magnet
    ? `danke für Ihre Bestätigung. Hier ist Ihre Checkliste "${magnet.title}":\n\n${magnet.url}\n\nSie sind jetzt auch beim OPTIMAZED-Newsletter angemeldet (ca. 1 Mail pro Woche).`
    : 'vielen Dank, dass Sie sich für unseren Newsletter angemeldet haben.\n\nSie erhalten ca. 1 Mail pro Woche mit Tipps zu KI-Automatisierung, neuen Blogartikeln und Branchen-Updates.'
}

Viele Grüße
Ihr OPTIMAZED-Team

—
Abmelden: ${unsub}
Datenschutz: ${BASE_URL}/datenschutz`

  await sgMail.send({ to: opts.to, from: fromEmail, subject, html, text })
}

type CampaignEmailOptions = {
  to: string
  name?: string | null
  subject: string
  bodyHtml: string
  bodyText: string
  unsubscribeToken: string
}

/**
 * Send a single newsletter campaign email with the legally required
 * unsubscribe footer appended automatically.
 */
export async function sendCampaignEmail(opts: CampaignEmailOptions): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  if (!apiKey || !fromEmail) {
    throw new Error('SENDGRID_API_KEY / SENDGRID_FROM_EMAIL not configured')
  }
  sgMail.setApiKey(apiKey)

  const unsub = unsubscribeUrl(opts.unsubscribeToken)
  const footerHtml = `
    <hr style="border:none; border-top:1px solid #eee; margin:32px 0;">
    <p style="font-size:12px; color:#999;">
      OPTIMAZED · KI-Automatisierung für deutsche KMU<br>
      <a href="${unsub}" style="color:#999;">Newsletter abbestellen</a> ·
      <a href="${BASE_URL}/datenschutz" style="color:#999;">Datenschutz</a> ·
      <a href="${BASE_URL}/impressum" style="color:#999;">Impressum</a>
    </p>`
  const footerText = `\n\n—\nAbmelden: ${unsub}\nDatenschutz: ${BASE_URL}/datenschutz`

  await sgMail.send({
    to: opts.to,
    from: fromEmail,
    subject: opts.subject,
    html: `<div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px; color:#0a1027; line-height:1.6;">${opts.bodyHtml}${footerHtml}</div>`,
    text: opts.bodyText + footerText,
    headers: {
      // RFC 8058 one-click unsubscribe header for inbox providers
      'List-Unsubscribe': `<${unsub}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })
}
