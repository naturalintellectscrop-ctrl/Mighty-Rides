// ============================================================================
// IMAGE UPLOAD API
// POST /api/upload  — uploads a base64 image to Cloudinary and returns its id.
//
// kind: 'id'      -> private/ids folder (used during registration; no session,
//                    so it is rate-limited and size/type validated).
// kind: 'vehicle' -> public/vehicles folder (admin only).
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage, type ImageFolder } from '@/lib/cloudinary'
import { checkRateLimit, rateLimitResponse, getClientIp } from '@/lib/rate-limit'

// ~5MB file ≈ 6.85MB of base64; cap the data-URI string length accordingly.
const MAX_DATA_URI_LENGTH = 7_500_000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { file, kind } = body as { file?: string; kind?: string }

    if (!file || typeof file !== 'string' || !file.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'A base64 image (data:image/...) is required.' },
        { status: 400 }
      )
    }
    if (file.length > MAX_DATA_URI_LENGTH) {
      return NextResponse.json(
        { error: 'Image is too large. Maximum size is 5MB.' },
        { status: 413 }
      )
    }

    let folder: ImageFolder
    if (kind === 'id') {
      // Registration context — unauthenticated but rate-limited.
      const ip = getClientIp(request)
      const rl = await checkRateLimit(
        { limiter: null, config: { limit: 10, window: '10 m' } },
        `upload-id:${ip}`
      )
      if (!rl.success) return rateLimitResponse(rl.reset)
      folder = 'private/ids'
    } else {
      // Vehicle / general images — admin only.
      const session = await getServerSession(authOptions)
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      folder = 'public/vehicles'
    }

    const result = await uploadImage(file, folder)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      publicId: result.publicId,
      url: result.secureUrl || result.url,
    })
  } catch (error) {
    console.error('[UPLOAD] Error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
