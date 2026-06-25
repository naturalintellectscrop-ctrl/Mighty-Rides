import Link from 'next/link'
import Image from 'next/image'
import { StatusBadge } from './status-badge'
import { formatUGX } from '@/lib/utils'

interface VehicleCardProps {
  id: string
  slug: string
  name: string
  make: string
  model: string
  year: number
  status: string
  salePriceUgx: bigint | number | null
  dailyRateUgx: bigint | number | null
  type: string // 'SALE' | 'HIRE' | 'BOTH'
  photos: string[]
  isHirePage?: boolean
}

export function VehicleCard({
  slug,
  name,
  make,
  model,
  year,
  status,
  salePriceUgx,
  dailyRateUgx,
  type,
  photos,
  isHirePage = false,
}: VehicleCardProps) {
  const coverImage = photos[0] || '/images/placeholder-car.jpg'
  const isUnavailable = status === 'SOLD' || status === 'RENTED_OUT' || status === 'IN_SERVICE' || status === 'RESERVED'
  const href = isHirePage ? `/hire/${slug}` : `/cars/${slug}`

  const displayPrice = isHirePage ? dailyRateUgx : salePriceUgx

  return (
    <Link
      href={href}
      className={`group block bg-[#141414] border border-[#222222] rounded-lg overflow-hidden transition-all duration-200 hover:border-[#C8952A]/50 ${
        isUnavailable ? 'opacity-70' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#0A0A0A]">
        <Image
          src={coverImage}
          alt={`${make} ${model} ${year}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} type="vehicle" />
        </div>
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-label font-bold uppercase tracking-wider bg-[#141414]/90 text-[#B0B0B0] border border-[#222222]">
            {type === 'BOTH' ? 'Sale & Hire' : type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-display text-lg text-white mb-1 group-hover:text-[#C8952A] transition-colors">
          {name || `${make} ${model}`}
        </h3>
        <p className="text-[#666666] text-sm mb-3">
          {year}
        </p>

        {/* Price */}
        {displayPrice && (
          <div className="flex items-baseline gap-2">
            {isHirePage ? (
              <>
                <span className="font-display text-xl text-[#C8952A]">
                  UGX {formatUGX(Number(displayPrice))}
                </span>
                <span className="text-[#666666] text-sm">/day</span>
              </>
            ) : (
              <span className="font-display text-xl text-[#C8952A]">
                UGX {formatUGX(Number(displayPrice))}
              </span>
            )}
          </div>
        )}

        {/* Unavailable message */}
        {isUnavailable && (
          <p className="text-[#666666] text-xs mt-2">
            {status === 'SOLD' && 'This vehicle has been sold'}
            {status === 'RENTED_OUT' && 'Currently rented out'}
            {status === 'IN_SERVICE' && 'Currently in service'}
            {status === 'RESERVED' && 'Currently reserved'}
          </p>
        )}
      </div>
    </Link>
  )
}
