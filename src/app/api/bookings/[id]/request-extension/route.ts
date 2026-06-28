// ============================================================================
// RENTEE EXTENSION REQUEST API
// POST /api/bookings/[id]/request-extension
// Allows a rentee to request an extension for their active booking
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, adminAlertTemplate } from '@/lib/email'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST - Request a booking extension
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    // Require authentication
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only RENTEE can request extension
    if (session.user.role !== 'RENTEE') {
      return NextResponse.json({ error: 'Only rentees can request extensions' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { new_return_date, reason } = body

    // Validate required fields
    if (!new_return_date || !reason) {
      return NextResponse.json(
        { error: 'New return date and reason are required' },
        { status: 400 }
      )
    }

    // Validate new return date is a valid date
    const newReturnDate = new Date(new_return_date)
    if (isNaN(newReturnDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid return date format' },
        { status: 400 }
      )
    }

    // Get the booking
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        rentee: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user owns the booking
    if (booking.rentee_id !== session.user.id) {
      return NextResponse.json({ error: 'You do not own this booking' }, { status: 403 })
    }

    // Verify booking is ACTIVE
    if (booking.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Can only request extension for active bookings' },
        { status: 400 }
      )
    }

    // Check for existing pending extension request
    if (booking.extension_requested) {
      return NextResponse.json(
        { error: 'An extension request is already pending for this booking' },
        { status: 400 }
      )
    }

    // Validate new return date is after current return date
    if (newReturnDate <= booking.return_datetime) {
      return NextResponse.json(
        { error: 'New return date must be after the current return date' },
        { status: 400 }
      )
    }

    // Update booking with extension request
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        extension_requested: true,
        extension_req_datetime: newReturnDate,
        extension_reason: reason,
      },
    })

    // Send admin notification about extension request
    const adminEmailSetting = await db.setting.findUnique({
      where: { key: 'notification_email' },
    })
    const adminEmail = adminEmailSetting?.value || 'admin@mightyrides.com'

    const extensionDetails = {
      bookingRef: booking.booking_ref,
      renteeName: booking.rentee.full_name,
      renteeEmail: booking.rentee.email,
      renteePhone: booking.rentee.phone,
      vehicleName: booking.vehicle.name,
      currentReturnDate: booking.return_datetime.toISOString(),
      requestedReturnDate: newReturnDate.toISOString(),
      reason: reason,
    }

    await sendEmail(adminAlertTemplate(adminEmail, 'extension_request', extensionDetails))

    console.log('[EXTENSION_REQUEST] Created for booking:', booking.booking_ref)

    return NextResponse.json({
      success: true,
      message: 'Extension request submitted successfully',
      booking: {
        id: updatedBooking.id,
        booking_ref: booking.booking_ref,
        extension_requested: updatedBooking.extension_requested,
        extension_req_datetime: updatedBooking.extension_req_datetime,
      },
    })
  } catch (error) {
    console.error('[EXTENSION_REQUEST] Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit extension request' },
      { status: 500 }
    )
  }
}
