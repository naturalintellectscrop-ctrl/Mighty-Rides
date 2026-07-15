'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface HeroMediaProps {
  /** Poster / fallback still — always required so there is never an empty hero. */
  image: string
  /** Optional cinematic background clip (mp4/webm). When present it plays muted
   *  on loop with the still as its poster; when absent the still is used alone. */
  video?: string
  alt: string
  priority?: boolean
  /** Extra classes for the media element (e.g. `kenburns` for the still). */
  mediaClassName?: string
  /** Overlay gradient for text legibility. Defaults to the shared hero-gradient. */
  overlayClassName?: string
  /** Gentle scroll parallax on the backdrop. Default on. */
  parallax?: boolean
  /** Ambient warm light bloom (set to the light source in the photo). */
  bloom?: boolean
  /** CSS position of the bloom centre, e.g. '18% 35%'. */
  bloomAt?: string
}

/**
 * HeroMedia — a cinematic hero backdrop.
 *
 * Upgrades gracefully from a high-resolution still to an ambient video when a
 * clip is supplied (the still doubles as the poster, so the hero is never blank
 * while the clip buffers). When there is no clip, the still is made to feel like
 * footage through three restrained layers:
 *   1. a slow Ken Burns push (via `mediaClassName="kenburns"`),
 *   2. a drifting warm bloom placed at the photo's light source, and
 *   3. gentle scroll parallax.
 * All three honour prefers-reduced-motion.
 *
 * Drop-in video: put an .mp4 in /public and pass its path as `video`.
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
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      v.removeAttribute('autoplay')
      v.pause()
      return
    }
    // Muted autoplay is permitted; ignore the promise rejection on strict browsers.
    v.play().catch(() => {})
  }, [])

  // Scroll parallax: the backdrop drifts slower than the page, adding depth.
  // rAF-throttled, transform-only (GPU), and it stops once the hero is passed.
  useEffect(() => {
    if (!parallax) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

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
  }, [parallax])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Parallax layer — over-sized vertically so the drift never reveals an edge */}
      <div ref={layerRef} className="absolute inset-x-0 -inset-y-[14%] will-change-transform">
        {video ? (
          <video
            ref={videoRef}
            className={cn('h-full w-full object-cover', mediaClassName)}
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
            className={cn('object-cover', mediaClassName)}
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
