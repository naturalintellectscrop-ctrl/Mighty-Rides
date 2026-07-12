'use client'

interface ScrollCueProps {
  className?: string
  label?: string
}

/**
 * ScrollCue — a minimal "scroll to explore" indicator for cinematic heroes:
 * a slim capsule with a softly pulsing dot. Purely decorative (aria-hidden).
 */
export function ScrollCue({ className, label = 'Scroll' }: ScrollCueProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col items-center gap-3 select-none ${className ?? ''}`}
    >
      <span className="text-[10px] uppercase tracking-[0.35em] text-white/60 font-semibold">
        {label}
      </span>
      <span className="relative flex h-11 w-6 items-start justify-center rounded-full border border-white/25 pt-2">
        <span className="scroll-cue-dot h-2 w-1 rounded-full bg-[#C8952A]" />
      </span>
    </div>
  )
}
