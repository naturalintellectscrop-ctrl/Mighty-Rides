'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, X, Loader2 } from 'lucide-react'
import { Navbar, Footer } from '@/components/shared'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const hasVerified = useRef(false)

  useEffect(() => {
    // Prevent double verification in React Strict Mode
    if (hasVerified.current) return
    hasVerified.current = true

    const token = searchParams.get('token')

    if (!token) {
      // Defer setState to avoid lint warning
      queueMicrotask(() => {
        setStatus('error')
        setMessage('Invalid verification link')
      })
      return
    }

    // Call the verification API
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success || data.verified) {
          setStatus('success')
          setMessage('Your email has been verified successfully!')
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login?verified=true')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Verification failed. Please try again.')
      })
  }, [searchParams, router])

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-6">
      <div className="text-center max-w-md">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-brand-gold mx-auto mb-6 animate-spin" />
            <h1 className="font-display text-2xl font-bold text-brand-white mb-4">
              Verifying Your Email
            </h1>
            <p className="text-brand-silver">
              Please wait while we verify your email address...
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-display text-2xl font-bold text-brand-white mb-4">
              Email Verified!
            </h1>
            <p className="text-brand-silver mb-6">
              {message}
            </p>
            <Link href="/login" className="btn">
              Continue to Login
            </Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="font-display text-2xl font-bold text-brand-white mb-4">
              Verification Failed
            </h1>
            <p className="text-brand-silver mb-6">
              {message}
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="btn">
                Go to Login
              </Link>
              <button
                onClick={() => router.push('/login?resend=true')}
                className="text-brand-gold hover:opacity-80 text-sm"
              >
                Request a new verification link
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-brand-black flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
      <Footer />
    </main>
  )
}
