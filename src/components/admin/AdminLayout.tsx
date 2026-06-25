'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, Car, Calendar, Inbox, Search, Users, 
  AlertCircle, MapPin, DollarSign, FileText, Settings, LogOut 
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

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar */}
      <aside className="w-60 bg-brand-black border-r border-brand-border flex flex-col fixed h-screen">
        <div className="p-6 border-b border-brand-border">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Mighty Rides Logo" 
              width={32} 
              height={32}
              className="object-contain"
            />
            <span className="font-display text-lg font-bold text-brand-gold">
              MIGHTY RIDES
            </span>
          </Link>
          <p className="text-xs text-brand-muted mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold'
                        : 'text-brand-silver hover:text-brand-white hover:bg-brand-surface'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-brand-border">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm text-brand-white font-medium">{session?.user?.name}</p>
            <p className="text-xs text-brand-muted">Manager</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 text-sm text-brand-silver hover:text-brand-gold transition-colors w-full px-4 py-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 p-8">
        {children}
      </main>
    </div>
  )
}
