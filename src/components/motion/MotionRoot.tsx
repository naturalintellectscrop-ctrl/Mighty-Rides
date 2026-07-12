'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * MotionRoot — the site-wide scroll-reveal engine.
 *
 * A single IntersectionObserver watches every `.reveal` / `.reveal-group`
 * element and adds `.is-visible` as it enters the viewport, driving the CSS
 * transitions defined in globals.css. Because the at-rest hidden state is gated
 * behind `html.js-motion`, content is always visible without JS or before this
 * mounts — no FOUC, no hidden content for crawlers.
 *
 * Mounted once in the root layout. Re-scans on route change and observes DOM
 * mutations so client-navigated pages animate too. Honours reduced-motion by
 * revealing everything immediately.
 */
export function MotionRoot() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('js-motion')

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const reveal = (el: Element) => el.classList.add('is-visible')

    // Reduced motion: reveal on sight with no transition delay.
    if (prefersReduced) {
      document.querySelectorAll('.reveal, .reveal-group').forEach(reveal)
      return
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    const observed = new WeakSet<Element>()
    const scan = () => {
      document.querySelectorAll('.reveal, .reveal-group').forEach((el) => {
        if (observed.has(el) || el.classList.contains('is-visible')) return
        observed.add(el)
        // Anything already within/above the viewport on load reveals right away.
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92) reveal(el)
        else observer.observe(el)
      })
    }

    // Double rAF: wait for the freshly-navigated DOM to paint before measuring.
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(scan)
    })

    // Catch async / suspense content mounted after the initial scan. Only react
    // to added element nodes, and coalesce bursts into a single rAF-batched scan
    // so text updates (e.g. animated counters) don't trigger repeated work.
    let queued = false
    const mo = new MutationObserver((records) => {
      if (queued) return
      const hasNewElements = records.some((r) =>
        Array.from(r.addedNodes).some((n) => n.nodeType === 1),
      )
      if (!hasNewElements) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        scan()
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      mo.disconnect()
      observer.disconnect()
    }
  }, [pathname])

  return null
}
