'use client'

import Link from 'next/link'
import { useRef, type ReactNode, type MouseEvent } from 'react'

interface MagneticButtonProps {
  href: string
  children: ReactNode
  className?: string
  /** Pull strength (px of travel at the pointer edge). Default 14. */
  strength?: number
  external?: boolean
  ariaLabel?: string
}

/**
 * MagneticButton — a link that subtly leans toward the cursor, then springs
 * back on leave. A restrained premium microinteraction (no wobble, no lag).
 * Disabled on touch/coarse pointers and under reduced-motion.
 */
export function MagneticButton({
  href,
  children,
  className,
  strength = 14,
  external = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  const canMagnetize = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el || !canMagnetize()) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate(${(x / rect.width) * strength * 2}px, ${(y / rect.height) * strength * 2}px)`
  }

  const reset = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  const rel = external ? 'noopener noreferrer' : undefined
  const target = external ? '_blank' : undefined

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', willChange: 'transform' }}
    >
      {children}
    </Link>
  )
}
