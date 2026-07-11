'use client'

import { useCurrency } from '@/context'
import { cn } from '@/lib/utils'

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="inline-flex rounded-lg border border-[#DAD6CD] bg-white overflow-hidden">
      <button
        onClick={() => setCurrency('UGX')}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors',
          currency === 'UGX'
            ? 'bg-[#C8952A] text-black'
            : 'bg-transparent text-[#5C574F] hover:text-[#1A1815]'
        )}
      >
        UGX
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors',
          currency === 'USD'
            ? 'bg-[#C8952A] text-black'
            : 'bg-transparent text-[#5C574F] hover:text-[#1A1815]'
        )}
      >
        USD
      </button>
    </div>
  )
}
