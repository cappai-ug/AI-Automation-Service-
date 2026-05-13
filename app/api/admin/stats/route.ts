import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const prisma = getPrisma()
    const [
      leadsTotal,
      leadsNew,
      sourcesTotal,
      sourcesEnabled,
      sourcesErrored,
      itemsTotal,
      itemsUnprocessed,
      itemsUnscored,
      itemsScoredLow,
      itemsScoredMid,
      itemsScoredHigh,
      itemsEligible,
      draftsTotal,
      draftsDraft,
      draftsPublished,
      draftsRejected,
      newsletterTotal,
      newsletterConfirmed,
      newsletterPending,
      newsletterUnsubscribed,
    ] = await Promise.all([
      prisma.waitlist.count(),
      prisma.waitlist.count({ where: { status: 'new' } }),
      prisma.feedSource.count(),
      prisma.feedSource.count({ where: { enabled: true } }),
      prisma.feedSource.count({ where: { lastError: { not: null } } }),
      prisma.feedItem.count(),
      prisma.feedItem.count({ where: { processed: false } }),
      prisma.feedItem.count({ where: { relevanceScore: null } }),
      prisma.feedItem.count({ where: { relevanceScore: { lt: 6 } } }),
      prisma.feedItem.count({ where: { relevanceScore: { gte: 6, lt: 8 } } }),
      prisma.feedItem.count({ where: { relevanceScore: { gte: 8 } } }),
      // Eligible for draft: scored ≥6 AND not yet processed
      prisma.feedItem.count({
        where: { relevanceScore: { gte: 6 }, processed: false },
      }),
      prisma.blogDraft.count(),
      prisma.blogDraft.count({ where: { status: 'draft' } }),
      prisma.blogDraft.count({ where: { status: 'published' } }),
      prisma.blogDraft.count({ where: { status: 'rejected' } }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { status: 'confirmed' } }),
      prisma.newsletterSubscriber.count({ where: { status: 'pending' } }),
      prisma.newsletterSubscriber.count({ where: { status: 'unsubscribed' } }),
    ])

    return NextResponse.json({
      leads: { total: leadsTotal, new: leadsNew },
      sources: { total: sourcesTotal, enabled: sourcesEnabled, errored: sourcesErrored },
      feedItems: {
        total: itemsTotal,
        unprocessed: itemsUnprocessed,
        unscored: itemsUnscored,
        scoredLow: itemsScoredLow, // < 6
        scoredMid: itemsScoredMid, // 6-7
        scoredHigh: itemsScoredHigh, // 8-10
        eligible: itemsEligible, // ≥6 and not yet processed (ready for drafting)
        // backwards-compat:
        highScore: itemsScoredMid + itemsScoredHigh,
      },
      drafts: {
        total: draftsTotal,
        draft: draftsDraft,
        published: draftsPublished,
        rejected: draftsRejected,
      },
      newsletter: {
        total: newsletterTotal,
        confirmed: newsletterConfirmed,
        pending: newsletterPending,
        unsubscribed: newsletterUnsubscribed,
      },
    })
  } catch (error) {
    console.error('Error loading admin stats:', error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
