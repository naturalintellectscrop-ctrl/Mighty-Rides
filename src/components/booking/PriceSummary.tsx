'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { formatPriceInUGX, formatPriceInUSD } from '@/lib/booking-utils'

// ============================================================================
// TYPES
// ============================================================================

interface PriceSummaryProps {
  dailyRate: number
  weeklyRate?: number | null
  monthlyRate?: number | null
  days: number
  totalUgx: number
  exchangeRate?: number
  className?: string
}

// ============================================================================
// PRICE SUMMARY COMPONENT
// ============================================================================

export function PriceSummary({
  dailyRate,
  weeklyRate,
  monthlyRate,
  days,
  totalUgx,
  exchangeRate = 3700,
  className,
}: PriceSummaryProps) {
  // Calculate deposit (30%)
  const depositUgx = useMemo(() => {
    return Math.round(totalUgx * 0.3)
  }, [totalUgx])

  // Calculate remaining balance (70%)
  const remainingUgx = useMemo(() => {
    return totalUgx - depositUgx
  }, [totalUgx, depositUgx])

  // Determine rate type being used
  const rateType = useMemo(() => {
    if (days >= 28 && monthlyRate) return 'monthly'
    if (days >= 7 && weeklyRate) return 'weekly'
    return 'daily'
  }, [days, weeklyRate, monthlyRate])

  // Calculate effective daily rate
  const effectiveDailyRate = useMemo(() => {
    if (days === 0) return 0
    return Math.round(totalUgx / days)
  }, [totalUgx, days])

  if (days === 0 || totalUgx === 0) {
    return (
      <div className={cn('bg-brand-surface rounded-lg p-4 md:p-6', className)}>
        <p className="text-brand-silver text-sm text-center">
          Select dates to see pricing
        </p>
      </div>
    )
  }

  return (
    <div className={cn('bg-brand-surface rounded-lg p-4 md:p-6', className)}>
      {/* Header */}
      <h3 className="font-display text-lg font-bold text-brand-white mb-4">
        Price Summary
      </h3>

      {/* Rate Details */}
      <div className="space-y-3 pb-4 border-b border-brand-border">
        {/* Daily Rate */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-brand-silver text-sm">Daily Rate</p>
            <p className="text-brand-muted text-xs">
              {formatPriceInUGX(dailyRate)}
            </p>
          </div>
          <p className="text-brand-white text-sm">
            {formatPriceInUSD(dailyRate, exchangeRate)}
          </p>
        </div>

        {/* Show weekly rate if applicable */}
        {weeklyRate && (
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-silver text-sm">Weekly Rate</p>
              <p className="text-brand-muted text-xs">
                {formatPriceInUGX(weeklyRate)}
              </p>
            </div>
            <p className="text-brand-white text-sm">
              {formatPriceInUSD(weeklyRate, exchangeRate)}
            </p>
          </div>
        )}

        {/* Show monthly rate if applicable */}
        {monthlyRate && (
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-silver text-sm">Monthly Rate</p>
              <p className="text-brand-muted text-xs">
                {formatPriceInUGX(monthlyRate)}
              </p>
            </div>
            <p className="text-brand-white text-sm">
              {formatPriceInUSD(monthlyRate, exchangeRate)}
            </p>
          </div>
        )}
      </div>

      {/* Duration Breakdown */}
      <div className="py-4 border-b border-brand-border">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-brand-silver text-sm">Duration</p>
            <p className="text-brand-white text-sm font-medium">
              {days} day{days > 1 ? 's' : ''}
            </p>
          </div>
          <span
            className={cn(
              'text-xs px-2 py-1 rounded',
              rateType === 'monthly' && 'bg-green-500/20 text-green-400',
              rateType === 'weekly' && 'bg-brand-gold/20 text-brand-gold',
              rateType === 'daily' && 'bg-brand-surface-2 text-brand-silver'
            )}
          >
            {rateType === 'monthly' && 'Monthly Rate Applied'}
            {rateType === 'weekly' && 'Weekly Rate Applied'}
            {rateType === 'daily' && 'Standard Rate'}
          </span>
        </div>

        {rateType !== 'daily' && (
          <p className="text-brand-gold text-xs mt-2">
            {rateType === 'monthly'
              ? 'You saved with the monthly rate!'
              : 'You saved with the weekly rate!'}
          </p>
        )}
      </div>

      {/* Total Calculation */}
      <div className="py-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <p className="text-brand-silver">
            {effectiveDailyRate > 0 && (
              <span>
                {formatPriceInUGX(effectiveDailyRate)} × {days} day{days > 1 ? 's' : ''}
              </span>
            )}
          </p>
          <p className="text-brand-white font-medium">{formatPriceInUGX(totalUgx)}</p>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-brand-border">
        <p className="text-brand-white font-bold text-lg">Total</p>
        <div className="text-right">
          <p className="text-brand-gold font-bold text-lg">{formatPriceInUGX(totalUgx)}</p>
          <p className="text-brand-muted text-xs">{formatPriceInUSD(totalUgx, exchangeRate)}</p>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="mt-6 p-4 bg-brand-surface-2 rounded-lg">
        <h4 className="text-brand-white font-medium text-sm mb-3">Payment Breakdown</h4>

        {/* Deposit (30%) */}
        <div className="flex justify-between items-center py-2 border-b border-brand-border">
          <div>
            <p className="text-brand-silver text-sm">Deposit (30%)</p>
            <p className="text-brand-muted text-xs">Pay now to secure booking</p>
          </div>
          <div className="text-right">
            <p className="text-brand-gold font-bold">{formatPriceInUGX(depositUgx)}</p>
            <p className="text-brand-muted text-xs">{formatPriceInUSD(depositUgx, exchangeRate)}</p>
          </div>
        </div>

        {/* Remaining (70%) */}
        <div className="flex justify-between items-center py-2">
          <div>
            <p className="text-brand-silver text-sm">Remaining (70%)</p>
            <p className="text-brand-muted text-xs">Pay at pickup</p>
          </div>
          <div className="text-right">
            <p className="text-brand-white font-medium">{formatPriceInUGX(remainingUgx)}</p>
            <p className="text-brand-muted text-xs">{formatPriceInUSD(remainingUgx, exchangeRate)}</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-brand-muted text-xs mt-4 text-center">
        Prices are in Ugandan Shillings (UGX). USD equivalent is approximate.
      </p>
    </div>
  )
}
