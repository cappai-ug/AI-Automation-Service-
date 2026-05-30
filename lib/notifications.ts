import sgMail from '@sendgrid/mail'

const DEFAULT_RECIPIENT = 'info@cappai-ug.de'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.optimazed.de'

type NotifyOptions = {
  /** Headline rendered prominently in the email body. */
  subject: string
  /** One-line preview / lead text shown right under the headline. */
  intro?: string
  /** Key/value rows rendered as a small table. Order is preserved. */
  fields: Array<{ label: string; value: string | null | undefined }>
  /** Optional admin/CRM link the operator can click to see the full record. */
  ctaUrl?: string
  ctaLabel?: string
  /** Source channel for context (waitlist, newsletter_form, lead_magnet_*, etc.). */
  source?: string
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Send an operator notification to the team inbox. Fire-and-forget by design —
 * callers should wrap this in a try/catch and never fail the user-facing flow
 * on a notification error. The recipient is configurable via NOTIFICATION_EMAIL,
 * defaulting to info@cappai-ug.de.
 */
export async function notifyOperator(opts: NotifyOptions): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  const to = process.env.NOTIFICATION_EMAIL || DEFAULT_RECIPIENT

  if (!apiKey || !fromEmail) {
    console.warn(
      '[notifyOperator] SENDGRID_API_KEY / SENDGRID_FROM_EMAIL not set — skipping notification'
    )
    return
  }

  sgMail.setApiKey(apiKey)

  const rows = opts.fields
    .filter((f) => f.value && String(f.value).trim().length > 0)
    .map(
      (f) =>
        `<tr><td style="padding:6px 14px 6px 0; color:#475569; vertical-align:top;"><strong>${escapeHtml(f.label)}</strong></td><td style="padding:6px 0; color:#0f172a;">${escapeHtml(String(f.value))}</td></tr>`
    )
    .join('')

  const ctaHtml =
    opts.ctaUrl && opts.ctaLabel
      ? `<p style="margin-top:20px;"><a href="${opts.ctaUrl}" style="background-color:#06b6d4; color:white; padding:10px 20px; text-decoration:none; border-radius:6px; font-weight:600; display:inline-block;">${escapeHtml(opts.ctaLabel)}</a></p>`
      : ''

  const html = `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px; color:#0f172a; line-height:1.6;">
  <h1 style="color:#0a1027; font-size:20px; margin:0 0 6px 0;">${escapeHtml(opts.subject)}</h1>
  ${opts.intro ? `<p style="color:#475569; margin:0 0 18px 0;">${escapeHtml(opts.intro)}</p>` : ''}
  <table style="width:100%; border-collapse:collapse; font-size:14px;">${rows}</table>
  ${ctaHtml}
  <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;">
  <p style="font-size:12px; color:#94a3b8;">
    Automatische Benachrichtigung von ${SITE_URL.replace(/^https?:\/\//, '')}
    ${opts.source ? ` · Quelle: <code>${escapeHtml(opts.source)}</code>` : ''}
  </p>
</body></html>`

  const textRows = opts.fields
    .filter((f) => f.value && String(f.value).trim().length > 0)
    .map((f) => `${f.label}: ${f.value}`)
    .join('\n')

  const text =
    `${opts.subject}\n` +
    (opts.intro ? `\n${opts.intro}\n` : '') +
    `\n${textRows}\n` +
    (opts.ctaUrl ? `\n${opts.ctaLabel ?? 'Link'}: ${opts.ctaUrl}\n` : '') +
    `\n— Automatische Benachrichtigung von ${SITE_URL}` +
    (opts.source ? ` (Quelle: ${opts.source})` : '')

  await sgMail.send({
    to,
    from: fromEmail,
    replyTo: fromEmail,
    subject: opts.subject,
    html,
    text,
  })
}
