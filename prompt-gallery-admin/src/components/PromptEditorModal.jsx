import { useEffect, useMemo, useState } from 'react'
import { Loader2, Save, Sparkles, X } from 'lucide-react'
import { PromptTextCard } from './PromptTextCard'
import { TitleUrlCard } from './TitleUrlCard'
import { ImagesCard } from './ImagesCard'
import { SchemaCard } from './SchemaCard'
import { SeoCard } from './SeoCard'
import { SeoPreviewCard } from './SeoPreviewCard'
import { Badge } from './ui/Badge'
import { Toast } from './ui/Toast'
import { useToast } from '../hooks/useToast'
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

function validateForm({ title, slug, promptText, category, images }) {
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

export function PromptEditorModal({ open, promptId = null, onClose, onSuccess }) {
  const isEdit = Boolean(promptId)
  const { toasts, pushToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [aiModel, setAiModel] = useState('ChatGPT')
  const [category, setCategory] = useState('Cinematic')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [tags, setTags] = useState('')
  const [trending, setTrending] = useState(false)
  const [status, setStatus] = useState('published')

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

  // Reset or load prompt data when modal opens
  useEffect(() => {
    if (!open) return

    setErrors({})
    listCategories()
      .then(({ data }) => {
        const names = (data || []).map((c) => c.name)
        setCategoryOptions(names)
        if (!isEdit && names.length && !names.includes(category)) {
          setCategory(names[0])
        }
      })
      .catch(() => setCategoryOptions([]))

    if (!isEdit) {
      setTitle('')
      setSlug('')
      setSlugEdited(false)
      setPromptText('')
      setAiModel('ChatGPT')
      setCategory('Cinematic')
      setTags('')
      setTrending(false)
      setStatus('published')
      setMetaTitle('')
      setMetaDesc('')
      setFocusKeyword('')
      setSecondaryKeywords('')
      setCanonicalUrl('')
      setRobots('Index')
      setOgTitle('')
      setOgDesc('')
      setImages([createImage()])
      setSchemaChecks({ Article: true, FAQPage: true, Breadcrumb: true, BlogPosting: false })
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    getPromptById(promptId)
      .then(({ data }) => {
        if (cancelled) return
        setTitle(data.title || '')
        setSlug(data.slug || '')
        setSlugEdited(true)
        setPromptText(data.promptText || '')
        setAiModel(data.tool || 'ChatGPT')
        setCategory(data.category || 'Cinematic')
        setTags((data.tags || []).join(', '))
        setTrending(Boolean(data.trending))
        setStatus(data.status || 'published')
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
  }, [open, promptId, isEdit, pushToast])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !saving) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, saving, onClose])

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
    const fieldErrors = validateForm({ title, slug, promptText, category, images })
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
      tool: aiModel,
      aiModel,
      category,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      trending,
      status,
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
        pushToast('Prompt updated successfully')
      } else {
        await createPrompt(payload)
        pushToast('Prompt created successfully')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      const message = err.message || 'Save failed'
      const mapped = mapApiErrorToFields(message)
      setErrors(mapped.errors)
      pushToast(mapped.general || message, 'error')
      if (Object.keys(mapped.errors).length) scrollToFirstError(mapped.errors)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const seoTone = seoScore >= 80 ? 'green' : 'orange'
  const saveLabel = saving
    ? isEdit
      ? 'Saving…'
      : 'Creating…'
    : isEdit
      ? 'Save Changes'
      : 'Create Prompt'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-6">
      <div
        className="relative mx-auto my-2 w-full max-w-[1240px] overflow-hidden rounded-2xl border border-border bg-bg shadow-2xl transition-all sm:my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header inside Modal */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-header/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-tint text-orange-dark">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-mute-light">
                  {isEdit ? 'Edit Prompt' : 'Create New Prompt'}
                </span>
                <Badge tone={seoTone}>SEO {seoScore}</Badge>
              </div>
              <h2 className="m-0 truncate text-sm font-bold text-ink sm:text-base">
                {title || (isEdit ? 'Edit Prompt' : 'Untitled prompt')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex h-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface px-3 text-xs font-bold text-mute transition-colors hover:bg-surface-muted hover:text-ink disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border-none bg-orange px-4 py-2.5 text-xs font-bold text-white shadow-[0_2px_8px_rgba(255,122,0,0.35)] transition-all hover:bg-orange-dark disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin-slow" /> : <Save size={15} />}
              <span>{saveLabel}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label="Close modal"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-mute hover:bg-surface-muted hover:text-ink disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex py-20 items-center justify-center text-xs text-mute font-semibold">
              <Loader2 size={18} className="animate-spin-slow text-orange mr-2" /> Loading prompt details...
            </div>
          ) : (
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
          )}
        </div>
      </div>
      <Toast toasts={toasts} />
    </div>
  )
}
