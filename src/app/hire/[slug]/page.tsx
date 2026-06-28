import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { BookingForm } from '@/components/booking'
import { formatDualPrice } from '@/lib/utils'
import { ArrowRight, Check, MessageCircle, MapPin, Clock, AlertCircle } from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// RENTAL DETAIL PAGE
// ============================================================================

interface RentalDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getVehicle(slug: string) {
  const vehicle = await db.vehicle.findUnique({
    where: { slug }
  })
  return vehicle
}

export default async function RentalDetailPage({ params }: RentalDetailPageProps) {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle || !vehicle.published || (vehicle.type !== 'HIRE' && vehicle.type !== 'BOTH')) {
    notFound()
  }

  const photos = vehicle.photos ? JSON.parse(vehicle.photos) : []
  const specs = vehicle.specs ? JSON.parse(vehicle.specs) : {}
  const occasions = vehicle.occasions ? JSON.parse(vehicle.occasions) : []

  const isAvailable = vehicle.status === 'AVAILABLE'
  const isRented = vehicle.status === 'RENTED_OUT'
  const isReserved = vehicle.status === 'RESERVED'
  const inService = vehicle.status === 'IN_SERVICE'
  const notAvailable = !isAvailable

  const dailyRate = vehicle.daily_rate_ugx || 0
  const weeklyRate = vehicle.weekly_rate_ugx || dailyRate * 7 * 0.85
  const monthlyRate = vehicle.monthly_rate_ugx || dailyRate * 30 * 0.7

  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-brand-silver overflow-x-auto">
            <Link href="/" className="hover:text-brand-gold whitespace-nowrap">Home</Link>
            <span className="text-brand-muted">/</span>
            <Link href="/hire" className="hover:text-brand-gold whitespace-nowrap">Hire</Link>
            <span className="text-brand-muted">/</span>
            <span className="text-brand-white whitespace-nowrap">{vehicle.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-brand-surface-2">
                {photos[0] ? (
                  <Image
                    src={photos[0]}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-brand-muted">No photos available</p>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`status-badge ${
                    isAvailable ? 'status-available' :
                    isRented ? 'status-rented' :
                    isReserved ? 'status-reserved' : 'status-sold'
                  }`}>
                    {vehicle.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {photos.map((photo: string, index: number) => (
                    <div
                      key={index}
                      className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-gold transition-all"
                    >
                      <Image src={photo} alt={`Photo ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-white">
                  {vehicle.name}
                </h1>
                {vehicle.plate_number && (
                  <p className="text-brand-silver mt-1">Plate: {vehicle.plate_number}</p>
                )}
              </div>

              {/* Unavailable Alert */}
              {notAvailable && (
                <div className="bg-brand-gold-bg border border-brand-gold/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-brand-white font-medium">Currently Unavailable</p>
                    <p className="text-brand-silver text-sm mt-1">
                      This vehicle is {vehicle.status.replace('_', ' ').toLowerCase()}. 
                      Please check back later or browse other available vehicles.
                    </p>
                    <Link href="/hire" className="text-brand-gold text-sm mt-2 inline-flex items-center gap-1">
                      View available vehicles <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Pricing Panel */}
              <div className="bg-brand-surface rounded-lg p-6">
                <h3 className="font-display text-lg font-bold text-brand-white mb-4">Pricing</h3>
                <div className="space-y-3">
                  {dailyRate > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-brand-silver">Daily Rate</span>
                      <span className="text-brand-gold font-medium">{formatDualPrice(dailyRate)}</span>
                    </div>
                  )}
                  {weeklyRate > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-brand-silver">Weekly Rate</span>
                      <span className="text-brand-white">{formatDualPrice(Math.round(weeklyRate))}</span>
                    </div>
                  )}
                  {monthlyRate > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-brand-silver">Monthly Rate</span>
                      <span className="text-brand-white">{formatDualPrice(Math.round(monthlyRate))}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-brand-muted mt-4">
                  Driver hire available at additional cost. Request in booking form.
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="font-display text-lg font-bold text-brand-white mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Seats', value: specs.seats },
                    { label: 'Fuel Type', value: specs.fuel },
                    { label: 'Transmission', value: specs.transmission },
                    { label: 'AC', value: 'Yes' },
                  ].filter(item => item.value).map(item => (
                    <div key={item.label} className="bg-brand-surface p-3 rounded-lg">
                      <p className="text-brand-muted text-xs uppercase tracking-wider">{item.label}</p>
                      <p className="text-brand-white font-medium">{String(item.value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {specs.features && Array.isArray(specs.features) && specs.features.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-white mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {specs.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-brand-silver text-sm">
                        <Check className="w-4 h-4 text-brand-gold flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Occasions */}
              {occasions.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-white mb-3">Perfect For</h3>
                  <div className="flex flex-wrap gap-2">
                    {occasions.map((occasion: string) => (
                      <span key={occasion} className="px-3 py-1 bg-brand-surface rounded-full text-xs text-brand-silver">
                        {occasion.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {isAvailable ? (
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '256785642717'}?text=${encodeURIComponent(`Hi, I'd like to enquire about hiring the ${vehicle.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gold hover:opacity-80 transition-opacity flex items-center gap-2 text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Enquiry
                  </a>
                ) : (
                  <Link href="/hire" className="btn">
                    View Other Available Vehicles
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section - For logged in users */}
      {isAvailable && (
        <section className="w-full px-4 md:px-6 lg:px-0 py-16 bg-brand-surface">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
              <p className="eyebrow mb-2 text-center">BOOK NOW</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-white mb-2 text-center">
                Book {vehicle.name}
              </h2>
              <p className="text-brand-silver text-center mb-8">
                Select your dates and complete the form to reserve this vehicle.
              </p>
              <BookingForm
                vehicleId={vehicle.id}
                vehicleName={vehicle.name}
                dailyRate={dailyRate}
                weeklyRate={vehicle.weekly_rate_ugx}
                monthlyRate={vehicle.monthly_rate_ugx}
              />
            </div>
          </div>
        </section>
      )}

      {/* Office Visit Notice */}
      <section className="py-8 bg-brand-gold-bg border-y border-brand-gold/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-gold" />
              <span className="text-brand-white text-sm">
                Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-gold" />
              <span className="text-brand-white text-sm">
                Mon – Sat: 8am – 6pm EAT
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Terms Summary */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-12 bg-brand-black">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-xl font-bold text-brand-white mb-6">Rental Terms Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-brand-white font-medium">30% Deposit Required</p>
                    <p className="text-brand-silver text-sm">Paid online to secure your booking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-brand-white font-medium">Office Visit Required</p>
                    <p className="text-brand-silver text-sm">Sign agreement and pay balance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-brand-white font-medium">Valid ID Required</p>
                    <p className="text-brand-silver text-sm">National ID or Passport</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-brand-white font-medium">Fuel Level at Return</p>
                    <p className="text-brand-silver text-sm">Same level as at handover</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-brand-white font-medium">Damage Reporting</p>
                    <p className="text-brand-silver text-sm">Report any issues immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-brand-white font-medium">Late Returns</p>
                    <p className="text-brand-silver text-sm">Additional charges apply</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-brand-muted text-sm mt-6">
              Full terms and conditions available at our office.{' '}
              <Link href="/terms" className="text-brand-gold hover:underline" target="_blank">
                View summary
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message={`Hi, I'd like to enquire about hiring the ${vehicle.name}.`} />
    </main>
  )
}
