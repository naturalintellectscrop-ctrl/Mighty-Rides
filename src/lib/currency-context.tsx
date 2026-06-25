'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useSyncExternalStore } from 'react'

type Currency = 'UGX' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  rate: number
  formatPrice: (ugx: string | number) => string
  convertToUsd: (ugx: string | number) => number
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const DEFAULT_RATE = 3700

// Custom store for currency preference using useSyncExternalStore pattern
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getSnapshot(): Currency {
  if (typeof window === 'undefined') return 'UGX'
  return (localStorage.getItem('mr_currency') as Currency) || 'UGX'
}

function getServerSnapshot(): Currency {
  return 'UGX'
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore for localStorage sync - React 18 recommended pattern
  const storedCurrency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [rate, setRate] = useState<number>(DEFAULT_RATE)

  // Fetch exchange rate on mount
  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchRate() {
      try {
        const res = await fetch('/api/settings/ugx_usd_rate', { signal: controller.signal })
        const data = await res.json()
        if (data.value) {
          setRate(parseFloat(data.value))
        }
      } catch {
        // Use default rate
      }
    }
    
    fetchRate()
    return () => controller.abort()
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    localStorage.setItem('mr_currency', newCurrency)
    // Dispatch storage event to notify other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: 'mr_currency', newValue: newCurrency }))
  }, [])

  const convertToUsd = useCallback((ugx: string | number): number => {
    const ugxNum = typeof ugx === 'string' ? parseFloat(ugx) : ugx
    return Math.round(ugxNum / rate)
  }, [rate])

  const formatPrice = useCallback((ugx: string | number): string => {
    const ugxNum = typeof ugx === 'string' ? parseFloat(ugx) : ugx
    const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    if (storedCurrency === 'UGX') {
      return `UGX ${formatNumber(ugxNum)}`
    } else {
      return `USD ${formatNumber(Math.round(ugxNum / rate))}`
    }
  }, [storedCurrency, rate])

  const value = useMemo(() => ({
    currency: storedCurrency,
    setCurrency,
    rate,
    formatPrice,
    convertToUsd,
  }), [storedCurrency, setCurrency, rate, formatPrice, convertToUsd])

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
