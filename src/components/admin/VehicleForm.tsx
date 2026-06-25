'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, Loader2, X, Save, Trash2 } from 'lucide-react'

export interface VehicleFormData {
  id?: string
  name: string
  make: string
  model: string
  year: number | string
  type: string
  status: string
  plate_number: string
  sale_price_ugx: number | string
  daily_rate_ugx: number | string
  weekly_rate_ugx: number | string
  monthly_rate_ugx: number | string
  description: string
  photos: string[]
  specs: Record<string, string>
}

const SPEC_FIELDS = [
  { key: 'engine', label: 'Engine' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'fuel', label: 'Fuel Type' },
  { key: 'seats', label: 'Seats' },
  { key: 'mileage', label: 'Mileage' },
]

export default function VehicleForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit'
  initial: VehicleFormData
}) {
  const router = useRouter()
  const [data, setData] = useState<VehicleFormData>(initial)
  const [photos, setPhotos] = useState<string[]>(initial.photos || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof VehicleFormData, value: string) =>
    setData(prev => ({ ...prev, [field]: value }))
  const setSpec = (key: string, value: string) =>
    setData(prev => ({ ...prev, specs: { ...prev.specs, [key]: value } }))

  const handlePhotoUpload = async (file: File | undefined) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Maximum size is 5MB.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Could not read file'))
        reader.readAsDataURL(file)
      })
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, kind: 'vehicle' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      setPhotos(prev => [...prev, json.url])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (url: string) => setPhotos(prev => prev.filter(p => p !== url))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!data.name || !data.make || !data.model || !data.year) {
      setError('Name, make, model and year are required.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: data.name,
        make: data.make,
        model: data.model,
        year: Number(data.year),
        type: data.type,
        status: data.status,
        plate_number: data.plate_number || null,
        sale_price_ugx: data.sale_price_ugx === '' ? null : Number(data.sale_price_ugx),
        daily_rate_ugx: data.daily_rate_ugx === '' ? null : Number(data.daily_rate_ugx),
        weekly_rate_ugx: data.weekly_rate_ugx === '' ? null : Number(data.weekly_rate_ugx),
        monthly_rate_ugx: data.monthly_rate_ugx === '' ? null : Number(data.monthly_rate_ugx),
        description: data.description || null,
        photos: mode === 'create' ? photos : JSON.stringify(photos),
        specs: mode === 'create' ? data.specs : JSON.stringify(data.specs),
      }
      const res = await fetch(
        mode === 'create' ? '/api/admin/fleet' : `/api/admin/fleet/${data.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || 'Failed to save vehicle')
      }
      router.push('/admin/fleet')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!data.id || !confirm('Delete this vehicle? This cannot be undone.')) return
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/fleet/${data.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || 'Failed to delete vehicle')
      }
      router.push('/admin/fleet')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vehicle')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && <p className="text-red-400 text-sm card !p-3">{error}</p>}

      {/* Basic */}
      <section className="card space-y-4">
        <h2 className="font-display text-lg font-bold text-brand-white">Vehicle Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label>Name *</label><input value={data.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Range Rover Vogue 2023" /></div>
          <div><label>Plate Number</label><input value={data.plate_number} onChange={e => set('plate_number', e.target.value)} placeholder="UAQ 123A" /></div>
          <div><label>Make *</label><input value={data.make} onChange={e => set('make', e.target.value)} placeholder="Land Rover" /></div>
          <div><label>Model *</label><input value={data.model} onChange={e => set('model', e.target.value)} placeholder="Range Rover Vogue" /></div>
          <div><label>Year *</label><input type="number" value={data.year} onChange={e => set('year', e.target.value)} placeholder="2023" /></div>
          <div>
            <label>Listing Type</label>
            <select value={data.type} onChange={e => set('type', e.target.value)}>
              <option value="SALE">For Sale</option>
              <option value="HIRE">For Hire</option>
              <option value="BOTH">Sale &amp; Hire</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={data.status} onChange={e => set('status', e.target.value)}>
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="RENTED_OUT">Rented Out</option>
              <option value="IN_SERVICE">In Service</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
        </div>
        <div><label>Description</label><textarea rows={3} value={data.description} onChange={e => set('description', e.target.value)} placeholder="Condition, features, notes…" /></div>
      </section>

      {/* Pricing */}
      <section className="card space-y-4">
        <h2 className="font-display text-lg font-bold text-brand-white">Pricing (UGX)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label>Sale Price</label><input type="number" value={data.sale_price_ugx} onChange={e => set('sale_price_ugx', e.target.value)} placeholder="450000000" /></div>
          <div><label>Daily Rate</label><input type="number" value={data.daily_rate_ugx} onChange={e => set('daily_rate_ugx', e.target.value)} placeholder="1500000" /></div>
          <div><label>Weekly Rate</label><input type="number" value={data.weekly_rate_ugx} onChange={e => set('weekly_rate_ugx', e.target.value)} placeholder="9000000" /></div>
          <div><label>Monthly Rate</label><input type="number" value={data.monthly_rate_ugx} onChange={e => set('monthly_rate_ugx', e.target.value)} placeholder="30000000" /></div>
        </div>
      </section>

      {/* Specs */}
      <section className="card space-y-4">
        <h2 className="font-display text-lg font-bold text-brand-white">Specifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SPEC_FIELDS.map(f => (
            <div key={f.key}>
              <label>{f.label}</label>
              <input value={data.specs[f.key] || ''} onChange={e => setSpec(f.key, e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      {/* Photos */}
      <section className="card space-y-4">
        <h2 className="font-display text-lg font-bold text-brand-white">Photos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map(url => (
            <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-brand-border">
              <Image src={url} alt="Vehicle" fill className="object-cover" />
              <button type="button" onClick={() => removePhoto(url)} className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-red-600" aria-label="Remove photo">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="aspect-video rounded-lg border-2 border-dashed border-brand-border flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold transition-colors">
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" disabled={uploading} onChange={e => handlePhotoUpload(e.target.files?.[0])} />
            {uploading ? <Loader2 className="w-6 h-6 text-brand-gold animate-spin" /> : <><Upload className="w-6 h-6 text-brand-silver mb-1" /><span className="text-xs text-brand-silver">Add photo</span></>}
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> {mode === 'create' ? 'Create Vehicle' : 'Save Changes'}</>}
        </button>
        {mode === 'edit' && (
          <button type="button" onClick={handleDelete} disabled={deleting} className="btn-outline !border-red-500/40 !text-red-400 hover:!bg-red-500/10">
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : <><Trash2 className="w-4 h-4" /> Delete</>}
          </button>
        )}
      </div>
    </form>
  )
}
