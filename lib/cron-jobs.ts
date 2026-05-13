import Parser from 'rss-parser'
import { getPrisma } from './prisma'
import { generateDraftFromItem } from './draft-generation'
import { DRAFT_MODEL } from './anthropic'
import {
  applyKeywordFilter,
  scoreItemsWithHaiku,
  MIN_RELEVANCE_SCORE,
} from './feed-filter'

const parser = new Parser({
  timeout: 15_000,
  headers: { 'User-Agent': 'OptimazedBot/1.0 (+https://www.optimazed.de)' },
})

// ── fetch-feeds ─────────────────────────────────────────────────────────────

export type FetchFeedsSummary = {
  ok: boolean
  timestamp: string
  sources: Array<{
    source: string
    fetched: number
    inserted: number
    error?: string
  }>
}

export async function runFetchFeeds(): Promise<FetchFeedsSummary> {
  const prisma = getPrisma()
  const sources = await prisma.feedSource.findMany({ where: { enabled: true } })

  const summary: FetchFeedsSummary['sources'] = []

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url)
      const candidates = (feed.items ?? [])
        .map((entry) => {
          const externalId = entry.guid || entry.link
          if (!externalId || !entry.title || !entry.link) return null
          return {
            sourceId: source.id,
            externalId,
            title: entry.title.slice(0, 500),
            link: entry.link,
            description: entry.contentSnippet?.slice(0, 2000) ?? null,
            contentSnippet: entry.content?.slice(0, 4000) ?? null,
            publishedAt: entry.isoDate ? new Date(entry.isoDate) : null,
          }
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)

      const result = await prisma.feedItem.createMany({
        data: candidates,
        skipDuplicates: true,
      })

      await prisma.feedSource.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date(), lastError: null },
      })

      summary.push({
        source: source.name,
        fetched: candidates.length,
        inserted: result.count,
      })
    } catch (error: any) {
      const message = error?.message ?? 'Unknown error'
      await prisma.feedSource.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date(), lastError: message.slice(0, 500) },
      })
      summary.push({ source: source.name, fetched: 0, inserted: 0, error: message })
    }
  }

  return {
    ok: true,
    timestamp: new Date().toISOString(),
    sources: summary,
  }
}

// ── generate-drafts ─────────────────────────────────────────────────────────

const HARD_MAX_DRAFTS = 10
const SCORING_BATCH_SIZE = 30

export type GenerateDraftsSummary = {
  ok: boolean
  timestamp: string
  candidates: number
  keywordFiltered: number
  scored: number
  belowThreshold: number
  overLimit: number
  generated: number
  failed: number
  threshold: number
  maxDrafts: number
  scoringError: string | null
  results: Array<{
    itemId: string
    title: string
    status: 'created' | 'failed'
    score: number
    reason: string
    draftId?: string
    error?: string
  }>
}

async function uniqueSlug(slug: string): Promise<string> {
  const prisma = getPrisma()
  const existing = await prisma.blogDraft.findUnique({ where: { slug } })
  if (!existing) return slug
  return `${slug}-${Date.now().toString(36).slice(-4)}`
}

export async function runGenerateDrafts(options: {
  maxDrafts: number
}): Promise<GenerateDraftsSummary> {
  const prisma = getPrisma()
  const maxDrafts = Math.min(Math.max(1, options.maxDrafts), HARD_MAX_DRAFTS)

  const candidates = await prisma.feedItem.findMany({
    where: { processed: false },
    orderBy: [{ publishedAt: 'desc' }, { fetchedAt: 'desc' }],
    take: SCORING_BATCH_SIZE,
    include: { source: true },
  })

  if (candidates.length === 0) {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      candidates: 0,
      keywordFiltered: 0,
      scored: 0,
      belowThreshold: 0,
      overLimit: 0,
      generated: 0,
      failed: 0,
      threshold: MIN_RELEVANCE_SCORE,
      maxDrafts,
      scoringError: null,
      results: [],
    }
  }

  // Stage 1: keyword filter (free)
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

  // Stage 2: Haiku batch scoring
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
    }
  }

  // Stage 3: Opus draft generation (top N above threshold)
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

  const results: GenerateDraftsSummary['results'] = []

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
    }
  }

  return {
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
  }
}
