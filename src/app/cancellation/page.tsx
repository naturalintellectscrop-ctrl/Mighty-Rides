import { db } from '@/lib/db'
import { Navbar, Footer } from '@/components/shared'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Cancellation & Return Policy — Mighty Rides',
  description: 'Cancellation, refund and return policy for Mighty Rides vehicle rentals and sales in Kampala, Uganda.',
}

const FALLBACK = `# Mighty Rides Cancellation & Return Policy

_Last updated: 2026_

## 1. Rental Cancellations
- Cancellations made more than 48 hours before the scheduled pickup: full refund of the deposit.
- Cancellations made within 48 hours of pickup: 50% of the deposit is refunded.
- No-shows (failure to collect the vehicle without notice): no refund.
- To cancel, contact us by phone, WhatsApp or email with your booking reference.

## 2. Rental Modifications
- Date changes are subject to vehicle availability and must be requested at least 24 hours before pickup.
- Approved extensions are charged at the standard daily rate for the additional period.

## 3. Refund Processing
- Eligible refunds are processed within 5 business days to the original payment method.
- Mobile money refunds may take additional time depending on the provider.

## 4. Vehicle Sales
- Vehicle purchases are confirmed only after a signed sales agreement and full payment.
- Deposits placed to reserve a vehicle for sale are refundable within 7 days if the sale does not proceed, less any agreed reservation fee.
- Once a sale is completed and the vehicle handed over, sales are final except where a written warranty applies.

## 5. Insurance & Liability
- Comprehensive insurance details for each rental are provided in the rental agreement.
- The rentee is responsible for any damage, traffic fines or losses not covered by insurance.

## 6. Contact
For any cancellation, refund or return request, contact our office:
- Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala
- Monday – Saturday, 8am – 6pm EAT

This policy forms part of our Terms and Conditions.`

export default async function CancellationPage() {
  let content = FALLBACK
  try {
    const setting = await db.setting.findUnique({ where: { key: 'cancellation_policy_text' } })
    if (setting?.value) content = setting.value
  } catch (error) {
    console.error('[CANCELLATION] DB unavailable, using fallback:', error)
  }

  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />

      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow mb-2">LEGAL</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-white">
            Cancellation &amp; Return Policy
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
