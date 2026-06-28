import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { 
  TrendingUp, TrendingDown, DollarSign, Car, Users, Calendar, 
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Download,
  FileText, Clock, CheckCircle, AlertTriangle
} from 'lucide-react'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// ADMIN REPORTS PAGE
// ============================================================================

async function getReportData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Current month bookings
  const currentMonthBookings = await db.booking.count({
    where: {
      created_at: { gte: startOfMonth }
    }
  })

  // Last month bookings
  const lastMonthBookings = await db.booking.count({
    where: {
      created_at: { gte: startOfLastMonth, lte: endOfLastMonth }
    }
  })

  // Active rentals
  const activeRentals = await db.booking.count({
    where: { status: 'ACTIVE' }
  })

  // Completed this month
  const completedThisMonth = await db.booking.count({
    where: {
      status: 'COMPLETED',
      updated_at: { gte: startOfMonth }
    }
  })

  // Fleet utilization
  const totalVehicles = await db.vehicle.count({ where: { published: true } })
  const rentedVehicles = await db.vehicle.count({ where: { status: 'RENTED_OUT' } })

  // New customers this month
  const newCustomers = await db.user.count({
    where: {
      role: 'CUSTOMER',
      created_at: { gte: startOfMonth }
    }
  })

  // Pending inquiries
  const pendingInquiries = await db.inquiry.count({
    where: { status: 'NEW' }
  })

  return {
    currentMonthBookings,
    lastMonthBookings,
    activeRentals,
    completedThisMonth,
    fleetUtilization: totalVehicles > 0 ? Math.round((rentedVehicles / totalVehicles) * 100) : 0,
    newCustomers,
    pendingInquiries,
  }
}

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const data = await getReportData()
  const bookingGrowth = data.lastMonthBookings > 0 
    ? Math.round(((data.currentMonthBookings - data.lastMonthBookings) / data.lastMonthBookings) * 100)
    : 0

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-white mb-2">
              Reports & Analytics
            </h1>
            <p className="text-brand-silver">Business performance overview</p>
          </div>
          <button className="btn btn-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-5 h-5 text-brand-gold" />
              {bookingGrowth >= 0 ? (
                <span className="text-green-500 text-xs flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {bookingGrowth}%
                </span>
              ) : (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3" /> {Math.abs(bookingGrowth)}%
                </span>
              )}
            </div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">This Month</p>
            <p className="font-display text-3xl font-bold text-brand-white">{data.currentMonthBookings}</p>
            <p className="text-xs text-brand-silver mt-1">Bookings</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <Car className="w-5 h-5 text-brand-gold" />
              <span className="text-brand-gold text-xs">{data.fleetUtilization}%</span>
            </div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Utilization</p>
            <p className="font-display text-3xl font-bold text-brand-white">{data.activeRentals}</p>
            <p className="text-xs text-brand-silver mt-1">Active Rentals</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-5 h-5 text-brand-gold" />
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">New Customers</p>
            <p className="font-display text-3xl font-bold text-brand-white">{data.newCustomers}</p>
            <p className="text-xs text-brand-silver mt-1">This Month</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-5 h-5 text-brand-gold" />
              {data.pendingInquiries > 0 && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Pending</p>
            <p className="font-display text-3xl font-bold text-brand-white">{data.pendingInquiries}</p>
            <p className="text-xs text-brand-silver mt-1">Inquiries</p>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-brand-white">Booking Trends</h3>
              <BarChart3 className="w-5 h-5 text-brand-silver" />
            </div>
            <div className="h-64 flex items-center justify-center border border-brand-border rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-brand-muted mx-auto mb-4" />
                <p className="text-brand-silver">Chart visualization</p>
                <p className="text-xs text-brand-muted">Integrate with charting library</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-brand-white">Revenue by Service</h3>
              <PieChart className="w-5 h-5 text-brand-silver" />
            </div>
            <div className="h-64 flex items-center justify-center border border-brand-border rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-brand-muted mx-auto mb-4" />
                <p className="text-brand-silver">Chart visualization</p>
                <p className="text-xs text-brand-muted">Integrate with charting library</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-brand-white mb-6">Quick Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/bookings" className="flex items-center gap-4 p-4 bg-brand-surface rounded-lg hover:bg-brand-surface-2 transition-colors">
              <Calendar className="w-6 h-6 text-brand-gold" />
              <div>
                <p className="font-medium text-brand-white">Booking Report</p>
                <p className="text-xs text-brand-silver">All bookings & status</p>
              </div>
            </Link>
            <Link href="/admin/fleet" className="flex items-center gap-4 p-4 bg-brand-surface rounded-lg hover:bg-brand-surface-2 transition-colors">
              <Car className="w-6 h-6 text-brand-gold" />
              <div>
                <p className="font-medium text-brand-white">Fleet Report</p>
                <p className="text-xs text-brand-silver">Vehicle status & utilization</p>
              </div>
            </Link>
            <Link href="/admin/rentees" className="flex items-center gap-4 p-4 bg-brand-surface rounded-lg hover:bg-brand-surface-2 transition-colors">
              <Users className="w-6 h-6 text-brand-gold" />
              <div>
                <p className="font-medium text-brand-white">Customer Report</p>
                <p className="text-xs text-brand-silver">Registered customers</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-8 card p-6">
          <h3 className="font-display text-lg font-bold text-brand-white mb-6">Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left py-3 px-4 text-xs text-brand-muted uppercase tracking-wider">Metric</th>
                  <th className="text-right py-3 px-4 text-xs text-brand-muted uppercase tracking-wider">Current</th>
                  <th className="text-right py-3 px-4 text-xs text-brand-muted uppercase tracking-wider">Previous</th>
                  <th className="text-right py-3 px-4 text-xs text-brand-muted uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-border/50">
                  <td className="py-3 px-4 text-brand-white">Total Bookings</td>
                  <td className="text-right py-3 px-4 text-brand-white">{data.currentMonthBookings}</td>
                  <td className="text-right py-3 px-4 text-brand-silver">{data.lastMonthBookings}</td>
                  <td className={`text-right py-3 px-4 ${bookingGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {bookingGrowth >= 0 ? '+' : ''}{bookingGrowth}%
                  </td>
                </tr>
                <tr className="border-b border-brand-border/50">
                  <td className="py-3 px-4 text-brand-white">Completed Rentals</td>
                  <td className="text-right py-3 px-4 text-brand-white">{data.completedThisMonth}</td>
                  <td className="text-right py-3 px-4 text-brand-silver">-</td>
                  <td className="text-right py-3 px-4 text-brand-silver">-</td>
                </tr>
                <tr className="border-b border-brand-border/50">
                  <td className="py-3 px-4 text-brand-white">Fleet Utilization</td>
                  <td className="text-right py-3 px-4 text-brand-white">{data.fleetUtilization}%</td>
                  <td className="text-right py-3 px-4 text-brand-silver">-</td>
                  <td className="text-right py-3 px-4 text-brand-silver">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-brand-white">New Customers</td>
                  <td className="text-right py-3 px-4 text-brand-white">{data.newCustomers}</td>
                  <td className="text-right py-3 px-4 text-brand-silver">-</td>
                  <td className="text-right py-3 px-4 text-brand-silver">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
