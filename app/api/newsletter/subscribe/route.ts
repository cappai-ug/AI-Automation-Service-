import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import {
  CONSENT_TEXT_LEAD_MAGNET,
  CONSENT_TEXT_NEWSLETTER,
  generateToken,
  sendConfirmationEmail,
  LEAD_MAGNETS,
} from '@/lib/newsletter'

export const dynamic = 'force-dynamic'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : null
    const source =
      typeof body.source === 'string' && body.source.length > 0
        ? body.source.slice(0, 80)
        : 'newsletter_form'
    const consentChecked = body.consent === true

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }, { status: 400 })
    }
    if (!consentChecked) {
      return NextResponse.json(
        { error: 'Bitte stimmen Sie der Einwilligung zu, um sich anzumelden.' },
        { status: 400 }
      )
    }

    const isLeadMagnet = source.startsWith('lead_magnet_')
    if (isLeadMagnet && !LEAD_MAGNETS[source]) {
      return NextResponse.json({ error: 'Unbekannter Lead-Magnet.' }, { status: 400 })
    }

    const consentText = isLeadMagnet ? CONSENT_TEXT_LEAD_MAGNET : CONSENT_TEXT_NEWSLETTER
    const consentIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null
    const consentUserAgent = request.headers.get('user-agent') || null

    const prisma = getPrisma()
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })

    let subscriber
    if (existing) {
      if (existing.status === 'confirmed') {
        // Already on the list — pretend success without re-sending DOI.
        return NextResponse.json({
          ok: true,
          alreadyConfirmed: true,
          message: 'Diese E-Mail-Adresse ist bereits angemeldet.',
        })
      }
      // pending or unsubscribed → reset tokens, re-send DOI
      subscriber = await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          name: name ?? existing.name,
          source,
          status: 'pending',
          confirmToken: generateToken(),
          unsubscribeToken: generateToken(),
          consentText,
          consentIp,
          consentUserAgent,
          subscribedAt: new Date(),
          confirmedAt: null,
          unsubscribedAt: null,
        },
      })
    } else {
      subscriber = await prisma.newsletterSubscriber.create({
        data: {
          email,
          name,
          source,
          status: 'pending',
          confirmToken: generateToken(),
          unsubscribeToken: generateToken(),
          consentText,
          consentIp,
          consentUserAgent,
        },
      })
    }

    try {
      await sendConfirmationEmail({
        to: subscriber.email,
        name: subscriber.name,
        confirmToken: subscriber.confirmToken,
        source: subscriber.source,
      })
    } catch (err) {
      console.error('Failed to send confirmation email:', err)
      // We don't return error to client — the subscriber row exists,
      // admin can resend manually. But we do log.
    }

    return NextResponse.json({
      ok: true,
      message:
        'Bitte prüfen Sie Ihren Posteingang und bestätigen Sie die Anmeldung über den Link in der E-Mail.',
    })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Anmeldung fehlgeschlagen. Bitte später erneut versuchen.' }, { status: 500 })
  }
}
