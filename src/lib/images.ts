/**
 * Shared image helpers for a consistent, premium presentation.
 *
 * BLUR_DATA_URL — a tiny warm-charcoal gradient used as the `blurDataURL` for
 * next/image `placeholder="blur"`. Remote images can't be blur-analysed at
 * build time, so we supply this neutral on-brand placeholder; every vehicle
 * photo then resolves with an elegant blur-up instead of popping in.
 */
export const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSdnJyB4MT0nMCcgeTE9JzAnIHgyPScwJyB5Mj0nMSc+PHN0b3Agb2Zmc2V0PScwJyBzdG9wLWNvbG9yPScjMWYxZDFhJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjMTQxMjEwJy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSd1cmwoI2cpJy8+PC9zdmc+'

/** Spread onto a next/image to get the on-brand blur-up treatment. */
export const blurProps = {
  placeholder: 'blur' as const,
  blurDataURL: BLUR_DATA_URL,
}
