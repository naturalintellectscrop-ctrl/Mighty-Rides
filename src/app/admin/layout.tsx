'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, Car, Calendar, MapPin, Inbox, Search,
  AlertCircle, DollarSign, FileText, Users, Settings, LogOut, Menu, X,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/fleet', label: 'Fleet Board', icon: Car },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/pickups', label: 'Pickups', icon: MapPin },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { href: '/admin/sourcing', label: 'Sourcing', icon: Search },
  { href: '/admin/complaints', label: 'Complaints', icon: AlertCircle },
  { href: '/admin/sales', label: 'Sales Log', icon: DollarSign },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/rentees', label: 'Rentees', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

/**
 * The single admin shell: one responsive sidebar + top bar + auth guard.
 * (Individual pages wrap in the <AdminLayout> component, which is now a simple
 * pass-through — previously it rendered a SECOND sidebar, causing the double
 * sidebar. The dashboard uses a light theme via the `admin-light` scope.)
 */
export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') router.push('/portal')
  }, [status, session, router])

  // Close the mobile drawer on navigation
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
      </div>
    )
  }
  if (!session || session.user?.role !== 'ADMIN') return null

  return (
    <div className="admin-light min-h-screen bg-brand-black flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-surface border-r border-brand-border flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-brand-border shrink-0">
          <Link href="/admin" className="font-display text-lg font-bold text-brand-gold">MIGHTY RIDES</Link>
          <button type="button" onClick={() => setSidebarOpen(false)} className="lg:hidden text-brand-silver" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold'
                    : 'text-brand-silver hover:text-brand-white hover:bg-brand-surface-2'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-brand-border shrink-0">
          <div className="px-4 py-2 mb-1">
            <p className="text-sm text-brand-white font-medium truncate">{session.user?.name}</p>
            <p className="text-xs text-brand-muted truncate">{session.user?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-4 py-3 text-brand-silver hover:text-brand-gold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="sticky top-0 z-40 h-16 bg-brand-surface/95 backdrop-blur-sm border-b border-brand-border flex items-center px-4 lg:px-8">
          <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-brand-silver hover:text-brand-white" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-brand-silver truncate max-w-[60vw]">{session.user?.email}</span>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
