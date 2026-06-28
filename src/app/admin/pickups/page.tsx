import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MapPin, Clock, Phone, CheckCircle, Calendar } from 'lucide-react'
import { formatEAT, isTodayEAT, isTomorrowEAT } from '@/lib/timezone'

// ============================================================================
// ADMIN PICKUPS QUEUE
// ============================================================================

async function getPickups() {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))
  
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  // Pickups = CONFIRMED bookings with pickup date today or upcoming
  const bookings = await db.booking.findMany({
    where: {
      status: 'CONFIRMED',
      pickup_datetime: {
        gte: startOfDay,
        lte: nextWeek,
      },
    },
    include: {
      vehicle: { select: { name: true, plate_number: true } },
      rentee: { select: { full_name: true, phone: true, email: true } },
    },
    orderBy: { pickup_datetime: 'asc' },
  })

  return bookings
}

async function getReturns() {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))
  
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  // Returns = ACTIVE bookings with return date today or upcoming
  const bookings = await db.booking.findMany({
    where: {
      status: 'ACTIVE',
      return_datetime: {
        gte: startOfDay,
        lte: nextWeek,
      },
    },
    include: {
      vehicle: { select: { name: true, plate_number: true } },
      rentee: { select: { full_name: true, phone: true, email: true } },
    },
    orderBy: { return_datetime: 'asc' },
  })

  return bookings
}

export default async function AdminPickupsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const [pickups, returns] = await Promise.all([getPickups(), getReturns()])

  const todayPickups = pickups.filter(b => isTodayEAT(b.pickup_datetime))
  const todayReturns = returns.filter(b => isTodayEAT(b.return_datetime))
  const upcomingPickups = pickups.filter(b => !isTodayEAT(b.pickup_datetime))
  const upcomingReturns = returns.filter(b => !isTodayEAT(b.return_datetime))

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-white mb-1">
              Pickups & Returns
            </h1>
            <p className="text-brand-silver text-sm">
              Today&apos;s scheduled pickups and returns
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-brand-gold">{todayPickups.length}</p>
              <p className="text-xs text-brand-muted">Pickups Today</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-brand-white">{todayReturns.length}</p>
              <p className="text-xs text-brand-muted">Returns Today</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Pickups */}
          <div>
            <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-gold" />
              Today&apos;s Pickups
            </h2>
            
            {todayPickups.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-brand-muted">No pickups scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayPickups.map((booking) => (
                  <div key={booking.id} className="card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-brand-white">{booking.vehicle.name}</p>
                        <p className="text-sm text-brand-silver">{booking.vehicle.plate_number}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-brand-muted">
                          <Clock className="w-3 h-3" />
                          {formatEAT(booking.pickup_datetime, { includeTime: true })}
                        </div>
                        {booking.pickup_location && (
                          <p className="text-xs text-brand-muted mt-1">
                            Location: {booking.pickup_location}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-brand-white">{booking.rentee.full_name}</p>
                        <a 
                          href={`tel:${booking.rentee.phone}`}
                          className="text-xs text-brand-gold hover:underline"
                        >
                          {booking.rentee.phone}
                        </a>
                        <div className="mt-2">
                          <form action={`/api/bookings/${booking.id}/activate`} method="POST">
                            <button type="submit" className="btn text-xs">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Mark Active
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Returns */}
          <div>
            <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-gold" />
              Today&apos;s Returns
            </h2>
            
            {todayReturns.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-brand-muted">No returns scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayReturns.map((booking) => (
                  <div key={booking.id} className="card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-brand-white">{booking.vehicle.name}</p>
                        <p className="text-sm text-brand-silver">{booking.vehicle.plate_number}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-brand-muted">
                          <Clock className="w-3 h-3" />
                          Return by: {formatEAT(booking.return_datetime, { includeTime: true })}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-brand-white">{booking.rentee.full_name}</p>
                        <a 
                          href={`tel:${booking.rentee.phone}`}
                          className="text-xs text-brand-gold hover:underline"
                        >
                          {booking.rentee.phone}
                        </a>
                        <div className="mt-2">
                          <form action={`/api/bookings/${booking.id}/return`} method="POST">
                            <button type="submit" className="btn text-xs">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Mark Returned
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming */}
        {(upcomingPickups.length > 0 || upcomingReturns.length > 0) && (
          <div className="mt-12">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">
              Upcoming (Next 7 Days)
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Pickups */}
              {upcomingPickups.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-brand-silver mb-3">
                    {upcomingPickups.length} upcoming pickup(s)
                  </h3>
                  <div className="space-y-2">
                    {upcomingPickups.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="card p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-brand-white">{booking.vehicle.name}</p>
                          <p className="text-xs text-brand-muted">
                            {formatEAT(booking.pickup_datetime)}
                          </p>
                        </div>
                        <p className="text-xs text-brand-silver">{booking.rentee.full_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Returns */}
              {upcomingReturns.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-brand-silver mb-3">
                    {upcomingReturns.length} upcoming return(s)
                  </h3>
                  <div className="space-y-2">
                    {upcomingReturns.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="card p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-brand-white">{booking.vehicle.name}</p>
                          <p className="text-xs text-brand-muted">
                            {formatEAT(booking.return_datetime)}
                          </p>
                        </div>
                        <p className="text-xs text-brand-silver">{booking.rentee.full_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
