'use client'

import { useState } from 'react'
import { PortalLayout } from '@/components/portal/PortalLayout'
import { Save, Check, Eye, EyeOff } from 'lucide-react'

// Mock user data
const mockUser = {
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '+256 700 123 456',
  nationality: 'Ugandan',
  id_type: 'NATIONAL_ID',
  id_verified: true,
  email_verified: true,
  created_at: '2024-01-15',
}

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    full_name: mockUser.full_name,
    phone: mockUser.phone,
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PortalLayout>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-brand-white mb-2">Profile</h1>
        <p className="text-brand-silver mb-8">Manage your account details</p>

        {/* Personal Details */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-bold text-brand-white mb-4">Personal Details</h2>
          <div className="card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label>Email Address</label>
              <input type="email" value={mockUser.email} disabled className="opacity-60" />
              <p className="text-xs text-brand-muted mt-1">Email changes require re-verification</p>
            </div>

            <button onClick={handleSave} className="btn">
              {saved ? (
                <><Check className="w-4 h-4" /> Saved</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        </section>

        {/* Identity Documents */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-bold text-brand-white mb-4">Identity Documents</h2>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-white font-medium">{mockUser.id_type.replace('_', ' ')}</p>
                <p className="text-sm text-brand-silver">Uploaded on registration</p>
              </div>
              <div className="flex items-center gap-3">
                {mockUser.id_verified ? (
                  <span className="text-green-500 text-sm flex items-center gap-1">
                    <Check className="w-4 h-4" /> Verified
                  </span>
                ) : (
                  <span className="text-yellow-500 text-sm">Pending Verification</span>
                )}
                <button className="text-brand-gold text-sm hover:opacity-80 flex items-center gap-1">
                  <Eye className="w-4 h-4" /> View
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Change Password */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-bold text-brand-white mb-4">Change Password</h2>
          
          {!showPasswordForm ? (
            <button onClick={() => setShowPasswordForm(true)} className="text-brand-gold hover:opacity-80">
              Change Password
            </button>
          ) : (
            <div className="card p-6 space-y-4">
              <div>
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label>New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label>Confirm New Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="flex gap-4">
                <button className="btn">Update Password</button>
                <button onClick={() => setShowPasswordForm(false)} className="text-brand-silver hover:text-brand-white">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Account Status */}
        <section>
          <h2 className="font-display text-lg font-bold text-brand-white mb-4">Account Status</h2>
          <div className="flex gap-4">
            <div className="card px-4 py-2">
              <span className="text-green-500 text-sm flex items-center gap-1">
                <Check className="w-4 h-4" /> Email Verified
              </span>
            </div>
            <div className="card px-4 py-2">
              <span className="text-green-500 text-sm flex items-center gap-1">
                <Check className="w-4 h-4" /> ID Verified
              </span>
            </div>
          </div>
        </section>
      </div>
    </PortalLayout>
  )
}
