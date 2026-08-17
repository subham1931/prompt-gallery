import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Search, FileText, CheckCircle, Clock } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { listBlogs, deleteBlog } from '../api/client'
import { useToast } from '../hooks/useToast'
import { ConfirmModal } from '../components/ui/ConfirmModal'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { pushToast } = useToast()

  const loadBlogs = () => {
    setLoading(true)
    listBlogs({ search })
      .then(({ data }) => setBlogs(data || []))
      .catch((err) => pushToast(err.message || 'Failed to load blogs', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBlogs()
  }, [search])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteBlog(deleteTarget._id || deleteTarget.id)
      pushToast('Blog post deleted successfully')
      setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== (deleteTarget._id || deleteTarget.id)))
      setDeleteTarget(null)
    } catch (err) {
      pushToast(err.message || 'Failed to delete blog', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 sm:pt-6 md:pb-20 md:pl-20">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Blog Management</h1>
            <p className="mt-1 text-xs text-mute">
              Create, edit, and publish articles & guide posts for Prompt Gallery
            </p>
          </div>

          <Link
            to="/blogs/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange px-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-orange/20 hover:brightness-110 transition-all cursor-pointer no-underline"
          >
            <Plus size={16} />
            <span>Create New Blog</span>
          </Link>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-xs">
          <Search size={18} className="text-mute shrink-0 ml-1" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by title, keywords, or description..."
            className="w-full bg-transparent text-xs font-semibold text-ink outline-none placeholder:text-mute"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-mute font-medium">Loading blog articles...</div>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <FileText size={32} className="mx-auto mb-3 text-mute" />
            <h3 className="text-sm font-bold text-ink">No blog articles found</h3>
            <p className="mt-1 text-xs text-mute">Click "Create New Blog" to post your first article.</p>
            <Link
              to="/blogs/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange px-4 py-2 text-xs font-bold text-white no-underline shadow-sm"
            >
              <Plus size={14} /> Create Article
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface-muted text-[11px] font-extrabold uppercase tracking-wider text-mute">
                  <tr>
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Popular</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {blogs.map((b) => (
                    <tr key={b._id || b.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-ink">
                        <div className="flex items-center gap-3">
                          {b.coverImage && (
                            <img
                              src={b.coverImage}
                              alt={b.title}
                              className="h-10 w-14 shrink-0 rounded-lg object-cover border border-border"
                            />
                          )}
                          <div>
                            <div className="line-clamp-1 font-bold text-ink">{b.title}</div>
                            <div className="line-clamp-1 text-[11px] font-mono text-mute">/{b.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-mute">{b.category}</td>
                      <td className="py-4 px-4 font-medium text-mute">{b.author}</td>
                      <td className="py-4 px-4">
                        <span
                          className={
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ' +
                            (b.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20')
                          }
                        >
                          {b.status === 'published' ? <CheckCircle size={10} /> : <Clock size={10} />}
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-mute">
                        {b.isPopular ? (
                          <span className="rounded-md bg-orange/10 px-2 py-0.5 text-[10px] font-bold text-orange">
                            Popular
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={'/blogs/' + b.slug + '/edit'}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-mute hover:text-ink hover:bg-surface-muted transition-colors"
                            title="Edit Article"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(b)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red/20 bg-red/10 text-red hover:bg-red/20 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Blog Post"
          description={'Are you sure you want to delete "' + (deleteTarget?.title || '') + '"? This action cannot be undone.'}
          confirmLabel={deleting ? 'Deleting...' : 'Delete Blog'}
          isDestructive
        />
      </div>
    </div>
  )
}
