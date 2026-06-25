import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'SALE', 'HIRE', 'BOTH'
    const make = searchParams.get('make')
    const status = searchParams.get('status')
    const published = searchParams.get('published')
    const limit = searchParams.get('limit')
    const occasion = searchParams.get('occasion')

    const where: Record<string, unknown> = {}

    // Filter by type (SALE, HIRE, or BOTH)
    if (type) {
      if (type === 'SALE') {
        where.OR = [
          { type: 'SALE' },
          { type: 'BOTH' }
        ]
      } else if (type === 'HIRE') {
        where.OR = [
          { type: 'HIRE' },
          { type: 'BOTH' }
        ]
      }
    }

    // Filter by make
    if (make) {
      where.make = { equals: make }
    }

    // Filter by status
    if (status) {
      where.status = status
    }

    // Filter by published status
    if (published !== null) {
      where.published = published === 'true'
    } else {
      // Default to published only for public API
      where.published = true
    }

    // Filter by occasion (for hire vehicles)
    if (occasion) {
      // SQLite doesn't support JSON contains, so we'll filter in memory
      // For production with PostgreSQL, we'd use JSON contains
    }

    let vehicles = await db.vehicle.findMany({
      where,
      orderBy: { created_at: 'desc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    })

    // Filter by occasion in memory (for SQLite)
    if (occasion) {
      vehicles = vehicles.filter(v => {
        try {
          const occasions = JSON.parse(v.occasions || '[]')
          return occasions.includes(occasion)
        } catch {
          return false
        }
      })
    }

    // Parse JSON fields
    const parsedVehicles = vehicles.map(v => ({
      ...v,
      photos: JSON.parse(v.photos || '[]'),
      specs: JSON.parse(v.specs || '{}'),
      occasions: JSON.parse(v.occasions || '[]'),
      sale_price_ugx: v.sale_price_ugx?.toString(),
      daily_rate_ugx: v.daily_rate_ugx?.toString(),
      weekly_rate_ugx: v.weekly_rate_ugx?.toString(),
      monthly_rate_ugx: v.monthly_rate_ugx?.toString(),
    }))

    return NextResponse.json({ vehicles: parsedVehicles })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}
