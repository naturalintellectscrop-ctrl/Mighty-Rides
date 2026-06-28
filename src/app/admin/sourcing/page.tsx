import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { ArrowRight, Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

// ============================================================================
// ADMIN SOURCING PIPELINE
// ============================================================================

async function getSourcingRequests() {
  const requests = await db.sourcingRequest.findMany({
    include: {
      inquiry: true,
    },
    orderBy: { created_at: 'desc' },
  })
  return requests
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  NEW: { label: 'New Request', color: 'bg-blue-500', icon: AlertCircle },
  IN_SEARCH: { label: 'In Search', color: 'bg-yellow-500', icon: Search },
  LOCATED: { label: 'Located', color: 'bg-green-500', icon: CheckCircle },
  PRESENTED: { label: 'Presented', color: 'bg-purple-500', icon: CheckCircle },
  CLOSED_WON: { label: 'Closed Won', color: 'bg-green-600', icon: CheckCircle },
  CLOSED_LOST: { label: 'Closed Lost', color: 'bg-red-500', icon: XCircle },
}

export default async function AdminSourcingPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const requests = await getSourcingRequests()

  // Group by status for kanban view
  const groupedRequests = requests.reduce((acc, req) => {
    const status = req.status || 'NEW'
    if (!acc[status]) acc[status] = []
    acc[status].push(req)
    return acc
  }, {} as Record<string, typeof requests>)

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-white mb-1">
              Sourcing Pipeline
            </h1>
            <p className="text-brand-silver text-sm">
              Track and manage vehicle sourcing requests
            </p>
          </div>
          <Link href="/admin/inquiries?type=SOURCING" className="text-brand-gold text-sm hover:opacity-80">
            View All Inquiries <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const statusRequests = groupedRequests[status] || []
            return (
              <div key={status} className="min-w-[250px]">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  <h3 className="text-sm font-medium text-brand-white">{config.label}</h3>
                  <span className="bg-brand-surface-2 text-brand-silver text-xs px-2 py-0.5 rounded">
                    {statusRequests.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {statusRequests.map((req) => {
                    const spec = req.vehicle_spec ? JSON.parse(req.vehicle_spec) : {}
                    return (
                      <div key={req.id} className="card p-4 cursor-pointer hover:border-brand-gold/50 transition-colors">
                        <p className="text-brand-white font-medium text-sm">
                          {spec.make || 'Any'} {spec.model || ''}
                        </p>
                        <p className="text-brand-silver text-xs mt-1">
                          {req.inquiry?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-brand-muted">
                          <Clock className="w-3 h-3" />
                          {new Date(req.created_at).toLocaleDateString()}
                        </div>
                        {req.budget_ugx && (
                          <p className="text-brand-gold text-xs mt-2">
                            Budget: UGX {(req.budget_ugx / 1000000).toFixed(1)}M
                          </p>
                        )}
                      </div>
                    )
                  })}
                  
                  {statusRequests.length === 0 && (
                    <div className="card p-4 text-center text-brand-muted text-xs">
                      No requests
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Table View */}
        <div className="mt-12">
          <h2 className="font-display text-lg font-bold text-brand-white mb-4">
            All Requests
          </h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-surface-2">
                  <tr>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Client</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Vehicle Spec</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Budget</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Timeline</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {requests.map((req) => {
                    const spec = req.vehicle_spec ? JSON.parse(req.vehicle_spec) : {}
                    return (
                      <tr key={req.id} className="hover:bg-brand-surface/50">
                        <td className="p-4">
                          <p className="text-brand-white text-sm">{req.inquiry?.name}</p>
                          <p className="text-brand-muted text-xs">{req.inquiry?.phone}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-brand-silver text-sm">
                            {spec.type || ''} {spec.make || ''} {spec.model || ''}
                          </p>
                          <p className="text-brand-muted text-xs">
                            {spec.year_from || '?'} - {spec.year_to || '?'}
                          </p>
                        </td>
                        <td className="p-4 text-brand-silver text-sm">
                          {req.budget_ugx ? `UGX ${(req.budget_ugx / 1000000).toFixed(1)}M` : 'TBD'}
                        </td>
                        <td className="p-4 text-brand-silver text-sm">
                          {req.timeline || 'TBD'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            statusConfig[req.status || 'NEW']?.color || 'bg-gray-500'
                          } text-white`}>
                            {req.status || 'NEW'}
                          </span>
                        </td>
                        <td className="p-4 text-brand-muted text-sm">
                          {new Date(req.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
