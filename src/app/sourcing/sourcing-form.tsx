'use client'

import { useState } from 'react'

export default function SourcingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    const vehicleSpec = JSON.stringify({
      type: formData.get('vehicle_type'),
      make: formData.get('make'),
      model: formData.get('model'),
      year_from: formData.get('year_from'),
      year_to: formData.get('year_to'),
      colour: formData.get('colour'),
      transmission: formData.get('transmission'),
      use: formData.get('intended_use'),
    })

    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      type: 'SOURCING',
      vehicle_spec: vehicleSpec,
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
      setError('Failed to submit request. Please try again.')
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
        <h3 className="font-display text-xl text-white mb-2">Request Received</h3>
        <p className="text-[#B0B0B0]">
          Our sourcing team will be in touch within 24 hours to discuss your requirements.
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

      {/* Vehicle Details */}
      <h3 className="font-display text-lg text-white mb-4">Vehicle Requirements</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Vehicle Type *</label>
          <select name="vehicle_type" required className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none">
            <option value="">Select type</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Sports">Sports</option>
            <option value="Pickup">Pickup</option>
            <option value="Van">Van</option>
          </select>
        </div>
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Preferred Make *</label>
          <input type="text" name="make" required placeholder="e.g. Lamborghini" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Preferred Model</label>
          <input type="text" name="model" placeholder="e.g. Urus" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
        </div>
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Transmission</label>
          <select name="transmission" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none">
            <option value="">Any</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Year From</label>
          <input type="number" name="year_from" min="2000" max={new Date().getFullYear()} placeholder="e.g. 2020" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
        </div>
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Year To</label>
          <input type="number" name="year_to" min="2000" max={new Date().getFullYear() + 1} placeholder="e.g. 2024" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Budget Range (UGX)</label>
          <input type="text" name="budget" placeholder="e.g. 200,000,000 - 400,000,000" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
        </div>
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Preferred Colour</label>
          <input type="text" name="colour" placeholder="e.g. White" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
        </div>
      </div>

      {/* Contact Details */}
      <h3 className="font-display text-lg text-white mb-4">Your Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Full Name *</label>
          <input type="text" name="name" required className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
        </div>
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Phone *</label>
          <input type="tel" name="phone" required placeholder="+256 XXX XXX XXX" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#B0B0B0] text-sm mb-2">Email *</label>
        <input type="email" name="email" required className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">How soon do you need it?</label>
          <select name="timeline" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none">
            <option value="">Select timeline</option>
            <option value="ASAP">ASAP</option>
            <option value="1_month">1 month</option>
            <option value="3_months">3 months</option>
            <option value="6_months">6 months</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
        <div>
          <label className="block text-[#B0B0B0] text-sm mb-2">Preferred Contact</label>
          <select name="contact_preference" className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded text-white focus:border-[#C8952A] outline-none">
            <option value="WhatsApp">WhatsApp</option>
            <option value="Phone">Phone Call</option>
            <option value="Email">Email</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 text-[#C8952A] border border-[#C8952A] rounded hover:bg-[#C8952A]/10 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Sourcing Request'}
      </button>
    </form>
  )
}
