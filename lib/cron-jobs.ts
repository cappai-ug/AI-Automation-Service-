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

// ── shared scoring helper ───────────────────────────────────────────────────

type CandidateItem = {
  id: string
  title: string
  description: string | null
  contentSnippet: string | null
  link: string
  source: { id: string; name: string; category: string | null }
  relevanceScore: number | null
}

type Scored = CandidateItem & { score: number; reason: string }

const HAIKU_BATCH_SIZE = 30

/**
 * Score a list of candidate items.
 *
 * 1. Items matching the keyword blacklist are marked processed (skip).
 * 2. Items that already have relevanceScore are passed through using
 *    the saved score (no Haiku call, free).
 * 3. Remaining items are scored via Haiku in batches of 30 and their
 *    score is persisted on the FeedItem row.
 *
 * Returns the scored items plus a count of how many were keyword-filtered
 * and a scoringError (if Haiku threw).
 */
async function scoreCandidates(
  items: CandidateItem[]
): Promise<{
  scored: Scored[]
  keywordFiltered: number
  haikuCalls: number
  scoringError: string | null
}> {
  const prisma = getPrisma()
  const scored: Scored[] = []
  let keywordFiltered = 0
  let scoringError: string | null = null
  let haikuCalls = 0

  // Stage 1: keyword filter
  const remaining: CandidateItem[] = []
  for (const item of items) {
    const skip = applyKeywordFilter(item)
    if (skip) {
      await prisma.feedItem.update({
        where: { id: item.id },
        data: { processed: true, skipReason: skip, scoredAt: new Date() },
      })
      keywordFiltered += 1
    } else {
      remaining.push(item)
    }
  }

  // Stage 2a: items that already have a saved score → reuse it for free
  const alreadyScored = remaining.filter((it) => it.relevanceScore != null)
  for (const item of alreadyScored) {
    scored.push({
      ...item,
      score: item.relevanceScore!,
      reason: '(already scored)',
    })
  }

  // Stage 2b: items needing fresh scoring → batched Haiku calls
  const needsScoring = remaining.filter((it) => it.relevanceScore == null)
  if (needsScoring.length > 0) {
    try {
      for (let i = 0; i < needsScoring.length; i += HAIKU_BATCH_SIZE) {
        const batch = needsScoring.slice(i, i + HAIKU_BATCH_SIZE)
        const scores = await scoreItemsWithHaiku(
          batch.map((it) => ({
            id: it.id,
            title: it.title,
            description: it.description,
            sourceName: it.source.name,
          }))
        )
        haikuCalls += 1

        for (const item of batch) {
          const result = scores.get(item.id)
          if (!result) {
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
          await prisma.feedItem.update({
            where: { id: item.id },
            data: { relevanceScore: result.score, scoredAt: new Date() },
          })
          scored.push({ ...item, score: result.score, reason: result.reason })
        }
      }
    } catch (error: any) {
      scoringError = error?.message?.slice(0, 500) ?? 'Unknown scoring error'
      console.error('Haiku scoring failed:', error)
      // Items not yet scored remain processed=false, relevanceScore=null
      // so they'll be retried on the next run.
    }
  }

  return { scored, keywordFiltered, haikuCalls, scoringError }
}

// ── score-only (no Opus generation) ─────────────────────────────────────────

export type ScoreItemsSummary = {
  ok: boolean
  timestamp: string
  pulled: number
  keywordFiltered: number
  scored: number
  belowThreshold: number
  eligible: number
  haikuCalls: number
  scoringError: string | null
}

export async function runScoreItems(options: {
  limit: number
}): Promise<ScoreItemsSummary> {
  const prisma = getPrisma()
  const limit = Math.min(Math.max(1, options.limit), 300)

  // Pull only items that haven't been scored yet
  const candidates = await prisma.feedItem.findMany({
    where: { processed: false, relevanceScore: null },
    orderBy: [{ publishedAt: 'desc' }, { fetchedAt: 'desc' }],
    take: limit,
    include: { source: true },
  })

  if (candidates.length === 0) {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      pulled: 0,
      keywordFiltered: 0,
      scored: 0,
      belowThreshold: 0,
      eligible: 0,
      haikuCalls: 0,
      scoringError: null,
    }
  }

  const { scored, keywordFiltered, haikuCalls, scoringError } =
    await scoreCandidates(candidates)

  // For low-score items: mark processed so they don't keep filling the queue.
  // High-score items stay processed=false so generate-drafts can pick them up.
  let belowThreshold = 0
  let eligible = 0
  for (const item of scored) {
    if (item.score < MIN_RELEVANCE_SCORE) {
      await prisma.feedItem.update({
        where: { id: item.id },
        data: { processed: true, skipReason: `score:${item.score}` },
      })
      belowThreshold += 1
    } else {
      eligible += 1
    }
  }

  return {
    ok: true,
    timestamp: new Date().toISOString(),
    pulled: candidates.length,
    keywordFiltered,
    scored: scored.length,
    belowThreshold,
    eligible,
    haikuCalls,
    scoringError,
  }
}

// ── generate-drafts ─────────────────────────────────────────────────────────

const HARD_MAX_DRAFTS = 10
const CANDIDATE_POOL_SIZE = 30

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
  haikuCalls: number
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

  // Prefer items that already have a high score (no Haiku call needed).
  const preScored = await prisma.feedItem.findMany({
    where: { processed: false, relevanceScore: { gte: MIN_RELEVANCE_SCORE } },
    orderBy: [
      { relevanceScore: 'desc' },
      { publishedAt: 'desc' },
      { fetchedAt: 'desc' },
    ],
    take: maxDrafts,
    include: { source: true },
  })

  // If not enough pre-scored eligible items, pull unscored ones to score now.
  let candidates: Awaited<ReturnType<typeof prisma.feedItem.findMany>> = preScored as any
  if (preScored.length < maxDrafts) {
    const extra = await prisma.feedItem.findMany({
      where: { processed: false, relevanceScore: null },
      orderBy: [{ publishedAt: 'desc' }, { fetchedAt: 'desc' }],
      take: CANDIDATE_POOL_SIZE,
      include: { source: true },
    })
    candidates = [...(preScored as any), ...extra]
  }

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
      haikuCalls: 0,
      scoringError: null,
      results: [],
    }
  }

  const { scored, keywordFiltered, haikuCalls, scoringError } =
    await scoreCandidates(candidates)

  // Stage 3: sort, pick winners (top N above threshold), mark losers
  scored.sort((a, b) => b.score - a.score)
  const winners: Scored[] = []
  const losers: Scored[] = []
  for (const item of scored) {
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
        data: { processed: true, scoredAt: new Date() },
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
    keywordFiltered,
    scored: scored.length,
    belowThreshold: losers.filter((l) => l.score < MIN_RELEVANCE_SCORE).length,
    overLimit: losers.filter((l) => l.score >= MIN_RELEVANCE_SCORE).length,
    generated: results.filter((r) => r.status === 'created').length,
    failed: results.filter((r) => r.status === 'failed').length,
    threshold: MIN_RELEVANCE_SCORE,
    maxDrafts,
    haikuCalls,
    scoringError,
    results,
  }
}
