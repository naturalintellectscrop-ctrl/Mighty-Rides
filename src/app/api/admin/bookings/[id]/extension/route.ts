// ============================================================================
// ADMIN EXTENSION DECISION API
// POST /api/admin/bookings/[id]/extension
// Allows admin to approve or decline a booking extension request
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, extensionResponseTemplate } from '@/lib/email'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Calculate the number of days between two dates (rounded up to whole days)
 */
function calculateAdditionalDays(oldReturn: Date, newReturn: Date): number {
  const diffMs = newReturn.getTime() - oldReturn.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
}

// POST - Approve or decline extension request
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    // Require ADMIN role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, decline_reason } = body

    // Validate action
    if (!action || !['approve', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "decline"' },
        { status: 400 }
      )
    }

    // Get the booking with vehicle and rentee info
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        rentee: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if there's a pending extension request
    if (!booking.extension_requested) {
      return NextResponse.json(
        { error: 'No pending extension request for this booking' },
        { status: 400 }
      )
    }

    // Validate extension request has a new return date
    if (!booking.extension_req_datetime) {
      return NextResponse.json(
        { error: 'Extension request is missing the new return date' },
        { status: 400 }
      )
    }

    let updatedBooking
    let additionalCost = 0
    let additionalDays = 0

    if (action === 'approve') {
      // Calculate additional days and cost
      additionalDays = calculateAdditionalDays(
        booking.return_datetime,
        booking.extension_req_datetime
      )

      const dailyRate = booking.vehicle.daily_rate_ugx || 0
      additionalCost = dailyRate * additionalDays

      // Update booking with approved extension
      updatedBooking = await db.booking.update({
        where: { id },
        data: {
          return_datetime: booking.extension_req_datetime,
          extension_requested: false,
          extension_req_datetime: null,
          extension_reason: null,
          total_cost_ugx: booking.total_cost_ugx + additionalCost,
        },
      })

      // Create status log entry for extension approval
      await db.bookingStatusLog.create({
        data: {
          booking_id: id,
          old_status: booking.status,
          new_status: booking.status, // Status remains ACTIVE
          changed_by: session.user.id,
          note: `Extension approved: +${additionalDays} days, +UGX ${additionalCost.toLocaleString()}`,
        },
      })

      // Send extension approved email to rentee
      const newReturnDateFormatted = booking.extension_req_datetime.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      await sendEmail(
        extensionResponseTemplate(booking.rentee.email, {
          bookingRef: booking.booking_ref,
          vehicleName: booking.vehicle.name,
          approved: true,
          newReturnDate: newReturnDateFormatted,
          additionalCost: additionalCost,
        })
      )

      console.log('[EXTENSION_APPROVE] Booking:', booking.booking_ref, 'Additional days:', additionalDays, 'Additional cost:', additionalCost)
    } else {
      // Decline the extension
      updatedBooking = await db.booking.update({
        where: { id },
        data: {
          extension_requested: false,
          extension_req_datetime: null,
          extension_reason: null,
        },
      })

      // Create status log entry for extension decline
      await db.bookingStatusLog.create({
        data: {
          booking_id: id,
          old_status: booking.status,
          new_status: booking.status, // Status remains ACTIVE
          changed_by: session.user.id,
          note: `Extension declined${decline_reason ? `: ${decline_reason}` : ''}`,
        },
      })

      // Send extension declined email to rentee
      await sendEmail(
        extensionResponseTemplate(booking.rentee.email, {
          bookingRef: booking.booking_ref,
          vehicleName: booking.vehicle.name,
          approved: false,
          declineReason: decline_reason || 'Unfortunately, we cannot accommodate your extension request at this time.',
        })
      )

      console.log('[EXTENSION_DECLINE] Booking:', booking.booking_ref)
    }

    return NextResponse.json({
      success: true,
      message: `Extension ${action}d successfully`,
      booking: {
        id: updatedBooking.id,
        booking_ref: booking.booking_ref,
        status: updatedBooking.status,
        return_datetime: updatedBooking.return_datetime,
        total_cost_ugx: updatedBooking.total_cost_ugx,
        extension_requested: updatedBooking.extension_requested,
      },
      ...(action === 'approve' && {
        extensionDetails: {
          additionalDays,
          additionalCost,
        },
      }),
    })
  } catch (error) {
    console.error('[EXTENSION_DECISION] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process extension decision' },
      { status: 500 }
    )
  }
}
