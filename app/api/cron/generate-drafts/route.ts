import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { generateDraftFromItem } from '@/lib/draft-generation'
import { DRAFT_MODEL } from '@/lib/anthropic'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes — drafts can take 30–60s each

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  const header = request.headers.get('authorization')
  if (!secret) return true // local dev
  if (header === `Bearer ${secret}`) return true
  if (request.nextUrl.searchParams.get('secret') === secret) return true
  return false
}

async function uniqueSlug(slug: string): Promise<string> {
  const prisma = getPrisma()
  const existing = await prisma.blogDraft.findUnique({ where: { slug } })
  if (!existing) return slug
  // Suffix with timestamp shard to ensure uniqueness
  return `${slug}-${Date.now().toString(36).slice(-4)}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prisma = getPrisma()
  const limit = Math.min(
    Number(request.nextUrl.searchParams.get('limit') || 3),
    10
  )

  const items = await prisma.feedItem.findMany({
    where: { processed: false },
    orderBy: [{ publishedAt: 'desc' }, { fetchedAt: 'desc' }],
    take: limit,
    include: { source: true },
  })

  if (items.length === 0) {
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      processed: 0,
      results: [],
    })
  }

  const results: Array<{
    itemId: string
    title: string
    status: 'created' | 'failed'
    draftId?: string
    relevanceScore?: number
    error?: string
  }> = []

  for (const item of items) {
    try {
      const draft = await generateDraftFromItem({
        title: item.title,
        link: item.link,
        description: item.description,
        contentSnippet: item.contentSnippet,
        sourceName: item.source.name,
        categoryHint: item.source.category,
      })

      const slug = await uniqueSlug(draft.slug)

      const saved = await prisma.blogDraft.create({
        data: {
          sourceItemId: item.id,
          title: draft.title,
          slug,
          description: draft.description,
          category: draft.category,
          tags: draft.tags,
          contentMarkdown: draft.content_markdown,
          relevanceScore: draft.relevance_score,
          model: DRAFT_MODEL,
        },
      })

      await prisma.feedItem.update({
        where: { id: item.id },
        data: { processed: true },
      })

      results.push({
        itemId: item.id,
        title: draft.title,
        status: 'created',
        draftId: saved.id,
        relevanceScore: draft.relevance_score,
      })
    } catch (error: any) {
      console.error(`Draft generation failed for item ${item.id}:`, error)
      results.push({
        itemId: item.id,
        title: item.title,
        status: 'failed',
        error: error?.message?.slice(0, 500) ?? 'Unknown error',
      })
      // Leave processed=false so the item is retried on the next run.
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    processed: results.length,
    results,
  })
}
