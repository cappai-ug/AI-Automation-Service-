import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import sgMail from '@sendgrid/mail'

let prisma: PrismaClient

function getPrisma() {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    prisma = new PrismaClient({ adapter })
  }
  return prisma
}

async function sendWelcomeEmail(email: string, company: string) {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL

  console.log('📧 [sendWelcomeEmail] Called for:', email)
  console.log('📧 [sendWelcomeEmail] Config Check:')
  console.log('  - API Key exists:', !!apiKey)
  console.log('  - From Email:', fromEmail)

  if (!apiKey || !fromEmail) {
    console.warn('⚠️ [sendWelcomeEmail] SendGrid not fully configured, skipping')
    return false
  }

  sgMail.setApiKey(apiKey)

  try {
    console.log(`📧 [sendWelcomeEmail] Attempting to send to ${email}...`)

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          h1 { color: #0F172A; margin-top: 0; font-size: 28px; line-height: 1.3; }
          h2 { color: #0F172A; font-size: 18px; margin-top: 20px; }
          p { color: #4B5563; line-height: 1.6; margin: 10px 0; }
          .button { background-color: #2563EB; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 15px 0; font-weight: 600; }
          .button:hover { background-color: #1d4ed8; }
          ul { color: #4B5563; padding-left: 20px; }
          li { margin: 8px 0; }
          .footer { color: #9CA3AF; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .divider { height: 1px; background-color: #e5e7eb; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Willkommen bei OPTIMIZED!</h1>
          <p>Hallo ${company},</p>
          <p>vielen Dank, dass Sie sich für OPTIMIZED interessieren. Wir freuen uns, Sie bei Ihrer digitalen Transformation zu unterstützen.</p>

          <div class="divider"></div>

          <h2>Die nächsten Schritte:</h2>
          <p><strong>1. Kostenlose Optimization Call (30 Min)</strong></p>
          <p>Gemeinsam analysieren wir Ihre Anforderungen und zeigen Ihnen, wie OPTIMIZED Ihre Prozesse automatisiert.</p>
          <a href="https://cal.com/optimized/demo" class="button">Jetzt Termin buchen</a>

          <p><strong>2. Kostenlos testen</strong></p>
          <p>Erhalten Sie 14 Tage kostenlosen Zugriff auf OPTIMIZED. Keine Kreditkarte erforderlich.</p>

          <div class="divider"></div>

          <h2>Häufig gestellte Fragen</h2>
          <ul>
            <li><strong>Was kostet OPTIMIZED?</strong> Unsere Pläne beginnen bei €299/Monat. Kostenlose Testwoche inklusive.</li>
            <li><strong>Wie lange dauert die Integration?</strong> Die meisten Integrationen sind innerhalb von 48 Stunden aktiv.</li>
            <li><strong>Ist OPTIMIZED DSGVO-konform?</strong> Ja, 100% DSGVO-konform mit Servern in Deutschland.</li>
            <li><strong>Kann ich jederzeit kündigen?</strong> Ja, monatlich kündbar, keine Bindung.</li>
          </ul>

          <div class="divider"></div>

          <p>Bei Fragen stehe ich Ihnen gerne zur Verfügung.</p>
          <p><strong>Viele Grüße,</strong><br>Das OPTIMIZED Team</p>

          <div class="footer">
            <p>OPTIMIZED GmbH<br>
            Email: hello@optimized.de<br>
            Website: <a href="https://www.optimazed.de" style="color: #2563EB; text-decoration: none;">www.optimazed.de</a></p>
            <p><a href="https://www.optimazed.de/datenschutz" style="color: #2563EB; text-decoration: none;">Datenschutzerklärung</a> | <a href="https://www.optimazed.de/impressum" style="color: #2563EB; text-decoration: none;">Impressum</a></p>
          </div>
        </div>
      </body>
      </html>
    `

    const textContent = `Willkommen bei OPTIMIZED!

Hallo ${company},

vielen Dank, dass Sie sich für OPTIMIZED interessieren. Wir freuen uns, Sie bei Ihrer digitalen Transformation zu unterstützen.

Die nächsten Schritte:

1. Kostenlose Optimization Call (30 Min)
Gemeinsam analysieren wir Ihre Anforderungen und zeigen Ihnen, wie OPTIMIZED Ihre Prozesse automatisiert.
Jetzt Termin buchen: https://cal.com/optimized/demo

2. Kostenlos testen
Erhalten Sie 14 Tage kostenlosen Zugriff auf OPTIMIZED. Keine Kreditkarte erforderlich.

Häufig gestellte Fragen:

- Was kostet OPTIMIZED? Unsere Pläne beginnen bei €299/Monat. Kostenlose Testwoche inklusive.
- Wie lange dauert die Integration? Die meisten Integrationen sind innerhalb von 48 Stunden aktiv.
- Ist OPTIMIZED DSGVO-konform? Ja, 100% DSGVO-konform mit Servern in Deutschland.
- Kann ich jederzeit kündigen? Ja, monatlich kündbar, keine Bindung.

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Viele Grüße,
Das OPTIMIZED Team

---
OPTIMIZED GmbH
Email: hello@optimized.de
Website: https://www.optimazed.de

Datenschutzerklärung: https://www.optimazed.de/datenschutz`

    const msg = {
      to: email,
      from: fromEmail,
      replyTo: 'hello@optimized.de',
      subject: 'Willkommen bei OPTIMIZED – Ihre kostenlose Consultation',
      text: textContent,
      html: htmlContent,
      headers: {
        'List-Unsubscribe': '<mailto:hello@optimized.de?subject=unsubscribe>',
        'X-Priority': '3',
      },
    }

    const response = await sgMail.send(msg)
    console.log('✅ [sendWelcomeEmail] Email sent successfully')
    console.log('✅ [sendWelcomeEmail] SendGrid Status Code:', response[0].statusCode)
    return true
  } catch (error: any) {
    console.error('❌ [sendWelcomeEmail] Error occurred')
    console.error('❌ Error message:', error.message)
    console.error('❌ Error code:', error.code)
    if (error.response) {
      console.error('❌ Response body:', error.response.body)
    }
    console.error('❌ Full error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  console.log('📨 [POST /api/waitlist] Request received')
  try {
    const body = await request.json()
    const { email, company, useCase } = body

    console.log('📨 [POST] Email:', email)
    console.log('📨 [POST] Company:', company)

    if (!email || !company || !useCase) {
      console.warn('⚠️ [POST] Missing required fields')
      return NextResponse.json(
        { error: 'Erforderliche Felder fehlen' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.warn('⚠️ [POST] Invalid email format')
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      )
    }

    const existingEntry = await getPrisma().waitlist.findUnique({
      where: { email }
    })

    if (existingEntry) {
      console.log('ℹ️ [POST] Email already exists in waitlist')
      return NextResponse.json(
        {
          success: true,
          message: 'Sie sind bereits auf unserer Warteliste registriert.',
          status: 'already_exists'
        },
        { status: 200 }
      )
    }

    const entry = await getPrisma().waitlist.create({
      data: {
        email,
        company,
        useCase,
        status: 'new',
        source: 'landing_page'
      }
    })

    console.log('✅ [POST] Database entry created:', entry.id)

    console.log('📧 [POST] Calling sendWelcomeEmail...')
    const emailSent = await sendWelcomeEmail(email, company)
    console.log('📧 [POST] sendWelcomeEmail returned:', emailSent)

    return NextResponse.json(
      {
        success: true,
        message: 'Danke! Sie wurden zur Warteliste hinzugefügt. Wir schreiben Ihnen noch heute eine E-Mail mit Ihrem Demo-Link!',
        status: 'success',
        emailSent: emailSent
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ [POST] Waitlist error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    )
  }
}
