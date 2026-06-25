// ============================================================================
// COMPLAINTS API (customer)
// POST /api/complaints       — create a complaint (authenticated user)
// GET  /api/complaints       — list the current user's complaints
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendAdminAlertEmail } from '@/lib/email'

const VALID_URGENCY = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const complaints = await db.complaint.findMany({
    where: { user_id: session.user.id },
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json({ complaints })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, urgency, description, booking_id } = body

    if (!type || !description) {
      return NextResponse.json(
        { error: 'Complaint type and description are required.' },
        { status: 400 }
      )
    }
    if (String(description).trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide a description of at least 20 characters.' },
        { status: 400 }
      )
    }
    const urgencyValue = VALID_URGENCY.includes(urgency) ? urgency : 'MEDIUM'

    const complaint = await db.complaint.create({
      data: {
        user_id: session.user.id,
        booking_id: booking_id || null,
        type,
        urgency: urgencyValue,
        description: String(description).trim(),
        status: 'OPEN',
      },
    })

    // Notify admin (urgent ones especially) — best-effort.
    try {
      const adminSetting = await db.setting.findUnique({ where: { key: 'notification_email' } })
      const adminEmail = adminSetting?.value || 'admin@mightyrides.com'
      await sendAdminAlertEmail(adminEmail, 'new_complaint', {
        complaintId: complaint.id,
        type,
        urgency: urgencyValue,
        customerName: session.user.name,
        description: String(description).trim().slice(0, 200),
      })
    } catch (e) {
      console.error('[COMPLAINTS] admin alert failed:', e)
    }

    return NextResponse.json({ success: true, complaint }, { status: 201 })
  } catch (error) {
    console.error('[COMPLAINTS] Error creating complaint:', error)
    return NextResponse.json({ error: 'Failed to submit complaint.' }, { status: 500 })
  }
}
