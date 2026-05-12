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
