import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PromptTextCard } from '../components/PromptTextCard'
import { TitleUrlCard } from '../components/TitleUrlCard'
import { ImagesCard } from '../components/ImagesCard'
import { SchemaCard } from '../components/SchemaCard'
import { SeoCard } from '../components/SeoCard'
import { SeoPreviewCard } from '../components/SeoPreviewCard'
import { PromptPreviewModal } from '../components/PromptPreviewModal'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { useNotifications } from '../context/NotificationContext'
import { computeSeoScore, slugify } from '../utils/seo'
import {
  createPrompt,
  getPromptById,
  listCategories,
  updatePrompt,
  uploadImage,
} from '../api/client'

function createImage(overrides = {}) {
  return {
    id: Date.now() + Math.random(),
    src: '',
    altText: '',
    title: '',
    filename: '',
    publicId: '',
    ...overrides,
  }
}

function validateForm({ title, slug, promptText, category, images, status, scheduledAt }) {
  const errors = {}

  if (!title.trim()) errors.title = 'Title is required'
  else if (title.trim().length < 3) errors.title = 'Title must be at least 3 characters'

  if (!slug.trim()) errors.slug = 'Slug is required'
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
    errors.slug = 'Use lowercase letters, numbers, and hyphens only'
  }

  if (!promptText.trim()) errors.promptText = 'Prompt text is required'
  else if (promptText.trim().length < 10) {
    errors.promptText = 'Prompt text is too short'
  }

  if (!category) errors.category = 'Category is required'

  if (status === 'scheduled') {
    if (!scheduledAt) {
      errors.scheduledAt = 'Select a date and time to schedule publishing'
    } else if (new Date(scheduledAt).getTime() <= Date.now()) {
      errors.scheduledAt = 'Schedule date & time must be in the future'
    }
  }

  const hasImage = images.some((im) => im.src && !im.src.startsWith('blob:') && !im.uploading)
  if (!hasImage) errors.images = 'Add at least one uploaded image'

  if (images.some((im) => im.uploading)) {
    errors.images = 'Wait for image upload to finish'
  }

  return errors
}

function mapApiErrorToFields(message = '') {
  const errors = {}
  const lower = message.toLowerCase()
  if (lower.includes('slug')) errors.slug = message
  else if (lower.includes('title')) errors.title = message
  else if (lower.includes('prompt')) errors.promptText = message
  else if (lower.includes('category')) errors.category = message
  else if (lower.includes('image') || lower.includes('upload')) errors.images = message
  return { errors, general: Object.keys(errors).length ? null : message }
}

function toDatetimeLocal(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function PromptEditor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { toasts, pushToast } = useToast()
  const { addNotification } = useNotifications()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [promptId, setPromptId] = useState(id || null)
  const [errors, setErrors] = useState({})

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [description, setDescription] = useState('')
  const [aiModel, setAiModel] = useState('ChatGPT')
  const [category, setCategory] = useState('Cinematic')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [tags, setTags] = useState('')
  const [trending, setTrending] = useState(false)
  const [status, setStatus] = useState('published')
  const [scheduledAt, setScheduledAt] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  const [metaTitle, setMetaTitle] = useState('')
  const [metaDesc, setMetaDesc] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [secondaryKeywords, setSecondaryKeywords] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [robots, setRobots] = useState('Index')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDesc, setOgDesc] = useState('')
  const [generatingSeo, setGeneratingSeo] = useState(false)

  const [images, setImages] = useState([createImage()])
  const [schemaChecks, setSchemaChecks] = useState({
    Article: true,
    FAQPage: true,
    Breadcrumb: true,
    BlogPosting: false,
  })

  const clearFieldError = (key) =>
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })

  useEffect(() => {
    listCategories()
      .then(({ data }) => {
        const names = (data || []).map((c) => c.name)
        setCategoryOptions(names)
        if (!isEdit && names.length && !names.includes(category)) {
          setCategory(names[0])
        }
      })
      .catch(() => setCategoryOptions([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEdit) return

    let cancelled = false
    setLoading(true)
    getPromptById(id)
      .then(({ data }) => {
        if (cancelled) return
        setPromptId(data.id)
        setTitle(data.title || '')
        setSlug(data.slug || '')
        setSlugEdited(true)
        setPromptText(data.promptText || '')
        setDescription(data.description || data.excerpt || '')
        setAiModel(data.tool || 'ChatGPT')
        setCategory(data.category || 'Cinematic')
        setTags((data.tags || []).join(', '))
        setTrending(Boolean(data.trending))
        setStatus(data.status || 'published')
        setScheduledAt(toDatetimeLocal(data.scheduledAt))
        setMetaTitle(data.metaTitle || '')
        setMetaDesc(data.metaDesc || '')
        setFocusKeyword(data.focusKeyword || '')
        setSecondaryKeywords(data.secondaryKeywords || '')
        setCanonicalUrl(data.canonicalUrl || '')
        setRobots(data.robots || 'Index')
        setOgTitle(data.ogTitle || '')
        setOgDesc(data.ogDesc || '')
        setSchemaChecks(
          data.schemaChecks || {
            Article: true,
            FAQPage: true,
            Breadcrumb: true,
            BlogPosting: false,
          },
        )
        setImages(
          (data.images || []).length
            ? data.images.map((img, i) =>
                createImage({
                  id: `${data.id}-${i}`,
                  src: img.url,
                  altText: img.altText || '',
                  title: img.title || '',
                  filename: img.filename || '',
                  publicId: img.publicId || '',
                }),
              )
            : [
                createImage({
                  src: data.image || '',
                }),
              ],
        )
      })
      .catch((err) => {
        if (!cancelled) pushToast(err.message || 'Failed to load prompt', 'error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, isEdit, pushToast])

  useEffect(() => {
    if (!slugEdited) setSlug(slugify(title))
  }, [title, slugEdited])

  const featuredImage = images[0]?.src || ''
  const featuredAlt = images[0]?.altText || ''

  const seoScore = useMemo(
    () =>
      computeSeoScore({
        metaTitle,
        metaDesc,
        focusKeyword,
        slug,
        featuredAlt,
        aiModel,
        schemaChecks,
      }),
    [metaTitle, metaDesc, focusKeyword, slug, featuredAlt, aiModel, schemaChecks],
  )

  const addImage = () => setImages((imgs) => [...imgs, createImage()])

  const updateImage = (idKey, key, val) => {
    clearFieldError('images')
    setImages((imgs) =>
      imgs.map((im) => {
        if (im.id !== idKey) return im
        if (key === 'src') {
          return {
            ...im,
            src: val,
            publicId: val.startsWith('http') ? im.publicId || '' : im.publicId,
            filename:
              im.filename ||
              (val ? val.split('/').pop()?.split('?')[0] || '' : ''),
            uploading: false,
          }
        }
        return { ...im, [key]: val }
      }),
    )
  }

  const replaceImage = async (idKey, file) => {
    clearFieldError('images')
    const localUrl = URL.createObjectURL(file)
    setImages((imgs) =>
      imgs.map((im) => {
        if (im.id !== idKey) return im
        if (im.src?.startsWith('blob:')) URL.revokeObjectURL(im.src)
        return {
          ...im,
          src: localUrl,
          filename: im.filename || file.name,
          title: im.title || file.name.replace(/\.[^.]+$/, ''),
          uploading: true,
        }
      }),
    )

    try {
      const { data } = await uploadImage(file)
      setImages((imgs) =>
        imgs.map((im) => {
          if (im.id !== idKey) return im
          if (im.src?.startsWith('blob:')) URL.revokeObjectURL(im.src)
          return {
            ...im,
            src: data.url,
            publicId: data.publicId,
            filename: im.filename || data.filename || file.name,
            uploading: false,
          }
        }),
      )
      pushToast('Image uploaded')
    } catch (err) {
      setImages((imgs) =>
        imgs.map((im) => (im.id === idKey ? { ...im, uploading: false, src: '' } : im)),
      )
      setErrors((prev) => ({ ...prev, images: err.message || 'Upload failed' }))
      pushToast(err.message || 'Upload failed', 'error')
    }
  }

  const removeImage = (idKey) =>
    setImages((imgs) => {
      const target = imgs.find((im) => im.id === idKey)
      if (target?.src?.startsWith('blob:')) URL.revokeObjectURL(target.src)
      return imgs.filter((im) => im.id !== idKey)
    })

  const toggleSchema = (key) => setSchemaChecks((s) => ({ ...s, [key]: !s[key] }))

  const handleGenerateSeo = () => {
    setGeneratingSeo(true)
    setTimeout(() => {
      const trendPrefix = trending ? 'Trending ' : ''
      setFocusKeyword(`${trending ? 'trending ' : ''}${aiModel.toLowerCase()} prompt`)
      setMetaTitle(`${trendPrefix}${aiModel} Prompt: ${title} | Prompt Gallery`)
      setMetaDesc(
        `Copy this ${trending ? 'trending ' : ''}${aiModel} prompt for "${title}" — paste it straight into ${aiModel} and generate instantly.`,
      )
      setOgTitle(`${trendPrefix}${title} — ${aiModel} Prompt`)
      setOgDesc(
        `A ${trending ? 'trending ' : ''}${aiModel}-ready prompt: ${title}. Copy and generate in seconds.`,
      )
      setGeneratingSeo(false)
      pushToast(`SEO fields generated for ${aiModel}`)
    }, 900)
  }

  const scrollToFirstError = (fieldErrors) => {
    const order = ['promptText', 'title', 'slug', 'category', 'images']
    const first = order.find((k) => fieldErrors[k])
    if (!first) return
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-field="${first}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const handleSave = async () => {
    const fieldErrors = validateForm({ title, slug, promptText, category, images, status, scheduledAt })
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      pushToast('Fix the highlighted fields', 'error')
      scrollToFirstError(fieldErrors)
      return
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      promptText: promptText.trim(),
      description: description.trim(),
      excerpt: description.trim(),
      tool: aiModel,
      aiModel,
      category,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      trending,
      status,
      scheduledAt: status === 'scheduled' && scheduledAt ? new Date(scheduledAt).toISOString() : null,
      metaTitle,
      metaDesc,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl,
      robots,
      ogTitle,
      ogDesc,
      schemaChecks,
      images: images
        .filter((im) => im.src && !im.src.startsWith('blob:'))
        .map(({ src, altText, title: imgTitle, filename, publicId }) => ({
          url: src,
          src,
          altText,
          title: imgTitle,
          filename,
          publicId,
        })),
    }

    setSaving(true)
    setErrors({})

    try {
      if (promptId) {
        await updatePrompt(promptId, payload)
        pushToast('Changes saved successfully')
        addNotification({
          title: status === 'scheduled' ? 'Prompt Schedule Updated' : 'Prompt Updated',
          message: `Prompt "${title.trim()}" was updated successfully.`,
          type: status === 'scheduled' ? 'schedule' : 'create',
        })
        setTimeout(() => navigate('/'), 700)
      } else {
        await createPrompt(payload)
        pushToast('Created successfully')
        addNotification({
          title: status === 'scheduled' ? 'New Prompt Scheduled' : 'New Prompt Created',
          message:
            status === 'scheduled'
              ? `Prompt "${title.trim()}" is scheduled for auto-publishing.`
              : `Prompt "${title.trim()}" was posted and published.`,
          type: status === 'scheduled' ? 'schedule' : 'create',
        })
        setTimeout(() => navigate('/'), 900)
      }
    } catch (err) {
      const message = err.message || 'Save failed'
      const mapped = mapApiErrorToFields(message)
      setErrors(mapped.errors)
      pushToast(mapped.general || message, 'error')
      if (Object.keys(mapped.errors).length) scrollToFirstError(mapped.errors)
      setSaving(false)
    }
  }

  const seoTone = seoScore >= 80 ? 'green' : 'orange'
  const saveLabel = saving
    ? isEdit
      ? 'Saving changes…'
      : 'Creating prompt…'
    : isEdit
      ? 'Save Changes'
      : 'Create Prompt'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-[13px] text-mute">
        Loading prompt…
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <AdminHeader />

      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-4 shadow-[0_8px_30px_rgba(16,24,40,0.12)]">
            <Loader2 size={18} className="animate-spin-slow text-orange" />
            <div>
              <div className="text-[13px] font-semibold text-ink">
                {promptId ? 'Saving changes…' : 'Creating prompt…'}
              </div>
              <div className="text-[12px] text-mute">Please wait a moment</div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 sm:pt-6 md:pb-24 md:pl-20">
        {/* Top Header Row */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="m-0 text-2xl font-extrabold tracking-tight">
              {isEdit ? 'Edit Prompt' : 'Create New Prompt'}
            </h1>
            <Badge tone={seoTone}>SEO {seoScore}</Badge>
          </div>
          {title && (
            <p className="mt-1 text-xs text-mute truncate max-w-lg">
              Editing: <strong className="text-ink">{title}</strong>
            </p>
          )}
        </div>

        {/* 2-Column Editor Form Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="flex min-w-0 flex-col gap-3">
            <p className="m-0 px-0.5 text-[11px] font-semibold tracking-[0.06em] text-mute-light uppercase">
              Content
            </p>
            <div data-field="promptText">
              <PromptTextCard
                value={promptText}
                error={errors.promptText}
                onChange={(v) => {
                  clearFieldError('promptText')
                  setPromptText(v)
                }}
              />
            </div>
            <div data-field="description">
              <Card title="Description" description="Brief summary or creative guidance for this prompt.">
                <textarea
                  value={description}
                  onChange={(e) => {
                    clearFieldError('description')
                    setDescription(e.target.value)
                  }}
                  rows={3}
                  placeholder="Describe what this prompt generates or instructions for best output…"
                  className="w-full resize-y rounded-lg border border-border bg-surface-muted px-3.5 py-3 font-mono text-[13px] leading-[1.65] text-ink outline-none transition-[border-color,box-shadow] focus:border-orange focus:bg-surface focus:shadow-[0_0_0_3px_var(--color-orange-tint)]"
                />
                <div className="mt-2 flex items-center justify-between text-[11px] text-mute-light">
                  <span>Optional overview for gallery details</span>
                  <span>{description.length} characters</span>
                </div>
              </Card>
            </div>
            <div data-field="title">
              <TitleUrlCard
                title={title}
                setTitle={(v) => {
                  clearFieldError('title')
                  setTitle(v)
                }}
                slug={slug}
                setSlug={(v) => {
                  clearFieldError('slug')
                  setSlug(v)
                }}
                setSlugEdited={setSlugEdited}
                aiModel={aiModel}
                setAiModel={setAiModel}
                category={category}
                setCategory={(v) => {
                  clearFieldError('category')
                  setCategory(v)
                }}
                tags={tags}
                setTags={setTags}
                trending={trending}
                setTrending={setTrending}
                status={status}
                setStatus={setStatus}
                scheduledAt={scheduledAt}
                setScheduledAt={(v) => {
                  clearFieldError('scheduledAt')
                  setScheduledAt(v)
                }}
                errors={errors}
                categories={categoryOptions}
              />
            </div>
            <div data-field="images">
              <ImagesCard
                images={images}
                error={errors.images}
                onAdd={addImage}
                onUpdate={updateImage}
                onReplace={replaceImage}
                onRemove={removeImage}
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <p className="m-0 px-0.5 text-[11px] font-semibold tracking-[0.06em] text-mute-light uppercase">
              Discovery
            </p>
            <SeoCard
              seoScore={seoScore}
              metaTitle={metaTitle}
              setMetaTitle={setMetaTitle}
              metaDesc={metaDesc}
              setMetaDesc={setMetaDesc}
              focusKeyword={focusKeyword}
              setFocusKeyword={setFocusKeyword}
              secondaryKeywords={secondaryKeywords}
              setSecondaryKeywords={setSecondaryKeywords}
              canonicalUrl={canonicalUrl}
              setCanonicalUrl={setCanonicalUrl}
              robots={robots}
              setRobots={setRobots}
              ogTitle={ogTitle}
              setOgTitle={setOgTitle}
              ogDesc={ogDesc}
              setOgDesc={setOgDesc}
              featuredAlt={featuredAlt}
              aiModel={aiModel}
              schemaChecks={schemaChecks}
              generatingSeo={generatingSeo}
              onGenerateSeo={handleGenerateSeo}
            />
            <SchemaCard
              schemaChecks={schemaChecks}
              onToggle={toggleSchema}
              onGenerate={() => pushToast('JSON-LD schema generated')}
            />
            <SeoPreviewCard
              slug={slug}
              metaTitle={metaTitle}
              metaDesc={metaDesc}
              ogTitle={ogTitle}
              ogDesc={ogDesc}
              featuredImage={featuredImage}
            />
          </div>
        </div>

        {/* Bottom Action Footer Bar */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Badge tone={seoTone}>SEO Score {seoScore}/100</Badge>
            <span className="hidden text-xs text-mute sm:inline">
              {saving ? 'Saving prompt details...' : 'Review your content and click Save when ready.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-xs font-bold text-mute transition-colors hover:bg-surface-subtle hover:text-ink"
            >
              <Eye size={15} />
              Preview
            </button>
            <Link
              to="/"
              className={`inline-flex items-center justify-center rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-xs font-bold text-mute no-underline transition-colors hover:bg-surface-subtle hover:text-ink ${
                saving ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-xs font-bold text-white shadow-[0_3px_12px_rgba(255,122,0,0.35)] transition-all hover:bg-orange-dark hover:shadow-[0_4px_16px_rgba(255,122,0,0.45)] disabled:opacity-60 active:scale-[0.98]"
            >
              {saving ? <Loader2 size={16} className="animate-spin-slow" /> : <Save size={16} />}
              <span>{saveLabel}</span>
            </button>
          </div>
        </div>
      </div>

      <PromptPreviewModal
        prompt={{
          title: title || 'Untitled Prompt',
          slug: slug || 'untitled',
          promptText,
          tool: aiModel,
          category,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          trending,
          status,
          scheduledAt,
          images: images
            .filter((im) => im.src && !im.src.startsWith('blob:'))
            .map(({ src, altText }) => ({ url: src, altText })),
          excerpt: promptText.slice(0, 140),
        }}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      <Toast toasts={toasts} />
    </div>
  )
}
