'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Save, RefreshCw } from 'lucide-react'

interface Settings {
  ugx_usd_rate: string
  deposit_percent: string
  notification_email: string
  whatsapp_number: string
  office_hours: string
  site_announcement: string
  announcement_active: string
  maintenance_mode: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    ugx_usd_rate: '3700',
    deposit_percent: '30',
    notification_email: 'admin@mightyrides.com',
    whatsapp_number: '256700000000',
    office_hours: 'Mon–Sat 8am–6pm EAT',
    site_announcement: "East Africa's Premium Car Dealership",
    announcement_active: 'true',
    maintenance_mode: 'false',
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.ugx_usd_rate) setSettings(prev => ({ ...prev, ugx_usd_rate: data.ugx_usd_rate }))
        if (data.deposit_percent) setSettings(prev => ({ ...prev, deposit_percent: data.deposit_percent }))
        if (data.notification_email) setSettings(prev => ({ ...prev, notification_email: data.notification_email }))
        if (data.whatsapp_number) setSettings(prev => ({ ...prev, whatsapp_number: data.whatsapp_number }))
        if (data.office_hours) setSettings(prev => ({ ...prev, office_hours: data.office_hours }))
        if (data.site_announcement) setSettings(prev => ({ ...prev, site_announcement: data.site_announcement }))
        if (data.announcement_active) setSettings(prev => ({ ...prev, announcement_active: data.announcement_active }))
        if (data.maintenance_mode) setSettings(prev => ({ ...prev, maintenance_mode: data.maintenance_mode }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save settings')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl">
          <p className="text-brand-silver">Loading settings...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-brand-white mb-2">Settings</h1>
        <p className="text-brand-silver mb-8">System configuration</p>

        <div className="space-y-8">
          {/* Currency */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Currency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>UGX/USD Exchange Rate</label>
                <input
                  type="number"
                  value={settings.ugx_usd_rate}
                  onChange={(e) => setSettings({ ...settings, ugx_usd_rate: e.target.value })}
                />
              </div>
              <div>
                <label>Deposit Percentage</label>
                <input
                  type="number"
                  value={settings.deposit_percent}
                  onChange={(e) => setSettings({ ...settings, deposit_percent: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Notification Email</label>
                <input
                  type="email"
                  value={settings.notification_email}
                  onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
                />
              </div>
              <div>
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  placeholder="256XXXXXXXXX"
                />
              </div>
              <div className="md:col-span-2">
                <label>Office Hours</label>
                <input
                  type="text"
                  value={settings.office_hours}
                  onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Announcement */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Announcement Bar</h2>
            <div className="space-y-4">
              <div>
                <label>Announcement Text</label>
                <input
                  type="text"
                  value={settings.site_announcement}
                  onChange={(e) => setSettings({ ...settings, site_announcement: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.announcement_active === 'true'}
                  onChange={(e) => setSettings({ ...settings, announcement_active: e.target.checked ? 'true' : 'false' })}
                  className="w-4 h-4 accent-brand-gold"
                />
                <span className="text-brand-silver">Show announcement bar</span>
              </label>
            </div>
          </section>

          {/* Maintenance Mode */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-brand-white mb-4">Maintenance Mode</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenance_mode === 'true'}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 accent-brand-gold"
              />
              <span className="text-brand-silver">Enable maintenance mode (public site will show maintenance page)</span>
            </label>
          </section>

          {/* Save Button */}
          {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
          <button onClick={handleSave} disabled={saving} className="btn">
            {saving ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
            ) : saved ? (
              <><Save className="w-4 h-4" /> Saved</>
            ) : (
              <><Save className="w-4 h-4" /> Save Settings</>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
