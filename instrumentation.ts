// ============================================================================
// NEXT.JS INSTRUMENTATION
// This file runs when the Next.js server starts
// Use it to initialize monitoring, logging, etc.
// ============================================================================

export async function register() {
  // Only run on server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Sentry if DSN is configured
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      const Sentry = await import('@sentry/nextjs')
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: 0.1,
        debug: false,
      })
      console.log('[SERVER] Sentry initialized')
    } else {
      console.log('[SERVER] Sentry not configured (missing NEXT_PUBLIC_SENTRY_DSN)')
    }

    // Log startup
    console.log(`[SERVER] Mighty Rides started in ${process.env.NODE_ENV} mode`)
  }
}
