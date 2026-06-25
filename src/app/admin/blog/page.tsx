import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Calendar, Tag } from 'lucide-react'

// ============================================================================
// ADMIN BLOG MANAGER
// ============================================================================

async function getBlogPosts() {
  const posts = await db.blogPost.findMany({
    orderBy: { created_at: 'desc' },
  })
  return posts
}

const categoryLabels: Record<string, string> = {
  BUYING_GUIDE: 'Buying Guide',
  MARKET_NEWS: 'Market News',
  VEHICLE_SPOTLIGHT: 'Vehicle Spotlight',
  RENTAL_GUIDE: 'Rental Guide',
  CORPORATE: 'Corporate',
  GENERAL: 'General',
}

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const posts = await getBlogPosts()

  const publishedCount = posts.filter(p => p.published).length
  const draftCount = posts.filter(p => !p.published).length

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-white mb-1">
              Blog Manager
            </h1>
            <p className="text-brand-silver text-sm">
              Create and manage blog posts
            </p>
          </div>
          <Link href="/admin/blog/new" className="btn flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4">
            <p className="text-xs text-brand-muted uppercase">Total Posts</p>
            <p className="font-display text-2xl font-bold text-brand-white">{posts.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-brand-muted uppercase">Published</p>
            <p className="font-display text-2xl font-bold text-green-400">{publishedCount}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-brand-muted uppercase">Drafts</p>
            <p className="font-display text-2xl font-bold text-yellow-400">{draftCount}</p>
          </div>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="card p-12 text-center">
            <Tag className="w-12 h-12 text-brand-muted mx-auto mb-4" />
            <p className="text-brand-silver">No blog posts yet</p>
            <p className="text-brand-muted text-sm mt-1">
              Create your first post to get started
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-surface-2">
                  <tr>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Title</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Category</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs text-brand-muted uppercase tracking-wider">Date</th>
                    <th className="text-right p-4 text-xs text-brand-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-brand-surface/50">
                      <td className="p-4">
                        <p className="text-brand-white font-medium">{post.title}</p>
                        <p className="text-xs text-brand-muted">/{post.slug}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-brand-surface-2 rounded text-xs text-brand-silver">
                          {categoryLabels[post.category] || post.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          post.published 
                            ? 'bg-green-500/10 text-green-400' 
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-brand-silver text-sm">
                        {post.published_at 
                          ? new Date(post.published_at).toLocaleDateString()
                          : new Date(post.created_at).toLocaleDateString()
                        }
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              className="p-2 text-brand-muted hover:text-brand-gold transition-colors"
                              target="_blank"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="p-2 text-brand-muted hover:text-brand-gold transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
