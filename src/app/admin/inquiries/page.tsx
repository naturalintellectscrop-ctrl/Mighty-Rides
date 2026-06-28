import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { formatEAT } from '@/lib/utils'
import { Eye, Mail, Phone, MessageCircle } from 'lucide-react'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

async function getInquiries() {
  const inquiries = await db.inquiry.findMany({
    include: {
      vehicle: { select: { name: true } }
    },
    orderBy: { created_at: 'desc' },
    take: 100
  })
  return inquiries
}

const inquiryTypeLabels: Record<string, string> = {
  PURCHASE: 'Vehicle Purchase',
  CONCIERGE: 'Private Concierge',
  CORPORATE: 'Corporate',
  SERVICE: 'Service/Parts',
  SOURCING: 'Vehicle Sourcing',
  GENERAL: 'General',
}

export default async function InquiriesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const inquiries = await getInquiries()

  const statusCounts = {
    NEW: inquiries.filter(i => i.status === 'NEW').length,
    CONTACTED: inquiries.filter(i => i.status === 'CONTACTED').length,
    CLOSED: inquiries.filter(i => i.status === 'CLOSED').length,
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="font-display text-2xl font-bold text-brand-white mb-2">Inquiries</h1>
        <p className="text-brand-silver mb-8">All leads from website forms</p>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'ALL', label: 'All', count: inquiries.length },
            { key: 'NEW', label: 'New', count: statusCounts.NEW },
            { key: 'CONTACTED', label: 'Contacted', count: statusCounts.CONTACTED },
            { key: 'CLOSED', label: 'Closed', count: statusCounts.CLOSED },
          ].map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab.key === 'ALL'
                  ? 'bg-brand-gold text-brand-black'
                  : 'bg-brand-surface text-brand-silver hover:text-brand-white'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 bg-brand-black/20 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {inquiries.map(inquiry => (
            <div 
              key={inquiry.id} 
              className={`card p-4 ${inquiry.status === 'NEW' ? 'border-l-4 border-brand-gold' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-brand-surface-2 rounded text-xs text-brand-gold">
                      {inquiryTypeLabels[inquiry.type] || inquiry.type}
                    </span>
                    <span className={`text-xs ${
                      inquiry.status === 'NEW' ? 'text-brand-gold' :
                      inquiry.status === 'CONTACTED' ? 'text-yellow-500' : 'text-brand-muted'
                    }`}>
                      {inquiry.status}
                    </span>
                    {inquiry.vehicle && (
                      <span className="text-xs text-brand-silver">
                        Vehicle: {inquiry.vehicle.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-brand-white font-medium">{inquiry.name}</p>
                      <p className="text-sm text-brand-silver">{inquiry.email}</p>
                      <p className="text-sm text-brand-silver">{inquiry.phone}</p>
                    </div>
                    <div>
                      {inquiry.message && (
                        <p className="text-sm text-brand-silver line-clamp-2">
                          {inquiry.message}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-brand-muted">
                      {formatEAT(inquiry.created_at)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="p-2 bg-brand-surface-2 rounded hover:bg-brand-surface"
                    title="Call"
                  >
                    <Phone className="w-4 h-4 text-brand-silver" />
                  </a>
                  <a
                    href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-brand-surface-2 rounded hover:bg-brand-surface"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-green-500" />
                  </a>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="p-2 bg-brand-surface-2 rounded hover:bg-brand-surface"
                    title="Email"
                  >
                    <Mail className="w-4 h-4 text-brand-silver" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
