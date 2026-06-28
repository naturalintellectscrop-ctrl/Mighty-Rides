import { safeSettings } from '@/lib/safe-db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { ArrowRight, Search, Globe, Car } from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// SOURCING PAGE
// ============================================================================

export default async function SourcingPage() {
  const settings = await safeSettings()
  const settingsMap: Record<string, string> = {}
  for (const s of settings) settingsMap[s.key] = s.value

  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />

      {/* Hero */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow mb-2">VEHICLE SOURCING</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-white mb-4">
            Can&apos;t Find It?
            <span className="block text-brand-gold">We&apos;ll Find It For You.</span>
          </h1>
          <p className="text-brand-silver max-w-xl">
            Mighty Rides sources vehicles from global markets. Shorter lead times. 
            Competitive pricing. No obligation to proceed.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 bg-brand-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-2">HOW IT WORKS</p>
            <h2 className="font-display text-2xl font-bold text-brand-white">
              Simple 3-Step Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, icon: Search, title: 'Tell Us What You Need', description: 'Fill out the form with your exact vehicle specifications' },
              { step: 2, icon: Globe, title: 'We Search Globally', description: 'Our network searches markets worldwide for your vehicle' },
              { step: 3, icon: Car, title: 'Options Presented', description: 'We present you with options and pricing — no obligation' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-gold/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-brand-gold" />
                </div>
                <h4 className="font-display text-lg font-bold text-brand-white mb-2">{item.title}</h4>
                <p className="text-sm text-brand-silver">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing Form */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-brand-white mb-6 text-center">
              Submit Your Sourcing Request
            </h2>

            <form action="/api/inquiries" method="POST" className="card p-8 space-y-6">
              <input type="hidden" name="type" value="SOURCING" />
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              {/* Vehicle Details */}
              <div className="space-y-4">
                <h3 className="font-display text-lg font-bold text-brand-white">Vehicle Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Vehicle Type *</label>
                    <select name="vehicle_type" required>
                      <option value="">Select type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Sports">Sports Car</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label>Preferred Make</label>
                    <input type="text" name="make" placeholder="e.g. Lamborghini" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Preferred Model</label>
                    <input type="text" name="model" placeholder="e.g. Urus" />
                  </div>
                  <div>
                    <label>Preferred Colour</label>
                    <input type="text" name="colour" placeholder="Optional" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Year From</label>
                    <select name="year_from">
                      <option value="">Any</option>
                      {Array.from({ length: 10 }, (_, i) => 2024 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Year To</label>
                    <select name="year_to">
                      <option value="">Any</option>
                      {Array.from({ length: 10 }, (_, i) => 2024 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Transmission</label>
                    <select name="transmission">
                      <option value="">No preference</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label>Budget Range (UGX)</label>
                    <select name="budget">
                      <option value="">Select budget</option>
                      <option value="100-200M">100M - 200M UGX</option>
                      <option value="200-400M">200M - 400M UGX</option>
                      <option value="400-600M">400M - 600M UGX</option>
                      <option value="600M+">600M+ UGX</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Intended Use</label>
                    <select name="intended_use">
                      <option value="">Select use</option>
                      <option value="Personal">Personal</option>
                      <option value="Business">Business</option>
                      <option value="Corporate Fleet">Corporate Fleet</option>
                    </select>
                  </div>
                  <div>
                    <label>How Soon?</label>
                    <select name="timeline">
                      <option value="">Select timeline</option>
                      <option value="ASAP">As soon as possible</option>
                      <option value="1 month">Within 1 month</option>
                      <option value="3 months">Within 3 months</option>
                      <option value="6 months">Within 6 months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 pt-4 border-t border-brand-border">
                <h3 className="font-display text-lg font-bold text-brand-white">Your Contact Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Full Name *</label>
                    <input type="text" name="name" required />
                  </div>
                  <div>
                    <label>Phone Number *</label>
                    <input type="tel" name="phone" required />
                  </div>
                </div>

                <div>
                  <label>Email Address *</label>
                  <input type="email" name="email" required />
                </div>

                <div>
                  <label>Preferred Contact Method</label>
                  <select name="contact_preference">
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone">Phone Call</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn w-full">
                Submit Sourcing Request <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'd like to request vehicle sourcing." />
    </main>
  )
}
