import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { VehicleCard } from '@/components/vehicles'
import { formatDualPrice } from '@/lib/utils'
import { ArrowRight, Calendar, Fuel, Gauge, Users, Cog, Palette, Check, Phone, MessageCircle, Shield, Clock, Crown, List, Building, BadgeCheck } from 'lucide-react'

// ============================================================================
// GALLERY COMPONENT
// ============================================================================

function VehicleGallery({ photos }: { photos: string[] }) {
  if (photos.length === 0) {
    return (
      <div className="aspect-video bg-brand-surface-2 rounded-lg flex items-center justify-center">
        <p className="text-brand-muted">No photos available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-brand-surface-2">
        <Image
          src={photos[0]}
          alt="Vehicle photo"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-gold transition-all"
            >
              <Image
                src={photo}
                alt={`Vehicle photo ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SPEC TABLE
// ============================================================================

function SpecTable({ specs }: { specs: Record<string, unknown> }) {
  const specItems = [
    { label: 'Engine', value: specs.engine, icon: Cog },
    { label: 'Transmission', value: specs.transmission },
    { label: 'Drive', value: specs.drive },
    { label: 'Fuel', value: specs.fuel, icon: Fuel },
    { label: 'Seats', value: specs.seats, icon: Users },
    { label: 'Colour', value: specs.colour, icon: Palette },
    { label: 'Mileage', value: specs.mileage ? `${Number(specs.mileage).toLocaleString()} km` : null, icon: Gauge },
  ].filter(item => item.value)

  if (specItems.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {specItems.map(item => (
        <div key={item.label} className="bg-brand-surface p-4 rounded-lg">
          <p className="text-brand-muted text-xs uppercase tracking-wider mb-1">{item.label}</p>
          <p className="text-brand-white font-medium">{String(item.value)}</p>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// INQUIRY FORM
// ============================================================================

function InquiryForm({ vehicleId }: { vehicleId: string }) {
  return (
    <form action="/api/inquiries" method="POST" className="space-y-5">
      <input type="hidden" name="vehicle_id" value={vehicleId} />
      <input type="hidden" name="type" value="PURCHASE" />
      
      {/* Honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-brand-silver text-xs uppercase tracking-wider mb-2 block">Full Name *</label>
          <input type="text" name="name" required className="min-h-[48px] touch-manipulation" />
        </div>
        <div>
          <label className="text-brand-silver text-xs uppercase tracking-wider mb-2 block">Phone Number *</label>
          <input type="tel" name="phone" required className="min-h-[48px] touch-manipulation" />
        </div>
      </div>

      <div>
        <label className="text-brand-silver text-xs uppercase tracking-wider mb-2 block">Email Address *</label>
        <input type="email" name="email" required className="min-h-[48px] touch-manipulation" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-brand-silver text-xs uppercase tracking-wider mb-2 block">Budget Range</label>
          <select name="budget" className="min-h-[48px] touch-manipulation">
            <option value="">Select budget</option>
            <option value="100-200">100M - 200M UGX</option>
            <option value="200-400">200M - 400M UGX</option>
            <option value="400-600">400M - 600M UGX</option>
            <option value="600+">600M+ UGX</option>
          </select>
        </div>
        <div>
          <label className="text-brand-silver text-xs uppercase tracking-wider mb-2 block">Purchase Timeline</label>
          <select name="timeline" className="min-h-[48px] touch-manipulation">
            <option value="">Select timeline</option>
            <option value="asap">As soon as possible</option>
            <option value="1month">Within 1 month</option>
            <option value="3months">Within 3 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-brand-silver text-xs uppercase tracking-wider mb-2 block">Message (Optional)</label>
        <textarea name="message" rows={3} placeholder="Any specific questions or requirements..." className="min-h-[100px] touch-manipulation" />
      </div>

      <button type="submit" className="btn w-full min-h-[48px] touch-manipulation">
        Submit Inquiry
      </button>
    </form>
  )
}

// ============================================================================
// VEHICLE DETAIL PAGE
// ============================================================================

interface VehicleDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getVehicle(slug: string) {
  const vehicle = await db.vehicle.findUnique({
    where: { slug },
    include: {
      inquiries: {
        take: 1,
        orderBy: { created_at: 'desc' }
      }
    }
  })
  return vehicle
}

async function getRelatedVehicles(vehicle: { id: string; make: string; sale_price_ugx: number | null }) {
  const related = await db.vehicle.findMany({
    where: {
      published: true,
      id: { not: vehicle.id },
      AND: [
        {
          OR: [
            { make: vehicle.make },
            vehicle.sale_price_ugx ? {
              sale_price_ugx: {
                gte: vehicle.sale_price_ugx * 0.8,
                lte: vehicle.sale_price_ugx * 1.2
              }
            } : {}
          ],
        },
        { OR: [{ type: 'SALE' }, { type: 'BOTH' }] },
      ],
    },
    take: 3
  })
  return related
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle || !vehicle.published) {
    notFound()
  }

  const photos = vehicle.photos ? JSON.parse(vehicle.photos) : []
  const specs = vehicle.specs ? JSON.parse(vehicle.specs) : {}
  const relatedVehicles = await getRelatedVehicles(vehicle)

  const isAvailable = vehicle.status === 'AVAILABLE'
  const isSold = vehicle.status === 'SOLD'

  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-brand-silver overflow-x-auto">
            <Link href="/" className="hover:text-brand-gold whitespace-nowrap">Home</Link>
            <span className="text-brand-muted">/</span>
            <Link href="/cars" className="hover:text-brand-gold whitespace-nowrap">Cars</Link>
            <span className="text-brand-muted">/</span>
            <span className="text-brand-white whitespace-nowrap">{vehicle.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="section bg-brand-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Gallery */}
            <div>
              <VehicleGallery photos={photos} />
            </div>

            {/* Right: Details */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="eyebrow">{vehicle.make}</span>
                  <span className={`status-badge ${isAvailable ? 'status-available' : 'status-sold'}`}>
                    {vehicle.status}
                  </span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-white">
                  {vehicle.name}
                </h1>
                {vehicle.sale_price_ugx && (
                  <p className="text-2xl text-brand-gold font-bold mt-2">
                    {formatDualPrice(vehicle.sale_price_ugx)}
                  </p>
                )}
              </div>

              {/* Specs */}
              <SpecTable specs={specs} />

              {/* Description */}
              {vehicle.description && (
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-white mb-2">Description</h3>
                  <p className="text-brand-silver whitespace-pre-line">
                    {vehicle.description}
                  </p>
                </div>
              )}

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

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                {isAvailable ? (
                  <>
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '256785642717'}?text=${encodeURIComponent(`Hi, I'm interested in the ${vehicle.name} on your website.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Us
                    </a>
                    <Link href="/concierge" className="text-brand-gold hover:opacity-80 transition-opacity flex items-center gap-2 text-sm font-medium">
                      Looking for a private buying experience? <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <p className="text-brand-silver">This vehicle has been sold.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* What Happens Next */}
            <div className="p-6 bg-brand-black rounded-lg border-l-4 border-brand-gold">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-gold/10 rounded-lg">
                  <List className="w-5 h-5 text-brand-gold" />
                </div>
                <h4 className="font-display text-lg font-bold text-brand-white">What Happens Next</h4>
              </div>
              <ol className="space-y-2 text-sm text-brand-silver">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold text-xs flex items-center justify-center flex-shrink-0">1</span>
                  <span>Submit your enquiry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold text-xs flex items-center justify-center flex-shrink-0">2</span>
                  <span>Senior advisor contacts you within 4 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold text-xs flex items-center justify-center flex-shrink-0">3</span>
                  <span>Private viewing arranged at your convenience</span>
                </li>
              </ol>
            </div>
            
            {/* No Obligation */}
            <div className="p-6 bg-brand-black rounded-lg border-l-4 border-brand-gold">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-gold/10 rounded-lg">
                  <Shield className="w-5 h-5 text-brand-gold" />
                </div>
                <h4 className="font-display text-lg font-bold text-brand-white">No Obligation</h4>
              </div>
              <p className="text-sm text-brand-silver leading-relaxed">
                Confidential. No pressure. Just information. Take your time to decide.
              </p>
            </div>
            
            {/* Verified Business */}
            <div className="p-6 bg-brand-black rounded-lg border-l-4 border-brand-gold">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-gold/10 rounded-lg">
                  <Building className="w-5 h-5 text-brand-gold" />
                </div>
                <h4 className="font-display text-lg font-bold text-brand-white">Verified Business</h4>
              </div>
              <p className="text-sm text-brand-silver leading-relaxed">
                Founded 2018. Plot 18, Lugogo Bypass, Kampala. Trusted by 200+ clients.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Concierge Upsell */}
      <section className="py-8 bg-brand-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="p-4 bg-brand-gold/20 rounded-xl">
                <Crown className="w-8 h-8 text-brand-gold" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-brand-white mb-2">
                  Looking for a private buying experience?
                </h3>
                <p className="text-brand-silver mb-4">
                  Our concierge service offers personalized vehicle sourcing, private viewings, 
                  and dedicated support throughout your purchase journey.
                </p>
                <Link 
                  href="/concierge" 
                  className="inline-flex items-center gap-2 text-brand-gold font-medium hover:underline"
                >
                  Request Private Concierge <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      {isAvailable && (
        <section className="section bg-brand-surface">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-xl mx-auto">
              <p className="eyebrow mb-2 text-center">INTERESTED?</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-white mb-2 text-center">
                Enquire About This Vehicle
              </h2>
              <p className="text-brand-silver text-center mb-8">
                Fill out the form below and a senior advisor will contact you within 4 hours.
              </p>
              <div className="card p-6 md:p-8">
                <InquiryForm vehicleId={vehicle.id} />
                <p className="text-xs text-brand-muted mt-4 text-center">
                  Your information is secure and confidential.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Vehicles */}
      {relatedVehicles.length > 0 && (
        <section className="section bg-brand-surface">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-brand-white mb-6">
              Similar Vehicles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedVehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppButton message={`Hi, I'm interested in the ${vehicle.name} on your website.`} />
    </main>
  )
}
