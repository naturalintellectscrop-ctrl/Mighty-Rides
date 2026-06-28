'use client'

import { useRouter, usePathname } from 'next/navigation'

interface Occasion {
  id: string
  label: string
  icon: string
}

interface HireClientProps {
  occasions: Occasion[]
  selectedOccasion?: string
}

export default function HireClient({ occasions, selectedOccasion }: HireClientProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleOccasionClick = (id: string) => {
    if (selectedOccasion === id) {
      router.push(pathname)
    } else {
      router.push(`${pathname}?occasion=${id}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => router.push(pathname)}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          !selectedOccasion
            ? 'bg-[#C8952A] text-black'
            : 'bg-[#0A0A0A] text-[#B0B0B0] border border-[#222222] hover:border-[#C8952A]'
        }`}
      >
        All Vehicles
      </button>
      {occasions.map((occasion) => (
        <button
          key={occasion.id}
          onClick={() => handleOccasionClick(occasion.id)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            selectedOccasion === occasion.id
              ? 'bg-[#C8952A] text-black'
              : 'bg-[#0A0A0A] text-[#B0B0B0] border border-[#222222] hover:border-[#C8952A]'
          }`}
        >
          {occasion.label}
        </button>
      ))}
    </div>
  )
}
