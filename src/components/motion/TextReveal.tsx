'use client'

import type { CSSProperties, ElementType, ReactNode } from 'react'

interface TextRevealProps {
  /** Each entry becomes one masked line that rises into view. A line may be a
   *  string or rich content (e.g. a coloured <span>) to preserve emphasis. */
  lines: ReactNode[]
  /** Element to render as (h1, h2, p…). Defaults to span. */
  as?: ElementType
  className?: string
  /** Delay between lines, ms. */
  stagger?: number
  /** Delay before the first line, ms. */
  startDelay?: number
}

/**
 * TextReveal — cinematic line-by-line headline reveal. Each line sits inside an
 * overflow-hidden mask and rises from below, staggered. MotionRoot adds
 * `.is-visible` when it scrolls into view (see globals `.text-reveal`). Text is
 * fully visible without JS / under reduced-motion.
 */
export function TextReveal({
  lines,
  as: Tag = 'span',
  className,
  stagger = 90,
  startDelay = 0,
}: TextRevealProps) {
  return (
    <Tag className={`text-reveal ${className ?? ''}`}>
      {lines.map((line, i) => (
        <span className="tr-line" key={i}>
          <span
            className="tr-inner"
            style={{ '--tr-delay': `${startDelay + i * stagger}ms` } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
