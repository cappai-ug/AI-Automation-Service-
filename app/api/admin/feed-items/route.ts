import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const sourceId = params.get('sourceId')
    const processed = params.get('processed')
    const minScore = params.get('minScore')
    const sort = params.get('sort') || 'recent'
    const limit = Math.min(Number(params.get('limit') || 100), 500)

    const where: any = {}
    if (sourceId) where.sourceId = sourceId
    if (processed === 'true') where.processed = true
    if (processed === 'false') where.processed = false
    if (minScore) where.relevanceScore = { gte: Number(minScore) }

    const orderBy =
      sort === 'score'
        ? [{ relevanceScore: 'desc' as const }, { publishedAt: 'desc' as const }]
        : [{ publishedAt: 'desc' as const }]

    const items = await getPrisma().feedItem.findMany({
      where,
      take: limit,
      orderBy,
      include: { source: { select: { id: true, name: true, category: true } } },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching feed items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
