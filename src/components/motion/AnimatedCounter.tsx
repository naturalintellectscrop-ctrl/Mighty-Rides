'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  /** Numeric target to count up to. */
  value: number
  /** Text rendered before the number (e.g. a currency symbol). */
  prefix?: string
  /** Text rendered after the number (e.g. "+", "K", "%"). */
  suffix?: string
  /** Milliseconds for the full count. */
  duration?: number
  /** Group thousands with commas. */
  separator?: boolean
  className?: string
}

/**
 * AnimatedCounter — counts from 0 to `value` once it scrolls into view.
 * Uses an expo-out easing so the number settles gracefully. Respects
 * reduced-motion (renders the final value immediately).
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1800,
  separator = false,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplay(value)
      return
    }

    const run = () => {
      if (started.current) return
      started.current = true
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3) // expo/cubic-out
        setDisplay(Math.round(eased * value))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
            obs.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  const formatted = separator ? display.toLocaleString() : String(display)

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
