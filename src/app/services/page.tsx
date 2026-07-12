import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Wrench, Paintbrush, Cog, Car, Shield, Clock, CheckCircle } from 'lucide-react'
import { safeSettings } from '@/lib/safe-db'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// SERVICES PAGE - Premium Design
// ============================================================================

export const metadata = {
  title: 'Elite Services & Parts | Mighty Rides',
  description: 'Mastering the art of performance. Spare parts, maintenance, body kits, and detailing for luxury and exotic vehicles.',
}

const services = [
  {
    id: 'parts',
    title: 'Spare Parts',
    subtitle: 'Inventory Management',
    description: 'Genuine, high-grade components sourced directly from prestige manufacturers globally.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4awthrBRR3pDiqvOYIjAuX4eCyWaGgVWVa7Dfctz-tre8UxA8UJyGyqcTainWCPYNCm10sIPS-7PFEQHNafC603ZWMDhXXSeHSMOLsyNeSK-e2k_RfJeiVmroGQKU6gd4aH2AOvPju8WGuVHHETK7_s7GRJG6UO6V99fFbPkO2IHHgv6stuJJ95vla1K_ZoozfnogcK3igSxk1Y-zYUKvGiUKLqP13juH09KRybu6U1krSNQoKf4T20fIP6Tqfl54E24l3HhiPc',
    icon: Cog,
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    subtitle: 'Technical Excellence',
    description: 'Precision diagnostics and preventative care by master technicians in state-of-the-art facilities.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc7uSzD6lDDK9odntYm1u83l7of4HClPHoKABPyItYi34Zz4U4TTgknMLoSQreiY1md6dXt7nS-c6Ro-hsJtOUaJMw90MT3uXKIAqbOYrhTSkiftCvejRTXmsAPky_spF88Dd7hb2sffFf0J0PflJ71vJL1fwNKpVQa0M6sX2llEVpL5L6rVXeFg8GkiOnKPuEeuuTHJz7YCReuIYOLEF7NPOS5LxjFIDWuJtHOVYzErRMNn_tPdSJLKrnzJsJbQMClCkJ06E-qZA',
    icon: Wrench,
  },
  {
    id: 'bodykits',
    title: 'Body Kits',
    subtitle: 'Bespoke Styling',
    description: 'Bespoke aerodynamic enhancements and aesthetic modifications for a unique presence.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDRS2DmplczhpN1455l3SvNer6BQuZKoxnrACXNAHfG6R4RXZmby_0cWCS8v-z9KoeiXSNycl-jfdKF8HGaflBEhLo2TmpVeq6eZWG7joTlnNdhPJbJfHmpU6QR5j2A0sLYivibqIQg5dtdbEexeBruNIV8g_R3kOWt4awsmeIkATQPHsUvUKughnDI0NTCxmR1xe5PTzXRV7y7r_GEmHr1wnKw9yQ8uOXcDb8S8rqgosj3lkpWj17adbSgFWX-9m2HbQtv_ZctVg',
    icon: Car,
  },
  {
    id: 'detailing',
    title: 'Detailing',
    subtitle: 'Preservation Lab',
    description: 'Concours-level restoration and ceramic protection to preserve your vehicle\'s legacy.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIsMLVtpfRQ_k425JdxWAVhEs15XK4OhQAyEfMqCfNsQLCi7WhLTDxal8lin9WiDBQXF19iZrzuHJJvwFpQJ2traTwgoNIIVimoyCG0uue1zuVFIEvx3NYCUOtvXPGsR2xEPYZ587aloGuolR51UuFsO7Xuds7QjpqiHYeKaymMctw5gbaT59NN5FESTGxDpNZxQZt1hsU-0L3ht-xXJOKjynNbH2S_O-1BDYRfvWXwvlqH3xY9xW32yQNuaE4UD_IbwwreadQGaQ',
    icon: Paintbrush,
  },
]

const brands = [
  'Land Rover', 'Mercedes-Benz', 'BMW', 'Porsche', 'Toyota',
  'Lamborghini', 'Ferrari', 'Aston Martin', 'Rolls-Royce', 'Bentley'
]

async function getSettings() {
  const settings = await safeSettings()
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return map
}

export default async function ServicesPage() {
  const settings = await getSettings()
  const whatsappNumber = settings.whatsapp_number || '256700000000'
  
  return (
    <main className="min-h-screen bg-[#141312]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy5wSXhxJlm2y1yLobjMIvWbVEXxT_Czk_-4SX67-Av81FqZHKWbYkF4UijHqi9oCsq7gns5kHwLOo38WGng_GO4jP7K6C0v_CD_q3rnSzgk0eFjjq6rUPF9L1P1WOmS-lR2ENiPCNC7SgpadhZYQFSGLryLwF1Zs3YLjgAwj3A96rdzg7QN12ineG_gc9Q2uGmveoSG8MJXf0eYz2UtUEbCPetotNn4_5dnu06oMshxbqiE9BcClbIq9UGWkXPpv_sxCVKXr4KUk"
            alt="Luxury car service"
            fill
            className="object-cover kenburns"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
          <div className="">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 mb-8 bg-[#C8952A]/10 border border-[#C8952A]/20 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#C8952A] animate-pulse" />
              <span className="text-xs text-[#C8952A] uppercase tracking-widest font-semibold">
                Elite Care for Elite Machines
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[44px] md:text-[72px] font-bold leading-[52px] md:leading-[84px] text-white mb-8">
              Mastering the Art of{' '}
              <span className="text-[#C8952A]">Performance</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-12 leading-relaxed">
              From precision spare parts to bespoke body kits, we provide the uncompromising 
              quality required by the world&apos;s most exclusive automotive icons.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6">
              <a href="#inquiry" className="bg-[#C8952A] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors inline-flex items-center gap-2 uppercase tracking-wide text-sm">
                Schedule Elite Service <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#services" className="border-2 border-[#C8952A] text-[#C8952A] px-8 py-4 rounded-xl font-semibold hover:bg-[#C8952A]/10 transition-colors uppercase tracking-wide text-sm">
                Browse Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 section-neutral">
        <div className="">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 reveal">
            <div className="max-w-2xl">
              <h2 className="text-[32px] md:text-[48px] font-bold text-[#1A1815] mb-4">
                Exceptional Tiers
              </h2>
              <p className="text-[#5C574F]">
                Our service offerings are categorized to meet the exacting standards
                of the luxury automotive sector.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-gray-800 transition-all duration-500 hover:border-[#C8952A]/30"
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <p className="text-xs text-[#C8952A] uppercase tracking-widest mb-2 font-semibold">
                    {service.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 section-dark border-y border-white/5">
        <div className="">
          <p className="text-center text-[#9C978D] text-sm uppercase tracking-widest mb-6 font-semibold">
            Brands We Service
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {brands.map((brand) => (
              <span key={brand} className="text-[#B7B2AA] hover:text-[#C8952A] transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 section-light">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <span className="text-xs text-[#8A6410] uppercase tracking-widest mb-4 block font-semibold">
                Why Choose Us
              </span>
              <h2 className="text-[32px] md:text-[48px] font-bold text-[#1A1815] mb-8 leading-tight">
                Concours Service Portal
              </h2>
              <p className="text-[#5C574F] text-lg mb-12 leading-relaxed">
                Our concierge team is standing by to coordinate your vehicle&apos;s next
                performance session. A specialist will contact you within 2 business hours.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#C8952A]/12 rounded-full text-[#8A6410] group-hover:scale-110 transition-transform flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1A1815] mb-2">
                      Certified Technicians
                    </h4>
                    <p className="text-[#5C574F] text-sm">
                      Factory-trained experts for European and premium luxury brands.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#C8952A]/12 rounded-full text-[#8A6410] group-hover:scale-110 transition-transform flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1A1815] mb-2">
                      Priority Scheduling
                    </h4>
                    <p className="text-[#5C574F] text-sm">
                      Fast-track services reserved for members and elite clientele.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Request Form */}
            <div id="inquiry" className="card-light p-8 md:p-10 reveal">
              <h3 className="text-2xl font-bold text-[#1A1815] mb-8">
                Request Service
              </h3>

              <form action="/api/inquiries" method="POST" className="space-y-6">
                <input type="hidden" name="type" value="SERVICE" />
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-[#C8952A] uppercase tracking-widest font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter name"
                      className="mt-2 w-full bg-white border border-[#DAD6CD] rounded-xl py-4 px-4 text-[#1A1815] focus:border-[#C8952A] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#C8952A] uppercase tracking-widest font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@example.com"
                      className="mt-2 w-full bg-white border border-[#DAD6CD] rounded-xl py-4 px-4 text-[#1A1815] focus:border-[#C8952A] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-[#C8952A] uppercase tracking-widest font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+256 700 000000"
                      className="mt-2 w-full bg-white border border-[#DAD6CD] rounded-xl py-4 px-4 text-[#1A1815] focus:border-[#C8952A] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#C8952A] uppercase tracking-widest font-semibold">
                      Vehicle Model
                    </label>
                    <select
                      name="vehicle_model"
                      className="mt-2 w-full bg-white border border-[#DAD6CD] rounded-xl py-4 px-4 text-[#1A1815] focus:border-[#C8952A] outline-none transition-colors"
                    >
                      <option>Range Rover SV</option>
                      <option>Porsche 911 GT3</option>
                      <option>Mercedes G-Wagon</option>
                      <option>Bentley Bentayga</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#C8952A] uppercase tracking-widest font-semibold">
                    Service Type
                  </label>
                  <select
                    name="service_type"
                    required
                    className="mt-2 w-full bg-white border border-[#DAD6CD] rounded-xl py-4 px-4 text-[#1A1815] focus:border-[#C8952A] outline-none transition-colors"
                  >
                    <option value="">Select service</option>
                    <option value="Spare Parts">Spare Parts Inquiry</option>
                    <option value="Maintenance">Maintenance & Service</option>
                    <option value="Body Kits">Body Kit Installation</option>
                    <option value="Detailing">Professional Detailing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#C8952A] uppercase tracking-widest font-semibold">
                    Additional Details
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Special requirements..."
                    className="mt-2 w-full bg-white border border-[#DAD6CD] rounded-xl py-4 px-4 text-[#1A1815] focus:border-[#C8952A] outline-none transition-colors resize-none"
                  />
                </div>

                <button type="submit" className="w-full bg-[#C8952A] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors inline-flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
                  Submit Request <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-gray-500 text-center">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Your information is secure and confidential.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 section-dark">
        <div className=" text-center reveal">
          <h2 className="text-[28px] md:text-[40px] font-bold text-white mb-6">
            Need Something Not Listed?
          </h2>
          <p className="text-[#B7B2AA] max-w-xl mx-auto mb-8">
            Our team can handle virtually any automotive requirement. 
            Contact us to discuss your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-[#C8952A] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors inline-flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
              Contact Our Team <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi, I have a special service request.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#C8952A] text-[#C8952A] px-8 py-4 rounded-xl font-semibold hover:bg-[#C8952A]/10 transition-colors text-center uppercase tracking-wide text-sm"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'd like to enquire about your services." />
    </main>
  )
}
