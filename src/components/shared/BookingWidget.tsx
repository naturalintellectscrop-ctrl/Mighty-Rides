'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const locations = [
  { value: 'kampala', label: 'Kampala' },
  { value: 'entebbe', label: 'Entebbe Airport' },
  { value: 'jinja', label: 'Jinja' },
  { value: 'mukono', label: 'Mukono' },
]

const carTypes = [
  { value: 'all', label: 'All Cars' },
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'sports', label: 'Sports Car' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'van', label: 'Van / Minibus' },
]

/**
 * BookingWidget Component
 * 
 * Design matches the Mighty Rides digital design specification:
 * - Glass morphism background with backdrop blur
 * - Positioned to overlap hero section (translate-y-1/2)
 * - 4-column grid layout on desktop
 * - Material Symbols icons
 * - Gold accent color for labels
 */
export function BookingWidget() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [carType, setCarType] = useState('all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (pickupDate) params.set('pickup', pickupDate)
    if (returnDate) params.set('return', returnDate)
    if (carType && carType !== 'all') params.set('type', carType)
    
    router.push(`/hire?${params.toString()}`)
  }

  // Format dates for display
  const formatDateRange = () => {
    if (!pickupDate && !returnDate) return ''
    const format = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    if (pickupDate && returnDate) {
      return `${format(pickupDate)} - ${format(returnDate)}`
    }
    return pickupDate ? format(pickupDate) : ''
  }

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-container-max px-5 sm:px-8 md:px-12 lg:px-20 xl:px-[80px] z-20">
      <form 
        onSubmit={handleSearch}
        className="bg-surface-container-high p-8 md:p-10 rounded-xl border border-outline-variant/30 shadow-2xl backdrop-blur-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Pick-up Location */}
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              Pick-up Location
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                location_on
              </span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg py-4 pl-10 pr-4 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              Dates
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                calendar_today
              </span>
              <input
                type="text"
                value={formatDateRange()}
                onClick={(e) => {
                  const target = e.target as HTMLInputElement
                  target.nextElementSibling?.classList.remove('hidden')
                }}
                readOnly
                placeholder="Select dates"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg py-4 pl-10 pr-4 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cursor-pointer transition-all placeholder:text-on-surface-variant"
              />
              {/* Hidden date inputs for actual selection */}
              <div className="hidden absolute top-full left-0 mt-2 bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-xl p-4 z-10">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Pick-up Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg py-2 px-3 text-sm text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant mb-1 block">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg py-2 px-3 text-sm text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      const target = e.target as HTMLButtonElement
                      target.closest('.absolute')?.classList.add('hidden')
                    }}
                    className="w-full bg-secondary text-surface-container-lowest py-2 rounded-lg text-sm font-medium hover:bg-secondary-fixed-dim transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              Vehicle Type
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                directions_car
              </span>
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg py-4 pl-10 pr-4 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none appearance-none cursor-pointer transition-all"
              >
                {carTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-secondary text-surface-container-lowest font-button py-4 rounded-lg hover:bg-secondary-fixed-dim transition-all duration-300 uppercase tracking-widest shadow-lg active:scale-[0.98]"
            >
              Find Excellence
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
