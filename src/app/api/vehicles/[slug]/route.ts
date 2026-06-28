import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const vehicle = await db.vehicle.findUnique({
      where: { slug },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedVehicle = {
      ...vehicle,
      photos: JSON.parse(vehicle.photos || '[]'),
      specs: JSON.parse(vehicle.specs || '{}'),
      occasions: JSON.parse(vehicle.occasions || '[]'),
      sale_price_ugx: vehicle.sale_price_ugx?.toString(),
      daily_rate_ugx: vehicle.daily_rate_ugx?.toString(),
      weekly_rate_ugx: vehicle.weekly_rate_ugx?.toString(),
      monthly_rate_ugx: vehicle.monthly_rate_ugx?.toString(),
    }

    return NextResponse.json({ vehicle: parsedVehicle })
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}
