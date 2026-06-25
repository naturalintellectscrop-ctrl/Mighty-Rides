'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Car, Fuel, Gauge, FileText } from 'lucide-react'

interface BookingActionsProps {
  bookingId: string
  status: string
}

export function BookingActions({ bookingId, status }: BookingActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showHandoverForm, setShowHandoverForm] = useState(false)
  const [handover, setHandover] = useState({
    fuel: '',
    odo: '',
    notes: '',
  })

  const canConfirm = status === 'PENDING'
  const canActivate = status === 'CONFIRMED'
  const canReturn = status === 'ACTIVE'
  const canDecline = status === 'PENDING' || status === 'CONFIRMED'

  const handleAction = async (action: string, data?: Record<string, unknown>) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, ...data }),
      })

      const result = await response.json()

      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to update booking')
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking')
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async () => {
    if (!handover.fuel || !handover.odo) {
      alert('Please fill in fuel level and odometer reading')
      return
    }
    await handleAction('ACTIVE', {
      handover_fuel: handover.fuel,
      handover_odo: handover.odo,
      handover_notes: handover.notes,
    })
  }

  return (
    <div className="space-y-4">
      {/* Main Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {canConfirm && (
          <button
            onClick={() => handleAction('CONFIRMED')}
            disabled={loading}
            className="btn flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Confirm
          </button>
        )}
        
        {canActivate && !showHandoverForm && (
          <button
            onClick={() => setShowHandoverForm(true)}
            disabled={loading}
            className="btn flex items-center gap-2"
          >
            <Car className="w-4 h-4" />
            Mark Active
          </button>
        )}
        
        {canReturn && (
          <button
            onClick={() => handleAction('RETURNED')}
            disabled={loading}
            className="btn flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark Returned
          </button>
        )}
        
        {canDecline && (
          <button
            onClick={() => handleAction('DECLINED')}
            disabled={loading}
            className="btn flex items-center gap-2 border-red-500/50 text-red-400 hover:border-red-500"
          >
            <X className="w-4 h-4" />
            Decline
          </button>
        )}
      </div>

      {/* Handover Form (shown when activating) */}
      {showHandoverForm && (
        <div className="card p-6 bg-green-500/5 border-green-500/30 mt-4">
          <h3 className="font-display text-lg font-bold text-brand-white mb-4">
            Handover Checklist
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fuel" className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-brand-gold" />
                Fuel Level
              </label>
              <select
                id="fuel"
                value={handover.fuel}
                onChange={(e) => setHandover({ ...handover, fuel: e.target.value })}
                className="mt-1"
              >
                <option value="">Select fuel level</option>
                <option value="empty">Empty</option>
                <option value="quarter">1/4 Tank</option>
                <option value="half">1/2 Tank</option>
                <option value="three_quarter">3/4 Tank</option>
                <option value="full">Full Tank</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="odo" className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-brand-gold" />
                Odometer (km)
              </label>
              <input
                id="odo"
                type="text"
                value={handover.odo}
                onChange={(e) => setHandover({ ...handover, odo: e.target.value })}
                placeholder="e.g., 45000"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-gold" />
              Condition Notes
            </label>
            <textarea
              id="notes"
              value={handover.notes}
              onChange={(e) => setHandover({ ...handover, notes: e.target.value })}
              placeholder="Any scratches, dents, or special conditions..."
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleActivate}
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Activating...' : 'Complete Handover'}
            </button>
            <button
              onClick={() => setShowHandoverForm(false)}
              className="btn border-brand-surface-2 text-brand-silver"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
