import { NextResponse } from 'next/server'
import { runFetchFeeds } from '@/lib/cron-jobs'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST() {
  try {
    const summary = await runFetchFeeds()
    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('fetch-feeds failed:', error)
    return NextResponse.json(
      { error: error?.message ?? 'Unknown error' },
      { status: 500 }
    )
  }
}
