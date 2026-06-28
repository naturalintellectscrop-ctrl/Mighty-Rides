// ============================================================================
// CLOUDINARY FILE UPLOAD UTILITY
// ============================================================================

import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

// ============================================================================
// CONFIGURATION
// ============================================================================

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// ============================================================================
// TYPES
// ============================================================================

export type ImageFolder = 
  | 'public/vehicles' 
  | 'public/blog' 
  | 'public/hero'
  | 'private/ids' 
  | 'private/handover'

export interface UploadResult {
  success: boolean
  publicId?: string
  url?: string
  secureUrl?: string
  error?: string
}

export interface SignedUploadParams {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}

// ============================================================================
// SERVER-SIDE UPLOAD (Backend)
// ============================================================================

/**
 * Upload an image to Cloudinary (server-side)
 */
export async function uploadImage(
  file: Buffer | string,
  folder: ImageFolder = 'public/vehicles',
  options: {
    publicId?: string
    transformation?: object
  } = {}
): Promise<UploadResult> {
  try {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: 'image',
      overwrite: true,
    }

    if (options.publicId) {
      uploadOptions.public_id = options.publicId
    }

    if (options.transformation) {
      uploadOptions.transformation = options.transformation
    }

    // Handle different input types
    let uploadResult: UploadApiResponse | undefined
    
    if (Buffer.isBuffer(file)) {
      // Upload from buffer (base64)
      const base64 = `data:image/jpeg;base64,${file.toString('base64')}`
      uploadResult = await cloudinary.uploader.upload(base64, uploadOptions) as UploadApiResponse
    } else if (file.startsWith('data:')) {
      // Already base64 data URI
      uploadResult = await cloudinary.uploader.upload(file, uploadOptions) as UploadApiResponse
    } else if (file.startsWith('http')) {
      // Upload from URL
      uploadResult = await cloudinary.uploader.upload(file, uploadOptions) as UploadApiResponse
    } else {
      // Assume it's a file path
      uploadResult = await cloudinary.uploader.upload(file, uploadOptions) as UploadApiResponse
    }

    if (!uploadResult) {
      return { success: false, error: 'Upload failed' }
    }

    return {
      success: true,
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
    }
  } catch (error) {
    const err = error as UploadApiErrorResponse
    console.error('Cloudinary upload error:', err)
    return {
      success: false,
      error: err.message || 'Upload failed',
    }
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    const err = error as Error
    return { success: false, error: err.message }
  }
}

/**
 * Generate a signed URL for private images
 */
export function getSignedUrl(
  publicId: string,
  options: {
    expiresAt?: number // Unix timestamp in seconds
    transformation?: object
  } = {}
): string {
  const expiresIn = options.expiresAt || Math.floor(Date.now() / 1000) + 3600 // Default 1 hour

  const url = cloudinary.utils.private_download_url(publicId, 'jpg', {
    expires_at: expiresIn,
    type: 'authenticated',
  })

  return url
}

/**
 * Generate optimized URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: 'auto' | number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'fill' | 'fit' | 'scale' | 'limit'
  } = {}
): string {
  const transformation: Record<string, unknown> = {}

  if (options.width) transformation.width = options.width
  if (options.height) transformation.height = options.height
  if (options.quality) transformation.quality = options.quality
  if (options.format) transformation.fetch_format = options.format
  if (options.crop) transformation.crop = options.crop

  return cloudinary.url(publicId, {
    secure: true,
    transformation: [transformation],
  }) || ''
}

// ============================================================================
// CLIENT-SIDE UPLOAD HELPERS
// ============================================================================

/**
 * Generate signed upload parameters for client-side direct uploads
 * Use this in API routes to provide secure upload credentials
 */
export function generateSignedUploadParams(folder: ImageFolder): SignedUploadParams {
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    folder,
  }
}

/**
 * Validate upload request signature (for webhook or API validation)
 */
export function validateSignature(
  publicId: string,
  version: string,
  signature: string
): boolean {
  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id: publicId, version },
    process.env.CLOUDINARY_API_SECRET!
  )
  return expectedSignature === signature
}

// ============================================================================
// VEHICLE IMAGE HELPERS
// ============================================================================

/**
 * Generate all image URLs for a vehicle
 */
export function getVehicleImageUrls(
  images: string[], // Array of public IDs
  options: {
    thumbnail?: { width: number; height: number }
    gallery?: { width: number; height: number }
    full?: { width: number; height: number }
  } = {}
) {
  const thumbnailSize = options.thumbnail || { width: 400, height: 300 }
  const gallerySize = options.gallery || { width: 800, height: 600 }
  const fullSize = options.full || { width: 1920, height: 1080 }

  return images.map((publicId) => ({
    publicId,
    thumbnail: getOptimizedUrl(publicId, { ...thumbnailSize, crop: 'fill', quality: 'auto', format: 'auto' }),
    gallery: getOptimizedUrl(publicId, { ...gallerySize, crop: 'limit', quality: 'auto', format: 'auto' }),
    full: getOptimizedUrl(publicId, { ...fullSize, crop: 'limit', quality: 'auto', format: 'auto' }),
  }))
}

/**
 * Upload multiple vehicle images
 */
export async function uploadVehicleImages(
  files: (Buffer | string)[],
  vehicleSlug: string
): Promise<UploadResult[]> {
  const results: UploadResult[] = []

  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i], 'public/vehicles', {
      publicId: `${vehicleSlug}-${i + 1}`,
    })
    results.push(result)
  }

  return results
}

// ============================================================================
// ID DOCUMENT HELPERS (Private)
// ============================================================================

/**
 * Upload ID document (front or back)
 */
export async function uploadIdDocument(
  file: Buffer | string,
  userId: string,
  side: 'front' | 'back'
): Promise<UploadResult> {
  return uploadImage(file, 'private/ids', {
    publicId: `id-${userId}-${side}`,
  })
}

/**
 * Get signed URL for ID document
 */
export function getIdDocumentUrl(publicId: string, expiresIn: number = 3600): string {
  return getSignedUrl(publicId, { expiresAt: Math.floor(Date.now() / 1000) + expiresIn })
}

// ============================================================================
// HANDOVER PHOTO HELPERS (Private)
// ============================================================================

/**
 * Upload handover photos
 */
export async function uploadHandoverPhoto(
  file: Buffer | string,
  bookingId: string,
  type: 'pickup' | 'return',
  index: number
): Promise<UploadResult> {
  return uploadImage(file, 'private/handover', {
    publicId: `handover-${bookingId}-${type}-${index}`,
  })
}
