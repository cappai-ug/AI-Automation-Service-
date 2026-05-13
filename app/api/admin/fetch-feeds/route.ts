import { NextResponse } from 'next/server'
import { runFetchFeeds } from '@/lib/cron-jobs'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST() {
  const summary = await runFetchFeeds()
  return NextResponse.json(summary)
}
