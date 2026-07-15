'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, ArrowRight, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { blurProps } from '@/lib/images'

export interface GalleryItem {
  src: string
  vehicleName: string
  make: string
  category: string
  href: string
}

/**
 * GalleryGrid — an editorial, filterable showcase of the whole fleet.
 *
 * - Varied tile sizes (every 7th tile spans wide) so the grid reads as a
 *   magazine spread rather than a uniform product wall.
 * - Click opens a full-screen lightbox: keyboard operable (←/→/Esc), scroll
 *   locked, with a link through to the vehicle.
 */
export function GalleryGrid({ items, categories }: { items: GalleryItem[]; categories: string[] }) {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState<number | null>(null)

  const shown = filter === 'All' ? items : items.filter((i) => i.category === filter)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + shown.length) % shown.length)),
    [shown.length],
  )

  // Keyboard control + scroll lock while the lightbox is open.
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close, step])

  const active = open === null ? null : shown[open]

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 mb-10 reveal">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => { setFilter(c); setOpen(null) }}
            aria-pressed={filter === c}
            className={cn(
              'px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300',
              filter === c
                ? 'bg-[#C8952A] text-black'
                : 'border border-white/15 text-gray-300 hover:border-[#C8952A]/60 hover:text-white',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-gray-400 py-20 text-center">No photography in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-[190px] md:auto-rows-[240px] gap-3 md:gap-4">
          {shown.map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View ${item.vehicleName} photograph`}
              className={cn(
                'group relative overflow-hidden rounded-xl bg-[#141210] reveal',
                // Editorial rhythm: an occasional wide/tall feature tile.
                i % 7 === 0 && 'col-span-2 row-span-2',
                i % 7 === 4 && 'lg:row-span-2',
              )}
            >
              <Image
                src={item.src}
                alt={`${item.vehicleName} — ${item.category}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                {...blurProps}
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <p className="text-[10px] text-[#C8952A] uppercase tracking-[0.2em] font-semibold">{item.make}</p>
                <p className="text-white font-semibold text-sm mt-0.5 truncate">{item.vehicleName}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.vehicleName} photograph`}
          onClick={close}
        >
          <div className="flex items-center justify-between p-5 md:p-6 shrink-0">
            <div>
              <p className="text-[10px] text-[#C8952A] uppercase tracking-[0.25em] font-semibold">{active.make}</p>
              <p className="text-white font-semibold mt-1">{active.vehicleName}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 min-h-0 mx-4 md:mx-16 mb-4" onClick={(e) => e.stopPropagation()}>
            <Image
              key={active.src}
              src={active.src}
              alt={`${active.vehicleName} — ${active.category}`}
              fill
              sizes="100vw"
              {...blurProps}
              className="object-contain animate-[fadeIn_0.4s_ease-out]"
            />
          </div>

          <div className="flex items-center justify-center gap-4 pb-6 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photograph"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#C8952A] hover:text-black text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white/60 text-xs tabular-nums tracking-widest">
              {(open ?? 0) + 1} / {shown.length}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photograph"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#C8952A] hover:text-black text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href={active.href}
              className="ml-3 inline-flex items-center gap-2 bg-[#C8952A] text-black px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wide hover:bg-[#D4A644] transition-colors"
            >
              <Camera className="w-3.5 h-3.5" /> View vehicle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
