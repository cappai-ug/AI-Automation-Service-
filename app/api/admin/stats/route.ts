import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function n(value: bigint | number | null | undefined): number {
  if (value == null) return 0
  return typeof value === 'bigint' ? Number(value) : value
}

async function safeQuery<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (err: any) {
    // Most common cause: table doesn't exist yet (migration not run).
    // Return null so the dashboard can show zeros for that group and
    // the rest of the stats still load.
    console.warn(`Stats(${label}) failed:`, err?.message ?? err)
    return null
  }
}

type LeadsRow = { total: bigint; new_count: bigint }
type SourcesRow = { total: bigint; enabled: bigint; errored: bigint }
type ItemsRow = {
  total: bigint
  unprocessed: bigint
  unscored: bigint
  scored_low: bigint
  scored_mid: bigint
  scored_high: bigint
  eligible: bigint
}
type DraftsRow = {
  total: bigint
  draft: bigint
  published: bigint
  rejected: bigint
}
type NewsletterRow = {
  total: bigint
  confirmed: bigint
  pending: bigint
  unsubscribed: bigint
}

export async function GET() {
  const prisma = getPrisma()

  // Five small sequential queries: each touches one table group, so a missing
  // table (e.g. NewsletterSubscriber before the migration ran) doesn't take
  // down the whole dashboard. Sequential = 1 connection reused via the pool.
  const leadsRow = await safeQuery<LeadsRow[]>('leads', () =>
    prisma.$queryRaw`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'new')::int AS new_count
      FROM "Waitlist"
    `
  )
  const sourcesRow = await safeQuery<SourcesRow[]>('sources', () =>
    prisma.$queryRaw`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE enabled = true)::int AS enabled,
        COUNT(*) FILTER (WHERE "lastError" IS NOT NULL)::int AS errored
      FROM "FeedSource"
    `
  )
  const itemsRow = await safeQuery<ItemsRow[]>('items', () =>
    prisma.$queryRaw`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE processed = false)::int AS unprocessed,
        COUNT(*) FILTER (WHERE "relevanceScore" IS NULL)::int AS unscored,
        COUNT(*) FILTER (WHERE "relevanceScore" < 6)::int AS scored_low,
        COUNT(*) FILTER (WHERE "relevanceScore" >= 6 AND "relevanceScore" < 8)::int AS scored_mid,
        COUNT(*) FILTER (WHERE "relevanceScore" >= 8)::int AS scored_high,
        COUNT(*) FILTER (WHERE "relevanceScore" >= 6 AND processed = false)::int AS eligible
      FROM "FeedItem"
    `
  )
  const draftsRow = await safeQuery<DraftsRow[]>('drafts', () =>
    prisma.$queryRaw`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'draft')::int AS draft,
        COUNT(*) FILTER (WHERE status = 'published')::int AS published,
        COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
      FROM "BlogDraft"
    `
  )
  const newsletterRow = await safeQuery<NewsletterRow[]>('newsletter', () =>
    prisma.$queryRaw`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'unsubscribed')::int AS unsubscribed
      FROM "NewsletterSubscriber"
    `
  )

  const leads = leadsRow?.[0]
  const sources = sourcesRow?.[0]
  const items = itemsRow?.[0]
  const drafts = draftsRow?.[0]
  const newsletter = newsletterRow?.[0]

  return NextResponse.json({
    leads: { total: n(leads?.total), new: n(leads?.new_count) },
    sources: {
      total: n(sources?.total),
      enabled: n(sources?.enabled),
      errored: n(sources?.errored),
    },
    feedItems: {
      total: n(items?.total),
      unprocessed: n(items?.unprocessed),
      unscored: n(items?.unscored),
      scoredLow: n(items?.scored_low),
      scoredMid: n(items?.scored_mid),
      scoredHigh: n(items?.scored_high),
      eligible: n(items?.eligible),
      highScore: n(items?.scored_mid) + n(items?.scored_high),
    },
    drafts: {
      total: n(drafts?.total),
      draft: n(drafts?.draft),
      published: n(drafts?.published),
      rejected: n(drafts?.rejected),
    },
    newsletter: {
      total: n(newsletter?.total),
      confirmed: n(newsletter?.confirmed),
      pending: n(newsletter?.pending),
      unsubscribed: n(newsletter?.unsubscribed),
    },
    missing: {
      leads: leads == null,
      sources: sources == null,
      items: items == null,
      drafts: drafts == null,
      newsletter: newsletter == null,
    },
  })
}
