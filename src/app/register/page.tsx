'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowLeft, Check, Upload, AlertCircle, Loader2, User, Mail, Lock, Phone, Shield, Globe } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Personal Details' },
  { id: 2, title: 'Identity Verification' },
  { id: 3, title: 'Agreement' },
]

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/portal'

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    nationality: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    idType: 'NATIONAL_ID',
    idFrontUrl: '',
    idBackUrl: '',
    agreedToTerms: false,
  })

  const [uploading, setUploading] = useState<string | null>(null)

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleIdUpload = async (
    slot: 'idFrontUrl' | 'idBackUrl',
    file: File | undefined
  ) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.')
      return
    }
    setError('')
    setUploading(slot)
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
        body: JSON.stringify({ file: base64, kind: 'id' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      updateFormData(slot, data.publicId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      localStorage.setItem('mr_reg_progress', JSON.stringify({ step: currentStep + 1, data: formData }))
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-surface" />
        <div className="relative z-10 text-center max-w-md px-6">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-display text-headline-md text-on-surface mb-4">
            Check Your Email
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mb-6">
            We&apos;ve sent a verification link to <strong className="text-on-surface">{formData.email}</strong>. 
            Click it to activate your account.
          </p>
          <Link href="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp1vR4K34vj9v0d90pauxNdvpu4g7o6wTlAXc0sR9JMcIEDgmH_Ff_rUWYLym7o0YqCPrG0pf3wjN6-uQt6uwGBodraXIvblN1KIbQ7sfGIUL9wwzOyKgr79FPhEcEAVF3vyX4PNEpwkVyxFi3UqTfR2pHhnZLeIiG1xegPEEjLIu4wEYl3MF-AbFOAtGI3GnWrdW4C_91LnXJJeIGR7YCZHCUEKFMhfJ29qiSAkybMOXPzmTNoo9FcmVaNdAE1pSSq9CKruTCr24"
          alt="Luxury car interior"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-surface-dim/80 via-surface/90 to-secondary/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-5 sm:px-8">
        <div className="bg-surface-container-low/90 backdrop-blur-md border border-outline-variant p-8 md:p-10 rounded-xl shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-headline-md tracking-tighter text-secondary mb-2">
              MIGHTY RIDES
            </h1>
            <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-[0.2em]">
              Join the Elite Circle
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-label transition-all min-w-[40px] touch-manipulation ${
                      currentStep >= step.id
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-16 sm:w-20 h-0.5 mx-1 transition-all ${
                        currentStep > step.id ? 'bg-secondary' : 'bg-outline-variant'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs font-label text-on-surface-variant uppercase tracking-wider">
              {STEPS.map(step => (
                <span key={step.id} className={`text-center ${currentStep >= step.id ? 'text-secondary' : ''}`}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error-container/10 border border-error/30 rounded-lg p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-on-surface text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Full Legal Name</label>
                  <div className="relative gold-glow">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      required
                      placeholder="As it appears on your ID"
                      className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary transition-all min-h-[52px] touch-manipulation"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => updateFormData('dob', e.target.value)}
                      required
                      className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-4 px-4 text-on-surface focus:outline-none focus:border-secondary transition-all min-h-[52px] touch-manipulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Nationality</label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => updateFormData('nationality', e.target.value)}
                      required
                      placeholder="e.g. Ugandan"
                      className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-4 px-4 text-on-surface focus:outline-none focus:border-secondary transition-all min-h-[52px] touch-manipulation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Phone Number</label>
                  <div className="relative gold-glow">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      required
                      placeholder="+256 XXX XXX XXX"
                      className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary transition-all min-h-[52px] touch-manipulation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Email Address</label>
                  <div className="relative gold-glow">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary transition-all min-h-[52px] touch-manipulation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Password</label>
                  <div className="relative gold-glow">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      required
                      minLength={8}
                      placeholder="Minimum 8 characters"
                      className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary transition-all min-h-[52px] touch-manipulation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-4 px-4 text-on-surface focus:outline-none focus:border-secondary transition-all min-h-[52px] touch-manipulation"
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-error text-xs mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Identity Verification */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-surface-container p-4 rounded-lg mb-4">
                  <p className="text-on-surface-variant text-sm">
                    We require a valid ID document to process your rental. 
                    Your documents are stored securely.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Document Type</label>
                  <select
                    value={formData.idType}
                    onChange={(e) => updateFormData('idType', e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-4 px-4 text-on-surface focus:outline-none focus:border-secondary transition-all min-h-[52px] touch-manipulation"
                  >
                    <option value="NATIONAL_ID">National ID</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>

                {formData.idType === 'NATIONAL_ID' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Front of ID</label>
                      <IdUploadBox
                        label="front"
                        uploaded={!!formData.idFrontUrl}
                        uploading={uploading === 'idFrontUrl'}
                        onSelect={(f) => handleIdUpload('idFrontUrl', f)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Back of ID</label>
                      <IdUploadBox
                        label="back"
                        uploaded={!!formData.idBackUrl}
                        uploading={uploading === 'idBackUrl'}
                        onSelect={(f) => handleIdUpload('idBackUrl', f)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="font-label text-label-sm text-on-surface-variant uppercase ml-1">Passport Photo Page</label>
                    <IdUploadBox
                      label="passport"
                      uploaded={!!formData.idFrontUrl}
                      uploading={uploading === 'idFrontUrl'}
                      onSelect={(f) => handleIdUpload('idFrontUrl', f)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Agreement */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-surface-container p-6 rounded-lg">
                  <p className="text-on-surface-variant text-sm mb-4">
                    Please read and acknowledge the following:
                  </p>
                  <ul className="space-y-3 text-sm text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      I have read and agree to the Mighty Rides Terms and Conditions
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      I understand that a physical rental agreement must be signed at the Mighty Rides office before any vehicle is released
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      My personal information will be processed according to the Privacy Policy
                    </li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                    className="w-5 h-5 accent-secondary mt-0.5 rounded min-w-[20px] touch-manipulation"
                  />
                  <span className="text-sm text-on-surface-variant">
                    I have read and agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-secondary hover:underline">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank" className="text-secondary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 border-2 border-outline-variant text-on-surface font-label uppercase tracking-widest rounded-lg hover:border-secondary hover:text-secondary transition-all flex items-center justify-center gap-2 min-h-[52px] touch-manipulation"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-secondary text-on-secondary font-label py-4 rounded-lg hover:bg-secondary-container transition-all uppercase flex items-center justify-center gap-2 min-h-[52px] touch-manipulation"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.agreedToTerms || isLoading}
                  className="flex-1 bg-secondary text-on-secondary font-label py-4 rounded-lg hover:bg-secondary-container transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px] touch-manipulation"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-8 border-t border-outline-variant text-center">
            <p className="font-body text-body-md text-on-surface-variant text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-secondary font-bold hover:underline ml-1">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex justify-center gap-8">
          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <Shield className="w-4 h-4 text-secondary" />
            <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">Secure</span>
          </div>
          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <Globe className="w-4 h-4 text-secondary" />
            <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">Global</span>
          </div>
        </div>
      </div>
    </main>
  )
}

function IdUploadBox({
  label,
  uploaded,
  uploading,
  onSelect,
}: {
  label: string
  uploaded: boolean
  uploading: boolean
  onSelect: (file: File | undefined) => void
}) {
  return (
    <label className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer min-h-[120px] flex flex-col items-center justify-center touch-manipulation ${uploaded ? 'border-secondary bg-secondary/5' : 'border-outline-variant hover:border-secondary/50'}`}>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        disabled={uploading}
        onChange={(e) => onSelect(e.target.files?.[0])}
      />
      {uploading ? (
        <>
          <Loader2 className="w-8 h-8 text-secondary mx-auto mb-2 animate-spin" />
          <p className="text-sm text-on-surface-variant">Uploading…</p>
        </>
      ) : uploaded ? (
        <>
          <Check className="w-8 h-8 text-secondary mx-auto mb-2" />
          <p className="text-sm text-secondary">Uploaded — click to replace</p>
        </>
      ) : (
        <>
          <Upload className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
          <p className="text-sm text-on-surface-variant">Click to upload {label}</p>
          <p className="text-xs text-outline mt-1">JPG, PNG, WEBP (max 5MB)</p>
        </>
      )}
    </label>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </main>
    }>
      <RegisterContent />
    </Suspense>
  )
}
