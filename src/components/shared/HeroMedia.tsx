'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface HeroMediaProps {
  /** Poster / fallback still — always required so there is never an empty hero. */
  image: string
  /** Optional cinematic background clip (mp4/webm). Desktop only — see notes. */
  video?: string
  alt: string
  priority?: boolean
  /** Extra classes for the STILL only (e.g. `kenburns`). Never applied to the
   *  video — a clip carries its own motion, so a CSS push would double up.
   *  Also skipped on mobile, where any extra scale worsens the crop. */
  mediaClassName?: string
  /** Overlay gradient for text legibility. Defaults to the shared hero-gradient. */
  overlayClassName?: string
  /** Gentle scroll parallax on the backdrop. Desktop only. Default on. */
  parallax?: boolean
  /** Ambient warm light bloom (set to the light source in the photo). */
  bloom?: boolean
  /** CSS position of the bloom centre, e.g. '18% 35%'. */
  bloomAt?: string
  /** object-position for the backdrop. On a portrait phone a 16:9 asset is
   *  cropped hard, so use this to keep the subject in frame. */
  objectPosition?: string
}

const DESKTOP = '(min-width: 768px)'
const REDUCED = '(prefers-reduced-motion: reduce)'

/**
 * HeroMedia — a cinematic hero backdrop.
 *
 * Upgrades from a high-resolution still to an ambient clip on desktop (the
 * still is the poster, so the hero never blanks while it buffers), and layers
 * on a Ken Burns push, a warm bloom at the photo's light source, and gentle
 * scroll parallax.
 *
 * IMPORTANT — mobile. A 16:9 backdrop inside a portrait phone viewport is
 * already cropped to roughly its middle third by object-cover. Anything that
 * scales the media further compounds that crop, so on mobile we deliberately
 * drop all three: no clip (also saving its download on cellular), no Ken Burns,
 * and no parallax over-sizing. The still renders at its natural cover scale and
 * `objectPosition` keeps the subject in frame. Everything also respects
 * prefers-reduced-motion.
 */
export function HeroMedia({
  image,
  video,
  alt,
  priority,
  mediaClassName,
  overlayClassName = 'hero-gradient',
  parallax = true,
  bloom = true,
  bloomAt = '20% 35%',
  objectPosition,
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  // 'unknown' until mounted so SSR renders the still (also the best LCP element).
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const dq = window.matchMedia(DESKTOP)
    const rq = window.matchMedia(REDUCED)
    const sync = () => {
      setIsDesktop(dq.matches)
      setReduced(rq.matches)
    }
    sync()
    dq.addEventListener('change', sync)
    rq.addEventListener('change', sync)
    return () => {
      dq.removeEventListener('change', sync)
      rq.removeEventListener('change', sync)
    }
  }, [])

  const showVideo = Boolean(video) && isDesktop === true && !reduced
  const parallaxOn = parallax && isDesktop === true && !reduced

  // Play only while the hero is on screen — decoding video nobody can see burns
  // battery and main-thread time. Also pauses when the tab is hidden.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.01 },
    )
    io.observe(v)

    const onVisibility = () => { if (document.hidden) v.pause() }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [showVideo])

  // Scroll parallax: transform-only (GPU), rAF-throttled, stops past the hero.
  useEffect(() => {
    if (!parallaxOn) {
      // Clear any transform left over from a resize across the breakpoint.
      if (layerRef.current) layerRef.current.style.transform = ''
      return
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = layerRef.current
        if (!el) return
        const y = window.scrollY
        if (y > window.innerHeight * 1.25) return
        el.style.transform = `translate3d(0, ${y * 0.22}px, 0)`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [parallaxOn])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Only over-size the layer when parallax will actually run — the extra
          height is drift headroom, and on mobile it would just add zoom. */}
      <div
        ref={layerRef}
        className={cn('absolute', parallaxOn ? 'inset-x-0 -inset-y-[14%] will-change-transform' : 'inset-0')}
      >
        {showVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={objectPosition ? { objectPosition } : undefined}
            poster={image}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label={alt}
          >
            <source src={video} />
          </video>
        ) : (
          <Image
            src={image}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            style={objectPosition ? { objectPosition } : undefined}
            // Ken Burns only where it doesn't worsen the mobile crop.
            className={cn('object-cover', isDesktop === true && !reduced && mediaClassName)}
          />
        )}
      </div>

      {/* Ambient warm bloom at the photo's light source */}
      {bloom && (
        <div
          aria-hidden="true"
          className="hero-bloom pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(38% 45% at ${bloomAt}, rgba(255,186,92,0.30), rgba(200,149,42,0.10) 45%, transparent 72%)`,
          }}
        />
      )}

      <div className={cn('absolute inset-0', overlayClassName)} />
    </div>
  )
}
