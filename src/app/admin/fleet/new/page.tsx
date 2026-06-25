import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'
import VehicleForm, { type VehicleFormData } from '@/components/admin/VehicleForm'

const EMPTY: VehicleFormData = {
  name: '', make: '', model: '', year: '', type: 'SALE', status: 'AVAILABLE',
  plate_number: '', sale_price_ugx: '', daily_rate_ugx: '', weekly_rate_ugx: '',
  monthly_rate_ugx: '', description: '', photos: [], specs: {},
}

export default async function NewVehiclePage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-white">Add Vehicle</h1>
        <p className="text-brand-silver">Create a new fleet listing</p>
      </div>
      <VehicleForm mode="create" initial={EMPTY} />
    </AdminLayout>
  )
}
