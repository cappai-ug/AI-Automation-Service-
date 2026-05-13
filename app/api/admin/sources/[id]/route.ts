import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const data: { enabled?: boolean; name?: string; category?: string | null } = {}
    if (typeof body.enabled === 'boolean') data.enabled = body.enabled
    if (typeof body.name === 'string') data.name = body.name
    if ('category' in body) data.category = body.category || null

    const source = await getPrisma().feedSource.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(source)
  } catch (error) {
    console.error('Error updating source:', error)
    return NextResponse.json({ error: 'Failed to update source' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getPrisma().feedSource.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting source:', error)
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 })
  }
}
