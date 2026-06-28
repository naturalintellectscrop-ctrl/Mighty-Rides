// ============================================================================
// MARK BOOKING ACTIVE (quick action from /admin/pickups)
// POST /api/bookings/[id]/activate  — HTML form post, redirects back.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, bookingActiveTemplate } from '@/lib/email'

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
  if (booking.status !== 'CONFIRMED') {
    return NextResponse.json(
      { error: `Cannot activate a booking in status ${booking.status}` },
      { status: 400 }
    )
  }

  await db.booking.update({ where: { id }, data: { status: 'ACTIVE' } })
  await db.vehicle.update({ where: { id: booking.vehicle_id }, data: { status: 'RENTED_OUT' } })
  await db.bookingStatusLog.create({
    data: {
      booking_id: id,
      old_status: booking.status,
      new_status: 'ACTIVE',
      changed_by: session.user.id,
    },
  })

  if (booking.rentee?.email) {
    try {
      const officeSetting = await db.setting.findUnique({ where: { key: 'office_address' } })
      await sendEmail(bookingActiveTemplate(booking.rentee.email, {
        bookingRef: booking.booking_ref,
        vehicleName: booking.vehicle?.name || 'Vehicle',
        plateNumber: booking.vehicle?.plate_number || undefined,
        returnDate: booking.return_datetime.toISOString().slice(0, 10),
        returnTime: booking.return_datetime.toISOString().slice(11, 16),
        officeAddress: officeSetting?.value || 'Kampala, Uganda',
      }))
    } catch (e) {
      console.error('[ACTIVATE] email failed:', e)
    }
  }

  return NextResponse.redirect(new URL('/admin/pickups', request.url), 303)
}
