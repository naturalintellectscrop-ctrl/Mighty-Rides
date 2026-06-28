'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { StatusBadge } from '@/components/status-badge'
import { VehicleCardSkeleton } from '@/components/skeleton'
import { formatUGX } from '@/lib/utils'

interface Vehicle {
  id: string
  slug: string
  name: string
  make: string
  model: string
  year: number
  status: string
  sale_price_ugx: number | null
  photos: string[]
  type: string
}

interface CarsClientProps {
  makes: string[]
  initialVehicles: Vehicle[]
  filters: {
    make?: string
    minPrice?: number
    maxPrice?: number
  }
}

export default function CarsClient({ makes, initialVehicles, filters }: CarsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    setIsLoading(true)
    const params = new URLSearchParams()
    
    if (key === 'make' && value) params.set('make', value)
    if (filters.minPrice && key !== 'minPrice') params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice && key !== 'maxPrice') params.set('maxPrice', filters.maxPrice.toString())
    if (key === 'minPrice' && value) params.set('minPrice', value)
    if (key === 'maxPrice' && value) params.set('maxPrice', value)
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setIsLoading(true)
    router.push(pathname)
  }

  const hasActiveFilters = filters.make || filters.minPrice || filters.maxPrice

  return (
    <div className="lg:flex lg:gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:w-64 flex-shrink-0 mb-8 lg:mb-0">
        <div className="bg-[#141414] border border-[#222222] rounded-lg p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-white">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[#C8952A] text-sm hover:text-white transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Make Filter */}
          <div className="mb-6">
            <label className="block text-[#B0B0B0] text-sm mb-2">Make</label>
            <select
              value={filters.make || ''}
              onChange={(e) => handleFilterChange('make', e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#222222] rounded text-white text-sm focus:border-[#C8952A] outline-none"
            >
              <option value="">All Makes</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-[#B0B0B0] text-sm mb-2">Price Range (UGX)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#222222] rounded text-white text-sm focus:border-[#C8952A] outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#222222] rounded text-white text-sm focus:border-[#C8952A] outline-none"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Vehicle Grid */}
      <div className="flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <VehicleCardSkeleton />
            <VehicleCardSkeleton />
            <VehicleCardSkeleton />
            <VehicleCardSkeleton />
            <VehicleCardSkeleton />
            <VehicleCardSkeleton />
          </div>
        ) : initialVehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#666666] mb-4">No vehicles match your filters.</p>
            <button
              onClick={clearFilters}
              className="text-[#C8952A] hover:text-white transition-colors"
            >
              Clear filters
            </button>
            <span className="text-[#666666] mx-2">or</span>
            <Link href="/sourcing" className="text-[#C8952A] hover:text-white transition-colors">
              Request sourcing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/cars/${vehicle.slug}`}
                className={`group block bg-[#141414] border border-[#222222] rounded-lg overflow-hidden transition-all duration-200 hover:border-[#C8952A]/50 ${
                  vehicle.status === 'SOLD' ? 'opacity-70' : ''
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-[#0A0A0A]">
                  {vehicle.photos[0] ? (
                    <Image
                      src={vehicle.photos[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#666666]">
                      No image
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={vehicle.status} type="vehicle" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-display text-lg text-white mb-1 group-hover:text-[#C8952A] transition-colors">
                    {vehicle.name || `${vehicle.make} ${vehicle.model}`}
                  </h3>
                  <p className="text-[#666666] text-sm mb-3">{vehicle.year}</p>

                  {vehicle.sale_price_ugx && (
                    <p className="font-display text-xl text-[#C8952A]">
                      UGX {formatUGX(vehicle.sale_price_ugx)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
