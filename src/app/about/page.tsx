import { db } from '@/lib/db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { Youtube, Instagram, Facebook, MapPin, Clock, MessageCircle, ArrowRight } from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// ABOUT PAGE
// ============================================================================

export default async function AboutPage() {
  const settings = await db.setting.findMany()
  const settingsMap: Record<string, string> = {}
  for (const s of settings) settingsMap[s.key] = s.value

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      {/* Hero */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 bg-[#1A1A1A]">
        <div className="">
          <p className="text-sm md:text-base text-[#C8952A] uppercase tracking-widest mb-2 font-semibold">
            ABOUT US
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            East Africa&apos;s
            <span className="block text-[#C8952A]">Premium Car Dealership</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            Since 2018, Mighty Rides has been the trusted name for premium vehicles 
            in Kampala, Uganda. We don&apos;t just sell cars — we deliver experiences.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 bg-[#0A0A0A]">
        <div className="">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Mighty Rides was founded in 2018 with a simple vision: to bring world-class 
                automotive experiences to East Africa. What started as a passion for premium 
                vehicles has grown into the region&apos;s most trusted dealership for exotic, 
                luxury, and performance cars.
              </p>
              <p>
                Today, we offer a complete range of services: vehicle sales, luxury car hire, 
                global vehicle sourcing, corporate mobility solutions, parts and maintenance, 
                and custom body kits. Our Lugogo Bypass showroom houses some of the finest 
                automobiles on the continent.
              </p>
              <p>
                But our true strength lies not in our inventory — it&apos;s in our commitment to 
                trust, transparency, and exceptional service. Every vehicle we sell is thoroughly 
                inspected. Every rental is delivered with care. Every client relationship is valued.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 bg-[#1A1A1A]">
        <div className="">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#C8952A]">2018</p>
              <p className="text-gray-400 text-sm mt-1">Founded</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C8952A]">Kampala</p>
              <p className="text-gray-400 text-sm mt-1">Uganda</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C8952A]">100+</p>
              <p className="text-gray-400 text-sm mt-1">Vehicles Sold</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C8952A]">50+</p>
              <p className="text-gray-400 text-sm mt-1">Brands Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Channel */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 bg-[#0A0A0A]">
        <div className="">
          <div className="text-center mb-8">
            <p className="text-sm md:text-base text-[#C8952A] uppercase tracking-widest mb-2 font-semibold">
              WATCH
            </p>
            <h2 className="text-2xl font-bold text-white">Our Story in Motion</h2>
          </div>
          
          {/* YouTube Video Embed */}
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-brand-surface-2 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
              <a
                href="https://www.youtube.com/@MightyRides"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 text-center p-8 hover:opacity-80 transition-opacity"
              >
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center">
                  <Youtube className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-brand-white mb-2">Watch Our Videos</p>
                  <p className="text-brand-silver">Visit the Mighty Rides YouTube channel</p>
                </div>
              </a>
            </div>
            <div className="text-center">
              <a
                href="https://www.youtube.com/@MightyRides"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C8952A] hover:text-[#D4A644] transition-colors font-semibold"
              >
                <Youtube className="w-5 h-5" />
                <span>Visit our YouTube channel for more videos</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Directory */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 bg-[#1A1A1A]">
        <div className="">
          <div className="text-center mb-8">
            <p className="text-sm md:text-base text-[#C8952A] uppercase tracking-widest mb-2 font-semibold">
              CONNECT
            </p>
            <h2 className="text-2xl font-bold text-white">Find Us Online</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <a
              href="https://www.youtube.com/@MightyRides"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1A1A1A] p-6 text-center rounded-xl border border-gray-800 hover:border-[#C8952A] transition-colors"
            >
              <Youtube className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">YouTube</p>
              <p className="text-xs text-gray-500">@MightyRides</p>
            </a>
            
            <a
              href="https://instagram.com/themightyrides"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1A1A1A] p-6 text-center rounded-xl border border-gray-800 hover:border-[#C8952A] transition-colors"
            >
              <Instagram className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">Instagram</p>
              <p className="text-xs text-gray-500">@themightyrides</p>
            </a>
            
            <a
              href="https://facebook.com/themightyrides"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1A1A1A] p-6 text-center rounded-xl border border-gray-800 hover:border-[#C8952A] transition-colors"
            >
              <Facebook className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">Facebook</p>
              <p className="text-xs text-gray-500">@themightyrides</p>
            </a>
            
            <a
              href={`https://wa.me/${settingsMap.whatsapp_number || '256700000000'}?text=Hi,%20I'd%20like%20to%20get%20in%20touch.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1A1A1A] p-6 text-center rounded-xl border border-gray-800 hover:border-[#C8952A] transition-colors"
            >
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">WhatsApp</p>
              <p className="text-xs text-gray-500">Chat with us</p>
            </a>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 bg-[#0A0A0A]">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-sm md:text-base text-[#C8952A] uppercase tracking-widest mb-2 font-semibold">
                VISIT US
              </p>
              <h2 className="text-2xl font-bold text-white mb-6">Our Showroom</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#C8952A] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-medium">Address</p>
                    <p className="text-gray-400">
                      Mirembe Business Centre<br />
                      Plot 18, Lugogo Bypass<br />
                      Kampala, Uganda
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-[#C8952A] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-medium">Opening Hours</p>
                    <p className="text-gray-400">
                      {settingsMap.office_hours || 'Mon – Sat: 8am – 6pm EAT'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="aspect-video bg-[#1A1A1A] rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7573776545!2d32.5824!3d0.3142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMTgnNTEuMiJOIDMywrAzNCc1Ni42IkU!5e0!3m2!1sen!2sug!4v1234567890"
                title="Mighty Rides Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'd like to get in touch." />
    </main>
  )
}
