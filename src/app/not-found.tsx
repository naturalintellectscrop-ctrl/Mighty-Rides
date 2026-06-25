import Link from 'next/link'
import { Home, Search, Car, Calendar, Mail, ChevronRight } from 'lucide-react'

// ============================================================================
// SUGGESTED LINKS
// ============================================================================

const suggestedLinks = [
  {
    href: '/cars',
    icon: Car,
    title: 'Browse Vehicles',
    description: 'Explore our curated collection of premium vehicles for sale',
  },
  {
    href: '/hire',
    icon: Calendar,
    title: 'Car Hire',
    description: 'Luxury car hire for weddings, events, and executive travel',
  },
  {
    href: '/sourcing',
    icon: Search,
    title: 'Vehicle Sourcing',
    description: "Can't find what you're looking for? We'll source it for you",
  },
  {
    href: '/contact',
    icon: Mail,
    title: 'Contact Us',
    description: 'Get in touch with our team for assistance',
  },
]

// ============================================================================
// 404 PAGE
// ============================================================================

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-black flex flex-col">
      {/* Simple Header - No session dependencies */}
      <header className="bg-brand-black border-b border-brand-border">
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center">
              <span className="font-display text-brand-gold font-bold text-lg">MR</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-bold text-brand-gold tracking-[0.12em] leading-none">
                MIGHTY RIDES
              </span>
              <span className="text-[8px] sm:text-[9px] text-brand-muted tracking-[0.15em] uppercase">
                Premium Vehicles
              </span>
            </div>
          </Link>
          
          <Link 
            href="/login" 
            className="px-4 py-2 text-sm font-medium text-brand-silver border border-brand-border rounded-lg hover:border-brand-gold hover:text-brand-gold transition-colors"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="text-center max-w-2xl">
          {/* 404 Number */}
          <div className="mb-6 sm:mb-8 relative">
            <span className="font-display text-[120px] sm:text-[160px] md:text-[200px] font-bold text-brand-gold/10 leading-none block">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-surface border border-brand-gold/30 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-brand-gold" />
              </div>
            </div>
          </div>
          
          {/* Message */}
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-brand-white mb-3 sm:mb-4">
            Page Not Found
          </h1>
          <p className="text-brand-silver text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Don&apos;t worry, let&apos;s get you back on track.
          </p>
          
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Link href="/" className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link href="/cars" className="btn flex items-center gap-2 w-full sm:w-auto justify-center">
              <Car className="w-4 h-4" />
              Browse Vehicles
            </Link>
          </div>
          
          {/* Suggested Links */}
          <div className="border-t border-brand-border pt-6 sm:pt-8">
            <p className="text-brand-muted text-xs sm:text-sm mb-4">Or try one of these popular pages:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {suggestedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="card p-4 flex items-start gap-3 hover:border-brand-gold/50 transition-all duration-300 group text-left"
                >
                  <div className="p-2 sm:p-2.5 bg-brand-gold/10 rounded-lg group-hover:bg-brand-gold/20 transition-colors flex-shrink-0">
                    <link.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm sm:text-base font-bold text-brand-white group-hover:text-brand-gold transition-colors flex items-center gap-1">
                      {link.title}
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-brand-silver text-xs sm:text-sm mt-0.5 line-clamp-1">
                      {link.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-brand-border py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-brand-muted text-xs">
            © {new Date().getFullYear()} Mighty Rides. East Africa&apos;s Premium Car Dealership.
          </p>
        </div>
      </footer>
    </main>
  )
}
