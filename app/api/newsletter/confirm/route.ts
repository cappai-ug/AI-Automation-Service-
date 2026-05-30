import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { sendWelcomeAndDeliverMagnet } from '@/lib/newsletter'

export const dynamic = 'force-dynamic'

/**
 * GET requests come from email scanners (Microsoft Safelinks, Gmail
 * prefetch, etc.) before the user even clicks. We must NOT confirm here
 * or the subscriber's status flips to "confirmed" before they actually
 * see the email.
 *
 * GET therefore just redirects to the interstitial /newsletter/confirm
 * page, which shows a "Bestätigen"-button that POSTs to this endpoint.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  return NextResponse.redirect(
    new URL(`/newsletter/confirm?token=${encodeURIComponent(token)}`, request.url)
  )
}

/**
 * POST flips the status to confirmed. Email scanners don't issue POST
 * requests, so this only runs when the user clicks the button.
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/newsletter/confirmed?status=error', request.url))
  }

  const prisma = getPrisma()
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { confirmToken: token },
  })

  if (!subscriber) {
    return NextResponse.redirect(new URL('/newsletter/confirmed?status=invalid', request.url))
  }

  if (subscriber.status === 'confirmed') {
    return NextResponse.redirect(new URL('/newsletter/confirmed?status=already', request.url))
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { status: 'confirmed', confirmedAt: new Date() },
  })

  try {
    await sendWelcomeAndDeliverMagnet({
      to: subscriber.email,
      name: subscriber.name,
      source: subscriber.source,
      unsubscribeToken: subscriber.unsubscribeToken,
    })
  } catch (err) {
    console.error('Failed to send welcome email:', err)
  }

  // Operator-Notification — confirmed lead (höhere Qualität als pending)
  try {
    const { notifyOperator } = await import('@/lib/notifications')
    const isLeadMagnet = subscriber.source.startsWith('lead_magnet_')
    await notifyOperator({
      subject: isLeadMagnet
        ? '✅ Lead-Magnet bestätigt — neuer Newsletter-Abonnent'
        : '✅ Newsletter-Anmeldung bestätigt',
      intro: isLeadMagnet
        ? 'Der Lead-Magnet wurde angefordert UND die Anmeldung per Double-Opt-in bestätigt. Heißer Lead.'
        : 'Die Newsletter-Anmeldung wurde per Double-Opt-in bestätigt.',
      source: subscriber.source,
      fields: [
        { label: 'E-Mail', value: subscriber.email },
        { label: 'Name', value: subscriber.name },
        { label: 'Status', value: 'confirmed' },
        {
          label: 'Angemeldet seit',
          value: subscriber.subscribedAt
            ? new Date(subscriber.subscribedAt).toLocaleString('de-DE')
            : null,
        },
      ],
      ctaUrl: 'https://www.optimazed.de/admin/newsletter',
      ctaLabel: 'Im Admin öffnen',
    })
  } catch (err) {
    console.error('Operator notification failed:', err)
  }

  return NextResponse.redirect(new URL('/newsletter/confirmed?status=ok', request.url), {
    status: 303, // POST → GET on the target
  })
}
