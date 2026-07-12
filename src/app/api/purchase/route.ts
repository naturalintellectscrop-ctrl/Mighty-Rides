import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { processPayment } from '@/lib/services/payment-service'
import { notifyCustomer, notifyAdmin } from '@/lib/services/notification-service'
import { purchaseOrderNumber, invoiceNumber } from '@/lib/references'
import { formatUGX } from '@/lib/utils'
import type { PaymentMethod } from '@/lib/payment-methods'

async function getAdminEmail(): Promise<string | undefined> {
  const s = await db.setting.findUnique({ where: { key: 'notification_email' } })
  return s?.value || undefined
}

// POST — complete a (simulated) vehicle purchase end-to-end.
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { vehicleId, customerName, customerEmail, customerPhone, method, demoOutcome } = data

    if (!vehicleId || !customerName || !customerEmail || !customerPhone || !method) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId } })
    if (!vehicle) {
      return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 })
    }

    const amountUgx = vehicle.sale_price_ugx ?? 0
    if (amountUgx <= 0) {
      return NextResponse.json({ success: false, error: 'This vehicle is not available for purchase' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null

    let photos: string[] = []
    try { photos = vehicle.photos ? JSON.parse(vehicle.photos) : [] } catch { /* ignore */ }

    const orderRef = purchaseOrderNumber()
    const invNo = invoiceNumber()

    const order = await db.order.create({
      data: {
        orderRef,
        invoiceNumber: invNo,
        userId,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleSlug: vehicle.slug,
        vehicleImage: photos[0] ?? null,
        customerName,
        customerEmail,
        customerPhone,
        amountUgx,
        method,
        paymentStatus: 'PENDING',
        status: 'PROCESSING',
      },
    })

    const pay = await processPayment({
      amountUgx,
      method: method as PaymentMethod,
      entityType: 'ORDER',
      entityId: order.id,
      entityRef: orderRef,
      userId,
      customer: { name: customerName, email: customerEmail, phone: customerPhone },
      meta: demoOutcome ? { demoOutcome } : undefined,
    })

    const newStatus = pay.success ? 'CONFIRMED' : 'PROCESSING'
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: pay.success ? 'PAID' : 'FAILED',
        transactionRef: pay.txRef,
        status: newStatus,
      },
    })

    let notifications: Awaited<ReturnType<typeof notifyCustomer>> = []
    if (pay.success) {
      // Record the sale so it flows into admin sales reporting.
      await db.salesLog
        .create({
          data: {
            vehicle_id: vehicle.id,
            sale_date: new Date(),
            sale_price_ugx: amountUgx,
            buyer_reference: orderRef,
            notes: `Purchase via ${method} (${pay.provider})`,
          },
        })
        .catch(() => { /* non-fatal */ })

      notifications = await notifyCustomer({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        userId,
        subject: `Purchase confirmed — ${orderRef}`,
        message: `Thank you ${customerName}! Your purchase of the ${vehicle.name} is confirmed. Order ${orderRef}, Invoice ${invNo}, ${formatUGX(amountUgx)}. Receipt ${pay.receiptNumber}.`,
        entityType: 'ORDER',
        entityId: order.id,
      })

      await notifyAdmin({
        adminEmail: await getAdminEmail(),
        subject: `New vehicle purchase — ${orderRef}`,
        message: `${customerName} purchased ${vehicle.name} for ${formatUGX(amountUgx)} via ${method}.`,
        entityType: 'ORDER',
        entityId: order.id,
      })
    }

    return NextResponse.json(
      {
        success: pay.success,
        order: {
          id: order.id,
          orderRef,
          invoiceNumber: invNo,
          status: newStatus,
          amountUgx,
          vehicleName: vehicle.name,
          vehicleImage: photos[0] ?? null,
        },
        payment: {
          status: pay.status,
          method: pay.method,
          txRef: pay.txRef,
          transactionId: pay.transactionId,
          receiptNumber: pay.receiptNumber,
          provider: pay.provider,
        },
        notifications,
        message: pay.message,
      },
      { status: pay.success ? 200 : 402 }
    )
  } catch (error) {
    console.error('[PURCHASE] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to process purchase' }, { status: 500 })
  }
}
