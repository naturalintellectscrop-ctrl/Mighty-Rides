// ============================================================================
// CHECK AVAILABILITY API
// POST /api/bookings/check-availability
// Returns availability status and conflicting bookings if any
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkAvailability } from '@/lib/booking-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, startDate, endDate } = body

    // Validate required fields
    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: vehicleId, startDate, endDate' },
        { status: 400 }
      )
    }

    // Parse dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Validate date order
    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Check if vehicle exists
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, status: true },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Check availability
    const result = await checkAvailability(vehicleId, start, end)

    return NextResponse.json({
      available: result.available,
      conflictingBookings: result.conflictingBookings,
      conflictingLocks: result.conflictingLocks,
    })
  } catch (error) {
    console.error('[CHECK_AVAILABILITY] Error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}

// Also support GET for simple queries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required query parameters: vehicleId, startDate, endDate' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const result = await checkAvailability(vehicleId, start, end)

    return NextResponse.json({
      available: result.available,
      conflictingBookings: result.conflictingBookings,
      conflictingLocks: result.conflictingLocks,
    })
  } catch (error) {
    console.error('[CHECK_AVAILABILITY_GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
