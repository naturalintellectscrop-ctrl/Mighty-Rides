import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { db } from '@/lib/db'
import { formatUGX, formatUSD } from '@/lib/utils'
import {
  MapPin, Calendar, Car, ArrowRight, Star,
  Search, CreditCard, BadgeCheck, Key, Headphones, Shield,
  CalendarCheck, Crown
} from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// HERO SECTION
// ============================================================================

function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden py-32 md:py-28">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdTMemLRrVabyjdaNkQ3eKs7D2lhbijccitbB8uaR_GGIxo4-ES3iZD7yzxoBzZzV59N9za37N_kt6xdwTzXsayy-Dvie16JEbeKplzGs1IoaQdQqgiL-OMXFkCoBBAr5irWZlMNmD0uHEtZ0NjOWzyzXGfFiU0C4snXoGBwMHqIihLRB4lcWqvKd7LXjuVVsDpCozDfkqCvL6t5tK9uzVT_NLmo_Lmv3LC_YN_A6Ey0zv93fyd6D_-0UFQNy6x6a7lc-oE9Z3WXU"
          alt="Luxury car in premium showroom"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 pt-20">
        {/* Eyebrow */}
        <p className="text-sm md:text-base lg:text-lg text-[#C8952A] uppercase tracking-widest mb-6 md:mb-8 font-semibold">
          East Africa&apos;s Premier Fleet
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 md:mb-8 leading-tight">
          Experience Excellence<br />In Motion
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 md:mb-12 max-w-2xl leading-relaxed">
          Curating East Africa&apos;s most prestigious fleet. From executive arrivals to high-performance escapes, we redefine luxury mobility with quiet confidence and meticulous detail.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          <Link
            href="/cars"
            className="bg-[#C8952A] text-black px-10 md:px-12 py-4 md:py-5 rounded-xl font-semibold text-center hover:bg-[#D4A644] transition-colors uppercase tracking-wide text-sm md:text-base"
          >
            Explore Inventory
          </Link>
          <Link
            href="/hire"
            className="border-2 border-[#C8952A] text-[#C8952A] px-10 md:px-12 py-4 md:py-5 rounded-xl font-semibold text-center hover:bg-[#C8952A]/10 transition-colors uppercase tracking-wide text-sm md:text-base"
          >
            Hire a Vehicle
          </Link>
        </div>

        {/* Booking Widget - Desktop (in normal flow, below the CTAs) */}
        <div className="hidden md:block mt-12 lg:mt-16 max-w-5xl">
          <div className="bg-[#1A1A1A]/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-700 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Pick-up Location */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-[#C8952A] uppercase tracking-wider font-semibold">
                Pick-up Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Kampala / Entebbe Airport"
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#C8952A] outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Dates */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-[#C8952A] uppercase tracking-wider font-semibold">
                Dates
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Jan 15 - Jan 20"
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#C8952A] outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Vehicle Type */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-[#C8952A] uppercase tracking-wider font-semibold">
                Vehicle Type
              </label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select aria-label="Vehicle type" className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#C8952A] outline-none appearance-none transition-colors">
                  <option>Prestige Sedans</option>
                  <option>Performance SUVs</option>
                  <option>Classic Heritage</option>
                </select>
              </div>
            </div>
            
            {/* Find Button */}
            <div className="flex items-end">
              <Link href="/hire" className="w-full bg-[#C8952A] text-black py-4 rounded-xl font-semibold text-center hover:bg-[#D4A644] transition-colors uppercase tracking-wide">
                Find Excellence
              </Link>
            </div>
          </div>
        </div>
      </div>

        {/* Mobile Booking CTA (in flow) */}
        <div className="md:hidden mt-8">
          <Link
            href="/hire"
            className="block w-full bg-[#C8952A] text-black py-5 rounded-xl font-semibold text-center uppercase tracking-wide"
          >
            Find Your Ride
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// TRUST BAR SECTION
// ============================================================================

const trustItems = [
  { icon: Headphones, title: '24/7 Support', subtitle: 'Dedicated Concierge' },
  { icon: Shield, title: 'Verified Fleet', subtitle: 'Pristine Condition' },
  { icon: CalendarCheck, title: 'Easy Booking', subtitle: 'Instant Confirmation' },
  { icon: Crown, title: 'Premium Service', subtitle: 'White Glove Care' },
]

function TrustBar() {
  return (
    <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 bg-[#0A0A0A]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 text-center">
        {trustItems.map((item) => (
          <div key={item.title} className="group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1A1A1A] mx-auto rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[#C8952A]/20 transition-colors">
              <item.icon className="text-[#C8952A] w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-white font-semibold text-base md:text-lg mb-1 md:mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm md:text-base">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================================
// FLEET SECTION
// ============================================================================

// Display shape derived from a real DB vehicle (computed server-side).
interface FleetCard {
  name: string
  href: string
  image: string | null
  status: string
  priceText: string
  usdText: string
  chips: string[]
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  RENTED_OUT: 'Rented Out',
  IN_SERVICE: 'In Service',
  SOLD: 'Sold',
}

/**
 * Fetch up to 4 published vehicles (featured first) for the homepage fleet.
 * Real inventory — replaces the static demo cards from the design mockup.
 */
async function getFeaturedVehicles(rate: number): Promise<FleetCard[]> {
  const vehicles = await db.vehicle.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { created_at: 'desc' }],
    take: 4,
    select: {
      name: true, slug: true, type: true, status: true, year: true,
      sale_price_ugx: true, daily_rate_ugx: true, photos: true, specs: true,
    },
  })

  return vehicles.map((v) => {
    let image: string | null = null
    try {
      const photos = v.photos ? JSON.parse(v.photos) : []
      if (Array.isArray(photos) && typeof photos[0] === 'string') image = photos[0]
    } catch { /* malformed photos JSON — fall back to placeholder */ }

    let specs: Record<string, unknown> = {}
    try { specs = v.specs ? JSON.parse(v.specs) : {} } catch { /* ignore */ }

    const isHire = (v.type === 'HIRE' || v.type === 'BOTH') && !!v.daily_rate_ugx
    let priceText = 'On request'
    let usdText = ''
    if (isHire && v.daily_rate_ugx) {
      priceText = `${formatUGX(v.daily_rate_ugx)} /day`
      usdText = `${formatUSD(v.daily_rate_ugx, rate)} /day`
    } else if (v.sale_price_ugx) {
      priceText = formatUGX(v.sale_price_ugx)
      usdText = formatUSD(v.sale_price_ugx, rate)
    }

    const chips = [specs.engine, specs.drive || specs.transmission]
      .filter((s): s is string => typeof s === 'string' && s.length > 0)
      .map((s) => s.toUpperCase())
    if (chips.length === 0) chips.push(String(v.year), v.type)

    return {
      name: v.name,
      href: v.type === 'SALE' ? `/cars/${v.slug}` : `/hire/${v.slug}`,
      image,
      status: STATUS_LABELS[v.status] || v.status,
      priceText,
      usdText,
      chips,
    }
  })
}

function FleetSection({ vehicles }: { vehicles: FleetCard[] }) {
  return (
    <section className="w-full py-20 md:py-28 lg:py-36 bg-[#0A0A0A]">
      <div className="px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div>
            <span className="text-sm md:text-base text-[#C8952A] uppercase tracking-widest mb-3 block font-semibold">
              Curated Selection
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              The Fleet
            </h2>
          </div>
          <Link
            href="/cars"
            className="hidden md:flex items-center gap-3 text-[#C8952A] font-semibold text-lg hover:underline"
          >
            VIEW ALL MODELS
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Vehicle Grid */}
        {vehicles.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            Our fleet is being updated. Please check back shortly or{' '}
            <Link href="/contact" className="text-[#C8952A] hover:underline">contact our concierge</Link>.
          </p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.href}
              className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#C8952A] transition-colors flex flex-col"
            >
              {/* Vehicle Image */}
              <div className="h-64 md:h-72 overflow-hidden relative bg-[#0A0A0A]">
                {vehicle.image ? (
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-10 h-10 text-gray-600" />
                  </div>
                )}
                <span className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#C8952A] uppercase">
                  {vehicle.status}
                </span>
              </div>

              {/* Vehicle Details */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-3 mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {vehicle.name}
                  </h3>
                  <div className="text-right shrink-0">
                    <p className="text-[#C8952A] font-semibold text-sm md:text-base whitespace-nowrap">
                      {vehicle.priceText}
                    </p>
                    {vehicle.usdText && (
                      <p className="text-gray-500 text-xs whitespace-nowrap">{vehicle.usdText}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {vehicle.chips.map((spec) => (
                    <span
                      key={spec}
                      className="bg-[#2A2A2A] px-3 py-1.5 rounded text-xs text-gray-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                <Link
                  href={vehicle.href}
                  className="mt-auto w-full border border-[#C8952A] text-[#C8952A] py-4 rounded-xl hover:bg-[#C8952A] hover:text-black transition-colors font-semibold text-sm text-center block uppercase tracking-wide"
                >
                  Reserve Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/cars"
            className="inline-flex items-center gap-3 text-[#C8952A] font-semibold text-lg"
          >
            VIEW ALL MODELS
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// HOW IT WORKS SECTION
// ============================================================================

const steps = [
  { number: '01', icon: Search, title: 'Select Car', description: 'Browse our curated collection of elite performance vehicles.' },
  { number: '02', icon: CreditCard, title: 'Book & Pay', description: 'Secure your dates with our luxury concierge payment system.' },
  { number: '03', icon: BadgeCheck, title: 'Verify ID', description: 'Quick digital verification for an effortless hand-over experience.' },
  { number: '04', icon: Key, title: 'Drive', description: 'The road is yours. Excellence in every mile of the journey.' },
]

function HowItWorks() {
  return (
    <section className="w-full py-20 md:py-28 lg:py-36 bg-[#F8F6F2]">
      <div className="px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#121414] mb-16 md:mb-20">
          The Seamless Journey
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
          {/* Line decoration */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-[#C8952A]/20 z-0" />

          {steps.map((step) => (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white border border-[#C8952A]/30 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-sm hover:scale-105 transition-transform">
                <step.icon className="text-[#C8952A] w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="font-semibold text-[#121414] text-lg md:text-xl mb-2 md:mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm md:text-base px-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

function Testimonials() {
  return (
    <section className="w-full py-20 md:py-28 lg:py-36 bg-[#0A0A0A]">
      <div className="px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="max-w-4xl mx-auto text-center border-y border-gray-800 py-16 md:py-24">
          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-8 md:mb-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-[#C8952A] fill-[#C8952A]" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-xl md:text-2xl lg:text-3xl text-white leading-snug mb-8 md:mb-10 italic">
            &ldquo;The level of service provided by Mighty Rides is unparalleled in the region. The vehicle was in showroom condition and the delivery was handled with such professionalism that it redefined what I expect from luxury rental.&rdquo;
          </blockquote>

          {/* Attribution */}
          <div>
            <div className="text-[#C8952A] font-semibold uppercase tracking-widest text-sm md:text-base">
              David Mukasa
            </div>
            <div className="text-gray-400 text-sm md:text-base mt-2">
              Managing Director, Nile Capital Partners — Kampala
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

function FinalCTA() {
  return (
    <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDAik8snEDPDURyMU2fIsYO5mCJ7Bm0HrmXtayEjjcwp-bmZtP9bUQ0FL5Tli094AGPxpj686I_vEr7JxmPg8wWgfsH55lYhuG3Zf316EJsTDpQ3D28e2eE__bmtYDP1hKjFZPOARqgYRmXu6GaMt--PujbpdSQIM9JDETU_bm5ZNZNUQ0fFlNXMvZ79IoPsOtt5RlSi6ylDsOqWWwfTlOaNeOuFtXsFEmb9fRg4ApexTDgnZvsXpqGYVDP60oVXbuyNE-zxXl-A8"
          alt="Luxury car dashboard"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8">
          Drive Your Dream Today
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 md:mb-12 max-w-2xl">
          From corporate engagements to personal milestones, select the vehicle that represents your standard of excellence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          <Link
            href="/cars"
            className="bg-[#C8952A] text-black px-10 md:px-12 py-4 md:py-5 rounded-xl font-semibold text-center hover:bg-[#D4A644] transition-colors uppercase tracking-wide text-sm md:text-base"
          >
            Explore Inventory
          </Link>
          <Link
            href="/contact"
            className="border-2 border-[#C8952A] text-[#C8952A] px-10 md:px-12 py-4 md:py-5 rounded-xl font-semibold text-center hover:bg-[#C8952A]/10 transition-colors uppercase tracking-wide text-sm md:text-base"
          >
            Speak to Concierge
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

async function getExchangeRate(): Promise<number> {
  try {
    const setting = await db.setting.findUnique({ where: { key: 'ugx_usd_rate' } })
    return setting ? parseFloat(setting.value) : 3700
  } catch {
    return 3700
  }
}

export default async function HomePage() {
  const rate = await getExchangeRate()
  const vehicles = await getFeaturedVehicles(rate)

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <Hero />
      <TrustBar />
      <FleetSection vehicles={vehicles} />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <WhatsAppButton message="Hi, I'm interested in your vehicles." />
    </main>
  )
}
