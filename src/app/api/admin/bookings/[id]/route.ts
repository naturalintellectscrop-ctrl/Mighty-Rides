import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  sendEmail,
  bookingConfirmedTemplate,
  bookingActiveTemplate,
  bookingDeclinedTemplate,
  bookingReturnedTemplate,
} from '@/lib/email'

type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'RETURNED'
  | 'CANCELLED'
  | 'DECLINED'
  | 'DECLINED_REFUND_PENDING'

// ============================================================================
// BOOKING ACTIONS API
// ============================================================================

interface RouteParams {
  params: Promise<{ id: string }>
}

// Valid status transitions
const validTransitions: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'DECLINED', 'CANCELLED'],
  CONFIRMED: ['ACTIVE', 'DECLINED', 'CANCELLED'],
  ACTIVE: ['RETURNED'],
  RETURNED: [],
  CANCELLED: [],
  DECLINED: [],
  DECLINED_REFUND_PENDING: [],
}

// GET - Fetch single booking details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        rentee: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
            id_verified: true,
            email_verified: true,
            created_at: true,
          }
        },
        status_log: {
          orderBy: { created_at: 'desc' },
          take: 20,
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update booking status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, note, handover_fuel, handover_odo, handover_notes } = body

    // Get current booking
    const booking = await db.booking.findUnique({
      where: { id },
      include: { vehicle: true, rentee: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Validate status transition
    if (status && !validTransitions[booking.status].includes(status as BookingStatus)) {
      return NextResponse.json({
        error: `Cannot transition from ${booking.status} to ${status}`,
        validTransitions: validTransitions[booking.status],
      }, { status: 400 })
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {}
    
    if (status) {
      updateData.status = status
    }
    
    // Handle handover details when activating
    if (status === 'ACTIVE') {
      if (handover_fuel) updateData.handover_fuel = handover_fuel
      if (handover_odo) updateData.handover_odo = handover_odo
      if (handover_notes) updateData.handover_notes = handover_notes
      
      // Update vehicle status to RENTED_OUT
      await db.vehicle.update({
        where: { id: booking.vehicle_id },
        data: { status: 'RENTED_OUT' },
      })
    }

    // Handle return - update vehicle status back to AVAILABLE
    if (status === 'RETURNED') {
      await db.vehicle.update({
        where: { id: booking.vehicle_id },
        data: { status: 'AVAILABLE' },
      })
    }

    // Update booking
    const updatedBooking = await db.booking.update({
      where: { id },
      data: updateData,
    })

    // Create status log entry
    if (status) {
      await db.bookingStatusLog.create({
        data: {
          booking_id: id,
          old_status: booking.status,
          new_status: status,
          changed_by: session.user.id,
          note: note || null,
        },
      })
    }

    // Notify the customer of the status change (best-effort).
    if (status && booking.rentee?.email) {
      try {
        const getSetting = async (key: string, fallback: string) => {
          const s = await db.setting.findUnique({ where: { key } })
          return s?.value || fallback
        }
        const fmtDate = (d: Date) => d.toISOString().slice(0, 10)
        const fmtTime = (d: Date) => d.toISOString().slice(11, 16)
        const email = booking.rentee.email
        const vehicleName = booking.vehicle?.name || 'Vehicle'
        const plateNumber = booking.vehicle?.plate_number || undefined

        if (status === 'CONFIRMED') {
          const officeAddress = await getSetting('office_address', 'Kampala, Uganda')
          const officeHours = await getSetting('office_hours', 'Mon–Sat, 9:00am–6:00pm EAT')
          await sendEmail(bookingConfirmedTemplate(email, {
            bookingRef: booking.booking_ref,
            vehicleName,
            plateNumber,
            pickupDate: fmtDate(booking.pickup_datetime),
            pickupTime: fmtTime(booking.pickup_datetime),
            returnDate: fmtDate(booking.return_datetime),
            returnTime: fmtTime(booking.return_datetime),
            pickupLocation: booking.pickup_location || undefined,
            officeAddress,
            officeHours,
          }))
        } else if (status === 'ACTIVE') {
          const officeAddress = await getSetting('office_address', 'Kampala, Uganda')
          await sendEmail(bookingActiveTemplate(email, {
            bookingRef: booking.booking_ref,
            vehicleName,
            plateNumber,
            returnDate: fmtDate(booking.return_datetime),
            returnTime: fmtTime(booking.return_datetime),
            officeAddress,
            fuelLevel: handover_fuel || undefined,
            odometer: handover_odo || undefined,
          }))
        } else if (status === 'DECLINED' || status === 'DECLINED_REFUND_PENDING') {
          await sendEmail(bookingDeclinedTemplate(email, {
            bookingRef: booking.booking_ref,
            vehicleName,
            declineReason: note || 'Unfortunately we are unable to confirm this booking.',
            depositPaid: booking.deposit_paid,
            depositAmount: booking.deposit_ugx,
          }))
        } else if (status === 'RETURNED') {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
          await sendEmail(bookingReturnedTemplate(email, {
            bookingRef: booking.booking_ref,
            vehicleName,
            receiptUrl: `${appUrl}/api/bookings/${id}/receipt`,
          }))
        }
      } catch (emailError) {
        console.error('[ADMIN_BOOKING] Failed to send status email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
