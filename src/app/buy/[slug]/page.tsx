import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { PurchaseCheckout } from '@/components/checkout/PurchaseCheckout'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

async function getContact() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return undefined
  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) return undefined
  return { name: user.full_name, email: user.email, phone: user.phone }
}

export default async function BuyPage({ params }: Props) {
  const { slug } = await params
  const [vehicle, contact] = await Promise.all([
    db.vehicle.findUnique({ where: { slug } }),
    getContact(),
  ])

  if (!vehicle || !vehicle.published || !vehicle.sale_price_ugx) notFound()

  let photos: string[] = []
  try { photos = vehicle.photos ? JSON.parse(vehicle.photos) : [] } catch { /* ignore */ }

  return (
    <main className="min-h-screen bg-[#141312]">
      <Navbar />
      <section className="pt-28 pb-20 px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <Link href={`/cars/${vehicle.slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C8952A] transition-colors text-sm mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to vehicle
        </Link>
        <div className="mb-10 reveal">
          <p className="text-xs text-[#C8952A] uppercase tracking-[0.3em] mb-3 font-semibold">Secure Checkout</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Complete your purchase</h1>
        </div>
        <PurchaseCheckout
          vehicle={{ id: vehicle.id, name: vehicle.name, image: photos[0] ?? null, priceUgx: vehicle.sale_price_ugx, slug: vehicle.slug }}
          contact={contact}
        />
      </section>
      <Footer />
      <WhatsAppButton message={`Hi, I'd like help purchasing the ${vehicle.name}.`} />
    </main>
  )
}
