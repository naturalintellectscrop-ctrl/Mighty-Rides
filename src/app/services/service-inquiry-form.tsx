'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'

const serviceOptions = [
  { value: 'spare-parts', label: 'Spare Parts' },
  { value: 'body-kits', label: 'Car Body Kits' },
  { value: 'maintenance', label: 'Maintenance & Servicing' },
  { value: 'detailing', label: 'Detailing & Customisation' },
  { value: 'other', label: 'Other' },
]

const urgencyOptions = [
  { value: 'not-urgent', label: 'Not urgent' },
  { value: 'this-week', label: 'This week' },
  { value: 'urgent', label: 'Urgent' },
]

interface FormData {
  fullName: string
  phone: string
  email: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  serviceNeeded: string
  description: string
  urgency: string
}

const initialFormData: FormData = {
  fullName: '',
  phone: '',
  email: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  serviceNeeded: '',
  description: '',
  urgency: 'not-urgent',
}

export default function ServiceInquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'SERVICE',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setIsSuccess(true)
      setFormData(initialFormData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-brand-black border border-brand-border rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <h3 className="font-display text-2xl text-white mb-4">
          Your service request has been received.
        </h3>
        <p className="text-brand-silver mb-6">
          Our team will contact you within 24 hours to arrange.
        </p>
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4 mb-6">
          <p className="text-sm text-brand-silver mb-2">
            For urgent needs, WhatsApp us directly:
          </p>
          <a
            href="https://wa.me/256785642717?text=Hi%2C%20I%27ve%20submitted%20a%20service%20request%20and%20need%20urgent%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-white transition-colors font-medium"
          >
            +256 785 642 717
          </a>
        </div>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn-primary"
        >
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-display text-lg text-white border-b border-brand-border pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm text-brand-silver mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-brand-silver mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+256 700 123 456"
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-brand-silver mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="w-full"
          />
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="space-y-4">
        <h3 className="font-display text-lg text-white border-b border-brand-border pb-2">
          Vehicle Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="vehicleMake" className="block text-sm text-brand-silver mb-2">
              Make
            </label>
            <input
              type="text"
              id="vehicleMake"
              name="vehicleMake"
              value={formData.vehicleMake}
              onChange={handleChange}
              placeholder="e.g., Range Rover"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="vehicleModel" className="block text-sm text-brand-silver mb-2">
              Model
            </label>
            <input
              type="text"
              id="vehicleModel"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              placeholder="e.g., Sport"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="vehicleYear" className="block text-sm text-brand-silver mb-2">
              Year
            </label>
            <input
              type="text"
              id="vehicleYear"
              name="vehicleYear"
              value={formData.vehicleYear}
              onChange={handleChange}
              placeholder="e.g., 2022"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-4">
        <h3 className="font-display text-lg text-white border-b border-brand-border pb-2">
          Service Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="serviceNeeded" className="block text-sm text-brand-silver mb-2">
              Service Needed <span className="text-red-400">*</span>
            </label>
            <select
              id="serviceNeeded"
              name="serviceNeeded"
              value={formData.serviceNeeded}
              onChange={handleChange}
              required
              className="w-full"
            >
              <option value="">Select a service</option>
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="urgency" className="block text-sm text-brand-silver mb-2">
              Urgency <span className="text-red-400">*</span>
            </label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              required
              className="w-full"
            >
              {urgencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm text-brand-silver mb-2">
            Description of what&apos;s needed <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Please describe the service or parts you need..."
            className="w-full resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Service Request'
          )}
        </button>
      </div>

      {/* Note */}
      <p className="text-xs text-brand-muted">
        No login required. Your information will be kept confidential and used only to process your service request.
      </p>
    </form>
  )
}
