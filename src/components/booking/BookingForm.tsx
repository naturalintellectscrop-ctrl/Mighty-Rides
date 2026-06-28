'use client'

import { useState, useCallback, useEffect } from 'react'
import { MapPin, Clock, Loader2, AlertCircle, Check, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AvailabilityCalendar } from './AvailabilityCalendar'
import { PriceSummary } from './PriceSummary'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// ============================================================================
// TYPES
// ============================================================================

interface BookingFormProps {
  vehicleId: string
  vehicleName: string
  dailyRate: number
  weeklyRate?: number | null
  monthlyRate?: number | null
  exchangeRate?: number
  className?: string
}

interface FormData {
  pickupLocation: string
  dropoffLocation: string
  driverRequested: boolean
  occasionType: string
  specialNotes: string
  termsAccepted: boolean
}

// ============================================================================
// PICKUP LOCATIONS
// ============================================================================

const PICKUP_LOCATIONS = [
  {
    id: 'office',
    name: 'Mighty Rides Office',
    address: 'Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala',
  },
  {
    id: 'airport',
    name: 'Airport Pickup',
    address: 'Entebbe International Airport (additional fee applies)',
  },
  {
    id: 'custom',
    name: 'Custom Location',
    address: 'Enter your preferred pickup location',
  },
]

const OCCASION_TYPES = [
  { id: 'personal', name: 'Personal Use' },
  { id: 'wedding', name: 'Wedding' },
  { id: 'corporate', name: 'Corporate Event' },
  { id: 'airport', name: 'Airport Transfer' },
  { id: 'safari', name: 'Safari/Tour' },
  { id: 'other', name: 'Other' },
]

// ============================================================================
// BOOKING FORM COMPONENT
// ============================================================================

export function BookingForm({
  vehicleId,
  vehicleName,
  dailyRate,
  weeklyRate,
  monthlyRate,
  exchangeRate = 3700,
  className,
}: BookingFormProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState<FormData>({
    pickupLocation: 'office',
    dropoffLocation: '',
    driverRequested: false,
    occasionType: 'personal',
    specialNotes: '',
    termsAccepted: false,
  })

  const [customPickupAddress, setCustomPickupAddress] = useState('')
  const [customDropoffAddress, setCustomDropoffAddress] = useState('')

  // Date selection state
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalDays, setTotalDays] = useState(0)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)

  // Handle date selection from calendar
  const handleDateSelect = useCallback((start: Date | null, end: Date | null) => {
    setSelectedStartDate(start)
    setSelectedEndDate(end)
    setError(null)
  }, [])

  // Handle price change from calendar
  const handlePriceChange = useCallback((total: number, days: number) => {
    setTotalPrice(total)
    setTotalDays(days)
  }, [])

  // Handle form field changes
  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  // Validate form
  const validateForm = (): boolean => {
    if (!selectedStartDate || !selectedEndDate) {
      setError('Please select pickup and return dates')
      return false
    }

    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions')
      return false
    }

    if (formData.pickupLocation === 'custom' && !customPickupAddress.trim()) {
      setError('Please enter a pickup location')
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!session?.user?.id) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          startDate: selectedStartDate?.toISOString(),
          endDate: selectedEndDate?.toISOString(),
          pickupLocation:
            formData.pickupLocation === 'custom'
              ? customPickupAddress
              : PICKUP_LOCATIONS.find((l) => l.id === formData.pickupLocation)?.address,
          dropoffLocation: formData.dropoffLocation === 'custom' ? customDropoffAddress : undefined,
          driverRequested: formData.driverRequested,
          occasionType: formData.occasionType,
          specialNotes: formData.specialNotes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      // Success - redirect to payment
      if (data.paymentUrl) {
        setPaymentUrl(data.paymentUrl)
      }

      setSuccess(true)
    } catch (err) {
      console.error('[BookingForm] Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className={cn('bg-brand-surface rounded-lg p-6 text-center', className)}>
        <AlertCircle className="w-12 h-12 text-brand-gold mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-brand-white mb-2">
          Sign in to Book
        </h3>
        <p className="text-brand-silver mb-4">
          Please sign in or create an account to book this vehicle
        </p>
        <button
          onClick={() => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))}
          className="btn btn-primary"
        >
          Sign In
        </button>
      </div>
    )
  }

  // Show success state
  if (success) {
    return (
      <div className={cn('bg-brand-surface rounded-lg p-6 text-center', className)}>
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-display text-xl font-bold text-brand-white mb-2">
          Booking Created!
        </h3>
        <p className="text-brand-silver mb-4">
          Your booking has been created successfully. Proceed to payment to secure your vehicle.
        </p>
        {paymentUrl && (
          <a
            href={paymentUrl}
            className="btn btn-primary inline-flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pay Deposit Now
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Availability Calendar */}
      <AvailabilityCalendar
        vehicleId={vehicleId}
        dailyRate={dailyRate}
        weeklyRate={weeklyRate}
        monthlyRate={monthlyRate}
        onDateSelect={handleDateSelect}
        onPriceChange={handlePriceChange}
      />

      {/* Price Summary */}
      {totalDays > 0 && (
        <PriceSummary
          dailyRate={dailyRate}
          weeklyRate={weeklyRate}
          monthlyRate={monthlyRate}
          days={totalDays}
          totalUgx={totalPrice}
          exchangeRate={exchangeRate}
        />
      )}

      {/* Pickup Location */}
      <div className="bg-brand-surface rounded-lg p-4 md:p-6">
        <h3 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-gold" />
          Pickup & Return
        </h3>

        {/* Pickup Location Select */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-brand-silver uppercase tracking-wider mb-2 block">
              Pickup Location
            </label>
            <select
              value={formData.pickupLocation}
              onChange={(e) => handleFieldChange('pickupLocation', e.target.value)}
              className="w-full bg-brand-surface-2 border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:border-brand-gold focus:outline-none"
            >
              {PICKUP_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Pickup Address */}
          {formData.pickupLocation === 'custom' && (
            <div>
              <label className="text-xs text-brand-silver uppercase tracking-wider mb-2 block">
                Enter Pickup Address
              </label>
              <input
                type="text"
                value={customPickupAddress}
                onChange={(e) => setCustomPickupAddress(e.target.value)}
                placeholder="Enter your pickup address"
                className="w-full bg-brand-surface-2 border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:border-brand-gold focus:outline-none"
              />
            </div>
          )}

          {/* Location Info */}
          {formData.pickupLocation !== 'custom' && (
            <p className="text-brand-muted text-sm">
              {PICKUP_LOCATIONS.find((l) => l.id === formData.pickupLocation)?.address}
            </p>
          )}
        </div>

        {/* Driver Option */}
        <div className="mt-4 pt-4 border-t border-brand-border">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.driverRequested}
              onChange={(e) => handleFieldChange('driverRequested', e.target.checked)}
              className="w-5 h-5 rounded border-brand-border bg-brand-surface-2 text-brand-gold focus:ring-brand-gold focus:ring-offset-0"
            />
            <div>
              <p className="text-brand-white text-sm font-medium">Request a Driver</p>
              <p className="text-brand-muted text-xs">Additional charges apply</p>
            </div>
          </label>
        </div>
      </div>

      {/* Occasion Type */}
      <div className="bg-brand-surface rounded-lg p-4 md:p-6">
        <h3 className="font-display text-lg font-bold text-brand-white mb-4">
          Occasion Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {OCCASION_TYPES.map((occasion) => (
            <button
              key={occasion.id}
              type="button"
              onClick={() => handleFieldChange('occasionType', occasion.id)}
              className={cn(
                'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                formData.occasionType === occasion.id
                  ? 'bg-brand-gold text-brand-black'
                  : 'bg-brand-surface-2 text-brand-silver hover:bg-brand-surface-3 hover:text-brand-white'
              )}
            >
              {occasion.name}
            </button>
          ))}
        </div>
      </div>

      {/* Special Notes */}
      <div className="bg-brand-surface rounded-lg p-4 md:p-6">
        <label className="text-xs text-brand-silver uppercase tracking-wider mb-2 block">
          Special Notes (Optional)
        </label>
        <textarea
          value={formData.specialNotes}
          onChange={(e) => handleFieldChange('specialNotes', e.target.value)}
          placeholder="Any special requests or notes for your booking..."
          rows={3}
          className="w-full bg-brand-surface-2 border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:border-brand-gold focus:outline-none resize-none"
        />
      </div>

      {/* Terms & Conditions */}
      <div className="bg-brand-surface rounded-lg p-4 md:p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => handleFieldChange('termsAccepted', e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-brand-border bg-brand-surface-2 text-brand-gold focus:ring-brand-gold focus:ring-offset-0"
          />
          <p className="text-brand-silver text-sm">
            I agree to the{' '}
            <a href="/terms" target="_blank" className="text-brand-gold hover:underline">
              Terms and Conditions
            </a>{' '}
            and understand that a 30% deposit is required to secure this booking. I confirm that I am at
            least 18 years old and hold a valid driving license.
          </p>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!selectedStartDate || !selectedEndDate || !formData.termsAccepted || isSubmitting}
        className={cn(
          'btn w-full py-4 text-lg font-bold transition-all',
          selectedStartDate && selectedEndDate && formData.termsAccepted
            ? 'btn-primary'
            : 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : (
          <>
            {selectedStartDate && selectedEndDate
              ? 'Proceed to Payment'
              : 'Select Dates to Continue'}
          </>
        )}
      </button>

      {/* Info Note */}
      <p className="text-center text-brand-muted text-xs">
        You will be redirected to our secure payment partner to complete your deposit.
      </p>
    </form>
  )
}
