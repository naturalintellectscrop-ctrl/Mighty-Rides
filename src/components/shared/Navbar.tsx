'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Menu, X, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/cars', label: 'Inventory' },
  { href: '/prestige', label: 'Prestige' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'Heritage' },
]

/**
 * Navbar Component - Visual Design Specification
 * 
 * Design Requirements from design files:
 * - Fixed position: fixed top-0 left-0 right-0 z-50
 * - Height: h-20 (80px)
 * - Background: bg-surface/80 backdrop-blur-xl
 * - Border: border-b border-outline-variant/30
 * - Logo: Responsive image logo
 * - Nav links: Montserrat subheading (18px, 600, uppercase), gap-8
 * - Active link: text-secondary font-bold border-b-2 border-secondary pb-1
 * - Login button: border-2 border-secondary, rounded-full
 */
export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close the mobile menu when the route changes. Depend ONLY on pathname —
  // depending on mobileMenuOpen here would re-close the menu the instant it
  // opened (the previous bug), making the hamburger appear to do nothing.
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121414]/90 backdrop-blur-xl h-20 border-b border-gray-800 shadow-sm">
      <nav className="flex justify-between items-center w-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 h-full">
        {/* Logo - Responsive Image */}
        <Link 
          href="/" 
          className="relative flex items-center hover:opacity-80 transition-opacity duration-300"
        >
          <Image
            src="/logo-new.png"
            alt="Mighty Rides - Premium Car Rentals"
            width={140}
            height={75}
            className="h-9 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation - Hidden on mobile/tablet, visible md+ */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-semibold text-sm uppercase tracking-wider transition-all duration-300',
                pathname === link.href
                  ? 'text-[#C8952A] border-b-2 border-[#C8952A] pb-1'
                  : 'text-gray-300 hover:text-[#C8952A]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side - Auth & Mobile Menu */}
        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href={session.user.role === 'ADMIN' ? '/admin' : '/portal'}
              className="hidden md:flex items-center gap-2 font-semibold text-gray-300 hover:text-[#C8952A] transition-colors duration-200"
            >
              <User className="w-4 h-4" />
              <span>{session.user.role === 'ADMIN' ? 'Dashboard' : 'My Rentals'}</span>
            </Link>
          ) : (
            <button
              onClick={() => signIn()}
              className="hidden md:flex font-semibold px-6 py-2 border-2 border-[#C8952A] text-[#C8952A] hover:bg-[#C8952A] hover:text-black transition-all duration-300 rounded-full"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Button - Only visible on mobile/tablet */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Only renders on mobile/tablet */}
      <div className={cn(
        "md:hidden fixed inset-0 z-40 transition-all duration-500 ease-out",
        mobileMenuOpen 
          ? "opacity-100 visible" 
          : "opacity-0 invisible pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#121414]/95 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <nav className="relative px-4 md:px-8 py-8 pt-24 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block text-lg font-semibold py-4 px-4 border-l-2 transition-all duration-300',
                  pathname === link.href 
                    ? 'text-[#C8952A] border-[#C8952A] bg-[#C8952A]/10' 
                    : 'text-white border-transparent hover:border-[#C8952A]/50 hover:bg-[#1A1A1A]'
                )}
                style={{ 
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: mobileMenuOpen ? 1 : 0
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Auth */}
          <div className="pt-6 mt-6 border-t border-gray-800 space-y-3">
            {session ? (
              <Link
                href={session.user.role === 'ADMIN' ? '/admin' : '/portal'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-semibold px-6 py-3 border-2 border-[#C8952A] text-[#C8952A] hover:bg-[#C8952A] hover:text-black transition-all duration-300 rounded-full w-full justify-center"
              >
                <User className="w-4 h-4" />
                {session.user.role === 'ADMIN' ? 'Dashboard' : 'My Rentals'}
              </Link>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center gap-2 font-semibold px-6 py-3 border-2 border-[#C8952A] text-[#C8952A] hover:bg-[#C8952A] hover:text-black transition-all duration-300 rounded-full w-full justify-center"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
