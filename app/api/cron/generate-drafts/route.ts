import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { generateDraftFromItem } from '@/lib/draft-generation'
import { DRAFT_MODEL } from '@/lib/anthropic'
import {
  applyKeywordFilter,
  scoreItemsWithHaiku,
  MIN_RELEVANCE_SCORE,
} from '@/lib/feed-filter'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const DEFAULT_MAX_DRAFTS = 3
const HARD_MAX_DRAFTS = 10
const SCORING_BATCH_SIZE = 30 // items to send to Haiku in one batch

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  const header = request.headers.get('authorization')
  if (!secret) return true
  if (header === `Bearer ${secret}`) return true
  if (request.nextUrl.searchParams.get('secret') === secret) return true
  return false
}

async function uniqueSlug(slug: string): Promise<string> {
  const prisma = getPrisma()
  const existing = await prisma.blogDraft.findUnique({ where: { slug } })
  if (!existing) return slug
  return `${slug}-${Date.now().toString(36).slice(-4)}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prisma = getPrisma()
  const maxDrafts = Math.min(
    Number(request.nextUrl.searchParams.get('limit') || DEFAULT_MAX_DRAFTS),
    HARD_MAX_DRAFTS
  )

  // Pull a generous candidate pool. Most will be filtered out cheaply before Opus runs.
  const candidates = await prisma.feedItem.findMany({
    where: { processed: false },
    orderBy: [{ publishedAt: 'desc' }, { fetchedAt: 'desc' }],
    take: SCORING_BATCH_SIZE,
    include: { source: true },
  })

  if (candidates.length === 0) {
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      candidates: 0,
      filtered: 0,
      scored: 0,
      generated: 0,
      results: [],
    })
  }

  // ── Stage 1: keyword filter (free) ─────────────────────────────────────────
  const keptAfterKeyword: typeof candidates = []
  let keywordSkips = 0
  for (const item of candidates) {
    const skip = applyKeywordFilter(item)
    if (skip) {
      await prisma.feedItem.update({
        where: { id: item.id },
        data: { processed: true, skipReason: skip, scoredAt: new Date() },
      })
      keywordSkips += 1
    } else {
      keptAfterKeyword.push(item)
    }
  }

  // ── Stage 2: Haiku 4.5 batch scoring (~0.1ct per item) ────────────────────
  type Scored = (typeof candidates)[number] & { score: number; reason: string }
  const scoredItems: Scored[] = []
  let scoringError: string | null = null

  if (keptAfterKeyword.length > 0) {
    try {
      const scores = await scoreItemsWithHaiku(
        keptAfterKeyword.map((it) => ({
          id: it.id,
          title: it.title,
          description: it.description,
          sourceName: it.source.name,
        }))
      )

      for (const item of keptAfterKeyword) {
        const scored = scores.get(item.id)
        if (!scored) {
          // Haiku didn't return a score for this item — treat as low confidence, skip
          await prisma.feedItem.update({
            where: { id: item.id },
            data: {
              processed: true,
              skipReason: 'scoring:missing',
              scoredAt: new Date(),
            },
          })
          continue
        }
        scoredItems.push({ ...item, score: scored.score, reason: scored.reason })
      }
    } catch (error: any) {
      scoringError = error?.message?.slice(0, 500) ?? 'Unknown scoring error'
      console.error('Haiku scoring failed:', error)
      // Leave items unprocessed so the next run retries scoring.
    }
  }

  // ── Stage 3: Opus draft generation for top N above threshold ──────────────
  scoredItems.sort((a, b) => b.score - a.score)
  const winners: Scored[] = []
  const losers: Scored[] = []
  for (const item of scoredItems) {
    if (item.score >= MIN_RELEVANCE_SCORE && winners.length < maxDrafts) {
      winners.push(item)
    } else {
      losers.push(item)
    }
  }

  // Mark the losers as processed with their score+reason so we have a record.
  for (const loser of losers) {
    await prisma.feedItem.update({
      where: { id: loser.id },
      data: {
        processed: true,
        relevanceScore: loser.score,
        skipReason:
          loser.score < MIN_RELEVANCE_SCORE
            ? `score:${loser.score}`
            : 'over_daily_limit',
        scoredAt: new Date(),
      },
    })
  }

  const results: Array<{
    itemId: string
    title: string
    status: 'created' | 'failed'
    score: number
    reason: string
    draftId?: string
    error?: string
  }> = []

  for (const item of winners) {
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
        data: {
          processed: true,
          relevanceScore: item.score,
          scoredAt: new Date(),
        },
      })

      results.push({
        itemId: item.id,
        title: draft.title,
        status: 'created',
        score: item.score,
        reason: item.reason,
        draftId: saved.id,
      })
    } catch (error: any) {
      console.error(`Draft generation failed for item ${item.id}:`, error)
      results.push({
        itemId: item.id,
        title: item.title,
        status: 'failed',
        score: item.score,
        reason: item.reason,
        error: error?.message?.slice(0, 500) ?? 'Unknown error',
      })
      // Item stays unprocessed so it retries next run.
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    candidates: candidates.length,
    keywordFiltered: keywordSkips,
    scored: scoredItems.length,
    belowThreshold: losers.filter((l) => l.score < MIN_RELEVANCE_SCORE).length,
    overLimit: losers.filter((l) => l.score >= MIN_RELEVANCE_SCORE).length,
    generated: results.filter((r) => r.status === 'created').length,
    failed: results.filter((r) => r.status === 'failed').length,
    threshold: MIN_RELEVANCE_SCORE,
    maxDrafts,
    scoringError,
    results,
  })
}
