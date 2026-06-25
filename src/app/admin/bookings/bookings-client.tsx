'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatEAT, formatDualPrice } from '@/lib/utils'
import { Check, X, Eye, Loader2 } from 'lucide-react'

interface Booking {
  id: string
  booking_ref: string
  status: string
  pickup_datetime: Date
  return_datetime: Date
  total_cost_ugx: number
  rentee: { full_name: string; email: string; phone: string }
  vehicle: { name: string; plate_number: string | null }
}

interface BookingsClientProps {
  bookings: Booking[]
}

export default function BookingsClient({ bookings: initialBookings }: BookingsClientProps) {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const statusCounts = {
    PENDING: initialBookings.filter(b => b.status === 'PENDING').length,
    CONFIRMED: initialBookings.filter(b => b.status === 'CONFIRMED').length,
    ACTIVE: initialBookings.filter(b => b.status === 'ACTIVE').length,
    RETURNED: initialBookings.filter(b => b.status === 'RETURNED').length,
    CANCELLED: initialBookings.filter(b => ['CANCELLED', 'DECLINED'].includes(b.status)).length,
  }

  const filteredBookings = activeFilter === 'ALL' 
    ? initialBookings 
    : initialBookings.filter(b => b.status === activeFilter)

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId)
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) throw new Error('Failed to update status')
      
      router.refresh()
    } catch (error) {
      console.error('Failed to update booking status:', error)
      alert('Failed to update status. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-2xl font-bold text-brand-white mb-2">Bookings</h1>
      <p className="text-brand-silver mb-8">Manage all rental bookings</p>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'ALL', label: 'All', count: initialBookings.length },
          { key: 'PENDING', label: 'Pending', count: statusCounts.PENDING },
          { key: 'CONFIRMED', label: 'Confirmed', count: statusCounts.CONFIRMED },
          { key: 'ACTIVE', label: 'Active', count: statusCounts.ACTIVE },
          { key: 'RETURNED', label: 'Returned', count: statusCounts.RETURNED },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === tab.key
                ? 'bg-brand-gold text-brand-black'
                : 'bg-brand-surface text-brand-silver hover:text-brand-white'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-brand-black/20 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border text-left">
              <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Ref</th>
              <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Rentee</th>
              <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Vehicle</th>
              <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Pickup</th>
              <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Return</th>
              <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Total</th>
              <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Status</th>
              <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filteredBookings.map(booking => {
              const isUpdating = updatingId === booking.id
              
              return (
                <tr key={booking.id} className="hover:bg-brand-surface/50">
                  <td className="py-4">
                    <span className="text-brand-white font-mono text-sm">{booking.booking_ref}</span>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="text-brand-white text-sm">{booking.rentee.full_name}</p>
                      <p className="text-xs text-brand-muted">{booking.rentee.phone}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="text-brand-white text-sm">{booking.vehicle.name}</p>
                      <p className="text-xs text-brand-muted">{booking.vehicle.plate_number}</p>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-brand-silver">
                    {formatEAT(booking.pickup_datetime, 'd MMM, h:mm a')}
                  </td>
                  <td className="py-4 text-sm text-brand-silver">
                    {formatEAT(booking.return_datetime, 'd MMM, h:mm a')}
                  </td>
                  <td className="py-4 text-sm text-brand-gold">
                    {formatDualPrice(booking.total_cost_ugx)}
                  </td>
                  <td className="py-4">
                    <span className={`status-badge ${
                      booking.status === 'ACTIVE' ? 'status-available' :
                      booking.status === 'PENDING' ? 'status-sold' :
                      booking.status === 'CONFIRMED' ? 'status-reserved' : 'status-sold'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {booking.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                            disabled={isUpdating}
                            className="p-1.5 bg-green-500/20 rounded hover:bg-green-500/30 disabled:opacity-50 transition-colors" 
                            title="Confirm"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 text-green-500" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking.id, 'DECLINED')}
                            disabled={isUpdating}
                            className="p-1.5 bg-red-500/20 rounded hover:bg-red-500/30 disabled:opacity-50 transition-colors" 
                            title="Decline"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                            ) : (
                              <X className="w-4 h-4 text-red-400" />
                            )}
                          </button>
                        </>
                      )}
                      <Link 
                        href={`/admin/bookings/${booking.id}`}
                        className="p-1.5 bg-brand-surface-2 rounded hover:bg-brand-surface transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-brand-silver" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-brand-silver">No bookings found for this filter.</p>
        </div>
      )}
    </div>
  )
}
