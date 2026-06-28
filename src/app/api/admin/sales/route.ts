import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// ============================================================================
// SALES API
// ============================================================================

// GET - List all sales records
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sales = await db.salesLog.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            make: true,
            model: true,
            year: true,
            plate_number: true,
          },
        },
      },
      orderBy: { sale_date: 'desc' },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new sale record
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vehicle_id, sale_price_ugx, buyer_reference, notes, sale_date } = body

    // Validate required fields
    if (!vehicle_id || !sale_price_ugx) {
      return NextResponse.json({ 
        error: 'Missing required fields: vehicle_id, sale_price_ugx' 
      }, { status: 400 })
    }

    // Check vehicle exists
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicle_id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Create sales log entry
    const sale = await db.salesLog.create({
      data: {
        vehicle_id,
        sale_date: sale_date ? new Date(sale_date) : new Date(),
        sale_price_ugx: parseFloat(sale_price_ugx),
        buyer_reference: buyer_reference || null,
        notes: notes || null,
      },
    })

    // Update vehicle status to SOLD
    await db.vehicle.update({
      where: { id: vehicle_id },
      data: { 
        status: 'SOLD',
        published: false,
      },
    })

    return NextResponse.json({
      success: true,
      sale,
    })
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
