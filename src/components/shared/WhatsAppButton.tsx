'use client'

import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackContactClick } from '@/components/analytics/GoogleAnalytics'

// ============================================================================
// CONTEXTUAL WHATSAPP MESSAGES
// ============================================================================

const CONTEXTUAL_MESSAGES: Record<string, string> = {
  '/': "Hi, I'm interested in your vehicles. I found you on your website.",
  '/cars': "Hi, I'm interested in a vehicle for sale on your website.",
  '/hire': "Hi, I'd like to enquire about luxury car hire.",
  '/sourcing': "Hi, I'd like to request vehicle sourcing services.",
  '/concierge': "Hi, I'm interested in your concierge services.",
  '/corporate': "Hi, I'd like to enquire about corporate fleet solutions.",
  '/services': "Hi, I'm interested in your services.",
  '/about': "Hi, I have a question about Mighty Rides.",
  '/contact': "Hi, I'm reaching out through your website.",
  '/blog': "Hi, I read your blog and have a question.",
  '/login': "Hi, I need help with my account.",
  '/register': "Hi, I need help registering on your website.",
  '/portal': "Hi, I have a question about my rentals.",
}

// Default messages for dynamic routes
const DYNAMIC_ROUTE_MESSAGES: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /^\/cars\/(.+)/, message: "Hi, I'm interested in the {vehicle} you have for sale." },
  { pattern: /^\/hire\/(.+)/, message: "Hi, I'm interested in hiring the {vehicle}." },
  { pattern: /^\/blog\/(.+)/, message: "Hi, I read your blog post and have a question." },
]

// Helper function to get contextual message
function getContextualMessage(pathname: string, vehicleName?: string): string {
  // Check exact matches first
  if (CONTEXTUAL_MESSAGES[pathname]) {
    return CONTEXTUAL_MESSAGES[pathname]
  }

  // Check dynamic routes
  for (const { pattern, message } of DYNAMIC_ROUTE_MESSAGES) {
    const match = pathname.match(pattern)
    if (match) {
      // Replace placeholder with vehicle name if available
      if (vehicleName) {
        return message.replace('{vehicle}', vehicleName)
      }
      // Extract from URL slug if no vehicle name provided
      const slug = match[1]
      const formattedName = slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      return message.replace('{vehicle}', formattedName)
    }
  }

  // Default fallback message
  return "Hi, I'd like to get in touch with Mighty Rides."
}

// ============================================================================
// WHATSAPP BUTTON COMPONENT
// ============================================================================

interface WhatsAppButtonProps {
  vehicleName?: string // Optional prop to pass vehicle name
  message?: string // Optional explicit message that overrides the contextual one
}

export function WhatsAppButton({ vehicleName, message: messageOverride }: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Use the explicit message if provided, otherwise derive it from the current path
  const message = messageOverride ?? getContextualMessage(pathname, vehicleName)

  // WhatsApp number - should come from settings/environment
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '256700000000'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  if (!visible) return null

  const handleClick = () => {
    // Track WhatsApp tap with page context
    trackContactClick('whatsapp')
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
      style={{ bottom: 'max(16px, env(safe-area-inset-bottom))', right: 'max(16px, env(safe-area-inset-right))' }}
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
        
        {/* Button - Larger touch target on mobile */}
        <span className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors touch-target">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </span>
        
        {/* Tooltip - Hidden on mobile, shows on larger screens */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-brand-surface border border-brand-border px-3 py-2 rounded-lg text-xs text-brand-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          Chat with us
        </span>
      </div>
    </a>
  )
}
