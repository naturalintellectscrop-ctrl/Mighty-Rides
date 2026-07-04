import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import VehicleForm, { type VehicleFormData } from '@/components/admin/VehicleForm'

// Auth/live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

function parsePhotos(raw: string | null): string[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function parseSpecs(raw: string | null): Record<string, string> {
  if (!raw) return {}
  try {
    const v = JSON.parse(raw)
    if (!v || typeof v !== 'object') return {}
    const out: Record<string, string> = {}
    for (const [k, val] of Object.entries(v)) {
      if (val === null || val === undefined) continue
      if (typeof val === 'object') continue
      out[k] = String(val)
    }
    return out
  } catch {
    return {}
  }
}

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const { id } = await params
  const v = await db.vehicle.findUnique({ where: { id } })
  if (!v) notFound()

  const initial: VehicleFormData = {
    id: v.id,
    name: v.name,
    make: v.make,
    model: v.model,
    year: v.year,
    type: v.type,
    status: v.status,
    plate_number: v.plate_number || '',
    sale_price_ugx: v.sale_price_ugx ?? '',
    daily_rate_ugx: v.daily_rate_ugx ?? '',
    weekly_rate_ugx: v.weekly_rate_ugx ?? '',
    monthly_rate_ugx: v.monthly_rate_ugx ?? '',
    description: v.description || '',
    photos: parsePhotos(v.photos),
    specs: parseSpecs(v.specs),
    // occasions is stored as a JSON string array — parsePhotos parses that shape.
    occasions: parsePhotos(v.occasions),
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-white">Edit Vehicle</h1>
        <p className="text-brand-silver">{v.name}</p>
      </div>
      <VehicleForm mode="edit" initial={initial} />
    </AdminLayout>
  )
}
