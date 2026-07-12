'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PAYMENT_METHODS, paymentMethodLabel, type PaymentMethod } from '@/lib/payment-methods'
import { isDemoMode } from '@/lib/demo/config'
import { formatUGX } from '@/lib/utils'
import {
  Smartphone, CreditCard, Landmark, Wallet, Loader2, CheckCircle2, XCircle,
  Printer, ArrowRight, ShieldCheck, Mail, MessageSquare,
} from 'lucide-react'

const ICONS = { Smartphone, CreditCard, Landmark, Wallet } as const

interface NotificationState { channel: string; recipient: string; status: string; provider: string }
interface SuccessData {
  order: { orderRef: string; invoiceNumber: string; status: string; amountUgx: number; vehicleName: string }
  payment: { status: string; method: string; txRef: string; transactionId?: string; receiptNumber?: string; provider: string }
  notifications: NotificationState[]
}

type Mode = 'purchase' | 'reserve'

interface Props {
  mode?: Mode
  vehicle: { id: string; name: string; image: string | null; priceUgx: number; slug: string }
  contact?: { name?: string; email?: string; phone?: string }
}

const CHANNEL_ICON: Record<string, typeof Mail> = { EMAIL: Mail, SMS: MessageSquare, WHATSAPP: MessageSquare }

export function PurchaseCheckout({ vehicle, contact }: Props) {
  const demo = isDemoMode()
  const [name, setName] = useState(contact?.name ?? '')
  const [email, setEmail] = useState(contact?.email ?? '')
  const [phone, setPhone] = useState(contact?.phone ?? '')
  const [method, setMethod] = useState<PaymentMethod>('FLUTTERWAVE')
  const [simulateDecline, setSimulateDecline] = useState(false)
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'failed'>('form')
  const [error, setError] = useState('')
  const [result, setResult] = useState<SuccessData | null>(null)

  const canSubmit = name.trim() && email.trim() && phone.trim()

  async function pay() {
    if (!canSubmit) { setError('Please complete your contact details.'); return }
    setError('')
    setStep('processing')
    const started = Date.now()
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          method,
          demoOutcome: simulateDecline ? 'fail' : undefined,
        }),
      })
      const data = await res.json()
      // Keep the processing animation visible for a believable minimum.
      const elapsed = Date.now() - started
      if (elapsed < 2200) await new Promise((r) => setTimeout(r, 2200 - elapsed))

      if (res.ok && data.success) {
        setResult(data)
        setStep('success')
      } else {
        setError(data.message || data.error || 'Payment was declined. Please try another method.')
        setStep('failed')
      }
    } catch {
      setError('Something went wrong reaching the payment service. Please try again.')
      setStep('failed')
    }
  }

  // ---- PROCESSING ----------------------------------------------------------
  if (step === 'processing') {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full border-2 border-[#C8952A]/30 flex items-center justify-center mx-auto mb-8">
          <Loader2 className="w-10 h-10 text-[#C8952A] animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Processing your payment…</h2>
        <p className="text-gray-400">Securely authorising {paymentMethodLabel(method)} · {formatUGX(vehicle.priceUgx)}</p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-[#C8952A]" /> Encrypted checkout
        </div>
      </div>
    )
  }

  // ---- SUCCESS (receipt) ---------------------------------------------------
  if (step === 'success' && result) {
    const p = result.payment
    const o = result.order
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-9 h-9 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Purchase confirmed</h2>
          <p className="text-gray-400 mt-2">A receipt has been sent to {email}.</p>
        </div>

        {/* Printable receipt */}
        <div id="receipt" className="bg-white text-[#1A1815] rounded-2xl p-8 shadow-2xl print:shadow-none">
          <div className="flex items-center justify-between border-b border-black/10 pb-5 mb-5">
            <div>
              <p className="font-display text-xl font-bold tracking-wide text-[#8A6410]">MIGHTY RIDES</p>
              <p className="text-xs text-[#5C574F]">Payment Receipt</p>
            </div>
            <div className="text-right text-xs text-[#5C574F]">
              <p className="font-semibold text-[#1A1815]">{p.receiptNumber}</p>
              <p>{new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-[#5C574F]">Vehicle</span><span className="text-right font-medium">{o.vehicleName}</span>
            <span className="text-[#5C574F]">Purchase Order</span><span className="text-right font-mono">{o.orderRef}</span>
            <span className="text-[#5C574F]">Invoice No.</span><span className="text-right font-mono">{o.invoiceNumber}</span>
            <span className="text-[#5C574F]">Transaction Ref</span><span className="text-right font-mono">{p.txRef}</span>
            {p.transactionId && (<><span className="text-[#5C574F]">Transaction ID</span><span className="text-right font-mono">{p.transactionId}</span></>)}
            <span className="text-[#5C574F]">Method</span><span className="text-right">{paymentMethodLabel(p.method)}</span>
            <span className="text-[#5C574F]">Status</span><span className="text-right font-semibold text-green-600">PAID</span>
          </div>
          <div className="border-t border-black/10 mt-5 pt-5 flex items-center justify-between">
            <span className="text-[#5C574F] text-sm">Total Paid</span>
            <span className="text-2xl font-bold text-[#8A6410]">{formatUGX(o.amountUgx)}</span>
          </div>
          {p.provider === 'DEMO' && (
            <p className="text-[10px] text-[#8A857C] mt-4 text-center uppercase tracking-wider">Simulated payment · demo environment</p>
          )}
        </div>

        {/* Notification delivery states */}
        {result.notifications.length > 0 && (
          <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Confirmations sent</p>
            <div className="flex flex-wrap gap-3">
              {result.notifications.map((n, i) => {
                const Icon = CHANNEL_ICON[n.channel] || Mail
                return (
                  <span key={i} className="inline-flex items-center gap-2 text-sm text-gray-200 bg-white/5 rounded-full px-3 py-1.5">
                    <Icon className="w-4 h-4 text-[#C8952A]" />
                    {n.channel.charAt(0) + n.channel.slice(1).toLowerCase()}
                    <span className="text-green-400 text-xs">· {n.status.toLowerCase()}</span>
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 print:hidden">
          <button onClick={() => window.print()} className="btn-shine flex-1 inline-flex items-center justify-center gap-2 bg-[#C8952A] text-black py-3.5 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors">
            <Printer className="w-4 h-4" /> Print / Save Invoice
          </button>
          <Link href="/portal" className="flex-1 inline-flex items-center justify-center gap-2 border border-white/20 text-white py-3.5 rounded-xl font-semibold hover:border-[#C8952A] transition-colors">
            View in My Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // ---- FAILED --------------------------------------------------------------
  if (step === 'failed') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-9 h-9 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment not completed</h2>
        <p className="text-gray-400 mb-8">{error}</p>
        <button onClick={() => setStep('form')} className="bg-[#C8952A] text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors">
          Try again
        </button>
      </div>
    )
  }

  // ---- FORM ----------------------------------------------------------------
  return (
    <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-12">
      {/* Payment form */}
      <div>
        <h2 className="text-xl font-bold text-white mb-5">Your details</h2>
        <div className="space-y-4 mb-8">
          <Field label="Full name" value={name} onChange={setName} placeholder="e.g. Sarah Nakato" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
            <Field label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+256…" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-5">Payment method</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {PAYMENT_METHODS.map((m) => {
            const Icon = ICONS[m.icon]
            const active = method === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                aria-pressed={active ? 'true' : 'false'}
                className={`text-left p-4 rounded-xl border transition-colors ${active ? 'border-[#C8952A] bg-[#C8952A]/10' : 'border-white/10 bg-white/[0.02] hover:border-white/25'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-[#C8952A]' : 'text-gray-400'}`} />
                  <span className="font-semibold text-white">{m.label}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{m.description}</p>
              </button>
            )
          })}
        </div>

        {demo && (
          <label className="flex items-center gap-3 text-sm text-gray-400 mb-6 cursor-pointer select-none">
            <input type="checkbox" checked={simulateDecline} onChange={(e) => setSimulateDecline(e.target.checked)} className="accent-[#C8952A] w-4 h-4" />
            Simulate a declined payment (to demo the failure path)
          </label>
        )}

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={pay}
          disabled={!canSubmit}
          className="btn-shine w-full bg-[#C8952A] text-black py-4 rounded-xl font-semibold text-center hover:bg-[#D4A644] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          Pay {formatUGX(vehicle.priceUgx)}
        </button>
        <p className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
          <ShieldCheck className="w-4 h-4 text-[#C8952A]" /> Secure checkout{demo ? ' · simulated in demo mode' : ''}
        </p>
      </div>

      {/* Order summary */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {vehicle.image && (
            <div className="relative aspect-[16/10]">
              <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 40vw" />
            </div>
          )}
          <div className="p-6">
            <p className="text-xs text-[#C8952A] uppercase tracking-[0.2em] mb-2 font-semibold">Order summary</p>
            <h3 className="text-xl font-bold text-white mb-5">{vehicle.name}</h3>
            <div className="space-y-3 text-sm border-t border-white/10 pt-4">
              <Row label="Vehicle price" value={formatUGX(vehicle.priceUgx)} />
              <Row label="Documentation & handover" value="Included" />
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-white font-semibold">Total</span>
                <span className="text-2xl font-bold text-[#C8952A]">{formatUGX(vehicle.priceUgx)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }: {
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}
