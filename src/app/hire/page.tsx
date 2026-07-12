import { db } from '@/lib/db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Car, Heart, Plane, Users, Calendar, Building } from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Luxury Car Hire Kampala',
  description: 'Hire luxury and exotic vehicles in Kampala for weddings, airport transfers, executive and corporate travel. Daily, weekly and monthly rates from Mighty Rides.',
  alternates: { canonical: '/hire' },
}

// ============================================================================
// OCCASION DATA
// ============================================================================

const occasions = [
  { id: 'WEDDING', label: 'Wedding', icon: Heart, description: 'Arrive in style' },
  { id: 'AIRPORT', label: 'Airport', icon: Plane, description: 'Executive pickups' },
  { id: 'EXECUTIVE', label: 'Executive', icon: Users, description: 'Business travel' },
  { id: 'LONG_TERM', label: 'Long-term', icon: Calendar, description: 'Extended hire' },
  { id: 'PERSONAL', label: 'Personal', icon: Car, description: 'Self-drive' },
  { id: 'CORPORATE', label: 'Corporate', icon: Building, description: 'Fleet solutions' },
]

// ============================================================================
// RENTAL VEHICLE CARD
// ============================================================================

function RentalCard({ vehicle, currency }: { vehicle: {
  id: string
  name: string
  slug: string
  status: string
  daily_rate_ugx: number | null
  photos: string | null
  specs: string | null
}, currency: string }) {
  const photos = vehicle.photos ? JSON.parse(vehicle.photos) : []
  const specs = vehicle.specs ? JSON.parse(vehicle.specs) : {}
  const rate = 3700
  
  const isAvailable = vehicle.status === 'AVAILABLE'
  const isRented = vehicle.status === 'RENTED_OUT'
  const isReserved = vehicle.status === 'RESERVED'

  const dailyRate = vehicle.daily_rate_ugx || 0
  const displayPrice = currency === 'USD' ? Math.round(dailyRate / rate) : dailyRate
  const priceLabel = currency === 'USD' ? `$${displayPrice.toLocaleString()}` : `${displayPrice.toLocaleString()} UGX`

  const statusStyles = isAvailable 
    ? 'bg-green-500 text-white'
    : isReserved 
    ? 'bg-yellow-500 text-black'
    : 'bg-red-500 text-white'

  return (
    <div className="card-light group">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        {photos[0] ? (
          <Image
            src={photos[0]}
            alt={vehicle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-[#EFEDE7] flex items-center justify-center">
            <Car className="w-12 h-12 text-[#C9C4BA]" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`${statusStyles} text-xs px-3 py-1.5 rounded-full uppercase font-bold`}>
            {isRented ? 'Rented' : vehicle.status.replace('_', ' ')}
          </span>
        </div>

        {/* Overlay for unavailable */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Currently Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="text-xl font-bold text-[#1A1815] mb-2">
          {vehicle.name}
        </h4>

        {/* Specs Tags */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {specs.body_type && (
            <span className="text-[10px] bg-[#F2F0EA] border border-[#ECEAE3] text-[#8A6410] px-2 py-1 rounded uppercase">
              {specs.body_type}
            </span>
          )}
          {specs.transmission && (
            <span className="text-[10px] bg-[#F2F0EA] border border-[#ECEAE3] text-[#8A6410] px-2 py-1 rounded uppercase">
              {specs.transmission}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[#8A857C] text-xs uppercase mb-1">Daily Rate</p>
            <p className="text-[#8A6410] text-xl font-bold">
              {priceLabel}
              <span className="text-[#8A857C] font-normal text-sm">/day</span>
            </p>
          </div>
        </div>

        {/* CTA Button */}
        {isAvailable ? (
          <Link
            href={`/hire/${vehicle.slug}`}
            className="w-full bg-[#C8952A] text-black font-bold py-4 rounded-xl transition-all hover:bg-[#D4A644] uppercase tracking-wide text-center block text-sm"
          >
            Check Availability
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="w-full bg-[#E7E4DC] text-[#9C978D] font-bold py-4 rounded-xl uppercase tracking-wide cursor-not-allowed text-sm"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// HIRE PAGE
// ============================================================================

interface HirePageProps {
  searchParams: Promise<{
    occasion?: string
    currency?: string
  }>
}

async function getVehicles(occasion?: string) {
  const where: Record<string, unknown> = {
    published: true,
    OR: [{ type: 'HIRE' }, { type: 'BOTH' }]
  }

  if (occasion && occasion !== 'all') {
    where.occasions = { contains: occasion }
  }

  try {
    return await db.vehicle.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { created_at: 'desc' }
      ],
      take: 24
    })
  } catch (error) {
    // Degrade gracefully (empty state) instead of throwing the error boundary
    // if the database is momentarily unreachable.
    console.error('[HIRE] Failed to load vehicles:', error)
    return []
  }
}

export default async function HirePage({ searchParams }: HirePageProps) {
  const params = await searchParams
  const selectedOccasion = params.occasion || 'all'
  const currency = params.currency || 'UGX'
  const vehicles = await getVehicles(selectedOccasion)

  const availableCount = vehicles.filter(v => v.status === 'AVAILABLE').length

  return (
    <main className="min-h-screen bg-[#141312] pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHAM6z-lVoessOOdOaEVb_uT4JeKB9KvzDxITfttCKT7GLLMXgyC5kcC9UZzm18gQSC4KWpxq1qRnjxgSKUh82TR3TPo10u9-ISxLpcUPOUtQz8dog29ncyRKSpu29SsPV2jrTxTVUTiF2N5qsMMlHvlCgKpJmkBkTNC7qDEyCN6j_69K3uFSuYngUh_YsckztLoN1obhuXbXy_VpkZsdUPWrp6LgtQb_FBm7e6I1zGt0Y3DeRk4S9YSE02x6SRbXMDWdsPMZYTpU"
            alt="Luxury car hire"
            fill
            className="object-cover brightness-[0.3] kenburns"
            priority
          />
        </div>
        
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
          <div className="">
            <div className="max-w-2xl">
              <span className="text-sm text-[#C8952A] tracking-widest uppercase mb-4 block font-semibold">
                Elevate Your Journey
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Luxury Car Hire Kampala
              </h1>
              <p className="text-lg text-gray-400 max-w-lg mb-8">
                Experience the pinnacle of automotive excellence. Our curated fleet offers prestige and performance for those who demand more from every mile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion Selector */}
      <section className="section-neutral py-16 md:py-24 px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="">
          <div className="text-center mb-12 reveal">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1815] mb-2">Designed For Your Moments</h2>
            <div className="w-20 h-1 bg-[#C8952A] mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6 reveal">
            {/* All Vehicles Tile */}
            <Link
              href="/hire"
              className={`group flex flex-col items-center p-6 md:p-8 rounded-xl bg-white transition-all duration-300 shadow-[0_1px_2px_rgba(26,24,21,0.04),0_8px_22px_rgba(26,24,21,0.06)] hover:-translate-y-1 ${
                selectedOccasion === 'all'
                  ? 'border-2 border-[#C8952A]'
                  : 'border border-[#ECEAE3] hover:border-[#C8952A]/50'
              }`}
            >
              <Car className="text-[#8A6410] w-8 h-8 md:w-10 md:h-10 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-[#1A1815] uppercase font-semibold">All</span>
            </Link>

            {/* Occasion Tiles */}
            {occasions.map(occasion => (
              <Link
                key={occasion.id}
                href={`/hire?occasion=${occasion.id}`}
                className={`group flex flex-col items-center p-6 md:p-8 rounded-xl bg-white transition-all duration-300 shadow-[0_1px_2px_rgba(26,24,21,0.04),0_8px_22px_rgba(26,24,21,0.06)] hover:-translate-y-1 ${
                  selectedOccasion === occasion.id
                    ? 'border-2 border-[#C8952A]'
                    : 'border border-[#ECEAE3] hover:border-[#C8952A]/50'
                }`}
              >
                <occasion.icon className="text-[#8A6410] w-8 h-8 md:w-10 md:h-10 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-[#1A1815] uppercase font-semibold">{occasion.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Filter + Fleet */}
      <section className="section-light px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
        <div className="">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <p className="text-[#5C574F]">
              Showing <span className="text-[#1A1815] font-bold">{vehicles.length}</span> vehicles
              {availableCount > 0 && <span className="text-[#8A6410] font-semibold"> ({availableCount} available)</span>}
            </p>

            {/* Currency Toggle */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-[#DAD6CD]">
              <Link
                href={{ pathname: '/hire', query: { ...params, currency: 'UGX' } }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  currency === 'UGX' ? 'bg-[#C8952A] text-black' : 'text-[#5C574F] hover:text-[#1A1815]'
                }`}
              >
                UGX
              </Link>
              <Link
                href={{ pathname: '/hire', query: { ...params, currency: 'USD' } }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  currency === 'USD' ? 'bg-[#C8952A] text-black' : 'text-[#5C574F] hover:text-[#1A1815]'
                }`}
              >
                USD
              </Link>
            </div>
          </div>

          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 reveal">
              {vehicles.map(vehicle => (
                <RentalCard key={vehicle.id} vehicle={vehicle} currency={currency} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#ECEAE3] rounded-xl shadow-[0_10px_30px_rgba(26,24,21,0.06)]">
              <Car className="w-16 h-16 text-[#C9C4BA] mx-auto mb-4" />
              <p className="text-[#5C574F] mb-4">
                No vehicles available for this occasion right now.
              </p>
              <Link href="/hire" className="btn btn-primary">
                View All Vehicles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 section-dark">
        <div className="px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
          <div className="">
            <div className="text-center mb-12 reveal">
              <span className="text-sm text-[#C8952A] uppercase tracking-widest mb-4 block font-semibold">
                How It Works
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Simple 4-Step Process</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 reveal">
              {[
                { step: 1, title: 'Register', description: 'Create an account and verify your ID' },
                { step: 2, title: 'Book & Pay Deposit', description: 'Select dates and pay 30% deposit online' },
                { step: 3, title: 'Visit Our Office', description: 'Sign agreement and pay balance' },
                { step: 4, title: 'Collect & Drive', description: 'Pick up your vehicle and enjoy' },
              ].map((item, index) => (
                <div key={item.step} className="text-center relative">
                  <div className="w-14 h-14 rounded-full bg-[#C8952A] text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-7 left-1/2 w-full h-0.5 bg-white/10" />
                  )}
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-[#B7B2AA]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'd like to enquire about luxury car hire." />
    </main>
  )
}
