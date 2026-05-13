import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const ALLOWED_STATUSES = ['draft', 'approved', 'published', 'rejected']
const ALLOWED_CATEGORIES = ['ratgeber', 'branchen', 'technologie']

function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' })[c]!)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const draft = await getPrisma().blogDraft.findUnique({
    where: { id: params.id },
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
  if (!draft) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(draft)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const data: any = {}

    if (typeof body.title === 'string') data.title = body.title.slice(0, 200)
    if (typeof body.description === 'string') data.description = body.description.slice(0, 500)
    if (typeof body.contentMarkdown === 'string') data.contentMarkdown = body.contentMarkdown
    if (typeof body.relevanceScore === 'number') {
      data.relevanceScore = Math.max(1, Math.min(10, Math.round(body.relevanceScore)))
    }
    if (Array.isArray(body.tags)) {
      data.tags = body.tags
        .filter((t: unknown): t is string => typeof t === 'string')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length >= 2 && t.length <= 40)
        .slice(0, 8)
    }
    if (typeof body.category === 'string' && ALLOWED_CATEGORIES.includes(body.category)) {
      data.category = body.category
    }
    if (typeof body.slug === 'string') {
      const cleaned = sanitizeSlug(body.slug)
      if (cleaned.length < 3) {
        return NextResponse.json({ error: 'Slug too short' }, { status: 400 })
      }
      data.slug = cleaned
    }
    if (typeof body.status === 'string' && ALLOWED_STATUSES.includes(body.status)) {
      data.status = body.status
      if (body.status === 'published') {
        data.publishedAt = new Date()
      }
      if (body.status === 'draft' || body.status === 'rejected') {
        data.publishedAt = null
      }
    }

    const updated = await getPrisma().blogDraft.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(updated)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A draft with this slug already exists' },
        { status: 409 }
      )
    }
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('Error updating draft:', error)
    return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getPrisma().blogDraft.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('Error deleting draft:', error)
    return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 })
  }
}
