import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// POST /api/inquiries - Create a new inquiry
export async function POST(request: NextRequest) {
  try {
    // Check content type to determine how to parse the body
    const contentType = request.headers.get('content-type') || ''
    let body: Record<string, string>
    
    if (contentType.includes('application/json')) {
      body = await request.json()
    } else {
      // Parse form data
      const formData = await request.formData()
      body = Object.fromEntries(formData.entries()) as Record<string, string>
    }
    
    // Honeypot check
    if (body.website) {
      // Silent fail - don't tell bot it failed
      return NextResponse.json({ success: true })
    }

    const {
      type = 'GENERAL',
      name,
      phone,
      email,
      message,
      vehicle_id,
      budget,
      timeline,
      contact_preference,
      // Sourcing-specific fields
      vehicle_type,
      make,
      model,
      colour,
      year_from,
      year_to,
      transmission,
      intended_use,
      // Corporate-specific fields
      company_name,
      industry,
      fleet_size,
      duration,
      urgency,
      // Service-specific fields
      vehicle_make,
      vehicle_model,
      vehicle_year,
      service_type,
    } = body

    // Validate required fields
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, phone, and email are required' },
        { status: 400 }
      )
    }

    // Create inquiry
    const inquiry = await db.inquiry.create({
      data: {
        name,
        phone,
        email,
        type: type as 'PURCHASE' | 'CONCIERGE' | 'CORPORATE' | 'SERVICE' | 'SOURCING' | 'GENERAL',
        message: message || null,
        vehicle_id: vehicle_id || null,
        budget_ugx: budget ? parseFloat(budget.replace(/[^0-9]/g, '')) : null,
        timeline: timeline || null,
        contact_preference: contact_preference || 'WhatsApp',
        status: 'NEW',
      }
    })

    // If sourcing, create sourcing request
    if (type === 'SOURCING') {
      await db.sourcingRequest.create({
        data: {
          inquiry_id: inquiry.id,
          vehicle_spec: JSON.stringify({
            type: vehicle_type,
            make,
            model,
            colour,
            year_from,
            year_to,
            transmission,
            intended_use,
          }),
          budget_ugx: budget ? parseFloat(budget.replace(/[^0-9]/g, '')) : null,
          timeline: timeline || null,
          status: 'NEW',
        }
      })
    }

    // Check if this is a form submission (redirect on success)
    if (!contentType.includes('application/json')) {
      // Redirect to thank you page for form submissions
      return NextResponse.redirect(new URL('/contact?success=true', request.url))
    }

    return NextResponse.json({ 
      success: true, 
      id: inquiry.id,
      message: 'Thank you! We will contact you within 24 hours.'
    })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    
    // Check if this is a form submission (redirect on error)
    const reqContentType = request.headers.get('content-type') || ''
    if (!reqContentType.includes('application/json')) {
      const referer = request.headers.get('referer') || '/'
      return NextResponse.redirect(new URL(`${referer}?error=submit_failed`, request.url))
    }
    
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/inquiries - List inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    
    const where: Record<string, unknown> = {}
    if (type) where.type = type
    if (status) where.status = status

    const inquiries = await db.inquiry.findMany({
      where,
      include: {
        vehicle: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
