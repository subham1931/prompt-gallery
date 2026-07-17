import { useEffect, useMemo, useState } from 'react'
import { TopBar } from '../components/TopBar'
import { PromptTextCard } from '../components/PromptTextCard'
import { TitleUrlCard } from '../components/TitleUrlCard'
import { ImagesCard } from '../components/ImagesCard'
import { SchemaCard } from '../components/SchemaCard'
import { SeoCard } from '../components/SeoCard'
import { SeoPreviewCard } from '../components/SeoPreviewCard'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { computeSeoScore, slugify } from '../utils/seo'

function createImage(overrides = {}) {
  return {
    id: Date.now() + Math.random(),
    src: '',
    altText: '',
    title: '',
    filename: '',
    file: null,
    ...overrides,
  }
}

const INITIAL_TITLE = 'Cinematic Portrait with Dramatic Lighting'

export default function PromptEditor() {
  const { toasts, pushToast } = useToast()

  const [title, setTitle] = useState(INITIAL_TITLE)
  const [slug, setSlug] = useState(slugify(INITIAL_TITLE))
  const [slugEdited, setSlugEdited] = useState(false)
  const [promptText, setPromptText] = useState(
    'Cinematic portrait of a young woman, dramatic side lighting, deep shadows, Rembrandt lighting, 85mm lens, shallow depth of field, film grain, moody color grade --ar 4:5',
  )
  const [aiModel, setAiModel] = useState('ChatGPT')
  const [category, setCategory] = useState('Cinematic')
  const [tags, setTags] = useState('Portraits, Cinematic, Dramatic Lighting')
  const [trending, setTrending] = useState(true)

  const [metaTitle, setMetaTitle] = useState(
    'Cinematic Portrait with Dramatic Lighting Prompt | Prompt Gallery',
  )
  const [metaDesc, setMetaDesc] = useState(
    'Copy this AI prompt for cinematic dramatic-lighting portraits, tuned for Midjourney, Flux and ChatGPT image generation.',
  )
  const [focusKeyword, setFocusKeyword] = useState('cinematic portrait prompt')
  const [secondaryKeywords, setSecondaryKeywords] = useState(
    'dramatic lighting prompt, moody portrait ai',
  )
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [robots, setRobots] = useState('Index')
  const [ogTitle, setOgTitle] = useState('Cinematic Portrait with Dramatic Lighting')
  const [ogDesc, setOgDesc] = useState(
    'A moody, editorial-style portrait prompt built around hard directional light and deep shadow.',
  )
  const [generatingSeo, setGeneratingSeo] = useState(false)

  const [images, setImages] = useState([
    createImage({
      id: 1,
      src: 'https://picsum.photos/seed/promptartify1/800/1000',
      altText: 'Cinematic portrait with dramatic side lighting',
      title: 'Cinematic Portrait Dramatic Lighting',
      filename: 'cinematic-portrait-dramatic-lighting.jpg',
    }),
  ])

  const [schemaChecks, setSchemaChecks] = useState({
    Article: true,
    FAQPage: true,
    Breadcrumb: true,
    BlogPosting: false,
  })

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

  const updateImage = (id, key, val) =>
    setImages((imgs) => imgs.map((im) => (im.id === id ? { ...im, [key]: val } : im)))

  const replaceImage = (id, file) => {
    const url = URL.createObjectURL(file)
    setImages((imgs) =>
      imgs.map((im) => {
        if (im.id !== id) return im
        if (im.src?.startsWith('blob:')) URL.revokeObjectURL(im.src)
        return {
          ...im,
          src: url,
          file,
          filename: im.filename || file.name,
          title: im.title || file.name.replace(/\.[^.]+$/, ''),
        }
      }),
    )
  }

  const removeImage = (id) =>
    setImages((imgs) => {
      const target = imgs.find((im) => im.id === id)
      if (target?.src?.startsWith('blob:')) URL.revokeObjectURL(target.src)
      return imgs.filter((im) => im.id !== id)
    })

  const toggleSchema = (key) =>
    setSchemaChecks((s) => ({ ...s, [key]: !s[key] }))

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

  const handleSave = () => {
    const payload = {
      title,
      slug,
      promptText,
      aiModel,
      category,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      trending,
      metaTitle,
      metaDesc,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl,
      robots,
      ogTitle,
      ogDesc,
      schemaChecks,
      images: images.map(({ id, src, altText, title: imgTitle, filename }) => ({
        id,
        src,
        altText,
        title: imgTitle,
        filename,
      })),
    }
    console.log('Prompt payload', payload)
    pushToast('Changes saved')
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <TopBar title={title} seoScore={seoScore} onSave={handleSave} />

      <div className="mx-auto max-w-[1180px] px-6 pt-6 pb-24">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          {/* Content */}
          <div className="flex min-w-0 flex-col gap-3">
            <p className="m-0 px-0.5 text-[11px] font-semibold tracking-[0.06em] text-mute-light uppercase">
              Content
            </p>
            <PromptTextCard value={promptText} onChange={setPromptText} />
            <TitleUrlCard
              title={title}
              setTitle={setTitle}
              slug={slug}
              setSlug={setSlug}
              setSlugEdited={setSlugEdited}
              aiModel={aiModel}
              setAiModel={setAiModel}
              category={category}
              setCategory={setCategory}
              tags={tags}
              setTags={setTags}
              trending={trending}
              setTrending={setTrending}
            />
            <ImagesCard
              images={images}
              onAdd={addImage}
              onUpdate={updateImage}
              onReplace={replaceImage}
              onRemove={removeImage}
            />
          </div>

          {/* Discovery */}
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
      </div>

      <Toast toasts={toasts} />
    </div>
  )
}
