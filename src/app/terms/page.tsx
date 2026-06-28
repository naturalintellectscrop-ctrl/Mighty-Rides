import { db } from '@/lib/db'
import { Navbar, Footer } from '@/components/shared'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

export default async function TermsPage() {
  const setting = await db.setting.findUnique({
    where: { key: 'tc_summary_text' }
  })

  const content = setting?.value || `
# Mighty Rides Rental Terms and Conditions

## 1. Booking and Payment
- A 30% deposit is required to secure your booking
- The remaining balance must be paid at our office before vehicle collection
- Payment methods accepted: MTN Mobile Money, Airtel Money, Visa, Mastercard

## 2. Identification Requirements
- A valid National ID or Passport is required for all rentals
- Documents must be uploaded during registration
- Original documents must be presented at our office

## 3. Vehicle Collection
- All vehicles must be collected from our office at:
  Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala
- Office hours: Monday - Saturday, 8am - 6pm EAT
- A physical rental agreement must be signed before vehicle release

## 4. Vehicle Use
- The vehicle may only be driven by the registered rentee
- The vehicle must not be taken outside Uganda without prior written consent
- The vehicle must not be used for any illegal purposes

## 5. Return Conditions
- The vehicle must be returned on the agreed date and time
- Fuel level must be the same as at handover
- The vehicle must be returned in the same condition as received

## 6. Damage and Insurance
- Any damage must be reported immediately
- The rentee is responsible for any damage not covered by insurance
- Traffic fines incurred during the rental period are the rentee's responsibility

## 7. Cancellation Policy
- Cancellations more than 48 hours before pickup: Full refund
- Cancellations within 48 hours: 50% refund
- No-shows: No refund

## 8. Extension Requests
- Extension requests must be submitted at least 24 hours before return time
- Extensions are subject to vehicle availability
- Additional charges apply for approved extensions

For full terms and conditions, please contact our office.
`

  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />
      
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow mb-2">LEGAL</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-white">
            Terms and Conditions
          </h1>
        </div>
      </section>

      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-black">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-invert prose-sm">
              <div className="text-brand-silver whitespace-pre-line leading-relaxed">
                {content}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
