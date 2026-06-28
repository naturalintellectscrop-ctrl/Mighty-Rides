// ============================================================================
// ADMIN API: SIGNED URL GENERATION FOR ID DOCUMENTS
// Generates time-limited signed URLs for accessing private Cloudinary images
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * POST /api/admin/signed-url
 * Generates a 10-minute expiring signed URL for accessing private ID documents
 * 
 * Request body:
 * - publicId: The Cloudinary public ID of the image
 * 
 * Response:
 * - signedUrl: The time-limited signed URL
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { publicId } = body

    if (!publicId) {
      return NextResponse.json(
        { error: 'publicId is required' },
        { status: 400 }
      )
    }

    // Generate signed URL that expires in 10 minutes (600 seconds)
    const expiresAt = Math.floor(Date.now() / 1000) + 600 // 10 minutes from now

    const signedUrl = cloudinary.utils.private_download_url(publicId, 'jpg', {
      expires_at: expiresAt,
      type: 'authenticated',
    })

    return NextResponse.json({
      signedUrl,
      expiresAt,
      expiresIn: 600, // seconds
    })
  } catch (error) {
    console.error('[SIGNED_URL] Error generating signed URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    )
  }
}
