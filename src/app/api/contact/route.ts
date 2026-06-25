import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isValidEmail, isValidPhone } from '@/lib/utils'
import { checkRateLimit, rateLimitResponse, getClientIp } from '@/lib/rate-limit'

// ============================================================================
// POST /api/contact - Handle contact form submissions
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 submissions per hour per IP
    const ip = getClientIp(request)
    const rateLimitResult = await checkRateLimit(
      { limiter: null, config: { limit: 5, window: '1 h' } },
      `contact:${ip}`
    )

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.reset)
    }

    const body = await request.json()
    
    // Honeypot check - reject spam bots
    if (body.website) {
      return NextResponse.json({ success: true })
    }

    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid name (at least 2 characters)' },
        { status: 400 }
      )
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      )
    }

    if (!subject || typeof subject !== 'string') {
      return NextResponse.json(
        { error: 'Please select a subject' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please enter a message (at least 10 characters)' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    }

    // Determine inquiry type based on subject
    const getInquiryType = (subject: string): 'PURCHASE' | 'CONCIERGE' | 'CORPORATE' | 'SERVICE' | 'SOURCING' | 'GENERAL' => {
      const typeMap: Record<string, 'PURCHASE' | 'CONCIERGE' | 'CORPORATE' | 'SERVICE' | 'SOURCING' | 'GENERAL'> = {
        'Vehicle Inquiry': 'PURCHASE',
        'Car Hire': 'CONCIERGE',
        'Vehicle Sourcing': 'SOURCING',
        'Corporate Services': 'CORPORATE',
        'Parts & Services': 'SERVICE',
        'General Question': 'GENERAL',
        'Feedback': 'GENERAL',
        'Other': 'GENERAL',
      }
      return typeMap[subject] || 'GENERAL'
    }

    // Create inquiry in database
    const inquiry = await db.inquiry.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        type: getInquiryType(sanitizedData.subject),
        message: `Subject: ${sanitizedData.subject}\n\n${sanitizedData.message}`,
        status: 'NEW',
      }
    })

    // In a production environment, you would:
    // 1. Send email notification to admin
    // 2. Send confirmation email to the user
    // 3. Potentially create a CRM entry

    return NextResponse.json({ 
      success: true, 
      id: inquiry.id,
      message: 'Thank you for your message! We will get back to you within 24 hours.'
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
