'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { blurProps } from '@/lib/images'

const PAD = 'px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28'

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=1400&q=82&auto=format&fit=crop`

const chapters = [
  {
    n: '01',
    eyebrow: 'The Selection',
    title: 'Curated, never catalogued',
    body: 'Every vehicle earns its place. We choose for presence, provenance and condition — so the hardest part is simply deciding which one is you.',
    img: img('1583121274602-3e2820c69888'),
  },
  {
    n: '02',
    eyebrow: 'The Handover',
    title: 'Delivered to your door',
    body: 'White-glove handover, keys in hand, in showroom condition. Detailed, fuelled and briefed — all you bring is the occasion.',
    img: img('1552519507-da3b142c6e3d'),
  },
  {
    n: '03',
    eyebrow: 'The Drive',
    title: 'Yours for the moment',
    body: 'From a wedding convoy to a boardroom arrival, the road is now part of the story. Arrive with intent; we handle the rest.',
    img: img('1503376780353-7e6692767b70'),
  },
]

/**
 * OwnershipStory — a cinematic scroll-told section. On desktop the visual pins
 * (sticky) and cross-fades between chapters as the copy scrolls past its centre,
 * driven by an IntersectionObserver on each chapter. On mobile it degrades to a
 * clean single column with an inline image per chapter. GPU-friendly (opacity
 * only) and reduced-motion safe (the global reduced-motion rule collapses the
 * cross-fade to an instant, still-readable swap).
 */
export function OwnershipStory() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.idx))
        }
      },
      // A chapter becomes active as it crosses the vertical centre band.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="relative bg-[#100f0e] text-white overflow-hidden">
      {/* Ambient lighting for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 78% 30%, rgba(200,149,42,0.10), transparent 70%)' }}
      />

      <div className={`relative ${PAD}`}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Sticky visual (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-0 h-screen flex items-center">
              <div className="relative w-full aspect-[4/5] max-h-[82vh] rounded-2xl overflow-hidden bg-[#141210] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]">
                {chapters.map((c, i) => (
                  <Image
                    key={i}
                    src={c.img}
                    alt=""
                    fill
                    sizes="50vw"
                    {...blurProps}
                    className={cn(
                      'object-cover transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                      i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.06]',
                    )}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                <span className="absolute bottom-6 left-7 font-display text-sm tracking-[0.35em] text-white/85">
                  {chapters[active].n}<span className="text-white/40"> / 0{chapters.length}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Scrolling chapters */}
          <div>
            {chapters.map((c, i) => (
              <div
                key={i}
                data-idx={i}
                ref={(el) => { refs.current[i] = el }}
                className="min-h-[68vh] lg:min-h-screen flex flex-col justify-center py-16 lg:py-0"
              >
                {/* Inline visual (mobile only) */}
                <div className="lg:hidden relative aspect-[4/3] rounded-2xl overflow-hidden mb-8 bg-[#141210] reveal">
                  <Image src={c.img} alt="" fill sizes="100vw" {...blurProps} className="object-cover" />
                </div>

                <div className="reveal reveal-group">
                  <p className="text-xs text-[#C8952A] uppercase tracking-[0.3em] mb-5 font-semibold">
                    {c.eyebrow}
                  </p>
                  <h3 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.04] tracking-tight mb-6">
                    {c.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
