import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'

let prisma: PrismaClient

function getPrisma() {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    prisma = new PrismaClient({ adapter })
  }
  return prisma
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, status } = body

    if (!Array.isArray(ids) || !status) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    const validStatuses = ['new', 'contacted', 'demo_sent', 'customer', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    await getPrisma().waitlist.updateMany({
      where: { id: { in: ids } },
      data: { status }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating leads:', error)
    return NextResponse.json(
      { error: 'Failed to update leads' },
      { status: 500 }
    )
  }
}
