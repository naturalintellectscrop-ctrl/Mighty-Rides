'use client'

import { useState } from 'react'

interface VehicleInquiryFormProps {
  vehicleId: string
  vehicleName: string
}

export default function VehicleInquiryForm({ vehicleId, vehicleName }: VehicleInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      type: 'PURCHASE',
      vehicle_id: vehicleId,
      message: formData.get('message') as string,
      budget_ugx: formData.get('budget') as string,
      timeline: formData.get('timeline') as string,
      contact_preference: formData.get('contact_preference') as string,
    }

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setIsSuccess(true)
    } catch {
      setError('Failed to submit inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-[#141414] border border-[#C8952A]/30 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-[#C8952A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#C8952A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-white mb-2">Thank You!</h3>
        <p className="text-[#B0B0B0]">
          Your inquiry has been received. A senior advisor will contact you within 4 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#222222] rounded-lg p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Phone *</label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none"
            placeholder="+256 XXX XXX XXX"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#B0B0B0] text-sm mb-2">Email *</label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none"
          placeholder="your@email.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Budget Range (UGX)</label>
          <input
            type="text"
            name="budget"
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none"
            placeholder="e.g. 50,000,000 - 100,000,000"
          />
        </div>
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Purchase Timeline</label>
          <select
            name="timeline"
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none"
          >
            <option value="">Select timeline</option>
            <option value="this_week">This week</option>
            <option value="this_month">This month</option>
            <option value="within_3_months">Within 3 months</option>
            <option value="just_looking">Just looking</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#B0B0B0] text-sm mb-2">Preferred Contact Method</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-[#B0B0B0] text-sm cursor-pointer">
            <input type="radio" name="contact_preference" value="WhatsApp" defaultChecked className="accent-[#C8952A]" />
            WhatsApp
          </label>
          <label className="flex items-center gap-2 text-[#B0B0B0] text-sm cursor-pointer">
            <input type="radio" name="contact_preference" value="Phone" className="accent-[#C8952A]" />
            Phone Call
          </label>
          <label className="flex items-center gap-2 text-[#B0B0B0] text-sm cursor-pointer">
            <input type="radio" name="contact_preference" value="Email" className="accent-[#C8952A]" />
            Email
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-[#B0B0B0] text-sm mb-2">Message (Optional)</label>
        <textarea
          name="message"
          rows={3}
          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none resize-none"
          placeholder={`I'm interested in the ${vehicleName}...`}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 text-[#C8952A] border border-[#C8952A] rounded hover:bg-[#C8952A]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
