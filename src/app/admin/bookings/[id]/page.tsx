import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { BookingActions } from '@/components/admin/BookingActions'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Car, 
  User, 
  Phone, 
  Mail,
  FileText,
  AlertCircle,
  CreditCard,
  Calendar
} from 'lucide-react'
import { formatDateTimeEAT, formatDuration } from '@/lib/timezone'
import { formatDualPrice } from '@/lib/utils'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// ADMIN BOOKING DETAIL PAGE
// ============================================================================

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

async function getBooking(id: string) {
  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      vehicle: true,
      rentee: true,
      status_log: {
        orderBy: { created_at: 'desc' },
      },
    },
  })
  return booking
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const { id } = await params
  const booking = await getBooking(id)

  if (!booking) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-brand-silver">Booking not found</p>
          <Link href="/admin/bookings" className="text-brand-gold hover:underline mt-2 inline-block">
            Back to bookings
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const duration = formatDuration(booking.pickup_datetime, booking.return_datetime)

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-400'
      case 'CONFIRMED':
        return 'bg-blue-500/10 text-blue-400'
      case 'ACTIVE':
        return 'bg-green-500/10 text-green-400'
      case 'RETURNED':
        return 'bg-gray-500/10 text-gray-400'
      default:
        return 'bg-red-500/10 text-red-400'
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        {/* Back Link */}
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-brand-silver hover:text-brand-gold text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-2xl font-bold text-brand-white">
                {booking.booking_ref}
              </h1>
              <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusBadge(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-brand-silver">
              {booking.vehicle.name} • {duration}
            </p>
          </div>
          
          {/* Action Buttons */}
          <BookingActions bookingId={booking.id} status={booking.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Booking Details */}
          <div className="space-y-6">
            {/* Vehicle Card */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-brand-gold" />
                Vehicle
              </h2>
              <div className="flex items-start gap-4">
                {booking.vehicle.photos && (
                  <img
                    src={JSON.parse(booking.vehicle.photos)[0] || '/placeholder.jpg'}
                    alt={booking.vehicle.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="text-brand-white font-medium">{booking.vehicle.name}</p>
                  <p className="text-brand-silver text-sm">{booking.vehicle.plate_number}</p>
                  <Link
                    href={`/admin/fleet`}
                    className="text-brand-gold text-sm hover:underline mt-2 inline-block"
                  >
                    View in Fleet
                  </Link>
                </div>
              </div>
            </div>

            {/* Rental Details */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-gold" />
                Rental Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-brand-muted uppercase">Pickup</p>
                    <p className="text-brand-white mt-1">
                      {formatDateTimeEAT(booking.pickup_datetime)}
                    </p>
                    {booking.pickup_location && (
                      <p className="text-brand-silver text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {booking.pickup_location}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase">Return</p>
                    <p className="text-brand-white mt-1">
                      {formatDateTimeEAT(booking.return_datetime)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border">
                  <div>
                    <p className="text-xs text-brand-muted uppercase">Driver Requested</p>
                    <p className="text-brand-white mt-1">
                      {booking.driver_requested ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase">Occasion</p>
                    <p className="text-brand-white mt-1">
                      {booking.occasion_type || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-gold" />
                Payment
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-brand-silver">Total Cost</span>
                  <span className="text-brand-white font-medium">
                    {formatDualPrice(booking.total_cost_ugx)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-silver">Deposit (30%)</span>
                  <span className={`font-medium ${booking.deposit_paid ? 'text-green-400' : 'text-yellow-400'}`}>
                    {formatDualPrice(booking.deposit_ugx)}
                    {booking.deposit_paid && ' ✓'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-brand-border">
                  <span className="text-brand-silver">Balance Due</span>
                  <span className="text-brand-gold font-medium">
                    {formatDualPrice(booking.total_cost_ugx - booking.deposit_ugx)}
                  </span>
                </div>
                {booking.payment_ref && (
                  <p className="text-xs text-brand-muted mt-2">
                    Payment Ref: {booking.payment_ref}
                  </p>
                )}
              </div>
            </div>

            {/* Handover Details (if active or returned) */}
            {(booking.status === 'ACTIVE' || booking.status === 'RETURNED') && booking.handover_notes && (
              <div className="card p-6 bg-green-500/5 border-green-500/30">
                <h2 className="font-display text-lg font-bold text-brand-white mb-4">
                  Handover Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {booking.handover_fuel && (
                    <div>
                      <p className="text-xs text-brand-muted uppercase">Fuel Level</p>
                      <p className="text-brand-white mt-1">{booking.handover_fuel}</p>
                    </div>
                  )}
                  {booking.handover_odo && (
                    <div>
                      <p className="text-xs text-brand-muted uppercase">Odometer</p>
                      <p className="text-brand-white mt-1">{booking.handover_odo} km</p>
                    </div>
                  )}
                </div>
                {booking.handover_notes && (
                  <div className="mt-4">
                    <p className="text-xs text-brand-muted uppercase">Condition Notes</p>
                    <p className="text-brand-silver mt-1 text-sm">{booking.handover_notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Rentee Details */}
          <div className="space-y-6">
            {/* Rentee Card */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-gold" />
                Rentee
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-brand-white font-medium text-lg">{booking.rentee.full_name}</p>
                  <p className="text-brand-silver text-sm">
                    Customer since {new Date(booking.rentee.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-silver">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${booking.rentee.email}`} className="hover:text-brand-gold">
                      {booking.rentee.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-brand-silver">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${booking.rentee.phone}`} className="hover:text-brand-gold">
                      {booking.rentee.phone}
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t border-brand-border">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-silver text-sm">ID Verified</span>
                    <span className={`text-sm ${booking.rentee.id_verified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {booking.rentee.id_verified ? 'Yes' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-brand-silver text-sm">Email Verified</span>
                    <span className={`text-sm ${booking.rentee.email_verified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {booking.rentee.email_verified ? 'Yes' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Notes */}
            {booking.special_notes && (
              <div className="card p-6">
                <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-gold" />
                  Special Notes
                </h2>
                <p className="text-brand-silver text-sm">{booking.special_notes}</p>
              </div>
            )}

            {/* Extension Request */}
            {booking.extension_requested && (
              <div className="card p-6 bg-yellow-500/5 border-yellow-500/30">
                <h2 className="font-display text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Extension Requested
                </h2>
                {booking.extension_req_datetime && (
                  <p className="text-brand-white">
                    New return date: {formatDateTimeEAT(booking.extension_req_datetime)}
                  </p>
                )}
                {booking.extension_reason && (
                  <p className="text-brand-silver text-sm mt-2">{booking.extension_reason}</p>
                )}
                <div className="flex gap-3 mt-4">
                  <button className="btn text-sm">Approve</button>
                  <button className="btn text-sm border-red-500/50 text-red-400">Decline</button>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-gold" />
                Status History
              </h2>
              <div className="space-y-4">
                {booking.status_log.map((log, index) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      index === 0 ? 'bg-brand-gold' : 'bg-brand-muted'
                    }`} />
                    <div>
                      <p className="text-brand-white text-sm">
                        {log.old_status} → {log.new_status}
                      </p>
                      <p className="text-brand-muted text-xs">
                        {formatDateTimeEAT(log.created_at)}
                      </p>
                      {log.note && (
                        <p className="text-brand-silver text-xs mt-1">{log.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-brand-white mb-4">
                Internal Notes
              </h2>
              <textarea
                placeholder="Add notes (only visible to admins)..."
                className="w-full bg-brand-surface-2 border border-brand-border rounded-lg p-3 text-brand-silver text-sm resize-none h-24"
                defaultValue={booking.admin_notes || ''}
              />
              <button className="btn text-sm mt-3">Save Notes</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
