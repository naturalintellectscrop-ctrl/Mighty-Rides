import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { formatUGX, formatEAT } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, Calendar, Car, Users, Inbox, Settings, ShoppingBag, Landmark, TrendingUp } from 'lucide-react'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0))
  const endOfToday = new Date(new Date().setHours(23, 59, 59, 999))

  const [
    activeRentals,
    pendingBookings,
    availableVehicles,
    rentedOut,
    openComplaints,
    newInquiries,
    todayPickups,
    todayReturns,
    totalOrders,
    paidOrders,
    activeReservations,
    financeApps,
    newCorporate,
    newTradeIns,
    newServiceReqs,
    revenueAgg,
    newUsersToday,
    recentOrders,
    recentFinance,
  ] = await Promise.all([
    db.booking.count({ where: { status: 'ACTIVE' } }),
    db.booking.count({ where: { status: 'PENDING' } }),
    db.vehicle.count({ where: { status: 'AVAILABLE', published: true } }),
    db.vehicle.count({ where: { status: 'RENTED_OUT' } }),
    db.complaint.count({ where: { status: 'OPEN' } }),
    db.inquiry.count({ where: { status: 'NEW' } }),
    db.booking.count({ where: { status: 'CONFIRMED', pickup_datetime: { gte: startOfToday, lt: endOfToday } } }),
    db.booking.count({ where: { status: 'ACTIVE', return_datetime: { gte: startOfToday, lt: endOfToday } } }),
    db.order.count(),
    db.order.count({ where: { paymentStatus: 'PAID' } }),
    db.reservation.count({ where: { status: 'ACTIVE' } }),
    db.financeApplication.count(),
    db.corporateInquiry.count({ where: { status: 'New' } }),
    db.tradeInRequest.count({ where: { status: 'New' } }),
    db.afterSaleRequest.count({ where: { status: 'New' } }),
    db.payment.aggregate({ _sum: { amountUgx: true }, where: { status: 'SUCCESSFUL' } }),
    db.user.count({ where: { created_at: { gte: startOfToday } } }),
    db.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    db.financeApplication.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  return {
    activeRentals, pendingBookings, availableVehicles, rentedOut, openComplaints, newInquiries,
    todayPickups, todayReturns, totalOrders, paidOrders, activeReservations, financeApps,
    newCorporate, newTradeIns, newServiceReqs,
    revenue: revenueAgg._sum.amountUgx ?? 0,
    newUsersToday, recentOrders, recentFinance,
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const stats = await getDashboardStats()

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="font-display text-2xl font-bold text-brand-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-brand-silver mb-8">Welcome back, {session.user.name}</p>

        {/* Revenue banner */}
        <div className="card p-6 mb-8 border-l-4 border-brand-gold flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-gold/10 rounded-lg"><TrendingUp className="w-6 h-6 text-brand-gold" /></div>
            <div>
              <p className="text-xs text-brand-muted uppercase tracking-wider">Revenue Processed (paid)</p>
              <p className="font-display text-3xl font-bold text-brand-white mt-0.5 tabular-nums">{formatUGX(stats.revenue)}</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="font-display text-2xl font-bold text-brand-gold tabular-nums">{stats.paidOrders}</p><p className="text-xs text-brand-muted">Vehicles Sold</p></div>
            <div><p className="font-display text-2xl font-bold text-brand-gold tabular-nums">{stats.activeReservations}</p><p className="text-xs text-brand-muted">Active Holds</p></div>
            <div><p className="font-display text-2xl font-bold text-brand-gold tabular-nums">{stats.financeApps}</p><p className="text-xs text-brand-muted">Finance Apps</p></div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Active Rentals', value: stats.activeRentals, dot: 'bg-green-500' },
            { label: 'Pending Bookings', value: stats.pendingBookings, dot: 'bg-amber-500', alert: stats.pendingBookings > 0 },
            { label: 'Vehicle Orders', value: stats.totalOrders, dot: 'bg-[#C8952A]' },
            { label: 'Reservations', value: stats.activeReservations, dot: 'bg-blue-500' },
            { label: 'Open Complaints', value: stats.openComplaints, dot: 'bg-orange-500', alert: stats.openComplaints > 0 },
            { label: 'New Inquiries', value: stats.newInquiries, dot: 'bg-sky-500', alert: stats.newInquiries > 0 },
            { label: 'Corporate Leads', value: stats.newCorporate, dot: 'bg-purple-500', alert: stats.newCorporate > 0 },
            { label: 'Trade-In Requests', value: stats.newTradeIns, dot: 'bg-teal-500', alert: stats.newTradeIns > 0 },
            { label: 'Service Requests', value: stats.newServiceReqs, dot: 'bg-cyan-500', alert: stats.newServiceReqs > 0 },
            { label: 'Available Vehicles', value: stats.availableVehicles, dot: 'bg-[#C8952A]' },
            { label: 'Rented Out', value: stats.rentedOut, dot: 'bg-red-500' },
            { label: 'New Users Today', value: stats.newUsersToday, dot: 'bg-green-500' },
          ].map((kpi) => (
            <div key={kpi.label} className="card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-brand-muted uppercase tracking-wider">{kpi.label}</p>
                <span className={`w-2 h-2 rounded-full shrink-0 ${kpi.dot}`} aria-hidden="true" />
              </div>
              <p className="font-display text-3xl font-bold mt-1 text-brand-white tabular-nums">
                {kpi.value}
              </p>
              {kpi.alert && kpi.value > 0 && (
                <p className="text-xs text-brand-gold mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Action needed
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Recent Sales & Applications */}
        {(stats.recentOrders.length > 0 || stats.recentFinance.length > 0) && (
          <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-brand-gold" /> Recent Purchases</h2>
              <div className="card divide-y divide-white/5">
                {stats.recentOrders.length === 0 && <p className="p-4 text-sm text-brand-muted">No purchases yet.</p>}
                {stats.recentOrders.map((o) => (
                  <div key={o.id} className="row-hover p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-brand-white font-medium truncate">{o.vehicleName}</p>
                      <p className="text-xs text-brand-muted">{o.orderRef} · {o.customerName} · {formatEAT(o.createdAt, 'PP')}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-brand-gold font-semibold tabular-nums">{formatUGX(o.amountUgx)}</p>
                      <p className={`text-xs font-medium ${o.paymentStatus === 'PAID' ? 'text-green-700' : 'text-amber-700'}`}>{o.paymentStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-brand-white mb-4 flex items-center gap-2"><Landmark className="w-4 h-4 text-brand-gold" /> Recent Finance Applications</h2>
              <div className="card divide-y divide-white/5">
                {stats.recentFinance.length === 0 && <p className="p-4 text-sm text-brand-muted">No applications yet.</p>}
                {stats.recentFinance.map((f) => (
                  <div key={f.id} className="row-hover p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-brand-white font-medium truncate">{f.fullName}</p>
                      <p className="text-xs text-brand-muted">{f.applicationRef} · {f.vehicleName || 'Vehicle financing'}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-brand-gold font-semibold tabular-nums">{formatUGX(f.amountUgx)}</p>
                      <p className="text-xs text-brand-silver">{f.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Alerts */}
        {(stats.pendingBookings > 0 || stats.openComplaints > 0) && (
          <section className="mb-8">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Alerts</h2>
            <div className="space-y-3">
              {stats.pendingBookings > 0 && (
                <div className="card p-4 border-l-4 border-yellow-500 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-yellow-500" />
                    <p className="text-brand-white">
                      <span className="font-medium">{stats.pendingBookings}</span> booking{stats.pendingBookings > 1 ? 's' : ''} awaiting confirmation
                    </p>
                  </div>
                  <Link href="/admin/bookings?status=PENDING" className="text-brand-gold text-sm hover:opacity-80">
                    Review <ArrowRight className="w-4 h-4 inline" />
                  </Link>
                </div>
              )}
              {stats.openComplaints > 0 && (
                <div className="card p-4 border-l-4 border-orange-500 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <p className="text-brand-white">
                      <span className="font-medium">{stats.openComplaints}</span> open complaint{stats.openComplaints > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Link href="/admin/inquiries" className="text-brand-gold text-sm hover:opacity-80">
                    Review <ArrowRight className="w-4 h-4 inline" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Today's Summary */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-bold text-brand-white mb-4">Today&apos;s Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-surface-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted">Scheduled Pickups</p>
                  <p className="font-display text-xl font-bold text-brand-white tabular-nums">{stats.todayPickups}</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-surface-2 rounded-lg">
                  <Car className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted">Returns Due</p>
                  <p className="font-display text-xl font-bold text-brand-white tabular-nums">{stats.todayReturns}</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-surface-2 rounded-lg">
                  <Users className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted">New Registrations</p>
                  <p className="font-display text-xl font-bold text-brand-white tabular-nums">{stats.newUsersToday}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="font-display text-lg font-bold text-brand-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/fleet" className="card p-4 hover:border-brand-gold/50 transition-colors">
              <Car className="w-6 h-6 text-brand-gold mb-2" />
              <p className="text-sm text-brand-white font-medium">Manage Fleet</p>
              <p className="text-xs text-brand-muted">Add, edit, status</p>
            </Link>
            <Link href="/admin/bookings" className="card p-4 hover:border-brand-gold/50 transition-colors">
              <Calendar className="w-6 h-6 text-brand-gold mb-2" />
              <p className="text-sm text-brand-white font-medium">Bookings</p>
              <p className="text-xs text-brand-muted">Confirm, active, return</p>
            </Link>
            <Link href="/admin/inquiries" className="card p-4 hover:border-brand-gold/50 transition-colors">
              <Inbox className="w-6 h-6 text-brand-gold mb-2" />
              <p className="text-sm text-brand-white font-medium">Inquiries</p>
              <p className="text-xs text-brand-muted">All leads</p>
            </Link>
            <Link href="/admin/settings" className="card p-4 hover:border-brand-gold/50 transition-colors">
              <Settings className="w-6 h-6 text-brand-gold mb-2" />
              <p className="text-sm text-brand-white font-medium">Settings</p>
              <p className="text-xs text-brand-muted">Config, rates</p>
            </Link>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
