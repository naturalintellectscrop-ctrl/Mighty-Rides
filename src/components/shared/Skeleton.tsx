// ============================================================================
// LOADING SKELETON COMPONENTS
// Shimmer animation for loading states
// ============================================================================

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-brand-surface-2 rounded ${className}`} />
  )
}

// Vehicle Card Skeleton
export function VehicleCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  )
}

// Vehicle Grid Skeleton
export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Booking Row Skeleton
export function BookingRowSkeleton() {
  return (
    <tr className="border-b border-brand-border">
      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
      <td className="p-4"><Skeleton className="h-4 w-28" /></td>
      <td className="p-4"><Skeleton className="h-4 w-20" /></td>
      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
      <td className="p-4"><Skeleton className="h-6 w-20 rounded" /></td>
      <td className="p-4"><Skeleton className="h-8 w-20 rounded" /></td>
    </tr>
  )
}

// Booking Table Skeleton
export function BookingTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead className="bg-brand-surface-2">
          <tr>
            <th className="p-4"><Skeleton className="h-3 w-12" /></th>
            <th className="p-4"><Skeleton className="h-3 w-16" /></th>
            <th className="p-4"><Skeleton className="h-3 w-14" /></th>
            <th className="p-4"><Skeleton className="h-3 w-12" /></th>
            <th className="p-4"><Skeleton className="h-3 w-10" /></th>
            <th className="p-4"><Skeleton className="h-3 w-12" /></th>
            <th className="p-4"><Skeleton className="h-3 w-14" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <BookingRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// KPI Card Skeleton
export function KPICardSkeleton() {
  return (
    <div className="card p-4">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-4">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

// Blog Post Skeleton
export function BlogPostSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

// Inquiry Row Skeleton
export function InquiryRowSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    </div>
  )
}

// Full Page Skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-brand-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
