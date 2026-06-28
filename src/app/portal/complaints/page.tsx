'use client'

import { useState, useEffect, useCallback } from 'react'
import { PortalLayout } from '@/components/portal/PortalLayout'
import { AlertCircle, Send } from 'lucide-react'

interface Complaint {
  id: string
  type: string
  description: string
  urgency: string
  status: string
  admin_response?: string | null
  created_at: string
}

const complaintTypes = [
  'Vehicle Condition',
  'Billing Query',
  'Service Issue',
  'Staff Conduct',
  'Other'
]

const urgencyLevels = [
  { value: 'LOW', label: 'Low', color: 'text-green-500' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-500' },
  { value: 'URGENT', label: 'Urgent', color: 'text-red-500' },
]

export default function ComplaintsPage() {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [formData, setFormData] = useState({
    type: '',
    urgency: 'MEDIUM',
    description: '',
    booking_id: '',
  })

  const loadComplaints = useCallback(async () => {
    try {
      const res = await fetch('/api/complaints')
      if (res.ok) {
        const data = await res.json()
        setComplaints(data.complaints || [])
      }
    } catch {
      // non-fatal
    }
  }, [])

  useEffect(() => {
    loadComplaints()
  }, [loadComplaints])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit complaint.')
      }
      setSubmitted(true)
      setFormData({ type: '', urgency: 'MEDIUM', description: '', booking_id: '' })
      await loadComplaints()
      setTimeout(() => {
        setShowForm(false)
        setSubmitted(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit complaint.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PortalLayout>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-brand-white mb-2">Complaints</h1>
        <p className="text-brand-silver mb-8">Raise a concern or provide feedback</p>

        {/* Raise Complaint Form */}
        <section className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn"
            >
              <AlertCircle className="w-4 h-4" /> Raise a New Complaint
            </button>
          ) : submitted ? (
            <div className="card p-6 text-center">
              <p className="text-brand-gold">Complaint submitted successfully!</p>
              <p className="text-sm text-brand-silver mt-1">We&apos;ll respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div>
                <label>Complaint Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="">Select type</option>
                  {complaintTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Urgency *</label>
                <div className="flex gap-4">
                  {urgencyLevels.map(level => (
                    <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={formData.urgency === level.value}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="accent-brand-gold"
                      />
                      <span className={level.color}>{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label>Description * (minimum 20 characters)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  minLength={20}
                  rows={4}
                  placeholder="Please describe your concern in detail..."
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-4">
                <button type="submit" className="btn" disabled={submitting}>
                  <Send className="w-4 h-4" /> {submitting ? 'Submitting…' : 'Submit Complaint'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-brand-silver hover:text-brand-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Complaints List */}
        <section>
          <h2 className="font-display text-lg font-bold text-brand-white mb-4">My Complaints</h2>
          
          {complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.map(complaint => (
                <div key={complaint.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-brand-muted">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </span>
                      <h3 className="font-display text-white font-bold mt-1">{complaint.type}</h3>
                      <p className="text-sm text-brand-silver mt-1">{complaint.description}</p>
                      {complaint.admin_response && (
                        <div className="mt-3 border-l-2 border-brand-gold pl-3">
                          <p className="text-xs text-brand-gold">Response from Mighty Rides:</p>
                          <p className="text-sm text-brand-silver mt-1">{complaint.admin_response}</p>
                        </div>
                      )}
                    </div>
                    <span className={`status-badge ${
                      complaint.status === 'OPEN' ? 'status-reserved' :
                      complaint.status === 'UNDER_REVIEW' ? 'status-available' : 'status-sold'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brand-silver text-center py-8">No complaints raised yet.</p>
          )}
        </section>
      </div>
    </PortalLayout>
  )
}
