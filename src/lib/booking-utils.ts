// ============================================================================
// BOOKING UTILITY FUNCTIONS
// Availability checking, soft locks, price calculations, formatting
// ============================================================================

import { db } from './db'

// ============================================================================
// CONSTANTS
// ============================================================================

export const SOFT_LOCK_DURATION_MINUTES = 15
export const DEPOSIT_PERCENTAGE = 30
export const MINIMUM_RENTAL_DAYS = 1

// ============================================================================
// AVAILABILITY CHECKING
// ============================================================================

interface AvailabilityResult {
  available: boolean
  conflictingBookings: Array<{
    bookingRef: string
    startDate: Date
    endDate: Date
  }>
  conflictingLocks: Array<{
    expiresAt: Date
  }>
}

/**
 * Check if a vehicle is available for the requested date range
 * Considers both confirmed bookings and active soft locks
 */
export async function checkAvailability(
  vehicleId: string,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityResult> {
  // Validate date range
  if (startDate >= endDate) {
    return {
      available: false,
      conflictingBookings: [],
      conflictingLocks: [],
    }
  }

  // Check for overlapping bookings
  // A booking overlaps if: its pickup < our return AND its return > our pickup
  const conflictingBookings = await db.booking.findMany({
    where: {
      vehicle_id: vehicleId,
      status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
      pickup_datetime: { lt: endDate },
      return_datetime: { gt: startDate },
    },
    select: {
      booking_ref: true,
      pickup_datetime: true,
      return_datetime: true,
    },
  })

  // Check for active soft locks
  const conflictingLocks = await db.softLock.findMany({
    where: {
      vehicle_id: vehicleId,
      expires_at: { gt: new Date() },
    },
    select: {
      expires_at: true,
    },
  })

  const hasConflict = conflictingBookings.length > 0

  return {
    available: !hasConflict,
    conflictingBookings: conflictingBookings.map((b) => ({
      bookingRef: b.booking_ref,
      startDate: b.pickup_datetime,
      endDate: b.return_datetime,
    })),
    conflictingLocks: conflictingLocks.map((l) => ({
      expiresAt: l.expires_at,
    })),
  }
}

/**
 * Get all unavailable dates for a vehicle (bookings + soft locks)
 * Used for calendar display
 */
export async function getUnavailableDates(
  vehicleId: string
): Promise<Array<{ start: Date; end: Date; type: 'booking' | 'lock' }>> {
  const now = new Date()

  // Get active bookings
  const bookings = await db.booking.findMany({
    where: {
      vehicle_id: vehicleId,
      status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
      return_datetime: { gt: now }, // Only future/current bookings
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
    },
  })

  const unavailableDates: Array<{ start: Date; end: Date; type: 'booking' | 'lock' }> = []

  // Add bookings
  bookings.forEach((b) => {
    unavailableDates.push({
      start: b.pickup_datetime,
      end: b.return_datetime,
      type: 'booking',
    })
  })

  // Add soft locks as single-day blocks
  locks.forEach((l) => {
    unavailableDates.push({
      start: now,
      end: l.expires_at,
      type: 'lock',
    })
  })

  return unavailableDates
}

// ============================================================================
// SOFT LOCK MANAGEMENT
// ============================================================================

interface SoftLockResult {
  success: boolean
  lockId?: string
  expiresAt?: Date
  error?: string
}

/**
 * Create a soft lock on a vehicle for a user
 * Prevents double-booking during checkout process
 */
export async function createSoftLock(
  vehicleId: string,
  userId: string | null,
  expiresAt?: Date
): Promise<SoftLockResult> {
  // Check for existing active locks by other users
  const existingLock = await db.softLock.findFirst({
    where: {
      vehicle_id: vehicleId,
      expires_at: { gt: new Date() },
      ...(userId && { user_id: { not: userId } }),
    },
  })

  if (existingLock) {
    return {
      success: false,
      error: 'Vehicle is currently locked by another user',
    }
  }

  const lockExpiresAt = expiresAt || new Date(Date.now() + SOFT_LOCK_DURATION_MINUTES * 60 * 1000)

  try {
    const lock = await db.softLock.create({
      data: {
        vehicle_id: vehicleId,
        user_id: userId,
        expires_at: lockExpiresAt,
      },
    })

    return {
      success: true,
      lockId: lock.id,
      expiresAt: lock.expires_at,
    }
  } catch (error) {
    console.error('[createSoftLock] Error:', error)
    return {
      success: false,
      error: 'Failed to create soft lock',
    }
  }
}

/**
 * Clear/remove a soft lock
 */
export async function clearSoftLock(lockId: string): Promise<{ success: boolean }> {
  try {
    await db.softLock.delete({
      where: { id: lockId },
    })
    return { success: true }
  } catch (error) {
    // Lock may have expired or been deleted
    console.error('[clearSoftLock] Error:', error)
    return { success: false }
  }
}

/**
 * Clear all soft locks for a user
 */
export async function clearUserSoftLocks(userId: string): Promise<{ count: number }> {
  try {
    const result = await db.softLock.deleteMany({
      where: { user_id: userId },
    })
    return { count: result.count }
  } catch (error) {
    console.error('[clearUserSoftLocks] Error:', error)
    return { count: 0 }
  }
}

/**
 * Extend a soft lock's expiration time
 */
export async function extendSoftLock(
  lockId: string,
  additionalMinutes: number = SOFT_LOCK_DURATION_MINUTES
): Promise<{ success: boolean; expiresAt?: Date }> {
  try {
    const existingLock = await db.softLock.findUnique({
      where: { id: lockId },
    })

    if (!existingLock || existingLock.expires_at < new Date()) {
      return { success: false }
    }

    const newExpiresAt = new Date(existingLock.expires_at.getTime() + additionalMinutes * 60 * 1000)

    const updated = await db.softLock.update({
      where: { id: lockId },
      data: { expires_at: newExpiresAt },
    })

    return { success: true, expiresAt: updated.expires_at }
  } catch (error) {
    console.error('[extendSoftLock] Error:', error)
    return { success: false }
  }
}

// ============================================================================
// PRICE CALCULATIONS
// ============================================================================

interface VehicleRates {
  dailyRateUgx: number
  weeklyRateUgx?: number | null
  monthlyRateUgx?: number | null
}

/**
 * Calculate total rental price based on vehicle rates and duration
 * Applies weekly/monthly discounts automatically
 */
export function calculateTotalPrice(
  vehicle: VehicleRates,
  startDate: Date,
  endDate: Date
): { totalUgx: number; days: number; breakdown: string } {
  const { dailyRateUgx, weeklyRateUgx, monthlyRateUgx } = vehicle

  // Calculate number of days (minimum 1 day)
  const diffMs = endDate.getTime() - startDate.getTime()
  const days = Math.max(MINIMUM_RENTAL_DAYS, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))

  let totalUgx = 0
  let breakdown = ''

  // Apply best rate calculation
  if (days >= 28 && monthlyRateUgx) {
    // Monthly rate calculation
    const months = Math.floor(days / 28)
    const remainingDays = days % 28

    // Calculate remaining days with weekly rate if applicable
    let remainingCost = 0
    if (remainingDays >= 7 && weeklyRateUgx) {
      const weeks = Math.floor(remainingDays / 7)
      const extraDays = remainingDays % 7
      remainingCost = weeks * weeklyRateUgx + extraDays * dailyRateUgx
    } else {
      remainingCost = remainingDays * dailyRateUgx
    }

    totalUgx = months * monthlyRateUgx + remainingCost
    breakdown = `${months} month${months > 1 ? 's' : ''}`
    if (remainingDays > 0) {
      breakdown += ` + ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
    }
  } else if (days >= 7 && weeklyRateUgx) {
    // Weekly rate calculation
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7

    totalUgx = weeks * weeklyRateUgx + remainingDays * dailyRateUgx
    breakdown = `${weeks} week${weeks > 1 ? 's' : ''}`
    if (remainingDays > 0) {
      breakdown += ` + ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
    }
  } else {
    // Daily rate only
    totalUgx = days * dailyRateUgx
    breakdown = `${days} day${days > 1 ? 's' : ''}`
  }

  return { totalUgx, days, breakdown }
}

/**
 * Calculate deposit amount from total
 */
export function calculateDeposit(totalUgx: number, percentage: number = DEPOSIT_PERCENTAGE): number {
  return Math.round(totalUgx * (percentage / 100))
}

/**
 * Calculate remaining balance (70%)
 */
export function calculateRemaining(totalUgx: number, depositUgx: number): number {
  return totalUgx - depositUgx
}

// ============================================================================
// BOOKING REFERENCE GENERATION
// ============================================================================

/**
 * Generate a unique booking reference
 * Format: MR-XXXXX (5 alphanumeric characters)
 */
export function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `MR-${code}`
}

/**
 * Generate a unique booking reference with date prefix
 * Format: MR-YYYYMMDD-XXXX
 */
export async function generateUniqueBookingRef(): Promise<string> {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')

  // Get count of bookings created today for sequential numbering
  const todayStart = new Date(today)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(today)
  todayEnd.setHours(23, 59, 59, 999)

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
// PRICE FORMATTING
// ============================================================================

/**
 * Format price in UGX with commas
 * Example: 1500000 -> "1,500,000 UGX"
 */
export function formatPriceInUGX(price: number): string {
  return new Intl.NumberFormat('en-UG').format(price) + ' UGX'
}

/**
 * Format price in USD
 * Example: 400 -> "$400 USD"
 */
export function formatPriceInUSD(price: number, exchangeRate?: number): string {
  // When an exchange rate is supplied, `price` is treated as a UGX amount and
  // converted to USD; otherwise it is assumed to already be a USD figure.
  const usd = exchangeRate && exchangeRate > 0 ? price / exchangeRate : price
  return '$' + new Intl.NumberFormat('en-US').format(Math.round(usd)) + ' USD'
}

/**
 * Format dual price (UGX and USD)
 */
export function formatDualPrice(ugxPrice: number, exchangeRate: number = 3700): string {
  const usdPrice = Math.round(ugxPrice / exchangeRate)
  return `${formatPriceInUGX(ugxPrice)} / ${formatPriceInUSD(usdPrice)}`
}

// ============================================================================
// DATE UTILITIES FOR BOOKING
// ============================================================================

/**
 * Calculate number of rental days between two dates
 */
export function calculateRentalDays(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime()
  return Math.max(MINIMUM_RENTAL_DAYS, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

/**
 * Check if a date range is valid for booking
 */
export function isValidDateRange(
  startDate: Date,
  endDate: Date,
  minDays: number = MINIMUM_RENTAL_DAYS
): { valid: boolean; error?: string } {
  const now = new Date()

  if (startDate < now) {
    return { valid: false, error: 'Start date cannot be in the past' }
  }

  if (startDate >= endDate) {
    return { valid: false, error: 'End date must be after start date' }
  }

  const days = calculateRentalDays(startDate, endDate)
  if (days < minDays) {
    return { valid: false, error: `Minimum rental period is ${minDays} day${minDays > 1 ? 's' : ''}` }
  }

  return { valid: true }
}

/**
 * Check if dates represent same-day booking
 */
export function isSameDayBooking(startDate: Date, endDate: Date): boolean {
  const days = calculateRentalDays(startDate, endDate)
  return days === 1
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate booking data before creation
 */
export function validateBookingData(data: {
  vehicleId: string
  startDate: Date
  endDate: Date
  pickupLocation?: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.vehicleId) {
    errors.push('Vehicle ID is required')
  }

  const dateValidation = isValidDateRange(data.startDate, data.endDate)
  if (!dateValidation.valid && dateValidation.error) {
    errors.push(dateValidation.error)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
