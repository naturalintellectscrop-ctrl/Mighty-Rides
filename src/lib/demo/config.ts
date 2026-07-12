// ============================================================================
// DEMO EXPERIENCE LAYER — global configuration
// ----------------------------------------------------------------------------
// A single source of truth for whether the platform is running in Demo Mode.
// In Demo Mode, external services (payment gateways, SMS/WhatsApp providers)
// are simulated behind the service interfaces in `src/lib/services`. Flip the
// `NEXT_PUBLIC_DEMO_MODE` env flag to route those same interfaces to live
// providers with no changes to calling code.
// ============================================================================

/**
 * Whether the application is running in Demo Mode.
 *
 * Demo Mode is ON by default (so a fresh deployment "just works" for a demo)
 * and is only disabled when NEXT_PUBLIC_DEMO_MODE is explicitly set to "false".
 *
 * Safe to call on both server and client — it only reads a NEXT_PUBLIC_ var.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'
}

/**
 * Whether the live Flutterwave payment gateway is configured AND we are not in
 * Demo Mode. When false, the payment service simulates the charge end-to-end.
 */
export function isLivePayments(): boolean {
  if (isDemoMode()) return false
  return Boolean(process.env.FLUTTERWAVE_SECRET_KEY)
}

/**
 * Whether live email (Resend) is configured AND we are not in Demo Mode.
 * SMS and WhatsApp have no live provider yet, so they are always simulated.
 */
export function isLiveEmail(): boolean {
  if (isDemoMode()) return false
  return Boolean(process.env.RESEND_API_KEY)
}

/** Simulated processing latency (ms) used by client checkout animations. */
export const DEMO_PROCESSING_MS = 2200

/** A visible banner label so demos are honest about the simulation. */
export const DEMO_BADGE_LABEL = 'Demo Mode — payments & notifications are simulated'
