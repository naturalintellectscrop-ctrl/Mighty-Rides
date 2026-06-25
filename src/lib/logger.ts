// ============================================================================
// STRUCTURED LOGGING UTILITY
// Production-ready logging with request tracking
// ============================================================================

import { randomUUID } from 'crypto'

// ============================================================================
// TYPES
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  requestId?: string
  userId?: string
  ip?: string
  path?: string
  method?: string
  [key: string]: unknown
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  requestId?: string
  userId?: string
  duration?: number
  error?: {
    name: string
    message: string
    stack?: string
  }
  context?: LogContext
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

const isProduction = process.env.NODE_ENV === 'production'

// ============================================================================
// REQUEST ID MANAGEMENT
// ============================================================================

// Store request IDs in async local storage for automatic context
let currentRequestId: string | undefined

/**
 * Generate a new request ID
 */
export function generateRequestId(): string {
  return `req_${randomUUID().replace(/-/g, '').slice(0, 16)}`
}

/**
 * Set the current request ID (call at the start of each request)
 */
export function setRequestId(requestId: string): void {
  currentRequestId = requestId
}

/**
 * Get the current request ID
 */
export function getRequestId(): string | undefined {
  return currentRequestId
}

/**
 * Clear the current request ID (call at the end of each request)
 */
export function clearRequestId(): void {
  currentRequestId = undefined
}

// ============================================================================
// SENSITIVE DATA REDACTION
// ============================================================================

const SENSITIVE_KEYS = [
  'password',
  'password_hash',
  'token',
  'secret',
  'apiKey',
  'api_key',
  'authorization',
  'cookie',
  'session',
  'credit_card',
  'cardNumber',
  'cvv',
  'ssn',
]

function redactSensitive(data: unknown, depth: number = 0): unknown {
  if (depth > 5) return '[MAX_DEPTH]'
  if (data === null || data === undefined) return data
  if (typeof data !== 'object') return data

  if (Array.isArray(data)) {
    return data.map(item => redactSensitive(item, depth + 1))
  }

  const redacted: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase()
    if (SENSITIVE_KEYS.some(sk => lowerKey.includes(sk))) {
      redacted[key] = '[REDACTED]'
    } else {
      redacted[key] = redactSensitive(value, depth + 1)
    }
  }
  return redacted
}

// ============================================================================
// MAIN LOGGER CLASS
// ============================================================================

class Logger {
  private formatMessage(entry: LogEntry): string {
    if (isProduction) {
      // JSON format for production (easy to parse by log aggregators)
      return JSON.stringify(entry)
    } else {
      // Pretty format for development
      const parts = [
        `[${entry.timestamp}]`,
        `[${entry.level.toUpperCase()}]`,
        entry.requestId ? `[${entry.requestId}]` : '',
        entry.message,
      ].filter(Boolean)

      let output = parts.join(' ')

      if (entry.duration) {
        output += ` (${entry.duration}ms)`
      }

      if (entry.error) {
        output += `\n  Error: ${entry.error.message}`
        if (entry.error.stack && !isProduction) {
          output += `\n  ${entry.error.stack}`
        }
      }

      if (entry.context && Object.keys(entry.context).length > 0 && !isProduction) {
        output += `\n  Context: ${JSON.stringify(redactSensitive(entry.context), null, 2)}`
      }

      return output
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (LOG_LEVELS[level] < LOG_LEVELS[currentLogLevel]) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      requestId: currentRequestId || context?.requestId,
      userId: context?.userId,
      context: redactSensitive(context) as LogContext,
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: isProduction ? undefined : error.stack,
      }
    }

    const formatted = this.formatMessage(entry)

    switch (level) {
      case 'error':
        console.error(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      default:
        console.log(formatted)
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const err = error instanceof Error ? error : undefined
    this.log('error', message, context, err)
  }

  /**
   * Log API request start
   */
  requestStart(method: string, path: string, context?: LogContext): void {
    this.info(`--> ${method} ${path}`, {
      ...context,
      method,
      path,
    })
  }

  /**
   * Log API request end
   */
  requestEnd(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    const level = statusCode >= 400 ? 'warn' : 'info'
    this.log(level, `<-- ${method} ${path} ${statusCode}`, {
      ...context,
      method,
      path,
      statusCode,
      duration,
    })
  }

  /**
   * Log timing for performance monitoring
   */
  time(label: string): () => number {
    const start = Date.now()
    return () => {
      const duration = Date.now() - start
      this.debug(`Timer [${label}]: ${duration}ms`)
      return duration
    }
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const logger = new Logger()

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error | unknown, context?: LogContext) => 
    logger.error(message, error, context),
  requestStart: (method: string, path: string, context?: LogContext) => 
    logger.requestStart(method, path, context),
  requestEnd: (method: string, path: string, statusCode: number, duration: number, context?: LogContext) => 
    logger.requestEnd(method, path, statusCode, duration, context),
  time: (label: string) => logger.time(label),
}
