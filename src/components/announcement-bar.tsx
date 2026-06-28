'use client'

import { useState } from 'react'

interface AnnouncementBarProps {
  message: string
  link?: string
}

export function AnnouncementBar({ message, link }: AnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <div className="bg-[#C8952A] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-10 relative">
          <p className="text-sm font-medium text-center">
            {message}
            {link && (
              <span className="ml-2 inline-flex items-center">
                →
              </span>
            )}
          </p>
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute right-4 p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="Dismiss announcement"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
