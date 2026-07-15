'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Menu, X, User, ChevronDown, Car, Key, Crown, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

// Desktop "Inventory" mega-dropdown destinations.
const inventoryMenu = [
  { href: '/cars', label: 'Cars for Sale', desc: 'Premium vehicles, verified & documented', icon: Car },
  { href: '/hire', label: 'Cars for Hire', desc: 'Weddings, arrivals & executive travel', icon: Key },
  { href: '/prestige', label: 'The Prestige Collection', desc: 'Rare & exceptional — by appointment', icon: Crown },
  { href: '/gallery', label: 'Gallery', desc: 'Every angle of the collection, up close', icon: Camera },
]
// Desktop top-level links shown alongside the Inventory dropdown.
const topLinks = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'Heritage' },
]
// Flat list used by the mobile menu (Inventory expanded so Hire is reachable).
const navLinks = [
  { href: '/cars', label: 'Cars for Sale' },
  { href: '/hire', label: 'Cars for Hire' },
  { href: '/prestige', label: 'Prestige' },
  { href: '/gallery', label: 'Gallery' },
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
  const [scrolled, setScrolled] = useState(false)

  // Scroll-aware chrome: transparent over the (dark) hero at the top of every
  // page, then settle into a solid, blurred bar once the user scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled || mobileMenuOpen
          ? 'nav-glass border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
          : 'bg-transparent border-b border-transparent',
      )}
    >
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
          {/* Inventory mega-dropdown (CSS hover + focus-within; no JS timing) */}
          {(() => {
            const inventoryActive = ['/cars', '/hire', '/prestige', '/gallery'].some((h) => pathname.startsWith(h))
            return (
              <div className="relative group/inv">
                <Link
                  href="/cars"
                  aria-haspopup="true"
                  className={cn(
                    'relative flex items-center gap-1.5 font-semibold text-sm uppercase tracking-wider transition-colors duration-300',
                    inventoryActive ? 'text-[#C8952A]' : 'text-gray-200 hover:text-white'
                  )}
                >
                  Inventory
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover/inv:rotate-180" />
                  <span
                    className={cn(
                      'absolute -bottom-1.5 left-0 h-[2px] bg-[#C8952A] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      inventoryActive ? 'w-full' : 'w-0 group-hover/inv:w-full'
                    )}
                  />
                </Link>

                {/* Panel — pt-4 bridges the gap so hover isn't lost in transit */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/inv:opacity-100 group-hover/inv:visible group-hover/inv:translate-y-0 group-focus-within/inv:opacity-100 group-focus-within/inv:visible group-focus-within/inv:translate-y-0">
                  <div className="w-[440px] bg-[#141312]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.55)] p-2.5">
                    {inventoryMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.06] transition-colors group/item"
                      >
                        <span className="mt-0.5 w-10 h-10 shrink-0 rounded-lg bg-[#C8952A]/12 flex items-center justify-center group-hover/item:bg-[#C8952A]/20 transition-colors">
                          <item.icon className="w-5 h-5 text-[#C8952A]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-white font-semibold text-[15px] group-hover/item:text-[#C8952A] transition-colors">{item.label}</span>
                          <span className="block text-gray-400 text-xs mt-0.5 leading-relaxed">{item.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {topLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group relative font-semibold text-sm uppercase tracking-wider transition-colors duration-300',
                pathname === link.href ? 'text-[#C8952A]' : 'text-gray-200 hover:text-white'
              )}
            >
              {link.label}
              <span
                className={cn(
                  'absolute -bottom-1.5 left-0 h-[2px] bg-[#C8952A] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                )}
              />
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

      {/* Mobile Menu — sits BELOW the header bar (top-20) rather than over it.
          Covering the header meant the logo and the hamburger ghosted through
          the translucent panel, and the panel's own close button doubled up on
          the header's X. Now the bar stays crisp and owns the close action. */}
      <div className={cn(
        "md:hidden fixed inset-x-0 top-20 bottom-0 z-40 transition-all duration-500 ease-out",
        mobileMenuOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      )}>
        {/* Backdrop — explicit glass (see .nav-glass), never a maybe-generated tint */}
        <div
          className="absolute inset-0 nav-glass"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <nav className="relative px-4 md:px-8 py-8 h-full overflow-y-auto">
          <div className="space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'nav-item block text-lg font-semibold py-4 px-5 rounded-xl',
                  pathname === link.href ? 'nav-item-active text-[#F0C060]' : 'text-white'
                )}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: mobileMenuOpen ? 1 : 0,
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
