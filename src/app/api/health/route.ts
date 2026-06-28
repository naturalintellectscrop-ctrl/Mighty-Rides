// ============================================================================
// HEALTH CHECK
// GET /api/health
// Public: DB connectivity + status. Admin session: also reports which critical
// environment variables are configured (presence only — never their values).
// ============================================================================

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const CRITICAL_ENV = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY',
  'FLUTTERWAVE_SECRET_KEY',
  'FLUTTERWAVE_SECRET_HASH',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'CRON_SECRET',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
] as const

export async function GET() {
  let dbStatus: 'up' | 'down' = 'down'
  try {
    await db.$queryRaw`SELECT 1`
    dbStatus = 'up'
  } catch (error) {
    console.error('[HEALTH] DB check failed:', error)
  }

  const body: Record<string, unknown> = {
    status: dbStatus === 'up' ? 'ok' : 'degraded',
    db: dbStatus,
    timestamp: new Date().toISOString(),
  }

  // Only an authenticated admin can see which env vars are wired up.
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role === 'ADMIN') {
      const env: Record<string, boolean> = {}
      for (const key of CRITICAL_ENV) {
        env[key] = Boolean(process.env[key])
      }
      body.env = env
      body.missing = CRITICAL_ENV.filter((k) => !process.env[k])
    }
  } catch {
    // session lookup is best-effort; ignore
  }

  return NextResponse.json(body, { status: dbStatus === 'up' ? 200 : 503 })
}
