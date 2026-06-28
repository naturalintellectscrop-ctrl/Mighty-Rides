'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDualPrice } from '@/lib/utils'
import { Plus, MoreVertical, Loader2, Check } from 'lucide-react'

interface Vehicle {
  id: string
  name: string
  year: number
  plate_number: string | null
  status: string
  type: string
  sale_price_ugx: number | null
  daily_rate_ugx: number | null
  photos: string | null
}

interface FleetClientProps {
  vehicles: Vehicle[]
}

export default function FleetClient({ vehicles }: FleetClientProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)

  const handleStatusChange = async (vehicleId: string, newStatus: string) => {
    setUpdatingId(vehicleId)
    setSuccessId(null)
    
    try {
      const response = await fetch(`/api/admin/fleet/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) throw new Error('Failed to update status')
      
      setSuccessId(vehicleId)
      router.refresh()
      
      // Clear success indicator after 2 seconds
      setTimeout(() => setSuccessId(null), 2000)
    } catch (error) {
      console.error('Failed to update vehicle status:', error)
      alert('Failed to update status. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500/20 text-green-500 border-green-500/30'
      case 'RESERVED':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      case 'RENTED_OUT':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'IN_SERVICE':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'SOLD':
        return 'bg-gray-600/20 text-gray-500 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Fleet Board</h1>
          <p className="text-brand-silver">{vehicles.length} vehicles in database</p>
        </div>
        <Link href="/admin/fleet/new" className="btn">
          <Plus className="w-4 h-4" /> Add Vehicle
        </Link>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {[
          { status: 'AVAILABLE', count: vehicles.filter(v => v.status === 'AVAILABLE').length },
          { status: 'RESERVED', count: vehicles.filter(v => v.status === 'RESERVED').length },
          { status: 'RENTED_OUT', count: vehicles.filter(v => v.status === 'RENTED_OUT').length },
          { status: 'IN_SERVICE', count: vehicles.filter(v => v.status === 'IN_SERVICE').length },
          { status: 'SOLD', count: vehicles.filter(v => v.status === 'SOLD').length },
        ].map(item => (
          <div key={item.status} className={`card p-3 sm:p-4 text-center border ${getStatusColor(item.status)}`}>
            <p className="text-xl sm:text-2xl font-bold">{item.count}</p>
            <p className="text-[10px] sm:text-xs mt-1">{item.status.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {vehicles.map(vehicle => {
          const photos = vehicle.photos ? JSON.parse(vehicle.photos) : []
          const isUpdating = updatingId === vehicle.id
          const isSuccess = successId === vehicle.id
          
          return (
            <div key={vehicle.id} className="card overflow-hidden group flex flex-col">
              <div className="relative aspect-video bg-brand-surface-2">
                {photos[0] ? (
                  <Image
                    src={photos[0]}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-brand-muted">No photo</span>
                  </div>
                )}
                <span className={`absolute top-2 right-2 status-badge text-[10px] ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
                <span className="absolute top-2 left-2 text-[10px] px-2 py-1 bg-brand-black/80 rounded text-brand-silver">
                  {vehicle.type}
                </span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-display text-base sm:text-lg font-bold text-brand-white truncate">
                  {vehicle.name}
                </h3>
                <p className="text-xs text-brand-muted">
                  {vehicle.year} • {vehicle.plate_number || 'No plate'}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  {vehicle.sale_price_ugx ? (
                    <p className="text-brand-gold text-sm font-medium">
                      {formatDualPrice(vehicle.sale_price_ugx)}
                    </p>
                  ) : vehicle.daily_rate_ugx ? (
                    <p className="text-brand-gold text-sm font-medium">
                      {formatDualPrice(vehicle.daily_rate_ugx)}/day
                    </p>
                  ) : (
                    <p className="text-brand-muted text-sm">No price set</p>
                  )}
                  
                  <Link 
                    href={`/admin/fleet/${vehicle.id}`}
                    className="p-1.5 hover:bg-brand-surface-2 rounded transition-colors"
                    title="Edit vehicle"
                  >
                    <MoreVertical className="w-4 h-4 text-brand-silver" />
                  </Link>
                </div>

                {/* Quick Status Change */}
                <div className="mt-auto pt-3 border-t border-brand-border">
                  <p className="text-[10px] text-brand-muted mb-2">Quick Status:</p>
                  <div className="flex flex-wrap gap-1">
                    {['AVAILABLE', 'RESERVED', 'RENTED_OUT', 'IN_SERVICE'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(vehicle.id, status)}
                        disabled={isUpdating}
                        className={`text-[10px] px-2 py-1 rounded transition-colors relative ${
                          vehicle.status === status
                            ? 'bg-brand-gold text-brand-black font-medium'
                            : 'bg-brand-surface-2 text-brand-silver hover:text-brand-white'
                        } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        {isUpdating && updatingId === vehicle.id ? (
                          <Loader2 className="w-3 h-3 animate-spin inline" />
                        ) : isSuccess && vehicle.status === status ? (
                          <Check className="w-3 h-3 inline" />
                        ) : (
                          status === 'RENTED_OUT' ? 'RENTED' : status.slice(0, 4)
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
