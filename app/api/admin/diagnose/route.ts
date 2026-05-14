import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Check = {
  name: string
  ok: boolean
  detail: string
}

export async function GET() {
  const checks: Check[] = []

  // 1. Env vars
  checks.push({
    name: 'DATABASE_URL',
    ok: !!process.env.DATABASE_URL,
    detail: process.env.DATABASE_URL ? 'set' : 'NOT SET — DB queries will fail',
  })
  checks.push({
    name: 'ANTHROPIC_API_KEY',
    ok: !!process.env.ANTHROPIC_API_KEY,
    detail: process.env.ANTHROPIC_API_KEY
      ? `set (${process.env.ANTHROPIC_API_KEY.slice(0, 10)}…, length ${process.env.ANTHROPIC_API_KEY.length})`
      : 'NOT SET — draft generation + scoring will fail',
  })
  checks.push({
    name: 'CRON_SECRET',
    ok: !!process.env.CRON_SECRET,
    detail: process.env.CRON_SECRET
      ? `set (length ${process.env.CRON_SECRET.length})`
      : 'not set (Vercel cron endpoints will allow unauth requests)',
  })
  checks.push({
    name: 'SENDGRID_API_KEY',
    ok: !!process.env.SENDGRID_API_KEY,
    detail: process.env.SENDGRID_API_KEY ? 'set' : 'NOT SET — waitlist + newsletter mails will fail',
  })
  checks.push({
    name: 'SENDGRID_FROM_EMAIL',
    ok: !!process.env.SENDGRID_FROM_EMAIL,
    detail: process.env.SENDGRID_FROM_EMAIL ?? 'NOT SET',
  })

  // 2. Database connectivity + schema
  try {
    const prisma = getPrisma()
    const sourcesCount = await prisma.feedSource.count()
    const itemsCount = await prisma.feedItem.count()
    const draftsCount = await prisma.blogDraft.count()
    const newsletterCount = await prisma.newsletterSubscriber.count()
    checks.push({
      name: 'Database',
      ok: true,
      detail: `OK — ${sourcesCount} sources, ${itemsCount} items, ${draftsCount} drafts, ${newsletterCount} subscribers`,
    })
  } catch (err: any) {
    checks.push({
      name: 'Database',
      ok: false,
      detail: `FAIL: ${err?.message ?? String(err)}`,
    })
  }

  // 3. Anthropic connectivity (cheap: list models)
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY missing — skipping live check')
    }
    const { getAnthropic } = await import('@/lib/anthropic')
    const client = getAnthropic()
    const result = await client.models.retrieve('claude-opus-4-7')
    checks.push({
      name: 'Anthropic API',
      ok: true,
      detail: `OK — model ${result.id} reachable`,
    })
  } catch (err: any) {
    const message = err?.message ?? String(err)
    const status = err?.status ?? err?.response?.status
    checks.push({
      name: 'Anthropic API',
      ok: false,
      detail: `FAIL${status ? ` (${status})` : ''}: ${message}`,
    })
  }

  // 4. Eligible items + scoring backlog
  try {
    const prisma = getPrisma()
    const [unprocessed, unscored, eligible] = await Promise.all([
      prisma.feedItem.count({ where: { processed: false } }),
      prisma.feedItem.count({ where: { relevanceScore: null } }),
      prisma.feedItem.count({
        where: { processed: false, relevanceScore: { gte: 6 } },
      }),
    ])
    checks.push({
      name: 'Generation queue',
      ok: eligible > 0 || unscored > 0,
      detail: `unprocessed=${unprocessed}, unscored=${unscored}, eligible_for_draft=${eligible}`,
    })
  } catch (err: any) {
    checks.push({
      name: 'Generation queue',
      ok: false,
      detail: `FAIL: ${err?.message ?? String(err)}`,
    })
  }

  const allOk = checks.every((c) => c.ok)
  return NextResponse.json(
    { ok: allOk, timestamp: new Date().toISOString(), checks },
    { status: allOk ? 200 : 207 }
  )
}
