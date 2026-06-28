import { db } from '@/lib/db'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Tag, Calendar } from 'lucide-react'
import { Suspense } from 'react'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// TYPES
// ============================================================================

type BlogCategory = 'BUYING_GUIDE' | 'MARKET_NEWS' | 'VEHICLE_SPOTLIGHT' | 'RENTAL_GUIDE' | 'CORPORATE' | 'GENERAL'

// ============================================================================
// DATA FETCHING
// ============================================================================

async function getBlogPosts(category?: string) {
  const where: { published: boolean; category?: BlogCategory } = { published: true }
  if (category && category !== 'ALL') {
    where.category = category as BlogCategory
  }
  
  const posts = await db.blogPost.findMany({
    where,
    orderBy: { published_at: 'desc' },
  })
  return posts
}

async function getCategoryCounts() {
  const counts = await db.blogPost.groupBy({
    by: ['category'],
    where: { published: true },
    _count: { id: true },
  })
  return counts.reduce((acc, item) => {
    acc[item.category] = item._count.id
    return acc
  }, {} as Record<string, number>)
}

// ============================================================================
// CATEGORY TABS COMPONENT
// ============================================================================

const categories = [
  { key: 'ALL', label: 'All Posts' },
  { key: 'BUYING_GUIDE', label: 'Buying Guide' },
  { key: 'MARKET_NEWS', label: 'Market News' },
  { key: 'VEHICLE_SPOTLIGHT', label: 'Vehicle Spotlight' },
  { key: 'RENTAL_GUIDE', label: 'Rental Guide' },
  { key: 'CORPORATE', label: 'Corporate' },
  { key: 'GENERAL', label: 'General' },
]

function CategoryTabs({ activeCategory, counts }: { activeCategory: string; counts: Record<string, number> }) {
  const totalPosts = Object.values(counts).reduce((a, b) => a + b, 0)
  
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat) => {
        const count = cat.key === 'ALL' ? totalPosts : (counts[cat.key] || 0)
        const isActive = activeCategory === cat.key
        
        return (
          <Link
            key={cat.key}
            href={cat.key === 'ALL' ? '/blog' : `/blog?category=${cat.key}`}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium border transition-all duration-300 ${
              isActive
                ? 'bg-brand-gold text-brand-black border-brand-gold'
                : 'bg-transparent text-brand-silver border-brand-border hover:border-brand-gold/50 hover:text-brand-gold'
            }`}
          >
            {cat.label}
            {count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-brand-black/20' : 'bg-brand-surface-2'}`}>
                {count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}

// ============================================================================
// BLOG CARD COMPONENT
// ============================================================================

function BlogCard({ post, index }: { post: Awaited<ReturnType<typeof getBlogPosts>>[0]; index: number }) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-UG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  const categoryLabel = post.category.replace(/_/g, ' ')
  const excerpt = post.excerpt || post.content.slice(0, 160) + '...'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card group overflow-hidden hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-brand-gold/10"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-brand-surface-2 flex items-center justify-center">
            <Tag className="w-12 h-12 text-brand-muted" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-medium text-brand-gold bg-brand-black/80 backdrop-blur-sm border border-brand-gold/30 rounded-full">
            {categoryLabel}
          </span>
        </div>
        
        {/* Read More indicator */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-xs text-brand-white bg-brand-gold/90 px-3 py-1.5 rounded-full font-medium">
            Read Article
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Date */}
        {formattedDate && (
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-brand-muted mb-2 sm:mb-3">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        )}
        
        {/* Title */}
        <h3 className="font-display text-base sm:text-lg font-bold text-brand-white group-hover:text-brand-gold transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-xs sm:text-sm text-brand-silver line-clamp-2 mb-3 sm:mb-4">
          {excerpt}
        </p>
        
        {/* Read More */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-brand-border">
          <span className="text-brand-gold text-xs sm:text-sm font-medium flex items-center gap-1.5 group-hover:gap-2 transition-all">
            Read More
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ============================================================================
// POSTS GRID WITH CATEGORY FILTER
// ============================================================================

async function PostsGrid({ category }: { category: string }) {
  const [posts, counts] = await Promise.all([
    getBlogPosts(category),
    getCategoryCounts(),
  ])

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Tag className="w-8 h-8 sm:w-10 sm:h-10 text-brand-muted" />
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-white mb-2">
          No Posts Found
        </h3>
        <p className="text-brand-silver text-sm sm:text-base mb-6">
          {category === 'ALL' 
            ? 'No blog posts have been published yet. Check back soon!'
            : `No posts in this category yet. Browse all posts instead.`}
        </p>
        {category !== 'ALL' && (
          <Link href="/blog" className="btn">
            View All Posts
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <CategoryTabs activeCategory={category} counts={counts} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </>
  )
}

function PostsGridSkeleton() {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-24 h-9 bg-brand-surface-2 rounded animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[16/10] bg-brand-surface-2 animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="w-20 h-3 bg-brand-surface-2 rounded animate-pulse" />
              <div className="w-3/4 h-5 bg-brand-surface-2 rounded animate-pulse" />
              <div className="w-full h-4 bg-brand-surface-2 rounded animate-pulse" />
              <div className="w-2/3 h-4 bg-brand-surface-2 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ============================================================================
// METADATA
// ============================================================================

export const metadata = {
  title: 'Blog — Mighty Rides',
  description: 'Expert advice on buying, maintaining, and enjoying premium vehicles in East Africa. Read our latest guides, market news, and vehicle spotlights.',
  openGraph: {
    title: 'Blog — Mighty Rides',
    description: 'Expert advice on buying, maintaining, and enjoying premium vehicles in East Africa.',
    type: 'website',
  },
}

// ============================================================================
// BLOG LISTING PAGE
// ============================================================================

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category = 'ALL' } = await searchParams

  return (
    <main className="min-h-screen bg-brand-black flex flex-col">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-8 sm:pb-16 bg-brand-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,149,42,0.08),transparent_70%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <p className="eyebrow mb-2">OUR BLOG</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white">
            Insights & Guides
          </h1>
          <p className="text-brand-silver mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base">
            Expert advice on buying, maintaining, and enjoying premium vehicles in East Africa.
          </p>
          
          {/* Gold accent line */}
          <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-brand-gold to-transparent mt-4 sm:mt-6" />
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section bg-brand-black flex-1">
        <div className="container mx-auto px-4 sm:px-6">
          <Suspense fallback={<PostsGridSkeleton />}>
            <PostsGrid category={category} />
          </Suspense>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 sm:py-16 bg-brand-surface border-t border-brand-border">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-white mb-2">
            Stay Updated
          </h2>
          <p className="text-brand-silver text-sm sm:text-base mb-6 max-w-md mx-auto">
            Follow us on social media or contact us to stay informed about our latest articles and vehicle listings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/contact" className="btn btn-primary">
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/cars" className="btn">
              Browse Vehicles
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
