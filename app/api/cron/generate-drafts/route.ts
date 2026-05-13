import { NextRequest, NextResponse } from 'next/server'
import { runGenerateDrafts } from '@/lib/cron-jobs'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const DEFAULT_MAX_DRAFTS = 3

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  const header = request.headers.get('authorization')
  if (!secret) return true
  if (header === `Bearer ${secret}`) return true
  if (request.nextUrl.searchParams.get('secret') === secret) return true
  return false
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const maxDrafts = Number(request.nextUrl.searchParams.get('limit') || DEFAULT_MAX_DRAFTS)
  const summary = await runGenerateDrafts({ maxDrafts })
  return NextResponse.json(summary)
}
