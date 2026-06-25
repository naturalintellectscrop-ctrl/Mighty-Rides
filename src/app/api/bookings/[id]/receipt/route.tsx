import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { renderToBuffer } from '@react-pdf/renderer'
import { RentalReceipt } from '@/lib/pdf/rental-receipt'

// ============================================================================
// RECEIPT DOWNLOAD API
// ============================================================================

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Download PDF receipt for a booking
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    // Fetch booking with related data
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        rentee: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Authorization check - only booking owner or ADMIN can download
    const isOwner = booking.rentee_id === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden - You do not have access to this receipt' }, { status: 403 })
    }

    // Booking must have status RETURNED to generate receipt
    if (booking.status !== 'RETURNED') {
      return NextResponse.json({ 
        error: 'Receipt can only be generated for returned bookings',
        currentStatus: booking.status 
      }, { status: 400 })
    }

    // Calculate duration in days
    const pickupDate = new Date(booking.pickup_datetime)
    const returnDate = new Date(booking.return_datetime)
    const durationMs = returnDate.getTime() - pickupDate.getTime()
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24))

    // Calculate daily rate and costs
    const dailyRate = booking.total_cost_ugx / durationDays
    const balancePaid = booking.total_cost_ugx - booking.deposit_ugx

    // Format dates for display
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const formatShortDate = (date: Date): string => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    // Prepare receipt data
    const receiptData = {
      booking_ref: booking.booking_ref,
      issued_date: formatShortDate(new Date()),
      customer: {
        name: booking.rentee.full_name,
        email: booking.rentee.email,
        phone: booking.rentee.phone,
      },
      vehicle: {
        name: booking.vehicle.name,
        plate_number: booking.vehicle.plate_number,
      },
      rental: {
        pickup_date: formatDate(booking.pickup_datetime),
        return_date: formatDate(booking.return_datetime),
        duration_days: durationDays,
        pickup_location: booking.pickup_location,
      },
      costs: {
        rental_cost_ugx: booking.total_cost_ugx,
        daily_rate_ugx: dailyRate,
        days: durationDays,
        deposit_ugx: booking.deposit_ugx,
        balance_ugx: balancePaid,
        total_ugx: booking.total_cost_ugx,
      },
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(<RentalReceipt data={receiptData} />)

    // Return PDF with download headers
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${booking.booking_ref}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error generating receipt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
