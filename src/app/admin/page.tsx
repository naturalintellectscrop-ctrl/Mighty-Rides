import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { ArrowRight, TrendingUp, AlertTriangle, Calendar, Car, Users, Inbox, Settings } from 'lucide-react'

async function getDashboardStats() {
  const [
    activeRentals,
    pendingBookings,
    availableVehicles,
    rentedOut,
    openComplaints,
    newInquiries,
    todayPickups,
    todayReturns,
  ] = await Promise.all([
    db.booking.count({ where: { status: 'ACTIVE' } }),
    db.booking.count({ where: { status: 'PENDING' } }),
    db.vehicle.count({ where: { status: 'AVAILABLE', published: true } }),
    db.vehicle.count({ where: { status: 'RENTED_OUT' } }),
    db.complaint.count({ where: { status: 'OPEN' } }),
    db.inquiry.count({ where: { status: 'NEW' } }),
    db.booking.count({
      where: {
        status: 'CONFIRMED',
        pickup_datetime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    }),
    db.booking.count({
      where: {
        status: 'ACTIVE',
        return_datetime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    }),
  ])

  return {
    activeRentals,
    pendingBookings,
    availableVehicles,
    rentedOut,
    openComplaints,
    newInquiries,
    todayPickups,
    todayReturns,
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

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Active Rentals', value: stats.activeRentals, color: 'text-green-500' },
            { label: 'Pending Bookings', value: stats.pendingBookings, color: 'text-yellow-500', alert: stats.pendingBookings > 0 },
            { label: 'Available Vehicles', value: stats.availableVehicles, color: 'text-brand-gold' },
            { label: 'Rented Out', value: stats.rentedOut, color: 'text-red-400' },
            { label: 'Open Complaints', value: stats.openComplaints, color: 'text-orange-500', alert: stats.openComplaints > 0 },
            { label: 'New Inquiries', value: stats.newInquiries, color: 'text-blue-400', alert: stats.newInquiries > 0 },
          ].map((kpi) => (
            <div key={kpi.label} className="card p-4">
              <p className="text-xs text-brand-muted uppercase tracking-wider">{kpi.label}</p>
              <p className={`font-display text-3xl font-bold mt-1 ${kpi.color}`}>
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
                  <p className="font-display text-xl font-bold text-brand-white">{stats.todayPickups}</p>
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
                  <p className="font-display text-xl font-bold text-brand-white">{stats.todayReturns}</p>
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
                  <p className="font-display text-xl font-bold text-brand-white">0</p>
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
