import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DollarSign, Download, TrendingUp, Calendar } from 'lucide-react'

// ============================================================================
// ADMIN SALES LOG
// ============================================================================

async function getSalesLog() {
  const sales = await db.salesLog.findMany({
    include: {
      vehicle: {
        select: { name: true, make: true, model: true },
      },
    },
    orderBy: { sale_date: 'desc' },
  })
  return sales
}

async function getExchangeRate() {
  const setting = await db.setting.findUnique({
    where: { key: 'ugx_usd_rate' },
  })
  return setting ? parseFloat(setting.value) : 3700
}

export default async function AdminSalesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const [sales, rate] = await Promise.all([getSalesLog(), getExchangeRate()])

  // Calculate totals
  const totalUgx = sales.reduce((sum, sale) => sum + sale.sale_price_ugx, 0)
  const totalUsd = Math.round(totalUgx / rate)

  // Group by month
  const monthlySales = sales.reduce((acc, sale) => {
    const month = new Date(sale.sale_date).toLocaleString('default', { month: 'long', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = { count: 0, total: 0 }
    }
    acc[month].count++
    acc[month].total += sale.sale_price_ugx
    return acc
  }, {} as Record<string, { count: number; total: number }>)

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-white mb-1">
              Sales Log
            </h1>
            <p className="text-brand-silver text-sm">
              Record of all vehicle sales
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-gold/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <p className="text-xs text-brand-muted uppercase">Total Revenue</p>
                <p className="font-display text-xl font-bold text-brand-white">
                  UGX {(totalUgx / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-brand-silver">
                  ≈ USD {totalUsd.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-gold/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <p className="text-xs text-brand-muted uppercase">Vehicles Sold</p>
                <p className="font-display text-xl font-bold text-brand-white">
                  {sales.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-gold/10 rounded-lg">
                <Calendar className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <p className="text-xs text-brand-muted uppercase">This Month</p>
                <p className="font-display text-xl font-bold text-brand-white">
                  {sales.filter(s => {
                    const saleMonth = new Date(s.sale_date).getMonth()
                    const currentMonth = new Date().getMonth()
                    return saleMonth === currentMonth
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        {sales.length === 0 ? (
          <div className="card p-12 text-center">
            <DollarSign className="w-12 h-12 text-brand-muted mx-auto mb-4" />
            <p className="text-brand-silver">No sales recorded yet</p>
            <p className="text-brand-muted text-sm mt-1">
              Mark vehicles as sold from the Fleet Board
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-brand-border flex items-center justify-between">
              <span className="text-sm text-brand-silver">{sales.length} sales</span>
              <button className="text-brand-gold text-sm hover:opacity-80 flex items-center gap-1">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-surface-2">
                  <tr>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Vehicle</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Sale Date</th>
                    <th className="text-right p-4 text-xs text-brand-muted uppercase tracking-wider">Sale Price (UGX)</th>
                    <th className="text-right p-4 text-xs text-brand-muted uppercase tracking-wider">USD Equiv</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Buyer</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-brand-surface/50">
                      <td className="p-4">
                        <p className="text-brand-white">{sale.vehicle?.name || 'Unknown'}</p>
                        <p className="text-xs text-brand-muted">
                          {sale.vehicle?.make} {sale.vehicle?.model}
                        </p>
                      </td>
                      <td className="p-4 text-brand-silver text-sm">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-brand-gold font-medium">
                          {(sale.sale_price_ugx / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-brand-muted">
                          {sale.sale_price_ugx.toLocaleString()}
                        </p>
                      </td>
                      <td className="p-4 text-right text-brand-silver text-sm">
                        ${Math.round(sale.sale_price_ugx / rate).toLocaleString()}
                      </td>
                      <td className="p-4 text-brand-silver text-sm">
                        {sale.buyer_reference || '-'}
                      </td>
                      <td className="p-4 text-brand-muted text-sm">
                        {sale.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Summary */}
        {Object.keys(monthlySales).length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">
              Monthly Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(monthlySales).slice(0, 8).map(([month, data]) => (
                <div key={month} className="card p-4">
                  <p className="text-xs text-brand-muted">{month}</p>
                  <p className="font-display text-lg font-bold text-brand-white">
                    {(data.total / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-brand-silver">{data.count} sale(s)</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
