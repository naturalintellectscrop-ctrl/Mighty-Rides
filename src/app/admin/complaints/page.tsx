import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AlertCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react'

// ============================================================================
// ADMIN COMPLAINTS INBOX
// ============================================================================

async function getComplaints() {
  const complaints = await db.complaint.findMany({
    include: {
      user: {
        select: { full_name: true, email: true, phone: true },
      },
      booking: {
        select: { booking_ref: true, vehicle: { select: { name: true } } },
      },
    },
    orderBy: [
      { urgency: 'desc' },
      { created_at: 'desc' },
    ],
  })
  return complaints
}

const urgencyConfig = {
  LOW: { label: 'Low', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  URGENT: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-400/10' },
}

const statusConfig = {
  OPEN: { label: 'Open', color: 'text-amber-400', icon: AlertCircle },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-400', icon: Clock },
  RESOLVED: { label: 'Resolved', color: 'text-green-400', icon: CheckCircle },
}

const typeLabels: Record<string, string> = {
  VEHICLE_CONDITION: 'Vehicle Condition',
  BILLING: 'Billing',
  SERVICE: 'Service',
  STAFF: 'Staff Conduct',
  OTHER: 'Other',
}

export default async function AdminComplaintsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const complaints = await getComplaints()

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-white mb-1">
              Complaints Inbox
            </h1>
            <p className="text-brand-silver text-sm">
              Manage and resolve customer complaints
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-silver">
              {complaints.filter(c => c.status === 'OPEN').length} open
            </span>
            <span className="text-sm text-red-400">
              {complaints.filter(c => c.urgency === 'URGENT' && c.status !== 'RESOLVED').length} urgent
            </span>
          </div>
        </div>

        {/* Urgent Alert */}
        {complaints.filter(c => c.urgency === 'URGENT' && c.status !== 'RESOLVED').length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 font-medium">
                {complaints.filter(c => c.urgency === 'URGENT' && c.status !== 'RESOLVED').length} urgent complaint(s) require immediate attention
              </p>
            </div>
          </div>
        )}

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <div className="card p-12 text-center">
            <MessageSquare className="w-12 h-12 text-brand-muted mx-auto mb-4" />
            <p className="text-brand-silver">No complaints</p>
            <p className="text-brand-muted text-sm mt-1">All customer issues have been resolved</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => {
              const urgency = urgencyConfig[complaint.urgency] || urgencyConfig.MEDIUM
              const status = statusConfig[complaint.status] || statusConfig.OPEN
              const StatusIcon = status.icon

              return (
                <div
                  key={complaint.id}
                  className={`card p-6 ${
                    complaint.urgency === 'URGENT' && complaint.status !== 'RESOLVED'
                      ? 'border-red-500/50'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${urgency.bg} ${urgency.color}`}>
                          {urgency.label}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-brand-surface-2 ${status.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {status.label}
                        </span>
                        <span className="text-xs text-brand-muted">
                          {typeLabels[complaint.type] || complaint.type}
                        </span>
                      </div>

                      <p className="text-brand-white text-sm mb-2">
                        {complaint.description.slice(0, 200)}
                        {complaint.description.length > 200 && '...'}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-brand-muted">
                        <span>{complaint.user.full_name}</span>
                        <span>{complaint.user.email}</span>
                        <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                        {complaint.booking && (
                          <span className="text-brand-gold">
                            Booking: {complaint.booking.booking_ref}
                          </span>
                        )}
                      </div>

                      {complaint.status === 'RESOLVED' && complaint.admin_response && (
                        <div className="mt-4 p-3 bg-green-500/10 rounded border border-green-500/20">
                          <p className="text-xs text-green-400 font-medium mb-1">Admin Response:</p>
                          <p className="text-sm text-brand-silver">{complaint.admin_response}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {complaint.status !== 'RESOLVED' && (
                        <form action={`/api/complaints/${complaint.id}/resolve`} method="POST" className="flex flex-col gap-2 w-56">
                          <textarea
                            name="admin_response"
                            rows={3}
                            placeholder="Response to the customer..."
                            className="w-full text-sm bg-[#0A0A0A] border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500"
                          />
                          <button type="submit" className="btn text-sm">
                            Resolve &amp; Notify
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
