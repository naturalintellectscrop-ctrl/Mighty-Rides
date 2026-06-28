import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
type ComplaintStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED'
type ComplaintUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

// ============================================================================
// COMPLAINTS API
// ============================================================================

// GET - List complaints with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ComplaintStatus | null
    const urgency = searchParams.get('urgency') as ComplaintUrgency | null

    const whereClause: Record<string, unknown> = {}
    if (status) {
      whereClause.status = status
    }
    if (urgency) {
      whereClause.urgency = urgency
    }

    const complaints = await db.complaint.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
          },
        },
        booking: {
          select: {
            id: true,
            booking_ref: true,
            vehicle: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: [
        { urgency: 'desc' },
        { created_at: 'desc' },
      ],
    })

    return NextResponse.json(complaints)
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update complaint status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, admin_response } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing complaint ID' }, { status: 400 })
    }

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status',
        validStatuses 
      }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) {
      updateData.status = status
      if (status === 'RESOLVED') {
        updateData.resolved_at = new Date()
      }
    }
    if (admin_response !== undefined) {
      updateData.admin_response = admin_response
    }

    const updated = await db.complaint.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      complaint: updated,
    })
  } catch (error) {
    console.error('Error updating complaint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
