'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-brand-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-white mb-4">
            Something Went Wrong
          </h1>
          <p className="text-brand-silver mb-8">
            We encountered an unexpected error. Please try again or contact us if the problem persists.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => reset()}
              className="btn flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link href="/" className="text-brand-gold hover:opacity-80 flex items-center gap-2 text-sm">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
