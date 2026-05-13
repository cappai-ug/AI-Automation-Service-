import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const status = params.get('status')
    const limit = Math.min(Number(params.get('limit') || 50), 200)

    const where: any = {}
    if (status && status !== 'all') where.status = status

    const drafts = await getPrisma().blogDraft.findMany({
      where,
      take: limit,
      orderBy: { generatedAt: 'desc' },
      include: {
        sourceItem: {
          select: {
            id: true,
            title: true,
            link: true,
            source: { select: { name: true } },
          },
        },
      },
    })
    return NextResponse.json(drafts)
  } catch (error) {
    console.error('Error fetching drafts:', error)
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 })
  }
}
