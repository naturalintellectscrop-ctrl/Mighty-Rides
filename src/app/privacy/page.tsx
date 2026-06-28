import { db } from '@/lib/db'
import { Navbar, Footer } from '@/components/shared'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

export default async function PrivacyPage() {
  let setting: { value: string } | null = null
  try {
    setting = await db.setting.findUnique({ where: { key: 'privacy_policy_text' } })
  } catch (error) {
    console.error('[PRIVACY] DB unavailable, using fallback:', error)
  }

  const content = setting?.value || `
# Mighty Rides Privacy Policy

## Introduction
Mighty Rides ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.

## Information We Collect
We collect the following types of information:

### Personal Information
- Full name
- Email address
- Phone number
- Date of birth
- Nationality
- National ID or Passport details

### Vehicle Information
- Booking history
- Vehicle preferences
- Transaction records

## How We Use Your Information
We use your information to:
- Process your rental bookings
- Verify your identity
- Communicate with you about your bookings
- Send you promotional materials (with your consent)
- Improve our services

## Data Security
We implement appropriate security measures to protect your personal data, including:
- Secure data storage
- Encrypted transmissions
- Access controls

## Data Sharing
We do not sell or rent your personal data to third parties. We may share your information with:
- Payment processors (for transactions)
- Government authorities (when legally required)
- Service providers who assist our operations

## Your Rights
You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Opt-out of marketing communications

## Contact Us
For any privacy-related questions or concerns, please contact us at:
- Email: admin@mightyrides.com
- Phone: +256 700 000 000
- Address: Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala, Uganda

## Updates
This privacy policy may be updated from time to time. We will notify you of any significant changes.

Last updated: ${new Date().getFullYear()}
`

  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />
      
      <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow mb-2">LEGAL</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-white">
            Privacy Policy
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
