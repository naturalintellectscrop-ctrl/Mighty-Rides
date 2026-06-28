import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const setting = await db.setting.findUnique({
      where: { key: 'ugx_usd_rate' },
    })
    return NextResponse.json({ value: setting ? parseFloat(setting.value) : 3700 })
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    return NextResponse.json({ value: 3700 })
  }
}
