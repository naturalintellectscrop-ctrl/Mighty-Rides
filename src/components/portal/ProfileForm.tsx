'use client'

import { useState } from 'react'
import { Save, Check, X } from 'lucide-react'

export interface ProfileUser {
  full_name: string
  email: string
  phone: string
  nationality: string | null
  id_type: string | null
  id_verified: boolean
  email_verified: boolean
}

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const [formData, setFormData] = useState({ full_name: user.full_name, phone: user.phone })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setPwSaving(true); setPwError(''); setPwSaved(false)
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pw),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to change password')
      setPwSaved(true)
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => { setPwSaved(false); setShowPasswordForm(false) }, 2000)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <>
      {/* Personal Details */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-bold text-brand-white mb-4">Personal Details</h2>
        <div className="card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Full Name</label>
              <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
            </div>
            <div>
              <label>Phone Number</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>

          <div>
            <label>Email Address</label>
            <input type="email" value={user.email} disabled className="opacity-60" />
            <p className="text-xs text-brand-muted mt-1">Email changes require re-verification — contact support.</p>
          </div>

          {user.nationality && (
            <div>
              <label>Nationality</label>
              <input type="text" value={user.nationality} disabled className="opacity-60" />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={handleSave} disabled={saving} className="btn">
            {saving ? <>Saving…</> : saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </section>

      {/* Identity Documents */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-bold text-brand-white mb-4">Identity Documents</h2>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-white font-medium">
                {user.id_type ? user.id_type.replace('_', ' ') : 'No document on file'}
              </p>
              <p className="text-sm text-brand-silver">
                {user.id_type ? 'Uploaded on registration' : 'Add an ID to complete verification'}
              </p>
            </div>
            {user.id_verified ? (
              <span className="text-green-500 text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Verified</span>
            ) : (
              <span className="text-yellow-500 text-sm">Pending Verification</span>
            )}
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-bold text-brand-white mb-4">Change Password</h2>
        {!showPasswordForm ? (
          <button onClick={() => setShowPasswordForm(true)} className="text-brand-gold hover:opacity-80">Change Password</button>
        ) : (
          <div className="card p-6 space-y-4">
            <div>
              <label>Current Password</label>
              <input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} placeholder="••••••••" />
            </div>
            <div>
              <label>New Password</label>
              <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} placeholder="••••••••" />
            </div>
            <div>
              <label>Confirm New Password</label>
              <input type="password" value={pw.confirmPassword} onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })} placeholder="••••••••" />
            </div>
            {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
            <div className="flex gap-4 items-center">
              <button onClick={handlePasswordChange} disabled={pwSaving} className="btn">
                {pwSaving ? 'Updating…' : pwSaved ? <><Check className="w-4 h-4" /> Updated</> : 'Update Password'}
              </button>
              <button onClick={() => { setShowPasswordForm(false); setPwError('') }} className="text-brand-silver hover:text-brand-white">Cancel</button>
            </div>
          </div>
        )}
      </section>

      {/* Account Status */}
      <section>
        <h2 className="font-display text-lg font-bold text-brand-white mb-4">Account Status</h2>
        <div className="flex flex-wrap gap-4">
          <div className="card px-4 py-2">
            {user.email_verified ? (
              <span className="text-green-500 text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Email Verified</span>
            ) : (
              <span className="text-yellow-500 text-sm flex items-center gap-1"><X className="w-4 h-4" /> Email Unverified</span>
            )}
          </div>
          <div className="card px-4 py-2">
            {user.id_verified ? (
              <span className="text-green-500 text-sm flex items-center gap-1"><Check className="w-4 h-4" /> ID Verified</span>
            ) : (
              <span className="text-yellow-500 text-sm flex items-center gap-1"><X className="w-4 h-4" /> ID Pending</span>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
