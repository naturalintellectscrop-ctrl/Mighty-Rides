'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Image as ImageIcon } from 'lucide-react'

const categories = [
  { value: 'BUYING_GUIDE', label: 'Buying Guide' },
  { value: 'MARKET_NEWS', label: 'Market News' },
  { value: 'VEHICLE_SPOTLIGHT', label: 'Vehicle Spotlight' },
  { value: 'RENTAL_GUIDE', label: 'Rental Guide' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'GENERAL', label: 'General' },
]

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'GENERAL',
    excerpt: '',
    content: '',
    cover_image_url: '',
    published: false,
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !form.slug) {
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      setForm(prev => ({ ...prev, slug }))
    }
  }, [form.title, form.slug])

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          published: publish,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/blog')
      } else {
        alert(data.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setSaving(false)
    }
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
            New Blog Post
          </h1>
          <p className="text-brand-silver text-sm">
            Create a new blog post
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

          {/* Category & Status */}
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
              <span className={`text-sm ${form.published ? 'text-green-400' : 'text-yellow-400'}`}>
                {form.published ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={saving}
                className="btn border-brand-surface-2 text-brand-silver hover:border-brand-gold hover:text-brand-gold"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, true)}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
