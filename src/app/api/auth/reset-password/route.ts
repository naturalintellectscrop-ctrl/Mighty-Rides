// ============================================================================
// RESET PASSWORD API
// POST /api/auth/reset-password
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, confirmPassword } = body

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Find token
    const tokenRecord = await db.setting.findUnique({
      where: { key: `reset_${token}` },
    })

    if (!tokenRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      )
    }

    const { userId, expiresAt } = JSON.parse(tokenRecord.value)

    // Check expiry
    if (new Date(expiresAt) < new Date()) {
      await db.setting.delete({ where: { key: `reset_${token}` } })
      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update user password
    await db.user.update({
      where: { id: userId },
      data: { password_hash: passwordHash },
    })

    // Delete used token
    await db.setting.delete({ where: { key: `reset_${token}` } })

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully' 
    })
  } catch (error) {
    console.error('[RESET_PASSWORD] Error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}

// GET - Validate token
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false })
    }

    const tokenRecord = await db.setting.findUnique({
      where: { key: `reset_${token}` },
    })

    if (!tokenRecord) {
      return NextResponse.json({ valid: false })
    }

    const { expiresAt } = JSON.parse(tokenRecord.value)

    if (new Date(expiresAt) < new Date()) {
      await db.setting.delete({ where: { key: `reset_${token}` } })
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    return NextResponse.json({ valid: false })
  }
}
