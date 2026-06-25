'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react'

type Currency = 'UGX' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  rate: number
  formatPrice: (amount: number) => string
  formatDualPrice: (amount: number) => string
  convertToUsd: (amount: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const STORAGE_KEY = 'mr_currency'
const DEFAULT_RATE = 3700

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('UGX')
  const [rate, setRate] = useState(DEFAULT_RATE)

  // Fetch exchange rate from settings
  useEffect(() => {
    const controller = new AbortController()
    const fetchRate = async () => {
      try {
        const res = await fetch('/api/settings/ugx_usd_rate', { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          setRate(data.value || DEFAULT_RATE)
        }
      } catch (error) {
        if (!(error instanceof Error && error.name === 'AbortError')) {
          console.error('Failed to fetch exchange rate:', error)
        }
      }
    }
    fetchRate()
    return () => controller.abort()
  }, [])

  // Sync currency from localStorage on mount
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY) as Currency | null
      if (stored === 'UGX' || stored === 'USD') {
        setCurrencyState(prev => prev !== stored ? stored : prev)
      }
    }
    // Initial read
    handleStorageChange()
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newCurrency)
    }
  }, [])

  const formatPrice = useCallback((amount: number): string => {
    if (currency === 'UGX') {
      return new Intl.NumberFormat('en-UG').format(amount) + ' UGX'
    }
    const usdAmount = Math.round(amount / rate)
    return '$' + new Intl.NumberFormat('en-US').format(usdAmount) + ' USD'
  }, [currency, rate])

  const formatDualPrice = useCallback((amount: number): string => {
    const ugx = new Intl.NumberFormat('en-UG').format(amount) + ' UGX'
    const usdAmount = Math.round(amount / rate)
    const usd = '$' + new Intl.NumberFormat('en-US').format(usdAmount) + ' USD'
    return `${ugx} / ${usd}`
  }, [rate])

  const convertToUsd = useCallback((amount: number): number => {
    return Math.round(amount / rate)
  }, [rate])

  const value = useMemo(() => ({
    currency,
    setCurrency,
    rate,
    formatPrice,
    formatDualPrice,
    convertToUsd,
  }), [currency, setCurrency, rate, formatPrice, formatDualPrice, convertToUsd])

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
