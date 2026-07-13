import { db } from '@/lib/db'
import { safeSettings } from '@/lib/safe-db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { CurrencyToggle } from '@/components/vehicles'
import { TextReveal } from '@/components/motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Crown, Shield, Award, Star, Car } from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// PRESTIGE PAGE - Premium & Exotic Vehicles
// ============================================================================

export const metadata = {
  title: 'Prestige Collection | Mighty Rides',
  description: 'Our curated collection of the finest exotic and prestige vehicles in East Africa. Lamborghini, Ferrari, Rolls-Royce, and more.',
}

async function getPrestigeVehicles() {
  const vehicles = await db.vehicle.findMany({
    where: {
      published: true,
      OR: [{ type: 'SALE' }, { type: 'BOTH' }],
    },
    orderBy: [
      { featured: 'desc' },
      { created_at: 'desc' }
    ],
    take: 12
  })
  return vehicles
}

async function getSettings() {
  const settings = await safeSettings()
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return map
}

export default async function PrestigePage() {
  const [vehicles, settings] = await Promise.all([
    getPrestigeVehicles(),
    getSettings()
  ])
  const whatsappNumber = settings.whatsapp_number || '256700000000'

  return (
    <main className="min-h-screen bg-[#141312]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,149,42,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
          <div className="">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 mb-6 bg-[#C8952A]/10 border border-[#C8952A]/30 px-4 py-2 rounded-full">
              <Crown className="w-4 h-4 text-[#C8952A]" />
              <span className="text-xs text-[#C8952A] uppercase tracking-widest font-semibold">
                By Appointment Only
              </span>
            </div>

            {/* Main Heading */}
            <TextReveal
              as="h1"
              lines={['The Prestige', <span key="c" className="text-[#C8952A]">Collection</span>]}
              className="text-[44px] md:text-[72px] font-bold leading-[52px] md:leading-[84px] text-white mb-6"
            />

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-8 leading-relaxed">
              A curated ensemble of the world&apos;s most exclusive automobiles. 
              Available by private appointment for discerning collectors and enthusiasts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/concierge"
                className="bg-[#C8952A] text-black px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-[#D4A644] transition-colors uppercase tracking-wide text-sm md:text-base"
              >
                Request Private Viewing <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'm interested in the Prestige Collection.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#C8952A] text-[#C8952A] px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-[#C8952A]/10 transition-colors uppercase tracking-wide text-sm md:text-base"
              >
                WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 section-neutral">
        <div className="">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
            {[
              { icon: Shield, title: 'Verified Provenance', subtitle: 'Complete history' },
              { icon: Award, title: 'Certified Quality', subtitle: '175-point inspection' },
              { icon: Crown, title: 'Exclusive Access', subtitle: 'By appointment' },
              { icon: Star, title: 'White Glove Service', subtitle: 'Concierge delivery' },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <div className="w-16 h-16 bg-[#C8952A]/10 border border-[#C8952A]/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C8952A]/20 transition-colors">
                  <item.icon className="w-7 h-7 text-[#C8952A]" />
                </div>
                <h3 className="text-[#1A1815] font-semibold text-base mb-1">{item.title}</h3>
                <p className="text-sm text-[#5C574F]">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 section-light">
        <div className="">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 reveal">
            <div>
              <span className="text-sm text-[#8A6410] uppercase tracking-widest mb-2 block font-semibold">
                Exclusive Inventory
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1A1815]">
                Featured Vehicles
              </h2>
            </div>
            <CurrencyToggle />
          </div>

          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
              {vehicles.map((vehicle) => {
                const photos = vehicle.photos ? JSON.parse(vehicle.photos) : []
                return (
                  <Link
                    key={vehicle.id}
                    href={`/cars/${vehicle.slug}`}
                    className="card-light group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEDE7]">
                      {photos[0] ? (
                        <Image
                          src={photos[0]}
                          alt={vehicle.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-12 h-12 text-[#C9C4BA]" />
                        </div>
                      )}
                      {vehicle.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1 bg-[#C8952A] text-black px-3 py-1 rounded text-xs font-bold uppercase">
                            <Star className="w-3 h-3" /> Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1A1815] group-hover:text-[#8A6410] transition-colors">
                        {vehicle.name}
                      </h3>
                      <p className="text-[#5C574F] text-sm mt-1">
                        {vehicle.year} • {vehicle.make} {vehicle.model}
                      </p>
                      {vehicle.sale_price_ugx && (
                        <p className="text-[#8A6410] font-semibold text-lg mt-3">
                          {vehicle.sale_price_ugx.toLocaleString()} UGX
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 reveal">
              <Crown className="w-16 h-16 text-[#C8952A]/50 mx-auto mb-6" />
              <p className="text-[#5C574F] text-lg mb-4">
                Our prestige collection is currently being curated.
              </p>
              <p className="text-[#8A857C] mb-8">
                Contact us for private acquisitions and bespoke sourcing.
              </p>
              <Link href="/concierge" className="border-2 border-[#8A6410]/40 text-[#8A6410] px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-[#C8952A] hover:border-[#C8952A] hover:text-black transition-colors">
                Request Private Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 section-dark">
        <div className="">
          <div className="text-center mb-16 reveal">
            <span className="text-sm text-[#C8952A] uppercase tracking-widest mb-2 block font-semibold">
              The Process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Private Acquisition
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Inquire', description: 'Submit your requirements through our secure form or WhatsApp' },
              { step: '02', title: 'Consult', description: 'A dedicated advisor contacts you within 4 hours' },
              { step: '03', title: 'View', description: 'Private viewing arranged at your convenience' },
              { step: '04', title: 'Acquire', description: 'Seamless paperwork and delivery coordination' },
            ].map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-white/10" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#0A0A0A] border-2 border-[#C8952A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#C8952A] text-lg font-bold">{item.step}</span>
                  </div>
                  <h4 className="text-white font-semibold text-base mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 section-dark border-t border-white/5">
        <div className=" text-center reveal">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Looking for Something Specific?
          </h2>
          <p className="text-[#B7B2AA] max-w-xl mx-auto mb-8 text-lg">
            Our global network can source virtually any vehicle. 
            From vintage classics to the latest hypercars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sourcing" className="bg-[#C8952A] text-black px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-[#D4A644] transition-colors uppercase tracking-wide justify-center">
              Request Vehicle Sourcing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="border-2 border-[#C8952A] text-[#C8952A] px-8 py-4 rounded-xl font-semibold hover:bg-[#C8952A]/10 transition-colors uppercase tracking-wide">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'm interested in the Prestige Collection." />
    </main>
  )
}
