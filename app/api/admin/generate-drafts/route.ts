import { NextRequest, NextResponse } from 'next/server'
import { runGenerateDrafts } from '@/lib/cron-jobs'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const DEFAULT_MAX_DRAFTS = 3

export async function POST(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit') || DEFAULT_MAX_DRAFTS)
  const summary = await runGenerateDrafts({ maxDrafts: limit })
  return NextResponse.json(summary)
}
