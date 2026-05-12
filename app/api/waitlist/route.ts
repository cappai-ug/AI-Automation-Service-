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

  console.log('📧 SendGrid Config Check:')
  console.log('  API Key:', apiKey ? '✅ Set' : '❌ Missing')
  console.log('  From Email:', fromEmail ? `✅ ${fromEmail}` : '❌ Missing')

  if (!apiKey || !fromEmail) {
    console.warn('⚠️ SendGrid not fully configured, skipping email')
    return
  }

  sgMail.setApiKey(apiKey)
  sgMail.setDataResidency('eu')

  try {
    console.log(`📧 Attempting to send email to ${email}...`)

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Willkommen bei OPTIMIZED – Ihre kostenlose Demo wartet',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
            h1 { color: #0F172A; }
            .button { background-color: #2563EB; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; border-top: 2px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Willkommen bei OPTIMIZED! 🎉</h1>
            <p>Hallo ${company},</p>
            <p>Danke, dass Sie sich für OPTIMIZED interessieren. Wir wissen, dass Zeit kostbar ist – deshalb möchten wir Ihnen zeigen, wie einfach KI-Automatisierung für Ihr Unternehmen sein kann.</p>

            <h2>Die nächsten Schritte:</h2>
            <ol>
              <li><strong>Kostenlose Demo (15 Min)</strong><br>
                Sehen Sie live, wie OPTIMIZED funktioniert und wie es zu Ihrem Unternehmen passt.<br>
                <a href="https://cal.com/optimized/demo" class="button">Demo buchen</a>
              </li>
              <li><strong>SaaS Plattform testen (kostenlos)</strong><br>
                Beginnen Sie sofort mit der Automatisierung. 14 Tage kostenlos, keine Kreditkarte erforderlich.
              </li>
            </ol>

            <h3>Häufig gestellte Fragen:</h3>
            <ul>
              <li><strong>Kostenloses Angebot?</strong> Ja, beide Optionen sind kostenlos für den Anfang.</li>
              <li><strong>DSGVO-konform?</strong> Ja, 100% DSGVO-konform mit Daten in Deutschland.</li>
              <li><strong>Support?</strong> Wir sind per Email erreichbar (Deutsch sprechend).</li>
            </ul>

            <div class="footer">
              <p>OPTIMIZED GmbH | hello@optimized.de | www.optimized.de</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const response = await sgMail.send(msg)
    console.log('✅ Email sent successfully to', email)
    console.log('SendGrid Response:', response[0].statusCode)
    return true
  } catch (error: any) {
    console.error('❌ SendGrid Error:', error.message || error)
    if (error.response) {
      console.error('Response body:', error.response.body)
    }
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, company, useCase } = body

    if (!email || !company || !useCase) {
      return NextResponse.json(
        { error: 'Erforderliche Felder fehlen' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      )
    }

    const existingEntry = await getPrisma().waitlist.findUnique({
      where: { email }
    })

    if (existingEntry) {
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

    console.log('✅ Waitlist entry created:', entry.id)

    await sendWelcomeEmail(email, company)

    return NextResponse.json(
      {
        success: true,
        message: 'Danke! Sie wurden zur Warteliste hinzugefügt. Wir schreiben Ihnen noch heute eine E-Mail mit Ihrem Demo-Link!',
        status: 'success'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Waitlist error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    )
  }
}
