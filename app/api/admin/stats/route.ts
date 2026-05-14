import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

type Row = {
  leads_total: bigint
  leads_new: bigint
  sources_total: bigint
  sources_enabled: bigint
  sources_errored: bigint
  items_total: bigint
  items_unprocessed: bigint
  items_unscored: bigint
  items_scored_low: bigint
  items_scored_mid: bigint
  items_scored_high: bigint
  items_eligible: bigint
  drafts_total: bigint
  drafts_draft: bigint
  drafts_published: bigint
  drafts_rejected: bigint
  newsletter_total: bigint
  newsletter_confirmed: bigint
  newsletter_pending: bigint
  newsletter_unsubscribed: bigint
}

function n(value: bigint | null | undefined): number {
  return Number(value ?? 0n)
}

export async function GET() {
  try {
    const prisma = getPrisma()
    // One round-trip, one connection. Replaces 16 parallel count() queries
    // that were exhausting the serverless connection pool.
    const rows = await prisma.$queryRaw<Row[]>`
      SELECT
        (SELECT COUNT(*) FROM "Waitlist")                                                       AS leads_total,
        (SELECT COUNT(*) FROM "Waitlist" WHERE status = 'new')                                  AS leads_new,
        (SELECT COUNT(*) FROM "FeedSource")                                                     AS sources_total,
        (SELECT COUNT(*) FROM "FeedSource" WHERE enabled = true)                                AS sources_enabled,
        (SELECT COUNT(*) FROM "FeedSource" WHERE "lastError" IS NOT NULL)                       AS sources_errored,
        (SELECT COUNT(*) FROM "FeedItem")                                                       AS items_total,
        (SELECT COUNT(*) FROM "FeedItem" WHERE processed = false)                               AS items_unprocessed,
        (SELECT COUNT(*) FROM "FeedItem" WHERE "relevanceScore" IS NULL)                        AS items_unscored,
        (SELECT COUNT(*) FROM "FeedItem" WHERE "relevanceScore" < 6)                            AS items_scored_low,
        (SELECT COUNT(*) FROM "FeedItem" WHERE "relevanceScore" >= 6 AND "relevanceScore" < 8)  AS items_scored_mid,
        (SELECT COUNT(*) FROM "FeedItem" WHERE "relevanceScore" >= 8)                           AS items_scored_high,
        (SELECT COUNT(*) FROM "FeedItem" WHERE "relevanceScore" >= 6 AND processed = false)     AS items_eligible,
        (SELECT COUNT(*) FROM "BlogDraft")                                                      AS drafts_total,
        (SELECT COUNT(*) FROM "BlogDraft" WHERE status = 'draft')                               AS drafts_draft,
        (SELECT COUNT(*) FROM "BlogDraft" WHERE status = 'published')                           AS drafts_published,
        (SELECT COUNT(*) FROM "BlogDraft" WHERE status = 'rejected')                            AS drafts_rejected,
        (SELECT COUNT(*) FROM "NewsletterSubscriber")                                           AS newsletter_total,
        (SELECT COUNT(*) FROM "NewsletterSubscriber" WHERE status = 'confirmed')                AS newsletter_confirmed,
        (SELECT COUNT(*) FROM "NewsletterSubscriber" WHERE status = 'pending')                  AS newsletter_pending,
        (SELECT COUNT(*) FROM "NewsletterSubscriber" WHERE status = 'unsubscribed')             AS newsletter_unsubscribed
    `

    const r = rows[0]
    if (!r) {
      return NextResponse.json({ error: 'No stats row returned' }, { status: 500 })
    }

    return NextResponse.json({
      leads: { total: n(r.leads_total), new: n(r.leads_new) },
      sources: {
        total: n(r.sources_total),
        enabled: n(r.sources_enabled),
        errored: n(r.sources_errored),
      },
      feedItems: {
        total: n(r.items_total),
        unprocessed: n(r.items_unprocessed),
        unscored: n(r.items_unscored),
        scoredLow: n(r.items_scored_low),
        scoredMid: n(r.items_scored_mid),
        scoredHigh: n(r.items_scored_high),
        eligible: n(r.items_eligible),
        // backwards-compat:
        highScore: n(r.items_scored_mid) + n(r.items_scored_high),
      },
      drafts: {
        total: n(r.drafts_total),
        draft: n(r.drafts_draft),
        published: n(r.drafts_published),
        rejected: n(r.drafts_rejected),
      },
      newsletter: {
        total: n(r.newsletter_total),
        confirmed: n(r.newsletter_confirmed),
        pending: n(r.newsletter_pending),
        unsubscribed: n(r.newsletter_unsubscribed),
      },
    })
  } catch (error: any) {
    console.error('Error loading admin stats:', error)
    return NextResponse.json(
      { error: error?.message ?? 'Failed to load stats' },
      { status: 500 }
    )
  }
}
