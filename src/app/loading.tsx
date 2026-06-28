import { HeroSkeleton, IntentSkeleton, SectionSkeleton } from '@/components/shared'

// ============================================================================
// LOADING PAGE
// ============================================================================

export default function Loading() {
  return (
    <main className="min-h-screen bg-brand-black flex flex-col">
      {/* Navbar spacer */}
      <div className="h-16 sm:h-20" />
      
      {/* Hero Skeleton */}
      <HeroSkeleton />
      
      {/* Intent Router Skeleton */}
      <IntentSkeleton />
      
      {/* Section Skeleton */}
      <SectionSkeleton />
      
      {/* Additional sections */}
      <div className="section bg-brand-black">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header Skeleton */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-32 h-3 bg-brand-surface-2 rounded animate-pulse mx-auto mb-3" />
            <div className="w-48 sm:w-64 h-6 sm:h-8 bg-brand-surface-2 rounded animate-pulse mx-auto" />
          </div>
          
          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-[4/3] bg-brand-surface-2 animate-pulse" />
                <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                  <div className="w-3/4 h-4 bg-brand-surface-2 rounded animate-pulse" />
                  <div className="w-1/2 h-3 bg-brand-surface-2 rounded animate-pulse" />
                  <div className="w-full h-3 bg-brand-surface-2 rounded animate-pulse" />
                  <div className="flex justify-between items-center pt-2 border-t border-brand-border mt-3">
                    <div className="w-20 h-5 bg-brand-surface-2 rounded animate-pulse" />
                    <div className="w-6 h-6 bg-brand-surface-2 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Skeleton */}
      <div className="py-12 sm:py-16 bg-brand-gold/10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="w-64 sm:w-80 h-6 sm:h-8 bg-brand-surface-2 rounded animate-pulse mx-auto mb-4" />
          <div className="w-48 sm:w-64 h-4 bg-brand-surface-2 rounded animate-pulse mx-auto mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="w-32 h-10 bg-brand-surface-2 rounded animate-pulse" />
            <div className="w-28 h-10 bg-brand-surface-2 rounded animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Footer spacer */}
      <div className="flex-1" />
      
      {/* Footer Skeleton */}
      <div className="bg-brand-surface py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="w-20 h-4 bg-brand-surface-2 rounded animate-pulse" />
                <div className="w-16 h-3 bg-brand-surface-2 rounded animate-pulse" />
                <div className="w-24 h-3 bg-brand-surface-2 rounded animate-pulse" />
                <div className="w-20 h-3 bg-brand-surface-2 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
