'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPriceInUGX, calculateRentalDays } from '@/lib/booking-utils'

// ============================================================================
// TYPES
// ============================================================================

interface UnavailableDate {
  start: Date
  end: Date
  type: 'booking' | 'lock'
}

interface AvailabilityCalendarProps {
  vehicleId: string
  dailyRate: number
  weeklyRate?: number | null
  monthlyRate?: number | null
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void
  onPriceChange?: (totalUgx: number, days: number) => void
  className?: string
}

// ============================================================================
// CALENDAR COMPONENT
// ============================================================================

export function AvailabilityCalendar({
  vehicleId,
  dailyRate,
  weeklyRate,
  monthlyRate,
  onDateSelect,
  onPriceChange,
  className,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  // Fetch unavailable dates
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/bookings/unavailable?vehicleId=${vehicleId}`)
        if (response.ok) {
          const data = await response.json()
          setUnavailableDates(
            data.dates.map((d: UnavailableDate) => ({
              start: new Date(d.start),
              end: new Date(d.end),
              type: d.type,
            }))
          )
        } else {
          setError('Failed to load availability')
        }
      } catch (err) {
        console.error('[AvailabilityCalendar] Error:', err)
        setError('Failed to load availability')
      } finally {
        setLoading(false)
      }
    }

    fetchUnavailableDates()
  }, [vehicleId])

  // Check if a date is unavailable
  const isDateUnavailable = useCallback(
    (date: Date): boolean => {
      const dateStart = new Date(date)
      dateStart.setHours(0, 0, 0, 0)
      const dateEnd = new Date(date)
      dateEnd.setHours(23, 59, 59, 999)

      return unavailableDates.some((unavailable) => {
        const unavailableStart = new Date(unavailable.start)
        const unavailableEnd = new Date(unavailable.end)
        return dateStart < unavailableEnd && dateEnd > unavailableStart
      })
    },
    [unavailableDates]
  )

  // Check if a date is in the past
  const isDatePast = useCallback((date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
  }, [])

  // Check if date is in selected range
  const isInRange = useCallback(
    (date: Date): boolean => {
      if (!startDate || !endDate && !hoverDate) return false
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)

      const rangeStart = new Date(startDate)
      rangeStart.setHours(0, 0, 0, 0)

      const rangeEnd = endDate ? new Date(endDate) : hoverDate ? new Date(hoverDate) : null
      if (!rangeEnd) return false
      rangeEnd.setHours(0, 0, 0, 0)

      return checkDate >= rangeStart && checkDate <= rangeEnd
    },
    [startDate, endDate, hoverDate]
  )

  // Check if date is start or end of range
  const isRangeEdge = useCallback(
    (date: Date): 'start' | 'end' | null => {
      if (!startDate && !endDate) return null
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)

      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        if (checkDate.getTime() === start.getTime()) return 'start'
      }

      if (endDate) {
        const end = new Date(endDate)
        end.setHours(0, 0, 0, 0)
        if (checkDate.getTime() === end.getTime()) return 'end'
      }

      return null
    },
    [startDate, endDate]
  )

  // Handle date click
  const handleDateClick = useCallback(
    (date: Date) => {
      if (isDateUnavailable(date) || isDatePast(date)) return

      const clickedDate = new Date(date)
      clickedDate.setHours(12, 0, 0, 0)

      if (!startDate || (startDate && endDate)) {
        // Start new selection
        setStartDate(clickedDate)
        setEndDate(null)
        onDateSelect?.(clickedDate, null)
      } else {
        // Complete selection
        if (clickedDate < startDate) {
          // Swap if clicked date is before start
          setStartDate(clickedDate)
          setEndDate(startDate)
          onDateSelect?.(clickedDate, startDate)
        } else {
          // Check if range includes unavailable dates
          let hasConflict = false
          const checkDate = new Date(startDate)
          while (checkDate <= clickedDate) {
            if (isDateUnavailable(checkDate)) {
              hasConflict = true
              break
            }
            checkDate.setDate(checkDate.getDate() + 1)
          }

          if (hasConflict) {
            // Reset selection if range includes unavailable dates
            setStartDate(clickedDate)
            setEndDate(null)
            onDateSelect?.(clickedDate, null)
          } else {
            setEndDate(clickedDate)
            onDateSelect?.(startDate, clickedDate)
          }
        }
      }
    },
    [startDate, endDate, isDateUnavailable, isDatePast, onDateSelect]
  )

  // Calculate price when dates change
  useEffect(() => {
    if (startDate && endDate && dailyRate > 0) {
      const days = calculateRentalDays(startDate, endDate)
      let total = days * dailyRate

      // Apply weekly discount
      if (days >= 7 && weeklyRate) {
        const weeks = Math.floor(days / 7)
        const remainingDays = days % 7
        total = weeks * weeklyRate + remainingDays * dailyRate
      }

      // Apply monthly discount
      if (days >= 28 && monthlyRate) {
        const months = Math.floor(days / 28)
        const remainingDays = days % 28
        const remainingCost = remainingDays * dailyRate
        total = months * monthlyRate + remainingCost
      }

      onPriceChange?.(total, days)
    } else {
      onPriceChange?.(0, 0)
    }
  }, [startDate, endDate, dailyRate, weeklyRate, monthlyRate, onPriceChange])

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay() // 0 = Sunday
    const daysInMonth = lastDay.getDate()

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

    // Add padding for previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }

    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({ date, isCurrentMonth: true })
    }

    // Add padding for next month
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({ date, isCurrentMonth: false })
    }

    return days
  }, [currentMonth])

  // Weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Month/year display
  const monthYearDisplay = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  if (loading) {
    return (
      <div className={cn('bg-brand-surface rounded-lg p-6', className)}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('bg-brand-surface rounded-lg p-6', className)}>
        <div className="flex items-center justify-center h-64 text-red-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-brand-surface rounded-lg p-4 md:p-6', className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-brand-silver hover:text-brand-gold transition-colors rounded-lg hover:bg-brand-surface-2"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-display text-lg font-bold text-brand-white">{monthYearDisplay}</h3>
        <button
          onClick={goToNextMonth}
          className="p-2 text-brand-silver hover:text-brand-gold transition-colors rounded-lg hover:bg-brand-surface-2"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-brand-muted py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const unavailable = isDateUnavailable(date)
          const past = isDatePast(date)
          const disabled = unavailable || past || !isCurrentMonth
          const inRange = isInRange(date)
          const edge = isRangeEdge(date)
          const isToday =
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear()

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => startDate && !endDate && setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
              disabled={disabled}
              className={cn(
                'relative aspect-square flex items-center justify-center text-sm rounded-lg transition-all',
                // Base styles
                isCurrentMonth ? 'text-brand-white' : 'text-brand-muted opacity-50',
                // Disabled states
                past && 'text-brand-muted cursor-not-allowed opacity-40',
                unavailable && !past && 'bg-red-500/20 text-red-400 cursor-not-allowed',
                // Today indicator
                isToday && !inRange && 'ring-1 ring-brand-gold',
                // Range selection
                inRange && !unavailable && 'bg-brand-gold/20',
                edge === 'start' && 'bg-brand-gold text-brand-black rounded-l-lg',
                edge === 'end' && 'bg-brand-gold text-brand-black rounded-r-lg',
                // Hover state
                !disabled && 'hover:bg-brand-gold/30 hover:text-brand-white cursor-pointer'
              )}
              aria-label={date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            >
              {date.getDate()}
              {/* Unavailable dot indicator */}
              {unavailable && !past && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-brand-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-brand-gold rounded" />
          <span className="text-xs text-brand-silver">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500/30 rounded" />
          <span className="text-xs text-brand-silver">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 ring-1 ring-brand-gold rounded" />
          <span className="text-xs text-brand-silver">Today</span>
        </div>
      </div>

      {/* Selected Dates Display */}
      {startDate && (
        <div className="mt-4 p-3 bg-brand-surface-2 rounded-lg">
          <p className="text-sm text-brand-silver">
            {startDate && endDate ? (
              <>
                <span className="text-brand-white font-medium">
                  {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="mx-2">—</span>
                <span className="text-brand-white font-medium">
                  {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="block mt-1 text-brand-gold">
                  {calculateRentalDays(startDate, endDate)} day
                  {calculateRentalDays(startDate, endDate) > 1 ? 's' : ''} •{' '}
                  {formatPriceInUGX(dailyRate)}/day
                </span>
              </>
            ) : (
              <>
                Select return date •{' '}
                <span className="text-brand-white font-medium">
                  {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
