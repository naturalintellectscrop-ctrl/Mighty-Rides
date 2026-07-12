import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PortalLayout } from '@/components/portal/PortalLayout'
import { formatEAT, formatDualPrice, formatUGX } from '@/lib/utils'
import { paymentMethodLabel } from '@/lib/payment-methods'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Calendar, MessageCircle,
  ShoppingBag, BookmarkCheck, Landmark, Receipt, Bell,
} from 'lucide-react'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

async function getSettings() {
  const settings = await db.setting.findMany()
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return map
}

const FINANCE_STYLE: Record<string, string> = {
  SUBMITTED: 'text-blue-400', UNDER_REVIEW: 'text-yellow-400',
  PRE_APPROVED: 'text-green-400', APPROVED: 'text-green-400', REJECTED: 'text-red-400',
}
const PAY_STYLE: Record<string, string> = {
  SUCCESSFUL: 'text-green-400', PAID: 'text-green-400', PENDING: 'text-yellow-400',
  PROCESSING: 'text-yellow-400', FAILED: 'text-red-400',
}

export default async function PortalPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role === 'ADMIN') {
    redirect('/login')
  }

  const userId = session.user.id
  const email = session.user.email
  const user = await db.user.findUnique({ where: { id: userId } })
  const phone = user?.phone

  const [bookings, settings, orders, reservations, finances] = await Promise.all([
    db.booking.findMany({
      where: { rentee_id: userId, status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] } },
      include: { vehicle: true },
      orderBy: { pickup_datetime: 'asc' },
    }),
    getSettings(),
    db.order.findMany({ where: { OR: [{ userId }, { customerEmail: email }] }, orderBy: { createdAt: 'desc' } }),
    db.reservation.findMany({ where: { OR: [{ userId }, { customerEmail: email }] }, orderBy: { createdAt: 'desc' } }),
    db.financeApplication.findMany({ where: { OR: [{ userId }, { email }] }, orderBy: { createdAt: 'desc' } }),
  ])

  const entityIds = [...orders.map((o) => o.id), ...reservations.map((r) => r.id)]
  const [payments, notifications] = await Promise.all([
    db.payment.findMany({
      where: { OR: [{ userId }, ...(entityIds.length ? [{ entityId: { in: entityIds } }] : [])] },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    db.notificationLog.findMany({
      where: { OR: [{ userId }, { recipient: email }, ...(phone ? [{ recipient: phone }] : [])] },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
  ])

  const whatsappNumber = settings.whatsapp_number || '256700000000'
  const activeBooking = bookings.find((b) => b.status === 'ACTIVE')
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED')

  const hasNothing =
    bookings.length === 0 && orders.length === 0 && reservations.length === 0 &&
    finances.length === 0 && payments.length === 0

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
        <h1 className="font-display text-3xl font-bold text-brand-white mb-2">
          Welcome back, {session.user.name?.split(' ')[0]}
        </h1>
        <p className="text-brand-silver mb-8">Your rentals, purchases, reservations and applications — all in one place.</p>

        {/* Snapshot */}
        {!hasNothing && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatTile label="Purchases" value={orders.length} icon={ShoppingBag} />
            <StatTile label="Reservations" value={reservations.filter((r) => r.status === 'ACTIVE').length} icon={BookmarkCheck} />
            <StatTile label="Finance Apps" value={finances.length} icon={Landmark} />
            <StatTile label="Payments" value={payments.filter((p) => p.status === 'SUCCESSFUL').length} icon={Receipt} />
          </div>
        )}

        {/* Active Rental */}
        {activeBooking && (
          <section className="mb-10">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Active Rental</h2>
            <div className="card p-6 border-l-4 border-green-500">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 aspect-video bg-brand-surface-2 rounded-lg overflow-hidden">
                  {activeBooking.vehicle.photos && (
                    <Image src={JSON.parse(activeBooking.vehicle.photos)[0]} alt={activeBooking.vehicle.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="status-badge status-available mb-2">Active</span>
                  <h3 className="font-display text-xl font-bold text-brand-white">{activeBooking.vehicle.name}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div><p className="text-brand-muted">Pickup</p><p className="text-brand-white">{formatEAT(activeBooking.pickup_datetime)}</p></div>
                    <div><p className="text-brand-muted">Return</p><p className="text-brand-white">{formatEAT(activeBooking.return_datetime)}</p></div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi, I have a question about my rental.')}`} target="_blank" rel="noopener noreferrer" className="btn text-sm">
                  <MessageCircle className="w-4 h-4" /> Contact Mighty Rides
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Pending Bookings */}
        {pendingBookings.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Pending Bookings</h2>
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <span className={`status-badge ${booking.status === 'CONFIRMED' ? 'status-reserved' : 'status-sold'}`}>{booking.status}</span>
                    <h3 className="font-display text-lg font-bold text-brand-white mt-1">{booking.vehicle.name}</h3>
                    <p className="text-sm text-brand-silver">Ref: {booking.booking_ref} • {formatEAT(booking.pickup_datetime)}</p>
                  </div>
                  <p className="text-brand-gold font-medium">{formatDualPrice(booking.total_cost_ugx)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Purchases */}
        {orders.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Purchases</h2>
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="card p-4 flex items-center gap-4">
                  {o.vehicleImage && (
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                      <Image src={o.vehicleImage} alt={o.vehicleName} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`status-badge ${o.status === 'CONFIRMED' ? 'status-available' : 'status-reserved'}`}>{o.status}</span>
                      <span className={`text-xs font-medium ${PAY_STYLE[o.paymentStatus] || 'text-brand-silver'}`}>{o.paymentStatus}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-brand-white mt-1 truncate">{o.vehicleName}</h3>
                    <p className="text-sm text-brand-silver">Order {o.orderRef} · Invoice {o.invoiceNumber} · {paymentMethodLabel(o.method)}</p>
                  </div>
                  <p className="text-brand-gold font-semibold whitespace-nowrap">{formatUGX(o.amountUgx)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reservations */}
        {reservations.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Reservations</h2>
            <div className="space-y-4">
              {reservations.map((r) => (
                <div key={r.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <span className={`status-badge ${r.status === 'ACTIVE' ? 'status-reserved' : 'status-sold'}`}>{r.status}</span>
                    <h3 className="font-display text-lg font-bold text-brand-white mt-1">{r.vehicleName}</h3>
                    <p className="text-sm text-brand-silver">Ref: {r.reservationRef} · Held until {formatEAT(r.expiresAt, 'PP p')}</p>
                  </div>
                  {r.status === 'ACTIVE' && r.vehicleSlug && (
                    <Link href={`/buy/${r.vehicleSlug}`} className="text-brand-gold text-sm hover:opacity-80 whitespace-nowrap">
                      Purchase <ArrowRight className="w-4 h-4 inline" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Finance Applications */}
        {finances.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Financing Applications</h2>
            <div className="space-y-4">
              {finances.map((f) => (
                <div key={f.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${FINANCE_STYLE[f.status] || 'text-brand-silver'}`}>{f.status.replace('_', ' ')}</span>
                      <h3 className="font-display text-lg font-bold text-brand-white mt-1">{f.vehicleName || 'Vehicle financing'}</h3>
                      <p className="text-sm text-brand-silver">Ref: {f.applicationRef} · {f.termMonths} months</p>
                    </div>
                    <p className="text-brand-gold font-semibold whitespace-nowrap">{formatUGX(f.amountUgx)}</p>
                  </div>
                  {f.decisionNote && <p className="text-sm text-brand-muted mt-3 pt-3 border-t border-white/5">{f.decisionNote}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Payment History</h2>
            <div className="card divide-y divide-white/5">
              {payments.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-brand-white font-medium truncate">{paymentMethodLabel(p.method)} · {p.entityType.toLowerCase()}</p>
                    <p className="text-xs text-brand-muted">{p.receiptNumber || p.txRef} · {formatEAT(p.createdAt, 'PP p')}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-brand-white font-semibold">{formatUGX(p.amountUgx)}</p>
                    <p className={`text-xs font-medium ${PAY_STYLE[p.status] || 'text-brand-silver'}`}>{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-brand-gold" /> Recent Notifications</h2>
            <div className="card divide-y divide-white/5">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 flex items-start gap-3">
                  <span className="text-[10px] uppercase tracking-wider text-brand-gold bg-brand-gold/10 rounded px-2 py-1 mt-0.5 shrink-0">{n.channel}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-brand-white truncate">{n.subject || n.body}</p>
                    <p className="text-xs text-brand-muted">{formatEAT(n.createdAt, 'PP p')} · {n.status.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {hasNothing && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-brand-muted" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-white mb-2">Ready for Your Next Adventure?</h2>
            <p className="text-brand-silver mb-6">You have no rentals, purchases or reservations yet.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/hire" className="btn">Browse Rental Fleet <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/cars" className="btn-outline">Shop Cars for Sale</Link>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  )
}

function StatTile({ label, value, icon: Icon }: { label: string; value: number; icon: typeof ShoppingBag }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-brand-gold" />
        <p className="text-xs text-brand-muted uppercase tracking-wider">{label}</p>
      </div>
      <p className="font-display text-3xl font-bold text-brand-white">{value}</p>
    </div>
  )
}
