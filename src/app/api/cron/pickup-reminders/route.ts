// ============================================================================
// CRON JOB: Pickup Reminders
// Sends reminder emails for CONFIRMED bookings with pickup date tomorrow
// Should be called daily at 8:00 AM EAT
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { addDays, startOfDay, endOfDay, format } from 'date-fns'
import { db } from '@/lib/db'
import { sendEmail, pickupReminderTemplate } from '@/lib/email'

// Office settings (could be moved to database settings)
const OFFICE_ADDRESS = 'Mirembe Business Centre, Plot 18, Lugogo Bypass, Kampala, Uganda'
const OFFICE_HOURS = 'Monday - Saturday: 8:00 AM - 6:00 PM'

export async function GET(request: NextRequest) {
  try {
    // Verify authorization using CRON_SECRET header
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.error('[CRON] Unauthorized pickup-reminders attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[CRON] Starting pickup reminders job...')

    // Calculate tomorrow's date range in EAT
    const now = new Date()
    const tomorrowStart = startOfDay(addDays(now, 1))
    const tomorrowEnd = endOfDay(addDays(now, 1))

    // Find all CONFIRMED bookings with pickup date tomorrow
    const bookings = await db.booking.findMany({
      where: {
        status: 'CONFIRMED',
        pickup_datetime: {
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

    console.log(`[CRON] Found ${bookings.length} CONFIRMED bookings with pickup tomorrow`)

    // Send reminder emails
    const results = {
      total: bookings.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const booking of bookings) {
      try {
        // Format pickup date and time
        const pickupDate = format(booking.pickup_datetime, 'EEEE, d MMMM yyyy')
        const pickupTime = format(booking.pickup_datetime, 'h:mm a')

        // Create email using pickupReminderTemplate
        const emailData = pickupReminderTemplate(booking.rentee.email, {
          bookingRef: booking.booking_ref,
          vehicleName: booking.vehicle.name,
          pickupDate,
          pickupTime,
          officeAddress: OFFICE_ADDRESS,
          officeHours: OFFICE_HOURS,
        })

        // Send the email
        const result = await sendEmail(emailData)

        if (result.success) {
          results.sent++
          console.log(`[CRON] Sent pickup reminder to ${booking.rentee.email} for booking ${booking.booking_ref}`)
        } else {
          results.failed++
          results.errors.push(`Failed to send to ${booking.rentee.email}: ${result.error}`)
          console.error(`[CRON] Failed to send pickup reminder to ${booking.rentee.email}:`, result.error)
        }
      } catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : String(error)
        results.errors.push(`Error processing booking ${booking.booking_ref}: ${errorMessage}`)
        console.error(`[CRON] Error processing booking ${booking.booking_ref}:`, error)
      }
    }

    console.log(`[CRON] Pickup reminders complete: ${results.sent} sent, ${results.failed} failed`)

    return NextResponse.json({
      success: true,
      message: 'Pickup reminders processed',
      results: {
        total: results.total,
        sent: results.sent,
        failed: results.failed,
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
    })
  } catch (error) {
    console.error('[CRON] Pickup reminders job failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process pickup reminders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
