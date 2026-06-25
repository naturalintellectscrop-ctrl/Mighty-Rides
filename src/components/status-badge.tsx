import { cn } from '@/lib/utils'

type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'RENTED_OUT' | 'IN_SERVICE' | 'SOLD'
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'RETURNED' | 'CANCELLED' | 'DECLINED' | 'DECLINED_REFUND_PENDING'

interface StatusBadgeProps {
  status: VehicleStatus | BookingStatus | string
  type?: 'vehicle' | 'booking'
}

const vehicleStatusConfig: Record<VehicleStatus, { label: string; className: string }> = {
  AVAILABLE: { label: 'Available', className: 'bg-[#4CAF50]/15 text-[#4CAF50]' },
  RESERVED: { label: 'Reserved', className: 'bg-[#FFC107]/15 text-[#FFC107]' },
  RENTED_OUT: { label: 'Rented Out', className: 'bg-[#F44336]/15 text-[#F44336]' },
  IN_SERVICE: { label: 'In Service', className: 'bg-[#9E9E9E]/15 text-[#9E9E9E]' },
  SOLD: { label: 'Sold', className: 'bg-[#607D8B]/15 text-[#607D8B]' },
}

const bookingStatusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-[#B0B0B0]/15 text-[#B0B0B0]' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-[#2196F3]/15 text-[#2196F3]' },
  ACTIVE: { label: 'Active', className: 'bg-[#4CAF50]/15 text-[#4CAF50]' },
  RETURNED: { label: 'Returned', className: 'bg-[#9E9E9E]/15 text-[#9E9E9E]' },
  CANCELLED: { label: 'Cancelled', className: 'bg-[#F44336]/15 text-[#F44336]' },
  DECLINED: { label: 'Declined', className: 'bg-[#cc4444]/15 text-[#cc4444]' },
  DECLINED_REFUND_PENDING: { label: 'Refund Pending', className: 'bg-[#FF9800]/15 text-[#FF9800]' },
}

export function StatusBadge({ status, type = 'vehicle' }: StatusBadgeProps) {
  const config = type === 'vehicle' 
    ? vehicleStatusConfig[status as VehicleStatus]
    : bookingStatusConfig[status as BookingStatus]

  if (!config) return null

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded text-[10px] font-label font-bold uppercase tracking-wider',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
