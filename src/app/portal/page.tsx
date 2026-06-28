import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PortalLayout } from '@/components/portal/PortalLayout'
import { formatEAT, formatDualPrice, getDaysUntil } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, MapPin, Clock, Phone, MessageCircle } from 'lucide-react'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

async function getActiveRentals(userId: string) {
  const bookings = await db.booking.findMany({
    where: {
      rentee_id: userId,
      status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] }
    },
    include: { vehicle: true },
    orderBy: { pickup_datetime: 'asc' }
  })
  return bookings
}

async function getSettings() {
  const settings = await db.setting.findMany()
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return map
}

export default async function PortalPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role === 'ADMIN') {
    redirect('/login')
  }

  const [bookings, settings] = await Promise.all([
    getActiveRentals(session.user.id),
    getSettings()
  ])
  const whatsappNumber = settings.whatsapp_number || '256700000000'
  const activeBooking = bookings.find(b => b.status === 'ACTIVE')
  const pendingBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED')

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
        <h1 className="font-display text-3xl font-bold text-brand-white mb-2">
          Welcome back, {session.user.name?.split(' ')[0]}
        </h1>
        <p className="text-brand-silver mb-8">Manage your rentals and account</p>

        {/* Active Rental */}
        {activeBooking && (
          <section className="mb-8">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Active Rental</h2>
            <div className="card p-6 border-l-4 border-green-500">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 aspect-video bg-brand-surface-2 rounded-lg overflow-hidden">
                  {activeBooking.vehicle.photos && (
                    <Image
                      src={JSON.parse(activeBooking.vehicle.photos)[0]}
                      alt={activeBooking.vehicle.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="status-badge status-available mb-2">Active</span>
                      <h3 className="font-display text-xl font-bold text-brand-white">
                        {activeBooking.vehicle.name}
                      </h3>
                      {activeBooking.vehicle.plate_number && (
                        <p className="text-sm text-brand-silver">{activeBooking.vehicle.plate_number}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-brand-muted">Pickup</p>
                      <p className="text-brand-white">{formatEAT(activeBooking.pickup_datetime)}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted">Return</p>
                      <p className="text-brand-white">{formatEAT(activeBooking.return_datetime)}</p>
                    </div>
                  </div>

                  {activeBooking.handover_fuel && (
                    <div className="mt-4 p-3 bg-brand-surface-2 rounded-lg">
                      <p className="text-xs text-brand-muted mb-1">Condition at Handover</p>
                      <p className="text-sm text-brand-silver">
                        Fuel: {activeBooking.handover_fuel} • 
                        ODO: {activeBooking.handover_odo} km
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Return Instructions */}
              <div className="mt-6 p-4 bg-brand-surface-2 rounded-lg">
                <h4 className="font-display text-sm font-bold text-brand-white mb-2">Return Instructions</h4>
                <ul className="text-sm text-brand-silver space-y-1">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    Mirembe Business Centre, Plot 18, Lugogo Bypass
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-gold" />
                    During office hours (Mon–Sat 8am–6pm EAT)
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-brand-gold" />
                    Fuel level same as handover
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex gap-4">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi, I have a question about my rental.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Contact Mighty Rides
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Pending Bookings */}
        {pendingBookings.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Pending Bookings</h2>
            <div className="space-y-4">
              {pendingBookings.map(booking => (
                <div key={booking.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`status-badge ${
                        booking.status === 'CONFIRMED' ? 'status-reserved' : 'status-sold'
                      }`}>
                        {booking.status}
                      </span>
                      <h3 className="font-display text-lg font-bold text-brand-white mt-1">
                        {booking.vehicle.name}
                      </h3>
                      <p className="text-sm text-brand-silver">
                        Ref: {booking.booking_ref} • {formatEAT(booking.pickup_datetime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-gold font-medium">
                        {formatDualPrice(booking.total_cost_ugx)}
                      </p>
                      {booking.status === 'CONFIRMED' && (
                        <p className="text-xs text-brand-muted mt-1">Visit office to finalise</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-brand-muted" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-white mb-2">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-brand-silver mb-6">You have no active or pending rentals</p>
            <Link href="/hire" className="btn">
              Browse Rental Fleet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
