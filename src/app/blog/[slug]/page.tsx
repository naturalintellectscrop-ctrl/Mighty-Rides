import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Navbar, Footer, WhatsAppButton } from '@/components/shared'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, User, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, ArrowLeft, ChevronRight, Tag } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

// ============================================================================
// BLOG POST PAGE
// ============================================================================

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const post = await db.blogPost.findUnique({
    where: { slug, published: true },
  })
  return post
}

async function getRelatedPosts(currentPostId: string, category: string) {
  const posts = await db.blogPost.findMany({
    where: {
      published: true,
      category,
      id: { not: currentPostId },
    },
    take: 3,
    orderBy: { published_at: 'desc' },
  })
  return posts
}

// ============================================================================
// SHARE BUTTONS COMPONENT
// ============================================================================

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mightyrides.com'
  const url = `${baseUrl}/blog/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600 hover:border-blue-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500 hover:border-sky-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-700 hover:border-blue-700',
    },
  ]

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      <span className="flex items-center gap-2 text-xs sm:text-sm text-brand-silver">
        <Share2 className="w-4 h-4" />
        Share this article
      </span>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-brand-border rounded-lg text-brand-silver transition-all duration-300 ${link.color} hover:text-white`}
            title={`Share on ${link.name}`}
          >
            <link.icon className="w-4 h-4" />
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-brand-border rounded-lg text-brand-silver hover:bg-brand-gold hover:border-brand-gold hover:text-brand-black transition-all duration-300"
          title="Copy link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// RELATED POSTS COMPONENT
// ============================================================================

function RelatedPosts({ posts }: { posts: Awaited<ReturnType<typeof getRelatedPosts>> }) {
  if (posts.length === 0) return null

  return (
    <section className="py-12 sm:py-16 bg-brand-surface">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-white">
            Related Articles
          </h2>
          <Link href="/blog" className="text-brand-gold text-xs sm:text-sm font-medium flex items-center gap-1.5 hover:gap-2 transition-all">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((related) => (
            <Link
              key={related.id}
              href={`/blog/${related.slug}`}
              className="card group overflow-hidden hover:-translate-y-1 transition-all duration-500"
            >
              {related.cover_image_url ? (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={related.cover_image_url}
                    alt={related.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-brand-surface-2 flex items-center justify-center">
                  <Tag className="w-8 h-8 text-brand-muted" />
                </div>
              )}
              <div className="p-4 sm:p-5">
                <span className="inline-block px-2 py-1 text-[10px] font-medium text-brand-gold bg-brand-gold/10 rounded mb-2">
                  {related.category.replace('_', ' ')}
                </span>
                <h3 className="font-display text-sm sm:text-base font-bold text-brand-white group-hover:text-brand-gold transition-colors line-clamp-2">
                  {related.title}
                </h3>
                <span className="text-brand-gold text-xs mt-2 sm:mt-3 flex items-center gap-1">
                  Read Article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return { title: 'Post Not Found — Mighty Rides' }
  }

  return {
    title: `${post.title} — Mighty Rides Blog`,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      type: 'article',
      publishedTime: post.published_at?.toISOString(),
      authors: ['Mighty Rides'],
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  }
}

// ============================================================================
// BLOG POST PAGE COMPONENT
// ============================================================================

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category)
  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-UG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Draft'

  // Format content - convert newlines to paragraphs and sanitize
  const formatContent = (content: string) => {
    const html = content
      .split('\n\n')
      .filter(paragraph => paragraph.trim())
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
      .join('')
    // Sanitize HTML to prevent XSS attacks
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    })
  }

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    author: {
      '@type': 'Organization',
      name: 'Mighty Rides',
      url: 'https://mightyrides.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mighty Rides',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mightyrides.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://mightyrides.com/blog/${post.slug}`,
    },
    image: post.cover_image_url,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-brand-black flex flex-col">
        <Navbar />
        
        {/* Breadcrumb */}
        <div className="pt-20 sm:pt-24 pb-3 sm:pb-4 bg-brand-surface">
          <div className="container mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-brand-silver overflow-x-auto">
              <Link href="/" className="hover:text-brand-gold whitespace-nowrap">Home</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <Link href="/blog" className="hover:text-brand-gold whitespace-nowrap">Blog</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-brand-white truncate">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="py-8 sm:py-12 bg-brand-surface relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,149,42,0.08),transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <div className="max-w-3xl mx-auto">
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-medium text-brand-gold bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-4">
                {post.category.replace(/_/g, ' ')}
              </span>
              
              {/* Title */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-brand-white mb-4 sm:mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-brand-silver">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-gold" />
                  {publishedDate}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-gold" />
                  Mighty Rides
                </div>
              </div>
              
              {/* Gold accent line */}
              <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-brand-gold to-transparent mt-4 sm:mt-6" />
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.cover_image_url && (
          <section className="py-6 sm:py-8 bg-brand-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden border border-brand-border">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="w-full px-4 md:px-6 lg:px-0 py-16 md:py-24 bg-brand-black flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto">
              {/* Article Content */}
              <article 
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-display prose-headings:text-brand-white prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-brand-silver prose-p:leading-relaxed
                  prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-brand-white
                  prose-blockquote:border-l-brand-gold prose-blockquote:bg-brand-surface prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                  prose-ul:text-brand-silver prose-ol:text-brand-silver
                  prose-li:marker:text-brand-gold
                "
              >
                <div 
                  className="text-brand-silver leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />
              </article>
              
              {/* Share Buttons */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-brand-border">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
              
              {/* Back to Blog */}
              <div className="mt-6 sm:mt-8">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center gap-2 text-brand-gold text-sm font-medium hover:gap-3 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />

        <Footer />
        <WhatsAppButton />
      </main>
    </>
  )
}
