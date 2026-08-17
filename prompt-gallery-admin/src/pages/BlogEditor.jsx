import { FaqBuilderCard } from '../components/FaqBuilderCard'
import { DateTimePicker } from '../components/ui/DateTimePicker'
import { Select } from '../components/ui/Select'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Loader2, ChevronDown } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader'
import { getBlogBySlug, createBlog, updateBlog, uploadImage, listCategories } from '../api/client'
import { useToast } from '../hooks/useToast'

function ShadcnCard({ title, description, children }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-none space-y-4">
      {title && (
        <div className="border-b border-zinc-800/80 pb-3">
          <h3 className="text-base font-semibold text-zinc-50 tracking-tight">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-zinc-400">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default function BlogEditor() {
  const { slug: paramSlug } = useParams()
  const isEdit = Boolean(paramSlug)
  const navigate = useNavigate()
  const { pushToast } = useToast()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [blogId, setBlogId] = useState(null)

  // Form Fields matching all 17 snapshot fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [author, setAuthor] = useState('Prompt Gallery Team')
  const [factCheckBy, setFactCheckBy] = useState('')
  const [category, setCategory] = useState('Generative AI')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [coverImage, setCoverImage] = useState('')
  const [imageAltText, setImageAltText] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [h1, setH1] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDesc, setMetaDesc] = useState('')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDesc, setOgDesc] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isPopular, setIsPopular] = useState(false)
  const [status, setStatus] = useState('published')
  const [scheduledAt, setScheduledAt] = useState('')
  const [faqs, setFaqs] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)

  const slugify = (str) =>
    String(str || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  useEffect(() => {
    listCategories()
      .then(({ data }) => {
        const names = (data || []).map((c) => c.name)
        if (names.length) {
          setCategoryOptions(names)
          if (!isEdit) setCategory(names[0])
        }
      })
      .catch(() => setCategoryOptions(['Generative AI', 'Midjourney', 'ChatGPT', 'Prompt Engineering', 'AI Art']))
  }, [isEdit])

  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(slugify(title))
    }
  }, [title, slugEdited])

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    getBlogBySlug(paramSlug)
      .then(({ data }) => {
        if (data) {
          setBlogId(data._id || data.id)
          setTitle(data.title || '')
          setSlug(data.slug || '')
          setSlugEdited(true)
          setAuthor(data.author || 'Prompt Gallery Team')
          setFactCheckBy(data.factCheckBy || '')
          setCategory(data.category || 'Generative AI')
          setCoverImage(data.coverImage || '')
          setImageAltText(data.imageAltText || '')
          setDescription(data.description || '')
          setShortDescription(data.shortDescription || '')
          setH1(data.h1 || '')
          setMetaTitle(data.metaTitle || '')
          setMetaDesc(data.metaDesc || '')
          setOgTitle(data.ogTitle || '')
          setOgDesc(data.ogDesc || '')
          setKeywords(Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords || '')
          setIsPopular(Boolean(data.isPopular))
          setStatus(data.status || 'published')
          if (data.scheduledAt) setScheduledAt(data.scheduledAt)
          if (data.faqs) setFaqs(data.faqs)
        }
      })
      .catch((err) => pushToast(err.message || 'Failed to load blog post', 'error'))
      .finally(() => setLoading(false))
  }, [paramSlug, isEdit, pushToast])

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const { data } = await uploadImage(file)
      setCoverImage(data.url)
      if (!imageAltText) setImageAltText(file.name.replace(/\.[^.]+$/, ''))
      pushToast('Cover image uploaded')
    } catch (err) {
      pushToast(err.message || 'Image upload failed', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const insertTag = (openTag, closeTag = '') => {
    setDescription((prev) => prev + openTag + closeTag)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      pushToast('Title is required', 'error')
      return
    }
    if (!description.trim()) {
      pushToast('Description content is required', 'error')
      return
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      author: author.trim(),
      factCheckBy: factCheckBy.trim(),
      category: category.trim(),
      coverImage: coverImage.trim(),
      imageAltText: imageAltText.trim(),
      description: description.trim(),
      shortDescription: shortDescription.trim() || title.trim(),
      h1: h1.trim() || title.trim(),
      metaTitle: metaTitle.trim() || title.trim(),
      metaDesc: metaDesc.trim() || shortDescription.trim() || title.trim(),
      ogTitle: ogTitle.trim() || metaTitle.trim() || title.trim(),
      ogDesc: ogDesc.trim() || metaDesc.trim() || '',
      keywords: keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      isPopular,
      status,
      scheduledAt: status === 'scheduled' ? scheduledAt : '',
    }

    setSaving(true)
    try {
      if (isEdit && blogId) {
        await updateBlog(blogId, payload)
        pushToast('Blog article updated successfully')
      } else {
        await createBlog(payload)
        pushToast('Blog article published successfully')
      }
      setTimeout(() => navigate('/blogs'), 800)
    } catch (err) {
      pushToast(err.message || 'Failed to save blog post', 'error')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-xs text-zinc-400">
        Loading blog editor...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <AdminHeader />

      <div className="mx-auto max-w-[1100px] px-4 pt-5 pb-28 sm:px-6 sm:pt-6 md:pb-24 md:pl-20">
        {/* Top Header & Actions */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/blogs"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
                {isEdit ? 'Edit Blog Post' : 'Create Blog Post'}
              </h1>
              <p className="text-xs text-zinc-400">Fill in article details, rich content, and SEO metadata</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={status}
              onChange={setStatus}
              options={[
                { label: 'Publish Now', value: 'published' },
                { label: 'Save as Draft', value: 'draft' },
                { label: 'Schedule Post', value: 'scheduled' },
              ]}
              className="w-44 sm:w-48"
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-orange px-4 text-xs font-semibold text-white hover:bg-orange-dark transition-colors cursor-pointer border-none disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{status === 'published' ? 'Publish' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        {/* Schedule Post Date & Time Picker */}
        {status === 'scheduled' && (
          <div className="mb-6 rounded-lg border border-purple-800/60 bg-purple-950/40 p-4 shadow-none">
            <DateTimePicker
              value={scheduledAt}
              onChange={setScheduledAt}
            />
          </div>
        )}

        {/* 17 Fields Form matching exact snapshot order using shadcn UI */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Author & Classification */}
          <ShadcnCard title="Author Information">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Author ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Select or enter Author"
                className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
              />
            </div>
          </ShadcnCard>

          {/* Card 2: Article Title & Slug */}
          <ShadcnCard title="Article Title & Slug">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter main article title..."
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-semibold text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{title.length} characters</div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Slug <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true)
                    setSlug(e.target.value)
                  }}
                  placeholder="url-friendly-article-slug"
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
              </div>
            </div>
          </ShadcnCard>

          {/* Card 3: Cover Image & Alt Text */}
          <ShadcnCard title="Cover Image & Alt Text" description="Recommended dimensions: 1250x650px">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">Cover Image (1250x650)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-zinc-400 file:mr-3 file:rounded-md file:border file:border-zinc-800 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-200 cursor-pointer"
                  />
                  {uploadingImage && <Loader2 size={16} className="animate-spin text-zinc-400" />}
                </div>
                {coverImage && (
                  <div className="mt-3 relative max-w-sm rounded-md overflow-hidden border border-zinc-800">
                    <img src={coverImage} alt="Cover Preview" className="w-full h-36 object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">Image Alternative Text</label>
                <input
                  type="text"
                  value={imageAltText}
                  onChange={(e) => setImageAltText(e.target.value)}
                  placeholder="Descriptive alt text for SEO & accessibility..."
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{imageAltText.length} characters</div>
              </div>
            </div>
          </ShadcnCard>

          {/* Card 4: Rich Description Content */}
          <ShadcnCard title="Description *" description="Main body content of the blog post with rich HTML formatting">
            <div className="rounded-md border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              <div className="flex flex-wrap items-center gap-1 border-b border-zinc-800 bg-zinc-900/60 p-2 text-xs">
                <button
                  type="button"
                  onClick={() => insertTag('<b>', '</b>')}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('<i>', '</i>')}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 italic text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('<h2>', '</h2>')}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 font-bold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('<h3>', '</h3>')}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 font-bold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('<p>', '</p>')}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  Paragraph
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('<a href="#">', '</a>')}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  Link
                </button>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={12}
                placeholder="Write or paste your article content here in rich HTML/text..."
                className="w-full resize-y bg-transparent p-3.5 font-mono text-xs leading-relaxed text-zinc-100 placeholder:text-zinc-500 outline-none"
              />
              <div className="border-t border-zinc-800 px-3.5 py-2 text-[11px] text-zinc-500 flex justify-between">
                <span>Supports HTML tags (&lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;b&gt;, &lt;img&gt;)</span>
                <span>{description.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          </ShadcnCard>

          {/* Card 5: Short Description & H1 */}
          <ShadcnCard title="Short Description & Page H1">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Short Description <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief 1-2 sentence excerpt shown on blog listing cards..."
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{shortDescription.length} characters</div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  H1 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={h1}
                  onChange={(e) => setH1(e.target.value)}
                  placeholder="Main H1 headline tag for the article page..."
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{h1.length} characters</div>
              </div>
            </div>
          </ShadcnCard>

          {/* Card 6: SEO Metadata (Meta Title & Meta Description) */}
          <ShadcnCard title="SEO Meta Tags">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Meta Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Search engine meta title tag..."
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{metaTitle.length} characters</div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Meta Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  rows={3}
                  placeholder="Search engine meta description snippet..."
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{metaDesc.length} characters</div>
              </div>
            </div>
          </ShadcnCard>

          {/* Card 7: Open Graph Metadata (Og Title & Og Description) */}
          <ShadcnCard title="Social OpenGraph Metadata">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Og Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="Social media share title..."
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{ogTitle.length} characters</div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Og Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={ogDesc}
                  onChange={(e) => setOgDesc(e.target.value)}
                  rows={3}
                  placeholder="Social media share description..."
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{ogDesc.length} characters</div>
              </div>
            </div>
          </ShadcnCard>

          {/* Card 8: Keywords & Is Popular */}
          <ShadcnCard title="Search Keywords & Feature Settings">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Keywords <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords separated by commas (e.g. ChatGPT, Prompts, AI Guide)"
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-zinc-100 focus:ring-zinc-700 cursor-pointer"
                />
                <label htmlFor="isPopular" className="text-xs font-medium text-zinc-200 cursor-pointer">
                  Is Popular (Feature on Popular articles grid)
                </label>
              </div>
            </div>
          </ShadcnCard>

          {/* Card 9: FAQs Builder */}
          <FaqBuilderCard faqs={faqs} onChange={setFaqs} />
        </div>
      </div>
    </div>
  )
}
