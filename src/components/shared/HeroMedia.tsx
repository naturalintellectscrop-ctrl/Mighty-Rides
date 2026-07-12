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
}

/**
 * HeroMedia — a cinematic hero backdrop that upgrades gracefully from a
 * high-resolution still to an ambient video when a clip is supplied. The still
 * doubles as the video poster, so the hero is never blank while the clip
 * buffers. Honours reduced-motion (pauses the clip; the poster remains).
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
}: HeroMediaProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
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

  return (
    <div className="absolute inset-0 z-0">
      {video ? (
        <video
          ref={ref}
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
      <div className={cn('absolute inset-0', overlayClassName)} />
    </div>
  )
}
