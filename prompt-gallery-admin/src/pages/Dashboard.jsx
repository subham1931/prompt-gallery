import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Check, Filter, Heart, ImageIcon, Plus, Search, Trash2, X } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { Badge } from '../components/ui/Badge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { PromptEditorModal } from '../components/PromptEditorModal'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { useDebounce } from '../hooks/useDebounce'
import { deletePrompt, listPrompts } from '../api/client'
import { computeSeoScore } from '../utils/seo'

const FILTER_OPTIONS = [
  { id: 'latest', label: 'Latest' },
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
]

function formatLikes(n) {
  const value = Number(n) || 0
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
  return String(value)
}

function formatRelativeDate(dateInput) {
  if (!dateInput) return '—'
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return '—'

  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 0 || diffInSeconds < 60) return 'Just now'

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function matchesFilter(row, id) {
  if (id === 'trending') return Boolean(row.trending)
  if (id === 'popular') return Number(row.likeCount) > 0
  if (id === 'latest') return true
  return false
}

function sortRows(rows, selectedFilters) {
  const list = [...rows]
  if (selectedFilters.includes('popular')) {
    list.sort((a, b) => (Number(b.likeCount) || 0) - (Number(a.likeCount) || 0))
  } else if (selectedFilters.includes('trending')) {
    list.sort((a, b) => Number(Boolean(b.trending)) - Number(Boolean(a.trending)))
  }
  return list
}

export default function Dashboard() {
  const { toasts, pushToast } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [selectedFilters, setSelectedFilters] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [editingPromptId, setEditingPromptId] = useState(null)
  const filterRef = useRef(null)

  const loadPrompts = () => {
    setLoading(true)
    setError('')
    listPrompts({ status: 'all', sort: 'latest' })
      .then(({ data }) => setRows(data || []))
      .catch((err) => setError(err.message || 'Failed to load prompts'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPrompts()
  }, [])

  const openCreateModal = () => {
    setEditingPromptId(null)
    setIsEditorModalOpen(true)
  }

  const openEditModal = (id) => {
    setEditingPromptId(id)
    setIsEditorModalOpen(true)
  }

  const handleEditorSuccess = () => {
    loadPrompts()
  }

  useEffect(() => {
    if (!filterOpen) return
    const onPointerDown = (e) => {
      if (!filterRef.current?.contains(e.target)) setFilterOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setFilterOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [filterOpen])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    let list = rows

    if (selectedFilters.length > 0) {
      list = list.filter((row) => selectedFilters.some((id) => matchesFilter(row, id)))
    }

    list = sortRows(list, selectedFilters)

    if (!q) return list
    return list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.tool || '').toLowerCase().includes(q),
    )
  }, [rows, debouncedQuery, selectedFilters])

  const toggleFilter = (id) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    )
  }

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

  const filtersActive = selectedFilters.length > 0

  return (
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader />

      <div className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 sm:pt-[26px] md:pb-20 md:pl-20">
        {/* Top Header & Action Row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m-0 text-2xl font-extrabold tracking-tight">Prompts</h1>
            <p className="mt-1 text-xs text-mute">
              Create and optimize prompts for the public gallery.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold text-white shadow-[0_3px_12px_rgba(255,122,0,0.35)] transition-all hover:bg-orange-dark hover:shadow-[0_4px_16px_rgba(255,122,0,0.45)] active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Create New Prompt</span>
          </button>
        </div>
          <div className="mb-5 flex w-full items-center gap-2 sm:max-w-md">
            <div className="relative min-w-0 flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-mute-light"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompts..."
                className="w-full rounded-[10px] border border-border bg-surface py-2.5 pr-8 pl-9 text-[13.5px] text-ink outline-none focus:border-orange focus:shadow-[0_0_0_3px_var(--color-orange-tint)]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-mute-light hover:bg-surface-muted hover:text-ink border-none bg-transparent p-0"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="relative shrink-0" ref={filterRef}>
              <button
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                aria-label="Filter prompts"
                aria-expanded={filterOpen}
                aria-haspopup="listbox"
                className={`inline-flex size-[42px] cursor-pointer items-center justify-center rounded-[10px] border transition-colors ${
                  filterOpen || filtersActive
                    ? 'border-orange bg-orange-tint text-orange-dark'
                    : 'border-border bg-surface text-mute hover:border-orange/40 hover:text-ink'
                }`}
              >
                <Filter size={15} strokeWidth={2.25} />
              </button>

              {filterOpen && (
                <div
                  role="listbox"
                  aria-label="Filter prompts"
                  aria-multiselectable="true"
                  className="absolute top-[calc(100%+6px)] right-0 z-20 min-w-[168px] overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
                >
                  {FILTER_OPTIONS.map((option) => {
                    const checked = selectedFilters.includes(option.id)
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="option"
                        aria-selected={checked}
                        onClick={() => toggleFilter(option.id)}
                        className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-semibold text-mute transition-colors hover:bg-surface-muted hover:text-ink"
                      >
                        <span
                          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md ${
                            checked
                              ? 'border-none bg-orange'
                              : 'border-[1.5px] border-border bg-surface'
                          }`}
                        >
                          {checked && <Check size={12} color="#fff" strokeWidth={3} />}
                        </span>
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.03),0_1px_12px_rgba(16,24,40,0.04)]">
          <div className="hidden grid-cols-[68px_1fr_95px_85px_70px_60px_130px_100px] gap-3 border-b border-border bg-surface-muted px-5 py-3 text-[11.5px] font-bold tracking-[0.04em] text-mute-light uppercase md:grid">
            <span>Image</span>
            <span>Title</span>
            <span>Model</span>
            <span>Status</span>
            <span>Likes</span>
            <span>SEO</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>

          {loading && (
            <div className="px-4 py-10 text-center text-[13px] text-mute sm:px-5">Loading…</div>
          )}
          {!loading && error && (
            <div className="px-4 py-10 text-center text-[13px] text-red sm:px-5">{error}</div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-[13px] text-mute sm:px-5">
              No prompts yet.{' '}
              <button
                type="button"
                onClick={openCreateModal}
                className="cursor-pointer border-none bg-transparent p-0 font-semibold text-orange-dark"
              >
                Create one
              </button>
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
                  className="grid grid-cols-[52px_1fr] items-center gap-3 border-b border-border px-3 py-3.5 last:border-b-0 sm:px-5 md:grid-cols-[68px_1fr_95px_85px_70px_60px_130px_100px] md:gap-3"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-lg border border-border bg-surface-subtle sm:h-14 sm:w-14 md:h-[52px] md:w-[52px]">
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
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-mute">
                        <Calendar size={12} className="text-mute-light shrink-0" />
                        {formatRelativeDate(row.createdAt || row.date)}
                      </span>
                      <span className="text-xs text-mute">{row.tool}</span>
                    </div>
                    <div className="mt-2 flex gap-3 md:hidden">
                      <button
                        type="button"
                        onClick={() => openEditModal(row.id)}
                        className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-orange-dark"
                      >
                        Edit
                      </button>
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
                  <div className="hidden md:block">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-mute whitespace-nowrap">
                      <Calendar size={13} className="text-mute-light shrink-0" />
                      {formatRelativeDate(row.createdAt || row.date)}
                    </span>
                  </div>
                  <div className="hidden items-center justify-end gap-3 md:flex">
                    <button
                      type="button"
                      onClick={() => openEditModal(row.id)}
                      className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-orange-dark"
                    >
                      Edit
                    </button>
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
        </div>
      </div>

      <PromptEditorModal
        open={isEditorModalOpen}
        promptId={editingPromptId}
        onClose={() => setIsEditorModalOpen(false)}
        onSuccess={handleEditorSuccess}
      />

      <Toast toasts={toasts} />
    </div>
  )
}
