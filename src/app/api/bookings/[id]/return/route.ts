// ============================================================================
// MARK BOOKING RETURNED (quick action from /admin/pickups)
// POST /api/bookings/[id]/return  — HTML form post, redirects back.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, bookingReturnedTemplate } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const booking = await db.booking.findUnique({
    where: { id },
    include: { vehicle: true, rentee: true },
  })
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  if (booking.status !== 'ACTIVE') {
    return NextResponse.json(
      { error: `Cannot mark returned a booking in status ${booking.status}` },
      { status: 400 }
    )
  }

  await db.booking.update({ where: { id }, data: { status: 'RETURNED' } })
  await db.vehicle.update({ where: { id: booking.vehicle_id }, data: { status: 'AVAILABLE' } })
  await db.bookingStatusLog.create({
    data: {
      booking_id: id,
      old_status: booking.status,
      new_status: 'RETURNED',
      changed_by: session.user.id,
    },
  })

  if (booking.rentee?.email) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      await sendEmail(bookingReturnedTemplate(booking.rentee.email, {
        bookingRef: booking.booking_ref,
        vehicleName: booking.vehicle?.name || 'Vehicle',
        receiptUrl: `${appUrl}/api/bookings/${id}/receipt`,
      }))
    } catch (e) {
      console.error('[RETURN] email failed:', e)
    }
  }

  return NextResponse.redirect(new URL('/admin/pickups', request.url), 303)
}
