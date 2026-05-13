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
      itemsHighScore,
      draftsTotal,
      draftsDraft,
      draftsPublished,
      draftsRejected,
    ] = await Promise.all([
      prisma.waitlist.count(),
      prisma.waitlist.count({ where: { status: 'new' } }),
      prisma.feedSource.count(),
      prisma.feedSource.count({ where: { enabled: true } }),
      prisma.feedSource.count({ where: { lastError: { not: null } } }),
      prisma.feedItem.count(),
      prisma.feedItem.count({ where: { processed: false } }),
      prisma.feedItem.count({ where: { relevanceScore: { gte: 6 } } }),
      prisma.blogDraft.count(),
      prisma.blogDraft.count({ where: { status: 'draft' } }),
      prisma.blogDraft.count({ where: { status: 'published' } }),
      prisma.blogDraft.count({ where: { status: 'rejected' } }),
    ])

    return NextResponse.json({
      leads: { total: leadsTotal, new: leadsNew },
      sources: { total: sourcesTotal, enabled: sourcesEnabled, errored: sourcesErrored },
      feedItems: { total: itemsTotal, unprocessed: itemsUnprocessed, highScore: itemsHighScore },
      drafts: {
        total: draftsTotal,
        draft: draftsDraft,
        published: draftsPublished,
        rejected: draftsRejected,
      },
    })
  } catch (error) {
    console.error('Error loading admin stats:', error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
