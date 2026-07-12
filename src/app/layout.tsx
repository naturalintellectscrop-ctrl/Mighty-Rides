import type { Metadata } from 'next'
import { Playfair_Display, Montserrat, Inter } from 'next/font/google'
import { AuthProvider, CurrencyProvider } from '@/context'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { MotionRoot, RouteProgress, PageTransition } from '@/components/motion'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

// Flag JS as available BEFORE first paint so scroll-reveal at-rest styles apply
// without a flash. Without JS this never runs and all content stays visible.
const MOTION_FLAG = "document.documentElement.classList.add('js-motion')"

// ============================================================================
// TYPOGRAPHY SYSTEM - Visual Design Specification
// ============================================================================
// DISPLAY HEADINGS: Playfair Display - elegant serif for hero text, main titles
// SUBHEADINGS/CTAs: Montserrat - geometric sans-serif for eyebrows, buttons
// BODY TEXT: Inter - humanist sans-serif for body copy, forms
// ============================================================================

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-label',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mighty Rides — East Africa\'s Premium Car Dealership',
    template: '%s — Mighty Rides',
  },
  description: 'Buy, hire, and source premium vehicles in Kampala, Uganda. Exotic, luxury, and performance vehicles from Aston Martin to Rolls-Royce.',
  keywords: ['Mighty Rides', 'car dealership', 'luxury cars', 'car hire', 'Kampala', 'Uganda', 'premium vehicles'],
  authors: [{ name: 'Mighty Rides' }],
  creator: 'Mighty Rides',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_UG',
    url: SITE_URL,
    siteName: 'Mighty Rides',
    title: 'Mighty Rides — East Africa\'s Premium Car Dealership',
    description: 'Buy, hire, and source premium vehicles in Kampala, Uganda.',
    images: [{ url: '/hero-bg.png', width: 1200, height: 630, alt: 'Mighty Rides — luxury vehicles in Kampala' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mighty Rides — East Africa\'s Premium Car Dealership',
    description: 'Buy, hire, and source premium vehicles in Kampala, Uganda.',
    images: ['/hero-bg.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${montserrat.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      </head>
      <body className="bg-brand-black text-brand-white min-h-screen antialiased font-body">
        <GoogleAnalytics />
        <MotionRoot />
        <RouteProgress />
        <AuthProvider>
          <CurrencyProvider>
            <PageTransition>{children}</PageTransition>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
