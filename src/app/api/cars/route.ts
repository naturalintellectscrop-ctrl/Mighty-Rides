import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Pagination
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 12
  const offset = (page - 1) * limit
  
  // Filters
  const make = searchParams.get('make')
  const bodyType = searchParams.get('bodyType')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const yearFrom = searchParams.get('yearFrom')
  const yearTo = searchParams.get('yearTo')
  const transmission = searchParams.get('transmission')
  const search = searchParams.get('search')

  // Build where clause
  const where: Prisma.VehicleWhereInput = {
    published: true,
    type: { in: ['SALE', 'BOTH'] },
  }

  if (make && make !== 'all') {
    where.make = { equals: make }
  }

  if (yearFrom || yearTo) {
    where.year = {}
    if (yearFrom) where.year.gte = parseInt(yearFrom, 10)
    if (yearTo) where.year.lte = parseInt(yearTo, 10)
  }

  if (minPrice || maxPrice) {
    where.sale_price_ugx = {}
    if (minPrice) {
      const minPriceNum = BigInt(minPrice)
      where.sale_price_ugx.gte = Number(minPrice)
    }
    if (maxPrice) {
      const maxPriceNum = BigInt(maxPrice)
      where.sale_price_ugx.lte = Number(maxPrice)
    }
  }

  if (transmission && transmission !== 'all') {
    // Transmission is stored in specs JSON
    where.specs = { contains: `"transmission":"${transmission}"` }
  }

  if (bodyType && bodyType !== 'all') {
    // Body type would be in specs JSON, assuming format like "body_type":"SUV"
    where.specs = { contains: `"body_type":"${bodyType}"` }
  }

  if (search) {
    where.OR = [
      { make: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  try {
    // Get total count
    const total = await db.vehicle.count({ where })
    
    // Get vehicles
    const vehicles = await db.vehicle.findMany({
      where,
      select: {
        id: true,
        name: true,
        make: true,
        model: true,
        year: true,
        slug: true,
        type: true,
        status: true,
        sale_price_ugx: true,
        photos: true,
        specs: true,
      },
      orderBy: [
        { status: 'asc' }, // SOLD items last
        { created_at: 'desc' },
      ],
      skip: offset,
      take: limit,
    })

    // Get distinct makes for filter dropdown
    const makes = await db.vehicle.findMany({
      where: {
        published: true,
        type: { in: ['SALE', 'BOTH'] },
      },
      select: { make: true },
      distinct: ['make'],
      orderBy: { make: 'asc' },
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
      makes: makes.map(m => m.make),
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}
