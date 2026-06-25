import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import FleetClient from './fleet-client'

async function getVehicles() {
  const vehicles = await db.vehicle.findMany({
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      name: true,
      year: true,
      plate_number: true,
      status: true,
      type: true,
      sale_price_ugx: true,
      daily_rate_ugx: true,
      photos: true,
    }
  })
  return vehicles
}

export default async function FleetPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const vehicles = await getVehicles()

  return (
    <AdminLayout>
      <FleetClient vehicles={vehicles} />
    </AdminLayout>
  )
}
