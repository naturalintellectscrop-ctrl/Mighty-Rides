import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { db } from '@/lib/db'
import { formatUGX, formatUSD } from '@/lib/utils'
import { LocalBusinessJsonLd } from '@/components/analytics/JsonLd'
import {
  MapPin, Calendar, Car, ArrowRight, Star,
  Search, CreditCard, BadgeCheck, Key, Globe, Wrench, Building, Settings, Check,
} from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

const PAD = 'px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28'

// Photography (placeholders — swap for real Mighty Rides photography).
const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdTMemLRrVabyjdaNkQ3eKs7D2lhbijccitbB8uaR_GGIxo4-ES3iZD7yzxoBzZzV59N9za37N_kt6xdwTzXsayy-Dvie16JEbeKplzGs1IoaQdQqgiL-OMXFkCoBBAr5irWZlMNmD0uHEtZ0NjOWzyzXGfFiU0C4snXoGBwMHqIihLRB4lcWqvKd7LXjuVVsDpCozDfkqCvL6t5tK9uzVT_NLmo_Lmv3LC_YN_A6Ey0zv93fyd6D_-0UFQNy6x6a7lc-oE9Z3WXU'
const CTA_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDAik8snEDPDURyMU2fIsYO5mCJ7Bm0HrmXtayEjjcwp-bmZtP9bUQ0FL5Tli094AGPxpj686I_vEr7JxmPg8wWgfsH55lYhuG3Zf316EJsTDpQ3D28e2eE__bmtYDP1hKjFZPOARqgYRmXu6GaMt--PujbpdSQIM9JDETU_bm5ZNZNUQ0fFlNXMvZ79IoPsOtt5RlSi6ylDsOqWWwfTlOaNeOuFtXsFEmb9fRg4ApexTDgnZvsXpqGYVDP60oVXbuyNE-zxXl-A8'
const BAND_IMG = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1900&q=80'
const CRAFT_IMG = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80'

// ============================================================================
// HERO — cinematic full-bleed
// ============================================================================

function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden py-32 md:py-28">
      <div className="absolute inset-0 z-0">
        <Image src={HERO_IMG} alt="A luxury vehicle in a Mighty Rides showroom" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className={`relative z-10 w-full ${PAD} pt-20`}>
        <p className="text-xs md:text-sm text-[#C8952A] uppercase tracking-[0.3em] mb-7 font-semibold">Kampala · Est. 2018</p>
        <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-8 leading-[0.98] tracking-tight">
          Excellence,<br />in motion.
        </h1>
        <p className="text-lg md:text-xl text-gray-300/90 mb-11 max-w-xl leading-relaxed">
          East Africa&apos;s most considered fleet — curated for those who value presence, discretion, and the quiet assurance of an exceptional drive.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/hire" className="bg-[#C8952A] text-black px-11 py-4 md:py-5 rounded-xl font-semibold text-center hover:bg-[#D4A644] transition-colors uppercase tracking-wide text-sm">Hire a Vehicle</Link>
          <Link href="/cars" className="border border-white/30 text-white px-11 py-4 md:py-5 rounded-xl font-semibold text-center hover:border-[#C8952A] hover:text-[#C8952A] transition-colors uppercase tracking-wide text-sm">Explore Inventory</Link>
        </div>

        {/* Booking widget — desktop, in flow */}
        <div className="hidden md:block mt-14 lg:mt-16 max-w-5xl">
          <div className="bg-[#1A1A1A]/85 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] text-[#C8952A] uppercase tracking-[0.2em] font-semibold">Pick-up Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Kampala / Entebbe Airport" className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#C8952A] outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] text-[#C8952A] uppercase tracking-[0.2em] font-semibold">Dates</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Add your dates" className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#C8952A] outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] text-[#C8952A] uppercase tracking-[0.2em] font-semibold">Occasion</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select aria-label="Occasion" className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#C8952A] outline-none appearance-none transition-colors">
                    <option>Wedding</option>
                    <option>Airport Transfer</option>
                    <option>Executive Travel</option>
                    <option>Corporate</option>
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <Link href="/hire" className="w-full bg-[#C8952A] text-black py-4 rounded-xl font-semibold text-center hover:bg-[#D4A644] transition-colors uppercase tracking-wide">Find a Vehicle</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden mt-8">
          <Link href="/hire" className="block w-full bg-[#C8952A] text-black py-5 rounded-xl font-semibold text-center uppercase tracking-wide">Find Your Ride</Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// EDITORIAL STATEMENT — typography-first, with an inline assurance row
// ============================================================================

const assurances = [
  { k: 'Concierge', v: 'On call, around the clock' },
  { k: 'Verified', v: 'Every vehicle inspected' },
  { k: 'Instant', v: 'Confirmed bookings' },
  { k: 'White-glove', v: 'Delivery & handover' },
]

function EditorialIntro() {
  return (
    <section className={`w-full bg-[#0A0A0A] ${PAD} py-24 md:py-36 border-t border-white/5`}>
      <div className="max-w-4xl reveal">
        <p className="text-xs text-[#C8952A] uppercase tracking-[0.3em] mb-8 font-semibold">More than transportation</p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.04] tracking-tight">
          A car is a statement.<br />We help you make it well.
        </h2>
        <p className="text-lg md:text-2xl text-gray-400 max-w-2xl leading-relaxed mt-8">
          Every vehicle we offer is chosen for confidence and presence — and delivered with the kind of care that turns a rental into an occasion. Quiet, exacting, entirely at your service.
        </p>
      </div>

      <div className="mt-16 md:mt-20 border-t border-white/10 pt-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 reveal">
        {assurances.map((a) => (
          <div key={a.k}>
            <p className="text-[#C8952A] text-xs uppercase tracking-[0.2em] mb-2 font-semibold">{a.k}</p>
            <p className="text-white text-sm md:text-base">{a.v}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================================
// THE COLLECTION — real inventory, image-led (lead vehicle + supporting row)
// ============================================================================

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
  AVAILABLE: 'Available', RESERVED: 'Reserved', RENTED_OUT: 'Rented Out', IN_SERVICE: 'In Service', SOLD: 'Sold',
}

async function getFeaturedVehicles(rate: number): Promise<FleetCard[]> {
  let vehicles
  try {
    vehicles = await db.vehicle.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { created_at: 'desc' }],
      take: 4,
      select: {
        name: true, slug: true, type: true, status: true, year: true,
        sale_price_ugx: true, daily_rate_ugx: true, photos: true, specs: true,
      },
    })
  } catch (error) {
    console.error('[HOME] Failed to load featured vehicles:', error)
    return []
  }

  return vehicles.map((v) => {
    let image: string | null = null
    try {
      const photos = v.photos ? JSON.parse(v.photos) : []
      if (Array.isArray(photos) && typeof photos[0] === 'string') image = photos[0]
    } catch { /* malformed photos JSON */ }

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
      image, status: STATUS_LABELS[v.status] || v.status, priceText, usdText, chips,
    }
  })
}

function Collection({ vehicles }: { vehicles: FleetCard[] }) {
  const lead = vehicles[0]
  const rest = vehicles.slice(1)

  return (
    <section className={`w-full section-light ${PAD} py-20 md:py-32`}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20 reveal">
        <div>
          <p className="text-xs text-[#8A6410] uppercase tracking-[0.3em] mb-4 font-semibold">The Collection</p>
          <h2 className="text-4xl md:text-6xl font-bold text-[#1A1815] tracking-tight">Currently in the stable</h2>
        </div>
        <Link href="/cars" className="hidden md:inline-flex items-center gap-3 text-[#8A6410] font-semibold group whitespace-nowrap">
          View all models <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {!lead ? (
        <div className="max-w-2xl reveal">
          <p className="text-2xl md:text-3xl text-[#1A1815] font-display leading-snug">The collection is being refreshed.</p>
          <p className="text-[#5C574F] mt-4 text-lg">New arrivals are added regularly. Tell us what you have in mind and we&apos;ll bring the right vehicle to you.{' '}
            <Link href="/contact" className="text-[#8A6410] font-semibold hover:underline">Speak to our concierge →</Link>
          </p>
        </div>
      ) : (
        <>
          {/* Lead vehicle — split showcase */}
          <Link href={lead.href} className="group grid lg:grid-cols-2 gap-8 lg:gap-16 items-center reveal">
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#EFEDE7] shadow-[0_18px_44px_rgba(26,24,21,0.13)]">
              {lead.image
                ? <Image src={lead.image} alt={lead.name} fill className="object-cover transition-transform duration-[900ms] group-hover:scale-105" sizes="(max-width:1024px) 100vw, 50vw" />
                : <div className="w-full h-full flex items-center justify-center"><Car className="w-12 h-12 text-[#C9C4BA]" /></div>}
              <span className="absolute top-5 left-5 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-bold text-[#C8952A] uppercase tracking-wider">{lead.status}</span>
            </div>
            <div>
              <p className="text-xs text-[#8A6410] uppercase tracking-[0.3em] mb-4 font-semibold">Featured</p>
              <h3 className="text-3xl md:text-5xl font-bold text-[#1A1815] leading-tight mb-5">{lead.name}</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {lead.chips.map((c) => <span key={c} className="text-[11px] tracking-wide text-[#5C574F] border border-[#DAD6CD] rounded-full px-3 py-1">{c}</span>)}
              </div>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-2xl md:text-3xl text-[#8A6410] font-semibold">{lead.priceText}</span>
                {lead.usdText && <span className="text-[#8A857C] text-sm">{lead.usdText}</span>}
              </div>
              <span className="inline-flex items-center gap-3 text-[#1A1815] font-semibold uppercase tracking-wide text-sm border-b border-[#8A6410] pb-1 group-hover:gap-4 transition-all">
                Explore this vehicle <ArrowRight className="w-4 h-4 text-[#8A6410]" />
              </span>
            </div>
          </Link>

          {/* Supporting row — image-led, minimal chrome */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-16 md:mt-24">
              {rest.map((v) => (
                <Link key={v.href} href={v.href} className="group reveal">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#EFEDE7] shadow-[0_10px_30px_rgba(26,24,21,0.09)]">
                    {v.image
                      ? <Image src={v.image} alt={v.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:640px) 100vw, 33vw" />
                      : <div className="w-full h-full flex items-center justify-center"><Car className="w-9 h-9 text-[#C9C4BA]" /></div>}
                    <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#C8952A] uppercase tracking-wider">{v.status}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 mt-5">
                    <h3 className="text-lg md:text-xl font-bold text-[#1A1815] group-hover:text-[#8A6410] transition-colors">{v.name}</h3>
                    <span className="text-[#8A6410] text-sm font-semibold whitespace-nowrap shrink-0">{v.priceText}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-14 md:hidden">
        <Link href="/cars" className="inline-flex items-center gap-3 text-[#8A6410] font-semibold">View all models <ArrowRight className="w-5 h-5" /></Link>
      </div>
    </section>
  )
}

// ============================================================================
// LIFESTYLE BAND — full-bleed, edge to edge
// ============================================================================

function LifestyleBand() {
  return (
    <section className="relative w-full h-[62vh] md:h-[82vh] overflow-hidden">
      <Image src={BAND_IMG} alt="A luxury vehicle on the open road at dusk" fill className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-[#0A0A0A]/40" />
      <div className={`relative z-10 h-full flex items-end ${PAD} pb-16 md:pb-24`}>
        <div className="reveal">
          <p className="text-xs text-[#C8952A] uppercase tracking-[0.3em] mb-5 font-semibold">The Experience</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-3xl leading-[1.02] tracking-tight">
            Arrive with intent.
          </h2>
          <p className="text-lg md:text-xl text-gray-200/90 max-w-xl mt-6 leading-relaxed">
            Delivered to your door, keys in hand, in showroom condition. All you bring is the occasion.
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SERVICES — editorial list (not cards)
// ============================================================================

const services = [
  { icon: Key, title: 'Luxury Car Hire', line: 'Weddings, arrivals and executive travel.', href: '/hire' },
  { icon: Car, title: 'Luxury Car Sales', line: 'Premium vehicles, verified and documented.', href: '/cars' },
  { icon: Globe, title: 'Vehicle Sourcing', line: 'We find any vehicle, locally or abroad.', href: '/sourcing' },
  { icon: Building, title: 'Corporate Mobility', line: 'Fleet solutions for organisations.', href: '/corporate' },
  { icon: Wrench, title: 'Parts & Customisation', line: 'Genuine parts, body kits, bespoke work.', href: '/services' },
  { icon: Settings, title: 'Maintenance & Support', line: 'Servicing and dedicated after-sale care.', href: '/services' },
]

function Services() {
  return (
    <section className={`w-full section-neutral ${PAD} py-20 md:py-32`} aria-labelledby="services-heading">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-24">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs text-[#8A6410] uppercase tracking-[0.3em] mb-6 font-semibold">What we do</p>
          <h2 id="services-heading" className="text-4xl md:text-6xl font-bold text-[#1A1815] leading-[1.05] tracking-tight">Six disciplines,<br />one standard.</h2>
          <p className="text-lg text-[#5C574F] mt-7 max-w-md leading-relaxed">
            From a single wedding entrance to a managed corporate fleet — held to the same exacting measure, whichever door you enter through.
          </p>
        </div>

        <div className="reveal">
          {services.map((s) => (
            <Link key={s.title} href={s.href} aria-label={s.title} className="group flex items-center gap-6 py-7 border-b border-[#DDD8CE] first:border-t">
              <s.icon className="w-6 h-6 text-[#8A6410] shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xl md:text-2xl font-bold text-[#1A1815] group-hover:text-[#8A6410] transition-colors">{s.title}</h3>
                <p className="text-[#5C574F] text-sm md:text-base mt-1">{s.line}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[#A9A399] group-hover:text-[#8A6410] group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// THE SEAMLESS JOURNEY — a real four-step sequence (light interlude)
// ============================================================================

const steps = [
  { icon: Search, title: 'Select', description: 'Browse the collection and choose the vehicle for your moment.' },
  { icon: CreditCard, title: 'Reserve', description: 'Confirm your dates and secure the booking online.' },
  { icon: BadgeCheck, title: 'Verify', description: 'A quick digital ID check for an effortless handover.' },
  { icon: Key, title: 'Drive', description: 'Collected or delivered — the road, and the day, are yours.' },
]

function Journey() {
  return (
    <section className={`w-full bg-[#F3F0E9] ${PAD} py-24 md:py-36`}>
      <div className="max-w-3xl reveal">
        <p className="text-xs text-[#A9781E] uppercase tracking-[0.3em] mb-6 font-semibold">How it works</p>
        <h2 className="text-4xl md:text-6xl font-bold text-[#0A0A0A] leading-[1.05] tracking-tight mb-16 md:mb-24">The seamless journey</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-10">
        {steps.map((step, i) => (
          <div key={step.title} className="reveal">
            <div className="flex items-baseline gap-4 mb-5">
              <span className="text-[#C8952A] font-display text-2xl font-bold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <div className="h-px flex-1 bg-[#0A0A0A]/10" />
            </div>
            <step.icon className="w-8 h-8 text-[#A9781E] mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-[#0A0A0A] mb-2">{step.title}</h3>
            <p className="text-[#4A453C] text-sm md:text-base leading-relaxed pr-4">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================================
// CRAFTSMANSHIP — split image + copy, trust-building
// ============================================================================

const confidence = [
  'Meticulously inspected before every handover.',
  'Transparent pricing, in both UGX and USD.',
  'One point of contact, from enquiry to return.',
]

function Craftsmanship() {
  return (
    <section className={`w-full bg-[#0A0A0A] ${PAD} py-20 md:py-32`}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/5] md:aspect-[4/4.4] overflow-hidden rounded-2xl bg-[#141210] reveal">
          <Image src={CRAFT_IMG} alt="Close attention to a luxury vehicle's detail" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
        </div>
        <div className="reveal">
          <p className="text-xs text-[#C8952A] uppercase tracking-[0.3em] mb-6 font-semibold">Why Mighty Rides</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">A standard,<br />not a service.</h2>
          <p className="text-lg text-gray-400 mt-7 max-w-lg leading-relaxed">
            Since 2018, Kampala&apos;s executives, families and organisations have trusted us with their most important journeys. That trust is earned the same way each time — in the details.
          </p>
          <ul className="mt-9 space-y-4">
            {confidence.map((c) => (
              <li key={c} className="flex items-start gap-4">
                <span className="mt-1 w-5 h-5 rounded-full bg-[#C8952A]/15 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-[#C8952A]" /></span>
                <span className="text-gray-200 text-base md:text-lg">{c}</span>
              </li>
            ))}
          </ul>
          <Link href="/about" className="inline-flex items-center gap-3 mt-10 text-[#C8952A] font-semibold uppercase tracking-wide text-sm border-b border-[#C8952A] pb-1 hover:gap-4 transition-all">
            Our story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// TESTIMONIAL — single editorial quote
// ============================================================================

function Testimonial() {
  return (
    <section className={`w-full section-neutral ${PAD} py-20 md:py-32`}>
      <div className="max-w-4xl mx-auto text-center reveal">
        <div className="flex justify-center gap-2 mb-10" aria-label="Five star rating">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-[#C8952A] fill-[#C8952A]" />)}
        </div>
        <blockquote className="text-2xl md:text-4xl text-[#1A1815] leading-snug font-display">
          &ldquo;Unparalleled in the region. The vehicle was in showroom condition and the delivery was handled with such professionalism that it redefined what I expect from luxury rental.&rdquo;
        </blockquote>
        <div className="mt-10">
          <div className="text-[#8A6410] font-semibold uppercase tracking-[0.2em] text-sm">David Mukasa</div>
          <div className="text-[#6B6459] text-sm mt-2">Managing Director, Nile Capital Partners — Kampala</div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// FINAL CTA — full-bleed
// ============================================================================

function FinalCTA() {
  return (
    <section className="relative w-full py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={CTA_IMG} alt="A luxury vehicle interior at night" fill className="object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent" />
      </div>
      <div className={`relative z-10 w-full ${PAD} reveal`}>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-7 leading-[1.02] tracking-tight max-w-3xl">
          Your next journey<br />deserves this.
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-11 max-w-xl leading-relaxed">
          Whether a milestone, a meeting, or a moment that matters — begin with the vehicle that carries it well.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/hire" className="bg-[#C8952A] text-black px-11 py-4 md:py-5 rounded-xl font-semibold text-center hover:bg-[#D4A644] transition-colors uppercase tracking-wide text-sm">Reserve a Vehicle</Link>
          <Link href="/contact" className="border border-white/30 text-white px-11 py-4 md:py-5 rounded-xl font-semibold text-center hover:border-[#C8952A] hover:text-[#C8952A] transition-colors uppercase tracking-wide text-sm">Speak to Concierge</Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// PAGE
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
      <LocalBusinessJsonLd />
      <Navbar />
      <Hero />
      <EditorialIntro />
      <Collection vehicles={vehicles} />
      <LifestyleBand />
      <Services />
      <Journey />
      <Craftsmanship />
      <Testimonial />
      <FinalCTA />
      <Footer />
      <WhatsAppButton message="Hi, I'm interested in your vehicles." />
    </main>
  )
}
