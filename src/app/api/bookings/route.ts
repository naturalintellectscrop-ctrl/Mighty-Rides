// ============================================================================
// BOOKINGS API
// GET /api/bookings - List bookings (admin or user's own)
// POST /api/bookings - Create a new booking
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { 
  checkBookingConflict, 
  createBooking,
  calculateRentalDays,
  calculateRentalCost,
  calculateDeposit,
  generateBookingRef,
  createSoftLock
} from '@/lib/booking'
import { sendEmail, bookingPendingAdminTemplate } from '@/lib/email'

// GET - List bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const vehicleId = searchParams.get('vehicleId')

    // Admin sees all, rentee sees only their own
    const where: Record<string, unknown> = {}
    
    if (session.user.role === 'RENTEE') {
      where.rentee_id = session.user.id
    }
    
    if (status) {
      where.status = status
    }
    
    if (vehicleId) {
      where.vehicle_id = vehicleId
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        vehicle: {
          select: {
            name: true,
            plate_number: true,
            photos: true,
          },
        },
        rentee: session.user.role === 'ADMIN' ? {
          select: {
            full_name: true,
            email: true,
            phone: true,
          },
        } : false,
      },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('[BOOKINGS_GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      vehicleId,
      pickupDatetime,
      returnDatetime,
      pickupLocation,
      driverRequested,
      occasionType,
      specialNotes,
    } = body

    // Validate required fields
    if (!vehicleId || !pickupDatetime || !returnDatetime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get vehicle
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (vehicle.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Vehicle is not available' },
        { status: 400 }
      )
    }

    const pickup = new Date(pickupDatetime)
    const returnDt = new Date(returnDatetime)

    if (pickup >= returnDt) {
      return NextResponse.json(
        { error: 'Return date must be after pickup date' },
        { status: 400 }
      )
    }

    // Check for conflicts
    const { hasConflict, conflictingBookings } = await checkBookingConflict(
      vehicleId,
      pickup,
      returnDt
    )

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Vehicle is not available for the selected dates', conflictingBookings },
        { status: 400 }
      )
    }

    // Calculate costs
    const days = calculateRentalDays(pickup, returnDt)
    const totalCostUgx = calculateRentalCost(
      vehicle.daily_rate_ugx || 0,
      vehicle.weekly_rate_ugx,
      vehicle.monthly_rate_ugx,
      days
    )
    const depositUgx = await calculateDeposit(totalCostUgx)
    const bookingRef = await generateBookingRef()

    // Create booking
    const booking = await db.booking.create({
      data: {
        booking_ref: bookingRef,
        rentee_id: session.user.id,
        vehicle_id: vehicleId,
        pickup_datetime: pickup,
        return_datetime: returnDt,
        pickup_location: pickupLocation,
        driver_requested: driverRequested || false,
        occasion_type: occasionType,
        total_cost_ugx: totalCostUgx,
        deposit_ugx: depositUgx,
        special_notes: specialNotes,
        status: 'PENDING',
        updated_at: new Date(),
      },
    })

    // Log status
    await db.bookingStatusLog.create({
      data: {
        booking_id: booking.id,
        old_status: 'NONE',
        new_status: 'PENDING',
      },
    })

    // Get user info for notification
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    // Get admin notification email
    const adminEmailSetting = await db.setting.findUnique({
      where: { key: 'notification_email' },
    })
    const adminEmail = adminEmailSetting?.value || 'admin@mightyrides.com'

    // Send admin notification (will be sent when deposit is paid)
    // For now, just log
    console.log('[BOOKING] Created:', bookingRef)

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingRef: booking.booking_ref,
        totalCostUgx,
        depositUgx,
        days,
        status: booking.status,
      },
    })
  } catch (error) {
    console.error('[BOOKINGS_POST] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
