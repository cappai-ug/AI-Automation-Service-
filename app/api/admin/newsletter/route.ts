import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const status = params.get('status')
    const limit = Math.min(Number(params.get('limit') || 200), 1000)

    const where: any = {}
    if (status && status !== 'all') where.status = status

    const subscribers = await getPrisma().newsletterSubscriber.findMany({
      where,
      take: limit,
      orderBy: { subscribedAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        source: true,
        status: true,
        subscribedAt: true,
        confirmedAt: true,
        unsubscribedAt: true,
        lastSentAt: true,
      },
    })
    return NextResponse.json(subscribers)
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}
