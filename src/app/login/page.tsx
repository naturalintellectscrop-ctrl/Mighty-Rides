'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, AlertCircle, Loader2, Mail, Lock, Shield, Globe } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/portal'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        switch (result.error) {
          case 'CredentialsSignin':
            setErrorMessage('Invalid email or password. Please try again.')
            break
          case 'ACCOUNT_SUSPENDED':
            setErrorMessage('Your account has been suspended. Please contact us.')
            break
          case 'EMAIL_NOT_VERIFIED':
            setErrorMessage('Please verify your email before signing in. Check your inbox for the verification link.')
            break
          default:
            setErrorMessage('Invalid email or password. Please try again.')
        }
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0A0A]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp1vR4K34vj9v0d90pauxNdvpu4g7o6wTlAXc0sR9JMcIEDgmH_Ff_rUWYLym7o0YqCPrG0pf3wjN6-uQt6uwGBodraXIvblN1KIbQ7sfGIUL9wwzOyKgr79FPhEcEAVF3vyX4PNEpwkVyxFi3UqTfR2pHhnZLeIiG1xegPEEjLIu4wEYl3MF-AbFOAtGI3GnWrdW4C_91LnXJJeIGR7YCZHCUEKFMhfJ29qiSAkybMOXPzmTNoo9FcmVaNdAE1pSSq9CKruTCr24"
          alt="Luxury car interior"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0A]/90 via-[#0A0A0A]/80 to-[#C8952A]/5" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[480px] px-6 sm:px-8 py-8">
        <div className="bg-[#1A1A1A]/95 backdrop-blur-md border border-gray-700 p-8 md:p-12 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#C8952A] mb-2 tracking-tight">
              MIGHTY RIDES
            </h1>
            <p className="text-sm text-gray-400 uppercase tracking-[0.2em]">
              Elite Performance Access
            </p>
          </div>

          {/* Error Messages */}
          {(error || errorMessage) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-8">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-white">
                  {error === 'SessionRequired' 
                    ? 'Please log in to access that page.' 
                    : errorMessage || 'An error occurred. Please try again.'}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#C8952A] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#C8952A] transition-colors"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="remember" className="w-5 h-5 accent-[#C8952A] rounded" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#C8952A] hover:text-[#D4A644] transition-colors font-semibold">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C8952A] text-black font-bold py-4 rounded-xl hover:bg-[#D4A644] active:scale-[0.98] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              New to the elite suite?{' '}
              <Link 
                href={`/register${callbackUrl !== '/portal' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                className="text-[#C8952A] font-bold hover:underline ml-1"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex justify-center gap-8">
          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <Shield className="w-4 h-4 text-[#C8952A]" />
            <span className="text-xs uppercase tracking-widest text-gray-400">Secure</span>
          </div>
          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <Globe className="w-4 h-4 text-[#C8952A]" />
            <span className="text-xs uppercase tracking-widest text-gray-400">Global</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C8952A] animate-spin" />
      </main>
    }>
      <LoginContent />
    </Suspense>
  )
}
