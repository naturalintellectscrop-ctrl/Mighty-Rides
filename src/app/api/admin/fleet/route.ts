// ============================================================================
// CREATE VEHICLE
// POST /api/admin/fleet  (admin only)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function num(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name, make, model, year, type, status, plate_number,
      sale_price_ugx, daily_rate_ugx, weekly_rate_ugx, monthly_rate_ugx,
      description, occasions, photos, specs, published, featured,
    } = body

    if (!name || !make || !model || !year) {
      return NextResponse.json(
        { error: 'Name, make, model and year are required.' },
        { status: 400 }
      )
    }

    // Unique slug derived from make/model/year.
    const base = slugify(`${make}-${model}-${year}`) || 'vehicle'
    let slug = base
    let n = 1
    while (await db.vehicle.findUnique({ where: { slug } })) {
      slug = `${base}-${++n}`
    }

    const vehicle = await db.vehicle.create({
      data: {
        name,
        make,
        model,
        year: Number(year),
        slug,
        type: type || 'SALE',
        status: status || 'AVAILABLE',
        plate_number: plate_number || null,
        sale_price_ugx: num(sale_price_ugx),
        daily_rate_ugx: num(daily_rate_ugx),
        weekly_rate_ugx: num(weekly_rate_ugx),
        monthly_rate_ugx: num(monthly_rate_ugx),
        description: description || null,
        occasions: occasions ? (typeof occasions === 'string' ? occasions : JSON.stringify(occasions)) : null,
        photos: Array.isArray(photos) ? JSON.stringify(photos) : (photos || '[]'),
        specs: typeof specs === 'object' && specs !== null ? JSON.stringify(specs) : (specs || '{}'),
        published: published !== false,
        featured: featured === true,
      },
    })

    revalidatePath('/cars')
    revalidatePath('/hire')
    revalidatePath('/')

    return NextResponse.json({ success: true, vehicle }, { status: 201 })
  } catch (error) {
    console.error('[FLEET_CREATE] Error:', error)
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 })
  }
}
