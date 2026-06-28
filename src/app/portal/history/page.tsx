import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PortalLayout } from '@/components/portal/PortalLayout'
import { formatEAT, formatDualPrice } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, Download, Calendar } from 'lucide-react'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

async function getRentalHistory(userId: string) {
  const bookings = await db.booking.findMany({
    where: {
      rentee_id: userId,
      status: { in: ['RETURNED', 'CANCELLED', 'DECLINED'] }
    },
    include: { vehicle: true },
    orderBy: { return_datetime: 'desc' }
  })
  return bookings
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role === 'ADMIN') {
    redirect('/login')
  }

  const bookings = await getRentalHistory(session.user.id)

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
        <h1 className="font-display text-2xl font-bold text-brand-white mb-2">Rental History</h1>
        <p className="text-brand-silver mb-8">Your past vehicle rentals</p>

        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border text-left">
                  <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Vehicle</th>
                  <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Dates</th>
                  <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Duration</th>
                  <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Total</th>
                  <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {bookings.map(booking => {
                  const days = Math.ceil(
                    (booking.return_datetime.getTime() - booking.pickup_datetime.getTime()) / (1000 * 60 * 60 * 24)
                  )
                  
                  return (
                    <tr key={booking.id} className="hover:bg-brand-surface/50">
                      <td className="py-4">
                        <div>
                          <p className="text-brand-white font-medium">{booking.vehicle.name}</p>
                          <p className="text-xs text-brand-muted">{booking.booking_ref}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-brand-silver">
                        {formatEAT(booking.pickup_datetime, 'd MMM')} - {formatEAT(booking.return_datetime, 'd MMM yyyy')}
                      </td>
                      <td className="py-4 text-sm text-brand-silver">{days} days</td>
                      <td className="py-4 text-sm text-brand-gold">{formatDualPrice(booking.total_cost_ugx)}</td>
                      <td className="py-4">
                        <span className={`status-badge ${
                          booking.status === 'RETURNED' ? 'status-available' : 'status-sold'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          {booking.status === 'RETURNED' && (
                            <button className="text-xs text-brand-gold hover:opacity-80 flex items-center gap-1">
                              <Download className="w-3 h-3" /> Receipt
                            </button>
                          )}
                          <Link
                            href={`/hire/${booking.vehicle.slug}`}
                            className="text-xs text-brand-silver hover:text-brand-gold"
                          >
                            Book Again
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-brand-muted mx-auto mb-4" />
            <p className="text-brand-silver">No rental history yet</p>
            <Link href="/hire" className="btn mt-4">
              Browse Fleet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
