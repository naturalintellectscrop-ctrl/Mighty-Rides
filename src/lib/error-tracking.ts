// ============================================================================
// ERROR TRACKING CONFIGURATION
// Sentry integration for production error monitoring
// ============================================================================

import * as Sentry from '@sentry/nextjs'

// ============================================================================
// TYPES
// ============================================================================

export interface ErrorContext {
  userId?: string
  email?: string
  role?: string
  requestId?: string
  path?: string
  method?: string
  [key: string]: unknown
}

// ============================================================================
// ERROR TRACKING FUNCTIONS
// ============================================================================

/**
 * Capture an exception with context
 */
export function captureException(
  error: Error,
  context?: ErrorContext
): string {
  // Set user context if available
  if (context?.userId) {
    Sentry.setUser({
      id: context.userId,
      email: context.email,
      username: context.role,
    })
  }

  // Add tags for filtering
  if (context?.requestId) {
    Sentry.setTag('requestId', context.requestId)
  }
  if (context?.path) {
    Sentry.setTag('path', context.path)
  }
  if (context?.method) {
    Sentry.setTag('method', context.method)
  }

  // Capture with extra context
  return Sentry.captureException(error, {
    extra: context,
  })
}

/**
 * Capture a message (for non-error events)
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
): string {
  return Sentry.captureMessage(message, level)
}

/**
 * Set user context for error tracking
 */
export function setErrorTrackingUser(
  user: { id: string; email?: string; role?: string } | null
): void {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.role,
    })
  } else {
    Sentry.setUser(null)
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string = 'app',
  data?: Record<string, unknown>
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  })
}

/**
 * Start a span for performance monitoring
 */
export function startSpan<T>(
  name: string,
  callback: () => T
): T {
  return Sentry.startSpan({ name }, callback)
}

// ============================================================================
// ERROR HANDLER WRAPPER
// ============================================================================

/**
 * Wrap an async function with error tracking
 * Useful for API routes
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: () => ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      const ctx = context?.()
      captureException(error as Error, ctx)
      throw error
    }
  }) as T
}

// ============================================================================
// EXPORTS
// ============================================================================

export const errorTracking = {
  captureException,
  captureMessage,
  setUser: setErrorTrackingUser,
  addBreadcrumb,
  startSpan,
  withErrorTracking,
}
