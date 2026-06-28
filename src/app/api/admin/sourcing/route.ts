import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// ============================================================================
// SOURCING API
// ============================================================================

// GET - List all sourcing requests
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const whereClause: Record<string, unknown> = {}
    if (status) {
      whereClause.status = status
    }

    const requests = await db.sourcingRequest.findMany({
      where: whereClause,
      include: {
        inquiry: true,
      },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching sourcing requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update sourcing request status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, progress_notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing request ID' }, { status: 400 })
    }

    const validStatuses = ['NEW', 'IN_SEARCH', 'LOCATED', 'PRESENTED', 'CLOSED_WON', 'CLOSED_LOST']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status',
        validStatuses 
      }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (progress_notes !== undefined) updateData.progress_notes = progress_notes

    const updated = await db.sourcingRequest.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      request: updated,
    })
  } catch (error) {
    console.error('Error updating sourcing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
