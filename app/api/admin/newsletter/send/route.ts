import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { sendCampaignEmail } from '@/lib/newsletter'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
    const bodyHtml = typeof body.bodyHtml === 'string' ? body.bodyHtml : ''
    const bodyText = typeof body.bodyText === 'string' ? body.bodyText : ''
    const dryRun = body.dryRun === true

    if (!subject || subject.length < 3) {
      return NextResponse.json({ error: 'Bitte einen Betreff angeben.' }, { status: 400 })
    }
    if (!bodyHtml.trim() && !bodyText.trim()) {
      return NextResponse.json({ error: 'Bitte einen Inhalt eingeben.' }, { status: 400 })
    }

    const prisma = getPrisma()
    const recipients = await prisma.newsletterSubscriber.findMany({
      where: { status: 'confirmed' },
      select: { id: true, email: true, name: true, unsubscribeToken: true },
    })

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        recipientCount: recipients.length,
        message: `Es würden ${recipients.length} bestätigte Abonnenten erreicht.`,
      })
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'Keine bestätigten Abonnenten vorhanden.' }, { status: 400 })
    }

    let sent = 0
    let failed = 0
    const failures: Array<{ email: string; error: string }> = []

    // Sequential to keep within SendGrid rate limits; for >500 recipients consider
    // SendGrid Marketing Campaigns instead.
    for (const r of recipients) {
      try {
        await sendCampaignEmail({
          to: r.email,
          name: r.name,
          subject,
          bodyHtml: bodyHtml || bodyText.replace(/\n/g, '<br>'),
          bodyText: bodyText || bodyHtml.replace(/<[^>]+>/g, ''),
          unsubscribeToken: r.unsubscribeToken,
        })
        await prisma.newsletterSubscriber.update({
          where: { id: r.id },
          data: { lastSentAt: new Date() },
        })
        sent += 1
      } catch (err: any) {
        failed += 1
        failures.push({
          email: r.email,
          error: err?.message?.slice(0, 200) ?? 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      ok: true,
      recipientCount: recipients.length,
      sent,
      failed,
      failures: failures.slice(0, 10),
    })
  } catch (error: any) {
    console.error('Newsletter send error:', error)
    return NextResponse.json(
      { error: error?.message ?? 'Send failed' },
      { status: 500 }
    )
  }
}
