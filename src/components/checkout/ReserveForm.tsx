'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isDemoMode } from '@/lib/demo/config'
import { CheckCircle2, Loader2, ArrowRight, Clock, Mail, MessageSquare } from 'lucide-react'

interface Props {
  vehicle: { id: string; name: string; image: string | null; priceUgx: number | null; slug: string }
  contact?: { name?: string; email?: string; phone?: string }
}

interface ReserveResult {
  reservation: { reservationRef: string; status: string; expiresAt: string; vehicleName: string }
  notifications: { channel: string; status: string }[]
}

const CHANNEL_ICON: Record<string, typeof Mail> = { EMAIL: Mail, SMS: MessageSquare, WHATSAPP: MessageSquare }

export function ReserveForm({ vehicle, contact }: Props) {
  const [name, setName] = useState(contact?.name ?? '')
  const [email, setEmail] = useState(contact?.email ?? '')
  const [phone, setPhone] = useState(contact?.phone ?? '')
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [error, setError] = useState('')
  const [result, setResult] = useState<ReserveResult | null>(null)

  const canSubmit = name.trim() && email.trim() && phone.trim()

  async function reserve() {
    if (!canSubmit) { setError('Please complete your contact details.'); return }
    setError('')
    setStep('processing')
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: vehicle.id, customerName: name, customerEmail: email, customerPhone: phone }),
      })
      const data = await res.json()
      await new Promise((r) => setTimeout(r, 900))
      if (res.ok && data.success) { setResult(data); setStep('success') }
      else { setError(data.error || 'Could not create the reservation.'); setStep('form') }
    } catch {
      setError('Something went wrong. Please try again.'); setStep('form')
    }
  }

  if (step === 'success' && result) {
    const r = result.reservation
    const expires = new Date(r.expiresAt)
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white">Vehicle reserved</h2>
        <p className="text-gray-400 mt-2 mb-8">We&apos;re holding the {r.vehicleName} for you.</p>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-gray-400">Reservation No.</span><span className="text-right font-mono text-white">{r.reservationRef}</span>
            <span className="text-gray-400">Status</span><span className="text-right font-semibold text-green-400">ACTIVE</span>
            <span className="text-gray-400">Held until</span><span className="text-right text-white">{expires.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-4 pt-4 border-t border-white/10">
            <Clock className="w-4 h-4 text-[#C8952A]" /> Complete your purchase before the hold expires.
          </div>
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

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href={`/buy/${vehicle.slug}`} className="flex-1 bg-[#C8952A] text-black py-3.5 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors">
            Proceed to Purchase
          </Link>
          <Link href="/portal" className="flex-1 inline-flex items-center justify-center gap-2 border border-white/20 text-white py-3.5 rounded-xl font-semibold hover:border-[#C8952A] transition-colors">
            View in Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      {vehicle.image && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-white/10">
          <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" sizes="100vw" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-white mb-1">Reserve {vehicle.name}</h2>
      <p className="text-gray-400 mb-6">Place a complimentary 48-hour hold — no payment required now.</p>

      <div className="space-y-4">
        <FieldR label="Full name" value={name} onChange={setName} placeholder="e.g. Sarah Nakato" />
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldR label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
          <FieldR label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+256…" />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      <button
        onClick={reserve}
        disabled={!canSubmit || step === 'processing'}
        className="w-full mt-6 bg-[#C8952A] text-black py-4 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors disabled:opacity-50 uppercase tracking-wide inline-flex items-center justify-center gap-2"
      >
        {step === 'processing' ? <><Loader2 className="w-5 h-5 animate-spin" /> Reserving…</> : 'Confirm Reservation'}
      </button>
      {isDemoMode() && <p className="text-center text-xs text-gray-500 mt-3">Reservations are recorded in your dashboard.</p>}
    </div>
  )
}

function FieldR({ label, value, onChange, type = 'text', placeholder }: {
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
