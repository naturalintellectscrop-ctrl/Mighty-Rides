import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { processPayment } from '@/lib/services/payment-service'
import { notifyCustomer, notifyAdmin } from '@/lib/services/notification-service'
import { reservationNumber } from '@/lib/references'
import { formatUGX } from '@/lib/utils'
import type { PaymentMethod } from '@/lib/payment-methods'

const HOLD_HOURS = 48

async function getAdminEmail(): Promise<string | undefined> {
  const s = await db.setting.findUnique({ where: { key: 'notification_email' } })
  return s?.value || undefined
}

// POST — reserve a vehicle (optional refundable hold fee) without buying.
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { vehicleId, customerName, customerEmail, customerPhone, holdFeeUgx, method, demoOutcome } = data

    if (!vehicleId || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId } })
    if (!vehicle) {
      return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 })
    }

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null

    let photos: string[] = []
    try { photos = vehicle.photos ? JSON.parse(vehicle.photos) : [] } catch { /* ignore */ }

    const ref = reservationNumber()
    const expiresAt = new Date(Date.now() + HOLD_HOURS * 60 * 60 * 1000)
    const fee = Number(holdFeeUgx) > 0 ? Number(holdFeeUgx) : 0

    const reservation = await db.reservation.create({
      data: {
        reservationRef: ref,
        userId,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleSlug: vehicle.slug,
        vehicleImage: photos[0] ?? null,
        customerName,
        customerEmail,
        customerPhone,
        holdFeeUgx: fee,
        paymentStatus: 'NONE',
        status: 'ACTIVE',
        expiresAt,
      },
    })

    // Optional hold-fee payment.
    let payment: Awaited<ReturnType<typeof processPayment>> | null = null
    if (fee > 0 && method) {
      payment = await processPayment({
        amountUgx: fee,
        method: method as PaymentMethod,
        entityType: 'RESERVATION',
        entityId: reservation.id,
        entityRef: ref,
        userId,
        customer: { name: customerName, email: customerEmail, phone: customerPhone },
        meta: demoOutcome ? { demoOutcome } : undefined,
      })
      await db.reservation.update({
        where: { id: reservation.id },
        data: {
          paymentStatus: payment.success ? 'PAID' : 'FAILED',
          transactionRef: payment.txRef,
        },
      })
    }

    // A reservation is created regardless of the optional fee outcome.
    const notifications = await notifyCustomer({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      userId,
      subject: `Reservation confirmed — ${ref}`,
      message: `Hi ${customerName}, we're holding the ${vehicle.name} for you until ${expiresAt.toUTCString()}. Reservation ${ref}.${fee > 0 ? ` Hold fee ${formatUGX(fee)}.` : ''}`,
      entityType: 'RESERVATION',
      entityId: reservation.id,
    })

    await notifyAdmin({
      adminEmail: await getAdminEmail(),
      subject: `New reservation — ${ref}`,
      message: `${customerName} reserved ${vehicle.name} (holds until ${expiresAt.toUTCString()}).`,
      entityType: 'RESERVATION',
      entityId: reservation.id,
    })

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        reservationRef: ref,
        status: 'ACTIVE',
        expiresAt: expiresAt.toISOString(),
        holdFeeUgx: fee,
        vehicleName: vehicle.name,
        vehicleImage: photos[0] ?? null,
      },
      payment: payment
        ? { status: payment.status, method: payment.method, txRef: payment.txRef, receiptNumber: payment.receiptNumber, provider: payment.provider }
        : null,
      notifications,
    })
  } catch (error) {
    console.error('[RESERVATION] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create reservation' }, { status: 500 })
  }
}
