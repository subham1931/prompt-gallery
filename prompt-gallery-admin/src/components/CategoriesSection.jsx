import { useEffect, useMemo, useState } from 'react'
import { FolderPlus, Plus, Search, Tag, X } from 'lucide-react'
import { createCategory, listCategories } from '../api/client'
import { slugify } from '../utils/seo'
import { useDebounce } from '../hooks/useDebounce'

export function CategoriesSection({ onToast }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [icon, setIcon] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    listCategories()
      .then(({ data }) => setCategories(data || []))
      .catch((err) => onToast?.(err.message || 'Failed to load categories', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!slugEdited) setSlug(slugify(name))
  }, [name, slugEdited])

  const previewIcon = useMemo(() => {
    const trimmed = icon.trim()
    if (trimmed) return trimmed.slice(0, 3)
    return name.trim().slice(0, 2).toUpperCase() || '?'
  }, [icon, name])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Category name is required')
      return
    }

    setSaving(true)
    setError('')
    try {
      const { data } = await createCategory({
        name: trimmedName,
        slug: slug.trim() || slugify(trimmedName),
        icon: icon.trim() || trimmedName.slice(0, 2).toUpperCase(),
      })
      setCategories((prev) =>
        [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
      )
      setName('')
      setSlug('')
      setIcon('')
      setSlugEdited(false)
      setIsCreateModalOpen(false)
      onToast?.('Category created successfully!')
    } catch (err) {
      const msg = err.message || 'Failed to create category'
      setError(msg.includes('duplicate') ? 'A category with this name or slug already exists' : msg)
      onToast?.(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const filteredCategories = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim()
    if (!q) return categories
    return categories.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(q) || cat.slug?.toLowerCase().includes(q),
    )
  }, [categories, debouncedSearchQuery])

  return (
    <div>
      {/* Top Action Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-2xl font-extrabold tracking-tight">Categories</h1>
          <p className="mt-1 text-xs text-mute">
            Manage gallery categories used when creating and organizing prompts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold text-white shadow-[0_3px_12px_rgba(255,122,0,0.35)] transition-all hover:bg-orange-dark hover:shadow-[0_4px_16px_rgba(255,122,0,0.45)] active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Create New Category</span>
        </button>
      </div>

      {/* Full-width Data Table Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/90">
        {/* Table Header / Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border/80 bg-surface-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-mute-light">
              Category Directory
            </span>
            <span className="inline-flex items-center rounded-md bg-orange/10 px-2.5 py-0.5 text-[11px] font-bold text-orange-dark border border-orange/20">
              {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
            </span>
          </div>

          {/* Search Filter Input */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="h-9 w-full rounded-xl border border-border bg-surface pl-9 pr-8 text-xs text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:ring-2 focus:ring-orange/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-mute-light hover:bg-surface-muted hover:text-ink border-none bg-transparent p-0"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Table View */}
        {loading && (
          <div className="px-5 py-12 text-center text-xs text-mute">Loading categories...</div>
        )}
        {!loading && filteredCategories.length === 0 && (
          <div className="px-5 py-12 text-center text-xs text-mute">
            {searchQuery ? 'No categories match your search.' : 'No categories created yet.'}
          </div>
        )}

        {!loading && filteredCategories.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-surface-muted/20 text-[11px] font-medium uppercase tracking-wider text-mute-light">
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-4">Slug Path</th>
                  <th className="py-3.5 px-5 text-right">Prompts Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="transition-colors hover:bg-surface-muted/30"
                  >
                    {/* Category Icon & Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-tint text-orange-dark font-extrabold text-xs">
                          {cat.icon || cat.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-ink text-xs sm:text-sm truncate">
                            {cat.name}
                          </div>
                          <div className="text-mute-light text-[11.5px] truncate">
                            /{cat.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-[11.5px] font-semibold text-mute rounded-md border border-border bg-surface-subtle px-2 py-0.5">
                        <Tag size={11} className="text-mute-light" />
                        /{cat.slug}
                      </span>
                    </td>

                    {/* Prompts Count */}
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-mute">
                        {cat.count} {cat.count === 1 ? 'Prompt' : 'Prompts'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create New Category */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="animate-slide-in w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-tint text-orange-dark">
                  <FolderPlus size={18} />
                </div>
                <div>
                  <h3 className="m-0 text-base font-bold text-ink">Create New Category</h3>
                  <p className="m-0 text-xs text-mute">Add a new category for gallery prompts.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setError('')
                }}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-mute hover:bg-surface-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute-light">
                  Category Name <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setError('')
                    setName(e.target.value)
                  }}
                  required
                  placeholder="e.g. Street Photography"
                  className="h-11 w-full rounded-xl border border-border bg-surface-muted px-3.5 text-xs text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:bg-surface focus:ring-2 focus:ring-orange/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute-light">
                  Slug Path
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true)
                    setSlug(e.target.value)
                  }}
                  placeholder="street-photography"
                  className="h-11 w-full rounded-xl border border-border bg-surface-muted px-3.5 text-xs text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:bg-surface focus:ring-2 focus:ring-orange/15"
                />
                <span className="mt-1 block text-[11px] text-mute-light">
                  Auto-generated from name — edit to override.
                </span>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mute-light">
                  Short Icon Label
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-orange-tint text-xs font-extrabold text-orange-dark">
                    {previewIcon}
                  </div>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value.slice(0, 3))}
                    placeholder="SP"
                    className="h-11 w-full flex-1 rounded-xl border border-border bg-surface-muted px-3.5 text-xs text-ink outline-none transition-all placeholder:text-mute-light focus:border-orange focus:bg-surface focus:ring-2 focus:ring-orange/15"
                  />
                </div>
                <span className="mt-1 block text-[11px] text-mute-light">
                  Short 1–3 character label shown in gallery.
                </span>
              </div>

              {error && (
                <div className="rounded-xl border border-red/20 bg-red/10 p-3 text-xs font-semibold text-red">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    setError('')
                  }}
                  className="cursor-pointer rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-mute transition-colors hover:bg-surface-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-xl bg-orange px-5 py-2.5 text-xs font-bold text-white shadow-[0_2px_8px_rgba(255,122,0,0.35)] transition-all hover:bg-orange-dark disabled:opacity-60"
                >
                  {saving ? 'Creating Category...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
