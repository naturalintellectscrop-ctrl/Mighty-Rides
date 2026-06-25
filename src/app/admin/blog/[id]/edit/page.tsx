'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Image as ImageIcon, Trash2 } from 'lucide-react'

const categories = [
  { value: 'BUYING_GUIDE', label: 'Buying Guide' },
  { value: 'MARKET_NEWS', label: 'Market News' },
  { value: 'VEHICLE_SPOTLIGHT', label: 'Vehicle Spotlight' },
  { value: 'RENTAL_GUIDE', label: 'Rental Guide' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'GENERAL', label: 'General' },
]

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter()
  const [postId, setPostId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'GENERAL',
    excerpt: '',
    content: '',
    cover_image_url: '',
    published: false,
  })

  useEffect(() => {
    params.then(p => setPostId(p.id))
  }, [params])

  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog`)
        const posts = await response.json()
        const post = posts.find((p: { id: string }) => p.id === postId)
        
        if (post) {
          setForm({
            title: post.title,
            slug: post.slug,
            category: post.category,
            excerpt: post.excerpt || '',
            content: post.content,
            cover_image_url: post.cover_image_url || '',
            published: post.published,
          })
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          ...form,
          published: publish,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/blog')
      } else {
        alert(data.error || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/blog?id=${postId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/blog')
      } else {
        alert(data.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-brand-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-brand-silver hover:text-brand-gold text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog Manager
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white mb-1">
            Edit Post
          </h1>
          <p className="text-brand-silver text-sm">
            {form.published ? 'Published' : 'Draft'} • /blog/{form.slug}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="btn flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="btn border-red-500/50 text-red-400 hover:border-red-500 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="card p-8">
          {form.cover_image_url && (
            <img 
              src={form.cover_image_url} 
              alt={form.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <span className="status-badge status-reserved mb-4">
            {categories.find(c => c.value === form.category)?.label}
          </span>
          <h1 className="font-display text-3xl font-bold text-brand-white mb-4">
            {form.title || 'Untitled Post'}
          </h1>
          {form.excerpt && (
            <p className="text-brand-silver text-lg mb-6">{form.excerpt}</p>
          )}
          <div className="prose prose-invert max-w-none">
            <p className="text-brand-silver whitespace-pre-wrap">{form.content}</p>
          </div>
        </div>
      ) : (
        // Edit Form
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter post title..."
              required
              className="text-lg"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="post-url-slug"
            />
            <p className="text-xs text-brand-muted mt-1">
              URL: /blog/{form.slug || '...'}
            </p>
          </div>

          {/* Category & Cover Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cover_image_url">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  id="cover_image_url"
                  type="url"
                  value={form.cover_image_url}
                  onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                  placeholder="https://..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Brief summary of the post..."
              rows={3}
            />
            <p className="text-xs text-brand-muted mt-1">
              {form.excerpt.length}/300 characters
            </p>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your blog post content..."
              rows={15}
              required
              className="font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-brand-border">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 rounded border-brand-border"
                />
                <span className={`text-sm ${form.published ? 'text-green-400' : 'text-yellow-400'}`}>
                  {form.published ? 'Published' : 'Draft'}
                </span>
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {!form.published && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
