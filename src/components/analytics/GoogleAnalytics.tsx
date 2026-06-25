'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// ============================================================================
// TYPES
// ============================================================================

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

// ============================================================================
// GA TRACKING HOOK
// ============================================================================

function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window.gtag === 'undefined') return

    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    })
  }, [pathname, searchParams])
}

function PageTracker() {
  usePageTracking()
  return null
}

// ============================================================================
// GA4 COMPONENT
// ============================================================================

function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // Don't render in development or if no ID
  if (!measurementId || process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>

      {/* Page View Tracking */}
      <Suspense fallback={null}>
        <PageTracker />
      </Suspense>
    </>
  )
}

// ============================================================================
// HELPER FUNCTIONS FOR CUSTOM EVENTS
// ============================================================================

/**
 * Track a custom event in GA4
 * @example trackEvent('submit_inquiry', { vehicle: 'Toyota Land Cruiser', type: 'purchase' })
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window.gtag === 'undefined') {
    console.warn('GA4 not initialized')
    return
  }

  window.gtag('event', eventName, params)
}

/**
 * Track form submission
 */
export function trackFormSubmit(formType: 'contact' | 'inquiry' | 'booking' | 'sourcing') {
  trackEvent('form_submit', {
    form_type: formType,
  })
}

/**
 * Track vehicle view
 */
export function trackVehicleView(vehicleName: string, vehicleType: 'sale' | 'hire') {
  trackEvent('view_item', {
    item_name: vehicleName,
    item_category: vehicleType,
  })
}

/**
 * Track checkout begin
 */
export function trackBeginCheckout(vehicleName: string, value: number, currency: 'UGX' | 'USD') {
  trackEvent('begin_checkout', {
    item_name: vehicleName,
    value: value,
    currency: currency,
  })
}

/**
 * Track purchase/booking complete
 */
export function trackPurchase(
  transactionId: string,
  vehicleName: string,
  value: number,
  currency: 'UGX' | 'USD'
) {
  trackEvent('purchase', {
    transaction_id: transactionId,
    item_name: vehicleName,
    value: value,
    currency: currency,
  })
}

/**
 * Track contact click (phone, whatsapp, email)
 */
export function trackContactClick(type: 'phone' | 'whatsapp' | 'email') {
  trackEvent('click', {
    contact_type: type,
  })
}

/**
 * Track user signup
 */
export function trackSignUp(method: 'email' = 'email') {
  trackEvent('sign_up', {
    method: method,
  })
}

/**
 * Track user login
 */
export function trackLogin(method: 'email' = 'email') {
  trackEvent('login', {
    method: method,
  })
}

// Export the component as named export for use in layout
export { GoogleAnalytics }
