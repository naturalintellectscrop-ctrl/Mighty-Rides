import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
type BlogCategory = string

// ============================================================================
// BLOG API
// ============================================================================

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Helper to generate unique slug
async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await db.blogPost.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

// GET - List all blog posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')

    const whereClause: Record<string, unknown> = {}
    if (published !== null) {
      whereClause.published = published === 'true'
    }

    const posts = await db.blogPost.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      slug: providedSlug, 
      category, 
      excerpt, 
      content, 
      cover_image_url, 
      published 
    } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, content' 
      }, { status: 400 })
    }

    // Validate category
    const validCategories = ['BUYING_GUIDE', 'MARKET_NEWS', 'VEHICLE_SPOTLIGHT', 'RENTAL_GUIDE', 'CORPORATE', 'GENERAL']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json({ 
        error: 'Invalid category',
        validCategories 
      }, { status: 400 })
    }

    // Generate or use provided slug
    const slug = providedSlug || await generateUniqueSlug(title)

    // Check slug uniqueness
    const existingSlug = await db.blogPost.findUnique({
      where: { slug },
    })

    if (existingSlug) {
      return NextResponse.json({ 
        error: 'Slug already exists. Please use a different slug.' 
      }, { status: 400 })
    }

    // Create post
    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        category: (category as BlogCategory) || 'GENERAL',
        excerpt: excerpt || null,
        content,
        cover_image_url: cover_image_url || null,
        published: published || false,
        published_at: published ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update an existing blog post
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      id, 
      title, 
      slug: providedSlug, 
      category, 
      excerpt, 
      content, 
      cover_image_url, 
      published 
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 })
    }

    // Check post exists
    const existing = await db.blogPost.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Handle slug update
    let slug = existing.slug
    if (providedSlug && providedSlug !== existing.slug) {
      // Check new slug uniqueness
      const slugExists = await db.blogPost.findFirst({
        where: { 
          slug: providedSlug,
          id: { not: id },
        },
      })
      if (slugExists) {
        return NextResponse.json({ 
          error: 'Slug already exists' 
        }, { status: 400 })
      }
      slug = providedSlug
    } else if (title && title !== existing.title && !providedSlug) {
      // Auto-generate slug from new title if not provided
      slug = await generateUniqueSlug(title, id)
    }

    // Build update data
    const updateData: Record<string, unknown> = {}
    if (title) updateData.title = title
    if (slug !== existing.slug) updateData.slug = slug
    if (category) updateData.category = category
    if (excerpt !== undefined) updateData.excerpt = excerpt || null
    if (content) updateData.content = content
    if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url || null
    
    // Handle publish toggle
    if (published !== undefined) {
      updateData.published = published
      if (published && !existing.published) {
        updateData.published_at = new Date()
      }
    }

    const updated = await db.blogPost.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      post: updated,
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a blog post
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 })
    }

    // Check post exists
    const existing = await db.blogPost.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await db.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
