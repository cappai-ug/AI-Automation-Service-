import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function handle(request: NextRequest, token: string | null) {
  if (!token) {
    return NextResponse.redirect(new URL('/newsletter/unsubscribed?status=error', request.url))
  }

  const prisma = getPrisma()
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { unsubscribeToken: token },
  })

  if (!subscriber) {
    return NextResponse.redirect(new URL('/newsletter/unsubscribed?status=invalid', request.url))
  }

  if (subscriber.status !== 'unsubscribed') {
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { status: 'unsubscribed', unsubscribedAt: new Date() },
    })
  }

  return NextResponse.redirect(new URL('/newsletter/unsubscribed?status=ok', request.url))
}

export async function GET(request: NextRequest) {
  return handle(request, request.nextUrl.searchParams.get('token'))
}

// RFC 8058 one-click unsubscribe (POST)
export async function POST(request: NextRequest) {
  return handle(request, request.nextUrl.searchParams.get('token'))
}
