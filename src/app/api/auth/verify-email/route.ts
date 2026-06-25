// ============================================================================
// EMAIL VERIFICATION API
// POST /api/auth/verify-email
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail, emailVerificationTemplate } from '@/lib/email'
import crypto from 'crypto'

// Generate a verification token
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// POST - Request a new verification email
export async function POST(request: NextRequest) {
  try {
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

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({ success: true })
    }

    if (user.email_verified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      )
    }

    // Generate new token
    const token = generateVerificationToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store token (we'll use a simple approach with settings table for tokens)
    await db.setting.upsert({
      where: { key: `verify_${token}` },
      create: {
        key: `verify_${token}`,
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

    // Send verification email
    const emailData = emailVerificationTemplate(email, token, user.full_name)
    await sendEmail(emailData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[VERIFY_EMAIL] Error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    )
  }
}

// GET - Verify token
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=missing_token', request.url))
    }

    // Find token
    const tokenRecord = await db.setting.findUnique({
      where: { key: `verify_${token}` },
    })

    if (!tokenRecord) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }

    const { userId, expiresAt } = JSON.parse(tokenRecord.value)

    // Check expiry
    if (new Date(expiresAt) < new Date()) {
      // Delete expired token
      await db.setting.delete({ where: { key: `verify_${token}` } })
      return NextResponse.redirect(new URL('/login?error=expired_token', request.url))
    }

    // Update user
    await db.user.update({
      where: { id: userId },
      data: { email_verified: true },
    })

    // Delete used token
    await db.setting.delete({ where: { key: `verify_${token}` } })

    return NextResponse.redirect(new URL('/login?verified=true', request.url))
  } catch (error) {
    console.error('[VERIFY_EMAIL] Error:', error)
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
  }
}
