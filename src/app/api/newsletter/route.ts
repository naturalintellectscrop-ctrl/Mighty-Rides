// ============================================================================
// NEWSLETTER SUBSCRIPTION
// POST /api/newsletter — store an email subscriber (idempotent, rate-limited).
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkRateLimit, rateLimitResponse, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = await checkRateLimit(
      { limiter: null, config: { limit: 5, window: '1 h' } },
      `newsletter:${ip}`
    )
    if (!rl.success) return rateLimitResponse(rl.reset)

    const { email } = await request.json()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Idempotent — re-subscribing the same email is a no-op success.
    await db.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase() },
      create: { email: email.toLowerCase(), source: 'footer' },
      update: {},
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[NEWSLETTER] Error:', error)
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })
  }
}
