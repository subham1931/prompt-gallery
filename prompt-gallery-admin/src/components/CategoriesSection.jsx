import { useEffect, useMemo, useState } from 'react'
import { FolderPlus, Loader2, Plus } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Field } from './ui/Field'
import { TextInput } from './ui/TextInput'
import { createCategory, listCategories } from '../api/client'
import { slugify } from '../utils/seo'

export function CategoriesSection({ onToast }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    return name.trim().slice(0, 2) || '?'
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
        icon: icon.trim() || trimmedName.slice(0, 2),
      })
      setCategories((prev) =>
        [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
      )
      setName('')
      setSlug('')
      setIcon('')
      setSlugEdited(false)
      onToast?.('Category created')
    } catch (err) {
      const msg = err.message || 'Failed to create category'
      setError(msg.includes('duplicate') ? 'A category with this name or slug already exists' : msg)
      onToast?.(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.03),0_1px_12px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-mute-light uppercase">
          <FolderPlus size={14} className="text-orange-dark" />
          Manage
        </div>
        <Badge tone="default">{categories.length} total</Badge>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface-muted p-4">
          <div className="mb-3 text-[12px] font-semibold tracking-[0.04em] text-mute-light uppercase">
            Add category
          </div>

          <Field label="Name" required error={error && !name.trim() ? error : undefined}>
            <TextInput
              value={name}
              onChange={(e) => {
                setError('')
                setName(e.target.value)
              }}
              placeholder="e.g. Street Photography"
              error={Boolean(error && !name.trim())}
            />
          </Field>

          <Field label="Slug" hint="Auto-generated from the name — edit to override.">
            <TextInput
              value={slug}
              onChange={(e) => {
                setSlugEdited(true)
                setSlug(e.target.value)
              }}
              placeholder="street-photography"
            />
          </Field>

          <Field label="Icon" hint="Short label shown in the gallery (1–3 characters).">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-[12px] font-bold text-orange-dark">
                {previewIcon}
              </div>
              <TextInput
                value={icon}
                onChange={(e) => setIcon(e.target.value.slice(0, 3))}
                placeholder="SP"
                className="flex-1"
              />
            </div>
          </Field>

          {error && name.trim() && (
            <p className="mt-0 mb-3 text-[12px] font-medium text-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border-none bg-orange px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-orange-dark disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? <Loader2 size={14} className="animate-spin-slow" /> : <Plus size={14} />}
            {saving ? 'Adding…' : 'Add category'}
          </button>
        </form>

        <div>
          <div className="mb-3 text-[12px] font-semibold tracking-[0.04em] text-mute-light uppercase">
            Existing categories
          </div>
          {loading ? (
            <p className="m-0 text-[13px] text-mute">Loading…</p>
          ) : categories.length === 0 ? (
            <p className="m-0 text-[13px] text-mute">No categories yet.</p>
          ) : (
            <div className="max-h-[320px] overflow-y-auto rounded-xl border border-border">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 border-b border-border px-3.5 py-2.5 last:border-b-0"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-subtle text-[11px] font-bold text-orange-dark">
                    {cat.icon || cat.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold">{cat.name}</div>
                    <div className="truncate text-[11px] text-mute-light">/{cat.slug}</div>
                  </div>
                  <span className="shrink-0 text-[12px] text-mute">
                    {cat.count} prompt{cat.count === 1 ? '' : 's'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
