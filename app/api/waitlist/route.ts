import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, company, useCase } = body

    if (!email || !company || !useCase) {
      return NextResponse.json(
        { error: 'Erforderliche Felder fehlen' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      )
    }

    const existingEntry = await getPrisma().waitlist.findUnique({
      where: { email }
    })

    if (existingEntry) {
      return NextResponse.json(
        {
          success: true,
          message: 'Sie sind bereits auf unserer Warteliste registriert.',
          status: 'already_exists'
        },
        { status: 200 }
      )
    }

    const entry = await getPrisma().waitlist.create({
      data: {
        email,
        company,
        useCase,
        status: 'new',
        source: 'landing_page'
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Danke! Sie wurden zur Warteliste hinzugefügt.',
        status: 'success'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    )
  }
}
