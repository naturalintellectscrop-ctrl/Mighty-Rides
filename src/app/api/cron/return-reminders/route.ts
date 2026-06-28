// ============================================================================
// CRON JOB: Return Reminders
// Sends reminder emails for ACTIVE bookings with return date tomorrow
// Should be called daily at 8:00 AM EAT
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { addDays, startOfDay, endOfDay, format } from 'date-fns'
import { db } from '@/lib/db'
import { sendEmail, returnReminderTemplate } from '@/lib/email'

// Office settings (could be moved to database settings)
const OFFICE_ADDRESS = 'Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala, Uganda'

export async function GET(request: NextRequest) {
  try {
    // Verify authorization using CRON_SECRET header
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.error('[CRON] Unauthorized return-reminders attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[CRON] Starting return reminders job...')

    // Calculate tomorrow's date range in EAT
    const now = new Date()
    const tomorrowStart = startOfDay(addDays(now, 1))
    const tomorrowEnd = endOfDay(addDays(now, 1))

    // Find all ACTIVE bookings with return date tomorrow
    const bookings = await db.booking.findMany({
      where: {
        status: 'ACTIVE',
        return_datetime: {
          gte: tomorrowStart,
          lte: tomorrowEnd,
        },
      },
      include: {
        rentee: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            plate_number: true,
          },
        },
      },
    })

    console.log(`[CRON] Found ${bookings.length} ACTIVE bookings with return tomorrow`)

    // Send reminder emails
    const results = {
      total: bookings.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const booking of bookings) {
      try {
        // Format return date and time
        const returnDate = format(booking.return_datetime, 'EEEE, d MMMM yyyy')
        const returnTime = format(booking.return_datetime, 'h:mm a')

        // Create email using returnReminderTemplate
        const emailData = returnReminderTemplate(booking.rentee.email, {
          bookingRef: booking.booking_ref,
          vehicleName: booking.vehicle.name,
          returnDate,
          returnTime,
          officeAddress: OFFICE_ADDRESS,
        })

        // Send the email
        const result = await sendEmail(emailData)

        if (result.success) {
          results.sent++
          console.log(`[CRON] Sent return reminder to ${booking.rentee.email} for booking ${booking.booking_ref}`)
        } else {
          results.failed++
          results.errors.push(`Failed to send to ${booking.rentee.email}: ${result.error}`)
          console.error(`[CRON] Failed to send return reminder to ${booking.rentee.email}:`, result.error)
        }
      } catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : String(error)
        results.errors.push(`Error processing booking ${booking.booking_ref}: ${errorMessage}`)
        console.error(`[CRON] Error processing booking ${booking.booking_ref}:`, error)
      }
    }

    console.log(`[CRON] Return reminders complete: ${results.sent} sent, ${results.failed} failed`)

    return NextResponse.json({
      success: true,
      message: 'Return reminders processed',
      results: {
        total: results.total,
        sent: results.sent,
        failed: results.failed,
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
    })
  } catch (error) {
    console.error('[CRON] Return reminders job failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process return reminders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
