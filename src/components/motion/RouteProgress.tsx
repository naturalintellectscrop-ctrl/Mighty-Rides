'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * RouteProgress — a slim gold navigation bar (NProgress-style) that trickles
 * forward when an internal link is clicked and completes when the new route
 * commits. Gives premium, immediate feedback that a page is loading without a
 * heavy library. Purely decorative (aria-hidden); reduced-motion shows a static
 * bar that simply completes.
 */
export function RouteProgress() {
  const pathname = usePathname()
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const active = useRef(false)
  const trickle = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const start = () => {
      if (active.current) return
      active.current = true
      setVisible(true)
      setWidth(8)
      if (reduce.current) {
        setWidth(85)
        return
      }
      let w = 8
      const step = () => {
        w = Math.min(w + Math.random() * 12, 88)
        setWidth(w)
        trickle.current = setTimeout(step, 220)
      }
      trickle.current = setTimeout(step, 140)
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as HTMLElement)?.closest?.('a')
      if (!anchor) return
      const href = anchor.getAttribute('href') || ''
      const target = anchor.getAttribute('target')
      if (target === '_blank' || anchor.hasAttribute('download')) return
      // Internal, cross-page navigations only.
      if (!href.startsWith('/') || href.startsWith('//')) return
      if (href === pathname || href.startsWith(`${pathname}#`) || href.startsWith('#')) return
      start()
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', start)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', start)
    }
  }, [pathname])

  // Complete when the route actually changes.
  useEffect(() => {
    if (!active.current) return
    if (trickle.current) clearTimeout(trickle.current)
    setWidth(100)
    const hide = setTimeout(() => setVisible(false), 260)
    const reset = setTimeout(() => {
      setWidth(0)
      active.current = false
    }, 560)
    return () => {
      clearTimeout(hide)
      clearTimeout(reset)
    }
  }, [pathname])

  return (
    <div
      className="route-progress"
      style={{ width: `${width}%`, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  )
}
