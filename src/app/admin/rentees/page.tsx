import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { formatEAT } from '@/lib/utils'
import { Eye, Mail, Phone, Ban, Check, AlertCircle } from 'lucide-react'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

async function getRentees() {
  const users = await db.user.findMany({
    where: { role: 'RENTEE' },
    orderBy: { created_at: 'desc' },
    take: 100
  })
  return users
}

export default async function RenteesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const rentees = await getRentees()

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="font-display text-2xl font-bold text-brand-white mb-2">Rentees</h1>
        <p className="text-brand-silver mb-8">Registered rental customers</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Rentees', value: rentees.length },
            { label: 'Verified', value: rentees.filter(r => r.id_verified).length },
            { label: 'Pending ID', value: rentees.filter(r => !r.id_verified).length },
            { label: 'Suspended', value: rentees.filter(r => r.account_status === 'SUSPENDED').length },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <p className="text-2xl font-bold text-brand-gold">{stat.value}</p>
              <p className="text-xs text-brand-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Rentees Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border text-left">
                <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Name</th>
                <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Email</th>
                <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Phone</th>
                <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">ID Status</th>
                <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Registered</th>
                <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs text-brand-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {rentees.map(rentee => (
                <tr key={rentee.id} className="hover:bg-brand-surface/50">
                  <td className="py-4">
                    <p className="text-brand-white font-medium">{rentee.full_name}</p>
                  </td>
                  <td className="py-4 text-sm text-brand-silver">{rentee.email}</td>
                  <td className="py-4 text-sm text-brand-silver">{rentee.phone}</td>
                  <td className="py-4">
                    {!rentee.id_type ? (
                      <span className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Missing
                      </span>
                    ) : !rentee.id_verified ? (
                      <span className="text-xs text-yellow-500">Pending</span>
                    ) : (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-sm text-brand-silver">
                    {formatEAT(rentee.created_at, 'd MMM yyyy')}
                  </td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      rentee.account_status === 'ACTIVE' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {rentee.account_status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-brand-surface-2 rounded hover:bg-brand-surface" title="View Details">
                        <Eye className="w-4 h-4 text-brand-silver" />
                      </button>
                      {rentee.account_status === 'ACTIVE' ? (
                        <button className="p-1.5 bg-red-500/20 rounded hover:bg-red-500/30" title="Suspend">
                          <Ban className="w-4 h-4 text-red-400" />
                        </button>
                      ) : (
                        <button className="p-1.5 bg-green-500/20 rounded hover:bg-green-500/30" title="Reactivate">
                          <Check className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
