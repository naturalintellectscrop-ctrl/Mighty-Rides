'use client'

// Hero skeleton - shown during initial load
export function HeroSkeleton() {
  return (
    <section className="relative min-h-[100svh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-brand-black">
      <div className="container mx-auto px-4 sm:px-6 py-24 sm:py-32 pt-32 sm:pt-40">
        <div className="max-w-3xl">
          {/* Eyebrow skeleton */}
          <div className="h-4 w-48 skeleton rounded mb-4 sm:mb-6" />
          
          {/* Headline skeleton */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <div className="h-10 sm:h-12 md:h-14 w-full max-w-md skeleton rounded" />
            <div className="h-10 sm:h-12 md:h-14 w-2/3 max-w-xs skeleton rounded" />
          </div>
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-6 sm:mb-10">
            <div className="h-4 w-full max-w-lg skeleton rounded" />
            <div className="h-4 w-3/4 max-w-md skeleton rounded" />
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-16">
            <div className="h-12 w-full sm:w-40 skeleton rounded" />
            <div className="h-12 w-full sm:w-36 skeleton rounded" />
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-8 pt-6 sm:pt-8 border-t border-brand-border/50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full skeleton" />
                <div className="text-center sm:text-left">
                  <div className="h-6 w-12 skeleton rounded mb-1" />
                  <div className="h-3 w-16 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Card skeleton for vehicles and services
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[4/3] skeleton" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="h-5 w-3/4 skeleton rounded" />
            <div className="h-3 w-1/2 skeleton rounded" />
            <div className="pt-3 border-t border-brand-border flex justify-between">
              <div className="h-5 w-20 skeleton rounded" />
              <div className="h-4 w-4 skeleton rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Section skeleton
export function SectionSkeleton() {
  return (
    <div className="section bg-brand-surface relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <div className="h-4 w-32 skeleton rounded mb-2 mx-auto" />
          <div className="h-8 w-48 skeleton rounded mx-auto" />
        </div>
        <CardSkeleton count={4} />
      </div>
    </div>
  )
}

// Intent router skeleton
export function IntentSkeleton() {
  return (
    <div className="section bg-brand-black relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <div className="h-4 w-32 skeleton rounded mb-2 mx-auto" />
          <div className="h-8 w-40 skeleton rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 skeleton rounded-lg sm:rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-24 skeleton rounded" />
                <div className="h-3 w-full skeleton rounded" />
                <div className="h-3 w-3/4 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
