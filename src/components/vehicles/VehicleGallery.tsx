'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { blurProps } from '@/lib/images'

/**
 * VehicleGallery — an interactive, cinematic product gallery.
 * - Thumbnails switch the hero image with a smooth crossfade.
 * - Hover zooms the active image; arrows and thumbnails are keyboard-operable.
 * - A frame counter grounds the viewer. All images are stacked and only the
 *   active one is opaque, so switching never reflows the layout.
 */
export function VehicleGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const count = photos.length

  const go = useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + count) % count),
    [count],
  )

  if (count === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-[#1B1A18] flex flex-col items-center justify-center gap-3 text-[#8A857C]">
        <ImageOff className="w-10 h-10" />
        <p className="text-sm">No photos available</p>
      </div>
    )
  }

  return (
    <div className="reveal reveal-left space-y-4">
      {/* Hero frame */}
      <div
        className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#141210] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${alt} gallery`}
      >
        {photos.map((p, i) => (
          <Image
            key={i}
            src={p}
            alt={`${alt} — photo ${i + 1}`}
            fill
            priority={i === 0}
            {...blurProps}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              'object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
              i === active ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-0 scale-105',
            )}
          />
        ))}

        {/* Top sheen for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#C8952A] hover:text-black transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#C8952A] hover:text-black transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 right-4 bg-black/55 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full tracking-wide">
              {active + 1} / {count}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative w-24 h-16 shrink-0 rounded-lg overflow-hidden transition-all duration-300',
                i === active
                  ? 'ring-2 ring-[#C8952A] ring-offset-2 ring-offset-[#141312]'
                  : 'opacity-55 hover:opacity-100',
              )}
            >
              <Image src={p} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
