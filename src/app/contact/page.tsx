import { safeSettings } from '@/lib/safe-db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { Mail, Phone, MapPin, Clock, MessageSquare, Clock3 } from 'lucide-react'
import ContactForm from './ContactForm'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// CONTACT PAGE
// ============================================================================

async function getSettings() {
  const settings = await safeSettings()
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return map
}

export const metadata = {
  title: 'Contact Us — Mighty Rides',
  description: 'Get in touch with Mighty Rides. Visit our showroom in Kampala, call us, or send us a message. We\'re here to help you find your perfect vehicle.',
  openGraph: {
    title: 'Contact Us — Mighty Rides',
    description: 'Get in touch with Mighty Rides. Visit our showroom in Kampala, call us, or send us a message.',
    type: 'website',
  },
}

export default async function ContactPage() {
  const settings = await getSettings()
  const whatsapp = settings.whatsapp_number || '256700000000'
  const officeHours = settings.office_hours || 'Mon–Sat 8am–6pm EAT'
  const phone = settings.phone_number || '+256 700 000 000'
  const email = settings.email || 'info@mightyrides.com'
  const address = settings.address || 'Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala, Uganda'

  return (
    <main className="min-h-screen bg-[#141312] flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-8 sm:pb-16 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,149,42,0.08),transparent_70%)]" />
        <div className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 relative">
          <div className="">
            <p className="text-sm md:text-base text-[#C8952A] uppercase tracking-widest mb-2 font-semibold">
              CONTACT US
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Get in Touch
            </h1>
            <p className="text-[#B7B2AA] mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base">
              Have questions? We&apos;re here to help. Reach out through any of the channels below or visit our showroom.
            </p>
            
            {/* Gold accent line */}
            <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-[#C8952A] to-transparent mt-4 sm:mt-6" />
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24 section-light flex-1">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Info */}
            <div className="space-y-6 sm:space-y-8 reveal reveal-left">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1815] mb-4 sm:mb-6">
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I would like to get in touch.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-[#ECEAE3] shadow-[0_1px_2px_rgba(26,24,21,0.04)] rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 hover:border-green-500/50 transition-all duration-300 group"
                  >
                    <div className="p-2.5 sm:p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors flex-shrink-0">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1A1815] group-hover:text-green-600 transition-colors">
                        WhatsApp (Fastest)
                      </h3>
                      <p className="text-[#5C574F] text-sm mt-0.5 sm:mt-1">+{whatsapp}</p>
                      <p className="text-[#8A857C] text-xs mt-1 sm:mt-2 flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        Usually responds within minutes
                      </p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="bg-white border border-[#ECEAE3] shadow-[0_1px_2px_rgba(26,24,21,0.04)] rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 hover:border-[#C8952A]/50 transition-all duration-300 group"
                  >
                    <div className="p-2.5 sm:p-3 bg-[#C8952A]/10 rounded-lg group-hover:bg-[#C8952A]/20 transition-colors flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8952A]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1A1815] group-hover:text-[#8A6410] transition-colors">
                        Phone
                      </h3>
                      <p className="text-[#5C574F] text-sm mt-0.5 sm:mt-1">{phone}</p>
                      <p className="text-[#8A857C] text-xs mt-1 sm:mt-2">Call during business hours</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${email}`}
                    className="bg-white border border-[#ECEAE3] shadow-[0_1px_2px_rgba(26,24,21,0.04)] rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 hover:border-[#C8952A]/50 transition-all duration-300 group"
                  >
                    <div className="p-2.5 sm:p-3 bg-[#C8952A]/10 rounded-lg group-hover:bg-[#C8952A]/20 transition-colors flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8952A]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1A1815] group-hover:text-[#8A6410] transition-colors">
                        Email
                      </h3>
                      <p className="text-[#5C574F] text-sm mt-0.5 sm:mt-1">{email}</p>
                      <p className="text-[#8A857C] text-xs mt-1 sm:mt-2">We respond within 24 hours</p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="bg-white border border-[#ECEAE3] shadow-[0_1px_2px_rgba(26,24,21,0.04)] rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-[#C8952A]/10 rounded-lg flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8952A]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1A1815]">
                        Visit Our Showroom
                      </h3>
                      <p className="text-[#5C574F] text-sm mt-0.5 sm:mt-1 whitespace-pre-line">
                        {address}
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-white border border-[#ECEAE3] shadow-[0_1px_2px_rgba(26,24,21,0.04)] rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-[#C8952A]/10 rounded-lg flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8952A]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1A1815]">
                        Opening Hours
                      </h3>
                      <p className="text-[#5C574F] text-sm mt-0.5 sm:mt-1">{officeHours}</p>
                      <p className="text-[#8A857C] text-xs mt-1 sm:mt-2">Closed Sundays & Public Holidays</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="reveal reveal-right">
              <div className="bg-white border border-[#ECEAE3] rounded-xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(26,24,21,0.07)]">
                <h2 className="text-lg sm:text-xl font-bold text-[#1A1815] mb-4 sm:mb-6">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-8 sm:py-12 section-dark border-t border-white/5">
        <div className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
          <div className="">
            <div className="rounded-lg sm:rounded-xl overflow-hidden h-72 sm:h-96 bg-[#2A2A2A] border border-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7573!2d32.5953!3d0.3167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLugogo%20Bypass!5e0!3m2!1sen!2sug!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mighty Rides Showroom Location"
              />
            </div>
            <p className="text-center text-[#9C978D] text-xs sm:text-sm mt-3 sm:mt-4">
              Find us at Mirembe Business Centre, Plot 18 Lugogo Bypass, Kampala
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
