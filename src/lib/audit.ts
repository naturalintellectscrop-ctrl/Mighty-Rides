import { db } from './db'

// ============================================================================
// Audit Action Constants
// ============================================================================

export const AUDIT_ACTIONS = {
  // Booking actions
  BOOKING_CREATED: 'BOOKING_CREATED',
  BOOKING_CONFIRMED: 'BOOKING_CONFIRMED',
  BOOKING_DECLINED: 'BOOKING_DECLINED',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  BOOKING_ACTIVE: 'BOOKING_ACTIVE',
  BOOKING_RETURNED: 'BOOKING_RETURNED',
  BOOKING_STATUS_CHANGED: 'BOOKING_STATUS_CHANGED',
  BOOKING_NOTES_UPDATED: 'BOOKING_NOTES_UPDATED',
  BOOKING_HANDOVER_UPDATED: 'BOOKING_HANDOVER_UPDATED',
  BOOKING_EXTENSION_APPROVED: 'BOOKING_EXTENSION_APPROVED',
  BOOKING_EXTENSION_DECLINED: 'BOOKING_EXTENSION_DECLINED',
  BOOKING_REFUND_PROCESSED: 'BOOKING_REFUND_PROCESSED',

  // Vehicle actions
  VEHICLE_CREATED: 'VEHICLE_CREATED',
  VEHICLE_UPDATED: 'VEHICLE_UPDATED',
  VEHICLE_STATUS_CHANGED: 'VEHICLE_STATUS_CHANGED',
  VEHICLE_DELETED: 'VEHICLE_DELETED',
  VEHICLE_PUBLISHED: 'VEHICLE_PUBLISHED',
  VEHICLE_UNPUBLISHED: 'VEHICLE_UNPUBLISHED',
  VEHICLE_FEATURED: 'VEHICLE_FEATURED',
  VEHICLE_UNFEATURED: 'VEHICLE_UNFEATURED',
  VEHICLE_PHOTOS_UPDATED: 'VEHICLE_PHOTOS_UPDATED',
  VEHICLE_PRICING_UPDATED: 'VEHICLE_PRICING_UPDATED',

  // User actions
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_STATUS_CHANGED: 'USER_STATUS_CHANGED',
  USER_SUSPENDED: 'USER_SUSPENDED',
  USER_UNSUSPENDED: 'USER_UNSUSPENDED',
  USER_ID_VERIFIED: 'USER_ID_VERIFIED',
  USER_ID_REJECTED: 'USER_ID_REJECTED',
  USER_DELETED: 'USER_DELETED',

  // Inquiry actions
  INQUIRY_CREATED: 'INQUIRY_CREATED',
  INQUIRY_STATUS_CHANGED: 'INQUIRY_STATUS_CHANGED',
  INQUIRY_NOTES_UPDATED: 'INQUIRY_NOTES_UPDATED',

  // Sourcing actions
  SOURCING_STATUS_CHANGED: 'SOURCING_STATUS_CHANGED',
  SOURCING_NOTES_UPDATED: 'SOURCING_NOTES_UPDATED',

  // Complaint actions
  COMPLAINT_STATUS_CHANGED: 'COMPLAINT_STATUS_CHANGED',
  COMPLAINT_RESPONSE_ADDED: 'COMPLAINT_RESPONSE_ADDED',

  // Sales actions
  SALE_LOGGED: 'SALE_LOGGED',

  // Blog actions
  BLOG_POST_CREATED: 'BLOG_POST_CREATED',
  BLOG_POST_UPDATED: 'BLOG_POST_UPDATED',
  BLOG_POST_PUBLISHED: 'BLOG_POST_PUBLISHED',
  BLOG_POST_UNPUBLISHED: 'BLOG_POST_UNPUBLISHED',
  BLOG_POST_DELETED: 'BLOG_POST_DELETED',

  // Settings actions
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',

  // Auth actions
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN_LOGOUT: 'ADMIN_LOGOUT',
  ADMIN_PASSWORD_CHANGED: 'ADMIN_PASSWORD_CHANGED',
} as const

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS]

// ============================================================================
// Entity Types
// ============================================================================

export const ENTITY_TYPES = {
  BOOKING: 'booking',
  VEHICLE: 'vehicle',
  USER: 'user',
  INQUIRY: 'inquiry',
  SOURCING_REQUEST: 'sourcing_request',
  COMPLAINT: 'complaint',
  SALES_LOG: 'sales_log',
  BLOG_POST: 'blog_post',
  SETTING: 'setting',
  AUTH: 'auth',
} as const

export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES]

// ============================================================================
// Types
// ============================================================================

export interface AuditLogParams {
  adminId: string
  action: AuditAction | string
  entityType: EntityType | string
  entityId?: string | null
  details?: Record<string, unknown> | string | null
  ipAddress?: string | null
}

export interface AuditLogEntry {
  id: string
  admin_id: string
  action: string
  entity_type: string
  entity_id: string | null
  details: string | null
  ip_address: string | null
  created_at: Date
}

// ============================================================================
// Main Audit Logging Function
// ============================================================================

/**
 * Logs an admin action to the audit log
 * 
 * @param params - The audit log parameters
 * @param params.adminId - The ID of the admin performing the action
 * @param params.action - The action being performed (use AUDIT_ACTIONS constants)
 * @param params.entityType - The type of entity being acted upon (use ENTITY_TYPES constants)
 * @param params.entityId - Optional ID of the specific entity
 * @param params.details - Optional additional details (object will be JSON stringified)
 * @param params.ipAddress - Optional IP address of the admin
 * @returns The created audit log entry
 */
export async function logAction(params: AuditLogParams): Promise<AuditLogEntry> {
  const { adminId, action, entityType, entityId, details, ipAddress } = params

  // Stringify details if it's an object
  const detailsString = details
    ? typeof details === 'string'
      ? details
      : JSON.stringify(details)
    : null

  try {
    const entry = await db.adminAuditLog.create({
      data: {
        admin_id: adminId,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        details: detailsString,
        ip_address: ipAddress || null,
      },
    })

    return entry
  } catch (error) {
    // Log the error but don't throw - audit logging should not break the main operation
    console.error('Failed to create audit log entry:', error)
    throw error
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Retrieves audit logs with filtering options
 */
export async function getAuditLogs(params: {
  adminId?: string
  action?: string
  entityType?: string
  entityId?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}): Promise<{ logs: AuditLogEntry[]; total: number }> {
  const {
    adminId,
    action,
    entityType,
    entityId,
    startDate,
    endDate,
    limit = 50,
    offset = 0,
  } = params

  const where: Record<string, unknown> = {}

  if (adminId) where.admin_id = adminId
  if (action) where.action = action
  if (entityType) where.entity_type = entityType
  if (entityId) where.entity_id = entityId

  if (startDate || endDate) {
    where.created_at = {}
    if (startDate) (where.created_at as Record<string, unknown>).gte = startDate
    if (endDate) (where.created_at as Record<string, unknown>).lte = endDate
  }

  const [logs, total] = await Promise.all([
    db.adminAuditLog.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    }),
    db.adminAuditLog.count({ where }),
  ])

  return { logs, total }
}

/**
 * Retrieves audit logs for a specific entity
 */
export async function getEntityAuditLogs(
  entityType: string,
  entityId: string,
  limit: number = 20
): Promise<AuditLogEntry[]> {
  return db.adminAuditLog.findMany({
    where: {
      entity_type: entityType,
      entity_id: entityId,
    },
    orderBy: { created_at: 'desc' },
    take: limit,
  })
}

/**
 * Retrieves recent audit logs for an admin
 */
export async function getAdminRecentActions(
  adminId: string,
  limit: number = 20
): Promise<AuditLogEntry[]> {
  return db.adminAuditLog.findMany({
    where: { admin_id: adminId },
    orderBy: { created_at: 'desc' },
    take: limit,
  })
}

/**
 * Parses audit log details from JSON string
 */
export function parseDetails(details: string | null): Record<string, unknown> | null {
  if (!details) return null
  try {
    return JSON.parse(details)
  } catch {
    return { raw: details }
  }
}
