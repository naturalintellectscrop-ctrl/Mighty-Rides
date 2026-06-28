// Currency utilities for Mighty Rides
// All prices stored as BigInt in UGX
// USD displayed at runtime using exchange rate from settings

import { db } from './db'

let cachedRate: number | null = null
let cacheExpiry: number = 0

/**
 * Get the current UGX to USD exchange rate
 */
export async function getExchangeRate(): Promise<number> {
  const now = Date.now()
  
  if (cachedRate && cacheExpiry > now) {
    return cachedRate
  }

  const setting = await db.setting.findUnique({
    where: { key: 'ugx_usd_rate' },
  })

  cachedRate = setting ? parseFloat(setting.value) : 3700
  cacheExpiry = now + 5 * 60 * 1000 // Cache for 5 minutes

  return cachedRate
}

/**
 * Convert UGX to USD
 */
export async function ugxToUsd(ugx: string | number): Promise<number> {
  const rate = await getExchangeRate()
  const ugxNum = typeof ugx === 'string' ? parseFloat(ugx) : ugx
  return Math.round(ugxNum / rate)
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number | string): string {
  const numStr = typeof num === 'string' ? num : num.toString()
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format UGX price for display
 */
export function formatUgx(ugx: string | number): string {
  return `UGX ${formatNumber(ugx)}`
}

/**
 * Format USD price for display
 */
export function formatUsd(usd: number): string {
  return `USD ${formatNumber(usd)}`
}

/**
 * Format price in both currencies
 */
export async function formatDualCurrency(ugx: string | number): Promise<string> {
  const usd = await ugxToUsd(ugx)
  return `${formatUgx(ugx)} / ${formatUsd(usd)}`
}

/**
 * Parse BigInt string safely
 */
export function parseBigInt(value: string): number {
  return parseInt(value, 10) || 0
}

/**
 * Convert number to BigInt string for storage
 */
export function toBigIntString(value: number): string {
  return Math.round(value).toString()
}
