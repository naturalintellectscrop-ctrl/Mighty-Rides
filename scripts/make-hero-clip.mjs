/**
 * Render the ambient hero clip from the hero still.
 *
 *   npm i ffmpeg-static --no-save      # one-off; not a project dependency
 *   node scripts/make-hero-clip.mjs
 *
 * Produces `public/hero.mp4`: a 12s seamless Ken Burns loop.
 *
 * Why it loops cleanly: the zoom ramps 1.00 → 1.10 over the first half and back
 * to 1.00 over the second, so the final frame matches the first and the wrap is
 * invisible. (A one-way zoom visibly snaps every repeat.)
 *
 * Why it pre-scales to 3840 first: zoompan samples from the *scaled* source, so
 * upscaling before the zoom avoids its well-known pixel jitter.
 *
 * NOTE ON QUALITY: the clip can only ever be as sharp as the still it is
 * rendered from, and zooming in crops away pixels. A ~1080px-wide source will
 * look soft full-screen. Feed this a 3000px+ original for a crisp result.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'

const SRC = 'public/hero_image.jpeg'
const OUT = 'public/hero.mp4'

const DURATION = 12
const FPS = 25
const ZOOM = 0.10 // 10% push
const frames = DURATION * FPS
const half = frames / 2

let ffmpeg
try {
  ffmpeg = (await import('ffmpeg-static')).default
} catch {
  console.error('ffmpeg-static not found. Run:  npm i ffmpeg-static --no-save')
  process.exit(1)
}

if (!existsSync(SRC)) {
  console.error(`Source still not found: ${SRC}`)
  process.exit(1)
}

// Ramp up to `half`, then back down — the seam-free loop.
const z = `if(lte(on,${half}),1+${ZOOM}*on/${half},${1 + ZOOM}-${ZOOM}*(on-${half})/${half})`

const filter = [
  'scale=3840:-2:flags=lanczos',
  `zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${FPS}`,
  'format=yuv420p',
].join(',')

console.log(`Rendering ${DURATION}s loop from ${SRC} …`)
execFileSync(
  ffmpeg,
  [
    '-y', '-loop', '1', '-i', SRC,
    '-vf', filter,
    '-t', String(DURATION),
    '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-profile:v', 'high',
    '-movflags', '+faststart',
    '-an', // ambient backdrop — never ship audio
    OUT,
  ],
  { stdio: 'inherit' },
)

console.log(`\n✓ ${OUT} — ${(statSync(OUT).size / 1048576).toFixed(2)} MB`)
