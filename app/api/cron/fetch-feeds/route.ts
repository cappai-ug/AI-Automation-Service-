import { NextRequest, NextResponse } from 'next/server'
import { runFetchFeeds } from '@/lib/cron-jobs'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  // Vercel Cron sends Authorization: Bearer $CRON_SECRET automatically when set.
  const header = request.headers.get('authorization')
  if (!secret) return true // no secret configured → allow (local dev)
  if (header === `Bearer ${secret}`) return true
  if (request.nextUrl.searchParams.get('secret') === secret) return true
  return false
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const summary = await runFetchFeeds()
  return NextResponse.json(summary)
}
