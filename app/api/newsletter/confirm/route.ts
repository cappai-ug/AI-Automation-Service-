import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { sendWelcomeAndDeliverMagnet } from '@/lib/newsletter'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/newsletter/confirmed?status=error', request.url))
  }

  const prisma = getPrisma()
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { confirmToken: token },
  })

  if (!subscriber) {
    return NextResponse.redirect(new URL('/newsletter/confirmed?status=invalid', request.url))
  }

  if (subscriber.status === 'confirmed') {
    return NextResponse.redirect(new URL('/newsletter/confirmed?status=already', request.url))
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { status: 'confirmed', confirmedAt: new Date() },
  })

  try {
    await sendWelcomeAndDeliverMagnet({
      to: subscriber.email,
      name: subscriber.name,
      source: subscriber.source,
      unsubscribeToken: subscriber.unsubscribeToken,
    })
  } catch (err) {
    console.error('Failed to send welcome email:', err)
  }

  return NextResponse.redirect(new URL('/newsletter/confirmed?status=ok', request.url))
}
