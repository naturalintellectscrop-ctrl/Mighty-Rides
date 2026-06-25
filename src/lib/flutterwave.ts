// ============================================================================
// FLUTTERWAVE PAYMENT INTEGRATION
// Supports: MTN Mobile Money, Airtel Money, Visa, Mastercard
// Currencies: UGX, USD
// ============================================================================

import crypto from 'crypto'

// Flutterwave configuration
const FLUTTERWAVE_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || ''
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY || ''
const FLUTTERWAVE_SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH || ''
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Flutterwave API base URL
const FLUTTERWAVE_API = 'https://api.flutterwave.com/v3'

// ============================================================================
// TYPES
// ============================================================================

export interface PaymentInitParams {
  amount: number
  currency: 'UGX' | 'USD'
  email: string
  phone?: string
  name: string
  txRef: string
  redirectUrl?: string
  meta?: Record<string, string>
}

export interface PaymentResult {
  success: boolean
  txRef?: string
  transactionId?: string
  message?: string
  paymentUrl?: string
}

export interface WebhookPayload {
  event: string
  data: {
    id: number
    tx_ref: string
    amount: number
    currency: string
    status: 'successful' | 'failed' | 'cancelled'
    payment_type: string
    created_at: string
    customer: {
      email: string
      name: string
      phone_number?: string
    }
  }
}

// ============================================================================
// PAYMENT LINK GENERATION
// ============================================================================

/**
 * Initialize a Flutterwave payment
 * Returns a payment link for redirect
 */
export async function initializePayment(
  params: PaymentInitParams
): Promise<PaymentResult> {
  try {
    const response = await fetch(`${FLUTTERWAVE_API}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: params.txRef,
        amount: params.amount,
        currency: params.currency,
        redirect_url: params.redirectUrl || `${SITE_URL}/booking/confirm`,
        customer: {
          email: params.email,
          name: params.name,
          ...(params.phone && { phonenumber: params.phone }),
        },
        customizations: {
          title: 'Mighty Rides',
          description: 'Vehicle Rental Deposit',
          logo: `${SITE_URL}/logo.png`,
        },
        meta: params.meta,
      }),
    })

    const data = await response.json()

    if (data.status === 'success') {
      return {
        success: true,
        txRef: params.txRef,
        paymentUrl: data.data.link,
      }
    }

    return {
      success: false,
      message: data.message || 'Failed to initialize payment',
    }
  } catch (error) {
    console.error('[FLUTTERWAVE] Payment init error:', error)
    return {
      success: false,
      message: 'Payment initialization failed',
    }
  }
}

// ============================================================================
// PAYMENT VERIFICATION
// ============================================================================

/**
 * Verify a payment transaction
 * Always verify on the server side using the transaction ID
 */
export async function verifyPayment(transactionId: string): Promise<{
  success: boolean
  data?: {
    txRef: string
    amount: number
    currency: string
    status: string
    paymentType: string
    createdAt: string
  }
  message?: string
}> {
  try {
    const response = await fetch(`${FLUTTERWAVE_API}/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.status === 'success' && data.data.status === 'successful') {
      return {
        success: true,
        data: {
          txRef: data.data.tx_ref,
          amount: data.data.amount,
          currency: data.data.currency,
          status: data.data.status,
          paymentType: data.data.payment_type,
          createdAt: data.data.created_at,
        },
      }
    }

    return {
      success: false,
      message: data.message || 'Payment verification failed',
    }
  } catch (error) {
    console.error('[FLUTTERWAVE] Verification error:', error)
    return {
      success: false,
      message: 'Payment verification failed',
    }
  }
}

// ============================================================================
// WEBHOOK HANDLING
// ============================================================================

/**
 * Verify a Flutterwave webhook.
 *
 * Flutterwave does NOT sign the payload. It sends the exact "Secret hash" you
 * configured in the dashboard verbatim in the `verif-hash` header. Verification
 * is a constant-time comparison of that header against FLUTTERWAVE_SECRET_HASH.
 */
export function verifyWebhookSignature(signature: string | null): boolean {
  if (!signature || !FLUTTERWAVE_SECRET_HASH) {
    return false
  }

  const provided = Buffer.from(signature)
  const expected = Buffer.from(FLUTTERWAVE_SECRET_HASH)

  // timingSafeEqual throws if the buffers differ in length — guard first.
  if (provided.length !== expected.length) {
    return false
  }

  return crypto.timingSafeEqual(provided, expected)
}

/**
 * Parse webhook payload
 */
export function parseWebhookPayload(payload: string): WebhookPayload | null {
  try {
    return JSON.parse(payload) as WebhookPayload
  } catch {
    return null
  }
}

/**
 * Handle charge completed webhook
 * This is called when a payment is successful
 */
export async function handleChargeCompleted(
  payload: WebhookPayload
): Promise<{ success: boolean; message: string }> {
  const { data } = payload

  if (data.status !== 'successful') {
    return { success: false, message: 'Payment not successful' }
  }

  // The tx_ref contains the booking ID or a reference we can use to find the booking
  const txRef = data.tx_ref

  // Import db dynamically to avoid circular deps
  const { db } = await import('./db')

  // Find the booking by payment reference or tx_ref.
  // The create flow stores `MR-<bookingRef>` as payment_ref.
  const booking = await db.booking.findFirst({
    where: {
      OR: [
        { payment_ref: txRef },
        { id: txRef },
      ],
    },
    include: { vehicle: true, rentee: true },
  })

  if (!booking) {
    console.error('[WEBHOOK] Booking not found for tx_ref:', txRef)
    return { success: false, message: 'Booking not found' }
  }

  // Idempotency: if we've already recorded this deposit, do nothing (webhooks retry).
  if (booking.deposit_paid) {
    return { success: true, message: 'Deposit already recorded' }
  }

  // Never trust the webhook payload alone — re-verify with Flutterwave server-side.
  const verification = await verifyPayment(String(data.id))
  if (!verification.success || !verification.data) {
    console.error('[WEBHOOK] Server-side verification failed for tx_ref:', txRef)
    return { success: false, message: 'Payment verification failed' }
  }

  // Currency-aware amount check. The deposit is stored in UGX; the charge may be
  // in UGX or USD (the rental flow charges the USD equivalent).
  const { amount: paidAmount, currency: paidCurrency } = verification.data
  let expectedAmount = booking.deposit_ugx
  if (paidCurrency === 'USD') {
    const rateSetting = await db.setting.findUnique({ where: { key: 'ugx_usd_rate' } })
    const rate = rateSetting ? parseFloat(rateSetting.value) : 3700
    expectedAmount = Math.round(booking.deposit_ugx / rate)
  }
  // Allow a small tolerance for rounding; reject a material underpayment.
  if (paidAmount + 1 < expectedAmount) {
    console.warn('[WEBHOOK] Deposit underpaid:', {
      bookingRef: booking.booking_ref,
      expected: expectedAmount,
      paid: paidAmount,
      currency: paidCurrency,
    })
    return { success: false, message: 'Deposit amount does not match' }
  }

  // Record the deposit.
  await db.booking.update({
    where: { id: booking.id },
    data: { deposit_paid: true, payment_ref: txRef },
  })

  await db.bookingStatusLog.create({
    data: {
      booking_id: booking.id,
      old_status: booking.status,
      new_status: booking.status,
      note: `Deposit of ${paidCurrency} ${paidAmount} paid via ${data.payment_type}`,
    },
  })

  console.log('[WEBHOOK] Deposit marked as paid for booking:', booking.booking_ref)

  // Notify the customer and admin (best-effort — never fail the webhook on email).
  try {
    const { sendBookingConfirmationEmail, sendAdminAlertEmail } = await import('./email')

    const getSetting = async (key: string, fallback: string) => {
      const s = await db.setting.findUnique({ where: { key } })
      return s?.value || fallback
    }
    const officeAddress = await getSetting('office_address', 'Kampala, Uganda')
    const officeHours = await getSetting('office_hours', 'Mon–Sat, 9:00am–6:00pm EAT')
    const adminEmail = await getSetting('notification_email', 'admin@mightyrides.com')

    const fmtDate = (d: Date) => d.toISOString().slice(0, 10)
    const fmtTime = (d: Date) => d.toISOString().slice(11, 16)

    if (booking.rentee?.email) {
      await sendBookingConfirmationEmail(booking.rentee.email, {
        bookingRef: booking.booking_ref,
        vehicleName: booking.vehicle?.name || 'Vehicle',
        plateNumber: booking.vehicle?.plate_number || undefined,
        pickupDate: fmtDate(booking.pickup_datetime),
        pickupTime: fmtTime(booking.pickup_datetime),
        returnDate: fmtDate(booking.return_datetime),
        returnTime: fmtTime(booking.return_datetime),
        pickupLocation: booking.pickup_location || undefined,
        officeAddress,
        officeHours,
      })
    }

    await sendAdminAlertEmail(adminEmail, 'new_booking', {
      bookingRef: booking.booking_ref,
      customerName: booking.rentee?.full_name || 'Customer',
      vehicleName: booking.vehicle?.name || 'Vehicle',
      amount: `${paidCurrency} ${paidAmount}`,
    })
  } catch (emailError) {
    console.error('[WEBHOOK] Failed to send notification emails:', emailError)
  }

  return { success: true, message: 'Payment processed successfully' }
}

// ============================================================================
// REFUND HANDLING
// ============================================================================

/**
 * Initiate a refund
 * Note: Actual refunds should be processed via Flutterwave dashboard
 * This is for tracking purposes
 */
export async function initiateRefund(
  transactionId: string,
  amount: number,
  reason?: string
): Promise<{ success: boolean; refundId?: string; message?: string }> {
  try {
    const response = await fetch(`${FLUTTERWAVE_API}/refunds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: parseInt(transactionId),
        amount,
        comments: reason || 'Customer refund',
      }),
    })

    const data = await response.json()

    if (data.status === 'success') {
      return {
        success: true,
        refundId: data.data.id,
      }
    }

    return {
      success: false,
      message: data.message || 'Refund initiation failed',
    }
  } catch (error) {
    console.error('[FLUTTERWAVE] Refund error:', error)
    return {
      success: false,
      message: 'Refund initiation failed',
    }
  }
}

// ============================================================================
// CLIENT-SIDE HELPERS
// ============================================================================

/**
 * Get Flutterwave public key for client-side use
 */
export function getFlutterwavePublicKey(): string {
  return FLUTTERWAVE_PUBLIC_KEY
}

/**
 * Generate inline payment configuration for Flutterwave JS SDK
 */
export function getInlinePaymentConfig(params: {
  publicKey?: string
  amount: number
  currency: 'UGX' | 'USD'
  email: string
  name: string
  phone?: string
  txRef: string
  redirectUrl?: string
  onClose?: () => void
  callback?: (response: { transaction_id: string; tx_ref: string }) => void
}) {
  return {
    public_key: params.publicKey || FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: params.txRef,
    amount: params.amount,
    currency: params.currency,
    payment_options: 'card,mobilemoneyuganda,ussd',
    redirect_url: params.redirectUrl,
    customer: {
      email: params.email,
      name: params.name,
      ...(params.phone && { phone_number: params.phone }),
    },
    customizations: {
      title: 'Mighty Rides',
      description: 'Vehicle Rental Deposit',
      logo: '/logo.png',
    },
    onclose: params.onClose,
    callback: params.callback,
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: 'UGX' | 'USD'): string {
  if (currency === 'UGX') {
    return `UGX ${amount.toLocaleString()}`
  }
  return `$${amount.toLocaleString()}`
}

/**
 * Get mobile money payment instructions
 */
export function getMobileMoneyInstructions(
  provider: 'MTN' | 'AIRTEL',
  phoneNumber: string
): string {
  if (provider === 'MTN') {
    return `Dial *165*1# on your MTN phone, select "Enter Number", enter ${phoneNumber}, then enter the amount. Use your MTN Mobile Money PIN to confirm.`
  }
  return `Dial *185*1# on your Airtel phone, select "Send Money", enter ${phoneNumber}, then enter the amount. Use your Airtel Money PIN to confirm.`
}
