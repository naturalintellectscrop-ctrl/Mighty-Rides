import { db } from '@/lib/db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { CurrencyToggle } from '@/components/vehicles'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Settings, Fuel } from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// CARS/INVENTORY PAGE - Matching Design Specification
// ============================================================================

interface CarsPageProps {
  searchParams: Promise<{
    make?: string
    body?: string
    price?: string
    year?: string
    currency?: string
  }>
}

async function getVehicles(params: Awaited<CarsPageProps['searchParams']>) {
  const { make, year, price } = params

  const where: Record<string, unknown> = {
    published: true,
    OR: [
      { type: 'SALE' },
      { type: 'BOTH' }
    ],
    status: { not: 'SOLD' }
  }

  if (make && make !== 'all') {
    where.make = { equals: make, mode: 'insensitive' }
  }

  if (year && year !== 'all') {
    where.year = parseInt(year)
  }

  try {
    return await db.vehicle.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { created_at: 'desc' }
      ],
      take: 24
    })
  } catch (error) {
    console.error('[CARS] Failed to load vehicles:', error)
    return []
  }
}

async function getMakes() {
  try {
    const vehicles = await db.vehicle.findMany({
      where: {
        published: true,
        OR: [{ type: 'SALE' }, { type: 'BOTH' }]
      },
      select: { make: true }
    })
    const makes = [...new Set(vehicles.map(v => v.make).filter(Boolean))]
    return makes.sort()
  } catch (error) {
    console.error('[CARS] Failed to load makes:', error)
    return []
  }
}

// Vehicle Card Component matching design spec
function InventoryCard({ vehicle, currency }: { 
  vehicle: {
    id: string
    name: string
    make: string
    model: string
    year: number
    slug: string
    status: string
    sale_price_ugx: number | null
    photos: string | null
    specs: string | null
  },
  currency: string
}) {
  const photos = vehicle.photos ? JSON.parse(vehicle.photos) : []
  const specs = vehicle.specs ? JSON.parse(vehicle.specs) : {}
  const rate = 3700 // Default UGX/USD rate
  
  const priceUGX = vehicle.sale_price_ugx || 0
  const displayPrice = currency === 'USD' 
    ? `$${Math.round(priceUGX / rate).toLocaleString()}`
    : `UGX ${priceUGX.toLocaleString()}`
  
  const isAvailable = vehicle.status === 'AVAILABLE'
  const isReserved = vehicle.status === 'RESERVED'
  const isSold = vehicle.status === 'SOLD'
  
  const statusStyles = isAvailable 
    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
    : isReserved 
    ? 'bg-secondary/10 border border-secondary/20 text-secondary'
    : 'bg-error/10 border border-error/20 text-error'
  
  const statusLabel = isAvailable ? 'AVAILABLE' : isReserved ? 'RESERVED' : 'SOLD'

  return (
    <Link
      href={`/cars/${vehicle.slug}`}
      className="group bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#C8952A] hover:shadow-lg hover:shadow-[#C8952A]/10"
    >
      {/* Image Container - 16:10 aspect ratio per design */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {photos[0] ? (
          <Image
            src={photos[0]}
            alt={vehicle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
            <span className="text-gray-600 text-4xl">🚗</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 backdrop-blur-md rounded-full text-xs font-bold uppercase">
          <span className={statusStyles}>{statusLabel}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Vehicle Name */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
          {vehicle.year} {vehicle.name}
        </h3>
        
        {/* Specs Row */}
        <div className="flex items-center gap-4 mb-6 text-gray-400 text-sm">
          {specs.transmission && (
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              {specs.transmission}
            </span>
          )}
          <span className="text-gray-600">•</span>
          {specs.fuel && (
            <span className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-gray-500" />
              {specs.fuel}
            </span>
          )}
        </div>
        
        {/* Price and Arrow */}
        <div className="flex items-center justify-between">
          <span className="text-xl md:text-2xl font-bold text-[#C8952A]">
            {displayPrice}
          </span>
          <div className="w-12 h-12 rounded-full border-2 border-[#C8952A] text-[#C8952A] flex items-center justify-center transition-all group-hover:bg-[#C8952A] group-hover:text-black">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams
  const currency = params.currency || 'UGX'
  const vehicles = await getVehicles(params)
  const makes = await getMakes()

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-20">
      <Navbar />
      
      {/* Small Hero Section */}
      <section className="relative w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 overflow-hidden border-b border-gray-800 z-10">
        <div className="relative z-10">
          <div className="max-w-3xl">
            <span className="text-sm text-[#C8952A] uppercase tracking-widest mb-4 block font-semibold">
              Our Collection
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Luxury Cars for Sale
            </h1>
            <p className="text-lg text-gray-400 max-w-xl">
              Discover a curated selection of the world&apos;s most prestigious automotive masterpieces, meticulously maintained for the discerning driver.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none hidden lg:block">
          <div className="w-full h-full bg-gradient-to-l from-[#C8952A]/20 to-transparent" />
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <section className="sticky top-20 z-30 bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-gray-800">
        <div className="px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full lg:w-auto">
              {/* Make Dropdown */}
              <div className="relative group">
                <select 
                  name="make"
                  form="filter-form"
                  defaultValue={params.make || 'all'}
                  className="appearance-none w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:border-[#C8952A] transition-colors cursor-pointer min-h-[48px]"
                >
                  <option value="all">Make: All</option>
                  {makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
              </div>
              
              {/* Body Type Dropdown */}
              <div className="relative group">
                <select 
                  name="body"
                  form="filter-form"
                  defaultValue={params.body || 'all'}
                  className="appearance-none w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:border-[#C8952A] transition-colors cursor-pointer min-h-[48px]"
                >
                  <option value="all">Body: All</option>
                  <option value="suv">SUV</option>
                  <option value="sedan">Sedan</option>
                  <option value="coupe">Coupe</option>
                  <option value="convertible">Convertible</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
              </div>
              
              {/* Price Range Dropdown */}
              <div className="relative group">
                <select 
                  name="price"
                  form="filter-form"
                  defaultValue={params.price || 'all'}
                  className="appearance-none w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:border-[#C8952A] transition-colors cursor-pointer min-h-[48px]"
                >
                  <option value="all">Price Range</option>
                  <option value="50k-100k">$50k - $100k</option>
                  <option value="100k-250k">$100k - $250k</option>
                  <option value="250k+">$250k+</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
              </div>
              
              {/* Year Dropdown */}
              <div className="relative group">
                <select 
                  name="year"
                  form="filter-form"
                  defaultValue={params.year || 'all'}
                  className="appearance-none w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-3 md:px-4 py-3 text-white focus:outline-none focus:border-[#C8952A] transition-colors cursor-pointer min-h-[48px]"
                >
                  <option value="all">Year: All</option>
                  {Array.from({ length: 5 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
              </div>
            </div>
            
            {/* Currency Toggle */}
            <div className="flex items-center space-x-2 bg-[#1A1A1A] p-1 rounded-full border border-gray-700">
              <Link 
                href={{ pathname: '/cars', query: { ...params, currency: 'UGX' } }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 min-h-[40px] flex items-center justify-center ${
                  currency === 'UGX' ? 'bg-[#C8952A] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                UGX
              </Link>
              <Link 
                href={{ pathname: '/cars', query: { ...params, currency: 'USD' } }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 min-h-[40px] flex items-center justify-center ${
                  currency === 'USD' ? 'bg-[#C8952A] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                USD
              </Link>
            </div>
          </div>
        </div>
        
        {/* Hidden form for filter submission */}
        <form id="filter-form" method="GET" action="/cars" className="hidden" />
      </section>

      {/* Vehicle Grid */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map(vehicle => (
            <InventoryCard key={vehicle.id} vehicle={vehicle} currency={currency} />
          ))}
        </div>
        
        {/* Empty State */}
        {vehicles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-gray-400 mb-6">
              No vehicles match your filters.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/cars" className="btn btn-primary">
                View All Vehicles
              </Link>
              <Link href="/sourcing" className="text-[#C8952A] font-semibold flex items-center gap-2">
                Request Sourcing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {vehicles.length > 0 && (
          <div className="mt-16 flex justify-center items-center space-x-4">
            <button className="w-12 h-12 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#C8952A] hover:border-[#C8952A] transition-all rounded-lg">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex space-x-2">
              <button className="w-12 h-12 bg-[#C8952A] text-black font-semibold text-sm rounded-lg">01</button>
              <button className="w-12 h-12 border border-gray-700 text-white font-semibold text-sm hover:border-[#C8952A] transition-all rounded-lg">02</button>
              <button className="w-12 h-12 border border-gray-700 text-white font-semibold text-sm hover:border-[#C8952A] transition-all rounded-lg">03</button>
            </div>
            <button className="w-12 h-12 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#C8952A] hover:border-[#C8952A] transition-all rounded-lg">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
      
      {/* Sourcing CTA */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 bg-[#1A1A1A] text-center">
        <p className="text-sm text-[#C8952A] uppercase tracking-widest mb-4 font-semibold">
          Can&apos;t find what you need?
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          We Source Vehicles Globally
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Our global network can source any vehicle you desire. No obligation to proceed.
        </p>
        <Link href="/sourcing" className="btn btn-primary">
          Request Vehicle Sourcing <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'm interested in a vehicle on your website." />
    </main>
  )
}
