'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

// ============================================================================
// CONTACT FORM COMPONENT
// ============================================================================

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          Message Sent!
        </h3>
        <p className="text-gray-400 text-sm sm:text-base mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-[#C8952A] text-sm font-medium hover:text-[#D4A644] transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden honeypot field */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-xs text-[#C8952A] uppercase tracking-wider font-semibold block mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            disabled={status === 'loading'}
            className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-[#C8952A] outline-none transition-colors disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-xs text-[#C8952A] uppercase tracking-wider font-semibold block mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+256 XXX XXX XXX"
            disabled={status === 'loading'}
            className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-[#C8952A] outline-none transition-colors disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-xs text-[#C8952A] uppercase tracking-wider font-semibold block mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your@email.com"
          disabled={status === 'loading'}
          className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-[#C8952A] outline-none transition-colors disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="subject" className="text-xs text-[#C8952A] uppercase tracking-wider font-semibold block mb-2">
          Subject *
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          disabled={status === 'loading'}
          className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-[#C8952A] outline-none appearance-none transition-colors disabled:opacity-50"
        >
          <option value="">Select a subject</option>
          <option value="Vehicle Inquiry">Vehicle Inquiry</option>
          <option value="Car Hire">Car Hire</option>
          <option value="Vehicle Sourcing">Vehicle Sourcing</option>
          <option value="Corporate Services">Corporate Services</option>
          <option value="Parts & Services">Parts & Services</option>
          <option value="General Question">General Question</option>
          <option value="Feedback">Feedback</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-xs text-[#C8952A] uppercase tracking-wider font-semibold block mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="How can we help you?"
          disabled={status === 'loading'}
          className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-[#C8952A] outline-none transition-colors resize-none disabled:opacity-50"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#C8952A] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#D4A644] transition-colors uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
