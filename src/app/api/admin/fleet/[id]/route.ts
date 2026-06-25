import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { logAction, AUDIT_ACTIONS, ENTITY_TYPES } from '@/lib/audit'

interface RouteParams {
  params: Promise<{ id: string }>
}

// ============================================================================
// UPDATE VEHICLE
// ============================================================================

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, featured, published, ...otherFields } = body

    // Get current vehicle for audit
    const currentVehicle = await db.vehicle.findUnique({
      where: { id },
    })

    if (!currentVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: Record<string, unknown> = { ...otherFields }
    
    if (status) updateData.status = status
    if (typeof featured === 'boolean') updateData.featured = featured
    if (typeof published === 'boolean') updateData.published = published

    // Update vehicle
    const vehicle = await db.vehicle.update({
      where: { id },
      data: updateData,
    })

    // Revalidate pages where vehicles are displayed
    if (status !== undefined) {
      // Revalidate hire pages
      revalidatePath('/hire')
      revalidatePath(`/hire/${vehicle.slug}`)
      
      // Revalidate cars pages
      revalidatePath('/cars')
      revalidatePath(`/cars/${vehicle.slug}`)
      
      // Revalidate homepage (featured vehicles)
      revalidatePath('/')
      
      // Revalidate tag for vehicle listings
      revalidateTag('vehicles', 'max')
    }

    // Log audit action
    await logAction({
      adminId: session.user.id,
      action: status ? AUDIT_ACTIONS.VEHICLE_STATUS_CHANGED : AUDIT_ACTIONS.VEHICLE_UPDATED,
      entityType: ENTITY_TYPES.VEHICLE,
      entityId: id,
      details: {
        previousStatus: currentVehicle.status,
        newStatus: status,
        slug: vehicle.slug,
      },
    })

    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// DELETE VEHICLE
// ============================================================================

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check for existing bookings
    const bookingCount = await db.booking.count({
      where: { vehicle_id: id },
    })

    if (bookingCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete vehicle with existing bookings' },
        { status: 400 }
      )
    }

    const vehicle = await db.vehicle.findUnique({
      where: { id },
      select: { slug: true },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    await db.vehicle.delete({
      where: { id },
    })

    // Revalidate pages
    revalidatePath('/hire')
    revalidatePath('/cars')
    revalidatePath('/')
    revalidateTag('vehicles', 'max')

    // Log audit action
    await logAction({
      adminId: session.user.id,
      action: AUDIT_ACTIONS.VEHICLE_DELETED,
      entityType: ENTITY_TYPES.VEHICLE,
      entityId: id,
      details: { slug: vehicle.slug },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
