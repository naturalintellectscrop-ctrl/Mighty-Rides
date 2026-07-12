import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { FinancingForm } from '@/components/checkout/FinancingForm'
import { ShieldCheck, Percent, CalendarClock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Vehicle Financing',
  description: 'Apply for flexible vehicle financing on any Mighty Rides vehicle. Fast indicative decisions, transparent terms in UGX.',
  alternates: { canonical: '/financing' },
}

interface Props { searchParams: Promise<{ vehicle?: string }> }

async function getContact() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return undefined
  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) return undefined
  return { name: user.full_name, email: user.email, phone: user.phone }
}

export default async function FinancingPage({ searchParams }: Props) {
  const { vehicle: vehicleSlug } = await searchParams
  const [vehicle, contact] = await Promise.all([
    vehicleSlug ? db.vehicle.findUnique({ where: { slug: vehicleSlug } }) : Promise.resolve(null),
    getContact(),
  ])

  const vehicleProp = vehicle
    ? { id: vehicle.id, name: vehicle.name, priceUgx: vehicle.sale_price_ugx }
    : null

  return (
    <main className="min-h-screen bg-[#141312]">
      <Navbar />

      <section className="pt-28 pb-12 px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 border-b border-white/5">
        <div className="max-w-3xl">
          <p className="text-xs text-[#C8952A] uppercase tracking-[0.3em] mb-4 font-semibold">Vehicle Financing</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-5">Own it your way.</h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Flexible financing on any vehicle in our collection, with a fast indicative decision and transparent terms. Apply in minutes.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-10 max-w-3xl">
          {[
            { icon: Percent, t: 'Competitive rates', d: 'Terms tailored to you' },
            { icon: CalendarClock, t: '12–60 months', d: 'Choose your pace' },
            { icon: ShieldCheck, t: 'Fast decision', d: 'Indicative in minutes' },
          ].map((f) => (
            <div key={f.t} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <f.icon className="w-5 h-5 text-[#C8952A] mb-3" />
              <p className="text-white font-semibold text-sm">{f.t}</p>
              <p className="text-gray-400 text-xs mt-1">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <FinancingForm vehicle={vehicleProp} contact={contact} />
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I'd like to ask about vehicle financing." />
    </main>
  )
}
