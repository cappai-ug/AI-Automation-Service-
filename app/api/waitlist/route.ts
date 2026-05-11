import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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

    const existingEntry = await prisma.waitlist.findUnique({
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

    const entry = await prisma.waitlist.create({
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
