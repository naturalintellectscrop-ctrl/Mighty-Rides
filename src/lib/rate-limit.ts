// ============================================================================
// RATE LIMITING WITH UPSTASH REDIS
// ============================================================================

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// ============================================================================
// REDIS CLIENT (Lazy Initialization)
// ============================================================================

let redis: Redis | null = null
let rateLimitersInitialized = false

function getRedis(): Redis | null {
  if (redis) return redis
  
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  
  if (!url || !token) {
    console.warn('Upstash Redis not configured. Rate limiting disabled.')
    return null
  }
  
  redis = new Redis({
    url,
    token,
  })
  
  return redis
}

// ============================================================================
// RATE LIMITER CONFIGURATIONS
// ============================================================================

export const rateLimiters = {
  // General API - 100 requests per minute
  general: {
    limiter: null as Ratelimit | null,
    config: { limit: 100, window: '1 m' },
  },
  
  // Authentication - 5 attempts per 15 minutes
  auth: {
    limiter: null as Ratelimit | null,
    config: { limit: 5, window: '15 m' },
  },
  
  // Booking - 10 requests per hour
  booking: {
    limiter: null as Ratelimit | null,
    config: { limit: 10, window: '1 h' },
  },
  
  // Password Reset - 3 requests per hour
  passwordReset: {
    limiter: null as Ratelimit | null,
    config: { limit: 3, window: '1 h' },
  },
  
  // Contact Form - 5 submissions per hour
  contact: {
    limiter: null as Ratelimit | null,
    config: { limit: 5, window: '1 h' },
  },
  
  // Inquiry Form - 10 submissions per hour
  inquiry: {
    limiter: null as Ratelimit | null,
    config: { limit: 10, window: '1 h' },
  },
}

function initializeRateLimiters() {
  if (rateLimitersInitialized) return
  
  const redisClient = getRedis()
  if (!redisClient) {
    rateLimitersInitialized = true
    return
  }
  
  for (const key of Object.keys(rateLimiters) as Array<keyof typeof rateLimiters>) {
    const config = rateLimiters[key].config
    rateLimiters[key].limiter = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(config.limit, config.window as '1 m' | '15 m' | '1 h'),
      analytics: true,
      prefix: `mightyrides:${key}`,
    })
  }
  
  rateLimitersInitialized = true
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract client IP from request
 */
export function getClientIp(request: NextRequest): string {
  // Try various headers for IP
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // Fallback to a default
  return '127.0.0.1'
}

/**
 * Check rate limit for a given limiter and identifier
 */
export async function checkRateLimit(
  limiterConfig: typeof rateLimiters.general,
  identifier: string
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: Date
  headers: Record<string, string>
}> {
  initializeRateLimiters()
  
  const limiter = limiterConfig.limiter
  
  // If no limiter (Redis not configured), allow all requests
  if (!limiter) {
    return {
      success: true,
      limit: limiterConfig.config.limit,
      remaining: limiterConfig.config.limit,
      reset: new Date(Date.now() + 60000),
      headers: {},
    }
  }
  
  const result = await limiter.limit(identifier)
  
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  }
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: new Date(result.reset),
    headers,
  }
}

/**
 * Create a rate limit exceeded response
 */
export function rateLimitResponse(reset: Date): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: Math.ceil((reset.getTime() - Date.now()) / 1000),
    },
    {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((reset.getTime() - Date.now()) / 1000).toString(),
      },
    }
  )
}

// ============================================================================
// MIDDLEWARE HELPER
// ============================================================================

/**
 * Apply rate limiting to an API route handler
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  limiterKey: keyof typeof rateLimiters = 'general'
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIp(request)
    const { success, reset, headers } = await checkRateLimit(rateLimiters[limiterKey], ip)
    
    if (!success) {
      const response = rateLimitResponse(reset)
      // Add rate limit headers to error response
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }
    
    const response = await handler(request)
    
    // Add rate limit headers to response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const limiterKeys = Object.keys(rateLimiters) as Array<keyof typeof rateLimiters>
