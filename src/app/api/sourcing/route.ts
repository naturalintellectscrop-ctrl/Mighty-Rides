import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface SourcingFormData {
  vehicleType: string
  preferredMake: string
  preferredModel: string
  yearFrom: string
  yearTo: string
  budgetMin: string
  budgetMax: string
  budgetCurrency: 'UGX' | 'USD'
  preferredColour: string
  transmission: string
  intendedUse: string
  timeline: string
  fullName: string
  phone: string
  email: string
  contactMethod: string
}

export async function POST(request: Request) {
  try {
    const data: SourcingFormData = await request.json()

    // Validate required fields
    const requiredFields = ['vehicleType', 'preferredMake', 'fullName', 'phone', 'email', 'timeline']
    for (const field of requiredFields) {
      if (!data[field as keyof SourcingFormData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create the inquiry
    const inquiry = await db.inquiry.create({
      data: {
        name: data.fullName,
        phone: data.phone,
        email: data.email,
        type: 'SOURCING',
        message: `Vehicle Sourcing Request: ${data.preferredMake} ${data.preferredModel} (${data.vehicleType})`,
        budget_ugx: data.budgetCurrency === 'UGX' && data.budgetMin ? Number(data.budgetMin) : null,
        timeline: data.timeline,
        contact_preference: data.contactMethod,
        status: 'NEW',
        created_at: new Date().toISOString(),
      },
    })

    // Create the sourcing request linked to the inquiry
    const vehicleSpec = {
      type: data.vehicleType,
      make: data.preferredMake,
      model: data.preferredModel,
      yearFrom: data.yearFrom,
      yearTo: data.yearTo,
      colour: data.preferredColour,
      transmission: data.transmission,
      use: data.intendedUse,
    }

    const sourcingRequest = await db.sourcingRequest.create({
      data: {
        inquiry_id: inquiry.id,
        vehicle_spec: JSON.stringify(vehicleSpec),
        budget_ugx: Number(data.budgetMin) || 0,
        timeline: data.timeline,
        status: 'NEW',
        updated_at: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      reference: inquiry.id,
      message: 'Your sourcing request has been received.',
    })
  } catch (error) {
    console.error('Sourcing form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit sourcing request' },
      { status: 500 }
    )
  }
}
