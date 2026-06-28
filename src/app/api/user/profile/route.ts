// ============================================================================
// USER PROFILE API
// PATCH /api/user/profile — update the current user's editable details.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function isValidUgandanPhone(phone: string): boolean {
  const normalized = phone.replace(/[\s-]/g, '')
  return /^(?:\+?256|0)7\d{8}$/.test(normalized)
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, phone } = body

    const data: { full_name?: string; phone?: string } = {}

    if (full_name !== undefined) {
      if (!String(full_name).trim()) {
        return NextResponse.json({ error: 'Full name cannot be empty.' }, { status: 400 })
      }
      data.full_name = String(full_name).trim()
    }

    if (phone !== undefined) {
      if (!isValidUgandanPhone(String(phone))) {
        return NextResponse.json(
          { error: 'Please enter a valid Ugandan phone number (e.g. 0772123456 or +256772123456).' },
          { status: 400 }
        )
      }
      data.phone = String(phone).trim()
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data,
      select: { full_name: true, phone: true, email: true },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('[USER_PROFILE] Error:', error)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}
