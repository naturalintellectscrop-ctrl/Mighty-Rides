import { db } from '@/lib/db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import Image from 'next/image'
import { ArrowRight, Shield, Clock, User, Eye, CheckCircle, Crown } from 'lucide-react'

// ============================================================================
// CONCIERGE PAGE - Premium Design
// ============================================================================

export const metadata = {
  title: 'Private Concierge | Mighty Rides',
  description: 'A different kind of buying experience. Private viewings, dedicated advisors, and confidential service for discerning clients.',
}

export default async function ConciergePage() {
  const settings = await db.setting.findMany()
  const settingsMap: Record<string, string> = {}
  for (const s of settings) settingsMap[s.key] = s.value

  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy5wSXhxJlm2y1yLobjMIvWbVEXxT_Czk_-4SX67-Av81FqZHKWbYkF4UijHqi9oCsq7gns5kHwLOo38WGng_GO4jP7K6C0v_CD_q3rnSzgk0eFjjq6rUPF9L1P1WOmS-lR2ENiPCNC7SgpadhZYQFSGLryLwF1Zs3YLjgAwj3A96rdzg7QN12ineG_gc9Q2uGmveoSG8MJXf0eYz2UtUEbCPetotNn4_5dnu06oMshxbqiE9BcClbIq9UGWkXPpv_sxCVKXr4KUk"
            alt="Luxury car showroom"
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
              <Crown className="w-4 h-4 text-brand-gold" />
              <span className="font-label text-xs text-brand-gold uppercase tracking-widest">
                Private & Confidential
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-[44px] md:text-[72px] font-bold leading-[52px] md:leading-[84px] text-white mb-8">
              A Different Kind of{' '}
              <span className="text-brand-gold">Buying Experience</span>
            </h1>

            {/* Subheading */}
            <p className="font-body text-body-lg text-brand-silver max-w-xl mb-12 leading-relaxed">
              No showroom pressure. A dedicated advisor. Tailored to your needs. 
              Confidential and personalised service for discerning clients.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6">
              <a href="#request" className="btn btn-primary">
                Request Private Concierge <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settingsMap.whatsapp_number || '256700000000'}?text=Hi,%20I'm%20interested%20in%20private%20concierge%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What Concierge Means */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-label text-label-sm text-brand-gold uppercase tracking-widest mb-2 block">
              The Concierge Experience
            </span>
            <h2 className="font-display text-[32px] md:text-[48px] font-bold text-brand-white">
              What To Expect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Eye, 
                title: 'Private Viewings', 
                description: 'Schedule viewings at your convenience, away from the public showroom. No pressure, no rush.' 
              },
              { 
                icon: User, 
                title: 'Dedicated Advisor', 
                description: 'One point of contact who understands your requirements and guides you through the process.' 
              },
              { 
                icon: Shield, 
                title: 'Tailored Process', 
                description: 'We adapt to your timeline and preferences. Your comfort is our priority.' 
              },
              { 
                icon: Clock, 
                title: 'Confidential', 
                description: 'Your inquiry and details remain strictly private. Discretion guaranteed.' 
              },
            ].map((item, index) => (
              <div 
                key={item.title} 
                className="bg-brand-black rounded-xl border border-brand-border p-8 hover:border-brand-gold/50 transition-colors group"
              >
                <div className="w-16 h-16 bg-brand-gold/10 border border-brand-gold/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors">
                  <item.icon className="w-7 h-7 text-brand-gold" />
                </div>
                <h4 className="font-display text-xl font-bold text-brand-white mb-3">{item.title}</h4>
                <p className="text-brand-silver text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-label text-label-sm text-brand-gold uppercase tracking-widest mb-2 block">
              Simple Process
            </span>
            <h2 className="font-display text-[32px] md:text-[48px] font-bold text-brand-white">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Submit Request', description: 'Fill out the confidential inquiry form with your requirements' },
              { step: '02', title: 'Advisor Assigned', description: 'A dedicated advisor contacts you within 4 hours' },
              { step: '03', title: 'Private Viewing', description: 'Arrange a viewing at your preferred time and location' },
              { step: '04', title: 'Complete Purchase', description: 'Seamless paperwork and delivery coordination' },
            ].map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-brand-border" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-brand-surface border-2 border-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-brand-gold text-lg font-bold">{item.step}</span>
                  </div>
                  <h4 className="font-label text-subheading text-brand-white mb-2">{item.title}</h4>
                  <p className="text-sm text-brand-silver">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section id="request" className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-label text-label-sm text-brand-gold uppercase tracking-widest mb-2 block">
                Private Consultation
              </span>
              <h2 className="font-display text-[32px] md:text-[48px] font-bold text-brand-white mb-4">
                Request Concierge Service
              </h2>
              <p className="text-brand-silver">
                Fill out the form below and a dedicated advisor will contact you within 4 hours.
              </p>
            </div>

            <form action="/api/inquiries" method="POST" className="bg-brand-black rounded-xl border border-brand-border p-8 md:p-10 space-y-8">
              <input type="hidden" name="type" value="CONCIERGE" />
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              {/* Personal Details */}
              <div>
                <h3 className="font-display text-lg font-bold text-brand-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-gold" />
                  Your Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold"
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
                      className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Vehicle Interest */}
              <div className="pt-6 border-t border-brand-border">
                <h3 className="font-display text-lg font-bold text-brand-white mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-brand-gold" />
                  Vehicle Interest
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Make / Model of Interest
                    </label>
                    <input
                      type="text"
                      name="vehicle_interest"
                      placeholder="e.g. Range Rover Vogue"
                      className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold"
                    >
                      <option value="">Select budget</option>
                      <option value="200-400M">200M - 400M UGX</option>
                      <option value="400-600M">400M - 600M UGX</option>
                      <option value="600M+">600M+ UGX</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                    Purchase Timeline
                  </label>
                  <select
                    name="timeline"
                    className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold"
                  >
                    <option value="">Select timeline</option>
                    <option value="This week">This week</option>
                    <option value="This month">This month</option>
                    <option value="Within 3 months">Within 3 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Contact Preferences */}
              <div className="pt-6 border-t border-brand-border">
                <h3 className="font-display text-lg font-bold text-brand-white mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-gold" />
                  Contact Preferences
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Preferred Contact Method
                    </label>
                    <select
                      name="contact_preference"
                      className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone">Phone Call</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                      Best Time to Contact
                    </label>
                    <select
                      name="best_time"
                      className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold"
                    >
                      <option value="Morning">Morning (8am - 12pm)</option>
                      <option value="Afternoon">Afternoon (12pm - 5pm)</option>
                      <option value="Evening">Evening (5pm - 8pm)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="font-label text-xs text-brand-gold uppercase tracking-widest">
                    Any Specific Requirements?
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your specific requirements..."
                    className="mt-2 bg-brand-surface-lowest border border-brand-border focus:border-brand-gold resize-none"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Request Private Concierge <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-brand-muted text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Your information is secure and confidential.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display text-[28px] md:text-[40px] font-bold text-brand-white mb-6">
            Looking for Something Specific?
          </h2>
          <p className="text-brand-silver max-w-xl mx-auto mb-8">
            Our global network can source virtually any vehicle. 
            From vintage classics to the latest hypercars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/sourcing" className="btn btn-primary">
              Request Vehicle Sourcing <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/cars" className="btn">
              Browse Inventory
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'm interested in the private concierge buying experience." />
    </main>
  )
}
