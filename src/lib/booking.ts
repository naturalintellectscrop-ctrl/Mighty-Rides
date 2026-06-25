// ============================================================================
// BOOKING UTILITIES
// Conflict checking, soft locks, booking calculations
// ============================================================================

import { db } from './db'

// ============================================================================
// DATE CONFLICT CHECKING
// ============================================================================

/**
 * Check if a vehicle is available for the requested date range
 * Returns true if available, false if there's a conflict
 */
export async function checkBookingConflict(
  vehicleId: string,
  pickupDatetime: Date,
  returnDatetime: Date,
  excludeBookingId?: string
): Promise<{ hasConflict: boolean; conflictingBookings: string[] }> {
  // Query for bookings that overlap with the requested dates
  // A booking overlaps if:
  // - Its pickup is before our return AND its return is after our pickup
  const conflictingBookings = await db.booking.findMany({
    where: {
      vehicle_id: vehicleId,
      status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
      OR: [
        {
          AND: [
            { pickup_datetime: { lt: returnDatetime } },
            { return_datetime: { gt: pickupDatetime } },
          ],
        },
      ],
    },
    select: { id: true, booking_ref: true },
  })

  return {
    hasConflict: conflictingBookings.length > 0,
    conflictingBookings: conflictingBookings.map(b => b.booking_ref),
  }
}

/**
 * Get all booked date ranges for a vehicle
 * Used for availability calendar display
 */
export async function getBookedDateRanges(
  vehicleId: string
): Promise<Array<{ start: Date; end: Date; status: string }>> {
  const bookings = await db.booking.findMany({
    where: {
      vehicle_id: vehicleId,
      status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
    },
    select: {
      pickup_datetime: true,
      return_datetime: true,
      status: true,
    },
  })

  return bookings.map(b => ({
    start: b.pickup_datetime,
    end: b.return_datetime,
    status: b.status,
  }))
}

// ============================================================================
// SOFT LOCK MECHANISM
// ============================================================================

const SOFT_LOCK_DURATION_MINUTES = 15

/**
 * Create a soft lock on a vehicle for a user
 * Prevents double-booking during the checkout process
 */
export async function createSoftLock(
  vehicleId: string,
  userId?: string
): Promise<{ success: boolean; lockId?: string; expiresAt?: Date }> {
  // Check if there's already an active lock for this vehicle by another user
  const existingLock = await db.softLock.findFirst({
    where: {
      vehicle_id: vehicleId,
      expires_at: { gt: new Date() },
      ...(userId && { user_id: { not: userId } }),
    },
  })

  if (existingLock) {
    return { success: false }
  }

  const expiresAt = new Date(Date.now() + SOFT_LOCK_DURATION_MINUTES * 60 * 1000)
  
  const lock = await db.softLock.create({
    data: {
      vehicle_id: vehicleId,
      user_id: userId,
      expires_at: expiresAt,
    },
  })

  return {
    success: true,
    lockId: lock.id,
    expiresAt,
  }
}

/**
 * Check if a vehicle has an active soft lock
 */
export async function checkSoftLock(
  vehicleId: string,
  excludeUserId?: string
): Promise<{ isLocked: boolean; lockedBy?: string; expiresAt?: Date }> {
  const lock = await db.softLock.findFirst({
    where: {
      vehicle_id: vehicleId,
      expires_at: { gt: new Date() },
      ...(excludeUserId && { user_id: { not: excludeUserId } }),
    },
  })

  return {
    isLocked: !!lock,
    lockedBy: lock?.user_id || undefined,
    expiresAt: lock?.expires_at || undefined,
  }
}

/**
 * Release a soft lock
 */
export async function releaseSoftLock(lockId: string): Promise<void> {
  await db.softLock.delete({
    where: { id: lockId },
  }).catch(() => {
    // Lock may have expired and been cleaned up
  })
}

/**
 * Clean up expired soft locks (can be called periodically)
 */
export async function cleanupExpiredSoftLocks(): Promise<number> {
  const result = await db.softLock.deleteMany({
    where: {
      expires_at: { lt: new Date() },
    },
  })
  return result.count
}

// ============================================================================
// BOOKING CALCULATIONS
// ============================================================================

/**
 * Calculate the number of rental days
 */
export function calculateRentalDays(pickupDatetime: Date, returnDatetime: Date): number {
  const diffMs = returnDatetime.getTime() - pickupDatetime.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays) // Minimum 1 day
}

/**
 * Calculate total rental cost based on vehicle rates and duration
 */
export function calculateRentalCost(
  dailyRate: number,
  weeklyRate: number | null,
  monthlyRate: number | null,
  days: number
): number {
  // Use the most cost-effective rate
  if (days >= 28 && monthlyRate) {
    const months = Math.floor(days / 28)
    const remainingDays = days % 28
    const weeklyCost = remainingDays >= 7 && weeklyRate 
      ? Math.floor(remainingDays / 7) * weeklyRate 
      : 0
    const dailyCostRemaining = remainingDays >= 7 
      ? (remainingDays % 7) * dailyRate 
      : remainingDays * dailyRate
    return months * monthlyRate + weeklyCost + dailyCostRemaining
  }
  
  if (days >= 7 && weeklyRate) {
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    return weeks * weeklyRate + remainingDays * dailyRate
  }
  
  return days * dailyRate
}

/**
 * Calculate deposit amount based on total cost
 */
export async function calculateDeposit(totalCostUgx: number): Promise<number> {
  const setting = await db.setting.findUnique({
    where: { key: 'deposit_percent' },
  })
  const depositPercent = setting ? parseInt(setting.value) : 30
  return Math.round(totalCostUgx * (depositPercent / 100))
}

/**
 * Generate a unique booking reference
 * Format: MR-YYYYMMDD-XXXX
 */
export async function generateBookingRef(): Promise<string> {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
  
  // Get count of bookings created today
  const todayStart = new Date(today.setHours(0, 0, 0, 0))
  const todayEnd = new Date(today.setHours(23, 59, 59, 999))
  
  const count = await db.booking.count({
    where: {
      created_at: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  })
  
  const sequence = (count + 1).toString().padStart(4, '0')
  return `MR-${dateStr}-${sequence}`
}

// ============================================================================
// BOOKING STATUS TRANSITIONS
// ============================================================================

/**
 * Get valid status transitions for a booking
 */
export function getValidStatusTransitions(
  currentStatus: string
): string[] {
  const transitions: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'DECLINED', 'CANCELLED'],
    CONFIRMED: ['ACTIVE', 'CANCELLED', 'DECLINED'],
    ACTIVE: ['RETURNED'],
    DECLINED: ['DECLINED_REFUND_PENDING'],
    DECLINED_REFUND_PENDING: ['DECLINED'], // After refund processed
    RETURNED: [], // Terminal state
    CANCELLED: [], // Terminal state
  }
  return transitions[currentStatus] || []
}

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(
  currentStatus: string,
  newStatus: string
): boolean {
  const validTransitions = getValidStatusTransitions(currentStatus)
  return validTransitions.includes(newStatus)
}

// ============================================================================
// BOOKING CREATION HELPER
// ============================================================================

interface CreateBookingInput {
  renteeId: string
  vehicleId: string
  pickupDatetime: Date
  returnDatetime: Date
  pickupLocation?: string
  driverRequested?: boolean
  occasionType?: string
  specialNotes?: string
}

export async function createBooking(input: CreateBookingInput) {
  // Get vehicle rates
  const vehicle = await db.vehicle.findUnique({
    where: { id: input.vehicleId },
  })
  
  if (!vehicle) {
    throw new Error('Vehicle not found')
  }
  
  if (vehicle.status !== 'AVAILABLE') {
    throw new Error('Vehicle is not available')
  }
  
  // Check for conflicts
  const { hasConflict } = await checkBookingConflict(
    input.vehicleId,
    input.pickupDatetime,
    input.returnDatetime
  )
  
  if (hasConflict) {
    throw new Error('Vehicle is not available for the selected dates')
  }
  
  // Calculate costs
  const days = calculateRentalDays(input.pickupDatetime, input.returnDatetime)
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
      rentee_id: input.renteeId,
      vehicle_id: input.vehicleId,
      pickup_datetime: input.pickupDatetime,
      return_datetime: input.returnDatetime,
      pickup_location: input.pickupLocation,
      driver_requested: input.driverRequested || false,
      occasion_type: input.occasionType,
      total_cost_ugx: totalCostUgx,
      deposit_ugx: depositUgx,
      special_notes: input.specialNotes,
      status: 'PENDING',
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
  
  return booking
}
