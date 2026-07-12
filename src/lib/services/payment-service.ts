// ============================================================================
// PAYMENT SERVICE — provider-agnostic interface + Demo & Live implementations
// ----------------------------------------------------------------------------
// Every payment in the app flows through `processPayment()`. In Demo Mode the
// charge is simulated (with realistic references, receipts and failure cases);
// with NEXT_PUBLIC_DEMO_MODE=false and Flutterwave keys present, the same call
// initializes a real gateway charge. Callers never branch on the mode — swap
// the provider by flipping one env flag.
//
// SERVER-ONLY: imports the DB and gateway SDK.
// ============================================================================

import { db } from '@/lib/db'
import { isLivePayments } from '@/lib/demo/config'
import { transactionRef, demoTransactionId, receiptNumber } from '@/lib/references'
import type { PaymentMethod } from '@/lib/payment-methods'
import { initializePayment } from '@/lib/flutterwave'

export type PaymentEntityType = 'ORDER' | 'BOOKING' | 'RESERVATION' | 'FINANCE'
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED'

export interface PaymentRequest {
  amountUgx: number
  currency?: 'UGX' | 'USD'
  method: PaymentMethod
  entityType: PaymentEntityType
  entityId: string
  entityRef?: string
  userId?: string | null
  customer: { name: string; email: string; phone?: string }
  /** demoOutcome: force 'success' | 'fail' in Demo Mode for scripted demos. */
  meta?: Record<string, string>
}

export interface PaymentOutcome {
  success: boolean
  status: PaymentStatus
  paymentId: string
  txRef: string
  transactionId?: string
  receiptNumber?: string
  provider: 'DEMO' | 'FLUTTERWAVE'
  method: PaymentMethod
  amountUgx: number
  message?: string
  /** Present only for live redirect-based gateways. */
  paymentUrl?: string
}

/**
 * Decide the simulated outcome. Deterministic so demos are repeatable:
 * - meta.demoOutcome === 'fail'  → FAILED
 * - customer email local-part starts with "fail" (e.g. fail@x.com) → FAILED
 * - otherwise → SUCCESSFUL
 */
function decideDemoOutcome(req: PaymentRequest): boolean {
  if (req.meta?.demoOutcome === 'fail') return false
  if (req.meta?.demoOutcome === 'success') return true
  const local = (req.customer.email || '').split('@')[0]?.toLowerCase() || ''
  if (local.startsWith('fail')) return false
  return true
}

/**
 * Process a payment. Persists a Payment row and returns the outcome.
 * Never throws for an ordinary decline — declines are returned as
 * `{ success: false, status: 'FAILED' }`.
 */
export async function processPayment(req: PaymentRequest): Promise<PaymentOutcome> {
  const txRef = transactionRef()
  const currency = req.currency ?? 'UGX'
  const provider: 'DEMO' | 'FLUTTERWAVE' = isLivePayments() ? 'FLUTTERWAVE' : 'DEMO'

  // Record the attempt up-front (PROCESSING) so it always shows in history.
  const payment = await db.payment.create({
    data: {
      txRef,
      entityType: req.entityType,
      entityId: req.entityId,
      entityRef: req.entityRef ?? null,
      userId: req.userId ?? null,
      amountUgx: req.amountUgx,
      currency,
      method: req.method,
      provider,
      status: 'PROCESSING',
      meta: req.meta ? JSON.stringify(req.meta) : null,
    },
  })

  // ---- LIVE: hand off to Flutterwave (redirect flow) -----------------------
  if (provider === 'FLUTTERWAVE') {
    const init = await initializePayment({
      amount: req.amountUgx,
      currency: 'UGX',
      email: req.customer.email,
      phone: req.customer.phone,
      name: req.customer.name,
      txRef,
      meta: { entityType: req.entityType, entityId: req.entityId },
    })
    if (init.success && init.paymentUrl) {
      return {
        success: true,
        status: 'PENDING',
        paymentId: payment.id,
        txRef,
        provider,
        method: req.method,
        amountUgx: req.amountUgx,
        paymentUrl: init.paymentUrl,
        message: 'Redirecting to secure payment…',
      }
    }
    await db.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } })
    return {
      success: false,
      status: 'FAILED',
      paymentId: payment.id,
      txRef,
      provider,
      method: req.method,
      amountUgx: req.amountUgx,
      message: init.message || 'Could not reach the payment gateway.',
    }
  }

  // ---- DEMO: simulate the charge synchronously -----------------------------
  const ok = decideDemoOutcome(req)
  const transactionId = demoTransactionId()
  const receipt = ok ? receiptNumber() : null

  const updated = await db.payment.update({
    where: { id: payment.id },
    data: {
      status: ok ? 'SUCCESSFUL' : 'FAILED',
      transactionId,
      receiptNumber: receipt,
    },
  })

  return {
    success: ok,
    status: updated.status as PaymentStatus,
    paymentId: payment.id,
    txRef,
    transactionId,
    receiptNumber: receipt ?? undefined,
    provider,
    method: req.method,
    amountUgx: req.amountUgx,
    message: ok
      ? 'Payment approved.'
      : 'Payment was declined by the provider. Please try another method.',
  }
}

/** Fetch the most recent payment for an entity (e.g. an order). */
export async function getLatestPaymentFor(entityType: PaymentEntityType, entityId: string) {
  return db.payment.findFirst({
    where: { entityType, entityId },
    orderBy: { createdAt: 'desc' },
  })
}
