// ============================================================================
// UNAVAILABLE DATES API
// GET /api/bookings/unavailable
// Returns all unavailable dates for a vehicle (bookings + soft locks)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Missing vehicleId parameter' },
        { status: 400 }
      )
    }

    const now = new Date()

    // Get active bookings that haven't ended yet
    const bookings = await db.booking.findMany({
      where: {
        vehicle_id: vehicleId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        return_datetime: { gt: now },
      },
      select: {
        pickup_datetime: true,
        return_datetime: true,
      },
    })

    // Get active soft locks
    const locks = await db.softLock.findMany({
      where: {
        vehicle_id: vehicleId,
        expires_at: { gt: now },
      },
      select: {
        expires_at: true,
        created_at: true,
      },
    })

    // Format dates for response
    const unavailableDates = [
      // Add bookings
      ...bookings.map((b) => ({
        start: b.pickup_datetime.toISOString(),
        end: b.return_datetime.toISOString(),
        type: 'booking' as const,
      })),
      // Add soft locks
      ...locks.map((l) => ({
        start: l.created_at.toISOString(),
        end: l.expires_at.toISOString(),
        type: 'lock' as const,
      })),
    ]

    return NextResponse.json({
      dates: unavailableDates,
    })
  } catch (error) {
    console.error('[UNAVAILABLE_DATES] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unavailable dates' },
      { status: 500 }
    )
  }
}
