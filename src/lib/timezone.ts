// ============================================================================
// TIMEZONE UTILITIES
// All dates displayed in East Africa Time (EAT) - Africa/Nairobi (UTC+3)
// ============================================================================

// EAT timezone constant
export const EAT_TIMEZONE = 'Africa/Nairobi'

/**
 * Format a date in EAT timezone
 */
export function formatEAT(
  date: Date | string,
  options?: {
    includeTime?: boolean
    dateStyle?: 'full' | 'long' | 'medium' | 'short'
    timeStyle?: 'full' | 'long' | 'medium' | 'short'
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: EAT_TIMEZONE,
  }
  
  if (options?.dateStyle) {
    formatOptions.dateStyle = options.dateStyle
  } else {
    formatOptions.year = 'numeric'
    formatOptions.month = 'long'
    formatOptions.day = 'numeric'
  }
  
  if (options?.includeTime !== false) {
    if (options?.timeStyle) {
      formatOptions.timeStyle = options.timeStyle
    } else {
      formatOptions.hour = '2-digit'
      formatOptions.minute = '2-digit'
    }
  }
  
  return d.toLocaleString('en-UG', formatOptions)
}

/**
 * Format date only (no time) in EAT
 */
export function formatDateEAT(date: Date | string): string {
  return formatEAT(date, { includeTime: false })
}

/**
 * Format time only in EAT
 */
export function formatTimeEAT(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-UG', {
    timeZone: EAT_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format datetime for display (e.g. "Saturday, 14 December 2024 at 9:00 AM (EAT)")
 */
export function formatDateTimeEAT(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const dateStr = d.toLocaleDateString('en-UG', {
    timeZone: EAT_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = d.toLocaleTimeString('en-UG', {
    timeZone: EAT_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${dateStr} at ${timeStr} (EAT)`
}

/**
 * Format a date range in EAT
 */
export function formatDateRangeEAT(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  const startDateStr = start.toLocaleDateString('en-UG', {
    timeZone: EAT_TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const endDateStr = end.toLocaleDateString('en-UG', {
    timeZone: EAT_TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const startTimeStr = start.toLocaleTimeString('en-UG', {
    timeZone: EAT_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
  })
  const endTimeStr = end.toLocaleTimeString('en-UG', {
    timeZone: EAT_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
  })
  
  return `${startDateStr} ${startTimeStr} – ${endDateStr} ${endTimeStr} (EAT)`
}

/**
 * Get current EAT time
 */
export function nowEAT(): Date {
  // Convert current UTC time to EAT
  const now = new Date()
  const eatOffset = 3 * 60 * 60 * 1000 // 3 hours in ms
  return new Date(now.getTime() + eatOffset)
}

/**
 * Convert EAT datetime string to UTC Date
 * Used when saving user-input dates to database
 */
export function eatToUTC(eatDateTime: string): Date {
  // Parse the EAT datetime and convert to UTC
  const d = new Date(eatDateTime)
  // Subtract 3 hours to get UTC from EAT
  return new Date(d.getTime() - 3 * 60 * 60 * 1000)
}

/**
 * Convert UTC Date to EAT Date
 * Used when displaying database dates to user
 */
export function utcToEAT(utcDate: Date): Date {
  // Add 3 hours to get EAT from UTC
  return new Date(utcDate.getTime() + 3 * 60 * 60 * 1000)
}

/**
 * Get start of day in EAT (as UTC for database queries)
 */
export function startOfDayEAT(date?: Date): Date {
  const d = date || new Date()
  const eatNow = utcToEAT(d)
  eatNow.setHours(0, 0, 0, 0)
  return eatToUTC(eatNow.toISOString())
}

/**
 * Get end of day in EAT (as UTC for database queries)
 */
export function endOfDayEAT(date?: Date): Date {
  const d = date || new Date()
  const eatNow = utcToEAT(d)
  eatNow.setHours(23, 59, 59, 999)
  return eatToUTC(eatNow.toISOString())
}

/**
 * Check if a date is today in EAT timezone
 */
export function isTodayEAT(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  
  const dEAT = utcToEAT(d)
  const todayEAT = utcToEAT(today)
  
  return (
    dEAT.getFullYear() === todayEAT.getFullYear() &&
    dEAT.getMonth() === todayEAT.getMonth() &&
    dEAT.getDate() === todayEAT.getDate()
  )
}

/**
 * Check if a date is tomorrow in EAT timezone
 */
export function isTomorrowEAT(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const dEAT = utcToEAT(d)
  const tomorrowEAT = utcToEAT(tomorrow)
  
  return (
    dEAT.getFullYear() === tomorrowEAT.getFullYear() &&
    dEAT.getMonth() === tomorrowEAT.getMonth() &&
    dEAT.getDate() === tomorrowEAT.getDate()
  )
}

/**
 * Get relative time string (e.g. "2 days remaining", "in 3 hours")
 */
export function getRelativeTimeEAT(targetDate: Date | string): string {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate
  const now = new Date()
  
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffMs < 0) {
    return 'Overdue'
  }
  
  if (diffDays > 0) {
    if (diffHours > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}, ${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`
  }
  
  if (diffHours > 0) {
    if (diffMinutes > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}, ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`
  }
  
  if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`
  }
  
  return 'Less than a minute remaining'
}

/**
 * Format duration between two dates
 */
export function formatDuration(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`
  }
  
  return `${diffHours} hour${diffHours > 1 ? 's' : ''}`
}
