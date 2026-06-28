// ============================================================================
// CHANGE PASSWORD API
// POST /api/user/change-password — verify current password, set a new one.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { compare, hash } from 'bcryptjs'

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.'
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character.'
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All password fields are required.' }, { status: 400 })
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match.' }, { status: 400 })
    }

    const policyError = validatePassword(newPassword)
    if (policyError) {
      return NextResponse.json({ error: policyError }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const valid = await compare(currentPassword, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    }

    const password_hash = await hash(newPassword, 12)
    await db.user.update({ where: { id: user.id }, data: { password_hash } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CHANGE_PASSWORD] Error:', error)
    return NextResponse.json({ error: 'Failed to change password.' }, { status: 500 })
  }
}
