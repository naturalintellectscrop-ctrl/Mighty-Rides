'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '@/context'
import { cn } from '@/lib/utils'
import { Car, Plus } from 'lucide-react'

interface VehicleCardProps {
  vehicle: {
    id: string
    name: string
    make: string
    model: string
    year: number
    slug: string
    status: string
    type: string
    sale_price_ugx: number | null
    daily_rate_ugx?: number | null
    photos: string | null
    specs: string | null
  }
  hrefPrefix?: string
  showDailyRate?: boolean
}

/**
 * VehicleCard Component - Visual Design Specification
 * 
 * Design Requirements:
 * - Background: #1A1A1A (charcoal)
 * - Border-radius: 10px
 * - Hover: transform: translateY(-8px) + box-shadow: 0 12px 40px rgba(200,149,42,0.2)
 * - Image aspect ratio: 16:10
 * - Status badges with dots (green/amber/red)
 * - Price in gold, Montserrat Bold
 * - Plus button in gold circle (40px)
 */
export function VehicleCard({ vehicle, hrefPrefix = '/cars', showDailyRate = false }: VehicleCardProps) {
  const { formatPrice, rate } = useCurrency()
  
  const photos = vehicle.photos ? JSON.parse(vehicle.photos) : []
  const specs = vehicle.specs ? JSON.parse(vehicle.specs) : {}
  const price = showDailyRate 
    ? (vehicle.daily_rate_ugx || vehicle.sale_price_ugx || 0)
    : (vehicle.sale_price_ugx || vehicle.daily_rate_ugx || 0)
  const isSold = vehicle.status === 'SOLD'
  const isAvailable = vehicle.status === 'AVAILABLE'
  const isRented = vehicle.status === 'RENTED_OUT'
  const isReserved = vehicle.status === 'RESERVED'

  // Status badge configuration per Visual Design Specification
  const getStatusStyles = () => {
    if (isAvailable) {
      return {
        badge: 'bg-black/50 backdrop-blur-sm text-green-500 border border-green-500/30',
        dot: 'bg-green-500'
      }
    }
    if (isRented) {
      return {
        badge: 'bg-black/50 backdrop-blur-sm text-red-500 border border-red-500/30',
        dot: 'bg-red-500'
      }
    }
    if (isReserved) {
      return {
        badge: 'bg-black/50 backdrop-blur-sm text-amber-500 border border-amber-500/30',
        dot: 'bg-amber-500'
      }
    }
    return {
      badge: 'bg-charcoal text-brand-muted border border-brand-slate',
      dot: 'bg-brand-muted'
    }
  }

  const statusStyles = getStatusStyles()

  return (
    <Link
      href={`${hrefPrefix}/${vehicle.slug}`}
      className={cn(
        'group block bg-brand-charcoal rounded-[10px] overflow-hidden',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(200,149,42,0.2)]',
        isSold && 'opacity-60 pointer-events-none'
      )}
    >
      {/* Image Container - 16:10 aspect ratio per spec */}
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-charcoal">
        {photos[0] ? (
          <Image
            src={photos[0]}
            alt={vehicle.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-12 h-12 text-brand-muted" />
          </div>
        )}
        
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status Badge - Per Visual Design Specification */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
            'text-[11px] font-semibold uppercase tracking-wider',
            statusStyles.badge
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', statusStyles.dot)} />
            {isRented ? 'Rented Out' : vehicle.status.replace('_', ' ')}
          </span>
        </div>

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center">
            <span className="font-display text-2xl text-brand-white uppercase tracking-wider">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* Content Container - 20px padding per spec */}
      <div className="p-5">
        {/* Vehicle Name - Montserrat SemiBold, 16px */}
        <h3 className={cn(
          'font-label text-base font-semibold',
          'transition-colors duration-200',
          isSold ? 'text-brand-muted' : 'text-brand-white group-hover:text-brand-gold',
          'truncate mb-2'
        )}>
          {vehicle.name}
        </h3>
        
        {/* Year and Mileage */}
        <p className="text-sm text-brand-silver">
          {vehicle.year}
          {specs.mileage && ` • ${specs.mileage.toLocaleString()} km`}
        </p>

        {/* Price Row - Per Visual Design Specification */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-slate">
          {/* Price - Montserrat Bold, 18px, Gold */}
          <div>
            <p className={cn(
              'font-label text-lg font-bold',
              isSold ? 'text-brand-muted' : 'text-brand-gold'
            )}>
              {formatPrice(price)}
              {showDailyRate && vehicle.daily_rate_ugx && ' / Day'}
            </p>
            {/* USD equivalent */}
            {price > 0 && rate > 0 && (
              <p className="text-xs text-brand-muted mt-0.5">
                ≈ ${Math.round(price / rate).toLocaleString()} USD
              </p>
            )}
          </div>
          
          {/* Plus Button - 40px circle, gold background per spec */}
          {!isSold && (
            <div className={cn(
              'w-10 h-10 rounded-full bg-brand-gold',
              'flex items-center justify-center',
              'transition-transform duration-200',
              'group-hover:scale-110'
            )}>
              <Plus className="w-5 h-5 text-brand-black" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
