// ============================================================================
// ANALYTICS HELPER - Easy import for all tracking functions
// ============================================================================

import {
  trackEvent,
  trackFormSubmit,
  trackVehicleView,
  trackBeginCheckout,
  trackPurchase,
  trackContactClick,
  trackSignUp,
  trackLogin,
} from '@/components/analytics/GoogleAnalytics'

// Re-export for convenience
export {
  trackEvent,
  trackFormSubmit,
  trackVehicleView,
  trackBeginCheckout,
  trackPurchase,
  trackContactClick,
  trackSignUp,
  trackLogin,
}

// ============================================================================
// SPECIFIC EVENT HELPERS FOR MIGHTY RIDES
// ============================================================================

/**
 * Track vehicle inquiry submission
 */
export function trackVehicleInquiry(vehicleName: string, vehicleType: 'sale' | 'hire') {
  trackEvent('vehicle_inquiry_submitted', {
    vehicle_name: vehicleName,
    vehicle_type: vehicleType,
  })
}

/**
 * Track concierge inquiry submission
 */
export function trackConciergeInquiry() {
  trackEvent('concierge_inquiry_submitted', {})
}

/**
 * Track corporate inquiry submission
 */
export function trackCorporateInquiry() {
  trackEvent('corporate_inquiry_submitted', {})
}

/**
 * Track sourcing request submission
 */
export function trackSourcingRequest() {
  trackEvent('sourcing_request_submitted', {})
}

/**
 * Track booking initiation
 */
export function trackBookingInitiated(vehicleName: string) {
  trackEvent('booking_initiated', {
    vehicle_name: vehicleName,
  })
}

/**
 * Track deposit payment started
 */
export function trackDepositPaymentStarted(vehicleName: string, amount: number) {
  trackEvent('deposit_payment_started', {
    vehicle_name: vehicleName,
    amount: amount,
  })
}

/**
 * Track deposit payment completed
 */
export function trackDepositPaymentCompleted(transactionId: string, vehicleName: string, amount: number) {
  trackEvent('deposit_payment_completed', {
    transaction_id: transactionId,
    vehicle_name: vehicleName,
    amount: amount,
  })
}

/**
 * Track WhatsApp tap
 */
export function trackWhatsAppTap(page: string) {
  trackEvent('whatsapp_tap', {
    page_context: page,
  })
}

/**
 * Track complaint submission
 */
export function trackComplaintSubmitted() {
  trackEvent('complaint_submitted', {})
}

/**
 * Track blog CTA click
 */
export function trackBlogCtaClick(articleSlug: string) {
  trackEvent('blog_cta_click', {
    article_slug: articleSlug,
  })
}
