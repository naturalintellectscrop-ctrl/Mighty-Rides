'use client'

import { useCurrency } from '@/context'
import { cn } from '@/lib/utils'

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="inline-flex rounded-lg border border-brand-border overflow-hidden">
      <button
        onClick={() => setCurrency('UGX')}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors',
          currency === 'UGX'
            ? 'bg-brand-gold text-brand-black'
            : 'bg-transparent text-brand-silver hover:text-brand-white'
        )}
      >
        UGX
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors',
          currency === 'USD'
            ? 'bg-brand-gold text-brand-black'
            : 'bg-transparent text-brand-silver hover:text-brand-white'
        )}
      >
        USD
      </button>
    </div>
  )
}
