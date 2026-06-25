import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

// Routes that require authentication
const protectedRoutes = ['/portal', '/admin']

// Routes that require admin role
const adminRoutes = ['/admin']

// Legacy route redirects
const legacyRedirects: Record<string, string> = {
  '/heritage': '/about',
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a unique request ID (Edge Runtime compatible)
 * Uses timestamp and random values instead of Node.js crypto
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 10)
  return `req_${timestamp}_${randomPart}`
}

/**
 * Get client IP from request headers
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return '127.0.0.1'
}

// ============================================================================
// MAIN MIDDLEWARE
// ============================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const startTime = Date.now()

  // Generate request ID for tracing
  const requestId = generateRequestId()

  // Check for legacy redirects
  if (legacyRedirects[pathname]) {
    return NextResponse.redirect(new URL(legacyRedirects[pathname], request.url))
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Check for session cookie (NextAuth default cookie name)
    const sessionCookie = request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token')

    // If no session, redirect to login
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      const response = NextResponse.redirect(loginUrl)
      // Add request ID to response headers for debugging
      response.headers.set('X-Request-ID', requestId)
      return response
    }

    // For admin routes, we need to check role on the server side
    // The page component will handle the role check via getServerSession
  }

  // Create response
  const response = NextResponse.next()

  // Add request ID to response headers for debugging
  response.headers.set('X-Request-ID', requestId)

  // Add security headers (these will merge with next.config.ts headers)
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`)

  // Log request info in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[MIDDLEWARE] ${request.method} ${pathname} - ${getClientIp(request)} - ${requestId}`)
  }

  return response
}

// ============================================================================
// MATCHER CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/portal/:path*',
    '/admin/:path*',
    '/heritage',
  ],
}
