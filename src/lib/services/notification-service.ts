// ============================================================================
// NOTIFICATION SERVICE — provider-agnostic email / SMS / WhatsApp
// ----------------------------------------------------------------------------
// Every confirmation in the app fans out through `notifyCustomer()` /
// `notifyAdmin()`. In Demo Mode all three channels are simulated and written to
// the NotificationLog table (so the customer & admin dashboards can show
// realistic delivery states). With live providers configured, EMAIL routes to
// Resend; SMS and WhatsApp have no live provider yet and remain simulated.
//
// SERVER-ONLY: imports the DB and email SDK.
// ============================================================================

import { db } from '@/lib/db'
import { isLiveEmail } from '@/lib/demo/config'
import { sendEmail } from '@/lib/email'

export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP'
export type NotificationStatus = 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED'

export interface NotificationInput {
  channel: NotificationChannel
  recipient: string
  subject?: string
  body: string
  entityType?: string
  entityId?: string
  userId?: string | null
  /** For EMAIL: full HTML body. Falls back to a simple wrapper around `body`. */
  html?: string
}

export interface NotificationResult {
  channel: NotificationChannel
  recipient: string
  status: NotificationStatus
  provider: string
}

/**
 * Send (or simulate) a single notification and persist it to NotificationLog.
 * Always resolves — a delivery failure is captured as a FAILED log, never thrown.
 */
export async function sendNotification(input: NotificationInput): Promise<NotificationResult> {
  let status: NotificationStatus = 'DELIVERED'
  let provider = 'DEMO'

  try {
    if (input.channel === 'EMAIL' && isLiveEmail()) {
      provider = 'RESEND'
      const res = await sendEmail({
        to: input.recipient,
        subject: input.subject || 'Mighty Rides',
        html: input.html || `<p>${input.body}</p>`,
        text: input.body,
      })
      status = res.success ? 'SENT' : 'FAILED'
    } else {
      // Simulated delivery (EMAIL in demo, and SMS/WhatsApp always).
      status = 'DELIVERED'
    }
  } catch {
    status = 'FAILED'
  }

  await db.notificationLog.create({
    data: {
      channel: input.channel,
      recipient: input.recipient,
      subject: input.subject ?? null,
      body: input.body,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      userId: input.userId ?? null,
      status,
      provider,
    },
  })

  return { channel: input.channel, recipient: input.recipient, status, provider }
}

export interface CustomerNotice {
  name: string
  email: string
  phone?: string
  userId?: string | null
  subject: string
  /** Short human message reused across SMS/WhatsApp and as email text. */
  message: string
  html?: string
  entityType?: string
  entityId?: string
}

/**
 * Fan a confirmation out to the customer across all three channels.
 * Returns the per-channel delivery states for display in a confirmation screen.
 */
export async function notifyCustomer(notice: CustomerNotice): Promise<NotificationResult[]> {
  const results: NotificationResult[] = []

  results.push(
    await sendNotification({
      channel: 'EMAIL',
      recipient: notice.email,
      subject: notice.subject,
      body: notice.message,
      html: notice.html,
      entityType: notice.entityType,
      entityId: notice.entityId,
      userId: notice.userId,
    })
  )

  if (notice.phone) {
    results.push(
      await sendNotification({
        channel: 'SMS',
        recipient: notice.phone,
        body: notice.message,
        entityType: notice.entityType,
        entityId: notice.entityId,
        userId: notice.userId,
      })
    )
    results.push(
      await sendNotification({
        channel: 'WHATSAPP',
        recipient: notice.phone,
        body: notice.message,
        entityType: notice.entityType,
        entityId: notice.entityId,
        userId: notice.userId,
      })
    )
  }

  return results
}

/**
 * Notify the admin (email channel, logged). Best-effort — the admin email is
 * read from settings by the caller, or falls back to a default.
 */
export async function notifyAdmin(params: {
  adminEmail?: string
  subject: string
  message: string
  entityType?: string
  entityId?: string
}): Promise<NotificationResult> {
  const to = params.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@mightyrides.com'
  return sendNotification({
    channel: 'EMAIL',
    recipient: to,
    subject: `[Admin] ${params.subject}`,
    body: params.message,
    entityType: params.entityType,
    entityId: params.entityId,
  })
}
