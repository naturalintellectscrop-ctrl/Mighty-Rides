/**
 * Canonical site origin used for metadataBase, canonical URLs, sitemap, robots
 * and structured-data URLs. Set NEXT_PUBLIC_SITE_URL once a custom domain is live.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'https://mighty-rides.vercel.app'
).replace(/\/$/, '')

/** Absolute URL for a path on the canonical origin. */
export function absoluteUrl(path = ''): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
