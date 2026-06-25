// ============================================================================
// FLUTTERWAVE WEBHOOK HANDLER
// POST /api/webhooks/flutterwave
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { 
  verifyWebhookSignature, 
  parseWebhookPayload, 
  handleChargeCompleted 
} from '@/lib/flutterwave'

export async function POST(request: NextRequest) {
  try {
    // Get the verification hash from headers
    const signature = request.headers.get('verif-hash')
    
    // Get the raw body
    const rawBody = await request.text()
    
    // Verify the webhook signature (verbatim verif-hash comparison)
    if (!verifyWebhookSignature(signature)) {
      console.warn('[WEBHOOK] Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    // Parse the payload
    const payload = parseWebhookPayload(rawBody)
    
    if (!payload) {
      console.warn('[WEBHOOK] Invalid payload')
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }
    
    // Handle different event types
    switch (payload.event) {
      case 'charge.completed':
        const result = await handleChargeCompleted(payload)
        if (!result.success) {
          console.error('[WEBHOOK] Failed to handle charge:', result.message)
          // Still return 200 to acknowledge receipt
        }
        break
      
      case 'charge.failed':
        console.log('[WEBHOOK] Charge failed:', payload.data.tx_ref)
        // Could notify the customer
        break
      
      case 'refund.processed':
        console.log('[WEBHOOK] Refund processed:', payload.data.tx_ref)
        // Could update booking status
        break
      
      default:
        console.log('[WEBHOOK] Unhandled event:', payload.event)
    }
    
    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('[WEBHOOK] Error:', error)
    
    // Still return 200 to prevent retries on our end
    // Log the error for investigation
    return NextResponse.json({ received: true })
  }
}

// Flutterwave only sends POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
