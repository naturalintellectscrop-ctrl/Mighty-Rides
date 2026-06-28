import { db } from './db'

/**
 * Settings fetch that degrades gracefully: returns [] instead of throwing if the
 * database is momentarily unreachable, so public pages render with sensible
 * fallback values rather than the global error boundary ("Something Went Wrong").
 */
export async function safeSettings() {
  try {
    return await db.setting.findMany()
  } catch (error) {
    console.error('[settings] DB unavailable:', error)
    return []
  }
}
