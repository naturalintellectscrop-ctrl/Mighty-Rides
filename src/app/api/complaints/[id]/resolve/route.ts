// ============================================================================
// RESOLVE COMPLAINT (admin quick action from /admin/complaints)
// POST /api/complaints/[id]/resolve  — HTML form post, redirects back.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // The admin form submits as form-encoded data.
  let adminResponse = ''
  try {
    const form = await request.formData()
    adminResponse = String(form.get('admin_response') || '').trim()
  } catch {
    // No body — fall through with empty response.
  }

  const complaint = await db.complaint.findUnique({
    where: { id },
    include: { user: true },
  })
  if (!complaint) {
    return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
  }

  await db.complaint.update({
    where: { id },
    data: {
      status: 'RESOLVED',
      admin_response: adminResponse || complaint.admin_response || 'Your complaint has been reviewed and resolved.',
      resolved_at: new Date(),
    },
  })

  // Notify the customer of the resolution (best-effort).
  if (complaint.user?.email) {
    try {
      const message = adminResponse || 'Your complaint has been reviewed and resolved. Thank you for your feedback.'
      await sendEmail({
        to: complaint.user.email,
        subject: `Your complaint has been resolved — Mighty Rides`,
        html: `<div style="font-family: Arial, sans-serif; color: #111;">
          <h2 style="color:#C8952A;">Complaint Resolved</h2>
          <p>Hello ${complaint.user.full_name || ''},</p>
          <p>Your complaint regarding <strong>${complaint.type}</strong> has been resolved.</p>
          <p><strong>Our response:</strong><br/>${message}</p>
          <p>If you have any further questions, just reply to this email or contact us on WhatsApp.</p>
          <p>— Mighty Rides</p>
        </div>`,
        text: `Complaint Resolved\n\nYour complaint regarding ${complaint.type} has been resolved.\n\nOur response:\n${message}\n\n— Mighty Rides`,
      })
    } catch (e) {
      console.error('[RESOLVE_COMPLAINT] email failed:', e)
    }
  }

  return NextResponse.redirect(new URL('/admin/complaints', request.url), 303)
}
