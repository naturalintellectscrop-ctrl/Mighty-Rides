import { db } from '@/lib/db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import { GalleryGrid, type GalleryItem } from '@/components/vehicles'
import { TextReveal } from '@/components/motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Gallery',
  description:
    'The Mighty Rides gallery — luxury SUVs, executive saloons, grand tourers and supercars photographed across our Kampala collection.',
  alternates: { canonical: '/gallery' },
}

/**
 * Flatten every published vehicle's photography into a single editorial feed,
 * tagged by body type so the grid can be filtered.
 */
async function getGallery(): Promise<{ items: GalleryItem[]; categories: string[] }> {
  let vehicles
  try {
    vehicles = await db.vehicle.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { created_at: 'desc' }],
      select: { name: true, make: true, slug: true, type: true, photos: true, specs: true },
    })
  } catch (error) {
    // Degrade to an empty gallery rather than throwing the error boundary.
    console.error('[GALLERY] Failed to load vehicles:', error)
    return { items: [], categories: [] }
  }

  const items: GalleryItem[] = []
  const categories = new Set<string>()

  for (const v of vehicles) {
    let photos: string[] = []
    try {
      const parsed = v.photos ? JSON.parse(v.photos) : []
      if (Array.isArray(parsed)) photos = parsed.filter((p): p is string => typeof p === 'string')
    } catch { /* malformed photos JSON — skip this vehicle's images */ }
    if (photos.length === 0) continue

    let specs: Record<string, unknown> = {}
    try { specs = v.specs ? JSON.parse(v.specs) : {} } catch { /* ignore */ }

    const category = typeof specs.body_type === 'string' && specs.body_type ? specs.body_type : 'Other'
    categories.add(category)

    const href = v.type === 'SALE' ? `/cars/${v.slug}` : `/hire/${v.slug}`
    for (const src of photos) {
      items.push({ src, vehicleName: v.name, make: v.make, category, href })
    }
  }

  return { items, categories: [...categories].sort() }
}

export default async function GalleryPage() {
  const { items, categories } = await getGallery()

  return (
    <main className="min-h-screen bg-[#141312]">
      <Navbar />

      {/* Hero */}
      <section className="relative section-dark px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 pt-36 md:pt-44 pb-14 md:pb-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(55% 60% at 75% 0%, rgba(200,149,42,0.13), transparent 70%)' }}
        />
        <div className="relative max-w-3xl">
          <p className="text-xs text-[#C8952A] uppercase tracking-[0.3em] mb-6 font-semibold">The Gallery</p>
          <TextReveal
            as="h1"
            lines={['Every angle', 'worth admiring.']}
            className="text-4xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.02] tracking-tight mb-7"
          />
          <p className="text-lg md:text-xl text-[#B7B2AA] leading-relaxed reveal">
            Luxury SUVs, executive saloons, grand tourers and supercars — photographed across the
            Mighty Rides collection in Kampala.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="section-dark px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 pb-24 md:pb-32">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl md:text-3xl text-white font-display mb-4">The gallery is being curated.</p>
            <p className="text-[#B7B2AA] mb-8">New photography is added as vehicles arrive.</p>
            <Link href="/cars" className="btn btn-primary">
              Browse the collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <GalleryGrid items={items} categories={categories} />
        )}
      </section>

      {/* CTA */}
      <section className="section-dark border-t border-white/5 px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-20 md:py-28 text-center">
        <div className="reveal">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">Seen one you like?</h2>
          <p className="text-[#B7B2AA] max-w-xl mx-auto mb-9 text-lg">
            Every vehicle here is available to buy or hire. Our concierge will bring it to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars" className="btn btn-primary">Explore Inventory <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/contact" className="btn btn-outline">Speak to Concierge</Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton message="Hi, I saw a vehicle in your gallery I'd like to know more about." />
    </main>
  )
}
