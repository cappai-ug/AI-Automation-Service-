import { NextRequest, NextResponse } from 'next/server'
import { runScoreItems } from '@/lib/cron-jobs'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const DEFAULT_LIMIT = 100

export async function POST(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit') || DEFAULT_LIMIT)
  const summary = await runScoreItems({ limit })
  return NextResponse.json(summary)
}
