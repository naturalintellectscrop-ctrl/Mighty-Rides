import Link from 'next/link'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { FAQJsonLd } from '@/components/analytics/JsonLd'
import { ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about renting and buying vehicles with Mighty Rides in Kampala, Uganda — bookings, documents, insurance, extensions, cancellations and more.',
  alternates: { canonical: '/faq' },
}

interface QA {
  q: string
  a: string
}

const categories: { title: string; items: QA[] }[] = [
  {
    title: 'Renting a Vehicle',
    items: [
      { q: 'How do I book a rental?', a: 'Create an account and verify your ID, choose a vehicle and your dates, then pay a 30% deposit online. We confirm your booking and you collect the vehicle from our Kampala office.' },
      { q: 'What documents do I need?', a: 'A valid National ID or Passport. You upload it during registration and present the original at our office when you collect the vehicle.' },
      { q: "What's included in the rental?", a: 'The vehicle, comprehensive insurance and our support throughout the hire. Fuel is the renter’s responsibility — please return the vehicle with the same fuel level as at handover.' },
      { q: 'Do you offer insurance?', a: 'Yes. Every rental includes comprehensive insurance. The specific cover and excess are set out in your rental agreement.' },
      { q: 'Can I extend my rental?', a: 'Yes. Request an extension from your customer portal at least 24 hours before your return time. Extensions are subject to availability and charged at the standard daily rate.' },
      { q: "What's your cancellation policy?", a: 'Cancel more than 48 hours before pickup for a full deposit refund; within 48 hours, 50% is refunded; no-shows are non-refundable. See our Cancellation & Return Policy for details.' },
      { q: 'Do you offer one-way or chauffeur rentals?', a: 'Yes — one-way, chauffeur-driven and bespoke arrangements can be made for select vehicles. Contact our concierge to arrange.' },
      { q: 'Can I request a specific vehicle?', a: 'Absolutely. Choose any available vehicle from our fleet, or use our Vehicle Sourcing service for something we don’t currently stock.' },
    ],
  },
  {
    title: 'Buying a Vehicle',
    items: [
      { q: 'Can I purchase a vehicle online?', a: 'Vehicle purchases are handled by personal consultation rather than instant checkout. Submit an inquiry on any vehicle and our sales team will guide you through viewing, payment and handover.' },
      { q: 'Do you have financing options?', a: 'We can connect you with trusted financing partners. Contact our sales team to discuss the options currently available.' },
      { q: "What's your return policy for purchases?", a: 'Completed sales are final once the handover is signed, except where a written warranty applies. Reservation deposits are refundable within 7 days if the sale does not proceed. See our Cancellation & Return Policy.' },
    ],
  },
  {
    title: 'General',
    items: [
      { q: 'How do I contact support?', a: 'Call or WhatsApp us, email our team, or use the contact form. Our office is open Monday–Saturday, 8am–6pm EAT.' },
      { q: 'Where are you located?', a: 'Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala, Uganda.' },
    ],
  },
]

export default function FaqPage() {
  const allItems = categories.flatMap((c) => c.items)

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <FAQJsonLd items={allItems.map((i) => ({ question: i.q, answer: i.a }))} />
      <Navbar />

      {/* Hero */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 pt-32 md:pt-40 pb-12 md:pb-16 bg-[#1A1A1A]">
        <p className="text-sm md:text-base text-[#C8952A] uppercase tracking-widest mb-3 font-semibold">Support</p>
        <h1 className="text-3xl md:text-5xl font-bold text-white">Frequently Asked Questions</h1>
        <p className="text-gray-400 mt-4 max-w-2xl">
          Everything you need to know about renting and buying with Mighty Rides. Can’t find your answer?{' '}
          <Link href="/contact" className="text-[#C8952A] hover:underline">Contact us</Link>.
        </p>
      </section>

      {/* FAQ Content */}
      <section className="w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          {categories.map((category) => (
            <div key={category.title}>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">{category.title}</h2>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <details
                    key={item.q}
                    className="group bg-[#1A1A1A] border border-gray-800 rounded-xl overflow-hidden open:border-[#C8952A]/50"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 md:p-6 text-white font-semibold">
                      <span>{item.q}</span>
                      <ChevronDown className="w-5 h-5 text-[#C8952A] shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-400 leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Still need help */}
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Still have a question?</h3>
            <p className="text-gray-400 mb-6">Our team is happy to help with anything not covered here.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-[#C8952A] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors uppercase tracking-wide text-sm">
                Contact Us
              </Link>
              <Link href="/hire" className="border-2 border-[#C8952A] text-[#C8952A] px-8 py-3 rounded-xl font-semibold hover:bg-[#C8952A]/10 transition-colors uppercase tracking-wide text-sm">
                Browse Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I have a question about Mighty Rides." />
    </main>
  )
}
