// Cross-platform standalone packaging step.
// Next.js `output: 'standalone'` does not copy static assets or the public
// folder into the standalone bundle, so we do it here. Uses Node's fs (not the
// shell `cp`, whose flags differ between bash and Bun's built-in shell).
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const copies = [
  ['.next/static', '.next/standalone/.next/static'],
  ['public', '.next/standalone/public'],
]

for (const [src, dest] of copies) {
  if (!existsSync(src)) {
    console.log(`[postbuild] skip (missing source): ${src}`)
    continue
  }
  mkdirSync(dirname(dest), { recursive: true })
  cpSync(src, dest, { recursive: true })
  console.log(`[postbuild] copied ${src} -> ${dest}`)
}
