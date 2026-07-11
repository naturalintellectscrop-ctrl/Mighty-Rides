import { safeSettings } from '@/lib/safe-db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building, Users, Calendar, Shield, Globe, Car, CheckCircle, Clock } from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// CORPORATE PAGE - Premium Design
// ============================================================================

export const metadata = {
  title: 'Corporate Mobility Solutions | Mighty Rides',
  description: 'Executive transport, fleet rental, NGO movement, embassy clients, hotel partnerships, and business mobility contracts.',
}

const clientTypes = [
  { name: 'NGOs', description: 'Reliable transport for humanitarian operations' },
  { name: 'Embassies', description: 'Secure diplomatic mobility solutions' },
  { name: 'Hotels', description: 'Premium guest transfer services' },
  { name: 'Corporations', description: 'Executive fleet management' },
  { name: 'Event Companies', description: 'Event transport coordination' },
  { name: 'Government', description: 'Official mobility contracts' },
]

const services = [
  { 
    icon: Car, 
    title: 'Executive Airport Transfers', 
    description: 'Premium airport pickups and drop-offs for your executives and VIPs. Meet & greet service available.' 
  },
  { 
    icon: Calendar, 
    title: 'Long-Term Fleet Rental', 
    description: 'Flexible rental agreements tailored to your operational needs. Daily, weekly, and monthly rates.' 
  },
  { 
    icon: Users, 
    title: 'Chauffeur Services', 
    description: 'Professional drivers for executive transport and events. Trained in discretion and protocol.' 
  },
  { 
    icon: Globe, 
    title: 'Event Fleet', 
    description: 'Vehicle solutions for conferences, summits, and corporate events. Full coordination service.' 
  },
  { 
    icon: Shield, 
    title: 'VIP Movement', 
    description: 'Secure and discrete transport for high-profile individuals. Protocol-compliant operations.' 
  },
  { 
    icon: Building, 
    title: 'Contract Agreements', 
    description: 'Customised mobility contracts with favourable terms. Dedicated account management.' 
  },
]

export default async function CorporatePage() {
  const settings = await safeSettings()
  const settingsMap: Record<string, string> = {}
  for (const s of settings) settingsMap[s.key] = s.value

  return (
    <main className="min-h-screen bg-[#141312]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4wXwTKi2Vj_VHzp9OGyzoy860iFbVN729l2ger7XgeD4F7MMUZQbATeu74iBImqmJ3SUFjMbnorBGXgohMMXKqhavSnf9YN9p_klZDQUSWG9JJoiEU2wHV-UDQ0iXP1IWRFK3EWOYSDmsQMtbZahr3eY0cZfESXFIvG1r5lBlYJsCkXpSqT7wX46PKWB3WcMC4pYnnblVdIDeKZsscqWZ3UDUYY0b97K7P4FZVuOoEmSmAERSfLaXUUvAKfkEz5MoC5B4s3_RTWE"
            alt="Corporate fleet"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 md:px-6 lg:px-0 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 mb-8 bg-brand-gold/10 border border-brand-gold/20 px-4 py-2 rounded-full">
              <Building className="w-4 h-4 text-brand-gold" />
              <span className="font-label text-xs text-brand-gold uppercase tracking-widest">
                Enterprise Solutions
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-[44px] md:text-[72px] font-bold leading-[52px] md:leading-[84px] text-white mb-8">
              Mobility Solutions for{' '}
              <span className="text-brand-gold">Organisations That Demand Excellence</span>
            </h1>

            {/* Subheading */}
            <p className="font-body text-body-lg text-brand-silver max-w-xl mb-12 leading-relaxed">
              Executive transport, fleet rental, NGO movement, embassy clients, 
              hotel partnerships, and business mobility contracts tailored to your needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6">
              <a href="#inquiry" className="btn btn-primary">
                Submit Corporate Enquiry <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settingsMap.whatsapp_number || '256700000000'}?text=Hi,%20I'd%20like%20to%20enquire%20about%20corporate%20mobility%20solutions.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                WhatsApp Business Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Client Types */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 section-neutral">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="font-label text-label-sm text-[#8A6410] uppercase tracking-widest">
              Trusted By
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 reveal">
            {clientTypes.map((client) => (
              <div key={client.name} className="text-center p-4 bg-white rounded-lg border border-[#ECEAE3] shadow-[0_1px_2px_rgba(26,24,21,0.04)] hover:border-brand-gold/40 transition-colors">
                <p className="text-[#1A1815] font-medium">{client.name}</p>
                <p className="text-xs text-[#5C574F] mt-1">{client.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 section-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="font-label text-label-sm text-[#8A6410] uppercase tracking-widest mb-2 block">
              Our Services
            </span>
            <h2 className="font-display text-[32px] md:text-[48px] font-bold text-[#1A1815]">
              Corporate Mobility Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
            {services.map((service) => (
              <div
                key={service.title}
                className="card-light p-8 group"
              >
                <div className="w-14 h-14 bg-brand-gold/10 border border-brand-gold/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors">
                  <service.icon className="w-6 h-6 text-[#8A6410]" />
                </div>
                <h4 className="font-display text-xl font-bold text-[#1A1815] mb-3">{service.title}</h4>
                <p className="text-[#5C574F] text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 section-neutral">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <span className="font-label text-label-sm text-[#8A6410] uppercase tracking-widest mb-4 block">
                Why Mighty Rides
              </span>
              <h2 className="font-display text-[32px] md:text-[48px] font-bold text-[#1A1815] mb-8 leading-tight">
                Your Trusted Mobility Partner
              </h2>
              <p className="text-[#5C574F] text-lg mb-8 leading-relaxed">
                We understand the unique requirements of corporate mobility. Our dedicated 
                account managers ensure seamless operations, from daily transfers to 
                large-scale event coordination.
              </p>

              <div className="space-y-4">
                {[
                  'Dedicated account manager for your organization',
                  'Flexible billing and invoicing options',
                  '24/7 dispatch and support line',
                  'Protocol-trained chauffeurs available',
                  'Comprehensive insurance coverage',
                  'Real-time vehicle tracking on request',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8A6410] flex-shrink-0" />
                    <span className="text-[#3F3A33]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry Form */}
            <div id="inquiry" className="card-light p-8 md:p-10 reveal">
              <h3 className="font-display text-2xl font-bold text-[#1A1815] mb-8">
                Submit Corporate Enquiry
              </h3>

              <form action="/api/inquiries" method="POST" className="space-y-6">
                <input type="hidden" name="type" value="CORPORATE" />
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Company / Organisation *
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      required
                      placeholder="Company name"
                      className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A]"
                    />
                  </div>
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Industry / Type
                    </label>
                    <select
                      name="industry"
                      className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A]"
                    >
                      <option value="">Select type</option>
                      <option value="NGO">NGO</option>
                      <option value="Embassy">Embassy</option>
                      <option value="Hotel">Hotel / Hospitality</option>
                      <option value="Corporate">Corporation</option>
                      <option value="Event">Event Company</option>
                      <option value="Government">Government</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A]"
                    />
                  </div>
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A]"
                  />
                </div>

                <div>
                  <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                    Nature of Requirement *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Please describe your mobility needs in detail..."
                    className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Fleet Size
                    </label>
                    <select
                      name="fleet_size"
                      className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A]"
                    >
                      <option value="">Select</option>
                      <option value="1-3">1-3 vehicles</option>
                      <option value="4-10">4-10 vehicles</option>
                      <option value="10+">10+ vehicles</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Duration
                    </label>
                    <select
                      name="duration"
                      className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A]"
                    >
                      <option value="">Select</option>
                      <option value="Days">Days</option>
                      <option value="Weeks">Weeks</option>
                      <option value="Months">Months</option>
                      <option value="Ongoing">Ongoing</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Urgency
                    </label>
                    <select
                      name="urgency"
                      className="mt-2 bg-white border border-[#DAD6CD] focus:border-[#C8952A]"
                    >
                      <option value="">Select</option>
                      <option value="Urgent">Urgent (48hrs)</option>
                      <option value="This week">This week</option>
                      <option value="This month">This month</option>
                      <option value="Planning ahead">Planning ahead</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Submit Corporate Enquiry <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-[#8A857C] text-center flex items-center justify-center gap-2">
                  <Clock className="w-3 h-3" />
                  We typically respond within 4 business hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 section-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center reveal">
          <h2 className="font-display text-[28px] md:text-[40px] font-bold text-brand-white mb-6">
            Ready to Discuss Your Mobility Needs?
          </h2>
          <p className="text-[#B7B2AA] max-w-xl mx-auto mb-8">
            Our corporate team is ready to design a custom solution for your organization. 
            Schedule a consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${settingsMap.whatsapp_number || '256700000000'}?text=Hi,%20I'd%20like%20to%20discuss%20corporate%20mobility%20solutions.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Schedule Consultation <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/hire" className="btn">
              View Our Fleet
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'd like to enquire about corporate mobility." />
    </main>
  )
}
