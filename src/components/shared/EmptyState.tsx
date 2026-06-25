// ============================================================================
// EMPTY STATE COMPONENTS
// Displayed when queries return zero results
// ============================================================================

import Link from 'next/link'
import { 
  Car, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Search, 
  Users,
  Inbox,
  ShoppingBag,
  LucideIcon
} from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-brand-surface-2 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8 text-brand-muted" />
      </div>
      <h3 className="font-display text-xl font-bold text-brand-white mb-2">
        {title}
      </h3>
      <p className="text-brand-silver max-w-md mx-auto mb-6">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// Pre-built empty states for common scenarios

export function NoVehiclesFound() {
  return (
    <EmptyState
      icon={Car}
      title="No Vehicles Found"
      description="We couldn't find any vehicles matching your criteria. Try adjusting your filters or browse our full inventory."
      actionLabel="View All Vehicles"
      actionHref="/cars"
    />
  )
}

export function NoRentalsAvailable() {
  return (
    <EmptyState
      icon={Calendar}
      title="No Vehicles Available"
      description="No vehicles are currently available for this occasion. Check back later or browse our full rental fleet."
      actionLabel="View All Rentals"
      actionHref="/hire"
    />
  )
}

export function NoActiveRentals() {
  return (
    <EmptyState
      icon={Car}
      title="No Active Rentals"
      description="You don't have any active rentals right now. Ready for your next adventure?"
      actionLabel="Browse Rental Fleet"
      actionHref="/hire"
    />
  )
}

export function NoRentalHistory() {
  return (
    <EmptyState
      icon={Calendar}
      title="No Rental History"
      description="You haven't completed any rentals yet. Your completed rentals will appear here."
      actionLabel="Browse Rental Fleet"
      actionHref="/hire"
    />
  )
}

export function NoComplaints() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No Complaints"
      description="You haven't submitted any complaints. We hope everything has been smooth!"
    />
  )
}

export function NoInquiries() {
  return (
    <EmptyState
      icon={Inbox}
      title="No Inquiries"
      description="There are no inquiries to display at the moment."
    />
  )
}

export function NoBookings() {
  return (
    <EmptyState
      icon={Calendar}
      title="No Bookings"
      description="There are no bookings to display."
    />
  )
}

export function NoRentees() {
  return (
    <EmptyState
      icon={Users}
      title="No Rentees"
      description="No registered rentees yet. New customers will appear here when they register."
    />
  )
}

export function NoBlogPosts() {
  return (
    <EmptyState
      icon={FileText}
      title="No Posts Yet"
      description="Check back soon for insights and guides on premium vehicles."
      actionLabel="Visit Homepage"
      actionHref="/"
    />
  )
}

export function NoSearchResults() {
  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description="We couldn't find anything matching your search. Try different keywords."
    />
  )
}

export function NoSales() {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="No Sales Recorded"
      description="Mark vehicles as sold from the Fleet Board to track sales here."
      actionLabel="Go to Fleet Board"
      actionHref="/admin/fleet"
    />
  )
}
