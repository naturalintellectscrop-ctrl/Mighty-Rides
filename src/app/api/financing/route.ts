import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { notifyCustomer, notifyAdmin } from '@/lib/services/notification-service'
import { financeNumber } from '@/lib/references'
import { formatUGX } from '@/lib/utils'

async function getAdminEmail(): Promise<string | undefined> {
  const s = await db.setting.findUnique({ where: { key: 'notification_email' } })
  return s?.value || undefined
}

/**
 * Compute an indicative demo decision. Deterministic so demos are repeatable:
 * - email local-part starts "reject" → REJECTED
 * - affordable (monthly instalment ≤ 40% of stated monthly income) → PRE_APPROVED
 * - otherwise → UNDER_REVIEW
 */
function indicativeDecision(params: {
  email: string
  amountUgx: number
  downPaymentUgx: number
  termMonths: number
  monthlyIncomeUgx: number
}): { status: string; note: string } {
  const local = (params.email || '').split('@')[0]?.toLowerCase() || ''
  if (local.startsWith('reject')) {
    return { status: 'REJECTED', note: 'Application does not meet the current lending criteria.' }
  }
  const financed = Math.max(params.amountUgx - params.downPaymentUgx, 0)
  const term = params.termMonths > 0 ? params.termMonths : 36
  const monthly = financed / term
  if (params.monthlyIncomeUgx > 0 && monthly <= params.monthlyIncomeUgx * 0.4) {
    return {
      status: 'PRE_APPROVED',
      note: `Indicative monthly instalment ${formatUGX(Math.round(monthly))}. Pre-approved subject to document verification.`,
    }
  }
  return {
    status: 'UNDER_REVIEW',
    note: `Indicative monthly instalment ${formatUGX(Math.round(monthly))}. Awaiting review by our finance desk.`,
  }
}

// POST — submit a vehicle financing application.
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      fullName, email, phone, nationalId,
      employmentStatus, employer, monthlyIncomeUgx,
      amountUgx, downPaymentUgx, termMonths,
      vehicleId, vehicleName,
    } = data

    if (!fullName || !email || !phone || !employmentStatus || !amountUgx || !termMonths) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null

    const ref = financeNumber()
    const decision = indicativeDecision({
      email,
      amountUgx: Number(amountUgx),
      downPaymentUgx: Number(downPaymentUgx) || 0,
      termMonths: Number(termMonths),
      monthlyIncomeUgx: Number(monthlyIncomeUgx) || 0,
    })

    const app = await db.financeApplication.create({
      data: {
        applicationRef: ref,
        userId,
        vehicleId: vehicleId || null,
        vehicleName: vehicleName || null,
        fullName,
        email,
        phone,
        nationalId: nationalId || null,
        employmentStatus,
        employer: employer || null,
        monthlyIncomeUgx: Number(monthlyIncomeUgx) || null,
        amountUgx: Number(amountUgx),
        downPaymentUgx: Number(downPaymentUgx) || null,
        termMonths: Number(termMonths),
        status: decision.status,
        decisionNote: decision.note,
      },
    })

    const notifications = await notifyCustomer({
      name: fullName,
      email,
      phone,
      userId,
      subject: `Financing application received — ${ref}`,
      message: `Hi ${fullName}, we've received your financing application ${ref} for ${formatUGX(Number(amountUgx))}. Current status: ${decision.status.replace('_', ' ')}. ${decision.note}`,
      entityType: 'FINANCE',
      entityId: app.id,
    })

    await notifyAdmin({
      adminEmail: await getAdminEmail(),
      subject: `New financing application — ${ref}`,
      message: `${fullName} applied for ${formatUGX(Number(amountUgx))} financing${vehicleName ? ` on ${vehicleName}` : ''}. Indicative: ${decision.status}.`,
      entityType: 'FINANCE',
      entityId: app.id,
    })

    return NextResponse.json({
      success: true,
      application: {
        id: app.id,
        applicationRef: ref,
        status: decision.status,
        decisionNote: decision.note,
        amountUgx: Number(amountUgx),
      },
      notifications,
    })
  } catch (error) {
    console.error('[FINANCING] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit financing application' }, { status: 500 })
  }
}
