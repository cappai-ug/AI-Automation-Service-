import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sources = await getPrisma().feedSource.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { items: true } } },
    })
    return NextResponse.json(sources)
  } catch (error) {
    console.error('Error fetching sources:', error)
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, category } = body as {
      name?: string
      url?: string
      category?: string | null
    }

    if (!name || !url) {
      return NextResponse.json({ error: 'name and url are required' }, { status: 400 })
    }

    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const source = await getPrisma().feedSource.create({
      data: {
        name,
        url,
        category: category || null,
      },
    })
    return NextResponse.json(source, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A source with this URL already exists' }, { status: 409 })
    }
    console.error('Error creating source:', error)
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 })
  }
}
