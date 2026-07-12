'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'

/**
 * PageTransition — replays a gentle crossfade on the page content each time the
 * route changes, WITHOUT remounting children (no state loss, no scroll jump, no
 * re-fetch). It toggles the `.page-enter` class and forces a reflow so the CSS
 * animation restarts. Opacity-only, so it never interferes with the fixed
 * Navbar. Honours reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useEffect(() => {
    // The initial render already carries `.page-enter`; only replay on change.
    if (first.current) {
      first.current = false
      return
    }
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.remove('page-enter')
    void el.offsetWidth // force reflow to restart the animation
    el.classList.add('page-enter')
  }, [pathname])

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  )
}
