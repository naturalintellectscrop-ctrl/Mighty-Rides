// ============================================================================
// FORGOT PASSWORD API
// POST /api/auth/forgot-password
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail, passwordResetTemplate } from '@/lib/email'
import { checkRateLimit, rateLimitResponse, getClientIp } from '@/lib/rate-limit'
import crypto from 'crypto'

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 3 requests per hour per IP
    const ip = getClientIp(request)
    const rateLimitResult = await checkRateLimit(
      { limiter: null, config: { limit: 3, window: '1 h' } },
      `forgot-password:${ip}`
    )

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.reset)
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        success: true,
        message: 'If that email is registered, you will receive a reset link.' 
      })
    }

    // Generate reset token
    const token = generateResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store token
    await db.setting.upsert({
      where: { key: `reset_${token}` },
      create: {
        key: `reset_${token}`,
        value: JSON.stringify({
          userId: user.id,
          expiresAt: expiresAt.toISOString(),
        }),
      },
      update: {
        value: JSON.stringify({
          userId: user.id,
          expiresAt: expiresAt.toISOString(),
        }),
      },
    })

    // Send reset email
    const emailData = passwordResetTemplate(email, token, user.full_name)
    await sendEmail(emailData)

    return NextResponse.json({ 
      success: true,
      message: 'If that email is registered, you will receive a reset link.' 
    })
  } catch (error) {
    console.error('[FORGOT_PASSWORD] Error:', error)
    return NextResponse.json({ 
      success: true,
      message: 'If that email is registered, you will receive a reset link.' 
    })
  }
}
