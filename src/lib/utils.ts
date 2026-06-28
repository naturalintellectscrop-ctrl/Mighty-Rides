import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ============================================================================
// CLASS NAME UTILITY
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// CURRENCY UTILITIES
// ============================================================================

const UGX_USD_RATE = 3700 // Default rate, should be fetched from settings

export function formatUGX(amount: number): string {
  return new Intl.NumberFormat('en-UG').format(amount) + ' UGX'
}

export function formatUSD(amount: number, rate: number = UGX_USD_RATE): string {
  const usdAmount = Math.round(amount / rate)
  return '$' + new Intl.NumberFormat('en-US').format(usdAmount) + ' USD'
}

export function ugxToUsd(amount: number, rate: number = UGX_USD_RATE): number {
  return Math.round(amount / rate)
}

export function formatPrice(amount: number, currency: 'UGX' | 'USD', rate?: number): string {
  if (currency === 'UGX') {
    return formatUGX(amount)
  }
  return formatUSD(amount, rate)
}

export function formatDualPrice(amount: number, rate: number = UGX_USD_RATE): string {
  return `${formatUGX(amount)} / ${formatUSD(amount, rate)}`
}

// ============================================================================
// TIMEZONE UTILITIES (EAT - Africa/Nairobi UTC+3)
// ============================================================================

import { formatInTimeZone, toZonedTime } from 'date-fns-tz'
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns'

const EAT_TIMEZONE = 'Africa/Nairobi'

export function toEAT(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date
  return toZonedTime(d, EAT_TIMEZONE)
}

export function formatEAT(date: Date | string, formatStr: string = 'PPP p'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatInTimeZone(d, EAT_TIMEZONE, formatStr)
}

export function formatEATDate(date: Date | string): string {
  return formatEAT(date, 'EEEE, d MMMM yyyy')
}

export function formatEATTime(date: Date | string): string {
  return formatEAT(date, 'h:mm a')
}

export function formatEATDateTime(date: Date | string): string {
  return formatEAT(date, 'd MMM yyyy, h:mm a')
}

export function formatEATShort(date: Date | string): string {
  return formatEAT(date, 'd MMM yyyy')
}

export function formatRelativeEAT(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const eatDate = toEAT(d)
  
  if (isToday(eatDate)) {
    return `Today at ${formatEAT(d, 'h:mm a')}`
  }
  if (isTomorrow(eatDate)) {
    return `Tomorrow at ${formatEAT(d, 'h:mm a')}`
  }
  if (isYesterday(eatDate)) {
    return `Yesterday at ${formatEAT(d, 'h:mm a')}`
  }
  return formatEATDateTime(d)
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = d.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// ============================================================================
// SLUG GENERATION
// ============================================================================

export function generateSlug(make: string, model: string, year: number, id: string): string {
  const base = `${make}-${model}-${year}`.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  const shortId = id.split('-')[0]
  return `${base}-${shortId}`
}

// ============================================================================
// BOOKING REFERENCE GENERATION
// ============================================================================

export function generateBookingRef(): string {
  const date = new Date()
  const dateStr = format(date, 'yyyyMMdd')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MR-${dateStr}-${random}`
}

// ============================================================================
// PHONE NUMBER FORMATTING
// ============================================================================

export function formatWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const baseUrl = `https://wa.me/${cleanPhone}`
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`
  }
  return baseUrl
}

// ============================================================================
// DATE RANGE UTILITIES
// ============================================================================

export function getDaysBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function isDateRangeAvailable(
  start: Date,
  end: Date,
  bookedRanges: Array<{ start: Date; end: Date }>
): boolean {
  for (const range of bookedRanges) {
    // Check for overlap
    if (start < range.end && end > range.start) {
      return false
    }
  }
  return true
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-+()]{9,15}$/
  return phoneRegex.test(phone)
}

export function isAdult(dob: Date): boolean {
  const today = new Date()
  const age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 18
  }
  return age >= 18
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

export function calculateDeposit(total: number, percentage: number = 30): number {
  return Math.round(total * (percentage / 100))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}
