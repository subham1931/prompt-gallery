import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ImageIcon, Search, Trash2 } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { Badge } from '../components/ui/Badge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { deletePrompt, listPrompts } from '../api/client'
import { computeSeoScore } from '../utils/seo'

const SORT_TABS = [
  { id: 'latest', label: 'Latest' },
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
]

function formatLikes(n) {
  const value = Number(n) || 0
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
  return String(value)
}

export default function Dashboard() {
  const { toasts, pushToast } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('latest')
  const [deletingId, setDeletingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    listPrompts({ status: 'all', sort })
      .then(({ data }) => {
        if (!cancelled) setRows(data || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load prompts')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [sort])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.tool || '').toLowerCase().includes(q),
    )
  }, [rows, query])

  const askDelete = (row) => setPendingDelete(row)

  const closeDeleteModal = () => {
    if (deletingId) return
    setPendingDelete(null)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const row = pendingDelete
    setDeletingId(row.id)
    try {
      await deletePrompt(row.id)
      setRows((prev) => prev.filter((r) => r.id !== row.id))
      setPendingDelete(null)
      pushToast('Prompt deleted')
    } catch (err) {
      pushToast(err.message || 'Delete failed', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-6 pt-[26px] pb-20">
        <div className="mb-5 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="m-0 text-xl font-bold tracking-[-0.02em]">Prompts</h1>
              <p className="mt-1 mb-0 text-[13px] text-mute">
                Create and optimize prompts for the public gallery.
              </p>
            </div>
            <div className="relative max-w-sm flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-mute-light"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompts..."
                className="w-full rounded-[10px] border border-border bg-surface py-2.5 pr-3 pl-9 text-[13.5px] text-ink outline-none focus:border-orange focus:shadow-[0_0_0_3px_var(--color-orange-tint)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {SORT_TABS.map((tab) => {
              const active = sort === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSort(tab.id)}
                  className={`cursor-pointer rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    active
                      ? 'border-orange bg-orange-tint text-orange-dark'
                      : 'border-border bg-surface text-mute hover:border-orange/40 hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.03),0_1px_12px_rgba(16,24,40,0.04)]">
          <div className="hidden grid-cols-[72px_1fr_100px_90px_80px_70px_120px] gap-3 border-b border-border bg-surface-muted px-5 py-3 text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase md:grid">
            <span>Image</span>
            <span>Title</span>
            <span>Model</span>
            <span>Status</span>
            <span>Likes</span>
            <span>SEO</span>
            <span className="text-right">Actions</span>
          </div>

          {loading && (
            <div className="px-5 py-10 text-center text-[13px] text-mute">Loading…</div>
          )}
          {!loading && error && (
            <div className="px-5 py-10 text-center text-[13px] text-red">{error}</div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-[13px] text-mute">
              No prompts yet.{' '}
              <Link to="/prompts/new" className="font-semibold text-orange-dark">
                Create one
              </Link>
            </div>
          )}

          {!loading &&
            !error &&
            filtered.map((row) => {
              const seo = computeSeoScore({
                metaTitle: row.metaTitle || '',
                metaDesc: row.metaDesc || '',
                focusKeyword: row.focusKeyword || '',
                slug: row.slug || '',
                featuredAlt: row.images?.[0]?.altText || '',
                aiModel: row.tool || '',
                schemaChecks: row.schemaChecks || {
                  Article: true,
                  FAQPage: true,
                  Breadcrumb: true,
                  BlogPosting: false,
                },
              })
              const statusLabel = row.status === 'draft' ? 'Draft' : 'Published'
              const thumb = row.image || row.images?.[0]?.url || ''
              const likes = Number(row.likeCount) || 0

              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[56px_1fr] items-center gap-3 border-b border-border px-5 py-3.5 last:border-b-0 md:grid-cols-[72px_1fr_100px_90px_80px_70px_120px] md:gap-3"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-lg border border-border bg-surface-subtle md:h-[52px] md:w-[52px]">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={row.images?.[0]?.altText || row.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-mute-light">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="truncate text-[13.5px] font-semibold">{row.title}</div>
                      {row.trending && <Badge tone="orange">Trending</Badge>}
                    </div>
                    <div className="truncate text-xs text-mute-light">/prompts/{row.slug}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
                      <Badge tone={statusLabel === 'Published' ? 'green' : 'default'}>
                        {statusLabel}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-mute">
                        <Heart size={12} className="text-orange" />
                        {formatLikes(likes)}
                      </span>
                      <Badge tone={seo >= 80 ? 'green' : 'orange'}>{seo}</Badge>
                      <span className="text-xs text-mute">{row.tool}</span>
                    </div>
                    <div className="mt-2 flex gap-3 md:hidden">
                      <Link
                        to={`/prompts/${row.id}/edit`}
                        className="text-[13px] font-semibold text-orange-dark no-underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => askDelete(row)}
                        className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-red"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="hidden text-[13px] text-mute md:block">{row.tool}</div>
                  <div className="hidden md:block">
                    <Badge tone={statusLabel === 'Published' ? 'green' : 'default'}>
                      {statusLabel}
                    </Badge>
                  </div>
                  <div className="hidden md:block">
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-ink">
                      <Heart size={13} className="text-orange" fill="currentColor" />
                      {formatLikes(likes)}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <Badge tone={seo >= 80 ? 'green' : 'orange'}>{seo}</Badge>
                  </div>
                  <div className="hidden items-center justify-end gap-3 md:flex">
                    <Link
                      to={`/prompts/${row.id}/edit`}
                      className="text-[13px] font-semibold text-orange-dark no-underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => askDelete(row)}
                      title="Delete prompt"
                      className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[13px] font-semibold text-red"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete this prompt?"
        description={
          pendingDelete
            ? `“${pendingDelete.title}” will be permanently removed from the gallery. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete prompt"
        cancelLabel="Keep it"
        loading={Boolean(deletingId)}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <Toast toasts={toasts} />
    </div>
  )
}
