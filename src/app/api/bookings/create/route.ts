// ============================================================================
// CREATE BOOKING API
// POST /api/bookings/create
// Creates a new booking with soft lock and returns payment details
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  checkAvailability,
  createSoftLock,
  calculateTotalPrice,
  calculateDeposit,
  generateUniqueBookingRef,
  isValidDateRange,
} from '@/lib/booking-utils'
import { initializePayment } from '@/lib/flutterwave'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getExchangeRate(): Promise<number> {
  try {
    const setting = await db.setting.findUnique({
      where: { key: 'ugx_usd_rate' },
    })
    return setting ? parseFloat(setting.value) : 3700
  } catch {
    return 3700
  }
}

async function getAdminNotificationEmail(): Promise<string> {
  try {
    const setting = await db.setting.findUnique({
      where: { key: 'notification_email' },
    })
    return setting?.value || 'admin@mightyrides.com'
  } catch {
    return 'admin@mightyrides.com'
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const {
      vehicleId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      driverRequested,
      occasionType,
      specialNotes,
    } = body

    // Validate required fields
    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: vehicleId, startDate, endDate' },
        { status: 400 }
      )
    }

    // Parse and validate dates
    const pickupDate = new Date(startDate)
    const returnDate = new Date(endDate)

    const dateValidation = isValidDateRange(pickupDate, returnDate)
    if (!dateValidation.valid) {
      return NextResponse.json({ error: dateValidation.error }, { status: 400 })
    }

    // Get vehicle details
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Check if vehicle is available for hire
    if (vehicle.type !== 'HIRE' && vehicle.type !== 'BOTH') {
      return NextResponse.json(
        { error: 'This vehicle is not available for hire' },
        { status: 400 }
      )
    }

    // Check vehicle status
    if (vehicle.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: `Vehicle is currently ${vehicle.status.toLowerCase().replace('_', ' ')}` },
        { status: 400 }
      )
    }

    // Check availability
    const availability = await checkAvailability(vehicleId, pickupDate, returnDate)
    if (!availability.available) {
      return NextResponse.json(
        {
          error: 'Vehicle is not available for the selected dates',
          conflictingBookings: availability.conflictingBookings,
        },
        { status: 400 }
      )
    }

    // Create soft lock
    const lockResult = await createSoftLock(vehicleId, session.user.id)
    if (!lockResult.success) {
      return NextResponse.json(
        { error: lockResult.error || 'Vehicle is currently being booked by another user' },
        { status: 409 }
      )
    }

    try {
      // Calculate total price
      const priceCalculation = calculateTotalPrice(
        {
          dailyRateUgx: vehicle.daily_rate_ugx || 0,
          weeklyRateUgx: vehicle.weekly_rate_ugx,
          monthlyRateUgx: vehicle.monthly_rate_ugx,
        },
        pickupDate,
        returnDate
      )

      // Calculate deposit (30%)
      const depositUgx = calculateDeposit(priceCalculation.totalUgx)

      // Generate unique booking reference
      const bookingRef = await generateUniqueBookingRef()

      // Get exchange rate for USD conversion
      const exchangeRate = await getExchangeRate()
      const depositUsd = Math.round(depositUgx / exchangeRate)

      // Create booking
      const booking = await db.booking.create({
        data: {
          booking_ref: bookingRef,
          rentee_id: session.user.id,
          vehicle_id: vehicleId,
          pickup_datetime: pickupDate,
          return_datetime: returnDate,
          pickup_location: pickupLocation || null,
          driver_requested: driverRequested || false,
          occasion_type: occasionType || null,
          total_cost_ugx: priceCalculation.totalUgx,
          deposit_ugx: depositUgx,
          special_notes: specialNotes || null,
          status: 'PENDING',
          // Store the Flutterwave tx_ref up front so the payment webhook can
          // reconcile the deposit back to this booking.
          payment_ref: `MR-${bookingRef}`,
          updated_at: new Date(),
        },
      })

      // Log status change
      await db.bookingStatusLog.create({
        data: {
          booking_id: booking.id,
          old_status: 'NONE',
          new_status: 'PENDING',
        },
      })

      // Get user details for payment
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          full_name: true,
          email: true,
          phone: true,
        },
      })

      // Initialize payment with Flutterwave
      let paymentResult: Awaited<ReturnType<typeof initializePayment>> | null = null
      try {
        const paymentResponse = await initializePayment({
          txRef: `MR-${bookingRef}`,
          amount: depositUsd,
          currency: 'USD',
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portal/history?booking=${booking.id}`,
          email: user?.email || session.user.email,
          name: user?.full_name || session.user.name || 'Customer',
          phone: user?.phone || '',
          meta: {
            booking_id: booking.id,
            vehicle_id: vehicleId,
            vehicle_name: vehicle.name,
            user_id: session.user.id,
            deposit_ugx: depositUgx.toString(),
          },
        })
        paymentResult = paymentResponse
      } catch (paymentError) {
        console.error('[CREATE_BOOKING] Payment initialization failed:', paymentError)
        // Continue without payment URL - booking is created
      }

      return NextResponse.json({
        success: true,
        booking: {
          id: booking.id,
          bookingRef: booking.booking_ref,
          vehicleName: vehicle.name,
          startDate: booking.pickup_datetime.toISOString(),
          endDate: booking.return_datetime.toISOString(),
          totalUgx: priceCalculation.totalUgx,
          depositUgx,
          days: priceCalculation.days,
          breakdown: priceCalculation.breakdown,
          status: booking.status,
        },
        paymentUrl: paymentResult?.paymentUrl || null,
        softLock: {
          lockId: lockResult.lockId,
          expiresAt: lockResult.expiresAt?.toISOString(),
        },
      })
    } catch (innerError) {
      // Release soft lock if booking creation fails
      if (lockResult.lockId) {
        await db.softLock.delete({ where: { id: lockResult.lockId } }).catch(() => {})
      }
      throw innerError
    }
  } catch (error) {
    console.error('[CREATE_BOOKING] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
