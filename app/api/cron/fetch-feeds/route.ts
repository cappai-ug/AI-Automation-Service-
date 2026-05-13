import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const parser = new Parser({
  timeout: 15_000,
  headers: { 'User-Agent': 'OptimazedBot/1.0 (+https://www.optimazed.de)' },
})

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  // Vercel Cron sends Authorization: Bearer $CRON_SECRET automatically when set.
  const header = request.headers.get('authorization')
  if (!secret) return true // no secret configured → allow (useful for local dev)
  if (header === `Bearer ${secret}`) return true
  if (request.nextUrl.searchParams.get('secret') === secret) return true
  return false
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prisma = getPrisma()
  const sources = await prisma.feedSource.findMany({ where: { enabled: true } })

  const summary: Array<{
    source: string
    fetched: number
    inserted: number
    error?: string
  }> = []

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

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    sources: summary,
  })
}
