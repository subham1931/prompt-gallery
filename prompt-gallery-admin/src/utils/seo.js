export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function scoreColor(score) {
  if (score >= 80) return 'var(--color-green)'
  if (score >= 50) return 'var(--color-orange-dark)'
  return 'var(--color-red)'
}

export function computeSeoScore({
  metaTitle = '',
  metaDesc = '',
  focusKeyword = '',
  slug = '',
  featuredAlt = '',
  aiModel = '',
  schemaChecks = {},
} = {}) {
  const mTitle = String(metaTitle || '')
  const mDesc = String(metaDesc || '')
  const fKeyword = String(focusKeyword || '')
  const sSlug = String(slug || '')
  const fAlt = String(featuredAlt || '')
  const aModel = String(aiModel || '')
  const sChecks = schemaChecks || {}

  let score = 0

  if (mTitle.length >= 40 && mTitle.length <= 60) score += 20
  else if (mTitle.length > 0) score += 10

  if (mDesc.length >= 120 && mDesc.length <= 160) score += 20
  else if (mDesc.length > 0) score += 10

  if (fKeyword && mTitle.toLowerCase().includes(fKeyword.toLowerCase())) score += 12
  if (fKeyword && mDesc.toLowerCase().includes(fKeyword.toLowerCase())) score += 8
  if (sSlug && fKeyword && sSlug.includes(fKeyword.split(' ')[0])) score += 8
  if (fAlt.length > 5) score += 10
  if (aModel && mTitle.toLowerCase().includes(aModel.toLowerCase())) score += 12
  if (sChecks.Article && !sChecks.BlogPosting) score += 5
  if (sChecks.FAQPage) score += 5

  return Math.min(score, 100)
}

export function buildSeoChecklist({
  metaTitle = '',
  metaDesc = '',
  focusKeyword = '',
  featuredAlt = '',
  aiModel = '',
  schemaChecks = {},
} = {}) {
  const mTitle = String(metaTitle || '')
  const mDesc = String(metaDesc || '')
  const fKeyword = String(focusKeyword || '')
  const fAlt = String(featuredAlt || '')
  const aModel = String(aiModel || '')
  const sChecks = schemaChecks || {}

  return [
    {
      ok: mTitle.length >= 40 && mTitle.length <= 60,
      label: 'Meta title is 40-60 characters',
    },
    {
      ok: mDesc.length >= 120 && mDesc.length <= 160,
      label: 'Meta description is 120-160 characters',
    },
    {
      ok: Boolean(aModel && mTitle.toLowerCase().includes(aModel.toLowerCase())),
      label: `Title mentions "${aModel || 'AI Model'}"`,
    },
    {
      ok: !!fKeyword && mTitle.toLowerCase().includes(fKeyword.toLowerCase()),
      label: 'Focus keyword appears in the title',
    },
    {
      ok: fAlt.length > 5,
      label: 'Featured image has alt text',
    },
    {
      ok: Boolean(sChecks.FAQPage),
      label: 'FAQPage schema enabled (rich snippet)',
    },
    {
      ok: Boolean(sChecks.Article && !sChecks.BlogPosting),
      label: 'Article schema only (no duplicate BlogPosting)',
    },
  ]
}

export const AI_MODELS = ['ChatGPT', 'Gemini', 'Midjourney']
export const SCHEMAS = ['Article', 'FAQPage', 'Breadcrumb', 'BlogPosting']
export const CATEGORIES = [
  'Portraits',
  'Fashion & Editorial',
  'Photography',
  'Cinematic',
  'Lifestyle',
  'Digital Art',
  'Men',
  'Woman',
  'Business & Professional',
  'Black & White',
  'Couple',
  'Family',
  'Birthday',
  'Nature',
  'Vintage',
]
