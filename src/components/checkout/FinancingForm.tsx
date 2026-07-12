'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatUGX } from '@/lib/utils'
import { CheckCircle2, Loader2, ArrowRight, FileText, Mail, MessageSquare } from 'lucide-react'

interface Props {
  vehicle?: { id: string; name: string; priceUgx: number | null } | null
  contact?: { name?: string; email?: string; phone?: string }
}

interface FinanceResult {
  application: { applicationRef: string; status: string; decisionNote: string; amountUgx: number }
  notifications: { channel: string; status: string }[]
}

const STATUS_STYLE: Record<string, string> = {
  SUBMITTED: 'text-blue-400',
  UNDER_REVIEW: 'text-yellow-400',
  PRE_APPROVED: 'text-green-400',
  APPROVED: 'text-green-400',
  REJECTED: 'text-red-400',
}

const STAGES = ['SUBMITTED', 'UNDER_REVIEW', 'PRE_APPROVED', 'APPROVED']
const CHANNEL_ICON: Record<string, typeof Mail> = { EMAIL: Mail, SMS: MessageSquare, WHATSAPP: MessageSquare }

export function FinancingForm({ vehicle, contact }: Props) {
  const [form, setForm] = useState({
    fullName: contact?.name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    nationalId: '',
    employmentStatus: 'EMPLOYED',
    employer: '',
    monthlyIncomeUgx: '',
    amountUgx: vehicle?.priceUgx ? String(vehicle.priceUgx) : '',
    downPaymentUgx: '',
    termMonths: '36',
  })
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [error, setError] = useState('')
  const [result, setResult] = useState<FinanceResult | null>(null)

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }))
  const canSubmit = form.fullName.trim() && form.email.trim() && form.phone.trim() && form.amountUgx.trim() && form.termMonths.trim()

  async function submit() {
    if (!canSubmit) { setError('Please complete the required fields.'); return }
    setError('')
    setStep('processing')
    try {
      const res = await fetch('/api/financing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthlyIncomeUgx: form.monthlyIncomeUgx ? Number(form.monthlyIncomeUgx) : undefined,
          amountUgx: Number(form.amountUgx),
          downPaymentUgx: form.downPaymentUgx ? Number(form.downPaymentUgx) : undefined,
          termMonths: Number(form.termMonths),
          vehicleId: vehicle?.id,
          vehicleName: vehicle?.name,
        }),
      })
      const data = await res.json()
      await new Promise((r) => setTimeout(r, 1100))
      if (res.ok && data.success) { setResult(data); setStep('success') }
      else { setError(data.error || 'Could not submit the application.'); setStep('form') }
    } catch {
      setError('Something went wrong. Please try again.'); setStep('form')
    }
  }

  if (step === 'success' && result) {
    const a = result.application
    const stageIdx = STAGES.indexOf(a.status)
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white">Application received</h2>
        <p className="text-gray-400 mt-2 mb-8">We&apos;ll be in touch as your application progresses.</p>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left">
          <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
            <span className="text-gray-400">Application No.</span><span className="text-right font-mono text-white">{a.applicationRef}</span>
            <span className="text-gray-400">Amount</span><span className="text-right text-white">{formatUGX(a.amountUgx)}</span>
            <span className="text-gray-400">Status</span><span className={`text-right font-semibold ${STATUS_STYLE[a.status] || 'text-white'}`}>{a.status.replace('_', ' ')}</span>
          </div>

          {/* Progress tracker */}
          {a.status !== 'REJECTED' ? (
            <div className="flex items-center gap-1">
              {STAGES.map((s, i) => (
                <div key={s} className="flex-1">
                  <div className={`h-1.5 rounded-full ${i <= stageIdx ? 'bg-[#C8952A]' : 'bg-white/10'}`} />
                  <p className={`text-[10px] mt-2 ${i <= stageIdx ? 'text-white' : 'text-gray-500'}`}>{s.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-400">This application did not meet the current lending criteria.</p>
          )}

          <p className="text-sm text-gray-300 mt-5 pt-5 border-t border-white/10 flex items-start gap-2">
            <FileText className="w-4 h-4 text-[#C8952A] mt-0.5 shrink-0" /> {a.decisionNote}
          </p>
        </div>

        {result.notifications?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {result.notifications.map((n, i) => {
              const Icon = CHANNEL_ICON[n.channel] || Mail
              return (
                <span key={i} className="inline-flex items-center gap-2 text-xs text-gray-200 bg-white/5 rounded-full px-3 py-1.5">
                  <Icon className="w-3.5 h-3.5 text-[#C8952A]" /> {n.channel.toLowerCase()} · {n.status.toLowerCase()}
                </span>
              )
            })}
          </div>
        )}

        <div className="mt-8">
          <Link href="/portal" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:border-[#C8952A] transition-colors">
            View in Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {vehicle && (
        <div className="bg-[#C8952A]/10 border border-[#C8952A]/30 rounded-xl px-5 py-4 mb-8">
          <p className="text-sm text-gray-300">Financing for <span className="text-white font-semibold">{vehicle.name}</span>{vehicle.priceUgx ? ` · ${formatUGX(vehicle.priceUgx)}` : ''}</p>
        </div>
      )}

      <Section title="Personal information">
        <FieldF label="Full name *" value={form.fullName} onChange={set('fullName')} />
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldF label="Email *" type="email" value={form.email} onChange={set('email')} />
          <FieldF label="Phone *" type="tel" value={form.phone} onChange={set('phone')} />
        </div>
        <FieldF label="National ID / Passport" value={form.nationalId} onChange={set('nationalId')} />
      </Section>

      <Section title="Employment">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Employment status *</label>
            <select value={form.employmentStatus} onChange={(e) => set('employmentStatus')(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-3.5 px-4 text-white focus:border-[#C8952A] outline-none">
              <option value="EMPLOYED">Employed</option>
              <option value="SELF_EMPLOYED">Self-employed</option>
              <option value="BUSINESS">Business owner</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <FieldF label="Employer / Business" value={form.employer} onChange={set('employer')} />
        </div>
        <FieldF label="Monthly income (UGX)" type="number" value={form.monthlyIncomeUgx} onChange={set('monthlyIncomeUgx')} placeholder="e.g. 8000000" />
      </Section>

      <Section title="Financing">
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldF label="Amount to finance (UGX) *" type="number" value={form.amountUgx} onChange={set('amountUgx')} />
          <FieldF label="Down payment (UGX)" type="number" value={form.downPaymentUgx} onChange={set('downPaymentUgx')} />
        </div>
        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Term *</label>
          <select value={form.termMonths} onChange={(e) => set('termMonths')(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-3.5 px-4 text-white focus:border-[#C8952A] outline-none">
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="48">48 months</option>
            <option value="60">60 months</option>
          </select>
        </div>
      </Section>

      <div className="bg-white/[0.02] border border-dashed border-white/15 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
        <FileText className="w-5 h-5 text-gray-500 shrink-0" />
        <p className="text-sm text-gray-400">Supporting documents (ID, payslips, bank statements) can be uploaded after submission — your advisor will share a secure link.</p>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <button
        onClick={submit}
        disabled={!canSubmit || step === 'processing'}
        className="w-full bg-[#C8952A] text-black py-4 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors disabled:opacity-50 uppercase tracking-wide inline-flex items-center justify-center gap-2"
      >
        {step === 'processing' ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</> : 'Submit Application'}
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function FieldF({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-3.5 px-4 text-white focus:border-[#C8952A] outline-none transition-colors"
      />
    </div>
  )
}
