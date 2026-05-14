import { NextRequest, NextResponse } from 'next/server'
import { runGenerateDrafts } from '@/lib/cron-jobs'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const DEFAULT_MAX_DRAFTS = 3

export async function POST(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get('limit') || DEFAULT_MAX_DRAFTS)
    const summary = await runGenerateDrafts({ maxDrafts: limit })
    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('generate-drafts failed:', error)
    return NextResponse.json(
      {
        error: error?.message ?? 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}
